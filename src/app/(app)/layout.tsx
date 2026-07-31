import { Sidebar } from "@/components/Sidebar";
import { TopBar } from "@/components/TopBar";
import { SearchProvider } from "@/lib/search-context";
import { SocketProvider } from "@/lib/socket-context";
import { NotificationsProvider } from "@/lib/notifications-context";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <SocketProvider>
      <NotificationsProvider>
        <SearchProvider>
          <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0a0918]">
            <Sidebar />
            <div className="flex flex-1 flex-col overflow-hidden">
              <TopBar />
              <div className="flex-1 overflow-y-auto">
                <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col px-4 py-8 sm:px-6">{children}</div>
              </div>
            </div>
          </div>
        </SearchProvider>
      </NotificationsProvider>
    </SocketProvider>
  );
}
