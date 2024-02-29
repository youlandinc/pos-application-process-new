import { HttpError } from '@/types';
import {
  FC,
  FormEventHandler,
  forwardRef,
  ReactNode,
  useCallback,
  useRef,
  useState,
} from 'react';
import { Box, BoxProps, Stack, Typography } from '@mui/material';
import { CloseOutlined } from '@mui/icons-material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';

import { AUTO_HIDE_DURATION } from '@/constants';
import { useRenderPdf, useSwitch } from '@/hooks';
import {
  _fetchPDFFile,
  _previewPreApprovalPDFFile,
  _sendPreapprovalLetter,
} from '@/requests/dashboard';
import { POSFormatDollar } from '@/utils';
import { LoanStage } from '@/types/enum';

import {
  StyledButton,
  StyledDialog,
  StyledLoading,
  StyledTextField,
} from '@/components/atoms';
import { DashboardHeader } from '@/components/molecules';

interface PreApprovalInfoProps {
  loading: boolean;
  loanAmount?: number;
  onClickEdit: () => void;
  processId?: string;
  loanStage?: LoanStage;
}

export const PreApprovalInfo = forwardRef<
  HTMLInputElement,
  PreApprovalInfoProps
  //eslint-disable-next-line @typescript-eslint/no-unused-vars
