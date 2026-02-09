// src/pages/Home.jsx
import PublicLayout from "../components/layouts/PublicLayout";
import Hero from "../features/public/Hero";
import HomeTeam from "../features/public/HomeTeam"; 
import UniverseSection from "../features/public/UniverseSection";

export default function Home() {
  return (
    <PublicLayout>
      <Hero />
      <UniverseSection />
      <HomeTeam />
    </PublicLayout>
  );
}