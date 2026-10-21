# Graph Report - arthalens  (2026-10-21)

## Corpus Check
- 432 files · ~512,480 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 18 file(s) not represented in the graph (top: (none) 10, .ico 2, .example 1)

## Summary
- 2550 nodes · 5470 edges · 171 communities (114 shown, 57 thin omitted)
- Extraction: 97% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 167 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `93fcf490`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- intelligence/page.tsx
- ref_next
- GdpServiceTest.java
- MethodologyService
- widget-grid.tsx
- list
- MacroAccountsWorkspace.tsx
- react
- chart-tooltip.tsx
- GdpObservation
- DashboardService.java
- annotation
- app/layout.tsx
- app/page.tsx
- contact/page.tsx
- bklit/index.ts
- BaseYearRepository
- bootstrap_data.py
- api.ts
- GlobalExceptionHandler.java
- StateGvaObservation
- IngestionRun
- dependencies
- ml/api.py
- verify-production-quality.mjs
- line-chart.tsx
- SovereignRating
- web/package.json
- bar-chart.tsx
- series-markers.tsx
- time-series-chart-shell.tsx
- pie-chart.tsx
- providers.py
- typing
- chart-context.tsx
- pie-slice.tsx
- LivingEconomyLandscape.tsx
- Provenance
- y-domain-utils.ts
- bar-squares.tsx
- x-axis.tsx
- MoSPIAdapter
- line.tsx
- useChartStable
- ring-chart.tsx
- compilerOptions
- pie-center.tsx
- scheduler.py
- test_rag_ingestion.py
- grid.tsx
- ArthaLens — BUILD LOG
- ConsistencyScorer
- bar.tsx
- projection-utils.ts
- validate_observation
- pydantic_settings
- BklitGlobalBarChart.tsx
- cn
- 2. Detailed Series Specifications & Methodological Mappings
- compute_sector_contributions
- ArthaLens 🇮🇳
- MethodologyVersion
- three-tsl-motion.d.ts
- pattern-preset.tsx
- motion
- observatory/page.tsx
- loading-sweep.tsx
- dot-field.tsx
- WebConfig.java
- provenance.py
- package.json
- models.py
- series-dash-tail-overlay.tsx
- SectorObservation
- react
- io.swagger.v3.oas.annotations.tags.Tag
- check_deflator_identity
- projection-config.ts
- use-highlight-segment.ts
- line-loading-pulse.tsx
- use-animated-series-path.ts
- BaseYearRepository
- compute_revision_stats
- devDependencies
- line-chart-loading.tsx
- reference-area-config.ts
- Files Created (by service)
- HealthController.java
- bar-chart.json
- pie-chart.json
- ring-chart.json
- README.md
- ArthaLens — Architecture Overview
- rolling_correlations.py
- detector.py
- Source
- deploy
- ArthaLens System Architecture & End-to-End Improvements
- AiOrchestrationService
- services/ingestion
- citation.py
- Models Inventory
- Evaluation Dimensions
- Common Issues and Solutions
- services/ai — AI/RAG/LLM Service
- marker-group.tsx
- contact/route.ts
- ADR-001: Monorepo Structure
- ADR-002: PostgreSQL as Primary Database with pgvector
- ADR-004: Strict GDP Series Isolation (2011-12 vs 2022-23 Base Year)
- query
- services/ml — ML & Statistics Service
- scripts
- SectorDonutChart.tsx
- y-axis-ticks.ts
- Changelog
- ApiApplication.java
- services/database — Schema & Migrations
- vercel.json
- web/README.md
- WidgetGrid
- ArthaLens — Data Dictionary
- PIBAdapter
- web/vercel.json
- AGENTS.md
- postcss.config.mjs
- init.sh
- attribute
- cos
- MeshBasicNodeMaterial
- mix
- positionLocal
- sin
- time
- uniform
- vec3
- WebGPURenderer
- arthalens-ai
- arthalens-ingestion
- arthalens-ml
- com.arthalens:api
- BklitGdpLineChart.tsx
- .advance
- MacroTelemetryWidgetGrid.tsx
- ArthaLens 🇮🇳

## God Nodes (most connected - your core abstractions)
1. `react` - 128 edges
2. `cn()` - 46 edges
3. `motion` - 45 edges
4. `lucide-react` - 42 edges
5. `useChartStable()` - 37 edges
6. `TimeSeriesChartCore` - 32 edges
7. `SectorObservation` - 32 edges
8. `BaseYearRepository` - 32 edges
9. `Provenance` - 31 edges
10. `IngestionRun` - 31 edges

## Surprising Connections (you probably didn't know these)
- `Assets to Protect` --references--> `validate_url_for_fetch()`  [INFERRED]
  docs/threat-model.md → services/ai/rag/security.py
