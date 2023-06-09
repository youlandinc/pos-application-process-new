import { FC, useCallback, useMemo, useState } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';

import { TaskFiles } from '@/types';
import { Address, IAddress } from '@/models/common/Address';
import { AUTO_HIDE_DURATION } from '@/constants';
import {
  _deleteTaskFile,
  _fetchTaskFormInfo,
  _skipLoanTask,
  _updateTaskFormInfo,
  _uploadTaskFile,
} from '@/requests/dashboard';

import {
  StyledButton,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledLoading,
  StyledTextField,
  StyledTextFieldPhone,
  StyledUploadBox,
} from '@/components/atoms';

export const BridgePurchaseTaskInsuranceInformation: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [saveLoading, setSaveLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [skipLoading, setSkipLoading] = useState(false);

  const [address] = useState<IAddress>(
    Address.create({
      formatAddress: '',
      state: '',
      street: '',
      city: '',
      aptNumber: '',
      postcode: '',
      isValid: false,
      errors: {},
    }),
  );

  const [agentName, setAgentName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const [insuranceFiles, setInsuranceFiles] = useState<TaskFiles[]>([]);

  const handledDelete = async (index: number) => {
    try {
      await _deleteTaskFile(router.query.taskId as string, {
        fieldName: 'insuranceFiles',
        fileUrl: insuranceFiles[index]?.url,
      });
      const temp = JSON.parse(JSON.stringify(insuranceFiles));
      temp.splice(index, 1);
      setInsuranceFiles(temp);
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

    formData.append('fieldName', 'insuranceFiles');
    Array.from(files, (item) => {
      formData.append('files', item);
    });
    try {
      const { data } = await _uploadTaskFile(
        formData,
        router.query.taskId as string,
      );
      setInsuranceFiles([...insuranceFiles, ...data]);
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
    if (!router.query.taskId) {
      await router.push({
        pathname: '/dashboard/tasks',
        query: { processId: router.query.processId },
      });
      return;
    }
    return await _fetchTaskFormInfo(router.query.taskId as string)
      .then((res) => {
        const {
          agentName,
          companyName,
          phoneNumber,
          email,
          propAddr,
          insuranceFiles,
        } = res.data;

        setAgentName(agentName ?? '');
        setCompanyName(companyName ?? '');
        setPhoneNumber(phoneNumber ?? '');
        setEmail(email ?? '');

        setInsuranceFiles(insuranceFiles ?? []);

        setTimeout(() => {
          address.injectServerData(propAddr);
        });
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

  const handledSubmit = useCallback(async () => {
    setSaveLoading(true);
    const postData = {
      taskId: router.query.taskId as string,
      taskForm: {
        agentName,
        companyName,
        phoneNumber,
        email,
        propAddr: address.getPostData(),
        insuranceFiles,
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
  }, [
    address,
    agentName,
    companyName,
    email,
    enqueueSnackbar,
    insuranceFiles,
    phoneNumber,
    router,
  ]);

  const handledSkip = useCallback(async () => {
    setSkipLoading(true);
    try {
      await _skipLoanTask(router.query.taskId as string);
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
      setSkipLoading(false);
    }
  }, [enqueueSnackbar, router]);

  const isDisabled = useMemo(() => {
    return (
      insuranceFiles.length > 0 &&
      !!agentName &&
      !!companyName &&
      !!email &&
      !!phoneNumber &&
      address.checkAddressValid
    );
  }, [
    address.checkAddressValid,
    agentName,
    companyName,
    email,
    insuranceFiles.length,
    phoneNumber,
  ]);

  return loading ? (
    <StyledLoading sx={{ color: 'primary.main' }} />
  ) : (
    <StyledFormItem
      gap={6}
      label={'Homeowner Insurance Policy(Optional)'}
      tip={
        'Homeowner insurance must comply with our Policy Guidelines and it is required to close your loan. Once you are covered, provide your insurance provider’s contact information. This allows us to speak directly with your provider on the details and get confirmation that your home is insured.'
      }
      tipSx={{ mb: 0 }}
    >
      <StyledButton
        color={'info'}
        disabled={saveLoading || skipLoading}
        onClick={handledSkip}
        sx={{ width: '100%', maxWidth: 276 }}
        variant={'outlined'}
      >
        Skip
      </StyledButton>

      <StyledFormItem
        gap={3}
        label={'Insurance provider information'}
        labelSx={{ mb: 0 }}
        maxWidth={600}
        sub
      >
        <StyledTextField
          label={'Company Name'}
          onChange={(e) => setCompanyName(e.target.value)}
          value={companyName}
        />
        <StyledTextField
          label={'Agent Name'}
          onChange={(e) => setAgentName(e.target.value)}
          value={agentName}
        />

        <StyledTextFieldPhone
          label={'Phone Number'}
          onValueChange={({ value }) => setPhoneNumber(value)}
          value={phoneNumber}
        />
        <StyledTextField
          label={'Email'}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />

        <StyledGoogleAutoComplete address={address} />
      </StyledFormItem>

      <StyledFormItem
        label={'Upload your evidence of insurance'}
        maxWidth={900}
        sub
      >
        <StyledUploadBox
          fileList={insuranceFiles}
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
          disabled={saveLoading || skipLoading || !isDisabled}
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
