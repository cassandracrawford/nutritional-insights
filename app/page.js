import Dashboard from "@/components/Dashboard";
import Footer from "@/components/Footer";
import Header from "@/components/Header";

export default function Home() {
  return (
    <main className="min-h-screen grid grid-rows-[auto,1fr,auto]">
      <Header />
      <section className="flex justify-center overflow-y-auto">
        <Dashboard />
      </section>
      <Footer />
    </main>
  );
}
