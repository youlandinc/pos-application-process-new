// import React, { FC, ReactNode, useMemo } from 'react';
// import { makeStyles, Box, FormControlLabel } from '@material-ui/core';

// import { StyledCheckbox } from '@/components/atoms';
// import { PaymentTaskBaseComponentProps } from '@/components/molecules';
// import { lock } from '@next/react-dev-overlay/lib/internal/components/Overlay/body-locker';

// const useStyle = makeStyles({
//   container: {},
//   title: {
//     marginTop: 72,
//     fontSize: 36,
//     lineHeight: 1,
//     color: 'rgba(0,0,0,.87)',
//     fontWeight: 700,
//   },
//   confirmBox: {
//     marginTop: 24,
//     marginLeft: 0,
//     width: '100%',
//     display: 'flex',
//     alignItems: 'center',
//     fontSize: 16,
//     color: 'rgba(0,0,0,.38)',
//     cursor: 'pointer',
//     userSelect: 'none',
//   },
// });

// interface NoticeTableProps extends PaymentTaskBaseComponentProps {
//   onCheckValueChange: (e) => void;
//   check: boolean;
//   loanDetail: ReactNode;
//   productType?: ProductCategory;
// }

// export const NoticeTable: FC<NoticeTableProps> = (props) => {
//   const {
//     check,
//     onCheckValueChange,
//     productType = 'mortgage',
//     loanDetail,
//   } = props;

//   const classes = useStyle();

//   return (
//     <Box className={classes.container}>
//       <Box className={classes.title}>
//         {productType === 'mortgage' ? 'Lock your rate' : 'Confirm your rate'}
//       </Box>
//       <Box mt={'36px'}>{loanDetail}</Box>
//       <FormControlLabel
//         className={classes.confirmBox}
//         control={
//           <StyledCheckbox
//             style={{ marginRight: 8 }}
//             checked={check}
//             onChange={onCheckValueChange}
//           />
//         }
//         label={`I agree
//           to the terms above and would like to ${
//             productType === 'mortgage' ? 'lock' : 'confirm'
//           } this rate ${
//           productType === 'mortgage' ? 'for the next 30 days' : ''
//         }.`}
//       />
//     </Box>
//   );
// };
