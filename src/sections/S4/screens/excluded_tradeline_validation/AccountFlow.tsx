import PromptRadio from "../../../../components/PromptRadio";
import CheckboxGroup from "../../../../components/CheckboxGroup";
import { useS4Store } from "../../../../store/useS4Store";

const AccountFlow = ({ flow }) => {
  const { excludedTradelineValidation, setExcludedTradelineValidation } =
    useS4Store();

  return (
    <>
      {flow.map((step) => {
        if (step.condition && !step.condition(excludedTradelineValidation))
          return null;

        return (
          <div
            key={step.id}
            className="border rounded-xl p-6 bg-gray-50 space-y-6"
          >
            {step.type === "radio" && (
              <PromptRadio
                label={step.label}
                value={excludedTradelineValidation[step.storeKey]}
                options={step.options}
                onChange={(v) =>
                  setExcludedTradelineValidation({
                    [step.storeKey]: v,
                  })
                }
              />
            )}

            {step.type === "checkbox" && (
              <CheckboxGroup
                label={step.label}
                options={step.options}
                values={excludedTradelineValidation[step.storeKey] || []}
                onChange={(v) =>
                  setExcludedTradelineValidation({
                    [step.storeKey]: v,
                  })
                }
              />
            )}
          </div>
        );
      })}
    </>
  );
};

export default AccountFlow;
