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
import { GroundPurchaseLoanInfo } from '@/components/molecules/Application/Ground';
import {
  CustomRateData,
  Encompass,
  GPEstimateRateData,
  GREstimateRateData,
  HttpError,
  RatesProductData,
} from '@/types';

import { StyledButton, StyledLoading, Transitions } from '@/components/atoms';
import {
  GroundPurchaseRatesDrawer,
  GroundPurchaseRatesSearch,
  RatesList,
} from '@/components/molecules';

import {
  _fetchCustomRates,
  _fetchRatesLoanInfo,
  _fetchRatesProduct,
  _fetchRatesProductPreview,
  _updateRatesProductSelected,
  GPQueryData,
  MPQueryData,
  MRQueryData,
} from '@/requests/dashboard';

import RATE_CONFIRMED from '@/svg/dashboard/rate_confirmed.svg';
import RATE_CURRENT from '@/svg/dashboard/rate_current.svg';

const initialize: GPQueryData = {
  purchasePrice: undefined,
  purchaseLoanAmount: undefined,
  cor: undefined,
  arv: undefined,
  brokerPoints: undefined,
  brokerProcessingFee: undefined,
  lenderPoints: undefined,
  lenderProcessingFee: undefined,
  officerPoints: undefined,
  officerProcessingFee: undefined,
  agentFee: undefined,
  closeDate: null,
  customRate: undefined,
  interestRate: undefined,
  loanTerm: undefined,
};

export const GroundPurchaseRates: FC = observer(() => {
  const { userType } = useMst();

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { saasState } = useSessionStorageState('tenantConfig');
  const { open, visible, close } = useSwitch(false);

  const [isFirst, setIsFirst] = useState(true);
  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [customLoading, setCustomLoading] = useState(false);
  const [productType, setProductType] = useState<string>('');

  const [view, setView] = useState<'current' | 'confirmed' | 'other'>(
    'current',
  );
  const [loanStage, setLoanStage] = useState<LoanStage>(LoanStage.PreApproved);
  const [encompassData, setEncompassData] = useState<Encompass>();

  const [searchForm, setSearchForm] = useState<GPQueryData>(initialize);
  const [customLoan, setCustomLoan] = useState<CustomRateData>({
    customRate: undefined,
    interestRate: undefined,
    loanTerm: undefined,
  });

  const [productList, setProductList] = useState<RatesProductData[]>();
  const [reasonList, setReasonList] = useState<string[]>([]);

  const [loanInfo, setLoanInfo] = useState<
    GroundPurchaseLoanInfo & RatesProductData
  >();
  const [primitiveLoanInfo, setPrimitiveLoanInfo] = useState<
    GroundPurchaseLoanInfo & RatesProductData
  >();
  const [selectedItem, setSelectedItem] = useState<
    GroundPurchaseLoanInfo &
      Pick<
        RatesProductData,
        'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm' | 'id'
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
          cor,
          arv,
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
          cor,
          arv,
        });
        setCustomLoan({
          customRate,
          interestRate,
          loanTerm,
        });
        setProductType(selectedProduct?.category || '');
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
        setProductType('');
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
        Object.assign(loanInfo as GroundPurchaseLoanInfo, {
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
      Object.assign(loanInfo as GroundPurchaseLoanInfo, {
        paymentOfMonth,
        interestRateOfYear,
        loanTerm,
        id,
        totalClosingCash,
        proRatedInterest,
        selected,
      }) as GroundPurchaseLoanInfo &
        Pick<
          RatesProductData,
          | 'paymentOfMonth'
          | 'interestRateOfYear'
          | 'loanTerm'
          | 'id'
          | 'selected'
        >,
    );
    open();
  };

  const updateSelectedProduct = useCallback(
    async (
      postData: Partial<
        Pick<RatesProductData, 'id'> & {
          queryParams:
            | GPEstimateRateData
            | GREstimateRateData
            | MPQueryData
            | MRQueryData;
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
    onCheckGetList();
  }, 1000);

  useEffect(
    () => {
      if (isFirst) {
        return;
      }
      if (
        !POSNotUndefined(searchForm?.purchaseLoanAmount) ||
        !POSNotUndefined(searchForm?.purchasePrice) ||
        !POSNotUndefined(searchForm?.cor) ||
        !POSNotUndefined(searchForm?.arv)
      ) {
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
      searchForm?.closeDate,
      searchForm?.purchasePrice,
      searchForm?.purchaseLoanAmount,
      searchForm?.cor,
      searchForm?.arv,
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
                <GroundPurchaseRatesSearch
                  isDashboard={true}
                  loading={loading}
                  loanStage={loanStage}
                  searchForm={searchForm}
                  setSearchForm={setSearchForm}
                  userType={userType}
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
                  productType={productType}
                  reasonList={reasonList}
                  setCustomLoan={setCustomLoan}
                  userType={userType}
                />
                <GroundPurchaseRatesDrawer
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
                      Ground-up Construction ｜ Purchase
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
                    <Typography variant={'body1'}>Rehab cost</Typography>
                    <Typography variant={'subtitle1'}>
                      {POSFormatDollar(primitiveLoanInfo?.cor)}
                    </Typography>
                  </Stack>

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

                <GroundPurchaseRatesDrawer
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
