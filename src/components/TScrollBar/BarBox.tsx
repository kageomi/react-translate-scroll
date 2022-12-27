import styled, { StyledComponent } from 'styled-components'

type BarProps = {
  height?: string
  width?: string
  transitionDuration: string
  thickness?: number
  opacity?: number
  display?: string
}

const BaseScrollbar: StyledComponent<
  'div',
  any,
  BarProps & React.ComponentType<HTMLDivElement>
> = styled.div`
  position: absolute;
  margin: 0;
  padding: 0;
  transition: opacity;
  opacity: 0;
`

const HorizontalBarBox = styled(BaseScrollbar).attrs<BarProps>(props => ({
  style: {
    display: props.display || 'block',
    width: props.width,
    height: `${props.thickness || 10}px`,
    opacity: props.opacity != null ? props.opacity : 0,
    transitionDuration: props.transitionDuration
  }
}))`
  bottom: 0;
  left: 0;
`

const VerticalBarBox = styled(BaseScrollbar).attrs<BarProps>(props => ({
  style: {
    display: props.display || 'block',
    width: `${props.thickness || 10}px`,
    height: props.height,
    opacity: props.opacity != null ? props.opacity : 0,
    transitionDuration: props.transitionDuration
  }
}))`
  top: 0;
  right: 0;
`

export { VerticalBarBox, HorizontalBarBox }
