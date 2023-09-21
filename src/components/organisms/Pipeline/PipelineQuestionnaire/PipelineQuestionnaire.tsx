import { FC, useMemo, useRef, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';

import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  AUTO_HIDE_DURATION,
  OPTIONS_COMMON_STATE,
  OPTIONS_PIPELINE_LICENSE_TYPE,
} from '@/constants';
import {
  useBreakpoints,
  useRenderPdf,
  useSessionStorageState,
  useSwitch,
} from '@/hooks';

import { POSFont } from '@/styles';

import {
  StyledButton,
  StyledDatePicker,
  StyledDialog,
  StyledFormItem,
  StyledSelect,
  StyledTextField,
  StyledTextFieldSocialNumber,
  Transitions,
} from '@/components/atoms';
import {
  _completePipelineTask,
  _fetchLegalFile,
  _previewDocument,
} from '@/requests';

import {
  PipelineLicenseTypeOpt,
  PipelineQuestionnaireOwner,
  UserType,
} from '@/types';
import { SPQOwnerData } from '@/models/pipeline/base/PQOwner';

const initialized: SPQOwnerData = {
  ownerName: '',
  ssn: '',
  birthday: null,
  state: '',
  licenseType: PipelineLicenseTypeOpt.default,
  license: '',
};

export const PipelineQuestionnaire: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const breakpoint = useBreakpoints();

  const { saasState } = useSessionStorageState('tenantConfig');

  const {
    userType,
    pipelineTask: {
      formData: { BROKER_QUESTIONNAIRE, LENDER_QUESTIONNAIRE },
    },
  } = useMst();

  // const tenantConfig = utils.getTenantConfig();

  const [loading, setLoading] = useState<boolean>(false);
  const [genLoading, setGenLoading] = useState<boolean>(false);
  const [agreeLoading, setAgreeLoading] = useState<boolean>(false);

  const pdfFile = useRef(null);

  const { visible, open, close } = useSwitch(false);

  const { renderFile } = useRenderPdf(pdfFile);

  const computedQuestionnaire = useMemo(() => {
    switch (userType) {
      case UserType.BROKER: {
        return {
          label: 'Broker questionnaire (optional)',
          tip: 'Please indicate the states in which you are licensed to broker loans and the type of license you hold in each state',
          listTitle: 'Broker name ',
          fileName: 'Broker Questionnaire.pdf',
          dialogHeader: 'Broker Questionnaire',
          userName: 'broker',
          questionnaire: BROKER_QUESTIONNAIRE,
        };
      }
      case UserType.LENDER: {
        return {
          label: 'Lender questionnaire (optional)',
          tip: 'Please indicate the states in which you are licensed to lender loans and the type of license you hold in each state',
          listTitle: 'Lender name ',
          fileName: 'Lender Questionnaire.pdf',
          dialogHeader: 'Lender Questionnaire',
          userName: 'lender',
          questionnaire: LENDER_QUESTIONNAIRE,
        };
      }
      default: {
        return {
          label: '',
          tip: '',
          listTitle: '',
          fileName: '',
          dialogHeader: '',
          userName: '',
          questionnaire: null,
        };
      }
    }
  }, [BROKER_QUESTIONNAIRE, LENDER_QUESTIONNAIRE, userType]);

  const handledCompleteTaskAndBackToSummary = async () => {
    if (computedQuestionnaire.questionnaire.validateSelfInfo()) {
      return;
    }
    setLoading(true);
    const data = computedQuestionnaire.questionnaire.getPostData();
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
  };

  const generateFile = async () => {
    if (computedQuestionnaire.questionnaire.validateSelfInfo()) {
      return;
    }
    setGenLoading(true);
    const data = computedQuestionnaire.questionnaire.getGenerateFileData();
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
  };

  const handledSaveFile = async () => {
    setAgreeLoading(true);
    const data = computedQuestionnaire.questionnaire.getPostData();

    try {
      const res = await _fetchLegalFile(data.taskId);
      await computedQuestionnaire.questionnaire.changeFieldValue(
        'documentFile',
        res.data,
      );
    } catch (err) {
      enqueueSnackbar(err as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    } finally {
      close();
      setAgreeLoading(false);
    }
  };

  const isAddLicense = useMemo(() => {
    return computedQuestionnaire.questionnaire.taskForm.licenses.length >= 4;
  }, [computedQuestionnaire.questionnaire.taskForm.licenses.length]);

  return (
    <>
      <Stack alignItems={'center'} justifyContent={'center'}>
        <StyledFormItem
          label={computedQuestionnaire.label}
          sx={{ width: '100%' }}
          tip={computedQuestionnaire.tip}
        >
          <Stack alignItems={'center'} justifyContent={'center'} width={'100%'}>
            <StyledButton
              color={'info'}
              onClick={() => router.back()}
              sx={{ flex: 1, width: '30%' }}
              variant={'outlined'}
            >
              Skip
            </StyledButton>
          </Stack>

          <Transitions style={{ width: '100%' }}>
            {computedQuestionnaire.questionnaire.taskForm?.licenses?.map(
              (item: PipelineQuestionnaireOwner, index: number) => (
                <Stack
                  alignItems={'center'}
                  gap={3}
                  key={index}
                  mt={'48px'}
                  width={'100%'}
                >
                  <Stack
                    alignItems={'center'}
                    flexDirection={'row'}
                    gap={3}
                    justifyContent={'space-between'}
                    width={'100%'}
                  >
                    <Box
                      sx={{
                        ...POSFont({ lg: 24, xs: 18 }, 700, 1.5),
                      }}
                    >
                      {computedQuestionnaire.listTitle + (index + 1)}
                    </Box>
                    {index !== 0 && (
                      <StyledButton
                        color={'info'}
                        onClick={() =>
                          computedQuestionnaire.questionnaire.removeLicenses(
                            index,
                          )
                        }
                        size={'small'}
                        variant={'outlined'}
                      >
                        Remove
                      </StyledButton>
                    )}
                    {index === 0 && (
                      <StyledButton
                        color={'info'}
                        disabled={isAddLicense}
                        onClick={() =>
                          computedQuestionnaire.questionnaire.addLicenses(
                            initialized,
                          )
                        }
                        size={'small'}
                        variant={'outlined'}
                      >
                        {['xs', 'sm', 'md'].includes(breakpoint)
                          ? '+ Add'
                          : '+ Add a new owner'}
                      </StyledButton>
                    )}
                  </Stack>

                  <Stack
                    flexDirection={{ lg: 'row', xs: 'column' }}
                    gap={3}
                    width={'100%'}
                  >
                    <StyledTextField
                      label={computedQuestionnaire.listTitle + (index + 1)}
                      onChange={(e) => {
                        computedQuestionnaire.questionnaire.changeLicensesFieldValue(
                          'ownerName',
                          e.target.value,
                          index,
                        );
                      }}
                      value={item.ownerName}
                    />
                    <StyledTextFieldSocialNumber
                      label={'Social security number'}
                      onValueChange={(v) => {
                        computedQuestionnaire.questionnaire.changeLicensesFieldValue(
                          'ssn',
                          v,
                          index,
                        );
                      }}
                      validate={
                        computedQuestionnaire.questionnaire.errors &&
                        computedQuestionnaire.questionnaire.errors[index]?.ssn
                      }
                      value={item.ssn}
                    />
                  </Stack>

                  <Stack
                    flexDirection={{ lg: 'row', xs: 'column' }}
                    gap={3}
                    width={'100%'}
                  >
                    <StyledDatePicker
                      label={'Date of birth'}
                      onChange={(date) => {
                        computedQuestionnaire.questionnaire.changeLicensesFieldValue(
                          'birthday',
                          date,
                          index,
                        );
                      }}
                      validate={
                        computedQuestionnaire.questionnaire.errors &&
                        computedQuestionnaire.questionnaire.errors[index]
                          ?.dateOfBirth
                      }
                      value={item.birthday}
                    />

                    <StyledSelect
                      label={'State'}
                      onChange={(e) => {
                        computedQuestionnaire.questionnaire.changeLicensesFieldValue(
                          'state',
                          e.target.value as string,
                          index,
                        );
                      }}
                      options={OPTIONS_COMMON_STATE}
                      value={item?.state}
                    />
                  </Stack>
                  <Stack
                    flexDirection={{ lg: 'row', xs: 'column' }}
                    gap={3}
                    width={'100%'}
                  >
                    <StyledSelect
                      label={'License type'}
                      onChange={(e) => {
                        computedQuestionnaire.questionnaire.changeLicensesFieldValue(
                          'licenseType',
                          e.target.value as string,
                          index,
                        );
                      }}
                      options={OPTIONS_PIPELINE_LICENSE_TYPE}
                      value={item.licenseType}
                    />

                    <StyledTextField
                      label="License #"
                      onChange={(e) => {
                        computedQuestionnaire.questionnaire.changeLicensesFieldValue(
                          'license',
                          e.target.value,
                          index,
                        );
                      }}
                      value={item.license}
                    />
                  </Stack>
                </Stack>
              ),
            )}
          </Transitions>
          <Stack alignItems={'center'} gap={3} sx={{ mt: 3 }} width={'100%'}>
            <StyledButton
              color={'info'}
              disabled={
                !computedQuestionnaire.questionnaire.checkLicensesValid ||
                genLoading ||
                loading
              }
              loading={genLoading}
              loadingText={'Generating...'}
              onClick={() => generateFile()}
              sx={{
                width: { lg: 600, xs: '100%' },
                mt: { xs: 0, lg: 3 },
              }}
              variant={'outlined'}
            >
              Generate file
            </StyledButton>
            <Transitions>
              {computedQuestionnaire.questionnaire.taskForm.documentFile && (
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
                        computedQuestionnaire.questionnaire.taskForm
                          .documentFile.url,
                      )
                    }
                    sx={{
                      color: 'primary.main',
                      cursor: 'pointer',
                      fontWeight: 600,
                    }}
                  >
                    {computedQuestionnaire.fileName}
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
                color={'primary'}
                disabled={
                  !computedQuestionnaire.questionnaire.checkTaskFormValid ||
                  loading ||
                  genLoading
                }
                loading={loading}
                loadingText={'Saving...'}
                onClick={() => handledCompleteTaskAndBackToSummary()}
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
              &quot;By clicking the button, I hereby agree to the above broker
              agreement and authorize {saasState?.organizationName || 'YouLand'}{' '}
              to check my background.&quot;
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
              {computedQuestionnaire.dialogHeader}
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
