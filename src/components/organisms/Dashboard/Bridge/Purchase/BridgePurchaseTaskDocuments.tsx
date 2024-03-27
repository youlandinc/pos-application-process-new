import { FC, ReactNode, useCallback, useState } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useAsync } from 'react-use';
import { AxiosResponse } from 'axios';

import { observer } from 'mobx-react-lite';

import { AUTO_HIDE_DURATION } from '@/constants';
import { DocumentUploadResponse, HttpError } from '@/types';

import { _fetchTaskFormInfo, _updateTaskFormInfo } from '@/requests/dashboard';

import {
  StyledButton,
  StyledFormItem,
  StyledLoading,
  StyledTab,
  StyledUploadButtonBox,
  Transitions,
} from '@/components/atoms';

export const BridgePurchaseTaskDocuments: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [saveLoading, setSaveLoading] = useState(false);

  const [tabData, setTabData] = useState<
    { label: string; content: ReactNode }[]
  >([]);

  const { loading } = useAsync(async () => {
    if (!router.query.taskId) {
      await router.push({
        pathname: '/dashboard/tasks',
        query: { processId: router.query.processId },
      });
      return;
    }
    return await _fetchTaskFormInfo(router.query.taskId as string)
      .then((res: AxiosResponse<DocumentUploadResponse>) => {
        const {
          data: { documents },
        } = res;
        const tabData = documents.reduce(
          (acc, cur) => {
            if (!cur?.categoryName) {
              return acc;
            }
            const temp: { label: string; content: ReactNode } = {
              label: '',
              content: undefined,
            };
            temp.label = cur.categoryName;
            temp.content = (
              <Stack gap={3} my={3}>
                {cur.categoryDocs.map((item, index) => (
                  <StyledUploadButtonBox
                    key={`${item.fileKey}_${index}`}
                    {...item}
                  />
                ))}
              </Stack>
            );
            acc.push(temp);
            return acc;
          },
          [] as { label: string; content: ReactNode }[],
        );
        setTabData(tabData);
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

  const handledSubmit = useCallback(async () => {
    setSaveLoading(true);
    try {
      await _updateTaskFormInfo({
        taskId: router.query.taskId as string,
        taskForm: {
          documents: [],
        },
      });
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
            label={'Documents'}
            mx={{ lg: 'auto', xs: 0 }}
            px={{ lg: 3, xs: 0 }}
            tip={
              <Stack alignItems={'center'}>
                We&apos;ve implemented robust security measures to ensure your
                data&apos;s privacy and protection, including advanced
                encryption, privacy compliance, and regular security audits.
              </Stack>
            }
            width={'100%'}
          >
            <Stack maxWidth={'100%'} width={'100%'}>
              <StyledTab
                sx={{ m: '0 auto', maxWidth: '100%' }}
                tabsData={tabData}
              />
            </Stack>

            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              gap={3}
              justifyContent={'space-between'}
              maxWidth={600}
              width={'100%'}
            >
              <StyledButton
                color={'info'}
                onClick={async () => {
                  await router.push({
                    pathname: '/dashboard/tasks',
                    query: { processId: router.query.processId },
                  });
                }}
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
