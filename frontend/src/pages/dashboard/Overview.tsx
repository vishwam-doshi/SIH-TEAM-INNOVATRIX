import { Link } from "react-router-dom";
import { Leaf, CloudSun, BarChart2, ArrowRight } from "lucide-react";

const features = [
  {
    to: "/dashboard/DiseasePrediction",
    icon: Leaf,
    title: "Disease Prediction",
    desc: "Upload a photo of your crop and detect diseases early.",
  },
  {
    to: "/dashboard/CropPrediction",
    icon: BarChart2,
    title: "Crop Prediction",
    desc: "Get the best crop recommendation for your soil.",
  },
  {
    to: "/dashboard/Weather",
    icon: CloudSun,
    title: "Weather Forecast",
    desc: "Check local weather to plan your farming activities.",
  },
  {
    to: "/dashboard/CropProductionPrediction",
    icon: BarChart2,
    title: "Crop Production Prediction",
    desc: "Estimate expected yield for your crop and land.",
  },
];

export default function Overview() {
  const storedUser = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  })();

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-agri-800">
          Welcome{storedUser?.name ? `, ${storedUser.name}` : ""} 👋
        </h1>
        <p className="text-gray-600 mt-1">
          Here's your AgriSmart dashboard. Pick a tool below to get started.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {features.map(({ to, icon: Icon, title, desc }) => (
          <Link
            key={to}
            to={to}
            className="group bg-white/80 backdrop-blur border border-agri-100 rounded-2xl p-5 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-agri-300 transition-all duration-200"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-agri-400 to-agri-600 flex items-center justify-center mb-4">
              <Icon className="h-5 w-5 text-white" />
            </div>
            <h3 className="font-semibold text-gray-800 group-hover:text-agri-700">
              {title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{desc}</p>
            <div className="flex items-center gap-1 text-agri-600 text-sm font-medium mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
              Open <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
