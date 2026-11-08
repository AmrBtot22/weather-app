import { Link } from "react-router-dom";
import CitySearch from "./ui/CitySearch";

function Header() {
  return (
    <header className="fixed top-0 w-full z-50 backdrop-blur border-b bg-white/40 border-gray-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link to="/">
          <img
            src="/logo.png"
            alt="Weather"
            className="h-12 transition-all duration-1000"
          />
        </Link>

        <div className="flex gap-4 items-center">
          <CitySearch />
        </div>
      </div>
    </header>
  );
}

export default Header;
