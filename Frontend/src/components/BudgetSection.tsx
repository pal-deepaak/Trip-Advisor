import ScrollReveal from "./ScrollReveal";

const budget = [
  { label: "Accommodation", amount: 861, percent: 40, color: "from-green-500 to-emerald-500" },
  { label: "Food & Dining", amount: 430, percent: 20, color: "from-orange-500 to-yellow-500" },
  { label: "Activities", amount: 322, percent: 15, color: "from-teal-500 to-green-500" },
  { label: "Transport", amount: 215, percent: 10, color: "from-blue-500 to-cyan-500" },
  { label: "Shopping", amount: 215, percent: 10, color: "from-red-500 to-orange-500" },
  { label: "Miscellaneous", amount: 107, percent: 5, color: "from-gray-400 to-gray-500" },
];

const BudgetSection = () => (
  <section className="section-padding">
    <div className="container mx-auto max-w-2xl">
      <ScrollReveal className="text-center mb-12">
        <h2 className="font-display font-bold text-3xl sm:text-4xl text-foreground text-balance">
          Budget <span className="gradient-text">Planner</span>
        </h2>
        <p className="text-muted-foreground mt-3">Total estimated budget: <span className="font-display font-bold text-primary">$2,150</span></p>
      </ScrollReveal>

      <ScrollReveal>
        <div className="glass-card p-6 space-y-4">
          {budget.map((b) => (
            <div key={b.label}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm text-foreground/70">{b.label}</span>
                <span className="text-sm font-display font-semibold text-foreground">${b.amount}</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className={`h-full rounded-full bg-gradient-to-r ${b.color} transition-all duration-1000`} style={{ width: `${b.percent}%` }} />
              </div>
            </div>
          ))}
        </div>
      </ScrollReveal>
    </div>
  </section>
);

export default BudgetSection;
