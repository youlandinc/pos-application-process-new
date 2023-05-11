import { FC, useState } from 'react';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION } from '@/constants';
import { useSwitch } from '@/hooks';
import { _updateProcessVariables } from '@/requests';
import {
  BridgePurchaseEstimateRateData,
  PropertyOpt,
  RatesProductData,
  VariableName,
} from '@/types';
import {
  _fetchRatesLoanInfo,
  _fetchRatesProductPreview,
  _updateRatesProductSelected,
  BPQueryData,
} from '@/requests/dashboard';
import {
  //BPRatesDrawer,
  //BridgeRatesList,
  BridgePurchaseRatesSearch,
} from '@/components/molecules';

const initialize: BPQueryData = {
  purchasePrice: undefined,
  purchaseLoanAmount: undefined,
  isCor: false,
  cor: undefined,
  arv: undefined,
  brokerPoints: undefined,
  brokerProcessingFee: undefined,
};

export interface BPLoanInfo {
  // refinance
  firstName: string;
  lastName: string;
  address: string;
  isCor: boolean;
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
  // officer
  officerPoints: number;
  officerOriginationFee: number;
  officerProcessingFee: number;
  // agent
  agentFee: number;
}

export const BridgePurchaseEstimateRate: FC<{ nextStep?: () => void }> =
  observer(({ nextStep }) => {
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
    const [searchForm, setSearchForm] = useState<BPQueryData>(initialize);
    const [productList, setProductList] = useState<RatesProductData[]>();
    const [isFirstSearch, setIsFirstSearch] = useState<boolean>(true);

    const [productInfo, setProductInfo] = useState<BPLoanInfo>();
    const [selectedItem, setSelectedItem] = useState<
      BPLoanInfo &
        Pick<
          RatesProductData,
          'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm' | 'id'
        >
    >();

    const onCheckGetList = async () => {
      setIsFirstSearch(false);
      setLoading(true);
      const postData: Variable<BridgePurchaseEstimateRateData> = {
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

    const onListItemClick = async (
      item: BPLoanInfo &
        Pick<
          RatesProductData,
          'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm' | 'id'
        >,
    ) => {
      const { paymentOfMonth, interestRateOfYear, loanTerm, id } = item;
      setSelectedItem(
        Object.assign(productInfo as BPLoanInfo, {
          paymentOfMonth,
          interestRateOfYear,
          loanTerm,
          id,
        }),
      );
      open();
    };

    const nextStepWrap = async (id: string) => {
      await _updateRatesProductSelected(processId, { id })
        .then(() => nextStep?.())
        .catch((err) =>
          enqueueSnackbar(err, {
            variant: 'error',
            autoHideDuration: AUTO_HIDE_DURATION,
          }),
        );
    };

    return (
      <>
        <BridgePurchaseRatesSearch
          loading={loading}
          onCheck={onCheckGetList}
          searchForm={searchForm}
          setSearchForm={setSearchForm}
          userType={userType}
        />
        {/*<BridgeRatesList*/}
        {/*  productList={productList}*/}
        {/*  onClick={onListItemClick}*/}
        {/*  isFirstSearch={isFirstSearch}*/}
        {/*  loading={loading}*/}
        {/*  userType={userType}*/}
        {/*/>*/}
        {/*<BPRatesDrawer*/}
        {/*  visible={visible}*/}
        {/*  onCancel={close}*/}
        {/*  selectedItem={selectedItem}*/}
        {/*  nextStep={nextStepWrap}*/}
        {/*  userType={userType}*/}
        {/*/>*/}
      </>
    );
  });
