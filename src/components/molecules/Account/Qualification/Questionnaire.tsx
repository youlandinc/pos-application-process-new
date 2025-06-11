import { FC, useRef, useState } from 'react';
import { Box, Fade, Grow, Stack, Typography } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';
import _uniqueId from 'lodash/uniqueId';

import {
  useBreakpoints,
  useRenderPdf,
  useSessionStorageState,
  useSwitch,
} from '@/hooks';
import {
  AUTO_HIDE_DURATION,
  OPTIONS_COMMON_STATE,
  QUALIFICATION_QUESTIONNAIRE_LICENSE_TYPE,
} from '@/constants';

import {
  StyledButton,
  StyledDatePicker,
  StyledDialog,
  StyledLoading,
  StyledSelect,
  StyledTextField,
  StyledTextFieldSocialNumber,
  Transitions,
} from '@/components/atoms';

import {
  AccountRoleTaskKey,
  HttpError,
  QualificationQuestionnaireLicenseType,
  TaskFiles,
} from '@/types';
import {
  _fetchRoleTaskDetail,
  _generateRoleFile,
  _previewRoleFile,
  _updateRoleTaskDetail,
} from '@/requests';
import { format, isDate, isValid } from 'date-fns';
import { useMst } from '@/models/Root';
import { observer } from 'mobx-react-lite';

const initialDocumentFile = {
  originalFileName: '',
  fileName: '',
  url: '',
  uploadTime: '',
};

const initialized = {
  firstName: '',
  lastName: '',
  ssn: '',
  birthday: null,
  state: '',
  licenseType: QualificationQuestionnaireLicenseType.default,
  license: '',
};

