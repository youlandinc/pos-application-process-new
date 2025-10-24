import { Icon, Stack, Typography } from '@mui/material';

import { PaymentLinkEmailButton } from './PaymentLinkEmailButton';
import ICON_REFRESH from '../../icon_refresh.svg';

interface PaymentLinkEmailHeaderProps {
  onOpenDialog: () => void;
  onRefresh: () => void;
  viewLoading: boolean;
  isSmall: boolean;
}

export const PaymentLinkEmailHeader = ({
  onOpenDialog,
  onRefresh,
  viewLoading,
  isSmall,
}: PaymentLinkEmailHeaderProps) => {
  return (
    <Stack
      alignItems={'flex-start'}
      flexDirection={'row'}
      gap={3}
      justifyContent={'space-between'}
    >
      <Typography
        color={'text.primary'}
        component={'div'}
        fontSize={{ xs: 16, lg: 18 }}
        fontWeight={600}
      >
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          gap={1}
          lineHeight={1}
        >
          Set email domain
          <Icon
            component={ICON_REFRESH}
            onClick={onRefresh}
            sx={{ pb: 0.25, width: 24, height: 24, cursor: 'pointer' }}
          />
        </Stack>
        <Typography
          color={'text.secondary'}
          component={'p'}
          fontSize={{ xs: 12, lg: 14 }}
          mt={1}
        >
          Send payment link emails to the borrower using your custom email
          domain. username is the part of the email address before the @ symbol,
          while the email domain is the part that comes after the symbol (ex:
          username@email-domain.com)
        </Typography>
      </Typography>
      {!isSmall && (
        <PaymentLinkEmailButton
          onOpenDialog={onOpenDialog}
          viewLoading={viewLoading}
        />
      )}
    </Stack>
  );
};