- `3. Backend Microservices Tier Improvements` --references--> `GvaObservation`  [INFERRED]
  docs/ARCHITECTURE_IMPROVEMENTS.md → services/api/src/main/java/com/arthalens/api/domain/gdp/entity/GvaObservation.java
- `3. Backend Microservices Tier Improvements` --references--> `Revision`  [INFERRED]
  docs/ARCHITECTURE_IMPROVEMENTS.md → services/api/src/main/java/com/arthalens/api/domain/gdp/entity/Revision.java
- `1. Elimination of Mock Data & Hardcoding` --references--> `SectorObservation`  [INFERRED]
  docs/ARCHITECTURE_IMPROVEMENTS.md → services/api/src/main/java/com/arthalens/api/domain/gdp/entity/SectorObservation.java
- `3. Backend Microservices Tier Improvements` --references--> `SectorObservation`  [INFERRED]
  docs/ARCHITECTURE_IMPROVEMENTS.md → services/api/src/main/java/com/arthalens/api/domain/gdp/entity/SectorObservation.java

## Import Cycles
- None detected.

## Communities (171 total, 57 thin omitted)

### Community 0 - "intelligence/page.tsx"
Cohesion: 0.07
Nodes (59): POST(), POST(), POST(), GET(), POST(), GET(), GET(), PATCH() (+51 more)

### Community 1 - "ref_next"
Cohesion: 0.03
Nodes (20): nextConfig, metadata, metadata, metadata, metadata, metadata, metadata, metadata (+12 more)

### Community 2 - "GdpServiceTest.java"
Cohesion: 0.10
Nodes (12): Added, 3. Backend Microservices Tier Improvements, PaginationDto, ProvenanceDto, GdpObservationDto, GdpSeriesResponse, ApiApplicationTests, GdpSectorServiceTest (+4 more)

### Community 3 - "MethodologyService"
Cohesion: 0.18
Nodes (5): MethodologyController, MethodologyVersionDto, SeriesComparisonResponse, MethodologyVersionRepository, MethodologyService

### Community 4 - "widget-grid.tsx"
Cohesion: 0.07
Nodes (27): BAR_KEYS, Body, CellProps, clampTilt(), DAY_LABELS, DEMO_WIDGETS, DragState, EVENT_COUNT (+19 more)

### Community 5 - "list"
Cohesion: 0.10
Nodes (7): ResourceNotFoundException, AiQueryResponse, CitationDto, GdpSectorController, SectorBreakdownResponse, SectorDataDto, GdpSectorService

### Community 6 - "MacroAccountsWorkspace.tsx"
Cohesion: 0.08
Nodes (35): AnalyticsPage(), DeflatorPage(), GdpExplorerPage(), MethodologyPage(), AGENCIES, OUTLOOK_BADGES, RatingsPage(), RevisionsPage() (+27 more)

### Community 7 - "react"
Cohesion: 0.07
Nodes (16): metadata, SUGGESTED_ROUTES, AgentDef, AGENTS, DEPARTMENTS, Role, ROLES, Phase (+8 more)

### Community 8 - "chart-tooltip.tsx"
Cohesion: 0.10
Nodes (40): ChartConfigContext, ChartConfigProviderProps, ChartConfigValue, DEFAULT_CHART_CONFIG, resolveTooltipBoxMotion(), SpringConfig, useChartConfig(), hmsTimeFmt (+32 more)

### Community 9 - "GdpObservation"
Cohesion: 0.05
Nodes (9): GdpObservation, ObservationStatus, derived, estimated, forecast, official, provisional, revised (+1 more)

### Community 10 - "DashboardService.java"
Cohesion: 0.08
Nodes (10): MetricCardDto, DashboardController, DashboardResponse, DashboardService, GdpObservationRepository, GvaObservationRepository, SectorObservationRepository, StateGvaObservationRepository (+2 more)

### Community 11 - "annotation"
Cohesion: 0.08
Nodes (7): AiQueryRequest, GdpController, GdpService, IndicatorController, IndicatorDto, IndicatorsResponse, IndicatorService

### Community 12 - "app/layout.tsx"
Cohesion: 0.08
Nodes (31): ibmPlexMono, inter, manrope, metadata, RootLayout(), GoogleIcon(), LoginForm(), LoginPage() (+23 more)

### Community 13 - "app/page.tsx"
Cohesion: 0.07
Nodes (28): HomePage(), AnalyticalCapabilitiesSection(), COPILOT_DEMOS, CopilotQuery, ContinueInvestigationSection(), Pathway, PATHWAYS, EvidenceProvenanceTrail() (+20 more)

