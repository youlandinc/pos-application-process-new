import { FC, useState } from 'react';
import { CallOutlined, MailOutlineOutlined } from '@mui/icons-material';
import { Grow, Icon, Stack, Typography } from '@mui/material';

import NOTIFICATION_INFO from '@/components/atoms/StyledNotification/notification_info.svg';

export const RatesSearchNoResult: FC<{ reasonList?: string[] }> = ({
  reasonList,
}) => {
  const [showMore, setShowMore] = useState(false);

  return (
    <>
      <Stack
        alignItems={'center'}
        gap={3}
        justifyContent={'center'}
        maxWidth={900}
        mb={3}
        mt={3}
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
                  Unfortunately, we couldn&apos;t find any eligible loan
                  products.
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

        {/*<Icon component={RATE_NO_RESULT} sx={{ width: 260, height: 220 }} />*/}
        <Typography
          color={'text.primary'}
          mt={reasonList ? { md: 6, xs: 4 } : 0}
          textAlign={'center'}
          variant={'h4'}
        >
          Based on your information, we couldn&apos;t find any options.
        </Typography>
        <Typography color={'info.main'} textAlign={'center'} variant={'body1'}>
          We&apos;ll help you out. Feel free to contact us using the methods
          below.
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
            (833) 968-5263
          </Stack>
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            gap={1.5}
            justifyContent={'center'}
          >
            <MailOutlineOutlined />
            borrow@youland.com
          </Stack>
        </Stack>
      </Stack>
    </>
  );
};
