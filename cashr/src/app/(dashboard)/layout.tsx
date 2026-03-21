import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Sidebar />
        <Header />
        <main className="ml-[280px] min-h-screen">
          <section className="pt-20 px-8 pb-8">{children}</section>
        </main>
      </div>
    </AuthProvider>
  );
}
