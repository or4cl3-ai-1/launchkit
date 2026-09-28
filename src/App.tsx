import { useEffect, useState } from 'react'
import { useKV } from '@/lib/standalone'
import { LandingPage } from './components/LandingPage'
import { MainApp } from './components/MainApp'
import { Toaster } from './components/ui/sonner'
import { toast } from 'sonner'
import { getPack, usePurchases } from './lib/packs'
import type { ProjectData } from './lib/types'

function App() {
  const [hasStarted, setHasStarted] = useState(false)
  const [currentProject, setCurrentProject] = useKV<ProjectData | null>('current-project', null)
  const { addPurchase } = usePurchases()

  // Stripe Payment Links redirect here after payment: ?purchased=<pack-id>
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const boughtId = params.get('purchased')
    const pack = getPack(boughtId)
    if (pack) {
      addPurchase(pack.id)
      toast.success(`${pack.name} Pack unlocked — your pack exports are now available.`)
      window.history.replaceState({}, '', window.location.pathname)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {!hasStarted ? (
        <LandingPage onStart={() => setHasStarted(true)} />
      ) : (
        <MainApp
          currentProject={currentProject}
          onProjectChange={(proj) => setCurrentProject(proj)}
          onReset={() => {
            setHasStarted(false)
            setCurrentProject(null)
          }}
        />
      )}
      
      <Toaster />
    </>
  )
}

export default App
