import { useState, useEffect, useRef } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Leaf, 
  CloudSun, 
  BarChart2, 
  Settings,
  Bell,
  Search,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Everything the search bar can find, in one place.
const SEARCHABLE_ITEMS = [
  { label: "Overview", to: "/dashboard", keywords: "dashboard home overview" },
  { label: "Disease Prediction", to: "/dashboard/DiseasePrediction", keywords: "disease prediction crop health leaf" },
  { label: "Crop Prediction", to: "/dashboard/CropPrediction", keywords: "crop prediction soil recommend" },
  { label: "Crop Production Prediction", to: "/dashboard/CropProductionPrediction", keywords: "crop production prediction yield" },
  { label: "Weather Forecast", to: "/dashboard/Weather", keywords: "weather forecast rain temperature climate" },
  { label: "My Profile", to: "/dashboard/profile", keywords: "profile account name email avatar" },
  { label: "Settings", to: "/dashboard/settings", keywords: "settings preferences theme dark mode notifications" },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState({ name: "User", email: "user@example.com" });
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const searchResults = searchQuery.trim()
    ? SEARCHABLE_ITEMS.filter((item) =>
        `${item.label} ${item.keywords}`.toLowerCase().includes(searchQuery.trim().toLowerCase())
      )
    : [];

  const goToResult = (to: string) => {
    navigate(to);
    setSearchQuery("");
    setIsSearchFocused(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      goToResult(searchResults[0].to);
    }
  };

  // Close the results dropdown when clicking outside the search box
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/auth/current", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include", // Include session cookies
        });

        const data = await response.json();
        if (response.ok && data.name) {
          setUser({ name: data.name, email: data.email });
        } else {
          console.warn("Failed to fetch user data:", data.msg);
          // Fallback to localStorage if session fetch fails
          const storedUser = localStorage.getItem("user");
          if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Fallback to localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className="flex h-screen bg-agri-50/60">
      {/* Sidebar */}
      <aside
        className={`bg-gradient-to-b from-agri-50 to-agri-100 border-r border-agri-200 transition-all duration-300 ${
          isSidebarOpen ? "w-64" : "w-20"
        } hidden md:block`}
      >
        <div className="h-full flex flex-col">
          {/* Sidebar Header */}
          <div className={`p-4 border-b border-gray-200 flex ${isSidebarOpen ? "justify-between" : "justify-center"}`}>
            {isSidebarOpen ? (
              <Link to="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-r from-agri-400 to-agri-600 flex items-center justify-center text-white font-bold text-lg">A</div>
                <span className="text-xl font-bold gradient-text">AgriSmart</span>
              </Link>
            ) : (
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-agri-400 to-agri-600 flex items-center justify-center text-white font-bold text-xl">A</div>
            )}
            <button
              onClick={toggleSidebar}
              className="text-gray-500 hover:text-agri-600 transition-colors"
            >
              <ChevronDown className={`h-5 w-5 transform ${isSidebarOpen ? "" : "rotate-180"}`} />
            </button>
          </div>

          {/* Sidebar Navigation */}
          <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
            <Link
              to="/dashboard/DiseasePrediction"
              className="flex items-center gap-3 p-3 text-gray-700 hover:bg-agri-50 hover:text-agri-600 rounded-lg font-medium"
            >
              <LayoutDashboard className="h-5 w-5 text-agri-500" />
              {isSidebarOpen && <span>DiseasePrediction</span>}
            </Link>
            <Link
              to="/dashboard/CropPrediction"
              className="flex items-center gap-3 p-3 text-gray-700 hover:bg-agri-50 hover:text-agri-600 rounded-lg font-medium"
            >
              <Leaf className="h-5 w-5 text-agri-500" />
              {isSidebarOpen && <span>Crop Prediction</span>}
            </Link>
            <Link
              to="/dashboard/Weather"
              className="flex items-center gap-3 p-3 text-gray-700 hover:bg-agri-50 hover:text-agri-600 rounded-lg font-medium"
            >
              <CloudSun className="h-5 w-5 text-agri-500" />
              {isSidebarOpen && <span>Weather Forecast</span>}
            </Link>
            <Link
              to="/dashboard/CropProductionPrediction"
              className="flex items-center gap-3 p-3 text-gray-700 hover:bg-agri-50 hover:text-agri-600 rounded-lg font-medium"
            >
              <BarChart2 className="h-5 w-5 text-agri-500" />
              {isSidebarOpen && <span>Crop Production Prediction</span>}
            </Link>
          </nav>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200">
            <Link
              to="/dashboard/settings"
              className="flex items-center gap-3 p-3 text-gray-700 hover:bg-agri-50 hover:text-agri-600 rounded-lg font-medium"
            >
              <Settings className="h-5 w-5 text-agri-500" />
              {isSidebarOpen && <span>Settings</span>}
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Navigation */}
        <header className="bg-white/90 backdrop-blur border-b border-agri-100 shadow-sm">
          <div className="flex justify-between items-center p-4">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden text-gray-500 hover:text-agri-600 focus:outline-none"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            {/* Logo (Mobile) */}
            <div className="md:hidden flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-r from-agri-400 to-agri-600 flex items-center justify-center text-white font-bold text-lg">A</div>
              <span className="text-xl font-bold gradient-text">AgriSmart</span>
            </div>

            {/* Search (Desktop) */}
            <div className="hidden md:flex items-center flex-1 mx-4 lg:mx-16">
              <div className="relative w-full max-w-md" ref={searchRef}>
                <form onSubmit={handleSearchSubmit}>
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    placeholder="Search tools, pages..."
                    className="form-input w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-agri-500 focus:border-transparent"
                  />
                </form>

                {isSearchFocused && searchQuery.trim() && (
                  <div className="absolute z-50 mt-1 w-full bg-white border border-agri-100 rounded-lg shadow-lg overflow-hidden">
                    {searchResults.length > 0 ? (
                      searchResults.map((item) => (
                        <button
                          key={item.to}
                          onClick={() => goToResult(item.to)}
                          className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-agri-50 hover:text-agri-700 transition-colors"
                        >
                          {item.label}
                        </button>
                      ))
                    ) : (
                      <p className="px-4 py-2.5 text-sm text-gray-500">
                        No results for "{searchQuery}"
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Right Side Items */}
            <div className="flex items-center gap-3">
              {/* Notification */}
              <Button variant="ghost" size="icon" className="text-gray-500 hover:text-agri-600 relative">
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </Button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-agri-100 flex items-center justify-center">
                      <User className="h-4 w-4 text-agri-600" />
                    </div>
                    <span className="hidden md:inline text-sm font-medium">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="p-2">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link to="/dashboard/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem className="cursor-pointer" asChild>
                    <Link to="/dashboard/settings">Account Settings</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer text-red-500 flex items-center gap-2" asChild>
                    <Link to="/login">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50">
            <div className="fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out">
              <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                <Link to="/" className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-agri-400 to-agri-600 flex items-center justify-center text-white font-bold text-lg">A</div>
                  <span className="text-xl font-bold gradient-text">AgriSmart</span>
                </Link>
                <button onClick={toggleMobileMenu} className="text-gray-500">
                  <X className="h-6 w-6" />
                </button>
              </div>
              <nav className="p-4 space-y-1.5">
                <Link
                  to="/dashboard"
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-agri-50 hover:text-agri-600 rounded-lg font-medium"
                  onClick={toggleMobileMenu}
                >
                  <LayoutDashboard className="h-5 w-5 text-agri-500" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  to="/dashboard/SoilAnalysis"
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-agri-50 hover:text-agri-600 rounded-lg font-medium"
                  onClick={toggleMobileMenu}
                >
                  <Leaf className="h-5 w-5 text-agri-500" />
                  <span>Soil Analysis</span>
                </Link>
                <Link
                  to="/dashboard/Weather"
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-agri-50 hover:text-agri-600 rounded-lg font-medium"
                  onClick={toggleMobileMenu}
                >
                  <CloudSun className="h-5 w-5 text-agri-500" />
                  <span>Weather Forecast</span>
                </Link>
                <Link
                  to="/dashboard/disease-prediction"
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-agri-50 hover:text-agri-600 rounded-lg font-medium"
                  onClick={toggleMobileMenu}
                >
                  <BarChart2 className="h-5 w-5 text-agri-500" />
                  <span>Disease Prediction</span>
                </Link>
                <Link
                  to="/dashboard/profile"
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-agri-50 hover:text-agri-600 rounded-lg font-medium"
                  onClick={toggleMobileMenu}
                >
                  <User className="h-5 w-5 text-agri-500" />
                  <span>Profile</span>
                </Link>
                <Link
                  to="/dashboard/settings"
                  className="flex items-center gap-3 p-3 text-gray-700 hover:bg-agri-50 hover:text-agri-600 rounded-lg font-medium"
                  onClick={toggleMobileMenu}
                >
                  <Settings className="h-5 w-5 text-agri-500" />
                  <span>Settings</span>
                </Link>
              </nav>
            </div>

            {/* Close when clicking outside */}
            <div 
              className="fixed inset-0 z-[-1]" 
              onClick={toggleMobileMenu}
            ></div>
          </div>
        )}

        {/* Main Content Area with Outlet for nested routes */}
        <main className="flex-1 overflow-y-auto bg-gradient-to-br from-agri-50/50 to-green-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
}