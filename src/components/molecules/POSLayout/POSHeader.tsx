import { TEST_ID, YOULAND_ID } from '@/constants';
import { useCallback, useMemo, useState } from 'react';
import { Box, Icon, Stack, Typography } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  useBreakpoints,
  usePersistFn,
  useSessionStorageState,
  useSwitch,
} from '@/hooks';

import { POSFormatUrl, POSNotUndefined } from '@/utils';
import {
  StyledButton,
  StyledDialog,
  StyledHeaderLogo,
} from '@/components/atoms';
import { ForgotPassword, Login, SignUp } from '@/components/molecules';
import { POSMenuList, POSMyAccountButton } from './index';

import {
  LayoutSceneTypeEnum,
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanSnapshotEnum,
  UserType,
} from '@/types';

import ICON_REFER_FRIEND from './assets/icon_refer_friend.svg';
import ICON_VIEW_ALL_LOANS from './assets/icon_view_all_loans.svg';
import ICON_START_NEW_LOAN from './assets/icon_start_new_loan.svg';

export interface POSHeaderProps {
  scene: LayoutSceneTypeEnum;
  loading?: boolean;
}

const NOT_LOGIN = [
  LoanSnapshotEnum.starting_question,
  LoanSnapshotEnum.estimate_rate,
  LoanSnapshotEnum.auth_page,
  LoanSnapshotEnum.loan_address,
  //LoanSnapshotEnum.background_information,
  LoanSnapshotEnum.loan_summary,
];

const LOGIN_NOT_BROKER = [
  LoanSnapshotEnum.starting_question,
  LoanSnapshotEnum.estimate_rate,
  LoanSnapshotEnum.loan_address,
  //LoanSnapshotEnum.background_information,
  LoanSnapshotEnum.select_executive,
  LoanSnapshotEnum.loan_summary,
];

const LOGIN_BROKER = [
  LoanSnapshotEnum.starting_question,
  LoanSnapshotEnum.estimate_rate,
  LoanSnapshotEnum.loan_address,
  //LoanSnapshotEnum.background_information,
  LoanSnapshotEnum.compensation_page,
  LoanSnapshotEnum.loan_summary,
];

const MULTIFAMILY_NOT_LOGIN = [
  LoanSnapshotEnum.starting_question,
  LoanSnapshotEnum.enter_loan_info,
  LoanSnapshotEnum.auth_page,
  LoanSnapshotEnum.loan_address,
  //LoanSnapshotEnum.background_information,
  LoanSnapshotEnum.loan_summary,
];

const MULTIFAMILY_LOGIN_NOT_BROKER = [
  LoanSnapshotEnum.starting_question,
  LoanSnapshotEnum.enter_loan_info,
  LoanSnapshotEnum.loan_address,
  //LoanSnapshotEnum.background_information,
  LoanSnapshotEnum.loan_summary,
];

const MULTIFAMILY_LOGIN_BROKER = [
  LoanSnapshotEnum.starting_question,
  LoanSnapshotEnum.enter_loan_info,
  LoanSnapshotEnum.loan_address,
  //LoanSnapshotEnum.background_information,
  LoanSnapshotEnum.compensation_page,
  LoanSnapshotEnum.loan_summary,
];

const LAND_NOT_LOGIN = [
  LoanSnapshotEnum.starting_question,
  LoanSnapshotEnum.land_readiness,
  LoanSnapshotEnum.estimate_rate,
  LoanSnapshotEnum.auth_page,
  LoanSnapshotEnum.loan_address,
  //LoanSnapshotEnum.background_information,
  LoanSnapshotEnum.loan_summary,
];

const LAND_LOGIN_NOT_BROKER = [
  LoanSnapshotEnum.starting_question,
  LoanSnapshotEnum.land_readiness,
  LoanSnapshotEnum.estimate_rate,
  LoanSnapshotEnum.loan_address,
  //LoanSnapshotEnum.background_information,
  LoanSnapshotEnum.loan_summary,
];

const LAND_LOGIN_BROKER = [
  LoanSnapshotEnum.starting_question,
  LoanSnapshotEnum.land_readiness,
  LoanSnapshotEnum.estimate_rate,
  LoanSnapshotEnum.loan_address,
  //LoanSnapshotEnum.background_information,
  LoanSnapshotEnum.compensation_page,
  LoanSnapshotEnum.loan_summary,
];

