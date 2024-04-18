import { FC, useMemo, useState } from 'react';
import { Box, Stack, SxProps, Typography } from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useAsync, useSetState } from 'react-use';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';

import { useBreakpoints } from '@/hooks';
import {
  AUTO_HIDE_DURATION,
  OPTIONS_COMMON_APPRAISAL_STAGE,
} from '@/constants';
import { POSFlex } from '@/styles';
import { _fetchLoanTask } from '@/requests/dashboard';
import {
  AppraisalStage,
  DashboardTaskList,
  GRDashboardTaskKey,
  GroundDashboardLoanTask,
  GroundDashboardTaskMap,
  HttpError,
} from '@/types';

import {
  StyledLoading,
  StyledProgressBlock,
  Transitions,
} from '@/components/atoms';
import { DashboardHeader } from '@/components/molecules';
import { POSFindLabel } from '@/utils';

const GroundRefinanceDashboardTaskMap: DashboardTaskList<GRDashboardTaskKey> = {
  ApplicationInformation: {
    title: 'Application information',
    children: [
      {
        code: 'GR_APPLICATION_LOAN',
        url: '/dashboard/tasks/loan_details',
      },
      //{
      //  code: 'GR_APPLICATION_PROPERTY',
      //  url: '/dashboard/tasks/property_details',
      //},
      {
        code: 'GR_APPLICATION_INVESTMENT',
        url: '/dashboard/tasks/investment_experience',
      },
    ],
  },
  BorrowerInformation: {
    title: 'Borrower information',
    children: [
      {
        code: 'GR_BORROWER_PERSONAL',
        url: '/dashboard/tasks/personal_details',
      },
      {
        code: 'GR_BORROWER_DEMOGRAPHICS',
        url: '/dashboard/tasks/demographics_information',
      },
      //{
      //  code: 'GR_BORROWER_GUARANTOR',
      //  url: '/dashboard/tasks/borrower_type',
      //},
      {
        code: 'GR_BORROWER_CO_BORROWER',
        url: '/dashboard/tasks/co_borrower_details',
      },
    ],
  },
  PropertyAppraisal: {
    title: 'Property appraisal',
    children: [
      {
        code: 'GR_APPRAISAL_COST',
        url: '/dashboard/tasks/cost',
      },
      //{
      //  code: 'GR_APPRAISAL_PROPERTY_DETAILS',
      //  url: '/dashboard/tasks/property_inspection',
      //},
    ],
  },
  ThirdPartyInformation: {
    title: 'Third-party information',
    children: [
      {
        code: 'GR_THIRD_CLOSING',
        url: '/dashboard/tasks/company_information',
      },
      //{
      //  code: 'GR_THIRD_INSURANCE',
      //  url: '/dashboard/tasks/insurance_information',
      //},
    ],
  },
  //SetUpAutoPay: {
  //  title: 'Set up auto Pay',
  //  children: [
  //    {
  //      code: 'GR_THIRD_CLOSING',
  //      url: '/dashboard/tasks/company_information',
  //    },
  //  ],
  //},
  DocumentsMaterials: {
    title: 'Documents & Materials',
    children: [
      // {
      //   code: 'GR_DOCUMENTS_CONTRACT',
      //   url: '/dashboard/tasks/contract',
      // },
      //{
      //  code: 'GR_DOCUMENTS_PICTURES',
      //  url: '/dashboard/tasks/upload_pictures',
      //},
      {
        code: 'GR_DOCUMENTS_REVIEW',
        url: '/dashboard/tasks/agreements',
      },
      {
        code: 'GR_DOCUMENTS_DOCUMENTS',
        url: '/dashboard/tasks/documents',
      },
    ],
  },
};

