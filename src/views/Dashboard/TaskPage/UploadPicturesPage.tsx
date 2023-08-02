import { SceneType } from '@/types';
import { FC, useMemo } from 'react';
import { Stack } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';
import {
  BridgePurchaseTaskUploadPictures,
  BridgeRefinanceTaskUploadPictures,
  FixPurchaseTaskUploadPictures,
  FixRefinanceTaskUploadPictures,
} from '@/components/organisms';

export const UploadPicturesPage: FC = observer(() => {
  const {
    selectedProcessData: { scene },
  } = useMst();

  const renderNode = useMemo(() => {
    switch (scene) {
      case SceneType.bridge_purchase: {
        return <BridgePurchaseTaskUploadPictures />;
      }
      case SceneType.bridge_refinance: {
        return <BridgeRefinanceTaskUploadPictures />;
      }
      case SceneType.fix_purchase: {
        return <FixPurchaseTaskUploadPictures />;
      }
      case SceneType.fix_refinance: {
        return <FixRefinanceTaskUploadPictures />;
      }
      default:
        return <BridgePurchaseTaskUploadPictures />;
    }
  }, [scene]);

  return (
    <Stack
      flexDirection={'column'}
      justifyContent={'flex-start'}
      maxWidth={900}
      mx={{ lg: 'auto', xs: 0 }}
      px={{ lg: 3, xs: 0 }}
      width={'100%'}
    >
      {renderNode}
    </Stack>
  );
});
