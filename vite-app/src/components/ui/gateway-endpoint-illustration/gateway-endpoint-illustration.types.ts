import type { ComponentProps, ReactNode } from 'react'

export type GatewayEndpointIds = {
  clip: string
  circle1: string
  circle2: string
  circle3: string
  inputLine: string
}

export type GatewayEndpointLineColors = {
  topLeft: string
  bottomLeft: string
  topRight: string
  bottomRight: string
}

export type GatewayEndpointIllustrationProps = Omit<ComponentProps<'svg'>, 'width' | 'height'> & {
  width?: number
  height?: number
  backgroundColor?: string
  circleStrokeColor?: string
  centerCircleStroke?: string
  logoColor?: string
  iconColor?: string
  inputLineColor?: string
  topLeftLineColor?: string
  bottomLeftLineColor?: string
  topRightLineColor?: string
  bottomRightLineColor?: string
  iconBoxFill?: string
  iconBoxStroke?: string
  showRadialCircles?: boolean
  topLeftIcon?: ReactNode
  topRightIcon?: ReactNode
  bottomLeftIcon?: ReactNode
  bottomRightIcon?: ReactNode
}
