import React from 'react'
import { useElementSize } from './useElementSize'

const useScrollFieldSize = (
  containerRef: React.RefObject<HTMLElement>,
  innerRef: React.RefObject<HTMLElement>
) => {
  const [containerSize] = useElementSize(containerRef)
  const [_, innerSize] = useElementSize(innerRef)

  return [containerSize, innerSize] as const
}

export { useScrollFieldSize }
