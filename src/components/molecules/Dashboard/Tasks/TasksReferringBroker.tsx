import { FC, useMemo, useState } from 'react';
import { Fade, Grow, Icon, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';
import _uniqueId from 'lodash/uniqueId';

import { observer } from 'mobx-react-lite';
import { Address, IAddress } from '@/models/common/Address';

import { useBreakpoints } from '@/hooks';
import { POSGetParamsFromUrl } from '@/utils';
import { AUTO_HIDE_DURATION, OPTIONS_COMMON_YES_OR_NO } from '@/constants';

import {
  StyledButton,
  StyledButtonGroup,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledLoading,
  StyledTextField,
  StyledTextFieldNumber,
  StyledTextFieldPhone,
  Transitions,
} from '@/components/atoms';

import {
  AdditionalFee,
  DashboardTaskKey,
  FeeUnitEnum,
  HttpError,
  LoanAnswerEnum,
} from '@/types';
import {
  _fetchLoanTaskDetail,
  _updateLoanTaskDetail,
} from '@/requests/dashboard';

import ICON_CLOSE from '@/svg/icon/icon_close.svg';
import { TasksRightMenu } from '@/components/molecules';

const initialized: AdditionalFee = {
  fieldName: '',
  unit: FeeUnitEnum.dollar,
  value: undefined,
};

export const TasksReferringBroker: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const breakpoints = useBreakpoints();

  const [saveLoading, setSaveLoading] = useState(false);

  const [hasReferringBroker, setHasReferringBroker] = useState<boolean>(false);

  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState<string>('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [license, setLicense] = useState<string>('');

  const [address] = useState<IAddress>(
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

  const [referOriginationPoints, setReferOriginationPoints] = useState<
    number | undefined
  >();
  const [referProcessingFee, setReferProcessingFee] = useState<
    number | undefined
  >();
  const [referAdditionalFees, setReferAdditionalFees] = useState<
    AdditionalFee[]
  >([]);

  const { loading } = useAsync(async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    try {
      const {
        data: {
          data: {
            email,
            companyName,
            phoneNumber,
            license,
            mailingAddress,
            hasReferringBroker,
            referAdditionalFees,
            referProcessingFee,
            referOriginationPoints,
          },
        },
      } = await _fetchLoanTaskDetail({
        loanId,
        taskKey: DashboardTaskKey.referring_broker,
      });

      setHasReferringBroker(hasReferringBroker ?? false);

      setEmail(email ?? '');
      setCompanyName(companyName ?? '');
      setPhoneNumber(phoneNumber ?? '');
      setLicense(license ?? '');

      setReferProcessingFee(referProcessingFee);
      setReferOriginationPoints(
        referOriginationPoints
          ? (referOriginationPoints * 1000000) / 10000
          : undefined,
      );
      setReferAdditionalFees(referAdditionalFees ?? []);

      mailingAddress && address.injectServerData(mailingAddress);
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

  const isFormDataValid = useMemo(() => {
    const baseResult =
      !!email && !!companyName && !!phoneNumber && address.isValid;
    if (!hasReferringBroker) {
      return true;
    }
    if (referAdditionalFees.length > 0) {
      return (
        referAdditionalFees.every((item) => !!item.fieldName && !!item.value) &&
        baseResult
      );
    }
    return baseResult;
  }, [
    email,
    companyName,
    phoneNumber,
    address.isValid,
    hasReferringBroker,
    referAdditionalFees,
  ]);

  const handleSave = async () => {
    const postData = {
      loanId: POSGetParamsFromUrl(location.href).loanId,
      taskKey: DashboardTaskKey.referring_broker,
      data: {
        hasReferringBroker,
        email,
        companyName,
        phoneNumber,
        license,
        mailingAddress: address.getPostData(),
        referAdditionalFees,
        referProcessingFee,
        referOriginationPoints: referOriginationPoints
          ? referOriginationPoints / 100
          : 0,
      },
    };
    setSaveLoading(true);
    try {
      await _updateLoanTaskDetail(postData);
      await router.push({
        pathname: '/dashboard/tasks',
        query: { loanId: router.query.loanId },
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
      <Stack flexDirection={'row'} justifyContent={'center'} width={'100%'}>
        <Stack
          alignItems={'center'}
          gap={6}
          justifyContent={'flex-start'}
          maxWidth={648}
          mx={{ lg: 'auto', xs: 0 }}
          px={{ lg: 3, xs: 0 }}
          width={'100%'}
        >
          <Typography
            color={'text.primary'}
            fontSize={{ xs: 20, lg: 24 }}
            textAlign={'center'}
            variant={'h5'}
          >
            Referring broker
            <Typography
              color={'text.secondary'}
              fontSize={{ xs: 12, lg: 16 }}
              mt={1}
              variant={'body1'}
            >
              If applicable, please provide the details of the referring broker.
              This will be used for the loan documents.
            </Typography>
          </Typography>

          <StyledFormItem label={'Is there a referring broker?'} sub>
            <StyledButtonGroup
              onChange={(e, value) => {
                if (value === null) {
                  return;
                }
                setHasReferringBroker(value === LoanAnswerEnum.yes);
              }}
              options={OPTIONS_COMMON_YES_OR_NO}
              value={
                hasReferringBroker ? LoanAnswerEnum.yes : LoanAnswerEnum.no
              }
            />
          </StyledFormItem>

          <Transitions
            style={{
              display: hasReferringBroker ? 'block' : 'none',
              width: '100%',
            }}
          >
            {hasReferringBroker && (
              <Stack gap={6} width={'100%'}>
                <StyledFormItem gap={3} label={'Broker information'} sub>
                  <StyledTextField
                    label={'Company name'}
                    onChange={(e) => {
                      setCompanyName(e.target.value);
                    }}
                    placeholder={'Company name'}
                    required
                    value={companyName}
                  />

                  <Stack flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>
                    <StyledTextField
                      label={'Email'}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={'Email'}
                      required
                      value={email}
                    />
                    <StyledTextFieldPhone
                      label={'Phone number'}
                      onValueChange={({ value }) => setPhoneNumber(value)}
                      placeholder={'Phone number'}
                      required
                      value={phoneNumber}
                    />
                  </Stack>

                  <StyledTextField
                    label={'License (optional)'}
                    onChange={(e) => setLicense(e.target.value)}
                    placeholder={'License (optional)'}
                    value={license}
                  />
                </StyledFormItem>

                <StyledFormItem label={'Mailing information (optional)'} sub>
                  <StyledGoogleAutoComplete
                    address={address}
                    label={'Mailing address'}
                  />
                </StyledFormItem>

                <StyledFormItem
                  label={'Referring broker compensation (optional)'}
                  sub
                >
                  <Stack flexDirection={{ xs: 'column', lg: 'row' }} gap={3}>
                    <StyledTextFieldNumber
                      label={'Referring broker origination fee'}
                      onValueChange={({ floatValue }) =>
                        setReferOriginationPoints(floatValue)
                      }
                      percentage={true}
                      placeholder={'Referring broker origination fee'}
                      suffix={'%'}
                      thousandSeparator={false}
                      value={referOriginationPoints}
                    />
                    <StyledTextFieldNumber
                      label={'Referring broker processing fee'}
                      onValueChange={({ floatValue }) =>
                        setReferProcessingFee(floatValue)
                      }
                      placeholder={'Referring broker processing fee'}
                      prefix={'$'}
                      value={referProcessingFee}
                    />
                  </Stack>

                  <Stack gap={3} mt={3}>
                    <Stack alignItems={'center'} flexDirection={'row'} gap={3}>
                      <Stack bgcolor={'#D2D6E1'} flex={1} height={2} />
                      <StyledButton
                        color={'info'}
                        onClick={() =>
                          setReferAdditionalFees([
                            ...referAdditionalFees,
                            {
                              ...initialized,
                              id: _uniqueId('refer_additional_fee'),
                            },
                          ])
                        }
                        sx={{
                          p: '0 !important',
                          '&:hover': { backgroundColor: 'transparent' },
                        }}
                        variant={'text'}
                      >
                        + Add new fee
                      </StyledButton>
                    </Stack>
                    {referAdditionalFees.map((item, index) => (
                      <Grow
                        in={true}
                        key={item.id}
                        style={{ transformOrigin: 'top left' }}
                        timeout={index * 300}
                      >
                        <Stack gap={1.5}>
                          <Stack
                            alignItems={'center'}
                            flexDirection={'row'}
                            justifyContent={'space-between'}
                          >
                            <Typography variant={'subtitle1'}>
                              Additional fee {index + 1}
                            </Typography>
                            <Icon
                              component={ICON_CLOSE}
                              onClick={() => {
                                const temp = JSON.parse(
                                  JSON.stringify(referAdditionalFees),
                                );
                                temp.splice(index, 1);
                                setReferAdditionalFees(temp);
                              }}
                              sx={{
                                height: { xs: 20, lg: 24 },
                                width: { xs: 20, lg: 24 },
                                cursor: 'pointer',
                              }}
                            />
                          </Stack>

                          <Stack
                            flexDirection={{ xs: 'column', lg: 'row' }}
                            gap={3}
                          >
                            <StyledTextField
                              label={'Fee name'}
                              onChange={(e) => {
                                const temp = JSON.parse(
                                  JSON.stringify(referAdditionalFees),
                                );
                                temp[index].fieldName = e.target.value;
                                setReferAdditionalFees(temp);
                              }}
                              placeholder={'Fee name'}
                              value={item.fieldName}
                            />
                            <StyledTextFieldNumber
                              label={'Dollar amount'}
                              onValueChange={({ floatValue }) => {
                                const temp = JSON.parse(
                                  JSON.stringify(referAdditionalFees),
                                );
                                temp[index].value = floatValue;
                                setReferAdditionalFees(temp);
                              }}
                              placeholder={'Dollar amount'}
                              prefix={'$'}
                              value={item.value}
                            />
                          </Stack>
                        </Stack>
                      </Grow>
                    ))}
                  </Stack>
                </StyledFormItem>
              </Stack>
            )}
          </Transitions>

          <Stack
            flexDirection={{ xs: 'unset', md: 'row' }}
            gap={3}
            maxWidth={600}
            width={'100%'}
          >
            <StyledButton
              color={'info'}
              onClick={async () => {
                await router.push({
                  pathname: '/dashboard/tasks',
                  query: { loanId: router.query.loanId },
                });
              }}
              sx={{ flex: 1, width: '100%' }}
              variant={'text'}
            >
              Back
            </StyledButton>
            <StyledButton
              color={'primary'}
              disabled={saveLoading || !isFormDataValid}
              loading={saveLoading}
              onClick={handleSave}
              sx={{ flex: 1, width: '100%' }}
            >
              Save
            </StyledButton>
          </Stack>
        </Stack>
        {['xl', 'xxl'].includes(breakpoints) && <TasksRightMenu />}
      </Stack>
    </Fade>
  );
});
