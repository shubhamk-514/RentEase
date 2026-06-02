import React from "react";
import {
  Award,
  Compass,
  ShieldCheck,
  HeartHandshake,
  CheckCircle,
} from "lucide-react";
const About = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
      {/* Hero section info */}
      <div className="text-center space-y-4 max-w-3xl mx-auto">
        <h1 className="text-4xl sm:text-5xl font-black font-sans leading-tight">
          Eliminating Middlemen from{" "}
          <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            Local Rentals
          </span>
        </h1>
        <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
          RentEase was founded to solve a primary pain point: college students
          and local users paying high brokerage and deposits for basic rooms,
          only to get poor listing quality. We connect you directly with hosts.
        </p>
      </div>
      {/* Grid boxes detail */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-sans">
            Our Mission & Concept
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Local room hunting often involves real estate dealers charging
            half-a-month to a full-month rent as 'brokerage' fees. For college
            students or young interns moving to new cities, this represents a
            significant financial block.
          </p>
          <p className="text-slate-400 text-sm leading-relaxed">
            By building a peer-to-peer room registry focused specifically on PG
            rooms, flatshares, and student-friendly rules, RentEase provides a
            lightweight dashboard where properties can be posted in 3 minutes
            and contacted in 1 click.
          </p>
          <ul className="space-y-3 pt-2">
            {[
              "Direct connection with landlords via mobile",
              "Custom student PG & flatshare categories",
              "Completely verified host listings",
              "Absolutely zero agency fee or commissions",
            ].map((item, idx) => (
              <li
                key={idx}
                className="flex items-center gap-2 text-xs text-slate-300"
              >
                <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="w-full aspect-square md:aspect-video rounded-3xl overflow-hidden border border-slate-800 shadow-2xl relative">
          <img
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80"
            alt="Students collaborating"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
      {/* Pillars details */}
      <div className="border-t border-slate-800/80 pt-16 space-y-10">
        <h3 className="text-2xl font-bold font-sans text-center">
          Core Pillars
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="glass p-6 rounded-2xl border border-slate-800/60 text-center space-y-3">
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center rounded-xl mx-auto">
              <Compass className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-200">Ease of Exploration</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Find rooms based on price limits, exact student category layouts,
              and direct coordinates using immediate area parameters.
            </p>
          </div>
          <div className="glass p-6 rounded-2xl border border-slate-800/60 text-center space-y-3">
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center rounded-xl mx-auto">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-200">Integrity & Safety</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              RentEase audits listings to prevent scam posts. Landlords complete
              verified registration setups.
            </p>
          </div>
          <div className="glass p-6 rounded-2xl border border-slate-800/60 text-center space-y-3">
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 flex items-center justify-center rounded-xl mx-auto">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-slate-200">Community First</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Supporting the local community by matching student demands with
              local house owners who have spare rental units.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default About;
