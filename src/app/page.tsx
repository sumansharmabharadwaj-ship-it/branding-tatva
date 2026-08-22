import type { Metadata } from "next";
import { Header } from "@/layouts/Header";
import { Footer } from "@/sections/Footer";
import { HomeEditorial } from "@/sections/Home/HomeEditorial";
import { site } from "@/data/site";

export const metadata: Metadata = {
  title: `${site.name}: Brand Strategy by ${site.founder}`,
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    title: `${site.name}: Brand Strategy by ${site.founder}`,
    description: site.description,
    url: site.url,
    type: "website",
  },
};

export default function Home() {
  return (
    <>
      <Header transparent />
      <main id="main-content">
        <HomeEditorial />
      </main>
      <Footer />
    </>
  );
}
