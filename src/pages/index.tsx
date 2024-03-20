import Head from "next/head";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <Head>
        <title>Marketplace Challenge</title>
        <meta name="description" content="Marketplace Challenge Demo" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Acme <span className="text-[hsl(280,100%,70%)]">Marketplace</span> App
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="/marketplace"
            >
              <h3 className="text-2xl font-bold">Consumers →</h3>
              <div className="text-lg">
                Browse the marketplace and shop for products
              </div>
            </Link>
            <Link
              className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
              href="/merchant"
            >
              <h3 className="text-2xl font-bold">Merchants →</h3>
              <div className="text-lg">
                Manage Stores, Products, and Accounts
              </div>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
