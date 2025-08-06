import { useRouter } from 'next/navigation'
import { useCallback, useState } from 'react'

/**
 * Hook personnalisé pour la navigation avec état de chargement
 */
export function useNavigation() {
  const router = useRouter()

  const navigate = useCallback((path: string) => {
    router.push(path)
  }, [router])

  const goBack = useCallback(() => {
    router.back()
  }, [router])

  return {
    navigate,
    goBack,
    router,
  }
}

/**
 * Hook pour gérer l'état local et la persistance
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }
    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value
      setStoredValue(valueToStore)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore))
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error)
    }
  }, [key, storedValue])

  return [storedValue, setValue] as const
}