### Community 14 - "contact/page.tsx"
Cohesion: 0.08
Nodes (27): ContactPage(), FormErrors, FormState, INQUIRY_OPTIONS, InquiryOption, SubmissionReceipt, GDPWhyPage(), SECTOR_CONTRIBUTIONS (+19 more)

### Community 15 - "bklit/index.ts"
Cohesion: 0.16
Nodes (21): BarXAxis(), BarXAxisInner, BarXAxisLabel(), BarXAxisLabelProps, BarXAxisProps, BarYAxis(), BarYAxisInner, BarYAxisLabel() (+13 more)

### Community 16 - "BaseYearRepository"
Cohesion: 0.10
Nodes (6): DeflatorController, DeflatorDto, DeflatorsResponse, DeflatorObservation, DeflatorRepository, DeflatorService

### Community 17 - "bootstrap_data.py"
Cohesion: 0.10
Nodes (19): api_retry(), bootstrap(), fetch_cpi(), fetch_iip(), fetch_wpi(), get_conn(), log(), transform_cpi() (+11 more)

### Community 19 - "api.ts"
Cohesion: 0.07
Nodes (28): AiQueryRequest, AiQueryResponse, api, BaseYearSeries, Citation, DeflatorsResponse, GdpSeriesResponse, IndicatorCard (+20 more)

### Community 22 - "IngestionRun"
Cohesion: 0.09
Nodes (8): QuarantineManager, IngestionRun, IngestionPipeline, mock_db_upsert(), mock_run(), make_mock_adapter(), test_pipeline_quarantines_invalid_row(), test_pipeline_runs_valid_row()

### Community 23 - "dependencies"
Cohesion: 0.06
Nodes (32): dependencies, animejs, axios, clsx, d3-array, d3-shape, date-fns, echarts (+24 more)

### Community 24 - "ml/api.py"
Cohesion: 0.11
Nodes (14): health(), consistency_score(), ConsistencyRequest, deflator_check(), DeflatorCheckRequest, health(), revision_analytics(), RevisionItem (+6 more)

### Community 25 - "verify-production-quality.mjs"
Cohesion: 0.08
Nodes (16): __dirname, __filename, publicDir, __dirname, __filename, publicDir, runAudit(), testUrl() (+8 more)

### Community 26 - "line-chart.tsx"
Cohesion: 0.15
Nodes (24): BarChartProps, ChartInnerProps, Margin, ChartPhase, ChartStatus, DEFAULT_CHART_LIFECYCLE, DEFAULT_CHART_STATUS, DEFAULT_Y_DOMAIN_TWEEN_MS (+16 more)

### Community 27 - "SovereignRating"
Cohesion: 0.10
Nodes (6): RatingsController, RatingDto, RatingsResponse, SovereignRating, SovereignRatingRepository, RatingsService

### Community 28 - "web/package.json"
Cohesion: 0.08
Nodes (24): eslintConfig, next, name, private, version, axios, d3-array, date-fns (+16 more)

### Community 29 - "bar-chart.tsx"
Cohesion: 0.14
Nodes (25): BarChart(), BarOrientation, ChartCore, ChartInner(), DEFAULT_MARGIN, extractBarConfigs(), BarChartLoading(), BarChartLoadingProps (+17 more)

### Community 30 - "series-markers.tsx"
Cohesion: 0.13
Nodes (23): defaultScatterColors, useChartHover(), ChartLegendHoverContext, ChartLegendHoverContextValue, useChartLegendHover(), SeriesHoverDim(), SeriesHoverDimProps, MarkerStyle (+15 more)

### Community 31 - "time-series-chart-shell.tsx"
Cohesion: 0.10
Nodes (28): clipRevealTransition(), DEFAULT_ANIMATION_DURATION_MS, DEFAULT_ANIMATION_EASING, DEFAULT_CHART_ENTER_TRANSITION, collectChartDefsChildren(), getChartChildComponentName(), isChartDefsComponent(), isGradientDefComponent() (+20 more)

### Community 32 - "pie-chart.tsx"
Cohesion: 0.13
Nodes (23): PieCenterShell(), PieCenterShellProps, DEFAULT_HOVER_OFFSET, generatePieArcPath(), isDefsComponent(), isPieCenter(), isPieSlice(), PieChartCore (+15 more)

### Community 33 - "providers.py"
Cohesion: 0.11
Nodes (11): ADR-003: Provider-Agnostic LLM and Embedding Interfaces, Consequences, Context, Decision, Rationale, create_llm_provider(), EmbeddingProvider, LLMMessage (+3 more)

### Community 35 - "chart-context.tsx"
Cohesion: 0.12
Nodes (21): ChartContextValue, ChartHoverContext, ChartHoverContextValue, ChartStableContext, ChartStableContextValue, LineConfig, ScaleBand, ScaleLinear (+13 more)

