import { MapPin, DollarSign, Calendar, Tag, Search } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";

const SearchPage = () => (
  <div className="pt-24 pb-16">
    <div className="container mx-auto px-4 max-w-4xl">
      <ScrollReveal className="text-center mb-10">
        <h1 className="font-display font-bold text-4xl sm:text-5xl text-foreground">
          Search <span className="gradient-text">Everything</span>
        </h1>
        <p className="text-muted-foreground mt-3">Find hotels, restaurants, activities — all in one place.</p>
      </ScrollReveal>

      <ScrollReveal delay={100}>
        <div className="glass-card p-6 sm:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
              <input placeholder="Where to?" className="input-glow !pl-10" />
            </div>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
              <input placeholder="Budget" className="input-glow !pl-10" />
            </div>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
              <input placeholder="Number of days" className="input-glow !pl-10" />
            </div>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-primary/60" />
              <input placeholder="Interests" className="input-glow !pl-10" />
            </div>
          </div>
          <button className="btn-gradient w-full flex items-center justify-center gap-2 text-base">
            <Search className="w-5 h-5" />
            Search with AI
          </button>
        </div>
      </ScrollReveal>

      <ScrollReveal delay={200} className="mt-12 text-center">
        <div className="glass-card p-12">
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Search className="w-8 h-8 text-primary/60" />
          </div>
          <p className="text-muted-foreground font-display">Enter your preferences and let AI find the perfect trip for you.</p>
        </div>
      </ScrollReveal>
    </div>
  </div>
);

export default SearchPage;
