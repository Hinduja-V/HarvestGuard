import { Link } from 'react-router-dom';
import { 
  Camera, 
  ArrowRight, 
  ShieldCheck, 
  TrendingUp, 
  Store, 
  AlertTriangle, 
  Layers, 
  Leaf, 
  CheckCircle,
  Clock,
  Sparkles
} from 'lucide-react';

import heroMarketImg from '../assets/images/vendor_market_hero_1791472966079.jpg';
import freshTomatoImg from '../assets/images/fresh_tomato_sample_1791472977518.jpg';
import agingTomatoImg from '../assets/images/aging_tomato_sample_1791472987522.jpg';
import spoiledTomatoImg from '../assets/images/spoiled_tomato_sample_1791472997955.jpg';

export default function HomePage() {
  return (
    <div className="space-y-24 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-8 sm:pt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Value Prop */}
            <div className="lg:col-span-7 space-y-6">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded-md px-3 py-1.5">
                <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                <span>SDG 12 Responsible Consumption · SDG 2 Zero Hunger</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 font-display tracking-tight leading-[1.12]">
                Spot Aging Produce. <br />
                <span className="text-emerald-700">Sell Smarter.</span> <br />
                Waste Less.
              </h1>

              <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl">
                An AI-powered freshness assistant that helps produce vendors identify aging stock and prioritize what to sell first before it turns into avoidable inventory loss.
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <Link
                  to="/scanner"
                  className="inline-flex items-center gap-2.5 px-6 py-3.5 text-base font-semibold text-white bg-emerald-700 rounded-xl hover:bg-emerald-800 transition-all shadow-md hover:shadow-lg active:scale-[0.98]"
                >
                  <Camera className="w-5 h-5" />
                  <span>Scan Produce</span>
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Link>

                <Link
                  to="/how-it-works"
                  className="inline-flex items-center gap-2 px-6 py-3.5 text-base font-semibold text-slate-700 bg-white border border-slate-300 rounded-xl hover:bg-slate-50 transition-colors shadow-sm"
                >
                  <span>How It Works</span>
                </Link>
              </div>

              {/* Quick Trust Meta */}
              <div className="pt-6 border-t border-slate-200 flex flex-wrap items-center gap-6 text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Tomato MVP Model Active</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Sell-First Decision Layer</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <CheckCircle className="w-4 h-4 text-emerald-600" />
                  <span>Built for Mandis & Local Stalls</span>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 bg-slate-900 group">
                <img
                  src={heroMarketImg}
                  alt="Vegetable vendor market stall with fresh produce crates"
                  className="w-full h-[400px] object-cover opacity-90 group-hover:scale-102 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent flex flex-col justify-end p-6">
                  <div className="bg-white/95 backdrop-blur-md rounded-xl p-4 shadow-lg border border-slate-200/60 text-slate-900 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded">
                        Action: SELL FIRST
                      </span>
                      <span className="text-xs font-mono text-slate-500">Tomato Batch #4</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-800">
                      Aging produce detected in morning stock
                    </p>
                    <p className="text-xs text-slate-500">
                      Model confidence: 87% · Move to front sales counter today to prevent loss.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visual Workflow Bar */}
      <section className="bg-emerald-50/70 border-y border-emerald-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8">
            <h2 className="text-xs font-semibold text-emerald-800 tracking-wider uppercase mb-1">
              Linear Core Workflow
            </h2>
            <p className="text-lg font-bold text-slate-900 font-display">
              From Photo to Inventory Action in Seconds
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block mb-3">
                01. INPUT
              </span>
              <h3 className="font-semibold text-slate-900 text-base mb-1">Produce Photo</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Vendor uploads or snaps a quick photo of tomato stock with smartphone or webcam.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block mb-3">
                02. VISION
              </span>
              <h3 className="font-semibold text-slate-900 text-base mb-1">AI Classification</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                FastAPI & Pillow preprocess image into transfer learning CNN for visual feature inference.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm relative">
              <span className="text-xs font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded inline-block mb-3">
                03. RESULT
              </span>
              <h3 className="font-semibold text-slate-900 text-base mb-1">Freshness Result</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Outputs clear visual status: Fresh, Aging, or Spoiled with transparent model confidence.
              </p>
            </div>

            <div className="bg-white p-5 rounded-xl border border-emerald-300 shadow-sm bg-gradient-to-br from-emerald-50/50 to-white">
              <span className="text-xs font-mono font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded inline-block mb-3">
                04. ACTION
              </span>
              <h3 className="font-semibold text-slate-900 text-base mb-1">Sell-First Decision</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Converts classification into actionable vendor rule: Sell First, Keep Normal, or Remove.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
            The Industry Challenge
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-display tracking-tight mt-1 mb-4">
            The Problem
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Perishable produce loss accounts for significant financial damage for small vendors and generates preventable food waste across agricultural supply chains.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-800 flex items-center justify-center mb-5">
              <Clock className="w-6 h-6 text-slate-700" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display mb-2">
              Manual Inspection
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Small vendors rely solely on hurried visual and tactile inspection during busy morning stall setups. Early micro-wrinkles and softening are easily overlooked in large crates.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center mb-5">
              <Layers className="w-6 h-6 text-amber-700" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display mb-2">
              Mixed Stock
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              New morning shipments frequently get commingled with yesterday’s unsold inventory. Without clear segregation, older items stay hidden at the bottom of display bins.
            </p>
          </div>

          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center mb-5">
              <AlertTriangle className="w-6 h-6 text-rose-700" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 font-display mb-2">
              Avoidable Waste
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              If aging produce is not prioritized for immediate sale, it degrades into unsellable rot within 24 to 48 hours, forcing vendors to discard edible food and absorb losses.
            </p>
          </div>
        </div>

        {/* Highlight Banner */}
        <div className="mt-8 bg-slate-900 text-white rounded-2xl p-7 sm:p-9 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl">
            <span className="text-xs font-semibold text-emerald-400 tracking-wide uppercase">
              The HarvestGuard Differentiation
            </span>
            <p className="text-xl sm:text-2xl font-bold font-display text-white">
              HarvestGuard AI = Visual Freshness Assessment + Sell-First Decision Support
            </p>
            <p className="text-sm text-slate-300">
              “Don’t just identify aging produce. Help vendors decide what to sell first.”
            </p>
          </div>
          <Link
            to="/scanner"
            className="px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 font-semibold text-sm text-white transition-colors shrink-0 whitespace-nowrap"
          >
            Try Scanner Now
          </Link>
        </div>
      </section>

      {/* Target Users Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-12">
          <span className="text-xs font-semibold text-slate-500 tracking-wider uppercase">
            User Focus
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-display tracking-tight mt-1 mb-4">
            Who Is HarvestGuard For?
          </h2>
          <p className="text-slate-600 text-base leading-relaxed">
            Engineered specifically for everyday produce sellers who need fast, zero-friction guidance without heavy enterprise software or specialized hardware.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center space-y-2 hover:border-emerald-300 transition-colors">
            <span className="text-3xl block">🍅</span>
            <h4 className="font-bold text-slate-900 text-sm font-display">Local Produce Vendors</h4>
            <p className="text-xs text-slate-500">Daily street cart and market sellers.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center space-y-2 hover:border-emerald-300 transition-colors">
            <span className="text-3xl block">🥬</span>
            <h4 className="font-bold text-slate-900 text-sm font-display">Vegetable Shops</h4>
            <p className="text-xs text-slate-500">Neighborhood greengrocers and fresh marts.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center space-y-2 hover:border-emerald-300 transition-colors">
            <span className="text-3xl block">🏪</span>
            <h4 className="font-bold text-slate-900 text-sm font-display">Small Retail Stores</h4>
            <p className="text-xs text-slate-500">Corner grocery retailers with produce stands.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center space-y-2 hover:border-emerald-300 transition-colors">
            <span className="text-3xl block">🧺</span>
            <h4 className="font-bold text-slate-900 text-sm font-display">Mandi Traders</h4>
            <p className="text-xs text-slate-500">Wholesale market dispatchers & lot sorters.</p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200 text-center space-y-2 hover:border-emerald-300 transition-colors">
            <span className="text-3xl block">🍽️</span>
            <h4 className="font-bold text-slate-900 text-sm font-display">Small Canteens</h4>
            <p className="text-xs text-slate-500">Institutional kitchens planning daily menus.</p>
          </div>
        </div>

        <div className="mt-6 bg-slate-50 border border-slate-200 rounded-xl p-5 flex items-start gap-4">
          <Store className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="text-sm">
            <span className="font-bold text-slate-900">Early Adopters: </span>
            <span className="text-slate-600">
              “Local vendors and small produce retailers who want a simple digital tool for inventory prioritization.”
            </span>
          </div>
        </div>
      </section>

      {/* Current MVP Model Card Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-slate-800">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-5 space-y-4">
              <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/80 px-2.5 py-1 rounded">
                CURRENT MVP SCOPE
              </span>
              <h2 className="text-3xl font-extrabold font-display">
                Tomato Freshness Classifier
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                The current release model is purposefully trained for <strong className="text-white">Tomato</strong> only. Tomatoes represent one of the highest post-harvest loss crops among small street vendors.
              </p>
              <div className="space-y-2 text-xs text-slate-400 pt-2">
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>3 Distinct Classes: Fresh, Aging, Spoiled</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>MobileNetV2 CNN Architecture (Transfer Learning)</span>
                </p>
                <p className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <span>Pillow Preprocessing & REST API Integration</span>
                </p>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* Fresh Card */}
              <div className="bg-slate-800/80 rounded-xl overflow-hidden border border-slate-700/80 flex flex-col">
                <img
                  src={freshTomatoImg}
                  alt="Fresh Tomato Condition"
                  className="w-full h-32 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-emerald-400">🟢 FRESH</span>
                    <span className="text-[10px] text-slate-400">Normal</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Glossy skin, intact calyx. Keep in standard stock.
                  </p>
                </div>
              </div>

              {/* Aging Card */}
              <div className="bg-slate-800/80 rounded-xl overflow-hidden border border-amber-600/50 flex flex-col">
                <img
                  src={agingTomatoImg}
                  alt="Aging Tomato Condition"
                  className="w-full h-32 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-amber-400">🟠 AGING</span>
                    <span className="text-[10px] text-amber-300 font-semibold">SELL FIRST</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Visible wrinkles & softening. Prioritize for immediate sale.
                  </p>
                </div>
              </div>

              {/* Spoiled Card */}
              <div className="bg-slate-800/80 rounded-xl overflow-hidden border border-rose-600/50 flex flex-col">
                <img
                  src={spoiledTomatoImg}
                  alt="Spoiled Tomato Condition"
                  className="w-full h-32 object-cover"
                  referrerPolicy="no-referrer"
                />
                <div className="p-3.5 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-rose-400">🔴 SPOILED</span>
                    <span className="text-[10px] text-rose-300">REMOVE</span>
                  </div>
                  <p className="text-[11px] text-slate-300">
                    Severe lesions or rot. Separate from healthy crates.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-5">
            <span className="text-xs font-semibold text-emerald-700 tracking-wider uppercase">
              Global Goals Alignment
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-display tracking-tight">
              Built for Sustainable Food Practices
            </h2>
            <div className="space-y-4 text-slate-600 text-sm leading-relaxed">
              <div className="p-4 bg-emerald-50/80 rounded-xl border border-emerald-200">
                <h3 className="font-bold text-emerald-950 text-base mb-1">
                  SDG 12 — Responsible Consumption and Production
                </h3>
                <p>
                  By helping vendors identify aging produce and prioritize it for sale, HarvestGuard aims to support better inventory decisions and reduce avoidable produce waste.
                </p>
              </div>

              <div className="p-4 bg-amber-50/80 rounded-xl border border-amber-200">
                <h3 className="font-bold text-amber-950 text-base mb-1">
                  SDG 2 — Zero Hunger
                </h3>
                <p>
                  Reducing food loss supports more efficient use of available food resources and preserves edible nutrition in local community food supplies.
                </p>
              </div>
            </div>
          </div>

          {/* Impact Chain */}
          <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-sm font-bold text-slate-900 tracking-wide uppercase">
              Impact Theory of Change
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[11px]">1</span>
                <span>Better Visual Identification (Computer Vision)</span>
              </div>
              <div className="text-center text-slate-400 text-xs">↓</div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[11px]">2</span>
                <span>Better Inventory Decisions (Sell-First Priority)</span>
              </div>
              <div className="text-center text-slate-400 text-xs">↓</div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-slate-50 border border-slate-200/80 text-xs text-slate-700">
                <span className="w-6 h-6 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-[11px]">3</span>
                <span>Less Avoidable Waste (Sold Before Spoilage)</span>
              </div>
              <div className="text-center text-slate-400 text-xs">↓</div>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-emerald-50 border border-emerald-300 text-xs font-semibold text-emerald-900">
                <span className="w-6 h-6 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px]">4</span>
                <span>More Responsible Consumption (SDG 12 & SDG 2)</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Responsible AI Notice */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 text-xs text-slate-600 flex items-start gap-4">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-slate-900">Responsible AI Notice</h4>
            <p>
              HarvestGuard AI provides visual decision support based on image classification. Results are not a substitute for professional food-quality inspection.
            </p>
            <p className="text-slate-500">
              Model confidence indicates prediction confidence, not an exact measurement of freshness or remaining shelf life.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
