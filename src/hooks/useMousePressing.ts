import { useState, useCallback, MouseEventHandler } from 'react'

// interval means how often the elapsed time will be updated
const useMousePressing = (interval: number = 10) => {
  const [isMousePressing, setIsMousePressing] = useState(false)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [pressingTimer, setPressingTimer] = useState<ReturnType<
    typeof setInterval
  > | null>(null)

  const clearElapsedTime = useCallback(() => {
    if (pressingTimer != null) {
      clearInterval(pressingTimer)
    }
    setElapsedTime(0)
  }, [interval, pressingTimer, setElapsedTime])

  const updateElapsedTime = useCallback(() => {
    clearElapsedTime()
    const timer = setInterval(() => {
      setElapsedTime(time => time + interval)
    }, interval)
    setPressingTimer(timer)
  }, [interval, setPressingTimer, clearElapsedTime])

  const onMouseDown: MouseEventHandler = useCallback(event => {
    setIsMousePressing(true)
    updateElapsedTime()
  }, [])
  const onMouseUp: MouseEventHandler = useCallback(
    event => {
      setIsMousePressing(false)
      clearElapsedTime()
    },
    [clearElapsedTime]
  )
  const onMouseLeave: MouseEventHandler = useCallback(
    event => {
      setIsMousePressing(false)
      clearElapsedTime()
    },
    [clearElapsedTime]
  )

  return [
    isMousePressing,
    elapsedTime,
    {
      onMouseDown,
      onMouseUp,
      onMouseLeave
    }
  ] as const
}

export { useMousePressing }
