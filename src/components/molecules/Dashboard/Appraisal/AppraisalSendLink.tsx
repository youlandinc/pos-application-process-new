import { FC, useCallback, useState } from 'react';
import { Fade, Icon, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useAsync } from 'react-use';

import { AUTO_HIDE_DURATION } from '@/constants';

import { POSFormatDollar, POSGetParamsFromUrl } from '@/utils';
import { useBreakpoints } from '@/hooks';

import { StyledButton, StyledTextField } from '@/components/atoms';

import { HttpError } from '@/types';
import {
  _fetchAppraisalPaymentLinkInfo,
  _sendAppraisalPaymentLink,
} from '@/requests/dashboard';

import ICON_LINK from './icon_link.svg';

export const AppraisalSendLink: FC<{
  backStep: () => Promise<void>;
  backState: boolean;
}> = ({ backStep, backState }) => {
  const { enqueueSnackbar } = useSnackbar();
  const breakpoint = useBreakpoints();

  const [productName, setProductName] = useState<string>('');
  const [appraisalFee, setAppraisalFee] = useState<number>(0);
  const [isExpedited, setIsExpedited] = useState<boolean>(false);
  const [expeditedFee, setExpeditedFee] = useState<number>(0);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);

  const [sendLoading, setSendLoading] = useState<boolean>(false);
  const [sendEmail, setSendEmail] = useState<string>('');

  const [paymentLink, setPaymentLink] = useState<string>('');

  const { loading } = useAsync(async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    try {
      const {
        data: {
          appraisalFee,
          expeditedFee,
          isExpedited,
          paymentAmount,
          paymentLink,
          productName,
        },
      } = await _fetchAppraisalPaymentLinkInfo(loanId);
      setProductName(productName);
      setAppraisalFee(appraisalFee);
      setIsExpedited(isExpedited);
      setExpeditedFee(expeditedFee);
      setPaymentAmount(paymentAmount);

      setPaymentLink(paymentLink);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  }, []);

  const onClickToSendEmail = useCallback(async () => {
    setSendLoading(true);
    try {
      const { loanId } = POSGetParamsFromUrl(location.href);
      await _sendAppraisalPaymentLink({ loanId, email: sendEmail });
      enqueueSnackbar('Email sent successfully', {
        variant: 'success',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setSendLoading(false);
    }
  }, [enqueueSnackbar, sendEmail]);

  return (
    <Fade in={!loading}>
      <Stack flexDirection={'row'} gap={6} width={'100%'}>
        <Stack gap={3} maxWidth={900} width={'100%'}>
          <Typography color={'text.primary'} fontSize={{ xs: 20, lg: 24 }}>
            Property appraisal
          </Typography>

          {!['xl', 'xxl'].includes(breakpoint) && (
            <Stack
              border={'1px solid #E4E7EF'}
              borderRadius={2}
              height={'fit-content'}
              maxWidth={600}
              p={3}
              width={'100%'}
            >
              <Typography fontSize={{ xs: 16, lg: 20 }} fontWeight={600}>
                Waiting for payment
              </Typography>

              <Stack
                borderBottom={'1px solid #D2D6E1'}
                flexDirection={'row'}
                gap={3}
                justifyContent={'space-between'}
                mt={{ xs: 0, lg: 1 }}
                py={1.5}
              >
                <Typography fontSize={{ xs: 12, lg: 14 }} fontWeight={600}>
                  {productName}
                </Typography>
                <Typography fontSize={{ xs: 12, lg: 14 }}>
                  {POSFormatDollar(appraisalFee)}
                </Typography>
              </Stack>

              {isExpedited && (
                <Stack
                  borderBottom={'1px solid #D2D6E1'}
                  flexDirection={'row'}
                  justifyContent={'space-between'}
                  py={1.5}
                >
                  <Typography fontSize={14} fontWeight={600}>
                    Expedited fee
                  </Typography>
                  <Typography fontSize={14}>
                    {POSFormatDollar(expeditedFee)}
                  </Typography>
                </Stack>
              )}

              <Typography
                color={'#365EC6'}
                fontSize={{ xs: 16, lg: 18 }}
                fontWeight={600}
                mt={1.5}
                textAlign={'right'}
              >
                Total: {POSFormatDollar(paymentAmount)}
              </Typography>
            </Stack>
          )}

          <Stack gap={1.5} width={'100%'}>
            <Typography color={'text.primary'} fontSize={{ xs: 12, lg: 14 }}>
              Please use the methods below to invite the borrower to pay. Once
              the appraisal payment is received, we will place the order for
              you.
            </Typography>

            <Typography
              color={'text.primary'}
              fontSize={{ xs: 14, lg: 16 }}
              fontWeight={600}
              mt={{ xs: 1.5, lg: 3 }}
            >
              Invite the borrower to pay:
            </Typography>

            <StyledTextField
              label={"Borrower's email address"}
              onChange={(e) => setSendEmail(e.target.value)}
              placeholder={"Borrower's email address"}
              sx={{ mt: { xs: 0.5, lg: 1.5 }, maxWidth: 600 }}
              value={sendEmail}
            />

            <StyledButton
              disabled={!sendEmail || sendLoading}
              loading={sendLoading}
              onClick={onClickToSendEmail}
              size={'large'}
              sx={{ mt: 1.5, maxWidth: 276 }}
            >
              Send email
            </StyledButton>

            <Typography
              color={'text.primary'}
              fontSize={{ xs: 14, lg: 16 }}
              fontWeight={600}
              mt={{ xs: 1.5, lg: 3 }}
            >
              Copy payment link:
            </Typography>

            <Stack
              alignItems={'center'}
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              flexDirection={'row'}
              gap={3}
              justifyContent={'space-between'}
              maxWidth={600}
              mt={{ xs: 0.5, lg: 1.5 }}
              onClick={async () => {
                await navigator.clipboard.writeText(paymentLink);
                enqueueSnackbar('Payment link copied', {
                  variant: 'success',
                  autoHideDuration: AUTO_HIDE_DURATION,
                });
              }}
              p={'16px 20px'}
              sx={{
                '&:hover': {
                  background: '#F4F6FA',
                  cursor: 'pointer',
                },
              }}
              width={'100%'}
            >
              <Typography
                color={'text.primary'}
                fontSize={{ xs: 12, lg: 14 }}
                sx={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {paymentLink}
              </Typography>

              <Icon
                component={ICON_LINK}
                sx={{
                  width: { xs: 20, lg: 24 },
                  height: { xs: 20, lg: 24 },
                  flexShrink: 0,
                }}
              />
            </Stack>
          </Stack>

          <StyledButton
            color={'info'}
            disabled={backState}
            loading={backState}
            onClick={backStep}
            size={'large'}
            sx={{ width: '100%', mt: 3, maxWidth: 276 }}
            variant={'text'}
          >
            Back
          </StyledButton>
        </Stack>

        {['xl', 'xxl'].includes(breakpoint) && (
          <Stack
            border={'1px solid #E4E7EF'}
            borderRadius={2}
            height={'fit-content'}
            maxWidth={500}
            p={3}
            width={'100%'}
          >
            <Typography fontSize={{ xs: 16, lg: 20 }} fontWeight={600}>
              Waiting for payment
            </Typography>

            <Stack
              borderBottom={'1px solid #D2D6E1'}
              flexDirection={'row'}
              gap={3}
              justifyContent={'space-between'}
              mt={{ xs: 0, lg: 1 }}
              py={1.5}
            >
              <Typography fontSize={{ xs: 12, lg: 14 }} fontWeight={600}>
                {productName}
              </Typography>
              <Typography fontSize={{ xs: 12, lg: 14 }}>
                {POSFormatDollar(appraisalFee)}
              </Typography>
            </Stack>

            {isExpedited && (
              <Stack
                borderBottom={'1px solid #D2D6E1'}
                flexDirection={'row'}
                justifyContent={'space-between'}
                py={1.5}
              >
                <Typography fontSize={14} fontWeight={600}>
                  Expedited fee
                </Typography>
                <Typography fontSize={14}>
                  {POSFormatDollar(expeditedFee)}
                </Typography>
              </Stack>
            )}

            <Typography
              color={'#365EC6'}
              fontSize={{ xs: 16, lg: 18 }}
              fontWeight={600}
              mt={1.5}
              textAlign={'right'}
            >
              Total: {POSFormatDollar(paymentAmount)}
            </Typography>
          </Stack>
        )}
      </Stack>
    </Fade>
  );
};
