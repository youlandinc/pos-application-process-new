import { FC, useCallback, useMemo, useState } from 'react';
import { Box, Fade, Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import { useAsync } from 'react-use';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION } from '@/constants';
import { useBreakpoints } from '@/hooks';
import { POSGetParamsFromUrl } from '@/utils';

import { StyledLoading } from '@/components/atoms';
import {
  AppraisalPayment,
  AppraisalPaymentStatus,
  AppraisalProfile,
  AppraisalProfileData,
  AppraisalSendLink,
  AppraisalStatus,
  AppraisalStatusProps,
} from '@/components/molecules';

import {
  AppraisalStatusEnum,
  AppraisalTaskPaymentStatus,
  DashboardPaymentDetailsResponse,
  HttpError,
  UserType,
} from '@/types';
import {
  _fetchAppraisalData,
  _fetchAppraisalPaymentData,
  _updateAppraisalData,
} from '@/requests/dashboard';

export const Appraisal: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { userType, dashboardInfo } = useMst();
  const breakpoint = useBreakpoints();

  const [formState, setFormState] = useState<
    'profile' | 'payment' | 'afterPayment' | 'sendLink'
  >('sendLink');

  const [backToProfileLoading, setBackToProfileLoading] = useState(false);

  const [profileLoading, setProfileLoading] = useState(false);
  const [profileData, setProfileData] = useState<AppraisalProfileData>({
    haveAppraisal: false,
    appraisalFiles: [],
    isExpedited: false,
    isNeedToSend: false,
    isNeedToFill: false,
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

  const [paymentDetail, setPaymentDetail] = useState<
    DashboardPaymentDetailsResponse | undefined
  >();

  const updateAppraisalProfileAndGetPaymentDetails = useCallback(
    async (params: AppraisalProfileData) => {
      setProfileLoading(true);
      try {
        await _updateAppraisalData(params);
        if (!params.haveAppraisal && !params.isNeedToSend) {
          const { data } = await _fetchAppraisalPaymentData({
            loanId: router.query.loanId as string,
          });
          setPaymentDetail(data);
          setFormState('payment');
          return;
        }
        !params.haveAppraisal &&
          setFormState(!params.isNeedToSend ? 'payment' : 'sendLink');
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

  const handlePayment = useCallback(async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      enqueueSnackbar('Invalid loan ID', {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
      return;
    }
    try {
      const {
        data: { paymentStatus, appraisalStatus, appraisalStatusDetail },
      } = await _fetchAppraisalData(loanId);

      if (paymentStatus === AppraisalTaskPaymentStatus.complete) {
        setFormState('afterPayment');
        setPaymentStatus(paymentStatus);
        setAppraisalStatus(appraisalStatus);
        setAppraisalDetail(appraisalStatusDetail);
      }
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  }, [enqueueSnackbar]);

  const fetchData = useCallback(async () => {
    const { loanId } = POSGetParamsFromUrl(location.href);
    if (!loanId) {
      await router.push('/pipeline');
      enqueueSnackbar('Invalid loan ID', {
        variant: 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
      });
      return;
    }
    try {
      const {
        data: {
          haveAppraisal,
          appraisalFiles,
          isExpedited,
          isNeedToFill,
          isNeedToSend,

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

      setProfileData({
        haveAppraisal:
          dashboardInfo?.additionalAddress?.length > 0
            ? true
            : (haveAppraisal ?? false),
        appraisalFiles: appraisalFiles ?? [],

        isExpedited: isExpedited ?? false,
        isNeedToFill: isNeedToFill ?? true,
        isNeedToSend: isNeedToSend ?? false,

        firstName: firstName ?? '',
        lastName: lastName ?? '',
        email: email ?? '',
        phoneNumber: phoneNumber ?? '',
        instructions: instructions ?? '',
      });

      setPaymentStatus(paymentStatus);
      setAppraisalStatus(appraisalStatus);
      setAppraisalDetail(appraisalStatusDetail);

      setFormState(
        paymentStatus === AppraisalTaskPaymentStatus.undone
          ? isNeedToSend
            ? 'sendLink'
            : 'profile'
          : 'afterPayment',
      );
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  }, [dashboardInfo?.additionalAddress?.length, enqueueSnackbar, router]);

  const { loading } = useAsync(fetchData, [location.href]);

  const renderFormNode = useMemo(() => {
    switch (formState) {
      case 'profile':
        return (
          <Stack flexDirection={'row'} gap={3}>
            <Stack
              gap={{ xs: 3, lg: 6 }}
              justifyContent={'flex-start'}
              width={'100%'}
            >
              <Typography color={'text.primary'} fontSize={{ xs: 20, lg: 24 }}>
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
            {['xl', 'xxl'].includes(breakpoint) && (
              <Stack
                bgcolor={'#F8F9FC'}
                borderRadius={2}
                flexShrink={0}
                gap={3}
                height={'fit-content'}
                ml={'auto'}
                p={3}
                width={440}
              >
                <Typography variant={'subtitle3'}>Appraisal FAQs</Typography>
                <Stack fontSize={14} fontWeight={600}>
                  What is an appraisal?
                  <Typography variant={'body2'}>
                    An appraisal determines the fair market value of the
                    property. It&apos;s required to ensure the property value
                    aligns with the loan amount.
                  </Typography>
                </Stack>

                <Stack fontSize={14} fontWeight={600}>
                  Can I use a previous appraisal?
                  <Typography variant={'body2'}>
                    You may use a previous appraisal from the past 90 days.
                  </Typography>
                </Stack>

                {userType === UserType.BROKER && (
                  <Stack fontSize={14} fontWeight={600}>
                    What is the payment link?
                    <Typography variant={'body2'}>
                      As a broker, you may send borrowers a white-labeled
                      payment portal to accept the appraisal payment.
                    </Typography>
                  </Stack>
                )}

                <Stack fontSize={14} fontWeight={600}>
                  Is it necessary to fill out property access instructions?
                  <Typography variant={'body2'}>
                    While optional, providing access instructions ensures the
                    appraiser can enter the property without hassle. Omitting
                    this information may result in scheduling issues or require
                    further communication.
                  </Typography>
                </Stack>

                <Stack fontSize={14} fontWeight={600}>
                  Who do I contact if I have issues with the appraisal?
                  <Typography variant={'body2'}>
                    If you encounter any issues or have questions, please
                    contact your support team using the information on the
                    &quot;Team&quot; tab.
                  </Typography>
                </Stack>
              </Stack>
            )}
          </Stack>
        );
      case 'sendLink':
        return (
          <AppraisalSendLink
            backState={backToProfileLoading}
            backStep={async () => {
              setBackToProfileLoading(true);
              await fetchData();
              setFormState('profile');
            }}
          />
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
                callback={handlePayment}
                nextState={false}
                nextStep={async () => {
                  return;
                }}
                paymentDetail={paymentDetail}
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
            email={profileData.email}
            firstName={profileData.firstName}
            instructions={profileData.instructions}
            lastName={profileData.lastName}
            phoneNumber={profileData.phoneNumber}
          />
        );
    }
  }, [
    formState,
    profileLoading,
    profileData,
    breakpoint,
    userType,
    backToProfileLoading,
    handlePayment,
    paymentDetail,
    appraisalStatus,
    appraisalDetail,
    updateAppraisalProfileAndGetPaymentDetails,
    fetchData,
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
        width={'100%'}
      >
        {renderFormNode}
      </Stack>
    </Fade>
  );
});
