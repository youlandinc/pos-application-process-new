import { FC, ReactNode, useCallback, useState } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useAsync } from 'react-use';

import { observer } from 'mobx-react-lite';

import { DocumentUploadResponse, HttpError } from '@/types';
import { AUTO_HIDE_DURATION } from '@/constants';
import { _fetchTaskFormInfo, _updateTaskFormInfo } from '@/requests/dashboard';

import {
  StyledButton,
  StyledFormItem,
  StyledLoading,
  StyledProgressLine,
  StyledTab,
  StyledUploadButtonBox,
  Transitions,
} from '@/components/atoms';
import { AxiosResponse } from 'axios';

export const FixPurchaseTaskDocuments: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [saveLoading, setSaveLoading] = useState(false);
  const [isFirst, setIsFirst] = useState<boolean>(true);

  const [total, setTotal] = useState(9);
  const [current, setCurrent] = useState(0);

  const [tabData, setTabData] = useState<
    { label: string; content: ReactNode }[]
  >([]);

  const refreshData = useCallback(async () => {
    let count = 0;
    const {
      data: { documents },
    }: AxiosResponse<DocumentUploadResponse> = await _fetchTaskFormInfo(
      router.query.taskId as string,
    );
    documents.forEach((item) => {
      if (item.categoryDocs) {
        item.categoryDocs.forEach((child) => {
          if (child.files.length > 0) {
            count++;
          }
        });
      }
    });
    setCurrent(count);
  }, [router.query.taskId]);

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
          data: { documents, totalNum, uploadedNum },
        } = res;
        setTotal(totalNum);
        setCurrent(uploadedNum);
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
                    refresh={refreshData}
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
        if (isFirst) {
          setIsFirst(false);
        }
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
            maxWidth={900}
            mx={{ lg: 'auto', xs: 0 }}
            px={{ lg: 3, xs: 0 }}
            tip={
              <Stack alignItems={'center'}>
                {/*<StyledProgressLine current={current} total={total} />*/}
              </Stack>
            }
            width={'100%'}
          >
            <Stack className={'xxxxx'} maxWidth={'100%'} width={'100%'}>
              <StyledTab
                sx={{ m: '0 auto', maxWidth: '100%' }}
                tabsData={tabData}
              />
            </Stack>

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
        )}
      </Transitions>
    </>
  );
});
