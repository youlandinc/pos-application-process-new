import { useMemo, useState } from 'react';
import { Stack, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION, OPTIONS_COMMON_YES_OR_NO } from '@/constants';

import {
  StyledButton,
  StyledButtonGroup,
  StyledFormItem,
  StyledSwitch,
  StyledTextField,
  StyledTextFieldPhone,
  StyledUploadBox,
  Transitions,
} from '@/components/atoms';

import { HttpError, LoanAnswerEnum, TaskFiles, UserType } from '@/types';
import { _deleteFile, _uploadFile } from '@/requests/base';

export interface AppraisalProfileData {
  haveAppraisal: boolean;
  appraisalFiles: TaskFiles[];
  isExpedited: boolean;
  isNeedToSend: boolean;
  isNeedToFill: boolean;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  instructions: string;
}

export interface AppraisalProfileProps {
  nextStep?: (postData: AppraisalProfileData) => Promise<void>;
  nextState: boolean;
  profileData: AppraisalProfileData;
  isAppraisalNotRequired: boolean;
}

export const AppraisalProfile = observer<AppraisalProfileProps>(
  ({ nextStep, nextState, profileData, isAppraisalNotRequired }) => {
    const { userType, dashboardInfo } = useMst();
    const router = useRouter();
    const { enqueueSnackbar } = useSnackbar();

    const [uploadLoading, setUploadLoading] = useState(false);

    const [haveAppraisal, setHaveAppraisal] = useState(
      profileData.haveAppraisal,
    );
    const [appraisalFiles, setAppraisalFiles] = useState<TaskFiles[]>(
      profileData.appraisalFiles,
    );

    const [isExpedited, setIsExpedited] = useState(profileData.isExpedited);
    const [isNeedToSend, setIsNeedToSend] = useState(profileData.isNeedToSend);
    const [isNeedToFill, setIsNeedToFill] = useState(profileData.isNeedToFill);

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

    const handleSave = async () => {
      const postData = {
        loanId: router.query.loanId,
        haveAppraisal,
        appraisalFiles,
        isExpedited,
        isNeedToSend,
        isNeedToFill,
        firstName,
        lastName,
        phoneNumber,
        email,
        instructions,
      };
      await nextStep?.(postData);
      if (haveAppraisal || isAppraisalNotRequired) {
        await router.push({
          pathname: '/dashboard/overview',
          query: { loanId: router.query.loanId },
        });
      }
    };

    const isFormDataValid = useMemo(() => {
      if (haveAppraisal) {
        return appraisalFiles.length > 0;
      }
      if (userType !== UserType.CUSTOMER) {
        if (isNeedToSend) {
          if (isNeedToFill) {
            return true;
          }
          return !!firstName && !!lastName && !!phoneNumber;
        }
      }
      return !!firstName && !!lastName && !!phoneNumber;
    }, [
      appraisalFiles.length,
      firstName,
      haveAppraisal,
      isNeedToFill,
      isNeedToSend,
      lastName,
      phoneNumber,
      userType,
    ]);

    const renderCondition = useMemo(() => {
      if (userType === UserType.CUSTOMER) {
        return true;
      }
      if (isNeedToSend) {
        return !isNeedToFill;
      }
      return true;
    }, [isNeedToFill, isNeedToSend, userType]);

    return (
      <Stack gap={{ xs: 6, lg: 8 }} maxWidth={900} width={'100%'}>
        {dashboardInfo?.additionalAddress?.length === 0 && (
          <StyledFormItem
            gap={3}
            label={'Do you have a recent appraisal?'}
            mt={-3}
            sub
          >
            <StyledButtonGroup
              onChange={(e, value) => {
                if (value === null) {
                  return;
                }
                setHaveAppraisal(value === LoanAnswerEnum.yes);
              }}
              options={OPTIONS_COMMON_YES_OR_NO}
              sx={{ maxWidth: 600 }}
              value={haveAppraisal ? LoanAnswerEnum.yes : LoanAnswerEnum.no}
            />
          </StyledFormItem>
        )}

        <Transitions
          style={{
            display: haveAppraisal ? 'block' : 'none',
            width: '100%',
            maxWidth: 600,
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
            <Stack gap={{ xs: 6, lg: 9 }} width={'100%'}>
              <StyledFormItem
                gap={3}
                label={'Would you like to expedite your appraisal order?'}
                sub
                tip={
                  'An expedited appraisal order will typically be completed within 3-5 business days. An additional fee of $150 will apply.'
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
                  sx={{ maxWidth: 600 }}
                  value={isExpedited ? LoanAnswerEnum.yes : LoanAnswerEnum.no}
                />
              </StyledFormItem>

              {userType !== UserType.CUSTOMER && !isAppraisalNotRequired && (
                <StyledFormItem
                  gap={3}
                  label={'Would you like to send the borrower a payment link?'}
                  sub
                >
                  <StyledButtonGroup
                    onChange={(e, value) => {
                      if (value === null) {
                        return;
                      }
                      setIsNeedToSend(value === LoanAnswerEnum.yes);
                    }}
                    options={OPTIONS_COMMON_YES_OR_NO}
                    sx={{ maxWidth: 600 }}
                    value={
                      isNeedToSend ? LoanAnswerEnum.yes : LoanAnswerEnum.no
                    }
                  />

                  <Transitions
                    style={{
                      display: isNeedToSend ? 'block' : 'none',
                    }}
                  >
                    {isNeedToSend && (
                      <Stack gap={3}>
                        <Typography
                          color={'text.secondary'}
                          component={'div'}
                          fontSize={16}
                        >
                          You can customize the logo and domain name of the
                          payment link in the &quot;
                          <Typography
                            color={'#365EC6'}
                            component={'span'}
                            fontWeight={600}
                            onClick={async () => {
                              await router.push({
                                pathname: '/account',
                                query: { tab: 1 },
                              });
                            }}
                            sx={{ cursor: 'pointer' }}
                          >
                            My Account
                          </Typography>
                          &quot; settings.
                        </Typography>
                        <Stack alignItems={'center'} flexDirection={'row'}>
                          <StyledSwitch
                            checked={isNeedToFill}
                            onChange={(e) => {
                              setIsNeedToFill(e.target.checked);
                            }}
                          />
                          <Typography fontSize={14} ml={1} pt={'2px'}>
                            Ask the borrower to fill in the property inspection
                            contact information.
                          </Typography>
                        </Stack>
                      </Stack>
                    )}
                  </Transitions>
                </StyledFormItem>
              )}

              <Transitions
                style={{
                  display: renderCondition ? 'block' : 'none',
                }}
              >
                {renderCondition && (
                  <StyledFormItem
                    gap={3}
                    label={'Property inspection contact information'}
                    labelSx={{ pb: 3 }}
                    sub
                  >
                    <Stack
                      flexDirection={{ xs: 'column', lg: 'row' }}
                      gap={3}
                      maxWidth={600}
                      width={'100%'}
                    >
                      <StyledTextField
                        label={'First name'}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                        }}
                        placeholder={'First name'}
                        required
                        value={firstName}
                      />
                      <StyledTextField
                        label={'Last name'}
                        onChange={(e) => {
                          setLastName(e.target.value);
                        }}
                        placeholder={'Last name'}
                        required
                        value={lastName}
                      />
                    </Stack>

                    <Stack
                      flexDirection={{ xs: 'column', lg: 'row' }}
                      gap={3}
                      maxWidth={600}
                      width={'100%'}
                    >
                      <StyledTextField
                        label={'Email (optional)'}
                        onChange={(e) => {
                          setEmail(e.target.value);
                        }}
                        placeholder={'Email (optional)'}
                        sx={{ maxWidth: 600 }}
                        value={email}
                      />
                      <StyledTextFieldPhone
                        label={'Phone number'}
                        onValueChange={({ value }) => setPhoneNumber(value)}
                        placeholder={'Phone number'}
                        required
                        value={phoneNumber}
                      />
                    </Stack>

                    <StyledTextField
                      label={'Property access instructions (optional)'}
                      onChange={(e) => {
                        setInstructions(e.target.value);
                      }}
                      placeholder={'Property access instructions (optional)'}
                      sx={{ maxWidth: 600 }}
                      value={instructions}
                    />
                  </StyledFormItem>
                )}
              </Transitions>
            </Stack>
          )}
        </Transitions>

        <StyledButton
          color={'primary'}
          disabled={nextState || !isFormDataValid}
          loading={nextState}
          onClick={handleSave}
          sx={{ maxWidth: 276, width: '100%' }}
        >
          {haveAppraisal || isAppraisalNotRequired ? 'Save' : 'Next'}
          {/*Save*/}
        </StyledButton>
      </Stack>
    );
  },
);
