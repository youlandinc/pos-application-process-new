import { FC, useMemo, useRef } from 'react';
import { Box, Stack, Typography } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { OPTIONS_LICENSE_TYPE } from '@/constants';
import { useBreakpoints, useRenderPdf, useSwitch } from '@/hooks';
import { UserType } from '@/types';
import {
  StyledButton,
  StyledDialog,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledSelect,
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

  const { visible, open, close } = useSwitch(false);

  const pdfFile = useRef(null);
  const { renderFile } = useRenderPdf(pdfFile);

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
    <>
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
                onChange={(e) => {
                  computedAgreement.agreement.changeFieldValue(
                    'company',
                    e.target.value,
                  );
                }}
                placeholder={'Company Name'}
                value={computedAgreement.agreement.taskForm.company}
              />
            </Stack>
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              width={'100%'}
            >
              <StyledTextField
                label={'Your Full Name'}
                onChange={(e) => {
                  computedAgreement.agreement.changeFieldValue(
                    'fullName',
                    e.target.value,
                  );
                }}
                placeholder={'Your Full Name'}
                value={computedAgreement.agreement.taskForm.fullName}
              />
              <StyledTextFieldPhone
                label={'Phone Number'}
                onValueChange={({ value }) =>
                  computedAgreement.agreement.changeFieldValue('phone', value)
                }
                placeholder={'Phone Number'}
                value={computedAgreement.agreement.taskForm.phone}
              />
            </Stack>
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              width={'100%'}
            >
              <StyledTextField
                label={'Your Title'}
                onChange={(e) =>
                  computedAgreement.agreement.changeFieldValue(
                    'title',
                    e.target.value,
                  )
                }
                placeholder={'Your Title'}
                value={computedAgreement.agreement.taskForm.title}
              />
              <StyledTextField
                label={'Your Email'}
                onChange={(e) =>
                  computedAgreement.agreement.changeFieldValue(
                    'email',
                    e.target.value,
                  )
                }
                placeholder={'Your Email'}
                value={computedAgreement.agreement.taskForm.email}
              />
            </Stack>
            {computedAgreement.isRenderLicense && (
              <Stack width={'100%'}>
                <StyledSelect
                  onChange={(e) =>
                    computedAgreement.agreement.changeFieldValue(
                      'license',
                      e.target.value,
                    )
                  }
                  options={OPTIONS_LICENSE_TYPE}
                  value={computedAgreement.agreement.taskForm.license}
                />
              </Stack>
            )}
            {computedAgreement.agreement && (
              <Stack width={'100%'}>
                <StyledGoogleAutoComplete
                  address={computedAgreement.agreement.taskForm.address}
                />
              </Stack>
            )}
            {computedAgreement.isGenerateFile && (
              <StyledButton
                onClick={() => {
                  console.log(computedAgreement.agreement);
                  open();
                }}
                sx={{
                  width: { lg: 600, xs: '100%' },
                  mt: { xs: 0, lg: 3 },
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
              mt={{ lg: 3, xs: 0 }}
              width={{ lg: 600, xs: '100%' }}
            >
              <StyledButton
                color={'info'}
                onClick={() => router.back()}
                sx={{ flex: 1, width: '100%', order: { xs: 2, lg: 1 } }}
                variant={'text'}
              >
                Back
              </StyledButton>
              <StyledButton
                onClick={() => router.back()}
                sx={{ flex: 1, width: '100%', order: { xs: 1, lg: 2 } }}
              >
                Save
              </StyledButton>
            </Stack>
          </Stack>
        </StyledFormItem>
      </Stack>

      <StyledDialog
        content={<Box ref={pdfFile} height={2000} />}
        disableEscapeKeyDown
        footer={<Stack>footer</Stack>}
        header={
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
          >
            <Typography variant={'h6'}>Broker Agreement</Typography>
            <StyledButton isIconButton onClick={close}>
              <CloseOutlined />
            </StyledButton>
          </Stack>
        }
        open={visible}
        sx={{
          '& .MuiPaper-root': {
            maxWidth: { lg: '900px !important', xs: '100% !important' },
            width: '100%',
            '& .MuiDialogTitle-root, & .MuiDialogActions-root': {
              bgcolor: '#F5F8FA',
              p: 3,
            },
          },
        }}
      />
    </>
  );
});
