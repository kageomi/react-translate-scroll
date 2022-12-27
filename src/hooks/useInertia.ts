import { useState, useCallback } from 'react'

const useInertia = () => {
  const [inertiaTimer, setInertiaTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null)

  const inertiaScroll = useCallback(
    (
      deltaX: number,
      deltaY: number,
      callback: (deltaX: number, deltaY: number) => void
    ) => {
      const attenuation = 0.95
      const nextDeltaX = deltaX * attenuation
      const nextDeltaY = deltaY * attenuation
      const minimumDelta = 0.5
      if (
        Math.abs(nextDeltaX) < minimumDelta &&
        Math.abs(nextDeltaY) < minimumDelta
      )
        return
      const inertiaTimer = setTimeout(() => {
        inertiaScroll(nextDeltaX, nextDeltaY, callback)
      }, 10)
      setInertiaTimer(inertiaTimer)
      callback(deltaX, deltaY)
    },
    [inertiaTimer]
  )

  const cancelInertiaScroll = useCallback(() => {
    const timer = inertiaTimer
    timer && clearTimeout(timer)
  }, [inertiaTimer])

  return [inertiaScroll, cancelInertiaScroll] as const
}

export { useInertia }
