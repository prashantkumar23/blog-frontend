import React, { useState, useEffect } from "react";
import { Provider as NextProvider } from "next-auth/client";
import Head from "next/head";
import { AppProps } from "next/app";
import { Global, css } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "react-query";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { Hydrate } from "react-query/hydration";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { GraphQLClient } from "graphql-request";

import createEmotionCache from "../src/createEmotionCache";
import { theme } from "../theme";

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache();

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache;
}

const endpoint = "https://blog-backend-graphql.herokuapp.com/api";

export const client = new GraphQLClient(endpoint);

export default function MyApp(props: MyAppProps) {
  const [queryClient] = React.useState(() => new QueryClient());
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  return (
    <CacheProvider value={emotionCache}>
      <NextProvider session={pageProps.session}>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <Head>
              <title>My page</title>
              <meta
                name="viewport"
                content="initial-scale=1, width=device-width"
              />
            </Head>
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <Global
                styles={css`
                  html,
                  body {
                    @media only screen and (max-width: 500px) {
                      overflow-y: scroll;
                      scrollbar-width: none; /* Firefox */
                      -ms-overflow-style: none; /* Internet Explorer 10+ */
                      scrollbar-color: transparent;

                      /* Chrome, Edge, and Safari */
                      *::-webkit-scrollbar {
                        width: 0; /* Remove scrollbar space */
                        background: transparent; /* Optional: just make scrollbar invisible */
                      }
                    }
                    padding: 0;
                    margin: 0;
                  }
                  * {
                    box-sizing: border-box;
                  }

                  /* ===== Scrollbar CSS ===== */ /* Firefox */
                  * {
                    scrollbar-width: thin;
                    scrollbar-color: #c0c0c0 #fafafa;
                  }
                `}
              />
              {isMounted && <Component {...pageProps} />}
            </ThemeProvider>
          </Hydrate>
        </QueryClientProvider>
      </NextProvider>
    </CacheProvider>
  );
}
