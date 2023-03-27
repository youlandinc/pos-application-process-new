export declare namespace GooglePlaces {
  /**
   * Detail Types:
   *
   * - [see](https://developers.google.com/maps/documentation/javascript/reference/places-autocomplete-service#AutocompletionRequest)
   */
  interface AutocompletionRequest {
    input: string;
    types: string[];
    fields: string[];
    componentRestrictions: Record<string, unknown>;
  }

  /**
   * Detail Types:
   *
   * - [see](https://developers.google.com/maps/documentation/javascript/reference/places-service?hl=en#PlaceDetailsRequest)
   */
  interface PlaceDetailsRequest {
    fields: string[];
    placeId: string;
  }
}
