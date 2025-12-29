import { Dispatch, SetStateAction, useCallback, useState } from 'react';
import { enqueueSnackbar } from 'notistack';

import { AUTO_HIDE_DURATION } from '@/constants';
import { useSwitch } from '@/hooks';
import {
  _addCustomEmailDomain,
  _fetchCustomEmailDomains,
  _fetchIdentityCustomEmailDomain,
  _modifyCustomEmailDomain,
  _verifyCustomEmailDomain,
} from '@/requests';
import {
  EmailDomainData,
  EmailDomainDetails,
  EmailDomainState,
  HttpError,
} from '@/types';

interface UseDialogProps {
  emailDomainList: EmailDomainDetails[];
  setEmailDomainList: Dispatch<SetStateAction<EmailDomainDetails[]>>;
}

export const useDialog = ({
  emailDomainList,
  setEmailDomainList,
}: UseDialogProps) => {
  const { open, close, visible } = useSwitch(false);

  const [viewLoading, setViewLoading] = useState(false);
  const [stepButtonLoading, setStepButtonLoading] = useState<boolean>(false);

  const [activeStep, setActiveStep] = useState(0);

  const [domain, setDomain] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  const [domainVerifyList, setDomainVerifyList] = useState<EmailDomainData[]>(
    [],
  );

  const onOpenDialog = useCallback(async () => {
    if (!emailDomainList) {
      return;
    }
    const target = emailDomainList.find(
      (item) => item.validStatus !== EmailDomainState.ACTIVE,
    );
    if (target) {
      const { validStatus, userName } = target;
      switch (validStatus) {
        case EmailDomainState.ACTIVE:
          setActiveStep(0);
          break;
        case EmailDomainState.PENDING:
          setActiveStep(1);
          setViewLoading(true);
          try {
            const { data } = await _fetchIdentityCustomEmailDomain({
              domain: target.emailDomain,
            });
            setDomainVerifyList(data);
          } catch (err) {
            const { header, message, variant } = err as HttpError;
            enqueueSnackbar(message, {
              variant: variant || 'error',
              autoHideDuration: AUTO_HIDE_DURATION,
              isSimple: !header,
              header,
            });
          }
          break;
        case EmailDomainState.SUCCESS:
          if (!userName) {
            setViewLoading(true);
            try {
              const { data } = await _fetchIdentityCustomEmailDomain({
                domain: target.emailDomain,
              });
              setDomainVerifyList(data);
            } catch (err) {
              const { header, message, variant } = err as HttpError;
              enqueueSnackbar(message, {
                variant: variant || 'error',
                autoHideDuration: AUTO_HIDE_DURATION,
                isSimple: !header,
                header,
              });
            }
          }
          setActiveStep(userName ? 2 : 1);
          break;
      }
    } else {
      setActiveStep(0);
    }
    setViewLoading(false);
    open();
  }, [emailDomainList, open]);

  const onCancelDialog = useCallback(() => {
    close();
    setTimeout(() => {
      setActiveStep(0);
      setUserName('');
      setDomain('');
    }, 200);
  }, [close]);

  const onClickContinue = useCallback(async () => {
    if (domain.trim() === '') {
      return;
    }
    setStepButtonLoading(true);
    try {
      const { data } = await _addCustomEmailDomain({ domain });
      setDomainVerifyList(data);
      const res = await _fetchCustomEmailDomains();
      setEmailDomainList(res.data);
      setTimeout(() => {
        setActiveStep(1);
      }, 10);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setStepButtonLoading(false);
    }
  }, [domain, setEmailDomainList]);

  const onClickVerify = useCallback(async () => {
    if (emailDomainList.length <= 1) {
      return;
    }
    const target = emailDomainList.find(
      (item) => item.validStatus !== EmailDomainState.ACTIVE,
    );
    if (!target) {
      return;
    }
    setStepButtonLoading(true);
    try {
      const { emailDomain } = target;
      await _verifyCustomEmailDomain({
        domain: emailDomain,
      });
      const { data } = await _fetchCustomEmailDomains();
      setEmailDomainList(data);

      setTimeout(() => {
        setActiveStep(2);
      }, 10);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setStepButtonLoading(false);
    }
  }, [emailDomainList, setEmailDomainList]);

  const onClickSave = useCallback(async () => {
    const target = emailDomainList.find(
      (item) => item.validStatus !== EmailDomainState.ACTIVE,
    );
    if (!target) {
      return;
    }
    setStepButtonLoading(true);
    const { id } = target;
    const params = {
      id,
      userName,
    };
    try {
      await _modifyCustomEmailDomain(params);
      const { data } = await _fetchCustomEmailDomains();
      setEmailDomainList(data);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setStepButtonLoading(false);
    }
    setUserName('');
    setDomain('');
    setTimeout(() => {
      close();
    }, 10);
  }, [close, emailDomainList, setEmailDomainList, userName]);

  const onClickCopy = useCallback(async (type: string, text: string) => {
    await navigator.clipboard.writeText(text);
    enqueueSnackbar(`Copied ${type} to clipboard`, {
      variant: 'success',
    });
  }, []);

  return {
    activeStep,
    setActiveStep,
    onOpenDialog,
    onCancelDialog,
    viewLoading,
    domain,
    setDomain,
    domainVerifyList,
    userName,
    setUserName,
    stepButtonLoading,
    visible,
    onClickContinue,
    onClickVerify,
    onClickSave,
    onClickCopy,
  };
};
