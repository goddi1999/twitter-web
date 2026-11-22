import { useId } from 'react'

import { cn } from '@/lib/utils'

import {
  AnthropicIcon,
  buildGatewayEndpointIds,
  GatewayEndpointConnectionLines,
  GatewayEndpointDefs,
  GatewayEndpointIconBubble,
  GatewayEndpointRadialCircles,
  MoreIcon,
  OpenAIIcon,
  VercelLogo,
  XAIIcon,
} from './gateway-endpoint-illustration-parts'
import {
  GATEWAY_DEFAULT_COLORS,
  GATEWAY_LINE_COLORS,
  GATEWAY_VIEWBOX,
} from './gateway-endpoint-illustration.constants'
import type { GatewayEndpointIllustrationProps } from './gateway-endpoint-illustration.types'

/** A static gateway diagram: one input fans out through a hub to four provider bubbles. */
export function GatewayEndpointIllustration({
  width = GATEWAY_VIEWBOX.width,
  height = GATEWAY_VIEWBOX.height,
  backgroundColor = GATEWAY_DEFAULT_COLORS.background,
  circleStrokeColor = GATEWAY_DEFAULT_COLORS.circleStroke,
  centerCircleStroke = GATEWAY_DEFAULT_COLORS.centerCircleStroke,
  logoColor = GATEWAY_DEFAULT_COLORS.logo,
  iconColor = GATEWAY_DEFAULT_COLORS.icon,
  inputLineColor = GATEWAY_DEFAULT_COLORS.inputLine,
  topLeftLineColor = GATEWAY_LINE_COLORS.topLeft,
  bottomLeftLineColor = GATEWAY_LINE_COLORS.bottomLeft,
  topRightLineColor = GATEWAY_LINE_COLORS.topRight,
  bottomRightLineColor = GATEWAY_LINE_COLORS.bottomRight,
  iconBoxFill = GATEWAY_DEFAULT_COLORS.iconBoxFill,
  iconBoxStroke = GATEWAY_DEFAULT_COLORS.iconBoxStroke,
  showRadialCircles = true,
  topLeftIcon = <OpenAIIcon color={iconColor} />,
  topRightIcon = <AnthropicIcon color={iconColor} />,
  bottomLeftIcon = <MoreIcon color={iconColor} />,
  bottomRightIcon = <XAIIcon color={iconColor} />,
  className,
  ...props
}: GatewayEndpointIllustrationProps) {
  const ids = buildGatewayEndpointIds(useId())
  const bubble = { fill: iconBoxFill, stroke: iconBoxStroke }

  return (
    <svg
      data-slot="gateway-endpoint"
      aria-hidden
      focusable="false"
      width={width}
      height={height}
      viewBox={`0 0 ${GATEWAY_VIEWBOX.width} ${GATEWAY_VIEWBOX.height}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className)}
      {...props}
    >
      <GatewayEndpointDefs
        ids={ids}
        circleStrokeColor={circleStrokeColor}
        backgroundColor={backgroundColor}
        inputLineColor={inputLineColor}
      />
      <g clipPath={`url(#${ids.clip})`}>
        <rect width={GATEWAY_VIEWBOX.width} height={GATEWAY_VIEWBOX.height} fill={backgroundColor} />
        {showRadialCircles ? <GatewayEndpointRadialCircles ids={ids} /> : null}
        <path d="M112.005 60L0.00488281 60" stroke={`url(#${ids.inputLine})`} />
        <GatewayEndpointConnectionLines
          colors={{
            topLeft: topLeftLineColor,
            bottomLeft: bottomLeftLineColor,
            topRight: topRightLineColor,
            bottomRight: bottomRightLineColor,
          }}
        />
        <VercelLogo color={logoColor} />
        <circle cx="132" cy="60" r="20" stroke={centerCircleStroke} />
        <GatewayEndpointIconBubble x={180} y={4} iconX={180} iconY={10} {...bubble}>
          {topLeftIcon}
        </GatewayEndpointIconBubble>
        <GatewayEndpointIconBubble x={226} y={20} iconX={226} iconY={26} {...bubble}>
          {topRightIcon}
        </GatewayEndpointIconBubble>
        <GatewayEndpointIconBubble x={226} y={68} iconX={226} iconY={76} {...bubble}>
          {bottomRightIcon}
        </GatewayEndpointIconBubble>
        <GatewayEndpointIconBubble x={180} y={84} iconX={186} iconY={86} {...bubble}>
          {bottomLeftIcon}
        </GatewayEndpointIconBubble>
      </g>
    </svg>
  )
}
