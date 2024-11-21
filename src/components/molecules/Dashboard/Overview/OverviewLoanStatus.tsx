import { FC, useMemo, useState } from 'react';
import {
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  Typography,
} from '@mui/material';
import { CancelRounded } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { format, parseISO } from 'date-fns';

import { AUTO_HIDE_DURATION } from '@/constants';
import { useBreakpoints } from '@/hooks';

import { StyledButton, StyledTooltip } from '@/components/atoms';

import {
  DashboardOverviewResponse,
  HttpError,
  LoanSnapshotEnum,
  PipelineLoanStageEnum,
} from '@/types';
import { _resubmitLoan } from '@/requests/dashboard';

const hash = {
  [PipelineLoanStageEnum.scenario]: 0,
  [PipelineLoanStageEnum.initial_approval]: 1,
  [PipelineLoanStageEnum.pre_approved]: 1,
  [PipelineLoanStageEnum.preparing_docs]: 2,
  [PipelineLoanStageEnum.docs_out]: 3,
  [PipelineLoanStageEnum.funded]: 4,
  [PipelineLoanStageEnum.rejected]: 0,
  [PipelineLoanStageEnum.inactive]: 0,
  [PipelineLoanStageEnum.not_submitted]: -1,
};

export type OverviewLoanStatusProps = {
  loanStatus: DashboardOverviewResponse['data']['loanStatus'];
  loanStatusDetails: DashboardOverviewResponse['data']['loanStatusDetails'] & {
    tooltipTitle?: string;
  };
};

