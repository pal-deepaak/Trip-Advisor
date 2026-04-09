import { Link } from "react-router-dom";
import { Plane, Mail, MapPin, Phone } from "lucide-react";

const Footer = () => (
  <footer className="border-t border-border mt-16" style={{ background: "hsl(150 20% 97%)" }}>
    <div className="container mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Plane className="w-4 h-4 text-white" />
            </div>
            <span className="font-display font-bold text-foreground">VoyageAI</span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">Your AI-powered travel companion. Plan smarter trips with intelligent recommendations.</p>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Explore</h4>
          <div className="space-y-2">
            {[["Hotels", "/hotels"], ["Things to Do", "/things-to-do"], ["Restaurants", "/restaurants"], ["Search", "/search"]].map(([label, to]) => (
              <Link key={to} to={to} className="block text-sm text-muted-foreground hover:text-primary transition-colors">{label}</Link>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Company</h4>
          <div className="space-y-2">
            {["About Us", "Careers", "Blog", "Press"].map((t) => (
              <span key={t} className="block text-sm text-muted-foreground cursor-default">{t}</span>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-display font-semibold text-foreground mb-3">Contact</h4>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> hello@voyageai.com</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> +1 (555) 987-6543</p>
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> San Francisco, CA</p>
          </div>
        </div>
      </div>
      <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
        © 2026 VoyageAI. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
