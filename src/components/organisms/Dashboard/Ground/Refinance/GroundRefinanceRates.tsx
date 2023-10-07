import RATE_CONFIRMED from '@/svg/dashboard/rate_confirmed.svg';
import RATE_CURRENT from '@/svg/dashboard/rate_current.svg';
import { POSFormatDollar, POSFormatPercent } from '@/utils';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { FC, useCallback, useState } from 'react';
import { Box, Icon, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION } from '@/constants';
import { useSessionStorageState, useSwitch } from '@/hooks';
import { LoanStage, UserType } from '@/types/enum';
import { GroundRefinanceLoanInfo } from '@/components/molecules/Application/Ground';
import {
  _fetchRatesLoanInfo,
  _fetchRatesProduct,
  _fetchRatesProductPreview,
  _updateRatesProductSelected,
  GRQueryData,
  MPQueryData,
  MRQueryData,
} from '@/requests/dashboard';

import {
  Encompass,
  GPEstimateRateData,
  GREstimateRateData,
  HttpError,
  RatesProductData,
} from '@/types';

import { StyledButton, StyledLoading, Transitions } from '@/components/atoms';
import {
  GroundRefinanceRatesDrawer,
  GroundRefinanceRatesSearch,
  RatesList,
} from '@/components/molecules';

const initialize: GRQueryData = {
  homeValue: undefined,
  balance: undefined,
  isCashOut: false,
  cashOutAmount: undefined,
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
};

export const GroundRefinanceRates: FC = observer(() => {
  const { userType } = useMst();

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { saasState } = useSessionStorageState('tenantConfig');
  const { open, visible, close } = useSwitch(false);

  const [loading, setLoading] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const [view, setView] = useState<'current' | 'confirmed' | 'other'>(
    'current',
  );
  const [loanStage, setLoanStage] = useState<LoanStage>(LoanStage.PreApproved);
  const [searchForm, setSearchForm] = useState<GRQueryData>(initialize);

  const [productList, setProductList] = useState<RatesProductData[]>();
  const [reasonList, setReasonList] = useState<string[]>([]);

  const [, setEncompassData] = useState<Encompass>();
  const [loanInfo, setLoanInfo] = useState<
    GroundRefinanceLoanInfo & RatesProductData
  >();
  const [selectedItem, setSelectedItem] = useState<
    GroundRefinanceLoanInfo &
      Pick<
        RatesProductData,
        'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm' | 'id'
      >
  >();

  const { loading: initLoading } = useAsync(async () => {
    if (!router.query.processId) {
      return;
    }
    return Promise.all([
      _fetchRatesProduct(router.query.processId as string),
      _fetchRatesLoanInfo(router.query.processId as string),
    ])
      .then((res) => {
        const { products, selectedProduct } = res[0].data;
        setProductList(products);
        const { info, loanStage, encompass } = res[1].data;
        switch (loanStage) {
          case LoanStage.Approved:
            setView('confirmed');
            break;
          default:
            setView('current');
        }
        setLoanStage(loanStage);
        setEncompassData(encompass);
        setLoanInfo({ ...info, ...selectedProduct });
        const {
          homeValue,
          balance,
          isCashOut,
          cashOutAmount,
          cor,
          arv,
          lenderPoints,
          lenderProcessingFee,
          brokerPoints,
          brokerProcessingFee,
          officerPoints,
          officerProcessingFee,
          agentFee,
        } = info;
        setSearchForm({
          ...searchForm,
          homeValue,
          balance,
          isCashOut,
          cashOutAmount,
          cor,
          arv,
          lenderPoints,
          lenderProcessingFee,
          brokerPoints,
          brokerProcessingFee,
          officerPoints,
          officerProcessingFee,
          agentFee,
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
      });
  });

  const onCheckGetList = async () => {
    setLoading(true);
    await _fetchRatesProductPreview(
      router.query.processId as string,
      searchForm,
    )
      .then((res) => {
        const { products, loanInfo, reasons } = res.data;
        setProductList(products);
        setLoanInfo(loanInfo);
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
        setLoading(false);
      });
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
      Object.assign(loanInfo as GroundRefinanceLoanInfo, {
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
          queryParams:
            | GREstimateRateData
            | GPEstimateRateData
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
    } finally {
      close();
      productList?.forEach(
        (item) => (item.selected = selectedItem!.id === item.id),
      );
      setConfirmLoading(false);
      setTimeout(async () => {
        setView('current');
      }, 1000);
    }
  };

  return (
    <Transitions
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
      }}
    >
      {initLoading ? (
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
                <GroundRefinanceRatesSearch
                  isDashboard={true}
                  loading={loading || initLoading}
                  loanStage={loanStage}
                  onCheck={onCheckGetList}
                  searchForm={searchForm}
                  setSearchForm={setSearchForm}
                  userType={userType as UserType}
                />
                <RatesList
                  loading={loading || initLoading}
                  loanStage={loanStage}
                  onClick={onListItemClick}
                  productList={productList || []}
                  reasonList={reasonList}
                  userType={userType}
                />
                <GroundRefinanceRatesDrawer
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
                      Ground-up Construction ｜ Refinance
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
                      {POSFormatPercent(loanInfo?.interestRateOfYear)}
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
                      {loanInfo?.loanTerm} months
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
                      {POSFormatDollar(loanInfo?.homeValue)}
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
                      {POSFormatDollar(loanInfo?.balance)}
                    </Typography>
                  </Stack>

                  {loanInfo?.isCashOut && (
                    <Stack
                      alignItems={'center'}
                      flexDirection={'row'}
                      justifyContent={'space-between'}
                      py={1.5}
                      width={'100%'}
                    >
                      <Typography variant={'body1'}>Cash out amount</Typography>
                      <Typography variant={'subtitle1'}>
                        {POSFormatDollar(loanInfo?.cashOutAmount)}
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
                      {POSFormatDollar(loanInfo?.totalLoanAmount)}
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
                      {POSFormatDollar(loanInfo?.paymentOfMonth)}
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
                      View other rate
                    </StyledButton>
                  </Stack>
                )}

                <GroundRefinanceRatesDrawer
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
