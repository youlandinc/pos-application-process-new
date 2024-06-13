import { Head, Html, Main, NextScript } from 'next/document';
import { getInitColorSchemeScript } from '@mui/material/styles';

export default function Document() {
  return (
    <Html>
      <Head>
        <link
          as="style"
          crossOrigin="anonymous"
          href="/fonts/Poppins-Medium.woff2"
          rel="stylesheet preload"
          type="font/woff2"
        />
        <link
          as="style"
          crossOrigin="anonymous"
          href="/fonts/Poppins-Regular.woff2"
          rel="stylesheet preload"
          type="font/woff2"
        />
        <link
          as="style"
          crossOrigin="anonymous"
          href="/fonts/Poppins-SemiBold.woff2"
          rel="stylesheet preload"
          type="font/woff2"
        />
        <link
          as="style"
          crossOrigin="anonymous"
          href="/fonts/Poppins-Bold.woff2"
          rel="stylesheet preload"
          type="font/woff2"
        />
      </Head>
      <body>
        {getInitColorSchemeScript()}
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
