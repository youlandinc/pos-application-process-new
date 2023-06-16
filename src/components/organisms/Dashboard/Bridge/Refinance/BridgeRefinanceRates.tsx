import { FC, useCallback, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useSessionStorageState, useSwitch } from '@/hooks';
import { LoanStage, UserType } from '@/types/enum';
import { POSFlex } from '@/styles';

import {
  _fetchRatesLoanInfo,
  _fetchRatesProduct,
  _fetchRatesProductPreview,
  _updateRatesProductSelected,
  BRQueryData,
  MPQueryData,
  MRQueryData,
} from '@/requests/dashboard';

import {
  BridgeRatesList,
  BridgeRefinanceRatesDrawer,
  BridgeRefinanceRatesSearch,
} from '@/components/molecules';

import {
  BridgePurchaseEstimateRateData,
  BridgeRefinanceEstimateRateData,
  Encompass,
  RatesProductData,
} from '@/types';
import { BridgeRefinanceLoanInfo } from '@/components/molecules/Application';
import { AUTO_HIDE_DURATION } from '@/constants';

const initialize: BRQueryData = {
  homeValue: undefined,
  balance: undefined,
  isCashOut: false,
  cashOutAmount: undefined,
  isCor: false,
  cor: undefined,
  arv: undefined,
  brokerPoints: undefined,
  brokerProcessingFee: undefined,
  officerPoints: undefined,
  officerProcessingFee: undefined,
  agentFee: undefined,
};

export const BridgeRefinanceRates: FC = observer(() => {
  const { userType } = useMst();

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { state } = useSessionStorageState('tenantConfig');
  const { open, visible, close } = useSwitch(false);

  const [loading, setLoading] = useState(false);
  const [loanStage, setLoanStage] = useState<LoanStage>(LoanStage.PreApproved);
  const [searchForm, setSearchForm] = useState<BRQueryData>(initialize);
  const [productList, setProductList] = useState<RatesProductData[]>();
  const [loanInfo, setLoanInfo] = useState<BridgeRefinanceLoanInfo>();
  const [, setEncompassData] = useState<Encompass>();
  const [selectedItem, setSelectedItem] = useState<
    BridgeRefinanceLoanInfo &
      Pick<
        RatesProductData,
        'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm' | 'id'
      >
  >();

  const { loading: initLoading } = useAsync(async () => {
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
          isCor,
          cor,
          arv,
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
          cashOutAmount: cashOutAmount,
          isCor,
          cor: cor,
          arv: arv,
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
    const { paymentOfMonth, interestRateOfYear, loanTerm, id } = item;
    const postData = {
      id,
      queryParams: {
        ...searchForm,
      },
    };
    setSelectedItem(
      Object.assign(loanInfo as BridgeRefinanceLoanInfo, {
        paymentOfMonth,
        interestRateOfYear,
        loanTerm,
        id,
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
            | BridgeRefinanceEstimateRateData
            | BridgePurchaseEstimateRateData
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
    <>
      <Box className={'container'} sx={BridgeRefinanceRatesStyles}>
        <BridgeRefinanceRatesSearch
          loading={loading || initLoading}
          loanStage={loanStage}
          onCheck={onCheckGetList}
          searchForm={searchForm}
          setSearchForm={setSearchForm}
          userType={userType as UserType}
        />
        <BridgeRatesList
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
                {/* todo sass */}
                Rates displayed are subject to rate confirm and are not to be
                considered an extension or offer of credit by{' '}
                {state?.organizationName || 'YouLand'}.
              </Typography>
            </>
          }
          loading={loading || initLoading}
          loanStage={loanStage}
          onClick={onListItemClick}
          productList={productList || []}
          userType={userType}
        />
        <BridgeRefinanceRatesDrawer
          // loanStage={loanStage}
          onCancel={close}
          selectedItem={selectedItem}
          userType={userType as UserType}
          visible={visible}
        />
      </Box>
    </>
  );
});

const BridgeRefinanceRatesStyles = {
  width: '100%',
  px: {
    lg: 3,
    xs: 0,
  },
  maxWidth: 900,
  mx: {
    lg: 'auto',
    xs: 0,
  },
  ...POSFlex('flex-start', 'flex-start', 'column'),
};
