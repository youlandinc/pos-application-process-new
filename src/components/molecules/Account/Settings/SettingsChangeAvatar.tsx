import React, { FC, useCallback, useRef, useState } from 'react';
import { Fade, Icon, Stack, Typography } from '@mui/material';
import { Cropper, ReactCropperElement } from 'react-cropper';
import { useAsyncFn } from 'react-use';
import { useSnackbar } from 'notistack';

import { userpool } from '@/constants';
import { useBreakpoints, useSwitch } from '@/hooks';

import { StyledButton, StyledDialog } from '@/components/atoms';

import { AccountUserProfileParams } from '@/types';
import { _updateUserInfoAvatar, _uploadUserInfoAvatar } from '@/requests';

import ICON_UPLOAD from '@/components/molecules/Account/Settings/icon_upload.svg';

interface SettingsChangeAvatarProps {
  store: AccountUserProfileParams;
  dispatch: any;
  backgroundColor: string;
}

export const SettingsChangeAvatar: FC<SettingsChangeAvatarProps> = ({
  store,
  dispatch,
  backgroundColor,
}) => {
  const breakpoints = useBreakpoints();
  const { enqueueSnackbar } = useSnackbar();

  const cropperRef = useRef<ReactCropperElement>(null);
  const uploadTrigger = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMask, setShowMask] = useState(false);

  const {
    open: clipOpen,
    visible: clipVisible,
    close: clipClose,
  } = useSwitch(false);

  const handledClickUpload = useCallback(() => {
    if (uploadTrigger.current!.value) {
      uploadTrigger.current!.value = '';
    }
    uploadTrigger.current!.click();
  }, []);

  const [, uploadAvatar] = useAsyncFn(
    async (formData) => {
      setLoading(true);
      return await _uploadUserInfoAvatar(formData)
        .then(async ({ data }) => {
          if (Array.isArray(data)) {
            const { url } = data[0];

            const result = url.split('?')[0];
            await _updateUserInfoAvatar({ avatar: result });

            dispatch({
              type: 'change',
              payload: { field: 'avatar', value: url },
            });

            userpool.setLastAuthUserInfo(
              userpool.getLastAuthUserId(),
              'avatar',
              result,
            );
          }

          setLoading(false);

          clipClose();

          const lastAuthId = userpool.getLastAuthUserId();

          if (lastAuthId) {
            await userpool.refreshToken(lastAuthId);
          }

          enqueueSnackbar('Profile updated', {
            variant: 'success',
          });
        })
        .catch(({ message }) => {
          enqueueSnackbar(message ?? 'Upload error', {
            variant: 'error',
            onClose: () => {
              clipClose();
              setLoading(false);
            },
          });
        });
    },
    [fileName],
  );

  const handledSaveAndConfirm = useCallback(async () => {
    if (!cropperRef.current) {
      return;
    }
    const canvas = cropperRef.current.cropper;
    if (!canvas) {
      return;
    }
    canvas.getCroppedCanvas().toBlob(async (blob) => {
      const formData = new FormData();
      formData.append('files', blob as File, fileName);
      await uploadAvatar(formData);
    });
  }, [fileName, uploadAvatar]);

  return (
    <Stack
      border={'1px solid #D2D6E1'}
      borderRadius={2}
      gap={{ xs: 1.5, md: 3 }}
      p={{ xs: 2, md: 3 }}
    >
      <Typography fontSize={{ xs: 16, md: 20 }} variant={'h6'}>
        Avatar
      </Typography>

      <Stack alignItems={'center'} flexDirection={'row'} gap={{ xs: 2, md: 3 }}>
        <input
          accept={'image/*'}
          hidden
          onChange={(e) => {
            e.stopPropagation();
            e.preventDefault();
            if (!e.target.files?.[0]) {
              return;
            }
            const file = e.target.files?.[0];
            if (file.size > 1024 * 1024 * 10) {
              enqueueSnackbar('Image size too large', {
                variant: 'warning',
              });
              return;
            }
            setFileName(file.name);
            const url = URL.createObjectURL(file);
            const reader = new FileReader();
            reader.readAsArrayBuffer(file);
            let blob = new Blob(undefined);
            reader.onload = (e1) => {
              const result = e1.target?.result as ArrayBuffer;
              if (typeof result === 'object') {
                blob = new Blob([result]);
              } else {
                blob = result;
              }
              const readerImg = new FileReader();
              readerImg.readAsDataURL(blob);
              setImageSrc(url);
              clipOpen();
            };
          }}
          ref={uploadTrigger}
          type="file"
        />
        <picture
          onClick={handledClickUpload}
          onMouseEnter={() => setShowMask(true)}
          onMouseLeave={() => setShowMask(false)}
          style={{
            display: 'block',
            position: 'relative',
            height: ['xs', 'sm', 'md'].includes(breakpoints) ? 80 : 120,
            width: ['xs', 'sm', 'md'].includes(breakpoints) ? 80 : 120,
            borderRadius: '50%',
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          {store.avatar ? (
            <picture
              style={{
                display: 'block',
                position: 'relative',
                height: '100%',
                width: '100%',
                borderRadius: '50%',
                cursor: 'pointer',
              }}
            >
              <img
                alt={'avatar'}
                src={store.avatar}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                }}
              />
            </picture>
          ) : store.firstName && store.lastName ? (
            <Stack
              alignItems={'center'}
              borderRadius={'50%'}
              color={'white'}
              flexShrink={0}
              fontSize={{ xs: 18, lg: 36 }}
              fontWeight={600}
              height={'100%'}
              justifyContent={'center'}
              lineHeight={1}
              pt={0.5}
              sx={{
                background: backgroundColor,
              }}
              width={'100%'}
            >
              {store.firstName.charAt(0).toUpperCase()}
              {store.lastName.charAt(0).toUpperCase()}
            </Stack>
          ) : (
            <picture
              style={{
                display: 'block',
                position: 'relative',
                height: '100%',
                width: '100%',
                cursor: 'pointer',
              }}
            >
              <img
                alt=""
                src={'/images/placeholder_avatar.png'}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  border: '1px solid #D2D6E1',
                }}
              />
            </picture>
          )}

          <img
            alt={'camera'}
            src="/images/icon_camera.png"
            style={{
              position: 'absolute',
              right: 0,
              bottom: 0,
              width: ['xs', 'sm', 'md'].includes(breakpoints) ? 20 : 30,
              height: ['xs', 'sm', 'md'].includes(breakpoints) ? 20 : 30,
              zIndex: 999,
            }}
          />
          <Stack
            alignItems={'center'}
            bgcolor={'rgba(0,0,0,.2)'}
            borderRadius={'50%'}
            height={'100%'}
            justifyContent={'center'}
            position={'absolute'}
            sx={{ cursor: 'pointer', top: 0, left: 0 }}
            width={'100%'}
            zIndex={showMask ? 99 : -1}
          >
            {showMask && (
              <Icon component={ICON_UPLOAD} sx={{ width: 20, height: 20 }} />
            )}
          </Stack>
        </picture>

        <Stack gap={{ xs: 0.75, md: 1.5 }}>
          <Typography color={'text.secondary'} fontSize={12}>
            JPEG (.jpeg, .jpg) and PNG (.png) formats accepted, up to 3 MB.
          </Typography>

          <Fade
            in={!!store.avatar}
            style={{
              display: !store.avatar ? 'none' : 'block',
            }}
          >
            <Typography
              color={'#5B76BC'}
              fontSize={12}
              onClick={async () => {
                setImageSrc('');
                await _updateUserInfoAvatar({ avatar: '' });

                userpool.setLastAuthUserInfo(
                  userpool.getLastAuthUserId(),
                  'avatar',
                  '',
                );

                dispatch({
                  type: 'change',
                  payload: { field: 'avatar', value: '' },
                });

                const lastAuthId = userpool.getLastAuthUserId();
                if (lastAuthId) {
                  await userpool.refreshToken(lastAuthId);
                }
              }}
              sx={{ cursor: 'pointer' }}
            >
              Remove picture
            </Typography>
          </Fade>
        </Stack>
      </Stack>

      <StyledDialog
        content={
          <Stack height={400} position={'relative'} width={'100%'}>
            <Cropper
              aspectRatio={1}
              autoCropArea={1}
              background={true}
              center
              dragMode="move"
              guides={true}
              preview=".uploadCrop"
              ref={cropperRef}
              rotatable={true}
              src={imageSrc || ''}
              style={{ width: '100%', position: 'absolute', height: 400 }}
              viewMode={1}
              zoomable={true}
            />
          </Stack>
        }
        footer={
          <Stack flexDirection={'row'} gap={1.5} pt={3}>
            <StyledButton
              color={'info'}
              onClick={() => {
                clipClose();
                setImageSrc('');
              }}
              size={'small'}
              variant={'outlined'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              color={'primary'}
              disabled={loading}
              loading={loading}
              onClick={handledSaveAndConfirm}
              size={'small'}
              sx={{ width: 136 }}
              variant={'contained'}
            >
              Save & Confirm
            </StyledButton>
          </Stack>
        }
        header={''}
        open={clipVisible}
      />
    </Stack>
  );
};
