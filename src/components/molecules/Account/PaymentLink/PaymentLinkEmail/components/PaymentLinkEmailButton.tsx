import { StyledButton } from '@/components/atoms';

interface PaymentLinkEmailButtonProps {
  onOpenDialog: () => void;
  viewLoading: boolean;
}

export const PaymentLinkEmailButton = ({
  onOpenDialog,
  viewLoading,
}: PaymentLinkEmailButtonProps) => {
  return (
    <StyledButton
      disabled={viewLoading}
      loading={viewLoading}
      onClick={onOpenDialog}
      size={'small'}
      sx={{
        width: 220,
        flexShrink: 0,
      }}
      variant={'outlined'}
    >
      Change email domain
    </StyledButton>
  );
};
