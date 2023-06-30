import { Dispatch, FC, ReactNode, SetStateAction } from 'react';
import { Stack } from '@mui/material';

import { OPTIONS_MORTGAGE_PROPERTY, OPTIONS_MORTGAGE_UNIT } from '@/constants';
import { PropertyOpt, PropertyUnitOpt } from '@/types';
import { IAddress } from '@/models/common/Address';

import {
  StyledButton,
  StyledGoogleAutoComplete,
  StyledSelect,
  Transitions,
} from '@/components/atoms';
import { DashboardHeader } from '@/components/molecules';

interface PreApprovalEditProps {
  address: IAddress;
  editable?: boolean;
  clickable: boolean;
  propertyType: PropertyOpt;
  propertyUnit: PropertyUnitOpt;
  onTypeChange: Dispatch<SetStateAction<PropertyOpt>>;
  onUnitChange: Dispatch<SetStateAction<PropertyUnitOpt>>;
  onClickCancel: () => void;
  onClickCheck: () => void;
  children?: ReactNode;
  resultList?: ReactNode;
}

export const PreApprovalEdit: FC<PreApprovalEditProps> = (props) => {
  const {
    address,
    editable,
    clickable,
    propertyType,
    propertyUnit,
    onTypeChange,
    onUnitChange,
    children,
    resultList,
    onClickCancel,
    onClickCheck,
  } = props;

  return (
    <Stack alignItems={'center'} justifyContent={'center'} maxWidth={900}>
      <DashboardHeader
        subTitle={
          "You can edit the purchase price and down payment amounts on your letter so that it is personalized to a specific property when you're making offers."
        }
        title={'Edit your pre-approval letter'}
      />
      <Stack
        alignItems={'center'}
        gap={3}
        sx={{ maxWidth: 600 }}
        width={'100%'}
      >
        <Stack width={'100%'}>
          <StyledSelect
            disabled={editable}
            label="Property type"
            onChange={(e) => onTypeChange(e.target.value as PropertyOpt)}
            options={OPTIONS_MORTGAGE_PROPERTY}
            sx={{ maxWidth: '100%' }}
            value={propertyType}
          />
        </Stack>
        {propertyType === 'two_to_four_family' && (
          <Stack width={'100%'}>
            <Transitions>
              <StyledSelect
                disabled={editable}
                label="Number of units"
                onChange={(e) =>
                  onUnitChange(e.target.value as PropertyUnitOpt)
                }
                options={OPTIONS_MORTGAGE_UNIT}
                sx={{ maxWidth: '100%' }}
                value={propertyUnit}
              />
            </Transitions>
          </Stack>
        )}
        <Stack width={'100%'}>
          <StyledGoogleAutoComplete address={address} disabled fullAddress />
        </Stack>
        {children}
        <Stack
          alignItems={'center'}
          flexDirection={'row'}
          gap={3}
          justifyContent={'center'}
          width={'100%'}
        >
          <StyledButton
            onClick={onClickCancel}
            sx={{ width: 130 }}
            variant={'outlined'}
          >
            Cancel
          </StyledButton>
          <StyledButton
            color={'primary'}
            disabled={clickable}
            onClick={onClickCheck}
            sx={{ width: 130 }}
            variant={'contained'}
          >
            Check
          </StyledButton>
        </Stack>
      </Stack>

      {resultList}
    </Stack>
  );
};
