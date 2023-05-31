import { FC, useCallback, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { useAsync } from 'react-use';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useSessionStorageState, useSwitch } from '@/hooks';

import { BridgePurchaseLoanInfo } from '@/components/molecules/Application';

import { useSnackbar } from 'notistack';
import { POSFlex } from '@/styles';
import {
  BridgePurchaseEstimateRateData,
  BridgeRefinanceEstimateRateData,
  Encompass,
  RatesProductData,
} from '@/types';
import { LoanStage, UserType } from '@/types/enum';
import {
  _fetchRatesLoanInfo,
  _fetchRatesProduct,
  _fetchRatesProductPreview,
  _updateRatesProductSelected,
  BPQueryData,
  MPQueryData,
  MRQueryData,
} from '@/requests/dashboard';
import {
  BridgePurchaseRatesDrawer,
  BridgePurchaseRatesSearch,
  BridgeRatesList,
} from '@/components/molecules';
import { AUTO_HIDE_DURATION } from '@/constants';

const initialize: BPQueryData = {
  purchasePrice: undefined,
  purchaseLoanAmount: undefined,
  isCor: false,
  cor: undefined,
  arv: undefined,
  brokerPoints: undefined,
  brokerProcessingFee: undefined,
  officerPoints: undefined,
  officerProcessingFee: undefined,
  agentFee: undefined,
};

export const BridgePurchaseRates: FC = observer(() => {
  const {
    userSetting: {
      setting: { lastSelectedProcessId },
    },
    userType,
  } = useMst();
  const { enqueueSnackbar } = useSnackbar();
  const { state } = useSessionStorageState('tenantConfig');

  const { open, visible, close } = useSwitch(false);

  const [loading, setLoading] = useState(false);
  const [loanStage, setLoanStage] = useState<LoanStage>(LoanStage.PreApproved);
  const [encompassData, setEncompassData] = useState<Encompass>();
  const [searchForm, setSearchForm] = useState<BPQueryData>(initialize);
  const [productList, setProductList] = useState<RatesProductData[]>();
  const [loanInfo, setLoanInfo] = useState<BridgePurchaseLoanInfo>();
  const [selectedItem, setSelectedItem] = useState<
    BridgePurchaseLoanInfo &
      Pick<
        RatesProductData,
        'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm' | 'id'
      >
  >();

  const { loading: initLoading } = useAsync(async () => {
    return Promise.all([
      _fetchRatesProduct(lastSelectedProcessId),
      _fetchRatesLoanInfo(lastSelectedProcessId),
    ])
      .then((res) => {
        const { products } = res[0].data;
        setProductList(products);
        const { info, loanStage } = res[1].data;
        setEncompassData(encompassData);
        setLoanStage(loanStage);
        setLoanInfo(info);
        const {
          isCor,
          purchaseLoanAmount,
          purchasePrice,
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
          isCor,
          purchasePrice,
          purchaseLoanAmount,
          cor,
          arv,
          brokerPoints,
          brokerProcessingFee,
          officerPoints,
          officerProcessingFee,
          agentFee,
        });
      })
      .catch((err) =>
        enqueueSnackbar(err as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
        }),
      );
  });

  const onCheckGetList = async () => {
    setLoading(true);
    await _fetchRatesProductPreview(lastSelectedProcessId, searchForm)
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
      Object.assign(loanInfo as BridgePurchaseLoanInfo, {
        paymentOfMonth,
        interestRateOfYear,
        loanTerm,
        id,
      }) as BridgePurchaseLoanInfo &
        Pick<
          RatesProductData,
          'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm' | 'id'
        >,
    );
    open();
    // if (!item.selected) {
    productList?.forEach((item) => (item.selected = false));
    item.selected = true;
    if (loanStage !== LoanStage.Approved) {
      await updateSelectedProduct(postData);
    }
    // }
  };

  const updateSelectedProduct = useCallback(
    async (
      postData: Partial<
        Pick<RatesProductData, 'id'> & {
          queryParams:
            | BridgePurchaseEstimateRateData
            | BridgeRefinanceEstimateRateData
            | MPQueryData
            | MRQueryData;
        }
      >,
    ) => {
      await _updateRatesProductSelected(lastSelectedProcessId, postData);
    },
    [lastSelectedProcessId],
  );

  return (
    <>
      <Box sx={BridgePurchaseRatesStyles}>
        <BridgePurchaseRatesSearch
          loading={loading || initLoading}
          loanStage={loanStage}
          onCheck={onCheckGetList}
          searchForm={searchForm}
          setSearchForm={setSearchForm}
          userType={userType}
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
                Rates displayed are subject to rate lock and are not to be
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
        <BridgePurchaseRatesDrawer
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

const BridgePurchaseRatesStyles = {
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