### Community 36 - "pie-slice.tsx"
Cohesion: 0.30
Nodes (13): usePie(), usePieHover(), usePieStable(), AnimatedSliceGrow(), AnimatedSliceGrowProps, AnimatedSliceTranslate(), AnimatedSliceTranslateProps, generateArcPath() (+5 more)

### Community 37 - "LivingEconomyLandscape.tsx"
Cohesion: 0.22
Nodes (15): ContextualInspectorPanel(), ContextualInspectorPanelProps, ECONOMIC_RELATIONSHIPS, ECONOMIC_SECTORS, FlowVectorOverlay(), FlowVectorOverlayProps, LivingEconomyLandscapeProps, SectorPlatform() (+7 more)

### Community 38 - "Provenance"
Cohesion: 0.15
Nodes (3): WorldBankAdapter, now_utc(), Provenance

### Community 39 - "y-domain-utils.ts"
Cohesion: 0.29
Nodes (12): lerpDomain(), snapDomains(), tweenDomains(), useAnimatedYDomains(), UseAnimatedYDomainsOptions, computeYDomainsByAxis(), domainsEqual(), isYDomainTweenPhase() (+4 more)

### Community 40 - "bar-squares.tsx"
Cohesion: 0.14
Nodes (21): BarColumnTrack(), BarColumnTrackInner, BarColumnTrackProps, BarSquares(), BarSquaresInner, BarSquaresInnerProps, BarSquaresProps, cascadeColumnTransition() (+13 more)

### Community 41 - "x-axis.tsx"
Cohesion: 0.17
Nodes (21): allIndexLayouts(), appendProjectionTailTicks(), AxisTick, binomial(), buildDataAlignedTicks(), buildDomainTicks(), composePositiveSum(), dedupeIndicesByLabel() (+13 more)

### Community 43 - "line.tsx"
Cohesion: 0.26
Nodes (13): AreaGradientDefs(), AreaGradientDefsProps, FadeEdges, FadeGradientStop, fadeGradientStops(), FadeSides, resolveFadeSides(), viewportFadeGradientAttrs() (+5 more)

### Community 44 - "useChartStable"
Cohesion: 0.18
Nodes (18): useChartStable(), useYScale(), isTerminalMarkerPhaseVisible(), LineSeriesTerminalMarker(), LineSeriesTerminalMarkerProps, ProjectionLineConfig, ProjectionLineConfigProps, CurveFactory (+10 more)

### Community 45 - "ring-chart.tsx"
Cohesion: 0.15
Nodes (19): generateRingArcPath(), isRing(), isRingCenter(), RingChart(), RingChartCore, RingChartInner(), RingChartInnerProps, RingChartProps (+11 more)

### Community 46 - "compilerOptions"
Cohesion: 0.10
Nodes (20): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+12 more)

### Community 47 - "pie-center.tsx"
Cohesion: 0.20
Nodes (13): chartCenterContainerClassName, chartCenterLabelClassName, chartCenterValueClassName, ChartStatFlow(), ChartStatFlowFormat, ChartStatFlowProps, defaultChartStatFlowFormat, formatStatValue() (+5 more)

### Community 48 - "scheduler.py"
Cohesion: 0.14
Nodes (4): create_scheduler(), register_jobs(), run_scheduler(), load_registry()

### Community 49 - "test_rag_ingestion.py"
Cohesion: 0.07
Nodes (20): Ingestion & Provenance, build_chunk_metadata(), DocumentChunk, DocumentIndexer, split_text_into_chunks(), redact_pii(), sanitize_retrieved_content(), validate_url_for_fetch() (+12 more)

### Community 50 - "grid.tsx"
Cohesion: 0.39
Nodes (8): Grid(), GridProps, hideEdgeTicks(), resolveRowTickValues(), useGridShimmer(), isLoadingChromePhase(), isLoadingGridChromePhase(), @visx/grid

### Community 51 - "ArthaLens — BUILD LOG"
Cohesion: 0.12
Nodes (17): Architecture Decisions (ADRs), ArthaLens — BUILD LOG, Backend (B1-B6), Build Verification Results, DevOps/QA (D1-D3), Files added, Final Test Results, Frontend (F1-F8) (+9 more)

### Community 52 - "ConsistencyScorer"
Cohesion: 0.20
Nodes (7): ConsistencyScorer, ConsistencyScoreResult, SubScore, test_missing_indicators_reduce_coverage(), test_no_data_returns_midrange(), test_perfect_agreement_scores_high(), test_result_has_label()

### Community 53 - "bar.tsx"
Cohesion: 0.19
Nodes (14): AnimatedBar(), AnimatedBarProps, Bar(), BarAnimationType, barDepthPerspectiveRise(), BarInner, BarInnerProps, BarLineCap (+6 more)

