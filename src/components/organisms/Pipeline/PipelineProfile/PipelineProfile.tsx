import { FC, useCallback, useMemo, useState } from 'react';
import { Icon, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useBreakpoints, useSessionStorageState } from '@/hooks';
import { HttpError, PipelineAccountStatus, UserType } from '@/types';

import { StyledButton, StyledFormItem, StyledStatus } from '@/components/atoms';

import READY_FOR_REVIEW from '@/svg/pipeline/readey_for_review.svg';
import { _submitPipelineTask } from '@/requests';
import { AUTO_HIDE_DURATION } from '@/constants';
import { useSnackbar } from 'notistack';

export const PipelineProfile: FC = observer(() => {
  const router = useRouter();
  const { saasState } = useSessionStorageState('tenantConfig');
  const { enqueueSnackbar } = useSnackbar();

  const {
    pipelineTask: { formData, allowSubmit },
    userType,
    userSetting: {
      pipelineStatus,
      pipelineAdditionDetails,
      fetchPipelineStatus,
    },
  } = useMst();

  const breakpoint = useBreakpoints();

  const [submitLoading, setSubmitLoading] = useState<boolean>(false);

  const handleEnterSubTask = useCallback(
    async (url: string) => {
      await router.push(url);
    },
    [router],
  );

  const {
    W9_FORM,
    ACH_INFORMATION,
    BROKER_QUESTIONNAIRE,
    BROKER_AGREEMENT,
    BROKER_LICENSE,
    BROKER_GOVERNMENT_ID,
    LENDER_QUESTIONNAIRE,
    LENDER_AGREEMENT,
    LENDER_LICENSE,
    //LENDER_GOVERNMENT_ID,
    LOAN_OFFICER_AGREEMENT,
    REAL_ESTATE_AGENT_AGREEMENT,
    LOAN_OFFICER_ACH_INFORMATION,
    REAL_ESTATE_AGENT_ACH_INFORMATION,
  } = formData || {};

  const renderTaskList = useMemo(() => {
    switch (userType) {
      case UserType.BROKER:
        return (
          <>
            <Stack
              alignItems={'center'}
              className={'task_item'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              onClick={() => handleEnterSubTask('/pipeline/task/license')}
            >
              <Typography className={'task_label'} variant={'h6'}>
                {BROKER_LICENSE.taskName}{' '}
                <Typography
                  component={'span'}
                  sx={{ color: 'info.dark', fontSize: 'inherit' }}
                  variant={'h6'}
                >
                  (optional)
                </Typography>
              </Typography>
              <StyledStatus status={BROKER_LICENSE.taskStatus} />
            </Stack>

            <Stack
              alignItems={'center'}
              className={'task_item'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              onClick={() => handleEnterSubTask('/pipeline/task/agreement')}
            >
              <Typography className={'task_label'} variant={'h6'}>
                {BROKER_AGREEMENT.taskName}
              </Typography>
              <StyledStatus status={BROKER_AGREEMENT.taskStatus} />
            </Stack>

            <Stack
              alignItems={'center'}
              className={'task_item'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              onClick={() => handleEnterSubTask('/pipeline/task/government')}
            >
              <Typography className={'task_label'} variant={'h6'}>
                {BROKER_GOVERNMENT_ID.taskName}
              </Typography>
              <StyledStatus status={BROKER_GOVERNMENT_ID.taskStatus} />
            </Stack>

            <Stack
              alignItems={'center'}
              className={'task_item'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              onClick={() => handleEnterSubTask('/pipeline/task/w9')}
            >
              <Typography className={'task_label'} variant={'h6'}>
                {W9_FORM.taskName}
              </Typography>
              <StyledStatus status={W9_FORM.taskStatus} />
            </Stack>

            <Stack
              alignItems={'center'}
              className={'task_item'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              onClick={() => handleEnterSubTask('/pipeline/task/questionnaire')}
            >
              <Typography
                className={'task_label'}
                component={'div'}
                variant={'h6'}
              >
                {BROKER_QUESTIONNAIRE.taskName}{' '}
                <Typography
                  component={'span'}
                  sx={{ color: 'info.dark', fontSize: 'inherit' }}
                  variant={'h6'}
                >
                  (optional)
                </Typography>
              </Typography>
              <StyledStatus status={BROKER_QUESTIONNAIRE.taskStatus} />
            </Stack>
            <Stack
              alignItems={'center'}
              className={'task_item'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              onClick={() => handleEnterSubTask('/pipeline/task/ach')}
            >
              <Typography className={'task_label'} variant={'h6'}>
                {ACH_INFORMATION.taskName}
              </Typography>
              <StyledStatus status={ACH_INFORMATION.taskStatus} />
            </Stack>
          </>
        );
      case UserType.LENDER:
        return (
          <>
            <Stack
              alignItems={'center'}
              className={'task_item'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              onClick={() => handleEnterSubTask('/pipeline/task/license')}
            >
              <Typography className={'task_label'} variant={'h6'}>
                {LENDER_LICENSE.taskName}{' '}
                <Typography
                  component={'span'}
                  sx={{ color: 'info.dark', fontSize: 'inherit' }}
                  variant={'h6'}
                >
                  (optional)
                </Typography>
              </Typography>
              <StyledStatus status={LENDER_LICENSE.taskStatus} />
            </Stack>

            <Stack
              alignItems={'center'}
              className={'task_item'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              onClick={() => handleEnterSubTask('/pipeline/task/agreement')}
            >
              <Typography className={'task_label'} variant={'h6'}>
                {LENDER_AGREEMENT.taskName}{' '}
                <Typography
                  component={'span'}
                  sx={{ color: 'info.dark', fontSize: 'inherit' }}
                  variant={'h6'}
                >
                  (optional)
                </Typography>
              </Typography>
              <StyledStatus status={LENDER_AGREEMENT.taskStatus} />
            </Stack>

            {/*<Stack*/}
            {/*  alignItems={'center'}*/}
            {/*  className={'task_item'}*/}
            {/*  flexDirection={'row'}*/}
            {/*  justifyContent={'space-between'}*/}
            {/*  onClick={() => handleEnterSubTask('/pipeline/task/government')}*/}
            {/*>*/}
            {/*  <Typography className={'task_label'} variant={'h6'}>*/}
            {/*    {LENDER_GOVERNMENT_ID.taskName}{' '}*/}
            {/*    <Typography*/}
            {/*      component={'span'}*/}
            {/*      sx={{ color: 'info.dark', fontSize: 'inherit' }}*/}
            {/*      variant={'h6'}*/}
            {/*    >*/}
            {/*      (optional)*/}
            {/*    </Typography>*/}
            {/*  </Typography>*/}
            {/*  <StyledStatus status={LENDER_GOVERNMENT_ID.taskStatus} />*/}
            {/*</Stack>*/}

            <Stack
              alignItems={'center'}
              className={'task_item'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              onClick={() => handleEnterSubTask('/pipeline/task/w9')}
            >
              <Typography className={'task_label'} variant={'h6'}>
                {W9_FORM.taskName}{' '}
                <Typography
                  component={'span'}
                  sx={{ color: 'info.dark', fontSize: 'inherit' }}
                  variant={'h6'}
                >
                  (optional)
                </Typography>
              </Typography>
              <StyledStatus status={W9_FORM.taskStatus} />
            </Stack>

            <Stack
              alignItems={'center'}
              className={'task_item'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              onClick={() => handleEnterSubTask('/pipeline/task/questionnaire')}
            >
              <Typography
                className={'task_label'}
                component={'div'}
                variant={'h6'}
              >
                {LENDER_QUESTIONNAIRE.taskName}{' '}
                <Typography
                  component={'span'}
                  sx={{ color: 'info.dark', fontSize: 'inherit' }}
                  variant={'h6'}
                >
                  (optional)
                </Typography>
              </Typography>
              <StyledStatus status={LENDER_QUESTIONNAIRE.taskStatus} />
            </Stack>
            <Stack
              alignItems={'center'}
              className={'task_item'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              onClick={() => handleEnterSubTask('/pipeline/task/ach')}
            >
              <Typography className={'task_label'} variant={'h6'}>
                {ACH_INFORMATION.taskName}{' '}
                <Typography
                  component={'span'}
                  sx={{ color: 'info.dark', fontSize: 'inherit' }}
                  variant={'h6'}
                >
                  (optional)
                </Typography>
              </Typography>
              <StyledStatus status={ACH_INFORMATION.taskStatus} />
            </Stack>
          </>
        );
      case UserType.LOAN_OFFICER:
        return (
          <>
            <Stack
              alignItems={'center'}
              className={'task_item'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              onClick={() => handleEnterSubTask('/pipeline/task/agreement')}
            >
              <Typography className={'task_label'} variant={'h6'}>
                {LOAN_OFFICER_AGREEMENT.taskName}
              </Typography>
              <StyledStatus status={LOAN_OFFICER_AGREEMENT.taskStatus} />
            </Stack>
            <Stack
              alignItems={'center'}
              className={'task_item'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              onClick={() => handleEnterSubTask('/pipeline/task/w9')}
            >
              <Typography className={'task_label'} variant={'h6'}>
                {W9_FORM.taskName}
              </Typography>
              <StyledStatus status={W9_FORM.taskStatus} />
            </Stack>
            <Stack
              alignItems={'center'}
              className={'task_item'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              onClick={() => handleEnterSubTask('/pipeline/task/ach')}
            >
              <Typography className={'task_label'} variant={'h6'}>
                {LOAN_OFFICER_ACH_INFORMATION.taskName}
              </Typography>
              <StyledStatus status={LOAN_OFFICER_ACH_INFORMATION.taskStatus} />
            </Stack>
          </>
        );
      case UserType.REAL_ESTATE_AGENT:
        return (
          <>
            <Stack
              alignItems={'center'}
              className={'task_item'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              onClick={() => handleEnterSubTask('/pipeline/task/agreement')}
            >
              <Typography className={'task_label'} variant={'h6'}>
                {REAL_ESTATE_AGENT_AGREEMENT.taskName}
              </Typography>
              <StyledStatus status={REAL_ESTATE_AGENT_AGREEMENT.taskStatus} />
            </Stack>
            <Stack
              alignItems={'center'}
              className={'task_item'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              onClick={() => handleEnterSubTask('/pipeline/task/w9')}
            >
              <Typography className={'task_label'} variant={'h6'}>
                {W9_FORM.taskName}
              </Typography>
              <StyledStatus status={W9_FORM.taskStatus} />
            </Stack>
            <Stack
              alignItems={'center'}
              className={'task_item'}
              flexDirection={'row'}
              justifyContent={'space-between'}
              onClick={() => handleEnterSubTask('/pipeline/task/ach')}
            >
              <Typography className={'task_label'} variant={'h6'}>
                {REAL_ESTATE_AGENT_ACH_INFORMATION.taskName}
              </Typography>
              <StyledStatus
                status={REAL_ESTATE_AGENT_ACH_INFORMATION.taskStatus}
              />
            </Stack>
          </>
        );
    }
    return null;
  }, [
    ACH_INFORMATION.taskName,
    ACH_INFORMATION.taskStatus,
    BROKER_AGREEMENT.taskName,
    BROKER_AGREEMENT.taskStatus,
    BROKER_GOVERNMENT_ID.taskName,
    BROKER_GOVERNMENT_ID.taskStatus,
    BROKER_LICENSE.taskName,
    BROKER_LICENSE.taskStatus,
    BROKER_QUESTIONNAIRE.taskName,
    BROKER_QUESTIONNAIRE.taskStatus,
    LENDER_AGREEMENT.taskName,
    LENDER_AGREEMENT.taskStatus,
    LENDER_LICENSE.taskName,
    LENDER_LICENSE.taskStatus,
    LENDER_QUESTIONNAIRE.taskName,
    LENDER_QUESTIONNAIRE.taskStatus,
    LOAN_OFFICER_ACH_INFORMATION.taskName,
    LOAN_OFFICER_ACH_INFORMATION.taskStatus,
    LOAN_OFFICER_AGREEMENT.taskName,
    LOAN_OFFICER_AGREEMENT.taskStatus,
    REAL_ESTATE_AGENT_ACH_INFORMATION.taskName,
    REAL_ESTATE_AGENT_ACH_INFORMATION.taskStatus,
    REAL_ESTATE_AGENT_AGREEMENT.taskName,
    REAL_ESTATE_AGENT_AGREEMENT.taskStatus,
    W9_FORM.taskName,
    W9_FORM.taskStatus,
    handleEnterSubTask,
    userType,
  ]);

  const userTask = useMemo(() => {
    if (pipelineStatus === PipelineAccountStatus.pending_info) {
      return 'Please update the info below';
    }
    switch (userType) {
      case UserType.BROKER:
        return 'Broker info';
      case UserType.LENDER:
        return 'Lender info';
      case UserType.LOAN_OFFICER:
        return 'Loan officer info';
      case UserType.REAL_ESTATE_AGENT:
        return 'Real estate agent info';
      default:
        return 'Broker info';
    }
  }, [pipelineStatus, userType]);

  return pipelineStatus === PipelineAccountStatus.ready_for_review ? (
    <Stack alignItems={'center'} gap={1.25} justifyContent={'center'} my={7.5}>
      <Icon component={READY_FOR_REVIEW} sx={{ width: 268, height: '100%' }} />
      <Typography
        color={'#69C0A5'}
        mt={4.5}
        textAlign={'center'}
        variant={'h4'}
      >
        Your account is waiting for review
      </Typography>
      <Typography
        color={'text.secondary'}
        textAlign={'center'}
        variant={'body1'}
      >
        We are reviewing the updated information and will get back to you as
        soon as possible.
      </Typography>
      <Typography
        color={'text.secondary'}
        textAlign={'center'}
        variant={'body1'}
      >
        If you have any questions, please contact us at{' '}
        {saasState?.posSettings?.email || saasState?.email}.
      </Typography>
    </Stack>
  ) : (
    <StyledFormItem
      label={userTask}
      sx={{ m: '0 auto' }}
      tip={
        <>
          <Typography>
            Please fill in the following information before continuing.
          </Typography>
          {pipelineStatus === PipelineAccountStatus.pending_info && (
            <Typography>{pipelineAdditionDetails}</Typography>
          )}
        </>
      }
      width={'100%'}
    >
      <Stack
        border={'1px solid #D2D6E1'}
        borderRadius={2}
        gap={1.5}
        px={{ lg: 6, xs: 3 }}
        py={{ xs: 3 }}
        sx={{
          '& .task_item': {
            pt: 1.5,
            pb: 3,
            borderBottom: '1px solid #D2D6E1',
            transition: 'border-color .3s',
            cursor: 'pointer',
            '&:first-of-type': {
              pt: 0,
            },
            '&:hover': {
              borderBottomColor: 'text.primary',
            },
            '& .task_label': {
              fontSize: 'clamp(12px,1.6vw,16px) !important',
            },
          },
        }}
        width={'100%'}
      >
        {renderTaskList}
        <StyledButton
          disabled={!allowSubmit}
          loading={submitLoading}
          onClick={async () => {
            if (pipelineStatus === PipelineAccountStatus.active) {
              await router.push('/');
              return;
            }
            setSubmitLoading(true);
            try {
              await _submitPipelineTask();
              await fetchPipelineStatus();
            } catch (err) {
              const { header, message, variant } = err as HttpError;
              enqueueSnackbar(message, {
                variant: variant || 'error',
                autoHideDuration: AUTO_HIDE_DURATION,
                isSimple: !header,
                header,
              });
            } finally {
              setSubmitLoading(false);
            }
          }}
          size={
            ['xs', 'sm', 'md', 'lg'].includes(breakpoint) ? 'small' : 'large'
          }
          sx={{ mt: 2 }}
        >
          Submit
        </StyledButton>
      </Stack>
    </StyledFormItem>
  );
});
