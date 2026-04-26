import DashboardLayout from "./layout";

export default function AuthWrapper({ children }: { children: React.ReactNode }) {
  return <DashboardLayout>{children}</DashboardLayout>;
}