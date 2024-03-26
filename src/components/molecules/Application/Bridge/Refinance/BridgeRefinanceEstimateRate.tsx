import { FC, useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { addDays, format, isDate } from 'date-fns';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION } from '@/constants';
import { useBreakpoints, useDebounceFn, useSwitch } from '@/hooks';
import { POSNotUndefined, POSTypeOf } from '@/utils';

import {
  BREstimateRateData,
  CustomRateData,
  HttpError,
  PropertyOpt,
  RatesProductData,
  VariableName,
} from '@/types';

import {
  BridgeRefinanceRatesDrawer,
  BridgeRefinanceRatesSearch,
  RatesList,
} from '@/components/molecules';

import { _updateProcessVariables } from '@/requests';
import {
  _fetchCustomRates,
  _fetchRatesProductPreview,
  _updateRatesProductSelected,
  BRQueryData,
} from '@/requests/dashboard';

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
  closeDate: null,
  customRate: undefined,
  interestRate: undefined,
  loanTerm: undefined,
};

export interface BridgeRefinanceLoanInfo {
  // refinance
  firstName: string;
  lastName: string;
  address: string;
  isCashOut: boolean;
  totalLoanAmount: number;
  balance: number;
  homeValue: number;
  cashOutAmount: number;
  // detail
  amortization: string;
  propertyType: PropertyOpt;
  closeDate: string;
  lien: string;
  ltv: number;
  // third-part
  totalClosingCash: number;
  originationFee: number;
  originationFeePer?: number;
  underwritingFee: number;
  docPreparationFee: number;
  proRatedInterest: number;
  thirdPartyCosts: string;
  // broker
  brokerPoints: number;
  brokerProcessingFee: number;
  brokerOriginationFee: number;
  // lender
  lenderPoints: number;
  lenderProcessingFee: number;
  lenderOriginationFee: number;
  // officer
  officerPoints: number;
  officerOriginationFee: number;
  officerProcessingFee: number;
  // agent
  agentFee: number;
}

