import { useState } from "react";
import { MessageSquare, Send, Star } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const FeedbackSection = () => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
  };

  return (
    <section className="py-20 bg-muted/40">
      <div className="container mx-auto px-4 max-w-2xl">
        <ScrollReveal>
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              <MessageSquare className="w-4 h-4" />
              We Value Your Feedback
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-3">
              Share Your Experience
            </h2>
            <p className="text-muted-foreground">
              Help us improve VoyageAI by sharing your thoughts and suggestions.
            </p>
          </div>
        </ScrollReveal>

        <ScrollReveal delay={0.15}>
          {submitted ? (
            <div className="glass-card rounded-2xl p-10 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Send className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-display text-xl font-semibold text-foreground mb-2">Thank You!</h3>
              <p className="text-muted-foreground">Your feedback has been submitted successfully.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="glass-card rounded-2xl p-8 space-y-6">
              {/* Rating */}
              <div>
                <label className="block text-sm font-medium text-foreground mb-2">
                  How would you rate your experience?
                </label>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHover(star)}
                      onMouseLeave={() => setHover(0)}
                      className="p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={`w-7 h-7 transition-colors ${
                          star <= (hover || rating)
                            ? "fill-primary text-primary"
                            : "text-muted-foreground/40"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Name */}
              <div>
                <label htmlFor="fb-name" className="block text-sm font-medium text-foreground mb-1.5">
                  Name
                </label>
                <input
                  id="fb-name"
                  type="text"
                  required
                  maxLength={100}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                />
              </div>

              {/* Email */}
              <div>
                <label htmlFor="fb-email" className="block text-sm font-medium text-foreground mb-1.5">
                  Email
                </label>
                <input
                  id="fb-email"
                  type="email"
                  required
                  maxLength={255}
                  placeholder="you@example.com"
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition"
                />
              </div>

              {/* Message */}
              <div>
                <label htmlFor="fb-message" className="block text-sm font-medium text-foreground mb-1.5">
                  Your Feedback
                </label>
                <textarea
                  id="fb-message"
                  required
                  maxLength={1000}
                  rows={4}
                  placeholder="Tell us what you think..."
                  className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40 transition resize-none"
                />
              </div>

              <button
                type="submit"
                className="btn-gradient w-full flex items-center justify-center gap-2 !py-3 text-sm font-medium"
              >
                <Send className="w-4 h-4" />
                Submit Feedback
              </button>
            </form>
          )}
        </ScrollReveal>
      </div>
    </section>
  );
};

export default FeedbackSection;
