import { useMemo } from 'react';
import { Stack, Step, StepLabel, Stepper, Typography } from '@mui/material';
import { ContentCopy } from '@mui/icons-material';

import {
  StyledButton,
  StyledDialog,
  StyledTextField,
} from '@/components/atoms';
import { EmailDomainData } from '@/types';

const steps = ['Enter email domain', 'Verify ownership', 'Choose username'];

interface PaymentLinkEmailDialogProps {
  activeStep: number;
  domain: string;
  setDomain: (domain: string) => void;
  domainVerifyList: EmailDomainData[];
  userName: string;
  setUserName: (userName: string) => void;
  stepButtonLoading: boolean;
  visible: boolean;
  isSmall: boolean;
  onCancelDialog: () => void;
  onClickContinue: () => void;
  onClickVerify: () => void;
  onClickSave: () => void;
  onClickCopy: (type: string, text: string) => void;
}

export const PaymentLinkEmailDialog = ({
  activeStep,
  domain,
  setDomain,
  domainVerifyList,
  userName,
  setUserName,
  stepButtonLoading,
  visible,
  isSmall,
  onCancelDialog,
  onClickContinue,
  onClickVerify,
  onClickSave,
  onClickCopy,
}: PaymentLinkEmailDialogProps) => {
  const smallVerifyList = useMemo(() => {
    return (
      <>
        {domainVerifyList.map((item, index) => (
          <Stack
            gap={{ xs: 1.5, lg: 3 }}
            key={`mobile_verifyList_${index}_${item.recordName}`}
            sx={{
              '&:not(:last-of-type)': {
                borderBottom: '1px solid #D2D6E1',
                pb: { xs: 1.5, lg: 3 },
              },
            }}
          >
            <Stack alignItems={'center'} flexDirection={'row'}>
              <Typography
                flexShrink={0}
                fontSize={{ xs: 12, lg: 16 }}
                fontWeight={600}
                width={{ xs: 60, lg: 80 }}
              >
                Type
              </Typography>
              <Typography fontSize={{ xs: 12, lg: 16 }}>
                {item.domainType}
              </Typography>
            </Stack>

            <Stack flexDirection={'row'}>
              <Typography
                flexShrink={0}
                fontSize={{ xs: 12, lg: 16 }}
                fontWeight={600}
                width={{ xs: 60, lg: 80 }}
              >
                Name
              </Typography>
              <Stack
                alignItems={'center'}
                flexDirection={'row'}
                flexWrap={'wrap'}
                sx={{ wordBreak: 'break-all' }}
              >
                <Typography component={'div'} fontSize={{ xs: 12, lg: 16 }}>
                  {item.recordName}
                  <ContentCopy
                    onClick={() => onClickCopy('name', item.recordName)}
                    sx={{
                      width: '16px',
                      height: '16px',
                      color: 'text.primary',
                      flexShrink: 0,
                      cursor: 'pointer',
                      ml: '.25em',
                      mb: '-4px',
                    }}
                  />
                </Typography>
              </Stack>
            </Stack>

            <Stack flexDirection={'row'}>
              <Typography
                flexShrink={0}
                fontSize={{ xs: 12, lg: 16 }}
                fontWeight={600}
                width={{ xs: 60, lg: 80 }}
              >
                Value
              </Typography>
              <Stack
                alignItems={'center'}
                flexDirection={'row'}
                flexWrap={'wrap'}
                sx={{ wordBreak: 'break-all' }}
              >
                <Typography component={'div'} fontSize={{ xs: 12, lg: 16 }}>
                  {item.recordValue}
                  <ContentCopy
                    onClick={() => onClickCopy('data', item.recordValue)}
                    sx={{
                      width: '16px',
                      height: '16px',
                      color: 'text.primary',
                      flexShrink: 0,
                      cursor: 'pointer',
                      ml: '.25em',
                      mb: '-4px',
                    }}
                  />
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        ))}
      </>
    );
  }, [domainVerifyList, onClickCopy]);

  const largeVerifyList = useMemo(() => {
    return (
      <Stack>
        <Stack
          borderBottom={'1px solid #D2D6E1'}
          color={'text.secondary'}
          flexDirection={'row'}
          fontSize={{ xs: 12, lg: 14 }}
          gap={1.5}
          pb={1.25}
        >
          <Stack flex={0.5} flexShrink={0}>
            Type
          </Stack>
          <Stack flex={2.5} flexShrink={0}>
            Name
          </Stack>
          <Stack flex={3} flexShrink={0}>
            Data
          </Stack>
        </Stack>
        <Stack gap={3} mt={1.25}>
          {domainVerifyList.map((item, index) => (
            <Stack
              flexDirection={'row'}
              fontSize={{ xs: 12, lg: 14 }}
              gap={1.5}
              key={`pc_verifyList_${index}_${item.recordName}`}
            >
              <Stack flex={0.5}>{item.domainType}</Stack>
              <Stack
                flex={2.5}
                flexDirection={'row'}
                flexWrap={'wrap'}
                sx={{ wordBreak: 'break-all' }}
              >
                <Typography component={'div'} fontSize={{ xs: 12, lg: 14 }}>
                  {item.recordName}
                  <ContentCopy
                    onClick={() => onClickCopy('name', item.recordName)}
                    sx={{
                      width: '16px',
                      height: '16px',
                      color: 'text.primary',
                      flexShrink: 0,
                      cursor: 'pointer',
                      ml: '.25em',
                      mb: '-4px',
                    }}
                  />
                </Typography>
              </Stack>
              <Stack
                flex={3}
                flexDirection={'row'}
                sx={{ wordBreak: 'break-all' }}
              >
                <Typography component={'div'} fontSize={{ xs: 12, lg: 14 }}>
                  {item.recordValue}
                  <ContentCopy
                    onClick={() => onClickCopy('data', item.recordValue)}
                    sx={{
                      width: '16px',
                      height: '16px',
                      color: 'text.primary',
                      flexShrink: 0,
                      cursor: 'pointer',
                      ml: '.25em',
                      mb: '-4px',
                    }}
                  />
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      </Stack>
    );
  }, [domainVerifyList, onClickCopy]);

  const renderStepContent = useMemo(() => {
    switch (activeStep) {
      case 0:
        return (
          <Stack py={3} spacing={1.5}>
            <Typography color={'text.secondary'} variant={'body2'}>
              Please enter your custom email domain. For example, if your email
              is admin@example-domain.com, this would be{' '}
              <strong>custom-domain.com.</strong> Note: we do not support
              sending emails from email providers such as Gmail or Outlook.
            </Typography>
            <StyledTextField
              label={'Custom email domain'}
              onChange={(e) => setDomain(e.target.value)}
              value={domain}
            />
          </Stack>
        );
      case 1:
        return (
          <Stack
            component={'div'}
            gap={{ xs: 1.5, lg: 3 }}
            my={3}
            width={'100%'}
          >
            <Typography
              color={'#5B76BC'}
              component={'div'}
              fontSize={{ xs: 12, lg: 14 }}
              sx={{
                bgcolor: 'rgba(17, 52, 227, 0.10)',
                p: 1.5,
                borderRadius: 2,
              }}
            >
              After creating your domain identity with Easy DKIM, you must
              complete the verification process for DKIM authentication by
              copying the <b>CNAME</b> record generated below and publishing it
              with your domain&apos;s DNS provider. Detection of these records
              may take up to 72 hours.
            </Typography>

            {isSmall ? smallVerifyList : largeVerifyList}
          </Stack>
        );
      case 2:
        return (
          <Stack gap={3} py={3}>
            <Typography color={'text.secondary'} variant={'body2'}>
              Please enter your userName for the email. For example, if your
              email is admin@example-domain.com, this would be{' '}
              <strong>admin.</strong>
            </Typography>

            <StyledTextField
              label={'Username'}
              onChange={(e) => setUserName(e.target.value)}
              placeholder={'Username'}
              value={userName}
            />
          </Stack>
        );
    }
  }, [
    activeStep,
    domain,
    isSmall,
    setDomain,
    setUserName,
    userName,
    smallVerifyList,
    largeVerifyList,
  ]);

  const renderStepButton = useMemo(() => {
    switch (activeStep) {
      case 0:
        return (
          <StyledButton
            disabled={stepButtonLoading || !domain}
            id={`account-custom-payment-link-email-button-confirm-${activeStep}`}
            loading={stepButtonLoading}
            onClick={onClickContinue}
            size={'small'}
            sx={{ width: 100 }}
            variant={'contained'}
          >
            Continue
          </StyledButton>
        );
      case 1:
        return (
          <StyledButton
            disabled={stepButtonLoading}
            id={`account-custom-payment-link-email-button-confirm-${activeStep}`}
            loading={stepButtonLoading}
            onClick={onClickVerify}
            size={'small'}
            sx={{ width: 80 }}
            variant={'contained'}
          >
            Verify
          </StyledButton>
        );
      case 2:
        return (
          <StyledButton
            disabled={stepButtonLoading || !userName}
            id={`account-custom-payment-link-email-button-confirm-${activeStep}`}
            loading={stepButtonLoading}
            onClick={onClickSave}
            size={'small'}
            sx={{ width: 80 }}
            variant={'contained'}
          >
            Save
          </StyledButton>
        );
    }
  }, [
    activeStep,
    domain,
    onClickContinue,
    onClickSave,
    onClickVerify,
    stepButtonLoading,
    userName,
  ]);

  return (
    <StyledDialog
      content={renderStepContent}
      disableEscapeKeyDown
      footer={
        <Stack
          flexDirection={'row'}
          gap={1.5}
          justifyContent={'flex-end'}
          pb={1.5}
          px={1.5}
          width={'100%'}
        >
          <StyledButton
            color={'info'}
            id={`account-custom-payment-link-email-button-cancel-${activeStep}`}
            onClick={onCancelDialog}
            size={'small'}
            sx={{ width: 80 }}
            variant={'outlined'}
          >
            Cancel
          </StyledButton>
          {renderStepButton}
        </Stack>
      }
      header={
        <Stack
          alignItems={'flex-start'}
          flexDirection={'column'}
          gap={1.5}
          pb={3}
          width={'100%'}
        >
          <Typography variant={'h6'}>Add custom domain</Typography>

          <Stepper
            activeStep={activeStep}
            alternativeLabel
            sx={{ width: '100%', mt: 1.5 }}
          >
            {steps.map((label, index) => (
              <Step key={`${label}_${index}`}>
                <StepLabel sx={{ '&.Mui-active': { fontWeight: 600 } }}>
                  {label}
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Stack>
      }
      headerSx={{
        bgcolor: '#FBFCFD',
      }}
      open={visible}
      sx={{
        '&.MuiDialog-root': {
          '& .MuiPaper-root': {
            maxWidth: 800,
          },
        },
      }}
    />
  );
};
