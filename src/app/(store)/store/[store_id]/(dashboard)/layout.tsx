import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext";

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ store_id: string }>
}) {
  const { store_id } = await params;
  return (
    <AuthProvider>
      <div className="min-h-screen">
        <Sidebar />
        {/* <Header /> */}
        <main className="ml-[280px] min-h-screen">
          <section className="pt-20 px-8 pb-8">{children}</section>
        </main>
      </div>
    </AuthProvider>
  );
}
