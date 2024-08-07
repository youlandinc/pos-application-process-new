import React, { FC, useCallback, useMemo } from 'react';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { StyledAvatar } from '@/components/atoms';
import { NotificationMessageItem } from '@/types/account/notification';
import { useMst } from '@/models/Root';

type MessageItemProps = NotificationMessageItem & {
  cb?: () => Promise<void>;
  clickLoading?: boolean;
};

export const MessageItem: FC<MessageItemProps> = ({
  avatar,
  backgroundColor,
  firstName,
  isRead,
  lastName,
  name,
  note,
  clickLoading,
  //operationTime,
  dateFromNow,
  cb,
  variables: { loanId, categoryKey, fileId, fileName },
}) => {
  const store = useMst();
  const router = useRouter();
  const reducedName = useMemo(() => {
    if (firstName || lastName) {
      return `${firstName} ${lastName}`;
    }
    return name;
  }, [firstName, lastName, name]);

  const onClickToReadMessageAndRedirect = useCallback(async () => {
    if (clickLoading) {
      return;
    }
    store.setNotificationDocument({
      categoryKey,
      fileId,
      fileName,
    });

    await cb?.();
    if (router.pathname === '/dashboard/documents') {
      return;
    }
    await router.push({
      pathname: '/dashboard/documents',
      query: {
        loanId,
      },
    });
  }, [categoryKey, cb, clickLoading, fileId, fileName, loanId, router, store]);

  return (
    <Stack
      flexDirection={'row'}
      gap={1.5}
      onClick={onClickToReadMessageAndRedirect}
      px={3}
      py={1.5}
      sx={{
        '&:hover': {
          bgcolor: 'primary.lightest',
        },
      }}
      width={'100%'}
    >
      <Stack flexShrink={0}>
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
      </Stack>

      <Stack flex={1} minWidth={0}>
        <Stack flex={1} flexDirection={'row'}>
          <Typography flex={1} fontWeight={600} variant={'body3'}>
            {reducedName}
          </Typography>
          <Typography
            color={'text.secondary'}
            flexShrink={0}
            fontSize={10}
            textAlign={'right'}
            textOverflow={'nowrap'}
          >
            {dateFromNow}
          </Typography>
        </Stack>

        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          flexShrink={0}
          gap={1}
          whiteSpace={'nowrap'}
        >
          <Typography
            color={'text.primary'}
            py={0.5}
            sx={{
              minWidth: 0,
              width: 'auto',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
            variant={'body3'}
          >
            {note}
          </Typography>
          {!isRead && (
            <Stack
              bgcolor={'error.main'}
              borderRadius={'50%'}
              height={8}
              ml={'auto'}
              width={8}
            />
          )}
        </Stack>

        <Typography
          borderTop={'1px solid #D2D6E1'}
          color={'text.secondary'}
          fontSize={10}
          pt={0.5}
          sx={{
            minWidth: 0,
            width: 'auto',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {fileName}
        </Typography>
      </Stack>
    </Stack>
  );
};
