import React, {
  ChangeEvent,
  FC,
  MutableRefObject,
  useMemo,
  useRef,
  useState,
} from 'react';
import { Box, Stack, SxProps } from '@mui/material';
import { POSFlex, POSFont } from '@/styles';

import Link from 'next/link';
import { useRouter } from 'next/router';
import { format, isValid, parseISO } from 'date-fns';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useBreakpoints, useRenderPdf, useSwitch } from '@/hooks';

import {
  AUTO_HIDE_DURATION,
  OPTIONS_COMMON_STATE,
  OPTIONS_PIPELINE_LICENSE_TYPE,
} from '@/constants';

// import { PipelineQuestionnaireOwner } from '@/types/myApplicationData';
// import { SPQOwnerData } from '@/models/pipeline';

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
// import { LicenseTypeOpt } from '@/types/options';
// import { utils } from '@/common/utils';
import { CloseOutlined } from '@mui/icons-material';

import { PipelineLicenseTypeOpt, PipelineQuestionnaireOwner } from '@/types';
import { SPQOwnerData } from '@/models/pipeline/base/PQOwner';
import { isNumber } from 'validate.js';

const PipelineQuestionnaireStyles: SxProps = {
  '& .container': {
    ...POSFlex('center', 'center', 'column'),
    padding: '80px 7.5vw 48px 7.5vw',
  },
  '& .innerWrap': {
    // width: 1312,
    padding: '48px 72px',
  },
  '& .header': {
    width: 800,
  },
  '& .title': {
    ...POSFont({ lg: 24, xs: 18 }, 700, 1.5),
    // width: '100%',
  },
  '& .subTitle': {
    ...POSFont(16, 400, 1.5, 'rgba(0,0,0,.6)'),
    marginBlockStart: 12,
    width: '100%',
  },
  '& .content': {
    // width: 800,
    overflow: 'hidden',
  },
  '& .formRow': {
    ...POSFlex('flex-start', 'space-between', 'row'),
    // width: 800,
  },
  '& .formLabel': {
    ...POSFlex('center', 'space-between', 'row'),
  },
  '& .footer': {
    width: 800,
    marginBlockStart: 48,
  },
  '& .filePreviewHeader': {
    width: '100%',
    height: 96,
    background: '#F5F8FA',
    padding: 0,
    ...POSFlex('center', 'center', 'row'),
    ...POSFont(24, 700, 1.5, 'rgba(0,0,0,.87)'),
  },
  '& .filePreviewCancel': {
    ...POSFlex('center', 'center', undefined),
    position: 'absolute',
    width: 50,
    right: 48,
    zIndex: 100,
    cursor: 'pointer',
    border: '2px solid rgba(0,0,0,.6)',
    borderRadius: 8,
  },
  '& .filePreviewFooter': {
    ...POSFlex('center', 'space-between', 'row'),
    ...POSFont(16, 400, 1.5, 'rgba(0,0,0,.6)'),
    height: 96,
    background: '#F5F8FA',
    padding: '0 48px',
  },
  '& .closeIcon': {
    fontSize: 16,
    color: 'rgba(0,0,0,.6)',
  },
  '& .paper': {
    width: 'min(1316px,100%)',
    borderRadius: 8,
  },
};

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

  const {
    pipelineTask: {
      formData: { BROKER_QUESTIONNAIRE },
    },
  } = useMst();

  // const tenantConfig = utils.getTenantConfig();

  const [loading, setLoading] = useState<boolean>(false);
  const [genLoading, setGenLoading] = useState<boolean>(false);
  const [agreeLoading, setAgreeLoading] = useState<boolean>(false);

  const pdfFile = useRef<MutableRefObject<HTMLDivElement>>(null);

  const { visible, open, close } = useSwitch(false);

  const { renderFile } = useRenderPdf(pdfFile);

  const completeTaskAndBackToSummary = async () => {
    setLoading(true);
    const data = BROKER_QUESTIONNAIRE.getPostData();
    try {
      await _completePipelineTask(data);
      await router.push('/my_application/task');
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
    setGenLoading(true);
    const data = BROKER_QUESTIONNAIRE.getGenerateFileData();
    console.log({ data });
    try {
      const res = await _previewDocument(data);
      open();
      renderFile(res.data);
    } catch (err) {
      enqueueSnackbar(err as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    } finally {
      setGenLoading(false);
    }
  };

  const saveFile = async () => {
    setAgreeLoading(true);
    const data = BROKER_QUESTIONNAIRE.getPostData();
    try {
      const res = await _fetchLegalFile(data.taskId);
      await BROKER_QUESTIONNAIRE.changeFieldValue('documentFile', res.data);
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
    return BROKER_QUESTIONNAIRE.taskForm.licenses.length >= 4;
  }, [BROKER_QUESTIONNAIRE.taskForm.licenses.length]);

  return (
    <Stack
      alignItems={'center'}
      justifyContent={'center'}
      sx={PipelineQuestionnaireStyles}
    >
      <StyledFormItem
        label={'Broker questionnaire（optional）'}
        sx={{ width: '100%' }}
        tip={`Please indicate the states in which you are licensed to broker
                loans and the type of license you hold in each state`}
      >
        <Transitions>
          {BROKER_QUESTIONNAIRE.taskForm?.licenses?.map(
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
                    className={'title'}
                    sx={{
                      fontSize: {
                        lg: 24,
                        xs: 18,
                      },
                    }}
                  >
                    {'Broker name ' + (index + 1)}
                  </Box>
                  {index !== 0 && (
                    <StyledButton
                      color={'primary'}
                      onClick={() => BROKER_QUESTIONNAIRE.removeLicenses(index)}
                      size={'small'}
                      variant={'outlined'}
                    >
                      Remove
                    </StyledButton>
                  )}
                  {index === 0 && (
                    <StyledButton
                      color={'primary'}
                      disabled={isAddLicense}
                      onClick={() =>
                        BROKER_QUESTIONNAIRE.addLicenses(initialized)
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
                    label={'Broker name ' + (index + 1)}
                    onChange={(e) => {
                      BROKER_QUESTIONNAIRE.changeLicensesFieldValue(
                        'ownerName',
                        e.target.value,
                        index,
                      );
                    }}
                    value={item.ownerName}
                  />
                  <StyledTextFieldSocialNumber
                    label={'Social Security Number'}
                    onValueChange={(v) => {
                      BROKER_QUESTIONNAIRE.changeLicensesFieldValue(
                        'ssn',
                        v,
                        index,
                      );
                    }}
                    value={item?.ssn}
                  />
                </Stack>

                <Stack
                  flexDirection={{ lg: 'row', xs: 'column' }}
                  gap={3}
                  width={'100%'}
                >
                  <StyledDatePicker
                    // format="MM/dd/yyyy"
                    label={'Date of Birth'}
                    onChange={(date, context) => {
                      console.log(isValid(date) ? date : null, date);
                      BROKER_QUESTIONNAIRE.changeLicensesFieldValue(
                        'birthday',
                        isValid(date) ? date : null,
                        index,
                      );
                    }}
                    value={item.birthday}
                  />
                  <StyledSelect
                    label={'State'}
                    onChange={(e) => {
                      BROKER_QUESTIONNAIRE.changeLicensesFieldValue(
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
                      BROKER_QUESTIONNAIRE.changeLicensesFieldValue(
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
                      BROKER_QUESTIONNAIRE.changeLicensesFieldValue(
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
        <Stack alignItems={'center'} gap={3} width={'100%'}>
          <StyledButton
            color={'primary'}
            disabled={!BROKER_QUESTIONNAIRE.checkLicensesValid || genLoading}
            onClick={() => generateFile()}
            sx={{
              width: { lg: 600, xs: '100%' },
              mt: { xs: 0, lg: 3 },
            }}
          >
            Generate file
          </StyledButton>

          <Transitions>
            {BROKER_QUESTIONNAIRE.taskForm.documentFile && (
              <Box mt={'48px'}>
                This is a copy of the{' '}
                <Link href={BROKER_QUESTIONNAIRE.taskForm.documentFile.url}>
                  <a className={'linkStyle'} target={'_blank'}>
                    Broker Questionnaire
                  </a>
                </Link>{' '}
                you agreed to. If you need to change the agreement, it can be
                generated and agreed to again.
              </Box>
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
              disabled={!BROKER_QUESTIONNAIRE.checkTaskFormValid || loading}
              loading={loading}
              onClick={() => completeTaskAndBackToSummary()}
              sx={{ flex: 1, width: '100%', order: { xs: 1, lg: 2 } }}
            >
              Save
            </StyledButton>
          </Stack>
        </Stack>

        <StyledDialog
          // classes={{
          //   paper: paper,
          // }}
          content={<div className={'filePreviewContent'} ref={pdfFile} />}
          disableEscapeKeyDown
          footer={
            <Box className={'filePreviewFooter'}>
              <Box>
                By clicking the below button, I hereby agree to the above broker
                agreement and authorize
                {'YouLand'} to check my background.
              </Box>
              <StyledButton
                disabled={agreeLoading}
                onClick={saveFile}
                style={{ width: 200 }}
                variant={'outlined'}
              >
                I agree
              </StyledButton>
            </Box>
          }
          header={
            <Box className={'filePreviewHeader'}>
              <Box textAlign={'center'} width={'100%'}>
                Broker questionnaire
              </Box>
              <Box className={'filePreviewCancel'} onClick={() => close()}>
                <CloseOutlined className={'closeIcon'} />
              </Box>
            </Box>
          }
          open={visible}
          scroll={'paper'}
        ></StyledDialog>
      </StyledFormItem>
    </Stack>
  );
});
