import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="p-5 border-t border-gray-200 bg-gray-50">
      <div className="container max-w-screen-lg mx-auto flex items-center justify-center mt-5 text-gray-600 text-sm sm:text-base">
        Developed by{" "}
        <a
          href="http://khubaib-portfolio-seven.vercel.app"
          target="_blank"
          rel="noopener noreferrer"
        >
          @Khubaib Shah
        </a>
      </div>
    </footer>
  );
}

export default Footer;
