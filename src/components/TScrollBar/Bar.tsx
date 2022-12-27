import styled, { StyledComponent } from 'styled-components'

type BarInnerProps = {
  color?: string
  height?: string
  width?: string
  position: string
  radius?: number
}

const BasicBar: StyledComponent<
  'div',
  any,
  BarInnerProps & React.ComponentType<HTMLDivElement>
> = styled.div`
  position: absolute;
`

const VerticalBar = styled(BasicBar).attrs<BarInnerProps>(props => ({
  style: {
    background: props.color,
    height: props.height,
    top: props.position,
    borderRadius: props.radius
  }
}))`
  left: 0;
  width: 100%;
`
const HorizontalBar = styled(BasicBar).attrs<BarInnerProps>(props => ({
  style: {
    background: props.color,
    width: props.width,
    left: props.position,
    borderRadius: props.radius
  }
}))`
  top: 0;
  height: 100%;
`

export { HorizontalBar, VerticalBar }
