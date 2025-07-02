"use client";

import Banner from "./Banner/Banner";
import CoursesSection from "./CoursesSection/CoursesSection";
import FeturedAndSeminar from "./FeturedAndSeminar/FeturedAndSeminar";
import TechnologySection from "./SoftwarKnows/SoftwarKnows";
import StateSection from "./StateSection/StateSection";
import PlaylistAccordion from "./YTPlayelistClass/YoutubePlaylist";

const Home = () => {
  return (
    <div className="min-h-screen ">
      <Banner />
      <StateSection />
      <div className="mb-20 mt-20">
        <CoursesSection />
      </div>
      <div className="mb-10 mt-10">
        <FeturedAndSeminar />
      </div>
      <div className="mb-10 mt-10">
        <div className="text-center mb-8 "></div>
        <PlaylistAccordion />
      </div>

      <TechnologySection />
    </div>
  );
};

export default Home;
