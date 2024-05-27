import { FC, useMemo, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useBreakpoints } from '@/hooks';
import { AUTO_HIDE_DURATION } from '@/constants';

import { StyledButton, StyledLoading } from '@/components/atoms';

import { AccountRoleTaskKey, HttpError, UserType } from '@/types';
import { _fetchRoleTaskDetail } from '@/requests';

export const Agreement: FC = observer(() => {
  const router = useRouter();
  const breakpoints = useBreakpoints();
  const { enqueueSnackbar } = useSnackbar();

  const { userType } = useMst();

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

  const computedContent = useMemo(() => {
    switch (userType) {
      case UserType.BROKER:
        return {
          title: 'Broker agreement',
          subtitle:
            "Please fill in the fields below and we'll generate a broker agreement for you.",
        };
      case UserType.LOAN_OFFICER:
        return {
          title: 'Loan officer information',
          subtitle: 'Please fill out the information that pertains to you.',
        };
      case UserType.REAL_ESTATE_AGENT:
        return {
          title: 'Real estate agent information',
          subtitle: 'Please fill out the information that pertains to you.',
        };
      default:
        return {
          title: '',
          subtitle: '',
        };
    }
  }, [userType]);

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
          {computedContent.title}
          <Typography
            color={'text.secondary'}
            component={'p'}
            mt={1.5}
            variant={
              ['xs', 'sm', 'md'].includes(breakpoints) ? 'body3' : 'body1'
            }
          >
            {computedContent.subtitle}
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
});
