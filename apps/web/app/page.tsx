"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function HomePage() {
  const features = [
    {
      icon: "⚡",
      title: "Real-Time Availability",
      description: "See who's active and ready to work right now. No callbacks, no waiting.",
    },
    {
      icon: "📍",
      title: "Geospatial Matching",
      description: "Find local professionals nearest to your exact coordinates in seconds.",
    },
    {
      icon: "💬",
      title: "Instant In-App Chat",
      description: "Communicate directly, share images, and align details before booking.",
    },
    {
      icon: "⭐",
      title: "Verified Reviews",
      description: "Book with confidence reading honest customer feedback and star ratings.",
    },
    {
      icon: "🔔",
      title: "Live Booking Alerts",
      description: "Get real-time push alerts as workers accept, update, and complete tasks.",
    },
    {
      icon: "🛡️",
      title: "Vetted Professionals",
      description: "Every worker is background checked and verified for maximum safety.",
    },
  ];

  return (
    <main className="min-h-screen bg-bg-dark overflow-hidden relative">
      {/* Premium Background Ambient Glows */}
      <div className="absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,rgba(108,99,255,0.08)_0%,transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-[radial-gradient(circle_at_center,rgba(0,212,170,0.06)_0%,transparent_60%)] pointer-events-none" />

      {/* Header / Navbar Placeholder (Sleek Glassmorphic) */}
      <header className="sticky top-0 z-50 border-b border-white/5 bg-bg-dark/40 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-extrabold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent tracking-tight">
              SERVORA
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="/login" className="text-sm font-medium text-white/70 hover:text-white transition-colors">
              Sign In
            </a>
            <Button size="sm" variant="primary" onClick={() => window.location.href = "/register"}>
              Register
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-24 px-6 max-w-7xl mx-auto text-center flex flex-col items-center">
        {/* Glow Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-xs font-semibold tracking-wider uppercase text-primary mb-8 shadow-[0_0_15px_rgba(108,99,255,0.1)] animate-pulse">
          🚀 Now Active in Your Metro Area
        </div>

        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-tight max-w-4xl mb-6">
          Local Services,
          <br />
          <span className="bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            Instantly Hooked.
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-white/50 max-w-2xl mb-10 leading-relaxed">
          Find verified service professionals near you. Book instantly, chat in real-time, and track your booking status live.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto justify-center">
          <Button size="lg" variant="primary" onClick={() => window.location.href = "/register"}>
            Get Started
          </Button>
          <Button size="lg" variant="secondary" onClick={() => window.location.href = "/services"}>
            Browse Services
          </Button>
        </div>
      </section>

      {/* Features Grid Section */}
      <section className="max-w-7xl mx-auto px-6 py-20 relative">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Why Choose Servora?
          </h2>
          <p className="text-white/50 mt-4 max-w-md mx-auto">
            A modern, robust platform engineered for speed, safety, and reliability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feat, index) => (
            <Card key={index} className="flex flex-col gap-4 border border-white/5">
              <CardContent className="p-0">
                <div className="text-4xl mb-4 p-3 bg-white/5 w-fit rounded-2xl border border-white/5 shadow-inner">
                  {feat.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{feat.title}</h3>
                <p className="text-sm text-white/50 leading-relaxed">{feat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Premium Footer */}
      <footer className="border-t border-white/5 bg-bg-dark/80 py-12 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="text-xl font-extrabold bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text text-transparent">
            SERVORA
          </span>
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Servora Inc. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-white/50">
            <a href="#" className="hover:text-white transition-colors">Privacy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white transition-colors">Support</a>
          </div>
        </div>
      </footer>
    </main>
  );
}
