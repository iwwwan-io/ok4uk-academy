import { cn } from '@/lib/utils'
import React from 'react'

type GridBackgroundProps = {
  size?: string // default: h-[30rem] w-[30rem]
  gap?: string // default: 40px
  lineWidth?: string // default: 2px
  lightColor?: string // default: #e4e4e7
  darkColor?: string // default: #262626
  className?: string
}

export function GridBackground({
  size = 'h-[30rem] w-[30rem]',
  gap = '40px',
  lineWidth = '2px',
  lightColor = '#e4e4e7',
  darkColor = '#262626',
  className,
}: GridBackgroundProps) {
  return (
    <div className={cn('absolute flex items-center justify-center', size, className)}>
      {/* Grid lines */}
      <div
        className="absolute inset-0"
        style={{
          backgroundSize: `${gap} ${gap}`,
          backgroundImage: `
            linear-gradient(to right, ${lightColor} ${lineWidth}, transparent ${lineWidth}),
            linear-gradient(to bottom, ${lightColor} ${lineWidth}, transparent ${lineWidth})
          `,
        }}
      />
      {/* Dark mode override */}
      <div
        className="absolute inset-0 hidden dark:block"
        style={{
          backgroundSize: `${gap} ${gap}`,
          backgroundImage: `
            linear-gradient(to right, ${darkColor} ${lineWidth}, transparent ${lineWidth}),
            linear-gradient(to bottom, ${darkColor} ${lineWidth}, transparent ${lineWidth})
          `,
        }}
      />
      {/* Mask / vignette */}
      <div
        className={cn(
          'pointer-events-none absolute inset-0 flex items-center justify-center bg-background',
          '[mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]',
        )}
      />
    </div>
  )
}
