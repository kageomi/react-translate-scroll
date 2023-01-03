import React, {
  useEffect,
  useCallback,
  useState,
  TouchEventHandler
} from 'react'
import { useInertia } from './useInertia'
import { useTranslate } from './useTranslate'
import { useScrollFieldSize } from './useScrollFieldSize'

type Props = {
  containerRef: React.RefObject<HTMLElement>
  innerRef: React.RefObject<HTMLElement>
  defaultScroll: { top: number; left: number }
}

type Touch = {
  time: number
  x: number
  y: number
}

type ScrollState = {
  top: number
  left: number
}

type TouchLog = {
  start: Touch | null
  previous: Touch | null
}

const useEmulatedScroll = ({
  containerRef,
  innerRef,
  defaultScroll
}: Props) => {
  const [scroll, setScroll] = useState<ScrollState>({
    top: -1 * defaultScroll.top,
    left: -1 * defaultScroll.left
  })

  const [touchLog, setTouchLog] = useState<TouchLog>({
    start: null,
    previous: null
  })

  const [scrollingTimer, setScrollingTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null)
  const [setInertiaScroll, cancelInertiaScroll] = useInertia()
  const [setTranslate] = useTranslate(innerRef)
  const [containerSize, scrollSize] = useScrollFieldSize(containerRef, innerRef)

  useEffect(() => {
    setTranslate(scroll)
  }, [scroll])

  // attach wheel and touch event to use preventDefault
  useEffect(() => {
    const containerElm = containerRef.current
    if (containerElm == null) return
    containerElm.addEventListener('wheel', handleWheel, { passive: false })
    containerElm.addEventListener('touchmove', handleTouchMove, {
      passive: false
    })
    return () => {
      containerElm.removeEventListener('wheel', handleWheel)
      containerElm.removeEventListener('touchmove', handleTouchMove)
    }
  }, [touchLog, scrollSize, containerSize, scrollingTimer]) // need to set state being used by handle functions

  const addScroll = useCallback(
    (deltaX: number, deltaY: number) => {
      const scrollHeight = scrollSize.height
      const scrollWidth = scrollSize.width
      const minScrollWidth = -1 * (scrollWidth - containerSize.width)
      const minScrollHeight = -1 * (scrollHeight - containerSize.height)
      const { top, left } = scroll
      const nextLeft = Math.min(Math.max(left - deltaX, minScrollWidth), 0)
      const nextTop = Math.min(Math.max(top - deltaY, minScrollHeight), 0)
      if (top === nextTop && left === nextLeft) return
      setScroll(state => {
        return { ...state, top: nextTop, left: nextLeft }
      })
      scrollingTimer && clearTimeout(scrollingTimer)
      setScrollingTimer(setTimeout(() => setScrollingTimer(null), 100))
    },
    [scrollSize, scroll, scrollingTimer]
  )

  const handleWheel = useCallback(
    (event: WheelEvent) => {
      event.preventDefault()
      const { deltaX, deltaY } = event
      addScroll(deltaX / 2, deltaY / 2)
    },
    [addScroll]
  )

  const handleTouchStart: TouchEventHandler<HTMLDivElement> = useCallback(
    event => {
      cancelInertiaScroll()
      const { pageX, pageY } = event.changedTouches[0]
      setTouchLog(state => ({
        ...state,
        start: { time: Date.now(), x: pageX, y: pageY },
        previous: { time: Date.now(), x: pageX, y: pageY }
      }))
    },
    [cancelInertiaScroll]
  )

  const handleTouchEnd: TouchEventHandler<HTMLDivElement> = useCallback(
    event => {
      const { pageX, pageY } = event.changedTouches[0]
      if (touchLog.start == null) throw new Error('touch start data is null')
      const now = Date.now()
      const delay = now - touchLog.start.time
      const startX = touchLog.start.x
      const startY = touchLog.start.y
      const dist = Math.sqrt(
        Math.pow(pageX - startX, 2) + Math.pow(pageY - startY, 2)
      )
      if (dist / delay < 0.5) return
      const deltaX = -1 * (((pageX - touchLog.start.x) / delay) * 100)
      const deltaY = -1 * (((pageY - touchLog.start.y) / delay) * 100)
      setInertiaScroll(deltaX / 2, deltaY / 2, addScroll)
    },
    [touchLog, addScroll]
  )

  const handleTouchMove = useCallback(
    (event: TouchEvent) => {
      event.preventDefault()
      const { pageX, pageY } = event.changedTouches[0]
      if (touchLog.previous == null)
        throw new Error('touch previous data is null')

      const prevX = touchLog.previous.x
      const prevY = touchLog.previous.y

      const deltaX = -1 * (pageX - prevX)
      const deltaY = -1 * (pageY - prevY)

      addScroll(deltaX, deltaY)

      setTouchLog(state => ({
        ...state,
        previous: { time: Date.now(), x: pageX, y: pageY }
      }))
    },
    [touchLog, addScroll]
  )

  return [
    {
      scroll,
      containerSize,
      scrollSize,
      isScrolling: !!scrollingTimer
    },
    {
      handleTouchStart,
      handleTouchEnd
    }
  ] as const
}

export { useEmulatedScroll }
