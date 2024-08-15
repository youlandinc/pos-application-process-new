import { FC, useMemo, useState } from 'react';
import { Fade, Slider, Stack, Typography } from '@mui/material';
import { useAsync } from 'react-use';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { POSGetParamsFromUrl } from '@/utils';
import { AUTO_HIDE_DURATION, OPTIONS_COMMON_MARKS } from '@/constants';

import {
  StyledButton,
  StyledFormItem,
  StyledLoading,
  StyledUploadButtonBox,
  Transitions,
} from '@/components/atoms';

import { DashboardTaskKey, HttpError, TaskFiles } from '@/types';
import {
  _fetchLoanTaskDetail,
  _updateLoanTaskDetail,
} from '@/requests/dashboard';

export const TasksInvestmentExperience: FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const [propertiesNum, setPropertiesNum] = useState(0);
  const [investmentFiles, setInvestmentFiles] = useState<TaskFiles[]>([]);
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
        taskKey: DashboardTaskKey.real_investment,
      });
      const { investmentFiles, templateName, templateUrl } = data;

      setInvestmentFiles(investmentFiles ?? []);
      setPropertiesNum(
        firstLoad ? (data?.propertiesNum ?? propertiesNum) : propertiesNum,
      );
      setTemplateName(templateName);
      setTemplateUrl(templateUrl);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
        onClose: () =>
          router.push({
            pathname: '/dashboard/tasks',
            query: { loanId: router.query.loanId },
          }),
      });
    } finally {
      setFirstLoad(false);
    }
  };

  const { loading } = useAsync(fetchInitData, [router.query.taskId]);

  const isFormDataValid = useMemo(() => {
    return !propertiesNum ? true : investmentFiles.length > 0;
  }, [investmentFiles.length, propertiesNum]);

  const handleSave = async () => {
    setSaveLoading(true);
    const postData = {
      loanId: router.query.loanId as string,
      taskKey: DashboardTaskKey.real_investment,
      data: {
        propertiesNum,
        investmentFiles,
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
      <Stack
        alignItems={'center'}
        gap={6}
        justifyContent={'flex-start'}
        maxWidth={700}
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
          Real estate investment experience
          <Typography
            color={'text.secondary'}
            fontSize={{ xs: 12, lg: 16 }}
            variant={'body1'}
          >
            List your previous real estate investments, including rentals and
            fix-and-flips.
          </Typography>
          <Typography
            color={'text.secondary'}
            fontSize={{ xs: 12, lg: 16 }}
            variant={'body1'}
          >
            These will be verified through a title search.
          </Typography>
        </Typography>

        <StyledFormItem
          label={'Number of properties exited in last 24 months'}
          labelSx={{ textAlign: 'center' }}
          sub
        >
          <Stack maxWidth={648} width={'100%'}>
            <Slider
              defaultValue={0}
              marks={OPTIONS_COMMON_MARKS}
              max={20}
              onChange={(e, v) => setPropertiesNum(v as number)}
              step={1}
              sx={{
                height: 8,
                '.MuiSlider-mark': {
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  transform: 'translateY(-50%)',
                  '&[data-index="20"],&[data-index="0"]': {
                    display: 'none !important',
                  },
                },
              }}
              value={propertiesNum}
              valueLabelDisplay={'auto'}
              valueLabelFormat={(value) => {
                return value === 20 ? '20+' : value;
              }}
            />
          </Stack>
        </StyledFormItem>

        <Transitions
          style={{
            width: '100%',
            display: propertiesNum ? 'block' : 'none',
            marginTop: 16,
          }}
        >
          {propertiesNum && (
            <StyledFormItem
              label={'Upload track record'}
              labelSx={{ textAlign: 'center' }}
              sub
            >
              <StyledUploadButtonBox
                accept={
                  'image/*,.pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                }
                fileKey={DashboardTaskKey.real_investment}
                fileName={'Track record'}
                files={investmentFiles}
                isShowHistory={false}
                refresh={fetchInitData}
                templateName={templateName}
                templateUrl={templateUrl}
              />

              <Typography
                color={'text.secondary'}
                fontSize={{ xs: 12, lg: 16 }}
                mt={3}
                variant={'subtitle1'}
                width={'100%'}
              >
                Each property listed must meet the following criteria:
              </Typography>
              <Stack
                component={'ul'}
                sx={{
                  pl: 3,
                  listStyleType: 'decimal',
                  listStylePosition: 'outside',
                  color: 'text.secondary',
                }}
              >
                <Typography
                  component={'li'}
                  fontSize={{ xs: 12, lg: 16 }}
                  variant={'body1'}
                >
                  Property should be owned for at least 30 days but no more than
                  36 months and either sold or turned into a rental within the
                  last 36 months.
                </Typography>
                <Typography
                  component={'li'}
                  fontSize={{ xs: 12, lg: 16 }}
                  variant={'body1'}
                >
                  Sale price should be at least $50,000.
                </Typography>
                <Typography
                  component={'li'}
                  fontSize={{ xs: 12, lg: 16 }}
                  variant={'body1'}
                >
                  Property can&apos;t be vacant land or your current residence.
                </Typography>
                <Typography
                  component={'li'}
                  fontSize={{ xs: 12, lg: 16 }}
                  variant={'body1'}
                >
                  Title holder must be linked to the loan application&apos;s
                  borrower or guarantor. For each property listed, please write
                  the person/entity on the title next to the address.
                </Typography>
              </Stack>
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
    </Fade>
  );
};