export const GroundRefinanceTaskList: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const breakpoints = useBreakpoints();

  const [taskDetails, setTaskDetails] =
    useSetState<GroundDashboardTaskMap<GRDashboardTaskKey>>();

  const [appraisalStage, setAppraisalStage] = useState(
    AppraisalStage.NotStarted,
  );

  const { loading } = useAsync(async () => {
    if (!router.query.processId) {
      return;
    }
    return await _fetchLoanTask<GroundDashboardLoanTask>(
      router.query.processId as string,
    )
      .then((res) => {
        setTaskDetails(res?.data?.tasks);
        const { appraisalStage } = res.data;
        setAppraisalStage(appraisalStage || AppraisalStage.NotStarted);
      })
      .catch((err) => {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
          onClose: () =>
            router.push({
              pathname: '/dashboard/tasks',
              query: { processId: router.query.processId },
            }),
        });
      });
  }, [router.query.processId]);

  const renderStage = useMemo(() => {
    let bgcolor = '';
    switch (appraisalStage) {
      case AppraisalStage.NotStarted:
        bgcolor = '#D2D6E1';
        break;
      case AppraisalStage.PaidFor:
      case AppraisalStage.Ordered:
      case AppraisalStage.Scheduled:
        bgcolor = '#95A8D7';
        break;
      case AppraisalStage.Canceled:
        bgcolor = '#E39482';
        break;
      case AppraisalStage.Completed:
        bgcolor = '#85CCB6';
        break;
    }
    return (
      <Typography
        alignItems={'center'}
        bgcolor={bgcolor}
        borderRadius={1}
        color={'#FFFFFF'}
        display={'flex'}
        fontSize={12}
        height={24}
        justifyContent={'center'}
        variant={'subtitle3'}
        width={96}
      >
        {POSFindLabel(
          OPTIONS_COMMON_APPRAISAL_STAGE,
          appraisalStage || AppraisalStage.NotStarted,
        )}
      </Typography>
    );
  }, [appraisalStage]);

  const renderTaskList = useMemo(() => {
    return (
      <>
        <Box className={'card_box'}>
          <Box>
            <Typography
              variant={['xs', 'sm'].includes(breakpoints) ? 'h7' : 'h6'}
            >
              {GroundRefinanceDashboardTaskMap.ApplicationInformation.title}
            </Typography>
          </Box>

          {GroundRefinanceDashboardTaskMap.ApplicationInformation.children.map(
            (sonItem) => (
              <Box
                key={sonItem.code}
                onClick={() =>
                  router.push({
                    pathname: sonItem.url,
                    query: {
                      ...router.query,
                      taskId: taskDetails[sonItem.code]?.taskId,
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
              {GroundRefinanceDashboardTaskMap.BorrowerInformation.title}
            </Typography>
          </Box>
          {GroundRefinanceDashboardTaskMap.BorrowerInformation.children.map(
            (sonItem) =>
              Object.keys(taskDetails).includes(sonItem.code) && (
                <Box
                  key={sonItem.code}
                  onClick={() =>
                    router.push({
                      pathname: sonItem.url,
                      query: {
                        ...router.query,
                        taskId: taskDetails[sonItem.code]?.taskId,
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
              {GroundRefinanceDashboardTaskMap.PropertyAppraisal.title}
            </Typography>
            {/*todo:appraisal*/}
            {renderStage}
          </Box>
          {GroundRefinanceDashboardTaskMap.PropertyAppraisal.children.map(
            (sonItem) => (
              <Box
                key={sonItem.code}
                onClick={() =>
                  router.push({
                    pathname: sonItem.url,
                    query: {
                      ...router.query,
                      taskId: taskDetails[sonItem.code]?.taskId,
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
              {GroundRefinanceDashboardTaskMap.ThirdPartyInformation.title}
            </Typography>
          </Box>
          {GroundRefinanceDashboardTaskMap.ThirdPartyInformation.children.map(
            (sonItem) => (
              <Box
                key={sonItem.code}
                onClick={() =>
                  router.push({
                    pathname: sonItem.url,
                    query: {
                      ...router.query,
                      taskId: taskDetails[sonItem.code]?.taskId,
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
              {GroundRefinanceDashboardTaskMap.DocumentsMaterials.title}
            </Typography>
          </Box>
          {GroundRefinanceDashboardTaskMap.DocumentsMaterials.children.map(
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
  }, [renderStage, breakpoints, router, taskDetails]);

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
          maxWidth={800}
          mx={{ lg: 'auto', xs: 0 }}
          px={{ lg: 3, xs: 0 }}
          sx={TaskListStyles}
          width={'100%'}
        >
          <DashboardHeader
            subTitleSx={{ mb: 2 }}
            title={'Your tasks checklist'}
          />
          {renderTaskList}
        </Box>
      )}
    </Transitions>
  );
});

const TaskListStyles: SxProps = {
  '& .card_box': {
    p: 3,
    py: 1.5,
    border: '1px solid',
    borderColor: 'background.border_default',
    mb: 3,
    borderRadius: 2,
    '& .Finish': {
      color: 'primary.main',
      width: { xs: 16, md: 24 },
      ml: 3,
    },
    '& div': {
      height: 48,
      ...POSFlex('center', 'space-between', 'row'),
      '&:hover': {
        cursor: 'pointer',
        borderRadius: 1,
        bgcolor: 'info.darker',
      },
      '&:first-of-type': {
        '&:hover': {
          bgcolor: 'transparent',
        },
      },
    },
  },
};
