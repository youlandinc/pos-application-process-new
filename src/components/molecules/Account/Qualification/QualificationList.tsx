import { FC, useMemo } from 'react';
import { Box, Stack, SxProps, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  AccountRoleTaskHash,
  AccountRoleTaskItemStatus,
  AccountRoleTaskKey,
  UserType,
} from '@/types';
import { POSNotUndefined } from '@/utils';

interface QualificationListProps {
  taskHash: AccountRoleTaskHash;
}

export const QualificationList: FC<QualificationListProps> = observer(
  ({ taskHash }) => {
    const router = useRouter();
    const { userType } = useMst();

    const computedName = useMemo(() => {
      switch (userType) {
        case UserType.BROKER:
          return 'Broker agreement';
        case UserType.LOAN_OFFICER:
          return 'Loan officer information';
        case UserType.REAL_ESTATE_AGENT:
          return 'Real estate agent information';
        default:
          return '';
      }
    }, [userType]);

    return (
      <Stack
        border={'1px solid #D2D6E1'}
        borderRadius={2}
        gap={1.5}
        mt={3}
        px={6}
        py={3}
      >
        {POSNotUndefined(taskHash?.[AccountRoleTaskKey.license]) && (
          <Stack
            alignItems={'center'}
            borderBottom={'1px solid #D2D6E1'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            onClick={() => router.push('/account/license')}
            pb={3}
            pt={1.5}
            sx={{
              cursor: 'pointer',
              transition: 'all .3s',
              '&:hover': {
                borderBottomColor: 'text.primary',
              },
            }}
          >
            <Typography
              color={'text.primary'}
              fontSize={'clamp(14px,1.6vw,18px)'}
              variant={'h7'}
            >
              Broker license
            </Typography>

            <TaskStatus status={taskHash[AccountRoleTaskKey.license]!} />
          </Stack>
        )}

        <Stack
          alignItems={'center'}
          borderBottom={'1px solid #D2D6E1'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          onClick={() => router.push('/account/agreement')}
          pb={3}
          pt={1.5}
          sx={{
            cursor: 'pointer',
            transition: 'all .3s',
            '&:hover': {
              borderBottomColor: 'text.primary',
            },
          }}
        >
          <Typography
            color={'text.primary'}
            fontSize={'clamp(14px,1.6vw,18px)'}
            variant={'h7'}
          >
            {computedName}
          </Typography>

          <TaskStatus status={taskHash[AccountRoleTaskKey.agreement]} />
        </Stack>

        {POSNotUndefined(taskHash?.[AccountRoleTaskKey.government_id]) && (
          <Stack
            alignItems={'center'}
            borderBottom={'1px solid #D2D6E1'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            onClick={() => router.push('/account/government-id')}
            pb={3}
            pt={1.5}
            sx={{
              cursor: 'pointer',
              transition: 'all .3s',
              '&:hover': {
                borderBottomColor: 'text.primary',
              },
            }}
          >
            <Typography
              color={'text.primary'}
              fontSize={'clamp(14px,1.6vw,18px)'}
              variant={'h7'}
            >
              Government ID
            </Typography>

            <TaskStatus status={taskHash[AccountRoleTaskKey.government_id]!} />
          </Stack>
        )}

        <Stack
          alignItems={'center'}
          borderBottom={'1px solid #D2D6E1'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          onClick={() => router.push('/account/w9-form')}
          pb={3}
          pt={1.5}
          sx={{
            cursor: 'pointer',
            transition: 'all .3s',
            '&:hover': {
              borderBottomColor: 'text.primary',
            },
          }}
        >
          <Typography
            color={'text.primary'}
            fontSize={'clamp(14px,1.6vw,18px)'}
            variant={'h7'}
          >
            W9 form
          </Typography>

          <TaskStatus status={taskHash[AccountRoleTaskKey.w9]} />
        </Stack>

        {POSNotUndefined(taskHash?.[AccountRoleTaskKey.questionnaire]) && (
          <Stack
            alignItems={'center'}
            borderBottom={'1px solid #D2D6E1'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            onClick={() => router.push('/account/questionnaire')}
            pb={3}
            pt={1.5}
            sx={{
              cursor: 'pointer',
              transition: 'all .3s',
              '&:hover': {
                borderBottomColor: 'text.primary',
              },
            }}
          >
            <Typography
              color={'text.primary'}
              fontSize={'clamp(14px,1.6vw,18px)'}
              variant={'h7'}
            >
              Broker questionnaire
            </Typography>

            <TaskStatus status={taskHash[AccountRoleTaskKey.questionnaire]!} />
          </Stack>
        )}

        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          onClick={() => router.push('/account/ach')}
          py={1.5}
          sx={{
            cursor: 'pointer',
          }}
        >
          <Typography
            color={'text.primary'}
            fontSize={'clamp(14px,1.6vw,18px)'}
            variant={'h7'}
          >
            ACH information
          </Typography>

          <TaskStatus status={taskHash[AccountRoleTaskKey.ach]} />
        </Stack>
      </Stack>
    );
  },
);

const capitalizeFirstLetterOnly = (
  string: AccountRoleTaskItemStatus | string,
) => {
  if (!string) {
    return '';
  }
  string = string.toLowerCase();
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const TaskStatus: FC<{ status: AccountRoleTaskItemStatus }> = ({ status }) => {
  const computedStyles = (): SxProps => ({
    fontWeight: 600,
    fontSize: 12,
    lineHeight: 1,
    textAlign: 'center',
    width: 120,
    borderRadius: 1,
    py: 0.75,
    flexShrink: 0,
    background: () => {
      switch (status) {
        case AccountRoleTaskItemStatus.confirmed:
          return 'rgba(0, 94, 161, 0.1)';
        case AccountRoleTaskItemStatus.finished:
          return 'rgba(105, 192, 165, 0.1)';
        case AccountRoleTaskItemStatus.unfinished:
          return 'rgba(144, 149, 163, 0.2)';
        default:
          return 'transparent';
      }
    },
    color: () => {
      switch (status) {
        case AccountRoleTaskItemStatus.confirmed:
          return 'rgba(0, 94, 161, 1)';
        case AccountRoleTaskItemStatus.finished:
          return 'rgba(105, 192, 165, 1)';
        case AccountRoleTaskItemStatus.unfinished:
          return 'text.primary';
        default:
          return 'text.primary';
      }
    },
  });

  return <Box sx={computedStyles()}>{capitalizeFirstLetterOnly(status)}</Box>;
};
