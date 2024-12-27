import React, {
  FC,
  MouseEvent,
  SyntheticEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Badge,
  ClickAwayListener,
  Grow,
  Icon,
  MenuItem,
  MenuList,
  Paper,
  Popper,
  Stack,
  Typography,
} from '@mui/material';
import { useRouter } from 'next/router';
import { useSnackbar } from 'notistack';
import useInfiniteScroll from 'react-easy-infinite-scroll-hook';

import { observer } from 'mobx-react-lite';
import { useMst } from '@/models/Root';

import { useBreakpoints } from '@/hooks';

import { AUTO_HIDE_DURATION } from '@/constants';

import { StyledAvatar, StyledDrawer, StyledLoading } from '@/components/atoms';
import { POSMessageItem } from './POSMessageItem';

import {
  NotificationMessageItem,
  NotificationMessageLabel,
} from '@/types/account/notification';
import { HttpError, LayoutSceneTypeEnum } from '@/types';
import {
  _fetchMessage,
  _readAllMessage,
  //_readMessage
} from '@/requests';

import ICON_NOTIFICATION from './assets/icon_notification.svg';
import ICON_NO_MORE from './assets/icon_no_more.svg';
import ICON_NO_HISTORY from '@/components/atoms/StyledUploadButtonBox/assets/icon_no_history.svg';

const MENU_LIST = [
  { label: 'Account', url: '/account' },
  { label: 'Sign out', url: 'sign_out' },
];

const MESSAGE_LABEL = [
  { label: 'All', value: NotificationMessageLabel.all },
  { label: 'Unread', value: NotificationMessageLabel.unread },
];

export interface POSMyAccountButtonProps {
  scene?: LayoutSceneTypeEnum;
}

