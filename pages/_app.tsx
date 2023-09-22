import { createTheme } from '@mui/material/styles';
import { useEffect, useMemo } from 'react';
import Head from 'next/head';
import { AppProps } from 'next/app';
import { Router } from 'next/router';
import Script from 'next/script';

import { useAsync } from 'react-use';

import { CacheProvider, EmotionCache } from '@emotion/react';
import { styled, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import en from 'date-fns/locale/en-US';

import NProgress from 'nprogress';
import {
  MaterialDesignContent,
  SnackbarProvider,
  useSnackbar,
} from 'notistack';

import 'normalize.css';
import 'reset.css';
import '@/styles/globals.css';

import { createEmotionCache } from '@/styles';
import { theme } from '@/theme';

import {
  ProviderDetectActive,
  ProviderPersistData,
  StyledLoading,
} from '@/components/atoms';
import { Provider, rootStore } from '@/models/Root';

import { _fetchSaasConfig } from '@/requests/saas';
import { useSessionStorageState } from '@/hooks';
import { AUTO_HIDE_DURATION } from '@/constants';

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

  const { loading } = useAsync(async () => {
    return await _fetchSaasConfig()
      .then(({ data }) => {
        setItem(data);
      })
      .catch((err) =>
        enqueueSnackbar(err, {
          variant: 'error',
          autoHideDuration: AUTO_HIDE_DURATION,
        }),
      );
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

  const StyledMaterialDesignContent = styled(MaterialDesignContent)(() => ({
    '&.notistack-MuiContent-success': {
      color: theme.palette.success.main,
      '&::before': {
        backgroundColor: theme.palette.success.darker,
      },
    },
    '&.notistack-MuiContent-error': {
      color: theme.palette.error.main,
      '&::before': {
        backgroundColor: theme.palette.error.darker,
      },
    },
    '&.notistack-MuiContent-info': {
      color: theme.palette.text.primary,
      '& svg': {
        color: theme.palette.primary.main,
      },
      '&::before': {
        backgroundColor: theme.palette.primary.darker,
      },
    },
    '&.notistack-MuiContent-default': {
      backgroundColor: '#fff',
      color: theme.palette.text.primary,
    },
    '&.notistack-MuiContent': {
      backgroundColor: '#fff',
      padding: '12px 22px',
      boxShadow:
        ' 0px 0px 2px rgba(17, 52, 227, 0.1), 0px 10px 10px rgba(17, 52, 227, 0.1)',
      '& div:nth-of-type(1) svg': {
        zIndex: 1,
        marginRight: '22px !important',
      },
      '& div:nth-of-type(2) svg': {
        color: theme.palette.info.main,
      },
      '&::before': {
        position: 'absolute',
        content: '" "',
        padding: 8,
        width: 40,
        height: 40,
        left: 12,
        borderRadius: 12,
      },
    },
    '&.notistack-MuiContent-warning': {
      color: theme.palette.warning.main,

      '&::before': {
        backgroundColor: theme.palette.warning.darker,
      },
    },
  }));

  const renderComponent = useMemo(() => {
    if (saasState) {
      const saasTheme = createTheme(theme, {
        palette: {
          primary: {
            main: `hsla(${saasState?.posSettings?.h},42%,55%,1)`,
            dark: `hsla(${saasState?.posSettings?.h},43%,50%,1)`,
            darker: `hsla(${saasState?.posSettings?.h},38%,30%,1)`,
            darkest: `hsla(${saasState?.posSettings?.h},28%,18%,1)`,
            light: `hsla(${saasState?.posSettings?.h},100%,92%,1)`,
            lighter: `hsla(${saasState?.posSettings?.h},100%,97%,1)`,
            lightest: `hsla(${saasState?.posSettings?.h},32%,98%,1)`,
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
                horizontal: 'right',
              }}
              Components={{
                success: StyledMaterialDesignContent,
                error: StyledMaterialDesignContent,
                default: StyledMaterialDesignContent,
                info: StyledMaterialDesignContent,
                warning: StyledMaterialDesignContent,
              }}
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
  }, [Component, StyledMaterialDesignContent, loading, pageProps, saasState]);

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
      {/*<Script*/}
      {/*  onLoad={() => {*/}
      {/*    const vConsole = new window.VConsole();*/}
      {/*  }}*/}
      {/*  src="https://unpkg.com/vconsole@latest/dist/vconsole.min.js"*/}
      {/*/>*/}
    </>
  );
}
