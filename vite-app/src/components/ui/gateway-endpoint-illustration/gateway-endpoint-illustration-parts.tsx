import type { ReactNode } from 'react'

import type { GatewayEndpointIds, GatewayEndpointLineColors } from './gateway-endpoint-illustration.types'

type IconProps = { color: string }

export function buildGatewayEndpointIds(id: string): GatewayEndpointIds {
  const base = id.replaceAll(':', '')
  return {
    clip: `${base}-clip`,
    circle1: `${base}-circle1`,
    circle2: `${base}-circle2`,
    circle3: `${base}-circle3`,
    inputLine: `${base}-input-line`,
  }
}

export function GatewayEndpointDefs({
  ids,
  circleStrokeColor,
  backgroundColor,
  inputLineColor,
}: {
  ids: GatewayEndpointIds
  circleStrokeColor: string
  backgroundColor: string
  inputLineColor: string
}) {
  return (
    <defs data-slot="gateway-endpoint-defs">
      <linearGradient id={ids.circle1} x1="172" y1="60" x2="92" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0.5" stopColor={circleStrokeColor} />
        <stop offset="1" stopColor={backgroundColor} />
      </linearGradient>
      <linearGradient id={ids.circle2} x1="208" y1="60" x2="56" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0.504573" stopColor={circleStrokeColor} />
        <stop offset="1" stopColor={circleStrokeColor} stopOpacity="0" />
      </linearGradient>
      <linearGradient id={ids.circle3} x1="244" y1="60" x2="20" y2="60" gradientUnits="userSpaceOnUse">
        <stop offset="0.502016" stopColor={circleStrokeColor} />
        <stop offset="0.695565" stopColor={circleStrokeColor} stopOpacity="0" />
      </linearGradient>
      <linearGradient id={ids.inputLine} x1="0" y1="60" x2="56" y2="60" gradientUnits="userSpaceOnUse">
        <stop stopColor={backgroundColor} />
        <stop offset="1" stopColor={inputLineColor} />
      </linearGradient>
      <clipPath id={ids.clip}>
        <rect width="264" height="120" fill="white" />
      </clipPath>
    </defs>
  )
}

export function GatewayEndpointRadialCircles({ ids }: { ids: GatewayEndpointIds }) {
  return (
    <g data-slot="gateway-endpoint-radial-circles">
      <circle opacity="0.8" cx="132" cy="60" r="39.5" stroke={`url(#${ids.circle1})`} />
      <circle opacity="0.8" cx="132" cy="60" r="75.5" stroke={`url(#${ids.circle2})`} />
      <circle opacity="0.8" cx="132" cy="60" r="111.5" stroke={`url(#${ids.circle3})`} />
    </g>
  )
}

export function GatewayEndpointConnectionLines({ colors }: { colors: GatewayEndpointLineColors }) {
  return (
    <g data-slot="gateway-endpoint-connection-lines">
      <path
        d="M191 30.5L181.809 47.2107C178.997 52.3235 173.625 55.5 167.79 55.5H151.219"
        stroke={colors.topLeft}
      />
      <path
        d="M191 89.5L181.809 72.7893C178.997 67.6765 173.625 64.5 167.79 64.5H151.219"
        stroke={colors.bottomLeft}
      />
      <path
        d="M240 40L227.754 53.326C224.724 56.6234 220.451 58.5 215.973 58.5H186.5H151.5"
        stroke={colors.topRight}
      />
      <path
        d="M240 80L227.754 66.674C224.724 63.3766 220.451 61.5 215.973 61.5H186.5H151.5"
        stroke={colors.bottomRight}
      />
    </g>
  )
}

export function GatewayEndpointIconBubble({
  x,
  y,
  iconX,
  iconY,
  fill,
  stroke,
  children,
}: {
  x: number
  y: number
  iconX: number
  iconY: number
  fill: string
  stroke: string
  children: ReactNode
}) {
  return (
    <g data-slot="gateway-endpoint-icon-bubble">
      <rect x={x} y={y} width="32" height="32" rx="16" fill={fill} stroke={stroke} />
      <g transform={`translate(${iconX}, ${iconY})`}>{children}</g>
    </g>
  )
}

