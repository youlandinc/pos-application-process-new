import { FC, useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Stack, Typography } from '@mui/material';
import { useAsync } from 'react-use';
import { useSnackbar } from 'notistack';

import { _fetchTaskFormInfo, _updateTaskFormInfo } from '@/requests/dashboard';
import { AUTO_HIDE_DURATION } from '@/constants';
import {
  StyledButton,
  StyledFormItem,
  StyledLoading,
  StyledTextFieldNumber,
  StyledUploadBox,
} from '@/components/atoms';

export const BridgeRefinanceTaskInvestmentExperience: FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [saveLoading, setSaveLoading] = useState<boolean>(false);

  const [trackRecord, setTrackRecord] = useState('');

  const { loading } = useAsync(async () => {
    return await _fetchTaskFormInfo(router.query.taskId as string)
      .then((res) => {
        console.log(res);
      })
      .catch((err) =>
        enqueueSnackbar(err as string, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
        }),
      );
  }, [router.query.taskId]);

  const isDisabled = useMemo(() => {
    return false;
  }, []);

  const handledSubmit = useCallback(async () => {
    setSaveLoading(true);
    const postData = {
      taskId: router.query.taskId as string,
      taskForm: {},
    };
    try {
      await _updateTaskFormInfo(postData);
      await router.push({
        pathname: '/dashboard/tasks',
        query: { processId: router.query.processId },
      });
    } catch (e) {
      enqueueSnackbar(e as string, {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
    } finally {
      setSaveLoading(false);
    }
  }, [enqueueSnackbar, router]);

  return loading ? (
    <StyledLoading sx={{ color: 'primary.main' }} />
  ) : (
    <StyledFormItem
      gap={6}
      label={'Real Estate Investment Experience'}
      tip={
        'Please list your past experience with investment properties. These should be properties where you appear on title. These may be properties that you have exited or sold. Please keep in mind we will verify this experience during underwriting.'
      }
      tipSx={{ mb: 0 }}
    >
      <StyledFormItem label={'Number of properties exited last 24 months'} sub>
        <Stack maxWidth={600} width={'100%'}>
          <StyledTextFieldNumber
            label={'Track Record'}
            onValueChange={({ formattedValue }) =>
              setTrackRecord(formattedValue)
            }
            value={trackRecord}
          />
        </Stack>
      </StyledFormItem>

      <StyledFormItem
        label={'Upload track record (Optional)'}
        sub
        tip={
          <Stack color={'info.main'}>
            <Typography variant={'body1'}>
              Next, fill out your Experience Verification Sheet
            </Typography>
            <Typography mt={1.5} variant={'body1'}>
              Please complete the experience sheet and tell us about the
              investment property flips you have completed in the past 24
              months. For our purposes, a completed flip meets the following
              criteria:
            </Typography>
            <Typography mt={1.5} textAlign={'left'} variant={'body1'}>
              1. The property must have been owned at least 30 days, owned for
              fewer than 36 months, and sold or converted into a rental property
              in the last 24 months.
            </Typography>
            <Typography mt={1} textAlign={'left'} variant={'body1'}>
              2. The sale price of the property must have been greater or equal
              to $50,000.
            </Typography>
          </Stack>
        }
      >
        <Stack alignItems={'center'}>
          <Typography color={'text.primary'} variant={'body1'}>
            Example documents:
          </Typography>

          <Typography
            className={'link_style'}
            component={'span'}
            fontWeight={600}
            onClick={() => {
              window.open(
                'https://youland-template-file.s3.us-west-1.amazonaws.com/Sample-project-experience-template.xlsx',
              );
            }}
          >
            Sample project experience template
          </Typography>

          <Typography
            color={'info.main'}
            mt={1.5}
            textAlign={'center'}
            variant={'body3'}
          >
            Include the person/Entity on the title for each property you
            include. It is important that the person/Entity on title is
            affiliated to the Borrower and Guarantor on your loan application.
            Additional documentation may be required if YouLand can&apos;t
            validate property ownership or title affiliation. Include the
            complete property address. When filling out the Experience
            Verification Sheet, please be sure to fill out the complete property
            address. Leave out vacant land and home address. YouLand will not
            count vacant land or your current home towards your experience
            verification.
          </Typography>

          <Box mt={3}>
            <StyledUploadBox
              fileList={[]}
              onDelete={() => {
                console.log(1);
              }}
              onSuccess={() => {
                console.log(2);
              }}
            />
          </Box>
        </Stack>
      </StyledFormItem>

      <Stack
        flexDirection={'row'}
        gap={3}
        justifyContent={'space-between'}
        maxWidth={600}
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
          disabled={!isDisabled || saveLoading}
          loading={saveLoading}
          loadingText={'Saving...'}
          onClick={handledSubmit}
          sx={{ flex: 1 }}
        >
          Save
        </StyledButton>
      </Stack>
    </StyledFormItem>
  );
};
