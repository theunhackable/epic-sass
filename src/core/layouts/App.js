import { useRouter } from "next/router";
import Navbar from "../components/Navbar";

const hideNavbarPages = ["/success", "/login"];

export default function AppLayout({ children }) {
  const router = useRouter();
  const hideNavbar = hideNavbarPages.includes(router.asPath);
  return (
    <>
      <meta />
      {!hideNavbar && <Navbar />}
        {children}
    </>
  );
}
