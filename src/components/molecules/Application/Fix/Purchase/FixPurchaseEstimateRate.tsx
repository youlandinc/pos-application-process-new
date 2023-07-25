import { FC, useState } from 'react';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION } from '@/constants';
import { useSwitch } from '@/hooks';
import { _updateProcessVariables } from '@/requests';
import {
  FixPurchaseEstimateRateData,
  PropertyOpt,
  RatesProductData,
  VariableName,
} from '@/types';
import {
  _fetchRatesLoanInfo,
  _fetchRatesProductPreview,
  _updateRatesProductSelected,
  FPQueryData,
} from '@/requests/dashboard';
import {
  FixPurchaseRatesDrawer,
  FixPurchaseRatesSearch,
  RatesList,
} from '@/components/molecules';

const initialize: FPQueryData = {
  purchasePrice: undefined,
  purchaseLoanAmount: undefined,
  cor: undefined,
  arv: undefined,
  lenderPoints: undefined,
  lenderProcessingFee: undefined,
  brokerPoints: undefined,
  brokerProcessingFee: undefined,
  officerPoints: undefined,
  officerProcessingFee: undefined,
  agentFee: undefined,
};

export interface FixPurchaseLoanInfo {
  // refinance
  firstName: string;
  lastName: string;
  address: string;
  totalLoanAmount: number;
  purchasePrice: number;
  purchaseLoanAmount: number;
  cor: number;
  // detail
  amortization: string;
  propertyType: PropertyOpt;
  closeDate: string;
  lien: string;
  arv: number;
  ltv: number;
  ltc: number;
  // third-part
  downPayment: number;
  totalClosingCash: number;
  originationFee: number;
  originationFeePer?: number;
  underwritingFee: number;
  docPreparationFee: number;
  proRatedInterest: number;
  thirdPartyCosts: string;
  // broker
  brokerPoints: number;
  brokerOriginationFee: number;
  brokerProcessingFee: number;
  // lender
  lenderPoints: number;
  lenderOriginationFee: number;
  lenderProcessingFee: number;
  // officer
  officerPoints: number;
  officerOriginationFee: number;
  officerProcessingFee: number;
  // agent
  agentFee: number;
}

export const FixPurchaseEstimateRate: FC<{
  nextStep?: (cb?: () => void) => void;
}> = observer(({ nextStep }) => {
  const {
    bpmn: { processId },
    applicationForm: {
      formData: { estimateRate },
    },
    userType,
  } = useMst();

  const { enqueueSnackbar } = useSnackbar();
  const { open, visible, close } = useSwitch(false);
  const [loading, setLoading] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);

  const [searchForm, setSearchForm] = useState<FPQueryData>(initialize);
  const [productList, setProductList] = useState<RatesProductData[]>();
  const [isFirstSearch, setIsFirstSearch] = useState<boolean>(true);

  const [productInfo, setProductInfo] = useState<FixPurchaseLoanInfo>();
  const [selectedItem, setSelectedItem] = useState<
    FixPurchaseLoanInfo &
      Pick<
        RatesProductData,
        'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm' | 'id'
      >
  >();

  const onCheckGetList = async () => {
    setIsFirstSearch(false);
    setLoading(true);
    const postData: Variable<FixPurchaseEstimateRateData> = {
      name: VariableName.estimateRate,
      type: 'json',
      value: {
        ...searchForm,
      },
    };
    for (const [key, value] of Object.entries(searchForm)) {
      estimateRate.changeFieldValue(key, value);
    }
    await _updateProcessVariables(processId as string, [postData])
      .then(async () => {
        const res = await _fetchRatesProductPreview(processId, searchForm);
        if (res.status === 200) {
          setProductList(res.data.products as RatesProductData[]);
        }
        const infoRes = await _fetchRatesLoanInfo(processId);
        if (infoRes.status === 200) {
          setProductInfo(infoRes.data.info);
        }
        setLoading(false);
      })
      .catch((err) => {
        enqueueSnackbar(err, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
        });
        setLoading(false);
      });
  };

  const onListItemClick = async (item: RatesProductData) => {
    const { paymentOfMonth, interestRateOfYear, loanTerm, id } = item;
    if (nextStep) {
      const temp = productList!.map((item) => {
        item.selected = false;
        return item;
      });
      setProductList(temp);
      item.selected = true;
    }
    setSelectedItem(
      Object.assign(productInfo as FixPurchaseLoanInfo, {
        paymentOfMonth,
        interestRateOfYear,
        loanTerm,
        id,
      }),
    );
    open();
  };

  const nextStepWrap = async (id: string) => {
    setCheckLoading(true);
    try {
      await _updateRatesProductSelected(processId, { id });
      if (nextStep) {
        await nextStep(() => setCheckLoading(false));
      }
    } catch (err) {
      enqueueSnackbar(err as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        onClose: () => setCheckLoading(false),
      });
    }
  };

  return (
    <>
      <FixPurchaseRatesSearch
        loading={loading}
        onCheck={onCheckGetList}
        searchForm={searchForm}
        setSearchForm={setSearchForm}
        userType={userType}
      />
      <RatesList
        isFirstSearch={isFirstSearch}
        loading={loading}
        onClick={onListItemClick}
        productList={productList as RatesProductData[]}
        userType={userType}
      />
      <FixPurchaseRatesDrawer
        loading={checkLoading}
        nextStep={nextStepWrap}
        onCancel={close}
        selectedItem={selectedItem}
        userType={userType!}
        visible={visible}
      />
    </>
  );
});
