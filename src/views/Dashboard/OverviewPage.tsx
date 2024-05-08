import { FC, useMemo } from 'react';
import { useRouter } from 'next/router';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useSessionStorageState } from '@/hooks';
import { Overview } from '@/components/organisms';

export const OverviewPage: FC = observer(() => {
  // const {
  //   selectedProcessData: { scene, loading },
  // } = useMst();

  const router = useRouter();

  const { saasState } = useSessionStorageState('tenantConfig');

  // const renderOverPage = useMemo(() => {
  //   const { processId } = router.query;
  //   if (!processId || loading || !scene || !saasState?.serviceTypeEnum) {
  //     return (
  //       <Stack
  //         alignItems={'center'}
  //         justifyContent={'center'}
  //         margin={'auto 0'}
  //         minHeight={'calc(667px - 46px)'}
  //         width={'100%'}
  //       >
  //         <StyledLoading sx={{ color: 'text.grey' }} />
  //       </Stack>
  //     );
  //   }
  // }, [loading, router.query, saasState?.serviceTypeEnum, scene]);

  return <Overview />;
});
