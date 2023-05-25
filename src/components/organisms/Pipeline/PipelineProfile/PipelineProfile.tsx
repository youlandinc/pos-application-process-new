import { FC, useCallback, useMemo } from 'react';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useBreakpoints } from '@/hooks';
import { UserType } from '@/types';

import { StyledButton, StyledFormItem, StyledStatus } from '@/components/atoms';

export const PipelineProfile: FC = observer(() => {
  const router = useRouter();

  const {
    pipelineTask: { formData },
    userType,
    userSetting: { pipelineStatus },
  } = useMst();

  const breakpoint = useBreakpoints();

  const handleEnterSubTask = useCallback(
    async (url: string) => {
      await router.push(url);
    },
    [router],
  );

  const {
    BROKER_LICENSE,
    BROKER_GOVERNMENT_ID,
    W9_FORM,
    ACH_INFORMATION,
    BROKER_QUESTIONNAIRE,
    BROKER_AGREEMENT,
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
                {BROKER_LICENSE.taskName}
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
                  sx={{ color: 'info.A100', fontSize: 'inherit' }}
                  variant={'h6'}
                >
                  (Optional)
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
    switch (userType) {
      case UserType.BROKER:
        return 'Broker Tasks';
      case UserType.LOAN_OFFICER:
        return 'Loan Officer Tasks';
      case UserType.REAL_ESTATE_AGENT:
        return 'Real Estate Agent Tasks';
    }
  }, [userType]);

  return (
    <StyledFormItem
      label={userTask}
      sx={{ m: '0 auto' }}
      tip={
        'Please fill in the information that is needed for payment upon loan close.'
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
          disabled={!pipelineStatus}
          onClick={() => router.push('/')}
          size={
            ['xs', 'sm', 'md', 'lg'].includes(breakpoint) ? 'small' : 'large'
          }
          sx={{ mt: 2 }}
        >
          Start New Loan
        </StyledButton>
      </Stack>
    </StyledFormItem>
  );
});
