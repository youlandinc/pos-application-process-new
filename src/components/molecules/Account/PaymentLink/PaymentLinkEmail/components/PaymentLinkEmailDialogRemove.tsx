import { Icon, Stack, Typography } from '@mui/material';

import { StyledButton, StyledDialog } from '@/components/atoms';
import { EmailDomainDetails } from '@/types';

import ICON_DELETE from '../../icon_delete.svg';

interface PaymentLinkEmailDialogRemoveProps {
  deleteItem?: EmailDomainDetails;
  deleteClose: () => void;
  deleteLoading: boolean;
  onClickToDelete: () => void;
  deleteVisible: boolean;
}

export const PaymentLinkEmailDialogRemove = ({
  deleteItem,
  deleteClose,
  deleteLoading,
  onClickToDelete,
  deleteVisible,
}: PaymentLinkEmailDialogRemoveProps) => {
  return (
    <StyledDialog
      content={
        <Typography color={'text.secondary'} my={2} variant={'body2'}>
          Are you sure you want to delete{' '}
          <Typography
            color={'text.primary'}
            component={'span'}
            fontSize={14}
            fontWeight={500}
          >
            {deleteItem?.email || deleteItem?.emailDomain}
          </Typography>
          ?
        </Typography>
      }
      footer={
        <Stack
          flexDirection={'row'}
          gap={1.5}
          justifyContent={'flex-end'}
          width={'100%'}
        >
          <StyledButton
            color={'info'}
            onClick={deleteClose}
            size={'small'}
            sx={{ width: 80 }}
            variant={'outlined'}
          >
            Cancel
          </StyledButton>
          <StyledButton
            color={'error'}
            disabled={deleteLoading}
            loading={deleteLoading}
            onClick={onClickToDelete}
            size={'small'}
            sx={{ width: 80 }}
          >
            Delete
          </StyledButton>
        </Stack>
      }
      header={
        <Stack alignItems={'center'} flexDirection={'row'} gap={1.5}>
          <Icon component={ICON_DELETE} sx={{ width: 24, height: 24 }} />
          <Typography variant={'h6'}>Delete</Typography>
        </Stack>
      }
      open={deleteVisible}
    />
  );
};
