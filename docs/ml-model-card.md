# ArthaLens ML Model Card & Diagnostic Specifications

## Overview
ArthaLens incorporates statistical and machine learning diagnostics to evaluate macroeconomic consistency and generate non-official, analytical forecasts. These models are intended strictly for educational and diagnostic research purposes and are explicitly segregated from official government figures.

## Models Inventory

### 1. Economic Consistency Analyzer
* **Model Type:** Multi-indicator Weighted Divergence Index
* **Inputs:**
  * GDP Growth Rate (MoSPI)
  * Index of Industrial Production (IIP - MoSPI)
  * Goods and Services Tax Collection Growth (GSTN / MoF)
  * Manufacturing & Services Purchasing Managers' Index (PMI - S&P Global)
  * Merchandise Export/Import Growth (Ministry of Commerce)
* **Output:** Consistency Score (0–100 scale) with individual sub-factor contributions.
* **Intended Use:** Highlighting divergence between GDP growth estimates and high-frequency real economy indicators.
* **Limitations & Bias:** Structural shifts (e.g. formalization of economy, tax compliance improvements) can cause legitimate indicator divergence without indicating error in national accounts.

### 2. Time-Series Growth Forecaster
* **Model Type:** ARIMA / SARIMAX with external regressors
* **Training Data:** Historical MoSPI GDP series (2011-12 and 2022-23 base series processed independently).
* **Evaluation Metric:** Mean Absolute Scaled Error (MASE), Directional Accuracy.
* **Disclaimer:** Forecasts are labeled with `status = "forecast"` and visual indicators.

### 3. Anomaly & Deflator Discrepancy Detector
* **Model Type:** Z-score & Isolation Forest
* **Scope:** Flags quarterly price deflator divergences exceeding statistical thresholds between CPI, WPI, and implied GDP deflator.
