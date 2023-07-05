import { FC, useMemo } from 'react';
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
import { BridgePurchaseTasks, LoanStage } from '@/types';

import { StyledLoading } from '@/components/atoms';
import { DashboardHeader } from '@/components/molecules';

type BridgePurchaseTaskCode =
  | 'BP_APPLICATION_LOAN'
  | 'BP_APPLICATION_PROPERTY'
  | 'BP_APPLICATION_INVESTMENT'
  | 'BP_BORROWER_PERSONAL'
  | 'BP_BORROWER_DEMOGRAPHICS'
  | 'BP_BORROWER_CO_BORROWER'
  | 'BP_BORROWER_GUARANTOR'
  | 'BP_APPRAISAL_PROPERTY_DETAILS'
  | 'BP_THIRD_CLOSING'
  | 'BP_THIRD_INSURANCE'
  | 'BP_DOCUMENTS_CONTRACT'
  | 'BP_DOCUMENTS_PICTURES'
  | 'BP_DOCUMENTS_REVIEW'
  | 'BP_DOCUMENTS_DOCUMENTS'
  | 'BP_APPRAISAL_COST';

interface TaskItem {
  title: string;
  children: Array<{ code: BridgePurchaseTaskCode; url: string }>;
}

interface taskObj {
  ApplicationInformation: TaskItem;
  BorrowerInformation: TaskItem;
  PropertyAppraisal: TaskItem;
  ThirdPartyInformation: TaskItem;
  DocumentsMaterials: TaskItem;
  // SetUpAutoPay: TaskItem;
}

const taskObj: taskObj = {
  ApplicationInformation: {
    title: 'Application Information',
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
    title: 'Borrower Information',
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
        url: '/dashboard/tasks/guarantor_personal',
      },
      {
        code: 'BP_BORROWER_CO_BORROWER',
        url: '/dashboard/tasks/co_borrower_details',
      },
    ],
  },
  PropertyAppraisal: {
    title: 'Property Appraisal',
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
    title: 'Third-party Information',
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

  const [taskDetails, setTaskDetails] = useSetState<BridgePurchaseTasks>();

  const { loading } = useAsync(async () => {
    if (!router.query.processId) {
      return;
    }
    return await _fetchLoanTask(router.query.processId as string)
      .then((res) => {
        setTaskDetails(res?.data?.tasks);
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
              {taskObj.ApplicationInformation.title}
            </Typography>
          </Box>

          {taskObj.ApplicationInformation.children.map((sonItem) => (
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
                variant={['xs', 'sm'].includes(breakpoints) ? 'body3' : 'body2'}
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
          ))}
        </Box>

        <Box className={'card_box'}>
          <Box>
            <Typography
              variant={['xs', 'sm'].includes(breakpoints) ? 'h7' : 'h6'}
            >
              {taskObj.BorrowerInformation.title}
            </Typography>
          </Box>
          {taskObj.BorrowerInformation.children.map((sonItem) => (
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
                variant={['xs', 'sm'].includes(breakpoints) ? 'body3' : 'body2'}
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
          ))}
        </Box>

        <Box className={'card_box'}>
          <Box>
            <Typography
              variant={['xs', 'sm'].includes(breakpoints) ? 'h7' : 'h6'}
            >
              {taskObj.PropertyAppraisal.title}
            </Typography>
          </Box>
          {taskObj.PropertyAppraisal.children.map((sonItem) => (
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
                variant={['xs', 'sm'].includes(breakpoints) ? 'body3' : 'body2'}
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
          ))}
        </Box>

        <Box className={'card_box'}>
          <Box>
            <Typography
              variant={['xs', 'sm'].includes(breakpoints) ? 'h7' : 'h6'}
            >
              {taskObj.ThirdPartyInformation.title}
            </Typography>
          </Box>
          {taskObj.ThirdPartyInformation.children.map((sonItem) => (
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
                variant={['xs', 'sm'].includes(breakpoints) ? 'body3' : 'body2'}
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
          ))}
        </Box>

        <Box className={'card_box'}>
          <Box>
            <Typography
              variant={['xs', 'sm'].includes(breakpoints) ? 'h7' : 'h6'}
            >
              {taskObj.DocumentsMaterials.title}
            </Typography>
          </Box>
          {taskObj.DocumentsMaterials.children.map((sonItem) => {
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
          })}
        </Box>
      </>
    );
  }, [breakpoints, router, taskDetails]);

  const renderStage = useMemo(() => {
    return (
      <Typography
        alignItems={'center'}
        bgcolor={
          loanStage === LoanStage.Approved
            ? '#E1EFE4'
            : 'rgba(17, 52, 227, 0.10)'
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
        {loanStage}
      </Typography>
    );
  }, [loanStage]);

  return (
    <Stack
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
        title={'Your Tasks Checklist'}
      />

      {loading ? (
        <StyledLoading sx={{ color: 'primary.main' }} />
      ) : (
        <>
          {renderStage}
          {renderTaskList}
        </>
      )}
    </Stack>
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
        bgcolor: '#C5D1FF',
      },
      '&:first-of-type': {
        '&:hover': {
          bgcolor: 'transparent',
        },
      },
    },
  },
};
