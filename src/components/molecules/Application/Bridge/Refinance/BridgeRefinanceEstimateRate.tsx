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
  BREstimateRateData,
  HttpError,
  PropertyOpt,
  RatesProductData,
  VariableName,
} from '@/types';
import {
  _fetchRatesProductPreview,
  _updateRatesProductSelected,
  BRQueryData,
} from '@/requests/dashboard';
import {
  BridgeRefinanceRatesDrawer,
  BridgeRefinanceRatesSearch,
  RatesList,
} from '@/components/molecules';

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
  const { enqueueSnackbar } = useSnackbar();
  const { open, visible, close } = useSwitch(false);

  const [loading, setLoading] = useState(false);
  const [checkLoading, setCheckLoading] = useState(false);

  const [searchForm, setSearchForm] = useState<BRQueryData>({
    ...initialize,
    closeDate: estimateRate.closeDate
      ? new Date(estimateRate.closeDate)
      : initialize.closeDate,
  });
  const [productList, setProductList] = useState<RatesProductData[]>();
  const [reasonList, setReasonList] = useState<string[]>([]);
  const [isFirstSearch, setIsFirstSearch] = useState<boolean>(true);

  const [productInfo, setProductInfo] = useState<BridgeRefinanceLoanInfo>();
  const [selectedItem, setSelectedItem] = useState<
    BridgeRefinanceLoanInfo &
      Pick<
        RatesProductData,
        'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm' | 'id'
      >
  >();

  const onCheckGetList = async () => {
    const element = document.getElementById('bridge_refinance_rate_search');
    const { height } = element!.getBoundingClientRect();
    setIsFirstSearch(false);
    setLoading(true);
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
        const res = await _fetchRatesProductPreview(processId, {
          ...searchForm,
          closeDate: isDate(searchForm.closeDate)
            ? format(searchForm.closeDate as Date, 'yyyy-MM-dd O')
            : POSTypeOf(searchForm.closeDate) === 'Null'
            ? format(addDays(new Date(), 7), 'yyyy-MM-dd O')
            : searchForm.closeDate,
        });
        if (res.status === 200) {
          setProductList(res.data.products);
          setReasonList(res.data.reasons);
          setProductInfo(res.data.loanInfo);
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
        setProductList([]);
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

  return (
    <>
      <BridgeRefinanceRatesSearch
        id={'bridge_refinance_rate_search'}
        loading={loading}
        onCheck={onCheckGetList}
        searchForm={searchForm}
        setSearchForm={setSearchForm}
        userType={userType!}
      />
      <RatesList
        isFirstSearch={isFirstSearch}
        loading={loading}
        onClick={onListItemClick}
        productList={productList as RatesProductData[]}
        reasonList={reasonList}
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
