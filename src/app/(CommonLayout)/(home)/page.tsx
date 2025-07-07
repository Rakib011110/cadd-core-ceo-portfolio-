import dynamic from "next/dynamic";

const SocialLinks = dynamic(() => import("@/components/commonUi/SocialLink"), {
  ssr: false,
});
const Home = dynamic(() => import("@/components/Home/Home"), { ssr: false });

const HomeLayout = () => {
  return (
    <div>
      <Home />
      <SocialLinks />
    </div>
  );
};

export default HomeLayout;
