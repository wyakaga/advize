import Link from "next/link";
import { Upload } from "lucide-react";
import { CampaignForm } from "@/components/campaign-form/CampaignForm";

export default function NewCampaignPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1
          className="text-xl font-bold sm:text-2xl"
          style={{ color: "var(--color-text-primary)" }}
        >
          Add Campaign
        </h1>
        <p className="text-label mt-1">
          Enter your campaign data manually, or{" "}
          <Link
            href="/campaigns/upload"
            className="inline-flex items-center gap-1 font-medium"
            style={{ color: "var(--color-coral)" }}
          >
            <Upload size={12} strokeWidth={1.5} />
            upload CSV instead
          </Link>
        </p>
      </div>

      <div className="card w-full self-center">
        <CampaignForm />
      </div>
    </div>
  );
}
