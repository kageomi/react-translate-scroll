import React, { FC, useRef, useMemo, useEffect } from 'react'
import styled from 'styled-components'
import { TScrollBar } from './components/TScrollBar'
import { useEmulatedScroll } from './hooks/useEmulatedScroll'
import { ScrollState } from './hooks/useEmulatedScroll'
import { useDrug } from './hooks/useDrug'

type Props = {
  scrollTop?: number
  scrollLeft?: number
  style?: React.CSSProperties
  children?: JSX.Element | JSX.Element[]
  onScroll?: (position: ScrollState) => void
}

const TransformScrollBox = styled.div`
  overflow: hidden;
  transition: transform 0.01s linear;
  position: relative;
`

const TransformScrollInner = styled.div`
  margin: 0;
  padding: 0;
`

const TranslateScrollBox: FC<Props> = ({
  scrollTop = 0,
  scrollLeft = 0,
  children,
  style,
  onScroll
}) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const innerRef = useRef<HTMLDivElement>(null)
  const [
    { scroll, containerSize, scrollSize, isScrolling },
    { addScroll, handleTouchStart, handleTouchEnd }
  ] = useEmulatedScroll({
    containerRef,
    innerRef,
    defaultScroll: {
      top: -1 * scrollTop,
      left: -1 * scrollLeft
    }
  })
  const scrollForBar = useMemo(
    () => ({ top: -1 * scroll.top, left: -1 * scroll.left }),
    [scroll]
  )
  const [horizontalBarDrug] = useDrug()
  const [verticalBarDrug] = useDrug()

  useEffect(() => {
    onScroll && onScroll(scrollForBar)
  }, [scrollForBar])

  useEffect(() => {
    if (verticalBarDrug.isMouseOn) {
      const { y } = verticalBarDrug.movementPosition
      const scrollHeight = scrollSize.height
      const containerHeight = containerSize.height
      const percent = y / containerHeight
      const scrollAmount = scrollHeight * percent
      addScroll(0, scrollAmount)
    }
    if (horizontalBarDrug.isMouseOn) {
      const { x } = horizontalBarDrug.movementPosition
      const scrollWidth = scrollSize.width
      const containerWidth = containerSize.width
      const percent = x / containerWidth
      const scrollAmount = scrollWidth * percent
      addScroll(scrollAmount, 0)
    }
  }, [
    scrollSize,
    containerSize,
    horizontalBarDrug.movementPosition,
    verticalBarDrug.movementPosition
  ])

  return (
    <TransformScrollBox
      ref={containerRef}
      style={style}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <TransformScrollInner ref={innerRef}>{children}</TransformScrollInner>
      {scrollSize && containerSize && (
        <>
          {scrollSize.width > containerSize.width && (
            <TScrollBar
              scrollSize={scrollSize}
              containerSize={containerSize}
              scroll={scrollForBar}
              type="horizontal"
              isVisible={isScrolling}
              onMouseMove={horizontalBarDrug.onMouseMove}
              onMouseDown={horizontalBarDrug.onMouseDown}
              onMouseUp={horizontalBarDrug.onMouseUp}
              onMouseLeave={horizontalBarDrug.onMouseLeave}
            />
          )}
          {scrollSize.height > containerSize.height && (
            <TScrollBar
              scrollSize={scrollSize}
              containerSize={containerSize}
              scroll={scrollForBar}
              type="vertical"
              isVisible={isScrolling}
              onMouseMove={verticalBarDrug.onMouseMove}
              onMouseDown={verticalBarDrug.onMouseDown}
              onMouseUp={verticalBarDrug.onMouseUp}
              onMouseLeave={verticalBarDrug.onMouseLeave}
            />
          )}
        </>
      )}
    </TransformScrollBox>
  )
}

export default TranslateScrollBox
