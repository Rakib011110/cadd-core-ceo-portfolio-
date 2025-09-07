"use client";

import { ParticleCursor } from "../commonUi/mouseCoursor/mouseCoursor";
import BadgeWallet from "./BadgeSection/BadgeSection";
import Banner from "./Banner/Banner";
import Contact from "./ContactMe/ContactMe";
import CoursesSection from "./CoursesSection/CoursesSection";
import FeturedAndSeminar from "./FeturedAndSeminar/FeturedAndSeminar";
import TechnologySection from "./SoftwarKnows/SoftwarKnows";
import StateSection from "./StateSection/StateSection";
import PlaylistAccordion from "./YTPlayelistClass/YoutubePlaylist";

const Home = () => {
  return (
    <div className="font-sans">
      <Banner />
      <StateSection />
      <div className="mb-20 mt-20">
        <CoursesSection />
      </div>

      <div className="mb-10 mt-10">
        <FeturedAndSeminar />
      </div>  
      



<BadgeWallet/>


      <TechnologySection />



      <div className="mb-10 mt-10">
        <div className="text-center mb-8 "></div>


        <PlaylistAccordion />
      </div>

{/* <BadgeSection /> */}

      <Contact />
      <ParticleCursor />
    </div>
  );
};

export default Home;
