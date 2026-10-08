export default function LeanCanvasPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-md inline-block">
          Business & Product Architecture
        </span>
        <h1 className="text-3xl font-extrabold text-slate-950 font-display tracking-tight">
          HarvestGuard AI — Lean Canvas
        </h1>
        <p className="text-sm text-slate-600">
          Strategic product framework mapping market viability, distribution channels, and operational dynamics.
        </p>
      </div>

      {/* High-Level Concept Banner */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-mono uppercase text-emerald-400">High-Level Concept</span>
          <p className="text-xl font-bold font-display mt-0.5">
            “A digital freshness inspector and sell-first assistant for produce vendors.”
          </p>
        </div>
        <div className="text-xs text-slate-400 bg-slate-800 px-3.5 py-2 rounded-xl border border-slate-700">
          Target Domain: Small Produce Retail & Mandis
        </div>
      </div>

      {/* 9-Box Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 text-xs">
        {/* Box 1: Problem */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider text-emerald-900 border-b border-slate-100 pb-2 mb-2">
              1. Problem
            </h3>
            <ul className="space-y-2 text-slate-600 list-disc list-inside">
              <li>Aging produce remains mixed with fresh morning stock.</li>
              <li>Manual eye-inspection is inconsistent during rush hours.</li>
              <li>Unsold aging produce degrades into total inventory loss.</li>
            </ul>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] text-slate-500">
            <strong>Existing Alternatives:</strong> Guesswork, price slashes at day-end, discarding rotten crates.
          </div>
        </div>

        {/* Box 2: Solution */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider text-emerald-900 border-b border-slate-100 pb-2 mb-2">
              2. Solution
            </h3>
            <ul className="space-y-2 text-slate-600 list-disc list-inside">
              <li>Zero-friction photo capture (smartphone / camera).</li>
              <li>CNN visual freshness classification (Fresh, Aging, Spoiled).</li>
              <li>Transparent model confidence scoring.</li>
              <li>Actionable Sell-First prioritization layer.</li>
            </ul>
          </div>
          <div className="bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 text-[11px] text-emerald-900">
            <strong>MVP Scope:</strong> Tomato freshness model with 3 output states.
          </div>
        </div>

        {/* Box 3: Unique Value Proposition */}
        <div className="bg-white p-5 rounded-2xl border-2 border-emerald-500/50 shadow-sm space-y-3 flex flex-col justify-between bg-gradient-to-b from-emerald-50/20 to-white">
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider text-emerald-900 border-b border-slate-100 pb-2 mb-2">
              3. Unique Value Prop
            </h3>
            <p className="font-bold text-slate-900 text-sm leading-snug">
              “AI-powered visual freshness assessment with an actionable sell-first recommendation.”
            </p>
            <p className="text-slate-600 text-xs mt-2">
              Does not stop at classification—translates computer vision directly into merchant inventory decisions.
            </p>
          </div>
          <div className="bg-white p-2.5 rounded-lg border border-slate-200 text-[11px] text-slate-600">
            <strong>Clarity:</strong> Never says "87% Fresh"; provides verified confidence.
          </div>
        </div>

        {/* Box 4: Unfair Advantage */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider text-emerald-900 border-b border-slate-100 pb-2 mb-2">
              4. Unfair Advantage
            </h3>
            <p className="text-slate-700 leading-relaxed">
              “Combining visual freshness classification with an actionable inventory-priority layer designed specifically for small produce vendors.”
            </p>
            <ul className="space-y-1.5 text-slate-600 mt-2 list-disc list-inside">
              <li>Low computational footprint (runs on any browser).</li>
              <li>Zero technical training needed for vendors.</li>
            </ul>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-100 text-[11px] text-slate-500">
            Fast localized edge transfer models.
          </div>
        </div>

        {/* Box 5: Customer Segments */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider text-emerald-900 border-b border-slate-100 pb-2 mb-2">
              5. Customer Segments
            </h3>
            <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
              <li>Small fruit & vegetable vendors</li>
              <li>Neighborhood vegetable shops</li>
              <li>Mandi traders & lot dispatchers</li>
              <li>Small community canteens</li>
            </ul>
          </div>
          <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 text-[11px] text-amber-950">
            <strong>Early Adopters:</strong> Local vendors and small produce retailers seeking simple digital prioritization.
          </div>
        </div>
      </div>

      {/* Row 2: Operational Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
        {/* Key Metrics */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <h3 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider text-emerald-900 border-b border-slate-100 pb-2">
            6. Key Metrics
          </h3>
          <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
            <li>Classification model confidence & accuracy</li>
            <li>Daily scan volume per stall</li>
            <li>Ratio of aging items successfully identified</li>
            <li>Sell-first conversion rate</li>
            <li>Merchant usability feedback</li>
          </ul>
        </div>

        {/* Channels */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <h3 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider text-emerald-900 border-b border-slate-100 pb-2">
            7. Channels
          </h3>
          <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
            <li>Direct on-ground vendor stall demos</li>
            <li>Local merchant associations & Mandi boards</li>
            <li>Vendor peer WhatsApp sharing</li>
            <li>Agricultural college & community outreach</li>
          </ul>
        </div>

        {/* Cost Structure */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <h3 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider text-emerald-900 border-b border-slate-100 pb-2">
            8. Cost Structure
          </h3>
          <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
            <li>Model inference & cloud hosting (Render / Railway)</li>
            <li>Static web hosting (Vercel)</li>
            <li>Model retraining & validation datasets</li>
            <li>Ongoing software maintenance</li>
          </ul>
        </div>

        {/* Revenue Streams */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <h3 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider text-emerald-900 border-b border-slate-100 pb-2">
            9. Revenue Streams
          </h3>
          <ul className="space-y-1.5 text-slate-600 list-disc list-inside">
            <li>Freemium tier (free basic daily scans)</li>
            <li>Affordable vendor monthly plan for batch lots</li>
            <li>Institutional canteen software licenses</li>
            <li>NGO & CSR agricultural sustainability grants</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
