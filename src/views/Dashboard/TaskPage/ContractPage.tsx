//import { FC, useMemo } from 'react';
//
//import { observer } from 'mobx-react-lite';
//import { useMst } from '@/models/Root';
//
//import { SceneType } from '@/types';
//import {
//  BridgePurchaseTaskContract,
//  FixPurchaseTaskContract,
//  GroundPurchaseTaskContract,
//} from '@/components/organisms';
//
//export const ContractPage: FC = observer(() => {
//  const {
//    selectedProcessData: { scene },
//  } = useMst();
//
//  const renderNode = useMemo(() => {
//    switch (scene) {
//      case SceneType.bridge_purchase: {
//        return <BridgePurchaseTaskContract />;
//      }
//      case SceneType.fix_purchase: {
//        return <FixPurchaseTaskContract />;
//      }
//      case SceneType.ground_purchase: {
//        return <GroundPurchaseTaskContract />;
//      }
//      default:
//        return <BridgePurchaseTaskContract />;
//    }
//  }, [scene]);
//
//  return <>{renderNode}</>;
//});
