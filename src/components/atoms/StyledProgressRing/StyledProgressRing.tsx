import * as React from 'react';
import { Typography } from '@mui/material';

interface StyledProgressRingProps {
  caps?: 'butt' | 'round';
  children?: React.ReactNode;
  lineWidth?: number;
  percent?: number;
  progressColor?: string;
  size?: number;
  spin?: boolean;
  trackColor?: string;
  transitionDuration?: number;
  total?: number;
  current?: number;
}

// Actual component
export const StyledProgressRing = ({
  caps = 'round',
  lineWidth = 5,
  progressColor = '#36B37E',
  size = 48,
  spin = false,
  trackColor = '#E1EFE4',
  transitionDuration = 300,
  total = 12,
  current = 0,
}: Props) => {
  const halfSize = size / 2;
  const radius = halfSize - lineWidth / 2;
  const circleLength = radius * 2 * Math.PI;

  return (
    <div
      style={{
        width: size,
        height: size,
        display: 'flex',
        placeContent: 'center',
        placeItems: 'center',
      }}
    >
      <svg
        height={size}
        shapeRendering="geometricPrecision"
        style={{
          position: 'absolute',
          animation: spin ? 'animation-rotate 2s linear infinite' : undefined,
        }}
        width={size}
      >
        <g
          style={{
            transformOrigin: `${halfSize}px ${halfSize}px`,
            transform: 'rotate(-90deg)',
          }}
        >
          <circle
            cx={halfSize}
            cy={halfSize}
            fill="none"
            r={radius}
            stroke={trackColor}
            strokeWidth={lineWidth}
          />
          <circle
            cx={halfSize}
            cy={halfSize}
            fill="none"
            r={radius}
            stroke={progressColor}
            strokeDasharray={circleLength}
            strokeLinecap={caps}
            strokeWidth={lineWidth}
            style={{
              transition:
                transitionDuration > 0
                  ? `${transitionDuration}ms stroke-dashoffset`
                  : undefined,
              strokeDashoffset: circleLength * (1 - current / total),
            }}
          />
        </g>
      </svg>
      <Typography sx={{ zIndex: 1 }} variant={'subtitle3'}>
        {current}/{total}
      </Typography>
    </div>
  );
};
