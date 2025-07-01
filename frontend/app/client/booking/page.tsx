import ClientSidebar from "@/app/_components/ClientSideBar";
import DashboardLayout from "@/app/_components/DashboardLayout";

export default function BookingPage() {
  return (
    <DashboardLayout sidebar={<ClientSidebar />} title="Minha Área">
      <h1>oi</h1>
    </DashboardLayout>
  );
}
