import {
  ChangeEvent,
  Dispatch,
  FC,
  MouseEvent,
  ReactNode,
  SetStateAction,
} from 'react';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { HttpError, TaskFiles } from '@/types';
import { _deleteTaskFile, _uploadTaskFile } from '@/requests/dashboard';
import { AUTO_HIDE_DURATION, OPTIONS_COMMON_YES_OR_NO } from '@/constants';

import {
  StyledButtonGroup,
  StyledCheckbox,
  StyledFormItem,
  StyledTextField,
  StyledTextFieldPhone,
  StyledUploadBox,
  Transitions,
} from '@/components/atoms';
import { Stack } from '@mui/material';
import { TaskContractInformation } from '@/components/organisms';

interface PaymentSummaryProps {
  onCheckValueChange: (e: ChangeEvent<HTMLInputElement>) => void;
  check: boolean;
  loanSummary: ReactNode;
  productType?: ProductCategory;
  haveAppraisal: boolean | undefined;
  onHaveAppraisalChange: (event: MouseEvent<HTMLElement>, value: any) => void;
  fileList: TaskFiles[];
  onFileListChange: Dispatch<SetStateAction<TaskFiles[]>>;
  uploadLoading: boolean;
  onUploadLoadingChange: Dispatch<SetStateAction<boolean>>;
  isExpedited: boolean | undefined;
  onIsExpeditedChange: (event: MouseEvent<HTMLElement>, value: any) => void;
  contactInformation: TaskContractInformation;
  onContactInformationChange: Dispatch<SetStateAction<TaskContractInformation>>;
}

export const PaymentSummary: FC<PaymentSummaryProps> = ({
  onCheckValueChange,
  check,
  loanSummary,
  //productType,
  haveAppraisal,
  onHaveAppraisalChange,
  fileList,
  onFileListChange,
  uploadLoading = false,
  onUploadLoadingChange,
  isExpedited,
  onIsExpeditedChange,
  contactInformation,
  onContactInformationChange,
}) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const handledDelete = async (index: number) => {
    try {
      await _deleteTaskFile(router.query.taskId as string, {
        fieldName: 'appraisalFiles',
        fileUrl: fileList[index]?.url,
      });
      const temp = JSON.parse(JSON.stringify(fileList));
      temp.splice(index, 1);
      onFileListChange(temp);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  };

  const handledSuccess = async (files: FileList) => {
    onUploadLoadingChange(true);

    const formData = new FormData();

    formData.append('fieldName', 'appraisalFiles');
    Array.from(files, (item) => {
      formData.append('files', item);
    });
    try {
      const { data } = await _uploadTaskFile(
        formData,
        router.query.taskId as string,
      );
      onFileListChange([...fileList, ...data]);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      onUploadLoadingChange(false);
    }
  };

  return (
    <StyledFormItem gap={3} label={'Confirm your rate'} labelSx={{ m: 0 }}>
      {loanSummary}
      <Stack alignItems={'center'} mt={3} width={'100%'}>
        <StyledCheckbox
          checked={check}
          label={
            'I agree to the terms above and would like to confirm this rate.'
          }
          onChange={onCheckValueChange}
        />
      </Stack>

      <StyledFormItem
        gap={3}
        label={'Do you have a recent property appraisal？'}
        labelSx={{ m: 0 }}
        mt={3}
        sub
        tipSx={{ m: 0 }}
      >
        <StyledButtonGroup
          onChange={onHaveAppraisalChange}
          options={OPTIONS_COMMON_YES_OR_NO}
          sx={{ width: '100%', maxWidth: 600 }}
          value={haveAppraisal}
        />
        <Transitions
          style={{
            display: haveAppraisal ? 'block' : 'none',
            width: '100%',
          }}
        >
          {haveAppraisal && (
            <StyledUploadBox
              fileList={fileList}
              loading={uploadLoading}
              onDelete={handledDelete}
              onSuccess={handledSuccess}
            />
          )}
        </Transitions>
      </StyledFormItem>
      <Transitions
        style={{
          display: haveAppraisal ? 'none' : 'block',
          width: '100%',
        }}
      >
        {!haveAppraisal && (
          <>
            <StyledFormItem
              gap={3}
              label={'Would you like to request expedited processing?'}
              mt={5}
              sub
              tip={
                'If you wish to avail expedited processing services, an additional fee of $150 will apply. This means you will receive your report in a shorter timeframe, allowing for more timely handling of your needs.'
              }
              tipSx={{ m: 0 }}
            >
              <StyledButtonGroup
                onChange={onIsExpeditedChange}
                options={OPTIONS_COMMON_YES_OR_NO}
                sx={{ width: '100%', maxWidth: 600 }}
                value={isExpedited}
              />
            </StyledFormItem>
            <StyledFormItem
              gap={3}
              label={'Property inspection contact information'}
              labelSx={{ m: 0 }}
              mt={8}
              sub
            >
              <Stack
                flexDirection={'row'}
                gap={3}
                maxWidth={600}
                width={'100%'}
              >
                <StyledTextField
                  label={'First name'}
                  onChange={(e) =>
                    onContactInformationChange({
                      ...contactInformation,
                      firstName: e.target.value,
                    })
                  }
                  placeholder={'First name'}
                  required
                  sx={{ width: 'calc(50% - 12px)' }}
                  value={contactInformation.firstName}
                />
                <StyledTextField
                  label={'Last name'}
                  onChange={(e) =>
                    onContactInformationChange({
                      ...contactInformation,
                      lastName: e.target.value,
                    })
                  }
                  placeholder={'Last name'}
                  required
                  sx={{ width: 'calc(50% - 12px)' }}
                  value={contactInformation.lastName}
                />
              </Stack>
              <Stack
                flexDirection={'row'}
                gap={3}
                maxWidth={600}
                width={'100%'}
              >
                <StyledTextField
                  label={'Email'}
                  onChange={(e) =>
                    onContactInformationChange({
                      ...contactInformation,
                      email: e.target.value,
                    })
                  }
                  placeholder={'Email'}
                  required
                  sx={{ width: 'calc(50% - 12px)' }}
                  value={contactInformation.email}
                />
                <StyledTextFieldPhone
                  label={'Phone number'}
                  onValueChange={({ value }) =>
                    onContactInformationChange({
                      ...contactInformation,
                      phoneNumber: value,
                    })
                  }
                  placeholder={'Phone number'}
                  required
                  sx={{ width: 'calc(50% - 12px)' }}
                  value={contactInformation.phoneNumber}
                />
              </Stack>
              <StyledTextField
                label={'Property access instructions'}
                onChange={(e) =>
                  onContactInformationChange({
                    ...contactInformation,
                    instructions: e.target.value,
                  })
                }
                placeholder={'Property access instructions'}
                sx={{ maxWidth: 600 }}
                value={contactInformation.instructions}
              />
            </StyledFormItem>
          </>
        )}
      </Transitions>
    </StyledFormItem>
  );
};
