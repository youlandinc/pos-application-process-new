import React, { FC, useMemo } from 'react';
import { Stack, Typography } from '@mui/material';
import { format, parseISO } from 'date-fns';

import { DashboardDocumentComment } from '@/types';

import { StyledAvatar } from '@/components/atoms';

type StyledHistoryItemProps = DashboardDocumentComment;

export const StyledHistoryItem: FC<StyledHistoryItemProps> = ({
  firstName = '',
  lastName = '',
  avatar = '',
  operationTime = '',
  backgroundColor = '',
  note = '',
  name = '',
}) => {
  const reducedName = useMemo(() => {
    if (firstName || lastName) {
      return `${firstName} ${lastName}`;
    }
    return name;
  }, [firstName, lastName, name]);

  return (
    <Stack
      borderBottom={'1px solid #D2D6E1'}
      mt={1.5}
      pb={1.5}
      sx={{
        '&:last-of-type': {
          borderBottom: 'none',
        },
      }}
    >
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        justifyContent={'space-between'}
      >
        <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
          <StyledAvatar
            avatar={avatar || ''}
            backgroundColor={backgroundColor || ''}
            firstName={firstName || ''}
            fontSize={12}
            height={32}
            isSelf={false}
            lastName={lastName || ''}
            width={32}
          />
          <Typography color={'text.primary'} pb={1} variant={'subtitle2'}>
            {reducedName}
          </Typography>
        </Stack>
        <Typography color={'text.secondary'} pb={1} variant={'body3'}>
          {operationTime &&
            format(parseISO(operationTime), "MMMM dd, yyyy 'at' h:mm a")}
        </Typography>
      </Stack>
      <Typography color={'text.primary'} ml={5.5} variant={'body3'}>
        {note}
      </Typography>
    </Stack>
  );
};
