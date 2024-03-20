import { type Store } from "@prisma/client";
import Head from "next/head";
import Link from "next/link";
import { api } from "~/utils/api";


export default function Marketplace() {
  const {data: stores} = api.stores.getAll.useQuery();

  return (
    <>
      <Head>
        <title>Marketplace Directory</title>
        <meta name="description" content="Marketplace Directory" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex flex-col items-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
        <div className="mt-10 flex flex-col gap-8 items-top">
          <h1 className="text-5xl font-sans tracking-tight text-white sm:text-[5rem]">
            Acme <span className="text-[hsl(280,100%,70%)]">Marketplace</span> Directory
          </h1>
          </div>
          <div className="container flex min-h-screen flex-col items-center px-4 py-16 bg-gradient-to-b from-[#2e026d] to-[#15162c]">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
          {stores?.map((store: Store) => (
          <Link key={store.id}
          href={`/storefront/${store.id}`}
            className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20"
          >
           <h3 className="text-2xl font-bold">Shop {store.name} →</h3>
              <div className="text-lg">
                {store.description}
              </div>
          </Link>
          ))}
          </div>
          </div>
        
      </main>
    </>
  );
}
