import { POSCreateDebounceFunction } from '@/utils';
import dynamic from 'next/dynamic';
import { FC, useCallback, useEffect } from 'react';
import { Box, Icon, Stack, Typography } from '@mui/material';

import { StyledFormItem } from '@/components/atoms';

import SCORE_BUOY from '@/svg/score/buoy.svg';

const AnimatedNumbers = dynamic(() => import('react-animated-numbers'), {
  ssr: false,
});

export const ScoreResult: FC<{ score: number | undefined }> = ({ score }) => {
  const handledAnimate = useCallback(() => {
    const SCORE_BUOY_DIVIDER = document.getElementById('SCORE_BUOY_DIVIDER');
    const SCORE_BUOY_ICON = document.getElementById('SCORE_BUOY_ICON');
    const px =
      (score! / 850) * SCORE_BUOY_DIVIDER!.getBoundingClientRect().width;
    SCORE_BUOY_ICON!.style.transform = 'translateX(0px)';
    SCORE_BUOY_ICON!.style.transform = `translateX(${px}px)`;
  }, [score]);

  useEffect(
    () => {
      if (!score) {
        return;
      }
      const { run } = POSCreateDebounceFunction(handledAnimate, 300);
      handledAnimate();
      window.addEventListener('resize', run);
      return () => window.removeEventListener('resize', run);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <>
      <StyledFormItem
        label={
          <Stack
            alignItems={'center'}
            flexDirection={'column'}
            justifyContent={'center'}
            width={'100%'}
          >
            Your Credit Score is
            <AnimatedNumbers
              animateToNumber={score!}
              configs={(number, index) => {
                return {
                  mass: 1,
                  tension: 230 * (index + 1),
                  friction: 140,
                };
              }}
              fontStyle={{ fontSize: 48 }}
            />
          </Stack>
        }
        tip={
          'Congratulations! Your credit score indicates that you are qualified to proceed with us and help us determine which rates you qualify for.'
        }
        tipSx={{ mb: 0 }}
      >
        <Box
          id={'SCORE_BUOY_DIVIDER'}
          sx={{
            m: '0 auto',
            mt: 6,
            width: '100%',
            maxWidth: 600,
            height: 16,
            borderRadius: 2,
            background:
              'linear-gradient(90deg, #EC574D 0%, #EEB43B 53.13%, #30E3A2 100%)',
            position: 'relative',
          }}
        >
          <Icon
            component={SCORE_BUOY}
            id={'SCORE_BUOY_ICON'}
            sx={{
              position: 'absolute',
              top: '150%',
              left: 0,
              transition: 'all 3s ease-out .5s',
            }}
          />
        </Box>
        <Typography
          color={'info.main'}
          mt={6}
          textAlign={'center'}
          variant={'body1'}
        >
          Just a few more steps until you&apos;re pre-approved.
        </Typography>
      </StyledFormItem>
    </>
  );
};
