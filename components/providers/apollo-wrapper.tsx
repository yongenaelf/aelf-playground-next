"use client";
// ^ this file needs the "use client" pragma
// https://github.com/apollographql/apollo-client-nextjs/tree/main?tab=readme-ov-file#in-client-components-and-streaming-ssr

import { HttpLink, ApolloLink } from "@apollo/client";
import {
  ApolloNextAppProvider,
  ApolloClient,
  InMemoryCache,
} from "@apollo/experimental-nextjs-app-support";
import { env } from "next-runtime-env";

const tmrwdaoLink = new HttpLink({
  uri: env("NEXT_PUBLIC_TMRWDAO_GRAPHQL_ENDPOINT"),
  fetchOptions: { cache: "no-store" },
});

const aelfscanLink = new HttpLink({
  uri: env("NEXT_PUBLIC_AELFSCAN_GRAPHQL_ENDPOINT"),
  fetchOptions: { cache: "no-store" },
});

export const AELFSCAN_CLIENT_NAME = "aelfscanLink";

// have a function to create a client for you
function makeClient() {
  // use the `ApolloClient` from "@apollo/experimental-nextjs-app-support"
  return new ApolloClient({
    // use the `InMemoryCache` from "@apollo/experimental-nextjs-app-support"
    cache: new InMemoryCache(),
    link: ApolloLink.split(
      (operation) => operation.getContext().clientName === AELFSCAN_CLIENT_NAME,
      aelfscanLink, //if above
      tmrwdaoLink
    ),
  });
}

// you need to create a component to wrap your app in
export function ApolloWrapper({ children }: React.PropsWithChildren) {
  return (
    <ApolloNextAppProvider makeClient={makeClient}>
      {children}
    </ApolloNextAppProvider>
  );
}
