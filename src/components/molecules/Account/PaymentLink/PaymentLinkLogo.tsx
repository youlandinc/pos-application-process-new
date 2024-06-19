import { ChangeEvent, DragEvent, FC, useCallback, useState } from 'react';
import { Icon, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import { AUTO_HIDE_DURATION } from '@/constants';
import { useSessionStorageState } from '@/hooks';

import { StyledButton, StyledLoading } from '@/components/atoms';

import { HttpError } from '@/types';
import { _updatePaymentLinkLogo } from '@/requests';

import UPLOAD_SVG from '@/svg/upload/upload.svg';

export const PaymentLinkLogo: FC<{ imgSrc: string }> = ({
  imgSrc = '/images/logo/logo_blue.svg',
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { saasState } = useSessionStorageState('tenantConfig');

  const [innerImgSrc, setInnerImgSrc] = useState(imgSrc);

  const [isDragging, setIsDragging] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const validatorFileSize = useCallback(
    (files: FileList) => {
      let flag = true;
      Array.from(files).some((item) => {
        if (item.size / 1024 / 1024 > 10) {
          enqueueSnackbar('File size cannot exceed 100MB.', {
            header: 'Upload Failed',
            variant: 'error',
            autoHideDuration: AUTO_HIDE_DURATION,
            isSimple: false,
          });
          flag = false;
          return true;
        }
      });
      return flag;
    },
    [enqueueSnackbar],
  );

  const stopDefaults = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const dragEvents = {
    onDragEnter: (e: DragEvent) => {
      stopDefaults(e);
      setIsDragging(true);
    },
    onDragLeave: (e: DragEvent) => {
      stopDefaults(e);
      setIsDragging(false);
    },
    onDragOver: (e: DragEvent) => {
      stopDefaults(e);
      setIsDragging(true);
    },
    onDrop: async (e: DragEvent<HTMLElement>) => {
      if (uploadLoading) {
        return;
      }
      stopDefaults(e);
      if (e.dataTransfer.files && validatorFileSize(e.dataTransfer.files)) {
        await handleUpload(e.dataTransfer.files);
      }
    },
  };

  const handleUpload = useCallback(
    async (files: FileList) => {
      setUploadLoading(true);
      setIsDragging(false);

      try {
        const formData = new FormData();
        formData.append('file', files[0], files[0].name);
        const { data } = await _updatePaymentLinkLogo(formData);
        setInnerImgSrc(data.url);
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      } finally {
        setUploadLoading(false);
      }
    },
    [enqueueSnackbar],
  );

  const handleChange = useCallback(
    async (event: ChangeEvent<HTMLInputElement>) => {
      event.preventDefault();
      if (event.target.files && validatorFileSize(event.target.files)) {
        await handleUpload(event.target.files);
        event.target.value = '';
      }
    },
    [handleUpload, validatorFileSize],
  );

  return (
    <Stack
      border={'1px solid #D2D6E1'}
      borderRadius={2}
      component={'form'}
      gap={{ xs: 2, md: 3 }}
      p={{ xs: 2, md: 3 }}
    >
      <Typography
        color={'text.primary'}
        component={'div'}
        fontSize={{ xs: 16, lg: 18 }}
        fontWeight={600}
      >
        Current logo
        <Typography
          color={'text.secondary'}
          component={'p'}
          fontSize={{ xs: 12, lg: 14 }}
          mt={1}
        >
          The logo below will be displayed on your payment link and any emails
          the system sends to the borrower or broker.
        </Typography>
      </Typography>

      <picture
        style={{ height: 32, width: 'auto', maxWidth: 280, marginBottom: 12 }}
      >
        <img
          alt=""
          height={'100%'}
          loading={'eager'}
          src={innerImgSrc}
          width={'auto'}
        />
      </picture>

      <Typography
        color={'text.primary'}
        component={'div'}
        fontSize={{ xs: 16, lg: 18 }}
        fontWeight={600}
      >
        Upload new logo
        <Typography
          color={'text.secondary'}
          component={'p'}
          fontSize={{ xs: 12, lg: 14 }}
          mt={1}
        >
          Please drag the box to the edges of your logo. Horizontal images with
          an aspect ratio of around 3:1 look the best.
        </Typography>
      </Typography>

      <Stack
        sx={{
          borderRadius: 2,
          overflow: 'hidden',
          outline: isDragging
            ? `2px dashed hsla(${
                saasState?.posSettings?.h ?? 222
              },42%,55%,1) !important`
            : '1px dashed #D2D6E1 !important',
        }}
      >
        <input
          accept={'image/*,image/svg+xml'}
          hidden
          id="file-upload"
          onChange={handleChange}
          type="file"
        />
        <StyledButton
          color={'inherit'}
          disabled={uploadLoading}
          sx={{
            bgcolor: 'transparent',
            '&.MuiButton-root.Mui-disabled': {
              bgcolor: 'transparent !important',
            },
            minHeight: 172,
            height: 'auto !important',
          }}
        >
          {uploadLoading ? (
            <StyledLoading sx={{ color: 'text.grey' }} />
          ) : (
            <Stack
              alignItems={'center'}
              component={'label'}
              flexDirection={{ xs: 'column', md: 'row' }}
              gap={3}
              height={{ xs: 'auto', md: '100%' }}
              htmlFor={'file-upload'}
              p={'24px 48px'}
              width={'100%'}
              {...dragEvents}
            >
              <Icon component={UPLOAD_SVG} sx={{ width: 132, height: 92 }} />
              <Typography
                color={'text.secondary'}
                component={'div'}
                textAlign={{ xs: 'center', md: 'left' }}
                variant={'body2'}
              >
                <b>Drop</b> your image here, or <b>browse</b>
                <Typography color={'text.secondary'} mt={1} variant={'body2'}>
                  Supports: PNG, SVG
                </Typography>
              </Typography>
            </Stack>
          )}
        </StyledButton>
      </Stack>
    </Stack>
  );
};
