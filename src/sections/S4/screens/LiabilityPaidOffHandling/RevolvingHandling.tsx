import PromptRadio from "../../../../components/PromptRadio";
import CheckboxGroup from "../../../../components/CheckboxGroup";
import { useSectionStore } from "../../../../store/SectionStore";

const RevolvingHandling = () => {
  const { liabilityPaidOffHandling, setLiabilityPaidOffHandling } =
    useSectionStore();

  const { supportingDocument, discrepancies, latestCreditReport } =
    liabilityPaidOffHandling;

  return (
    <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
      <PromptRadio
        label="Do we have any supporting documents for paying off the debt at closing?"
        value={supportingDocument}
        options={["Yes", "No"]}
        onChange={(v) =>
          setLiabilityPaidOffHandling({
            supportingDocument: v,
          })
        }
      />

      {supportingDocument === "No" && (
        <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
          Condition 1 appears as per scenario A
        </div>
      )}

      {supportingDocument === "Yes" && (
        <PromptRadio
          label="Do we have the latest credit card statement?"
          options={["Yes", "No"]}
          value={latestCreditReport}
          onChange={(v) =>
            setLiabilityPaidOffHandling({
              latestCreditReport: v,
            })
          }
        />
      )}

      {latestCreditReport === "Yes" && (
        <CheckboxGroup
          label="Checklist"
          options={[
            "Credit card statements are received for different borrowers.",
            "Credit card statement received reflects different account number and name.",
          ]}
          values={discrepancies}
          onChange={(v) =>
            setLiabilityPaidOffHandling({
              discrepancies: v,
            })
          }
        />
      )}

      {discrepancies.length > 0 && (
        <div className="border border-red-400 bg-red-50 p-3 rounded-2xl text-sm text-red-700">
          Condition 2 appears as per Scenario A
        </div>
      )}
    </div>
  );
};

export default RevolvingHandling;
