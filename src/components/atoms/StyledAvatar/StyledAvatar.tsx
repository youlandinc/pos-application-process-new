import React, { FC, useMemo } from 'react';
import { Stack } from '@mui/material';
import { userpool } from '@/constants';

interface StyledAvatarProps {
  width?: number;
  height?: number;
  avatar?: string;
  firstName?: string;
  lastName?: string;
  backgroundColor?: string;
  name?: string;
  isSelf?: boolean;
  fontSize?: number;
}

export const StyledAvatar: FC<StyledAvatarProps> = ({
  width = 48,
  height = 48,
  fontSize = 16,
  avatar,
  firstName,
  lastName,
  backgroundColor,
  name,
  isSelf = true,
}) => {
  const computedParams = useMemo(() => {
    const lastAuthUserId = userpool.getLastAuthUserId();
    const result = {
      avatar,
      backgroundColor,
      name: `${firstName} ${lastName}`,
    };

    if (!avatar) {
      result.avatar = isSelf
        ? userpool.getLastAuthUserInfo(lastAuthUserId, 'avatar')
        : avatar;
    }

    if (!backgroundColor) {
      result.backgroundColor = userpool.getLastAuthUserInfo(
        lastAuthUserId,
        'background',
      );
    }

    const insideFirstName = (
      isSelf
        ? userpool.getLastAuthUserInfo(lastAuthUserId, 'firstName')
        : firstName
    )
      ?.charAt(0)
      .toUpperCase();
    const insideLastName = (
      isSelf
        ? userpool.getLastAuthUserInfo(lastAuthUserId, 'lastName')
        : lastName
    )
      ?.charAt(0)
      .toUpperCase();

    result.name = `${insideFirstName}${insideLastName}`;

    if (!firstName && !lastName && !isSelf) {
      result.name = name || '';
    }

    return result;
  }, [avatar, backgroundColor, firstName, isSelf, lastName, name]);

  return (
    <>
      {computedParams.avatar ? (
        <picture
          style={{
            display: 'block',
            position: 'relative',
            height: height,
            width: width,
            borderRadius: '50%',
            overflow: 'hidden',
          }}
        >
          <img
            alt=""
            src={computedParams.avatar}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </picture>
      ) : computedParams.name ? (
        <Stack
          alignItems={'center'}
          borderRadius={'50%'}
          color={'#ffffff'}
          fontSize={fontSize}
          fontWeight={600}
          height={height}
          justifyContent={'center'}
          pt={0.25}
          sx={{ background: computedParams.backgroundColor }}
          width={width}
        >
          {computedParams.name}
        </Stack>
      ) : (
        <picture
          style={{
            display: 'block',
            position: 'relative',
            height: height,
            width: width,
            borderRadius: '50%',
            overflow: 'hidden',
            border: '1px solid #D2D6E1',
          }}
        >
          <img
            alt=""
            src={'/images/placeholder_avatar.png'}
            style={{
              width: '100%',
              height: '100%',
            }}
          />
        </picture>
      )}
    </>
  );
};
