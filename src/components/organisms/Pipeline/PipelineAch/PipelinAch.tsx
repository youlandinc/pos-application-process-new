import { FC, useMemo, useRef } from 'react';
import { Box, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { OPTIONS_ACCOUNT_TYPE } from '@/constants';
import { useBreakpoints, useRenderPdf, useSwitch } from '@/hooks';
import { UserType } from '@/types';

import {
  StyledButton,
  StyledDialog,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledSelect,
  StyledTextField,
} from '@/components';

export const PipelineAch: FC = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const breakpoint = useBreakpoints();
  const { visible, open, close } = useSwitch(false);

  const pdfFile = useRef(null);
  const { renderFile } = useRenderPdf(pdfFile);

  const {
    pipelineTask: {
      formData: {
        ACH_INFORMATION,
        LOAN_OFFICER_ACH_INFORMATION,
        REAL_ESTATE_AGENT_ACH_INFORMATION,
      },
    },
    userType,
  } = useMst();

  const computedAch = useMemo(() => {
    switch (userType) {
      case UserType.LOAN_OFFICER:
        return {
          tip: 'We need you to provide US ACH information in order to pay your loan officer compensation.',
          ach: LOAN_OFFICER_ACH_INFORMATION,
          isGenerateFile: false,
        };
      case UserType.REAL_ESTATE_AGENT:
        return {
          tip: 'We need you to provide US ACH information in order to pay your real estate agent compensation.',
          ach: REAL_ESTATE_AGENT_ACH_INFORMATION,
          isGenerateFile: false,
        };
      case UserType.BROKER:
        return {
          tip: 'We need you to provide US ACH information in order to pay your broker compensation.',
          ach: ACH_INFORMATION,
          isGenerateFile: true,
        };
      default:
        return {
          tip: '',
          ach: null,
          isGenerateFile: false,
        };
    }
  }, [
    ACH_INFORMATION,
    LOAN_OFFICER_ACH_INFORMATION,
    REAL_ESTATE_AGENT_ACH_INFORMATION,
    userType,
  ]);

  return (
    <>
      <Stack alignItems={'center'} justifyContent={'center'}>
        <StyledFormItem
          label={'ACH Information'}
          sx={{ width: '100%' }}
          tip={computedAch.tip}
        >
          <Stack alignItems={'center'} gap={3} width={'100%'}>
            <Stack width={'100%'}>
              <StyledTextField
                label={'Bank Name'}
                onChange={(e) =>
                  computedAch.ach.changeFieldValue('bankName', e.target.value)
                }
                placeholder={'Bank Name'}
                value={computedAch.ach.taskForm.bankName}
              />
            </Stack>
            {computedAch.ach && (
              <Stack width={'100%'}>
                <StyledGoogleAutoComplete
                  address={computedAch.ach.taskForm.address}
                  label={'Bank Address'}
                />
              </Stack>
            )}
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              width={'100%'}
            >
              <StyledTextField
                label={'Account Holder Name'}
                onChange={(e) =>
                  computedAch.ach.changeFieldValue(
                    'accountName',
                    e.target.value,
                  )
                }
                placeholder={'Account Holder Name'}
                value={computedAch.ach.taskForm.accountName}
              />
              <StyledTextField
                label={'Routing number'}
                onChange={(e) =>
                  computedAch.ach.changeFieldValue(
                    'routingNumber',
                    e.target.value,
                  )
                }
                placeholder={'Routing number'}
                value={computedAch.ach.taskForm.routingNumber}
              />
            </Stack>
            <Stack
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              width={'100%'}
            >
              <StyledTextField
                label={'Account Number'}
                onChange={(e) =>
                  computedAch.ach.changeFieldValue(
                    'accountNumber',
                    e.target.value,
                  )
                }
                placeholder={'Account Number'}
                value={computedAch.ach.taskForm.accountNumber}
              />
              <StyledSelect
                label={'Account Type'}
                onChange={(e) =>
                  computedAch.ach.changeFieldValue(
                    'accountType',
                    e.target.value,
                  )
                }
                options={OPTIONS_ACCOUNT_TYPE}
                value={computedAch.ach.taskForm.accountType}
              />
            </Stack>
            {computedAch.isGenerateFile && (
              <StyledButton
                onClick={open}
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
        content={<Box ref={pdfFile} />}
        disableEscapeKeyDown
        footer={<></>}
        header={<></>}
        open={visible}
      />
    </>
  );
});
