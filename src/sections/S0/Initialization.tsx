import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  initializationSchema,
  type InitializationForm,
} from "../../utils/initializationSchema";

type Props = {
  onSubmit: (data: InitializationForm) => void;
  locked: boolean;
  defaultValues?: any;
};

const Initialization = ({ onSubmit, locked, defaultValues }: Props) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<InitializationForm>({
    resolver: zodResolver(initializationSchema),
  });
  const formValues = watch();

  useEffect(() => {
    const savedDraft = localStorage.getItem("S0_draft");

    if (savedDraft) {
      const parsedDraft = JSON.parse(savedDraft);

      Object.keys(parsedDraft).forEach((key) => {
        setValue(key as keyof InitializationForm, parsedDraft[key]);
      });
    }
  }, [setValue]);

  useEffect(() => {
    localStorage.setItem("S0_draft", JSON.stringify(formValues));
  }, [formValues]);

  return (
    <div className="flex justify-center items-start">
      <div className="bg-white w-full max-w-3xl rounded-xl shadow-md border p-8">
        <h2 className="text-xl font-semibold mb-6">S0 — Initialization</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="grid grid-cols-2 gap-6"
        >
          {/* Application Date */}
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Application Date</label>

            <input
              type="date"
              {...register("applicationDate")}
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

            <select
              {...register("borrowerCount")}
              className="border rounded-md px-3 py-2"
            >
              <option value="">Select</option>
              <option value="1">1 Borrower</option>
              <option value="2">2 Borrowers</option>
            </select>

            {errors.borrowerCount && (
              <span className="text-red-500 text-xs">
                {errors.borrowerCount.message}
              </span>
            )}
          </div>

          <div className="col-span-2 flex justify-end mt-4">
            <button
              type="submit"
              className="px-4 py-2 bg-black text-white rounded-md"
            >
              Start Process <span className="mt-1">&#10132;</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Initialization;
