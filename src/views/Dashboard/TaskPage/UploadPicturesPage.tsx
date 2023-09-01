import { FC, useMemo } from 'react';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { SceneType } from '@/types';

import {
  BridgePurchaseTaskUploadPictures,
  BridgeRefinanceTaskUploadPictures,
  FixPurchaseTaskUploadPictures,
  FixRefinanceTaskUploadPictures,
  GroundPurchaseTaskUploadPictures,
  GroundRefinanceTaskUploadPictures,
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
      case SceneType.ground_purchase: {
        return <GroundPurchaseTaskUploadPictures />;
      }
      case SceneType.ground_refinance: {
        return <GroundRefinanceTaskUploadPictures />;
      }
      default:
        return <BridgePurchaseTaskUploadPictures />;
    }
  }, [scene]);

  return <>{renderNode}</>;
});
