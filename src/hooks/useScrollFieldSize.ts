import React from 'react'
import { useElementSize } from './useElementSize'

const useScrollFieldSize = (
  containerRef: React.RefObject<HTMLElement>,
  innerRef: React.RefObject<HTMLElement>
) => {
  const containerSize = useElementSize(containerRef)[0].clientSize
  const innerBoxElm = innerRef.current
  if (innerBoxElm != null) {
    innerBoxElm.style.overflowX = 'auto'
    innerBoxElm.style.overflowY = 'hidden'
  }
  const innerSize = useElementSize(innerRef)[0].scrollSize
  if (innerBoxElm != null) {
    innerBoxElm.style.overflowX = ''
    innerBoxElm.style.overflowY = ''
  }

  return [containerSize, innerSize] as const
}

export { useScrollFieldSize }
