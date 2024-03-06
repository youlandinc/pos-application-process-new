import { FC, useCallback, useEffect, useState } from 'react';
import { Box, Icon, Stack, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useRouter } from 'next/router';
import { useAsyncFn } from 'react-use';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION } from '@/constants';
import { useSessionStorageState, useSwitch } from '@/hooks';
import { LoanStage, UserType } from '@/types/enum';
import { BridgePurchaseLoanInfo } from '@/components/molecules/Application';
import {
  BPEstimateRateData,
  Encompass,
  HttpError,
  RatesProductData,
} from '@/types';
import {
  POSFormatDollar,
  POSFormatPercent,
  POSGetParamsFromUrl,
} from '@/utils';

import {
  _fetchCustomRates,
  _fetchRatesLoanInfo,
  _fetchRatesProduct,
  _fetchRatesProductPreview,
  _updateRatesProductSelected,
  BPQueryData,
} from '@/requests/dashboard';

import { StyledButton, StyledLoading, Transitions } from '@/components/atoms';
import {
  BridgePurchaseRatesDrawer,
  BridgePurchaseRatesSearch,
  RatesList,
} from '@/components/molecules';

import RATE_CURRENT from '@/svg/dashboard/rate_current.svg';
import RATE_CONFIRMED from '@/svg/dashboard/rate_confirmed.svg';

const initialize: BPQueryData = {
  purchasePrice: undefined,
  purchaseLoanAmount: undefined,
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

export const BridgePurchaseRates: FC = observer(() => {
  const { userType } = useMst();

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { saasState } = useSessionStorageState('tenantConfig');
  const { open, visible, close } = useSwitch(false);

  const [isFirst, setIsFirst] = useState(true);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [view, setView] = useState<'current' | 'confirmed' | 'other'>(
    'current',
  );

  const [loanStage, setLoanStage] = useState<LoanStage>(LoanStage.PreApproved);
  const [encompassData, setEncompassData] = useState<Encompass>();
  const [searchForm, setSearchForm] = useState<BPQueryData>(initialize);

  const [productList, setProductList] = useState<RatesProductData[]>();
  const [reasonList, setReasonList] = useState<string[]>([]);

  const [loanInfo, setLoanInfo] = useState<
    BridgePurchaseLoanInfo & RatesProductData
  >();
  const [primitiveLoanInfo, setPrimitiveLoanInfo] = useState<
    BridgePurchaseLoanInfo & RatesProductData
  >();
  const [selectedItem, setSelectedItem] = useState<
    BridgePurchaseLoanInfo &
      Pick<
        RatesProductData,
        'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm' | 'id' | 'selected'
      >
  >();

  const [state, fetchInitData] = useAsyncFn(async () => {
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
          purchaseLoanAmount,
          purchasePrice,
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
          purchasePrice,
          purchaseLoanAmount,
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
        isFirst && setIsFirst(false);
      });
  });

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
      Object.assign(loanInfo as BridgePurchaseLoanInfo, {
        paymentOfMonth,
        interestRateOfYear,
        loanTerm,
        id,
        totalClosingCash,
        proRatedInterest,
        selected,
      }) as BridgePurchaseLoanInfo &
        Pick<
          RatesProductData,
          'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm' | 'id'
        >,
    );
    open();
  };

  const handledViewDetails = useCallback(() => {
    setSelectedItem(loanInfo);
    open();
  }, [loanInfo, open]);

  const updateSelectedProduct = useCallback(
    async (
      postData: Partial<
        Pick<RatesProductData, 'id'> & {
          queryParams: BPEstimateRateData;
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

  useEffect(
    () => {
      fetchInitData();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Transitions
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
      }}
    >
      {isFirst || state.loading ? (
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
                    gap: 1,
                    fontSize: 14,
                  }}
                  variant={'h6'}
                >
                  <ArrowBackIcon sx={{ fontSize: 16, mb: 0.25 }} />
                  Back to current rate
                </Typography>
                <BridgePurchaseRatesSearch
                  isDashboard={true}
                  loading={loading || state.loading}
                  loanStage={loanStage}
                  searchForm={searchForm}
                  setSearchForm={setSearchForm}
                  userType={userType}
                />
                {!searchForm.customRate && (
                  <RatesList
                    loading={loading || state.loading}
                    loanStage={loanStage}
                    onClick={onListItemClick}
                    productList={productList || []}
                    reasonList={reasonList}
                    userType={userType}
                  />
                )}
                <BridgePurchaseRatesDrawer
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
                      Stabilized Bridge ｜ Purchase
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
                    <Typography variant={'body1'}>Purchase price</Typography>
                    <Typography variant={'subtitle1'}>
                      {POSFormatDollar(primitiveLoanInfo?.purchasePrice)}
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
                      Purchase loan amount
                    </Typography>
                    <Typography variant={'subtitle1'}>
                      {POSFormatDollar(primitiveLoanInfo?.purchaseLoanAmount)}
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

                <BridgePurchaseRatesDrawer
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
