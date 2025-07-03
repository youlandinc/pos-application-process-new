import { FC, useMemo, useState } from 'react';
import { Fade, Stack, Typography } from '@mui/material';
import { useAsync } from 'react-use';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import validate from 'validate.js';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { POSGetParamsFromUrl } from '@/utils';
import {
  AddressSchema,
  AUTO_HIDE_DURATION,
  OPTIONS_TASK_BORROWER_TYPE,
} from '@/constants';

import {
  StyledButton,
  StyledFormItem,
  StyledLoading,
  StyledSelectOption,
} from '@/components/atoms';

import {
  DashboardTaskBorrowerType,
  DashboardTaskKey,
  HttpError,
} from '@/types';
import {
  _fetchLoanTaskDetail,
  _updateLoanTaskDetail,
} from '@/requests/dashboard';

import {
  TasksBorrowerEntity,
  TasksBorrowerIndividual,
  TasksBorrowerTrust,
} from './index';

export const TasksBorrower: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const {
    dashboardInfo: { jumpToNextTask, taskBorrower },
  } = useMst();

  const [saveLoading, setSaveLoading] = useState(false);

  const [individualError, setIndividualError] = useState<
    Record<string, any> | undefined
  >(undefined);
  const [entityError, setEntityError] = useState<
    Record<string, any> | undefined
  >(undefined);
  const [trustError, setTrustError] = useState<Record<string, any> | undefined>(
    undefined,
  );

  const { loading } = useAsync(async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    try {
      const {
        data: { data },
      } = await _fetchLoanTaskDetail({
        loanId,
        taskKey: DashboardTaskKey.borrower,
      });
      taskBorrower.injectServerData(data);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  }, [router.query?.loanId]);

  const getPostData = () => {
    if (!taskBorrower.borrowerType) {
      return void 0;
    }

    let formError;
    let signatoriesError;

    switch (taskBorrower.borrowerType) {
      case DashboardTaskBorrowerType.individual: {
        formError = taskBorrower.checkIndividual();
        const addressError: Record<string, string[]> | undefined = validate(
          taskBorrower.addressInfo.getPostData(),
          AddressSchema,
        );
        setIndividualError(
          addressError
            ? { ...formError, addressInfo: addressError }
            : formError,
        );
        setEntityError(undefined);
        setTrustError(undefined);
        break;
      }
      case DashboardTaskBorrowerType.entity: {
        formError = taskBorrower.checkEntity();
        signatoriesError = taskBorrower.checkSignatories();

        const addressError: Record<string, string[]> | undefined = validate(
          taskBorrower.addressInfo.getPostData(),
          AddressSchema,
        );
        setEntityError(
          addressError
            ? { ...formError, addressInfo: addressError }
            : formError,
        );
        setIndividualError(undefined);
        setTrustError(undefined);
        break;
      }
      case DashboardTaskBorrowerType.trust: {
        formError = taskBorrower.checkTrust();
        signatoriesError = taskBorrower.checkSignatories();

        setTrustError(formError);
        setIndividualError(undefined);
        setEntityError(undefined);
        break;
      }
      default:
        return {};
    }

    if (formError) {
      return void 0;
    }

    if (taskBorrower.borrowerType !== DashboardTaskBorrowerType.individual) {
      if (
        signatoriesError &&
        signatoriesError.some(
          (errorObj) => errorObj && Object.keys(errorObj).length > 0,
        )
      ) {
        return void 0;
      }
    }

    const hash: Record<DashboardTaskBorrowerType, any> = {
      [DashboardTaskBorrowerType.individual]:
        taskBorrower.getIndividualPostData(),
      [DashboardTaskBorrowerType.entity]: taskBorrower.getEntityPostData(),
      [DashboardTaskBorrowerType.trust]: taskBorrower.getTrustPostData(),
      [DashboardTaskBorrowerType.default]: {},
    };

    return {
      loanId: router.query.loanId as string,
      taskKey: DashboardTaskKey.borrower,
      data: hash[taskBorrower.borrowerType as DashboardTaskBorrowerType],
    };
  };

  const handleSave = async () => {
    const postData = getPostData();

    if (!postData) {
      return;
    }

    setSaveLoading(true);
    try {
      await _updateLoanTaskDetail(
        postData as {
          loanId: string;
          taskKey: DashboardTaskKey;
          data: any;
        },
      );
      await jumpToNextTask(DashboardTaskKey.borrower);
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

  const renderFormByBorrowerType = useMemo(() => {
    switch (taskBorrower.borrowerType) {
      case DashboardTaskBorrowerType.individual:
        return (
          <TasksBorrowerIndividual
            formError={individualError}
            setFormError={setIndividualError}
          />
        );
      case DashboardTaskBorrowerType.entity:
        return (
          <TasksBorrowerEntity
            formError={entityError}
            setFormError={setEntityError}
          />
        );
      case DashboardTaskBorrowerType.trust:
        return (
          <TasksBorrowerTrust
            formError={trustError}
            setFormError={setTrustError}
          />
        );
      default:
        return null;
    }
  }, [entityError, individualError, taskBorrower.borrowerType, trustError]);

  return loading ? (
    <Stack
      alignItems={'center'}
      justifyContent={'center'}
      margin={'auto 0'}
      minHeight={'calc(667px - 194px)'}
      width={'100%'}
    >
      <StyledLoading sx={{ color: 'text.grey' }} />
    </Stack>
  ) : (
    <Fade in={!loading}>
      <Stack
        gap={{ xs: 6, lg: 8 }}
        justifyContent={'flex-start'}
        maxWidth={900}
        width={'100%'}
      >
        <Typography component={'div'} fontSize={{ xs: 20, lg: 24 }}>
          Borrower information
          <Typography
            color={'text.secondary'}
            fontSize={{ xs: 12, lg: 16 }}
            mt={1}
            variant={'body1'}
          >
            Please enter the borrower&apos;s details below so we may begin
            processing your loan documents.
          </Typography>
        </Typography>

        <StyledFormItem gap={3} label={'Borrower type'} mt={-3} sub>
          <StyledSelectOption
            onChange={(value) => {
              if (value === taskBorrower.borrowerType) {
                return;
              }
              taskBorrower.changeFieldValue(
                'borrowerType',
                value as string as DashboardTaskBorrowerType,
              );
            }}
            options={OPTIONS_TASK_BORROWER_TYPE}
            sx={{ maxWidth: 600 }}
            value={taskBorrower.borrowerType}
          />
        </StyledFormItem>

        {renderFormByBorrowerType}

        <StyledButton
          color={'primary'}
          disabled={saveLoading}
          loading={saveLoading}
          onClick={handleSave}
          sx={{ width: 276, mb: 8 }}
        >
          Save and continue
        </StyledButton>
      </Stack>
    </Fade>
  );
});
