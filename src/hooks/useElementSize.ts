import React, { useCallback, useEffect, useState } from 'react'

const useElementSize = (ref: React.RefObject<HTMLElement>) => {
  const [scrollSize, setScrollSize] = useState({ height: 0, width: 0 })
  const [clientSize, setClientSize] = useState({ height: 0, width: 0 })

  const setSize = useCallback(() => {
    const elm = ref.current
    if (!elm) return
    setScrollSize(() => ({
      height: elm.scrollHeight,
      width: elm.scrollWidth
    }))
    setClientSize(() => ({
      height: elm.clientHeight,
      width: elm.clientWidth
    }))
  }, [ref])

  useEffect(() => {
    const resizeObserver = new ResizeObserver(setSize)
    const elm = ref.current
    if (!elm) return
    resizeObserver.observe(elm)

    return () => resizeObserver.disconnect()
  }, [ref])

  return [clientSize, scrollSize] as const
}

export { useElementSize }
