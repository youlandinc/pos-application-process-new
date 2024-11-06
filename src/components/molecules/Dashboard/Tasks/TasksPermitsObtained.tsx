import { FC, useMemo, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { useBreakpoints } from '@/hooks';
import { POSGetParamsFromUrl } from '@/utils';
import {
  AUTO_HIDE_DURATION,
  OPTIONS_COMMON_YES_OR_NO,
  OPTIONS_TASK_LAND_TYPE,
} from '@/constants';

import {
  StyledButton,
  StyledButtonGroup,
  StyledFormItem,
  StyledLoading,
  StyledSelectOption,
  StyledTextFieldNumber,
  StyledUploadButtonBox,
} from '@/components/atoms';
import { TasksRightMenu } from '@/components/molecules';

import {
  _fetchLoanTaskDetail,
  _updateLoanTaskDetail,
} from '@/requests/dashboard';
import {
  DashboardTaskKey,
  HttpError,
  LandTypeEnum,
  LoanAnswerEnum,
  TaskFiles,
} from '@/types';

export const TasksPermitsObtained: FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const breakpoints = useBreakpoints();

  const [saveLoading, setSaveLoading] = useState(false);
  const [landType, setLandType] = useState<LandTypeEnum>(LandTypeEnum.raw_land);
  const [isPermitReadyOrRTI, setIsPermitReadyOrRTI] = useState<LoanAnswerEnum>(
    LoanAnswerEnum.default,
  );
  const [anticipateHavingBuildPermits, setAnticipateHavingBuildPermits] =
    useState<number | undefined>();
  const [permitsFiles, setPermitsFiles] = useState<TaskFiles[]>([]);
  const [templateName, setTemplateName] = useState('');
  const [templateUrl, setTemplateUrl] = useState('');
  const [firstLoad, setFirstLoad] = useState(true);

  const fetchInitData = async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    try {
      const {
        data: { data },
      } = await _fetchLoanTaskDetail({
        loanId,
        taskKey: DashboardTaskKey.permits_obtained,
      });
      const {
        landType,
        isPermitReadyOrRTI,
        permitsFiles,
        templateName,
        templateUrl,
      } = data;
      setLandType(landType || LandTypeEnum.raw_land);
      setIsPermitReadyOrRTI(isPermitReadyOrRTI || LoanAnswerEnum.default);
      setAnticipateHavingBuildPermits(
        firstLoad
          ? data?.anticipateHavingBuildPermits === null
            ? undefined
            : data?.anticipateHavingBuildPermits
          : anticipateHavingBuildPermits,
      );
      setPermitsFiles(permitsFiles ?? []);
      setTemplateName(templateName ?? '');
      setTemplateUrl(templateUrl ?? '');
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setFirstLoad(false);
    }
  };

  const { loading } = useAsync(fetchInitData, []);

  const isFormDataValid = useMemo(() => {
    return (
      isPermitReadyOrRTI !== LoanAnswerEnum.default &&
      anticipateHavingBuildPermits !== undefined
    );
  }, [anticipateHavingBuildPermits, isPermitReadyOrRTI]);

  const handleSave = async () => {
    const postData = {
      loanId: POSGetParamsFromUrl(location.href).loanId,
      taskKey: DashboardTaskKey.permits_obtained,
      data: {
        landType,
        isPermitReadyOrRTI,
        anticipateHavingBuildPermits,
        permitsFiles,
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
      <Stack flexDirection={'row'} width={'100%'}>
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
            Upload all permits obtained
            <Typography
              color={'text.secondary'}
              fontSize={{ xs: 12, lg: 16 }}
              mt={1}
              variant={'body1'}
            >
              Please upload all permits that you&apos;ve obtained related to
              this project.
            </Typography>
          </Typography>

          <StyledFormItem
            gap={3}
            label={
              'Is the property currently raw land or has it received some or all utility improvements?'
            }
            sub
          >
            <StyledSelectOption
              onChange={(value) => {
                setLandType(value as LandTypeEnum);
              }}
              options={OPTIONS_TASK_LAND_TYPE}
              value={landType}
            />
          </StyledFormItem>

          <StyledFormItem gap={3} label={'Are you permit ready /RTI?'} sub>
            <StyledButtonGroup
              onChange={(_, v) => {
                if (v === null) {
                  return;
                }
                setIsPermitReadyOrRTI(v);
              }}
              options={OPTIONS_COMMON_YES_OR_NO}
              value={isPermitReadyOrRTI}
            />
          </StyledFormItem>

          <StyledFormItem
            gap={3}
            label={
              'How many months until you anticipate having building permits?'
            }
            sub
          >
            <StyledTextFieldNumber
              label={'Months until permit'}
              onValueChange={({ floatValue }) =>
                setAnticipateHavingBuildPermits(floatValue)
              }
              placeholder={'Months until permit'}
              thousandSeparator={false}
              value={anticipateHavingBuildPermits}
            />
          </StyledFormItem>

          <StyledUploadButtonBox
            accept={
              'image/*,.pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            }
            fileKey={DashboardTaskKey.permits_obtained}
            fileName={'Permits obtained'}
            files={permitsFiles}
            isShowHistory={false}
            refresh={fetchInitData}
            templateName={templateName}
            templateUrl={templateUrl}
          />

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
