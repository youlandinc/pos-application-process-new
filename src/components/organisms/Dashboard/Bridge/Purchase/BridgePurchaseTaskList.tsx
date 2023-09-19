import { FC, useMemo, useState } from 'react';
import { Box, Stack, SxProps, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAsync, useSetState } from 'react-use';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useBreakpoints } from '@/hooks';
import { AUTO_HIDE_DURATION } from '@/constants';
import { POSFlex } from '@/styles';
import { _fetchLoanTask } from '@/requests/dashboard';
import {
  BPDashboardTaskKey,
  BridgeDashboardLoanTask,
  BridgeDashboardTaskMap,
  DashboardTaskList,
  LoanStage,
} from '@/types';

import {
  StyledLoading,
  StyledProgressBlock,
  StyledProgressLine,
  Transitions,
} from '@/components/atoms';
import { DashboardHeader } from '@/components/molecules';

const BridgePurchaseDashboardTaskMap: DashboardTaskList<BPDashboardTaskKey> = {
  ApplicationInformation: {
    title: 'Application information',
    children: [
      {
        code: 'BP_APPLICATION_LOAN',
        url: '/dashboard/tasks/loan_details',
      },
      {
        code: 'BP_APPLICATION_PROPERTY',
        url: '/dashboard/tasks/property_details',
      },
      {
        code: 'BP_APPLICATION_INVESTMENT',
        url: '/dashboard/tasks/investment_experience',
      },
    ],
  },
  BorrowerInformation: {
    title: 'Borrower information',
    children: [
      {
        code: 'BP_BORROWER_PERSONAL',
        url: '/dashboard/tasks/personal_details',
      },
      {
        code: 'BP_BORROWER_DEMOGRAPHICS',
        url: '/dashboard/tasks/demographics_information',
      },
      {
        code: 'BP_BORROWER_GUARANTOR',
        url: '/dashboard/tasks/borrower_type',
      },
      {
        code: 'BP_BORROWER_CO_BORROWER',
        url: '/dashboard/tasks/co_borrower_details',
      },
    ],
  },
  PropertyAppraisal: {
    title: 'Property appraisal',
    children: [
      {
        code: 'BP_APPRAISAL_COST',
        url: '/dashboard/tasks/cost',
      },
      {
        code: 'BP_APPRAISAL_PROPERTY_DETAILS',
        url: '/dashboard/tasks/property_inspection',
      },
    ],
  },
  ThirdPartyInformation: {
    title: 'Third-party information',
    children: [
      {
        code: 'BP_THIRD_CLOSING',
        url: '/dashboard/tasks/company_information',
      },
      {
        code: 'BP_THIRD_INSURANCE',
        url: '/dashboard/tasks/insurance_information',
      },
    ],
  },
  // SetUpAutoPay: {
  //   title: 'Set up auto Pay',
  //   children: [
  //     {
  //       code: 'BP_THIRD_CLOSING',
  //       url: '/dashboard/tasks/company_information',
  //     },

  //   ],
  // },
  DocumentsMaterials: {
    title: 'Documents & Materials',
    children: [
      {
        code: 'BP_DOCUMENTS_CONTRACT',
        url: '/dashboard/tasks/contract',
      },
      {
        code: 'BP_DOCUMENTS_PICTURES',
        url: '/dashboard/tasks/upload_pictures',
      },
      {
        code: 'BP_DOCUMENTS_REVIEW',
        url: '/dashboard/tasks/agreements',
      },
      {
        code: 'BP_DOCUMENTS_DOCUMENTS',
        url: '/dashboard/tasks/documents',
      },
    ],
  },
};

