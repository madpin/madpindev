---
layout: adhdpage
title: "ADHD Assessment Demo"
description: "Interactive ADHD assessment style demo (no webcam, not diagnostic)"
slug: "adhd-assessment"
comments: false
---
<!-- markdownlint-disable MD033 -->

<link rel="stylesheet" href="/css/adhd-assessment.css" />
{{< rawhtml >}}
<div id="adhd-app-root">
  <div class="adhd-container">
    <div id="startScreen" class="screen active">
      <h1>ADHD Assessment Demo</h1>
      <p>This is a demonstration tool inspired by clinical ADHD assessments. It is <strong>NOT</strong> a diagnostic tool.</p>
      <div class="config-section">
        <div class="config-group">
          <label for="testDuration">Test Duration (minutes):</label>
          <input type="number" id="testDuration" min="1" max="10" value="3" />
        </div>
        <div class="config-group">
          <label for="stimulusDuration">Stimulus Display Time (seconds):</label>
          <select id="stimulusDuration">
            <option value="1">1 second (Easy)</option>
            <option value="1.5" selected>1.5 seconds (Medium)</option>
            <option value="2">2 seconds (Hard)</option>
          </select>
        </div>
      </div>
      <div class="instructions">
        <h3>Test Instructions</h3>
        <ul>
          <li>Press the <strong>SPACEBAR</strong> only when you see the <strong>same shape and color appear consecutively</strong>.</li>
          <li>If shape OR color changes, do NOT press.</li>
          <li>Respond quickly and accurately.</li>
          <li>The test lasts about <span id="durationDisplay">3</span> minutes.</li>
        </ul>
      </div>
      <div id="startMessage" class="status-message status-info">Press Start when ready. (Webcam & movement tracking removed for privacy.)</div>
      <button id="startBtn">Start Test</button>
      <button id="demoBtn">View Demo Results</button>
    </div>
    <div id="testScreen" class="screen">
      <h1>Assessment in Progress</h1>
      <p>Press SPACEBAR only when the same shape and color appear consecutively.</p>
      <div class="progress-container"><div id="progressBar" class="progress-bar"></div></div>
      <div id="testMessage" class="status-message status-info">Get ready... starting...</div>
      <div class="test-area">
        <div id="stimulus"></div>
      </div>
      <div>
        <button id="pauseBtn">Pause Test</button>
        <button id="stopBtn">Stop Test</button>
      </div>
    </div>
    <div id="resultsScreen" class="screen">
      <h1>Assessment Results</h1>
      <p>Demonstration only — not diagnostic.</p>
      <div class="results-container">
        <div class="result-card">
          <h3>Performance Metrics</h3>
          <div class="metric"><span>Missed Targets:</span><span id="omissionErrors" class="metric-value">0</span></div>
          <div class="metric"><span>False Alarms:</span><span id="commissionErrors" class="metric-value">0</span></div>
          <div class="metric"><span>Average Reaction Time:</span><span id="avgReactionTime" class="metric-value">0ms</span></div>
          <div class="metric"><span>Reaction Time Variability:</span><span id="rtVariability" class="metric-value">0ms</span></div>
          <div class="metric"><span>Accuracy:</span><span id="accuracy" class="metric-value">0%</span></div>
        </div>
      </div>
      <div>
        <button id="restartBtn">Restart Test</button>
        <button id="exportBtn">Export Results</button>
      </div>
    </div>
    <div class="footer">
      <p>This demo removes webcam usage for privacy. All processing happens locally.</p>
    </div>
  </div>
 </div>
<script src="/js/adhd-assessment.js"></script>
{{< /rawhtml >}}
