import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Stack } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';

import { observer } from 'mobx-react-lite';

import { AUTO_HIDE_DURATION } from '@/constants';
import { useRenderPdf, useSessionStorageState } from '@/hooks';

import { HttpError } from '@/types';

import {
  StyledButton,
  StyledFormItem,
  StyledLoading,
  Transitions,
} from '@/components/atoms';

import {
  _fetchAttachmentFile,
  _updateTaskFormInfo,
} from '@/requests/dashboard';

export const GroundPurchaseTaskAgreements: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { saasState } = useSessionStorageState('tenantConfig');

  const pdfFile = useRef(null);

  const { renderFile } = useRenderPdf(pdfFile);

  const [saveLoading, setSaveLoading] = useState(false);

  const [pdfString, setPdfString] = useState<string>('');

  useEffect(() => {
    if (router.query.taskId) {
      return;
    }
    router.push({
      pathname: '/dashboard/tasks',
      query: { processId: router.query.processId },
    });
  }, [router]);

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
  }, [enqueueSnackbar, router]);

  const { loading } = useAsync(async () => {
    if (pdfString) {
      return;
    }
    try {
      const { data } = await _fetchAttachmentFile();
      setPdfString(data);
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
    }
  }, []);

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
            gap={3}
            label={`Review and accept ${
              //sass
              saasState?.organizationName || ' YouLand'
            }'s construction holdback process`}
          >
            <Stack
              border={'1px solid #DEDEDE'}
              borderRadius={2}
              boxShadow={'0px 3px 10px 0px #DEDEDE'}
              p={3}
              ref={pdfFile}
            />

            <Stack
              flexDirection={'row'}
              gap={3}
              justifyContent={'space-between'}
              maxWidth={600}
              mt={10}
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
        )}
      </Transitions>
    </>
  );
});
