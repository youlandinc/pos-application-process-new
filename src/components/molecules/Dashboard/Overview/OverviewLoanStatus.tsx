import { FC, useMemo } from 'react';
import { Stack, Typography } from '@mui/material';
import { AppraisalStage, PipelineLoanStageEnum } from '@/types';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';
import { format, parseISO } from 'date-fns';

const hash = {
  [PipelineLoanStageEnum.scenario]: 0,
  [PipelineLoanStageEnum.initial_approval]: 1,
  [PipelineLoanStageEnum.preparing_docs]: 2,
  [PipelineLoanStageEnum.docs_out]: 3,
  [PipelineLoanStageEnum.funded]: 4,
  [PipelineLoanStageEnum.rejected]: 0,
  [PipelineLoanStageEnum.inactive]: 0,
};

interface OverviewLoanStatusProps {
  loanStatus: PipelineLoanStageEnum;
}

export const OverviewLoanStatus: FC<OverviewLoanStatusProps> = ({
  loanStatus,
}) => {
  // const computedData = useMemo(() => {
  //   if (
  //     loanStatus === PipelineLoanStageEnum.rejected ||
  //     appraisalDetail?.canceled
  //   ) {
  //     return [
  //       {
  //         icon: <CancelRoundedIcon sx={{ color: 'error.main' }} />,
  //         label: 'Appraisal has been canceled',
  //         description:
  //           'Please email us at borrow@youland.com or call (833) 968-5263 for refunds and any questions you have.',
  //         date: appraisalDetail?.canceled?.completeDate
  //           ? `Canceled on ${format(
  //               parseISO(appraisalDetail.canceled?.completeDate),
  //               "MMMM dd, yyyy 'at' h:mm a",
  //             )}.`
  //           : '',
  //       },
  //     ];
  //   }
  //   return [
  //     {
  //       icon: null,
  //       label: 'Appraisal payment completed',
  //       description:
  //         'We have received your appraisal payment and are actively processing your request to ensure you receive an accurate and timely appraisal.',
  //       date: appraisalDetail?.paid_for?.completeDate
  //         ? `Completed on ${format(
  //             parseISO(appraisalDetail.paid_for?.completeDate),
  //             "MMMM dd, yyyy 'at' h:mm a",
  //           )}.`
  //         : '',
  //     },
  //     {
  //       icon: null,
  //       label: 'Appraisal has been ordered',
  //       description:
  //         'We are reaching out the point of contact for the property and schedule the inspection as soon as possible. On average, the appraisal takes 3-5 business days to complete.',
  //       date: appraisalDetail?.ordered?.completeDate
  //         ? `Ordered on ${format(
  //             parseISO(appraisalDetail.ordered?.completeDate),
  //             "MMMM dd, yyyy 'at' h:mm a",
  //           )}.`
  //         : '',
  //     },
  //     {
  //       icon: null,
  //       label: 'Inspection has been scheduled',
  //       description: `${
  //         appraisalDetail?.scheduled?.scheduledDate
  //           ? `The inspection has been scheduled for ${format(
  //               parseISO(appraisalDetail.scheduled?.scheduledDate),
  //               "MMMM dd, yyyy 'at' h:mm a",
  //             )}. `
  //           : ''
  //       }Following the inspection, the appraiser will proceed with the necessary assessments to finalize the appraisal report. We will notify you once the appraisal is complete.`,
  //       date: appraisalDetail?.scheduled?.completeDate
  //         ? `Updated on ${format(
  //             parseISO(appraisalDetail.scheduled?.completeDate),
  //             "MMMM dd, yyyy 'at' h:mm a",
  //           )}.`
  //         : '',
  //     },
  //     {
  //       icon: null,
  //       label: 'Appraisal is completed',
  //       description:
  //         'Your appraisal order has been completed! If you have any questions or need further clarification, feel free to contact our customer service team. Thank you for your patience!',
  //       date: appraisalDetail?.completed?.completeDate
  //         ? `Completed on ${format(
  //             parseISO(appraisalDetail.completed?.completeDate),
  //             "MMMM dd, yyyy 'at' h:mm a",
  //           )}.`
  //         : '',
  //     },
  //   ];
  // }, [
  //   appraisalDetail?.canceled,
  //   appraisalDetail?.completed?.completeDate,
  //   appraisalDetail?.ordered?.completeDate,
  //   appraisalDetail?.paid_for?.completeDate,
  //   appraisalDetail?.scheduled?.completeDate,
  //   appraisalDetail?.scheduled?.scheduledDate,
  //   appraisalStage,
  // ]);

  return (
    <Stack
      border={'1px solid #D2D6E1'}
      borderRadius={2}
      height={600}
      p={3}
      width={'100%'}
    >
      <Typography color={'text.primary'} variant={'h6'}>
        Loan status
      </Typography>
    </Stack>
  );
};
