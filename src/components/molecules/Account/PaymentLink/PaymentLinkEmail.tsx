import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import {
  CircularProgress,
  Icon,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { useSnackbar } from 'notistack';

import { AUTO_HIDE_DURATION } from '@/constants';
import { useBreakpoints, useSwitch } from '@/hooks';

import {
  StyledButton,
  StyledDialog,
  StyledTextField,
} from '@/components/atoms';

import {
  DomainSource,
  EmailDomainData,
  EmailDomainDetails,
  EmailDomainState,
  HttpError,
} from '@/types';
import {
  _addCustomEmailDomain,
  _fetchCustomEmailDomains,
  _fetchIdentityCustomEmailDomain,
  _modifyCustomEmailDomain,
  _verifyCustomEmailDomain,
} from '@/requests';

import ICON_REFRESH from './icon_refresh.svg';
import ICON_SUCCESS from './icon_success.svg';
import ICON_PENDING from './icon_pending.svg';
import { ContentCopy } from '@mui/icons-material';

const steps = ['Enter email domain', 'Verify ownership', 'Choose username'];

const DomainStateHash = {
  [EmailDomainState.ACTIVE]: 'Active',
  [EmailDomainState.SUCCESS]: 'Please finish setup',
  [EmailDomainState.PENDING]: 'Waiting for verification',
  [EmailDomainState.FAILED]: 'Not linked',
};

const DomainStateIconHash = {
  [EmailDomainState.SUCCESS]: ICON_PENDING,
  [EmailDomainState.PENDING]: ICON_PENDING,
  [EmailDomainState.ACTIVE]: ICON_SUCCESS,
  [EmailDomainState.FAILED]: ICON_PENDING,
};

export const PaymentLinkEmail: FC<{
  data: EmailDomainDetails[];
}> = ({
  data = [
    {
      id: 0,
      email: 'JohnDoe@fake-domain.com',
      emailDomain: 'fake-domain.com',
      validStatus: EmailDomainState.PENDING,
      source: DomainSource.DEFAULT,
      userName: 'johnDoe',
    },
  ],
}) => {
  const { enqueueSnackbar } = useSnackbar();
  const { open, close, visible } = useSwitch(false);
  const breakpoints = useBreakpoints();

  const [fetchLoading, setFetchLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState(false);
  const [stepButtonLoading, setStepButtonLoading] = useState<boolean>(false);

  const [activeStep, setActiveStep] = useState<number>(0);

  const [domain, setDomain] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  const [emailDomainList, setEmailDomainList] =
    useState<EmailDomainDetails[]>(data);
  const [domainVerifyList, setDomainVerifyList] = useState<EmailDomainData[]>(
    [],
  );

  const fetchCustomEmailDomain = useCallback(async () => {
    if (fetchLoading) {
      return;
    }
    setFetchLoading(true);
    try {
      const { data } = await _fetchCustomEmailDomains();
      setEmailDomainList(data);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setFetchLoading(false);
    }
  }, [enqueueSnackbar, fetchLoading]);

  const onClickOpen = useCallback(async () => {
    if (!emailDomainList) {
      return;
    }
    const target = emailDomainList.find(
      (item) => item.validStatus !== EmailDomainState.ACTIVE,
    );
    if (target) {
      const { validStatus, userName } = target;
      switch (validStatus) {
        case EmailDomainState.ACTIVE:
          setActiveStep(0);
          break;
        case EmailDomainState.PENDING:
          setActiveStep(1);
          setViewLoading(true);
          try {
            const { data } = await _fetchIdentityCustomEmailDomain({
              domain: target.emailDomain,
            });
            setDomainVerifyList(data);
          } catch (err) {
            const { header, message, variant } = err as HttpError;
            enqueueSnackbar(message, {
              variant: variant || 'error',
              autoHideDuration: AUTO_HIDE_DURATION,
              isSimple: !header,
              header,
            });
          }
          break;
        case EmailDomainState.SUCCESS:
          if (!userName) {
            setViewLoading(true);
            try {
              const { data } = await _fetchIdentityCustomEmailDomain({
                domain: target.emailDomain,
              });
              setDomainVerifyList(data);
            } catch (err) {
              const { header, message, variant } = err as HttpError;
              enqueueSnackbar(message, {
                variant: variant || 'error',
                autoHideDuration: AUTO_HIDE_DURATION,
                isSimple: !header,
                header,
              });
            }
          }
          setActiveStep(userName ? 2 : 1);
          break;
      }
    } else {
      setActiveStep(0);
    }
    setViewLoading(false);
    open();
  }, [emailDomainList, enqueueSnackbar, open]);

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

            {['xs', 'sm', 'md'].includes(breakpoints) ? (
              domainVerifyList.map((item, index) => (
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
                      <Typography
                        component={'div'}
                        fontSize={{ xs: 12, lg: 16 }}
                      >
                        {item.recordName}
                        <ContentCopy
                          onClick={async () => {
                            await navigator.clipboard.writeText(
                              item.recordName,
                            );
                            enqueueSnackbar('Copied name to clipboard', {
                              variant: 'success',
                            });
                          }}
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
                      <Typography
                        component={'div'}
                        fontSize={{ xs: 12, lg: 16 }}
                      >
                        {item.recordValue}
                        <ContentCopy
                          onClick={async () => {
                            await navigator.clipboard.writeText(
                              item.recordValue,
                            );
                            enqueueSnackbar('Copied name to clipboard', {
                              variant: 'success',
                            });
                          }}
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
              ))
            ) : (
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
                        <Typography
                          component={'div'}
                          fontSize={{ xs: 12, lg: 14 }}
                        >
                          {item.recordName}
                          <ContentCopy
                            onClick={async () => {
                              await navigator.clipboard.writeText(
                                item.recordName,
                              );
                              enqueueSnackbar('Copied name to clipboard', {
                                variant: 'success',
                              });
                            }}
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
                        <Typography
                          component={'div'}
                          fontSize={{ xs: 12, lg: 14 }}
                        >
                          {item.recordValue}
                          <ContentCopy
                            onClick={async () => {
                              await navigator.clipboard.writeText(
                                item.recordValue,
                              );
                              enqueueSnackbar('Copied data to clipboard', {
                                variant: 'success',
                              });
                            }}
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
            )}
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
    breakpoints,
    domain,
    domainVerifyList,
    enqueueSnackbar,
    userName,
  ]);

  const renderStepButton = useMemo(() => {
    switch (activeStep) {
      case 0:
        return (
          <StyledButton
            disabled={stepButtonLoading || !domain}
            id={`account-custom-payment-link-email-button-confirm-${activeStep}`}
            loading={stepButtonLoading}
            onClick={async () => {
              if (domain.trim() === '') {
                return;
              }
              setStepButtonLoading(true);
              try {
                const { data } = await _addCustomEmailDomain({ domain });
                setDomainVerifyList(data);
                const res = await _fetchCustomEmailDomains();
                setEmailDomainList(res.data);
                setTimeout(() => {
                  setActiveStep(1);
                }, 10);
              } catch (err) {
                const { header, message, variant } = err as HttpError;
                enqueueSnackbar(message, {
                  variant: variant || 'error',
                  autoHideDuration: AUTO_HIDE_DURATION,
                  isSimple: !header,
                  header,
                });
              } finally {
                setStepButtonLoading(false);
              }
            }}
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
            onClick={async () => {
              if (emailDomainList.length <= 1) {
                return;
              }
              const target = emailDomainList.find(
                (item) => item.validStatus !== EmailDomainState.ACTIVE,
              );
              if (!target) {
                return;
              }
              setStepButtonLoading(true);
              try {
                const { emailDomain } = target;
                await _verifyCustomEmailDomain({
                  domain: emailDomain,
                });
                const { data } = await _fetchCustomEmailDomains();
                setEmailDomainList(data);

                setTimeout(() => {
                  setActiveStep(2);
                }, 10);
              } catch (err) {
                const { header, message, variant } = err as HttpError;
                enqueueSnackbar(message, {
                  variant: variant || 'error',
                  autoHideDuration: AUTO_HIDE_DURATION,
                  isSimple: !header,
                  header,
                });
              } finally {
                setStepButtonLoading(false);
              }
            }}
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
            onClick={async () => {
              const target = emailDomainList.find(
                (item) => item.validStatus !== EmailDomainState.ACTIVE,
              );
              if (!target) {
                return;
              }
              setStepButtonLoading(true);
              const { id } = target;
              const params = {
                id,
                userName,
              };
              try {
                await _modifyCustomEmailDomain(params);
                const { data } = await _fetchCustomEmailDomains();
                setEmailDomainList(data);
              } catch (err) {
                const { header, message, variant } = err as HttpError;
                enqueueSnackbar(message, {
                  variant: variant || 'error',
                  autoHideDuration: AUTO_HIDE_DURATION,
                  isSimple: !header,
                  header,
                });
              } finally {
                setStepButtonLoading(false);
              }
              setUserName('');
              setDomain('');
              setTimeout(() => {
                close();
              }, 10);
            }}
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
    close,
    domain,
    emailDomainList,
    enqueueSnackbar,
    stepButtonLoading,
    userName,
  ]);

  const keydownEvent = useCallback(
    (e: KeyboardEvent) => {
      const confirmButton: (HTMLElement & { disabled?: boolean }) | null =
        document.getElementById(
          `account-custom-payment-link-email-button-confirm-${activeStep}`,
        );
      const cancelButton: (HTMLElement & { disabled?: boolean }) | null =
        document.getElementById(
          `account-custom-payment-link-email-button-cancel-${activeStep}`,
        );

      if (!confirmButton) {
        return;
      }

      if (e.key === 'Enter') {
        if (!confirmButton.disabled) {
          confirmButton.click();
        }
      }

      if (e.key === 'Escape') {
        if (cancelButton) {
          cancelButton.click();
        }
      }
    },
    [activeStep],
  );

  useEffect(() => {
    document.addEventListener('keydown', keydownEvent, false);
    return () => {
      document.removeEventListener('keydown', keydownEvent, false);
    };
  }, [keydownEvent]);

  return (
    <Stack
      border={'1px solid #D2D6E1'}
      borderRadius={2}
      component={'form'}
      gap={{ xs: 2, md: 3 }}
      p={{ xs: 2, md: 3 }}
    >
      <Stack
        alignItems={'flex-start'}
        flexDirection={'row'}
        gap={3}
        justifyContent={'space-between'}
      >
        <Typography
          color={'text.primary'}
          component={'div'}
          fontSize={{ xs: 16, lg: 18 }}
          fontWeight={600}
        >
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={1}
            lineHeight={1}
          >
            Set email domain
            <Icon
              component={ICON_REFRESH}
              onClick={fetchCustomEmailDomain}
              sx={{ pb: 0.25, width: 24, height: 24, cursor: 'pointer' }}
            />
          </Stack>
          <Typography
            color={'text.secondary'}
            component={'p'}
            fontSize={{ xs: 12, lg: 14 }}
            mt={1}
          >
            Send payment link emails to the borrower using your custom email
            domain. username is the part of the email address before the @
            symbol, while the email domain is the part that comes after the
            symbol (ex: username@email-domain.com)
          </Typography>
        </Typography>
        {!['xs', 'sm', 'md'].includes(breakpoints) && (
          <StyledButton
            disabled={viewLoading}
            loading={viewLoading}
            onClick={onClickOpen}
            size={'small'}
            sx={{
              width: 220,
              flexShrink: 0,
            }}
            variant={'outlined'}
          >
            Change email domain
          </StyledButton>
        )}
      </Stack>

      {fetchLoading ? (
        <Stack alignItems={'center'} flex={1} justifyContent={'center'}>
          <CircularProgress
            size={24}
            sx={{ width: '100%', color: '#E3E3EE' }}
          />
        </Stack>
      ) : ['xs', 'sm', 'md'].includes(breakpoints) ? (
        emailDomainList.map((item) => (
          <Stack
            gap={{ xs: 1.5, lg: 3 }}
            key={item.id}
            sx={{
              '&:not(:last-of-type)': {
                borderBottom: '1px solid #D2D6E1',
                pb: { xs: 1.5, lg: 3 },
              },
            }}
          >
            <Stack alignItems={'center'} flexDirection={'row'}>
              <Typography
                fontSize={{ xs: 12, lg: 16 }}
                fontWeight={600}
                width={{ xs: 48, lg: 80 }}
              >
                Email
              </Typography>
              <Typography fontSize={{ xs: 12, lg: 16 }}>
                {item.email || '-'}
              </Typography>
            </Stack>

            <Stack alignItems={'center'} flexDirection={'row'}>
              <Typography
                fontSize={{ xs: 12, lg: 16 }}
                fontWeight={600}
                width={{ xs: 48, lg: 80 }}
              >
                State
              </Typography>
              <Stack alignItems={'center'} flexDirection={'row'}>
                <Icon
                  component={DomainStateIconHash[item.validStatus]}
                  sx={{
                    width: { xs: 20, lg: 24 },
                    height: { xs: 20, lg: 24 },
                    mr: 1,
                  }}
                />
                <Typography fontSize={{ xs: 12, lg: 16 }}>
                  {DomainStateHash[item.validStatus]}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        ))
      ) : (
        <Stack gap={1.25}>
          <Stack color={'text.primary'} flexDirection={'row'} gap={1.5}>
            <Typography flex={3} flexShrink={0} fontSize={14} fontWeight={600}>
              Email
            </Typography>
            <Typography flex={2} flexShrink={0} fontSize={14} fontWeight={600}>
              State
            </Typography>
          </Stack>

          {emailDomainList.map((item) => (
            <Stack flexDirection={'row'} gap={1.5} key={`pc_${item.id}`}>
              <Typography flex={3} flexShrink={0} fontSize={12}>
                {item.email}
              </Typography>

              <Stack
                alignItems={'center'}
                flex={2}
                flexDirection={'row'}
                flexShrink={0}
              >
                <Icon
                  component={DomainStateIconHash[item.validStatus]}
                  sx={{
                    width: 20,
                    height: 20,
                    mr: 1,
                  }}
                />
                <Typography fontSize={12}>
                  {DomainStateHash[item.validStatus]}
                </Typography>
              </Stack>
            </Stack>
          ))}
        </Stack>
      )}

      {['xs', 'sm', 'md'].includes(breakpoints) && (
        <StyledButton
          disabled={viewLoading}
          loading={viewLoading}
          onClick={onClickOpen}
          size={'small'}
          sx={{
            width: 220,
            flexShrink: 0,
          }}
          variant={'outlined'}
        >
          Change email domain
        </StyledButton>
      )}

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
              onClick={() => {
                close();
                setTimeout(() => {
                  setActiveStep(0);
                  setUserName('');
                  setDomain('');
                }, 200);
              }}
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
    </Stack>
  );
};
