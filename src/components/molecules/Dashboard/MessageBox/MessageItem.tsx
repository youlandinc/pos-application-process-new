import { FC } from 'react';
import { Avatar, Stack, Typography } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { ChatMessageItem, RoleEnum } from '@/types/account/notification';
import { POSFormatDate } from '@/utils';

const ROLE_HASH: { [key in RoleEnum]: string } = {
  [RoleEnum.admin]: 'Admin',
  [RoleEnum.executive]: 'Account executive',
  [RoleEnum.processor]: 'Processor',
};

export const MessageItem: FC<ChatMessageItem> = observer(
  ({
    firstName = 'A',
    lastName = 'B',
    //name = '',
    avatar = '',
    backgroundColor = '',
    operatorId = '',
    operationTime = '',
    content = '',
    role = RoleEnum.admin,
    docName = '',
  }) => {
    const { userProfile } = useMst();

    const isSelf = userProfile?.userId == operatorId;

    return (
      <Stack
        bgcolor={isSelf ? '#E4ECFF' : '#F1F1F1'}
        borderRadius={2}
        gap={1}
        ml={isSelf ? 'auto' : 0}
        p={1.5}
        width={'80%'}
      >
        {!isSelf && (
          <Stack alignItems={'center'} flexDirection={'row'} gap={1}>
            <Avatar
              alt={`${
                firstName ? firstName?.[0]?.toUpperCase() : ''
              }${lastName ? lastName[0]?.toUpperCase() : ''}`}
              src={avatar ? avatar : ''}
              sx={{
                width: 24,
                height: 24,
                mr: 0.5,
                bgcolor: backgroundColor,
                fontSize: 12,
              }}
            >
              {`${
                firstName ? firstName?.[0]?.toUpperCase() : ''
              }${lastName ? lastName[0]?.toUpperCase() : ''}`}
            </Avatar>
            <Typography variant={'subtitle3'}>
              {firstName} {lastName}
            </Typography>
            <Typography color={'text.secondary'} variant={'body3'}>
              {ROLE_HASH[role as RoleEnum]}
            </Typography>
            <Typography color={'text.secondary'} variant={'body3'}>
              {POSFormatDate(operationTime, 'MM/dd/yyyy hh:mm a')}
            </Typography>
          </Stack>
        )}
        <Typography ml={!isSelf ? 4.25 : 0} variant={'body3'}>
          {content}
        </Typography>
        {!isSelf ? (
          <Typography
            color={'text.secondary'}
            ml={'auto'}
            textAlign={'right'}
            variant={'body3'}
          >
            {docName}
          </Typography>
        ) : (
          <Typography color={'text.secondary'} variant={'body3'}>
            {POSFormatDate(operationTime, 'MM/dd/yyyy hh:mm a')}
          </Typography>
        )}
      </Stack>
    );
  },
);
