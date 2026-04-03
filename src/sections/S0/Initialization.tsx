import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useFlowContext } from "../../store/FlowContext";
import { useSectionStore } from "../../store/SectionStore";
import {
  initializationSchema,
  type InitializationForm,
} from "../../utils/initializationSchema";

const Initialization = () => {
  const navigate = useNavigate();
  const { registerActions } = useFlowContext();
  const { setS0, s0, setSectionStatus } = useSectionStore();

  const isLocked = !!s0; // 🔒 lock when data exists

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<InitializationForm>({
    resolver: zodResolver(initializationSchema),
    defaultValues: s0 || undefined,
  });

  /* ---------------------- Submit ---------------------- */

  const doSubmit = (data: InitializationForm) => {
    console.log("Session Created:", data);

    setS0(data);

    setSectionStatus((prev) => ({
      ...prev,
      S0: "completed",
      S1: "active",
    }));

    navigate("/s1/inventory");
  };

  /* ---------------------- Continue Button ---------------------- */

  const handleContinue = () => {
    const form = document.getElementById(
      "initialization-form",
    ) as HTMLFormElement;

    form?.requestSubmit();
  };

  /* ---------------------- Register Flow Actions ---------------------- */

  useEffect(() => {
    registerActions({
      onContinue: handleContinue,
      onBack: () => {},
      onSave: () => {
        toast("Draft saving disabled for this screen.");
      },
    });
  }, []);

  /* ---------------------- UI ---------------------- */

  return (
    <div className="flex justify-center items-start">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-md border p-8">
        <h2 className="text-xl font-semibold mb-6">Start the Loan Process</h2>

        {/* {isLocked && (
          <div className="mb-4 text-sm text-gray-600 bg-gray-100 p-3 rounded-md">
            🔒 Initialization completed. Fields are locked.
          </div>
        )} */}

        <form
          id="initialization-form"
          onSubmit={handleSubmit(doSubmit, () =>
            toast.error("Please complete all the fields."),
          )}
          className="grid grid-cols-2 gap-6"
        >
          {/* Application Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Application Date</label>

            <input
              type="date"
              {...register("applicationDate")}
              disabled={isLocked}
              className="border rounded-md px-3 py-2"
            />

            {errors.applicationDate && (
              <span className="text-red-500 text-xs">
                {errors.applicationDate.message}
              </span>
            )}
          </div>

          {/* Closing Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Estimated Closing Date
            </label>

            <input
              type="date"
              {...register("closingDate")}
              disabled={isLocked}
              className="border rounded-md px-3 py-2"
            />

            {errors.closingDate && (
              <span className="text-red-500 text-xs">
                {errors.closingDate.message}
              </span>
            )}
          </div>

          {/* Credit Report Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">
              Credit Report "As Of" Date
            </label>

            <input
              type="date"
              {...register("creditAsOfDate")}
              disabled={isLocked}
              className="border rounded-md px-3 py-2"
            />

            {errors.creditAsOfDate && (
              <span className="text-red-500 text-xs">
                {errors.creditAsOfDate.message}
              </span>
            )}
          </div>

          {/* Borrower Count */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Borrower Count</label>

            <input
              type="number"
              min={1}
              max={10}
              {...register("borrowerCount", { valueAsNumber: true })}
              disabled={isLocked}
              className="border rounded-md px-3 py-2"
            />

            {errors.borrowerCount && (
              <span className="text-red-500 text-xs">
                {errors.borrowerCount.message}
              </span>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Initialization;
