import React, {
  FC,
  MouseEventHandler,
  TransitionEventHandler,
  useCallback,
  useMemo,
  useState
} from 'react'
import { VerticalBar, HorizontalBar } from './Bar'
import { VerticalBarBox, HorizontalBarBox } from './BarBox'

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
  onMouseUp: MouseEventHandler
  onMouseDown: MouseEventHandler
  onMouseMove: MouseEventHandler
  onMouseLeave: MouseEventHandler
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
  transitionDuration = '0.1s',
  isVisible = true,
  onMouseUp,
  onMouseDown,
  onMouseMove,
  onMouseLeave
}) => {
  const [isMouseOver, setIsMouseOver] = useState(false)

  const handleMouseOver: MouseEventHandler = useCallback(event => {
    setIsMouseOver(true)
  }, [])

  const handleMouseLeave: MouseEventHandler = useCallback(event => {
    setIsMouseOver(false)
    console.log('out')
    onMouseLeave(event)
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
    >
      <VerticalBar
        color={color}
        height={innerBarSize.height}
        position={barPosition.vertical}
        radius={radius}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
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
    >
      <HorizontalBar
        color={color}
        width={innerBarSize.width}
        position={barPosition.horizontal}
        radius={radius}
        onMouseUp={onMouseUp}
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
      />
    </HorizontalBarBox>
  )
}

export { TScrollBar }
