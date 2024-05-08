import { FC, ReactNode, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useAsync } from 'react-use';

import { POSGetParamsFromUrl } from '@/utils';
import { useBreakpoints, useSessionStorageState } from '@/hooks';

import {
  StyledLoading,
  StyledTab,
  StyledUploadButtonBox,
} from '@/components/atoms';

import { _fetchLoanDocumentData } from '@/requests/dashboard';
import { DocumentUploadResponse, HttpError } from '@/types';
import { AUTO_HIDE_DURATION } from '@/constants';
import { AxiosResponse } from 'axios';

export const Documents: FC = () => {
  const router = useRouter();
  const breakpoints = useBreakpoints();
  const { enqueueSnackbar } = useSnackbar();

  const { saasState } = useSessionStorageState('tenantConfig');

  const [tabData, setTabData] = useState<
    { label: string; content: ReactNode }[]
  >([]);

  const { loading } = useAsync(async () => await fetchData(), [location.href]);

  const fetchData = async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    try {
      const { data } = await _fetchLoanDocumentData(loanId);
      const tabData = data.reduce(
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
        mx={{ lg: 'auto', xs: 0 }}
        px={{ lg: 3, xs: 0 }}
        width={'100%'}
      >
        <Typography
          textAlign={'center'}
          variant={['xs', 'sm', 'md'].includes(breakpoints) ? 'h6' : 'h5'}
        >
          Documents
          <Typography color={'text.secondary'} mt={1.5} textAlign={'center'}>
            We&apos;ve implemented robust security measures to ensure your
            data&apos;s privacy and protection, including advanced encryption,
            privacy compliance, and regular security audits.
          </Typography>
        </Typography>

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
