import { FC } from 'react';
import { Box, SxProps, Typography } from '@mui/material';
import { observer } from 'mobx-react-lite';
// import { useMst } from '@/models/Root';

import { StyledButton } from '@/components/atoms';
import { PageHeader } from '@/components/molecules';
import { POSFlex, POSFont } from '@/styles';
import { CheckCircle } from '@mui/icons-material';

const list = [
  {
    title: 'Application Information',
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
  // {
  //   title: 'Set up auto Pay',
  //   status: 'Unfinished',
  //   children: [
  //     {
  //       title: 'Plaid or ACH Debit',
  //       status: 'Unfinished',
  //     },
  //   ],
  // },
  {
    title: 'Agreements & Document',
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
        title: 'Upload Property Pictures (Optional)',
        status: 'Unfinished',
      },
      {
        title: 'Upload Order Appraisal (Optional)',
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

export interface CheckListProps {
  updateState: () => void;
}

export const CheckList: FC<CheckListProps> = observer(({ updateState }) => {
  // const {
  //   selectedProcessData: { scene },
  // } = useMst();

  return (
    <Box sx={CheckListStyles}>
      <PageHeader
        subTitle={
          'You can make updates to the task before the loan is approved.'
        }
        title={'Your Tasks Checklist'}
      />

      {list.map((item) => (
        <Box className={'card_box'} key={item.title}>
          <Box>
            <Typography
              // component={'div'}
              // mt={3}
              sx={{
                fontSize: {
                  md: 18,
                  xs: 16,
                },
              }}
              variant={'h6'}
            >
              {item.title}
            </Typography>
            {/* <Box className={item.status}>{item.status}</Box> */}
          </Box>
          {item.children.map((sonItem) => (
            <Box
              key={sonItem.title}
              onClick={() =>
                item.title === 'Property Appraisal' && updateState()
              }
              px={{ md: 3, xs: 0 }}
            >
              <Typography
                // component={'div'}
                // mt={3}
                sx={{
                  fontSize: {
                    md: 16,
                    xs: 12,
                  },
                }}
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
      ))}

      <Box className={'footer'}>
        <Box>
          <Typography
            color={'warning.main'}
            sx={{
              fontSize: {
                md: 18,
                xs: 16,
              },
            }}
            variant={'h6'}
          >
            Update your progress with your loan officer
          </Typography>
          <Typography
            color={'warning.main'}
            sx={{
              fontSize: {
                md: 16,
                xs: 12,
              },
            }}
            variant={'body2'}
          >
            We will notify your loan officer to review the tasks you have
            completed. If you have any questions or concerns, please reach out
            to your loan officer to ensure that the tasks are completed
            accurately.
          </Typography>
        </Box>
        <Box sx={{ width: '100px' }}>
          <StyledButton color={'warning'}>Update</StyledButton>
        </Box>
      </Box>
    </Box>
  );
});

const CheckListStyles: SxProps = {
  maxWidth: 900,
  width: '100%',

  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  '& .card_box': {
    p: 3,
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
  '& .footer': {
    p: 3,
    borderRadius: 2,
    mt: 1,
    bgcolor: 'warning.A200',
    gap: 3,
    ...POSFlex('center', 'space-between', { md: 'row', xs: 'column' }),
  },
};
