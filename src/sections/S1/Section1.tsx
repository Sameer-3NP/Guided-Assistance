import CreditInventory from "./screens/CreditInventory";
import TopBanner from "./TopBanner";

const Section1 = ({ onContinue }: { onContinue: () => void }) => {
  return (
    <div>
      <TopBanner />
      <CreditInventory onContinue={onContinue} />
    </div>
  );
};

export default Section1;
