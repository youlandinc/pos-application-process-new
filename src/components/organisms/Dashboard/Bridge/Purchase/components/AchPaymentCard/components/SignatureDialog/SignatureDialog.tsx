import { Icon, Stack, Typography } from '@mui/material';
import React, { FC, useRef } from 'react';
import SignaturePad from 'react-signature-pad-wrapper';

import {
  StyledButton,
  StyledDialog,
  StyledDialogProps,
} from '@/components/atoms';

import ICON_CLEAR from '@/svg/dashboard/payment_signature_clear.svg';

type SignatureDialogProps = {
  handleCancel?: () => void;
  onSave?: (url: string) => void;
  loading?: boolean;
} & StyledDialogProps;

export const SignatureDialog: FC<SignatureDialogProps> = ({
  onClose,
  handleCancel,
  onSave,
  ...rest
}) => {
  const ref = useRef<SignaturePad | null>(null);

  const handleSave = () => {
    if (ref.current !== null) {
      const signaturePad = ref.current;
      const dataUrl = signaturePad!.toDataURL();
      // const file = dataURLToBlob(dataUrl);
      console.log(signaturePad?.isEmpty());
      onSave?.(dataUrl);
    }
  };
  const handleClear = () => {
    if (ref.current !== null) {
      ref.current?.instance?.clear();
    }
  };

  return (
    <StyledDialog
      content={
        <Stack pt={3} spacing={1.5}>
          <Stack
            alignItems={'center'}
            direction={'row'}
            justifyContent={'space-between'}
          >
            <Typography variant={'subtitle1'}>Signature:</Typography>
            <Stack
              alignItems={'center'}
              direction={'row'}
              onClick={handleClear}
              spacing={0.5}
              sx={{ cursor: 'pointer' }}
            >
              <Icon component={ICON_CLEAR} sx={{ width: 20, height: 20 }} />
              <Typography color={'info.main'} variant={'subtitle1'}>
                Clear
              </Typography>
            </Stack>
          </Stack>
          <Stack
            border={'1px dashed'}
            borderColor={'info.main'}
            borderRadius={2}
          >
            <SignaturePad
              options={{ minWidth: 2, maxWidth: 2, penColor: '#000' }}
              ref={ref}
            />
          </Stack>
        </Stack>
      }
      footer={
        <>
          <StyledButton
            color="info"
            onClick={() => {
              onClose?.({}, 'backdropClick');
            }}
            variant="outlined"
          >
            Cancel
          </StyledButton>
          <StyledButton
            color="primary"
            onClick={handleSave}
            variant="contained"
          >
            Save
          </StyledButton>
        </>
      }
      onClose={onClose}
      {...rest}
    />
  );
};
