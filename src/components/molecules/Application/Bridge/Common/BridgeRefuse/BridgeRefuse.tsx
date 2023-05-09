// import { FC, useEffect } from 'react';
// import { Box, Icon, Stack, Typography } from '@mui/material';

// import { observer } from 'mobx-react-lite';
// import { useMst } from '@/models/Root';
// import { IPersonalInfo } from '@/models/application/common/CreditScore';

// import { StyledFormItem } from '@/components/atoms';

// import SCORE_BUOY from '@/svg/score/buoy.svg';

// export const BridgeRefuse: FC = observer(() => {
//   const {
//     applicationForm: {
//       formData: {
//         creditScore: {
//           selfInfo: { creditScore: score },
//         },
//       },
//     },
//   } = useMst();

//   useEffect(() => {
//     if (!score) {
//       return;
//     }
//     const SCORE_BUOY_DIVIDER = document.getElementById('SCORE_BUOY_DIVIDER');
//     const SCORE_BUOY_ICON = document.getElementById('SCORE_BUOY_ICON');
//     const px =
//       (score / 850) * SCORE_BUOY_DIVIDER!.getBoundingClientRect().width;
//     SCORE_BUOY_ICON!.style.transform = 'translateX(0px)';
//     SCORE_BUOY_ICON!.style.transform = `translateX(${px}px)`;
//   }, [score, role]);

//   return (
//     <>
//       <StyledFormItem
//         label={
//           <Stack
//             alignItems={'center'}
//             flexDirection={'column'}
//             justifyContent={'center'}
//             width={'100%'}
//           >
//             Your Credit Score is
//             <AnimatedNumbers
//               animateToNumber={score}
//               configs={(number, index) => {
//                 return {
//                   mass: 1,
//                   tension: 230 * (index + 1),
//                   friction: 140,
//                 };
//               }}
//               fontStyle={{ fontSize: 48 }}
//             />
//           </Stack>
//         }
//         tip={
//           'Congratulations! Your credit score indicates that you are qualified to proceed with us and help us determine which rates you qualify for.'
//         }
//         tipSx={{ mb: 0 }}
//       >
//         <Box
//           id={'SCORE_BUOY_DIVIDER'}
//           sx={{
//             m: '0 auto',
//             mt: 6,
//             width: '100%',
//             maxWidth: 600,
//             height: 16,
//             borderRadius: 2,
//             background:
//               'linear-gradient(90deg, #EC574D 0%, #EEB43B 53.13%, #30E3A2 100%)',
//             position: 'relative',
//           }}
//         >
//           <Icon
//             component={SCORE_BUOY}
//             id={'SCORE_BUOY_ICON'}
//             sx={{
//               position: 'absolute',
//               top: '150%',
//               left: 0,
//               transition: 'all 3s ease-out .5s',
//             }}
//           />
//         </Box>
//         <Typography
//           color={'info.main'}
//           mt={6}
//           textAlign={'center'}
//           variant={'body1'}
//         >
//           Just a few more steps until you&apos;re pre-approved.
//         </Typography>
//       </StyledFormItem>
//     </>
//   );
// });
