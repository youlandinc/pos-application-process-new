import { POSNotUndefined } from '@/utils';
import { FC, useCallback, useMemo, useState } from 'react';
import { Box, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useAsync } from 'react-use';
import { format, isDate, isValid } from 'date-fns';

import { observer } from 'mobx-react-lite';

import { AUTO_HIDE_DURATION, OPTIONS_COMMON_YES_OR_NO } from '@/constants';
import { TaskFiles } from '@/types';
import {
  _deleteTaskFile,
  _fetchTaskFormInfo,
  _updateTaskFormInfo,
  _uploadTaskFile,
} from '@/requests/dashboard';

import {
  StyledButton,
  StyledButtonGroup,
  StyledDatePicker,
  StyledFormItem,
  StyledLoading,
  StyledUploadBox,
} from '@/components/atoms';

export const BridgePurchaseTaskContract: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [isAccepted, setIsAccepted] = useState(true);
  const [contractEndDate, setContractEndDate] = useState<
    unknown | null | Date
  >();
  const [contractFiles, setContractFiles] = useState<TaskFiles[]>([]);

  const handledSuccess = async (files: FileList) => {
    setUploadLoading(true);

    const formData = new FormData();

    formData.append('fieldName', 'contractFiles');
    Array.from(files, (item) => {
      formData.append('files', item);
    });
    try {
      const { data } = await _uploadTaskFile(
        formData,
        router.query.taskId as string,
      );
      setContractFiles([...contractFiles, ...data]);
    } catch (err) {
      enqueueSnackbar(err as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const handledDelete = async (index: number) => {
    try {
      await _deleteTaskFile(router.query.taskId as string, {
        fieldName: 'picturesFiles',
        fileUrl: contractFiles[index]?.url,
      });
      const temp = JSON.parse(JSON.stringify(contractFiles));
      temp.splice(index, 1);
      setContractFiles(temp);
    } catch (err) {
      enqueueSnackbar(err as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    }
  };

  const { loading } = useAsync(async () => {
    return await _fetchTaskFormInfo(router.query.taskId as string)
      .then((res) => {
        const { contractFiles, contractEndDate, isAccepted } = res.data;
        setContractFiles(contractFiles || []);
        setIsAccepted(isAccepted);
        if (contractEndDate) {
          setContractEndDate(new Date(contractEndDate));
        }
      })
      .catch((err) =>
        enqueueSnackbar(err as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
        }),
      );
  }, [router.query.taskId]);

  const isDisabled = useMemo(() => {
    const dateValid = isValid(contractEndDate) && isDate(contractEndDate);
    if (POSNotUndefined(isAccepted)) {
      return false;
    }
    return contractFiles.length > 0 && dateValid;
  }, [contractEndDate, contractFiles.length, isAccepted]);

  const handledSubmit = useCallback(async () => {
    const dateValid = isValid(contractEndDate) && isDate(contractEndDate);

    const postData = {
      taskId: router.query.taskId as string,
      taskForm: {
        contractFiles,
        contractEndDate: dateValid
          ? format(contractEndDate as Date, 'yyyy-MM-dd O')
          : undefined,
        isAccepted,
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
  }, [contractEndDate, router, contractFiles, isAccepted, enqueueSnackbar]);

  return loading ? (
    <StyledLoading sx={{ color: 'primary.main' }} />
  ) : (
    <StyledFormItem
      gap={6}
      label={'Upload Your Purchase Contract'}
      tip={
        'Please upload a purchase contract with the exact same address and buyer name as your submitted loan application.'
      }
      tipSx={{ mb: 0 }}
    >
      <StyledFormItem label={'Accepted purchase contract?'} maxWidth={600} sub>
        <StyledButtonGroup
          onChange={(e, value) => {
            if (value !== null) {
              setIsAccepted(value === 'yes');
            }
          }}
          options={OPTIONS_COMMON_YES_OR_NO}
          sx={{ width: '100%', maxWidth: 600 }}
          value={isAccepted}
        />
      </StyledFormItem>

      <StyledFormItem
        label={'Contract end date'}
        maxWidth={600}
        sub
        tip={
          'For a purchase, on which date does your purchase contract expire? For refinance, on what date did you originally acquire the property?'
        }
      >
        <StyledDatePicker
          label={'MM/DD/YYYY'}
          onChange={(date) => setContractEndDate(date)}
          value={contractEndDate}
        />
      </StyledFormItem>
      <StyledFormItem
        label={'Why do we need this?'}
        maxWidth={900}
        sub
        tip={
          <>
            <Box>
              We’ll confirm that all of the details in the purchase contract
              match your application. YouLand will look for the agreed-upon
              purchase price, any Sellers concessions and fees, close of escrow
              date, and confirmation that the property is being used for
              investment purposes.
            </Box>
            <Box>
              Check for initials and signatures. The Purchase Contract must be
              fully executed with initials and signatures in all designated
              places, along with all of the contract pages and any additional
              addendums.
            </Box>
          </>
        }
      >
        <StyledUploadBox
          fileList={contractFiles}
          loading={uploadLoading}
          onDelete={handledDelete}
          onSuccess={handledSuccess}
        />
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
});
