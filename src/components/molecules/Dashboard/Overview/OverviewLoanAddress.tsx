import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
// import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import {
  useBreakpoints,
  useGoogleStreetViewAndMap,
  useRenderPdf,
  useSwitch,
} from '@/hooks';

import { AUTO_HIDE_DURATION } from '@/constants';
import { POSGetParamsFromUrl } from '@/utils';

import { StyledButton, StyledDialog } from '@/components/atoms';

import { AddressData, HttpError } from '@/types';
import { _fetchFile } from '@/requests/application';

interface OverviewLoanAddressProps {
  propertyAddress?: AddressData;
  isCustom?: boolean;
}

export const OverviewLoanAddress: FC<OverviewLoanAddressProps> = ({
  propertyAddress,
  isCustom,
}) => {
  const breakpoints = useBreakpoints();
  // const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const pdfFile = useRef(null);
  const { renderFile } = useRenderPdf(pdfFile);

  const mapRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<HTMLDivElement>(null);

  const {
    open: previewOpen,
    close: previewClose,
    visible: previewVisible,
  } = useSwitch(false);

  const [viewLoading, setViewLoading] = useState<boolean>(false);

  const getPDF = useCallback(
    async (fileType: 'letter' | 'summary') => {
      setViewLoading(true);
      const { loanId } = POSGetParamsFromUrl(location.href);
      if (!loanId) {
        return;
      }
      try {
        const { data } = await _fetchFile(loanId, fileType);
        previewOpen();
        setTimeout(() => {
          renderFile(data);
        }, 100);
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      } finally {
        setViewLoading(false);
      }
    },
    [enqueueSnackbar, previewOpen, renderFile],
  );

  const { relocate, reset: resetMap } = useGoogleStreetViewAndMap(
    propertyAddress?.lat,
    propertyAddress?.lng,
    mapRef,
    panoramaRef,
  );

  useEffect(
    () => {
      if (propertyAddress?.lng || propertyAddress?.lat) {
        return;
      }
      relocate(propertyAddress?.lat || 0, propertyAddress?.lng || 0);
      return () => {
        resetMap();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [propertyAddress?.lat, propertyAddress?.lng, relocate],
  );

  useEffect(() => {
    relocate(propertyAddress?.lat || 0, propertyAddress?.lng || 0);
    return () => {
      resetMap();
    };
  }, [propertyAddress?.lat, propertyAddress?.lng, relocate, resetMap]);

  return (
    <Stack
      alignItems={'center'}
      border={'1px solid #D2D6E1'}
      borderRadius={2}
      gap={3}
      p={3}
      width={{ xs: '100%', xl: 'calc(33% - 12px)' }}
    >
      <Box
        borderRadius={1}
        display={'none'}
        height={240}
        id={'map2'}
        ref={panoramaRef}
        width={'100%'}
      />
      <Box
        borderRadius={1}
        flex={1}
        id={'map'}
        minHeight={140}
        ref={mapRef}
        width={'100%'}
      />
      <Stack gap={0.5} width={'100%'}>
        <Typography
          color={'primary.brightness'}
          variant={'subtitle1'}
          width={'100%'}
        >
          Address
        </Typography>
        <Typography
          color={'primary.darker'}
          variant={['xs', 'sm', 'md'].includes(breakpoints) ? 'h7' : 'h6'}
          width={'100%'}
        >
          {`${propertyAddress?.address ? `${propertyAddress?.address}, ` : ''}${
            propertyAddress?.aptNumber ? `#${propertyAddress?.aptNumber}` : ''
          }${propertyAddress?.city ? `${propertyAddress?.city}, ` : ''}${
            propertyAddress?.state ? `${propertyAddress?.state} ` : ''
          }${propertyAddress?.postcode ? `${propertyAddress?.postcode}` : ''}`}
        </Typography>
      </Stack>

      {!isCustom && (
        <StyledButton
          color={'info'}
          disabled={viewLoading}
          loading={viewLoading}
          onClick={() => getPDF('letter')}
          sx={{
            '&.MuiButton-outlined': {
              padding: '16px 0',
            },
            width: '100%',
          }}
          variant={'outlined'}
        >
          View pre-approval letter
        </StyledButton>
      )}

      <StyledDialog
        content={<Box py={10} ref={pdfFile} />}
        disableEscapeKeyDown
        header={
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            pb={3}
          >
            <Typography variant={'h6'}>Pre-approval letter</Typography>
            <StyledButton isIconButton onClick={previewClose}>
              <CloseOutlined />
            </StyledButton>
          </Stack>
        }
        open={previewVisible}
        sx={{
          '& .MuiPaper-root': {
            maxWidth: { lg: '900px !important', xs: '100% !important' },
            width: '100%',
            '& .MuiDialogTitle-root, & .MuiDialogActions-root': {
              bgcolor: '#F5F8FA',
              p: 3,
            },
          },
        }}
      />
    </Stack>
  );
};
