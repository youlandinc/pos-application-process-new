import { useEffect, useMemo } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { Router } from 'next/router';
import Script from 'next/script';

import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import en from 'date-fns/locale/en-US';

import NProgress from 'nprogress';
import { SnackbarProvider } from 'notistack';

import 'normalize.css';
import 'reset.css';
import '@/styles/globals.css';

import { createEmotionCache } from '@/styles';
import { theme } from '@/theme';

import { ProviderDetectActive, ProviderPersistData } from '@/components/atoms';
import { Provider, rootStore } from '@/models/Root';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  useEffect(() => {
    const handledRouteStart = () => NProgress.start();
    const handledRouteDone = () => NProgress.done();
    Router.events.on('routeChangeStart', handledRouteStart);
    Router.events.on('routeChangeComplete', handledRouteDone);
    Router.events.on('routeChangeError', handledRouteDone);
    return () => {
      Router.events.off('routeChangeStart', handledRouteStart);
      Router.events.off('routeChangeComplete', handledRouteDone);
      Router.events.off('routeChangeError', handledRouteDone);
    };
  }, []);

  const renderComponent = useMemo(
    () => (
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <LocalizationProvider apterLocale={en} dateAdapter={AdapterDateFns}>
          <SnackbarProvider>
            <Component {...pageProps} />
          </SnackbarProvider>
        </LocalizationProvider>
      </ThemeProvider>
    ),
    [Component, pageProps],
  );

  return (
    <>
      <Head>
        <meta content="initial-scale=1, width=device-width" name="viewport" />
        <meta
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          name="viewport"
        />
        <link href="/POS.svg" rel="icon" />
        <title>Point of Sale</title>
      </Head>
      <Provider value={rootStore}>
        <ProviderPersistData
          rootStoreKeys={['session', 'userProfile', 'userSetting']}
        >
          <ProviderDetectActive>
            <CacheProvider value={emotionCache}>
              {renderComponent}
            </CacheProvider>
          </ProviderDetectActive>
        </ProviderPersistData>
      </Provider>
      <Script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyASfIDno0_JIFsVZvatp09IqCT360RyWlI&libraries=places&callback"
        //strategy={'beforeInteractive'}
        type="text/javascript"
      />
    </>
  );
}
