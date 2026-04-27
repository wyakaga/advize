import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LandingPageUI from "@/components/LandingPageUI";

export default async function LandingPage() {
  const session = await auth();

  if (session) {
    redirect("/dashboard");
  }

  return <LandingPageUI />;
}

