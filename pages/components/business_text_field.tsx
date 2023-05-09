import {
  StyledButton,
  StyledTextFieldNumber,
  StyledTextFieldPassword,
  StyledTextFieldPhone,
  StyledTextFieldSocialNumber,
} from '@/components/atoms';
import { POSFlex } from '@/styles';
import { Box, Divider, Typography } from '@mui/material';
import { FC, useState } from 'react';
import { useRouter } from 'next/router';

const BusinessTextFieldComponent: FC = () => {
  const router = useRouter();

  const [value1, setValue1] = useState<number>(0);
  const [value2, setValue2] = useState<number>(0);
  const [value3, setValue3] = useState('');
  const [ssn, setSSN] = useState<string>('123456789');
  const [phone, setPhone] = useState<string | number>('1111111');

  return (
    <Box
      sx={{
        p: 4,
        width: { lg: '50%', xs: '100%' },
        border: '1px solid rgba(145, 158, 171, 0.32)',
        borderRadius: 4,
        '& .component_wrap': {
          '& .divider': {
            my: 2,
          },
          '& .component_item': {
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            boxShadow: '1px 1px 3px 1px rgba(0,0,0,.38)',
            p: 4,
            borderRadius: 4,
          },
        },
      }}
    >
      <StyledButton
        onClick={() => router.back()}
        sx={{
          my: 3,
        }}
        variant={'outlined'}
      >
        back to components
      </StyledButton>

      <Box className={'component_wrap'}>
        <Typography variant={'h4'}>Status</Typography>
        <Divider className={'divider'} />
        <Box className={'component_item'}>
          <Box>
            <Typography mb={2} variant={'body1'}>
              TextField Number
            </Typography>
            <StyledTextFieldNumber
              label={'dollar'}
              onValueChange={(v) => {
                setValue1(v.floatValue ?? 0);
              }}
              placeholder={'dollar'}
              prefix={'$'}
              sx={{ width: 180 }}
              value={value1}
            />

            <StyledTextFieldNumber
              decimalScale={3}
              label={'percentage'}
              onValueChange={(v) => {
                setValue2(v.floatValue ?? 0);
              }}
              placeholder={'percentage'}
              suffix={'%'}
              sx={{ width: 180, ml: 5 }}
              value={value2}
            />
          </Box>
        </Box>
        <Box className={'component_item'} mt={5}>
          <Box>
            <Typography mb={2} variant={'body1'}>
              TextField Social Security Number
            </Typography>
            <Box sx={{ ...POSFlex('center', 'flex-start', 'row'), gap: 5 }}>
              <StyledTextFieldSocialNumber
                label={'Social Number'}
                onValueChange={(e) => setSSN(e)}
                placeholder={'Social Number'}
                sx={{ width: 180 }}
                value={ssn}
              />
              <Typography
                mb={2}
                sx={{
                  mb: 2,
                  flex: 1,
                  height: 0,
                }}
                variant={'body1'}
              >
                Social Security Number Output: {ssn}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Box className={'component_item'} mt={5}>
          <Box>
            <Typography mb={2} variant={'body1'}>
              Text Field Password
            </Typography>
            <Box
              sx={{
                // ...POSFlex('center', 'flex-start', 'row'),
                gap: 5,
              }}
            >
              <StyledTextFieldPassword
                label={'password'}
                onChange={(e) => setValue3(e.target.value)}
                placeholder={'placeholder'}
                sx={{ width: 180 }}
                value={value3}
              />
            </Box>
          </Box>
        </Box>

        <Box className={'component_item'} mt={5}>
          <Box>
            <Typography mb={2} variant={'body1'}>
              Text Field phone
            </Typography>
            <Box sx={{ ...POSFlex('center', 'flex-start', 'row'), gap: 5 }}>
              <StyledTextFieldPhone
                label={'phone'}
                onValueChange={(v) => {
                  setPhone(v.floatValue ?? '');
                }}
                placeholder={'placeholder'}
                sx={{ width: 180 }}
                validate={['error 1', 'error 2']}
                value={phone}
              />
              <Typography
                mb={2}
                sx={{
                  mb: 2,
                  flex: 1,
                  height: 0,
                }}
                variant={'body1'}
              >
                Text Field phone Output: {phone}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default BusinessTextFieldComponent;
