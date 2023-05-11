import {
  FC,
  FormEventHandler,
  forwardRef,
  ReactNode,
  useCallback,
  useState,
} from 'react';

import { useSnackbar } from 'notistack';

import { POSFlex, POSFont } from '@/styles';
import { LoanStage } from '@/types/enum';
import {
  StyledButton,
  StyledLoading,
  StyledTextField,
} from '@/components/atoms';
import { PageHeader } from '@/components/molecules';
import { _fetchPDFFile, _sendPreapprovalLetter } from '@/requests/dashboard';
import { Box, BoxProps } from '@mui/material';
import { POSFormatDollar } from '@/utils';

const useStyles = {
  '&.container': {
    // minWidth: 904,
    maxWidth: 900,
    px: { lg: 3, xs: 0 },
  },
  '& .card_title': {
    ...POSFont({ md: 24, xs: 18 }, 600, 1.5, 'text.primary'),
    mb: 1.5,
  },
  '& .card_content': {
    ...POSFont({ md: 16, xs: 12 }, 400, 1.5),
  },

  '& .input': {},
  '& .button_style': {
    width: {
      xl: 200,
      xs: '100%',
    },
    mt: {
      xl: 0,
      xs: 3,
    },
  },
  '& .secondButton': {
    ...POSFont(16, 700, 1.5, '#ffffff'),
    textTransform: 'none',
    background: '#7B96B5',
    minWidth: 200,
    height: 50,
    borderRadius: 8,
    '&:hover': {
      background: '#446B99',
    },
  },
} as const;

interface PreApprovalInfoProps {
  loading: boolean;
  loanAmount?: number;
  onClickEdit: () => void;
  lastSelectedProcessId?: string;
  loanStage?: LoanStage;
}

export const PreApprovalInfo = forwardRef<
  HTMLInputElement,
  PreApprovalInfoProps
>((props, ref) => {
  const {
    loading,
    loanAmount = 0,
    onClickEdit,
    lastSelectedProcessId,
    loanStage,
  } = props;

  const { enqueueSnackbar } = useSnackbar();

  const [email, setEmail] = useState<string>('');

  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);
  const [sendLoading, setSendLoading] = useState<boolean>(false);

  const onEmailSubmit = useCallback<FormEventHandler>(
    async (e) => {
      e.preventDefault();

      setSendLoading(true);
      try {
        await _sendPreapprovalLetter(lastSelectedProcessId as string, email);
        enqueueSnackbar('Email was successfully sent', {
          variant: 'success',
        });
        setSendLoading(false);
      } catch (error) {
        enqueueSnackbar(error as string, { variant: 'error' });
        setSendLoading(false);
      }
    },
    [enqueueSnackbar, lastSelectedProcessId, email],
  );

  const onDownloadPDF = useCallback(
    async () => {
      const handler = (data: BlobPart, fileName: string) => {
        // file export
        if (!data) {
          setDownloadLoading(false);
          return;
        }
        const url = window.URL.createObjectURL(
          new Blob([data], { type: 'application/pdf' }),
        );

        const a = document.createElement('a');
        a.style.display = 'none';
        a.download = fileName;
        a.href = url;
        a.click();
        if (document.body.contains(a)) {
          document.body.removeChild(a);
        }
        setDownloadLoading(false);
      };
      setDownloadLoading(true);
      const res = await _fetchPDFFile(lastSelectedProcessId as string);
      const fileName = res.headers['content-disposition'].split('=')[1];
      handler(res.data, fileName);
    },
    // this function never change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  return (
    <Box className={'container'} sx={useStyles}>
      <PageHeader title={'Pre-approval letter'} />
      <ActionCard
        label={
          <Box>
            <Box className={'card_title'}>Your current loan amount is</Box>
            <Box sx={{ ...POSFont(24, 600, 1.2, 'primary.main'), mb: 1.5 }}>
              {loading ? (
                <StyledLoading
                  // iconSize={size(40)}
                  sx={{ justifyContent: 'flex-start' }}
                />
              ) : (
                POSFormatDollar(loanAmount)
              )}
            </Box>
            <Box className={'card_content'} color={'text.secondary'}>
              Your final loan amount will be verified through the full
              underwriting process, but the pre-approval letter is still a
              valuable and accurate tool that will greatly increase your chances
              of winning an offer on the home of your choice.
            </Box>
          </Box>
        }
        mt={3}
      >
        <StyledButton
          className={'button_style'}
          color={'info'}
          disabled={loading || downloadLoading}
          onClick={onDownloadPDF}
          variant={'outlined'}
        >
          {downloadLoading ? 'Downloading...' : 'Download PDF'}
        </StyledButton>
      </ActionCard>
      <ActionCard
        component="form"
        label={
          <Box>
            <Box className={'card_title'}>
              Who should we send your letter to?
            </Box>
            <Box className={'card_content'} color={'text.secondary'} mb={3}>
              We&apos;ll keep whoever you want in the loop about the
              pre-approval letter update.
            </Box>
            <StyledTextField
              className={'input'}
              inputRef={ref}
              label="Email address"
              onChange={(e) => setEmail(e.target.value)}
              required
              type="email"
              value={email}
            />
          </Box>
        }
        mt={3}
        onSubmit={onEmailSubmit}
        style={{ alignItems: 'flex-end' }}
      >
        <StyledButton
          className={'button_style'}
          color={'primary'}
          disabled={loading || sendLoading}
          type="submit"
          variant={'contained'}
        >
          {sendLoading ? 'Sending...' : 'Send'}
        </StyledButton>
      </ActionCard>
      {![
        LoanStage.RateLocked,
        LoanStage.RateLocking,
        LoanStage.Approved,
      ].includes(loanStage as LoanStage) && (
        <ActionCard
          bgcolor={'action.hover'}
          label={
            <Box>
              <Box className={'card_title'}>Edit your pre-approval letter</Box>
              <Box className={'card_content'} color={'text.primary'}>
                You can edit the purchase price and down payment amounts on your
                letter so that it is personalized to a specific property when
                you&apos;re making offers.
              </Box>
            </Box>
          }
          mt={3}
          style={{ boxShadow: 'none' }}
        >
          <StyledButton
            className={'button_style'}
            color={'primary'}
            disabled={loading}
            onClick={onClickEdit}
            variant={'contained'}
          >
            Edit amount
          </StyledButton>
        </ActionCard>
      )}
    </Box>
  );
});

const useActionCardStyles = {
  '&.container': {
    ...POSFlex('center', 'space-between', 'row'),
    flexWrap: 'wrap',
    padding: 3,
    lineHeight: 1.5,
    borderRadius: 2,
    border: '1px solid',
    borderColor: 'background.border_default',
    '& .label': {
      flex: 1,
      mr: { xl: 3, sx: 0 },
    },
  },
};

interface ActionCard extends BoxProps {
  label: ReactNode;
  children: ReactNode;
}

const ActionCard: FC<ActionCard> = (props) => {
  const { label, children, ...rest } = props;

  return (
    <Box className={'container'} {...rest} sx={useActionCardStyles}>
      <Box className={'label'}>{label}</Box>
      {children}
    </Box>
  );
};
