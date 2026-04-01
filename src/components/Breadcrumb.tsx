type Props = {
  activeSection: string;
};

const Breadcrumb = ({ activeSection }: Props) => {
  return (
    <div className="h-10 bg-gray-50 border-b flex items-center px-6 text-sm text-gray-600">
      Credit Review &gt; {activeSection}
    </div>
  );
};

export default Breadcrumb;
