import { FC, useMemo } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useBreakpoints } from '@/hooks';
import { UserType } from '@/types';
import {
  StyledButton,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledTextField,
  StyledTextFieldPhone,
} from '@/components';

export const PipelineAgreement: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();
  const breakpoint = useBreakpoints();

  const {
    userType,
    pipelineTask: {
      formData: {
        BROKER_AGREEMENT,
        LOAN_OFFICER_AGREEMENT,
        REAL_ESTATE_AGENT_AGREEMENT,
      },
    },
  } = useMst();

  const computedAgreement = useMemo(() => {
    switch (userType) {
      case UserType.BROKER:
        return {
          isRenderLicense: false,
          isGenerateFile: true,
          label: 'Broker Agreement',
          tip: 'Please fill out and read our broker agreement.',
          agreement: BROKER_AGREEMENT,
        };
      case UserType.LOAN_OFFICER:
        return {
          isRenderLicense: true,
          isGenerateFile: false,
          label: 'Loan Officer Information',
          tip: 'Please fill out the information that pertains to you.',
          agreement: LOAN_OFFICER_AGREEMENT,
        };
      case UserType.REAL_ESTATE_AGENT:
        return {
          isRenderLicense: true,
          isGenerateFile: false,
          label: 'Real Estate Agent Information',
          tip: 'Please fill out the information that pertains to you.',
          agreement: REAL_ESTATE_AGENT_AGREEMENT,
        };
      default:
        return {
          isRenderLicense: false,
          isGenerateFile: false,
          label: '',
          tip: '',
          agreement: null,
        };
    }
  }, [
    BROKER_AGREEMENT,
    LOAN_OFFICER_AGREEMENT,
    REAL_ESTATE_AGENT_AGREEMENT,
    userType,
  ]);

  return (
    <Stack alignItems={'center'} justifyContent={'center'}>
      <StyledFormItem
        label={computedAgreement.label}
        sx={{ width: '100%' }}
        tip={computedAgreement.tip}
      >
        <Stack alignItems={'center'} gap={3} width={'100%'}>
          <Stack width={'100%'}>
            <StyledTextField
              label={'Company Name'}
              placeholder={'Company Name'}
            />
          </Stack>
          <Stack flexDirection={'row'} gap={3} width={'100%'}>
            <StyledTextField
              label={'Your Full Name'}
              placeholder={'Your Full Name'}
            />
            <StyledTextFieldPhone
              label={'Phone Number'}
              onValueChange={(v) => {
                console.log(v);
              }}
              placeholder={'Phone Number'}
            />
          </Stack>
          <Stack flexDirection={'row'} gap={3} width={'100%'}>
            <StyledTextField label={'Your Title'} placeholder={'Your Title'} />
            <StyledTextField label={'Your Email'} placeholder={'Your Email'} />
          </Stack>
          {computedAgreement.agreement && (
            <Stack width={'100%'}>
              <StyledGoogleAutoComplete
                address={computedAgreement.agreement.taskForm.address}
              />
            </Stack>
          )}
          {computedAgreement.isGenerateFile && (
            <StyledButton
              sx={{
                width: { lg: 600, xs: '100%' },
                mt: 3,
              }}
              variant={'outlined'}
            >
              Generate File
            </StyledButton>
          )}
          <Stack
            alignItems={'center'}
            flexDirection={{ sx: 'column', lg: 'row' }}
            gap={3}
            justifyContent={'center'}
            mt={3}
            width={{
              lg: 600,
              xs: '100%',
            }}
          >
            <StyledButton
              color={'info'}
              onClick={() => router.back()}
              sx={{ flex: 1, width: '100%' }}
              variant={'text'}
            >
              Back
            </StyledButton>
            <StyledButton
              onClick={() => router.back()}
              sx={{ flex: 1, width: '100%' }}
            >
              Save
            </StyledButton>
          </Stack>
        </Stack>
      </StyledFormItem>
    </Stack>
  );
});
