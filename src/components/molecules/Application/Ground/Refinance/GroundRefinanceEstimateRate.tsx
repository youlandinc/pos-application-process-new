import { POSTypeOf } from '@/utils';
import { addDays, format, isDate } from 'date-fns';
import { FC, useState } from 'react';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useSwitch } from '@/hooks';
import { AUTO_HIDE_DURATION } from '@/constants';
import { _updateProcessVariables } from '@/requests';
import {
  GREstimateRateData,
  PropertyOpt,
  RatesProductData,
  VariableName,
} from '@/types';
import {
  _fetchRatesLoanInfo,
  _fetchRatesProductPreview,
  _updateRatesProductSelected,
  GRQueryData,
} from '@/requests/dashboard';

import {
  GroundRefinanceRatesDrawer,
  GroundRefinanceRatesSearch,
  RatesList,
} from '@/components/molecules';

const initialize: GRQueryData = {
  homeValue: undefined,
  balance: undefined,
  isCashOut: false,
  cor: undefined,
  arv: undefined,
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

export interface GroundRefinanceLoanInfo {
  // refinance
  firstName: string;
  lastName: string;
  address: string;
  isCashOut: boolean;
  totalLoanAmount: number;
  balance: number;
  homeValue: number;
  cashOutAmount: number;
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

export const GroundRefinanceEstimateRate: FC<{
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

  const [searchForm, setSearchForm] = useState<GRQueryData>({
    ...initialize,
    closeDate: estimateRate.closeDate
      ? new Date(estimateRate.closeDate)
      : initialize.closeDate,
  });
  const [productList, setProductList] = useState<RatesProductData[]>();
  const [isFirstSearch, setIsFirstSearch] = useState<boolean>(true);

  const [productInfo, setProductInfo] = useState<GroundRefinanceLoanInfo>();
  const [selectedItem, setSelectedItem] = useState<
    GroundRefinanceLoanInfo &
      Pick<
        RatesProductData,
        'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm' | 'id'
      >
  >();

  const onCheckGetList = async () => {
    setIsFirstSearch(false);
    setLoading(true);
    const postData: Variable<GREstimateRateData> = {
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
      Object.assign(productInfo as GroundRefinanceLoanInfo, {
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
        onClose: () => {
          setCheckLoading(false);
        },
      });
    }
  };

  return (
    <>
      <GroundRefinanceRatesSearch
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
        userType={userType}
      />
      <GroundRefinanceRatesDrawer
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