export const BridgePurchaseTaskList: FC = observer(() => {
  const {
    selectedProcessData: { loanStage },
  } = useMst();

  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const breakpoints = useBreakpoints();

  const [taskDetails, setTaskDetails] =
    useSetState<BridgeDashboardTaskMap<BPDashboardTaskKey>>();

  const [total, setTotal] = useState(9);
  const [current, setCurrent] = useState(0);

  const { loading } = useAsync(async () => {
    if (!router.query.processId) {
      return;
    }
    return await _fetchLoanTask<BridgeDashboardLoanTask>(
      router.query.processId as string,
    )
      .then((res) => {
        const { totalNum, finishedNum } = res.data;
        setTaskDetails(res?.data?.tasks);
        setTotal(totalNum);
        setCurrent(finishedNum);
      })
      .catch((err) => {
        enqueueSnackbar(err, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          onClose: () =>
            router.push({
              pathname: '/dashboard/tasks',
              query: { processId: router.query.processId },
            }),
        });
      });
  }, [router.query.processId]);

  const renderTaskList = useMemo(() => {
    return (
      <>
        <Box className={'card_box'}>
          <Box>
            <Typography
              variant={['xs', 'sm'].includes(breakpoints) ? 'h7' : 'h6'}
            >
              {BridgePurchaseDashboardTaskMap.ApplicationInformation.title}
            </Typography>
          </Box>

          {BridgePurchaseDashboardTaskMap.ApplicationInformation.children.map(
            (sonItem) => (
              <Box
                key={sonItem.code}
                onClick={() =>
                  router.push({
                    pathname: sonItem.url,
                    query: {
                      ...router.query,
                      taskId: taskDetails[sonItem.code].taskId,
                    },
                  })
                }
                px={{ md: 3, xs: 0 }}
              >
                <Typography
                  variant={
                    ['xs', 'sm'].includes(breakpoints) ? 'body3' : 'body2'
                  }
                >
                  {taskDetails[sonItem.code]?.taskName}
                </Typography>
                {taskDetails[sonItem.code]?.finished && (
                  <CheckCircle
                    className={
                      taskDetails[sonItem.code]?.finished ? 'Finish' : ''
                    }
                  />
                )}
              </Box>
            ),
          )}
        </Box>

        <Box className={'card_box'}>
          <Box>
            <Typography
              variant={['xs', 'sm'].includes(breakpoints) ? 'h7' : 'h6'}
            >
              {BridgePurchaseDashboardTaskMap.BorrowerInformation.title}
            </Typography>
          </Box>
          {BridgePurchaseDashboardTaskMap.BorrowerInformation.children.map(
            (sonItem) => (
              <Box
                key={sonItem.code}
                onClick={() =>
                  router.push({
                    pathname: sonItem.url,
                    query: {
                      ...router.query,
                      taskId: taskDetails[sonItem.code].taskId,
                    },
                  })
                }
                px={{ md: 3, xs: 0 }}
              >
                <Typography
                  variant={
                    ['xs', 'sm'].includes(breakpoints) ? 'body3' : 'body2'
                  }
                >
                  {taskDetails[sonItem.code]?.taskName}
                </Typography>
                {taskDetails[sonItem.code]?.finished && (
                  <CheckCircle
                    className={
                      taskDetails[sonItem.code]?.finished ? 'Finish' : ''
                    }
                  />
                )}
              </Box>
            ),
          )}
        </Box>

        <Box className={'card_box'}>
          <Box>
            <Typography
              variant={['xs', 'sm'].includes(breakpoints) ? 'h7' : 'h6'}
            >
              {BridgePurchaseDashboardTaskMap.PropertyAppraisal.title}
            </Typography>
          </Box>
          {BridgePurchaseDashboardTaskMap.PropertyAppraisal.children.map(
            (sonItem) => (
              <Box
                key={sonItem.code}
                onClick={() =>
                  router.push({
                    pathname: sonItem.url,
                    query: {
                      ...router.query,
                      taskId: taskDetails[sonItem.code].taskId,
                    },
                  })
                }
                px={{ md: 3, xs: 0 }}
              >
                <Typography
                  variant={
                    ['xs', 'sm'].includes(breakpoints) ? 'body3' : 'body2'
                  }
                >
                  {taskDetails[sonItem.code]?.taskName}
                </Typography>
                {taskDetails[sonItem.code]?.finished && (
                  <CheckCircle
                    className={
                      taskDetails[sonItem.code]?.finished ? 'Finish' : ''
                    }
                  />
                )}
              </Box>
            ),
          )}
        </Box>

        <Box className={'card_box'}>
          <Box>
            <Typography
              variant={['xs', 'sm'].includes(breakpoints) ? 'h7' : 'h6'}
            >
              {BridgePurchaseDashboardTaskMap.ThirdPartyInformation.title}
            </Typography>
          </Box>
          {BridgePurchaseDashboardTaskMap.ThirdPartyInformation.children.map(
            (sonItem) => (
              <Box
                key={sonItem.code}
                onClick={() =>
                  router.push({
                    pathname: sonItem.url,
                    query: {
                      ...router.query,
                      taskId: taskDetails[sonItem.code].taskId,
                    },
                  })
                }
                px={{ md: 3, xs: 0 }}
              >
                <Typography
                  variant={
                    ['xs', 'sm'].includes(breakpoints) ? 'body3' : 'body2'
                  }
                >
                  {taskDetails[sonItem.code]?.taskName}
                </Typography>
                {taskDetails[sonItem.code]?.finished && (
                  <CheckCircle
                    className={
                      taskDetails[sonItem.code]?.finished ? 'Finish' : ''
                    }
                  />
                )}
              </Box>
            ),
          )}
        </Box>

        <Box className={'card_box'}>
          <Box>
            <Typography
              variant={['xs', 'sm'].includes(breakpoints) ? 'h7' : 'h6'}
            >
              {BridgePurchaseDashboardTaskMap.DocumentsMaterials.title}
            </Typography>
          </Box>
          {BridgePurchaseDashboardTaskMap.DocumentsMaterials.children.map(
            (sonItem) => {
              if (taskDetails[sonItem.code]) {
                return (
                  <Box
                    key={sonItem.code}
                    onClick={() =>
                      router.push({
                        pathname: sonItem.url,
                        query: {
                          ...router.query,
                          taskId: taskDetails[sonItem.code].taskId,
                        },
                      })
                    }
                    px={{ md: 3, xs: 0 }}
                  >
                    <Typography
                      variant={
                        ['xs', 'sm'].includes(breakpoints) ? 'body3' : 'body2'
                      }
                    >
                      {taskDetails[sonItem.code]?.taskName}
                    </Typography>
                    {taskDetails[sonItem.code]?.taskName === 'Documents' &&
                      !taskDetails[sonItem.code]?.finished && (
                        <StyledProgressBlock
                          current={
                            taskDetails[sonItem.code]?.uploadedNum as number
                          }
                          total={taskDetails[sonItem.code]?.totalNum as number}
                        />
                      )}
                    {taskDetails[sonItem.code]?.finished && (
                      <CheckCircle
                        className={
                          taskDetails[sonItem.code]?.finished ? 'Finish' : ''
                        }
                      />
                    )}
                  </Box>
                );
              }
            },
          )}
        </Box>
      </>
    );
  }, [breakpoints, router, taskDetails]);

  const renderStage = useMemo(() => {
    return (
      <Typography
        alignItems={'center'}
        bgcolor={
          loanStage === LoanStage.Approved ? '#E1EFE4' : 'primary.lighter'
        }
        borderRadius={2}
        color={
          loanStage === LoanStage.Approved ? 'success.main' : 'primary.main'
        }
        display={'flex'}
        height={32}
        justifyContent={'center'}
        m={'0 auto 48px auto'}
        variant={'subtitle3'}
        width={120}
      >
        {loanStage === LoanStage.Approved ? 'Approved' : 'In progress'}
      </Typography>
    );
  }, [loanStage]);

  return (
    <Transitions
      style={{
        display: 'flex',
        width: '100%',
        justifyContent: 'center',
      }}
    >
      {loading ? (
        <Stack
          alignItems={'center'}
          justifyContent={'center'}
          minHeight={'calc(667px - 46px)'}
          width={'100%'}
        >
          <StyledLoading sx={{ color: 'text.grey', m: 0 }} />
        </Stack>
      ) : (
        <Box
          display={'flex'}
          flexDirection={'column'}
          justifyContent={'center'}
          maxWidth={900}
          mx={{ lg: 'auto', xs: 0 }}
          px={{ lg: 3, xs: 0 }}
          sx={TaskListStyles}
          width={'100%'}
        >
          <DashboardHeader
            subTitle={
              'You can make updates to the task before the loan is approved.'
            }
            title={'Your tasks checklist'}
          />
          <Stack alignItems={'center'} mb={3}>
            <StyledProgressLine current={current} total={total} />
          </Stack>
          {renderStage}
          {renderTaskList}
        </Box>
      )}
    </Transitions>
  );
});

const TaskListStyles: SxProps = {
  '& .card_box': {
    p: 3,
    border: '1px solid',
    borderColor: 'background.border_default',
    mb: 3,
    borderRadius: 2,
    '& .Finish': {
      color: 'success.main',
      width: { xs: 16, md: 24 },
      ml: 3,
    },
    '& div': {
      height: 48,
      ...POSFlex('center', 'space-between', 'row'),
      '&:hover': {
        cursor: 'pointer',
        borderRadius: 1,
        bgcolor: 'primary.light',
      },
      '&:first-of-type': {
        '&:hover': {
          bgcolor: 'transparent',
        },
      },
    },
  },
};
