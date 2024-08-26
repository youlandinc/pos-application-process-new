import {
  FC,
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Box, Icon, Stack, Typography } from '@mui/material';
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

import { AddressData, HttpError, PipelineLoanStageEnum } from '@/types';
import { _downloadFile, _fetchFile } from '@/requests/application';

import NOTIFICATION_INFO from '@/components/atoms/StyledNotification/notification_info.svg';

interface OverviewLoanAddressProps {
  propertyAddress?: AddressData;
  isCustom?: boolean;
  loanStatus: PipelineLoanStageEnum;
  loanDetails: ReactNode;
}

export const OverviewLoanAddress: FC<OverviewLoanAddressProps> = ({
  propertyAddress,
  isCustom,
  loanStatus,
  loanDetails,
}) => {
  const breakpoints = useBreakpoints();
  // const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const pdfFile = useRef(null);
  const { renderFile } = useRenderPdf(pdfFile);

  const mapRef = useRef<HTMLDivElement>(null);
  const panoramaRef = useRef<HTMLDivElement>(null);

  const [hasBorrowerName, setHasBorrowerName] = useState<boolean>(false);

  const {
    open: previewOpen,
    close: previewClose,
    visible: previewVisible,
  } = useSwitch(false);

  const [viewLoading, setViewLoading] = useState<boolean>(false);
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);

  const getPDF = useCallback(
    async (fileType: 'letter' | 'summary') => {
      setViewLoading(true);
      const { loanId } = POSGetParamsFromUrl(location.href);
      if (!loanId) {
        return;
      }
      try {
        const {
          data: { hasBorrowerName, letterHtml },
        } = await _fetchFile(loanId, fileType);
        setHasBorrowerName(hasBorrowerName);
        previewOpen();
        setTimeout(() => {
          renderFile(letterHtml);
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

  const handleDownload = useCallback(async () => {
    const handler = (data: any, fileName?: string) => {
      // file export
      if (!data) {
        return;
      }
      const fileUrl = window.URL.createObjectURL(
        new Blob([data], { type: 'application/octet-stream' }),
      );
      const a = document.createElement('a');
      a.style.display = 'none';
      a.download = fileName || 'Pre-approval-letter.pdf';
      a.href = fileUrl;
      a.click();
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
    };

    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    setDownloadLoading(true);
    try {
      const res = await _downloadFile(loanId);
      handler(res.data);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setDownloadLoading(false);
    }
  }, [enqueueSnackbar]);

  const isDisabled = useMemo(() => {
    if (!isCustom) {
      return viewLoading;
    }
    switch (loanStatus) {
      case PipelineLoanStageEnum.initial_approval:
      case PipelineLoanStageEnum.pre_approved:
      case PipelineLoanStageEnum.preparing_docs:
      case PipelineLoanStageEnum.docs_out:
      case PipelineLoanStageEnum.funded:
        return viewLoading;
      default:
        return viewLoading || isCustom;
    }
  }, [isCustom, loanStatus, viewLoading]);

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
          {`${propertyAddress?.address ? `${propertyAddress?.address} ` : ''}${
            propertyAddress?.aptNumber ? `${propertyAddress?.aptNumber}, ` : ''
          }${propertyAddress?.city ? `${propertyAddress?.city}, ` : ''}${
            propertyAddress?.state ? `${propertyAddress?.state} ` : ''
          }${propertyAddress?.postcode ? `${propertyAddress?.postcode}` : ''}`}
        </Typography>
      </Stack>

      <Stack gap={1} width={'100%'}>
        <StyledButton
          disabled={isDisabled}
          loading={viewLoading}
          onClick={() => getPDF('letter')}
          sx={{
            '&.MuiButton-contained': {
              padding: '16px 0',
            },
            width: '100%',
          }}
        >
          View pre-approval letter
        </StyledButton>
        {isCustom && loanStatus === PipelineLoanStageEnum.scenario && (
          <Typography color={'text.secondary'} variant={'body3'}>
            When using a custom loan amount, the pre-approval letter is only
            available after the loan has passed preliminary underwriting.
          </Typography>
        )}
      </Stack>

      {loanDetails}

      <StyledDialog
        content={
          <Stack py={6} width={'100%'}>
            {!hasBorrowerName && (
              <Stack px={8}>
                <Stack
                  bgcolor={'#F4F7FD'}
                  borderRadius={2}
                  boxShadow={'0 2px 2px rgba(227, 227, 227, 1)'}
                  color={'#636A7C'}
                  flexDirection={'row'}
                  fontSize={{ xs: 12, lg: 14 }}
                  fontWeight={600}
                  gap={1}
                  p={'12px 24px'}
                >
                  <Icon
                    component={NOTIFICATION_INFO}
                    sx={{ mt: { xs: -0.5, lg: -0.25 } }}
                  />
                  Complete the &quot;Borrower&quot; task in the dashboard to
                  include the borrower name in the pre-approval letter.
                </Stack>
              </Stack>
            )}
            <Box pt={3} ref={pdfFile} />
          </Stack>
        }
        disableEscapeKeyDown
        footer={
          <Stack pt={3}>
            <StyledButton
              disabled={downloadLoading}
              loading={downloadLoading}
              onClick={handleDownload}
              sx={{ width: 200 }}
            >
              Download
            </StyledButton>
          </Stack>
        }
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