### Community 54 - "projection-utils.ts"
Cohesion: 0.24
Nodes (15): buildAutoFutureValues(), buildProjectionPath(), BuildProjectionPathOptions, buildTargetPath(), computeProjectionAnchorTangentSlope(), intervalFromAdjacentRows(), intervalFromSeriesSpan(), linearRegressionSlope() (+7 more)

### Community 55 - "validate_observation"
Cohesion: 0.21
Nodes (9): validate_observation(), ValidationError, ValidationResult, test_invalid_base_year(), test_invalid_period_type(), test_missing_source_id(), test_nan_value_rejected(), test_negative_gdp_rejected() (+1 more)

### Community 56 - "pydantic_settings"
Cohesion: 0.12
Nodes (3): Settings, Settings, Settings

### Community 57 - "BklitGlobalBarChart.tsx"
Cohesion: 0.24
Nodes (11): CacheEntry, COUNTRIES, COUNTRY_MAP, fetchWorldBankIndicator(), GET(), GlobalEconomiesPage(), BklitGlobalBarChart(), Props (+3 more)

### Community 58 - "cn"
Cohesion: 0.24
Nodes (10): Bars(), Check(), NotesWidget(), RevenueWidget(), Sparkline(), StorageWidget(), TimelineWidget(), UptimeWidget() (+2 more)

### Community 59 - "2. Detailed Series Specifications & Methodological Mappings"
Cohesion: 0.13
Nodes (14): 1. Primary Official Data Authorities, 2.1 National Accounts Statistics (MoSPI NAS), 2.2 Sectoral Breakdown (8 Key Economic Sectors), 2.3 State-Level GVA & GSDP (State Directorates of Economics & Statistics), 2.4 Price Indices & Derived GDP Deflators, 2.5 Revision Tracking Engine, 2.6 Global Economy Benchmarks (World Bank Open Data API), 2.7 Sovereign Credit Ratings (+6 more)

### Community 60 - "compute_sector_contributions"
Cohesion: 0.21
Nodes (7): compute_sector_contributions(), SectorContribution, test_contributions_sum_approx_total_growth(), test_contributions_with_prior(), test_largest_sector_first(), test_shares_sum_to_one(), test_zero_total_raises()

### Community 61 - "ArthaLens 🇮🇳"
Cohesion: 0.25
Nodes (8): 1. Configure environment, 2. Start database, 3. Start Spring Boot API (runs Flyway migrations automatically), 4. Seed database, 5. Start Python services, 6. Start frontend, Prerequisites, Quickstart (Local Development)

### Community 63 - "three-tsl-motion.d.ts"
Cohesion: 0.40
Nodes (4): motion/three, three/tsl, three/webgpu, three

### Community 64 - "pattern-preset.tsx"
Cohesion: 0.22
Nodes (10): isCirclePattern(), isCirclesPattern(), PATTERN_PRESET_IDS, PatternPresetOptions, patternPresetTileSize(), renderPatternCircles(), renderPatternPreset(), PatternCircles() (+2 more)

### Community 65 - "motion"
Cohesion: 0.24
Nodes (12): RingCenter(), useRing(), useRingHover(), useRingStable(), generateArcPath(), Ring, ringHoverScale(), RingLineCap (+4 more)

### Community 66 - "observatory/page.tsx"
Cohesion: 0.13
Nodes (19): ObservatoryContent(), ObservatoryPage(), ObservatoryView, HeroConstellation(), MACRO_NODES_DATA, MacroNode, createGreatCircleArc(), latLonToVector3() (+11 more)

### Community 67 - "loading-sweep.tsx"
Cohesion: 0.27
Nodes (12): chartCssVars, BarLoadingSkeleton(), BarLoadingSkeletonProps, CurveFactory, generateEasedGradientStops(), getSkeletonHeights(), getSkeletonSigns(), hashFract() (+4 more)

### Community 68 - "dot-field.tsx"
Cohesion: 0.21
Nodes (12): applyPointer(), createField(), createNoise(), DATA_JOURNEY_STAGES, DotField(), DotFieldProps, Field, JourneyStage (+4 more)

### Community 70 - "provenance.py"
Cohesion: 0.23
Nodes (4): compute_content_hash(), test_content_hash_deterministic(), test_content_hash_different_for_different_content(), test_content_hash_is_sha256()

### Community 71 - "package.json"
Cohesion: 0.15
Nodes (12): dependencies, next, description, next, name, private, scripts, build (+4 more)

### Community 72 - "models.py"
Cohesion: 0.22
Nodes (3): ARIMAForecaster, ForecastResult, NaiveForecaster

### Community 73 - "series-dash-tail-overlay.tsx"
Cohesion: 0.18
Nodes (15): DashTailStroke(), DashTailStrokeProps, CurveFactory, Line(), LineLoadingOverlays(), LineSeriesStroke(), resolveLineLoadingPulseMode(), EMPTY_METRICS (+7 more)

