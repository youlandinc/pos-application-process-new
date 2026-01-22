import { FC } from 'react';
import { Icon, Stack, Typography } from '@mui/material';
import { format, isDate, isValid } from 'date-fns';
import {
  DashboardTaskBorrowerType,
  LoanCitizenshipEnum,
  LoanMarriedStatusEnum,
} from '@/types';

import { useMst } from '@/models/Root';
import { observer } from 'mobx-react-lite';

import { useBreakpoints } from '@/hooks';
import {
  OPTIONS_COMMON_CITIZEN_TYPE,
  OPTIONS_COMMON_MARRIED_STATUS,
  OPTIONS_COMMON_YES_OR_NO,
} from '@/constants';

import {
  StyledCheckbox,
  StyledDatePicker,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledSelect,
  StyledTextField,
  StyledTextFieldNumber,
  StyledTextFieldPhone,
  StyledTextFieldSocialNumber,
} from '@/components/atoms';

import ICON_CLOSE from './assets/icon-close.svg';

export const TasksBorrowerSignatories: FC = observer(() => {
  const {
    dashboardInfo: { taskBorrower },
  } = useMst();

  const showOwnership =
    taskBorrower.borrowerType === DashboardTaskBorrowerType.entity;

  const breakpoints = useBreakpoints();

  return (
    <>
      {taskBorrower.signatories.map((signatory, index) => (
        <StyledFormItem
          gap={3}
          key={`signatory-${index}-${signatory.id}`}
          label={
            taskBorrower.signatories.length === 1 ? (
              'Authorized signatory information'
            ) : (
              <Stack
                alignItems={'center'}
                flexDirection={'row'}
                justifyContent={'space-between'}
                maxWidth={600}
              >
                <Typography
                  variant={
                    ['xs', 'sm', 'md'].includes(breakpoints)
                      ? 'subtitle1'
                      : 'h6'
                  }
                >
                  {`${index + 1}st signatory / sponsor`}
                </Typography>

                {index >= 1 && (
                  <Icon
                    component={ICON_CLOSE}
                    onClick={() => taskBorrower.removeSignatory(index)}
                    sx={{
                      width: 24,
                      height: 24,
                      cursor: 'pointer',
                    }}
                  />
                )}
              </Stack>
            )
          }
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
                signatory.removeError('firstName');
                taskBorrower.changeSignatoryFieldValue(
                  index,
                  'firstName',
                  e.target.value,
                );
              }}
              validate={signatory.errors?.firstName}
              value={signatory.firstName}
            />
            <StyledTextField
              label={'Last name'}
              onChange={(e) => {
                signatory.removeError('lastName');
                taskBorrower.changeSignatoryFieldValue(
                  index,
                  'lastName',
                  e.target.value,
                );
              }}
              validate={signatory.errors?.lastName}
              value={signatory.lastName}
            />
          </Stack>
          <Stack
            flexDirection={{ xs: 'column', lg: 'row' }}
            gap={3}
            maxWidth={600}
            width={'100%'}
          >
            <StyledTextField
              label={'Authorized signatory title'}
              onChange={(e) => {
                signatory.removeError('signatoryTitle');
                taskBorrower.changeSignatoryFieldValue(
                  index,
                  'signatoryTitle',
                  e.target.value,
                );
              }}
              validate={signatory.errors?.signatoryTitle}
              value={signatory.signatoryTitle}
            />
            <StyledDatePicker
              label={'Date of birth'}
              onChange={(value) => {
                signatory.removeError('birthday');
                taskBorrower.changeSignatoryFieldValue(
                  index,
                  'birthday',
                  isValid(value) && isDate(value)
                    ? format(value as Date, 'yyyy-MM-dd')
                    : null,
                );
              }}
              validate={signatory.errors?.birthday}
              value={new Date(signatory.birthday || '')}
            />
          </Stack>
          <Stack
            flexDirection={{ xs: 'column', lg: 'row' }}
            gap={3}
            maxWidth={600}
            width={'100%'}
          >
            <StyledTextFieldPhone
              label={'Phone number'}
              onValueChange={({ value }) => {
                signatory.removeError('phoneNumber');
                taskBorrower.changeSignatoryFieldValue(
                  index,
                  'phoneNumber',
                  value,
                );
              }}
              validate={signatory.errors?.phoneNumber}
              value={signatory.phoneNumber}
            />
            <StyledTextField
              label={'Email'}
              onChange={(e) => {
                signatory.removeError('email');
                taskBorrower.changeSignatoryFieldValue(
                  index,
                  'email',
                  e.target.value,
                );
              }}
              validate={signatory.errors?.email}
              value={signatory.email}
            />
          </Stack>
          <Stack
            flexDirection={{ xs: 'column', lg: 'row' }}
            gap={3}
            maxWidth={600}
            width={'100%'}
          >
            <StyledSelect
              label={'Citizenship status'}
              onChange={(e) => {
                signatory.removeError('citizenship');
                taskBorrower.changeSignatoryFieldValue(
                  index,
                  'citizenship',
                  e.target.value as string,
                );
              }}
              options={OPTIONS_COMMON_CITIZEN_TYPE}
              validate={signatory.errors?.citizenship}
              value={signatory.citizenship}
            />
            {signatory.citizenship !== LoanCitizenshipEnum.foreign_national && (
              <StyledTextFieldSocialNumber
                label={'Social security number'}
                onValueChange={(value) => {
                  signatory.removeError('ssn');
                  taskBorrower.changeSignatoryFieldValue(index, 'ssn', value);
                }}
                validate={signatory.errors?.ssn}
                value={signatory.ssn}
              />
            )}
          </Stack>

          <Stack
            flexDirection={{ xs: 'column', lg: 'row' }}
            gap={3}
            maxWidth={600}
            width={'100%'}
          >
            <StyledSelect
              label={'Marital status'}
              onChange={(e) => {
                signatory.removeError('maritalStatus');
                taskBorrower.changeSignatoryFieldValue(
                  index,
                  'maritalStatus',
                  e.target.value as string as LoanMarriedStatusEnum,
                );
              }}
              options={OPTIONS_COMMON_MARRIED_STATUS}
              sx={{
                maxWidth: 600,
              }}
              validate={signatory.errors?.maritalStatus}
              value={signatory.maritalStatus}
            />
            {showOwnership && (
              <StyledTextFieldNumber
                label={'Ownership'}
                onValueChange={(values) => {
                  signatory.removeError('ownership');
                  taskBorrower.changeSignatoryFieldValue(
                    index,
                    'ownership',
                    values.floatValue ?? null,
                  );
                }}
                prefix={''}
                suffix={'%'}
                thousandSeparator={false}
                validate={signatory.errors?.ownership}
                value={signatory.ownership ?? undefined}
              />
            )}
          </Stack>

          {index === 1 &&
            taskBorrower.signatories[0].maritalStatus ===
              LoanMarriedStatusEnum.married &&
            signatory.maritalStatus === LoanMarriedStatusEnum.married && (
              <StyledSelect
                label={'Are the two signatories married to each other?'}
                onChange={(e) => {
                  signatory.removeError('marriedTogether');
                  taskBorrower.changeSignatoryFieldValue(
                    index,
                    'marriedTogether',
                    e.target.value as string,
                  );
                }}
                options={OPTIONS_COMMON_YES_OR_NO}
                sx={{
                  maxWidth: 600,
                }}
                validate={signatory.errors?.marriedTogether}
                value={signatory.marriedTogether}
              />
            )}

          <Stack maxWidth={600}>
            <StyledCheckbox
              checked={signatory.isSameMailingAddress}
              label={
                'Signatory’s primary residence address (no P.O. Boxes) is the same as the borrower’s mailing address'
              }
              onChange={(e) => {
                taskBorrower.changeSignatoryFieldValue(
                  index,
                  'isSameMailingAddress',
                  e.target.checked,
                );
              }}
              sx={{
                '& .MuiCheckbox-root': {
                  mt: '-8px',
                  mr: '-11px',
                  '& svg > path': {
                    fill: '#929292',
                  },
                },
              }}
            />
          </Stack>

          {!signatory.isSameMailingAddress && (
            <Stack maxWidth={600}>
              <StyledGoogleAutoComplete
                address={signatory.addressInfo}
                addressError={signatory.errors?.addressInfo}
              />
            </Stack>
          )}
        </StyledFormItem>
      ))}

      <Stack
        alignItems={'center'}
        flexDirection={'row'}
        gap={1.5}
        maxWidth={600}
      >
        <Stack bgcolor={'#D2D6E1'} flex={1} height={'1px'} />
        <Typography
          onClick={() => {
            taskBorrower.addSignatory();
          }}
          sx={{ cursor: 'pointer' }}
          variant={'subtitle2'}
        >
          + Add signatory
        </Typography>
      </Stack>
    </>
  );
});
