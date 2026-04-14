import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, Plane, Search, Building2, Compass, UtensilsCrossed, User, Bell, AlertCircle, Sun, Moon } from "lucide-react";

const navLinks = [
  { to: "/search", label: "Search All", icon: Search },
  { to: "/things-to-do", label: "Things to Do", icon: Compass },
  { to: "/hotels", label: "Hotels", icon: Building2 },
  { to: "/restaurants", label: "Restaurants", icon: UtensilsCrossed },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [hasNewFeatures, setHasNewFeatures] = useState(false);

  // Check for new features on mount
  useEffect(() => {
    const seenFeatures = localStorage.getItem("seenFeatures");
    if (!seenFeatures) {
      setHasNewFeatures(true);
      localStorage.setItem("seenFeatures", "false");
    }
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    // Enhanced search with typeahead suggestions
    navigate("/search");
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/20" style={{ background: "hsl(0 0% 100% / 0.8)", backdropFilter: "blur(20px)" }}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-active:scale-95">
            <Plane className="w-6 h-6 text-white" />
          </div>
          <span className="font-display font-bold text-xl text-foreground">VoyageAI</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-2 flex-1 justify-center">
          {navLinks.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setOpen(false)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 relative ${active ? "bg-primary/10 text-primary" : "text-foreground/60 hover:text-foreground hover:bg-muted/50"}`}
              >
                <l.icon className={`w-4 h-4 ${active ? "text-primary" : "text-foreground/60"}`} />
                {l.label}
                {active && (
                  <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 w-3/4 bg-primary rounded-t-xl" />
                )}
              </Link>
            );
          })}
        </div>

        {/* User Actions */}
        <div className="hidden md:flex items-center gap-2">
          <button className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors group" title="Notifications">
            <Bell className="w-5 h-5 text-foreground/60 group-hover:text-primary transition-colors" />
            {hasNewFeatures && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-primary rounded-full"></span>
            )}
          </button>
          <button className="relative p-2 rounded-lg hover:bg-muted/50 transition-colors group" title="User Menu">
            <User className="w-5 h-5 text-foreground/60 group-hover:text-primary transition-colors" />
          </button>
          <button className="btn-gradient text-sm !px-5 !py-2 hidden sm:inline-flex">Sign Up</button>
          <button className="btn-outline-glow text-sm hidden sm:inline-flex">Login</button>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden text-foreground p-2 hover:bg-muted/50 rounded-lg transition-colors">
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-border/20 bg-white/95 backdrop-blur-sm" style={{ boxShadow: "0 -10px 40px rgba(0,0,0,0.1)" }}>
          <div className="px-3 py-2 space-y-1">
            {navLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/80 hover:text-foreground hover:bg-muted/50 transition-colors"
              >
                <l.icon className="w-4 h-4" />
                {l.label}
              </Link>
            ))}

            {/* Mobile search form */}
            <form onSubmit={handleSearch} className="px-3 py-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-foreground/40" />
                <input
                  type="search"
                  placeholder="Search destinations..."
                  className="w-full pl-10 pr-4 py-2.5 border rounded-xl text-sm bg-muted/50 border-muted/30 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                />
              </div>
            </form>

            <div className="px-3 py-2 space-y-1">
              <button className="w-full text-left px-4 py-2.5 rounded-xl text-foreground/80 hover:text-foreground hover:bg-muted/50 transition-colors text-sm">
                Login
              </button>
              <button className="w-full text-left px-4 py-2.5 rounded-xl btn-gradient text-sm text-white hover:opacity-90 transition-opacity">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Feature Badge */}
      {hasNewFeatures && (
        <div className="fixed top-20 right-4 z-50 animate-bounce">
          <div className="bg-primary text-white px-3 py-1.5 rounded-full text-xs font-medium shadow-lg flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            New Features!
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;