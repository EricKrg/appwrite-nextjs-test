import { useEffect, useState } from 'react'

const useLocalStorage = (key: any, initialValue: any): string => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key)
      return item !== null ? JSON.parse(item) : initialValue
    } catch (error) {
      console.log(error)
      return initialValue
    }
  })

  const setValue = (value: any): any => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value

      setStoredValue(valueToStore)

      window.localStorage.setItem(key, JSON.stringify(valueToStore))
    } catch (error) {
      console.log(error)
    }
  }
  return [storedValue, setValue] as any
}

const useDarkMode = (): any => {
  const [enabled, setEnabled] = useLocalStorage('dark-theme', undefined) as any
  const isEnabled: boolean = enabled

  console.log('dark', enabled)
  useEffect(() => {
    const className = 'dark'
    const bodyClass = window.document.body.classList

    isEnabled ? bodyClass.add(className) : bodyClass.remove(className)
  }, [enabled, isEnabled])

  return [enabled, setEnabled]
}

export default useDarkMode
