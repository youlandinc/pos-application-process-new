import { useCallback, useEffect, useMemo } from 'react';

import Head from 'next/head';
import { AppProps } from 'next/app';
import Router, { useRouter } from 'next/router';
import Script from 'next/script';
import localFont from 'next/font/local';

import { useAsync } from 'react-use';
import en from 'date-fns/locale/en-US';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { LocalizationProvider } from '@mui/x-date-pickers';

import NProgress from 'nprogress';
import { SnackbarProvider, useSnackbar } from 'notistack';

import { ThemeProvider } from '@mui/material';
import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import { createTheme } from '@mui/material/styles';
import { createEmotionCache } from '@/styles';
import { theme } from '@/theme';

import 'normalize.css';
import 'reset.css';
import '@/styles/globals.css';
import 'cropperjs/dist/cropper.css';

import { Provider, rootStore } from '@/models/Root';

import { _fetchSaasConfig } from '@/requests/saas';
import { HttpError } from '@/types';
import { useBreakpoints, useSessionStorageState } from '@/hooks';
import { AUTO_HIDE_DURATION, userpool } from '@/constants';
import {
  ProviderDetectActive,
  ProviderPersistData,
  StyledLoading,
  StyledNotification,
} from '@/components/atoms';

import { _recordUrlTrigger } from '@/requests/statistics';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const POS_FONT = localFont({
  src: [
    {
      path: '../public/fonts/Poppins-Regular.woff2',
      weight: '400',
    },
    {
      path: '../public/fonts/Poppins-Medium.woff2',
      weight: '500',
    },
    {
      path: '../public/fonts/Poppins-SemiBold.woff2',
      weight: '600',
    },
    {
      path: '../public/fonts/Poppins-Bold.woff2',
      weight: '700',
    },
  ],
  display: 'swap',
});

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { setItem, saasState } = useSessionStorageState('tenantConfig');
  const breakpoints = useBreakpoints();
  const router = useRouter();

  useEffect(
    () => {
      if (!rootStore?.session?.accessToken?.jwtToken) {
        return;
      }
      const eventSource = new EventSource(
        `${process.env.NEXT_PUBLIC_BASE_URL}/pos/notification/sse/connect?token=${
          rootStore.session!.accessToken.jwtToken
        }`,
      );

      eventSource.onmessage = (e) => {
        if (e.data === 'heartbeat') {
          return;
        }
        const data = JSON.parse(e.data);
        switch (data.messageType) {
          case 'LOAN_DETAIL':
            if (rootStore.notificationDetail.loanIdList.includes(data.loanId)) {
              return;
            }
            rootStore.addNotificationLoanId(data.loanId);
            break;
          case 'COUNT':
            rootStore.updateNotificationCount(data.count);
            break;
          default:
            break;
        }
      };

      return () => {
        eventSource.close();
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rootStore?.session?.accessToken.jwtToken],
  );

  const { loading } = useAsync(async () => {
    if (router.pathname.includes('payment')) {
      return;
    }
    try {
      const { data } = await _fetchSaasConfig();
      setItem(data);
    } catch (err) {
      const { header, message, variant } = err as HttpError;
      enqueueSnackbar(message, {
        variant: variant || 'error',
        autoHideDuration: AUTO_HIDE_DURATION,
        isSimple: !header,
        header,
      });
    }
  }, []);

  const handleRouteStart = () => {
    NProgress.start();
  };

  const handleRouteComplete = useCallback(async () => {
    NProgress.done();
    await _recordUrlTrigger({
      loanId: Router?.query?.loanId as string,
      pageUrl: Router.pathname,
      tenantId: saasState?.tenantId || '',
      userId:
        rootStore?.userProfile?.userId || userpool.getLastAuthUserId() || '',
      isFail: 'true',
    });
  }, [saasState?.tenantId]);

  const handleRouteError = useCallback(async () => {
    NProgress.done();
    await _recordUrlTrigger({
      loanId: Router?.query?.loanId as string,
      pageUrl: Router.pathname,
      tenantId: saasState?.tenantId || '',
      userId:
        rootStore?.userProfile?.userId || userpool.getLastAuthUserId() || '',
      isFail: 'false',
    });
  }, [saasState?.tenantId]);

  useEffect(() => {
    Router.events.on('routeChangeStart', handleRouteStart);
    Router.events.on('routeChangeComplete', handleRouteComplete);
    Router.events.on('routeChangeError', handleRouteError);
    return () => {
      Router.events.off('routeChangeStart', handleRouteStart);
      Router.events.off('routeChangeComplete', handleRouteComplete);
      Router.events.off('routeChangeError', handleRouteError);
    };
  }, [handleRouteComplete, handleRouteError]);

  const renderComponent = useMemo(() => {
    if (saasState) {
      const saasTheme = createTheme(theme, {
        palette: {
          primary: {
            main: `hsla(${saasState?.posSettings?.h ?? 222},42%,55%,1)`,
            slightly_lighter: `hsla(${
              saasState?.posSettings?.h ?? 222
            },42%,55%,.8)`,
            dark: `hsla(${saasState?.posSettings?.h ?? 222},43%,50%,1)`,
            darker: `hsla(${saasState?.posSettings?.h ?? 222},38%,30%,1)`,
            darkest: `hsla(${saasState?.posSettings?.h ?? 222},28%,18%,1)`,
            light: `hsla(${saasState?.posSettings?.h ?? 222},100%,92%,1)`,
            lighter: `hsla(${saasState?.posSettings?.h ?? 222},100%,97%,1)`,
            lighter_font: `hsla(${saasState?.posSettings?.h ?? 222},64%,44%,1)`,
            lightest: `hsla(${saasState?.posSettings?.h ?? 222},32%,98%,1)`,
            brightness: `hsla(${saasState?.posSettings?.h ?? 222},80%,70%,1)`,
          },
        },
      });
      return (
        <ThemeProvider theme={saasTheme}>
          <CssBaseline />
          <LocalizationProvider apterLocale={en} dateAdapter={AdapterDateFns}>
            <SnackbarProvider
              anchorOrigin={{
                vertical: 'top',
                horizontal: ['sm', 'xs'].includes(breakpoints)
                  ? 'center'
                  : 'right',
              }}
              Components={{
                success: StyledNotification,
                error: StyledNotification,
                default: StyledNotification,
                info: StyledNotification,
                warning: StyledNotification,
              }}
              maxSnack={3}
            >
              <Component className={POS_FONT.className} {...pageProps} />
            </SnackbarProvider>
          </LocalizationProvider>
        </ThemeProvider>
      );
    }
    if (router.pathname.includes('payment')) {
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LocalizationProvider apterLocale={en} dateAdapter={AdapterDateFns}>
            <SnackbarProvider
              anchorOrigin={{
                vertical: 'top',
                horizontal: ['sm', 'xs'].includes(breakpoints)
                  ? 'center'
                  : 'right',
              }}
              Components={{
                success: StyledNotification,
                error: StyledNotification,
                default: StyledNotification,
                info: StyledNotification,
                warning: StyledNotification,
              }}
              maxSnack={3}
            >
              <Component className={POS_FONT.className} {...pageProps} />
            </SnackbarProvider>
          </LocalizationProvider>
        </ThemeProvider>
      );
    }
    if (loading) {
      return (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minWidth: 375,
            minHeight: 667,
            width: '100vw',
            height: '100vh',
          }}
        >
          <StyledLoading sx={{ color: '#E3E3EE' }} />
        </div>
      );
    }
  }, [Component, breakpoints, loading, pageProps, router.pathname, saasState]);

  return (
    <>
      <Head>
        <meta content="initial-scale=1, width=device-width" name="viewport" />
        <meta
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          name="viewport"
        />
        <link href={saasState?.faviconUrl || '/POS.svg'} rel="icon" />
        <title>Apply for a loan</title>
      </Head>
      <Provider value={rootStore}>
        <ProviderPersistData rootStoreKeys={['session', 'userProfile']}>
          <ProviderDetectActive>
            <CacheProvider value={emotionCache}>
              {renderComponent}
            </CacheProvider>
          </ProviderDetectActive>
        </ProviderPersistData>
      </Provider>
      <Script
        onLoad={() => {
          rootStore.setLoadedGoogle();
        }}
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDbKnoaYuPycOQD4uQdPrc1nESFEVRH5-g&libraries=places,streetView,maps"
        type="text/javascript"
      />
      {/*<Script*/}
      {/*  onLoad={() => {*/}
      {/*    const vConsole = new window.VConsole();*/}
      {/*  }}*/}
      {/*  src="https://unpkg.com/vconsole@latest/dist/vconsole.min.js"*/}
      {/*/>*/}
    </>
  );
}
