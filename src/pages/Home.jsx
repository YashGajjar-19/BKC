// src/pages/Home.jsx
import PublicLayout from "../components/layouts/PublicLayout";
import Hero from "../features/public/Hero";
import HomeTeam from "../features/public/HomeTeam"; 

export default function Home() {
  return (
    <PublicLayout>
      <Hero />
      <HomeTeam />
    </PublicLayout>
  );
}