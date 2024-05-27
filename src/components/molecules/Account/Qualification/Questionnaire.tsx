import { FC, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { useBreakpoints } from '@/hooks';
import { AUTO_HIDE_DURATION } from '@/constants';

import { StyledButton, StyledLoading } from '@/components/atoms';

import { AccountRoleTaskKey, HttpError } from '@/types';
import { _fetchRoleTaskDetail } from '@/requests';

export const Questionnaire: FC = () => {
  const router = useRouter();
  const breakpoints = useBreakpoints();
  const { enqueueSnackbar } = useSnackbar();

  const [saveLoading, setSaveLoading] = useState(false);

  const { loading } = useAsync(async () => {
    try {
      const { data } = await _fetchRoleTaskDetail(AccountRoleTaskKey.ach);
      console.log(data);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
      router.back();
    }
  });

  const onClickSave = async () => {
    setSaveLoading(true);
    try {
      // const { data } = await _updateRoleTaskDetail(AccountRoleTaskKey.ach);
      router.back();
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setSaveLoading(false);
    }
  };

  return loading ? (
    <Stack
      alignItems={'center'}
      justifyContent={'center'}
      margin={'auto 0'}
      minHeight={'calc(667px - 46px)'}
      width={'100%'}
    >
      <StyledLoading sx={{ color: 'text.grey' }} />
    </Stack>
  ) : (
    <Fade in={!loading}>
      <Stack
        gap={{ xs: 3, lg: 6 }}
        justifyContent={'flex-start'}
        maxWidth={900}
        mx={{ lg: 'auto', xs: 0 }}
        px={{ lg: 3, xs: 0 }}
        width={'100%'}
      >
        <Typography
          component={'div'}
          textAlign={'center'}
          variant={['xs', 'sm', 'md'].includes(breakpoints) ? 'h6' : 'h5'}
        >
          Broker questionnaire
          <Typography
            color={'text.secondary'}
            component={'p'}
            mt={1.5}
            variant={
              ['xs', 'sm', 'md'].includes(breakpoints) ? 'body3' : 'body1'
            }
          >
            Please indicate the states in which you are licensed to broker loans
            and the type of license you hold in each state
          </Typography>
        </Typography>

        <Stack></Stack>

        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          gap={3}
          justifyContent={'center'}
          mt={3}
        >
          <StyledButton
            color={'info'}
            onClick={() => router.back()}
            sx={{
              flex: 1,
              width: '100%',
              maxWidth: 276,
            }}
            variant={'text'}
          >
            Back
          </StyledButton>
          <StyledButton
            color={'primary'}
            disabled={saveLoading}
            loading={saveLoading}
            onClick={onClickSave}
            sx={{
              flex: 1,
              width: '100%',
              maxWidth: 276,
            }}
          >
            Save
          </StyledButton>
        </Stack>
      </Stack>
    </Fade>
  );
};
