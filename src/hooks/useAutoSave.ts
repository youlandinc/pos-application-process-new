import { AUTO_HIDE_DURATION } from '@/constants';
import { enqueueSnackbar } from 'notistack';
import { useEffect, useState } from 'react';

import {
  BridgeApplicationProcessSnapshot,
  HttpError,
  MortgageApplicationProcessSnapshot,
} from '@/types';
import { VariableName } from '@/types/enum';
import { IBpmn } from '@/models/base';
import {
  IBridgePurchase,
  IBridgeRefinance,
  IMortgagePurchase,
  IMortgageRefinance,
} from '@/models/application/base';

import { _updateProcessVariables } from '@/requests';
import { useDebounceFn, usePersistFn } from './index';

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

    try {
      _updateProcessVariables(bpmn.processId as string, [
        {
          name: VariableName.clientAppProgress,
          type: 'json',
          value: appProgressSnap,
        },
      ]);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
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
