// import React, { FC, useCallback, useState } from 'react';
// import { Box, makeStyles } from '@material-ui/core';
// import { useAsync } from 'react-use';

// import { observer } from 'mobx-react-lite';
// import { useMst } from '@/models/Root';

// import { useSwitch } from '@/hooks';
// import { POSFlex } from '@/common/styles/global';
// import { RatesProductData } from '@/types/dashboardData';
// import {
//   _fetchRatesLoanInfo,
//   _fetchRatesProduct,
//   _fetchRatesProductPreview,
//   _updateRatesProductSelected,
//   BPQueryData,
// } from '@/requests/dashboard';
// import {
//   BPLoanInfo,
//   BPRatesDrawer,
//   BPRatesSearch,
//   BridgeRatesList,
// } from '@/components/molecules';
// import { LoanStage } from '@/types/enum';
// import { Encompass } from '@/types/variable';

// const initialize: BPQueryData = {
//   purchasePrice: undefined,
//   purchaseLoanAmount: undefined,
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

// export const BridgePurchaseRates: FC = observer(() => {
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
//   const [encompassData, setEncompassData] = useState<Encompass>();
//   const [searchForm, setSearchForm] = useState<BPQueryData>(initialize);
//   const [productList, setProductList] = useState<RatesProductData[]>();
//   const [loanInfo, setLoanInfo] = useState<BPLoanInfo>();
//   const [selectedItem, setSelectedItem] = useState<
//     BPLoanInfo &
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
//         const { info, encompass, loanStage } = res[1].data;
//         setEncompassData(encompassData);
//         setLoanStage(loanStage);
//         setLoanInfo(info);
//         const {
//           isCor,
//           purchaseLoanAmount,
//           purchasePrice,
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
//           isCor,
//           purchasePrice,
//           purchaseLoanAmount,
//           cor,
//           arv,
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
//         <BPRatesSearch
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
//         <BPRatesDrawer
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
