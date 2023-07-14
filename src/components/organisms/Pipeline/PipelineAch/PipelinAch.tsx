import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION, OPTIONS_ACCOUNT_TYPE } from '@/constants';
import { useRenderPdf, useSessionStorageState, useSwitch } from '@/hooks';
import { UserType } from '@/types';

import {
  StyledButton,
  StyledDialog,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledSelect,
  StyledTextField,
  Transitions,
} from '@/components/atoms';

import {
  _completePipelineTask,
  _fetchLegalFile,
  _previewDocument,
} from '@/requests';

export const PipelineAch: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { visible, open, close } = useSwitch(false);

  const { saasState } = useSessionStorageState('tenantConfig');

  const [loading, setLoading] = useState<boolean>(false);
  const [genLoading, setGenLoading] = useState<boolean>(false);
  const [agreeLoading, setAgreeLoading] = useState<boolean>(false);

  const pdfFile = useRef(null);
  const { renderFile } = useRenderPdf(pdfFile);

  const {
    pipelineTask: {
      formData: {
        ACH_INFORMATION,
        LOAN_OFFICER_ACH_INFORMATION,
        REAL_ESTATE_AGENT_ACH_INFORMATION,
      },
    },
    userType,
  } = useMst();

  const computedAch = useMemo(() => {
    switch (userType) {
      case UserType.LOAN_OFFICER:
        return {
          tip: 'We need you to provide US ACH information in order to pay your loan officer compensation.',
          ach: LOAN_OFFICER_ACH_INFORMATION,
          isGenerateFile: false,
        };
      case UserType.REAL_ESTATE_AGENT:
        return {
          tip: 'We need you to provide US ACH information in order to pay your real estate agent compensation.',
          ach: REAL_ESTATE_AGENT_ACH_INFORMATION,
          isGenerateFile: false,
        };
      case UserType.BROKER:
        return {
          tip: 'We need you to provide US ACH information in order to pay your broker compensation.',
          ach: ACH_INFORMATION,
          isGenerateFile: true,
        };
      case UserType.LENDER:
        return {
          tip: 'We need you to provide US ACH information in order to pay your lender compensation.',
          ach: ACH_INFORMATION,
          isGenerateFile: true,
        };
      default:
        return {
          tip: '',
          ach: null,
          isGenerateFile: false,
        };
    }
  }, [
    ACH_INFORMATION,
    LOAN_OFFICER_ACH_INFORMATION,
    REAL_ESTATE_AGENT_ACH_INFORMATION,
    userType,
  ]);

  const handledCompleteTaskAndBackToSummary = useCallback(async () => {
    setLoading(true);
    const data = computedAch.ach.getPostData();
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
  }, [computedAch.ach, enqueueSnackbar, router]);

  const handledGenerateFile = useCallback(async () => {
    setGenLoading(true);
    const data = computedAch.ach.getGenerateFileData();
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
  }, [computedAch.ach, enqueueSnackbar, open, renderFile]);

  const handledSaveFile = useCallback(async () => {
    setAgreeLoading(true);
    const data = computedAch.ach.getPostData();
    try {
      const res = await _fetchLegalFile(data.taskId);
      computedAch.ach.changeFieldValue('documentFile', res.data);
    } catch (err) {
      enqueueSnackbar(err as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    } finally {
      close();
      setAgreeLoading(false);
    }
  }, [close, computedAch.ach, enqueueSnackbar]);

  return (
    <>
      <Stack alignItems={'center'} justifyContent={'center'}>
        <StyledFormItem
          label={'ACH Information'}
          sx={{ width: '100%' }}
          tip={computedAch.tip}
        >
          <Stack alignItems={'center'} gap={3} width={'100%'}>
            <Stack width={'100%'}>
              <StyledTextField
                label={'Bank Name'}
                onChange={(e) =>
                  computedAch.ach.changeFieldValue('bankName', e.target.value)
                }
                placeholder={'Bank Name'}
                value={computedAch.ach.taskForm.bankName}
              />
            </Stack>
            {computedAch.ach && (
              <Stack width={'100%'}>
                <StyledGoogleAutoComplete
                  address={computedAch.ach.taskForm.address}
                  label={'Bank Address'}
                />
              </Stack>
            )}
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              width={'100%'}
            >
              <StyledTextField
                label={'Account Holder Name'}
                onChange={(e) =>
                  computedAch.ach.changeFieldValue(
                    'accountName',
                    e.target.value,
                  )
                }
                placeholder={'Account Holder Name'}
                value={computedAch.ach.taskForm.accountName}
              />
              <StyledTextField
                label={'Routing number'}
                onChange={(e) =>
                  computedAch.ach.changeFieldValue(
                    'routingNumber',
                    e.target.value,
                  )
                }
                placeholder={'Routing number'}
                value={computedAch.ach.taskForm.routingNumber}
              />
            </Stack>
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              width={'100%'}
            >
              <StyledTextField
                label={'Account Number'}
                onChange={(e) =>
                  computedAch.ach.changeFieldValue(
                    'accountNumber',
                    e.target.value,
                  )
                }
                placeholder={'Account Number'}
                value={computedAch.ach.taskForm.accountNumber}
              />
              <StyledSelect
                label={'Account Type'}
                onChange={(e) =>
                  computedAch.ach.changeFieldValue(
                    'accountType',
                    e.target.value,
                  )
                }
                options={OPTIONS_ACCOUNT_TYPE}
                value={computedAch.ach.taskForm.accountType}
              />
            </Stack>
            {computedAch.isGenerateFile && (
              <StyledButton
                disabled={
                  !computedAch.ach.checkTaskFormValid || genLoading || loading
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
              {computedAch.ach.taskForm.documentFile && (
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
                      window.open(computedAch.ach.taskForm.documentFile.url)
                    }
                  >
                    ACH Information.pdf
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
                  !computedAch.ach.checkTaskPostForm || genLoading || loading
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
              &quot;I hereby consent and acknowledge my agreement to the
              electronic loan agreement and associated terms of{' '}
              {saasState?.organizationName || 'YouLand'}.&quot;
            </Typography>
            <StyledButton
              disabled={agreeLoading}
              loading={agreeLoading}
              loadingText={'Processing...'}
              onClick={handledSaveFile}
              sx={{ flexShrink: 0, height: 56, width: 200 }}
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
            pb={3}
          >
            <Typography variant={'h6'}>ACH Information</Typography>
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
