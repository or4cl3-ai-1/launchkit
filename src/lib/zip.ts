/**
 * Minimal ZIP writer (STORE method, no compression, no dependencies).
 * Kept dependency-free on purpose: the pack is text, and a stored
 * ZIP is byte-exact and readable by every unzip tool. Filenames are
 * the fixed pack filenames, so no path-traversal risk.
 */

export interface ZipEntry {
  filename: string
  content: string
}

const CRC_TABLE: Uint32Array = (() => {
  const table = new Uint32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1
    }
    table[n] = c >>> 0
  }
  return table
})()

export function crc32(data: Uint8Array): number {
  let crc = 0xffffffff
  for (let i = 0; i < data.length; i++) {
    crc = CRC_TABLE[(crc ^ data[i]) & 0xff] ^ (crc >>> 8)
  }
  return (crc ^ 0xffffffff) >>> 0
}

export function createZipBlob(entries: ZipEntry[]): Blob {
  const encoder = new TextEncoder()
  const chunks: Uint8Array[] = []
  const central: Uint8Array[] = []
  let offset = 0

  const push = (bytes: Uint8Array) => {
    chunks.push(bytes)
    offset += bytes.length
  }
  const u16 = (n: number) => {
    const b = new Uint8Array(2)
    new DataView(b.buffer).setUint16(0, n, true)
    return b
  }
  const u32 = (n: number) => {
    const b = new Uint8Array(4)
    new DataView(b.buffer).setUint32(0, n >>> 0, true)
    return b
  }
  const concat = (...parts: Uint8Array[]) => {
    const out = new Uint8Array(parts.reduce((s, p) => s + p.length, 0))
    let at = 0
    for (const p of parts) {
      out.set(p, at)
      at += p.length
    }
    return out
  }

  for (const entry of entries) {
    const name = encoder.encode(entry.filename)
    const data = encoder.encode(entry.content)
    const crc = crc32(data)
    const localOffset = offset

    push(
      concat(
        u32(0x04034b50), // local file header signature
        u16(20), // version needed
        u16(0x0800), // flags: UTF-8 filenames
        u16(0), // method: STORE
        u16(0), // mod time
        u16(0), // mod date
        u32(crc),
        u32(data.length),
        u32(data.length),
        u16(name.length),
        u16(0), // extra field length
        name,
        data,
      ),
    )

    central.push(
      concat(
        u32(0x02014b50), // central directory signature
        u16(20), // version made by
        u16(20), // version needed
        u16(0x0800),
        u16(0),
        u16(0),
        u16(0),
        u32(crc),
        u32(data.length),
        u32(data.length),
        u16(name.length),
        u16(0),
        u16(0), // comment length
        u16(0), // disk number
        u16(0), // internal attributes
        u32(0), // external attributes
        u32(localOffset),
        name,
      ),
    )
  }

  const centralOffset = offset
  for (const c of central) push(c)
  const centralSize = offset - centralOffset

  push(
    concat(
      u32(0x06054b50), // end of central directory
      u16(0),
      u16(0),
      u16(entries.length),
      u16(entries.length),
      u32(centralSize),
      u32(centralOffset),
      u16(0), // comment length
    ),
  )

  return new Blob(chunks as BlobPart[], { type: 'application/zip' })
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
