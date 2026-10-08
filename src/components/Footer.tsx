import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-base">
                HG
              </span>
              <span className="text-xl font-bold text-white font-display">HarvestGuard AI</span>
            </div>
            <p className="text-slate-400 text-sm max-w-md leading-relaxed">
              Spot Aging Produce. Sell Smarter. Waste Less.
              <br />
              An AI-powered produce freshness assistant and sell-first inventory prioritization tool built for small produce vendors, Mandi traders, and local retailers.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400 pt-2">
              <span>AI/ML Sustainability MVP</span>
              <span aria-hidden="true">·</span>
              <span>SDG 12: Responsible Consumption</span>
              <span aria-hidden="true">·</span>
              <span>SDG 2: Zero Hunger</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 tracking-wider uppercase mb-4">
              Navigation
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-emerald-400 transition-colors">Home</Link>
              </li>
              <li>
                <Link to="/scanner" className="hover:text-emerald-400 transition-colors">AI Scanner</Link>
              </li>
              <li>
                <Link to="/inventory" className="hover:text-emerald-400 transition-colors">Sell-First Inventory</Link>
              </li>
              <li>
                <Link to="/dashboard" className="hover:text-emerald-400 transition-colors">Vendor Dashboard</Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-emerald-400 transition-colors">How It Works</Link>
              </li>
            </ul>
          </div>

          {/* Impact & About */}
          <div>
            <h4 className="text-xs font-semibold text-slate-200 tracking-wider uppercase mb-4">
              Impact & Insights
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/sdg-impact" className="hover:text-emerald-400 transition-colors">Sustainable Impact</Link>
              </li>
              <li>
                <Link to="/lean-canvas" className="hover:text-emerald-400 transition-colors">Lean Canvas</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-emerald-400 transition-colors">About HarvestGuard</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>HarvestGuard AI — AI/ML Internship Prototype for Sustainable Food Practices.</p>
          <p>Visual decision support system · Not a certified laboratory test</p>
        </div>
      </div>
    </footer>
  );
}
