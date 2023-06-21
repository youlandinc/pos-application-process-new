import { FC, useCallback, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';

import { AUTO_HIDE_DURATION } from '@/constants';
import {
  _fetchAttachmentFile,
  _updateTaskFormInfo,
} from '@/requests/dashboard';
import { useSessionStorageState } from '@/hooks';

import { StyledButton, StyledFormItem } from '@/components/atoms';

export const BridgeRefinanceTaskAgreements: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { saasState } = useSessionStorageState('tenantConfig');

  const [saveLoading, setSaveLoading] = useState(false);
  const [viewLoading, setViewLoading] = useState<boolean>(false);

  const handledSubmit = useCallback(async () => {
    setSaveLoading(true);
    const postData = {
      taskId: router.query.taskId as string,
      taskForm: {},
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
  }, [enqueueSnackbar, router]);

  const handledViewPDF = useCallback(
    async () => {
      const handler = (data: BlobPart) => {
        if (viewLoading) {
          return;
        }
        // file export
        if (!data) {
          setViewLoading(false);
          return;
        }
        const url = window.URL.createObjectURL(
          new Blob([data], { type: 'application/pdf;chartset=UTF-8' }),
        );
        const previewWindow = window.open(
          '',
          '_blank',
          // 'toolbar=no,menubar=no,location=no,status=no',
        );

        previewWindow!.document.write(
          '<embed src="' +
            url +
            '" type="application/pdf" width="100%" height="100%" />',
        );
        previewWindow!.document.body.style.margin = '0';
        setViewLoading(false);
      };
      setViewLoading(true);
      const res = await _fetchAttachmentFile();
      handler(res.data);
    },
    // this function never change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <StyledFormItem gap={3} label={'Agreements'}>
      <StyledFormItem
        label={`Review and accept ${
          //sass
          saasState?.organizationName || ' YouLand'
        }'s construction holdback process`}
        maxWidth={900}
        sub
      >
        <Typography
          className={'link_style'}
          component={'span'}
          fontWeight={600}
          onClick={handledViewPDF}
        >
          View Construction Holdback Process
        </Typography>
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
          disabled={saveLoading}
          loading={saveLoading}
          loadingText={'Saving...'}
          onClick={handledSubmit}
          sx={{ flex: 1 }}
        >
          Confirm
        </StyledButton>
      </Stack>
    </StyledFormItem>
  );
});