export function OpenAIIcon({ color }: IconProps) {
  return (
    <path
      data-slot="gateway-endpoint-openai-icon"
      d="M22.077 8.7301C22.399 7.7768 22.288 6.7325 21.773 5.8653C20.999 4.5353 19.443 3.851 17.923 4.173C17.247 3.4214 16.275 2.9939 15.257 3.0001C13.703 2.9966 12.325 3.9836 11.847 5.4422C10.848 5.6439 9.987 6.2604 9.483 7.1341C8.703 8.4606 8.881 10.1328 9.923 11.2703C9.601 12.2236 9.712 13.268 10.226 14.1351C11.001 15.4651 12.557 16.1494 14.077 15.8274C14.753 16.579 15.724 17.0065 16.743 16.9999C18.297 17.0039 19.676 16.016 20.154 14.556C21.152 14.3543 22.014 13.7379 22.518 12.8642C23.297 11.5376 23.119 9.8668 22.077 8.7292L22.077 8.7301ZM16.744 16.0851C16.122 16.086 15.519 15.8712 15.042 15.4778C15.063 15.4665 15.101 15.4459 15.125 15.431L17.951 13.821C18.095 13.74 18.184 13.5882 18.183 13.4242V9.494L19.377 10.1743C19.39 10.1805 19.398 10.1927 19.4 10.2067V13.4614C19.398 14.9086 18.21 16.082 16.744 16.0851ZM11.031 13.6775C10.719 13.1463 10.607 12.5238 10.714 11.9196C10.735 11.9318 10.772 11.9541 10.798 11.969L13.623 13.579C13.766 13.6617 13.944 13.6617 14.087 13.579L17.537 11.6137V12.9744C17.537 12.9884 17.531 13.002 17.52 13.0107L14.664 14.6378C13.392 15.3606 11.767 14.9309 11.032 13.6775H11.031ZM10.288 7.5922C10.598 7.0602 11.088 6.6533 11.671 6.442C11.671 6.466 11.67 6.5085 11.67 6.5382V9.7587C11.669 9.9223 11.758 10.0742 11.902 10.1551L15.351 12.1199L14.157 12.8003C14.145 12.8081 14.13 12.8095 14.117 12.8038L11.26 11.1754C9.991 10.45 9.556 8.8474 10.287 7.5926L10.288 7.5922ZM20.098 9.8449L16.649 7.8796L17.843 7.1997C17.855 7.1918 17.87 7.1905 17.883 7.1962L20.74 8.8233C22.011 9.5483 22.447 11.1535 21.712 12.4083C21.402 12.9394 20.912 13.3463 20.329 13.558V10.2413C20.33 10.0777 20.242 9.9263 20.098 9.8449H20.098ZM21.286 8.08C21.265 8.0673 21.229 8.0454 21.202 8.0305L18.377 6.4205C18.234 6.3378 18.057 6.3378 17.913 6.4205L14.464 8.3858V7.0252C14.463 7.0112 14.47 6.9976 14.48 6.9889L17.337 5.3618C18.608 4.6372 20.233 5.0669 20.968 6.3217C21.279 6.8528 21.391 7.4753 21.286 8.08ZM13.817 10.506L12.623 9.8252C12.61 9.8177 12.602 9.8046 12.6 9.7902V6.5382C12.601 5.0884 13.793 3.9132 15.261 3.9145C15.882 3.9145 16.485 4.1293 16.962 4.5227C16.941 4.534 16.904 4.5541 16.879 4.569L14.054 6.179C13.91 6.26 13.821 6.4118 13.822 6.5758L13.817 10.506ZM14.463 9.1328L16 8.25L17.537 9.1323V10.8968L16 11.7791L14.463 10.8968V9.1328Z"
      fill={color}
    />
  )
}

export function AnthropicIcon({ color }: IconProps) {
  return (
    <g data-slot="gateway-endpoint-anthropic-icon" fill={color}>
      <path d="M17.043 5.293L20.796 14.7057H22.854L19.101 5.293H17.043Z" />
      <path d="M12.69 10.9809L13.974 7.673L15.258 10.9809H12.69ZM12.898 5.293L9.146 14.7057H11.244L12.011 12.729H15.937L16.704 14.7057H18.802L15.05 5.293H12.898Z" />
    </g>
  )
}

export function XAIIcon({ color }: IconProps) {
  return (
    <g data-slot="gateway-endpoint-xai-icon" fill={color}>
      <path d="M19.855 5.5094L20.097 14.9996H22.032L22.274 2.0547L19.855 5.5094Z" />
      <path d="M22.275 1H19.321L14.687 7.6187L16.164 9.7275L22.275 1Z" />
      <path d="M9.519 15H12.472L13.949 12.8913L12.472 10.7822L9.519 15Z" />
      <path d="M9.519 5.5098L16.164 15H19.117L12.472 5.5098H9.519Z" />
    </g>
  )
}

export function MoreIcon({ color }: IconProps) {
  return (
    <path
      data-slot="gateway-endpoint-more-icon"
      d="M5.875 12.875C6.496 12.875 7 13.3787 7 14C7 14.621 6.496 15.125 5.875 15.125C5.254 15.125 4.75 14.621 4.75 14C4.75 13.3787 5.254 12.875 5.875 12.875ZM10 12.875C10.621 12.875 11.125 13.3787 11.125 14C11.125 14.621 10.621 15.125 10 15.125C9.379 15.125 8.875 14.621 8.875 14C8.875 13.3787 9.379 12.875 10 12.875ZM14.125 12.875C14.746 12.875 15.25 13.3787 15.25 14C15.25 14.621 14.746 15.125 14.125 15.125C13.504 15.125 13 14.621 13 14C13 13.3787 13.504 12.875 14.125 12.875Z"
      fill={color}
    />
  )
}

export function VercelLogo({ color }: IconProps) {
  return (
    <path
      data-slot="gateway-endpoint-vercel-logo"
      fillRule="evenodd"
      clipRule="evenodd"
      d="M132 52L140 66H124L132 52Z"
      fill={color}
    />
  )
}
