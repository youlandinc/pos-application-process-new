import { ChangeEvent, FC, useEffect, useState } from 'react';
import { TextField } from '@mui/material';

import {
  StyledTextFieldSocialNumberProps,
  StyledTextFieldStyles,
} from '@/components/atoms';

export const StyledTextFieldSocialNumber: FC<
  StyledTextFieldSocialNumberProps
> = ({ value, sx, onValueChange, validate, ...rest }) => {
  const [originValue, setOriginValue] = useState(value);

  const [text, setText] = useState('');

  const formatSSN = (value: string) => {
    if (!value) {
      return value;
    }

    const ssn = value.replace(/[^\d]/g, '');

    const ssnLength = ssn.length;

    if (ssnLength < 4) {
      return ssn;
    }

    if (ssnLength < 6) {
      return `${ssn.slice(0, 3)}-${ssn.slice(3)}`;
    }

    return `${ssn.slice(0, 3)}-${ssn.slice(3, 5)}-${ssn.slice(5, 9)}`;
  };

  useEffect(
    () => {
      if (value) {
        const string = formatSSN(value);
        setOriginValue(string);
        const r = new RegExp('(?:d{3})-(?:d{2})-(d{4})');
        const result = string.replace(r, '');
        const reg = /^(\d{3})-(\d{2})-/;
        const maskedSsn = result.replace(reg, 'XXX-XX-');
        setText(maskedSsn);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const handledChange = (e: ChangeEvent<HTMLInputElement>) => {
    const regexp = /^[0-9.!@?#"$%&:';()*+/;\-=[\\\]^_{|}<>` ]+$/;

    if (e.target.value === '' || regexp.test(e.target.value)) {
      const string = formatSSN(e.target.value);
      setOriginValue(string);
      setText(string);
      onValueChange(string.split('-').join(''));
    }
  };

  const handledBlur = () => {
    const r = new RegExp('(?:d{3})-(?:d{2})-(d{4})');
    const result = text.replace(r, '');
    const reg = /^(\d{3})-(\d{2})-/;
    const maskedSsn = result.replace(reg, 'XXX-XX-');
    setText(maskedSsn);
  };

  const handledFocus = () => {
    setText(originValue);
  };

  return (
    <>
      <TextField
        error={!!(validate?.length && validate[0])}
        helperText={validate?.length && validate[0]}
        label={'Social security number'}
        onBlur={handledBlur}
        onChange={handledChange}
        onFocus={handledFocus}
        placeholder={'Social security number'}
        sx={{
          ...StyledTextFieldStyles,
          ...sx,
        }}
        value={text}
        variant={'outlined'}
        {...rest}
      />
    </>
  );
};
