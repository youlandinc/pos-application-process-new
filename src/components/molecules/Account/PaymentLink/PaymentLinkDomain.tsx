import { FC, useCallback, useMemo, useState } from 'react';
import {
  CircularProgress,
  Icon,
  Stack,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { useSnackbar } from 'notistack';

import { useBreakpoints, useSwitch } from '@/hooks';

import {
  StyledButton,
  StyledDialog,
  StyledTextField,
} from '@/components/atoms';

import {
  DomainDetails,
  DomainLiveData,
  DomainSource,
  DomainState,
  DomainVerifyData,
  HttpError,
} from '@/types';
import {
  _addOrFetchCustomDomain,
  _fetchCustomDomains,
  _fetchLiveRecords,
  _verifyCustomDomain,
} from '@/requests';

import ICON_REFRESH from './icon_refresh.svg';
import ICON_SUCCESS from './icon_success.svg';
import ICON_PENDING from './icon_pending.svg';
import { AUTO_HIDE_DURATION } from '@/constants';

const steps = ['Enter domain', 'Verify ownership', 'Go live'];

const DomainStateHash = {
  [DomainState.CONNECTED]: 'Connected',
  [DomainState.WAITING_VERIFICATION]: 'Waiting for verification',
  [DomainState.NOT_LINKED]: 'Not linked',
};

const initialDomainLiveData: DomainLiveData = {
  domainName: '',
  recordType: '',
  recordName: '',
  recordData: '',
};

const initialDomainVerifyData: DomainVerifyData = {
  domainName: '',
  recordType: '',
  recordName: '',
  recordData: '',
};

export const PaymentLinkDomain: FC<{
  data: DomainDetails[];
}> = ({
  data = [
    {
      id: 0,
      domainName: 'fake-domain.com',
      state: DomainState.CONNECTED,
      source: DomainSource.DEFAULT,
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

  const [domainName, setDomainName] = useState<string>('');
  const [domainList, setDomainList] = useState<DomainDetails[]>(data);

  const [domainVerifyData, setDomainVerifyData] = useState<DomainLiveData>(
    initialDomainVerifyData,
  );
  const [domainLiveData, setDomainLiveData] = useState<DomainLiveData>(
    initialDomainLiveData,
  );

  const fetchCustomDomain = useCallback(async () => {
    if (fetchLoading) {
      return;
    }
    setFetchLoading(true);
    try {
      const { data } = await _fetchCustomDomains();
      setDomainList(data);
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
    setViewLoading(true);
    if (!domainList) {
      return;
    }
    const target = domainList.find(
      (item) => item.state !== DomainState.CONNECTED,
    );
    if (target) {
      const { state, domainName } = target;

      switch (state) {
        case DomainState.WAITING_VERIFICATION: {
          setActiveStep(1);
          try {
            const { data } = await _addOrFetchCustomDomain({ domainName });
            setDomainVerifyData(data);
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
        }
        case DomainState.NOT_LINKED: {
          setActiveStep(2);
          try {
            const { data } = await _fetchLiveRecords({ domainName });
            setDomainLiveData(data);
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
        }
      }
    } else {
      setActiveStep(0);
    }
    open();
    setViewLoading(false);
  }, [domainList, enqueueSnackbar, open]);

  const renderStepContent = useMemo(() => {
    switch (activeStep) {
      case 0:
        return (
          <Stack gap={1.5} my={3}>
            <Typography
              color={'text.secondary'}
              component={'div'}
              variant={'body2'}
            >
              Enter the domain name you want people to see when they access your
              Point of Sale system. This could be a domain name like{' '}
              <b>domain.com</b> or a subdomain like <b>app.domain.com</b>.
            </Typography>
            <StyledTextField
              label={'Domain'}
              onChange={(e) => setDomainName(e.target.value)}
              value={domainName}
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
                p: 1.25,
                borderRadius: 2,
              }}
            >
              Add the <b>CNAME</b> records below to your DNS provider to verify
              you own <b>{domainVerifyData.domainName}</b>. Do not delete your
              CNAME records. DNS changes might take up to 10 minutes to update.
            </Typography>

            {['xs', 'sm', 'md'].includes(breakpoints) ? (
              <Stack gap={{ xs: 1.5, lg: 3 }} pt={{ xs: 1.5, lg: 3 }}>
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
                    {domainVerifyData.recordType}
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
                      {domainVerifyData.recordName}
                      <ContentCopy
                        onClick={async () => {
                          await navigator.clipboard.writeText(
                            domainVerifyData.recordName,
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
                    <Typography component={'div'} fontSize={{ xs: 12, lg: 16 }}>
                      {domainVerifyData.recordData}
                      <ContentCopy
                        onClick={async () => {
                          await navigator.clipboard.writeText(
                            domainVerifyData.recordData,
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
                  <Stack flex={1.5} flexShrink={0}>
                    Name
                  </Stack>
                  <Stack flex={3} flexShrink={0}>
                    Data
                  </Stack>
                </Stack>

                <Stack
                  flexDirection={'row'}
                  fontSize={{ xs: 12, lg: 14 }}
                  gap={1.25}
                  mt={1.25}
                >
                  <Stack flex={0.5} flexShrink={0}>
                    {domainVerifyData.recordType}
                  </Stack>
                  <Stack
                    flex={1.5}
                    flexDirection={'row'}
                    flexShrink={0}
                    flexWrap={'wrap'}
                    sx={{ wordBreak: 'break-all' }}
                  >
                    <Typography component={'div'} fontSize={{ xs: 12, lg: 14 }}>
                      {domainVerifyData.recordName}
                      <ContentCopy
                        onClick={async () => {
                          await navigator.clipboard.writeText(
                            domainVerifyData.recordName,
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
                    flexShrink={0}
                    sx={{ wordBreak: 'break-all' }}
                  >
                    <Typography component={'div'} fontSize={{ xs: 12, lg: 14 }}>
                      {domainVerifyData.recordData}
                      <ContentCopy
                        onClick={async () => {
                          await navigator.clipboard.writeText(
                            domainVerifyData.recordData,
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
              </Stack>
            )}
          </Stack>
        );
      case 2:
        return (
          <Stack gap={3} my={3} width={'100%'}>
            <Typography
              color={'#5B76BC'}
              sx={{
                bgcolor: 'rgba(17, 52, 227, 0.10)',
                p: 1.25,
                borderRadius: 2,
              }}
              variant={'body2'}
            >
              Add these <b>A record</b> to your domain by visiting your DNS
              provider or registrar. Your site will show a security certificate
              warning for a few hours, until the certificate has been
              provisioned.
            </Typography>

            {['xs', 'sm', 'md'].includes(breakpoints) ? (
              <Stack gap={3} pt={3}>
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
                    {domainLiveData.recordType}
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
                      {domainLiveData.recordName}
                      <ContentCopy
                        onClick={async () => {
                          await navigator.clipboard.writeText(
                            domainLiveData.recordName,
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
                    <Typography component={'div'}>
                      {domainLiveData.recordData}
                      <ContentCopy
                        onClick={async () => {
                          await navigator.clipboard.writeText(
                            domainLiveData.recordData,
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
                  <Stack flex={1.5} flexShrink={0}>
                    Name
                  </Stack>
                  <Stack flex={3} flexShrink={0}>
                    Data
                  </Stack>
                </Stack>

                <Stack
                  flexDirection={'row'}
                  fontSize={{ xs: 12, lg: 14 }}
                  gap={1.5}
                  mt={1.25}
                >
                  <Stack flex={0.5} flexShrink={0}>
                    {domainLiveData.recordType}
                  </Stack>

                  <Stack
                    flex={1.5}
                    flexDirection={'row'}
                    flexShrink={0}
                    flexWrap={'wrap'}
                    sx={{ wordBreak: 'break-all' }}
                  >
                    <Typography component={'div'} fontSize={{ xs: 12, lg: 14 }}>
                      {domainLiveData.recordName}
                      <ContentCopy
                        onClick={async () => {
                          await navigator.clipboard.writeText(
                            domainLiveData.recordName,
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
                    flexShrink={0}
                    flexWrap={'wrap'}
                    sx={{ wordBreak: 'break-all' }}
                  >
                    <Typography component={'div'} fontSize={{ xs: 12, lg: 14 }}>
                      {domainLiveData.recordData}
                      <ContentCopy
                        onClick={async () => {
                          await navigator.clipboard.writeText(
                            domainLiveData.recordData,
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
              </Stack>
            )}
          </Stack>
        );
    }
  }, [
    activeStep,
    domainName,
    domainVerifyData.domainName,
    domainVerifyData.recordType,
    domainVerifyData.recordName,
    domainVerifyData.recordData,
    breakpoints,
    domainLiveData.recordType,
    domainLiveData.recordName,
    domainLiveData.recordData,
    enqueueSnackbar,
  ]);

  const renderStepButton = useMemo(() => {
    switch (activeStep) {
      case 0:
        return (
          <StyledButton
            disabled={stepButtonLoading || !domainName}
            loading={stepButtonLoading}
            onClick={async () => {
              setStepButtonLoading(true);
              try {
                const { data } = await _addOrFetchCustomDomain({
                  domainName,
                });
                setDomainVerifyData(data as DomainLiveData);
                const res = await _fetchCustomDomains();
                setDomainList(res.data);
                setActiveStep(1);
                setDomainName('');
              } catch (err) {
                const { message, header, variant } = err as HttpError;
                enqueueSnackbar(message, { variant, header, isSimple: false });
              } finally {
                setStepButtonLoading(false);
              }
            }}
            size={'small'}
            sx={{
              width: 100,
            }}
            variant={'contained'}
          >
            Continue
          </StyledButton>
        );
      case 1:
        return (
          <StyledButton
            disabled={stepButtonLoading}
            loading={stepButtonLoading}
            onClick={async () => {
              setStepButtonLoading(true);
              try {
                const { data } = await _verifyCustomDomain(domainVerifyData);
                setDomainLiveData(data);
                const res = await _fetchCustomDomains();
                setDomainList(res.data);
                setActiveStep(2);
              } catch (err) {
                const { message, header, variant } = err as HttpError;
                enqueueSnackbar(message, {
                  variant: variant || 'error',
                  autoHideDuration: 3000,
                  header,
                  isSimple: false,
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
          <Stack
            alignItems={'center'}
            color={'#9095A3'}
            flexDirection={'row'}
            fontSize={12}
            justifyContent={'space-between'}
            width={'100%'}
          >
            Remember to remove your old A records and any AAAA records from your
            DNS provider
            <StyledButton
              onClick={() => {
                close();
                setTimeout(() => setActiveStep(0), 200);
              }}
              size={'small'}
              sx={{ width: 80 }}
              variant={'contained'}
            >
              Finish
            </StyledButton>
          </Stack>
        );
    }
  }, [
    activeStep,
    stepButtonLoading,
    domainName,
    enqueueSnackbar,
    domainVerifyData,
    close,
  ]);

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
            Set domain
            <Icon
              component={ICON_REFRESH}
              onClick={fetchCustomDomain}
              sx={{ pb: 0.25, width: 24, height: 24, cursor: 'pointer' }}
            />
          </Stack>
          <Typography
            color={'text.secondary'}
            component={'p'}
            fontSize={{ xs: 12, lg: 14 }}
            mt={1}
          >
            Change the domain name of the payment link.
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
            Change custom domain
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
        domainList.map((item) => (
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
                width={{ xs: 60, lg: 80 }}
              >
                Domain
              </Typography>
              <Typography fontSize={{ xs: 12, lg: 16 }}>
                {item.domainName}
              </Typography>
            </Stack>

            <Stack alignItems={'center'} flexDirection={'row'}>
              <Typography
                fontSize={{ xs: 12, lg: 16 }}
                fontWeight={600}
                width={{ xs: 60, lg: 80 }}
              >
                State
              </Typography>
              <Stack alignItems={'center'} flexDirection={'row'}>
                <Icon
                  component={
                    item.state === DomainState.CONNECTED
                      ? ICON_SUCCESS
                      : ICON_PENDING
                  }
                  sx={{
                    width: { xs: 20, lg: 24 },
                    height: { xs: 20, lg: 24 },
                    mr: 1,
                  }}
                />
                <Typography fontSize={{ xs: 12, lg: 16 }}>
                  {DomainStateHash[item.state]}
                </Typography>
              </Stack>
            </Stack>
          </Stack>
        ))
      ) : (
        <Stack gap={1.25}>
          <Stack color={'text.primary'} flexDirection={'row'} gap={1.5}>
            <Typography flex={3} flexShrink={0} fontSize={14} fontWeight={600}>
              Domain
            </Typography>
            <Typography flex={2} flexShrink={0} fontSize={14} fontWeight={600}>
              State
            </Typography>
          </Stack>

          {domainList.map((item) => (
            <Stack flexDirection={'row'} gap={1.5} key={`pc_${item.id}`}>
              <Typography flex={3} flexShrink={0} fontSize={12}>
                {item.domainName}
              </Typography>

              <Stack
                alignItems={'center'}
                flex={2}
                flexDirection={'row'}
                flexShrink={0}
              >
                <Icon
                  component={
                    item.state === DomainState.CONNECTED
                      ? ICON_SUCCESS
                      : ICON_PENDING
                  }
                  sx={{
                    width: 20,
                    height: 20,
                    mr: 1,
                  }}
                />
                <Typography fontSize={12}>
                  {DomainStateHash[item.state]}
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
          Change custom domain
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
            {activeStep !== 2 && (
              <StyledButton
                color={'info'}
                onClick={() => {
                  close();
                  setTimeout(() => {
                    setActiveStep(0);
                    setDomainName('');
                    setDomainVerifyData(initialDomainVerifyData);
                    setDomainLiveData(initialDomainLiveData);
                  }, 200);
                }}
                size={'small'}
                sx={{ width: 80 }}
                variant={'outlined'}
              >
                Cancel
              </StyledButton>
            )}
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
