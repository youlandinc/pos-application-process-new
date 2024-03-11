import { FC, useCallback, useEffect, useState } from 'react';
import { Box, Icon, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION } from '@/constants';
import { useDebounceFn, useSessionStorageState, useSwitch } from '@/hooks';
import {
  POSFormatDollar,
  POSFormatPercent,
  POSGetParamsFromUrl,
  POSNotUndefined,
} from '@/utils';

import { LoanStage, UserType } from '@/types/enum';
import { BridgeRefinanceLoanInfo } from '@/components/molecules/Application';
import {
  BREstimateRateData,
  CustomRateData,
  Encompass,
  HttpError,
  RatesProductData,
} from '@/types';

import { StyledButton, StyledLoading, Transitions } from '@/components/atoms';
import {
  BridgeRefinanceRatesDrawer,
  BridgeRefinanceRatesSearch,
  RatesList,
} from '@/components/molecules';

import {
  _fetchCustomRates,
  _fetchRatesLoanInfo,
  _fetchRatesProduct,
  _fetchRatesProductPreview,
  _updateRatesProductSelected,
  BRQueryData,
} from '@/requests/dashboard';

import RATE_CONFIRMED from '@/svg/dashboard/rate_confirmed.svg';
import RATE_CURRENT from '@/svg/dashboard/rate_current.svg';

const initialize: BRQueryData = {
  homeValue: undefined,
  balance: undefined,
  isCashOut: false,
  cashOutAmount: undefined,
  brokerPoints: undefined,
  brokerProcessingFee: undefined,
  lenderPoints: undefined,
  lenderProcessingFee: undefined,
  officerPoints: undefined,
  officerProcessingFee: undefined,
  agentFee: undefined,
  customRate: undefined,
  interestRate: undefined,
  loanTerm: undefined,
};

