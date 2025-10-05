import React from "react";
import Navbar from "./Navbar";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import CommunityReports from "./CommunityReports";
import CTASection from "./CTASection";
import Footer from "./Footer";

const Home = () => {
  return (
    <>
      <Navbar />
      <HeroSection />
      <HowItWorks />
      <CommunityReports />
      <CTASection />
      <Footer />
    </>
  );
};

export default Home;
