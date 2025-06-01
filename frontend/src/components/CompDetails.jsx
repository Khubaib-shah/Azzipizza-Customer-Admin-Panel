import { FaCalendarAlt } from "react-icons/fa";

const CompDetails = () => {
  return (
    <div className="px-4 md:px-6 lg:px-8 mt-12 pb-2">
      <div className="flex flex-row justify-start items-center">
        <FaCalendarAlt size={24} />
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold ml-2">
          Dettagli dell’azienda
        </h1>
      </div>
      <div className="mt-4">
        <p className="text-gray-600 text-sm md:text-base">
          Azzipizza Mica Pizza e Fichi
        </p>
        <p className="text-gray-600 text-sm md:text-base">Via Frassinago 16b</p>
        <p className="text-gray-600 text-sm md:text-base">40123 Bologna</p>
      </div>
    </div>
  );
};

export default CompDetails;