export const OverviewLoanStatus: FC<OverviewLoanStatusProps> = ({
  loanStatus = PipelineLoanStageEnum.scenario,
  loanStatusDetails,
}) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const breakpoints = useBreakpoints();

  const [resubmitLoading, setResubmitLoading] = useState(false);

  const computedData = useMemo(
    () => {
      switch (loanStatus) {
        case PipelineLoanStageEnum.rejected:
          return [
            {
              icon: <CancelRounded sx={{ color: 'error.main' }} />,
              label: 'Loan rejected',
              description: (
                <Stack>
                  {loanStatusDetails?.[PipelineLoanStageEnum.rejected]
                    ?.reason && (
                    <Typography color={'inherit'} variant={'body3'}>
                      <b style={{ fontWeight: 600 }}>Reason: </b>
                      {loanStatusDetails?.[PipelineLoanStageEnum.rejected]
                        ?.reason || '123'}
                    </Typography>
                  )}
                  <Typography color={'inherit'} variant={'body3'}>
                    Please contact your loan officer for any questions you have.
                  </Typography>
                </Stack>
              ),
              date: loanStatusDetails?.[PipelineLoanStageEnum.rejected]?.date
                ? `${format(
                    parseISO(
                      loanStatusDetails?.[PipelineLoanStageEnum.rejected]?.date,
                    ),
                    "MMMM dd, yyyy 'at' h:mm a",
                  )}`
                : '',
            },
          ];
        case PipelineLoanStageEnum.inactive:
          return [
            {
              icon: <CancelRounded sx={{ color: 'error.main' }} />,
              label: 'Loan is now inactive',
              description:
                'Please click the button below to resubmit this loan.',
              date: loanStatusDetails?.[PipelineLoanStageEnum.inactive]?.date
                ? `${format(
                    parseISO(
                      loanStatusDetails?.[PipelineLoanStageEnum.inactive]?.date,
                    ),
                    "MMMM dd, yyyy 'at' h:mm a",
                  )}`
                : '',
            },
          ];
        case PipelineLoanStageEnum.scenario:
        case PipelineLoanStageEnum.initial_approval:
        case PipelineLoanStageEnum.pre_approved:
        case PipelineLoanStageEnum.preparing_docs:
        case PipelineLoanStageEnum.docs_out:
        case PipelineLoanStageEnum.funded:
          return [
            {
              icon: null,
              label: 'Application submitted',
              description:
                "We're currently reviewing your file to check for eligibility. You'll hear from us soon!",
              date: loanStatusDetails?.[PipelineLoanStageEnum.scenario]?.date
                ? `${format(
                    parseISO(
                      loanStatusDetails?.[PipelineLoanStageEnum.scenario]?.date,
                    ),
                    "MMMM dd, yyyy 'at' h:mm a",
                  )}`
                : '',
            },
            {
              icon: null,
              label: 'Preliminary underwriting passed',
              tooltipTitle:
                "When you have passed preliminary underwriting, you'll be well on your way to full approval. Once you provide the remaining documentation (like an appraisal), we'll review it to ensure it meets our underwriting criteria. If everything checks out, you'll be fully approved.",
              description:
                'We have determined we can move forward with this loan. Please pay for the appraisal, upload documents and complete the necessary tasks.',
              date: loanStatusDetails?.[PipelineLoanStageEnum.initial_approval]
                ?.date
                ? `${format(
                    parseISO(
                      loanStatusDetails?.[
                        PipelineLoanStageEnum.initial_approval
                      ]?.date,
                    ),
                    "MMMM dd, yyyy 'at' h:mm a",
                  )}`
                : '',
            },
            {
              icon: null,
              label: 'Final approval',
              tooltipTitle:
                'Once you reach the final approval stage, you’ll be close to completing your loan process with us! At that point, your team will have reviewed all your documents and officially approved your loan. ',
              description:
                'We have completed the approval process for this loan and are now preparing the documents.These will be sent out as soon as possible.',
              date: loanStatusDetails?.[PipelineLoanStageEnum.preparing_docs]
                ?.date
                ? `${format(
                    parseISO(
                      loanStatusDetails?.[PipelineLoanStageEnum.preparing_docs]
                        ?.date,
                    ),
                    "MMMM dd, yyyy 'at' h:mm a",
                  )}`
                : '',
            },
            {
              icon: null,
              label: 'Docs out',
              tooltipTitle:
                'The documents for this loan will have been sent out to the settlement agent. They will reach out to you for the signing appointment.',
              description:
                'The documents for this loan have been sent out to the settlement agent.',
              date: loanStatusDetails?.[PipelineLoanStageEnum.docs_out]?.date
                ? `${format(
                    parseISO(
                      loanStatusDetails?.[PipelineLoanStageEnum.docs_out]?.date,
                    ),
                    "MMMM dd, yyyy 'at' h:mm a",
                  )}`
                : '',
            },
            {
              icon: null,
              label: 'Loan funded',
              tooltipTitle:
                'Your loan will have closed and you will have received the funding. Congratulations!',
              description:
                'Congratulations! This loan has been closed and funded.',
              date: loanStatusDetails?.[PipelineLoanStageEnum.funded]?.date
                ? `${format(
                    parseISO(
                      loanStatusDetails?.[PipelineLoanStageEnum.funded]?.date,
                    ),
                    "MMMM dd, yyyy 'at' h:mm a",
                  )}`
                : '',
            },
          ];
        default:
          return [];
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      loanStatus,
      loanStatusDetails?.[PipelineLoanStageEnum.docs_out],
      loanStatusDetails?.[PipelineLoanStageEnum.funded],
      loanStatusDetails?.[PipelineLoanStageEnum.inactive],
      loanStatusDetails?.[PipelineLoanStageEnum.initial_approval],
      loanStatusDetails?.[PipelineLoanStageEnum.pre_approved],
      loanStatusDetails?.[PipelineLoanStageEnum.preparing_docs],
      loanStatusDetails?.[PipelineLoanStageEnum.rejected],
      loanStatusDetails?.[PipelineLoanStageEnum.scenario],
    ],
  );

  const [activeIndex, setActiveIndex] = useState(-1);

  return (
    <Stack borderRadius={2} gap={1.5} width={'100%'}>
      <Typography fontSize={{ xs: 16, md: 20 }}>Loan status</Typography>

      <Stepper
        activeStep={hash[loanStatus]}
        connector={null}
        orientation={'vertical'}
        sx={{ width: '100%' }}
      >
        {computedData.map((item, index) => (
          <Step
            completed={index <= hash[loanStatus]}
            expanded={true}
            key={`${item.label}-${index}`}
            onMouseEnter={() => {
              setActiveIndex(index);
            }}
            onMouseLeave={() => {
              setActiveIndex(-1);
            }}
          >
            <StepLabel
              icon={
                !item.icon ? (
                  index <= hash[loanStatus] ? (
                    item.icon
                  ) : (
                    <StyledTooltip placement={'left'} title={item.tooltipTitle}>
                      <Stack
                        alignItems={'center'}
                        bgcolor={
                          index <= hash[loanStatus]
                            ? 'primary.main'
                            : 'rgba(0, 0, 0, 0.38)'
                        }
                        borderRadius={'50%'}
                        color={'#ffffff'}
                        fontSize={12}
                        height={24}
                        justifyContent={'center'}
                        width={24}
                      >
                        {index + 1}
                      </Stack>
                    </StyledTooltip>
                  )
                ) : (
                  item.icon
                )
              }
            >
              <Stack
                flexDirection={'row'}
                justifyContent={'space-between'}
                ml={0.5}
              >
                <Typography
                  color={
                    computedData.length === 1
                      ? 'error'
                      : index <= hash[loanStatus]
                        ? 'text.primary'
                        : 'text.secondary'
                  }
                  fontSize={{ xs: 14, lg: 16 }}
                  variant={'subtitle1'}
                >
                  {item.label}
                </Typography>
                {!['xs', 'sm', 'md', 'lg'].includes(breakpoints) && (
                  <Typography
                    bgcolor={
                      loanStatus === PipelineLoanStageEnum.rejected
                        ? 'error.background'
                        : loanStatus === PipelineLoanStageEnum.inactive
                          ? 'rgba(239, 239, 239, 1)'
                          : index <= hash[loanStatus]
                            ? 'success.background'
                            : 'transparent'
                    }
                    border={
                      index <= hash[loanStatus]
                        ? '1px solid transparent'
                        : '1px solid #BABCBE'
                    }
                    borderRadius={5}
                    color={
                      loanStatus === PipelineLoanStageEnum.rejected
                        ? 'error.main'
                        : loanStatus === PipelineLoanStageEnum.inactive
                          ? '#9F9F9F'
                          : index <= hash[loanStatus]
                            ? 'success.main'
                            : 'text.disabled'
                    }
                    height={22}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    variant={'subtitle3'}
                    width={120}
                  >
                    {loanStatus === PipelineLoanStageEnum.rejected
                      ? 'Rejected'
                      : loanStatus === PipelineLoanStageEnum.inactive
                        ? 'Inactive'
                        : index <= hash[loanStatus]
                          ? 'Completed'
                          : 'Pending'}
                  </Typography>
                )}
              </Stack>
            </StepLabel>
            <StepContent>
              <Stack
                flexDirection={{ xs: 'column', xl: 'row' }}
                gap={{ xs: 1.5, xl: 3 }}
                mb={1.5}
                minHeight={24}
                ml={0.5}
              >
                {hash[loanStatus] === index && (
                  <Typography
                    color={'text.secondary'}
                    variant={'body2'}
                    width={{ xs: '100%', xl: '50%' }}
                  >
                    {item.description}
                  </Typography>
                )}

                {['xs', 'sm', 'md', 'lg'].includes(breakpoints) && (
                  <Typography
                    bgcolor={
                      loanStatus === PipelineLoanStageEnum.rejected
                        ? 'error.background'
                        : loanStatus === PipelineLoanStageEnum.inactive
                          ? 'rgba(239, 239, 239, 1)'
                          : index <= hash[loanStatus]
                            ? 'success.background'
                            : 'transparent'
                    }
                    border={
                      index <= hash[loanStatus]
                        ? '1px solid transparent'
                        : '1px solid #BABCBE'
                    }
                    borderRadius={5}
                    color={
                      loanStatus === PipelineLoanStageEnum.rejected
                        ? 'error.main'
                        : loanStatus === PipelineLoanStageEnum.inactive
                          ? '#9F9F9F'
                          : index <= hash[loanStatus]
                            ? 'success.main'
                            : 'text.disabled'
                    }
                    height={22}
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}
                    variant={'subtitle3'}
                    width={120}
                  >
                    {loanStatus === PipelineLoanStageEnum.rejected
                      ? 'Rejected'
                      : loanStatus === PipelineLoanStageEnum.inactive
                        ? 'Inactive'
                        : index <= hash[loanStatus]
                          ? 'Completed'
                          : 'Pending'}
                  </Typography>
                )}

                {item.date &&
                  hash[loanStatus] >= index &&
                  (['xs', 'sm', 'md', 'lg'].includes(breakpoints) ||
                    activeIndex === index) && (
                    <Typography
                      color={'text.secondary'}
                      ml={{ xs: 'unset', xl: 'auto' }}
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
      {loanStatus === PipelineLoanStageEnum.inactive && (
        <StyledButton
          disabled={resubmitLoading}
          loading={resubmitLoading}
          onClick={async () => {
            setResubmitLoading(true);
            try {
              await _resubmitLoan({
                loanId: router.query.loanId as string,
                nextSnapshot: LoanSnapshotEnum.loan_summary,
              });
              await router.push({
                pathname: '/loan-summary',
                query: { loanId: router.query.loanId },
              });
            } catch (err) {
              const { header, message, variant } = err as HttpError;
              enqueueSnackbar(message, {
                variant: variant || 'error',
                autoHideDuration: AUTO_HIDE_DURATION,
                isSimple: !header,
                header,
              });
            } finally {
              setResubmitLoading(false);
            }
          }}
          size={'small'}
          sx={{ width: 120, ml: 3.75 }}
        >
          Resubmit
        </StyledButton>
      )}
    </Stack>
  );
};
