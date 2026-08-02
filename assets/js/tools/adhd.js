(() => {
  "use strict";

  const STATES = Object.freeze({
    IDLE: "idle",
    RUNNING: "running",
    PAUSED: "paused",
    RESULTS: "results"
  });

  const PHASES = Object.freeze({
    GAP: "gap",
    VISIBLE: "visible"
  });

  const SHAPES = Object.freeze(["circle", "square"]);
  const COLORS = Object.freeze(["blue", "orange"]);
  const INITIAL_DELAY_MS = 700;
  const MIN_GAP_MS = 400;
  const MAX_GAP_MS = 2200;
  const PROGRESS_TICK_MS = 100;

  const requiredElement = (root, selector) => {
    const element = root.querySelector(selector);
    if (!element) {
      throw new Error(`ADHD demo element not found: ${selector}`);
    }
    return element;
  };

  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

  const roundMilliseconds = (value) => Math.max(0, Math.round(value));

  class NamedTimers {
    constructor() {
      this.timers = new Map();
    }

    set(name, callback, delay) {
      this.clear(name);
      const timer = window.setTimeout(() => {
        this.timers.delete(name);
        callback();
      }, Math.max(0, delay));
      this.timers.set(name, timer);
    }

    clear(name) {
      const timer = this.timers.get(name);
      if (timer !== undefined) {
        window.clearTimeout(timer);
        this.timers.delete(name);
      }
    }

    clearAll() {
      this.timers.forEach((timer) => window.clearTimeout(timer));
      this.timers.clear();
    }
  }

  class AttentionTaskDemo {
    constructor(root) {
      this.root = root;
      this.timers = new NamedTimers();
      this.downloadUrl = null;
      this.elements = this.collectElements();
      this.handleKeydown = this.handleKeydown.bind(this);
      this.handleVisibilityChange = this.handleVisibilityChange.bind(this);
      this.handlePageHide = this.handlePageHide.bind(this);
      this.bindEvents();
      this.resetSessionData();
      this.setState(STATES.IDLE);
      this.syncResponseControl();
    }

    collectElements() {
      const screens = new Map();
      this.root.querySelectorAll("[data-screen]").forEach((screen) => {
        screens.set(screen.dataset.screen, screen);
      });

      const metrics = new Map();
      this.root.querySelectorAll("[data-metric]").forEach((metric) => {
        metrics.set(metric.dataset.metric, metric);
      });

      return {
        screens,
        metrics,
        settingsForm: requiredElement(this.root, "[data-settings-form]"),
        durationInput: requiredElement(this.root, "[data-duration-input]"),
        stimulusDurationInput: requiredElement(this.root, "[data-stimulus-duration-input]"),
        startStatus: requiredElement(this.root, "[data-start-status]"),
        testStatus: requiredElement(this.root, "[data-test-status]"),
        resultsStatus: requiredElement(this.root, "[data-results-status]"),
        resultsSummary: requiredElement(this.root, "[data-results-summary]"),
        progress: requiredElement(this.root, "[data-progress]"),
        timeRemaining: requiredElement(this.root, "[data-time-remaining]"),
        stimulus: requiredElement(this.root, "[data-stimulus]"),
        stimulusLive: requiredElement(this.root, "[data-stimulus-live]"),
        pausedLabel: requiredElement(this.root, "[data-paused-label]"),
        responseButton: requiredElement(this.root, "[data-action='response']"),
        pauseButton: requiredElement(this.root, "[data-action='pause']"),
        stopButton: requiredElement(this.root, "[data-action='stop']"),
        demoButton: requiredElement(this.root, "[data-action='demo']"),
        restartButton: requiredElement(this.root, "[data-action='restart']"),
        exportButton: requiredElement(this.root, "[data-action='export']")
      };
    }

    bindEvents() {
      this.elements.settingsForm.addEventListener("submit", (event) => {
        event.preventDefault();
        this.startSession();
      });
      this.elements.demoButton.addEventListener("click", () => this.showExampleResults());
      this.elements.responseButton.addEventListener("click", () => this.recordResponse("button"));
      this.elements.pauseButton.addEventListener("click", () => this.togglePause());
      this.elements.stopButton.addEventListener("click", () => this.endSession("stopped"));
      this.elements.restartButton.addEventListener("click", () => this.restart());
      this.elements.exportButton.addEventListener("click", () => this.exportResults());
      document.addEventListener("keydown", this.handleKeydown);
      document.addEventListener("visibilitychange", this.handleVisibilityChange);
      window.addEventListener("pagehide", this.handlePageHide);
    }

    resetSessionData() {
      this.config = null;
      this.state = STATES.IDLE;
      this.elapsedBeforeRunMs = 0;
      this.runStartedAt = null;
      this.phase = null;
      this.previousStimulus = null;
      this.currentStimulus = null;
      this.stimuli = [];
      this.responses = [];
      this.metrics = null;
      this.sessionStartedAt = null;
      this.sessionEndedAt = null;
      this.completionReason = null;
      this.isExample = false;
    }

    readConfig() {
      const durationSeconds = Number(this.elements.durationInput.value);
      const stimulusDurationMs = Number(this.elements.stimulusDurationInput.value);
      return {
        durationMs: clamp(Number.isFinite(durationSeconds) ? durationSeconds * 1000 : 180000, 1000, 600000),
        stimulusDurationMs: clamp(Number.isFinite(stimulusDurationMs) ? stimulusDurationMs : 1500, 250, 5000)
      };
    }

    setState(state) {
      this.state = state;
      this.root.dataset.state = state;
      const paused = state === STATES.PAUSED;
      this.elements.pausedLabel.hidden = !paused;
      this.elements.pauseButton.textContent = paused ? "Resume" : "Pause";
      this.elements.pauseButton.setAttribute("aria-pressed", String(paused));
    }

    showScreen(name, moveFocus = true) {
      this.elements.screens.forEach((screen, screenName) => {
        screen.hidden = screenName !== name;
      });
      if (!moveFocus) {
        return;
      }
      const screen = this.elements.screens.get(name);
      const heading = screen ? screen.querySelector("h1") : null;
      if (heading) {
        heading.focus({ preventScroll: true });
      }
    }

    startSession() {
      this.timers.clearAll();
      this.releaseDownloadUrl();
      this.resetSessionData();
      this.config = this.readConfig();
      this.sessionStartedAt = new Date().toISOString();
      this.runStartedAt = performance.now();
      this.setState(STATES.RUNNING);
      this.clearStimulus();
      this.elements.resultsStatus.textContent = "";
      this.showScreen("test");
      this.updateProgress();
      this.beginPhase(PHASES.GAP, INITIAL_DELAY_MS);
      this.scheduleEnd();
      this.scheduleProgressTick();
      this.elements.testStatus.textContent = "Task started. Wait for the first item.";
      this.syncResponseControl();
    }

    beginPhase(kind, durationMs) {
      this.phase = {
        kind,
        remainingMs: Math.max(0, durationMs),
        deadline: null
      };
      this.scheduleCurrentPhase();
    }

    scheduleCurrentPhase() {
      if (this.state !== STATES.RUNNING || !this.phase) {
        return;
      }
      const phase = this.phase;
      phase.deadline = performance.now() + phase.remainingMs;
      this.timers.set("presentation", () => {
        if (this.state !== STATES.RUNNING || this.phase !== phase) {
          return;
        }
        phase.remainingMs = 0;
        phase.deadline = null;
        if (phase.kind === PHASES.GAP) {
          this.presentStimulus();
        } else {
          this.finishStimulus();
        }
      }, phase.remainingMs);
    }

    presentStimulus() {
      const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
      const color = COLORS[Math.floor(Math.random() * COLORS.length)];
      const isTarget = Boolean(
        this.previousStimulus &&
        this.previousStimulus.shape === shape &&
        this.previousStimulus.color === color
      );
      const stimulus = {
        id: this.stimuli.length + 1,
        onsetMs: roundMilliseconds(this.getElapsed()),
        shape,
        color,
        isTarget,
        responded: false,
        responseId: null
      };

      this.stimuli.push(stimulus);
      this.currentStimulus = stimulus;
      this.elements.stimulus.dataset.shape = shape;
      this.elements.stimulus.dataset.color = color;
      this.elements.stimulus.setAttribute("aria-label", `${color} ${shape}`);
      this.elements.stimulus.hidden = false;
      this.elements.stimulusLive.textContent = `Item ${stimulus.id}: ${color} ${shape}.`;
      this.beginPhase(PHASES.VISIBLE, this.config.stimulusDurationMs);
      this.syncResponseControl();
    }

    finishStimulus() {
      if (this.currentStimulus) {
        this.previousStimulus = {
          shape: this.currentStimulus.shape,
          color: this.currentStimulus.color
        };
      }
      this.currentStimulus = null;
      this.clearStimulus();
      this.syncResponseControl();
      const gap = MIN_GAP_MS + Math.random() * (MAX_GAP_MS - MIN_GAP_MS);
      this.beginPhase(PHASES.GAP, gap);
    }

    clearStimulus() {
      this.elements.stimulus.hidden = true;
      this.elements.stimulus.removeAttribute("data-shape");
      this.elements.stimulus.removeAttribute("data-color");
      this.elements.stimulus.removeAttribute("aria-label");
      this.elements.stimulusLive.textContent = "";
    }

    recordResponse(inputMethod) {
      if (this.state !== STATES.RUNNING) {
        return;
      }
      if (!this.currentStimulus || this.phase?.kind !== PHASES.VISIBLE) {
        this.elements.testStatus.textContent = "Wait for the next item before responding.";
        return;
      }
      if (this.currentStimulus.responded) {
        this.elements.testStatus.textContent = "A response is already recorded for this item.";
        return;
      }

      const elapsedMs = this.getElapsed();
      const response = {
        id: this.responses.length + 1,
        elapsedMs: roundMilliseconds(elapsedMs),
        stimulusId: this.currentStimulus.id,
        reactionTimeMs: roundMilliseconds(elapsedMs - this.currentStimulus.onsetMs),
        isTarget: this.currentStimulus.isTarget,
        correct: this.currentStimulus.isTarget,
        inputMethod
      };

      this.currentStimulus.responded = true;
      this.currentStimulus.responseId = response.id;
      this.responses.push(response);
      this.elements.testStatus.textContent = "Response recorded.";
      this.syncResponseControl();
    }

    syncResponseControl() {
      const available = Boolean(
        this.state === STATES.RUNNING &&
        this.currentStimulus &&
        this.phase?.kind === PHASES.VISIBLE &&
        !this.currentStimulus.responded
      );
      this.elements.responseButton.setAttribute("aria-disabled", String(!available));
      if (this.state === STATES.PAUSED) {
        this.elements.responseButton.textContent = "Paused — resume to respond";
      } else if (this.currentStimulus?.responded) {
        this.elements.responseButton.textContent = "Response recorded";
      } else {
        this.elements.responseButton.textContent = "Same — respond";
      }
    }

    getElapsed(now = performance.now()) {
      if (this.state === STATES.RUNNING && this.runStartedAt !== null) {
        return this.elapsedBeforeRunMs + Math.max(0, now - this.runStartedAt);
      }
      return this.elapsedBeforeRunMs;
    }

    freezeClock(now = performance.now()) {
      this.elapsedBeforeRunMs = this.getElapsed(now);
      this.runStartedAt = null;
    }

    togglePause() {
      if (this.state === STATES.RUNNING) {
        this.pauseSession("Task paused. Timing is stopped.");
      } else if (this.state === STATES.PAUSED) {
        this.resumeSession();
      }
    }

    pauseSession(message) {
      if (this.state !== STATES.RUNNING) {
        return;
      }
      const now = performance.now();
      if (this.phase?.deadline !== null) {
        this.phase.remainingMs = Math.max(0, this.phase.deadline - now);
        this.phase.deadline = null;
      }
      this.freezeClock(now);
      this.timers.clearAll();
      this.setState(STATES.PAUSED);
      this.elements.stimulusLive.textContent = "Task paused.";
      this.elements.testStatus.textContent = message;
      this.updateProgress();
      this.syncResponseControl();
    }

    resumeSession() {
      if (this.state !== STATES.PAUSED || !this.config) {
        return;
      }
      if (this.elapsedBeforeRunMs >= this.config.durationMs) {
        this.endSession("completed");
        return;
      }
      this.runStartedAt = performance.now();
      this.setState(STATES.RUNNING);
      this.elements.testStatus.textContent = "Task resumed. Timing is running.";
      if (this.currentStimulus && this.phase?.kind === PHASES.VISIBLE) {
        this.elements.stimulusLive.textContent = `Current item: ${this.currentStimulus.color} ${this.currentStimulus.shape}.`;
      } else {
        this.elements.stimulusLive.textContent = "";
      }
      this.scheduleCurrentPhase();
      this.scheduleEnd();
      this.scheduleProgressTick();
      this.syncResponseControl();
    }

    scheduleEnd() {
      const remainingMs = Math.max(0, this.config.durationMs - this.getElapsed());
      this.timers.set("end", () => this.endSession("completed"), remainingMs);
    }

    scheduleProgressTick() {
      if (this.state !== STATES.RUNNING) {
        return;
      }
      this.updateProgress();
      this.timers.set("progress", () => this.scheduleProgressTick(), PROGRESS_TICK_MS);
    }

    updateProgress() {
      if (!this.config) {
        return;
      }
      const elapsedMs = clamp(this.getElapsed(), 0, this.config.durationMs);
      const progressValue = this.config.durationMs > 0 ? (elapsedMs / this.config.durationMs) * 100 : 100;
      const roundedProgress = Math.round(progressValue);
      const remainingMs = Math.max(0, this.config.durationMs - elapsedMs);
      const remainingText = `${this.formatClock(remainingMs)} remaining`;
      this.elements.progress.value = progressValue;
      this.elements.progress.textContent = `${roundedProgress}%`;
      this.elements.progress.setAttribute("aria-valuetext", remainingText);
      this.elements.timeRemaining.textContent = remainingText;
    }

    formatClock(milliseconds) {
      const totalSeconds = Math.max(0, Math.ceil(milliseconds / 1000));
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = String(totalSeconds % 60).padStart(2, "0");
      return `${minutes}:${seconds}`;
    }

    endSession(reason) {
      if (this.state !== STATES.RUNNING && this.state !== STATES.PAUSED) {
        return;
      }
      if (this.state === STATES.RUNNING) {
        this.freezeClock();
      }
      this.elapsedBeforeRunMs = Math.min(this.elapsedBeforeRunMs, this.config.durationMs);
      this.timers.clearAll();
      this.phase = null;
      this.currentStimulus = null;
      this.clearStimulus();
      this.completionReason = reason;
      this.sessionEndedAt = new Date().toISOString();
      this.metrics = this.calculateMetrics();
      this.setState(STATES.RESULTS);
      this.syncResponseControl();
      this.renderResults();
      this.showScreen("results");
      this.elements.resultsStatus.textContent = reason === "completed"
        ? "Task complete. Results are ready."
        : "Task stopped early. Results so far are ready.";
    }

    calculateMetrics() {
      const targets = this.stimuli.filter((stimulus) => stimulus.isTarget);
      const nonTargets = this.stimuli.filter((stimulus) => !stimulus.isTarget);
      const hits = targets.filter((stimulus) => stimulus.responded).length;
      const correctRejections = nonTargets.filter((stimulus) => !stimulus.responded).length;
      const omissionErrors = targets.length - hits;
      const commissionErrors = nonTargets.length - correctRejections;
      const reactionTimes = this.responses
        .filter((response) => response.correct)
        .map((response) => response.reactionTimeMs);
      const averageReactionTimeMs = reactionTimes.length
        ? reactionTimes.reduce((sum, value) => sum + value, 0) / reactionTimes.length
        : null;
      let reactionTimeVariabilityMs = null;

      if (reactionTimes.length > 1) {
        const squaredDifferences = reactionTimes.reduce(
          (sum, value) => sum + ((value - averageReactionTimeMs) ** 2),
          0
        );
        reactionTimeVariabilityMs = Math.sqrt(squaredDifferences / (reactionTimes.length - 1));
      }

      return {
        trials: this.stimuli.length,
        targets: targets.length,
        hits,
        correctRejections,
        omissionErrors,
        commissionErrors,
        averageReactionTimeMs,
        reactionTimeVariabilityMs,
        accuracyPercent: this.stimuli.length
          ? ((hits + correctRejections) / this.stimuli.length) * 100
          : null
      };
    }

    renderResults() {
      const values = {
        omissionErrors: String(this.metrics.omissionErrors),
        commissionErrors: String(this.metrics.commissionErrors),
        averageReactionTime: this.formatMetricTime(this.metrics.averageReactionTimeMs),
        reactionTimeVariability: this.formatMetricTime(this.metrics.reactionTimeVariabilityMs),
        accuracy: this.metrics.accuracyPercent === null
          ? "Not available"
          : `${this.metrics.accuracyPercent.toFixed(1)}%`
      };

      Object.entries(values).forEach(([name, value]) => {
        const element = this.elements.metrics.get(name);
        if (element) {
          element.textContent = value;
        }
      });

      if (this.isExample) {
        this.elements.resultsSummary.textContent = "These are example values, not a measurement of your performance.";
      } else if (this.completionReason === "stopped") {
        this.elements.resultsSummary.textContent = "You stopped early. These values summarize only the items shown before stopping.";
      } else {
        this.elements.resultsSummary.textContent = "You completed the task. These values summarize this session only.";
      }
    }

    formatMetricTime(value) {
      return value === null ? "Not available" : `${Math.round(value)} ms`;
    }

    showExampleResults() {
      this.timers.clearAll();
      this.releaseDownloadUrl();
      this.resetSessionData();
      this.config = this.readConfig();
      this.isExample = true;
      this.completionReason = "example";
      this.sessionStartedAt = new Date().toISOString();
      const examples = [
        { shape: "circle", color: "blue", responseTimeMs: null },
        { shape: "circle", color: "blue", responseTimeMs: 480 },
        { shape: "square", color: "blue", responseTimeMs: null },
        { shape: "square", color: "blue", responseTimeMs: null },
        { shape: "square", color: "orange", responseTimeMs: 390 },
        { shape: "circle", color: "orange", responseTimeMs: null },
        { shape: "circle", color: "orange", responseTimeMs: 620 },
        { shape: "circle", color: "blue", responseTimeMs: null }
      ];
      let previous = null;

      examples.forEach((example, index) => {
        const onsetMs = index * 2500;
        const isTarget = Boolean(
          previous &&
          previous.shape === example.shape &&
          previous.color === example.color
        );
        const stimulus = {
          id: index + 1,
          onsetMs,
          shape: example.shape,
          color: example.color,
          isTarget,
          responded: example.responseTimeMs !== null,
          responseId: null
        };
        this.stimuli.push(stimulus);

        if (example.responseTimeMs !== null) {
          const response = {
            id: this.responses.length + 1,
            elapsedMs: onsetMs + example.responseTimeMs,
            stimulusId: stimulus.id,
            reactionTimeMs: example.responseTimeMs,
            isTarget,
            correct: isTarget,
            inputMethod: "example"
          };
          stimulus.responseId = response.id;
          this.responses.push(response);
        }
        previous = example;
      });

      this.elapsedBeforeRunMs = examples.length * 2500;
      this.sessionEndedAt = new Date().toISOString();
      this.metrics = this.calculateMetrics();
      this.setState(STATES.RESULTS);
      this.syncResponseControl();
      this.renderResults();
      this.showScreen("results");
      this.elements.resultsStatus.textContent = "Example results loaded.";
    }

    restart() {
      this.timers.clearAll();
      this.releaseDownloadUrl();
      this.resetSessionData();
      this.clearStimulus();
      this.setState(STATES.IDLE);
      this.syncResponseControl();
      this.elements.startStatus.textContent = "Choose settings, then start when you are ready.";
      this.elements.resultsStatus.textContent = "";
      this.showScreen("start");
    }

    exportResults() {
      if (!this.metrics || !this.config) {
        return;
      }
      this.timers.clear("download");
      this.releaseDownloadUrl();
      const exportData = {
        schemaVersion: 1,
        notice: "Non-diagnostic demonstration data. Do not use for health decisions.",
        testInfo: {
          isExample: this.isExample,
          completionReason: this.completionReason,
          startedAt: this.sessionStartedAt,
          endedAt: this.sessionEndedAt,
          configuredDurationMs: this.config.durationMs,
          activeDurationMs: roundMilliseconds(this.elapsedBeforeRunMs),
          stimulusDurationMs: this.config.stimulusDurationMs
        },
        metrics: {
          ...this.metrics,
          averageReactionTimeMs: this.nullableRoundedValue(this.metrics.averageReactionTimeMs),
          reactionTimeVariabilityMs: this.nullableRoundedValue(this.metrics.reactionTimeVariabilityMs),
          accuracyPercent: this.nullableRoundedValue(this.metrics.accuracyPercent, 1)
        },
        rawData: {
          stimuli: this.stimuli.map((stimulus) => ({ ...stimulus })),
          responses: this.responses.map((response) => ({ ...response }))
        }
      };
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      this.downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = this.downloadUrl;
      link.download = `adhd-attention-demo-${new Date().toISOString().replace(/[:.]/g, "-")}.json`;
      link.hidden = true;
      this.root.append(link);
      link.click();
      link.remove();
      this.elements.resultsStatus.textContent = "JSON results downloaded to your device.";
      this.timers.set("download", () => this.releaseDownloadUrl(), 1000);
    }

    nullableRoundedValue(value, decimalPlaces = 0) {
      if (value === null) {
        return null;
      }
      const factor = 10 ** decimalPlaces;
      return Math.round(value * factor) / factor;
    }

    releaseDownloadUrl() {
      if (this.downloadUrl) {
        URL.revokeObjectURL(this.downloadUrl);
        this.downloadUrl = null;
      }
    }

    handleKeydown(event) {
      if (this.state !== STATES.RUNNING && this.state !== STATES.PAUSED) {
        return;
      }
      if (event.key === "Escape") {
        event.preventDefault();
        this.endSession("stopped");
        return;
      }
      if (this.state !== STATES.RUNNING || event.repeat || !this.root.contains(event.target)) {
        return;
      }
      const isResponseKey = event.code === "Space" || event.key === " " || event.key === "Enter";
      if (!isResponseKey || this.isInteractiveTarget(event.target)) {
        return;
      }
      event.preventDefault();
      this.recordResponse(event.key === "Enter" ? "keyboard-enter" : "keyboard-space");
    }

    isInteractiveTarget(target) {
      return target instanceof Element && Boolean(
        target.closest("button, input, select, textarea, a[href], [contenteditable='true']")
      );
    }

    handleVisibilityChange() {
      if (document.hidden && this.state === STATES.RUNNING) {
        this.pauseSession("Task paused because this page is no longer visible.");
      }
    }

    handlePageHide() {
      if (this.state === STATES.RUNNING) {
        this.pauseSession("Task paused because this page is no longer visible.");
      }
      this.timers.clearAll();
      this.releaseDownloadUrl();
    }
  }

  const initialize = () => {
    document.querySelectorAll("[data-adhd-tool]").forEach((root) => {
      new AttentionTaskDemo(root);
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initialize, { once: true });
  } else {
    initialize();
  }
})();
