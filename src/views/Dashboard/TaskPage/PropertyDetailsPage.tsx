//import { FC, useMemo } from 'react';
//
//import { observer } from 'mobx-react-lite';
//import { useMst } from '@/models/Root';
//
//import { SceneType } from '@/types';
//
//import {
//  BridgePurchaseTaskPropertyDetails,
//  BridgeRefinanceTaskPropertyDetails,
//  FixPurchaseTaskPropertyDetails,
//  FixRefinanceTaskPropertyDetails,
//  GroundPurchaseTaskPropertyDetails,
//  GroundRefinanceTaskPropertyDetails,
//} from '@/components/organisms';
//
//export const PropertyDetailsPage: FC = observer(() => {
//  const {
//    selectedProcessData: { scene },
//  } = useMst();
//
//  const renderNode = useMemo(() => {
//    switch (scene) {
//      case SceneType.bridge_purchase: {
//        return <BridgePurchaseTaskPropertyDetails />;
//      }
//      case SceneType.bridge_refinance: {
//        return <BridgeRefinanceTaskPropertyDetails />;
//      }
//      case SceneType.fix_purchase: {
//        return <FixPurchaseTaskPropertyDetails />;
//      }
//      case SceneType.fix_refinance: {
//        return <FixRefinanceTaskPropertyDetails />;
//      }
//      case SceneType.ground_purchase: {
//        return <GroundPurchaseTaskPropertyDetails />;
//      }
//      case SceneType.ground_refinance: {
//        return <GroundRefinanceTaskPropertyDetails />;
//      }
//      default:
//        return <BridgePurchaseTaskPropertyDetails />;
//    }
//  }, [scene]);
//
//  return <>{renderNode}</>;
//});
