import { FC } from 'react';
import ReactCodeInput from 'react-verification-code-input';

import { StyledTextFieldOtpProps } from './index';

export const StyledTextFieldOtp: FC<StyledTextFieldOtpProps> = ({
  onChange,
  disabled,
  values,
}) => {
  return (
    <>
      <ReactCodeInput
        className={'OPT_TextField_inputStyle_container'}
        disabled={disabled}
        onChange={onChange}
        values={values}
      />
    </>
  );
};
