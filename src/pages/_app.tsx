import { type AppType } from "next/app";
import { Inter } from "next/font/google";

import { api } from "~/utils/api";

import "~/styles/globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { useRouter } from 'next/router';
import { NavBar } from "~/components/NavBar";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});
const MyApp: AppType = ({ Component, pageProps }) => {
  const router = useRouter();

  // routes where we want to display the NavBar
  const showNavBarRoutes = ['/marketplace', '/merchant', '/storefront/[id]', '/store/[id]', '/checkout'];

  // Check if the current route is in the list of routes where NavBar should be shown
  const showNavBar = showNavBarRoutes.includes(router.pathname);

  return (
    <ClerkProvider {...pageProps}>
      <main className={`font-sans ${inter.variable}`}>
        {showNavBar && <NavBar />}
        <Component {...pageProps} />
        <Toaster position="bottom-center" />
      </main>
    </ClerkProvider>
  );
};

export default api.withTRPC(MyApp);
