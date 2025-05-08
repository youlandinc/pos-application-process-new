import { FC, ReactNode, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useAsync } from 'react-use';

import { AUTO_HIDE_DURATION } from '@/constants';
import { HttpError } from '@/types';
import {
  //_portalClickTimes,
  _portalDeleteFile,
  _portalFetchData,
  _portalUploadFile,
} from '@/requests';

import {
  //StyledButton,
  StyledHeaderLogo,
  StyledLoading,
  StyledTab,
  StyledUploadButtonBox,
} from '@/components/atoms';

import { SaasLoanProgress } from './components';

import { POSGetParamsFromUrl } from '@/utils';

export const SaasDocumentPortalPage: FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [loanId, setLoanId] = useState<string>('');
  const [address, setAddress] = useState<string>('');

  const [tabData, setTabData] = useState<
    { label: string | ReactNode; content: ReactNode }[]
  >([]);

  const { loading } = useAsync(async () => await fetchData(), [location.href]);

  const fetchData = async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      enqueueSnackbar('Invalid loan ID', {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        onClose: () => router.push('/'),
      });
      return;
    }
    setLoanId(loanId);

    try {
      const {
        data: { docs, propertyAddress, loanNumber },
      } = await _portalFetchData(loanId);

      setAddress(propertyAddress ?? '');

      const tabData = docs.reduce(
        (acc, cur) => {
          if (!cur?.categoryName) {
            return acc;
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
              {cur.categoryDocs.map((item, index) => {
                return (
                  <StyledUploadButtonBox
                    deleteOnly={true}
                    fileKey={item.id + ''}
                    fileName={item.fileName}
                    files={item.files || []}
                    id={item.id}
                    isFromLOS={true}
                    isShowHistory={false}
                    key={`${item.id}_${index}`}
                    loanId={loanId}
                    loanNumber={loanNumber || ''}
                    onDelete={async (deleteIndex) => {
                      if (!item.files[deleteIndex].url) {
                        return;
                      }
                      const params = {
                        url: item.files[deleteIndex].url as string,
                        loanId,
                        formId: item.id + '',
                      };
                      try {
                        await _portalDeleteFile(params);
                        await fetchData();
                      } catch (err) {
                        const { header, message, variant } = err as HttpError;
                        enqueueSnackbar(message, {
                          variant: variant || 'error',
                          autoHideDuration: AUTO_HIDE_DURATION,
                          isSimple: !header,
                          header,
                        });
                      }
                    }}
                    onUpload={async (files) => {
                      const formData = new FormData();
                      formData.append('formId', item.id + '');
                      Array.from(files, (item) => {
                        formData.append('files', item as Blob);
                      });
                      try {
                        await _portalUploadFile({
                          files: formData,
                          loanId,
                        });
                        await fetchData();
                      } catch (err) {
                        const { header, message, variant } = err as HttpError;
                        enqueueSnackbar(message, {
                          variant: variant || 'error',
                          autoHideDuration: AUTO_HIDE_DURATION,
                          isSimple: !header,
                          header,
                        });
                      }
                    }}
                    popup={item.fileKey}
                    status={item.status}
                    templateName={item.templateName || ''}
                    templateUrl={item.templateUrl || ''}
                  />
                );
              })}
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

  const [mode, setMode] = useState<'edit' | 'detail'>('edit');

  return (
    <Stack
      bgcolor={'#FFFFFF'}
      margin={'0 auto'}
      pb={10}
      width={{
        xxl: 1440,
        xl: 1240,
        lg: 938,
        xs: '100%',
      }}
    >
      {loading ? (
        <Stack
          alignItems={'center'}
          height={'100vh'}
          justifyContent={'center'}
          minHeight={'calc(667px - 46px)'}
          width={'100%'}
        >
          <StyledLoading sx={{ color: 'text.grey' }} />
        </Stack>
      ) : (
        <Stack width={'100%'}>
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            height={92}
            justifyContent={'space-between'}
            mb={'clamp(24px,6.4vw,80px)'}
            px={{
              lg: 0,
              xs: 'clamp(24px,6.4vw,80px)',
            }}
            width={'100%'}
          >
            <StyledHeaderLogo />

            {/*{mode === 'edit' && (*/}
            {/*  <StyledButton*/}
            {/*    color={'info'}*/}
            {/*    onClick={async () => {*/}
            {/*      setMode('detail');*/}
            {/*      await _portalClickTimes(loanId);*/}
            {/*    }}*/}
            {/*    variant={'outlined'}*/}
            {/*  >*/}
            {/*    View loan progress*/}
            {/*  </StyledButton>*/}
            {/*)}*/}
          </Stack>

          <Stack
            gap={6}
            px={{
              lg: 0,
              xs: 'clamp(24px,6.4vw,80px)',
            }}
            width={'100%'}
          >
            {mode === 'edit' ? (
              <Stack
                alignItems={'center'}
                m={'0 auto'}
                maxWidth={900}
                width={'100%'}
              >
                <Typography
                  fontSize={'clamp(28px,3.2vw,36px)'}
                  textAlign={'center'}
                  variant={'h3'}
                >
                  Document portal
                </Typography>
                {address && <Typography mt={1}>{address}</Typography>}

                <Stack gap={3} mt={6} width={'100%'}>
                  <StyledTab
                    startIndex={0}
                    sx={{ maxWidth: '100%', m: 0 }}
                    tabsData={tabData}
                  />
                </Stack>
              </Stack>
            ) : (
              <SaasLoanProgress cb={() => setMode('edit')} loanId={loanId} />
            )}
          </Stack>
        </Stack>
      )}
    </Stack>
  );
};
