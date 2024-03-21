import { FC, useCallback, useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';

import { HttpError, TaskFiles } from '@/types';
import {
  _deleteTaskFile,
  _fetchTaskFormInfo,
  _updateTaskFormInfo,
  _uploadTaskFile,
} from '@/requests/dashboard';
import { AUTO_HIDE_DURATION } from '@/constants';

import {
  StyledButton,
  StyledFormItem,
  StyledLoading,
  StyledTextFieldNumber,
  StyledUploadBox,
  Transitions,
} from '@/components/atoms';
import { useSessionStorageState } from '@/hooks';

export const FixRefinanceTaskInvestmentExperience: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const { saasState } = useSessionStorageState('tenantConfig');
  const [saveLoading, setSaveLoading] = useState<boolean>(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [propertiesNum, setPropertiesNum] = useState('');
  const [investmentFiles, setInvestmentFiles] = useState<TaskFiles[]>([]);

  const handledDelete = async (index: number) => {
    try {
      await _deleteTaskFile(router.query.taskId as string, {
        fieldName: 'investmentFiles',
        fileUrl: investmentFiles[index]?.url,
      });
      const temp = JSON.parse(JSON.stringify(investmentFiles));
      temp.splice(index, 1);
      setInvestmentFiles(temp);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  };

  const handledSuccess = async (files: FileList) => {
    setUploadLoading(true);

    const formData = new FormData();

    formData.append('fieldName', 'investmentFiles');
    Array.from(files, (item) => {
      formData.append('files', item);
    });
    try {
      const { data } = await _uploadTaskFile(
        formData,
        router.query.taskId as string,
      );
      setInvestmentFiles([...investmentFiles, ...data]);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const { loading } = useAsync(async () => {
    if (!router.query.taskId) {
      await router.push({
        pathname: '/dashboard/tasks',
        query: { processId: router.query.processId },
      });
      return;
    }
    return await _fetchTaskFormInfo(router.query.taskId as string)
      .then((res) => {
        const { investmentFiles, propertiesNum } = res.data;
        setInvestmentFiles(investmentFiles ?? []);
        setPropertiesNum(propertiesNum ?? '');
      })
      .catch((err) => {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
          onClose: () =>
            router.push({
              pathname: '/dashboard/tasks',
              query: { processId: router.query.processId },
            }),
        });
      });
  }, [router.query.taskId]);

  const isDisabled = useMemo(() => {
    return !!propertiesNum;
  }, [propertiesNum]);

  const handledSubmit = useCallback(async () => {
    setSaveLoading(true);
    const postData = {
      taskId: router.query.taskId as string,
      taskForm: {
        propertiesNum,
        investmentFiles,
      },
    };

    try {
      await _updateTaskFormInfo(postData);
      await router.push({
        pathname: '/dashboard/tasks',
        query: { processId: router.query.processId },
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
  }, [enqueueSnackbar, investmentFiles, propertiesNum, router]);

  return (
    <>
      <Transitions
        style={{
          display: 'flex',
          width: '100%',
          justifyContent: 'center',
        }}
      >
        {loading ? (
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
          <StyledFormItem
            gap={6}
            label={'Real estate investment experience'}
            maxWidth={900}
            mx={{ lg: 'auto', xs: 0 }}
            px={{ lg: 3, xs: 0 }}
            tip={
              <>
                <Typography>
                  List your previous real estate investments, including rentals
                  and fix-and-flips.
                </Typography>
                <Typography>
                  These will be verified through a title search.
                </Typography>
              </>
            }
            tipSx={{ mb: 0 }}
            width={'100%'}
          >
            <StyledFormItem
              label={'Number of properties exited last 24 months'}
              sub
            >
              <Stack maxWidth={600} width={'100%'}>
                <StyledTextFieldNumber
                  decimalScale={0}
                  label={'Number of properties exited'}
                  onValueChange={({ formattedValue }) =>
                    setPropertiesNum(formattedValue)
                  }
                  placeholder={'Number of properties exited'}
                  thousandSeparator={false}
                  value={propertiesNum}
                />
              </Stack>
            </StyledFormItem>

            <StyledFormItem
              label={'Upload track record (if applicable)'}
              sub
              tip={
                <Stack color={'info.main'}>
                  <Typography mt={1.5} variant={'body1'}>
                    Valid investment experience must meet the following
                    criteria:
                  </Typography>
                  <Typography mt={1.5} textAlign={'left'} variant={'body1'}>
                    1. The property must have been owned at least 30 days, owned
                    for fewer than 36 months, and sold or converted into a
                    rental property in the last 36 months.
                  </Typography>
                  <Typography mt={1} textAlign={'left'} variant={'body1'}>
                    2. The sale price of the property must have been greater or
                    equal to $50,000.
                  </Typography>
                </Stack>
              }
            >
              <Stack alignItems={'center'}>
                <Typography color={'text.primary'} variant={'body1'}>
                  Template Document:
                </Typography>

                <Typography
                  component={'span'}
                  fontWeight={600}
                  onClick={() => {
                    window.open(
                      'https://youland-template-file.s3.us-west-1.amazonaws.com/Track+record.xlsx',
                    );
                  }}
                  sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  Real Estate Investment Track Record
                </Typography>

                <Typography
                  color={'info.main'}
                  mt={1.5}
                  textAlign={'center'}
                  variant={'body3'}
                >
                  Include the person/entity on the title for each property you
                  include. The person/entity on title must be affiliated to the
                  borrower and guarantor on your loan application.{' '}
                  {saasState?.organizationName || 'YouLand'} will not count
                  vacant land or your current home towards your experience track
                  record.
                </Typography>

                <Box mt={3} width={'100%'}>
                  <StyledUploadBox
                    accept={
                      'image/*,.pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    }
                    fileList={investmentFiles}
                    loading={uploadLoading || loading}
                    onDelete={handledDelete}
                    onSuccess={handledSuccess}
                  />
                </Box>
              </Stack>
            </StyledFormItem>

            <Stack
              flexDirection={'row'}
              gap={3}
              justifyContent={'space-between'}
              maxWidth={600}
              width={'100%'}
            >
              <StyledButton
                color={'info'}
                onClick={() =>
                  router.push({
                    pathname: '/dashboard/tasks',
                    query: { processId: router.query.processId },
                  })
                }
                sx={{ flex: 1 }}
                variant={'text'}
              >
                Back
              </StyledButton>
              <StyledButton
                disabled={!isDisabled || saveLoading}
                loading={saveLoading}
                loadingText={'Saving...'}
                onClick={handledSubmit}
                sx={{ flex: 1 }}
              >
                Confirm
              </StyledButton>
            </Stack>
          </StyledFormItem>
        )}
      </Transitions>
    </>
  );
});
