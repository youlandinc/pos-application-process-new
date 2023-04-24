import { useCallback, useEffect, useMemo, useState } from 'react';
//import { Box, CircularProgress, makeStyles } from '@material-ui/core';
//import { flexCenter, size, POSFont } from '@/common/styles/global';
//import { MortgagePurchaseForm, MortgageRefinanceForm } from './Mortgage';
//import { BridgePurchaseForm, BridgeRefinanceForm } from './Bridge';
//import { useNextBtnClasses } from '@/common/classes';

import Image from 'next/image';
import { useRouter } from 'next/router';

import { StyledButton } from '@/components/atoms';
import { useAsyncFn } from 'react-use';
import { useNotification } from '@/hooks/useNotification';

import { usePersistFn, useStoreData } from '@/hooks';
import { POSFindSpecificVariable } from '@/utils';
import { _fetchProcessData, _startProcess } from '@/requests';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';
import {
  SBridgePurchase,
  SBridgeRefinance,
  SMortgagePurchase,
  SMortgageRefinance,
} from '@/models/application/base';
import {
  BridgeApplicationProcessSnapshot,
  MortgageApplicationProcessSnapshot,
  ProcessData,
  VariableName,
} from '@/types';

export interface LoanApplicationProps {
  productCategory: ProductCategory;
  applicationType: ApplicationType;
}

const useInitProcessData = (
  productCategory: ProductCategory,
  productType: ApplicationType,
) => {
  const router = useRouter();

  const store = useMst();
  const { bpmn, applicationForm, session } = store;
  const { initialized } = applicationForm;

  const hasProcessId = useMemo<boolean>(
    () => !!router.query.processId,
    [router.query],
  );
  const { bindProcess } = useStoreData();

  const [applicationType, setApplicationType] =
    useState<ApplicationType>(productType);

  const handleBack = useCallback(() => {
    applicationForm.setInitialized(false);
  }, [applicationForm]);

  const [lastSelectedType, setLastSelectedType] = useState<ApplicationType>();

  //const getTenantConfig = utils.getTenantConfig();

  // start new progress
  const [initState, startProgress] = useAsyncFn(
    async (applicationType, productCategory) => {
      let productName = `${productCategory}_${applicationType}`;
      if (productCategory === 'mortgage' && applicationType === 'purchase') {
        productName = 'mortgage';
      }
      return await _startProcess(productName, '1000052022092800000102').catch(
        (err) => {
          console.log(err);
          return;
        },
      );
    },
    [bpmn],
  );

  const [loadState, fetchProcessData] = useAsyncFn(
    async (processId: string) => {
      return await _fetchProcessData(processId).catch((err) => {
        console.log(err);
        return;
      });
    },
    [],
  );

  const loadServerTaskProgress = useCallback(
    (processData: ProcessData) => {
      bpmn.setProcessId(processData.extra.id);
      bpmn.setTaskKey(processData.currentTasks[0].bpmn.key);
      bpmn.setTaskId(processData.currentTasks[0].extra.id);
      bpmn.setOwners(processData.owners);
      applicationForm.formData.loadProcessData(processData);
    },
    [applicationForm.formData, bpmn],
  );

  const loadClientTaskProgressAndData = useCallback(
    (processData: ProcessData) => {
      const variables = processData.extra.variables;
      const clientAppProgressVariable = POSFindSpecificVariable<
        BridgeApplicationProcessSnapshot | MortgageApplicationProcessSnapshot
      >(VariableName.clientAppProgress, variables);
      if (clientAppProgressVariable) {
        const { applicationType, productCategory } =
          clientAppProgressVariable.value;
        applicationForm.initForm(productCategory, applicationType);
        applicationForm.formData.setClientState(
          clientAppProgressVariable.value,
        );
        setLastSelectedType(applicationType);
        setApplicationType(applicationType);
      } else {
        console.error(
          "Can't find the client process data, unable to initialize the application",
        );
      }
    },
    [applicationForm],
  );

  // if has session & processId (This progress must belong to the current login user)
  const handleLoadProcess = usePersistFn(async (processId: string) => {
    const processData = await fetchProcessData(processId).catch((err) => {
      console.log(err);
      return;
    });
    if (!processData) {
      return;
    }
    // load the client application progress
    loadClientTaskProgressAndData(processData.data);
    // load the server application progress
    loadServerTaskProgress(processData.data);
    // If the process does not have owners, automatically bind
    if (processData.data.owners.length === 0 && initialized && session) {
      bindProcess();
    }
  });

  // If you don't bring a processId
  const handleInitForm = usePersistFn(() => {
    startProgress(applicationType, productCategory).then((res) => {
      if (!res) {
        return;
      }
      if (applicationType !== lastSelectedType) {
        applicationForm.initForm<
          | SMortgagePurchase
          | SMortgageRefinance
          | SBridgePurchase
          | SBridgeRefinance
        >(productCategory, applicationType);
        setLastSelectedType(applicationType);
        if (res) {
          loadServerTaskProgress(res.data);
        }
      } else {
        applicationForm.setInitialized(true);
      }
      // update url params
      router.push(
        router.pathname,
        `${router.pathname}?processId=${bpmn.processId}`,
        { shallow: true },
      );
    });
  });

  // if url has processId, load processData
  useEffect(() => {
    if (hasProcessId) {
      handleLoadProcess(router.query.processId as string);
    }
  }, [handleLoadProcess, hasProcessId, router.query]);

  return {
    applicationType,
    handleBack,
    handleInitForm,
    setApplicationType,
    loadState,
    initState,
  };
};

