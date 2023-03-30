import { useEffect, useState } from 'react';
import { IBpmn } from '@/models/Bpmn';
import { _updateProcessVariables } from '@/requests';
import {
  BridgeApplicationProcessSnapshot,
  MortgageApplicationProcessSnapshot,
} from '@/types';
import { usePersistFn } from '@/hooks/usePersistFn';
import { useDebounceFn } from '@/hooks/useDebounceFn';
import { VariableName } from '@/types/enum';
import {
  IBridgePurchase,
  IBridgeRefinance,
  IMortgagePurchase,
  IMortgageRefinance,
} from '@/models/product';

export const useAutoSave = (
  formData:
    | IMortgagePurchase
    | IMortgageRefinance
    | IBridgePurchase
    | IBridgeRefinance,
  bpmn: IBpmn,
) => {
  const [lastPostData, setLastPostData] = useState<
    MortgageApplicationProcessSnapshot | BridgeApplicationProcessSnapshot
  >();

  const saveClientApplicationProgress = usePersistFn(() => {
    const appProgressSnap = (
      formData as
        | IMortgagePurchase
        | IMortgageRefinance
        | IBridgePurchase
        | IBridgeRefinance
    ).getApplicationProgressSnapshot();

    if (
      lastPostData !== void 0 &&
      JSON.stringify(lastPostData) === JSON.stringify(appProgressSnap)
    ) {
      return;
    }
    setLastPostData(appProgressSnap);

    _updateProcessVariables(bpmn.processId, [
      {
        name: VariableName.clientAppProgress,
        type: 'json',
        value: appProgressSnap,
      },
    ]);
  });

  const { run: saveClientApplicationProgressDebounce } = useDebounceFn(
    saveClientApplicationProgress,
  );

  const { state, starting, creditScore } = formData;

  const { assets, DTI } = formData as IMortgagePurchase | IMortgageRefinance;

  useEffect(() => {
    saveClientApplicationProgressDebounce();
  }, [
    state,
    starting.state,
    creditScore.state,
    assets?.state,
    DTI?.state,
    saveClientApplicationProgressDebounce,
  ]);
};
