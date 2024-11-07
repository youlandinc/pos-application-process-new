import { FC, ReactNode, useCallback, useEffect, useState } from 'react';
import { Fade, Icon, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useAsync } from 'react-use';
import { useRouter } from 'next/router';

import { useBreakpoints } from '@/hooks';

import { POSGetParamsFromUrl } from '@/utils';

import { AUTO_HIDE_DURATION } from '@/constants';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  StyledLoading,
  StyledTab,
  StyledUploadButtonBox,
} from '@/components/atoms';

import { HttpError } from '@/types';
import { _downloadFile } from '@/requests/application';
import { _fetchLoanDocumentData } from '@/requests/dashboard';

import NOTIFICATION_WARNING from '@/components/atoms/StyledNotification/notification_warning.svg';

export const Documents: FC = observer(() => {
  const { notificationDocuments } = useMst();

  const router = useRouter();
  const breakpoints = useBreakpoints();
  const { enqueueSnackbar } = useSnackbar();

  const [tabData, setTabData] = useState<
    { label: string | ReactNode; content: ReactNode }[]
  >([]);

  const [isTips, setIsTips] = useState<boolean>(false);
  const [startTabIndex, setStartTabIndex] = useState<number>(0);

  const { loading } = useAsync(async () => await fetchData(), [location.href]);
  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);

  const fetchData = async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      await router.push('/pipeline');
      enqueueSnackbar('Invalid loan ID', {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
      return;
    }
    try {
      const {
        data: { docs, isTips, loanNumber },
      } = await _fetchLoanDocumentData(loanId);
      setIsTips(isTips);
      const tabData = docs.reduce(
        (acc, cur, index) => {
          if (!cur?.categoryName) {
            return acc;
          }
          if (cur.categoryKey === notificationDocuments.categoryKey) {
            setStartTabIndex(index);
          }
          const temp: { label: string | ReactNode; content: ReactNode } = {
            label: '',
            content: undefined,
          };
          temp.label = (
            <Typography
              component={'div'}
              fontWeight={600}
              sx={{ display: 'flex', alignItems: 'center', gap: 1 }}
            >
              {cur.categoryName}{' '}
              <Stack
                alignItems={'center'}
                borderRadius={1}
                className={'total_number'}
                color={'#ffffff'}
                fontSize={12}
                fontWeight={600}
                height={20}
                justifyContent={'center'}
                px={1}
              >
                {cur.categoryDocs.length}
              </Stack>
            </Typography>
          );
          temp.content = (
            <Stack gap={3} my={3}>
              {cur.categoryDocs.map((item, index) => (
                <StyledUploadButtonBox
                  key={`${item.fileKey}_${index}`}
                  loanNumber={loanNumber}
                  refresh={() => fetchData()}
                  {...item}
                />
              ))}
            </Stack>
          );
          acc.push(temp);
          return acc;
        },
        [] as { label: string | ReactNode; content: ReactNode }[],
      );
      setTabData(tabData);
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

  const onClickToDownloadLetter = useCallback(async () => {
    const handler = (data: any, fileName?: string) => {
      // file export
      if (!data) {
        return;
      }
      const fileUrl = window.URL.createObjectURL(
        new Blob([data], { type: 'application/octet-stream' }),
      );
      const a = document.createElement('a');
      a.style.display = 'none';
      a.download = fileName || 'Pre-approval-letter.pdf';
      a.href = fileUrl;
      a.click();
      if (document.body.contains(a)) {
        document.body.removeChild(a);
      }
    };

    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    setDownloadLoading(true);
    try {
      const res = await _downloadFile(loanId);
      handler(res.data);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setDownloadLoading(false);
    }
  }, [enqueueSnackbar]);

  useEffect(
    () => {
      if (
        !notificationDocuments.categoryKey ||
        !notificationDocuments.fileId ||
        !notificationDocuments.fileName
      ) {
        return;
      }
      fetchData();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      notificationDocuments.categoryKey,
      notificationDocuments.fileId,
      notificationDocuments.fileName,
    ],
  );

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
        gap={3}
        justifyContent={'flex-start'}
        maxWidth={900}
        mt={{ xs: -3, lg: 0 }}
        mx={{ lg: 'auto', xs: 0 }}
        px={{ lg: 3, xs: 0 }}
        width={{ lg: 'calc(100% - 280px)', xs: '100%' }}
      >
        <Typography
          textAlign={'center'}
          variant={['xs', 'sm', 'md'].includes(breakpoints) ? 'h6' : 'h5'}
        >
          Documents
          <Typography
            color={'text.secondary'}
            fontSize={{ xs: 12, lg: 16 }}
            mt={{ xs: 1, lg: 0 }}
            textAlign={'center'}
          >
            We&apos;ve implemented robust security measures to ensure your
            data&apos;s privacy and protection, including advanced encryption,
            privacy compliance, and regular security audits.
          </Typography>
          <Typography
            color={'text.secondary'}
            fontSize={{ xs: 12, lg: 16 }}
            mt={1.5}
          >
            Here is your{' '}
            <Typography
              color={downloadLoading ? 'text.disabled' : 'primary.main'}
              component={'span'}
              fontSize={{ xs: 12, lg: 16 }}
              fontWeight={600}
              onClick={async () => {
                if (downloadLoading) {
                  return;
                }
                await onClickToDownloadLetter();
                // todo
                // await router.push({
                //   pathname: '/dashboard/overview',
                //   query: {
                //     loanId: router.query.loanId,
                //   },
                // });
              }}
              sx={{ cursor: downloadLoading ? 'not-allowed' : 'pointer' }}
            >
              Pre-approval letter
            </Typography>
            .
          </Typography>
        </Typography>

        {isTips && (
          <Stack
            bgcolor={'rgba(255, 249, 234, 1)'}
            borderRadius={2}
            boxShadow={'0 2px 2px rgba(227, 227, 227, 1)'}
            color={'rgba(229, 154, 0, 1)'}
            flexDirection={'row'}
            fontSize={{ xs: 12, lg: 14 }}
            fontWeight={600}
            gap={1}
            p={'12px 16px'}
          >
            <Icon component={NOTIFICATION_WARNING} sx={{ mt: -0.25 }} />
            Complete the &quot;Borrower&quot; task first to filter out the
            unnecessary documents below.
          </Stack>
        )}

        <Stack maxWidth={'100%'} width={'100%'}>
          <StyledTab
            startIndex={startTabIndex}
            sx={{ m: '0 auto', maxWidth: '100%' }}
            tabsData={tabData}
          />
        </Stack>
      </Stack>
    </Fade>
  );
});
