import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';

import { useBreakpoints } from '@/hooks';
import { RatesProductData } from '@/types';
import { UserType } from '@/types/enum';
import { POSFindLabel, POSFormatDollar, POSFormatPercent } from '@/utils';
import { OPTIONS_MORTGAGE_PROPERTY } from '@/constants';
import { GroundRefinanceLoanInfo } from '@/components/molecules/Application/Ground/Refinance';

import { StyledButton, StyledDrawer } from '@/components/atoms';

interface GroundRefinanceRatesDrawerProps {
  onCancel: () => void;
  selectedItem:
    | (GroundRefinanceLoanInfo &
        Pick<
          RatesProductData,
          'paymentOfMonth' | 'interestRateOfYear' | 'loanTerm' | 'id'
        >)
    | undefined;
  visible: boolean;
  nextStep?: (id: string) => void;
  userType: UserType;
  loading?: boolean;
}

export const GroundRefinanceRatesDrawer: FC<
  GroundRefinanceRatesDrawerProps
> = ({
  onCancel,
  visible,
  selectedItem,
  nextStep,
  userType,
  loading = false,
}) => {
  const router = useRouter();
  const breakpoints = useBreakpoints();

  const [line_1, setLine_1] = useState<string>();
  const [line_2, setLine_2] = useState<string>();
  useEffect(() => {
    if (selectedItem?.address) {
      const [LINE_1, LINE_2] = selectedItem.address.split('NEW_LINE');
      setLine_1(LINE_1);
      setLine_2(LINE_2);
    }
  }, [selectedItem?.address]);

  const renderByUserType = useMemo(() => {
    switch (userType) {
      case UserType.BROKER:
        return (
          <>
            <CardItem
              info={`${POSFormatDollar(
                selectedItem?.brokerOriginationFee,
              )}(${POSFormatPercent(
                (selectedItem?.brokerPoints as number) / 100,
              )})`}
              label={'Broker origination fee'}
            />
            <CardItem
              info={POSFormatDollar(selectedItem?.brokerProcessingFee)}
              label={'Broker processing fee'}
            />
          </>
        );
      case UserType.LENDER:
        return (
          <>
            <CardItem
              info={`${POSFormatDollar(
                selectedItem?.lenderOriginationFee,
              )}(${POSFormatPercent(
                (selectedItem?.lenderPoints as number) / 100,
              )})`}
              label={'Lender origination fee'}
            />
            <CardItem
              info={POSFormatDollar(selectedItem?.lenderProcessingFee)}
              label={'Lender processing fee'}
            />
          </>
        );
      case UserType.LOAN_OFFICER:
        return (
          <>
            <CardItem
              info={`${POSFormatDollar(
                selectedItem?.officerOriginationFee,
              )}(${POSFormatPercent(
                (selectedItem?.officerPoints as number) / 100,
              )})`}
              label={'Loan officer origination fee'}
            />
            <CardItem
              info={POSFormatDollar(selectedItem?.officerProcessingFee)}
              label={'Loan officer processing fee'}
            />
          </>
        );
      case UserType.REAL_ESTATE_AGENT:
        return (
          <>
            <CardItem
              info={POSFormatDollar(selectedItem?.agentFee)}
              label={'Referral fee'}
            />
          </>
        );
      default:
        return null;
    }
  }, [
    selectedItem?.agentFee,
    selectedItem?.brokerOriginationFee,
    selectedItem?.brokerPoints,
    selectedItem?.brokerProcessingFee,
    selectedItem?.lenderOriginationFee,
    selectedItem?.lenderPoints,
    selectedItem?.lenderProcessingFee,
    selectedItem?.officerOriginationFee,
    selectedItem?.officerPoints,
    selectedItem?.officerProcessingFee,
    userType,
  ]);

  return (
    <StyledDrawer
      anchor={'right'}
      content={
        <Stack gap={3} px={{ md: 6, xs: 1.5 }} py={3} width={'100%'}>
          <Typography
            variant={['xs', 'sm'].includes(breakpoints) ? 'subtitle2' : 'h5'}
          >
            Get a closer look at all your costs
          </Typography>

          <Stack gap={1.5} width={'100%'}>
            <Typography
              variant={['xs', 'sm'].includes(breakpoints) ? 'subtitle2' : 'h5'}
            >
              Purchase
            </Typography>

            <Stack
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              gap={1.5}
              p={1.5}
              width={'100%'}
            >
              <CardItem
                info={
                  <Typography variant={'inherit'}>
                    {`${selectedItem?.firstName} ${selectedItem?.lastName}`}
                  </Typography>
                }
                label={'Borrower'}
              />
              <CardItem
                info={
                  <Typography
                    component={'div'}
                    textAlign={'right'}
                    variant={'inherit'}
                  >
                    <Typography component={'div'} variant={'inherit'}>
                      {line_1}
                    </Typography>
                    <Typography component={'div'} variant={'inherit'}>
                      {line_2}
                    </Typography>
                  </Typography>
                }
                label={'Address'}
              />
              <CardItem
                info={POSFormatDollar(selectedItem?.totalLoanAmount)}
                label={'Total loan amount'}
              />
              <CardItem
                info={POSFormatDollar(selectedItem?.homeValue)}
                label={'As-is property value'}
              />
              <CardItem
                info={POSFormatDollar(selectedItem?.balance)}
                label={'Payoff amount'}
              />
              <CardItem
                info={POSFormatDollar(selectedItem?.cashOutAmount)}
                label={'Cash out amount'}
              />
              <CardItem
                info={
                  selectedItem?.cor ? POSFormatDollar(selectedItem?.cor) : 'N/A'
                }
                label={'Rehab loan amount'}
              />
            </Stack>
          </Stack>

          <Stack gap={1.5} width={'100%'}>
            <Typography
              variant={['xs', 'sm'].includes(breakpoints) ? 'subtitle2' : 'h5'}
            >
              Loan details
            </Typography>

            <Stack
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              gap={1.5}
              p={1.5}
              width={'100%'}
            >
              <CardItem
                info={selectedItem?.amortization}
                label={'Amortization'}
              />
              <CardItem
                info={POSFindLabel(
                  OPTIONS_MORTGAGE_PROPERTY,
                  selectedItem?.propertyType as string,
                )}
                label={'Property type'}
              />
              <CardItem
                info={selectedItem?.closeDate}
                label={'Preferred close date'}
              />
              <CardItem info={selectedItem?.lien} label={'Lien'} />
              <CardItem
                info={
                  selectedItem?.arv ? POSFormatDollar(selectedItem?.arv) : 'N/A'
                }
                label={'Estimated ARV'}
              />
              <CardItem
                info={POSFormatPercent(selectedItem?.ltv)}
                label={'Loan-to-value(LTV)'}
              />
              <CardItem
                info={POSFormatPercent(selectedItem?.ltc)}
                label={'Loan-to-cost(LTC)'}
              />
            </Stack>
          </Stack>

          <Stack gap={1.5} width={'100%'}>
            <Typography
              variant={['xs', 'sm'].includes(breakpoints) ? 'subtitle2' : 'h5'}
            >
              Rate
            </Typography>

            <Stack
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              gap={1.5}
              p={1.5}
              width={'100%'}
            >
              <CardItem
                info={POSFormatPercent(selectedItem?.interestRateOfYear)}
                label={'Interest rate'}
              />
              <CardItem
                info={`${selectedItem?.loanTerm} months`}
                label={'Loan term'}
              />
              <CardItem
                info={POSFormatDollar(selectedItem?.paymentOfMonth)}
                label={'Monthly payment'}
              />
            </Stack>
          </Stack>

          <Stack gap={1.5} width={'100%'}>
            <Typography
              component={'div'}
              display={'flex'}
              justifyContent={'space-between'}
              variant={['xs', 'sm'].includes(breakpoints) ? 'subtitle2' : 'h5'}
            >
              Est. cash required at closing
              <Typography
                component={'span'}
                variant={
                  ['xs', 'sm'].includes(breakpoints) ? 'subtitle2' : 'h5'
                }
              >
                {POSFormatDollar(selectedItem?.totalClosingCash as number)}
              </Typography>
            </Typography>

            <Stack
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              gap={1.5}
              p={1.5}
              width={'100%'}
            >
              <CardItem
                info={`${POSFormatDollar(
                  selectedItem?.originationFee,
                )}(${POSFormatPercent(
                  selectedItem?.originationFeePer || 0.015,
                )})`}
                label={'Lender origination fee'}
              />
              <CardItem
                info={POSFormatDollar(selectedItem?.underwritingFee)}
                label={'Underwriting fee'}
              />
              <CardItem
                info={POSFormatDollar(selectedItem?.docPreparationFee)}
                label={'Document preparation fee'}
              />
              <CardItem
                info={POSFormatDollar(selectedItem?.proRatedInterest as number)}
                label={'Pro-rated interest'}
              />
              <CardItem
                info={selectedItem?.thirdPartyCosts}
                label={'Third-party costs'}
              />
              {renderByUserType}
            </Stack>
          </Stack>
        </Stack>
      }
      footer={
        <Stack width={'100%'}>
          {nextStep ? (
            <StyledButton
              disabled={loading}
              loading={loading}
              loadingText={'Checking...'}
              onClick={() => nextStep(selectedItem?.id as string)}
              size={['xs', 'sm'].includes(breakpoints) ? 'small' : 'large'}
            >
              Check my pre-approval
            </StyledButton>
          ) : (
            <StyledButton
              onClick={() =>
                router.push({
                  pathname: '/dashboard/tasks',
                  query: { processId: router.query.processId },
                })
              }
              size={['xs', 'sm'].includes(breakpoints) ? 'small' : 'large'}
            >
              Confirm rate
            </StyledButton>
          )}
        </Stack>
      }
      header={
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          justifyContent={'space-between'}
          width={'100%'}
        >
          <Typography
            variant={['xs', 'sm'].includes(breakpoints) ? 'h4' : 'h5'}
          >
            Rate summary
          </Typography>
          <StyledButton isIconButton onClick={onCancel}>
            <CloseOutlined />
          </StyledButton>
        </Stack>
      }
      maxWidth={560}
      minWidth={327}
      open={visible}
      width={{ md: 560, xs: '30%' }}
    />
  );
};

const CardItem: FC<{ label: string; info: ReactNode }> = ({ label, info }) => {
  const breakpoints = useBreakpoints();

  return (
    <Stack
      alignItems={'flex-start'}
      flexDirection={'row'}
      justifyContent={'space-between'}
      width={'100%'}
    >
      <Typography
        component={'div'}
        variant={['xs', 'sm'].includes(breakpoints) ? 'body3' : 'body1'}
      >
        {label}
      </Typography>
      <Typography
        component={'div'}
        fontWeight={600}
        variant={['xs', 'sm'].includes(breakpoints) ? 'body3' : 'subtitle1'}
      >
        {info}
      </Typography>
    </Stack>
  );
};
