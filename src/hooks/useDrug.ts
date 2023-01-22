import { useState, useCallback, MouseEventHandler } from 'react'

type Position = {
  x: number
  y: number
}

const useDrug = () => {
  const [isMouseOn, setIsMouseOn] = useState(false)
  const [movementPosition, setMovementPosition] = useState<Position>({
    x: 0,
    y: 0
  })
  const onMouseDown: MouseEventHandler = useCallback(event => {
    setIsMouseOn(true)
  }, [])
  const onMouseUp: MouseEventHandler = useCallback(event => {
    setIsMouseOn(false)
  }, [])
  const onMouseOut: MouseEventHandler = useCallback(event => {
    setIsMouseOn(false)
  }, [])
  const onMouseMove: MouseEventHandler = useCallback(event => {
    const x = event.movementX
    const y = event.movementY
    setMovementPosition({ x, y })
  }, [])

  return [
    {
      isMouseOn,
      movementPosition,
      onMouseUp,
      onMouseDown,
      onMouseMove,
      onMouseOut
    }
  ] as const
}

export { useDrug }