const COMMERCIAL = [
  LoanSnapshotEnum.contact_info,
  LoanSnapshotEnum.thank_you_page,
];

export const POSHeader = observer<POSHeaderProps>(({ scene, loading }) => {
  const router = useRouter();
  const store = useMst();

  const breakpoint = useBreakpoints();
  const { visible, open, close } = useSwitch(false);
  const { saasState } = useSessionStorageState('tenantConfig');

  const { session, applicationForm, userType } = store;

  const { snapshot, productCategory, propertyType } = applicationForm;

  const [authType, setAuthType] = useState<
    'login' | 'sign_up' | 'reset_password'
  >('login');

  const hasSession = useMemo<boolean>(() => !!session, [session]);

  const calculateProgress = useMemo(() => {
    if (scene !== LayoutSceneTypeEnum.application) {
      return undefined;
    }

    const getProgress = (list: LoanSnapshotEnum[]) => {
      const index = list.indexOf(snapshot);
      if (list.length === 2) {
        return index < 0 ? undefined : ((index + 1) / list.length) * 100 || 0;
      }
      return index < 0 ? undefined : (index / list.length) * 100 || 0;
    };

    const isEnterLoanInfo =
      productCategory === LoanProductCategoryEnum.dscr_rental ||
      propertyType === LoanPropertyTypeEnum.multifamily;

    const isContactInfo = propertyType === LoanPropertyTypeEnum.commercial;

    const isLand = productCategory === LoanProductCategoryEnum.land;

    if (isLand) {
      if (hasSession) {
        return userType === UserType.CUSTOMER
          ? getProgress(LAND_LOGIN_NOT_BROKER)
          : getProgress(LAND_LOGIN_BROKER);
      }
      return getProgress(LAND_NOT_LOGIN);
    }

    if (isContactInfo) {
      return getProgress(COMMERCIAL);
    }

    if (hasSession) {
      return userType === UserType.CUSTOMER
        ? getProgress(
            isEnterLoanInfo
              ? MULTIFAMILY_LOGIN_NOT_BROKER
              : saasState?.posSettings?.hasExecutiveQuestion === false
                ? LOGIN_NOT_BROKER.filter(
                    (item) => item !== LoanSnapshotEnum.select_executive,
                  )
                : LOGIN_NOT_BROKER,
          )
        : getProgress(
            isEnterLoanInfo ? MULTIFAMILY_LOGIN_BROKER : LOGIN_BROKER,
          );
    }

    return getProgress(isEnterLoanInfo ? MULTIFAMILY_NOT_LOGIN : NOT_LOGIN);
  }, [
    hasSession,
    productCategory,
    propertyType,
    saasState?.posSettings?.hasExecutiveQuestion,
    scene,
    snapshot,
    userType,
  ]);

  const handledLoginSuccess = usePersistFn(() => {
    close();
  });

  const handledSignUpAndResetSuccess = usePersistFn(() => {
    close();
    setAuthType('login');
  });

  const handledClose = useCallback(
    (
      e: MouseEvent,
      reason: 'backdropClick' | 'escapeKeyDown' | 'closeButtonClick',
    ) => {
      if (reason !== 'backdropClick') {
        close();
      }
    },
    [close],
  );

  const renderButton = useMemo(() => {
    switch (scene) {
      case LayoutSceneTypeEnum.application:
        return !hasSession ? (
          applicationForm.snapshot !== LoanSnapshotEnum.auth_page && (
            <Box>
              <StyledButton
                color={'info'}
                onClick={() => {
                  setAuthType('sign_up');
                  open();
                }}
                size={'small'}
                sx={{
                  '&.MuiButton-sizeSmall': {
                    p: { lg: '7px 14px', xs: '0' },
                    fontSize: 14,
                    width: 'fit-content',
                    mr: 3,
                    minWidth: 'auto',
                    '&:hover': {
                      bgcolor: 'transparent',
                    },
                  },
                }}
                variant={'text'}
              >
                Sign up
              </StyledButton>
              <StyledButton
                color={'info'}
                onClick={() => {
                  setAuthType('login');
                  open();
                }}
                size={'small'}
                sx={{
                  '&.MuiButton-sizeSmall': {
                    p: { lg: '7px 14px', xs: '0' },
                    fontSize: 14,
                    width: 'fit-content',
                    minWidth: 'auto',
                    '&:hover': {
                      bgcolor: 'transparent',
                    },
                  },
                }}
                variant={'text'}
              >
                Log in
              </StyledButton>
            </Box>
          )
        ) : (
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={{ xs: 2, lg: 1.5 }}
          >
            <StyledButton
              color={'info'}
              isIconButton={['xs', 'sm', 'md'].includes(breakpoint)}
              onClick={() => router.push('/pipeline')}
              size={'small'}
              sx={{
                borderWidth: '1px !important',
                fontWeight: '400 !important',
                p: ['xs', 'sm', 'md'].includes(breakpoint)
                  ? '0 !important'
                  : '',
              }}
              variant={'outlined'}
            >
              <Icon
                component={ICON_VIEW_ALL_LOANS}
                sx={{
                  width: 24,
                  height: 24,
                  mr: !['xs', 'sm', 'md'].includes(breakpoint) ? 1 : 0,
                }}
              />
              {!['xs', 'sm', 'md'].includes(breakpoint) && 'View all loans'}
            </StyledButton>
            {[YOULAND_ID, TEST_ID].includes(saasState?.tenantId) && (
              <StyledButton
                color={'info'}
                isIconButton={['xs', 'sm', 'md'].includes(breakpoint)}
                onClick={() =>
                  (location.href = 'https://youland.com/refer-a-friend/')
                }
                size={'small'}
                sx={{
                  mr: { xs: 0, lg: 2.5 },
                  borderWidth: '1px !important',
                  fontWeight: '400 !important',
                  p: ['xs', 'sm', 'md'].includes(breakpoint)
                    ? '0 !important'
                    : '',
                }}
                variant={'outlined'}
              >
                <Icon
                  component={ICON_REFER_FRIEND}
                  sx={{
                    width: 24,
                    height: 24,
                    mr: !['xs', 'sm', 'md'].includes(breakpoint) ? 1 : 0,
                  }}
                />
                {!['xs', 'sm', 'md'].includes(breakpoint) && 'Refer a friend'}
              </StyledButton>
            )}
            <POSMyAccountButton scene={scene} />
          </Stack>
        );
      case LayoutSceneTypeEnum.dashboard:
      case LayoutSceneTypeEnum.not_found:
        return (
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={{ xs: 2, lg: 1.5 }}
          >
            <StyledButton
              color={'info'}
              isIconButton={['xs', 'sm', 'md'].includes(breakpoint)}
              onClick={() => router.push('/pipeline')}
              size={'small'}
              sx={{
                borderWidth: '1px !important',
                fontWeight: '400 !important',
                p: ['xs', 'sm', 'md'].includes(breakpoint)
                  ? '0 !important'
                  : '',
              }}
              variant={'outlined'}
            >
              <Icon
                component={ICON_VIEW_ALL_LOANS}
                sx={{
                  width: 24,
                  height: 24,
                  mr: !['xs', 'sm', 'md'].includes(breakpoint) ? 1 : 0,
                }}
              />
              {!['xs', 'sm', 'md'].includes(breakpoint) && 'View all loans'}
            </StyledButton>
            <StyledButton
              color={'info'}
              isIconButton={['xs', 'sm', 'md'].includes(breakpoint)}
              onClick={() => router.push('/')}
              size={'small'}
              sx={{
                borderWidth: '1px !important',
                fontWeight: '400 !important',
                p: ['xs', 'sm', 'md'].includes(breakpoint)
                  ? '0 !important'
                  : '',
              }}
              variant={'outlined'}
            >
              <Icon
                component={ICON_START_NEW_LOAN}
                sx={{
                  width: 24,
                  height: 24,
                  mr: !['xs', 'sm', 'md'].includes(breakpoint) ? 1 : 0,
                }}
              />
              {!['xs', 'sm', 'md'].includes(breakpoint) && 'Start new loan'}
            </StyledButton>
            {[YOULAND_ID, TEST_ID].includes(saasState?.tenantId) && (
              <StyledButton
                color={'info'}
                isIconButton={['xs', 'sm', 'md'].includes(breakpoint)}
                onClick={() =>
                  (location.href = 'https://youland.com/refer-a-friend/')
                }
                size={'small'}
                sx={{
                  mr: { xs: 0, lg: 2.5 },
                  borderWidth: '1px !important',
                  fontWeight: '400 !important',
                  p: ['xs', 'sm', 'md'].includes(breakpoint)
                    ? '0 !important'
                    : '',
                }}
                variant={'outlined'}
              >
                <Icon
                  component={ICON_REFER_FRIEND}
                  sx={{
                    width: 24,
                    height: 24,
                    mr: !['xs', 'sm', 'md'].includes(breakpoint) ? 1 : 0,
                  }}
                />
                {!['xs', 'sm', 'md'].includes(breakpoint) && 'Refer a friend'}
              </StyledButton>
            )}
            <POSMyAccountButton scene={scene} />
          </Stack>
        );
      case LayoutSceneTypeEnum.account:
        return (
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={{ xs: 2, lg: 1.5 }}
          >
            <StyledButton
              color={'info'}
              isIconButton={['xs', 'sm', 'md'].includes(breakpoint)}
              onClick={() => router.push('/pipeline')}
              size={'small'}
              sx={{
                borderWidth: '1px !important',
                fontWeight: '400 !important',
                p: ['xs', 'sm', 'md'].includes(breakpoint)
                  ? '0 !important'
                  : '',
              }}
              variant={'outlined'}
            >
              <Icon
                component={ICON_VIEW_ALL_LOANS}
                sx={{
                  width: 24,
                  height: 24,
                  mr: !['xs', 'sm', 'md'].includes(breakpoint) ? 1 : 0,
                }}
              />
              {!['xs', 'sm', 'md'].includes(breakpoint) && 'View all loans'}
            </StyledButton>
            <StyledButton
              color={'info'}
              isIconButton={['xs', 'sm', 'md'].includes(breakpoint)}
              onClick={() => router.push('/')}
              size={'small'}
              sx={{
                borderWidth: '1px !important',
                fontWeight: '400 !important',
                p: ['xs', 'sm', 'md'].includes(breakpoint)
                  ? '0 !important'
                  : '',
              }}
              variant={'outlined'}
            >
              <Icon
                component={ICON_START_NEW_LOAN}
                sx={{
                  width: 24,
                  height: 24,
                  mr: !['xs', 'sm', 'md'].includes(breakpoint) ? 1 : 0,
                }}
              />
              {!['xs', 'sm', 'md'].includes(breakpoint) && 'Start new loan'}
            </StyledButton>
            {[YOULAND_ID, TEST_ID].includes(saasState?.tenantId) && (
              <StyledButton
                color={'info'}
                isIconButton={['xs', 'sm', 'md'].includes(breakpoint)}
                onClick={() =>
                  (location.href = 'https://youland.com/refer-a-friend/')
                }
                size={'small'}
                sx={{
                  mr: { xs: 0, lg: 2.5 },
                  borderWidth: '1px !important',
                  fontWeight: '400 !important',
                  p: ['xs', 'sm', 'md'].includes(breakpoint)
                    ? '0 !important'
                    : '',
                }}
                variant={'outlined'}
              >
                <Icon
                  component={ICON_REFER_FRIEND}
                  sx={{
                    width: 24,
                    height: 24,
                    mr: !['xs', 'sm', 'md'].includes(breakpoint) ? 1 : 0,
                  }}
                />
                {!['xs', 'sm', 'md'].includes(breakpoint) && 'Refer a friend'}
              </StyledButton>
            )}
            <POSMyAccountButton scene={scene} />
          </Stack>
        );
      case LayoutSceneTypeEnum.pipeline_without_all: {
        return (
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={{ xs: 2, lg: 1.5 }}
          >
            <StyledButton
              color={'info'}
              isIconButton={['xs', 'sm', 'md'].includes(breakpoint)}
              onClick={() => router.push('/')}
              size={'small'}
              sx={{
                borderWidth: '1px !important',
                fontWeight: '400 !important',
              }}
              variant={'outlined'}
            >
              <Icon
                component={ICON_START_NEW_LOAN}
                sx={{
                  width: 24,
                  height: 24,
                  mr: !['xs', 'sm', 'md'].includes(breakpoint) ? 1 : 0,
                }}
              />
              {!['xs', 'sm', 'md'].includes(breakpoint) && 'Start new loan'}
            </StyledButton>
            {[YOULAND_ID, TEST_ID].includes(saasState?.tenantId) && (
              <StyledButton
                color={'info'}
                isIconButton={['xs', 'sm', 'md'].includes(breakpoint)}
                onClick={() =>
                  (location.href = 'https://youland.com/refer-a-friend/')
                }
                size={'small'}
                sx={{
                  mr: { xs: 0, lg: 2.5 },
                  borderWidth: '1px !important',
                  fontWeight: '400 !important',
                  p: ['xs', 'sm', 'md'].includes(breakpoint)
                    ? '0 !important'
                    : '',
                }}
                variant={'outlined'}
              >
                <Icon
                  component={ICON_REFER_FRIEND}
                  sx={{
                    width: 24,
                    height: 24,
                    mr: !['xs', 'sm', 'md'].includes(breakpoint) ? 1 : 0,
                  }}
                />
                {!['xs', 'sm', 'md'].includes(breakpoint) && 'Refer a friend'}
              </StyledButton>
            )}
            <POSMyAccountButton scene={scene} />
          </Stack>
        );
      }
    }
  }, [
    scene,
    hasSession,
    applicationForm.snapshot,
    breakpoint,
    saasState?.tenantId,
    open,
    router,
  ]);

  const renderDialog = useMemo(() => {
    switch (authType) {
      case 'login':
        return {
          header: (
            <Box className={'POS_flex POS_jc_sb POS_al_c POS_fd_row'}>
              <Typography variant={'h6'}>
                Log in to {saasState?.dbaName}
              </Typography>
              <StyledButton color={'info'} isIconButton onClick={close}>
                <CloseOutlined />
              </StyledButton>
            </Box>
          ),
          content: <Login isNestForm successCb={handledLoginSuccess} />,
          footer: (
            <Box
              className={
                'POS_flex POS_jc_sb POS_al_c POS_fd_row POS_mt_3 POS_fullwidth'
              }
              sx={{
                justifyContent: { md: 'space-between', xs: 'center' },
                flexDirection: { md: 'row', xs: 'column' },
              }}
            >
              <Typography variant={'body2'}>
                Don&apos;t have an account?{' '}
                <Typography
                  component={'span'}
                  onClick={() => setAuthType('sign_up')}
                  sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                  variant={'body2'}
                >
                  Sign up
                </Typography>
              </Typography>
              <Typography
                color={'primary'}
                onClick={() => setAuthType('reset_password')}
                sx={{
                  color: 'primary.main',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
                variant={'body2'}
              >
                Forgot password?
              </Typography>
            </Box>
          ),
        };

      case 'reset_password':
        return {
          header: (
            <Box className={'POS_flex POS_jc_sb POS_al_c POS_fd_row'}>
              <Typography variant={'h6'}>Reset password</Typography>
              <StyledButton color={'info'} isIconButton onClick={close}>
                <CloseOutlined />
              </StyledButton>
            </Box>
          ),
          content: (
            <ForgotPassword
              isNestForm
              isRedirect={false}
              successCb={handledSignUpAndResetSuccess}
            />
          ),
          footer: (
            <Typography
              color={'info'}
              mt={3}
              onClick={() => setAuthType('login')}
              sx={{
                color: 'primary.main',
                cursor: 'pointer',
                fontWeight: 600,
              }}
              variant={'body2'}
            >
              Back to Log in
            </Typography>
          ),
        };

      case 'sign_up':
        return {
          header: (
            <Box className={'POS_flex POS_jc_sb POS_al_c POS_fd_row'}>
              <Typography variant={'h6'}>Sign up</Typography>
              <StyledButton color={'info'} isIconButton onClick={close}>
                <CloseOutlined />
              </StyledButton>
            </Box>
          ),
          content: (
            <SignUp
              isNestForm
              isRedirect={false}
              successCb={handledSignUpAndResetSuccess}
            />
          ),
          footer: (
            <Stack alignItems={'center'} mt={3} width={'100%'}>
              <Typography component={'div'} variant={'body2'}>
                Already have an account?{' '}
                <Typography
                  component={'span'}
                  onClick={() => setAuthType('login')}
                  sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                  variant={'body2'}
                >
                  Log in
                </Typography>
              </Typography>
              <Typography
                component={'div'}
                sx={{ color: 'info.main', mt: 3 }}
                variant={'body2'}
              >
                By signing up, you agree to our{' '}
                <Typography
                  component={'span'}
                  onClick={() =>
                    window.open(
                      POSFormatUrl(saasState?.legalAgreements?.termsUrl) ||
                        'https://corepass.com/legal/terms-and-conditions/',
                    )
                  }
                  sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                  variant={'body2'}
                >
                  Terms of Use{' '}
                </Typography>
                and{' '}
                <Typography
                  component={'span'}
                  onClick={() =>
                    window.open(
                      POSFormatUrl(
                        saasState?.legalAgreements?.privacyPolicyUrl,
                      ) || 'https://corepass.com/legal/privacy-policy/',
                    )
                  }
                  sx={{
                    color: 'primary.main',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                  variant={'body2'}
                >
                  Privacy Policy
                </Typography>
                ,
              </Typography>
              <Typography color={'text.secondary'} variant={'body2'}>
                and consent to receive loan-related emails and SMS from{' '}
                {saasState?.dbaName}.
              </Typography>
            </Stack>
          ),
        };
    }
  }, [
    authType,
    close,
    handledLoginSuccess,
    handledSignUpAndResetSuccess,
    saasState?.legalAgreements?.privacyPolicyUrl,
    saasState?.legalAgreements?.termsUrl,
    saasState?.dbaName,
  ]);

  return (
    <>
      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        justifyContent={'center'}
      >
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          height={92}
          px={{
            lg: 0,
            xs: 'clamp(24px,6.4vw,80px)',
          }}
          width={{
            xxl: 1440,
            xl: 1240,
            lg: 976,
            xs: '100%',
          }}
        >
          <StyledHeaderLogo scene={scene} />
          <Box sx={{ ml: 'auto' }}>{renderButton}</Box>
        </Stack>
        <StyledDialog
          content={renderDialog.content}
          disableEscapeKeyDown
          footer={renderDialog.footer}
          header={renderDialog.header}
          onClose={handledClose}
          open={visible}
          scroll={'body'}
          sx={{
            '& .MuiPaper-root': {
              maxWidth: '600px !important',
            },
          }}
        />
      </Stack>
      {scene === LayoutSceneTypeEnum.application &&
        POSNotUndefined(calculateProgress) && (
          <Stack
            alignItems={'center'}
            bgcolor={'#D2D6E1'}
            flexDirection={'row'}
            height={'1px'}
            mx={'auto'}
            position={'relative'}
            px={{
              lg: 0,
              xs: 'clamp(24px,6.4vw,80px)',
            }}
            width={{
              xxl: 1440,
              xl: 1240,
              lg: 976,
              xs: '100%',
            }}
          >
            <Stack
              bgcolor={'primary.main'}
              borderRadius={1}
              bottom={0}
              height={4}
              left={0}
              position={'absolute'}
              px={{
                lg: 0,
                xs: 'clamp(24px,6.4vw,80px)',
              }}
              sx={{ transition: 'width .3s' }}
              width={`${calculateProgress}%`}
            />
            {!['xs', 'sm', 'md'].includes(breakpoint) &&
              POSNotUndefined(calculateProgress) && (
                <Typography
                  color={'primary.main'}
                  sx={{ position: 'absolute', top: 8 }}
                  variant={'body2'}
                >
                  {Math.ceil(calculateProgress!)}%
                </Typography>
              )}
          </Stack>
        )}

      {scene === LayoutSceneTypeEnum.dashboard && (
        <Stack
          mt={{ xs: 0, lg: 2 }}
          mx={'auto'}
          px={{
            lg: 0,
            xs: 'clamp(24px,6.4vw,60px)',
          }}
          width={{
            xxl: 1440,
            xl: 1240,
            lg: 976,
            xs: '100%',
          }}
        >
          <POSMenuList loading={loading} scene={scene} />
        </Stack>
      )}
    </>
  );
});
