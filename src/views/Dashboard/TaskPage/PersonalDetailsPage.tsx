//import { FC, useMemo } from 'react';
//
//import { observer } from 'mobx-react-lite';
//import { useMst } from '@/models/Root';
//
//import { SceneType } from '@/types';
//
//import {
//  BridgePurchaseTaskPersonalDetails,
//  BridgeRefinanceTaskPersonalDetails,
//  FixPurchaseTaskPersonalDetails,
//  FixRefinanceTaskPersonalDetails,
//  GroundPurchaseTaskPersonalDetails,
//  GroundRefinanceTaskPersonalDetails,
//} from '@/components/organisms';
//
//export const PersonalDetailsPage: FC = observer(() => {
//  const {
//    selectedProcessData: { scene },
//  } = useMst();
//
//  const renderNode = useMemo(() => {
//    switch (scene) {
//      case SceneType.bridge_purchase: {
//        return <BridgePurchaseTaskPersonalDetails />;
//      }
//      case SceneType.bridge_refinance: {
//        return <BridgeRefinanceTaskPersonalDetails />;
//      }
//      case SceneType.fix_purchase: {
//        return <FixPurchaseTaskPersonalDetails />;
//      }
//      case SceneType.fix_refinance: {
//        return <FixRefinanceTaskPersonalDetails />;
//      }
//      case SceneType.ground_purchase: {
//        return <GroundPurchaseTaskPersonalDetails />;
//      }
//      case SceneType.ground_refinance: {
//        return <GroundRefinanceTaskPersonalDetails />;
//      }
//      default:
//        return <BridgePurchaseTaskPersonalDetails />;
//    }
//  }, [scene]);
//
//  return <>{renderNode}</>;
//});
