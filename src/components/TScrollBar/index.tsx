import React, {
  FC,
  MouseEventHandler,
  TransitionEventHandler,
  useCallback,
  useEffect,
  useMemo,
  useState
} from 'react'
import { VerticalBar, HorizontalBar } from './Bar'
import { VerticalBarBox, HorizontalBarBox } from './BarBox'
import { useMousePressing } from '../../hooks/useMousePressing'

type Direction = 'top' | 'bottom' | 'left' | 'right'

type Props = {
  color?: string
  type: 'vertical' | 'horizontal'
  scrollSize: { width: number; height: number } //px
  containerSize: { width: number; height: number } //px
  scroll?: { top: number; left: number } //px
  thickness?: number //px
  radius?: number //px
  transitionDuration?: string
  isVisible?: boolean
  onTransitionEnd?: TransitionEventHandler
  onMouseUpOnBar?: MouseEventHandler
  onMouseDownOnBar?: MouseEventHandler
  onMouseMove?: MouseEventHandler
  onMouseLeave?: MouseEventHandler
  onPressingBlankArea?: (elapsedTime: number, direction: Direction) => void
}

const defaultColor = 'rgba(100,100,100,.5)'

const TScrollBar: FC<Props> = ({
  color = defaultColor,
  type,
  scrollSize,
  containerSize,
  scroll = { top: 0, left: 0 },
  radius = 4,
  thickness = 8,
  onTransitionEnd = () => {},
  transitionDuration = '0.3s',
  isVisible = true,
  onMouseUpOnBar,
  onMouseDownOnBar,
  onMouseMove,
  onMouseLeave,
  onPressingBlankArea
}) => {
  const [isMouseOver, setIsMouseOver] = useState(false)
  const [onMousePressing, elapsedTime, pressingHandlers] = useMousePressing()
  const [mouseDirection, setMouseDirection] = useState<Direction>('right')

  useEffect(() => {
    if (!onMousePressing) return
    if (onPressingBlankArea != null)
      onPressingBlankArea(elapsedTime, mouseDirection)
  }, [onMousePressing, elapsedTime, mouseDirection])

  const handleMouseMove = useCallback(
    (
      isHorizontal: boolean,
      event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
      const { offsetX, offsetY } = event.nativeEvent
      const { width, height } = containerSize
      const size = isHorizontal ? width : height
      const position = isHorizontal ? offsetX : offsetY
      const directions = isHorizontal
        ? (['left', 'right'] as Direction[])
        : (['top', 'bottom'] as Direction[])
      const direction = position > size / 2 ? directions[1] : directions[0]
      setMouseDirection(direction)
    },
    [containerSize]
  )

  const handleMouseDownOnBar: MouseEventHandler = useCallback(event => {
    event.stopPropagation()
    if (onMouseDownOnBar != null) onMouseDownOnBar(event)
  }, [])

  const handleMouseUpOnBar: MouseEventHandler = useCallback(event => {
    event.stopPropagation()
    if (onMouseUpOnBar != null) onMouseUpOnBar(event)
  }, [])

  const handleMouseOver: MouseEventHandler = useCallback(event => {
    setIsMouseOver(true)
  }, [])

  const handleMouseLeave: MouseEventHandler = useCallback(event => {
    setIsMouseOver(false)
    if (onMouseLeave != null) onMouseLeave(event)
  }, [])

  const barPosition = useMemo(
    () => ({
      vertical: `${(scroll.top / scrollSize.height) * 100}%`,
      horizontal: `${(scroll.left / scrollSize.width) * 100}%`
    }),
    [scroll, scrollSize]
  )

  const innerBarSize = useMemo(
    () => ({
      height: `${(containerSize.height / scrollSize.height) * 100}%`,
      width: `${(containerSize.width / scrollSize.width) * 100}%`
    }),
    [containerSize, scrollSize]
  )

  const handleTransitionEnd: TransitionEventHandler = event => {
    onTransitionEnd(event)
  }

  return type === 'vertical' ? (
    <VerticalBarBox
      height={`${containerSize.height - thickness}px`}
      thickness={thickness}
      transitionDuration={transitionDuration}
      onTransitionEnd={handleTransitionEnd}
      opacity={isVisible || isMouseOver ? 1 : 0}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onMouseOut={pressingHandlers.onMouseLeave} //set it into out to avoid run on the scroll bar.
      onMouseUp={pressingHandlers.onMouseUp}
      onMouseDown={pressingHandlers.onMouseDown}
      onMouseMove={event => handleMouseMove(false, event)}
    >
      <VerticalBar
        color={color}
        height={innerBarSize.height}
        position={barPosition.vertical}
        radius={radius}
        onMouseUp={handleMouseUpOnBar}
        onMouseDown={handleMouseDownOnBar}
        onMouseMove={onMouseMove}
      />
    </VerticalBarBox>
  ) : (
    <HorizontalBarBox
      width={`${containerSize.width - thickness}px`}
      thickness={thickness}
      transitionDuration={transitionDuration}
      onTransitionEnd={handleTransitionEnd}
      opacity={isVisible || isMouseOver ? 1 : 0}
      onMouseOver={handleMouseOver}
      onMouseLeave={handleMouseLeave}
      onMouseOut={pressingHandlers.onMouseLeave} //set it into out to avoid run on the scroll bar.
      onMouseUp={pressingHandlers.onMouseUp}
      onMouseDown={pressingHandlers.onMouseDown}
      onMouseMove={event => handleMouseMove(true, event)}
    >
      <HorizontalBar
        color={color}
        width={innerBarSize.width}
        position={barPosition.horizontal}
        radius={radius}
        onMouseUp={handleMouseUpOnBar}
        onMouseDown={handleMouseDownOnBar}
        onMouseMove={onMouseMove}
      />
    </HorizontalBarBox>
  )
}

export { TScrollBar }
export type { Direction }
