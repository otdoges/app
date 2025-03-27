import { useEffect } from '@lynx-js/react'
import { MainApp } from './MainApp.jsx'

export function App() {
  useEffect(() => {
    console.info('Circle Search App Initialized')
  }, [])

  return <MainApp />
} 