### Community 75 - "react"
Cohesion: 0.09
Nodes (17): Citation, Message, SUGGESTED_QUERIES, SUB_FACTORS, SubFactor, GovernmentTerminalModal(), Props, NotificationCenter() (+9 more)

### Community 76 - "io.swagger.v3.oas.annotations.tags.Tag"
Cohesion: 0.11
Nodes (8): StateGvaController, StateGvaDto, StateGvaResponse, StateGvaService, SourceController, SourceDto, SourceRepository, SourceService

### Community 77 - "check_deflator_identity"
Cohesion: 0.27
Nodes (7): check_deflator_identity(), DeflatorDiagnostic, test_cpi_divergence_flagged(), test_handles_none_inputs(), test_identity_fails_on_large_mismatch(), test_identity_passes_when_consistent(), test_small_cpi_gap_not_flagged()

### Community 78 - "projection-config.ts"
Cohesion: 0.36
Nodes (8): extractProjectionLineConfigs(), getChildComponentName(), isProjectionLineElement(), mergeProjectionXDomainMax(), mergeProjectionYDomain(), normalizeProjectionData(), projectionDateExtents(), projectionValueExtents()

### Community 79 - "use-highlight-segment.ts"
Cohesion: 0.27
Nodes (8): computeSegmentBounds(), INACTIVE_SEGMENT, HighlightSegment(), HighlightSegmentProps, SeriesHighlightLayer(), SeriesHighlightLayerProps, HighlightSegmentResult, useHighlightSegment()

### Community 80 - "line-loading-pulse.tsx"
Cohesion: 0.23
Nodes (10): ChartLoadingLabel(), ChartLoadingLabelProps, ShimmeringText(), ShimmeringTextProps, LINE_LOADING_LOOP_PAUSE_MS, LINE_LOADING_PULSE_CYCLE_S, LINE_LOADING_PULSE_EASE, LOADING_LABEL_EXIT_S (+2 more)

### Community 81 - "use-animated-series-path.ts"
Cohesion: 0.35
Nodes (9): computeSeriesPathPoints(), CurveFactory, interpolateSeriesPathPoints(), seriesPathFromPoints(), SeriesPathPoint, seriesPathTransitionSignature(), CurveFactory, useAnimatedSeriesPath() (+1 more)

### Community 82 - "BaseYearRepository"
Cohesion: 0.07
Nodes (11): 1. Elimination of Mock Data & Hardcoding, Comprehensive Summary of Improvements & Remediation, GdpRevisionController, RevisionEntryDto, RevisionHistoryResponse, Revision, RevisionRepository, GdpRevisionService (+3 more)

### Community 83 - "compute_revision_stats"
Cohesion: 0.27
Nodes (5): compute_revision_stats(), RevisionStats, test_downward_bias_detected(), test_empty_revisions(), test_upward_bias_detected()

### Community 84 - "devDependencies"
Cohesion: 0.20
Nodes (10): devDependencies, eslint, eslint-config-next, tailwindcss, @tailwindcss/postcss, @types/d3-shape, @types/node, @types/react (+2 more)

### Community 85 - "line-chart-loading.tsx"
Cohesion: 0.24
Nodes (7): LoadingStyle, generateChartSkeletonData(), GenerateChartSkeletonDataOptions, generateChartSkeletonFromTarget(), LineChartLoading(), LineChartLoadingProps, @visx/curve

### Community 86 - "reference-area-config.ts"
Cohesion: 0.16
Nodes (14): extractReferenceAreaConfigs(), getChildComponentName(), isReferenceAreaElement(), ReferenceAreaConfig, ReferenceAreaConfigProps, ReferenceAreaRegistrationContext, ReferenceAreaRegistrationContextValue, buildYScalesFromDomains() (+6 more)

### Community 87 - "Files Created (by service)"
Cohesion: 0.20
Nodes (10): apps/web (Next.js 15 + TypeScript + Tailwind v4), Files Created (by service), infra, packages/contracts, Root / Governance, services/ai (Python 3.13 + FastAPI), services/api (Spring Boot 4.0.0 / Java 21), services/database (+2 more)

### Community 90 - "bar-chart.json"
Cohesion: 0.22
Nodes (8): dependencies, description, files, name, registryDependencies, $schema, title, type

### Community 91 - "pie-chart.json"
Cohesion: 0.22
Nodes (8): dependencies, description, files, name, registryDependencies, $schema, title, type

### Community 92 - "ring-chart.json"
Cohesion: 0.22
Nodes (8): dependencies, description, files, name, registryDependencies, $schema, title, type

