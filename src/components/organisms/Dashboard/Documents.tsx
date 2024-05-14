import { FC, ReactNode, useState } from 'react';
import { Fade, Icon, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';
import { useAsync } from 'react-use';

import { useBreakpoints } from '@/hooks';

import { POSGetParamsFromUrl } from '@/utils';

import { AUTO_HIDE_DURATION } from '@/constants';

import {
  StyledLoading,
  StyledTab,
  StyledUploadButtonBox,
} from '@/components/atoms';

import { HttpError } from '@/types';
import { _fetchLoanDocumentData } from '@/requests/dashboard';

import NOTIFICATION_WARNING from '@/components/atoms/StyledNotification/notification_warning.svg';

export const Documents: FC = () => {
  const breakpoints = useBreakpoints();
  const { enqueueSnackbar } = useSnackbar();

  const [tabData, setTabData] = useState<
    { label: string; content: ReactNode }[]
  >([]);

  const [isTips, setIsTips] = useState<boolean>(false);

  const { loading } = useAsync(async () => await fetchData(), [location.href]);

  const fetchData = async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    try {
      const {
        data: { docs, isTips },
      } = await _fetchLoanDocumentData(loanId);
      setIsTips(isTips);
      const tabData = docs.reduce(
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
                  refresh={() => fetchData()}
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
        width={'100%'}
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
            Complete the &quot;Borrower&quot; task first to see only the
            necessary documents below.
          </Stack>
        )}

        <Stack maxWidth={'100%'} width={'100%'}>
          <StyledTab
            sx={{ m: '0 auto', maxWidth: '100%' }}
            tabsData={tabData}
          />
        </Stack>
      </Stack>
    </Fade>
  );
};
