import { FC, useMemo } from 'react';
import {
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { format, parseISO } from 'date-fns';
import CancelRoundedIcon from '@mui/icons-material/CancelRounded';

import { AppraisalStatusEnum } from '@/types';

import { StyledFormItem } from '@/components/atoms';

interface baseData {
  completeDate?: string;
}

interface AppraisalDetailsData {
  paid_for: baseData | null;
  ordered: baseData | null;
  scheduled: (baseData & { scheduledDate?: string }) | null;
  canceled: (baseData & { reason?: string }) | null;
  completed: baseData | null;
}

const hash = {
  [AppraisalStatusEnum.paid_for]: 0,
  [AppraisalStatusEnum.ordered]: 1,
  [AppraisalStatusEnum.scheduled]: 2,
  [AppraisalStatusEnum.completed]: 3,
  [AppraisalStatusEnum.canceled]: 0,
  [AppraisalStatusEnum.not_started]: 0,
};

type ReduceAppraisalStage = `${AppraisalStatusEnum}`;

export interface AppraisalStatusProps {
  appraisalStage: ReduceAppraisalStage;
  appraisalDetail: AppraisalDetailsData;
}

export const AppraisalStatus: FC<AppraisalStatusProps> = ({
  appraisalStage = AppraisalStatusEnum.canceled,
  appraisalDetail,
}) => {
  const computedData = useMemo(() => {
    if (
      appraisalStage === AppraisalStatusEnum.canceled ||
      appraisalDetail?.canceled
    ) {
      return [
        {
          icon: <CancelRoundedIcon sx={{ color: 'error.main' }} />,
          label: 'Appraisal has been canceled',
          description:
            'Please email us at borrow@youland.com or call (833) 968-5263 for refunds and any questions you have.',
          date: appraisalDetail?.canceled?.completeDate
            ? `Canceled on ${format(
                parseISO(appraisalDetail.canceled?.completeDate),
                "MMMM dd, yyyy 'at' h:mm a",
              )}.`
            : '',
        },
      ];
    }
    return [
      {
        icon: null,
        label: 'Appraisal payment completed',
        description:
          'We have received your appraisal payment and are actively processing your request to ensure you receive an accurate and timely appraisal.',
        date: appraisalDetail?.paid_for?.completeDate
          ? `Completed on ${format(
              parseISO(appraisalDetail.paid_for?.completeDate),
              "MMMM dd, yyyy 'at' h:mm a",
            )}.`
          : '',
      },
      {
        icon: null,
        label: 'Appraisal has been ordered',
        description:
          'We are reaching out the point of contact for the property and schedule the inspection as soon as possible. On average, the appraisal takes 3-5 business days to complete.',
        date: appraisalDetail?.ordered?.completeDate
          ? `Ordered on ${format(
              parseISO(appraisalDetail.ordered?.completeDate),
              "MMMM dd, yyyy 'at' h:mm a",
            )}.`
          : '',
      },
      {
        icon: null,
        label: 'Inspection has been scheduled',
        description: `${
          appraisalDetail?.scheduled?.scheduledDate
            ? `The inspection has been scheduled for ${format(
                parseISO(appraisalDetail.scheduled?.scheduledDate),
                "MMMM dd, yyyy 'at' h:mm a",
              )}. `
            : ''
        }Following the inspection, the appraiser will proceed with the necessary assessments to finalize the appraisal report. We will notify you once the appraisal is complete.`,
        date: appraisalDetail?.scheduled?.completeDate
          ? `Updated on ${format(
              parseISO(appraisalDetail.scheduled?.completeDate),
              "MMMM dd, yyyy 'at' h:mm a",
            )}.`
          : '',
      },
      {
        icon: null,
        label: 'Appraisal is completed',
        description:
          'Your appraisal order has been completed! If you have any questions or need further clarification, feel free to contact our customer service team. Thank you for your patience!',
        date: appraisalDetail?.completed?.completeDate
          ? `Completed on ${format(
              parseISO(appraisalDetail.completed?.completeDate),
              "MMMM dd, yyyy 'at' h:mm a",
            )}.`
          : '',
      },
    ];
  }, [
    appraisalDetail?.canceled,
    appraisalDetail?.completed?.completeDate,
    appraisalDetail?.ordered?.completeDate,
    appraisalDetail?.paid_for?.completeDate,
    appraisalDetail?.scheduled?.completeDate,
    appraisalDetail?.scheduled?.scheduledDate,
    appraisalStage,
  ]);

  return (
    <StyledFormItem
      label={'Property appraisal'}
      maxWidth={900}
      tip={'Keep track of your appraisal progress below'}
    >
      <Stepper
        activeStep={hash[appraisalStage]}
        connector={null}
        orientation={'vertical'}
        sx={{
          width: '100%',
        }}
      >
        {computedData.map((item, index) => (
          <Step
            completed={index <= hash[appraisalStage]}
            expanded={true}
            key={`${item.label}-${index}`}
          >
            <StepLabel icon={item.icon}>
              <Typography
                color={computedData.length === 1 ? 'error' : 'text.primary'}
                variant={'subtitle1'}
              >
                {item.label}
              </Typography>
            </StepLabel>
            <StepContent>
              <Stack gap={1} mb={4}>
                {hash[appraisalStage] === index && (
                  <Typography
                    color={computedData.length === 1 ? 'error' : 'text.primary'}
                    variant={'body3'}
                  >
                    {item.description}
                  </Typography>
                )}

                {item.date && hash[appraisalStage] >= index && (
                  <Typography
                    color={
                      computedData.length === 1 ? 'error' : 'text.secondary'
                    }
                    variant={'body3'}
                  >
                    {item.date}
                  </Typography>
                )}
              </Stack>
            </StepContent>
          </Step>
        ))}
      </Stepper>
    </StyledFormItem>
  );
};
