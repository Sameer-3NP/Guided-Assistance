import { useState } from "react";
import { SECTIONS } from "./constants/sections";
import MainLayout from "./layout/MainLayout";
import Initialization from "./sections/S0/Initialization";
// import CreditReportDetails from "./sections/S1/CreditReportDetails";
import CreditInventory from "./sections/S1/CreditInventory";
import toast, { Toaster } from "react-hot-toast";
import { useEffect } from "react";

const App = () => {
  const [activeSection, setActiveSection] = useState("S0");
  const [initData, setInitData] = useState<{
    applicationDate: string;
    closingDate: string;
    creditAsOfDate: string;
    borrowerCount: number;
  } | null>(null);
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

  // const handleContinue = () => {
  //   const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);

  //   if (currentIndex === SECTIONS.length - 1) return;

  //   const nextSection = SECTIONS[currentIndex + 1];

  //   setSectionStatus((prev: any) => ({
  //     ...prev,
  //     [activeSection]: "completed",
  //     [nextSection.id]: "active",
  //   }));

  //   setActiveSection(nextSection.id);
  // };

  const handleContinue = () => {
    if (activeSection === "S0") {
      if (!initData) {
        toast.error("Please complete all initialization fields.");
        return;
      }

      const { applicationDate, closingDate, creditAsOfDate, borrowerCount } =
        initData;

      if (
        !applicationDate ||
        !closingDate ||
        !creditAsOfDate ||
        !borrowerCount
      ) {
        toast.error("Please complete all initialization fields.");
        return;
      }
    }

    const currentIndex = SECTIONS.findIndex((s) => s.id === activeSection);

    if (currentIndex === SECTIONS.length - 1) return;

    const nextSection = SECTIONS[currentIndex + 1];

    setSectionStatus((prev: SectionStatusType) => ({
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
          />
        );

      case "S1":
        return <CreditInventory />;

      default:
        return <div>Section not implemented yet</div>;
    }
  };

  const handleInitializationSubmit = (data: {
    applicationDate: string;
    closingDate: string;
    creditAsOfDate: string;
    borrowerCount: number;
  }) => {
    console.log("Session Created:", data);

    // Save in state
    setInitData(data);

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
    const currentIndex = getCurrentIndex();

    if (currentIndex === 0) return;

    const prevSection = SECTIONS[currentIndex - 1];

    setActiveSection(prevSection.id);
  };

  const handleSave = () => {
    const currentSectionKey = `${activeSection}_data`;

    let dataToSave: any = null;

    // OLD
    // if (activeSection === "S0") {
    //   dataToSave = initData;
    // }

    // UPDATED
    if (activeSection === "S0") {
      const savedDraft = localStorage.getItem("S0_draft");
      dataToSave = (savedDraft ? JSON.parse(savedDraft) : null) || initData;
    }

    // OLD
    // if (activeSection === "S1") {
    //   dataToSave = creditReports;
    // }

    // UPDATED
    if (activeSection === "S1") {
      const savedReports = localStorage.getItem("S1_data");

      if (savedReports) {
        dataToSave = JSON.parse(savedReports);
      }
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
