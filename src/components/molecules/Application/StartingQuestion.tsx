import { FC } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import {
  APPLICATION_LOAN_CATEGORY,
  APPLICATION_LOAN_PURPOSE,
  APPLICATION_PROPERTY_TYPE,
  APPLICATION_PROPERTY_UNIT,
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

export const StartingQuestion: FC<FormNodeBaseProps> = observer(
  ({ nextStep, nextState }) => {
    const {
      applicationForm: { startingQuestion },
    } = useMst();

    return (
      <Stack gap={{ xs: 3, lg: 10 }} m={'0 auto'} maxWidth={600} width={'100%'}>
        <StyledFormItem
          label={'Which product are you interested in?'}
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

        <StyledFormItem label={'What is the property type?'} width={'100%'}>
          <StyledSelectOption
            onChange={(value) => {
              startingQuestion.changeFieldValue(
                'propertyType',
                value as string as LoanPropertyTypeEnum,
              );
            }}
            options={APPLICATION_PROPERTY_TYPE}
            value={startingQuestion.propertyType}
          />
        </StyledFormItem>

        <Transitions
          style={{
            width: '100%',
            maxWidth: 600,
            display:
              startingQuestion.propertyType ===
              LoanPropertyTypeEnum.two_to_four_family
                ? 'flex'
                : 'none',
          }}
        >
          {startingQuestion.propertyType ===
            LoanPropertyTypeEnum.two_to_four_family && (
            <StyledFormItem label={'How many units are there?'} width={'100%'}>
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
          sx={{ maxWidth: 600, width: '100%' }}
        />

        <Stack
          alignItems={'center'}
          gap={3}
          justifyContent={'center'}
          width={'100%'}
        >
          <StyledButton
            color={'primary'}
            disabled={!!nextState || !startingQuestion.isValid}
            loading={!!nextState}
            onClick={nextStep}
            sx={{ width: '100%', maxWidth: 600 }}
          >
            Next
          </StyledButton>
        </Stack>
      </Stack>
    );
  },
);
