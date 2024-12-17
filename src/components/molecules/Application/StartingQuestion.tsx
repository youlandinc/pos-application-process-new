import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { Slider, Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  APPLICATION_LOAN_CATEGORY,
  APPLICATION_LOAN_PURPOSE,
  APPLICATION_PROPERTY_TYPE,
  APPLICATION_PROPERTY_UNIT,
  MULTIFAMILY_HASH,
  OPTIONS_COMMON_MARKS,
} from '@/constants';

import {
  LoanProductCategoryEnum,
  LoanPropertyTypeEnum,
  LoanPropertyUnitEnum,
  LoanPurposeEnum,
} from '@/types';

import {
  StyledButton,
  StyledCheckbox,
  StyledFormItem,
  StyledSelectOption,
  Transitions,
} from '@/components/atoms';

export const StartingQuestion: FC<
  FormNodeBaseProps & { createLoading: boolean }
> = observer(({ nextStep, nextState, createLoading }) => {
  const {
    applicationForm: { startingQuestion },
  } = useMst();

  const [propertiesNum, setPropertiesNum] = useState(5);

  const keydownEvent = useCallback(
    (e: KeyboardEvent) => {
      const button: (HTMLElement & { disabled?: boolean }) | null =
        document.getElementById('application-starting-question-next-button');

      if (!button) {
        return;
      }

      if (e.key === 'Enter') {
        if (!button.disabled) {
          nextStep?.();
        }
      }
    },
    [nextStep],
  );

  useEffect(() => {
    document.addEventListener('keydown', keydownEvent, false);
    return () => {
      document.removeEventListener('keydown', keydownEvent, false);
    };
  }, [keydownEvent]);

  const propertyTypeOptions = useMemo(() => {
    if (
      startingQuestion.productCategory ===
      LoanProductCategoryEnum.ground_up_construction
    ) {
      return APPLICATION_PROPERTY_TYPE.filter(
        (item) => item.value !== LoanPropertyTypeEnum.condo,
      );
    }
    return APPLICATION_PROPERTY_TYPE;
  }, [startingQuestion.productCategory]);

  return (
    <Stack gap={{ xs: 6, lg: 10 }} m={'0 auto'} maxWidth={600} width={'100%'}>
      <StyledFormItem
        label={'Which product are you interested in?'}
        labelSx={{
          textAlign: { xs: 'left', lg: 'center' },
        }}
        width={'100%'}
      >
        <StyledSelectOption
          onChange={(value) => {
            startingQuestion.changeFieldValue(
              'productCategory',
              value as string as LoanProductCategoryEnum,
            );
          }}
          options={APPLICATION_LOAN_CATEGORY}
          value={startingQuestion.productCategory}
        />
      </StyledFormItem>

      <StyledFormItem
        label={"What's the purpose of your loan?"}
        labelSx={{
          textAlign: { xs: 'left', lg: 'center' },
        }}
        width={'100%'}
      >
        <StyledSelectOption
          onChange={(value) => {
            startingQuestion.changeFieldValue(
              'loanPurpose',
              value as string as LoanPurposeEnum,
            );
          }}
          options={APPLICATION_LOAN_PURPOSE}
          value={startingQuestion.loanPurpose}
        />
      </StyledFormItem>

      <StyledFormItem
        label={'What is the property type?'}
        labelSx={{
          textAlign: { xs: 'left', lg: 'center' },
        }}
        width={'100%'}
      >
        <StyledSelectOption
          onChange={(value) => {
            startingQuestion.changeFieldValue(
              'propertyType',
              value as string as LoanPropertyTypeEnum,
            );
            if (value === LoanPropertyTypeEnum.two_to_four_family) {
              startingQuestion.changeFieldValue(
                'propertyUnit',
                LoanPropertyUnitEnum.two_units,
              );
            }
            if (value === LoanPropertyTypeEnum.multifamily) {
              startingQuestion.changeFieldValue(
                'propertyUnit',
                LoanPropertyUnitEnum.five_units,
              );
            }
            if (
              ![
                LoanPropertyTypeEnum.multifamily,
                LoanPropertyTypeEnum.two_to_four_family,
              ].includes(value as string as LoanPropertyTypeEnum)
            ) {
              startingQuestion.changeFieldValue(
                'propertyUnit',
                LoanPropertyUnitEnum.default,
              );
            }
          }}
          options={propertyTypeOptions}
          value={startingQuestion.propertyType}
        />
      </StyledFormItem>

      <Transitions
        style={{
          width: '100%',
          maxWidth: 600,
          display: [
            LoanPropertyTypeEnum.two_to_four_family,
            LoanPropertyTypeEnum.multifamily,
          ].includes(startingQuestion.propertyType)
            ? 'flex'
            : 'none',
        }}
      >
        {startingQuestion.propertyType ===
          LoanPropertyTypeEnum.two_to_four_family && (
          <StyledFormItem
            label={'How many units are there?'}
            labelSx={{
              textAlign: { xs: 'left', lg: 'center' },
            }}
            width={'100%'}
          >
            <StyledSelectOption
              onChange={(value) => {
                startingQuestion.changeFieldValue(
                  'propertyUnit',
                  value as string as LoanPropertyUnitEnum,
                );
              }}
              options={APPLICATION_PROPERTY_UNIT}
              value={startingQuestion.propertyUnit}
            />
          </StyledFormItem>
        )}
        {startingQuestion.propertyType === LoanPropertyTypeEnum.multifamily && (
          <StyledFormItem
            label={'How many units are there?'}
            labelSx={{
              textAlign: { xs: 'left', lg: 'center' },
            }}
            width={'100%'}
          >
            <Slider
              defaultValue={5}
              marks={OPTIONS_COMMON_MARKS}
              max={20}
              min={5}
              onChange={(e, v) => {
                setPropertiesNum(v as number);
                startingQuestion.changeFieldValue(
                  'propertyUnit',
                  MULTIFAMILY_HASH[v as number],
                );
              }}
              step={1}
              sx={{
                height: 8,
                '.MuiSlider-mark': {
                  width: 4,
                  height: 4,
                  borderRadius: '50%',
                  transform: 'translateY(-50%)',
                  '&[data-index="15"],&[data-index="0"]': {
                    display: 'none !important',
                  },
                },
              }}
              value={propertiesNum}
              valueLabelDisplay={'auto'}
              valueLabelFormat={(value) => {
                return value === 20 ? '20+' : value;
              }}
            />
          </StyledFormItem>
        )}
      </Transitions>

      <StyledCheckbox
        checked={startingQuestion.isOccupyProperty}
        label={
          'Please confirm that this property will be used for non-owner occupancy purposes only.'
        }
        onChange={(e) =>
          startingQuestion.changeFieldValue(
            'isOccupyProperty',
            e.target.checked,
          )
        }
        sx={{
          maxWidth: 600,
          width: '100%',
          mt: { xs: 0, lg: -3 },
          '& .MuiCheckbox-root': {
            mt: '-9px',
            mr: '-9px',
          },
        }}
      />

      <Stack
        alignItems={'center'}
        gap={3}
        justifyContent={'center'}
        mt={-3}
        width={'100%'}
      >
        <StyledButton
          color={'primary'}
          disabled={!!nextState || !startingQuestion.isValid || createLoading}
          id={'application-starting-question-next-button'}
          loading={!!nextState || createLoading}
          onClick={nextStep}
          sx={{ width: '100%', maxWidth: 600 }}
        >
          Next
        </StyledButton>
      </Stack>
    </Stack>
  );
});