export const BridgeRefinanceEstimateRate: FC<{
  nextStep?: (cb?: () => void) => void;
}> = observer(({ nextStep }) => {
  const {
    bpmn: { processId },
    applicationForm: {
      formData: { estimateRate },
    },
    userType,
  } = useMst();

  const breakpoints = useBreakpoints();
  const { enqueueSnackbar } = useSnackbar();
  const { open, visible, close } = useSwitch(false);

  const [customLoan, setCustomLoan] = useState<CustomRateData>({
    customRate: estimateRate.loanTerm || undefined,
    interestRate: estimateRate.interestRate || undefined,
    loanTerm: estimateRate.interestRate || undefined,
  });
  const [searchForm, setSearchForm] = useState<BRQueryData>({
    ...initialize,
    ...estimateRate,
    closeDate: estimateRate.closeDate
      ? new Date(estimateRate.closeDate)
      : initialize.closeDate,
  });

  const [checkLoading, setCheckLoading] = useState(false);
  const [customLoading, setCustomLoading] = useState(false);

  const [isFirstSearch, setIsFirstSearch] = useState(() => {
    if (
      !POSNotUndefined(searchForm?.homeValue) ||
      !POSNotUndefined(searchForm?.balance)
    ) {
      return true;
    }
    return searchForm.isCashOut && !POSNotUndefined(searchForm?.cashOutAmount);
  });
  const [loading, setLoading] = useState(() => {
    if (
      !POSNotUndefined(searchForm?.homeValue) ||
      !POSNotUndefined(searchForm?.balance)
    ) {
      return false;
    }
    return !(
      searchForm.isCashOut && !POSNotUndefined(searchForm?.cashOutAmount)
    );
  });

  const [productType, setProductType] = useState('');

  const [productList, setProductList] = useState<RatesProductData[]>();
  const [reasonList, setReasonList] = useState<string[]>([]);

  const [productInfo, setProductInfo] = useState<
    Partial<BridgeRefinanceLoanInfo>
  >({});
  const [selectedItem, setSelectedItem] = useState<
    BridgeRefinanceLoanInfo &
      Pick<
        RatesProductData,
        'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm' | 'id'
      >
  >();

  const onCheckGetList = async () => {
    const element = document.getElementById('bridge_refinance_rate_search');
    const { height = 0 } = element!.getBoundingClientRect();
    const postData: Variable<BREstimateRateData> = {
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
          customRate: false,
        };
        return await _fetchRatesProductPreview(processId, requestData);
      })
      .then((res) => {
        setProductInfo(res!.data.loanInfo);
        setProductList(res!.data.products as RatesProductData[]);
        setReasonList(res!.data.reasons);
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
        setIsFirstSearch(false);
        setLoading(false);
        if (['sx', 'sm', 'md'].includes(breakpoints)) {
          setTimeout(() => {
            window.scrollTo({ top: height + 144, behavior: 'smooth' });
          }, 300);
        }
      });
  };

  const onCustomLoanClick = async () => {
    setCustomLoading(true);
    setProductType('CUSTOM_LOAN');
    if (nextStep) {
      const temp: RatesProductData[] = JSON.parse(JSON.stringify(productList));
      temp.map((child) => {
        child.selected = false;
        return child;
      });
      setProductList(temp);
    }

    const postData: Variable<BREstimateRateData> = {
      name: VariableName.estimateRate,
      type: 'json',
      value: {
        ...searchForm,
        closeDate: isDate(searchForm.closeDate)
          ? format(searchForm.closeDate as Date, 'yyyy-MM-dd O')
          : POSTypeOf(searchForm.closeDate) === 'Null'
            ? format(addDays(new Date(), 7), 'yyyy-MM-dd O')
            : searchForm.closeDate,
        customRate: true,
        interestRate: customLoan.interestRate,
        loanTerm: customLoan.loanTerm,
      },
    };
    const requestData = {
      ...searchForm,
      closeDate: isDate(searchForm.closeDate)
        ? format(searchForm.closeDate as Date, 'yyyy-MM-dd O')
        : POSTypeOf(searchForm.closeDate) === 'Null'
          ? format(addDays(new Date(), 7), 'yyyy-MM-dd O')
          : searchForm.closeDate,
      customRate: true,
      interestRate: customLoan.interestRate,
      loanTerm: customLoan.loanTerm,
    };
    await _updateProcessVariables(processId as string, [postData])
      .then(async () => {
        return await _fetchCustomRates(processId, requestData);
      })
      .then((res) => {
        const {
          loanInfo,
          product: {
            paymentOfMonth,
            interestRateOfYear,
            loanTerm,
            id,
            totalClosingCash,
            proRatedInterest,
          },
        } = res!.data;
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
        setCustomLoading(false);
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
      const temp: RatesProductData[] = JSON.parse(JSON.stringify(productList));
      temp.map((child) => {
        child.selected = child.id === item.id;
        return child;
      });
      setProductList(temp);
      setProductType('');
    }
    setSelectedItem(
      Object.assign(productInfo as BridgeRefinanceLoanInfo, {
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

  const { run } = useDebounceFn(() => {
    if (searchForm.isCashOut && !POSNotUndefined(searchForm?.cashOutAmount)) {
      return;
    }
    onCheckGetList();
  }, 1000);

  useEffect(
    () => {
      if (
        !POSNotUndefined(searchForm?.homeValue) ||
        !POSNotUndefined(searchForm?.balance)
      ) {
        return;
      }
      if (searchForm.isCashOut && !POSNotUndefined(searchForm?.cashOutAmount)) {
        return;
      }
      if (isFirstSearch) {
        setIsFirstSearch(false);
      }
      setLoading(true);
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
    <>
      <BridgeRefinanceRatesSearch
        id={'bridge_refinance_rate_search'}
        loading={loading}
        searchForm={searchForm}
        setSearchForm={setSearchForm}
        userType={userType!}
      />
      <RatesList
        customLoading={customLoading}
        customLoan={customLoan}
        isFirstSearch={isFirstSearch}
        loading={loading}
        onClick={onListItemClick}
        onCustomLoanClick={onCustomLoanClick}
        productList={productList as RatesProductData[]}
        productType={productType}
        reasonList={reasonList}
        setCustomLoan={setCustomLoan}
        userType={userType}
      />
      <BridgeRefinanceRatesDrawer
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
