import { FC, useEffect, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { AUTO_HIDE_DURATION } from '@/constants';
import { HttpError } from '@/types';
import {
  _portalClickTimes,
  _portalDeleteFile,
  _portalFetchData,
  _portalUploadFile,
} from '@/requests';

import {
  StyledButton,
  StyledHeaderLogo,
  StyledLoading,
  StyledUploadButtonBox,
} from '@/components/atoms';

import { SaasLoanProgress } from './components';

import { POSGetParamsFromUrl } from '@/utils';

interface formItem {
  formId: string;
  formName: string;
  templateUrl: string;
  templateName: string;
  popup: string;
  files: any[];
}

export const SaasDocumentPortalPage: FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [firstLoading, setFirstLoading] = useState<boolean>(true);
  const [loanId, setLoanId] = useState<string>('');
  const [formList, setFormList] = useState<formItem[]>([]);
  const [address, setAddress] = useState<string>('');

  useEffect(
    () => {
      setFirstLoading(true);
      const { loanId } = POSGetParamsFromUrl(window.location.href);
      if (!loanId) {
        router.push('/');
      }
      setLoanId(loanId);
      _portalFetchData(loanId)
        .then((res) => {
          const { data } = res;
          setFormList(data?.formList);
          setAddress(data?.propertyAddress ?? '');
        })
        .catch((err) => {
          const { header, message, variant } = err as HttpError;
          enqueueSnackbar(message, {
            variant: variant || 'error',
            autoHideDuration: AUTO_HIDE_DURATION,
            isSimple: !header,
            header,
          });
        })
        .finally(() => {
          setFirstLoading(false);
        });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

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
      {firstLoading ? (
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

            {mode === 'edit' && (
              <StyledButton
                color={'info'}
                onClick={async () => {
                  setMode('detail');
                  await _portalClickTimes(loanId);
                }}
                variant={'outlined'}
              >
                View loan progress
              </StyledButton>
            )}
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
                gap={3}
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
                {address && <Typography>{address}</Typography>}

                {formList &&
                  formList?.length > 0 &&
                  formList.map((item, index) => (
                    <StyledUploadButtonBox
                      deleteOnly={true}
                      fileKey={item.formId}
                      fileName={item.formName}
                      files={item.files || []}
                      isFromLOS={true}
                      key={`${item.formId}_${index}`}
                      loanId={loanId}
                      onDelete={async (deleteIndex) => {
                        if (!item.files[deleteIndex].url) {
                          return;
                        }
                        const params = {
                          url: item.files[deleteIndex].url as string,
                          loanId,
                          formId: item.formId,
                        };
                        await _portalDeleteFile(params);
                        const tempFiles = JSON.parse(
                          JSON.stringify(item.files),
                        );
                        const tempList = JSON.parse(JSON.stringify(formList));
                        tempFiles.splice(deleteIndex, 1);
                        tempList.splice(index, 1, {
                          ...item,
                          files: tempFiles,
                        });
                        setFormList(tempList);
                      }}
                      onUpload={async (files) => {
                        const formData = new FormData();
                        formData.append('formId', item.formId);
                        Array.from(files, (item) => {
                          formData.append('files', item as Blob);
                        });
                        const { data } = await _portalUploadFile({
                          files: formData,
                          loanId,
                        });
                        const tempFiles = [...item.files, ...data];
                        const tempList = JSON.parse(JSON.stringify(formList));
                        tempList.splice(index, 1, {
                          ...item,
                          files: tempFiles,
                        });
                        setFormList(tempList);
                      }}
                      popup={item.popup}
                      templateName={item.templateName}
                      templateUrl={item.templateUrl}
                    />
                  ))}
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
