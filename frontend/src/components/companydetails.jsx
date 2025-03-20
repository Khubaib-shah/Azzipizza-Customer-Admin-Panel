import React from "react";
import { FaCalendarAlt } from "react-icons/fa";

const Companydetails = () => {
  return (
    <div className="px-4 md:px-6 lg:px-8 mt-12">
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
      <div className="mt-4">
        <p className="text-gray-600 text-sm md:text-base">
          Piattaforma europea di risoluzione delle controversie online:{" "}
          <a
            href="https://ec.europa.eu/consumers/odr"
            className="text-blue-600 underline"
          >
            https://ec.europa.eu/consumers/odr
          </a>
        </p>
      </div>
      <div className="border-b border-gray-300 my-4"></div>
      <div>
        <p className="text-gray-600 text-sm md:text-base">
          La nostra azienda è un operatore professionale. Scopri di più su come
          sono ripartite le responsabilità nei confronti dei consumatori tra noi
          e Just Eat.
        </p>
      </div>
    </div>
  );
};

export default Companydetails;
