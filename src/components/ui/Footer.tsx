import { useTheme } from "@/context/theme-provider";
import { useEffect, useState } from "react";

function Footer() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [showFooter, setShowFooter] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;

      // يظهر الـ Footer فقط عند الوصول لنهاية الصفحة
      if (scrollTop + windowHeight >= docHeight - 5) {
        setShowFooter(true);
      } else {
        setShowFooter(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <footer
      className={`fixed bottom-0 w-full py-4 text-center transition-transform duration-300
        ${showFooter ? "translate-y-0" : "translate-y-full"}
        ${isDark ? "bg-black/30 text-white/70 border-t border-white/10" 
                  : "bg-white/30 text-black/60 border-t border-gray-200"}`}
    >
      <p className="transition-colors duration-500 hover:text-red-500">
        Made with ❤ by EL WAFY
      </p>
    </footer>
  );
}

export default Footer;
