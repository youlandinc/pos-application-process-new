import { FC, useCallback, useState } from 'react';
import { Box, Stack, Typography } from '@mui/material';
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
  RatesProductData,
} from '@/types';

import { StyledLoading, Transitions } from '@/components/atoms';
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
  const [loanStage, setLoanStage] = useState<LoanStage>(LoanStage.PreApproved);
  const [searchForm, setSearchForm] = useState<GRQueryData>(initialize);
  const [productList, setProductList] = useState<RatesProductData[]>();
  const [loanInfo, setLoanInfo] = useState<GroundRefinanceLoanInfo>();
  const [, setEncompassData] = useState<Encompass>();
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
        const { products } = res[0].data;
        setProductList(products);
        const { info, loanStage, encompass } = res[1].data;
        setLoanStage(loanStage);
        setEncompassData(encompass);
        setLoanInfo(info);
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
      .catch((err) =>
        enqueueSnackbar(err, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          onClose: () => router.push('/pipeline'),
        }),
      );
  });

  const onCheckGetList = async () => {
    setLoading(true);
    await _fetchRatesProductPreview(
      router.query.processId as string,
      searchForm,
    )
      .then((res) => {
        setProductList(res.data.products);
        setLoanInfo(res.data.loanInfo);
        setLoading(false);
      })
      .catch((err) => {
        enqueueSnackbar(err as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
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
    } = item;
    const postData = {
      id,
      queryParams: {
        ...searchForm,
      },
    };
    setSelectedItem(
      Object.assign(loanInfo as GroundRefinanceLoanInfo, {
        paymentOfMonth,
        interestRateOfYear,
        loanTerm,
        id,
        totalClosingCash,
        proRatedInterest,
      }),
    );
    open();
    if (!item.selected) {
      productList?.forEach((item) => (item.selected = false));
      item.selected = true;
      if (loanStage !== LoanStage.Approved) {
        await updateSelectedProduct(postData);
      }
    }
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
            label={
              <>
                <Typography
                  color={'info.main'}
                  mt={6}
                  textAlign={'center'}
                  variant={'body1'}
                >
                  The following loan programs are available for you
                </Typography>
                <Typography
                  color={'info.main'}
                  mt={1.5}
                  textAlign={'center'}
                  variant={'body3'}
                >
                  Rates displayed are subject to rate confirm and are not to be
                  considered an extension or offer of credit by{' '}
                  {saasState?.organizationName || 'YouLand'}.
                </Typography>
              </>
            }
            loading={loading || initLoading}
            loanStage={loanStage}
            onClick={onListItemClick}
            productList={productList || []}
            userType={userType}
          />
          <GroundRefinanceRatesDrawer
            // loanStage={loanStage}
            onCancel={close}
            selectedItem={selectedItem}
            userType={userType as UserType}
            visible={visible}
          />
        </Box>
      )}
    </Transitions>
  );
});
