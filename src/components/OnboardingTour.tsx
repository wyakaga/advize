"use client";

import { useEffect, useState } from "react";
import { Joyride, Step, STATUS } from "react-joyride";

const STORAGE_KEY = "advize-onboarding-completed";

export default function OnboardingTour() {
  const [run, setRun] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Avoid synchronous setState to prevent cascading renders
    const mountTimer = setTimeout(() => {
      setMounted(true);
    }, 0);

    const hasCompleted = localStorage.getItem(STORAGE_KEY);
    if (!hasCompleted) {
      // Small delay to ensure dashboard elements are rendered
      const tourTimer = setTimeout(() => {
        setRun(true);
      }, 1000);
      
      return () => {
        clearTimeout(mountTimer);
        clearTimeout(tourTimer);
      };
    }
    
    return () => clearTimeout(mountTimer);
  }, []);

  const allSteps: Step[] = [
    {
      target: "body",
      content: (
        <div className="text-left">
          <h3 className="font-bold text-lg mb-2">Welcome to AdVize!</h3>
          <p>Let&apos;s take a quick tour to help you get started with optimizing your ad campaigns.</p>
        </div>
      ),
      placement: "center",
      // @ts-ignore
      disableBeacon: true,
    },
    {
      target: ".metrics-card",
      content: "These cards show your key performance metrics at a glance. We calculate CTR, CPC, CPA, and ROAS automatically.",
      // @ts-ignore
      disableBeacon: true,
    },
    {
      target: ".analyze-button",
      content: "Select one or more campaigns and click here to let our AI analyze them and provide optimization suggestions.",
    },
    {
      target: ".campaign-table",
      content: "This is your campaign command center. You can search, filter by platform, and manage all your active campaigns here.",
    },
    {
      target: ".empty-dashboard-state",
      content: "Don't have any campaigns yet? You can add one manually or upload a CSV file to get started.",
    },
    {
      target: ".nav-menu",
      content: "Use the navigation menu to jump between the dashboard, campaigns, and history for a complete overview of your ads.",
      // @ts-ignore
      disableBeacon: true,
    },
  ];

  if (!mounted) return null;

  // Filter steps based on whether the target element exists in the DOM
  // This ensures the progress counter (e.g. 1 of 5) is always accurate
  const steps = allSteps.filter((step) => {
    if (typeof step.target === "string") {
      if (step.target === "body" || step.placement === "center") return true;
      return !!document.querySelector(step.target);
    }
    return true;
  });

  const handleJoyrideCallback = (data: any) => {
    const { status } = data;
    if (([STATUS.FINISHED, STATUS.SKIPPED] as string[]).includes(status)) {
      localStorage.setItem(STORAGE_KEY, "true");
      setRun(false);
    }
  };

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous
      onEvent={handleJoyrideCallback}
      options={{
        showProgress: true,
        primaryColor: "#FF7A5C",
        textColor: "#2D3E40",
        backgroundColor: "#fff",
        zIndex: 1000,
      }}

      styles={{
        tooltipContainer: {
          textAlign: "left",
          borderRadius: "16px",
          padding: "12px",
        },
        buttonPrimary: {
          borderRadius: "999px",
          padding: "8px 20px",
          fontWeight: "600",
        },
        buttonBack: {
          marginRight: "10px",
          color: "#6B7F7A",
        },
        buttonSkip: {
          color: "#6B7F7A",
        },
      }}
    />


  );
}
