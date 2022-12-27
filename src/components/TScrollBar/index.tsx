import React, {
  FC,
  TransitionEventHandler,
  useMemo,
  useState,
  useEffect
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
  onTransitionEnd?: TransitionEventHandler
  isVisible?: boolean
}

const defaultColor = 'rgba(200,200,200,.5)'

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
  isVisible = true
}) => {
  const [display, setDisplay] = useState<'block' | 'none'>('block')

  useEffect(() => {
    if (isVisible) setDisplay('block')
  }, [isVisible])

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
    setDisplay(isVisible ? 'block' : 'none')
    onTransitionEnd(event)
  }

  return type === 'vertical' ? (
    <VerticalBarBox
      height={`${containerSize.height - thickness}px`}
      thickness={thickness}
      transitionDuration={transitionDuration}
      onTransitionEnd={handleTransitionEnd}
      opacity={isVisible ? 1 : 0}
      display={display}
    >
      <VerticalBar
        color={color}
        height={innerBarSize.height}
        position={barPosition.vertical}
        radius={radius}
      />
    </VerticalBarBox>
  ) : (
    <HorizontalBarBox
      width={`${containerSize.width - thickness}px`}
      thickness={thickness}
      transitionDuration={transitionDuration}
      onTransitionEnd={handleTransitionEnd}
      opacity={isVisible ? 1 : 0}
      display={display}
    >
      <HorizontalBar
        color={color}
        width={innerBarSize.width}
        position={barPosition.horizontal}
        radius={radius}
      />
    </HorizontalBarBox>
  )
}

export { TScrollBar }
