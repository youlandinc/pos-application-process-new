import { FC, useCallback, useState } from 'react';
import {
  Autocomplete,
  Box,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { LocationOnOutlined } from '@mui/icons-material';
import parse from 'autosuggest-highlight/parse';
import { observer } from 'mobx-react-lite';

import {
  _StyledGoogleAutoCompleteProps,
  PlaceType,
  StyledGoogleAutoCompleteProps,
  StyledGoogleAutoCompleteStyles,
} from './index';

import { POSTypeOf } from '@/utils';
import { useGooglePlacesSearch } from '@/hooks';
import { OPTIONS_COMMON_STATE } from '@/constants';

import { StyledSelect, StyledTextField } from '@/components/atoms';

export const StyledGoogleAutoComplete: FC<StyledGoogleAutoCompleteProps> =
  observer(({ address, fullAddress = true, disabled, label, stateError }) => {
    const { formatAddress } = address;

    const [stateValidate, setStateValidate] = useState(stateError);

    const handledPlaceSelect = useCallback(
      (place: any) => {
        if (!place.formatted_address) {
          return;
        }
        stateValidate && setStateValidate(false);

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        place.address_components.forEach((com) => {
          const type = com.types[0];
          if (!type) {
            return;
          }
          switch (type) {
            case 'administrative_area_level_1': {
              address.changeFieldValue('state', com.short_name);
              return;
            }
            case 'locality': {
              address.changeFieldValue('city', com.long_name);
              return;
            }
            case 'route': {
              address.changeFieldValue('street', com.long_name);
              return;
            }
            case 'postal_code': {
              address.changeFieldValue('postcode', com.long_name);
              return;
            }
          }
        });
        address.changeFieldValue('lat', place.geometry.location.lat());
        address.changeFieldValue('lng', place.geometry.location.lng());
      },
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [stateValidate],
    );

    return (
      <Stack width={'100%'}>
        {fullAddress ? (
          <Stack width={'100%'}>
            <Stack width={'100%'}>
              <_StyledGoogleAutoComplete
                disabled={disabled}
                fullAddress={fullAddress}
                handledPlaceSelect={handledPlaceSelect}
                inputValue={formatAddress}
                label={label}
                onInputChange={(e, val) => {
                  if (!val) {
                    address.reset();
                    return;
                  }
                  address.changeFieldValue('formatAddress', val);
                }}
                value={formatAddress}
              />
            </Stack>
            <Stack
              alignItems={'center'}
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              justifyContent={'flex-start'}
              mt={3}
              width={'100%'}
            >
              <StyledTextField
                disabled={disabled}
                inputProps={{
                  autoComplete: 'new-password',
                }}
                label={'City'}
                onChange={(e) =>
                  address.changeFieldValue('city', e.target.value)
                }
                placeholder={'City'}
                sx={{ flex: 1 }}
                value={address.city}
              />
              <StyledSelect
                disabled={disabled}
                inputProps={{
                  autoComplete: 'new-password',
                }}
                label={'State'}
                onChange={(e) => {
                  address.changeFieldValue('state', e.target.value as string);
                }}
                options={OPTIONS_COMMON_STATE}
                sx={{ flex: 1 }}
                validate={stateError ? [' '] : undefined}
                value={address.state}
              />
            </Stack>
            <Stack
              alignItems={'center'}
              flexDirection={{ lg: 'row', xs: 'column' }}
              gap={3}
              justifyContent={'flex-start'}
              mt={3}
              width={'100%'}
            >
              <StyledTextField
                disabled={disabled}
                inputProps={{
                  autoComplete: 'new-password',
                }}
                label={'Apt/Unit'}
                onChange={(e) =>
                  address.changeFieldValue('aptNumber', e.target.value)
                }
                placeholder={'Apt/Unit'}
                sx={{ flex: 1 }}
                value={address.aptNumber}
              />
              <StyledTextField
                disabled={disabled}
                inputProps={{
                  autoComplete: 'new-password',
                }}
                label={'Zip code'}
                onChange={(e) =>
                  address.changeFieldValue('postcode', e.target.value)
                }
                placeholder={'Zip code'}
                sx={{ flex: 1 }}
                value={address.postcode}
              />
            </Stack>
          </Stack>
        ) : (
          <Stack>
            <_StyledGoogleAutoComplete
              disabled={disabled}
              fullAddress={fullAddress}
              handledPlaceSelect={handledPlaceSelect}
              inputValue={formatAddress}
              onInputChange={(e, val) =>
                address.changeFieldValue('formatAddress', val)
              }
              value={formatAddress}
            />
          </Stack>
        )}
      </Stack>
    );
  });

const _StyledGoogleAutoComplete: FC<_StyledGoogleAutoCompleteProps> = ({
  inputValue,
  onInputChange,
  fullAddress,
  handledPlaceSelect,
  value,
  disabled,
  label,
  ...rest
}) => {
  const [selfValue, setSelfValue] = useState<PlaceType | null | string>(value);

  const { options, loading, getPlaceDetailsRequest, serviceLoaded } =
    useGooglePlacesSearch(inputValue, fullAddress);

  return (
    <Autocomplete
      disabled={disabled}
      id="youland-google-map-autoComplete"
      sx={StyledGoogleAutoCompleteStyles.inside.autoComplete}
      {...rest}
      autoSelect={false}
      clearOnBlur={false}
      filterOptions={(options) => options}
      filterSelectedOptions
      freeSolo
      getOptionLabel={(option) => {
        return typeof option === 'string'
          ? option
          : fullAddress
            ? option.structured_formatting.main_text
            : option.description;
      }}
      includeInputInList
      inputValue={inputValue}
      loading={loading}
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      onChange={async (event: any, newValue: PlaceType | null) => {
        setSelfValue(newValue);
        if (newValue?.place_id && fullAddress && serviceLoaded) {
          getPlaceDetailsRequest(
            {
              placeId: newValue.place_id,
              fields: [
                'address_components',
                'geometry.location',
                'place_id',
                'formatted_address',
              ],
            },
            (place) => handledPlaceSelect(place),
          );
        }
      }}
      onInputChange={onInputChange}
      options={options}
      renderInput={(params) => (
        <StyledTextField
          {...params}
          fullWidth
          InputProps={{
            ...params.InputProps,
            autoComplete: 'new-password',
          }}
          label={label || 'Street address'}
          placeholder="Address"
          variant="outlined"
        />
      )}
      renderOption={(props, option) => {
        if (POSTypeOf(option) === 'String') {
          return;
        }
        const matches =
          option.structured_formatting.main_text_matched_substrings || [];
        const parts = parse(
          option.structured_formatting.main_text,
          matches.map((match: any) => [
            match.offset,
            match.offset + match.length,
          ]),
        );

        return (
          <li {...props} key={props.id}>
            <Grid alignItems="center" container>
              <Grid item sx={{ display: 'flex', width: 44 }}>
                <LocationOnOutlined sx={{ color: 'text.secondary' }} />
              </Grid>
              <Grid item sx={StyledGoogleAutoCompleteStyles.inside.icon}>
                {parts.map((part, index) => (
                  <Box
                    component="span"
                    key={index}
                    sx={{ fontWeight: part.highlight ? 'bold' : 'regular' }}
                  >
                    {part.text}
                  </Box>
                ))}
                <Typography color="text.secondary" variant="body2">
                  {option.structured_formatting.secondary_text}
                </Typography>
              </Grid>
            </Grid>
          </li>
        );
      }}
      selectOnFocus={false}
      value={selfValue}
    />
  );
};