export const Questionnaire: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const breakpoints = useBreakpoints();

  const { saasState } = useSessionStorageState('tenantConfig');
  const { visible, open, close } = useSwitch(false);

  const { questionnaire } = useMst();

  const [saveLoading, setSaveLoading] = useState(false);
  const [genLoading, setGenLoading] = useState<boolean>(false);
  const [agreeLoading, setAgreeLoading] = useState<boolean>(false);

  const pdfFile = useRef(null);
  const { renderFile } = useRenderPdf(pdfFile);
  const [documentFile, setDocumentFile] =
    useState<TaskFiles>(initialDocumentFile);

  const { loading } = useAsync(async () => {
    try {
      const {
        data: { documentFile, licenses },
      } = await _fetchRoleTaskDetail(AccountRoleTaskKey.questionnaire);

      setDocumentFile(documentFile || initialDocumentFile);

      questionnaire.injectServerData(licenses || [initialized]);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
      await router.push({
        pathname: '/account',
        query: { tab: 1 },
      });
    }
  });

  const handledGenerateFile = async () => {
    setGenLoading(true);
    const params = {
      taskKey: AccountRoleTaskKey.questionnaire,
      taskForm: {
        licenses: questionnaire.getData(),
      },
    };
    try {
      const { data } = await _previewRoleFile(params);
      open();
      setTimeout(() => {
        renderFile(data);
      }, 100);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setGenLoading(false);
    }
  };

  const handledSaveFile = async () => {
    setAgreeLoading(true);
    const params = {
      taskKey: AccountRoleTaskKey.questionnaire,
      taskForm: {
        licenses: questionnaire.getData(),
      },
    };

    try {
      const {
        data: { originalFileName, fileName, url, uploadTime },
      } = await _generateRoleFile(params);

      setDocumentFile({
        originalFileName,
        fileName,
        url,
        uploadTime,
      });
      close();
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setAgreeLoading(false);
    }
  };

  const onClickSave = async () => {
    setSaveLoading(true);
    const params = {
      taskKey: AccountRoleTaskKey.questionnaire,
      taskForm: {
        licenses: questionnaire.getData(),
        documentFile,
      },
    };

    try {
      await _updateRoleTaskDetail(params);
      await router.push({
        pathname: '/account',
        query: { tab: 1 },
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
      setSaveLoading(false);
    }
  };

  return loading ? (
    <Stack
      alignItems={'center'}
      justifyContent={'center'}
      margin={'auto 0'}
      minHeight={'calc(667px - 46px)'}
      width={'100%'}
    >
      <StyledLoading sx={{ color: 'text.grey' }} />
    </Stack>
  ) : (
    <Fade in={!loading}>
      <Stack
        gap={{ xs: 3, lg: 6 }}
        justifyContent={'flex-start'}
        maxWidth={900}
        mx={{ lg: 'auto', xs: 0 }}
        px={{ lg: 3, xs: 0 }}
        width={'100%'}
      >
        <Typography
          component={'div'}
          textAlign={'center'}
          variant={['xs', 'sm', 'md'].includes(breakpoints) ? 'h6' : 'h5'}
        >
          Broker questionnaire
          <Typography
            color={'text.secondary'}
            component={'p'}
            fontSize={{ xs: 12, md: 16 }}
            mt={1.5}
            variant={'body3'}
          >
            Please indicate the states in which you are licensed to broker loans
            and the type of license you hold in each state
          </Typography>
        </Typography>

        <Stack gap={3}>
          {questionnaire.licenses.map((license, index) => {
            return (
              <Grow
                in={true}
                key={license.id}
                style={{ transformOrigin: 'top left' }}
                timeout={index * 300}
              >
                <Stack gap={3} key={license.id}>
                  <Stack
                    alignItems={'center'}
                    flexDirection={'row'}
                    gap={3}
                    justifyContent={'space-between'}
                    width={'100%'}
                  >
                    <Typography fontSize={{ xs: 18, lg: 24 }} variant={'h5'}>
                      {'Owner name ' + (index + 1)}
                    </Typography>
                    {index !== 0 && (
                      <StyledButton
                        color={'primary'}
                        disabled={genLoading || saveLoading}
                        onClick={() => {
                          questionnaire.removeOwner(index);
                        }}
                        size={'small'}
                        variant={'outlined'}
                      >
                        Remove
                      </StyledButton>
                    )}
                    {index === 0 && (
                      <StyledButton
                        color={'primary'}
                        disabled={
                          questionnaire.licenses.length >= 4 ||
                          genLoading ||
                          saveLoading ||
                          !questionnaire.isListValidate
                        }
                        onClick={() => {
                          questionnaire.addOwner({
                            ...initialized,
                            id: _uniqueId('owner_'),
                          });
                        }}
                        size={'small'}
                        variant={'outlined'}
                      >
                        {['xs', 'sm', 'md'].includes(breakpoints)
                          ? '+ Add'
                          : '+ Add a new owner'}
                      </StyledButton>
                    )}
                  </Stack>

                  <Stack flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                    <StyledTextField
                      disabled={genLoading || saveLoading}
                      label={'First name'}
                      onChange={(e) => {
                        const value = (e.target.value as string).replace(
                          /^./,
                          (match) => match.toUpperCase(),
                        );
                        questionnaire.changeFieldValue(
                          index,
                          'firstName',
                          value,
                        );
                      }}
                      placeholder={'First name'}
                      value={license.firstName}
                    />
                    <StyledTextField
                      disabled={genLoading || saveLoading}
                      label={'Last name'}
                      onChange={(e) => {
                        const value = (e.target.value as string).replace(
                          /^./,
                          (match) => match.toUpperCase(),
                        );
                        questionnaire.changeFieldValue(
                          index,
                          'lastName',
                          value,
                        );
                      }}
                      placeholder={'Last name'}
                      value={license.lastName}
                    />
                  </Stack>

                  <StyledTextFieldSocialNumber
                    disabled={genLoading || saveLoading}
                    onValueChange={(value) => {
                      questionnaire.changeFieldValue(index, 'ssn', value);
                    }}
                    placeholder={'SSN'}
                    value={license.ssn!}
                  />

                  <Stack flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                    <StyledDatePicker
                      disabled={genLoading || saveLoading}
                      label={'MM/DD/YYYY'}
                      onChange={(date) => {
                        const value =
                          isValid(date) && isDate(date)
                            ? format(date as Date, 'yyyy-MM-dd')
                            : null;
                        questionnaire.changeFieldValue(
                          index,
                          'birthday',
                          value,
                        );
                      }}
                      value={
                        license.birthday ? new Date(license.birthday) : null
                      }
                    />

                    <StyledSelect
                      disabled={genLoading || saveLoading}
                      label={'State'}
                      onChange={(e) => {
                        questionnaire.changeFieldValue(
                          index,
                          'state',
                          e.target.value,
                        );
                      }}
                      options={OPTIONS_COMMON_STATE}
                      value={license.state}
                    />
                  </Stack>

                  <Stack flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
                    <StyledSelect
                      disabled={genLoading || saveLoading}
                      label={'License type'}
                      onChange={(e) => {
                        questionnaire.changeFieldValue(
                          index,
                          'licenseType',
                          e.target.value,
                        );
                      }}
                      options={QUALIFICATION_QUESTIONNAIRE_LICENSE_TYPE}
                      value={license.licenseType}
                    />

                    <StyledTextField
                      disabled={genLoading || saveLoading}
                      label={'License #'}
                      onChange={(e) => {
                        questionnaire.changeFieldValue(
                          index,
                          'license',
                          e.target.value,
                        );
                      }}
                      placeholder={'License #'}
                      value={license.license}
                    />
                  </Stack>
                </Stack>
              </Grow>
            );
          })}
        </Stack>

        <Stack alignItems={'center'} gap={6}>
          <StyledButton
            color={'info'}
            disabled={
              genLoading || saveLoading || !questionnaire.isListValidate
            }
            loading={genLoading}
            onClick={handledGenerateFile}
            sx={{
              maxWidth: 560,
              width: '100%',
            }}
            variant={'outlined'}
          >
            Generate file
          </StyledButton>

          <Transitions
            style={{
              display: documentFile?.url ? 'block' : 'none',
            }}
          >
            {documentFile?.url && (
              <Typography
                color={'text.secondary'}
                component={'div'}
                fontSize={{ xs: 12, md: 16 }}
                textAlign={'center'}
                variant={'body3'}
              >
                The attached document is the{' '}
                <Typography
                  color={'primary.main'}
                  component={'span'}
                  fontSize={'inherit'}
                  fontWeight={600}
                  onClick={() => {
                    if (genLoading) {
                      return;
                    }
                    window.open(documentFile.url);
                  }}
                  sx={{ cursor: 'pointer' }}
                >
                  Broker Questionnaire.pdf
                </Typography>{' '}
                that you have confirmed. In case you need to make any changes, a
                new agreement will be generated and require your agreement
                again.
              </Typography>
            )}
          </Transitions>
        </Stack>

        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          gap={3}
          justifyContent={'center'}
          mt={3}
        >
          <StyledButton
            color={'info'}
            onClick={() =>
              router.push({
                pathname: '/account',
                query: { tab: 1 },
              })
            }
            sx={{
              flex: 1,
              width: '100%',
              maxWidth: 276,
            }}
            variant={'text'}
          >
            Back
          </StyledButton>
          <StyledButton
            color={'primary'}
            disabled={saveLoading || !questionnaire.isListValidate}
            loading={saveLoading}
            onClick={onClickSave}
            sx={{
              flex: 1,
              width: '100%',
              maxWidth: 276,
            }}
          >
            Save
          </StyledButton>
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
              <Typography fontSize={{ xs: 12, md: 16 }} variant={'body3'}>
                By clicking the button, I hereby agree to the above broker
                agreement and authorize{' '}
                {saasState?.doingBusinessAsName || 'YouLand'} to check my
                background.
              </Typography>
              <StyledButton
                disabled={agreeLoading}
                loading={agreeLoading}
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
              <Typography variant={'h6'}>Broker Questionnaire</Typography>
              <StyledButton
                disabled={agreeLoading}
                isIconButton
                onClick={close}
              >
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
      </Stack>
    </Fade>
  );
});
