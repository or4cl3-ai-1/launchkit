import { useState } from 'react'
import { useKV } from '@github/spark/hooks'
import { LandingPage } from './components/LandingPage'
import { MainApp } from './components/MainApp'
import { Toaster } from './components/ui/sonner'
import type { ProjectData } from './lib/types'

function App() {
  const [hasStarted, setHasStarted] = useState(false)
  const [currentProject, setCurrentProject] = useKV<ProjectData | null>('current-project', null)

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
