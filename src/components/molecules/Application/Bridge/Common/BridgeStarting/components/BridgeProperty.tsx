import { Stack } from '@mui/material';
import { FC } from 'react';

import { observer } from 'mobx-react-lite';

import { IBridgeProperty } from '@/models/application/bridge';
import { PropertyOpt, PropertyUnitOpt } from '@/types/options';
import {
  StyledCheckbox,
  StyledFormItem,
  StyledSelectOption,
  Transitions,
} from '@/components/atoms';
import { OPTIONS_MORTGAGE_PROPERTY, OPTIONS_MORTGAGE_UNIT } from '@/constants';

interface PropertyProps {
  property: IBridgeProperty;
}

export const BridgeProperty: FC<PropertyProps> = observer((props) => {
  const { property } = props;
  const {
    values: { propertyType, propertyUnit, isConfirm },
  } = property;

  return (
    <Stack
      alignItems={'center'}
      flex={1}
      flexDirection={'column'}
      gap={propertyType === PropertyOpt.twoToFourFamily ? 6 : 3}
      justifyContent={'center'}
      width={'100%'}
    >
      <StyledFormItem label={'What is the property type?'}>
        <Stack maxWidth={600} width={'100%'}>
          <StyledSelectOption
            onChange={(value) => {
              property.changeFieldValue('propertyType', value as PropertyOpt);
              property.changeFieldValue(
                'propertyUnit',
                PropertyUnitOpt.default,
              );
            }}
            options={OPTIONS_MORTGAGE_PROPERTY}
            value={propertyType}
          />
        </Stack>
      </StyledFormItem>
      <Transitions
        style={{
          width: '100%',
          maxWidth: 600,
          display:
            propertyType === PropertyOpt.twoToFourFamily ? 'flex' : 'none',
          justifyContent: 'center',
        }}
      >
        {propertyType === PropertyOpt.twoToFourFamily && (
          <StyledFormItem label={'How many units will the property have?'}>
            <Stack maxWidth={600} width={'100%'}>
              <StyledSelectOption
                onChange={(value) => {
                  property.changeFieldValue(
                    'propertyUnit',
                    value as PropertyUnitOpt,
                  );
                }}
                options={OPTIONS_MORTGAGE_UNIT}
                value={propertyUnit}
              />
            </Stack>
          </StyledFormItem>
        )}
      </Transitions>
      <StyledCheckbox
        checked={isConfirm}
        label="Please confirm that this property is non-owner occupied and for investment purposes only."
        onChange={(e) =>
          property.changeFieldValue(
            'isConfirm',
            e.target.checked as unknown as boolean,
          )
        }
        sx={{ maxWidth: 600 }}
      />
    </Stack>
  );
});
