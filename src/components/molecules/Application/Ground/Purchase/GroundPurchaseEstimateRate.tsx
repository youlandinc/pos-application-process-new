import { POSTypeOf } from '@/utils';
import { addDays, format, isDate } from 'date-fns';
import { FC, useState } from 'react';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION } from '@/constants';
import { useSwitch } from '@/hooks';
import { _updateProcessVariables } from '@/requests';
import {
  GPEstimateRateData,
  PropertyOpt,
  RatesProductData,
  VariableName,
} from '@/types';
import {
  _fetchRatesLoanInfo,
  _fetchRatesProductPreview,
  _updateRatesProductSelected,
  GPQueryData,
} from '@/requests/dashboard';
import {
  GroundPurchaseRatesDrawer,
  GroundPurchaseRatesSearch,
  RatesList,
} from '@/components/molecules';

const initialize: GPQueryData = {
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
  closeDate: null,
};

export interface GroundPurchaseLoanInfo {
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

export const GroundPurchaseEstimateRate: FC<{
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

  const [searchForm, setSearchForm] = useState<GPQueryData>({
    ...initialize,
    closeDate: estimateRate.closeDate
      ? new Date(estimateRate.closeDate)
      : initialize.closeDate,
  });
  const [productList, setProductList] = useState<RatesProductData[]>();
  const [isFirstSearch, setIsFirstSearch] = useState<boolean>(true);

  const [productInfo, setProductInfo] = useState<GroundPurchaseLoanInfo>();
  const [selectedItem, setSelectedItem] = useState<
    GroundPurchaseLoanInfo &
      Pick<
        RatesProductData,
        'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm' | 'id'
      >
  >();

  const onCheckGetList = async () => {
    setIsFirstSearch(false);
    setLoading(true);
    const postData: Variable<GPEstimateRateData> = {
      name: VariableName.estimateRate,
      type: 'json',
      value: {
        ...searchForm,
        closeDate: isDate(searchForm.closeDate)
          ? format(searchForm.closeDate as Date, 'yyyy-MM-dd O')
          : POSTypeOf(searchForm.closeDate) === 'Null'
          ? format(addDays(new Date(), 7), 'yyyy-MM-dd O')
          : searchForm.closeDate,
      },
    };
    for (const [key, value] of Object.entries(searchForm)) {
      estimateRate.changeFieldValue(key, value);
    }
    await _updateProcessVariables(processId as string, [postData])
      .then(async () => {
        const res = await _fetchRatesProductPreview(processId, {
          ...searchForm,
          closeDate: isDate(searchForm.closeDate)
            ? format(searchForm.closeDate as Date, 'yyyy-MM-dd O')
            : POSTypeOf(searchForm.closeDate) === 'Null'
            ? format(addDays(new Date(), 7), 'yyyy-MM-dd O')
            : searchForm.closeDate,
        });
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
    const {
      paymentOfMonth,
      interestRateOfYear,
      loanTerm,
      id,
      totalClosingCash,
      proRatedInterest,
    } = item;
    if (nextStep) {
      const temp = productList!.map((item) => {
        item.selected = false;
        return item;
      });
      setProductList(temp);
      item.selected = true;
    }
    setSelectedItem(
      Object.assign(productInfo as GroundPurchaseLoanInfo, {
        paymentOfMonth,
        interestRateOfYear,
        loanTerm,
        id,
        totalClosingCash,
        proRatedInterest,
      }),
    );
    open();
  };

  const nextStepWrap = async (id: string) => {
    setCheckLoading(true);
    try {
      await _updateRatesProductSelected(processId, { id });
      if (nextStep) {
        nextStep(() => setCheckLoading(false));
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
      <GroundPurchaseRatesSearch
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
      <GroundPurchaseRatesDrawer
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
