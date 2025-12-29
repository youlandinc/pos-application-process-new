import { useMemo } from 'react';
import { CircularProgress, Icon, Stack, Typography } from '@mui/material';

import { DomainSource, EmailDomainDetails, EmailDomainState } from '@/types';

import ICON_PENDING from '../../icon_pending.svg';
import ICON_SUCCESS from '../../icon_success.svg';

const DomainStateHash = {
  [EmailDomainState.ACTIVE]: 'Active',
  [EmailDomainState.SUCCESS]: 'Please finish setup',
  [EmailDomainState.PENDING]: 'Waiting for verification',
  [EmailDomainState.FAILED]: 'Not linked',
};

const DomainStateIconHash = {
  [EmailDomainState.SUCCESS]: ICON_PENDING,
  [EmailDomainState.PENDING]: ICON_PENDING,
  [EmailDomainState.ACTIVE]: ICON_SUCCESS,
  [EmailDomainState.FAILED]: ICON_PENDING,
};

interface PaymentLinkEmailContentProps {
  loading: boolean;
  data: EmailDomainDetails[];
  onRemove: (item: EmailDomainDetails) => void;
  isSmall: boolean;
}

export const PaymentLinkEmailContent = ({
  loading,
  data,
  onRemove,
  isSmall,
}: PaymentLinkEmailContentProps) => {
  const smallContent = useMemo(() => {
    return (
      <>
        {data.map((item) => (
          <Stack
            gap={{ xs: 1.5, lg: 3 }}
            key={item.id}
            sx={{
              '&:not(:last-of-type)': {
                borderBottom: '1px solid #D2D6E1',
                pb: { xs: 1.5, lg: 3 },
              },
            }}
          >
            <Stack alignItems={'center'} flexDirection={'row'}>
              <Typography
                fontSize={{ xs: 12, lg: 16 }}
                fontWeight={600}
                width={{ xs: 48, lg: 80 }}
              >
                Email
              </Typography>
              <Typography fontSize={{ xs: 12, lg: 16 }}>
                {item.email || item.emailDomain}
              </Typography>
            </Stack>

            <Stack alignItems={'center'} flexDirection={'row'}>
              <Typography
                fontSize={{ xs: 12, lg: 16 }}
                fontWeight={600}
                width={{ xs: 48, lg: 80 }}
              >
                State
              </Typography>
              <Stack alignItems={'center'} flexDirection={'row'}>
                <Icon
                  component={DomainStateIconHash[item.validStatus]}
                  sx={{
                    width: { xs: 20, lg: 24 },
                    height: { xs: 20, lg: 24 },
                    mr: 1,
                  }}
                />
                <Typography fontSize={{ xs: 12, lg: 16 }}>
                  {DomainStateHash[item.validStatus]}
                </Typography>
              </Stack>
            </Stack>

            <Stack>
              {item.source === DomainSource.CUSTOM && (
                <Typography
                  color={'#5B76BC'}
                  onClick={() => onRemove(item)}
                  sx={{ cursor: 'pointer' }}
                  variant={'subtitle3'}
                >
                  Remove
                </Typography>
              )}
            </Stack>
          </Stack>
        ))}
      </>
    );
  }, [data, onRemove]);

  const largeContent = useMemo(() => {
    return (
      <Stack gap={1.25}>
        <Stack color={'text.primary'} flexDirection={'row'} gap={1.5}>
          <Typography flex={3} flexShrink={0} fontSize={14} fontWeight={600}>
            Email
          </Typography>
          <Typography flex={2} flexShrink={0} fontSize={14} fontWeight={600}>
            State
          </Typography>
          <Typography width={60} />
        </Stack>

        {data.map((item) => (
          <Stack flexDirection={'row'} gap={1.5} key={`pc_${item.id}`}>
            <Typography flex={3} flexShrink={0} fontSize={12}>
              {item.email || item.emailDomain}
            </Typography>

            <Stack
              alignItems={'center'}
              flex={2}
              flexDirection={'row'}
              flexShrink={0}
            >
              <Icon
                component={DomainStateIconHash[item.validStatus]}
                sx={{
                  width: 20,
                  height: 20,
                  mr: 1,
                }}
              />
              <Typography fontSize={12}>
                {DomainStateHash[item.validStatus]}
              </Typography>
            </Stack>

            <Stack width={60}>
              {item.source === DomainSource.CUSTOM && (
                <Typography
                  color={'#5B76BC'}
                  onClick={() => onRemove(item)}
                  sx={{ cursor: 'pointer' }}
                  variant={'subtitle3'}
                >
                  Remove
                </Typography>
              )}
            </Stack>
          </Stack>
        ))}
      </Stack>
    );
  }, [data, onRemove]);

  if (loading) {
    return (
      <Stack alignItems={'center'} flex={1} justifyContent={'center'}>
        <CircularProgress size={24} sx={{ width: '100%', color: '#E3E3EE' }} />
      </Stack>
    );
  }

  return <>{isSmall ? smallContent : largeContent}</>;
};
