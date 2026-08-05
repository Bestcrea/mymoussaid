import { Outlet } from "react-router-dom";
import { PublicHeader } from "./PublicHeader";
import { PublicFooter } from "./PublicFooter";
import { TopBar } from "./TopBar";
import { ScrollProvider } from "../../contexts/ScrollContext";
import { ScrollToTop } from "../ui/ScrollToTop";

export function PublicLayout() {
  return (
    <ScrollProvider>
      <div className="min-h-screen flex flex-col bg-white">
        <TopBar />
        <PublicHeader />
        <main className="mt-[108px] flex-1 md:mt-28">
          <Outlet />
        </main>
        <PublicFooter />
        <ScrollToTop />
      </div>
    </ScrollProvider>
  );
}
