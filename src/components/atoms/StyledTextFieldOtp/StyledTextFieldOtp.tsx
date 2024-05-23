import { FC } from 'react';
import ReactCodeInput from 'react-verification-code-input';

import { StyledTextFieldOtpProps } from './index';

export const StyledTextFieldOtp: FC<StyledTextFieldOtpProps> = ({
  onChange,
  disabled,
  values,
  fields = 4,
  onComplete,
}) => {
  return (
    <>
      <ReactCodeInput
        className={'OPT_TextField_inputStyle_container'}
        disabled={disabled}
        fields={fields}
        onChange={onChange}
        onComplete={onComplete}
        values={values}
      />
    </>
  );
};
