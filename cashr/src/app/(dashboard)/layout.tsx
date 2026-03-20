import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <Sidebar />
      <Header />
      <main className="ml-[280px] min-h-screen">
        <section className="pt-24 px-8 pb-12">{children}</section>
      </main>
    </div>
  );
}
