import { Mail, Lock, User, Plane } from "lucide-react";
import { Link } from "react-router-dom";

const Register = () => (
  <div className="min-h-screen flex items-center justify-center px-4 pt-16">
    <div className="w-full max-w-md" style={{ animation: "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards" }}>
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
          <Plane className="w-7 h-7 text-white" />
        </div>
        <h1 className="font-display font-bold text-3xl text-foreground">Create Account</h1>
        <p className="text-muted-foreground mt-2 text-sm">Start planning your AI-powered trips</p>
      </div>

      <div className="glass-card p-6 sm:p-8">
        <div className="space-y-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
              <input placeholder="Alex Rivera" className="input-glow !pl-10" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
              <input type="email" placeholder="you@example.com" className="input-glow !pl-10" />
            </div>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1.5 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
              <input type="password" placeholder="••••••••" className="input-glow !pl-10" />
            </div>
          </div>
          <button className="btn-gradient w-full text-base mt-2">Create Account</button>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account? <Link to="/login" className="text-primary hover:underline">Sign In</Link>
        </p>
      </div>
    </div>
  </div>
);

export default Register;
