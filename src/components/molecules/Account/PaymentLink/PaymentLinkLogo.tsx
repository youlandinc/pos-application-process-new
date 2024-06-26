import React, { DragEvent, FC, useCallback, useRef, useState } from 'react';
import { Icon, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import { AUTO_HIDE_DURATION } from '@/constants';
import { useSessionStorageState, useSwitch } from '@/hooks';

import { StyledButton, StyledDialog, StyledLoading } from '@/components/atoms';

import { HttpError } from '@/types';
import { _updatePaymentLinkLogo } from '@/requests';

import UPLOAD_SVG from '@/svg/upload/upload.svg';
import { Cropper, ReactCropperElement } from 'react-cropper';

export const PaymentLinkLogo: FC<{ imgSrc: string }> = ({
  imgSrc = '/images/logo/logo_blue.svg',
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { saasState } = useSessionStorageState('tenantConfig');

  const cropperRef = useRef<ReactCropperElement>(null);
  const uploadTrigger = useRef<HTMLInputElement>(null);

  const [fileUrl, setFileUrl] = useState('');
  const [innerImgSrc, setInnerImgSrc] = useState(imgSrc);
  const [fileName, setFileName] = useState('');

  const {
    open: clipOpen,
    visible: clipVisible,
    close: clipClose,
  } = useSwitch(false);

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
      if (uploadTrigger.current!.value) {
        uploadTrigger.current!.value = '';
      }
      if (e.dataTransfer.files && validatorFileSize(e.dataTransfer.files)) {
        await handleChange(e.dataTransfer.files);
      }
    },
  };

  const handleUpload = useCallback(() => {
    if (!cropperRef.current) {
      return;
    }

    const canvas = cropperRef.current.cropper;
    if (!canvas) {
      return;
    }

    canvas.getCroppedCanvas().toBlob(async (blob) => {
      setUploadLoading(true);
      setIsDragging(false);
      try {
        const formData = new FormData();
        formData.append('file', blob as File, fileName);
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
        clipClose();
      }
    });
  }, [clipClose, enqueueSnackbar, fileName]);

  const handleChange = useCallback(
    async (files: FileList | null) => {
      if (!files?.[0]) {
        return;
      }
      const file = files?.[0];
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
        setFileUrl(url);
        clipOpen();
      };
    },
    [clipOpen, enqueueSnackbar],
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
          onChange={async (e) => {
            e.stopPropagation();
            e.preventDefault();
            await handleChange(e.target.files);
          }}
          ref={uploadTrigger}
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
              sx={{ cursor: 'pointer' }}
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

      <StyledDialog
        content={
          <Stack height={400} position={'relative'} width={'100%'}>
            <Cropper
              autoCropArea={1}
              background={true}
              center
              dragMode="move"
              guides={true}
              preview=".uploadCrop"
              ref={cropperRef}
              rotatable={true}
              src={fileUrl || ''}
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
                if (uploadTrigger.current!.value) {
                  uploadTrigger.current!.value = '';
                }
                clipClose();
                setFileUrl('');
              }}
              size={'small'}
              variant={'outlined'}
            >
              Cancel
            </StyledButton>
            <StyledButton
              color={'primary'}
              disabled={uploadLoading}
              loading={uploadLoading}
              onClick={handleUpload}
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
