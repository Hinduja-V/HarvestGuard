import { Link } from 'react-router-dom';
import { 
  Leaf, 
  HeartHandshake, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Layers, 
  Sparkles,
  Milestone
} from 'lucide-react';

export default function SdgImpactPage() {
  const roadmapPhases = [
    {
      phase: 'Phase 1',
      status: 'Current MVP',
      title: 'Tomato Freshness Classification',
      desc: '3-class computer vision model (Fresh, Aging, Spoiled) paired with an automated Sell-First inventory decision layer.',
      isCurrent: true
    },
    {
      phase: 'Phase 2',
      status: 'Planned',
      title: 'Multi-Produce Expansion',
      desc: 'Extend transfer learning architectures to Banana, Apple, Potato, Onion, and common local leafy greens.',
      isCurrent: false
    },
    {
      phase: 'Phase 3',
      status: 'Research',
      title: 'Diverse Regional Datasets',
      desc: 'Capture lighting, cultivar variations, and climate conditions from diverse regional mandi environments.',
      isCurrent: false
    },
    {
      phase: 'Phase 4',
      status: 'Future',
      title: 'Controlled Shelf-Life Modeling',
      desc: 'Introduce verified ambient decay curves based on rigorously tracked historical temperature and humidity storage data.',
      isCurrent: false
    },
    {
      phase: 'Phase 5',
      status: 'Hardware',
      title: 'Environmental Micro-Sensors',
      desc: 'Optional low-cost Bluetooth stall sensors measuring crate temperature and relative humidity.',
      isCurrent: false
    },
    {
      phase: 'Phase 6',
      status: 'Enterprise',
      title: 'Vendor Analytics & Collective Insights',
      desc: 'Collective loss patterns, seasonal demand alerts, and supply replenishment recommendations.',
      isCurrent: false
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-md">
          <Leaf className="w-3.5 h-3.5 text-emerald-600" />
          <span>United Nations Sustainable Development Goals</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-display tracking-tight">
          Sustainable Impact
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          How accessible AI computer vision supports food loss reduction at the retail frontline.
        </p>
      </div>

      {/* Primary SDG Cards (Section 24 Compliance) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* SDG 12 */}
        <div className="bg-white rounded-2xl border-2 border-emerald-500/40 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-lg font-mono">
              12
            </span>
            <div>
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider block">
                Primary SDG Alignment
              </span>
              <h2 className="text-xl font-bold text-slate-950 font-display">
                Responsible Consumption & Production
              </h2>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            “By helping vendors identify aging produce and prioritize it for sale, HarvestGuard aims to support better inventory decisions and reduce avoidable produce waste.”
          </p>

          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-950 space-y-2">
            <h4 className="font-bold">Core Mechanism:</h4>
            <p>
              Produce waste at the retail tier is largely driven by information asymmetry—fresh stock masking older stock. By nudging sellers to vend aging lots first, edible food reaches consumers before spoilage sets in.
            </p>
          </div>
        </div>

        {/* SDG 2 */}
        <div className="bg-white rounded-2xl border-2 border-amber-500/40 p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-xl bg-amber-600 text-white flex items-center justify-center font-bold text-lg font-mono">
              02
            </span>
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                Supporting SDG Alignment
              </span>
              <h2 className="text-xl font-bold text-slate-950 font-display">
                Zero Hunger
              </h2>
            </div>
          </div>

          <p className="text-sm text-slate-700 leading-relaxed">
            “Reducing food loss supports more efficient use of available food resources.”
          </p>

          <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-xs text-amber-950 space-y-2">
            <h4 className="font-bold">Community Nutrition:</h4>
            <p>
              Every kilogram of fresh produce saved from rotting in an urban stall directly protects affordable micronutrient supply for local families and minimizes resource wastage spent on farm transport.
            </p>
          </div>
        </div>
      </div>

      {/* Impact Chain (Section 24 Rule) */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-1">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
            THEORY OF CHANGE
          </span>
          <h2 className="text-2xl font-bold font-display text-white">
            From Vision To Impact
          </h2>
        </div>

        <div className="max-w-3xl mx-auto grid grid-cols-1 sm:grid-cols-4 gap-4 text-center text-xs">
          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-1">
            <span className="text-emerald-400 font-bold block">Step 1</span>
            <strong className="text-white block">Better Identification</strong>
            <p className="text-slate-400 text-[11px]">Computer vision catches early subtle skin dehydration</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-1">
            <span className="text-emerald-400 font-bold block">Step 2</span>
            <strong className="text-white block">Better Inventory Decisions</strong>
            <p className="text-slate-400 text-[11px]">Sell-First priority flags items for immediate front placement</p>
          </div>

          <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 space-y-1">
            <span className="text-emerald-400 font-bold block">Step 3</span>
            <strong className="text-white block">Less Avoidable Waste</strong>
            <p className="text-slate-400 text-[11px]">Items are purchased while still fresh and nutritious</p>
          </div>

          <div className="bg-emerald-950 p-4 rounded-xl border border-emerald-600 space-y-1">
            <span className="text-emerald-300 font-bold block">Step 4</span>
            <strong className="text-white block">Responsible Consumption</strong>
            <p className="text-emerald-200 text-[11px]">Measurable reduction in municipal organic landfill waste</p>
          </div>
        </div>

        <p className="text-center text-[11px] text-slate-400 italic">
          *Note: In accordance with responsible reporting, claims are structural rather than unmeasured vanity figures.
        </p>
      </div>

      {/* Future Roadmap Section (Section 23 Compliance) */}
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
            System Evolution
          </span>
          <h2 className="text-2xl font-bold font-display text-slate-950">
            Future Roadmap
          </h2>
          <p className="text-sm text-slate-600">
            Strategic roadmap scaling from the current tomato MVP to multi-crop agricultural inventory intelligence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {roadmapPhases.map((rp) => (
            <div
              key={rp.phase}
              className={`rounded-2xl p-6 border transition-all ${
                rp.isCurrent
                  ? 'bg-emerald-50/70 border-emerald-400 ring-1 ring-emerald-400/40 shadow-sm'
                  : 'bg-white border-slate-200'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="font-mono text-xs font-bold text-slate-700">
                  {rp.phase}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                  rp.isCurrent 
                    ? 'bg-emerald-700 text-white' 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {rp.status}
                </span>
              </div>
              <h3 className="font-bold text-slate-900 text-base font-display mb-1.5">
                {rp.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {rp.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
