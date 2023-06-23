import Head from "next/head";
import { AppProps } from "next/app";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider, EmotionCache } from "@emotion/react";
import createEmotionCache from "../utils/createEmotionCache";
// import defaultTheme from "@/themes/defaultTheme";
import { Layout } from "@/components/Layout";
import { useAppTheme } from "@/hooks/useAppTheme";
import { setupStore } from "@/store/store";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

// later we'll modify this to its own file
const theme = createTheme();
export interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

export default function MyApp(props: MyAppProps) {
  // If there's no emotionCache rendered by the server, use the clientSideEmotionCache
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [currentTheme, toggleCurrentTheme] = useAppTheme();
  const store = setupStore();

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <Provider store={store}>
        <ThemeProvider theme={currentTheme}>
          {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
          <CssBaseline />
          <Layout toggle={toggleCurrentTheme} currentTheme={currentTheme}>
            <SnackbarProvider
              autoHideDuration={2000}
              maxSnack={3}
              anchorOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <Component {...pageProps} />
            </SnackbarProvider>
          </Layout>
        </ThemeProvider>
      </Provider>
    </CacheProvider>
  );
}
