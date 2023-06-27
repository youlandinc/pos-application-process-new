import { FC, useCallback, useMemo, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { TaskFiles } from '@/types';
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
} from '@/components/atoms';
import { useSessionStorageState } from '@/hooks';

export const BridgeRefinanceTaskInvestmentExperience: FC = () => {
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
      enqueueSnackbar(err as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
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
      enqueueSnackbar(err as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const { loading } = useAsync(async () => {
    return await _fetchTaskFormInfo(router.query.taskId as string)
      .then((res) => {
        const { investmentFiles, propertiesNum } = res.data;
        setInvestmentFiles(investmentFiles ?? []);
        setPropertiesNum(propertiesNum ?? '');
      })
      .catch((err) =>
        enqueueSnackbar(err as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          onClose: () =>
            router.push({
              pathname: '/dashboard/tasks',
              query: { processId: router.query.processId },
            }),
        }),
      );
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
    } catch (e) {
      enqueueSnackbar(e as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    } finally {
      setSaveLoading(false);
    }
  }, [enqueueSnackbar, investmentFiles, propertiesNum, router]);

  return loading ? (
    <StyledLoading sx={{ color: 'primary.main' }} />
  ) : (
    <StyledFormItem
      gap={6}
      label={'Real Estate Investment Experience'}
      tip={
        'Please list your past experience with investment properties. These should be properties where you appear on title. These may be properties that you have exited or sold. Please keep in mind we will verify this experience during underwriting.'
      }
      tipSx={{ mb: 0 }}
    >
      <StyledFormItem label={'Number of properties exited last 24 months'} sub>
        <Stack maxWidth={600} width={'100%'}>
          <StyledTextFieldNumber
            decimalScale={0}
            label={'Track Record'}
            onValueChange={({ formattedValue }) =>
              setPropertiesNum(formattedValue)
            }
            thousandSeparator={false}
            value={propertiesNum}
          />
        </Stack>
      </StyledFormItem>

      <StyledFormItem
        label={'Upload track record (Optional)'}
        sub
        tip={
          <Stack color={'info.main'}>
            <Typography variant={'body1'}>
              Next, fill out your Experience Verification Sheet
            </Typography>
            <Typography mt={1.5} variant={'body1'}>
              Please complete the experience sheet and tell us about the
              investment property flips you have completed in the past 24
              months. For our purposes, a completed flip meets the following
              criteria:
            </Typography>
            <Typography mt={1.5} textAlign={'left'} variant={'body1'}>
              1. The property must have been owned at least 30 days, owned for
              fewer than 36 months, and sold or converted into a rental property
              in the last 24 months.
            </Typography>
            <Typography mt={1} textAlign={'left'} variant={'body1'}>
              2. The sale price of the property must have been greater or equal
              to $50,000.
            </Typography>
          </Stack>
        }
      >
        <Stack alignItems={'center'}>
          <Typography color={'text.primary'} variant={'body1'}>
            Example documents:
          </Typography>

          <Typography
            className={'link_style'}
            component={'span'}
            fontWeight={600}
            onClick={() => {
              window.open(
                'https://youland-template-file.s3.us-west-1.amazonaws.com/Sample-project-experience-template.xlsx',
              );
            }}
          >
            Sample project experience template
          </Typography>

          <Typography
            color={'info.main'}
            mt={1.5}
            textAlign={'center'}
            variant={'body3'}
          >
            Include the person/Entity on the title for each property you
            include. It is important that the person/Entity on title is
            affiliated to the Borrower and Guarantor on your loan application.
            Additional documentation may be required if{' '}
            {saasState?.organizationName || 'YouLand'} can&apos;t validate
            property ownership or title affiliation. Include the complete
            property address. When filling out the Experience Verification
            Sheet, please be sure to fill out the complete property address.
            Leave out vacant land and home address.{' '}
            {saasState?.organizationName || 'YouLand'} will not count vacant
            land or your current home towards your experience verification.
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
          Save
        </StyledButton>
      </Stack>
    </StyledFormItem>
  );
};
