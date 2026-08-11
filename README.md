# 🏎️ TrackPulse — AI Track Condition Intelligence

> **See the track. Predict the window. Race smarter.**

TrackPulse is an AI-powered racing strategy prototype that analyzes trackside images and video to detect changing track conditions and provide tyre-strategy recommendations.

Built for the **AI in Racing Strategy & Decision-Making** theme and powered by **Hugging Face**.

🔗 **Live Demo:** https://trackpulse-ai-track-ydxo.bolt.host/

---

## 🚀 Overview

Track conditions can change rapidly during a race. Rain, drying surfaces, and changing grip levels can make tyre strategy difficult to predict.

**TrackPulse** uses computer vision to analyze visual track data and classify the current surface condition as:

* 🟢 **DRY** — Clear surface, suitable for slick tyres
* 🟡 **DAMP** — Light moisture with reduced grip
* 🔵 **WET** — Significant water on the track
* 🟠 **DRYING** — Transition phase where conditions are improving

The system tracks wetness levels over time and converts these observations into actionable tyre-strategy recommendations.

---

## ✨ Key Features

### 🤖 AI-Powered Track Analysis

Uses Hugging Face vision models to classify track surface conditions from visual data.

### 📸 Image Analysis

Upload a trackside image and analyze the current surface condition.

### 🎥 Video Analysis

Upload a short racing video and process frames individually to identify changing track conditions.

### 📊 Wetness Trend Detection

Track wetness scores across multiple frames to determine whether conditions are:

* Improving
* Worsening
* Remaining stable

### 🛞 Tyre Strategy Recommendations

Combines the detected track condition and its trend to generate deterministic tyre recommendations.

### ⚡ Strategy Windows

Helps identify potential moments when switching tyre compounds may become advantageous.

---

## 🧠 How It Works

```text
Trackside Image / Video
          ↓
    Frame Extraction
          ↓
   Hugging Face Vision Model
          ↓
 Track Condition Classification
          ↓
   Wetness Score Generation
          ↓
    Trend Detection
          ↓
 Tyre Strategy Recommendation
```

---

## 🔍 Condition Classification

| Condition | Description                      | Strategy                             |
| --------- | -------------------------------- | ------------------------------------ |
| 🟢 DRY    | Clear racing surface             | Slick tyres                          |
| 🟡 DAMP   | Light moisture                   | Monitor grip / consider intermediate |
| 🔵 WET    | Significant water                | Wet tyres                            |
| 🟠 DRYING | Surface transitioning toward dry | Monitor for tyre-switch window       |

---

## 🏁 Example Strategy Logic

```text
IF condition = DRY
    → Recommend Slick Tyres

IF condition = DAMP
    → Monitor moisture and grip

IF condition = WET
    → Recommend Wet Tyres

IF condition = DRYING
    → Monitor trend
    → Identify potential tyre-switch window
```

The recommendation is based on the detected condition and trend rather than simply relying on a weather forecast.

---

## 🛠️ Technology Stack

### Frontend

* React
* JavaScript / TypeScript
* Tailwind CSS
* Modern responsive UI

### AI / Machine Learning

* Hugging Face
* Computer Vision
* Image Classification
* Frame-by-frame visual analysis

### Application

* Bolt.new
* Web-based dashboard
* Image & video processing

---

## 🖥️ Application Flow

### 1. Capture

Upload a trackside image or short video clip.

### 2. Classify

The AI model classifies the track as:

`DRY → DAMP → WET → DRYING`

### 3. Trend

Wetness scores are tracked across frames to identify the direction of track evolution.

### 4. Strategy

The system converts the condition and trend into a tyre-strategy recommendation.

---

## 🎯 Problem We Solve

During motorsport races, track conditions can change faster than traditional weather information can capture.

A race engineer needs answers such as:

* Is the track getting wetter?
* Is the track drying?
* When should we consider changing tyres?
* Are slick tyres still viable?
* Is the current condition stable or transitioning?

TrackPulse aims to provide a fast visual intelligence layer to support these decisions.

---

## 💡 Why TrackPulse?

Traditional weather information tells you about the **weather**.

TrackPulse focuses on what is actually visible on the **racing surface**.

```text
Weather Data
     +
Track Visual Intelligence
     +
Wetness Trend
     ↓
Better Strategy Decision Support
```

---

## 🏆 Hackathon Prototype

TrackPulse was developed as an AI racing strategy prototype focused on:

**Artificial Intelligence in Racing Strategy & Decision-Making**

### Core Innovation

Using computer vision to detect track-surface transitions and convert them into tyre-strategy intelligence.

---

## ⚠️ Disclaimer

TrackPulse provides **AI-assisted decision support**.

It does not guarantee actual track conditions, tyre performance, race outcomes, or optimal strategy.

Final racing decisions should consider additional factors such as:

* Weather forecasts
* Track temperature
* Tyre temperature
* Tyre degradation
* Driver feedback
* Race position
* Safety conditions
* Motorsport regulations

---

## 🌐 Live Demo

👉 **TrackPulse:** https://trackpulse-ai-track-ydxo.bolt.host/

---

## 👨‍💻 Author

**Shobhit Shukla**

B.Tech CSE — AI & ML

---

## ⭐ Future Improvements

* Real-time track camera integration
* Live telemetry integration
* Track temperature estimation
* Rainfall intensity detection
* Tyre degradation prediction
* Multi-camera analysis
* Historical race-data integration
* Real-time race engineer dashboard
* Advanced predictive strategy using reinforcement learning
* Driver-specific tyre recommendations

---

## 📌 Project Status

**Prototype / Hackathon Project**

Built to demonstrate how AI-powered computer vision can assist motorsport teams with real-time track-condition analysis and tyre strategy.
