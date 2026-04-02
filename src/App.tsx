import { useState } from "react";
import { SECTIONS } from "./constants/sections";
import MainLayout from "./layout/MainLayout";
import Initialization from "./sections/S0/Initialization";
// import CreditReportDetails from "./sections/S1/CreditReportDetails";
import CreditInventory from "./sections/S1/screens/CreditInventory";
import toast, { Toaster } from "react-hot-toast";
import { Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useSectionStore } from "./store/SectionStore";
import MultipleCreditReports from "./sections/S1/screens/MultipleReports";
import type { InventoryItem } from "./types/inventory";
import type { InitializationForm } from "./utils/initializationSchema";
import CreditReportValidity from "./sections/S1/screens/CreditReportValidity";
import RepositoryCheck from "./sections/S1/screens/RepositoryCheck";
import SourceRequestIntegrity from "./sections/S1/screens/SourceRequestIntegrity";
import SystemAlignmentReview from "./sections/S1/screens/SystemAlignmentReview";

const App = () => {
  const [activeSection, setActiveSection] = useState("S0");
  const [initData, setInitData] = useState<InventoryItem | null>(null);
  const [isLocked, setIsLocked] = useState(false);
  type SectionStatusType = {
    S0: string;
    S1: string;
    S2: string;
    S3: string;
    S4: string;
    S5: string;
  };
  const [sectionStatus, setSectionStatus] = useState<SectionStatusType>({
    S0: "active",
    S1: "locked",
    S2: "locked",
    S3: "locked",
    S4: "locked",
    S5: "locked",
  });
  const { setS0, s1 } = useSectionStore();
  const [s1Screen, setS1Screen] = useState<
    | "inventory"
    | "multipleReports"
    | "repositoryCheck"
    | "creditReportValidity"
    | "SourceRequestIntegrity"
    | "SystemAlignmentReview"
  >("inventory");

  const handleContinue = () => {
    if (activeSection === "S0") {
      const form = document.getElementById(
        "initialization-form",
      ) as HTMLFormElement;

      if (form) {
        form.requestSubmit();
      }

      return;
    }

    if (activeSection === "S1") {
      if (s1Screen === "inventory") {
        if (!s1 || s1.length === 0) {
          toast.error("Please enter credit report information");
          return;
        }

        if (s1.length > 1) {
          toast(
            "Multiple credit reports detected. Please select the one used for qualification.",
            {
              icon: "⚠️",
              style: {
                background: "#fff3cd",
                color: "#333",
                border: "1px solid #ddd",
              },
            },
          );
          setS1Screen("multipleReports");
        } else {
          setS1Screen("repositoryCheck");
        }

        return;
      }
      if (s1Screen === "multipleReports") {
        setS1Screen("repositoryCheck");
        return;
      }

      if (s1Screen === "repositoryCheck") {
        setS1Screen("creditReportValidity");
        return;
      }

      if (s1Screen === "creditReportValidity") {
        setS1Screen("SourceRequestIntegrity");
        return;
      }

      if (s1Screen === "SourceRequestIntegrity") {
        setS1Screen("SystemAlignmentReview");
        return;
      }

      if (s1Screen === "SystemAlignmentReview") {
        const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);
        const nextSection = SECTIONS[currentIndex + 1];

        setSectionStatus((prev) => ({
          ...prev,
          [activeSection]: "completed",
          [nextSection.id]: "active",
        }));

        setActiveSection(nextSection.id);

        return;
      }
    }

    // default section navigation
    const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);

    if (currentIndex === SECTIONS.length - 1) return;

    const nextSection = SECTIONS[currentIndex + 1];

    setSectionStatus((prev) => ({
      ...prev,
      [activeSection]: "completed",
      [nextSection.id]: "active",
    }));

    setActiveSection(nextSection.id);
  };

  const renderSection = () => {
    switch (activeSection) {
      case "S0":
        return (
          <Initialization
            onSubmit={handleInitializationSubmit}
            locked={isLocked}
            defaultValues={initData}
          />
        );

      case "S1":
        if (s1Screen === "inventory") {
          return <CreditInventory onContinue={handleContinue} />;
        }

        if (s1Screen === "multipleReports") {
          return <MultipleCreditReports onContinue={handleContinue} />;
        }

        if (s1Screen === "repositoryCheck") {
          return <RepositoryCheck onContinue={handleContinue} />;
        }

        if (s1Screen === "creditReportValidity") {
          return <CreditReportValidity onContinue={handleContinue} />;
        }

        if (s1Screen === "SourceRequestIntegrity") {
          return <SourceRequestIntegrity onContinue={handleContinue} />;
        }

        if (s1Screen === "SystemAlignmentReview") {
          return <SystemAlignmentReview onContinue={handleContinue} />;
        }

        break;

      default:
        return <div>Section not implemented yet</div>;
    }
  };

  const handleInitializationSubmit = (data: InitializationForm) => {
    console.log("Session Created:", data);

    // Save in state
    setInitData(data);
    setS0(data);

    // Save in localStorage
    localStorage.setItem("initializationSession", JSON.stringify(data));
    localStorage.removeItem("S0_draft");

    // Lock form
    setIsLocked(true);

    // Unlock next section
    setSectionStatus((prev: SectionStatusType) => ({
      ...prev,
      S0: "completed",
      S1: "active",
    }));

    setActiveSection("S1");
  };

  useEffect(() => {
    const savedSession = localStorage.getItem("initializationSession");

    if (savedSession) {
      const parsedData = JSON.parse(savedSession);

      setInitData(parsedData);
      setS0(parsedData);
      setIsLocked(true);

      setSectionStatus((prev: SectionStatusType) => ({
        ...prev,
        S0: "completed",
        S1: "active",
      }));
    }
  }, []);

  const getCurrentIndex = () => {
    return SECTIONS.findIndex((s) => s.id === activeSection);
  };

  const handleBack = () => {
    if (activeSection === "S1") {
      if (s1Screen === "SystemAlignmentReview") {
        setS1Screen("SourceRequestIntegrity");
        return;
      }

      if (s1Screen === "SourceRequestIntegrity") {
        setS1Screen("creditReportValidity");
        return;
      }

      if (s1Screen === "creditReportValidity") {
        setS1Screen("repositoryCheck");
        return;
      }

      if (s1Screen === "repositoryCheck") {
        setS1Screen("multipleReports");
        return;
      }

      if (s1Screen === "multipleReports") {
        setS1Screen("inventory");
        return;
      }
    }

    const currentIndex = getCurrentIndex();

    if (currentIndex === 0) return;

    const prevSection = SECTIONS[currentIndex - 1];

    if (prevSection.id === "S0") {
      setIsLocked(true);
    }

    setActiveSection(prevSection.id);
  };

  const handleSave = () => {
    const currentSectionKey = `${activeSection}_data`;

    let dataToSave: {
      applicationDate: string;
      closingDate: string;
      creditAsOfDate: string;
      borrowerCount: number;
    } | null = null;

    // UPDATED
    if (activeSection === "S0") {
      const savedDraft = localStorage.getItem("S0_draft");
      dataToSave = (savedDraft ? JSON.parse(savedDraft) : null) || initData;
    }

    // UPDATED
    if (activeSection === "S1") {
      localStorage.setItem("S1_data", JSON.stringify(s1));
      toast.success("Credit report data saved");
    }

    if (!dataToSave) {
      toast.error("Nothing to save");
      return;
    }

    localStorage.setItem(currentSectionKey, JSON.stringify(dataToSave));

    toast.success("Progress saved");
  };

  return (
    <>
      {/* <Routes>
        <Route path="/" element={renderSection()} />
      </Routes> */}
      <Toaster position="items-center top-4" />

      <MainLayout
        activeSection={activeSection}
        sectionStatus={sectionStatus}
        setActiveSection={setActiveSection}
        onContinue={handleContinue}
        onSave={handleSave}
        onBack={handleBack}
      >
        {renderSection()}
      </MainLayout>
    </>
  );
};

export default App;
