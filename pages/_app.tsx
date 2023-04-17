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
    const handleRouteStart = () => NProgress.start();
    const handleRouteDone = () => NProgress.done();
    Router.events.on('routeChangeStart', handleRouteStart);
    Router.events.on('routeChangeComplete', handleRouteDone);
    Router.events.on('routeChangeError', handleRouteDone);
    return () => {
      Router.events.off('routeChangeStart', handleRouteStart);
      Router.events.off('routeChangeComplete', handleRouteDone);
      Router.events.off('routeChangeError', handleRouteDone);
    };
  }, []);

  const renderComponent = useMemo(
    () => (
      <CacheProvider value={emotionCache}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <LocalizationProvider dateAdapter={AdapterDateFns} locale={en}>
            <SnackbarProvider>
              <Component {...pageProps} />
            </SnackbarProvider>
          </LocalizationProvider>
        </ThemeProvider>
      </CacheProvider>
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
          <ProviderDetectActive>{renderComponent}</ProviderDetectActive>
        </ProviderPersistData>
      </Provider>
      <Script
        src="https://maps.googleapis.com/maps/api/js?key=AIzaSyASfIDno0_JIFsVZvatp09IqCT360RyWlI&libraries=places"
        type="text/javascript"
      />
    </>
  );
}
