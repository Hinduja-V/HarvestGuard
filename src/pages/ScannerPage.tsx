import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  Camera,
  Upload,
  Check,
  AlertCircle,
  RotateCcw,
  ArrowRight,
  Sparkles,
  Info
} from 'lucide-react';

import { analyzeProduce } from '../services/api';
import { addScanRecord, saveInventoryItem } from '../services/storage';
import type { ActiveProduce, PredictionResult } from '../types';
import ConfidenceMeter from '../components/ConfidenceMeter';
import DecisionBadge from '../components/DecisionBadge';
import CameraCapture from '../components/CameraCapture';

// Test preset images
import sampleFresh from '../assets/images/fresh_tomato_sample_1791472977518.jpg';
import sampleAging from '../assets/images/aging_tomato_sample_1791472987522.jpg';
import sampleSpoiled from '../assets/images/spoiled_tomato_sample_1791472997955.jpg';

type PresetType = 'fresh' | 'aging' | 'spoiled';

export default function ScannerPage() {
  const [selectedProduce, setSelectedProduce] = useState<ActiveProduce>('Tomato');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [selectedPreset, setSelectedPreset] = useState<PresetType | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [isCameraOpen, setIsCameraOpen] = useState<boolean>(false);
  const [inventoryAdded, setInventoryAdded] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const resetAnalysisState = () => {
    setResult(null);
    setInventoryAdded(false);
  };

  const handleProduceChange = (produce: ActiveProduce) => {
    setSelectedProduce(produce);
    setImagePreview(null);
    setSelectedFileName(null);
    setSelectedPreset(null);
    setIsDemoMode(false);
    resetAnalysisState();
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setSelectedPreset(null);
    resetAnalysisState();

    const file = e.target.files?.[0];
    if (!file) return;

    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Please upload a valid image file (JPEG, PNG, WebP).');
      return;
    }

    setSelectedFileName(file.name);
    const reader = new FileReader();

    reader.onload = () => {
      setImagePreview(reader.result as string);
    };

    reader.onerror = () => {
      setError('Failed to read the selected file. Please try again.');
    };

    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    const syntheticEvent = {
      target: {
        files: [file],
      },
    } as unknown as React.ChangeEvent<HTMLInputElement>;

    handleFileSelect(syntheticEvent);
  };

  const handlePresetSelect = (type: PresetType) => {
    setError(null);
    setSelectedPreset(type);
    setSelectedFileName(`verified-${type}-tomato.jpg`);
    resetAnalysisState();

    if (type === 'fresh') setImagePreview(sampleFresh);
    if (type === 'aging') setImagePreview(sampleAging);
    if (type === 'spoiled') setImagePreview(sampleSpoiled);
  };

  const handleCameraPhoto = (base64: string) => {
    setSelectedPreset(null);
    setSelectedFileName('camera-capture.jpg');
    setImagePreview(base64);
    setError(null);
    resetAnalysisState();
  };

  const handleModeChange = (mode: boolean) => {
    setIsDemoMode(mode);
    resetAnalysisState();

    if (mode && !selectedPreset) {
      setError('Demo Mode requires a verified sample image.');
    } else {
      setError(null);
    }
  };

  const handleReset = () => {
    setImagePreview(null);
    setSelectedFileName(null);
    setSelectedPreset(null);
    setError(null);
    resetAnalysisState();

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleAnalyze = async () => {
    if (!imagePreview) {
      setError('Please upload, capture, or select a produce image first.');
      return;
    }

    if (isDemoMode && !selectedPreset) {
      setError('Please select a verified sample for Demo Mode.');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await analyzeProduce({
        produce: selectedProduce,
        image: imagePreview,
        fileName: selectedFileName || undefined,
      });

      setResult({
        ...data,
        is_demo_mode: selectedProduce === 'Tomato' && isDemoMode,
        image_preview: imagePreview || undefined,
      });

      addScanRecord({
        id: `scan-${Date.now()}`,
        date: new Date().toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        produce: data.produce,
        prediction: data.prediction,
        confidence_percentage: data.confidence_percentage,
        action: data.recommendation,
        priority: data.priority,
        recommendation: data.recommendation,
        is_low_confidence: data.is_low_confidence,
        image_preview: imagePreview || undefined,
      });
    } catch (err: unknown) {
      setError(
        (err instanceof Error && err.message) ||
          'An error occurred during analysis. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddToInventory = () => {
    if (!result) return;

    saveInventoryItem({
      id: `inv-${Date.now()}`,
      produce: result.produce,
      variety: 'Inspected Lot',
      quantity: 10,
      unit: 'kg',
      condition: result.prediction,
      priority: result.priority,
      action: result.action,
      confidence_percentage: result.confidence_percentage,
      scanned_at: new Date().toISOString(),
      notes: result.action_instruction,
      image_url: result.image_preview,
    });

    setInventoryAdded(true);
  };

  const getProduceEmoji = (produce: string) => {
    if (produce === 'Potato') return '🥔';
    if (produce === 'Onion') return '🧅';
    return '🍅';
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Page Header */}
      <div className="space-y-2">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-950 font-display tracking-tight">
              AI Produce Scanner
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Upload a produce image and let HarvestGuard AI assess its visible condition.
            </p>
          </div>

          {/* Mode Switcher */}
          {selectedProduce === 'Tomato' && (
            <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-lg border border-slate-200">
              <button
                type="button"
                onClick={() => handleModeChange(false)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  !isDemoMode
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                AI Model Prediction
              </button>

              <button
                type="button"
                onClick={() => handleModeChange(true)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  isDemoMode
                    ? 'bg-amber-100 text-amber-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Demo Mode
              </button>
            </div>
          )}
        </div>

        {selectedProduce === 'Tomato' && isDemoMode && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Info className="w-4 h-4 text-amber-700 shrink-0" />
              <span>
                <strong>Tomato sample mode:</strong> The selected sample image is
                analyzed by the real Tomato model.
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Produce Selector */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-bold text-slate-900">
            Select Produce
          </label>

          <span className="text-xs font-mono font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
            Active Models: Tomato &amp; Potato
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Tomato */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleProduceChange('Tomato')}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedProduce === 'Tomato'
                ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">🍅</span>
              <span className="text-[10px] font-bold text-emerald-700 uppercase">
                Active
              </span>
            </div>

            <div className="font-bold text-slate-900 text-sm">Tomato</div>
            <div className="text-[11px] text-slate-500">
              3 freshness classes
            </div>
          </button>

          {/* Potato */}
          <button
            type="button"
            disabled={isLoading}
            onClick={() => handleProduceChange('Potato')}
            className={`p-4 rounded-xl border text-left transition-all ${
              selectedProduce === 'Potato'
                ? 'border-emerald-600 bg-emerald-50/60 ring-2 ring-emerald-600/20'
                : 'border-slate-200 bg-white hover:border-slate-300'
            } disabled:cursor-not-allowed disabled:opacity-50`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">🥔</span>
              <span className="text-[10px] font-bold text-emerald-700 uppercase">
                Active
              </span>
            </div>

            <div className="font-bold text-slate-900 text-sm">Potato</div>
            <div className="text-[11px] text-slate-500">
              2 freshness classes
            </div>
          </button>

          <button
            type="button"
            disabled
            className="p-4 rounded-xl border border-slate-200 bg-slate-50 text-left opacity-70 cursor-not-allowed"
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xl">🧅</span>
              <span className="text-[10px] font-bold text-slate-500 uppercase">
                Coming Soon
              </span>
            </div>

            <div className="font-bold text-slate-900 text-sm">Onion</div>
            <div className="text-[11px] text-slate-500">Prediction unavailable</div>
          </button>
        </div>
      </div>

      {/* Main Upload / Capture Area */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900 font-display">
            Produce Photo Input
          </h2>

          {imagePreview && (
            <button
              type="button"
              disabled={isLoading}
              onClick={handleReset}
              className="text-xs text-slate-500 hover:text-slate-800 disabled:cursor-not-allowed disabled:opacity-50 flex items-center gap-1 font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              Clear &amp; Retake
            </button>
          )}
        </div>

        {!imagePreview ? (
          <div className="space-y-4">
            {/* Upload Dropzone */}
            <div
              onClick={() => fileInputRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
              className={`border-2 border-dashed rounded-2xl p-8 sm:p-12 text-center cursor-pointer transition-colors flex flex-col items-center justify-center space-y-3 group ${
                isDragging
                  ? 'border-emerald-600 bg-emerald-50'
                  : 'border-slate-300 hover:border-emerald-600 bg-slate-50/50 hover:bg-emerald-50/20'
              }`}
            >
              <div className="w-14 h-14 rounded-2xl bg-white border border-slate-200 shadow-sm flex items-center justify-center text-slate-600 group-hover:text-emerald-700 group-hover:border-emerald-300 transition-colors">
                <Upload className="w-7 h-7" />
              </div>

              <div>
                <p className="text-base font-bold text-slate-900">
                  Upload Produce Photo
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Drag and drop an image here or click to browse (JPEG, PNG, WebP)
                </p>
              </div>
            </div>

            {/* Camera + File Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => setIsCameraOpen(true)}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-slate-800 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Camera className="w-4 h-4 text-emerald-400" />
                <span>Use Device Camera</span>
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full sm:flex-1 py-3 px-4 rounded-xl border border-slate-300 bg-white text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors flex items-center justify-center gap-2 shadow-sm"
              >
                <Upload className="w-4 h-4 text-slate-500" />
                <span>Browse Files</span>
              </button>
            </div>

            {/* Verified Samples */}
            {selectedProduce === 'Tomato' && (
              <div className="pt-4 border-t border-slate-100">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-semibold text-slate-600">
                    Or test with 1-click verified tomato samples:
                  </span>
                  <span className="text-[11px] text-slate-400">
                    Click to load
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => handlePresetSelect('fresh')}
                    className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 hover:border-emerald-500 bg-white text-left transition-all"
                  >
                    <img
                      src={sampleFresh}
                      alt="Fresh tomato sample"
                      className="w-9 h-9 rounded object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Fresh Tomato
                      </div>
                      <div className="text-[10px] text-emerald-700">
                        Crisp &amp; firm
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePresetSelect('aging')}
                    className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 hover:border-amber-500 bg-white text-left transition-all"
                  >
                    <img
                      src={sampleAging}
                      alt="Aging tomato sample"
                      className="w-9 h-9 rounded object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Aging Tomato
                      </div>
                      <div className="text-[10px] text-amber-700">
                        Surface wrinkles
                      </div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => handlePresetSelect('spoiled')}
                    className="flex items-center gap-2.5 p-2 rounded-lg border border-slate-200 hover:border-rose-500 bg-white text-left transition-all"
                  >
                    <img
                      src={sampleSpoiled}
                      alt="Spoiled tomato sample"
                      className="w-9 h-9 rounded object-cover"
                    />
                    <div>
                      <div className="text-xs font-bold text-slate-900">
                        Spoiled Tomato
                      </div>
                      <div className="text-[10px] text-rose-700">
                        Dark rot blemish
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          /* Preview State */
          <div className="space-y-4">
            <div className="relative rounded-xl overflow-hidden border border-slate-200 bg-slate-950 aspect-[4/3] max-h-80 flex items-center justify-center">
              <img
                src={imagePreview}
                alt="Selected produce preview"
                className="w-full h-full object-contain"
              />

              <div className="absolute top-3 right-3 bg-black/60 text-white text-xs px-2.5 py-1 rounded-md backdrop-blur-sm">
                Ready for AI Analysis
              </div>
            </div>

            {selectedPreset && (
              <p className="text-xs text-slate-500 text-center">
                Loaded verified sample:{' '}
                <strong className="capitalize text-slate-700">
                  {selectedPreset} Tomato
                </strong>
              </p>
            )}
          </div>
        )}

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={handleFileSelect}
        />

        {/* Error Message */}
        {error && (
          <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {/* Analyze Button */}
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={
            !imagePreview ||
            isLoading
          }
          className="w-full py-4 px-6 rounded-xl bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 disabled:hover:bg-emerald-700 text-white font-bold text-base transition-all shadow-md flex items-center justify-center gap-2 active:scale-[0.99]"
        >
          {isLoading ? (
            <>
              <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Produce with Computer Vision...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Analyze Produce</span>
            </>
          )}
        </button>
      </div>

      {/* AI Result */}
      {result && (
        <div className="bg-white rounded-2xl border-2 border-emerald-600/30 p-6 sm:p-8 shadow-lg space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-200">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                {result.is_demo_mode
                  ? 'Sample Image — Actual Model Prediction'
                  : 'AI Model Prediction'}
              </span>

              <h2 className="text-2xl font-extrabold text-slate-950 font-display flex items-center gap-2 mt-0.5">
                <span>{getProduceEmoji(result.produce)}</span>
                <span>
                  {result.produce === 'Potato'
                    ? 'Potato Freshness Result'
                    : 'Tomato Analysis Result'}
                </span>
              </h2>
            </div>

            <DecisionBadge
              condition={result.prediction}
              priority={result.priority}
              size="lg"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            {/* Prediction */}
            <div className="space-y-3 bg-slate-50 p-5 rounded-xl border border-slate-200/80">
              <div className="text-xs font-semibold text-slate-500 uppercase">
                Prediction
              </div>

              <div className="text-3xl font-extrabold font-display tracking-tight text-slate-900">
                {result.prediction.toUpperCase()}
              </div>

              <ConfidenceMeter
                confidencePercentage={result.confidence_percentage}
                isLowConfidence={result.is_low_confidence}
              />
            </div>

            {/* Recommendation */}
            <div
              className={`p-5 rounded-xl border space-y-3 ${
                result.prediction === 'Aging'
                  ? 'bg-amber-50 border-amber-300'
                  : result.prediction === 'Spoiled' || result.prediction === 'Rotten'
                  ? 'bg-rose-50 border-rose-300'
                  : 'bg-emerald-50 border-emerald-300'
              }`}
            >
              <div className="text-xs font-bold uppercase tracking-wider text-slate-700">
                {result.produce === 'Tomato' ? 'Sell-First Recommendation' : 'Stock Recommendation'}
              </div>

              <div className="text-xl font-bold font-display text-slate-950">
                {result.priority === 'NORMAL' && '🟢 '}
                {result.priority === 'HIGH' && '🟠 '}
                {result.priority === 'REMOVE' && '🔴 '}
                {result.recommendation.toUpperCase()}
              </div>

              <p className="text-sm font-semibold text-slate-800 leading-relaxed">
                “{result.action_instruction}”
              </p>

              <div className="pt-2 border-t border-slate-200/60 text-xs text-slate-600">
                <span className="font-semibold text-slate-800">Reason: </span>
                {result.reason}
              </div>
            </div>
          </div>

          {result.is_low_confidence && (
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <strong className="block text-sm font-bold mb-0.5">
                  Low Confidence Result
                </strong>
                The AI is not confident enough in this image. Please capture a
                clearer image with better lighting or inspect the produce
                manually.
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={handleReset}
                className="px-4 py-2.5 rounded-lg border border-slate-300 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Scan Another Produce
              </button>

              <button
                type="button"
                onClick={handleAddToInventory}
                disabled={inventoryAdded}
                className="px-4 py-2.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 disabled:bg-emerald-900/60 text-white text-sm font-semibold transition-colors flex items-center gap-1.5 shadow-sm"
              >
                {inventoryAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Inventory</span>
                  </>
                ) : (
                  <span>Add to Inventory</span>
                )}
              </button>
            </div>

            <Link
              to="/inventory"
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-emerald-700 hover:text-emerald-800"
            >
              <span>View Inventory</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}

      {/* Camera Modal */}
      <CameraCapture
        isOpen={isCameraOpen}
        onClose={() => setIsCameraOpen(false)}
        onCapture={handleCameraPhoto}
      />
    </div>
  );
}