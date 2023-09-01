import { FC, useLayoutEffect } from 'react';

import { Stack } from '@mui/material';

import { POSSVGAnimation } from '@/utils';

export const StyledGlobalLoading: FC = () => {
  useLayoutEffect(() => {
    POSSVGAnimation(0, 1, 2, 'linear', '#e3e3ee', true);
  }, []);

  return (
    <Stack
      alignItems={'center'}
      bgcolor={'#F5F8FA'}
      justifyContent={'stretch'}
      minHeight={'100vh'}
      minWidth={'100vw'}
    >
      <svg
        height="72"
        viewBox="0 0 390 72"
        width="390"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g
          fill="none"
          fillRule="evenodd"
          fontSize="9pt"
          id="svgGroup"
          stroke="#000"
          strokeLinecap="round"
          strokeWidth="0.25mm"
          style={{ stroke: '#000', strokeWidth: '0.25mm', fill: 'none' }}
        >
          <path
            className="loading-svg"
            d="M 35.3 70 L 27.8 70 L 27.8 43.8 L 0 3.8 L 9.1 3.8 L 31.5 36 L 53.9 3.8 L 63 3.8 L 35.3 43.8 L 35.3 70 Z"
            id="0"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="loading-svg"
            d="M 76.459 70.004 A 28.174 28.174 0 0 0 83.3 70.8 A 29.987 29.987 0 0 0 88.34 70.392 A 22.558 22.558 0 0 0 96.55 67.35 Q 102.1 63.9 105.1 58 A 26.947 26.947 0 0 0 106.617 54.391 A 29.202 29.202 0 0 0 108.1 45 A 33.058 33.058 0 0 0 108.019 42.674 A 27.478 27.478 0 0 0 105.1 31.95 Q 102.1 26.1 96.55 22.65 Q 91 19.2 83.3 19.2 A 29.961 29.961 0 0 0 78.964 19.504 A 23.056 23.056 0 0 0 70.1 22.65 Q 64.5 26.1 61.5 31.95 A 26.341 26.341 0 0 0 59.665 36.552 A 29.817 29.817 0 0 0 58.5 45 A 32.837 32.837 0 0 0 58.526 46.321 A 27.928 27.928 0 0 0 61.5 58 Q 64.5 63.9 70.1 67.35 A 22.371 22.371 0 0 0 76.459 70.004 Z M 83.3 64 A 20.03 20.03 0 0 0 87.714 63.537 A 14.677 14.677 0 0 0 92.75 61.4 Q 96.6 58.8 98.6 54.45 A 22.187 22.187 0 0 0 100.592 45.635 A 25.66 25.66 0 0 0 100.6 45 Q 100.6 39.8 98.6 35.5 Q 96.6 31.2 92.75 28.6 A 14.871 14.871 0 0 0 87.138 26.343 A 20.519 20.519 0 0 0 83.3 26 A 19.409 19.409 0 0 0 78.663 26.529 A 14.925 14.925 0 0 0 73.9 28.6 Q 70 31.2 68 35.5 A 21.632 21.632 0 0 0 66.07 43.082 A 25.804 25.804 0 0 0 66 45 Q 66 50.1 68 54.45 Q 70 58.8 73.9 61.4 A 15.305 15.305 0 0 0 79.999 63.743 A 20.429 20.429 0 0 0 83.3 64 Z"
            id="1"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="loading-svg"
            d="M 117.5 49.1 L 117.5 20 L 125 20 L 125 48.9 A 19.015 19.015 0 0 0 125.579 53.718 A 13.79 13.79 0 0 0 128.95 59.85 A 13.164 13.164 0 0 0 138.433 63.991 A 17.499 17.499 0 0 0 139 64 A 15.569 15.569 0 0 0 144.283 63.12 A 14.395 14.395 0 0 0 146.6 62.05 Q 150 60.1 152.05 56.7 Q 154.1 53.3 154.1 48.8 L 154.1 20 L 161.6 20 L 161.6 70 L 154.1 70 L 154.1 62.2 Q 151.4 65.8 147.5 68.3 A 14.896 14.896 0 0 1 142.972 70.194 Q 141.043 70.668 138.788 70.771 A 28.09 28.09 0 0 1 137.5 70.8 Q 132.4 70.8 127.8 68.35 A 18.593 18.593 0 0 1 120.947 62.01 A 22.516 22.516 0 0 1 120.35 61.05 A 19.847 19.847 0 0 1 118.085 55.072 Q 117.555 52.575 117.505 49.699 A 34.669 34.669 0 0 1 117.5 49.1 Z"
            id="2"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="loading-svg"
            d="M 219.8 70 L 176.2 70 L 176.2 3.8 L 183.7 3.8 L 183.7 62.8 L 219.8 62.8 L 219.8 70 Z"
            id="3"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="loading-svg"
            d="M 265.8 28.1 L 265.8 20 L 273.3 20 L 273.3 70 L 265.8 70 L 265.8 62 Q 263 66 258.55 68.4 A 19.461 19.461 0 0 1 252.82 70.373 A 26.983 26.983 0 0 1 247.9 70.8 Q 240.6 70.8 235.15 67.35 Q 229.7 63.9 226.7 58 A 27.928 27.928 0 0 1 223.726 46.321 A 32.837 32.837 0 0 1 223.7 45 A 29.817 29.817 0 0 1 224.865 36.552 A 26.341 26.341 0 0 1 226.7 31.95 Q 229.7 26.1 235.15 22.65 Q 240.6 19.2 247.9 19.2 Q 254.1 19.2 258.55 21.6 Q 263 24 265.8 28.1 Z M 248.9 64 A 20.03 20.03 0 0 0 253.314 63.537 A 14.677 14.677 0 0 0 258.35 61.4 Q 262.2 58.8 264.2 54.45 A 22.187 22.187 0 0 0 266.192 45.635 A 25.66 25.66 0 0 0 266.2 45 Q 266.2 39.8 264.2 35.5 Q 262.2 31.2 258.35 28.6 A 14.871 14.871 0 0 0 252.738 26.343 A 20.519 20.519 0 0 0 248.9 26 A 19.551 19.551 0 0 0 244.073 26.571 A 15.523 15.523 0 0 0 239.4 28.6 Q 235.4 31.2 233.3 35.5 A 20.935 20.935 0 0 0 231.242 43.555 A 24.859 24.859 0 0 0 231.2 45 A 21.636 21.636 0 0 0 232.808 53.351 A 20.883 20.883 0 0 0 233.3 54.45 Q 235.4 58.8 239.4 61.4 A 15.994 15.994 0 0 0 245.925 63.794 A 20.862 20.862 0 0 0 248.9 64 Z"
            id="4"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="loading-svg"
            d="M 293.8 70 L 286.3 70 L 286.3 20 L 293.8 20 L 293.8 27.8 Q 296.5 24.2 300.4 21.7 A 14.896 14.896 0 0 1 304.928 19.806 Q 306.857 19.332 309.112 19.229 A 28.09 28.09 0 0 1 310.4 19.2 Q 315.6 19.2 320.15 21.65 A 18.595 18.595 0 0 1 326.787 27.739 A 22.673 22.673 0 0 1 327.55 28.95 A 19.847 19.847 0 0 1 329.815 34.928 Q 330.345 37.425 330.395 40.301 A 34.669 34.669 0 0 1 330.4 40.9 L 330.4 70 L 322.9 70 L 322.9 41.1 A 19.321 19.321 0 0 0 322.352 36.373 A 13.86 13.86 0 0 0 319 30.15 A 12.986 12.986 0 0 0 310.042 26.036 A 17.606 17.606 0 0 0 308.9 26 A 15.99 15.99 0 0 0 303.761 26.809 A 14.575 14.575 0 0 0 301.3 27.9 Q 297.9 29.8 295.85 33.25 Q 293.8 36.7 293.8 41.2 L 293.8 70 Z"
            id="5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            className="loading-svg"
            d="M 381.9 28.1 L 381.9 0 L 389.4 0 L 389.4 70 L 381.9 70 L 381.9 62 Q 379.1 66 374.65 68.4 A 19.461 19.461 0 0 1 368.92 70.373 A 26.983 26.983 0 0 1 364 70.8 Q 356.7 70.8 351.25 67.35 Q 345.8 63.9 342.8 58 A 27.928 27.928 0 0 1 339.826 46.321 A 32.837 32.837 0 0 1 339.8 45 A 29.817 29.817 0 0 1 340.965 36.552 A 26.341 26.341 0 0 1 342.8 31.95 Q 345.8 26.1 351.25 22.65 Q 356.7 19.2 364 19.2 Q 370.2 19.2 374.65 21.6 Q 379.1 24 381.9 28.1 Z M 365 64 A 20.03 20.03 0 0 0 369.414 63.537 A 14.677 14.677 0 0 0 374.45 61.4 Q 378.3 58.8 380.3 54.45 A 22.187 22.187 0 0 0 382.292 45.635 A 25.66 25.66 0 0 0 382.3 45 Q 382.3 39.8 380.3 35.5 Q 378.3 31.2 374.45 28.6 A 14.871 14.871 0 0 0 368.838 26.343 A 20.519 20.519 0 0 0 365 26 A 19.551 19.551 0 0 0 360.173 26.571 A 15.523 15.523 0 0 0 355.5 28.6 Q 351.5 31.2 349.4 35.5 A 20.935 20.935 0 0 0 347.342 43.555 A 24.859 24.859 0 0 0 347.3 45 A 21.636 21.636 0 0 0 348.908 53.351 A 20.883 20.883 0 0 0 349.4 54.45 Q 351.5 58.8 355.5 61.4 A 15.994 15.994 0 0 0 362.025 63.794 A 20.862 20.862 0 0 0 365 64 Z"
            id="6"
            vectorEffect="non-scaling-stroke"
          />
        </g>
      </svg>
    </Stack>
  );
};
