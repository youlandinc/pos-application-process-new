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
import { CancelRounded } from '@mui/icons-material';

import { StyledFormItem } from '@/components/atoms';

import { AppraisalStatusEnum } from '@/types';
import { useSessionStorageState } from '@/hooks';
import { POSFormatUSPhoneToText } from '@/utils';

interface baseData {
  completeDate?: string;
}

interface AppraisalDetailsData {
  [AppraisalStatusEnum.paid_for]: baseData | null;
  [AppraisalStatusEnum.ordered]: baseData | null;
  [AppraisalStatusEnum.scheduled]:
    | (baseData & { scheduledDate?: string })
    | null;
  [AppraisalStatusEnum.canceled]: (baseData & { reason?: string }) | null;
  [AppraisalStatusEnum.completed]: baseData | null;
}

type ReduceAppraisalStage = `${AppraisalStatusEnum}`;

export interface AppraisalStatusProps {
  appraisalStage: ReduceAppraisalStage;
  appraisalDetail: AppraisalDetailsData;
}

const hash = {
  [AppraisalStatusEnum.paid_for]: 0,
  [AppraisalStatusEnum.ordered]: 1,
  [AppraisalStatusEnum.scheduled]: 2,
  [AppraisalStatusEnum.completed]: 3,
  [AppraisalStatusEnum.canceled]: 0,
  [AppraisalStatusEnum.not_started]: 0,
};

export const AppraisalStatus: FC<AppraisalStatusProps> = ({
  appraisalStage = AppraisalStatusEnum.canceled,
  appraisalDetail,
}) => {
  const { saasState } = useSessionStorageState('tenantConfig');

  console.log(saasState?.phone, saasState?.email);

  const computedData = useMemo(
    () => {
      if (
        appraisalStage === AppraisalStatusEnum.canceled ||
        appraisalDetail?.[AppraisalStatusEnum.canceled]
      ) {
        return [
          {
            icon: <CancelRounded sx={{ color: 'error.main' }} />,
            label: 'Appraisal has been canceled',
            description: (
              <>
                Please email us at {saasState?.email || 'borrow@youland.com'}
                {saasState?.phone &&
                  ` or call ${POSFormatUSPhoneToText(saasState?.phone)}`}{' '}
                for refunds and any questions you have.
              </>
            ),
            date: appraisalDetail?.[AppraisalStatusEnum.canceled]?.completeDate
              ? `Canceled on ${format(
                  parseISO(
                    appraisalDetail?.[AppraisalStatusEnum.canceled]
                      ?.completeDate,
                  ),
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
          date: appraisalDetail?.[AppraisalStatusEnum.paid_for]?.completeDate
            ? `Completed on ${format(
                parseISO(
                  appraisalDetail?.[AppraisalStatusEnum.paid_for]?.completeDate,
                ),
                "MMMM dd, yyyy 'at' h:mm a",
              )}.`
            : '',
        },
        {
          icon: null,
          label: 'Appraisal has been ordered',
          description:
            'We are reaching out the point of contact for the property and schedule the inspection as soon as possible. On average, the appraisal takes 3-5 business days to complete.',
          date: appraisalDetail?.[AppraisalStatusEnum.ordered]?.completeDate
            ? `Ordered on ${format(
                parseISO(
                  appraisalDetail?.[AppraisalStatusEnum.ordered]?.completeDate,
                ),
                "MMMM dd, yyyy 'at' h:mm a",
              )}.`
            : '',
        },
        {
          icon: null,
          label: 'Inspection has been scheduled',
          description: `${
            appraisalDetail?.[AppraisalStatusEnum.scheduled]?.scheduledDate
              ? `The inspection has been scheduled for ${format(
                  parseISO(
                    appraisalDetail?.[AppraisalStatusEnum.scheduled]
                      ?.scheduledDate,
                  ),
                  "MMMM dd, yyyy 'at' h:mm a",
                )}. `
              : ''
          }Following the inspection, the appraiser will proceed with the necessary assessments to finalize the appraisal report. We will notify you once the appraisal is complete.`,
          date: appraisalDetail?.[AppraisalStatusEnum.scheduled]?.completeDate
            ? `Updated on ${format(
                parseISO(
                  appraisalDetail?.[AppraisalStatusEnum.scheduled]
                    ?.completeDate,
                ),
                "MMMM dd, yyyy 'at' h:mm a",
              )}.`
            : '',
        },
        {
          icon: null,
          label: 'Appraisal is completed',
          description:
            'Your appraisal order has been completed! If you have any questions or need further clarification, feel free to contact our customer service team. Thank you for your patience!',
          date: appraisalDetail?.[AppraisalStatusEnum.completed]?.completeDate
            ? `Completed on ${format(
                parseISO(
                  appraisalDetail?.[AppraisalStatusEnum.completed]
                    ?.completeDate,
                ),
                "MMMM dd, yyyy 'at' h:mm a",
              )}.`
            : '',
        },
      ];
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      saasState?.email,
      saasState?.phone,
      appraisalDetail?.CANCELED,
      appraisalDetail?.COMPLETED?.completeDate,
      appraisalDetail?.ORDERED?.completeDate,
      appraisalDetail?.PAID_FOR?.completeDate,
      appraisalDetail?.SCHEDULED?.completeDate,
      appraisalDetail?.SCHEDULED?.scheduledDate,
      appraisalStage,
    ],
  );

  return (
    <StyledFormItem
      label={'Property appraisal'}
      maxWidth={900}
      tip={'Keep track of your appraisal progress below'}
      tipSx={{
        textAlign: 'left',
      }}
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
                color={
                  computedData.length === 1
                    ? 'error'
                    : index <= hash[appraisalStage]
                      ? 'text.primary'
                      : 'text.secondary'
                }
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
