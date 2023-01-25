import React from 'react'
import { useElementSize } from './useElementSize'

const useScrollFieldSize = (containerRef: React.RefObject<HTMLElement>) => {
  const containerSize = useElementSize(containerRef)[0].clientSize
  const innerSize = useElementSize(containerRef)[0].scrollSize

  return [containerSize, innerSize] as const
}

export { useScrollFieldSize }
