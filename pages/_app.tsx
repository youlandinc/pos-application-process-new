import * as React from 'react';
import { useEffect } from 'react';
import createEmotionCache from '../src/styles/createEmotionCache';
import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import { lightTheme } from '@/theme';
import { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import { IntlErrorCode, NextIntlProvider } from 'next-intl';
import { Router } from 'next/router';
import NProgress from 'nprogress';
import { SnackbarProvider } from 'notistack';

import 'normalize.css';
import 'reset.css';
import '@/styles/global.css';

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

// @ts-expect-error: Unreachable code error
function onError(error) {
  if (error.code === IntlErrorCode.MISSING_MESSAGE) {
    // Missing translations are expected and should only log an error
    // eslint-disable-next-line
    console.error(error);
  } else {
    // Other errors indicate a bug in the app and should be reported
    // eslint-disable-next-line
    console.error(error);
  }
}

// @ts-expect-error: Unreachable code error
function getMessageFallback({ namespace, key, error }) {
  const path = [namespace, key].filter((part) => part != null).join('.');
  
  if (error.code === IntlErrorCode.MISSING_MESSAGE) {
    return `${path} is not yet translated`;
  }
  return `Dear developer, please fix this message: ${path}`;
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
  
  return (
      <CacheProvider value={emotionCache}>
        <Head>
          <meta content="initial-scale=1, width=device-width" name="viewport" />
          <meta
              content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
              name="viewport"
          />
          <title>YouLand</title>
        </Head>
        <ThemeProvider theme={lightTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <NextIntlProvider
              getMessageFallback={getMessageFallback}
              messages={pageProps.messages}
              onError={onError}
          >
            <SnackbarProvider>
              <Component {...pageProps} />
            </SnackbarProvider>
          </NextIntlProvider>
        </ThemeProvider>
      </CacheProvider>
  );
}
