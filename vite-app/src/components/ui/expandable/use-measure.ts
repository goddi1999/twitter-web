import { useCallback, useRef, useState } from 'react'

/** Callback ref + border-box size via ResizeObserver (stand-in for react-use-measure). */
export function useMeasure<T extends HTMLElement = HTMLDivElement>() {
  const [size, setSize] = useState({ width: 0, height: 0 })
  const observer = useRef<ResizeObserver | null>(null)

  const ref = useCallback((node: T | null) => {
    observer.current?.disconnect()
    observer.current = null
    if (!node) return
    const update = () => {
      const rect = node.getBoundingClientRect()
      setSize((prev) =>
        prev.width === rect.width && prev.height === rect.height ? prev : { width: rect.width, height: rect.height },
      )
    }
    update()
    observer.current = new ResizeObserver(update)
    observer.current.observe(node)
  }, [])

  return [ref, size] as const
}
