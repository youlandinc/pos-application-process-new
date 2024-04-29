import { FC, useEffect, useRef, useState } from 'react';
import { Box, Collapse, Stack, Typography } from '@mui/material';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

import { observer } from 'mobx-react-lite';

import { POSFormatDollar, POSFormatPercent } from '@/utils';
import { useGoogleStreetViewAndMap } from '@/hooks';

import { StyledButton, StyledFormItem } from '@/components/atoms';

export const LoanSummary: FC<FormNodeBaseProps> = observer(
  ({ nextStep, nextState, backState, backStep }) => {
    const [collapsed, setCollapsed] = useState<boolean>(false);
    const [lng, setLng] = useState<number>(-74.0072955);
    const [lat, setLat] = useState<number>(40.7094756);

    const mapRef = useRef<HTMLDivElement>(null);
    const panoramaRef = useRef<HTMLDivElement>(null);

    const { relocate, reset: resetMap } = useGoogleStreetViewAndMap(
      lat,
      lng,
      mapRef,
      panoramaRef,
    );

    useEffect(
      () => {
        if (lng || lat) {
          return;
        }
        relocate(lat, lng);
        return () => {
          resetMap();
        };
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [lat, lng, relocate],
    );

    useEffect(() => {
      relocate(lat, lng);
      return () => {
        resetMap();
      };
    }, [lat, lng, relocate, resetMap]);

    return (
      <StyledFormItem
        gap={3}
        label={'View your loan terms'}
        labelSx={{ textAlign: { xs: 'column', lg: 'left' } }}
        maxWidth={'auto'}
      >
        <Stack
          flexDirection={{ xs: 'column', lg: 'row' }}
          gap={{ xs: 3, xl: 6 }}
          width={'100%'}
        >
          <Stack flex={1} gap={3}>
            <Stack
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              gap={3}
              p={3}
              width={'100%'}
            >
              <LoanSummaryCardRow
                content={POSFormatDollar(1000000)}
                isHeader={true}
                title={'Total loan amount'}
              />
              <LoanSummaryCardRow
                content={POSFormatDollar(1000000)}
                title={'As-is property value'}
              />
              <LoanSummaryCardRow
                content={POSFormatDollar(1000000)}
                title={'Payoff amount'}
              />
              <LoanSummaryCardRow
                content={POSFormatDollar(1000000)}
                title={'Cash out amount'}
              />
            </Stack>

            <Stack
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              gap={3}
              p={3}
              width={'100%'}
            >
              <LoanSummaryCardRow
                content={POSFormatPercent(0.01)}
                isHeader={true}
                title={'Interest rate'}
              />
              <LoanSummaryCardRow content={`${18} months`} title={'Term'} />
            </Stack>

            <Stack
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              p={3}
              width={'100%'}
            >
              <LoanSummaryCardRow
                content={POSFormatDollar(1000000)}
                isHeader={true}
                title={'Monthly payment'}
              />
            </Stack>

            <Stack
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              gap={3}
              p={3}
              width={'100%'}
            >
              <LoanSummaryCardRow
                content={POSFormatDollar(1000000)}
                isHeader={true}
                title={'Total loan amount'}
              />
              <LoanSummaryCardRow
                content={`${POSFormatDollar(1000000)} (${POSFormatPercent(
                  0.01,
                )})`}
                title={'Lender origination fee'}
              />
              <LoanSummaryCardRow
                content={POSFormatDollar(1000000)}
                title={'Document preparation fee'}
              />
              <LoanSummaryCardRow
                content={POSFormatDollar(1000000)}
                title={'Third-party costs'}
              />
              <LoanSummaryCardRow
                content={POSFormatDollar(1000000)}
                title={'Underwriting fee'}
              />
              <LoanSummaryCardRow
                content={'Contact closing agent'}
                title={'Pro-rated interest'}
              />
            </Stack>

            <Stack
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              onClick={(e) => {
                e.preventDefault();
                if (!collapsed) {
                  setCollapsed(true);
                }
              }}
              px={3}
              sx={{
                cursor: collapsed ? 'unset' : 'pointer',
              }}
              width={'100%'}
            >
              <Stack
                alignItems={'center'}
                flexDirection={'row'}
                gap={3}
                justifyContent={'space-between'}
                onClick={(e) => {
                  e.preventDefault();
                  setCollapsed(!collapsed);
                }}
                py={3}
                sx={{ cursor: 'pointer' }}
                width={'100%'}
              >
                <Typography color={'primary'} variant={'h7'}>
                  Additional details
                </Typography>
                <KeyboardArrowUpIcon
                  color={'primary'}
                  sx={{
                    transform: collapsed ? 'rotate(0deg)' : 'rotate(180deg)',
                    transition: 'transform .3s',
                  }}
                />
              </Stack>

              <Collapse in={collapsed}>
                <Stack gap={3} mb={3}>
                  <LoanSummaryCardRow
                    content={'None'}
                    title={'Prepayment penalty'}
                  />
                  <LoanSummaryCardRow content={'1st'} title={'Lien'} />
                  <LoanSummaryCardRow
                    content={'Fixed interest'}
                    title={'Loan type'}
                  />
                  <LoanSummaryCardRow content={'Purchase'} title={'Purpose'} />
                  <LoanSummaryCardRow
                    content={'Single Family'}
                    title={'Property type'}
                  />
                  <LoanSummaryCardRow
                    content={'Non-owner occupied'}
                    title={'Occupancy'}
                  />
                </Stack>
              </Collapse>
            </Stack>
          </Stack>

          <Stack flex={1} gap={3}>
            <Stack
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              gap={3}
              p={3}
              width={'100%'}
            >
              <Box
                borderRadius={1}
                display={'none'}
                height={240}
                id={'map2'}
                ref={panoramaRef}
                width={'100%'}
              />
              <Box
                borderRadius={1}
                height={240}
                id={'map'}
                ref={mapRef}
                width={'100%'}
              />
              <Stack gap={1}>
                <Typography color={'success.main'} variant={'subtitle1'}>
                  Address
                </Typography>
                <Typography color={'primary.darker'} variant={'h5'}>
                  159 Alfalfa Avenue, Twenty nine Palms, CA 92277
                </Typography>
              </Stack>
              <StyledButton color={'info'} variant={'outlined'}>
                View pre-approval letter
              </StyledButton>
              {/*<StyledButton color={'info'} variant={'outlined'}>*/}
              {/*  View loan summary*/}
              {/*</StyledButton>*/}
            </Stack>
            <Stack
              border={'1px solid #D2D6E1'}
              borderRadius={2}
              gap={3}
              p={3}
              width={'100%'}
            >
              <LoanSummaryCardRow
                content={POSFormatDollar(1000000)}
                isHeader={true}
                title={'Total broker compensation'}
              />
              <LoanSummaryCardRow
                content={`${POSFormatDollar(1000000)} (${POSFormatPercent(
                  0.01,
                )})`}
                title={'Broker origination fee'}
              />
              <LoanSummaryCardRow
                content={POSFormatDollar(1000000)}
                title={'Broker processing fee'}
              />
            </Stack>
            <Typography color={'text.secondary'} variant={'body2'}>
              <b>Disclaimer: </b>The estimates above are subject to change and
              do not include 3rd party settlement fees required to close your
              loan.
            </Typography>
          </Stack>
        </Stack>

        <Stack
          flexDirection={'row'}
          gap={3}
          maxWidth={600}
          mt={10}
          width={'100%'}
        >
          <StyledButton
            color={'info'}
            disabled={backState}
            loading={backState}
            onClick={backStep}
            sx={{ width: 'calc(50% - 12px)' }}
            variant={'text'}
          >
            Back
          </StyledButton>
          <StyledButton
            color={'primary'}
            disabled={nextState}
            loading={nextState}
            onClick={nextStep}
            sx={{ width: 'calc(50% - 12px)' }}
          >
            Submit application
          </StyledButton>
        </Stack>
      </StyledFormItem>
    );
  },
);

const LoanSummaryCardRow: FC<{
  title: string;
  content: string;
  isHeader?: boolean;
}> = ({ title, content, isHeader = false }) => {
  return (
    <Stack
      alignItems={'center'}
      flexDirection={'row'}
      justifyContent={'space-between'}
      width={'100%'}
    >
      <Typography
        color={isHeader ? 'primary' : 'text.secondary'}
        variant={isHeader ? 'h7' : 'body1'}
      >
        {title}
      </Typography>
      <Typography
        color={isHeader ? 'primary' : 'text.primary'}
        variant={isHeader ? 'h7' : 'subtitle1'}
      >
        {content}
      </Typography>
    </Stack>
  );
};