export const POSMyAccountButton: FC<POSMyAccountButtonProps> = observer(() => {
  const router = useRouter();
  const { enqueueSnackbar } = useSnackbar();

  const store = useMst();
  const breakpoint = useBreakpoints();

  const anchorRef = useRef<HTMLDivElement>(null);
  const [userMenuVisible, setUserMenuVisible] = useState(false);

  const messageBoxRef = useRef<HTMLDivElement>(null);
  const [messageBoxVisible, setMessageBoxVisible] = useState(false);
  const [messageFetchLoading, setMessageFetchLoading] = useState(false);
  const [
    ,
    //messageFetchMoreLoading
    setMessageFetchMoreLoading,
  ] = useState(false);
  const [messageClickLoading, setMessageClickLoading] = useState(false);
  const [messageList, setMessageList] = useState<NotificationMessageItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [pagination, setPagination] = useState({
    page: 0,
    size: 20,
    status: NotificationMessageLabel.all,
  });

  const onClickOpenUserMenu = useCallback(
    () => setUserMenuVisible((open) => !open),
    [],
  );
  const onClickCloseUserMenu = useCallback((event: Event | SyntheticEvent) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return;
    }
    setUserMenuVisible(false);
  }, []);
  const onClickUserMenuItem = useCallback(
    async (e: MouseEvent<HTMLElement>, url: string) => {
      e.preventDefault();
      if (url === 'sign_out') {
        onClickCloseUserMenu(e);
        store.logout();
        return;
      }
      onClickCloseUserMenu(e);
      await router.push(url);
    },
    [onClickCloseUserMenu, router, store],
  );
  const renderMenuList = useMemo(() => {
    return MENU_LIST.map((item, index) => (
      <MenuItem
        disableRipple
        key={`${item.label}_${index}`}
        onClick={(e) => onClickUserMenuItem(e, item.url)}
        sx={{
          p: 1.5,
          width: '100%',
          fontSize: 14,
          color: 'text.primary',
          justifyContent: 'center',
          '&:hover': {
            bgcolor: 'info.darker',
          },
        }}
      >
        {item.label}
      </MenuItem>
    ));
  }, [onClickUserMenuItem]);

  const resetMessageStatus = useCallback(() => {
    setMessageBoxVisible(false);
    setPagination({
      size: 20,
      page: 0,
      status: NotificationMessageLabel.all,
    });
    setMessageList([]);
    setHasMore(false);
  }, []);
  const onClickOpenMessageBox = useCallback(async () => {
    setMessageBoxVisible((open) => !open);

    setMessageFetchLoading(true);
    try {
      const { data } = await _fetchMessage(pagination);
      setMessageList(data.content);
      setTotalElements(data.totalElements);
      setHasMore(data.totalElements > 20);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setMessageFetchLoading(false);
    }
  }, [enqueueSnackbar, pagination]);
  const onClickCloseMessageBox = useCallback(
    (event: Event | SyntheticEvent) => {
      if (
        anchorRef.current &&
        anchorRef.current.contains(event.target as HTMLElement)
      ) {
        return;
      }
      resetMessageStatus();
    },
    [resetMessageStatus],
  );
  const onClickChangeLabel = useCallback(
    async (key: NotificationMessageLabel) => {
      if (pagination.status === key) {
        return;
      }
      const postData = {
        status: key,
        size: 20,
        page: 0,
      };
      setMessageList([]);
      setHasMore(false);
      setPagination(postData);
      setMessageFetchLoading(true);
      try {
        const { data } = await _fetchMessage(postData);
        setMessageList(data.content);
        setTotalElements(data.totalElements);
        setHasMore(data.totalElements > 20);
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      } finally {
        setMessageFetchLoading(false);
      }
    },
    [enqueueSnackbar, pagination.status],
  );
  const fetchMoreMessage = useCallback(async () => {
    if (messageList.length >= totalElements) {
      setHasMore(false);
      return;
    }
    const postData = {
      status: pagination.status,
      page: pagination.page + 1,
      size: 20,
    };
    setPagination(postData);
    setMessageFetchMoreLoading(true);

    try {
      const { data } = await _fetchMessage(postData);
      const newData = [...messageList, ...data.content];
      setMessageList(newData);
      setHasMore(newData.length < data.totalElements);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    } finally {
      setMessageFetchMoreLoading(false);
    }
  }, [
    enqueueSnackbar,
    messageList,
    pagination.page,
    pagination.status,
    totalElements,
  ]);

  const onClickMessageItemCb = useCallback(
    async (item: NotificationMessageItem) => {
      const { variables } = item;
      const { loanId } = variables;
      if (!loanId) {
        return;
      }
      setMessageClickLoading(true);

      try {
        await _readAllMessage({ loanId });
      } catch (err) {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      } finally {
        setMessageClickLoading(false);
        resetMessageStatus();
      }
    },
    [enqueueSnackbar, resetMessageStatus],
  );

  const scrollRef = useInfiniteScroll<HTMLDivElement>({
    next: fetchMoreMessage,
    rowCount: messageList.length,
    hasMore: { up: false, down: hasMore },
    scrollThreshold: 0.3,
  });

  return (
    <Stack
      alignItems={'center'}
      flexDirection={'row'}
      gap={{ xs: 2.5, lg: 3.5 }}
    >
      <Badge
        badgeContent={store.notificationDetail.total}
        onClick={onClickOpenMessageBox}
        ref={messageBoxRef}
        sx={{
          cursor: 'pointer',
          '& .MuiBadge-badge': {
            color: '#ffffff',
            bgcolor: '#FF5630',
            //fontFamily: 'monospace',
            lineHeight: '18px',
            fontSize: 12,
            transform: 'scale(1) translate(45%, -50%)',
          },
        }}
      >
        <Icon
          component={ICON_NOTIFICATION}
          sx={{
            width: 24,
            height: 24,
          }}
        />
      </Badge>

      <Stack
        onClick={onClickOpenUserMenu}
        ref={anchorRef}
        sx={{ cursor: 'pointer' }}
      >
        <StyledAvatar
          height={['xs', 'sm', 'md'].includes(breakpoint) ? 24 : 32}
          width={['xs', 'sm', 'md'].includes(breakpoint) ? 24 : 32}
        />
      </Stack>

      <Popper
        anchorEl={anchorRef.current}
        disablePortal
        open={userMenuVisible}
        placement={'bottom-start'}
        sx={{ position: 'relative', zIndex: 1000 }}
        transition
      >
        {({ TransitionProps }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: 'top',
            }}
            timeout={userMenuVisible ? 300 : 0}
          >
            <Paper
              sx={{
                boxShadow: '0px 1px 5px 0px rgba(145,145,145,0.25)',
                borderRadius: 2,
              }}
            >
              <ClickAwayListener onClickAway={onClickCloseUserMenu}>
                <MenuList sx={{ mt: 2, width: 120, p: 0 }}>
                  {renderMenuList}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      {['xs', 'sm'].includes(breakpoint) ? (
        <StyledDrawer
          anchor={'right'}
          content={
            <Stack
              height={'100%'}
              overflow={'auto'}
              ref={scrollRef}
              width={'100%'}
            >
              {messageFetchLoading ? (
                <Stack
                  alignItems={'center'}
                  flex={1}
                  height={600}
                  justifyContent={'center'}
                  width={'100%'}
                >
                  <StyledLoading sx={{ color: 'text.grey', mb: 3 }} />
                </Stack>
              ) : messageList.length > 0 ? (
                <>
                  {messageList.map((item, index) => (
                    <POSMessageItem
                      cb={() => onClickMessageItemCb(item)}
                      clickLoading={messageClickLoading}
                      key={`message-item-${index}`}
                      {...item}
                    />
                  ))}
                  {!hasMore && pagination.page > 0 && (
                    <Stack
                      alignItems={'center'}
                      justifyContent={'center'}
                      pb={3}
                      pt={2}
                    >
                      <Icon
                        component={ICON_NO_MORE}
                        sx={{ width: 24, height: 24 }}
                      />
                      <Typography
                        color={'text.secondary'}
                        mt={1.5}
                        px={3}
                        textAlign={'center'}
                        variant={'body3'}
                      >
                        You&apos;ve reached the end of your notifications.
                      </Typography>
                    </Stack>
                  )}
                </>
              ) : (
                <Stack
                  alignItems={'center'}
                  height={'100%'}
                  justifyContent={'center'}
                  pb={6}
                  width={'100%'}
                >
                  <Icon
                    component={ICON_NO_HISTORY}
                    sx={{ width: 206, height: 120 }}
                  />
                  <Typography
                    color={'text.secondary'}
                    fontSize={12}
                    fontWeight={600}
                    mt={3}
                    px={3}
                    textAlign={'center'}
                  >
                    You don&apos;t have any notifications
                  </Typography>
                </Stack>
              )}
            </Stack>
          }
          header={
            <Stack flexDirection={'row'} gap={3} px={3} py={1}>
              {MESSAGE_LABEL.map((item, index) => (
                <Typography
                  color={
                    pagination.status === item.value
                      ? '#636A7C'
                      : 'text.secondary'
                  }
                  fontSize={14}
                  fontWeight={pagination.status === item.value ? 600 : 400}
                  key={`message-box-label-${item.label}-${index}`}
                  onClick={() => onClickChangeLabel(item.value)}
                  sx={{
                    cursor:
                      pagination.status === item.value ? 'default' : 'pointer',
                  }}
                >
                  {item.label}
                </Typography>
              ))}
            </Stack>
          }
          onClose={onClickCloseMessageBox}
          open={messageBoxVisible}
          sx={{
            '& .drawer_header': {
              p: '0 !important',
            },
          }}
          width={'85vw'}
        />
      ) : (
        <Popper
          anchorEl={messageBoxRef.current}
          disablePortal
          open={messageBoxVisible}
          placement={'bottom-start'}
          sx={{ position: 'relative', zIndex: 1000 }}
          transition
        >
          {({ TransitionProps }) => (
            <Grow
              {...TransitionProps}
              style={{
                transformOrigin: 'top',
              }}
              timeout={userMenuVisible ? 300 : 0}
            >
              <Paper
                sx={{
                  boxShadow: '0px 1px 5px 0px rgba(145,145,145,0.25)',
                  borderRadius: 2,
                }}
              >
                <ClickAwayListener onClickAway={onClickCloseMessageBox}>
                  <Stack height={650} mt={2} width={450}>
                    <Stack flexDirection={'row'} gap={3} px={3} py={1}>
                      {MESSAGE_LABEL.map((item, index) => (
                        <Typography
                          color={
                            pagination.status === item.value
                              ? '#636A7C'
                              : 'text.secondary'
                          }
                          fontSize={14}
                          fontWeight={
                            pagination.status === item.value ? 600 : 400
                          }
                          key={`message-box-label-${item.label}-${index}`}
                          onClick={() => onClickChangeLabel(item.value)}
                          sx={{
                            cursor:
                              pagination.status === item.value
                                ? 'default'
                                : 'pointer',
                          }}
                        >
                          {item.label}
                        </Typography>
                      ))}
                    </Stack>

                    <Stack
                      height={'100%'}
                      overflow={'auto'}
                      ref={scrollRef}
                      width={'100%'}
                    >
                      {messageFetchLoading ? (
                        <Stack
                          alignItems={'center'}
                          flex={1}
                          height={600}
                          justifyContent={'center'}
                          width={'100%'}
                        >
                          <StyledLoading sx={{ color: 'text.grey', mb: 3 }} />
                        </Stack>
                      ) : messageList.length > 0 ? (
                        <>
                          {messageList.map((item, index) => (
                            <POSMessageItem
                              cb={() => onClickMessageItemCb(item)}
                              clickLoading={messageClickLoading}
                              key={`message-item-${index}`}
                              {...item}
                            />
                          ))}
                          {!hasMore && pagination.page > 0 && (
                            <Stack
                              alignItems={'center'}
                              justifyContent={'center'}
                              pb={3}
                              pt={2}
                            >
                              <Icon
                                component={ICON_NO_MORE}
                                sx={{ width: 24, height: 24 }}
                              />
                              <Typography
                                color={'text.secondary'}
                                mt={1.5}
                                px={3}
                                textAlign={'center'}
                                variant={'body3'}
                              >
                                You&apos;ve reached the end of your
                                notifications.
                              </Typography>
                            </Stack>
                          )}
                        </>
                      ) : (
                        <Stack
                          alignItems={'center'}
                          height={'100%'}
                          justifyContent={'center'}
                          pb={6}
                          width={'100%'}
                        >
                          <Icon
                            component={ICON_NO_HISTORY}
                            sx={{ width: 206, height: 120 }}
                          />
                          <Typography
                            color={'text.secondary'}
                            fontSize={12}
                            fontWeight={600}
                            mt={3}
                            textAlign={'center'}
                          >
                            You don&apos;t have any notifications
                          </Typography>
                        </Stack>
                      )}
                      {/*{messageFetchMoreLoading && <div>Loading...</div>}*/}
                    </Stack>
                  </Stack>
                </ClickAwayListener>
              </Paper>
            </Grow>
          )}
        </Popper>
      )}
    </Stack>
  );
});
