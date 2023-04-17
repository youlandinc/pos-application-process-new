import { FC, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { useMst } from '@/models/Root';
import { usePersistFn } from '@/hooks';
import { DetectActiveService } from '@/services/DetectActive';
import { userpool } from '@/constants';
import { LoginType, UserType } from '@/types/enum';

import { ProviderDetectActiveProps } from './index';

export const ProviderDetectActive: FC<ProviderDetectActiveProps> = observer(
  ({ children }) => {
    //const store = useMst();
    //const { detectUserActiveService, persistDataLoaded, session } = store;

    //const setServiceFromStorage = usePersistFn(() => {
    //  let lastAuthId;
    //  if (userpool.getLastAuthUserId()) {
    //    lastAuthId = userpool.getLastAuthUserId();
    //  }
    //  if (
    //    !lastAuthId ||
    //    !session ||
    //    !userpool.getLastAuthUserToken(lastAuthId, 'accessToken')
    //  ) {
    //    return;
    //  }
    //
    //  const userData = {
    //    refreshToken: userpool.getLastAuthUserToken(lastAuthId, 'refreshToken'),
    //    accessToken: userpool.getLastAuthUserToken(lastAuthId, 'accessToken'),
    //    userProfile: {
    //      name: lastAuthId,
    //      email: userpool.getLastAuthUserInfo(lastAuthId, 'email'),
    //      userType: userpool.getLastAuthUserInfo(
    //        lastAuthId,
    //        'user_type',
    //      ) as UserType,
    //      loginType: userpool.getLastAuthUserInfo(
    //        lastAuthId,
    //        'login_type',
    //      ) as LoginType,
    //    },
    //  };
    //  detectUserActiveService.setDetectUserActiveService(
    //    new DetectActiveService(userData),
    //  );
    //});
    //
    //useEffect(() => {
    //  if (!persistDataLoaded) {
    //    return;
    //  }
    //  if (detectUserActiveService.instance) {
    //    detectUserActiveService.instance.startDetect();
    //  } else {
    //    setServiceFromStorage();
    //  }
    //  return () => {
    //    if (detectUserActiveService.instance) {
    //      detectUserActiveService.instance.destroy();
    //    }
    //  };
    //}, [
    //  detectUserActiveService.instance,
    //  setServiceFromStorage,
    //  persistDataLoaded,
    //  store.userProfile,
    //]);

    return <>{children}</>;
  },
);
