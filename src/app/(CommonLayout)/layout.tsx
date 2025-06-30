import { Navbar } from "@/components/navbar/Navbar";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div>
      <Navbar />

      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
