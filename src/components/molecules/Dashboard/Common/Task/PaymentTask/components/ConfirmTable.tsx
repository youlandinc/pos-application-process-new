// import React, { FC } from 'react';
// import { makeStyles, Box, FormControlLabel } from '@material-ui/core';
// import { StyledCheckbox } from '@/components/atoms';
// import CallOutlinedIcon from '@material-ui/icons/CallOutlined';
// import MailOutlineOutlinedIcon from '@material-ui/icons/MailOutlineOutlined';
// import { POSFlex, POSFont } from '@/common/styles/global';
// import { utils } from '@/common/utils';

// const useStyle = makeStyles({
//   container: {},
//   title: {
//     marginTop: 72,
//     fontSize: 36,
//     lineHeight: 1,
//     color: 'rgba(0,0,0,.87)',
//     fontWeight: 700,
//   },
//   subTitle: {
//     marginTop: 24,
//     fontSize: 16,
//     lineHeight: 1.5,
//     color: 'rgba(0,0,0,.6)',
//   },
//   confirmBox: {
//     marginTop: 48,
//     marginLeft: 0,
//     width: '100%',
//     display: 'flex',
//     alignItems: 'center',
//     fontSize: 16,
//     color: 'rgba(0,0,0,.38)',
//     cursor: 'pointer',
//     userSelect: 'none',
//   },
//   tipContainer: {
//     marginBlockStart: 24,
//   },
//   tipHeader: {
//     ...POSFont(24, 400, 1.5, 'rgba(0,0,0,.87)'),
//   },
//   tipMain: {
//     ...POSFont(16, 400, 1.5, 'rgba(0,0,0,.6)'),
//   },
//   tipFooter: {
//     ...POSFlex('center', 'flex-start', 'row'),
//     marginBlockStart: 12,
//   },
//   logoWrap: {
//     ...POSFlex('center', 'flex-start', 'row'),
//     color: 'rgba(0,0,0,.6)',
//     '&:last-of-type': {
//       marginLeft: 24,
//     },
//   },
//   logo: {
//     width: 24,
//     height: 24,
//     marginRight: 12,
//     color: 'rgba(0,0,0,.6)',
//   },
// });

// interface ConfirmTableProps {
//   onCheckValueChange: (e) => void;
//   check: boolean;
// }

// export const ConfirmTable: FC<ConfirmTableProps> = (props) => {
//   const { onCheckValueChange, check } = props;
//   const classes = useStyle();
//   const tenantConfig = utils.getTenantConfig();

//   return (
//     <Box className={classes.container}>
//       <Box className={classes.title}>Confirm your interest in this loan</Box>
//       <Box className={classes.subTitle}>
//         <Box>
//           We&apos;re just about ready to move to the next step in the
//           application process but first we need to take care of one legal
//           detail.
//         </Box>
//         <Box>
//           According to federal regulations, all lenders are required to go
//           through a step called Intent to Proceed. It can sound like a big
//           commitment but don&apos;t worry - this isn&apos;t legally-binding and
//           if something comes up, you can still back out down the road. This just
//           lets us know that you understand your loan terms.
//         </Box>
//       </Box>
//       <Box className={classes.tipContainer}>
//         <Box className={classes.tipHeader}>
//           Tips from {tenantConfig.organizationName || 'YouLand'}:
//         </Box>
//         <Box className={classes.tipMain}>
//           If you have any questions, feel free to contact us and we&apos;ll help
//           you out.
//         </Box>
//         <Box className={classes.tipFooter}>
//           <Box className={classes.logoWrap}>
//             <CallOutlinedIcon className={classes.logo} />
//             {tenantConfig.extInfo?.posSettings?.phone || '1-833-968-5263'}
//           </Box>
//           <Box className={classes.logoWrap}>
//             <MailOutlineOutlinedIcon className={classes.logo} />
//             {tenantConfig.extInfo?.posSettings?.email || 'borrow@youland.com'}
//           </Box>
//         </Box>
//       </Box>
//       <FormControlLabel
//         className={classes.confirmBox}
//         label="I intend to proceed with this loan."
//         control={
//           <StyledCheckbox
//             style={{ marginRight: 8 }}
//             checked={check}
//             onChange={onCheckValueChange}
//           />
//         }
//       />
//     </Box>
//   );
// };
