//import { FC, useMemo } from 'react';
//
//import { observer } from 'mobx-react-lite';
//import { useMst } from '@/models/Root';
//
//import { SceneType } from '@/types';
//import {
//  BridgePurchaseTaskPropertyInspection,
//  BridgeRefinanceTaskPropertyInspection,
//  FixPurchaseTaskPropertyInspection,
//  FixRefinanceTaskPropertyInspection,
//  GroundPurchaseTaskPropertyInspection,
//  GroundRefinanceTaskPropertyInspection,
//} from '@/components/organisms';
//
//export const PropertyInspectionPage: FC = observer(() => {
//  const {
//    selectedProcessData: { scene },
//  } = useMst();
//
//  const renderNode = useMemo(() => {
//    switch (scene) {
//      case SceneType.bridge_purchase: {
//        return <BridgePurchaseTaskPropertyInspection />;
//      }
//      case SceneType.bridge_refinance: {
//        return <BridgeRefinanceTaskPropertyInspection />;
//      }
//      case SceneType.fix_purchase: {
//        return <FixPurchaseTaskPropertyInspection />;
//      }
//      case SceneType.fix_refinance: {
//        return <FixRefinanceTaskPropertyInspection />;
//      }
//      case SceneType.ground_purchase: {
//        return <GroundPurchaseTaskPropertyInspection />;
//      }
//      case SceneType.ground_refinance: {
//        return <GroundRefinanceTaskPropertyInspection />;
//      }
//      default:
//        return <BridgePurchaseTaskPropertyInspection />;
//    }
//  }, [scene]);
//
//  return <>{renderNode}</>;
//});
