import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-green-50 to-white px-4">
      <div className="text-center bg-white/80 backdrop-blur rounded-2xl border border-agri-100 shadow-sm px-10 py-12">
        <h1 className="text-5xl font-bold mb-3 text-agri-700">404</h1>
        <p className="text-xl text-gray-600 mb-6">Oops! Page not found</p>
        <a href="/" className="inline-block px-5 py-2 rounded-lg bg-agri-500 text-white font-medium hover:bg-agri-600 transition-colors">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
