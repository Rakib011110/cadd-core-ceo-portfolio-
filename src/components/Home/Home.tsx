"use client";

import Banner from "./Banner/Banner";
import CoursesSection from "./CoursesSection/CoursesSection";
import StateSection from "./StateSection/StateSection";
import PlaylistAccordion from "./YTPlayelistClass/YoutubePlaylist";

const Home = () => {
  return (
    <div className="min-h-screen ">
      <Banner />
      <StateSection />
      <CoursesSection />

      <div className="">
        <div className="text-center mb-8 "></div>
        <PlaylistAccordion />
      </div>
    </div>
  );
};

export default Home;
