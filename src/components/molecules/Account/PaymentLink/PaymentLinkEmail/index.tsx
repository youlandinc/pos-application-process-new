import { FC, useMemo } from 'react';
import { Stack } from '@mui/material';

import { useBreakpoints } from '@/hooks';
import { DomainSource, EmailDomainDetails, EmailDomainState } from '@/types';

import {
  PaymentLinkEmailButton,
  PaymentLinkEmailContent,
  PaymentLinkEmailDialog,
  PaymentLinkEmailDialogRemove,
  PaymentLinkEmailHeader,
} from './components';
import {
  useDialog,
  useDialogRemove,
  useFetchCustomEmailDomain,
  useKeyDown,
} from './hooks';

const defaultData = [
  {
    id: 0,
    email: 'JohnDoe@fake-domain.com',
    emailDomain: 'fake-domain.com',
    validStatus: EmailDomainState.PENDING,
    source: DomainSource.DEFAULT,
    userName: 'johnDoe',
  },
];

export const PaymentLinkEmail: FC<{
  data: EmailDomainDetails[];
}> = ({ data = defaultData }) => {
  const breakpoints = useBreakpoints();
  // Integrate duplicate data
  const isSmall = useMemo(
    () => ['xs', 'sm', 'md'].includes(breakpoints),
    [breakpoints],
  );

  const { loading, emailDomainList, setEmailDomainList, onRefresh } =
    useFetchCustomEmailDomain({
      data,
    });

  const {
    activeStep,
    setActiveStep,
    onOpenDialog,
    viewLoading,
    domain,
    setDomain,
    domainVerifyList,
    userName,
    setUserName,
    stepButtonLoading,
    visible,
    onCancelDialog,
    onClickContinue,
    onClickVerify,
    onClickSave,
    onClickCopy,
  } = useDialog({
    emailDomainList,
    setEmailDomainList,
  });

  const {
    deleteItem,
    deleteLoading,
    onClickToDelete,
    onRemove,
    close: deleteClose,
    visible: deleteVisible,
  } = useDialogRemove({ onRefresh, setActiveStep });

  useKeyDown({
    activeStep,
  });

  return (
    <Stack
      border={'1px solid #D2D6E1'}
      borderRadius={2}
      component={'form'}
      gap={{ xs: 2, md: 3 }}
      p={{ xs: 2, md: 3 }}
    >
      <PaymentLinkEmailHeader
        isSmall={isSmall}
        onOpenDialog={onOpenDialog}
        onRefresh={onRefresh}
        viewLoading={viewLoading}
      />

      <PaymentLinkEmailContent
        data={emailDomainList}
        isSmall={isSmall}
        loading={loading}
        onRemove={onRemove}
      />

      {isSmall && (
        <PaymentLinkEmailButton
          onOpenDialog={onOpenDialog}
          viewLoading={viewLoading}
        />
      )}

      <PaymentLinkEmailDialog
        activeStep={activeStep}
        domain={domain}
        domainVerifyList={domainVerifyList}
        isSmall={isSmall}
        onCancelDialog={onCancelDialog}
        onClickContinue={onClickContinue}
        onClickCopy={onClickCopy}
        onClickSave={onClickSave}
        onClickVerify={onClickVerify}
        setDomain={setDomain}
        setUserName={setUserName}
        stepButtonLoading={stepButtonLoading}
        userName={userName}
        visible={visible}
      />

      <PaymentLinkEmailDialogRemove
        deleteClose={deleteClose}
        deleteItem={deleteItem}
        deleteLoading={deleteLoading}
        deleteVisible={deleteVisible}
        onClickToDelete={onClickToDelete}
      />
    </Stack>
  );
};
