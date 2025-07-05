import { Navbar } from "@/components/navbar/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />

      <div className="flex-1">{children}</div>
    </div>
  );
};

export default Layout;
