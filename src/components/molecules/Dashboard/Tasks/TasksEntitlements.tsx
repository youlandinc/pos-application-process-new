import { FC, useMemo, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { useBreakpoints } from '@/hooks';
import { POSGetParamsFromUrl } from '@/utils';
import { AUTO_HIDE_DURATION, OPTIONS_COMMON_YES_OR_NO } from '@/constants';

import {
  StyledButton,
  StyledButtonGroup,
  StyledFormItem,
  StyledLoading,
  StyledTextField,
  Transitions,
} from '@/components/atoms';
import { TasksRightMenu } from '@/components/molecules';

import {
  _fetchLoanTaskDetail,
  _updateLoanTaskDetail,
} from '@/requests/dashboard';
import { DashboardTaskKey, HttpError, LoanAnswerEnum } from '@/types';

export const TasksEntitlements: FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const breakpoints = useBreakpoints();

  const [saveLoading, setSaveLoading] = useState(false);

  const [zoningStandards, setZoningStandards] = useState<LoanAnswerEnum>(
    LoanAnswerEnum.default,
  );
  const [zsAddressAndProjectDes, setZsAddressAndProjectDes] =
    useState<string>('');
  const [isSplitTheLot, setIsSplitTheLot] = useState<LoanAnswerEnum>(
    LoanAnswerEnum.default,
  );
  const [isAllowedLotSplits, setIsAllowedLotSplits] = useState<LoanAnswerEnum>(
    LoanAnswerEnum.default,
  );
  const [lotSplitsPlansProposed, setLotSplitsPlansProposed] =
    useState<LoanAnswerEnum>(LoanAnswerEnum.default);
  const [lsppAddressAndProjectDes, setLsppAddressAndProjectDes] =
    useState<string>('');
  const [sitSpecificPlansProject, setSitSpecificPlansProject] =
    useState<LoanAnswerEnum>(LoanAnswerEnum.default);
  const [isProvideSimilarPlans, setIsProvideSimilarPlans] =
    useState<LoanAnswerEnum>(LoanAnswerEnum.default);

  const { loading } = useAsync(async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    try {
      const {
        data: { data },
      } = await _fetchLoanTaskDetail({
        loanId,
        taskKey: DashboardTaskKey.entitlements,
      });
      const {
        zoningStandards,
        zsAddressAndProjectDes,
        isSplitTheLot,
        isAllowedLotSplits,
        lotSplitsPlansProposed,
        lsppAddressAndProjectDes,
        sitSpecificPlansProject,
        isProvideSimilarPlans,
      } = data;
      setZoningStandards(zoningStandards || LoanAnswerEnum.default);
      setZsAddressAndProjectDes(zsAddressAndProjectDes || '');
      setIsAllowedLotSplits(isAllowedLotSplits || LoanAnswerEnum.default);
      setIsSplitTheLot(isSplitTheLot || LoanAnswerEnum.default);
      setLotSplitsPlansProposed(
        lotSplitsPlansProposed || LoanAnswerEnum.default,
      );
      setLsppAddressAndProjectDes(lsppAddressAndProjectDes || '');
      setSitSpecificPlansProject(
        sitSpecificPlansProject || LoanAnswerEnum.default,
      );
      setIsProvideSimilarPlans(isProvideSimilarPlans || LoanAnswerEnum.default);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  }, []);

  const isFormDataValid = useMemo(() => {
    const condition1 =
      zoningStandards !== LoanAnswerEnum.no || !!zsAddressAndProjectDes;
    const condition2 =
      isSplitTheLot !== LoanAnswerEnum.yes ||
      isAllowedLotSplits !== LoanAnswerEnum.yes ||
      lotSplitsPlansProposed !== LoanAnswerEnum.no ||
      !!lsppAddressAndProjectDes;
    const condition3 = !!sitSpecificPlansProject || !!isProvideSimilarPlans;
    return condition1 && condition2 && condition3;
  }, [
    isAllowedLotSplits,
    isProvideSimilarPlans,
    isSplitTheLot,
    lotSplitsPlansProposed,
    lsppAddressAndProjectDes,
    sitSpecificPlansProject,
    zoningStandards,
    zsAddressAndProjectDes,
  ]);

  const handleSave = async () => {
    const postData = {
      loanId: POSGetParamsFromUrl(location.href).loanId,
      taskKey: DashboardTaskKey.entitlements,
      data: {
        zoningStandards,
        zsAddressAndProjectDes,
        isSplitTheLot,
        isAllowedLotSplits,
        lotSplitsPlansProposed,
        lsppAddressAndProjectDes,
        sitSpecificPlansProject,
        isProvideSimilarPlans,
      },
    };
    setSaveLoading(true);
    try {
      await _updateLoanTaskDetail(postData);
      await router.push({
        pathname: '/dashboard/tasks',
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
      setSaveLoading(false);
    }
  };

  return loading ? (
    <Stack
      alignItems={'center'}
      justifyContent={'center'}
      margin={'auto 0'}
      minHeight={'calc(667px - 46px)'}
      width={'100%'}
    >
      <StyledLoading sx={{ color: 'text.grey' }} />
    </Stack>
  ) : (
    <Fade in={!loading}>
      <Stack flexDirection={'row'} justifyContent={'center'} width={'100%'}>
        <Stack
          alignItems={'center'}
          gap={6}
          justifyContent={'flex-start'}
          maxWidth={648}
          mx={{ lg: 'auto', xs: 0 }}
          px={{ lg: 3, xs: 0 }}
          width={'100%'}
        >
          <Typography
            color={'text.primary'}
            fontSize={{ xs: 20, lg: 24 }}
            textAlign={'center'}
            variant={'h5'}
          >
            Entitlements
          </Typography>

          {/*first*/}
          <StyledFormItem
            gap={3}
            label={
              'Is your planned property allowed by current zoning standards?'
            }
            sub
          >
            <StyledButtonGroup
              onChange={(_, value) => {
                if (value === null) {
                  return;
                }
                setZoningStandards(value);
              }}
              options={OPTIONS_COMMON_YES_OR_NO}
              value={zoningStandards}
            />

            <Transitions
              style={{
                maxWidth: 900,
                width: '100%',
                display:
                  zoningStandards === LoanAnswerEnum.no ? 'block' : 'none',
              }}
            >
              {zoningStandards === LoanAnswerEnum.no && (
                <Stack gap={3}>
                  <Typography color={'text.secondary'}>
                    Please provide addresses and project descriptions for
                    projects in the subject&apos;s municipality where you have
                    obtained approvals for a similar zoning variance.
                  </Typography>
                  <StyledTextField
                    label={'Addresses and project descriptions'}
                    onChange={(e) => setZsAddressAndProjectDes(e.target.value)}
                    placeholder={'Addresses and project descriptions'}
                    value={zsAddressAndProjectDes}
                  />
                </Stack>
              )}
            </Transitions>
          </StyledFormItem>

          {/*second*/}
          <StyledFormItem gap={3} label={'Will you split the lot?'} sub>
            <StyledButtonGroup
              onChange={(_, value) => {
                if (value === null) {
                  return;
                }
                setIsSplitTheLot(value);
              }}
              options={OPTIONS_COMMON_YES_OR_NO}
              value={isSplitTheLot}
            />
          </StyledFormItem>

          <Transitions
            style={{
              maxWidth: 900,
              width: '100%',
              display: isSplitTheLot === LoanAnswerEnum.yes ? 'block' : 'none',
            }}
          >
            {isSplitTheLot === LoanAnswerEnum.yes && (
              <StyledFormItem
                gap={3}
                label={
                  'Are lot splits allowed by zoning ordinances or "by right" in your municipality?'
                }
                sub
              >
                <StyledButtonGroup
                  onChange={(_, value) => {
                    if (value === null) {
                      return;
                    }
                    setIsAllowedLotSplits(value);
                  }}
                  options={OPTIONS_COMMON_YES_OR_NO}
                  value={isAllowedLotSplits}
                />
              </StyledFormItem>
            )}
            {isSplitTheLot === LoanAnswerEnum.yes &&
              isAllowedLotSplits === LoanAnswerEnum.yes && (
                <StyledFormItem
                  gap={3}
                  label={
                    'Have your plans to lot split been proposed to the relevant municipality?'
                  }
                  mt={3}
                  sub
                >
                  <StyledButtonGroup
                    onChange={(_, value) => {
                      if (value === null) {
                        return;
                      }
                      setLotSplitsPlansProposed(value);
                    }}
                    options={OPTIONS_COMMON_YES_OR_NO}
                    value={lotSplitsPlansProposed}
                  />
                  <Transitions
                    style={{
                      maxWidth: 900,
                      width: '100%',
                      display:
                        lotSplitsPlansProposed === LoanAnswerEnum.no
                          ? 'block'
                          : 'none',
                    }}
                  >
                    <Stack gap={3}>
                      <Typography color={'text.secondary'}>
                        Please provide addresses and project descriptions for
                        projects in the subject&apos;s municipality where you
                        have obtained approvals for a lot split.
                      </Typography>
                      <StyledTextField
                        label={'Addresses and project descriptions'}
                        onChange={(e) =>
                          setLsppAddressAndProjectDes(e.target.value)
                        }
                        placeholder={'Addresses and project descriptions'}
                        value={lsppAddressAndProjectDes}
                      />
                    </Stack>
                  </Transitions>
                </StyledFormItem>
              )}
          </Transitions>

          {/*last*/}
          <StyledFormItem
            gap={3}
            label={'Do you have site specific plans for this project?'}
            sub
          >
            <StyledButtonGroup
              onChange={(_, value) => {
                if (value === null) {
                  return;
                }
                setSitSpecificPlansProject(value);
              }}
              options={OPTIONS_COMMON_YES_OR_NO}
              value={sitSpecificPlansProject}
            />
          </StyledFormItem>

          <Transitions
            style={{
              maxWidth: 900,
              width: '100%',
              display:
                sitSpecificPlansProject === LoanAnswerEnum.no
                  ? 'block'
                  : 'none',
            }}
          >
            {sitSpecificPlansProject === LoanAnswerEnum.no && (
              <StyledFormItem
                gap={3}
                label={
                  'Do you have a previous set of plans you can provide that would be similar to your plans for this project?'
                }
                sub
              >
                <StyledButtonGroup
                  onChange={(_, value) => {
                    if (value === null) {
                      return;
                    }
                    setIsProvideSimilarPlans(value);
                  }}
                  options={OPTIONS_COMMON_YES_OR_NO}
                  value={isProvideSimilarPlans}
                />
              </StyledFormItem>
            )}
          </Transitions>

          <Stack
            flexDirection={{ xs: 'unset', md: 'row' }}
            gap={3}
            maxWidth={600}
            width={'100%'}
          >
            <StyledButton
              color={'info'}
              onClick={async () => {
                await router.push({
                  pathname: '/dashboard/tasks',
                  query: { loanId: router.query.loanId },
                });
              }}
              sx={{ flex: 1, width: '100%' }}
              variant={'text'}
            >
              Back
            </StyledButton>
            <StyledButton
              color={'primary'}
              disabled={saveLoading || !isFormDataValid}
              loading={saveLoading}
              onClick={handleSave}
              sx={{ flex: 1, width: '100%' }}
            >
              Save
            </StyledButton>
          </Stack>
        </Stack>
        {['xl', 'xxl'].includes(breakpoints) && <TasksRightMenu />}
      </Stack>
    </Fade>
  );
};
