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
import { useRenderPdf, useSwitch } from '@/hooks';
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
} from '@/components';

export const PipelineAgreement: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const {
    userType,
    pipelineTask: {
      formData: {
        BROKER_AGREEMENT,
        LOAN_OFFICER_AGREEMENT,
        REAL_ESTATE_AGENT_AGREEMENT,
      },
    },
  } = useMst();

  const [loading, setLoading] = useState<boolean>(false);
  const [genLoading, setGenLoading] = useState<boolean>(false);
  const [agreeLoading, setAgreeLoading] = useState<boolean>(false);

  const { visible, open, close } = useSwitch(false);

  const pdfFile = useRef(null);

  const { renderFile } = useRenderPdf(pdfFile);

  const computedAgreement = useMemo(() => {
    switch (userType) {
      case UserType.BROKER:
        return {
          isRenderLicense: false,
          isGenerateFile: true,
          label: 'Broker Agreement',
          tip: 'Please fill out and read our broker agreement.',
          agreement: BROKER_AGREEMENT,
        };
      case UserType.LOAN_OFFICER:
        return {
          isRenderLicense: true,
          isGenerateFile: false,
          label: 'Loan Officer Information',
          tip: 'Please fill out the information that pertains to you.',
          agreement: LOAN_OFFICER_AGREEMENT,
        };
      case UserType.REAL_ESTATE_AGENT:
        return {
          isRenderLicense: true,
          isGenerateFile: false,
          label: 'Real Estate Agent Information',
          tip: 'Please fill out the information that pertains to you.',
          agreement: REAL_ESTATE_AGENT_AGREEMENT,
        };
      default:
        return {
          isRenderLicense: false,
          isGenerateFile: false,
          label: '',
          tip: '',
          agreement: null,
        };
    }
  }, [
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
      });
    } catch (err) {
      enqueueSnackbar(err as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    } finally {
      setGenLoading(false);
    }
  }, [computedAgreement.agreement, enqueueSnackbar, open]);

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
                label={'Company Name'}
                onChange={(e) => {
                  computedAgreement.agreement.changeFieldValue(
                    'company',
                    e.target.value,
                  );
                }}
                placeholder={'Company Name'}
                value={computedAgreement.agreement.taskForm.company}
              />
            </Stack>
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              width={'100%'}
            >
              <StyledTextField
                label={'Your Full Name'}
                onChange={(e) => {
                  computedAgreement.agreement.changeFieldValue(
                    'fullName',
                    e.target.value,
                  );
                }}
                placeholder={'Your Full Name'}
                value={computedAgreement.agreement.taskForm.fullName}
              />
              <StyledTextFieldPhone
                label={'Phone Number'}
                onValueChange={({ value }) =>
                  computedAgreement.agreement.changeFieldValue(
                    'phoneNumber',
                    value,
                  )
                }
                placeholder={'Phone Number'}
                value={computedAgreement.agreement.taskForm.phoneNumber}
              />
            </Stack>
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              width={'100%'}
            >
              <StyledTextField
                label={'Your Title'}
                onChange={(e) =>
                  computedAgreement.agreement.changeFieldValue(
                    'title',
                    e.target.value,
                  )
                }
                placeholder={'Your Title'}
                value={computedAgreement.agreement.taskForm.title}
              />
              <StyledTextField
                label={'Your Email'}
                onChange={(e) =>
                  computedAgreement.agreement.changeFieldValue(
                    'email',
                    e.target.value,
                  )
                }
                placeholder={'Your Email'}
                value={computedAgreement.agreement.taskForm.email}
              />
            </Stack>
            {computedAgreement.isRenderLicense && (
              <Stack width={'100%'}>
                <StyledSelect
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
                  !computedAgreement.agreement.checkTaskFormValid || genLoading
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
                Generate File
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
                    className={'link_style'}
                    component={'span'}
                    fontWeight={600}
                    onClick={() =>
                      window.open(
                        computedAgreement.agreement.taskForm.documentFile.url,
                      )
                    }
                  >
                    Broker Agreement.pdf
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
                  !computedAgreement.agreement.checkTaskPostForm || loading
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
            flexDirection={{ xs: 'column', lg: 'row' }}
            gap={3}
            justifyContent={{ lg: 'space-between', xs: 'center' }}
            textAlign={'left'}
            width={'100%'}
          >
            <Typography variant={'body1'}>
              &quot;By clicking the below button, I hereby agree to the above
              broker agreement.&quot;
            </Typography>
            <StyledButton
              disabled={agreeLoading}
              loading={agreeLoading}
              loadingText={'Processing...'}
              onClick={handledSaveFile}
            >
              I Agree
            </StyledButton>
          </Stack>
        }
        header={
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
          >
            <Typography variant={'h6'}>Broker Agreement</Typography>
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