export const BridgeRefinanceRates: FC = observer(() => {
  const { userType } = useMst();

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { saasState } = useSessionStorageState('tenantConfig');
  const { open, visible, close } = useSwitch(false);

  const [isFirst, setIsFirst] = useState(true);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [customLoading, setCustomLoading] = useState(false);

  const [view, setView] = useState<'current' | 'confirmed' | 'other'>(
    'current',
  );
  const [loanStage, setLoanStage] = useState<LoanStage>(LoanStage.PreApproved);
  const [searchForm, setSearchForm] = useState<BRQueryData>(initialize);
  const [customLoan, setCustomLoan] = useState<CustomRateData>({
    customRate: undefined,
    interestRate: undefined,
    loanTerm: undefined,
  });

  const [productList, setProductList] = useState<RatesProductData[]>();
  const [reasonList, setReasonList] = useState<string[]>([]);

  const [encompassData, setEncompassData] = useState<Encompass>();
  const [loanInfo, setLoanInfo] = useState<
    BridgeRefinanceLoanInfo & RatesProductData
  >();
  const [primitiveLoanInfo, setPrimitiveLoanInfo] = useState<
    BridgeRefinanceLoanInfo & RatesProductData
  >();

  const [selectedItem, setSelectedItem] = useState<
    BridgeRefinanceLoanInfo &
      Pick<
        RatesProductData,
        'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm' | 'id' | 'selected'
      >
  >();

  const fetchInitData = async () => {
    const { processId } = POSGetParamsFromUrl(location.href);
    if (!processId) {
      return;
    }
    return Promise.all([
      _fetchRatesProduct(processId),
      _fetchRatesLoanInfo(processId),
    ])
      .then((res) => {
        const { products, selectedProduct } = res[0].data;
        setProductList(products);
        const { info, loanStage } = res[1].data;
        setEncompassData(encompassData);
        switch (loanStage) {
          case LoanStage.Approved:
            setView('confirmed');
            break;
          default:
            setView('current');
        }
        setLoanStage(loanStage);

        setLoanInfo({
          ...info,
          ...selectedProduct,
        });

        setPrimitiveLoanInfo({
          ...info,
          ...selectedProduct,
        });
        const {
          homeValue,
          balance,
          isCashOut,
          cashOutAmount,
          lenderPoints,
          lenderProcessingFee,
          brokerPoints,
          brokerProcessingFee,
          officerPoints,
          officerProcessingFee,
          agentFee,
          customRate,
          interestRate,
          loanTerm,
        } = info;
        setSearchForm({
          ...searchForm,
          homeValue,
          balance,
          isCashOut,
          cashOutAmount,
          lenderPoints,
          lenderProcessingFee,
          brokerPoints,
          brokerProcessingFee,
          officerPoints,
          officerProcessingFee,
          agentFee,
          customRate,
          interestRate,
          loanTerm,
        });
        setCustomLoan({
          customRate,
          interestRate,
          loanTerm,
        });
      })
      .catch((err) => {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
          onClose: () => router.push('/pipeline'),
        });
      })
      .finally(() => {
        setTimeout(() => {
          isFirst && setIsFirst(false);
        });
      });
  };

  const { loading: initLoading } = useAsync(fetchInitData);

  const onCheckGetList = async () => {
    setLoading(true);
    if (!searchForm.customRate) {
      await _fetchRatesProductPreview(
        router.query.processId as string,
        searchForm,
      )
        .then((res) => {
          const { products, loanInfo, reasons, selectedProduct } = res.data;
          setProductList(products);
          setLoanInfo({ ...loanInfo, ...selectedProduct });
          setLoading(false);
          setReasonList(reasons);
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
          setLoading(false);
        });
    } else {
      try {
        const {
          data: { loanInfo, product },
        } = await _fetchCustomRates(
          router.query.processId as string,
          searchForm,
        );
        setSelectedItem({ ...loanInfo, ...product });
        open();
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const onCustomLoanClick = async () => {
    setCustomLoading(true);
    const requestData = {
      customRate: true,
      interestRate: customLoan.interestRate,
      loanTerm: customLoan.loanTerm,
    };
    try {
      const {
        data: {
          loanInfo,
          product: {
            paymentOfMonth,
            interestRateOfYear,
            loanTerm,
            id,
            totalClosingCash,
            proRatedInterest,
          },
        },
      } = await _fetchCustomRates(
        router.query.processId as string,
        requestData,
      );
      setSelectedItem(
        Object.assign(loanInfo as BridgeRefinanceLoanInfo, {
          paymentOfMonth,
          interestRateOfYear,
          loanTerm,
          id,
          totalClosingCash,
          proRatedInterest,
        }),
      );
      open();
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setCustomLoading(false);
    }
  };

  const onListItemClick = async (item: RatesProductData) => {
    const {
      paymentOfMonth,
      interestRateOfYear,
      loanTerm,
      id,
      totalClosingCash,
      proRatedInterest,
      selected,
    } = item;
    setSelectedItem(
      Object.assign(loanInfo as BridgeRefinanceLoanInfo, {
        paymentOfMonth,
        interestRateOfYear,
        loanTerm,
        id,
        totalClosingCash,
        proRatedInterest,
        selected,
      }),
    );
    open();
  };

  const updateSelectedProduct = useCallback(
    async (
      postData: Partial<
        Pick<RatesProductData, 'id'> & {
          queryParams: BREstimateRateData;
        }
      >,
    ) => {
      await _updateRatesProductSelected(
        router.query.processId as string,
        postData,
      );
    },
    [router.query.processId],
  );

  const handledViewDetails = useCallback(() => {
    setSelectedItem(loanInfo);
    open();
  }, [loanInfo, open]);

  const handledConfirmedRate = async () => {
    setConfirmLoading(true);
    const postData = {
      id: selectedItem!.id,
      queryParams: {
        ...searchForm,
      },
    };
    try {
      await updateSelectedProduct(postData);
      await fetchInitData();
    } finally {
      close();
      productList?.forEach(
        (item) => (item.selected = selectedItem!.id === item.id),
      );
      setConfirmLoading(false);
      setView('current');
    }
  };

  const { run } = useDebounceFn(() => {
    if (searchForm.isCashOut && !POSNotUndefined(searchForm?.cashOutAmount)) {
      return;
    }
    onCheckGetList();
  }, 1000);

  useEffect(
    () => {
      if (isFirst) {
        return;
      }
      if (
        !POSNotUndefined(searchForm?.homeValue) ||
        !POSNotUndefined(searchForm?.balance)
      ) {
        return;
      }
      if (searchForm.isCashOut && !POSNotUndefined(searchForm?.cashOutAmount)) {
        return;
      }
      run();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      searchForm?.agentFee,
      searchForm?.brokerPoints,
      searchForm?.brokerProcessingFee,
      searchForm?.officerPoints,
      searchForm?.officerProcessingFee,
      searchForm?.lenderPoints,
      searchForm?.lenderProcessingFee,
      // input query
      searchForm?.isCashOut,
      searchForm?.closeDate,
      searchForm?.homeValue,
      searchForm?.balance,
      searchForm?.cashOutAmount,
    ],
  );

  return (
    <Transitions
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
      }}
    >
      {isFirst || initLoading ? (
        <Stack
          alignItems={'center'}
          justifyContent={'center'}
          minHeight={'calc(667px - 46px)'}
          width={'100%'}
        >
          <StyledLoading sx={{ color: 'text.grey', m: 0 }} />
        </Stack>
      ) : (
        <Box
          alignItems={'flex-start'}
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'flex-start'}
          maxWidth={900}
          mx={{ lg: 'auto', xs: 0 }}
          px={{ lg: 3, xs: 0 }}
          width={'100%'}
        >
          <Transitions
            style={{
              width: '100%',
            }}
          >
            {view === 'other' ? (
              <>
                <Typography
                  color={'text.primary'}
                  mb={6}
                  mt={-4.5}
                  onClick={() => {
                    setView('current');
                  }}
                  sx={{
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1.5,
                    fontSize: 14,
                  }}
                  variant={'h6'}
                >
                  <ArrowBackIcon sx={{ fontSize: 16, mb: 0.25 }} />
                  Back to current rate
                </Typography>
                <BridgeRefinanceRatesSearch
                  isDashboard={true}
                  loading={loading}
                  loanStage={loanStage}
                  searchForm={searchForm}
                  setSearchForm={setSearchForm}
                  userType={userType as UserType}
                />
                <RatesList
                  customLoading={customLoading}
                  customLoan={customLoan}
                  isFirstSearch={false}
                  loading={loading}
                  loanStage={loanStage}
                  onClick={onListItemClick}
                  onCustomLoanClick={onCustomLoanClick}
                  productList={productList || []}
                  reasonList={reasonList}
                  setCustomLoan={setCustomLoan}
                  userType={userType}
                />
                <BridgeRefinanceRatesDrawer
                  close={close}
                  loading={confirmLoading}
                  onCancel={handledConfirmedRate}
                  selectedItem={selectedItem}
                  userType={userType as UserType}
                  visible={visible}
                />
              </>
            ) : (
              <Stack alignItems={'center'} gap={6} width={'100%'}>
                <Typography
                  color={'text.primary'}
                  textAlign={'center'}
                  variant={'h4'}
                >
                  {view === 'current'
                    ? 'View selected rate'
                    : 'View confirmed rate'}
                </Typography>

                <Stack
                  alignItems={'center'}
                  border={'2px solid'}
                  borderColor={'background.border_default'}
                  borderRadius={2}
                  maxWidth={600}
                  p={3}
                  width={'100%'}
                >
                  <Stack
                    alignItems={'center'}
                    flexDirection={{ md: 'row', xs: 'column' }}
                    gap={{ md: 0, xs: 1.5 }}
                    justifyContent={'space-between'}
                    py={1.5}
                    width={'100%'}
                  >
                    <Typography variant={'subtitle1'}>
                      Stabilized Bridge ｜ Refinance
                    </Typography>
                    <Box
                      onClick={() => handledViewDetails()}
                      sx={{
                        color: 'primary.main',
                        fontSize: 16,
                        lineHeight: 1.5,
                        fontWeight: 600,
                        cursor: 'pointer',
                        transition: 'all .3s',
                        '&:hover': {
                          color: 'primary.dark',
                        },
                      }}
                    >
                      View details
                    </Box>
                  </Stack>

                  <Icon
                    component={
                      view === 'current' ? RATE_CURRENT : RATE_CONFIRMED
                    }
                    sx={{
                      width: 184,
                      height: 146,
                      mt: 1.5,
                      '& .rate_current_svg__pos_svg_theme_color,& .rate_confirmed_svg__pos_svg_theme_color ':
                        {
                          fill: `hsla(${
                            saasState?.posSettings?.h ?? 222
                          },42%,55%,1)`,
                        },
                    }}
                  />

                  <Stack
                    alignItems={'center'}
                    borderBottom={'1px solid '}
                    borderColor={'background.border_default'}
                    flexDirection={'row'}
                    justifyContent={'space-between'}
                    py={1.5}
                    width={'100%'}
                  >
                    <Typography variant={'body1'}>Interest rate</Typography>
                    <Typography variant={'h4'}>
                      {POSFormatPercent(primitiveLoanInfo?.interestRateOfYear)}
                    </Typography>
                  </Stack>

                  <Stack
                    alignItems={'center'}
                    flexDirection={'row'}
                    justifyContent={'space-between'}
                    py={1.5}
                    width={'100%'}
                  >
                    <Typography variant={'body1'}>Loan term</Typography>
                    <Typography variant={'subtitle1'}>
                      {primitiveLoanInfo?.loanTerm} months
                    </Typography>
                  </Stack>

                  <Stack
                    alignItems={'center'}
                    flexDirection={'row'}
                    justifyContent={'space-between'}
                    py={1.5}
                    width={'100%'}
                  >
                    <Typography variant={'body1'}>
                      As-is property value
                    </Typography>
                    <Typography variant={'subtitle1'}>
                      {POSFormatDollar(primitiveLoanInfo?.homeValue)}
                    </Typography>
                  </Stack>

                  <Stack
                    alignItems={'center'}
                    flexDirection={'row'}
                    justifyContent={'space-between'}
                    py={1.5}
                    width={'100%'}
                  >
                    <Typography variant={'body1'}>Payoff amount</Typography>
                    <Typography variant={'subtitle1'}>
                      {POSFormatDollar(primitiveLoanInfo?.balance)}
                    </Typography>
                  </Stack>

                  {primitiveLoanInfo?.isCashOut && (
                    <Stack
                      alignItems={'center'}
                      flexDirection={'row'}
                      justifyContent={'space-between'}
                      py={1.5}
                      width={'100%'}
                    >
                      <Typography variant={'body1'}>Cash out amount</Typography>
                      <Typography variant={'subtitle1'}>
                        {POSFormatDollar(primitiveLoanInfo?.cashOutAmount)}
                      </Typography>
                    </Stack>
                  )}

                  <Stack
                    alignItems={'center'}
                    flexDirection={'row'}
                    justifyContent={'space-between'}
                    py={1.5}
                    width={'100%'}
                  >
                    <Typography variant={'body1'}>Total loan amount</Typography>
                    <Typography variant={'subtitle1'}>
                      {POSFormatDollar(primitiveLoanInfo?.totalLoanAmount)}
                    </Typography>
                  </Stack>

                  <Stack
                    alignItems={'center'}
                    flexDirection={'row'}
                    justifyContent={'space-between'}
                    py={1.5}
                    width={'100%'}
                  >
                    <Typography variant={'body1'}>Monthly payment</Typography>
                    <Typography variant={'subtitle1'}>
                      {POSFormatDollar(primitiveLoanInfo?.paymentOfMonth)}
                    </Typography>
                  </Stack>
                </Stack>

                {view === 'current' && (
                  <Stack alignItems={'center'} gap={3}>
                    <Typography color={'text.secondary'} variant={'body1'}>
                      Check out the other loan programs you qualify for below.
                    </Typography>

                    <StyledButton
                      onClick={() => setView('other')}
                      sx={{ maxWidth: 180 }}
                      variant={'outlined'}
                    >
                      View other rates
                    </StyledButton>
                  </Stack>
                )}

                <BridgeRefinanceRatesDrawer
                  close={close}
                  isCurrent={true}
                  onCancel={close}
                  selectedItem={selectedItem}
                  userType={userType as UserType}
                  visible={visible}
                />
              </Stack>
            )}
          </Transitions>
        </Box>
      )}
    </Transitions>
  );
});
