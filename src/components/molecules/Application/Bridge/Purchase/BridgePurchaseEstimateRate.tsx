import { FC, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { addDays, format, isDate } from 'date-fns';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION } from '@/constants';
import { POSTypeOf } from '@/utils';
import { useSwitch } from '@/hooks';
import {
  BPEstimateRateData,
  HttpError,
  PropertyOpt,
  RatesProductData,
  VariableName,
} from '@/types';

import { _updateProcessVariables } from '@/requests';
import {
  _fetchCustomRates,
  _fetchRatesProductPreview,
  _updateRatesProductSelected,
  BPQueryData,
} from '@/requests/dashboard';
import {
  BridgePurchaseRatesDrawer,
  BridgePurchaseRatesSearch,
  RatesList,
} from '@/components/molecules';
import { debounce } from 'lodash';

const initialize: BPQueryData = {
  purchasePrice: undefined,
  purchaseLoanAmount: undefined,
  lenderPoints: undefined,
  lenderProcessingFee: undefined,
  brokerPoints: undefined,
  brokerProcessingFee: undefined,
  officerPoints: undefined,
  officerProcessingFee: undefined,
  agentFee: undefined,
  closeDate: null,
  customRate: undefined,
  interestRate: undefined,
  loanTerm: undefined,
};

export interface BridgePurchaseLoanInfo {
  // refinance
  firstName: string;
  lastName: string;
  address: string;
  totalLoanAmount: number;
  purchasePrice: number;
  purchaseLoanAmount: number;
  // detail
  amortization: string;
  propertyType: PropertyOpt;
  closeDate: string;
  lien: string;
  ltv: number;
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

export const BridgePurchaseEstimateRate: FC<{
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

  const [searchForm, setSearchForm] = useState<BPQueryData>({
    ...initialize,
    ...estimateRate,
    closeDate: estimateRate.closeDate
      ? new Date(estimateRate.closeDate)
      : initialize.closeDate,
  });
  const [productList, setProductList] = useState<RatesProductData[]>([]);
  const [reasonList, setReasonList] = useState<string[]>([]);
  const [isFirstSearch, setIsFirstSearch] = useState<boolean>(true);

  const [productInfo, setProductInfo] = useState<
    Partial<BridgePurchaseLoanInfo>
  >({});
  const [selectedItem, setSelectedItem] = useState<
    BridgePurchaseLoanInfo &
      Pick<
        RatesProductData,
        'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm' | 'id'
      >
  >();

  const onCheckGetList = async () => {
    const element = document.getElementById('bridge_purchase_rate_search');
    const { height } = element!.getBoundingClientRect();
    setLoading(true);
    const postData: Variable<BPEstimateRateData> = {
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
        const requestData = {
          ...searchForm,
          closeDate: isDate(searchForm.closeDate)
            ? format(searchForm.closeDate as Date, 'yyyy-MM-dd O')
            : POSTypeOf(searchForm.closeDate) === 'Null'
              ? format(addDays(new Date(), 7), 'yyyy-MM-dd O')
              : searchForm.closeDate,
        };
        if (!searchForm.customRate) {
          return await _fetchRatesProductPreview(processId, requestData);
        }
        return await _fetchCustomRates(processId, requestData);
      })
      .then(async (res) => {
        if (searchForm.customRate) {
          const {
            paymentOfMonth,
            interestRateOfYear,
            loanTerm,
            id,
            totalClosingCash,
            proRatedInterest,
          } = res!.data.product;
          setSelectedItem(
            Object.assign(res.data.loanInfo as BridgePurchaseLoanInfo, {
              paymentOfMonth,
              interestRateOfYear,
              loanTerm,
              id,
              totalClosingCash,
              proRatedInterest,
            }),
          );
          open();
        } else {
          setIsFirstSearch(false);
          setProductInfo(res!.data.loanInfo);
          setProductList(res!.data.products as RatesProductData[]);
          setReasonList(res!.data.reasons);
        }
      })
      .catch((err) => {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
        if (!searchForm.customRate) {
          setProductList([]);
          setReasonList([]);
        }
      })
      .finally(() => {
        setLoading(false);
        setTimeout(() => {
          window.scrollTo({ top: height + 144, behavior: 'smooth' });
        }, 300);
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
      Object.assign(productInfo as BridgePurchaseLoanInfo, {
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
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
        onClose: () => setCheckLoading(false),
      });
    }
  };

  useEffect(
    () => {
      if (
        !searchForm?.closeDate ||
        !searchForm?.purchasePrice ||
        !searchForm?.purchaseLoanAmount
      ) {
        return;
      }
      onCheckGetList();
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
    ],
  );

  return (
    <>
      <BridgePurchaseRatesSearch
        id={'bridge_purchase_rate_search'}
        loading={loading}
        searchForm={searchForm}
        setSearchForm={debounce(setSearchForm, 500)}
        userType={userType}
      />
      {!searchForm.customRate && (
        <RatesList
          isFirstSearch={isFirstSearch}
          loading={loading}
          onClick={onListItemClick}
          productList={productList as RatesProductData[]}
          reasonList={reasonList}
          userType={userType}
        />
      )}
      <BridgePurchaseRatesDrawer
        close={close}
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
