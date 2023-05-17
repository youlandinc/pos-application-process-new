import React, { FC, useMemo } from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';
import { Box, SxProps, Typography } from '@mui/material';
import { PageHeader } from '@/components/molecules';
import { BridgePurchaseTask } from '@/components/organisms';
import { POSFlex, POSFont } from '@/styles';
import { CheckCircle } from '@mui/icons-material';

const list = [
  {
    title: 'Application information',
    status: 'Finish',
    children: [
      { title: 'Loan Details', status: 'Finish' },
      { title: 'Property Details', status: 'Finish' },
      { title: 'Real Estate Investment Experience', status: 'Finish' },
    ],
  },
  {
    title: 'Borrower Information',
    status: 'Unfinished',
    children: [
      { title: 'Personal Details', status: 'Unfinished' },
      { title: 'Demographics Information', status: 'Unfinished' },
      { title: 'Co-borrower Details', status: 'Unfinished' },
      { title: 'Guarantor Personal', status: 'Unfinished' },
    ],
  },
  {
    title: 'Property Appraisal',
    status: 'Unfinished',
    children: [
      {
        title: 'Pay the Appraisal cost or upload the report',
        status: 'Unfinished',
      },
    ],
  },
  {
    title: 'Third-party Information',
    status: 'Unfinished',
    children: [
      {
        title: 'Closing Agent / Title Company Information',
        status: 'Unfinished',
      },
      {
        title: 'Homeowner Insurance Agent Information',
        status: 'Unfinished',
      },
    ],
  },
  {
    title: 'Set up auto Pay',
    status: 'Unfinished',
    children: [
      {
        title: 'Plaid or ACH Debit',
        status: 'Unfinished',
      },
    ],
  },
  {
    title: 'Agreements & document',
    status: 'Unfinished',
    children: [
      {
        title: 'Property Inspection Details',
        status: 'Unfinished',
      },
      {
        title: 'Upload Signed Purchase Contract',
        status: 'Unfinished',
      },
      {
        title: 'Upload Property Pictures (optional)',
        status: 'Unfinished',
      },
      {
        title: 'Upload Order Appraisal (optional)',
        status: 'Unfinished',
      },

      {
        title: 'Review and Accept Construction Holdback Process',
        status: 'Unfinished',
      },
      {
        title: 'Documents & Materials',
        status: 'Unfinished',
      },
    ],
  },
];

export const TaskPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const TaskPageStyles: SxProps = {
    px: {
      lg: 3,
      xs: 0,
    },
    maxWidth: 900,
    width: '100%',
    mx: {
      lg: 'auto',
      xs: 0,
    },
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    '& .card_box': {
      px: 3,
      py: 4.5,
      border: '1px solid',
      borderColor: 'background.border_default',
      mb: 3,
      borderRadius: 2,
      '& .Finish': {
        color: 'success.main',
      },
      '& div': {
        height: 48,
        ...POSFlex('center', 'space-between', 'row'),
        '&:hover': {
          cursor: 'pointer',
          borderRadius: 1,
          bgcolor: '#C5D1FF',
        },
        '&:first-of-type': {
          '&:hover': {
            bgcolor: 'transparent',
          },
        },
        '& >div': {
          width: 120,
          height: 24,
          borderRadius: 1,
          bgcolor: 'success.A200',
          ...POSFlex('center', 'center', 'row'),
          ...POSFont(12, 600, 1.5, 'success.main'),
          '&.Unfinished': {
            bgcolor: 'info.A200',
            color: 'info.main',
          },
        },
      },
    },
  };
  const renderTaskPage = useMemo(() => {
    switch (scene) {
      //  case 'mortgage purchase': {
      //    return <MortgagePurchaseTask />;
      //  }
      //  case 'mortgage refinance': {
      //    return <MortgageRefinanceTask />;
      //  }
      case 'bridge purchase': {
        return <BridgePurchaseTask />;
      }
      //  case 'bridge refinance': {
      //    return <BridgeRefinanceTask />;
      //  }
      default:
        return <BridgePurchaseTask />;
    }
  }, [scene]);

  return (
    <Box sx={TaskPageStyles}>
      {/* <PageHeader
         subTitle={
         'You can make updates to the task before the loan is approved.'
         }
         title={'Your Tasks Checklist'}
         /> */}
      {renderTaskPage}
      {/* {list.map((item) => (
         <Box className={'card_box'} key={item.title}>
         <Box>
         <Typography
         // component={'div'}
         // mt={3}
         variant={'h6'}
         >
         {item.title}
         </Typography>
         <Box className={item.status}>{item.status}</Box>
         </Box>
         {item.children.map((sonItem) => (
         <Box key={sonItem.title} px={3}>
         <Typography
         // component={'div'}
         // mt={3}
         variant={'body1'}
         >
         {sonItem.title}
         </Typography>
         {sonItem.status === 'Finish' && (
         <CheckCircle className={sonItem.status} />
         )}
         </Box>
         ))}
         </Box>
         ))} */}
    </Box>
  );
});
