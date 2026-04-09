import { Mail, Lock, Plane } from "lucide-react";
import { Link } from "react-router-dom";

const Login = () => (
  <div className="min-h-screen flex items-center justify-center px-4 pt-16">
    <div className="w-full max-w-md" style={{ animation: "fade-up 0.7s cubic-bezier(0.16,1,0.3,1) forwards" }}>
      <div className="text-center mb-8">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center mx-auto mb-4">
          <Plane className="w-7 h-7 text-white" />
        </div>
        <h1 className="font-display font-bold text-3xl text-foreground">Welcome Back</h1>
        <p className="text-muted-foreground mt-2 text-sm">Sign in to continue your journey</p>
      </div>

      <div className="glass-card p-6 sm:p-8">
        <div className="space-y-4">
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
          <button className="btn-gradient w-full text-base mt-2">Sign In</button>
        </div>
        <p className="text-center text-sm text-muted-foreground mt-6">
          Don't have an account? <Link to="/register" className="text-primary hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  </div>
);

export default Login;
