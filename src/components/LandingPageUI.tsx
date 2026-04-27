"use client";

import Link from "next/link";
import { BarChart3, Zap, Shield, PieChart, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import RevealOnScroll from "./RevealOnScroll";

export default function LandingPageUI() {
  return (
    <div className="flex min-h-screen flex-col bg-offwhite text-text-primary">
      {/* Header */}
      <header className="fixed top-0 z-50 w-full border-b border-border/50 bg-offwhite/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-coral">
              <BarChart3 size={20} color="white" strokeWidth={1.5} />
            </div>
            <span className="font-jkt text-xl font-bold tracking-tight">AdVize</span>
          </div>
          <Link href="/login" className="btn-primary">
            Get Started
            <ArrowRight size={16} />
          </Link>
        </div>
      </header>

      <main className="flex-1 pt-16">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 pt-20 pb-16 sm:px-6 sm:pt-32 sm:pb-24 lg:px-8">
          <div className="mx-auto max-w-7xl relative z-10 text-center">
            <RevealOnScroll delay={0.1}>
              <div className="inline-flex items-center rounded-full bg-coral-light px-3 py-1 text-sm font-medium text-coral ring-1 ring-inset ring-coral/20">
                <Zap size={14} className="mr-1.5 fill-coral" />
                AI-Powered Performance
              </div>
              <h1 className="mt-8 font-jkt text-5xl font-extrabold tracking-tight sm:text-7xl">
                AdVize: AI Ads <br />
                <span className="text-coral">Optimization</span> Advisor
              </h1>
              <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-text-secondary">
                Analyze your ad campaign performance, get actionable AI recommendations, and boost your ROI with data-driven insights.
              </p>
              <div className="mt-10 flex items-center justify-center gap-x-6">
                <motion.div
                   animate={{ y: [0, -8, 0] }}
                   transition={{ 
                     repeat: Infinity, 
                     duration: 3, 
                     ease: "easeInOut" 
                   }}
                >
                  <Link href="/login" className="btn-primary h-14 px-10 text-base shadow-lg shadow-coral/25">
                    Start Analyzing Free
                  </Link>
                </motion.div>
                <Link href="#features" className="text-sm font-semibold leading-6 text-text-secondary hover:text-coral transition-colors">
                  Learn more <span aria-hidden="true">→</span>
                </Link>
              </div>
            </RevealOnScroll>
          </div>
          
          {/* Abstract background shapes */}
          <div className="absolute top-[-10%] left-1/2 z-0 h-125 w-125 -translate-x-1/2 rounded-full bg-coral/5 blur-3xl" />
          <div className="absolute top-[20%] left-[-10%] z-0 h-100 w-100 rounded-full bg-mint/5 blur-3xl opacity-50" />
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <RevealOnScroll>
              <div className="mx-auto max-w-2xl text-center">
                <h2 className="text-base font-semibold leading-7 text-coral">Everything you need</h2>
                <p className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
                  Scale your ad performance with ease.
                </p>
              </div>
            </RevealOnScroll>
            
            <div className="mx-auto mt-16 max-w-none sm:mt-20 lg:mx-0">
              <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {/* Card 1 */}
                <RevealOnScroll delay={0.2} className="flex h-full">
                  <div className="card h-full border border-border/50 transition-transform hover:-translate-y-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-light text-coral mb-6">
                      <PieChart size={24} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold">Real Metrics</h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                      CTR, CPC, CPA, and ROAS calculated automatically across all your platforms. No more manual spreadsheets.
                    </p>
                  </div>
                </RevealOnScroll>

                {/* Card 2 */}
                <RevealOnScroll delay={0.3} className="flex h-full">
                  <div className="card h-full border border-border/50 transition-transform hover:-translate-y-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-light text-coral mb-6">
                      <Zap size={24} strokeWidth={1.5} className="fill-coral/20" />
                    </div>
                    <h3 className="text-lg font-bold">AI Insights</h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                      Get data-driven recommendations for budget reallocation, targeting adjustments, and creative optimizations.
                    </p>
                  </div>
                </RevealOnScroll>

                {/* Card 3 */}
                <RevealOnScroll delay={0.4} className="flex h-full">
                  <div className="card h-full border border-border/50 transition-transform hover:-translate-y-1">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-coral-light text-coral mb-6">
                      <Shield size={24} strokeWidth={1.5} />
                    </div>
                    <h3 className="text-lg font-bold">History & Export</h3>
                    <p className="mt-3 text-sm leading-relaxed text-text-secondary">
                      Keep a complete history of all your analyses. Search, filter, and export professional PDF reports in one click.
                    </p>
                  </div>
                </RevealOnScroll>
              </div>
            </div>
          </div>
        </section>

        {/* Demo Section (Placeholder) */}
        <RevealOnScroll delay={0.5} yOffset={40}>
          <section className="bg-coral py-24 sm:py-32">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Ready to see the magic?
              </h2>
              <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-white/80">
                Join hundreds of advertisers who improved their performance by an average of 24% using AdVize.
              </p>
              <div className="mt-10 flex items-center justify-center">
                <Link href="/login" className="rounded-full bg-white px-10 py-4 text-base font-bold text-coral shadow-xl hover:bg-offwhite transition-all transform hover:scale-105">
                  Get Started Now
                </Link>
              </div>
            </div>
          </section>
        </RevealOnScroll>
      </main>

      {/* Footer */}
      <footer className="border-t border-border bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-between gap-6 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-coral">
              <BarChart3 size={16} color="white" strokeWidth={1.5} />
            </div>
            <span className="font-jkt text-lg font-bold uppercase tracking-wider text-text-primary">AdVize</span>
          </div>
          <p className="text-sm text-text-secondary">
            © {new Date().getFullYear()} AdVize. AI-Powered Ads Advisor. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
