import Hero from "@/components/hero";
import WhyChoose from "@/components/whyChoose";
import { getSession } from "@/lib/session";

export default async function Home() {
  const session = await getSession();
  console.log("%c", "color: green; font-weight: bold;", { session });

  return (
    <main>
      <Hero />
      <WhyChoose />
    </main>
  );
}
