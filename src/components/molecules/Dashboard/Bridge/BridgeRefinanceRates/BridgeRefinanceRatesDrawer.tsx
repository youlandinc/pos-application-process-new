import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Stack, Typography } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';

import { useBreakpoints } from '@/hooks';
import { BridgeRefinanceLoanInfo } from '@/components/molecules/Application';
import { RatesProductData } from '@/types';
import { UserType } from '@/types/enum';
import { POSFindLabel, POSFormatDollar, POSFormatPercent } from '@/utils';
import { OPTIONS_MORTGAGE_PROPERTY } from '@/constants';

import { StyledButton, StyledDrawer } from '@/components/atoms';

interface BridgeRefinanceRatesDrawerProps {
  onCancel: () => void;
  selectedItem:
    | (BridgeRefinanceLoanInfo &
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

export const BridgeRefinanceRatesDrawer: FC<
  BridgeRefinanceRatesDrawerProps
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
            <BridgeRefinanceCardItem
              info={`${POSFormatDollar(
                selectedItem?.brokerOriginationFee,
              )}(${POSFormatPercent(
                (selectedItem?.brokerPoints as number) / 100,
              )})`}
              label={'Broker Origination Fee'}
            />
            <BridgeRefinanceCardItem
              info={POSFormatDollar(selectedItem?.brokerProcessingFee)}
              label={'Broker Processing Fee'}
            />
          </>
        );
      case UserType.LENDER:
        return (
          <>
            <BridgeRefinanceCardItem
              info={`${POSFormatDollar(
                selectedItem?.lenderOriginationFee,
              )}(${POSFormatPercent(
                (selectedItem?.lenderPoints as number) / 100,
              )})`}
              label={'Lender Origination Fee'}
            />
            <BridgeRefinanceCardItem
              info={POSFormatDollar(selectedItem?.lenderProcessingFee)}
              label={'Lender Processing Fee'}
            />
          </>
        );
      case UserType.LOAN_OFFICER:
        return (
          <>
            <BridgeRefinanceCardItem
              info={`${POSFormatDollar(
                selectedItem?.officerOriginationFee,
              )}(${POSFormatPercent(
                (selectedItem?.officerPoints as number) / 100,
              )})`}
              label={'Loan Officer Origination Fee'}
            />
            <BridgeRefinanceCardItem
              info={POSFormatDollar(selectedItem?.officerProcessingFee)}
              label={'Loan Officer Processing Fee'}
            />
          </>
        );
      case UserType.REAL_ESTATE_AGENT:
        return (
          <>
            <BridgeRefinanceCardItem
              info={POSFormatDollar(selectedItem?.agentFee)}
              label={'Referral Fee'}
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
              <BridgeRefinanceCardItem
                info={
                  <Typography variant={'inherit'}>
                    {`${selectedItem?.firstName} ${selectedItem?.lastName}`}
                  </Typography>
                }
                label={'Borrower'}
              />
              <BridgeRefinanceCardItem
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
              <BridgeRefinanceCardItem
                info={POSFormatDollar(selectedItem?.totalLoanAmount)}
                label={'Total Loan Amount'}
              />
              <BridgeRefinanceCardItem
                info={POSFormatDollar(selectedItem?.homeValue)}
                label={'As-is Property Value'}
              />
              <BridgeRefinanceCardItem
                info={POSFormatDollar(selectedItem?.balance)}
                label={'Payoff Amount'}
              />
              <BridgeRefinanceCardItem
                info={POSFormatDollar(selectedItem?.cashOutAmount)}
                label={'Cash Out Amount'}
              />
            </Stack>
          </Stack>

          <Stack gap={1.5} width={'100%'}>
            <Typography
              variant={['xs', 'sm'].includes(breakpoints) ? 'subtitle2' : 'h5'}
            >
              Loan Details
            </Typography>

            <Stack
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              gap={1.5}
              p={1.5}
              width={'100%'}
            >
              <BridgeRefinanceCardItem
                info={selectedItem?.amortization}
                label={'Amortization'}
              />
              <BridgeRefinanceCardItem
                info={POSFindLabel(
                  OPTIONS_MORTGAGE_PROPERTY,
                  selectedItem?.propertyType as string,
                )}
                label={'Property Type'}
              />
              <BridgeRefinanceCardItem
                info={selectedItem?.closeDate}
                label={'Preferred Close Date'}
              />
              <BridgeRefinanceCardItem
                info={selectedItem?.lien}
                label={'Lien'}
              />
              <BridgeRefinanceCardItem
                info={POSFormatPercent(selectedItem?.ltv)}
                label={'Loan-to-Value(LTV)'}
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
              <BridgeRefinanceCardItem
                info={POSFormatPercent(selectedItem?.interestRateOfYear)}
                label={'Interest Rate'}
              />
              <BridgeRefinanceCardItem
                info={`${selectedItem?.loanTerm} months`}
                label={'Loan Term'}
              />
              <BridgeRefinanceCardItem
                info={POSFormatDollar(selectedItem?.paymentOfMonth)}
                label={'Monthly Payment'}
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
              Est. Cash Required at Closing
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
              <BridgeRefinanceCardItem
                info={`${POSFormatDollar(
                  selectedItem?.originationFee,
                )}(${POSFormatPercent(
                  selectedItem?.originationFeePer || 0.015,
                )})`}
                label={'Lender Origination Fee'}
              />
              <BridgeRefinanceCardItem
                info={POSFormatDollar(selectedItem?.underwritingFee)}
                label={'Underwriting Fee'}
              />
              <BridgeRefinanceCardItem
                info={POSFormatDollar(selectedItem?.docPreparationFee)}
                label={'Document Preparation Fee'}
              />
              <BridgeRefinanceCardItem
                info={POSFormatDollar(selectedItem?.proRatedInterest as number)}
                label={'Pro-rated Interest'}
              />
              <BridgeRefinanceCardItem
                info={selectedItem?.thirdPartyCosts}
                label={'Third-party Costs'}
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
              Check My Pre-approval
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
              Confirm Rate
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
            Rate Summary
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

const BridgeRefinanceCardItem: FC<{ label: string; info: ReactNode }> = ({
  label,
  info,
}) => {
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
