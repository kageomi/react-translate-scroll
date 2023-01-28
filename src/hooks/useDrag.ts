import { useState, useCallback, MouseEventHandler } from 'react'

type Position = {
  x: number
  y: number
}

const useDrag = () => {
  const [isMouseOn, setIsMouseOn] = useState(false)
  const [movementPosition, setMovementPosition] = useState<Position>({
    x: 0,
    y: 0
  })
  const onMouseDown: MouseEventHandler = useCallback(event => {
    event.preventDefault()
    event.stopPropagation()
    setIsMouseOn(true)
  }, [])
  const onClick: MouseEventHandler = useCallback(event => {
    setIsMouseOn(false)
  }, [])
  const onMouseUp = useCallback((event: MouseEvent) => {
    setIsMouseOn(false)
  }, [])
  const onMouseMove = useCallback((event: MouseEvent) => {
    const x = event.movementX
    const y = event.movementY
    setMovementPosition({ x, y })
  }, [])

  return [
    {
      isMouseOn,
      movementPosition,
      onClick,
      onMouseUp,
      onMouseDown,
      onMouseMove
    }
  ] as const
}

export { useDrag }
