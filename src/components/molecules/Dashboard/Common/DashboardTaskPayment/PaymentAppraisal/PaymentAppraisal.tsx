import { FC, useMemo, useState } from 'react';
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

import { AppraisalStage } from '@/types';

import { StyledButton, StyledFormItem } from '@/components/atoms';

interface baseData {
  completeDate?: string;
}

interface AppraisalDetails {
  paid_for: baseData | null;
  ordered: baseData | null;
  scheduled: (baseData & { scheduledDate?: string }) | null;
  canceled: (baseData & { reason?: string }) | null;
  completed: baseData | null;
}

const hash = {
  [AppraisalStage.PaidFor]: 0,
  [AppraisalStage.Ordered]: 1,
  [AppraisalStage.Scheduled]: 2,
  [AppraisalStage.Completed]: 3,
  [AppraisalStage.Canceled]: 0,
  [AppraisalStage.NotStarted]: 0,
};

type ReduceAppraisalStage = `${AppraisalStage}`;

export interface PaymentAppraisalProps {
  appraisalStage: ReduceAppraisalStage;
  appraisalDetails: AppraisalDetails;
}

export const PaymentAppraisal: FC<PaymentAppraisalProps> = ({
  appraisalStage = AppraisalStage.Canceled,
  appraisalDetails,
}) => {
  const [activeStep, setActiveStep] = useState(hash[appraisalStage]);

  const computedData = useMemo(() => {
    if (
      appraisalStage === AppraisalStage.Canceled ||
      appraisalDetails?.canceled
    ) {
      return [
        {
          icon: <CancelRoundedIcon sx={{ color: 'error.main' }} />,
          label: 'Appraisal has been canceled',
          description:
            'Please email us at borrow@youland.com or call (833) 968-5263 for refunds and any questions you have.',
          date: appraisalDetails?.canceled?.completeDate
            ? `Canceled on ${format(
                parseISO(appraisalDetails.canceled?.completeDate),
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
        date: appraisalDetails?.paid_for?.completeDate
          ? `Completed on ${format(
              parseISO(appraisalDetails.paid_for?.completeDate),
              "MMMM dd, yyyy 'at' h:mm a",
            )}.`
          : '',
      },
      {
        icon: null,
        label: 'Appraisal has been ordered',
        description:
          'We are reaching out the point of contact for the property and schedule the inspection as soon as possible. On average, the appraisal takes 3-5 business days to complete.',
        date: appraisalDetails?.ordered?.completeDate
          ? `Ordered on ${format(
              parseISO(appraisalDetails.ordered?.completeDate),
              "MMMM dd, yyyy 'at' h:mm a",
            )}.`
          : '',
      },
      {
        icon: null,
        label: 'Inspection has been scheduled',
        description: `${
          appraisalDetails?.scheduled?.scheduledDate
            ? `The inspection has been scheduled for ${format(
                parseISO(appraisalDetails.scheduled?.scheduledDate),
                "MMMM dd, yyyy 'at' h:mm a",
              )}. `
            : ''
        }Following the inspection, the appraiser will proceed with the necessary assessments to finalize the appraisal report. We will notify you once the appraisal is complete.`,
        date: appraisalDetails?.scheduled?.completeDate
          ? `Updated on ${format(
              parseISO(appraisalDetails.scheduled?.completeDate),
              "MMMM dd, yyyy 'at' h:mm a",
            )}.`
          : '',
      },
      {
        icon: null,
        label: 'Appraisal is completed',
        description:
          'Your appraisal order has been completed! If you have any questions or need further clarification, feel free to contact our customer service team. Thank you for your patience!',
        date: appraisalDetails?.completed?.completeDate
          ? `Completed on ${format(
              parseISO(appraisalDetails.completed?.completeDate),
              "MMMM dd, yyyy 'at' h:mm a",
            )}.`
          : '',
      },
    ];
  }, [
    appraisalDetails?.canceled,
    appraisalDetails?.completed?.completeDate,
    appraisalDetails?.ordered?.completeDate,
    appraisalDetails?.paid_for?.completeDate,
    appraisalDetails?.scheduled?.completeDate,
    appraisalDetails?.scheduled?.scheduledDate,
    appraisalStage,
  ]);

  return (
    <StyledFormItem
      label={'Property appraisal'}
      maxWidth={900}
      tip={'Keep track of your appraisal progress below'}
    >
      <Stepper
        activeStep={activeStep}
        connector={null}
        orientation={'vertical'}
        sx={{
          width: '100%',
        }}
      >
        {computedData.map((item, index) => (
          <Step
            completed={index <= activeStep}
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
                {activeStep === index && (
                  <Typography
                    color={computedData.length === 1 ? 'error' : 'text.primary'}
                    variant={'body3'}
                  >
                    {item.description}
                  </Typography>
                )}

                {item.date && activeStep >= index && (
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

      <Stack flexDirection={'row'} gap={3}>
        <StyledButton onClick={() => setActiveStep(activeStep + 1)}>
          increase
        </StyledButton>
        <StyledButton onClick={() => setActiveStep(activeStep - 1)}>
          decrease
        </StyledButton>
      </Stack>
    </StyledFormItem>
  );
};
