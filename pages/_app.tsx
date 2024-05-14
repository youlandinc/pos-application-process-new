import { useEffect, useMemo } from 'react';

import Head from 'next/head';
import { AppProps } from 'next/app';
import { Router } from 'next/router';
import Script from 'next/script';

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

import { Provider, rootStore } from '@/models/Root';

import { _fetchSaasConfig } from '@/requests/saas';
import { HttpError } from '@/types';
import { useBreakpoints, useSessionStorageState } from '@/hooks';
import { AUTO_HIDE_DURATION } from '@/constants';

import {
  ProviderDetectActive,
  ProviderPersistData,
  StyledLoading,
  StyledNotification,
} from '@/components/atoms';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const handledRouteStart = () => NProgress.start();
const handledRouteDone = () => NProgress.done();

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const { enqueueSnackbar } = useSnackbar();
  const { setItem, saasState } = useSessionStorageState('tenantConfig');
  const breakpoints = useBreakpoints();

  const { loading } = useAsync(async () => {
    return await _fetchSaasConfig()
      .then(({ data }) => {
        setItem(data);
      })
      .catch((err) => {
        const { header, message, variant } = err as HttpError;
        enqueueSnackbar(message, {
          variant: variant || 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
          isSimple: !header,
          header,
        });
      });
  }, []);

  useEffect(() => {
    Router.events.on('routeChangeStart', handledRouteStart);
    Router.events.on('routeChangeComplete', handledRouteDone);
    Router.events.on('routeChangeError', handledRouteDone);
    return () => {
      Router.events.off('routeChangeStart', handledRouteStart);
      Router.events.off('routeChangeComplete', handledRouteDone);
      Router.events.off('routeChangeError', handledRouteDone);
    };
  }, []);

  const renderComponent = useMemo(() => {
    if (saasState) {
      const saasTheme = createTheme(theme, {
        palette: {
          primary: {
            main: `hsla(${saasState?.posSettings?.h ?? 222},42%,55%,1)`,
            dark: `hsla(${saasState?.posSettings?.h ?? 222},43%,50%,1)`,
            darker: `hsla(${saasState?.posSettings?.h ?? 222},38%,30%,1)`,
            darkest: `hsla(${saasState?.posSettings?.h ?? 222},28%,18%,1)`,
            light: `hsla(${saasState?.posSettings?.h ?? 222},100%,92%,1)`,
            lighter: `hsla(${saasState?.posSettings?.h ?? 222},100%,97%,1)`,
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
              <Component {...pageProps} />
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
            <Component {...pageProps} />
          </SnackbarProvider>
        </LocalizationProvider>
      </ThemeProvider>
    );
  }, [Component, breakpoints, loading, pageProps, saasState]);

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
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyASfIDno0_JIFsVZvatp09IqCT360RyWlI&libraries=places,streetView,maps"
        //strategy={'beforeInteractive'}
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
