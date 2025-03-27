import { useEffect } from '@lynx-js/react'
import { MainApp } from './MainApp'

export function App() {
  useEffect(() => {
    console.info('Circle Search App Initialized')
  }, [])

  return <MainApp />
}
