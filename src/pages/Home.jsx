// src/pages/Home.jsx
import PublicLayout from "../components/layouts/PublicLayout";
import Hero from "../features/public/Hero";

export default function Home() {
  return (
    <PublicLayout>
      <Hero />
    </PublicLayout>
  );
}