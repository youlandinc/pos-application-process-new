import { FC, useMemo, useRef, useState } from 'react';
import { Box, Fade, Stack, Typography } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useBreakpoints, useRenderPdf, useSwitch } from '@/hooks';
import { AUTO_HIDE_DURATION, userpool } from '@/constants';

import {
  StyledButton,
  StyledDialog,
  StyledGoogleAutoComplete,
  StyledLoading,
  StyledTextField,
  Transitions,
} from '@/components/atoms';

import { AccountRoleTaskKey, HttpError, TaskFiles, UserType } from '@/types';
import { Address, IAddress } from '@/models/common/Address';
import {
  _fetchRoleTaskDetail,
  _generateRoleFile,
  _previewRoleFile,
  _updateRoleTaskDetail,
} from '@/requests';

const initialDocumentFile = {
  originalFileName: '',
  fileName: '',
  url: '',
  uploadTime: '',
};

export const Agreement: FC = observer(() => {
  const router = useRouter();
  const breakpoints = useBreakpoints();
  const { enqueueSnackbar } = useSnackbar();

  const { userType } = useMst();

  const { visible, open, close } = useSwitch(false);

  const [saveLoading, setSaveLoading] = useState(false);
  const [genLoading, setGenLoading] = useState<boolean>(false);
  const [agreeLoading, setAgreeLoading] = useState<boolean>(false);

  const [company, setCompany] = useState('');
  const [agreementAddress] = useState<IAddress>(
    Address.create({
      formatAddress: '',
      state: '',
      street: '',
      city: '',
      aptNumber: '',
      postcode: '',
      isValid: false,
      errors: {},
    }),
  );

  const pdfFile = useRef(null);
  const { renderFile } = useRenderPdf(pdfFile);

  const [documentFile, setDocumentFile] =
    useState<TaskFiles>(initialDocumentFile);

  const { loading } = useAsync(async () => {
    try {
      const {
        data: { documentFile, company, propAddr },
      } = await _fetchRoleTaskDetail(AccountRoleTaskKey.agreement);

      setCompany(company ?? '');
      setDocumentFile(documentFile || initialDocumentFile);
      agreementAddress.injectServerData(propAddr);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
      await router.push({
        pathname: '/account',
        query: { tab: 1 },
      });
    }
  });

  const handledGenerateFile = async () => {
    setGenLoading(true);
    const params = {
      taskKey: AccountRoleTaskKey.agreement,
      taskForm: {
        company,
        propAddr: agreementAddress.getPostData(),
      },
    };
    try {
      const { data } = await _previewRoleFile(params);
      open();
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
    } finally {
      setGenLoading(false);
    }
  };

  const handledSaveFile = async () => {
    setAgreeLoading(true);
    const params = {
      taskKey: AccountRoleTaskKey.agreement,
      taskForm: {
        company,
        propAddr: agreementAddress.getPostData(),
      },
    };

    try {
      const {
        data: { originalFileName, fileName, url, uploadTime },
      } = await _generateRoleFile(params);
      setDocumentFile({
        originalFileName,
        fileName,
        url,
        uploadTime,
      });
      close();
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setAgreeLoading(false);
    }
  };

  const computedCondition = useMemo(() => {
    switch (userType) {
      case UserType.BROKER:
        return {
          title: 'Broker agreement',
          subtitle:
            "Please fill in the fields below and we'll generate a broker agreement for you.",
          isGenFile: true,
        };
      case UserType.LOAN_OFFICER:
        return {
          title: 'Loan officer information',
          subtitle: 'Please fill out the information that pertains to you.',
          isGenFile: false,
        };
      case UserType.REAL_ESTATE_AGENT:
        return {
          title: 'Real estate agent information',
          subtitle: 'Please fill out the information that pertains to you.',
          isGenFile: false,
        };
      default:
        return {
          title: '',
          subtitle: '',
          isGenFile: false,
        };
    }
  }, [userType]);

  const onClickSave = async () => {
    setSaveLoading(true);
    const params = {
      taskKey: AccountRoleTaskKey.agreement,
      taskForm: {
        company,
        propAddr: agreementAddress.getPostData(),
      },
    };
    try {
      await _updateRoleTaskDetail(params);
      await userpool.refreshToken(userpool.getLastAuthUserId());
      await router.push({
        pathname: '/account',
        query: { tab: 1 },
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
        gap={{ xs: 3, lg: 6 }}
        justifyContent={'flex-start'}
        maxWidth={900}
        mx={{ lg: 'auto', xs: 0 }}
        px={{ lg: 3, xs: 0 }}
        width={'100%'}
      >
        <Typography
          component={'div'}
          textAlign={'center'}
          variant={['xs', 'sm', 'md'].includes(breakpoints) ? 'h6' : 'h5'}
        >
          {computedCondition.title}
          <Typography
            color={'text.secondary'}
            component={'p'}
            fontSize={{ xs: 12, md: 16 }}
            mt={1.5}
            variant={'body3'}
          >
            {computedCondition.subtitle}
          </Typography>
        </Typography>

        <Stack gap={3}>
          <StyledTextField
            disabled={genLoading || saveLoading}
            label={'Company name'}
            onChange={(e) => setCompany(e.target.value)}
            placeholder={'Company name'}
            value={company}
          />

          <StyledGoogleAutoComplete
            address={agreementAddress}
            disabled={genLoading || saveLoading}
            label={'Bank address'}
          />
        </Stack>

        {computedCondition.isGenFile && (
          <Stack alignItems={'center'} gap={6}>
            <StyledButton
              color={'primary'}
              disabled={genLoading}
              loading={genLoading}
              onClick={handledGenerateFile}
              sx={{ maxWidth: 560, width: '100%' }}
              variant={'outlined'}
            >
              Generate file
            </StyledButton>

            <Transitions
              style={{
                display: documentFile?.url ? 'block' : 'none',
              }}
            >
              {documentFile?.url && (
                <Typography
                  color={'text.secondary'}
                  component={'div'}
                  fontSize={{ xs: 12, md: 16 }}
                  textAlign={'center'}
                  variant={'body3'}
                >
                  The attached document is the{' '}
                  <Typography
                    color={'primary.main'}
                    component={'span'}
                    fontSize={'inherit'}
                    fontWeight={600}
                    onClick={() => {
                      if (genLoading) {
                        return;
                      }
                      window.open(documentFile.url);
                    }}
                    sx={{ cursor: 'pointer' }}
                  >
                    Broker Agreement.pdf
                  </Typography>{' '}
                  that you have confirmed. In case you need to make any changes,
                  a new agreement will be generated and require your agreement
                  again.
                </Typography>
              )}
            </Transitions>
          </Stack>
        )}

        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          gap={3}
          justifyContent={'center'}
          mt={3}
        >
          <StyledButton
            color={'info'}
            onClick={() =>
              router.push({
                pathname: '/account',
                query: { tab: 1 },
              })
            }
            sx={{
              flex: 1,
              width: '100%',
              maxWidth: 276,
            }}
            variant={'text'}
          >
            Back
          </StyledButton>
          <StyledButton
            color={'primary'}
            disabled={saveLoading}
            loading={saveLoading}
            onClick={onClickSave}
            sx={{
              flex: 1,
              width: '100%',
              maxWidth: 276,
            }}
          >
            Save
          </StyledButton>
        </Stack>

        <StyledDialog
          content={<Box ref={pdfFile} />}
          disableEscapeKeyDown
          footer={
            <Stack
              alignItems={'center'}
              flexDirection={{ xs: 'column', lg: 'row' }}
              gap={3}
              justifyContent={{ lg: 'space-between', xs: 'center' }}
              pt={3}
              textAlign={'left'}
              width={'100%'}
            >
              <Typography fontSize={{ xs: 12, md: 16 }} variant={'body3'}>
                By clicking the button, I hereby agree to the above broker
                agreement.
              </Typography>
              <StyledButton
                disabled={agreeLoading}
                loading={agreeLoading}
                onClick={handledSaveFile}
                sx={{ flexShrink: 0, height: 56, width: 200 }}
              >
                I agree
              </StyledButton>
            </Stack>
          }
          header={
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              pb={3}
            >
              <Typography variant={'h6'}>{computedCondition.title}</Typography>
              <StyledButton
                disabled={agreeLoading}
                isIconButton
                onClick={close}
              >
                <CloseOutlined />
              </StyledButton>
            </Stack>
          }
          open={visible}
          sx={{
            '& .MuiPaper-root': {
              maxWidth: { lg: '900px !important', xs: '100% !important' },
              width: '100%',
              '& .MuiDialogTitle-root, & .MuiDialogActions-root': {
                bgcolor: '#F5F8FA',
                p: 3,
              },
            },
          }}
        />
      </Stack>
    </Fade>
  );
});
