// import { FC, useCallback, useState } from 'react';

// import { useAsync } from 'react-use';

// import { observer } from 'mobx-react-lite';
// import { useMst } from '@/models/Root';

// import { useSwitch } from '@/hooks';
// 、
// import { LoanStage } from '@/types/enum';
// import { POSFlex } from '@/styles';

// import {
//   _fetchRatesLoanInfo,
//   _fetchRatesProduct,
//   _fetchRatesProductPreview,
//   _updateRatesProductSelected,
//   BRQueryData,
// } from '@/requests/dashboard';
// import {
//   BRLoanInfo,
//   BridgeRatesList,
//   BRRatesDrawer,
//   BRRatesSearch,
// } from '@/components/molecules';
// import { Box } from '@mui/material';
// import { Encompass, RatesProductData } from '@/types';

// const initialize: BRQueryData = {
//   homeValue: undefined,
//   balance: undefined,
//   isCashOut: false,
//   cashOutAmount: undefined,
//   isCor: false,
//   cor: undefined,
//   arv: undefined,
//   brokerPoints: undefined,
//   brokerProcessingFee: undefined,
//   officerPoints: undefined,
//   officerProcessingFee: undefined,
//   agentFee: undefined,
// };

// const useStyles = makeStyles({
//   container: {
//     width: '100%',
//     padding: '120px 7.5vw',
//     minWidth: 908,
//     ...POSFlex(undefined, 'center', 'column'),
//   },
// });

// export const BridgeRefinanceRates: FC = observer(() => {
//   const {
//     userSetting: {
//       setting: { lastSelectedProcessId },
//     },
//     userType,
//   } = useMst();
//   const classes = useStyles();
//   const { open, visible, close } = useSwitch(false);

//   const [loading, setLoading] = useState(false);
//   const [loanStage, setLoanStage] = useState<LoanStage>(LoanStage.PreApproved);
//   const [searchForm, setSearchForm] = useState<BRQueryData>(initialize);
//   const [productList, setProductList] = useState<RatesProductData[]>();
//   const [loanInfo, setLoanInfo] = useState<BRLoanInfo>();
//   const [encompassData, setEncompassData] = useState<Encompass>();
//   const [selectedItem, setSelectedItem] = useState<
//     BRLoanInfo &
//       Pick<
//         RatesProductData,
//         'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm' | 'id'
//       >
//   >();

//   const { loading: initLoading } = useAsync(async () => {
//     return Promise.all([
//       _fetchRatesProduct(lastSelectedProcessId),
//       _fetchRatesLoanInfo(lastSelectedProcessId),
//     ])
//       .then((res) => {
//         const { products } = res[0].data;
//         setProductList(products);
//         const { info, loanStage, encompass } = res[1].data;
//         setLoanStage(loanStage);
//         setEncompassData(encompass);
//         setLoanInfo(info);
//         const {
//           homeValue,
//           balance,
//           isCashOut,
//           cashOutAmount,
//           isCor,
//           cor,
//           arv,
//           brokerPoints,
//           brokerProcessingFee,
//           officerPoints,
//           officerProcessingFee,
//           agentFee,
//         } = info;
//         setSearchForm({
//           ...searchForm,
//           homeValue,
//           balance,
//           isCashOut,
//           cashOutAmount: cashOutAmount,
//           isCor,
//           cor: cor,
//           arv: arv,
//           brokerPoints,
//           brokerProcessingFee,
//           officerPoints,
//           officerProcessingFee,
//           agentFee,
//         });
//       })
//       .catch((err) => console.log(err));
//   });

//   const onCheckGetList = async () => {
//     setLoading(true);
//     await _fetchRatesProductPreview(lastSelectedProcessId, searchForm)
//       .then((res) => {
//         setProductList(res.data.products);
//         setLoanInfo(res.data.loanInfo);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.log(err);
//         setLoading(false);
//       });
//   };

//   const onListItemClick = async (item) => {
//     const { paymentOfMonth, interestRateOfYear, loanTerm, id } = item;
//     const postData = {
//       id,
//       queryParams: {
//         ...searchForm,
//       },
//     };
//     setSelectedItem(
//       Object.assign(loanInfo, {
//         paymentOfMonth,
//         interestRateOfYear,
//         loanTerm,
//         id,
//       }),
//     );
//     open();
//     if (!item.selected) {
//       productList.forEach((item) => (item.selected = false));
//       item.selected = true;
//       if (loanStage !== LoanStage.Approved) {
//         await updateSelectedProduct(postData);
//       }
//     }
//   };

//   const updateSelectedProduct = useCallback(
//     async (postData) => {
//       const res = await _updateRatesProductSelected(
//         lastSelectedProcessId,
//         postData,
//       );
//       console.log(res);
//     },
//     [lastSelectedProcessId],
//   );

//   return (
//     <>
//       <Box className={classes.container}>
//         <BRRatesSearch
//           loading={loading || initLoading}
//           onCheck={onCheckGetList}
//           searchForm={searchForm}
//           setSearchForm={setSearchForm}
//           userType={userType}
//           loanStage={loanStage}
//         />
//         <BridgeRatesList
//           productList={productList}
//           onClick={onListItemClick}
//           loading={loading || initLoading}
//           userType={userType}
//           loanStage={loanStage}
//         />
//         <BRRatesDrawer
//           visible={visible}
//           onCancel={close}
//           selectedItem={selectedItem}
//           userType={userType}
//           loanStage={loanStage}
//         />
//       </Box>
//     </>
//   );
// });
