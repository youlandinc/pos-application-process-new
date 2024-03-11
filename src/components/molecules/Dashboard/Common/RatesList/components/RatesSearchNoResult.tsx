import { Dispatch, FC, SetStateAction, useState } from 'react';
import { Grow, Icon, Stack, Typography } from '@mui/material';
import { CallOutlined, MailOutlineOutlined } from '@mui/icons-material';

import { POSFormatUSPhoneToText } from '@/utils';
import { useSessionStorageState } from '@/hooks';

import { RatesCustomLoan } from './RatesCustomLoan';

import NOTIFICATION_INFO from '@/components/atoms/StyledNotification/notification_info.svg';
import { CustomRateData, UserType } from '@/types';

interface RatesSearchNoResultProps {
  reasonList?: string[];
  userType?: UserType;
  customLoan?: CustomRateData;
  setCustomLoan: Dispatch<SetStateAction<CustomRateData>>;
  onCustomLoanClick?: () => void;
  customLoading?: boolean;
  condition: boolean;
  productType?: string | 'CUSTOM_LOAN';
}

export const RatesSearchNoResult: FC<RatesSearchNoResultProps> = ({
  reasonList,
  userType,
  customLoan,
  setCustomLoan,
  onCustomLoanClick,
  customLoading,
  condition,
  productType,
}) => {
  const [showMore, setShowMore] = useState(false);
  const { saasState } = useSessionStorageState('tenantConfig');

  return (
    <>
      <Stack
        alignItems={'center'}
        gap={6}
        justifyContent={'center'}
        maxWidth={900}
        mb={3}
        width={'100%'}
      >
        {reasonList && reasonList.length > 0 && (
          <Stack
            bgcolor={'rgba(214, 228, 255, 0.20)'}
            borderRadius={2}
            px={3}
            py={1.5}
            sx={{
              transitions: 'all .3s',
            }}
            width={'100%'}
          >
            <Stack
              alignItems={{ md: 'center', xs: 'left' }}
              flexDirection={{ md: 'row', xs: 'column' }}
              gap={1}
            >
              <Stack flexDirection={'row'} gap={1}>
                <Icon component={NOTIFICATION_INFO} />
                <Typography
                  color={'info.dark'}
                  mt={0.375}
                  variant={'subtitle2'}
                >
                  {condition
                    ? 'No standard loan products match your criteria. Proceed by using custom loan terms below.'
                    : 'Unfortunately, we couldn’t find any eligible loan products.'}
                </Typography>
              </Stack>

              <Typography
                color={'info.dark'}
                onClick={() => {
                  setShowMore(!showMore);
                }}
                sx={{
                  cursor: 'pointer',
                  textDecoration: 'underline',
                  pl: { xs: 4, md: 0 },
                }}
                variant={'body2'}
              >
                {!showMore ? 'Show' : 'Hide'} reason
                {reasonList.length !== 1 && 's'}
              </Typography>
            </Stack>
            {showMore && (
              <Stack
                component={'ul'}
                gap={1}
                mt={1.5}
                sx={{
                  listStylePosition: 'inside',
                  listStyleType: 'disc',
                  pl: { md: 1.25, xs: 4 },
                }}
              >
                {reasonList!.map((item, index) => (
                  <Grow
                    in={showMore}
                    key={`${item}_${index}`}
                    timeout={(index + 1) * 300}
                  >
                    <Typography
                      color={'text.primary'}
                      component={'li'}
                      textAlign={'left'}
                      variant={'body3'}
                    >
                      {item}
                    </Typography>
                  </Grow>
                ))}
              </Stack>
            )}
          </Stack>
        )}

        {condition && (
          <Stack alignItems={'center'} my={2} width={'100%'}>
            <RatesCustomLoan
              customLoading={customLoading!}
              customLoan={customLoan!}
              onCustomLoanClick={onCustomLoanClick}
              productType={productType}
              setCustomLoan={setCustomLoan!}
              userType={userType!}
            />
          </Stack>
        )}

        <Stack gap={1.5}>
          {!condition && (
            <Typography mt={3} textAlign={'center'} variant={'h5'}>
              Can&apos;t find any rates? We can help
            </Typography>
          )}

          <Typography
            color={'info.main'}
            textAlign={'center'}
            variant={'body1'}
          >
            If you have any questions, feel free to contact us and we&apos;ll
            help you out.
          </Typography>
          <Stack
            alignItems={'center'}
            color={'info.main'}
            flexDirection={{ md: 'row', xs: 'column' }}
            fontWeight={600}
            gap={3}
            justifyContent={'center'}
            maxWidth={900}
            width={'100%'}
          >
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              gap={1.5}
              justifyContent={'center'}
            >
              <CallOutlined />
              {POSFormatUSPhoneToText(
                saasState?.posSettings?.phone || '(833) 968-5263',
              )}
            </Stack>
            <Stack
              alignItems={'center'}
              flexDirection={'row'}
              gap={1.5}
              justifyContent={'center'}
            >
              <MailOutlineOutlined />
              {saasState?.posSettings?.email || 'borrow@youland.com'}
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
