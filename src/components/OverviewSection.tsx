const data = [
    { label: "Current Month (Income)", value: "+729 $", color: "text-green-600" },
    { label: "Total Balance", value: "51,213 $", color: "text-white" },
    { label: "Current Month (Outcome)", value: "-372 $", color: "text-red-500" },
  ];
  
  const OverviewSection = () => {
    return (
      <div className="bg-neutral-900 text-white rounded-2xl p-6 shadow-md grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((item, index) => (
          <div key={index} className="bg-neutral-800 p-4 rounded-xl shadow-sm flex flex-col items-start">
            <span className="text-sm text-neutral-400">{item.label}</span>
            <span className={`text-2xl font-bold mt-1 ${item.color}`}>{item.value}</span>
          </div>
        ))}
      </div>
    );
  };
  
  export default OverviewSection;
  