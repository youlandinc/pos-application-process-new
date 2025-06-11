import { FC, useMemo, useRef, useState } from 'react';
import { Box, Fade, Stack, Typography } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  useBreakpoints,
  useRenderPdf,
  useSessionStorageState,
  useSwitch,
} from '@/hooks';
import {
  AUTO_HIDE_DURATION,
  QUALIFICATION_ACH_ACCOUNT_TYPE,
} from '@/constants';

import {
  StyledButton,
  StyledDialog,
  StyledGoogleAutoComplete,
  StyledLoading,
  StyledSelect,
  StyledTextField,
  Transitions,
} from '@/components/atoms';

import {
  AccountRoleTaskKey,
  HttpError,
  QualificationACHAccountType,
  TaskFiles,
  UserType,
} from '@/types';
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

export const ACH: FC = observer(() => {
  const router = useRouter();
  const breakpoints = useBreakpoints();
  const { enqueueSnackbar } = useSnackbar();

  const { userType } = useMst();

  const { visible, open, close } = useSwitch(false);
  const { saasState } = useSessionStorageState('tenantConfig');

  const [saveLoading, setSaveLoading] = useState(false);
  const [genLoading, setGenLoading] = useState<boolean>(false);
  const [agreeLoading, setAgreeLoading] = useState<boolean>(false);

  const pdfFile = useRef(null);
  const { renderFile } = useRenderPdf(pdfFile);

  const [bankName, setBankName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [accountType, setAccountType] = useState<QualificationACHAccountType>(
    QualificationACHAccountType.default,
  );
  const [documentFile, setDocumentFile] =
    useState<TaskFiles>(initialDocumentFile);
  const [achAddress] = useState<IAddress>(
    Address.create({
      id: '',
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

  const { loading } = useAsync(async () => {
    try {
      const {
        data: {
          bankName,
          address,

          accountName,
          accountNumber,
          routingNumber,
          accountType,

          documentFile,
        },
      } = await _fetchRoleTaskDetail(AccountRoleTaskKey.ach);

      setBankName(bankName ?? '');

      achAddress.injectServerData(address);

      setAccountName(accountName ?? '');
      setAccountNumber(accountNumber ?? '');
      setRoutingNumber(routingNumber ?? '');
      setAccountType(accountType ?? QualificationACHAccountType.default);

      setDocumentFile(documentFile || initialDocumentFile);
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
      taskKey: AccountRoleTaskKey.ach,
      taskForm: {
        bankName,
        address: achAddress.getPostData(),
        accountName,
        accountNumber,
        routingNumber,
        accountType,
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
      taskKey: AccountRoleTaskKey.ach,
      taskForm: {
        bankName,
        address: achAddress.getPostData(),
        accountName,
        accountNumber,
        routingNumber,
        accountType,
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
        return { name: 'broker', isGenFile: true };
      case UserType.LOAN_OFFICER:
        return { name: 'loan officer', isGenFile: false };
      case UserType.REAL_ESTATE_AGENT:
        return { name: 'real estate agent', isGenFile: false };
      default:
        return { name: '', isGenFile: false };
    }
  }, [userType]);

  const onClickSave = async () => {
    const params = {
      taskKey: AccountRoleTaskKey.ach,
      taskForm: {
        bankName,
        address: achAddress.getPostData(),
        accountName,
        accountNumber,
        routingNumber,
        accountType,
        documentFile: computedCondition.isGenFile ? documentFile : null,
      },
    };

    setSaveLoading(true);
    try {
      await _updateRoleTaskDetail(params);
      setSaveLoading(false);
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
          ACH Information
          <Typography
            color={'text.secondary'}
            component={'p'}
            fontSize={{ xs: 12, md: 16 }}
            mt={1.5}
            variant={'body3'}
          >
            Please provide your ACH information to ensure timely payment of your
            compensation
          </Typography>
        </Typography>

        <Stack gap={3}>
          <StyledTextField
            disabled={genLoading || saveLoading}
            label={'Bank name'}
            onChange={(e) => setBankName(e.target.value)}
            placeholder={'Bank name'}
            value={bankName}
          />

          <StyledGoogleAutoComplete
            address={achAddress}
            disabled={genLoading || saveLoading}
            label={'Bank address'}
          />

          <Stack flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
            <StyledTextField
              disabled={genLoading || saveLoading}
              label={'Account holder name'}
              onChange={(e) => setAccountName(e.target.value)}
              placeholder={'Account holder name'}
              value={accountName}
            />

            <StyledTextField
              disabled={genLoading || saveLoading}
              label={'Routing number'}
              onChange={(e) => setRoutingNumber(e.target.value)}
              placeholder={'Routing number'}
              value={routingNumber}
            />
          </Stack>

          <Stack flexDirection={{ xs: 'column', md: 'row' }} gap={3}>
            <StyledTextField
              disabled={genLoading || saveLoading}
              label={'Account Number'}
              onChange={(e) => setAccountNumber(e.target.value)}
              placeholder={'Account number'}
              value={accountNumber}
            />

            <StyledSelect
              disabled={genLoading || saveLoading}
              label={'Account type'}
              onChange={(e) =>
                setAccountType(
                  e.target.value as string as QualificationACHAccountType,
                )
              }
              options={QUALIFICATION_ACH_ACCOUNT_TYPE}
              value={accountType}
            />
          </Stack>
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
                  The attached document is your approved{' '}
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
                    ACH Information.pdf
                  </Typography>
                  . For any changes, a new agreement will be generated and will
                  require your confirmation again.
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
            onClick={async () =>
              await router.push({
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
              <Typography
                variant={['xs', 'sm'].includes(breakpoints) ? 'body3' : 'body1'}
              >
                I hereby consent and acknowledge my agreement to the electronic
                loan agreement and associated terms of{' '}
                {saasState?.doingBusinessAsName || 'YouLand'}.
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
              <Typography variant={'h6'}>ACH Information</Typography>
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
