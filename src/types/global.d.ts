interface FormNodeBaseProps {
  nextStep?: () => void;
  backStep?: () => void;
  nextState?: boolean;
  backState?: boolean;
  data?: any;
}

interface Option {
  label: string;
  value: string | number;
  key: string | number;
  tooltip?: string;
}

type Maybe<T> = T | void;

interface UserSession {
  accessToken: {
    jwtToken: string;
  };
  idToken: {
    jwtToken: string;
  };
  refreshToken: {
    token: string;
  };
}

interface ClientUserProfile {
  username?: string | undefined;
  email?: string | undefined;
  userType?: import('@/types/enum.ts').UserType | undefined;
  loginType?: import('@/types/enum').LoginType | undefined;
  userId?: string | undefined;
}

type google = import('@types/google.maps');

interface Window {
  google: typeof google;
  dataLayer: Record<string, any>[];
}
