import { FC, useCallback, useMemo, useState } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useAsync } from 'react-use';

import { observer } from 'mobx-react-lite';

import {
  _fetchTaskFormInfo,
  _skipLoanTask,
  _updateTaskFormInfo,
} from '@/requests/dashboard';
import { AUTO_HIDE_DURATION } from '@/constants';

import {
  StyledButton,
  StyledFormItem,
  StyledLoading,
  StyledTextField,
  StyledTextFieldPhone,
} from '@/components/atoms';

export const BridgePurchaseTaskPropertyInspection: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [saveLoading, setSaveLoading] = useState(false);
  const [skipLoading, setSkipLoading] = useState(false);

  const [contactName, setContactName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [instructions, setInstructions] = useState<string | number>('');

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
        const { contactName, phoneNumber, email, instructions } = res.data;

        setEmail(email || '');
        setContactName(contactName || '');
        setPhoneNumber(phoneNumber || '');
        setInstructions(instructions || '');
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
        email,
        contactName,
        phoneNumber,
        instructions,
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
  }, [contactName, email, enqueueSnackbar, instructions, phoneNumber, router]);

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
    return !contactName || !phoneNumber || !email;
  }, [contactName, email, phoneNumber]);

  return loading ? (
    <StyledLoading sx={{ color: 'primary.main' }} />
  ) : (
    <StyledFormItem
      gap={3}
      label={'Property Inspection Details(Optional)'}
      labelSx={{ mb: 0 }}
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
        label={'Property inspection contact information'}
        labelSx={{ mb: 0 }}
        maxWidth={600}
        sub
      >
        <StyledTextField
          label={'Contact Name'}
          onChange={(e) => setContactName(e.target.value)}
          value={contactName}
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
        <StyledTextField
          label={'Property Access Instructions(Optional)'}
          onChange={(e) => setInstructions(e.target.value)}
          value={instructions}
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
          disabled={saveLoading || skipLoading || isDisabled}
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
