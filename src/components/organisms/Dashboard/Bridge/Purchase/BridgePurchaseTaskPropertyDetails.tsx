import { FC, useState } from 'react';
import { useRouter } from 'next/router';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';

import { OPTIONS_MORTGAGE_PROPERTY, OPTIONS_MORTGAGE_UNIT } from '@/constants';
import { Address, IAddress } from '@/models/common/Address';
import { PropertyOpt, PropertyUnitOpt } from '@/types';

import {
  StyledButton,
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledSelectOption,
  Transitions,
} from '@/components/atoms';

export const BridgePurchaseTaskPropertyDetails: FC = observer(() => {
  const router = useRouter();
  const [address] = useState<IAddress>(
    Address.create({
      formatAddress: '',
      state: '',
      street: '',
      city: '',
      aptNumber: '',
      postcode: '',
      isValid: false,
      errors: {},
    }),
  );

  const [propertyType, setPropertyType] = useState<PropertyOpt>(
    PropertyOpt.default,
  );
  const [propertyUnit, setPropertyUnit] = useState<PropertyUnitOpt>(
    PropertyUnitOpt.default,
  );

  return (
    <StyledFormItem
      gap={6}
      label={'Loan Details'}
      tip={
        'Below are all of the details we have about your deal. If you have to change these details you may do so below, please note that changes may affect your Loan-to-Value or your rate.'
      }
      tipSx={{ mb: 0 }}
    >
      <StyledFormItem label={'Purchase price'} sub>
        <Stack maxWidth={600} width={'100%'}>
          <StyledGoogleAutoComplete address={address} />
        </Stack>
      </StyledFormItem>

      <StyledFormItem label={'What is the property type?'} sub>
        <Stack maxWidth={600} width={'100%'}>
          <StyledSelectOption
            onChange={(value) => {
              setPropertyType(value as PropertyOpt);
            }}
            options={OPTIONS_MORTGAGE_PROPERTY}
            value={propertyType}
          />
        </Stack>
      </StyledFormItem>

      <Transitions
        style={{
          display:
            propertyType === PropertyOpt.twoToFourFamily ? 'block' : 'none',
        }}
      >
        {propertyType === PropertyOpt.twoToFourFamily && (
          <StyledFormItem label={'How many units will the property have?'}>
            <Stack maxWidth={600} width={'100%'}>
              <StyledSelectOption
                onChange={(value) => {
                  setPropertyUnit(value as PropertyUnitOpt);
                }}
                options={OPTIONS_MORTGAGE_UNIT}
                value={propertyUnit}
              />
            </Stack>
          </StyledFormItem>
        )}
      </Transitions>

      <Stack
        flexDirection={'row'}
        gap={3}
        justifyContent={'space-between'}
        maxWidth={600}
        width={'100%'}
      >
        <StyledButton
          color={'info'}
          onClick={() =>
            router.push({
              pathname: '/dashboard/tasks',
              query: { processId: router.query.processId },
            })
          }
          sx={{ flex: 1 }}
          variant={'text'}
        >
          Back
        </StyledButton>
        <StyledButton sx={{ flex: 1 }}>Save</StyledButton>
      </Stack>
    </StyledFormItem>
  );
});
