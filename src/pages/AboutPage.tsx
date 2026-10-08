import { Link } from 'react-router-dom';
import { 
  Leaf, 
  Target, 
  Cpu, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  GraduationCap
} from 'lucide-react';

export default function AboutPage() {
  const techStack = [
    { name: 'React + Vite', role: 'Frontend framework & lightning build tooling' },
    { name: 'FastAPI', role: 'High-throughput asynchronous Python REST API' },
    { name: 'Python', role: 'Backend runtime & machine learning ecosystem' },
    { name: 'TensorFlow / Keras', role: 'Neural network architecture & inference' },
    { name: 'Computer Vision', role: 'Feature analysis on produce skin and decay spots' },
    { name: 'Transfer Learning', role: 'MobileNetV2 feature extractor fine-tuned on produce' },
    { name: 'Pillow (PIL)', role: 'Image verification, 224x224 resizing & RGB normalization' },
    { name: 'REST API', role: 'Standardized POST /api/predict interface' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Header */}
      <div className="space-y-3">
        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-3 py-1 rounded-md inline-block">
          AI/ML Internship Prototype
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-display tracking-tight">
          About HarvestGuard AI
        </h1>
        <p className="text-base text-slate-700 leading-relaxed">
          “HarvestGuard AI is a sustainability-focused AI/ML prototype designed to help small produce vendors make better inventory decisions by identifying visually aging produce and prioritizing it for sale.”
        </p>
      </div>

      {/* Mission & Purpose */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <Target className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            The Mission
          </h2>
          <p className="text-sm font-semibold text-emerald-950 leading-relaxed">
            “Reduce avoidable food waste through accessible AI-powered decision support.”
          </p>
          <p className="text-xs text-slate-600 leading-relaxed">
            Local vendors bear the heaviest financial burden of crop spoilage yet lack enterprise-grade monitoring tools. HarvestGuard places intelligent vision directly in their hands via simple mobile browser access.
          </p>
        </div>

        <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
            <GraduationCap className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 font-display">
            Internship Project Context
          </h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            Developed as an applied AI/ML internship prototype connecting modern deep learning computer vision directly to United Nations Sustainable Development Goals:
          </p>
          <div className="pt-2 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-emerald-900 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              <span>SDG 12: Responsible Consumption and Production</span>
            </div>
            <div className="flex items-center gap-2 text-amber-900 font-semibold">
              <span className="w-2 h-2 rounded-full bg-amber-600" />
              <span>SDG 2: Zero Hunger</span>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Stack Grid */}
      <div className="bg-white p-7 rounded-2xl border border-slate-200 shadow-sm space-y-5">
        <div>
          <h2 className="text-lg font-bold text-slate-900 font-display">
            Full-Stack Technology Architecture
          </h2>
          <p className="text-xs text-slate-500">
            Built using modern, lightweight tools designed for fast execution and easy deployment.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {techStack.map((tech) => (
            <div
              key={tech.name}
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-100 flex items-start justify-between gap-3 text-xs"
            >
              <div>
                <strong className="text-slate-900 block font-mono">{tech.name}</strong>
                <span className="text-slate-500 text-[11px]">{tech.role}</span>
              </div>
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            </div>
          ))}
        </div>
      </div>

      {/* Responsible AI Stance */}
      <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200 space-y-3 text-xs text-slate-600">
        <div className="flex items-center gap-2 text-slate-900 font-bold text-sm">
          <ShieldCheck className="w-5 h-5 text-emerald-700" />
          <span>Responsible AI Commitment</span>
        </div>
        <p>
          HarvestGuard AI is engineered with conservative prediction reporting. We deliberately reject misleading marketing phrases such as "87% Fresh" in favor of calibrated model confidence statements.
        </p>
        <p>
          When an image does not provide sufficient visual clarity or falls below 60% confidence, our system prompts vendors for manual inspection rather than generating false certainties.
        </p>
      </div>

      {/* CTA */}
      <div className="text-center pt-2">
        <Link
          to="/scanner"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-700 text-white font-bold text-sm rounded-xl hover:bg-emerald-800 transition-colors shadow-sm"
        >
          <span>Try HarvestGuard Scanner</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
