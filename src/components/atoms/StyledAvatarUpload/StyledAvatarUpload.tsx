import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import { Fade, Icon, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { createUseStyles } from 'react-jss';
import { Cropper, ReactCropperElement } from 'react-cropper';
import 'cropperjs/dist/cropper.css';
import { useAsyncFn } from 'react-use';

import { useSwitch } from '@/hooks';
import { _updateAvatar, _uploadAvatar } from '@/requests';
import { userpool } from '@/constants';

import { StyledButton, StyledDialog } from '@/components/atoms';

import ICON_UPLOAD from './icon_upload.svg';

export interface StyledAvatarUploadProps {
  fileSize?: number;
  aspectRatio?: number;
}

export interface StyledAvatarUploadRef {
  open: () => void;
}

const avatarStyle = createUseStyles({
  outer: {
    display: 'block',
    position: 'relative',
    height: 48,
    width: 48,
    cursor: 'pointer',
    borderRadius: '50%',
  },
  inner: {
    display: 'block',
    position: 'relative',
    height: 120,
    width: 120,
    borderRadius: '50%',
    cursor: 'pointer',
  },
});

export const StyledAvatarUpload = forwardRef<
  StyledAvatarUploadRef,
  StyledAvatarUploadProps
>(({ fileSize = 1024 * 1024 * 10, aspectRatio = 1 }, ref) => {
  const imageStyle = avatarStyle();
  const { enqueueSnackbar } = useSnackbar();

  const { open, visible, close } = useSwitch(false);

  const [avatarUrl, setAvatarUrl] = useState(
    userpool.getLastAuthUserInfo(userpool.getLastAuthUserId(), 'avatar'),
  );

  const {
    open: clipOpen,
    visible: clipVisible,
    close: clipClose,
  } = useSwitch(false);

  const cropperRef = useRef<ReactCropperElement>(null);
  const uploadTrigger = useRef<HTMLInputElement>(null);

  const [fileName, setFileName] = useState('');
  const [imageSrc, setImageSrc] = useState('');
  const [loading, setLoading] = useState(false);
  const [showMask, setShowMask] = useState(false);

  const handledClickUpload = useCallback(() => {
    if (uploadTrigger.current!.value) {
      uploadTrigger.current!.value = '';
    }
    uploadTrigger.current!.click();
  }, []);

  const [, uploadAvatar] = useAsyncFn(
    async (formData) => {
      setLoading(true);
      return await _uploadAvatar(formData)
        .then(async ({ data }) => {
          if (Array.isArray(data)) {
            await _updateAvatar({ avatar: data[0].url });
            setAvatarUrl(data[0].url);
            userpool.setLastAuthUserInfo(
              userpool.getLastAuthUserId(),
              'avatar',
              data[0].url,
            );
          }
          setLoading(false);
          close();
          clipClose();
          const lastAuthId = userpool.getLastAuthUserId();
          if (lastAuthId) {
            await userpool.refreshToken(lastAuthId);
          }
        })
        .catch(({ message }) => {
          enqueueSnackbar(message ?? 'Upload error', {
            variant: 'error',
            onClose: () => {
              close();
              clipClose();
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
      open();
      await uploadAvatar(formData);
    });
  }, [fileName, open, uploadAvatar]);

  useImperativeHandle(ref, () => {
    return { open };
  });

  return (
    <Stack alignItems={'center'} justifyContent={'center'} py={2}>
      <picture className={imageStyle.outer} onClick={open}>
        <img
          alt={'avatar'}
          src={avatarUrl ?? '/images/placeholder_avatar.png'}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            border: '1px solid #D2D6E1',
          }}
        />
      </picture>

      <StyledDialog
        content={
          <Stack alignItems={'center'} gap={1.5} py={3}>
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
                if (file.size > fileSize) {
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
              className={imageStyle.inner}
              onClick={handledClickUpload}
              onMouseEnter={() => setShowMask(true)}
              onMouseLeave={() => setShowMask(false)}
            >
              <img
                alt={'avatar'}
                src={avatarUrl || '/images/placeholder_avatar.png'}
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                }}
              />
              <img
                alt={'camera'}
                src="/images/icon_camera.png"
                style={{
                  position: 'absolute',
                  right: 0,
                  bottom: 0,
                  width: 32,
                  height: 32,
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
                <Icon component={ICON_UPLOAD} sx={{ width: 20, height: 20 }} />
              </Stack>
            </picture>

            <Typography
              color={'text.secondary'}
              fontSize={12}
              mt={1.5}
              textAlign={'center'}
            >
              JPEG (.jpeg, .jpg) and PNG (.png) formats accepted, up to 3 MB.
            </Typography>

            <Fade
              in={!!avatarUrl}
              style={{
                display: !avatarUrl ? 'none' : 'block',
              }}
            >
              <Typography
                color={'#5B76BC'}
                fontSize={12}
                onClick={async () => {
                  setImageSrc('');
                  await _updateAvatar({ avatar: '' });
                  userpool.setLastAuthUserInfo(
                    userpool.getLastAuthUserId(),
                    'avatar',
                    '',
                  );
                  setAvatarUrl('');
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
        }
        footer={
          <Stack flexDirection={'row'} gap={1.5}>
            <StyledButton
              color={'info'}
              onClick={close}
              size={'small'}
              variant={'outlined'}
            >
              Cancel
            </StyledButton>
          </Stack>
        }
        header={<Typography variant={'h6'}>Change avatar</Typography>}
        open={visible}
      />

      <StyledDialog
        content={
          <Stack height={400} position={'relative'} width={'100%'}>
            <Cropper
              aspectRatio={aspectRatio}
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
});
