import React from 'react'
import { useElementSize } from './useElementSize'

const useScrollFieldSize = (
  containerRef: React.RefObject<HTMLElement>,
  innerRef: React.RefObject<HTMLElement>
) => {
  const containerSize = useElementSize(containerRef)[0].clientSize

  const innerBoxElm = innerRef.current
  if (innerBoxElm != null) {
    //scrollSize is calculated wrongly, if overflow is not auto or scroll
    innerBoxElm.style.overflowX = 'auto'
    //to avoid showing vertical scrollbar. It effects on the width of area
    innerBoxElm.style.overflowY = 'hidden'
  }
  const innerSize = useElementSize(innerRef)[0].scrollSize
  if (innerBoxElm != null) {
    //set overflow to default
    innerBoxElm.style.overflowX = ''
    innerBoxElm.style.overflowY = ''
  }

  return [containerSize, innerSize] as const
}

export { useScrollFieldSize }
