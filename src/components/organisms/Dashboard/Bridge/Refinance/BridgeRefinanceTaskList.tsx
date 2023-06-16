import { FC, useCallback, useMemo, useState } from 'react';
import { Box, SxProps, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAsync, useSetState } from 'react-use';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';

import { AUTO_HIDE_DURATION } from '@/constants';
import { POSFlex, POSFont } from '@/styles';
import { _fetchLoanTask, _notifyTaskUpdate } from '@/requests/dashboard';
import { BridgeRefinanceTasks } from '@/types';

import { StyledButton, StyledLoading } from '@/components/atoms';
import { PageHeader } from '@/components/molecules';

type BridgeRefinanceTaskCode =
  | 'BR_APPLICATION_LOAN'
  | 'BR_APPLICATION_PROPERTY'
  | 'BR_APPLICATION_INVESTMENT'
  | 'BR_BORROWER_PERSONAL'
  | 'BR_BORROWER_DEMOGRAPHICS'
  | 'BR_BORROWER_CO_BORROWER'
  | 'BR_BORROWER_GUARANTOR'
  | 'BR_APPRAISAL_PROPERTY_DETAILS'
  | 'BR_THIRD_CLOSING'
  | 'BR_THIRD_INSURANCE'
  | 'BR_DOCUMENTS_CONTRACT'
  | 'BR_DOCUMENTS_PICTURES'
  | 'BR_DOCUMENTS_REVIEW'
  | 'BR_DOCUMENTS_DOCUMENTS'
  | 'BR_APPRAISAL_COST';

interface TaskItem {
  title: string;
  children: Array<{ code: BridgeRefinanceTaskCode; url: string }>;
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
        code: 'BR_APPLICATION_LOAN',
        url: '/dashboard/tasks/loan_details',
      },
      {
        code: 'BR_APPLICATION_PROPERTY',
        url: '/dashboard/tasks/property_details',
      },
      {
        code: 'BR_APPLICATION_INVESTMENT',
        url: '/dashboard/tasks/investment_experience',
      },
    ],
  },
  BorrowerInformation: {
    title: 'Borrower Information',
    children: [
      {
        code: 'BR_BORROWER_PERSONAL',
        url: '/dashboard/tasks/personal_details',
      },
      {
        code: 'BR_BORROWER_DEMOGRAPHICS',
        url: '/dashboard/tasks/demographics_information',
      },
      {
        code: 'BR_BORROWER_GUARANTOR',
        url: '/dashboard/tasks/guarantor_personal',
      },
      {
        code: 'BR_BORROWER_CO_BORROWER',
        url: '/dashboard/tasks/co_borrower_details',
      },
    ],
  },
  PropertyAppraisal: {
    title: 'Property Appraisal',
    children: [
      {
        code: 'BR_APPRAISAL_PROPERTY_DETAILS',
        url: '/dashboard/tasks/property_inspection',
      },
      {
        code: 'BR_APPRAISAL_COST',
        url: '/dashboard/tasks/cost',
      },
    ],
  },
  ThirdPartyInformation: {
    title: 'Third-party Information',
    children: [
      {
        code: 'BR_THIRD_CLOSING',
        url: '/dashboard/tasks/company_information',
      },
      {
        code: 'BR_THIRD_INSURANCE',
        url: '/dashboard/tasks/insurance_information',
      },
    ],
  },
  //SetUpAutoPay: {
  //  title: 'Set up auto Pay',
  //  children: [
  //    {
  //      code: 'BR_THIRD_CLOSING',
  //      url: '/dashboard/tasks/company_information',
  //    },
  //  ],
  //},
  DocumentsMaterials: {
    title: 'Documents & Materials',
    children: [
      // {
      //   code: 'BR_DOCUMENTS_CONTRACT',
      //   url: '/dashboard/tasks/contract',
      // },
      {
        code: 'BR_DOCUMENTS_PICTURES',
        url: '/dashboard/tasks/upload_pictures',
      },
      {
        code: 'BR_DOCUMENTS_REVIEW',
        url: '/dashboard/tasks/agreements',
      },
      {
        code: 'BR_DOCUMENTS_DOCUMENTS',
        url: '/dashboard/tasks/documents',
      },
    ],
  },
};

