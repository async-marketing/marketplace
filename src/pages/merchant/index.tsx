import Head from "next/head";
import StoreManager from "~/components/StoreManager";

export default function Merchant() {

  return (
    <>
      <Head>
        <title>Merchant Administration</title>
        <meta name="description" content="Merchant Administration" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Merchant <span className="text-[hsl(280,100%,70%)]">Admin</span>
          </h1>
          <h5 className="tracking-tight text-white">
            Manage your stores and their available products as well as connect your stripe account
          </h5>
          <div className="grid grid-cols-1 gap-4 w-full md:gap-8">
            <StoreManager />
          </div>
        </div>
      </main>
    </>
  );
}
