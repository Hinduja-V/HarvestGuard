# HarvestGuard AI

> **“Spot Aging Produce. Sell Smarter. Waste Less.”**
> 
> An AI-powered produce freshness assistant and sell-first inventory decision support system built for small fruit and vegetable vendors, Mandi traders, and local produce retailers.

---

## 1. Project Overview

HarvestGuard AI is an applied AI/ML sustainability prototype developed for an AI/ML internship project connected directly to United Nations Sustainable Development Goals:
- **SDG 12 — Responsible Consumption and Production**
- **SDG 2 — Zero Hunger**

The core innovation is the **Sell-First Decision Layer**: HarvestGuard does not just classify whether a tomato is fresh or aging; it translates machine learning predictions into practical merchant inventory actions (Sell First, Keep Normal Stock, or Remove).

```text
📷 Produce Image
       ↓
🤖 AI Analysis (Pillow + MobileNetV2 CNN)
       ↓
🍅 Freshness Result (Fresh / Aging / Spoiled)
       ↓
📦 Sell-First Recommendation (Actionable Priority)
```

---

## 2. Problem Statement

1. **Manual Inspection**: Small vendors rely on visual assessment in rushed market conditions, missing subtle early wrinkles and softness.
2. **Mixed Stock**: Yesterday's unsold crates get commingled with fresh morning arrivals.
3. **Avoidable Food Waste**: Aging produce left unchecked becomes unsellable rot within 24–48 hours, forcing vendors to discard food and absorb loss.

**HarvestGuard AI = Visual Freshness Assessment + Sell-First Decision Support**

---

## 3. Technology Stack

- **Frontend**: React 19, Vite, TypeScript, Tailwind CSS, Lucide React, React Router.
- **Backend API**: Python 3.10+, FastAPI, Uvicorn, REST API.
- **AI & Computer Vision**: TensorFlow / Keras, Transfer Learning (MobileNetV2 backbone), Pillow (PIL), NumPy.
- **Storage**: Browser Local Storage for scan history and inventory lots.

---

## 4. Project Structure

```text
harvestguard-ai/
│
├── backend/
│   ├── main.py                  # FastAPI REST endpoints & CORS configuration
│   ├── model/
│   │   └── freshness_model.py   # MobileNetV2 CNN transfer learning definition
│   ├── services/
│   │   ├── image_processing.py  # Pillow image validation, resize (224x224 RGB)
│   │   └── prediction.py        # Sell-First priority logic & confidence mapping
│   └── requirements.txt         # Python dependencies (FastAPI, TensorFlow, Pillow)
│
├── src/
│   ├── assets/images/           # High-resolution verified produce reference samples
│   ├── components/
│   │   ├── Navbar.tsx           # Top Bar contract with responsive drawer
│   │   ├── Footer.tsx           # Footer with SDG badges and navigation
│   │   ├── CameraCapture.tsx    # Live device camera video capture modal
│   │   ├── ConfidenceMeter.tsx  # Compliant confidence visualization (no fake % fresh)
│   │   └── DecisionBadge.tsx    # Visual status badge (Fresh, Aging, Spoiled)
│   ├── pages/
│   │   ├── HomePage.tsx         # Landing page with workflow and SDG alignment
│   │   ├── ScannerPage.tsx      # Core AI Scanner with produce selector & samples
│   │   ├── InventoryPage.tsx    # Sell-First Inventory with status filters
│   │   ├── DashboardPage.tsx    # Vendor summary, charts, and scan history
│   │   ├── HowItWorksPage.tsx   # 6-step architecture breakdown
│   │   ├── SdgImpactPage.tsx    # SDG 12, SDG 2, and future roadmap
│   │   ├── LeanCanvasPage.tsx   # 9-box business and product canvas
│   │   └── AboutPage.tsx        # Project mission & tech architecture
│   ├── services/
│   │   ├── api.ts               # Frontend API client
│   │   └── storage.ts           # Local Storage persistence for scans & inventory
│   ├── types/                   # TypeScript interfaces
│   ├── App.tsx                  # React Router configuration
│   ├── index.css                # Tailwind CSS layers and fonts
│   └── main.tsx                 # React entry point
│
├── server.ts                    # Full-stack Node + Express + Vite dev/prod server
├── index.html                   # HTML entry point with metadata
├── metadata.json                # AI Studio application metadata
├── package.json                 # Node dependencies and scripts
└── README.md                    # Project documentation
```

