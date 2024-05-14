import { FC, useMemo, useState } from 'react';
import { Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { AUTO_HIDE_DURATION, OPTIONS_COMMON_YES_OR_NO } from '@/constants';

import {
  StyledButton,
  StyledButtonGroup,
  StyledFormItem,
  StyledTextField,
  StyledTextFieldPhone,
  StyledUploadBox,
  Transitions,
} from '@/components/atoms';

import { HttpError, LoanAnswerEnum, TaskFiles } from '@/types';
import { _deleteFile, _uploadFile } from '@/requests/base';

export interface AppraisalProfileData {
  haveAppraisal: boolean;
  appraisalFiles: TaskFiles[];
  isExpedited: boolean;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  instructions: string;
}

export interface AppraisalProfileProps {
  nextStep: (postData: AppraisalProfileData) => void;
  nextState: boolean;
  profileData: AppraisalProfileData;
}

export const AppraisalProfile: FC<AppraisalProfileProps> = ({
  nextStep,
  nextState,
  profileData,
}) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const [uploadLoading, setUploadLoading] = useState(false);

  const [haveAppraisal, setHaveAppraisal] = useState(profileData.haveAppraisal);
  const [appraisalFiles, setAppraisalFiles] = useState<TaskFiles[]>(
    profileData.appraisalFiles,
  );

  const [isExpedited, setIsExpedited] = useState(profileData.isExpedited);

  const [firstName, setFirstName] = useState(profileData.firstName);
  const [lastName, setLastName] = useState(profileData.lastName);
  const [phoneNumber, setPhoneNumber] = useState(profileData.phoneNumber);
  const [email, setEmail] = useState(profileData.email);
  const [instructions, setInstructions] = useState(profileData.instructions);

  const handleDelete = async (index: number) => {
    try {
      await _deleteFile({
        fileKey: 'COLLATERAL_DOCS_Appraisal',
        fileUrl: appraisalFiles[index]?.url,
        loanId: router.query.loanId as string,
      });
      const temp = JSON.parse(JSON.stringify(appraisalFiles));
      temp.splice(index, 1);
      setAppraisalFiles(temp);
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

  const handleSuccess = async (files: FileList) => {
    setUploadLoading(true);

    const formData = new FormData();

    formData.append('fileKey', 'COLLATERAL_DOCS_Appraisal');
    Array.from(files, (item) => {
      formData.append('files', item);
    });

    try {
      const { data } = await _uploadFile(
        formData,
        router.query.loanId as string,
      );
      setAppraisalFiles([...appraisalFiles, ...data]);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setUploadLoading(false);
    }
  };

  const handleSave = () => {
    const postData = {
      loanId: router.query.loanId,
      haveAppraisal,
      appraisalFiles,
      isExpedited,
      firstName,
      lastName,
      phoneNumber,
      email,
      instructions,
    };
    nextStep(postData);
  };

  const isFormDataValid = useMemo(() => {
    if (haveAppraisal) {
      return appraisalFiles.length > 0;
    }
    return !!firstName && !!lastName && !!phoneNumber && !!email;
  }, [
    appraisalFiles.length,
    email,
    firstName,
    haveAppraisal,
    lastName,
    phoneNumber,
  ]);

  return (
    <>
      <StyledFormItem gap={3} label={'Do you have a recent appraisal?'} sub>
        <StyledButtonGroup
          onChange={(e, value) => {
            if (value === null) {
              return;
            }
            setHaveAppraisal(value === LoanAnswerEnum.yes);
          }}
          options={OPTIONS_COMMON_YES_OR_NO}
          sx={{ width: '100%' }}
          value={haveAppraisal ? LoanAnswerEnum.yes : LoanAnswerEnum.no}
        />
      </StyledFormItem>

      <Transitions
        style={{
          display: haveAppraisal ? 'block' : 'none',
          width: '100%',
        }}
      >
        {haveAppraisal && (
          <StyledUploadBox
            fileList={appraisalFiles}
            loading={uploadLoading}
            onDelete={handleDelete}
            onSuccess={handleSuccess}
          />
        )}
      </Transitions>

      <Transitions
        style={{
          display: !haveAppraisal ? 'block' : 'none',
        }}
      >
        {!haveAppraisal && (
          <Stack gap={6} width={'100%'}>
            <StyledFormItem
              gap={3}
              label={'Would you like to request an expedited report?'}
              sub
              tip={
                'An expedited appraisal order can typically be completed within 3-5 business days. An additional fee of $150 will apply.'
              }
              tipSx={{ textAlign: 'left', mt: 1.5 }}
            >
              <StyledButtonGroup
                onChange={(e, value) => {
                  if (value === null) {
                    return;
                  }
                  setIsExpedited(value === LoanAnswerEnum.yes);
                }}
                options={OPTIONS_COMMON_YES_OR_NO}
                sx={{ width: '100%' }}
                value={isExpedited ? LoanAnswerEnum.yes : LoanAnswerEnum.no}
              />
            </StyledFormItem>

            <StyledFormItem
              gap={3}
              label={'Property inspection contact information'}
              labelSx={{ pb: 3 }}
              sub
            >
              <Stack
                flexDirection={{ xs: 'column', lg: 'row' }}
                gap={3}
                width={'100%'}
              >
                <StyledTextField
                  label={'First name'}
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  placeholder={'First name'}
                  value={firstName}
                />
                <StyledTextField
                  label={'Last name'}
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  placeholder={'Last name'}
                  value={lastName}
                />
              </Stack>

              <Stack
                flexDirection={{ xs: 'column', lg: 'row' }}
                gap={3}
                width={'100%'}
              >
                <StyledTextField
                  label={'Email'}
                  onChange={(e) => {
                    setEmail(e.target.value);
                  }}
                  placeholder={'Email'}
                  value={email}
                />
                <StyledTextFieldPhone
                  label={'Phone number'}
                  onValueChange={({ value }) => setPhoneNumber(value)}
                  placeholder={'Phone number'}
                  value={phoneNumber}
                />
              </Stack>

              <StyledTextField
                label={'Property access instructions'}
                onChange={(e) => {
                  setInstructions(e.target.value);
                }}
                placeholder={'Property access instructions'}
                value={instructions}
              />
            </StyledFormItem>
          </Stack>
        )}
      </Transitions>

      <Stack alignItems={'center'} mt={{ xs: 3, lg: 2 }} width={'100%'}>
        <StyledButton
          color={'primary'}
          disabled={nextState || !isFormDataValid}
          loading={nextState}
          onClick={handleSave}
          sx={{ maxWidth: 276, width: '100%' }}
        >
          {haveAppraisal ? 'Save' : 'Next'}
        </StyledButton>
      </Stack>
    </>
  );
};
