import { FC, useCallback, useMemo, useRef, useState } from 'react';
import { Box, Fade, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useAsync } from 'react-use';

import { AUTO_HIDE_DURATION } from '@/constants';
import { POSGetParamsFromUrl } from '@/utils';

import { StyledLoading } from '@/components/atoms';
import {
  AppraisalPayment,
  AppraisalPaymentStatus,
  AppraisalProfile,
  AppraisalProfileData,
  AppraisalStatus,
  AppraisalStatusProps,
} from '@/components/molecules';

import {
  AppraisalStatusEnum,
  AppraisalTaskPaymentStatus,
  DashboardPaymentDetailsResponse,
  HttpError,
} from '@/types';
import {
  _fetchAppraisalData,
  _fetchAppraisalPaymentData,
  _updateAppraisalData,
} from '@/requests/dashboard';

export const Appraisal: FC = () => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [formState, setFormState] = useState<
    'profile' | 'payment' | 'afterPayment'
  >('profile');

  const [backToProfileLoading, setBackToProfileLoading] = useState(false);

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileData, setProfileData] = useState<AppraisalProfileData>({
    haveAppraisal: false,
    appraisalFiles: [],
    isExpedited: false,
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    instructions: '',
  });

  const [paymentStatus, setPaymentStatus] =
    useState<AppraisalTaskPaymentStatus>(AppraisalTaskPaymentStatus.undone);

  const [appraisalStatus, setAppraisalStatus] = useState<AppraisalStatusEnum>(
    AppraisalStatusEnum.not_started,
  );
  const [appraisalDetail, setAppraisalDetail] = useState<
    AppraisalStatusProps['appraisalDetail']
  >({
    [AppraisalStatusEnum.paid_for]: null,
    [AppraisalStatusEnum.ordered]: null,
    [AppraisalStatusEnum.scheduled]: null,
    [AppraisalStatusEnum.canceled]: null,
    [AppraisalStatusEnum.completed]: null,
  });

  const appraisalPaymentRef = useRef(null);
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentDetail, setPaymentDetail] = useState<
    DashboardPaymentDetailsResponse | undefined
  >();

  const updateAppraisalProfileAndGetPaymentDetails = useCallback(
    async (data: AppraisalProfileData) => {
      setProfileLoading(true);
      try {
        await _updateAppraisalData(data);
        if (!data.haveAppraisal) {
          const { data } = await _fetchAppraisalPaymentData({
            loanId: router.query.loanId as string,
          });
          setPaymentDetail(data);
        }
        !data.haveAppraisal && setFormState('payment');
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      } finally {
        setProfileLoading(false);
        setBackToProfileLoading(false);
      }
    },
    [enqueueSnackbar, router.query.loanId],
  );

  const handlePayment = useCallback(
    async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      setPaymentLoading(true);

      const paymentRes = await (
        appraisalPaymentRef.current as unknown as any
      ).onSubmit(e);

      if (paymentRes) {
        const { status } = paymentRes;
        if (status === AppraisalTaskPaymentStatus.complete) {
          setPaymentStatus(status as string as AppraisalTaskPaymentStatus);
          setFormState('afterPayment');
        }
      }

      setPaymentLoading(false);
    },
    [],
  );

  const fetchData = async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      return;
    }
    try {
      const {
        data: {
          haveAppraisal,
          appraisalFiles,
          isExpedited,

          firstName,
          lastName,
          email,
          phoneNumber,
          instructions,

          paymentStatus,

          appraisalStatus,
          appraisalStatusDetail,
        },
      } = await _fetchAppraisalData(loanId);

      setFormState(
        paymentStatus === AppraisalTaskPaymentStatus.undone
          ? 'profile'
          : 'afterPayment',
      );

      setProfileData({
        haveAppraisal: haveAppraisal ?? false,
        appraisalFiles: appraisalFiles ?? [],

        isExpedited: isExpedited ?? false,

        firstName: firstName ?? '',
        lastName: lastName ?? '',
        email: email ?? '',
        phoneNumber: phoneNumber ?? '',
        instructions: instructions ?? '',
      });

      setPaymentStatus(paymentStatus);
      setAppraisalStatus(appraisalStatus);
      setAppraisalDetail(appraisalStatusDetail);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  };

  const { loading } = useAsync(fetchData, [location.href]);

  const renderFormNode = useMemo(() => {
    switch (formState) {
      case 'profile':
        return (
          <Stack
            alignItems={'center'}
            gap={{ xs: 3, lg: 6 }}
            justifyContent={'flex-start'}
            maxWidth={648}
            mx={'auto'}
            px={{ lg: 3, xs: 0 }}
            width={'100%'}
          >
            <Typography
              color={'text.primary'}
              fontSize={{ xs: 20, lg: 24 }}
              textAlign={'center'}
              variant={'h5'}
            >
              Appraisal
            </Typography>

            <AppraisalProfile
              nextState={profileLoading}
              nextStep={async (postData) => {
                await updateAppraisalProfileAndGetPaymentDetails(postData);
              }}
              profileData={profileData}
            />
          </Stack>
        );
      case 'payment':
        return (
          <Fade in={!profileLoading}>
            <Box>
              <AppraisalPayment
                backState={backToProfileLoading}
                backStep={async () => {
                  setBackToProfileLoading(true);
                  await fetchData();
                  setFormState('profile');
                }}
                nextState={paymentLoading}
                nextStep={async (e) => {
                  await handlePayment(e);
                }}
                paymentDetail={paymentDetail}
                ref={appraisalPaymentRef}
              />
            </Box>
          </Fade>
        );
      case 'afterPayment':
        if (appraisalStatus === AppraisalStatusEnum.not_started) {
          return <AppraisalPaymentStatus paymentStatus={paymentStatus} />;
        }
        return (
          <AppraisalStatus
            appraisalDetail={appraisalDetail}
            appraisalStage={appraisalStatus}
          />
        );
    }
  }, [
    formState,
    profileLoading,
    profileData,
    loading,
    paymentLoading,
    paymentDetail,
    appraisalStatus,
    appraisalDetail,
    updateAppraisalProfileAndGetPaymentDetails,
    fetchData,
    handlePayment,
    paymentStatus,
  ]);

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
        gap={{ xs: 3, lg: 6 }}
        justifyContent={'flex-start'}
        maxWidth={900}
        mx={{ lg: 'auto', xs: 0 }}
        px={{ lg: 3, xs: 0 }}
        width={'100%'}
      >
        {renderFormNode}
      </Stack>
    </Fade>
  );
};
