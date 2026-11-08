import type { PropsWithChildren } from "react";
import Header from "./Header";
import Weather3DBackground from "./ui/Weatherback";
import Footer from "./ui/Footer";


const Layout = ({ children }: PropsWithChildren) => {
  return (
    <Weather3DBackground>
      <Header />

      <main className="container mx-auto px-4 py-24 min-h-screen">
        {children}
      </main>

      <Footer />
    </Weather3DBackground>
  );
};

export default Layout;
