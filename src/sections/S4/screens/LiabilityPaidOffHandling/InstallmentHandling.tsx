import PromptRadio from "../../../../components/PromptRadio";
import CheckboxGroup from "../../../../components/CheckboxGroup";
import { useSectionStore } from "../../../../store/SectionStore";

const InstallmentHandling = () => {
  const { liabilityPaidOffHandling, setLiabilityPaidOffHandling } =
    useSectionStore();

  const { supportingDocument, documentType, discrepancies } =
    liabilityPaidOffHandling;

  return (
    <div className="border rounded-xl p-6 bg-gray-50 space-y-6">
      <PromptRadio
        label="Do we have any supporting documents for paying off the debt at closing?"
        options={["Yes", "No"]}
        value={supportingDocument}
        onChange={(v) =>
          setLiabilityPaidOffHandling({
            supportingDocument: v,
          })
        }
      />

      {supportingDocument === "No" && (
        <div className="border border-red-400 bg-red-50 p-3 rounded-xl text-sm text-red-700">
          Condition 1 appears as per Scenario B
        </div>
      )}

      {supportingDocument === "Yes" && (
        <CheckboxGroup
          label="Please select the available document received?"
          options={["Installment payoff", "Account statement"]}
          values={documentType}
          onChange={(v) =>
            setLiabilityPaidOffHandling({
              documentType: v,
            })
          }
        />
      )}

      {documentType.includes("Installment payoff") && (
        <CheckboxGroup
          label="If Installment Payoff is available:"
          options={[
            "Payoff reflects incorrect account number and name",
            "Payoff reflects the incorrect borrower's name.",
            "Payoff provided is not latest and per diem interest is not provided.",
            "Payoff provided has already expired.",
          ]}
          values={discrepancies}
          onChange={(v) =>
            setLiabilityPaidOffHandling({
              discrepancies: v,
            })
          }
        />
      )}

      {documentType.includes("Account statement") && (
        <CheckboxGroup
          label="If Account statement is available:"
          options={[
            "The account statement reflects incorrect loan number and borrower name.",
            "Account statement reflects the incorrect borrower’s name",
            "Account statement provided does not reflect the exact payoff amount",
            "The account statement available is not the latest statement.",
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
          Condition 2 appears as per Scenario B
        </div>
      )}
    </div>
  );
};

export default InstallmentHandling;
