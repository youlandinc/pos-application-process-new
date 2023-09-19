import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  _completePipelineTask,
  _fetchLegalFile,
  _previewDocument,
} from '@/requests';
import { AUTO_HIDE_DURATION, OPTIONS_LICENSE_TYPE } from '@/constants';
import { useBreakpoints, useRenderPdf, useSwitch } from '@/hooks';
import { UserType } from '@/types';

import {
  StyledButton,
  StyledDialog,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledSelect,
  StyledTextField,
  StyledTextFieldPhone,
  Transitions,
} from '@/components/atoms';

export const PipelineAgreement: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const breakpoint = useBreakpoints();
  const { visible, open, close } = useSwitch(false);

  const {
    userType,
    pipelineTask: {
      formData: {
        BROKER_AGREEMENT,
        LENDER_AGREEMENT,
        LOAN_OFFICER_AGREEMENT,
        REAL_ESTATE_AGENT_AGREEMENT,
      },
    },
  } = useMst();

  const [loading, setLoading] = useState<boolean>(false);
  const [genLoading, setGenLoading] = useState<boolean>(false);
  const [agreeLoading, setAgreeLoading] = useState<boolean>(false);

  const pdfFile = useRef(null);

  const { renderFile } = useRenderPdf(pdfFile);

  const computedAgreement = useMemo(() => {
    switch (userType) {
      case UserType.BROKER:
        return {
          isRenderLicense: false,
          isGenerateFile: true,
          label: 'Broker agreement',
          tip: 'Please fill out and read our broker agreement.',
          username: 'broker',
          upperName: 'Broker',
          agreement: BROKER_AGREEMENT,
        };
      case UserType.LENDER:
        return {
          isRenderLicense: false,
          isGenerateFile: true,
          label: 'Lender agreement',
          tip: 'Please fill out and read our lender agreement.',
          username: 'lender',
          upperName: 'Lender',
          agreement: LENDER_AGREEMENT,
        };
      case UserType.LOAN_OFFICER:
        return {
          isRenderLicense: true,
          isGenerateFile: false,
          label: 'Loan officer information',
          tip: 'Please fill out the information that pertains to you.',
          username: 'loan officer',
          upperName: 'Loan officer',
          agreement: LOAN_OFFICER_AGREEMENT,
        };
      case UserType.REAL_ESTATE_AGENT:
        return {
          isRenderLicense: true,
          isGenerateFile: false,
          label: 'Real estate agent information',
          tip: 'Please fill out the information that pertains to you.',
          username: 'real estate agent',
          upperName: 'Real estate agent',
          agreement: REAL_ESTATE_AGENT_AGREEMENT,
        };
      default:
        return {
          isRenderLicense: false,
          isGenerateFile: false,
          label: '',
          tip: '',
          username: '',
          upperName: '',
          agreement: null,
        };
    }
  }, [
    LENDER_AGREEMENT,
    BROKER_AGREEMENT,
    LOAN_OFFICER_AGREEMENT,
    REAL_ESTATE_AGENT_AGREEMENT,
    userType,
  ]);

  const handledCompleteTaskAndBackToSummary = useCallback(async () => {
    setLoading(true);
    const data = computedAgreement.agreement.getPostData();
    try {
      await _completePipelineTask(data);
      await router.push('/pipeline/profile');
    } catch (err) {
      enqueueSnackbar(err as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    } finally {
      setLoading(false);
    }
  }, [computedAgreement.agreement, enqueueSnackbar, router]);

  const handledGenerateFile = useCallback(async () => {
    setGenLoading(true);
    const data = computedAgreement.agreement.getGenerateFileData();
    try {
      const res = await _previewDocument(data);
      open();
      setTimeout(() => {
        renderFile(res.data);
      }, 100);
    } catch (err) {
      enqueueSnackbar(err as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    } finally {
      setGenLoading(false);
    }
  }, [computedAgreement.agreement, enqueueSnackbar, open, renderFile]);

  const handledSaveFile = useCallback(async () => {
    setAgreeLoading(true);
    const data = computedAgreement.agreement.getPostData();
    try {
      const res = await _fetchLegalFile(data.taskId);
      computedAgreement.agreement.changeFieldValue('documentFile', res.data);
    } catch (err) {
      enqueueSnackbar(err as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    } finally {
      close();
      setAgreeLoading(false);
    }
  }, [close, computedAgreement.agreement, enqueueSnackbar]);

  return (
    <>
      <Stack alignItems={'center'} justifyContent={'center'}>
        <StyledFormItem
          label={computedAgreement.label}
          sx={{ width: '100%' }}
          tip={computedAgreement.tip}
        >
          <Stack alignItems={'center'} gap={3} width={'100%'}>
            <Stack width={'100%'}>
              <StyledTextField
                label={'Company name'}
                onChange={(e) => {
                  computedAgreement.agreement.changeFieldValue(
                    'company',
                    e.target.value,
                  );
                }}
                placeholder={'Company name'}
                value={computedAgreement.agreement.taskForm.company}
              />
            </Stack>
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              width={'100%'}
            >
              <StyledTextField
                label={'Your full name'}
                onChange={(e) => {
                  computedAgreement.agreement.changeFieldValue(
                    'fullName',
                    e.target.value,
                  );
                }}
                placeholder={'Your full name'}
                value={computedAgreement.agreement.taskForm.fullName}
              />
              <StyledTextFieldPhone
                label={'Phone number'}
                onValueChange={({ value }) =>
                  computedAgreement.agreement.changeFieldValue(
                    'phoneNumber',
                    value,
                  )
                }
                placeholder={'Phone number'}
                value={computedAgreement.agreement.taskForm.phoneNumber}
              />
            </Stack>
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              width={'100%'}
            >
              <StyledTextField
                label={'Your title'}
                onChange={(e) =>
                  computedAgreement.agreement.changeFieldValue(
                    'title',
                    e.target.value,
                  )
                }
                placeholder={'Your title'}
                value={computedAgreement.agreement.taskForm.title}
              />
              <StyledTextField
                label={'Your email'}
                onChange={(e) =>
                  computedAgreement.agreement.changeFieldValue(
                    'email',
                    e.target.value,
                  )
                }
                placeholder={'Your email'}
                value={computedAgreement.agreement.taskForm.email}
              />
            </Stack>
            {computedAgreement.isRenderLicense && (
              <Stack width={'100%'}>
                <StyledSelect
                  label={'License'}
                  onChange={(e) =>
                    computedAgreement.agreement.changeFieldValue(
                      'license',
                      e.target.value,
                    )
                  }
                  options={OPTIONS_LICENSE_TYPE}
                  value={computedAgreement.agreement.taskForm.license}
                />
              </Stack>
            )}
            {computedAgreement.agreement && (
              <Stack width={'100%'}>
                <StyledGoogleAutoComplete
                  address={computedAgreement.agreement.taskForm.address}
                />
              </Stack>
            )}
            {computedAgreement.isGenerateFile && (
              <StyledButton
                disabled={
                  !computedAgreement.agreement.checkTaskFormValid ||
                  genLoading ||
                  loading
                }
                loading={genLoading}
                loadingText={'Generating...'}
                onClick={handledGenerateFile}
                sx={{
                  width: { lg: 600, xs: '100%' },
                  mt: { xs: 0, lg: 3 },
                }}
                variant={'outlined'}
              >
                Generate file
              </StyledButton>
            )}
            <Transitions>
              {computedAgreement.agreement.taskForm.documentFile && (
                <Typography
                  component={'div'}
                  mt={3}
                  textAlign={'center'}
                  variant={'body1'}
                >
                  The attached document is the{' '}
                  <Typography
                    component={'span'}
                    fontWeight={600}
                    onClick={() =>
                      window.open(
                        computedAgreement.agreement.taskForm.documentFile.url,
                      )
                    }
                    sx={{
                      color: 'primary.main',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    {computedAgreement.upperName} Agreement.pdf
                  </Typography>{' '}
                  that you have confirmed. In case you need to make any changes,
                  a new agreement will be generated and require your agreement
                  again.
                </Typography>
              )}
            </Transitions>
            <Stack
              alignItems={'center'}
              flexDirection={{ sx: 'column', lg: 'row' }}
              gap={3}
              justifyContent={'center'}
              mt={{ lg: 3, xs: 0 }}
              width={{ lg: 600, xs: '100%' }}
            >
              <StyledButton
                color={'info'}
                onClick={() => router.back()}
                sx={{ flex: 1, width: '100%', order: { xs: 2, lg: 1 } }}
                variant={'text'}
              >
                Back
              </StyledButton>
              <StyledButton
                disabled={
                  !computedAgreement.agreement.checkTaskPostForm ||
                  loading ||
                  genLoading
                }
                loading={loading}
                loadingText={'Saving...'}
                onClick={handledCompleteTaskAndBackToSummary}
                sx={{ flex: 1, width: '100%', order: { xs: 1, lg: 2 } }}
              >
                Save
              </StyledButton>
            </Stack>
          </Stack>
        </StyledFormItem>
      </Stack>

      <StyledDialog
        content={<Box ref={pdfFile} />}
        disableEscapeKeyDown
        footer={
          <Stack
            alignItems={'center'}
            flexDirection={{ xs: 'column', lg: 'row' }}
            gap={3}
            justifyContent={{ lg: 'space-between', xs: 'center' }}
            pt={3}
            textAlign={'left'}
            width={'100%'}
          >
            <Typography
              variant={['xs', 'sm'].includes(breakpoint) ? 'body3' : 'body1'}
            >
              &quot;By clicking the below button, I hereby agree to the above
              {computedAgreement.username} agreement.&quot;
            </Typography>
            <StyledButton
              disabled={agreeLoading}
              loading={agreeLoading}
              loadingText={'Processing...'}
              onClick={handledSaveFile}
              sx={{ flexShrink: 0, height: 56, width: 200 }}
            >
              I agree
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
            <Typography variant={'h6'}>
              {computedAgreement.upperName} Agreement
            </Typography>
            <StyledButton disabled={agreeLoading} isIconButton onClick={close}>
              <CloseOutlined />
            </StyledButton>
          </Stack>
        }
        open={visible}
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
    </>
  );
});
