import { FC, useCallback, useEffect, useRef, useState } from 'react';
import { Fade, Icon, Stack, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { AUTO_HIDE_DURATION } from '@/constants';
import { useSwitch } from '@/hooks';

import { StyledButton, StyledTextField } from '@/components/atoms';
import { MessageItem } from './MessageItem';

import { HttpError } from '@/types';
import { _postChatMessage, _readAllChatMessage } from '@/requests';

import ICON_SEND from './assets/icon-send.svg';
import ICON_MESSAGE from './assets/icon-message.svg';
import ICON_CLOSE from './assets/icon-close.svg';
import { ChatMessageItemSource } from '@/types/account/notification';

export const MessageBox: FC = observer(() => {
  const { enqueueSnackbar } = useSnackbar();
  const store = useMst();

  const {
    dashboardInfo: {
      unReadCount,
      loading,
      loanChatMessage,
      loanId,
      addLoanChatMessage,
      setUnReadCount,
    },
    userProfile,
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
      addLoanChatMessage({
        firstName: '',
        lastName: '',
        name: '',
        avatar: '',
        backgroundColor: '',
        operatorId: userProfile?.userId || '',
        operationTime: new Date().toISOString(),
        content,
        role: null,
        docName: '',
        source: ChatMessageItemSource.pos,
      });
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
  }, [
    addLoanChatMessage,
    content,
    enqueueSnackbar,
    loanId,
    sending,
    userProfile?.userId,
  ]);

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

  return loading ? null : (
    <>
      <Fade in={!visible}>
        <Stack
          alignItems={'center'}
          bgcolor={'primary.main'}
          borderRadius={50}
          flexDirection={'row'}
          gap={0.5}
          height={48}
          onClick={onOpen}
          position={'fixed'}
          px={2}
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
              bgcolor={'primary.brightness'}
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
            p={1.5}
          >
            <StyledTextField
              autoFocus={true}
              id={'SEND_MESSAGE'}
              inputProps={{
                maxLength: 255,
              }}
              maxRows={20}
              minRows={3}
              multiline
              onChange={(e) => setContent(e.target.value)}
              placeholder={'Write message here'}
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

            <StyledButton
              color={'primary'}
              disabled={!content || sending}
              loading={sending}
              onClick={onClickToSend}
              size={'small'}
              sx={{
                borderRadius: '2px !important',
                height: '24px !important',
                fontWeight: '400 !important',
                fontSize: 12,
                '&.Mui-disabled': {
                  color: '#ffffff !important',
                },
              }}
            >
              <Icon
                component={ICON_SEND}
                sx={{ width: 18, height: 18, mr: 0.5 }}
              />
              Send
            </StyledButton>
          </Stack>
        </Stack>
      </Fade>
    </>
  );
});
