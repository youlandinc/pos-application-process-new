import { FC } from 'react';
import { Stack, Typography } from '@mui/material';
import { CloseOutlined, ContentCopy } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

import {
  StyledButton,
  StyledDialog,
  UploadButtonDialog,
} from '@/components/atoms';

interface DialogInsuranceProps extends UploadButtonDialog {
  saasState: any;
  loanNumber?: string;
}

export const DialogInsurance: FC<DialogInsuranceProps> = ({
  visible,
  onClose,
  saasState,
  loanNumber,
}) => {
  const { enqueueSnackbar } = useSnackbar();

  return (
    <StyledDialog
      content={
        <Stack gap={3} my={3}>
          <Stack gap={1.5}>
            <Typography variant={'subtitle2'}>Coverage requirements</Typography>
            <Typography variant={'body3'}>
              Dwelling coverage must cover the loan amount or the replacement
              cost estimate (RCE), whichever of the two is lower.
            </Typography>
          </Stack>
          <Stack>
            <Typography variant={'subtitle2'}>Mortgagee information</Typography>
            <Stack flexDirection={'row'} gap={1} mt={1.5}>
              <Typography variant={'body3'}>
                {saasState?.organizationName || 'YouLand Inc.'} ISAOA/ATIMA
              </Typography>
              <ContentCopy
                onClick={async () => {
                  await navigator.clipboard.writeText(
                    `${saasState?.organizationName || 'YouLand Inc.'} ISAOA/ATIMA
${saasState?.address?.address}${
                      saasState?.address.aptNumber
                        ? `, ${saasState?.address.aptNumber}`
                        : ''
                    }.
${saasState?.address?.city ? `${saasState?.address?.city}, ` : ''}${
                      saasState?.address?.state
                        ? `${saasState?.address?.state}, `
                        : ''
                    }${
                      saasState?.address?.postcode
                        ? `${saasState?.address?.postcode}`
                        : ''
                    }`,
                  );
                  enqueueSnackbar('Copied data to clipboard', {
                    variant: 'success',
                  });
                }}
                sx={{ fontSize: 18, cursor: 'pointer' }}
              />
            </Stack>
            <Typography variant={'body3'}>
              {`${saasState?.address?.address}${
                saasState?.address.aptNumber
                  ? `, ${saasState?.address.aptNumber}`
                  : ''
              }`}
            </Typography>
            <Typography variant={'body3'}>
              {`${
                saasState?.address?.city ? `${saasState?.address?.city}, ` : ''
              }${
                saasState?.address?.state
                  ? `${saasState?.address?.state}, `
                  : ''
              }${
                saasState?.address?.postcode
                  ? `${saasState?.address?.postcode}`
                  : ''
              }`}
            </Typography>
          </Stack>
          <Stack gap={1.5}>
            <Typography variant={'subtitle2'}>Loan number</Typography>
            <Stack flexDirection={'row'} gap={1}>
              <Typography variant={'body3'}>{loanNumber}</Typography>
              <ContentCopy
                onClick={async () => {
                  await navigator.clipboard.writeText(loanNumber!);
                  enqueueSnackbar('Copied data to clipboard', {
                    variant: 'success',
                  });
                }}
                sx={{ fontSize: 18, cursor: 'pointer' }}
              />
            </Stack>
          </Stack>
        </Stack>
      }
      footer={
        <Stack flexDirection={'row'} gap={1}>
          <StyledButton
            autoFocus
            color={'info'}
            onClick={onClose}
            size={'small'}
            sx={{ width: 80 }}
            variant={'outlined'}
          >
            Close
          </StyledButton>
        </Stack>
      }
      header={
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          justifyContent={'space-between'}
        >
          Insurance requirements
          <CloseOutlined
            onClick={onClose}
            sx={{
              cursor: 'pointer',
              '&:hover': {
                color: 'primary.main',
              },
            }}
          />
        </Stack>
      }
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose();
        }
      }}
      open={visible}
      PaperProps={{
        sx: { maxWidth: '800px !important' },
      }}
    />
  );
};
