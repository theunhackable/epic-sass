import "src/styles/globals.css";
import AppLayout from "src/core/layouts/App";
import { SessionContextProvider } from "@supabase/auth-helpers-react";
import { createBrowserSupabaseClient } from "@supabase/auth-helpers-nextjs";
import { useState } from "react";
export default function App({ Component, pageProps }) {

  const [supabaseClient] = useState(() => createBrowserSupabaseClient());
  const auth = supabaseClient.auth;
  return (
    <SessionContextProvider
      supabaseClient={supabaseClient}
      initialSession={pageProps.session}
      // session={pageProps.session}
      
    >
      <AppLayout>
        <Component {...pageProps} />
      </AppLayout>
    </SessionContextProvider>
  );
}
