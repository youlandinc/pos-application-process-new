import { FC } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
// import { useMst } from '@/models/Root';

import { BridgePropertyNumberOpt } from '@/types';
import { IBridgePurpose } from '@/models/application/bridge';
import {
  StyledFormItem,
  StyledGoogleAutoComplete,
  StyledSelectOption,
  Transitions,
} from '@/components/atoms';
import { OPTIONS_BRIDGE_PROPERTY_NUMBER } from '@/constants';

interface BridgePurposeProps {
  purpose: IBridgePurpose;
}

export const BridgePurpose: FC<BridgePurposeProps> = observer((props) => {
  const { purpose } = props;
  const {
    values: { address, propertyNumber },
  } = purpose;

  // const {
  //   applicationForm: { applicationType },
  //   userType,
  // } = useMst();

  return (
    <Stack
      alignItems={'center'}
      flex={1}
      flexDirection={'column'}
      gap={6}
      justifyContent={'center'}
      width={'100%'}
    >
      {/*todo : saas*/}
      <StyledFormItem
        label={
          'How many property have you flipped / exited in the last 24 months?'
        }
      >
        <Stack maxWidth={600} width={'100%'}>
          <StyledSelectOption
            onChange={(value) => {
              purpose.changeFieldValue(
                'propertyNumber',
                value as BridgePropertyNumberOpt,
              );
            }}
            options={OPTIONS_BRIDGE_PROPERTY_NUMBER}
            value={propertyNumber}
          />
        </Stack>
      </StyledFormItem>
      <Transitions>
        {propertyNumber && (
          //  todo : saas
          <StyledFormItem
            alignItems={'center'}
            label={"What's the address of the property you'd like to purchase?"}
            width={'100%'}
          >
            <Stack maxWidth={600} width={'100%'}>
              <StyledGoogleAutoComplete address={address} fullAddress />
            </Stack>
          </StyledFormItem>
        )}
      </Transitions>
    </Stack>
  );
});