### Community 93 - "README.md"
Cohesion: 0.22
Nodes (5): ArthaLens — Threat Model, Assets to Protect, Notes, Out of Scope (Initial Release), Trust Boundaries

### Community 94 - "ArthaLens — Architecture Overview"
Cohesion: 0.22
Nodes (8): ArthaLens — Architecture Overview, Data Flow, Ingestion Flow, Performance Considerations, RAG Query Flow, Security Boundaries, Series Isolation, System Components

### Community 95 - "rolling_correlations.py"
Cohesion: 0.33
Nodes (3): compute_rolling_correlations(), rolling_pearson(), RollingCorrelationResult

### Community 98 - "deploy"
Cohesion: 0.25
Nodes (7): build, builder, deploy, restartPolicyMaxRetries, restartPolicyType, startCommand, $schema

### Community 99 - "ArthaLens System Architecture & End-to-End Improvements"
Cohesion: 0.25
Nodes (7): 2. Database & Data Model Improvements, 4. Frontend & User Experience Improvements, 5. Ingestion Pipeline & Quality Assurance, 6. Scalability, Caching & Efficiency Architecture, Architectural Alignment with System Specification, ArthaLens System Architecture & End-to-End Improvements, Flyway Migrations Created & Seeded

### Community 101 - "services/ingestion"
Cohesion: 0.25
Nodes (7): Adapters, Pipeline, Run Tests, Scheduler, services/ingestion, Setup, Source Registry

### Community 102 - "citation.py"
Cohesion: 0.31
Nodes (3): Citation, GroundedResponse, map_citations()

### Community 103 - "Models Inventory"
Cohesion: 0.29
Nodes (6): 1. Economic Consistency Analyzer, 2. Time-Series Growth Forecaster, 3. Anomaly & Deflator Discrepancy Detector, ArthaLens ML Model Card & Diagnostic Specifications, Models Inventory, Overview

### Community 104 - "Evaluation Dimensions"
Cohesion: 0.29
Nodes (6): 1. Groundedness & Faithfulness, 2. Prompt Injection & Security Defense, 3. Source Verification Protocol, ArthaLens RAG Evaluation Guide & Safety Benchmarks, Evaluation Dimensions, Overview

### Community 105 - "Common Issues and Solutions"
Cohesion: 0.29
Nodes (6): 1. PostgreSQL / pgvector Connection, 2. Flyway Migration Failures, 3. Node.js & Next.js Build, 4. Python Virtual Environments, ArthaLens Local Setup & Troubleshooting Guide, Common Issues and Solutions

### Community 106 - "services/ai — AI/RAG/LLM Service"
Cohesion: 0.29
Nodes (6): Behavior Contract, Configuration, Run, services/ai — AI/RAG/LLM Service, Setup, Source Priority

### Community 107 - "marker-group.tsx"
Cohesion: 0.29
Nodes (12): ChartMarkers(), ChartMarkersProps, MarkerTooltipContent(), MarkerTooltipContentProps, useActiveMarkers(), ChartMarker, MarkerCircle(), MarkerCircleHTML() (+4 more)

### Community 108 - "contact/route.ts"
Cohesion: 0.40
Nodes (5): ContactSchema, isRateLimited(), POST(), rateLimitMap, zod

### Community 109 - "ADR-001: Monorepo Structure"
Cohesion: 0.33
Nodes (5): ADR-001: Monorepo Structure, Consequences, Context, Decision, Rationale

### Community 110 - "ADR-002: PostgreSQL as Primary Database with pgvector"
Cohesion: 0.33
Nodes (5): ADR-002: PostgreSQL as Primary Database with pgvector, Consequences, Context, Decision, Rationale

### Community 111 - "ADR-004: Strict GDP Series Isolation (2011-12 vs 2022-23 Base Year)"
Cohesion: 0.33
Nodes (5): ADR-004: Strict GDP Series Isolation (2011-12 vs 2022-23 Base Year), Consequences, Context, Decision, Rationale

### Community 112 - "query"
Cohesion: 0.40
Nodes (3): query(), QueryRequest, QueryResponse

### Community 113 - "services/ml — ML & Statistics Service"
Cohesion: 0.33
Nodes (5): Endpoints, Key Design Principles, Run, services/ml — ML & Statistics Service, Setup

### Community 114 - "scripts"
Cohesion: 0.40
Nodes (5): scripts, build, dev, lint, start

### Community 115 - "SectorDonutChart.tsx"
Cohesion: 0.43
Nodes (6): PieCenter(), PieChart(), Props, SECTOR_PALETTE, SectorDonutChart(), SectorData

### Community 116 - "y-axis-ticks.ts"
Cohesion: 0.40
Nodes (3): Y_AXIS_DEFAULT_TICK_COUNT, Y_AXIS_MAX_TICK_COUNT, Y_AXIS_MIN_TICK_COUNT