>(({ loading, loanAmount = 0, onClickEdit, processId, loanStage }, ref) => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const { visible, open, close } = useSwitch(false);

  const pdfFile = useRef(null);

  const { renderFile } = useRenderPdf(pdfFile);

  const [email, setEmail] = useState<string>('');

  const [downloadLoading, setDownloadLoading] = useState<boolean>(false);
  const [sendLoading, setSendLoading] = useState<boolean>(false);
  const [viewLoading, setViewLoading] = useState<boolean>(false);

  const onEmailSubmit = useCallback<FormEventHandler>(
    async (e) => {
      e.preventDefault();

      setSendLoading(true);
      try {
        await _sendPreapprovalLetter(router.query.processId as string, email);
        enqueueSnackbar('Email was successfully sent', {
          variant: 'success',
        });
        setSendLoading(false);
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
        setSendLoading(false);
      }
    },
    [enqueueSnackbar, router.query.processId, email],
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
      const res = await _fetchPDFFile(processId as string);
      const fileName = res.headers['content-disposition'].split('=')[1];
      handler(res.data, fileName);
    },
    // this function never change
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  );

  const onViewPDF = useCallback(async () => {
    setViewLoading(true);
    try {
      const { data } = await _previewPreApprovalPDFFile(processId as string);
      open();
      setTimeout(() => {
        renderFile(data);
      }, 100);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setViewLoading(false);
    }
  }, [enqueueSnackbar, open, processId, renderFile]);

  return (
    <>
      <Box maxWidth={900} px={{ lg: 3, xs: 0 }}>
        <DashboardHeader title={'Pre-approval letter'} />
        <ActionCard
          label={
            <Box>
              <Box
                color={'text.primary'}
                fontSize={{ md: 24, xs: 18 }}
                fontWeight={600}
                lineHeight={1.5}
                mb={1.5}
              >
                Your current loan amount is
              </Box>
              <Box
                color={'primary.main'}
                fontSize={24}
                fontWeight={600}
                lineHeight={1.2}
                mb={1.5}
              >
                {loading ? (
                  <StyledLoading
                    sx={{ justifyContent: 'flex-start', color: 'text.grey' }}
                  />
                ) : (
                  POSFormatDollar(loanAmount)
                )}
              </Box>

              <Box
                color={'text.secondary'}
                fontSize={{ md: 16, xs: 12 }}
                fontWeight={400}
                lineHeight={1.5}
              >
                Your final loan amount will be verified through the full
                underwriting process, but the pre-approval letter is still a
                valuable and accurate tool that will greatly increase your
                chances of winning an offer on the home of your choice.
              </Box>
            </Box>
          }
          mt={3}
        >
          <Stack
            width={{
              xl: 200,
              md: '100%',
              xs: '100%',
            }}
          >
            <StyledButton
              color={'primary'}
              disabled={loading || viewLoading}
              onClick={onViewPDF}
              sx={{
                mb: { xl: 3, xs: 0 },
                width: { xl: 200, xs: '100%' },
                mt: { xl: 0, xs: 3 },
              }}
              variant={'contained'}
            >
              {viewLoading ? 'Viewing...' : 'View letter'}
            </StyledButton>

            <StyledButton
              color={'info'}
              disabled={loading || downloadLoading}
              onClick={onDownloadPDF}
              sx={{
                width: { xl: 200, xs: '100%' },
                mt: { xl: 0, xs: 3 },
              }}
              variant={'outlined'}
            >
              {downloadLoading ? 'Downloading...' : 'Download PDF'}
            </StyledButton>
          </Stack>
        </ActionCard>

        <ActionCard
          component="form"
          label={
            <Box>
              <Box
                color={'text.primary'}
                fontSize={{ md: 24, xs: 18 }}
                fontWeight={600}
                lineHeight={1.5}
                mb={1.5}
              >
                Who should we send your letter to?
              </Box>

              <Box
                color={'text.secondary'}
                fontSize={{ md: 16, xs: 12 }}
                fontWeight={400}
                lineHeight={1.5}
                mb={3}
              >
                We&apos;ll keep whoever you want in the loop about the
                pre-approval letter update.
              </Box>
              <StyledTextField
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
          sx={{ alignItems: 'flex-end' }}
        >
          <StyledButton
            color={'primary'}
            disabled={loading || sendLoading}
            sx={{
              width: { xl: 200, xs: '100%' },
              mt: { xl: 0, xs: 3 },
            }}
            type="submit"
            variant={'contained'}
          >
            {sendLoading ? 'Sending...' : 'Send'}
          </StyledButton>
        </ActionCard>

        {/*{![*/}
        {/*  LoanStage.RateLocked,*/}
        {/*  LoanStage.RateLocking,*/}
        {/*  LoanStage.Approved,*/}
        {/*].includes(loanStage as LoanStage) && (*/}
        {/*  <ActionCard*/}
        {/*    bgcolor={'action.hover'}*/}
        {/*    boxShadow={'none'}*/}
        {/*    label={*/}
        {/*      <Box>*/}
        {/*        <Box*/}
        {/*          color={'text.primary'}*/}
        {/*          fontSize={{ md: 24, xs: 18 }}*/}
        {/*          fontWeight={600}*/}
        {/*          lineHeight={1.5}*/}
        {/*          mb={1.5}*/}
        {/*        >*/}
        {/*          Edit your pre-approval letter*/}
        {/*        </Box>*/}
        {/*        <Box*/}
        {/*          color={'text.primary'}*/}
        {/*          fontSize={{ md: 16, xs: 12 }}*/}
        {/*          fontWeight={400}*/}
        {/*          lineHeight={1.5}*/}
        {/*        >*/}
        {/*          You can edit the purchase price and down payment amounts on*/}
        {/*          your letter so that it is personalized to a specific property*/}
        {/*          when you&apos;re making offers.*/}
        {/*        </Box>*/}
        {/*      </Box>*/}
        {/*    }*/}
        {/*    mt={3}*/}
        {/*  >*/}
        {/*    <StyledButton*/}
        {/*      color={'primary'}*/}
        {/*      disabled={loading}*/}
        {/*      onClick={onClickEdit}*/}
        {/*      sx={{*/}
        {/*        width: { xl: 200, xs: '100%' },*/}
        {/*        mt: { xl: 0, xs: 3 },*/}
        {/*      }}*/}
        {/*      variant={'contained'}*/}
        {/*    >*/}
        {/*      Edit amount*/}
        {/*    </StyledButton>*/}
        {/*  </ActionCard>*/}
        {/*)}*/}
      </Box>

      <StyledDialog
        content={<Box ref={pdfFile} />}
        disableEscapeKeyDown
        header={
          <Stack
            alignItems={'center'}
            flexDirection={'row'}
            justifyContent={'space-between'}
            pb={3}
          >
            <Typography variant={'h6'}>Pre-approval Letter</Typography>
            <StyledButton isIconButton onClick={close}>
              <CloseOutlined />
            </StyledButton>
          </Stack>
        }
        open={visible}
        sx={{
          '& .MuiPaper-root': {
            maxWidth: { lg: '900px !important', xs: '100% !important' },
            width: '100%',
            '& .MuiDialogTitle-root, & .MuiDialogActions-root': {
              bgcolor: '#F5F8FA',
              p: 3,
            },
          },
        }}
      />
    </>
  );
});

interface ActionCardProps extends BoxProps {
  label: ReactNode;
  children: ReactNode;
}

const ActionCard: FC<ActionCardProps> = ({ label, children, ...rest }) => {
  return (
    <Box
      {...rest}
      alignItems={'center'}
      border={'1px solid'}
      borderColor={'background.border_default'}
      borderRadius={2}
      display={'flex'}
      flexDirection={'row'}
      flexWrap={'wrap'}
      justifyContent={'space-between'}
      lineHeight={1.5}
      p={3}
    >
      <Box flex={1} mr={{ xl: 3, sx: 0 }}>
        {label}
      </Box>
      {children}
    </Box>
  );
};
