import * as React from 'react';
import { useEffect } from 'react';
import createEmotionCache from '../src/styles/createEmotionCache';
import CssBaseline from '@mui/material/CssBaseline';
import Head from 'next/head';
import { theme } from '@/theme';
import { AppProps } from 'next/app';
import { CacheProvider, EmotionCache } from '@emotion/react';
import { ThemeProvider } from '@mui/material/styles';
import { Router } from 'next/router';
import NProgress from 'nprogress';
import { SnackbarProvider } from 'notistack';

import 'normalize.css';
import 'reset.css';
import '@/styles/globals.css';

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

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta content="initial-scale=1, width=device-width" name="viewport" />
        <meta
          content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"
          name="viewport"
        />
        <title>Point of Sale</title>
      </Head>
      <ThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <SnackbarProvider>
          <Component {...pageProps} />
        </SnackbarProvider>
      </ThemeProvider>
    </CacheProvider>
  );
}