export const BridgeRefinanceTaskList: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [updateLoading, setUpdateLoading] = useState(false);

  const [taskDetails, setTaskDetails] = useSetState<BridgeRefinanceTasks>();

  const { loading } = useAsync(async () => {
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

  const handledUpdate = useCallback(async () => {
    setUpdateLoading(true);
    try {
      await _notifyTaskUpdate(router.query.processId as string);
    } catch (err) {
      enqueueSnackbar(err as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    } finally {
      setUpdateLoading(false);
    }
  }, [enqueueSnackbar, router.query.processId]);

  const renderTaskList = useMemo(() => {
    return (
      <>
        <Box className={'card_box'}>
          <Box>
            <Typography
              sx={{
                fontSize: {
                  md: 18,
                  xs: 16,
                },
              }}
              variant={'h6'}
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
                sx={{
                  fontSize: {
                    md: 16,
                    xs: 12,
                  },
                }}
                variant={'body1'}
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
              sx={{
                fontSize: {
                  md: 18,
                  xs: 16,
                },
              }}
              variant={'h6'}
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
                sx={{
                  fontSize: {
                    md: 16,
                    xs: 12,
                  },
                }}
                variant={'body1'}
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
              sx={{
                fontSize: {
                  md: 18,
                  xs: 16,
                },
              }}
              variant={'h6'}
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
                sx={{
                  fontSize: {
                    md: 16,
                    xs: 12,
                  },
                }}
                variant={'body1'}
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
              sx={{
                fontSize: {
                  md: 18,
                  xs: 16,
                },
              }}
              variant={'h6'}
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
                sx={{
                  fontSize: {
                    md: 16,
                    xs: 12,
                  },
                }}
                variant={'body1'}
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
              sx={{
                fontSize: {
                  md: 18,
                  xs: 16,
                },
              }}
              variant={'h6'}
            >
              {taskObj.DocumentsMaterials.title}
            </Typography>
          </Box>
          {taskObj.DocumentsMaterials.children.map((sonItem) => (
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
                sx={{
                  fontSize: {
                    md: 16,
                    xs: 12,
                  },
                }}
                variant={'body1'}
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
      </>
    );
  }, [router, taskDetails]);

  return (
    <Box sx={TaskListStyles}>
      <PageHeader
        subTitle={
          'You can make updates to the task before the loan is approved.'
        }
        title={'Your Tasks Checklist'}
      />

      {loading ? (
        <StyledLoading sx={{ color: 'primary.main' }} />
      ) : (
        <>
          {renderTaskList}
          <Box className={'footer'}>
            <Box>
              <Typography
                color={'warning.main'}
                sx={{
                  fontSize: {
                    md: 18,
                    xs: 16,
                  },
                }}
                variant={'h6'}
              >
                Update your progress with your loan officer
              </Typography>
              <Typography
                color={'warning.main'}
                sx={{
                  fontSize: {
                    md: 16,
                    xs: 12,
                  },
                }}
                variant={'body2'}
              >
                We will notify your loan officer to review the tasks you have
                completed. If you have any questions or concerns, please reach
                out to your loan officer to ensure that the tasks are completed
                accurately.
              </Typography>
            </Box>
            <Box sx={{ width: '100px' }}>
              <StyledButton
                color={'warning'}
                disabled={updateLoading}
                onClick={handledUpdate}
              >
                Update
              </StyledButton>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
});

const TaskListStyles: SxProps = {
  maxWidth: 900,
  width: '100%',
  px: {
    lg: 3,
    xs: 0,
  },
  mx: {
    lg: 'auto',
    xs: 0,
  },
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  '& .card_box': {
    p: 3,
    border: '1px solid',
    borderColor: 'background.border_default',
    mb: 3,
    borderRadius: 2,
    '& .Finish': {
      color: 'success.main',
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
      '& >div': {
        width: 120,
        height: 24,
        borderRadius: 1,
        bgcolor: 'success.A200',
        ...POSFlex('center', 'center', 'row'),
        ...POSFont(12, 600, 1.5, 'success.main'),
        '&.Unfinished': {
          bgcolor: 'info.A200',
          color: 'info.main',
        },
      },
    },
  },
  '& .footer': {
    p: 3,
    borderRadius: 2,
    mt: 1,
    bgcolor: 'warning.A200',
    gap: 3,
    ...POSFlex('center', 'space-between', { md: 'row', xs: 'column' }),
  },
};
