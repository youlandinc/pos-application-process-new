import { FC, ReactNode, useEffect, useMemo, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';

import { useBreakpoints, useSessionStorageState } from '@/hooks';
import { BridgeRefinanceLoanInfo } from '@/components/molecules/Application';
import { RatesProductData, ServiceTypeEnum } from '@/types';
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
          | 'paymentOfMonth'
          | 'interestRateOfYear'
          | 'loanTerm'
          | 'id'
          | 'selected'
        >)
    | undefined;
  visible: boolean;
  nextStep?: (id: string) => void;
  userType: UserType;
  loading?: boolean;
  close: () => void;
  isCurrent?: boolean;
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
  isCurrent = false,
  close,
}) => {
  const { saasState } = useSessionStorageState('tenantConfig');

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
    if (saasState?.serviceTypeEnum === ServiceTypeEnum.WHITE_LABEL) {
      return (
        <>
          <BridgeRefinanceCardItem
            info={`${POSFormatDollar(
              selectedItem?.brokerOriginationFee,
            )}(${POSFormatPercent(
              (selectedItem?.brokerPoints as number) / 100,
            )})`}
            label={'Broker origination fee'}
          />
          <BridgeRefinanceCardItem
            info={POSFormatDollar(selectedItem?.brokerProcessingFee)}
            label={'Broker processing fee'}
          />
        </>
      );
    }
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
              label={'Broker origination fee'}
            />
            <BridgeRefinanceCardItem
              info={POSFormatDollar(selectedItem?.brokerProcessingFee)}
              label={'Broker processing fee'}
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
              label={'Lender origination fee'}
            />
            <BridgeRefinanceCardItem
              info={POSFormatDollar(selectedItem?.lenderProcessingFee)}
              label={'Lender processing fee'}
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
              label={'Loan officer origination fee'}
            />
            <BridgeRefinanceCardItem
              info={POSFormatDollar(selectedItem?.officerProcessingFee)}
              label={'Loan officer processing fee'}
            />
          </>
        );
      case UserType.REAL_ESTATE_AGENT:
        return (
          <>
            <BridgeRefinanceCardItem
              info={POSFormatDollar(selectedItem?.agentFee)}
              label={'Referral fee'}
            />
          </>
        );
      default:
        return null;
    }
  }, [
    saasState?.serviceTypeEnum,
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
                label={'Total loan amount'}
              />
              <BridgeRefinanceCardItem
                info={POSFormatDollar(selectedItem?.homeValue)}
                label={'As-is property value'}
              />
              <BridgeRefinanceCardItem
                info={POSFormatDollar(selectedItem?.balance)}
                label={'Payoff amount'}
              />
              <BridgeRefinanceCardItem
                info={POSFormatDollar(selectedItem?.cashOutAmount)}
                label={'Cash out amount'}
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
              <BridgeRefinanceCardItem
                info={selectedItem?.amortization}
                label={'Amortization'}
              />
              <BridgeRefinanceCardItem
                info={POSFindLabel(
                  OPTIONS_MORTGAGE_PROPERTY,
                  selectedItem?.propertyType as string,
                )}
                label={'Property type'}
              />
              <BridgeRefinanceCardItem
                info={selectedItem?.closeDate}
                label={'Preferred closing date'}
              />
              <BridgeRefinanceCardItem
                info={selectedItem?.lien}
                label={'Lien'}
              />
              <BridgeRefinanceCardItem
                info={POSFormatPercent(selectedItem?.ltv)}
                label={'Loan-to-value(LTV)'}
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
                label={'Interest rate'}
              />
              <BridgeRefinanceCardItem
                info={`${selectedItem?.loanTerm} months`}
                label={'Loan duration'}
              />
              <BridgeRefinanceCardItem
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
              <BridgeRefinanceCardItem
                info={`${POSFormatDollar(
                  selectedItem?.originationFee,
                )}(${POSFormatPercent(selectedItem?.originationFeePer)})`}
                label={'Lender origination fee'}
              />
              <BridgeRefinanceCardItem
                info={POSFormatDollar(selectedItem?.underwritingFee)}
                label={'Underwriting fee'}
              />
              <BridgeRefinanceCardItem
                info={POSFormatDollar(selectedItem?.docPreparationFee)}
                label={'Document preparation fee'}
              />
              <BridgeRefinanceCardItem
                info={POSFormatDollar(selectedItem?.proRatedInterest as number)}
                label={'Pro-rated interest'}
              />
              <BridgeRefinanceCardItem
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
              disabled={loading}
              loading={loading}
              onClick={onCancel}
              size={['xs', 'sm'].includes(breakpoints) ? 'small' : 'large'}
            >
              {isCurrent || selectedItem?.selected ? 'Back' : 'Confirm rate'}
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
            variant={['xs', 'sm'].includes(breakpoints) ? 'h6' : 'h5'}
          >
            View loan details
          </Typography>
          <StyledButton isIconButton onClick={close}>
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

const BridgeRefinanceCardItem: FC<{
  label: string;
  info: ReactNode;
}> = ({ label, info }) => {
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
