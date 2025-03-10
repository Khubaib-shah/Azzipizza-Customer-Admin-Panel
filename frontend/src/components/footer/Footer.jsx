import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="p-5 border-t border-gray-200 bg-gray-50">
      <div className="container max-w-screen-lg mx-auto">
        <ul className="text-sm sm:text-base flex flex-col sm:flex-row flex-wrap justify-center items-center text-center gap-2 sm:gap-3 md:gap-5 text-gray-700">
          <li className="hover:underline">
            <Link to="/">Diventa Partner Just Eat</Link>
          </li>
          <li className="hover:underline">
            <Link to="/">Lavora con noi</Link>
          </li>
          <li className="hover:underline">
            <Link to="/">Termini di servizio</Link>
          </li>
          <li className="hover:underline">
            <Link to="/">Informativa sulla privacy</Link>
          </li>
          <li className="hover:underline">
            <Link to="/">Informazioni legali</Link>
          </li>
        </ul>
        <div className="flex items-center justify-center mt-5 text-gray-600 text-sm sm:text-base">
          © 2025 Just Eat
        </div>
      </div>
    </footer>
  );
}

export default Footer;
