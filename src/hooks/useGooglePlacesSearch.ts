import React, { useState, useEffect } from 'react';
import throttle from 'lodash/throttle';
import { GooglePlaces } from '@/types/googlePlaces';

export interface PlaceType {
  place_id?: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
    main_text_matched_substrings: [
      {
        offset: number;
        length: number;
      },
    ];
  };
}

const autocompleteService = { current: null };
const placesService = { current: null };

export const useGooglePlacesSearch = (
  inputValue,
  autoCompleteValue,
  fullAddress,
) => {
  const [options, setOptions] = useState<PlaceType[]>([]);
  const [loading, setLoading] = useState(false);
  const [serviceLoaded, setServiceLoaded] = useState(false);

  const loadGooglePlaceService = (): void => {
    if (
      !autocompleteService.current &&
      !placesService.current &&
      (window as any).google
    ) {
      autocompleteService.current = new (
        window as any
      ).google.maps.places.AutocompleteService();
      placesService.current = new (
        window as any
      ).google.maps.places.PlacesService(document.createElement('div'));
    }
    setServiceLoaded(!(!autocompleteService.current || !placesService.current));
  };

  const getAutocompletionRequest = React.useMemo(
    () =>
      throttle(
        (
          request: GooglePlaces.AutocompletionRequest,
          callback: (results?: PlaceType[]) => void,
        ) => {
          return autocompleteService.current.getPlacePredictions(
            request,
            callback,
          );
        },
        200,
      ),
    [],
  );

  const getPlaceDetailsRequest = React.useMemo(
    () =>
      throttle(
        (
          request: GooglePlaces.PlaceDetailsRequest,
          callback: (result?: any) => void,
        ) => {
          return placesService.current.getDetails(request, callback);
        },
        200,
      ),
    [],
  );

  useEffect(() => {
    loadGooglePlaceService();
  }, []);

  useEffect(() => {
    if (inputValue === '') {
      setOptions([]);
      setLoading(false);
      return undefined;
    }

    if (serviceLoaded) {
      setLoading(true);
      getAutocompletionRequest(
        {
          input: inputValue,
          types: fullAddress ? ['geocode', 'establishment'] : ['(regions)'],
          componentRestrictions: {
            country: 'us',
          },
          fields: ['address_components', 'geometry'],
        },
        (results?: PlaceType[]) => {
          let newOptions: PlaceType[] = [];

          // This will push the selected item into options , but autoComplete filterSelectedOptions props will hide the selected options from the list box.
          //if (autoCompleteValue) {
          //  newOptions = [autoCompleteValue];
          //}

          if (results) {
            newOptions = [...newOptions, ...results];
          }

          setLoading(false);
          setOptions(newOptions);
        },
      );
    }
  }, [
    serviceLoaded,
    inputValue,
    getAutocompletionRequest,
    //autoCompleteValue,
    fullAddress,
  ]);

  return {
    serviceLoaded,
    loading,
    options,
    setOptions,
    getPlaceDetailsRequest,
  };
};
