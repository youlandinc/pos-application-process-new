import { FC, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import {
  StyledButton,
  StyledDatePicker,
  StyledTextField,
  StyledTextFieldPhone,
} from '@/components/atoms';

export const SettingsChangeProfile: FC = () => {
  const [birthDate, setBirthDate] = useState<Date | null>(new Date());
  const [phone, setPhone] = useState('');

  return (
    <Stack border={'1px solid #D2D6E1'} borderRadius={2} gap={3} p={3}>
      <Typography variant={'h6'}>Personal information</Typography>

      <Stack flexDirection={'row'} gap={3}>
        <StyledTextField
          label={'First name'}
          placeholder={'First name'}
          required
        />
        <StyledTextField
          label={'Last name'}
          placeholder={'Last name'}
          required
        />
      </Stack>

      <StyledDatePicker
        disableFuture={false}
        label={'Date of birth'}
        onChange={(value) => {
          setBirthDate(value as Date);
        }}
        value={birthDate}
      />

      <Stack flexDirection={'row'} gap={3}>
        <StyledTextFieldPhone
          label={'Phone number'}
          onValueChange={({ value }) => {
            setPhone(value);
          }}
          placeholder={'Phone number'}
          value={phone}
        />
        <StyledTextField
          label={'Contact email'}
          placeholder={'Contact email'}
          required
        />
      </Stack>

      <StyledButton sx={{ width: { xs: 180, lg: 200 } }}>
        Change info
      </StyledButton>
    </Stack>
  );
};
