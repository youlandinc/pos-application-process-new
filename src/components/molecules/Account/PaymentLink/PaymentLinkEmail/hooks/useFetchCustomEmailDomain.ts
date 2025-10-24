import { useCallback, useState } from 'react';
import { enqueueSnackbar } from 'notistack';

import { EmailDomainDetails, HttpError } from '@/types';
import { _fetchCustomEmailDomains } from '@/requests';
import { AUTO_HIDE_DURATION } from '@/constants';

interface UseFetchCustomEmailDomainProps {
  data: EmailDomainDetails[];
}

export const useFetchCustomEmailDomain = ({
  data,
}: UseFetchCustomEmailDomainProps) => {
  const [loading, setLoading] = useState(false);
  const [emailDomainList, setEmailDomainList] =
    useState<EmailDomainDetails[]>(data);

  const onRefresh = useCallback(async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
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
      setLoading(false);
    }
  }, [loading]);

  return {
    loading,
    emailDomainList,
    setEmailDomainList,
    onRefresh,
  };
};
