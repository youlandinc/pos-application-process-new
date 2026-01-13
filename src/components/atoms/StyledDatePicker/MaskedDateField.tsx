import { useEffect, useMemo, useState } from 'react';
import { Box, IconButton, InputAdornment, TextField } from '@mui/material';
import {
  usePickerContext,
  useSplitFieldProps,
} from '@mui/x-date-pickers/hooks';
import { useRifm } from 'rifm';
import { format, isValid } from 'date-fns';
import { CalendarIcon } from '@mui/x-date-pickers/icons';
import { Transitions } from '@/components/atoms';

const MASK_USER_INPUT_SYMBOL = '_';
const ACCEPT_REGEX = /[\d]/gi;

const staticDateWith2DigitTokens = new Date(2019, 10, 21, 11, 30, 0);
const staticDateWith1DigitTokens = new Date(2019, 0, 1, 9, 0, 0);

function getInputValueFromValue(value: Date | null, formatStr: string) {
  if (value == null) {
    return '';
  }
  return isValid(value) ? format(value, formatStr) : '';
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function MaskedDateField(props: any) {
  const { forwardedProps } = useSplitFieldProps(props, 'date');
  const pickerContext = usePickerContext();

  // Force MM/dd/yyyy format for masked input (pickerContext.fieldFormat is 'P' which is localized)
  const fieldFormat = 'MM/dd/yyyy';

  const [inputValue, setInputValue] = useState<string>(() =>
    getInputValueFromValue(pickerContext.value as Date | null, fieldFormat),
  );

  useEffect(() => {
    const value = pickerContext.value as Date | null;
    if (value && isValid(value)) {
      const newDisplayDate = getInputValueFromValue(value, fieldFormat);
      setInputValue(newDisplayDate);
    }
  }, [fieldFormat, pickerContext.value]);

  const onInputValueChange = (newInputValue: string) => {
    setInputValue(newInputValue);

    const expectedLength = fieldFormat.length;

    if (newInputValue.length === expectedLength) {
      const parts = newInputValue.split('/');
      let month = parseInt(parts[0], 10);
      let day = parseInt(parts[1], 10);
      let year = parseInt(parts[2], 10);

      // Check for completely invalid input (NaN or extreme values like 99/99)
      if (isNaN(month) || isNaN(day) || isNaN(year)) {
        const fallbackDate = new Date(1900, 0, 1);
        pickerContext.setValue(fallbackDate, { validationError: null });
        setInputValue(format(fallbackDate, fieldFormat));
        return;
      }

      // Correct month to valid range (1-12)
      if (month > 12) {
        month = 12;
      }
      if (month < 1) {
        month = 1;
      }

      // Correct year to valid range (1900-2200)
      if (year < 1900) {
        year = 1900;
      }
      if (year > 2200) {
        year = 2200;
      }

      // Correct day based on month and year
      const daysInMonth = new Date(year, month, 0).getDate();
      if (day > daysInMonth) {
        day = daysInMonth;
      }
      if (day < 1) {
        day = 1;
      }

      // Create corrected date
      const correctedDate = new Date(year, month - 1, day);

      if (isValid(correctedDate)) {
        pickerContext.setValue(correctedDate, { validationError: null });
        setInputValue(format(correctedDate, fieldFormat));
      } else {
        const fallbackDate = new Date(1900, 0, 1);
        pickerContext.setValue(fallbackDate, { validationError: null });
        setInputValue(format(fallbackDate, fieldFormat));
      }
    }
  };

  const rifmFormat = useMemo(() => {
    const formattedDateWith1Digit = format(
      staticDateWith1DigitTokens,
      fieldFormat,
    );
    const inferredFormatPatternWith1Digits = formattedDateWith1Digit.replace(
      ACCEPT_REGEX,
      MASK_USER_INPUT_SYMBOL,
    );
    const inferredFormatPatternWith2Digits = format(
      staticDateWith2DigitTokens,
      fieldFormat,
    ).replace(ACCEPT_REGEX, '_');

    if (inferredFormatPatternWith1Digits !== inferredFormatPatternWith2Digits) {
      throw new Error(
        "Mask does not support numbers with variable length such as 'M'.",
      );
    }

    const maskToUse = inferredFormatPatternWith1Digits;

    return function formatMaskedDate(valueToFormat: string) {
      let outputCharIndex = 0;
      return valueToFormat
        .split('')
        .map((character, characterIndex) => {
          ACCEPT_REGEX.lastIndex = 0;

          if (outputCharIndex > maskToUse.length - 1) {
            return '';
          }

          const maskChar = maskToUse[outputCharIndex];
          const nextMaskChar = maskToUse[outputCharIndex + 1];

          const acceptedChar = ACCEPT_REGEX.test(character) ? character : '';
          const formattedChar =
            maskChar === MASK_USER_INPUT_SYMBOL
              ? acceptedChar
              : maskChar + acceptedChar;

          outputCharIndex += formattedChar.length;

          const isLastCharacter = characterIndex === valueToFormat.length - 1;
          if (
            isLastCharacter &&
            nextMaskChar &&
            nextMaskChar !== MASK_USER_INPUT_SYMBOL
          ) {
            return formattedChar ? formattedChar + nextMaskChar : '';
          }

          return formattedChar;
        })
        .join('');
    };
  }, [fieldFormat]);

  const rifmProps = useRifm({
    value: inputValue,
    onChange: onInputValueChange,
    format: rifmFormat,
  });

  const validate = (forwardedProps as any)?.validate;

  return (
    <TextField
      error={!!validate?.length}
      focused={pickerContext.open}
      helperText={
        <Transitions>
          {validate?.length
            ? validate.map((item: string, index: number) => (
                <Box
                  component="span"
                  key={item + '_' + index}
                  sx={{
                    display: 'block',
                    m: 0,
                    pl: 0.5,
                    '&:first-of-type': {
                      mt: 0.5,
                    },
                  }}
                >
                  {item}
                </Box>
              ))
            : undefined}
        </Transitions>
      }
      label={pickerContext.label as string}
      placeholder="MM/DD/YYYY"
      ref={pickerContext.rootRef}
      sx={pickerContext.rootSx as any}
      {...rifmProps}
      {...forwardedProps}
      slotProps={{
        input: {
          ref: pickerContext.triggerRef,
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                edge="end"
                onClick={() => pickerContext.setOpen((prev: boolean) => !prev)}
              >
                <CalendarIcon />
              </IconButton>
            </InputAdornment>
          ),
        },

        inputLabel: {
          shrink: true,
        },

        formHelperText: {
          component: 'div',
        },
      }}
    />
  );
}
