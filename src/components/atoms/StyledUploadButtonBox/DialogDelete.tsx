import { FC } from 'react';

import { Box, Stack } from '@mui/material';
import { DeleteForeverOutlined } from '@mui/icons-material';

import {
  StyledButton,
  StyledDialog,
  UploadButtonDialog,
} from '@/components/atoms';
import { SUploadData } from '@/models/common/UploadFile';

interface DialogDeleteProps extends UploadButtonDialog {
  deleteItem: SUploadData;
  onClickDelete: () => Promise<void>;
  loading: boolean;
}

export const DialogDelete: FC<DialogDeleteProps> = ({
  visible,
  onClose,
  deleteItem,
  onClickDelete,
  loading,
}) => {
  return (
    <StyledDialog
      content={
        <Box
          color={'#9095A3'}
          fontSize={14}
          fontWeight={400}
          lineHeight={1.5}
          py={3}
          sx={{
            overflow: 'hidden',
            wordBreak: 'break-all',
          }}
        >
          {`Are you sure you want to delete ${deleteItem?.originalFileName}`}
        </Box>
      }
      footer={
        <Stack flexDirection={'row'} gap={1} mt={3}>
          <StyledButton
            autoFocus
            color={'info'}
            onClick={close}
            size={'small'}
            sx={{ width: 88 }}
            variant={'outlined'}
          >
            Cancel
          </StyledButton>
          <StyledButton
            autoFocus
            color={'error'}
            disabled={loading}
            loading={loading}
            onClick={onClickDelete}
            size={'small'}
            sx={{ width: 88 }}
          >
            Confirm
          </StyledButton>
        </Stack>
      }
      header={
        <>
          <DeleteForeverOutlined
            sx={{
              mr: 1.5,
              lineHeight: '28px',
              verticalAlign: 'middle',
            }}
          />
          Delete?
        </>
      }
      onClose={(event, reason) => {
        if (reason !== 'backdropClick') {
          onClose();
        }
      }}
      open={visible}
    />
  );
};
