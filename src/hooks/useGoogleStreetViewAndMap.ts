import { MutableRefObject, useCallback, useEffect, useState } from 'react';

const googleMap: { current: null | google.maps.Map } = { current: null };
const panorama: { current: null | google.maps.StreetViewPanorama } = {
  current: null,
};

export const useGoogleStreetViewAndMap = (
  lat: number | null | undefined,
  lng: number | null | undefined,
  mapRef: MutableRefObject<HTMLDivElement | null>,
  panoramaRef: MutableRefObject<HTMLDivElement | null>,
) => {
  const [serviceLoaded, setServiceLoaded] = useState(false);
  const loadGoogleMapService = useCallback((): void => {
    if (!lat || !lng) {
      return;
    }
    if (!googleMap.current && !panorama.current && (window as Window).google) {
      googleMap.current = new (window as Window).google.maps.Map(
        mapRef!.current!,
        {
          center: { lat, lng },
          zoom: 14,
        },
      );
      panorama.current = new (window as Window).google.maps.StreetViewPanorama(
        panoramaRef!.current!,
        {
          position: { lat, lng },
          pov: {
            heading: 34,
            pitch: 10,
          },
        },
      );
    }
    googleMap.current!.setStreetView(panorama.current);
    setServiceLoaded(!(!googleMap.current || !panorama.current));
  }, [lat, lng, mapRef, panoramaRef]);

  const relocate = (lat: number, lng: number) => {
    googleMap.current?.setCenter({ lat, lng });
    panorama.current?.setPosition({ lat, lng });
  };

  const reset = () => {
    googleMap.current = null;
    panorama.current = null;
  };

  useEffect(() => {
    loadGoogleMapService();
  }, [loadGoogleMapService]);

  return {
    serviceLoaded,
    relocate,
    reset,
  };
};
