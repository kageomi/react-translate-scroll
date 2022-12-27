import { useCallback } from 'react'

type Position = {
  top: number
  left: number
}

const useTranslate = (ref: React.RefObject<HTMLElement>) => {
  const setTranslate = useCallback((position: Position) => {
    const innerBoxElm = ref.current
    if (innerBoxElm == null) return
    const { top, left } = position
    innerBoxElm.style.transform = `translate(${left}px,${top}px)`
  }, [])

  return [setTranslate] as const
}

export { useTranslate }
