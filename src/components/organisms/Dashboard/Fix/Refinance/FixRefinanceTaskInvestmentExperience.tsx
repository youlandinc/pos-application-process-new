import { FC, useCallback, useMemo, useState } from 'react';
import { Slider, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';

import { HttpError, TaskFiles } from '@/types';
import { _fetchTaskFormInfo, _updateTaskFormInfo } from '@/requests/dashboard';
import { AUTO_HIDE_DURATION, OPTIONS_COMMON_MARKS } from '@/constants';

import {
  StyledButton,
  StyledFormItem,
  StyledLoading,
  StyledUploadButtonBox,
  Transitions,
} from '@/components/atoms';

export const FixRefinanceTaskInvestmentExperience: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const [propertiesNum, setPropertiesNum] = useState(0);
  const [investmentFiles, setInvestmentFiles] = useState<TaskFiles[]>([]);

  const fetchInitData = async () => {
    if (!router.query.taskId) {
      await router.push({
        pathname: '/dashboard/tasks',
        query: { processId: router.query.processId },
      });
      return;
    }
    return await _fetchTaskFormInfo(router.query.taskId as string)
      .then((res) => {
        const { investmentFiles, propertiesNum } = res.data;
        setInvestmentFiles(investmentFiles ?? []);
        setPropertiesNum(res.data.propertiesNum ?? propertiesNum);
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
  };

  const { loading } = useAsync(fetchInitData, [router.query.taskId]);

  const isDisabled = useMemo(() => {
    return !propertiesNum ? false : !(investmentFiles.length > 0);
  }, [investmentFiles.length, propertiesNum]);

  const handledSubmit = useCallback(async () => {
    setSaveLoading(true);
    const postData = {
      taskId: router.query.taskId as string,
      taskForm: {
        propertiesNum,
        investmentFiles,
      },
    };

    try {
      await _updateTaskFormInfo(postData);
      await router.push({
        pathname: '/dashboard/tasks',
        query: { processId: router.query.processId },
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
  }, [enqueueSnackbar, investmentFiles, propertiesNum, router]);

  return (
    <>
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
            margin={'auto 0'}
            minHeight={'calc(667px - 46px)'}
            width={'100%'}
          >
            <StyledLoading sx={{ color: 'text.grey' }} />
          </Stack>
        ) : (
          <StyledFormItem
            gap={6}
            label={'Real estate investment experience'}
            mx={{ lg: 'auto', xs: 0 }}
            px={{ lg: 3, xs: 0 }}
            tip={
              <>
                <Typography>
                  List your previous real estate investments, including rentals
                  and fix-and-flips.
                </Typography>
                <Typography>
                  These will be verified through a title search.
                </Typography>
              </>
            }
            tipSx={{ mb: 0 }}
            width={'100%'}
          >
            <StyledFormItem
              label={'Number of properties exited in last 24 months'}
              sub
            >
              <Stack maxWidth={600} width={'100%'}>
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
                marginTop: 16,
                width: '100%',
                display: propertiesNum ? 'block' : 'none',
              }}
            >
              {propertiesNum && (
                <StyledFormItem label={'Upload track record'} sub>
                  <StyledUploadButtonBox
                    accept={
                      'image/*,.pdf,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                    }
                    fileKey={'investmentFiles'}
                    fileName={'Track record'}
                    files={investmentFiles}
                    refresh={fetchInitData}
                    templateName={'Track Record Template.xlsx'}
                    templateUrl={
                      'https://youland-template-file.s3.us-west-1.amazonaws.com/Track+record.xlsx'
                    }
                  />

                  <Typography
                    color={'text.secondary'}
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
                    <Typography component={'li'} variant={'body1'}>
                      Property should be owned for at least 30 days but no more
                      than 36 months and either sold or turned into a rental
                      within the last 36 months.
                    </Typography>
                    <Typography component={'li'} variant={'body1'}>
                      Sale price should be at least $50,000.
                    </Typography>
                    <Typography component={'li'} variant={'body1'}>
                      Property can&apos;t be vacant land or your current
                      residence.
                    </Typography>
                    <Typography component={'li'} variant={'body1'}>
                      Title holder must be linked to the loan application&apos;s
                      borrower or guarantor. For each property listed, please
                      write the person/entity on the title next to the address.
                    </Typography>
                  </Stack>
                </StyledFormItem>
              )}
            </Transitions>

            <Stack
              flexDirection={'row'}
              gap={3}
              justifyContent={'space-between'}
              maxWidth={600}
              mt={4}
              width={'100%'}
            >
              <StyledButton
                color={'info'}
                onClick={() =>
                  router.push({
                    pathname: '/dashboard/tasks',
                    query: { processId: router.query.processId },
                  })
                }
                sx={{ flex: 1 }}
                variant={'text'}
              >
                Back
              </StyledButton>
              <StyledButton
                disabled={isDisabled || saveLoading}
                loading={saveLoading}
                loadingText={'Saving...'}
                onClick={handledSubmit}
                sx={{ flex: 1 }}
              >
                Confirm
              </StyledButton>
            </Stack>
          </StyledFormItem>
        )}
      </Transitions>
    </>
  );
});
