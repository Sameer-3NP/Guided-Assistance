import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { Calendar, CalendarClock, FileText, Lock, Users } from "lucide-react";
import { useFlowContext } from "../../store/FlowContext";
import { useSectionStore } from "../../store/SectionStore";
import {
  initializationSchema,
  type InitializationForm,
} from "../../utils/initializationSchema";
import PopUp from "../../components/PopUp";

const Initialization = () => {
  const navigate = useNavigate();
  const { registerActions } = useFlowContext();
  const { setS0, s0, setSectionStatus } = useSectionStore();
  const [showPopup, setShowPopup] = useState(true);
  const isLocked = !!s0;

  const {
    register,
    handleSubmit,
    // formState: {},
  } = useForm<InitializationForm>({
    resolver: zodResolver(initializationSchema),
    defaultValues: s0,
  });

  const doSubmit = (data: InitializationForm) => {
    setS0(data);
    setSectionStatus((prev) => ({ ...prev, S0: "completed", S1: "active" }));
    navigate("/s1/inventory");
  };

  const handleContinue = () => {
    const form = document.getElementById(
      "initialization-form",
    ) as HTMLFormElement;
    form?.requestSubmit();
  };

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => {},
      onSave: () => toast("Draft saving disabled for this screen."),
    });
  }, []);

  return (
    <div className="flex flex-col items-center p-6">
      {/* Form Card */}
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-lg border border-gray-200 p-8 relative">
        <PopUp
          open={isLocked && showPopup}
          onClose={() => setShowPopup(false)}
          icon={
            <div className="bg-yellow-100 p-3 rounded-full">
              <Lock className="w-6 h-6 text-yellow-600" />
            </div>
          }
          title={`The initialization step has already been completed. All fields are locked, but you can still review the information.`}
        />
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Start the Loan Process
        </h2>
        <form
          id="initialization-form"
          onSubmit={handleSubmit(doSubmit, () =>
            toast.error("Please complete all fields."),
          )}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {/* Application Date */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-blue-400" />
              <label className="text-sm font-medium text-gray-700">
                Application Date
              </label>
            </div>
            <input
              type="date"
              {...register("applicationDate")}
              disabled={isLocked}
              className="w-full border border-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-100 "
            />
          </div>

          {/* Closing Date */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <CalendarClock className="w-4 h-4 text-blue-400" />
              <label className="text-sm font-medium text-gray-700">
                Estimated Closing Date
              </label>
            </div>
            <input
              type="date"
              {...register("closingDate")}
              disabled={isLocked}
              className="w-full border border-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-100"
            />
          </div>

          {/* Credit Report Date */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="w-4 h-4 text-blue-400" />
              <label className="text-sm font-medium text-gray-700">
                Credit Report "As Of" Date
              </label>
            </div>
            <input
              type="date"
              {...register("creditAsOfDate")}
              disabled={isLocked}
              className="w-full border border-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-100"
            />
          </div>

          {/* Borrower Count */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-400" />
              <label className="text-sm font-medium text-gray-700">
                Borrower Count
              </label>
            </div>
            <input
              type="number"
              min={1}
              max={10}
              {...register("borrowerCount", { valueAsNumber: true })}
              disabled={isLocked}
              className="w-full border border-black rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 disabled:bg-gray-100"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default Initialization;
