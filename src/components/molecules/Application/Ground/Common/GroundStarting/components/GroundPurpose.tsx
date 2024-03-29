import { FC } from 'react';
import { Stack } from '@mui/material';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { UserType } from '@/types';
import { IGroundPurpose } from '@/models/application/ground';
import { StyledFormItem, StyledGoogleAutoComplete } from '@/components/atoms';
import { HASH_COMMON_PERSON } from '@/constants';

interface GroundPurposeProps {
  purpose: IGroundPurpose;
}

export const GroundPurpose: FC<GroundPurposeProps> = observer((props) => {
  const { purpose } = props;
  const {
    values: { address },
  } = purpose;

  const {
    applicationForm: { applicationType },
    userType,
  } = useMst();

  return (
    <Stack
      alignItems={'center'}
      flex={1}
      flexDirection={'column'}
      gap={6}
      justifyContent={'center'}
      width={'100%'}
    >
      {/*<StyledFormItem*/}
      {/*  label={`How many properties ${*/}
      {/*    userType === UserType.CUSTOMER ? 'have' : 'has'*/}
      {/*  } ${*/}
      {/*    HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].subject*/}
      {/*  } flipped in the last 24 months?`}*/}
      {/*>*/}
      {/*  <Stack maxWidth={600} width={'100%'}>*/}
      {/*    <StyledSelectOption*/}
      {/*      onChange={(value) => {*/}
      {/*        purpose.changeFieldValue(*/}
      {/*          'propertyNumber',*/}
      {/*          value as PropertyNumberOpt,*/}
      {/*        );*/}
      {/*      }}*/}
      {/*      options={OPTIONS_BRIDGE_PROPERTY_NUMBER}*/}
      {/*      value={propertyNumber}*/}
      {/*    />*/}
      {/*  </Stack>*/}
      {/*</StyledFormItem>*/}
      <StyledFormItem
        alignItems={'center'}
        label={`What's the address of the property ${
          HASH_COMMON_PERSON[userType ?? UserType.CUSTOMER].subject
        } would like to ${applicationType}?`}
        width={'100%'}
      >
        <Stack maxWidth={600} width={'100%'}>
          <StyledGoogleAutoComplete address={address} fullAddress />
        </Stack>
      </StyledFormItem>
    </Stack>
  );
});