export const LoanApplication = observer<LoanApplicationProps>((props) => {
  const { productCategory, applicationType: productType } = props;
  const store = useMst();
  const {
    notificationStation,
    applicationForm: { initialized },
  } = store;

  const {
    applicationType,
    handleBack,
    handleInitForm,
    setApplicationType,
    loadState,
    initState,
  } = useInitProcessData(productCategory, productType);

  useNotification(notificationStation);

  const renderApplicationForm = useMemo(() => {
    // todo , fix this bug
    switch (productCategory) {
      case 'mortgage': {
        if (!productType && !applicationType) {
          return null;
        }
        if (productType === 'purchase' || applicationType === 'purchase') {
          //return <MortgagePurchaseForm handleBack={handleBack} />;
        }
        if (productType === 'refinance' || applicationType === 'refinance') {
          //return <MortgageRefinanceForm handleBack={handleBack} />;
        }
        break;
      }
      case 'bridge': {
        if (!productType && !applicationType) {
          return null;
        }
        if (productType === 'purchase' || applicationType === 'purchase') {
          return <BridgePurchaseForm handleBack={handleBack} />;
        }
        if (productType === 'refinance' || applicationType === 'refinance') {
          return <BridgeRefinanceForm handleBack={handleBack} />;
        }
        break;
      }
    }
  }, [productType, handleBack, productCategory, applicationType]);

  return (
    <Box className={classes.root}>
      {initialized ? (
        renderApplicationForm
      ) : (
        <Box className={classes.firstPage}>
          {loadState.loading ? (
            <CircularProgress
              style={{
                ...size(48),
              }}
            />
          ) : (
            <Box className={classes.selectionWrap}>
              <Box className={classes.firstPageSelection}>
                <Box
                  position="relative"
                  overflow={'hidden'}
                  onClick={() => setApplicationType('purchase')}
                >
                  <Box
                    className={classes.btnText}
                    color={applicationType === 'purchase' ? '#fff' : '#787878'}
                  >
                    Are you buying?
                  </Box>
                  <Box className={classes.applicationBtn}>
                    <Image
                      width={400}
                      height={325}
                      draggable={false}
                      src={
                        applicationType === 'purchase'
                          ? activeBtnImg.src
                          : defaultBtnImg.src
                      }
                    />
                  </Box>
                </Box>

                <Box
                  margin={'72px 36px 0 36px'}
                  color={'rgba(0,0,0,.6)'}
                  fontSize={36}
                  fontWeight={700}
                >
                  Or
                </Box>
                <Box
                  position="relative"
                  onClick={() => setApplicationType('refinance')}
                >
                  <Box
                    className={classes.btnText}
                    color={applicationType === 'refinance' ? '#fff' : '#787878'}
                  >
                    Refinancing?
                  </Box>
                  <Box className={classes.applicationBtn}>
                    <Image
                      width={400}
                      height={325}
                      draggable={false}
                      src={
                        applicationType === 'refinance'
                          ? activeBtnImg.src
                          : defaultBtnImg.src
                      }
                    />
                  </Box>
                </Box>
              </Box>
              <Box className={classes.firstPageActionWrap}>
                <StyledButton
                  loading={initState.loading}
                  onClick={handleInitForm}
                  classes={nextBtnClasses}
                  disabled={!applicationType}
                >
                  Next
                </StyledButton>
              </Box>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
});
