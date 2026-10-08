import { Link } from 'react-router-dom';
import { 
  Camera, 
  Cpu, 
  Layers, 
  BarChart2, 
  CheckCircle, 
  ArrowRight,
  Code2,
  Server,
  Zap,
  ShieldCheck
} from 'lucide-react';

export default function HowItWorksPage() {
  const steps = [
    {
      num: '01',
      title: 'Capture',
      desc: 'The vendor uploads or captures a produce photo directly from a mobile camera or web browser.',
      icon: Camera,
      tag: 'CLIENT INPUT'
    },
    {
      num: '02',
      title: 'Image Processing',
      desc: 'The FastAPI backend receives the image and Pillow (PIL) normalizes, resizes (224x224 RGB), and formats it into tensors.',
      icon: Layers,
      tag: 'PILLOW PIPELINE'
    },
    {
      num: '03',
      title: 'AI Vision Inference',
      desc: 'The TensorFlow/Keras computer vision model evaluates surface textures, color saturation, and epidermal decay signatures.',
      icon: Cpu,
      tag: 'CNN CLASSIFIER'
    },
    {
      num: '04',
      title: 'Classification & Confidence',
      desc: 'The model predicts the state (Fresh, Aging, or Spoiled) along with an honest model confidence percentage.',
      icon: BarChart2,
      tag: 'MODEL CONFIDENCE'
    },
    {
      num: '05',
      title: 'Decision Support Layer',
      desc: 'HarvestGuard applies rule-based inventory mapping to translate raw probabilities into practical retail decisions.',
      icon: Zap,
      tag: 'DECISION ENGINE'
    },
    {
      num: '06',
      title: 'Sell First Prioritization',
      desc: 'Aging items are prioritized for prompt sale before spoiling; healthy stock stays normal; spoiled items are isolated.',
      icon: CheckCircle,
      tag: 'INVENTORY ACTION'
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200/80 rounded-md px-3 py-1 inline-block">
          Pipeline Architecture & AI Mechanics
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-display tracking-tight">
          How HarvestGuard AI Works
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          From a quick smartphone photo to an actionable stock prioritization decision in milliseconds.
        </p>
      </div>

      {/* 6 Step Visual Timeline */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {steps.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.num}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col justify-between space-y-4 hover:border-emerald-300 transition-colors"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    STEP {s.num}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {s.tag}
                  </span>
                </div>
                <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-emerald-700">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 font-display">
                  {s.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Complete Architecture Flow Diagram (Section 20 Compliance) */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-slate-800 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-mono text-emerald-400 uppercase tracking-wider">
            END-TO-END DATA FLOW
          </span>
          <h2 className="text-2xl font-bold font-display text-white">
            System Architecture
          </h2>
          <p className="text-slate-400 text-xs">
            Complete sequential processing flow from raw visual input to frontend render.
          </p>
        </div>

        {/* Diagram Flow Box */}
        <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 overflow-x-auto">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs min-w-[700px]">
            <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl text-center flex-1">
              <span className="text-emerald-400 font-mono block text-[10px]">01</span>
              <strong className="text-white block mt-0.5">Produce Image</strong>
              <span className="text-slate-400 text-[10px]">Camera / Upload</span>
            </div>

            <span className="text-slate-500 font-bold">→</span>

            <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl text-center flex-1">
              <span className="text-emerald-400 font-mono block text-[10px]">02</span>
              <strong className="text-white block mt-0.5">React Frontend</strong>
              <span className="text-slate-400 text-[10px]">Vite SPA</span>
            </div>

            <span className="text-slate-500 font-bold">→</span>

            <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl text-center flex-1">
              <span className="text-emerald-400 font-mono block text-[10px]">03</span>
              <strong className="text-white block mt-0.5">FastAPI REST API</strong>
              <span className="text-slate-400 text-[10px]">POST /api/predict</span>
            </div>

            <span className="text-slate-500 font-bold">→</span>

            <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl text-center flex-1">
              <span className="text-emerald-400 font-mono block text-[10px]">04</span>
              <strong className="text-white block mt-0.5">Pillow Processing</strong>
              <span className="text-slate-400 text-[10px]">224x224 RGB Tensor</span>
            </div>

            <span className="text-slate-500 font-bold">→</span>

            <div className="bg-slate-800 border border-slate-700 p-3 rounded-xl text-center flex-1">
              <span className="text-emerald-400 font-mono block text-[10px]">05</span>
              <strong className="text-white block mt-0.5">Keras CNN Model</strong>
              <span className="text-slate-400 text-[10px]">Softmax 3-Class</span>
            </div>

            <span className="text-slate-500 font-bold">→</span>

            <div className="bg-emerald-950 border border-emerald-600 p-3 rounded-xl text-center flex-1">
              <span className="text-emerald-400 font-mono block text-[10px]">06</span>
              <strong className="text-white block mt-0.5">Sell-First Action</strong>
              <span className="text-emerald-300 text-[10px]">Priority Decision</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Technology Deep Dive (Section 21 Compliance) */}
      <div className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold font-display text-slate-950">
            AI Technology & Core Stack
          </h2>
          <p className="text-sm text-slate-600">
            “HarvestGuard AI uses computer vision and image classification to identify visible produce conditions and provide inventory decision support.”
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Computer Vision</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Analyzes visual characteristics of the produce image, focusing on skin smoothness, color uniformity, and localized fungal/rot spots.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Transfer Learning</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Uses a pre-trained CNN architecture (MobileNetV2) adapted for produce classification, allowing high accuracy even with lightweight edge parameters.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">TensorFlow / Keras</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Executes the neural network inference to yield calibrated softmax probability distributions across Fresh, Aging, and Spoiled classes.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">FastAPI & Uvicorn</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Provides the high-performance asynchronous REST API connecting the React user interface directly with the Python AI inference pipeline.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-sm">Pillow (PIL)</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Processes, verifies integrity, crops, and resizes uploaded produce images to match the standard 224x224 RGB input expectations.
            </p>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-emerald-300 bg-emerald-50/30 space-y-2">
            <h4 className="font-bold text-emerald-950 text-sm">Sell-First Decision Layer</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Converts mathematical probabilities into immediate operational instructions for small merchants: Sell First, Regular Stock, or Remove.
            </p>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center pt-4">
        <Link
          to="/scanner"
          className="inline-flex items-center gap-2 px-6 py-3.5 bg-emerald-700 text-white font-bold text-sm rounded-xl hover:bg-emerald-800 transition-colors shadow-sm"
        >
          <Camera className="w-4 h-4" />
          <span>Test the Scanner Now</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
