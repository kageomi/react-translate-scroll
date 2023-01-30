# react-translate-scroll
react translate scroll is a component which scroll function is emulated by css translate.

## Demo
![result](https://github.com/kageomi/react-translate-scroll/blob/media/media/demo1.gif)

## Installation
`yarn add git+ssh://git@github.com:kageomi/react-translate-scroll.git`

## How to use
```
import TranslateScroll, { ScrollEventHandler } from "react-translate-scroll"


const handleScroll: ScrollEventHandler = (position) => {
  const { top, left } = position
  console.log(top, left)
}

<TranslateScroll
  scrollTop={100}
  scrollLeft={100}
  style={style}
  onScroll={handleScroll}
>
  <div>hogehoge<div>
  <div>hogehoge<div>
  <div>hogehoge<div>
</TranslateScroll>

```
