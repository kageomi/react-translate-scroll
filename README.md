# react-translate-scroll
react translate scroll is a component which scroll function is emulated by css translate.

## Why not using browser scroll?
By using browser scoll, the performance problematic if you wanna get and set scroll position every 10 milliseconds.  
For example, if you wanna completely syncronize scroll position of two elements, the overhead of it is nonignorable.  
Using css translate attribute is a good solution and this component offers it.  

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
