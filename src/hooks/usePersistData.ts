import { useEffect, useLayoutEffect, useMemo } from 'react';
import { AutoPersistService, RootStoreKey } from '@/services/PersistData';
import { useMst } from '@/models/Root';
import { LoginType, UserType } from '@/types/enum';
import { userpool } from '@/constants';

const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? useLayoutEffect : useEffect;

export const usePersisData = (rootStoreKeys: RootStoreKey[]) => {
  const autoPersistService = useMemo(
    () => new AutoPersistService(rootStoreKeys),
    [rootStoreKeys],
  );

  const store = useMst();

  useIsomorphicLayoutEffect(() => {
    autoPersistService.loadPersisDataFromStorage();
    store.setPersistDataLoaded();
  }, []);

  // save persist data
  useEffect(() => {
    autoPersistService.autoStoreWhenStateChange();
    return () => {
      autoPersistService.destroy();
    };
  }, [autoPersistService]);

  useEffect(() => {
    let role = UserType.CUSTOMER;
    const lastAuthId = userpool.getLastAuthUserId();
    if (lastAuthId && userpool.getLastAuthUserInfo(lastAuthId, 'user_type')) {
      role = userpool.getLastAuthUserInfo(lastAuthId, 'user_type') as UserType;
    }
    store.updateUserType(role);
  }, [store]);

  useEffect(() => {
    const lastAuthId = userpool.getLastAuthUserId();
    const loginType = userpool.getLastAuthUserInfo(
      lastAuthId,
      'login_type',
    ) as LoginType;
    store.updateLoginType(loginType);
  }, [store]);
};
