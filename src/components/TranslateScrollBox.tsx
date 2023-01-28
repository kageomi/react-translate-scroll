import React, { FC, useRef, useMemo, useEffect, useCallback } from 'react'
import styled from 'styled-components'
import { TScrollBar, Direction } from '../components/TScrollBar'
import { useEmulatedScroll } from '../hooks/useEmulatedScroll'
import { ScrollPosition } from '../hooks/useEmulatedScroll'
import { useDrug } from '../hooks/useDrug'

type ScrollEventHandler = (position: ScrollPosition) => void

type Props = {
  scrollTop?: number
  scrollLeft?: number
  style?: React.CSSProperties
  children?: JSX.Element | JSX.Element[]
  onScroll?: ScrollEventHandler
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

const PRESSING_SCROLL_SPEED = 2

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

  const handlePressing = useCallback(
    (elapsedTime: number, direction: Direction) => {
      let additional = [0, 0]
      switch (direction) {
        case 'right':
          additional = [PRESSING_SCROLL_SPEED, 0]
          break
        case 'left':
          additional = [-1 * PRESSING_SCROLL_SPEED, 0]
          break
        case 'top':
          additional = [0, -1 * PRESSING_SCROLL_SPEED]
          break
        default:
          additional = [0, PRESSING_SCROLL_SPEED]
          break
      }
      addScroll(additional[0], additional[1])
    },
    [addScroll]
  )

  useEffect(() => {
    onScroll && onScroll(scrollForBar)
  }, [scrollForBar])

  useEffect(() => {
    const handleMouseUp = (event: MouseEvent) => {
      verticalBarDrug.onMouseUp(event)
      horizontalBarDrug.onMouseUp(event)
    }
    const handleMouseMove = (event: MouseEvent) => {
      verticalBarDrug.onMouseMove(event)
      horizontalBarDrug.onMouseMove(event)
    }
    window.addEventListener('mouseup', handleMouseUp)
    window.addEventListener('mousemove', handleMouseMove)
    return () => {
      window.removeEventListener('mouseup', handleMouseUp)
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [verticalBarDrug, horizontalBarDrug])

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
              onMouseDownOnBar={horizontalBarDrug.onMouseDown}
              onPressingBlankArea={handlePressing}
            />
          )}
          {scrollSize.height > containerSize.height && (
            <TScrollBar
              scrollSize={scrollSize}
              containerSize={containerSize}
              scroll={scrollForBar}
              type="vertical"
              isVisible={isScrolling}
              onMouseDownOnBar={verticalBarDrug.onMouseDown}
              onPressingBlankArea={handlePressing}
            />
          )}
        </>
      )}
    </TransformScrollBox>
  )
}

export { TranslateScrollBox }
export type { ScrollEventHandler }