### Community 117 - "Changelog"
Cohesion: 0.40
Nodes (4): [0.1.0] - 2026-09-10, [0.5.0] - 2026-09-10, Added, Changelog

### Community 119 - "services/database — Schema & Migrations"
Cohesion: 0.40
Nodes (4): Key Design Principles, Migration Files, Seeds, services/database — Schema & Migrations

### Community 120 - "vercel.json"
Cohesion: 0.40
Nodes (4): buildCommand, framework, installCommand, $schema

### Community 121 - "web/README.md"
Cohesion: 0.50
Nodes (3): Deploy on Vercel, Getting Started, Learn More

### Community 122 - "WidgetGrid"
Cohesion: 0.39
Nodes (8): clampSpan(), contains(), moveItem(), narrowSpan(), normalizeLayout(), sizeForSpan(), WidgetCell(), WidgetGrid()

### Community 123 - "ArthaLens — Data Dictionary"
Cohesion: 0.29
Nodes (7): ArthaLens — Data Dictionary, GDP & National Accounts, Observation Status, Periods & Frequencies, Price Indices & Deflators, Sectors (NAS Classification), Sovereign Ratings

### Community 167 - "BklitGdpLineChart.tsx"
Cohesion: 0.16
Nodes (20): ChartBrush(), ChartBrushLayout(), LineChart(), ChartTooltip(), XAxis(), BklitDeflatorLineChart(), DEFAULT_DEFLATOR_SERIES, parseQuarterToDate() (+12 more)

### Community 169 - ".advance"
Cohesion: 0.18
Nodes (7): createBody(), GridEngine, isSettled(), near(), r2(), r3(), snapBody()

### Community 170 - "MacroTelemetryWidgetGrid.tsx"
Cohesion: 0.33
Nodes (6): MacroTelemetryWidgetGrid(), MacroTelemetryWidgetGridProps, WidgetGridItem, WidgetLayoutItem, WidgetSize, DashboardResponse

### Community 171 - "ArthaLens 🇮🇳"
Cohesion: 0.29
Nodes (7): API Endpoints, Architecture, ArthaLens 🇮🇳, Data Policy & Governance, Documentation Links, Primary Data Sources, Test Results & Verification

## Knowledge Gaps
- **37 isolated node(s):** `@types/d3-array`, `@types/three`, `@visx/gradient`, `axios`, `date-fns` (+32 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 1018 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)
- **57 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `react` connect `react` to `intelligence/page.tsx`, `widget-grid.tsx`, `MacroAccountsWorkspace.tsx`, `react`, `chart-tooltip.tsx`, `app/layout.tsx`, `app/page.tsx`, `contact/page.tsx`, `bklit/index.ts`, `line-chart.tsx`, `web/package.json`, `bar-chart.tsx`, `series-markers.tsx`, `time-series-chart-shell.tsx`, `pie-chart.tsx`, `chart-context.tsx`, `pie-slice.tsx`, `LivingEconomyLandscape.tsx`, `y-domain-utils.ts`, `bar-squares.tsx`, `x-axis.tsx`, `BklitGdpLineChart.tsx`, `line.tsx`, `useChartStable`, `ring-chart.tsx`, `MacroTelemetryWidgetGrid.tsx`, `pie-center.tsx`, `grid.tsx`, `bar.tsx`, `BklitGlobalBarChart.tsx`, `pattern-preset.tsx`, `motion`, `observatory/page.tsx`, `loading-sweep.tsx`, `dot-field.tsx`, `series-dash-tail-overlay.tsx`, `projection-config.ts`, `use-highlight-segment.ts`, `line-loading-pulse.tsx`, `use-animated-series-path.ts`, `line-chart-loading.tsx`, `reference-area-config.ts`, `marker-group.tsx`, `SectorDonutChart.tsx`?**
  _High betweenness centrality (0.141) - this node is a cross-community bridge._
- **What connects `@types/d3-array`, `@types/three`, `@visx/gradient` to the rest of the system?**
  _37 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `intelligence/page.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.0654320987654321 - nodes in this community are weakly interconnected._
- **Why does `DocumentChunk` connect `test_rag_ingestion.py` to `provenance.py`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `ref_next` be split into smaller, more focused modules?**
  _Cohesion score 0.03333333333333333 - nodes in this community are weakly interconnected._
- **Why does `ArthaLens — Data Dictionary` connect `ArthaLens — Data Dictionary` to `test_rag_ingestion.py`, `README.md`?**
  _High betweenness centrality (0.028) - this node is a cross-community bridge._
- **Should `GdpServiceTest.java` be split into smaller, more focused modules?**
  _Cohesion score 0.09935064935064936 - nodes in this community are weakly interconnected._