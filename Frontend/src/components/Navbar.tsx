import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, Plane, Search, Building2, Compass, UtensilsCrossed } from "lucide-react";

const navLinks = [
  { to: "/search", label: "Search All", icon: Search },
  { to: "/hotels", label: "Hotels", icon: Building2 },
  { to: "/things-to-do", label: "Things to Do", icon: Compass },
  { to: "/restaurants", label: "Restaurants", icon: UtensilsCrossed },
];

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border" style={{ background: "hsl(0 0% 100% / 0.85)", backdropFilter: "blur(20px)" }}>
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        {/* Logo */}
         <Link to="/" className="flex items-center gap-2 group">
           <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center transition-transform duration-300 group-hover:scale-105 group-active:scale-95">
             <Plane className="w-5 h-5 text-white" />
           </div>
           <span className="font-display font-bold text-lg text-foreground">VoyageAI</span>
        </Link>

        {/* Center nav links — desktop */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((l) => {
            const active = location.pathname === l.to;
            return (
              <Link
                key={l.to}
                to={l.to}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-foreground/70 hover:text-foreground hover:bg-muted"
                }`}
              >
                <l.icon className="w-4 h-4" />
                {l.label}
              </Link>
            );
          })}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          <Link to="/login" className="btn-outline-glow text-sm">Login</Link>
          <Link to="/register" className="btn-gradient text-sm !px-5 !py-2">Sign Up</Link>
        </div>

        {/* Mobile toggle */}
        <button onClick={() => setOpen(!open)} className="md:hidden text-foreground p-2">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div className="md:hidden border-t border-border pb-4 px-4 space-y-1" style={{ background: "hsl(0 0% 100% / 0.95)" }}>
          {navLinks.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-foreground/80 hover:bg-muted transition-colors"
            >
              <l.icon className="w-4 h-4" />
              {l.label}
            </Link>
          ))}
          <div className="flex gap-3 pt-3 border-t border-border">
            <Link to="/login" onClick={() => setOpen(false)} className="btn-outline-glow text-sm flex-1 text-center">Login</Link>
            <Link to="/register" onClick={() => setOpen(false)} className="btn-gradient text-sm flex-1 text-center !px-4 !py-2">Sign Up</Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