---

## 5. How to Run Locally

### Prerequisites
- Node.js 18+ and npm
- (Optional for standalone Python service) Python 3.10+ and pip

### Running the Full-Stack Application (Vite + Express)
The application includes a unified server (`server.ts`) hosting both the `/api/predict` endpoint and Vite development server:

```bash
# 1. Install Node dependencies
npm install

# 2. Start the development server
npm run dev
```

Visit `http://localhost:3000` in your browser.

---

### Running the Standalone Python FastAPI Backend
If you want to run the standalone Python FastAPI backend on port 8000:

```bash
# 1. Navigate to project root
cd harvestguard-ai

# 2. Create and activate a Python virtual environment
python3 -m venv venv
source venv/bin/activate    # On Windows: venv\Scripts\activate

# 3. Install Python requirements
pip install -r backend/requirements.txt

# 4. Start the Uvicorn server
uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

FastAPI interactive documentation will be available at:
`http://localhost:8000/docs`

---

## 6. How the AI Model & Decision Layer Works

### Model Classification
1. **Pillow Preprocessing**: The image is validated, converted to RGB, and resized to $224 \times 224$ pixels.
2. **Feature Extraction**: MobileNetV2 pre-trained on ImageNet extracts spatial and textural features.
3. **Softmax Output**: Yields calibrated probabilities across 3 classes:
   - `Fresh`: Smooth skin, uniform pigmentation, firm structure.
   - `Aging`: Mild skin wrinkling, softening, loss of luster.
   - `Spoiled`: Localized dark lesions, fungal mycelium, structural collapse.

### Sell-First Decision Layer

| Class | Priority | Inventory Action | Vendor Recommendation |
| :--- | :--- | :--- | :--- |
| **Fresh** | `NORMAL` | `REGULAR_STOCK` | Keep with normal shelf stock. |
| **Aging** | `HIGH` | `SELL_FIRST` | **Prioritize this produce for sale before fresher stock.** |
| **Spoiled** | `REMOVE` | `SEPARATE_STOCK` | Separate and inspect the item immediately. |

### Responsible AI Language Rule
- **Never display**: `“87% Fresh”`
- **Always display**: `Prediction: Aging` · `Model Confidence: 87%`
- **Low Confidence Threshold**: When model confidence is $< 60\%$, HarvestGuard advises:
  *“The AI is not confident enough in this image. Please capture a clearer image or inspect the produce manually.”*

---

## 7. REST API Endpoint

### `POST /api/predict`
Request payload (JSON or multipart):
```json
{
  "produce": "Tomato",
  "image_base64": "data:image/jpeg;base64,...",
  "is_demo_mode": false
}
```

Response format:
```json
{
  "produce": "Tomato",
  "prediction": "Aging",
  "confidence": 0.87,
  "confidence_percentage": 87,
  "is_low_confidence": false,
  "priority": "HIGH",
  "action": "SELL_FIRST",
  "recommendation": "SELL FIRST",
  "action_instruction": "Prioritize this produce for sale before fresher stock.",
  "reason": "Visible signs of aging were detected by the image classification model.",
  "probabilities": {
    "Fresh": 0.08,
    "Aging": 0.87,
    "Spoiled": 0.05
  }
}
```

---

## 8. Future Roadmap

- **Phase 1 (Current MVP)**: Tomato freshness classification & Sell-First decision engine.
- **Phase 2**: Banana, Apple, Potato, Onion, and leafy greens.
- **Phase 3**: Diverse regional mandi dataset integration.
- **Phase 4**: Shelf-life decay curves based on verified storage data.
- **Phase 5**: Low-cost Bluetooth environmental crate sensors (temperature & humidity).
- **Phase 6**: Collective vendor demand and loss analytics.
