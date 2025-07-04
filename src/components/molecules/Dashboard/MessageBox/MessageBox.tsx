import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Fade, Icon, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION } from '@/constants';
import { useSessionStorageState, useSwitch } from '@/hooks';

import { StyledButton, StyledTextField } from '@/components/atoms';
import { MessageItem } from './MessageItem';

import { HttpError } from '@/types';
import { _postChatMessage, _readAllChatMessage } from '@/requests';

import ICON_SEND from './assets/icon-send.svg';
import ICON_MESSAGE from './assets/icon-message.svg';
import ICON_CLOSE from './assets/icon-close.svg';

export const MessageBox: FC = observer(() => {
  const { enqueueSnackbar } = useSnackbar();
  const store = useMst();
  const { saasState } = useSessionStorageState('tenantConfig');

  const {
    dashboardInfo: {
      unReadCount,
      loading,
      loanChatMessage,
      loanId,
      setUnReadCount,
      fetchChatMessage,
    },
    notificationDetail,
  } = store;

  const { open, visible, close } = useSwitch(false);

  const [content, setContent] = useState('');

  const messageBox = useRef<HTMLDivElement>(null);

  const [sending, setSending] = useState(false);

  const onClickToSend = useCallback(async () => {
    if (!content || !loanId || sending) {
      return;
    }
    const postData = {
      loanId,
      content,
    };
    setSending(true);
    try {
      await _postChatMessage(postData);
      setContent('');
      await fetchChatMessage(loanId);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setSending(false);
    }
  }, [content, enqueueSnackbar, fetchChatMessage, loanId, sending]);

  const onReadAll = useCallback(async () => {
    try {
      await _readAllChatMessage(loanId as string);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setUnReadCount(0);
    }
  }, [enqueueSnackbar, loanId, setUnReadCount]);

  const onOpen = useCallback(async () => {
    open();
    await onReadAll();
  }, [onReadAll, open]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (visible) {
          close();
          setTimeout(() => {
            setContent('');
          }, 100);
        }
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [close, visible]);

  useEffect(() => {
    if (notificationDetail.visible && !visible && !loading && !!loanId) {
      onOpen();
    }
  }, [notificationDetail.visible, onOpen, visible, loading, loanId]);

  useEffect(() => {
    if (visible) {
      if (messageBox.current) {
        setTimeout(() => {
          messageBox.current?.scrollTo({ top: 1000000, behavior: 'smooth' });
        }, 0);
      }
      store.updateNotificationVisible(false);
    }
  }, [loanChatMessage.length, onReadAll, store, visible]);

  useEffect(() => {
    if (visible) {
      onReadAll();
    }
  }, [onReadAll, visible, loanChatMessage.length]);

  const [platform, setPlatForm] = useState<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const UA = window.navigator.userAgent;

    // Detect platform - Windows or macOS
    if (UA.indexOf('Win') !== -1) {
      setPlatForm('Windows');
    } else if (UA.indexOf('Mac') !== -1) {
      setPlatForm('macOS');
    } else {
      setPlatForm('Windows');
    }

    const focusInput = () => {
      if (!inputRef.current) {
        return;
      }

      setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
          const len = inputRef.current.value.length;
          inputRef.current.setSelectionRange(len, len);
        }
      }, 50);
    };

    focusInput();

    const handleCommentContainerClick = (e: MouseEvent) => {
      const commentContainer = document.querySelector(
        '[htmlFor="SEND_MESSAGE"]',
      );
      if (commentContainer && commentContainer.contains(e.target as Node)) {
        if (!(e.target as HTMLElement).closest('button')) {
          focusInput();
        }
      }
    };

    document.addEventListener('click', handleCommentContainerClick);

    return () => {
      document.removeEventListener('click', handleCommentContainerClick);
    };
  }, []);

  return loading ? null : (
    <>
      <Fade in={!visible}>
        <Stack
          alignItems={'center'}
          bgcolor={`hsla(${saasState?.posSettings?.h ?? 222},57%, 49%, 1)`}
          borderRadius={50}
          flexDirection={'row'}
          gap={0.5}
          height={48}
          onClick={onOpen}
          position={'fixed'}
          px={3.5}
          sx={{
            bottom: 'clamp(24px,6.4vw,60px)',
            right: {
              xs: 'clamp(24px,6.4vw,60px)',
              lg: 'calc(50% - 488px)',
              xl: 'calc(50% - 620px)',
              xxl: 'calc(50% - 720px)',
            },
            cursor: 'pointer',
            zIndex: 9999,
          }}
        >
          <Icon component={ICON_MESSAGE} />
          <Typography color={'white'} variant={'subtitle2'}>
            Messages
          </Typography>
          {!!unReadCount && (
            <Stack
              alignItems={'center'}
              bgcolor={'#FFFFFF66'}
              borderRadius={1}
              color={'#ffffff'}
              fontSize={12}
              height={20}
              justifyContent={'center'}
              lineHeight={1}
              minWidth={20}
              pt={0.25}
              px={0.5}
            >
              {unReadCount}
            </Stack>
          )}
        </Stack>
      </Fade>

      <Fade in={visible}>
        <Stack
          bgcolor={'#ffffff'}
          borderRadius={2}
          boxShadow={
            '0px 0px 2px 0px rgba(17, 52, 227, 0.10), 0px 10px 10px 0px rgba(17, 52, 227, 0.10)'
          }
          gap={3}
          height={{ xs: '100%', md: '75%' }}
          maxWidth={'100%'}
          p={3}
          position={'fixed'}
          sx={{
            bottom: { xs: 0, md: 'clamp(24px,6.4vw,60px)' },
            right: {
              xs: 0,
              md: 'clamp(24px,6.4vw,60px)',
              lg: 'calc(50% - 488px)',
              xl: 'calc(50% - 620px)',
              xxl: 'calc(50% - 720px)',
            },
            zIndex: 99,
            overflow: 'hidden',
          }}
          width={600}
        >
          <Stack alignItems={'center'} flexDirection={'row'}>
            <Typography variant={'subtitle1'}>Messages</Typography>
            <Icon
              component={ICON_CLOSE}
              onClick={close}
              sx={{ width: 24, height: 24, ml: 'auto', cursor: 'pointer' }}
            />
          </Stack>

          <Stack flex={1} overflow={'auto'} ref={messageBox}>
            <Stack flex={1} gap={3}>
              {loanChatMessage.length > 0 ? (
                loanChatMessage.map((item, index) => (
                  <MessageItem key={`chat-message-${index}`} {...item} />
                ))
              ) : (
                <Stack
                  alignItems={'center'}
                  color={'text.secondary'}
                  fontSize={12}
                  height={'calc(100% - 72px)'}
                  justifyContent={'center'}
                >
                  No messages yet
                </Stack>
              )}
              <Stack height={48} />
            </Stack>
          </Stack>

          <Stack
            border={'1px solid #D2D6E1'}
            borderRadius={2}
            component={'label'}
            flexShrink={0}
            gap={1.5}
            htmlFor={'SEND_MESSAGE'}
            onClick={() => inputRef.current?.focus()}
            p={1.5}
          >
            <StyledTextField
              autoFocus={true}
              id={'SEND_MESSAGE'}
              InputProps={{
                inputRef: inputRef,
                onFocus: () => {
                  setTimeout(() => {
                    if (inputRef.current) {
                      const len = inputRef.current.value.length;
                      inputRef.current.setSelectionRange(len, len);
                    }
                  }, 0);
                },
              }}
              maxRows={6}
              minRows={3}
              multiline
              onChange={(e) => setContent(e.target.value)}
              onKeyDown={async (e) => {
                if (e.key === 'Enter') {
                  // For macOS - Command+Enter to send
                  // For Windows - Ctrl+Enter to send, regular Enter to add new line
                  if (
                    (platform === 'macOS' && e.metaKey) ||
                    (platform === 'Windows' && e.ctrlKey)
                  ) {
                    // Only allow sending if there is actual text (not just whitespace)
                    if (content.trim()) {
                      e.preventDefault();
                      e.stopPropagation();
                      await onClickToSend();
                    }
                    return;
                  }

                  // For Windows - pressing Enter will add a new line
                  if (platform === 'Windows') {
                    // Allow default behavior (new line)
                    e.stopPropagation();
                    return;
                  }

                  // For macOS - default Enter behavior (add newline)
                  e.stopPropagation();
                }
              }}
              placeholder={'Add comments here'}
              sx={{
                '& .MuiOutlinedInput-root': {
                  height: 'auto !important',
                  padding: 0,
                  fontSize: 12,
                },
                '& fieldset': {
                  border: 'none',
                },
                '& .Mui-focused': {
                  fieldset: {
                    border: 'none !important',
                  },
                },
              }}
              value={content}
            />

            <Stack alignItems={'flex-end'} flexDirection={'row'}>
              <Typography color={'text.secondary'} fontSize={10} mt={1}>
                <Typography component={'span'} fontSize={10} fontWeight={600}>
                  {platform === 'Windows' ? 'Enter' : 'Return'}
                </Typography>{' '}
                for new line.{' '}
                <Typography component={'span'} fontSize={10} fontWeight={600}>
                  {platform === 'Windows' ? 'Ctrl' : '⌘'}
                </Typography>{' '}
                +{' '}
                <Typography component={'span'} fontSize={10} fontWeight={600}>
                  {platform === 'Windows' ? 'Enter' : 'Return'}
                </Typography>{' '}
                to send.
              </Typography>

              <StyledButton
                disabled={!content || !content.trim()}
                onClick={onClickToSend}
                onMouseDown={(e) => {
                  e.preventDefault();
                }}
                sx={{
                  borderRadius: '4px !important',
                  height: '24px !important',
                  width: '48px !important',
                  minWidth: 'auto !important',
                  minHeight: 'auto !important',
                  padding: '0 !important',
                  fontWeight: 400,
                  ml: 'auto',
                  bgcolor: '#365EC6  !important',
                  '&.Mui-disabled': {
                    color: '#ffffff',
                    bgcolor: '#BABCBE !important',
                  },
                  '&:hover': {
                    bgcolor: '#D9B239 !important',
                  },
                }}
                variant={'contained'}
              >
                <Icon component={ICON_SEND} sx={{ width: 18, height: 18 }} />
              </StyledButton>
            </Stack>
          </Stack>
        </Stack>
      </Fade>
    </>
  );
});
