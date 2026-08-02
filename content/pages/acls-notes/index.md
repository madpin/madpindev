---
type: tools
layout: acls
hideHero: true
title: "ACLS Review Notes"
description: "Interactive ACLS certification exam review notes"
summary: "Interactive ACLS certification exam review notes"
slug: "acls-notes"
comments: false
---

~~~html
<!-- ACLS Algorithms Section -->
<section class="section" id="algorithms" aria-labelledby="algorithms-heading">
    <h2 class="section-heading" id="algorithms-heading">
        <button class="section-toggle" type="button" aria-expanded="true" aria-controls="algorithms-content">
            <span>1. ACLS Algorithms &amp; Cardiac Rhythms</span>
            <span class="section-toggle-icon" aria-hidden="true"></span>
        </button>
    </h2>
    <div class="section-content" id="algorithms-content">
        <!-- Algorithm Tabs -->
        <div class="algorithm-tabs" role="tablist" aria-label="Cardiac rhythm algorithms">
            <button class="algorithm-tab" type="button" role="tab" id="tab-shockable" aria-controls="shockable" aria-selected="true" data-tab="shockable">Shockable Rhythms</button>
            <button class="algorithm-tab" type="button" role="tab" id="tab-non-shockable" aria-controls="non-shockable" aria-selected="false" tabindex="-1" data-tab="non-shockable">Non-Shockable Rhythms</button>
            <button class="algorithm-tab" type="button" role="tab" id="tab-bradycardia" aria-controls="bradycardia" aria-selected="false" tabindex="-1" data-tab="bradycardia">Bradycardia</button>
            <button class="algorithm-tab" type="button" role="tab" id="tab-tachycardia" aria-controls="tachycardia" aria-selected="false" tabindex="-1" data-tab="tachycardia">Tachycardia</button>
            <button class="algorithm-tab" type="button" role="tab" id="tab-post-cardiac" aria-controls="post-cardiac" aria-selected="false" tabindex="-1" data-tab="post-cardiac">Post-Cardiac Arrest</button>
        </div>

        <!-- Shockable Rhythms Content -->
        <div class="algorithm-content" id="shockable" role="tabpanel" tabindex="0" aria-labelledby="tab-shockable">
            <h3>Shockable Rhythms: VF/Pulseless VT Management</h3>

            <div class="critical-details">
                <div class="critical-details-title">
                    Priority: IMMEDIATE defibrillation - highest priority intervention for cardiac arrest survival
                </div>
            </div>

            <h4>Energy Levels (Critical for Exam):</h4>
            <section class="table-scroll" tabindex="0" aria-label="Defibrillation energy levels">
                <table class="energy-table">
                    <caption>Defibrillation energy levels</caption>
                    <thead>
                        <tr>
                            <th scope="col">Defibrillator Type</th>
                            <th scope="col">Initial Shock</th>
                            <th scope="col">Subsequent Shocks</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Biphasic</td>
                            <td>120-200J</td>
                            <td>Same or higher energy</td>
                        </tr>
                        <tr>
                            <td>Monophasic</td>
                            <td>360J</td>
                            <td>360J</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <p><strong>Never delay defibrillation</strong> for IV access or intubation</p>

            <h4>Complete Algorithm Sequence:</h4>
            <div class="algorithm-steps">
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Immediate CPR + defibrillation</div>
                    <p>Minimize pre-shock pause</p>
                </div>
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Resume CPR immediately</div>
                    <p>After shock for 2 minutes (do NOT check pulse)</p>
                </div>
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Rhythm check</div>
                    <p>&lt;10 seconds every 2 minutes</p>
                </div>
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Second shock</div>
                    <p>If VF/VT persists</p>
                </div>
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Epinephrine 1mg IV/IO</div>
                    <p>After 2nd unsuccessful shock, then every 3-5 minutes</p>
                </div>
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Third shock</div>
                    <p>If rhythm persists</p>
                </div>
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Amiodarone 300mg IV/IO</div>
                    <p>After 3rd unsuccessful shock, then 150mg if needed</p>
                </div>
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Consider advanced airway</div>
                    <p>After initial drugs given</p>
                </div>
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Continue sequence</div>
                    <p>Until ROSC or termination of efforts</p>
                </div>
            </div>

            <div class="critical-details">
                <div class="critical-details-title">
                    Critical Details:
                </div>
                <ul>
                    <li><strong>Compression fraction should exceed 80%</strong> (minimize interruptions)</li>
                    <li><strong>Switch compressors every 2 minutes</strong> (or sooner if fatigued)</li>
                    <li><strong>Continuous compressions</strong> once advanced airway placed (no pauses for ventilation)</li>
                    <li><strong>Consider dual sequential defibrillation</strong> if standard approach fails</li>
                </ul>
            </div>

            <div class="diagram">
                <h4>Ventricular Fibrillation (VF) Rhythm</h4>
                <div class="rhythm-diagram">
                    <div class="rhythm-box" aria-hidden="true">
                        <div class="rhythm-line"></div>
                        <div class="rhythm-pulse vf-pulse"></div>
                    </div>
                    <div class="rhythm-label">Ventricular Fibrillation (VF)</div>
                </div>
            </div>

            <div class="diagram">
                <h4>Ventricular Tachycardia (VT) Rhythm</h4>
                <div class="rhythm-diagram">
                    <div class="rhythm-box" aria-hidden="true">
                        <div class="rhythm-line"></div>
                        <div class="rhythm-pulse vt-pulse"></div>
                    </div>
                    <div class="rhythm-label">Ventricular Tachycardia (VT)</div>
                </div>
            </div>
        </div>

        <!-- Non-Shockable Rhythms Content -->
        <div class="algorithm-content" id="non-shockable" role="tabpanel" tabindex="0" aria-labelledby="tab-non-shockable">
            <h3>Non-Shockable Rhythms: PEA and Asystole</h3>

            <div class="critical-details">
                <div class="critical-details-title">
                    Key Principle: No defibrillation - focus on high-quality CPR and reversible causes
                </div>
            </div>

            <h4>Algorithm Sequence:</h4>
            <div class="algorithm-steps">
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Immediate high-quality CPR</div>
                    <p>Minimize interruptions</p>
                </div>
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Epinephrine 1mg IV/IO</div>
                    <p>As early as feasible, then every 3-5 minutes</p>
                </div>
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Advanced airway</div>
                    <p>When feasible (after initial CPR cycles)</p>
                </div>
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Aggressively search H's and T's</div>
                    <p>Throughout resuscitation</p>
                </div>
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Consider ultrasound</div>
                    <p>To identify reversible causes</p>
                </div>
            </div>

            <h4>Critical Differences from Shockable:</h4>
            <ul>
                <li><strong>Earlier epinephrine</strong> administration (no need to wait for failed shocks)</li>
                <li><strong>More focus on reversible causes</strong> (H's and T's analysis)</li>
                <li><strong>Consider termination</strong> if prolonged without reversible cause</li>
            </ul>

            <h4>Prognosis Factors:</h4>
            <ul>
                <li><strong>Initial rhythm:</strong> PEA has better prognosis than asystole</li>
                <li><strong>ETCO2 &lt;10mmHg</strong> after 20 minutes predicts poor outcome</li>
                <li><strong>No ROSC after 30 minutes</strong> with optimal care suggests futility</li>
            </ul>

            <div class="diagram">
                <h4>Asystole Rhythm</h4>
                <div class="rhythm-diagram">
                    <div class="rhythm-box" aria-hidden="true">
                        <div class="rhythm-line"></div>
                    </div>
                    <div class="rhythm-label">Asystole (Flat Line)</div>
                </div>
            </div>
        </div>

        <!-- Bradycardia Content -->
        <div class="algorithm-content" id="bradycardia" role="tabpanel" tabindex="0" aria-labelledby="tab-bradycardia">
            <h3>Bradycardia Algorithm</h3>

            <h4>Assessment Framework:</h4>
            <div class="algorithm-steps">
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Check for pulse and symptoms</div>
                </div>
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Assess adequacy of perfusion</div>
                </div>
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Identify underlying cause</div>
                </div>
            </div>

            <h4>STABLE Bradycardia (adequate perfusion):</h4>
            <ul>
                <li><strong>Heart rate typically &gt;50 bpm</strong> with adequate blood pressure</li>
                <li><strong>Monitor and observe</strong></li>
                <li><strong>Treat underlying causes</strong> (hypothermia, drugs, electrolytes)</li>
                <li><strong>Prepare for deterioration</strong></li>
            </ul>

            <h4>UNSTABLE Bradycardia (poor perfusion/symptoms):</h4>
            <ul>
                <li><strong>Symptoms:</strong> Altered mental status, chest pain, hypotension, signs of shock</li>
                <li><strong>Heart rate typically &lt;50 bpm</strong> or inadequate for clinical condition</li>
            </ul>

            <h4>Treatment Sequence:</h4>
            <div class="algorithm-steps">
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Atropine 1mg IV/IO</div>
                    <p>Repeat every 3-5 minutes, maximum 3mg total</p>
                    <p><strong>Mechanism:</strong> Blocks parasympathetic stimulation</p>
                    <p><strong>Less effective in:</strong> Complete heart block, Mobitz Type II, transplanted hearts</p>
                </div>
                <div class="algorithm-step">
                    <div class="algorithm-step-title">If atropine ineffective or contraindicated:</div>
                    <p><strong>Transcutaneous pacing</strong> (immediate if severe)</p>
                    <p><strong>Dopamine infusion:</strong> 5-20 mcg/kg/min</p>
                    <p><strong>Epinephrine infusion:</strong> 2-10 mcg/min</p>
                </div>
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Expert consultation</div>
                    <p>For definitive management</p>
                </div>
            </div>

            <h4>Special Considerations:</h4>
            <ul>
                <li><strong>Inferior MI:</strong> May respond better to atropine</li>
                <li><strong>Anterior MI:</strong> Often requires pacing</li>
                <li><strong>Beta-blocker/CCB overdose:</strong> May need high-dose insulin therapy</li>
            </ul>
        </div>

        <!-- Tachycardia Content -->
        <div class="algorithm-content" id="tachycardia" role="tabpanel" tabindex="0" aria-labelledby="tab-tachycardia">
            <h3>Tachycardia Algorithm</h3>

            <h4>Assessment Framework:</h4>
            <div class="algorithm-steps">
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Check pulse quality and blood pressure</div>
                </div>
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Assess for symptoms of instability</div>
                </div>
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Determine QRS width</div>
                    <p>(&lt;0.12s narrow, ≥0.12s wide)</p>
                </div>
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Evaluate rhythm regularity</div>
                </div>
            </div>

            <h4>UNSTABLE Tachycardia (immediate cardioversion):</h4>
            <ul>
                <li><strong>Symptoms:</strong> Hypotension (SBP &lt;90), altered mental status, chest pain, acute heart failure</li>
                <li><strong>Immediate synchronized cardioversion</strong> (don't delay for IV or sedation if critically unstable)</li>
            </ul>

            <h4>Energy Levels for Cardioversion:</h4>
            <section class="table-scroll" tabindex="0" aria-label="Cardioversion energy levels for tachycardia">
                <table class="energy-table">
                    <caption>Cardioversion energy levels for tachycardia</caption>
                    <thead>
                        <tr>
                            <th scope="col">Rhythm Type</th>
                            <th scope="col">Initial Energy</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Narrow regular (SVT)</td>
                            <td>50-100J</td>
                        </tr>
                        <tr>
                            <td>Narrow irregular (A-fib)</td>
                            <td>120-200J</td>
                        </tr>
                        <tr>
                            <td>Wide regular (VT)</td>
                            <td>100J</td>
                        </tr>
                        <tr>
                            <td>Wide irregular</td>
                            <td><strong>Defibrillation dose</strong> (unsynchronized - treat as VF)</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <h4>STABLE Tachycardia:</h4>

            <h5>Narrow QRS (&lt;0.12 seconds):</h5>
            <ul>
                <li><strong>Regular narrow complex:</strong>
                    <ol>
                        <li>Vagal maneuvers (if no contraindications)</li>
                        <li>Adenosine 6mg IV rapid push → 12mg → 18mg if ineffective</li>
                        <li>Beta-blockers or calcium channel blockers if adenosine fails</li>
                    </ol>
                </li>
                <li><strong>Irregular narrow complex (A-fib):</strong>
                    <ol>
                        <li>Rate control: Beta-blockers, calcium channel blockers</li>
                        <li>Anticoagulation if &gt;48 hours or high stroke risk</li>
                    </ol>
                </li>
            </ul>

            <h5>Wide QRS (≥0.12 seconds):</h5>
            <ul>
                <li><strong>Assume VT if unsure</strong> (treat as potentially lethal)</li>
                <li><strong>Amiodarone 150mg IV over 10 minutes</strong></li>
                <li><strong>Procainamide</strong> alternative (if amiodarone unavailable)</li>
                <li><strong>Avoid adenosine in irregular wide complex</strong></li>
                <li><strong>Expert consultation</strong> strongly recommended</li>
            </ul>
        </div>

        <!-- Post-Cardiac Arrest Content -->
        <div class="algorithm-content" id="post-cardiac" role="tabpanel" tabindex="0" aria-labelledby="tab-post-cardiac">
            <h3>Post-Cardiac Arrest Care (ROSC Protocol)</h3>

            <h4>Immediate ROSC Management (first 20 minutes):</h4>
            <div class="algorithm-steps">
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Confirm ROSC</div>
                    <p>Palpable pulse + measurable blood pressure</p>
                </div>
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Optimize oxygenation</div>
                    <p>Target SpO2 92-98% (avoid hyperoxia)</p>
                </div>
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Optimize ventilation</div>
                    <p>PETCO2 35-40 mmHg, 10 breaths/min</p>
                </div>
                <div class="algorithm-step">
                    <div class="algorithm-step-title">Treat hypotension</div>
                    <p>Maintain SBP ≥90 mmHg, MAP ≥65 mmHg</p>
                </div>
                <div class="algorithm-step">
                    <div class="algorithm-step-title">12-lead ECG immediately</div>
                    <p>Identify STEMI for emergent PCI</p>
                </div>
            </div>

            <h4>Advanced Post-ROSC Care:</h4>
            <ul>
                <li><strong>Temperature management:</strong> 32-36°C × 24 hours (if comatose)</li>
                <li><strong>Avoid hyperthermia:</strong> Especially first 72 hours</li>
                <li><strong>Hemodynamic optimization:</strong> Target MAP 65-100 mmHg</li>
                <li><strong>Seizure management:</strong> Treat if present (EEG monitoring if available)</li>
                <li><strong>Glucose control:</strong> 144-180 mg/dL (avoid hypoglycemia)</li>
            </ul>

            <h4>Neuroprognostication:</h4>
            <ul>
                <li><strong>Wait ≥72 hours</strong> after return to normothermia</li>
                <li><strong>Multimodal assessment:</strong> Clinical exam, imaging, electrophysiology</li>
                <li><strong>Avoid premature withdrawal</strong> of care</li>
            </ul>
        </div>
    </div>
</section>

<!-- Medications Section -->
<section class="section" id="medications" aria-labelledby="medications-heading">
    <h2 class="section-heading" id="medications-heading">
        <button class="section-toggle" type="button" aria-expanded="true" aria-controls="medications-content">
            <span>2. ACLS Medications (Detailed Pharmacology)</span>
            <span class="section-toggle-icon" aria-hidden="true"></span>
        </button>
    </h2>
    <div class="section-content" id="medications-content">
        <!-- Medication Tabs -->
        <div class="algorithm-tabs" role="tablist" aria-label="ACLS medications">
            <button class="algorithm-tab" type="button" role="tab" id="tab-epinephrine" aria-controls="epinephrine" aria-selected="true" data-tab="epinephrine">Epinephrine</button>
            <button class="algorithm-tab" type="button" role="tab" id="tab-amiodarone" aria-controls="amiodarone" aria-selected="false" tabindex="-1" data-tab="amiodarone">Amiodarone</button>
            <button class="algorithm-tab" type="button" role="tab" id="tab-lidocaine" aria-controls="lidocaine" aria-selected="false" tabindex="-1" data-tab="lidocaine">Lidocaine</button>
            <button class="algorithm-tab" type="button" role="tab" id="tab-atropine" aria-controls="atropine" aria-selected="false" tabindex="-1" data-tab="atropine">Atropine</button>
            <button class="algorithm-tab" type="button" role="tab" id="tab-adenosine" aria-controls="adenosine" aria-selected="false" tabindex="-1" data-tab="adenosine">Adenosine</button>
            <button class="algorithm-tab" type="button" role="tab" id="tab-other-drugs" aria-controls="other-drugs" aria-selected="false" tabindex="-1" data-tab="other-drugs">Other Drugs</button>
        </div>

        <!-- Epinephrine Content -->
        <div class="algorithm-content" id="epinephrine" role="tabpanel" tabindex="0" aria-labelledby="tab-epinephrine">
            <div class="medication-card">
                <div class="medication-header">
                    <h3 class="medication-name">Epinephrine (Primary Cardiac Arrest Drug)</h3>
                    <div class="medication-dose">1mg IV/IO</div>
                </div>

                <h4>Mechanism of Action:</h4>
                <ul>
                    <li><strong>Alpha-1 agonism:</strong> Vasoconstriction → ↑ coronary perfusion pressure → ↑ ROSC likelihood</li>
                    <li><strong>Beta-1 agonism:</strong> ↑ heart rate, ↑ contractility, ↑ AV conduction</li>
                    <li><strong>Beta-2 agonism:</strong> Bronchodilation (beneficial in respiratory arrest)</li>
                </ul>

                <h4>Dosing Protocols:</h4>
                <ul>
                    <li><strong>Cardiac arrest:</strong> 1mg IV/IO every 3-5 minutes (no maximum dose)</li>
                    <li><strong>Bradycardia infusion:</strong> 2-10 mcg/min (titrate to effect)</li>
                    <li><strong>Post-arrest hypotension:</strong> 2-10 mcg/min infusion</li>
                    <li><strong>Endotracheal:</strong> 2-2.5mg in 10mL NS (if IV/IO unavailable)</li>
                </ul>

                <h4>Administration Details:</h4>
                <ul>
                    <li><strong>Follow with 20mL saline flush</strong> (ensures delivery to central circulation)</li>
                    <li><strong>Use most proximal IV/IO access</strong> available</li>
                    <li><strong>Continue until ROSC, decision to terminate, or advanced directive</strong></li>
                </ul>

                <h4>Pharmacokinetics:</h4>
                <ul>
                    <li><strong>Onset:</strong> 1-3 minutes IV</li>
                    <li><strong>Peak effect:</strong> 5-10 minutes</li>
                    <li><strong>Half-life:</strong> 2-3 minutes</li>
                    <li><strong>Metabolism:</strong> MAO and COMT in liver, kidney, other tissues</li>
                </ul>

                <div class="critical-details">
                    <div class="critical-details-title">
                        Important Considerations:
                    </div>
                    <ul>
                        <li><strong>Limited evidence for improved survival to discharge</strong></li>
                        <li><strong>May increase ROSC rates</strong> without improving neurological outcomes</li>
                        <li><strong>Higher doses not shown to be beneficial</strong></li>
                        <li><strong>Can worsen myocardial ischemia</strong> (↑ oxygen demand)</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Amiodarone Content -->
        <div class="algorithm-content" id="amiodarone" role="tabpanel" tabindex="0" aria-labelledby="tab-amiodarone">
            <div class="medication-card">
                <div class="medication-header">
                    <h3 class="medication-name">Amiodarone (Antiarrhythmic)</h3>
                    <div class="medication-dose">300mg IV/IO</div>
                </div>

                <h4>Mechanism of Action:</h4>
                <ul>
                    <li><strong>Class III antiarrhythmic:</strong> Primarily blocks potassium channels</li>
                    <li><strong>Also blocks:</strong> Sodium, calcium channels, alpha/beta receptors</li>
                    <li><strong>Prolongs refractory period</strong> in atria and ventricles</li>
                    <li><strong>Decreases automaticity</strong> and AV node conduction</li>
                </ul>

                <h4>VF/Pulseless VT Dosing:</h4>
                <ul>
                    <li><strong>First dose:</strong> 300mg IV/IO push (undiluted acceptable)</li>
                    <li><strong>Second dose:</strong> 150mg IV/IO push if VF/VT persists</li>
                    <li><strong>Maximum:</strong> 2.2g in 24 hours</li>
                </ul>

                <h4>Stable Wide-Complex Tachycardia:</h4>
                <ul>
                    <li><strong>Loading:</strong> 150mg IV over 10 minutes</li>
                    <li><strong>May repeat:</strong> 150mg every 10 minutes as needed</li>
                    <li><strong>Maintenance:</strong> 1mg/min × 6 hours, then 0.5mg/min × 18 hours</li>
                </ul>

                <h4>Post-ROSC Infusion Protocol:</h4>
                <ol>
                    <li><strong>360mg IV over 6 hours</strong> (1mg/min)</li>
                    <li><strong>540mg IV over 18 hours</strong> (0.5mg/min)</li>
                    <li><strong>Total:</strong> 900mg over 24 hours</li>
                </ol>

                <h4>Administration Considerations:</h4>
                <ul>
                    <li><strong>Mix in D5W</strong> for infusions (not normal saline)</li>
                    <li><strong>Use in-line filter</strong> for continuous infusions</li>
                    <li><strong>Glass or polyolefin containers</strong> for &gt;2 hour infusions (prevents drug absorption)</li>
                    <li><strong>Central line preferred</strong> for continuous infusions (high osmolality)</li>
                </ul>

                <h4>Contraindications:</h4>
                <ul>
                    <li><strong>Sinus bradycardia</strong> without pacemaker</li>
                    <li><strong>Second/third-degree heart block</strong> without pacemaker</li>
                    <li><strong>Known hypersensitivity</strong></li>
                    <li><strong>Cardiogenic shock</strong></li>
                </ul>

                <h4>Side Effects:</h4>
                <ul>
                    <li><strong>Hypotension</strong> (most common acute effect)</li>
                    <li><strong>Bradycardia</strong></li>
                    <li><strong>QT prolongation</strong> (monitor for Torsades)</li>
                    <li><strong>Pulmonary toxicity</strong> (with chronic use)</li>
                </ul>
            </div>
        </div>

        <!-- Lidocaine Content -->
        <div class="algorithm-content" id="lidocaine" role="tabpanel" tabindex="0" aria-labelledby="tab-lidocaine">
            <div class="medication-card">
                <div class="medication-header">
                    <h3 class="medication-name">Lidocaine (Alternative to Amiodarone)</h3>
                    <div class="medication-dose">1-1.5mg/kg IV/IO</div>
                </div>

                <h4>Mechanism of Action:</h4>
                <ul>
                    <li><strong>Class IB antiarrhythmic:</strong> Blocks sodium channels</li>
                    <li><strong>Shortens action potential duration</strong></li>
                    <li><strong>Effective in ischemic tissue</strong> (preferentially blocks abnormal conduction)</li>
                </ul>

                <h4>VF/Pulseless VT Dosing:</h4>
                <ul>
                    <li><strong>Initial:</strong> 1-1.5mg/kg IV/IO push</li>
                    <li><strong>Additional:</strong> 0.5-0.75mg/kg every 5-10 minutes</li>
                    <li><strong>Maximum:</strong> 3mg/kg total dose</li>
                </ul>

                <h4>Post-ROSC Maintenance:</h4>
                <ul>
                    <li><strong>Infusion:</strong> 1-4mg/min (20-50 mcg/kg/min)</li>
                    <li><strong>Reduce dose by 50%</strong> in heart failure, liver disease, age &gt;70</li>
                </ul>

                <h4>Contraindications:</h4>
                <ul>
                    <li><strong>Complete heart block</strong> without pacemaker</li>
                    <li><strong>Wolff-Parkinson-White syndrome</strong> with A-fib</li>
                    <li><strong>Severe CHF</strong></li>
                    <li><strong>Cardiogenic shock</strong></li>
                </ul>

                <div class="critical-details">
                    <div class="critical-details-title">
                        Toxicity Signs (Exam Important):
                    </div>
                    <ul>
                        <li><strong>CNS effects:</strong> Confusion, slurred speech, seizures</li>
                        <li><strong>Cardiovascular:</strong> Hypotension, bradycardia, asystole</li>
                        <li><strong>Treatment:</strong> Supportive care, consider lipid emulsion for severe toxicity</li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- Atropine Content -->
        <div class="algorithm-content" id="atropine" role="tabpanel" tabindex="0" aria-labelledby="tab-atropine">
            <div class="medication-card">
                <div class="medication-header">
                    <h3 class="medication-name">Atropine (Anticholinergic)</h3>
                    <div class="medication-dose">1mg IV/IO</div>
                </div>

                <h4>Mechanism of Action:</h4>
                <ul>
                    <li><strong>Competitive muscarinic receptor antagonist</strong></li>
                    <li><strong>Blocks parasympathetic stimulation</strong> of SA and AV nodes</li>
                    <li><strong>Increases heart rate and AV conduction</strong></li>
                </ul>

                <h4>Dosing for Bradycardia:</h4>
                <ul>
                    <li><strong>Dose:</strong> 1mg IV/IO push</li>
                    <li><strong>Repeat:</strong> Every 3-5 minutes as needed</li>
                    <li><strong>Maximum:</strong> 3mg total (full vagal blockade)</li>
                    <li><strong>Minimum effective dose:</strong> 0.5mg (avoid paradoxical bradycardia)</li>
                </ul>

                <h4>Effectiveness Considerations:</h4>
                <ul>
                    <li><strong>Most effective:</strong> Sinus bradycardia, first-degree AV block</li>
                    <li><strong>Less effective:</strong> Mobitz Type II, complete heart block</li>
                    <li><strong>Ineffective:</strong> Transplanted hearts (denervated), infranodal blocks</li>
                </ul>

                <h4>Contraindications (Relative):</h4>
                <ul>
                    <li><strong>Narrow-angle glaucoma</strong></li>
                    <li><strong>Myasthenia gravis</strong></li>
                    <li><strong>Obstructive uropathy</strong></li>
                </ul>

                <h4>Side Effects:</h4>
                <ul>
                    <li><strong>Tachycardia</strong> (expected effect)</li>
                    <li><strong>Dry mouth, blurred vision</strong></li>
                    <li><strong>Confusion in elderly</strong></li>
                    <li><strong>Urinary retention</strong></li>
                </ul>
            </div>
        </div>

        <!-- Adenosine Content -->
        <div class="algorithm-content" id="adenosine" role="tabpanel" tabindex="0" aria-labelledby="tab-adenosine">
            <div class="medication-card">
                <div class="medication-header">
                    <h3 class="medication-name">Adenosine (Purinergic Agonist)</h3>
                    <div class="medication-dose">6mg → 12mg → 18mg</div>
                </div>

                <h4>Mechanism of Action:</h4>
                <ul>
                    <li><strong>Activates A1 adenosine receptors</strong> in AV node</li>
                    <li><strong>Causes transient AV block</strong> (interrupts reentry circuits)</li>
                    <li><strong>Very short half-life</strong> (10-30 seconds)</li>
                </ul>

                <h4>Dosing Protocol:</h4>
                <ul>
                    <li><strong>First dose:</strong> 6mg IV rapid push</li>
                    <li><strong>Second dose:</strong> 12mg IV rapid push (if ineffective)</li>
                    <li><strong>Third dose:</strong> 18mg IV rapid push (if needed)</li>
                </ul>

                <div class="critical-details">
                    <div class="critical-details-title">
                        Administration Technique (Critical):
                    </div>
                    <ul>
                        <li><strong>Use most proximal IV</strong> (central &gt; antecubital &gt; hand)</li>
                        <li><strong>Rapid push</strong> followed immediately by <strong>20mL saline flush</strong></li>
                        <li><strong>Raise arm</strong> after injection (speeds central circulation)</li>
                    </ul>
                </div>

                <h4>Indications:</h4>
                <ul>
                    <li><strong>Stable narrow-complex SVT</strong> (regular)</li>
                    <li><strong>Stable regular wide-complex tachycardia</strong> (if uncertain about diagnosis)</li>
                    <li><strong>Diagnostic tool</strong> for wide-complex tachycardia</li>
                </ul>

                <h4>Contraindications:</h4>
                <ul>
                    <li><strong>Asthma/COPD</strong> (can cause bronchospasm)</li>
                    <li><strong>Second/third-degree AV block</strong> without pacemaker</li>
                    <li><strong>Sick sinus syndrome</strong> without pacemaker</li>
                    <li><strong>Irregular wide-complex tachycardia</strong> (may precipitate VF)</li>
                </ul>

                <h4>Drug Interactions:</h4>
                <ul>
                    <li><strong>Dipyridamole:</strong> Potentiates effect (reduce dose)</li>
                    <li><strong>Theophylline/caffeine:</strong> Antagonizes effect (may need higher doses)</li>
                    <li><strong>Carbamazepine:</strong> Potentiates AV block</li>
                </ul>

                <h4>Expected Effects:</h4>
                <ul>
                    <li><strong>Transient asystole</strong> 3-15 seconds (warn patient)</li>
                    <li><strong>Chest discomfort, dyspnea</strong> (brief)</li>
                    <li><strong>Flushing, sense of impending doom</strong></li>
                </ul>
            </div>
        </div>

        <!-- Other Drugs Content -->
        <div class="algorithm-content" id="other-drugs" role="tabpanel" tabindex="0" aria-labelledby="tab-other-drugs">
            <h3>Other Critical ACLS Drugs</h3>

            <div class="medication-card">
                <div class="medication-header">
                    <h3 class="medication-name">Vasopressin</h3>
                    <div class="medication-dose">40 units IV/IO once</div>
                </div>
                <ul>
                    <li><strong>No longer routinely recommended</strong> (replaced by epinephrine)</li>
                    <li><strong>May substitute</strong> for first or second epinephrine dose</li>
                </ul>
            </div>

            <div class="medication-card">
                <div class="medication-header">
                    <h3 class="medication-name">Magnesium Sulfate</h3>
                    <div class="medication-dose">2g (8 mEq) IV over 1-2 minutes</div>
                </div>
                <ul>
                    <li><strong>Primary indication:</strong> Torsades de Pointes</li>
                    <li><strong>Also for:</strong> Suspected hypomagnesemia, digoxin toxicity</li>
                    <li><strong>Can repeat:</strong> Once if needed</li>
                </ul>
            </div>

            <div class="medication-card">
                <div class="medication-header">
                    <h3 class="medication-name">Calcium (Chloride preferred)</h3>
                    <div class="medication-dose">1g (10mL of 10% solution)</div>
                </div>
                <ul>
                    <li><strong>Indications:</strong> Hyperkalemia, calcium channel blocker overdose, hypocalcemia</li>
                    <li><strong>Calcium chloride:</strong> 1g (10mL of 10% solution) IV push</li>
                    <li><strong>Calcium gluconate:</strong> 3g (30mL of 10% solution) IV push</li>
                    <li><strong>Do NOT mix</strong> with bicarbonate (precipitates)</li>
                </ul>
            </div>
        </div>
    </div>
</section>

<!-- Airway Management Section -->
<section class="section" id="airway" aria-labelledby="airway-heading">
    <h2 class="section-heading" id="airway-heading">
        <button class="section-toggle" type="button" aria-expanded="true" aria-controls="airway-content">
            <span>3. Airway Management (Comprehensive)</span>
            <span class="section-toggle-icon" aria-hidden="true"></span>
        </button>
    </h2>
    <div class="section-content" id="airway-content">
        <!-- Airway Management Tabs -->
        <div class="algorithm-tabs" role="tablist" aria-label="Airway management topics">
            <button class="algorithm-tab" type="button" role="tab" id="tab-basic-airway" aria-controls="basic-airway" aria-selected="true" data-tab="basic-airway">Basic Airways</button>
            <button class="algorithm-tab" type="button" role="tab" id="tab-bag-mask" aria-controls="bag-mask" aria-selected="false" tabindex="-1" data-tab="bag-mask">Bag-Mask Ventilation</button>
            <button class="algorithm-tab" type="button" role="tab" id="tab-advanced-airway" aria-controls="advanced-airway" aria-selected="false" tabindex="-1" data-tab="advanced-airway">Advanced Airways</button>
            <button class="algorithm-tab" type="button" role="tab" id="tab-intubation" aria-controls="intubation" aria-selected="false" tabindex="-1" data-tab="intubation">Intubation</button>
            <button class="algorithm-tab" type="button" role="tab" id="tab-confirmation" aria-controls="confirmation" aria-selected="false" tabindex="-1" data-tab="confirmation">Confirmation</button>
            <button class="algorithm-tab" type="button" role="tab" id="tab-management" aria-controls="management" aria-selected="false" tabindex="-1" data-tab="management">Management</button>
        </div>

        <!-- Basic Airways Content -->
        <div class="algorithm-content" id="basic-airway" role="tabpanel" tabindex="0" aria-labelledby="tab-basic-airway">
            <h3>Basic Airway Management</h3>

            <h4>First-line airway maneuvers:</h4>
            <ol>
                <li><strong>Head-tilt chin-lift</strong> (no suspected spine injury)</li>
                <li><strong>Jaw thrust</strong> (suspected cervical spine injury)</li>
                <li><strong>Oropharyngeal airway</strong> (unconscious patients only)</li>
                <li><strong>Nasopharyngeal airway</strong> (conscious/semiconscious patients)</li>
            </ol>

            <div class="critical-details">
                <div class="critical-details-title">
                    Key Points:
                </div>
                <ul>
                    <li><strong>Use jaw thrust</strong> if cervical spine injury suspected</li>
                    <li><strong>OPA contraindicated</strong> in conscious patients (gag reflex)</li>
                    <li><strong>NPA preferred</strong> for conscious/semiconscious patients</li>
                </ul>
            </div>
        </div>

        <!-- Bag-Mask Ventilation Content -->
        <div class="algorithm-content" id="bag-mask" role="tabpanel" tabindex="0" aria-labelledby="tab-bag-mask">
            <h3>Bag-Mask Ventilation</h3>

            <h4>Preferred initial approach:</h4>
            <ul>
                <li><strong>Advantages:</strong> Immediately available, no intubation skills required</li>
                <li><strong>Technique:</strong> Two-person technique preferred (one seals mask, one bags)</li>
                <li><strong>Rate:</strong> 10-12 breaths/minute (1 breath every 5-6 seconds)</li>
                <li><strong>Volume:</strong> 500-600mL (watch for chest rise)</li>
            </ul>

            <div class="critical-details">
                <div class="critical-details-title">
                    BVM Success Factors:
                </div>
                <ul>
                    <li><strong>Proper mask seal</strong> - C-E grip technique</li>
                    <li><strong>Two-person technique</strong> when possible</li>
                    <li><strong>Avoid excessive ventilation</strong> (causes gastric distension)</li>
                    <li><strong>Watch chest rise</strong> - indicator of adequate volume</li>
                </ul>
            </div>
        </div>

        <!-- Advanced Airways Content -->
        <div class="algorithm-content" id="advanced-airway" role="tabpanel" tabindex="0" aria-labelledby="tab-advanced-airway">
            <h3>Advanced Airway Options</h3>

            <h4>Endotracheal Intubation:</h4>
            <ul>
                <li><strong>Gold standard</strong> for definitive airway</li>
                <li><strong>Advantages:</strong> Protects against aspiration, allows precise ventilation</li>
                <li><strong>Disadvantages:</strong> Requires significant skill, interrupts CPR</li>
            </ul>

            <h4>Supraglottic Airways (SGA):</h4>
            <ul>
                <li><strong>Examples:</strong> LMA, i-gel, King airway, Combitube</li>
                <li><strong>Advantages:</strong> Easier insertion, less interruption of CPR</li>
                <li><strong>Disadvantages:</strong> Less protection against aspiration</li>
                <li><strong>Equivalent outcomes</strong> to ETT in multiple studies</li>
            </ul>

            <div class="critical-details">
                <div class="critical-details-title">
                    Advanced Airway Decision:
                </div>
                <ul>
                    <li><strong>Consider SGA</strong> if intubation experience limited</li>
                    <li><strong>ETT preferred</strong> for experienced providers</li>
                    <li><strong>Don't delay compressions</strong> for prolonged airway attempts</li>
                </ul>
            </div>
        </div>

        <!-- Intubation Content -->
        <div class="algorithm-content" id="intubation" role="tabpanel" tabindex="0" aria-labelledby="tab-intubation">
            <h3>Intubation Procedure</h3>

            <h4>Pre-intubation Preparation:</h4>
            <ol>
                <li><strong>Pre-oxygenate</strong> with 100% O2 for 3-5 minutes if possible</li>
                <li><strong>Position patient:</strong> "Sniffing position" (neck flexed, head extended)</li>
                <li><strong>Prepare equipment:</strong> ETT, stylet, laryngoscope, suction, BVM</li>
                <li><strong>Team coordination:</strong> Minimize CPR interruption</li>
            </ol>

            <h4>Intubation Technique:</h4>
            <ol>
                <li><strong>Insert laryngoscope</strong> from right side, sweep tongue left</li>
                <li><strong>Advance blade</strong> to appropriate landmark (vallecula or epiglottis)</li>
                <li><strong>Lift upward and forward</strong> (never lever on teeth)</li>
                <li><strong>Visualize vocal cords</strong></li>
                <li><strong>Insert ETT</strong> through cords until cuff disappears</li>
                <li><strong>Remove stylet</strong> and inflate cuff</li>
                <li><strong>Confirm placement</strong> immediately</li>
            </ol>

            <div class="critical-details">
                <div class="critical-details-title">
                    Intubation Limits:
                </div>
                <ul>
                    <li><strong>Maximum attempt duration:</strong> 30 seconds</li>
                    <li><strong>Maximum attempts:</strong> 3 (by experienced provider)</li>
                    <li><strong>Resume CPR</strong> if unsuccessful</li>
                </ul>
            </div>
        </div>

        <!-- Confirmation Content -->
        <div class="algorithm-content" id="confirmation" role="tabpanel" tabindex="0" aria-labelledby="tab-confirmation">
            <h3>ETT Placement Confirmation</h3>

            <h4>Primary Confirmation:</h4>
            <ul>
                <li><strong>Continuous waveform capnography</strong> (most reliable)</li>
                <li><strong>PETCO2 >10 mmHg</strong> suggests tracheal placement</li>
                <li><strong>Persistent flat capnogram</strong> suggests esophageal placement</li>
            </ul>

            <h4>Secondary Confirmation:</h4>
            <ul>
                <li><strong>Direct visualization</strong> of tube passing through cords</li>
                <li><strong>Bilateral breath sounds</strong> (auscultate at midaxillary line)</li>
                <li><strong>Absence of gastric sounds</strong> over epigastrium</li>
                <li><strong>Chest rise</strong> with ventilation</li>
                <li><strong>Condensation</strong> in ETT during exhalation</li>
            </ul>

            <h4>Continuous Monitoring:</h4>
            <ul>
                <li><strong>Waveform capnography</strong> throughout resuscitation</li>
                <li><strong>Clinical assessment</strong> after any patient movement</li>
                <li><strong>Chest X-ray</strong> when feasible (tube tip 3-5cm above carina)</li>
            </ul>

            <div class="critical-details">
                <div class="critical-details-title">
                    Gold Standard:
                </div>
                <ul>
                    <li><strong>Continuous waveform capnography</strong> is most reliable</li>
                    <li><strong>Never rely on single method</strong> - use multiple confirmations</li>
                    <li><strong>Immediately remove</strong> if esophageal placement suspected</li>
                </ul>
            </div>
        </div>

        <!-- Management Content -->
        <div class="algorithm-content" id="management" role="tabpanel" tabindex="0" aria-labelledby="tab-management">
            <h3>Post-Intubation Management</h3>

            <h4>Ventilation Parameters:</h4>
            <ul>
                <li><strong>Rate:</strong> 10 breaths/minute (1 breath every 6 seconds)</li>
                <li><strong>Tidal volume:</strong> 6-8mL/kg ideal body weight</li>
                <li><strong>PEEP:</strong> 5-10 cmH2O (avoid high pressures)</li>
                <li><strong>FiO2:</strong> Titrate to SpO2 92-98%</li>
            </ul>

            <h4>Continuous CPR:</h4>
            <ul>
                <li><strong>No interruptions</strong> for ventilation once ETT placed</li>
                <li><strong>Asynchronous compressions and ventilations</strong></li>
                <li><strong>Monitor for tube displacement</strong></li>
            </ul>

            <h4>Rescue Airways (Last Resort):</h4>
            <ul>
                <li><strong>Surgical Airway (Cricothyrotomy):</strong></li>
                <li><strong>Indication:</strong> "Can't intubate, can't ventilate" scenario</li>
                <li><strong>Technique:</strong> Needle or surgical cricothyrotomy</li>
                <li><strong>High-risk procedure</strong> requiring surgical expertise</li>
            </ul>

            <div class="critical-details">
                <div class="critical-details-title">
                    Post-Intubation Priorities:
                </div>
                <ul>
                    <li><strong>Continuous monitoring</strong> - waveform capnography</li>
                    <li><strong>Avoid hyperventilation</strong> - causes decreased ROSC</li>
                    <li><strong>Maintain compressions</strong> - no interruptions for ventilations</li>
                </ul>
            </div>
        </div>
    </div>
</section>

<!-- Electrical Therapy Section -->
<section class="section" id="electrical" aria-labelledby="electrical-heading">
    <h2 class="section-heading" id="electrical-heading">
        <button class="section-toggle" type="button" aria-expanded="true" aria-controls="electrical-content">
            <span>4. Electrical Therapy (Comprehensive)</span>
            <span class="section-toggle-icon" aria-hidden="true"></span>
        </button>
    </h2>
    <div class="section-content" id="electrical-content">
        <!-- Electrical Therapy Tabs -->
        <div class="algorithm-tabs" role="tablist" aria-label="Electrical therapies">
            <button class="algorithm-tab" type="button" role="tab" id="tab-defibrillation" aria-controls="defibrillation" aria-selected="true" data-tab="defibrillation">Defibrillation</button>
            <button class="algorithm-tab" type="button" role="tab" id="tab-cardioversion" aria-controls="cardioversion" aria-selected="false" tabindex="-1" data-tab="cardioversion">Cardioversion</button>
            <button class="algorithm-tab" type="button" role="tab" id="tab-pacing" aria-controls="pacing" aria-selected="false" tabindex="-1" data-tab="pacing">Transcutaneous Pacing</button>
        </div>

        <!-- Defibrillation Content -->
        <div class="algorithm-content" id="defibrillation" role="tabpanel" tabindex="0" aria-labelledby="tab-defibrillation">
            <h3>Defibrillation (Unsynchronized)</h3>

            <h4>Indications:</h4>
            <ul>
                <li><strong>Ventricular fibrillation (VF)</strong></li>
                <li><strong>Pulseless ventricular tachycardia (VT)</strong></li>
                <li><strong>Unstable polymorphic VT</strong> (irregular wide complex)</li>
            </ul>

            <h4>Energy Selection:</h4>
            <ul>
                <li><strong>Biphasic defibrillators:</strong> 120-200J initial, equal or higher subsequent</li>
                <li><strong>Monophasic defibrillators:</strong> 360J for all shocks</li>
                <li><strong>Unknown biphasic:</strong> Use 200J for all shocks</li>
            </ul>

            <h4>Defibrillation Technique:</h4>
            <ol>
                <li><strong>Confirm rhythm</strong> on monitor (not paddles)</li>
                <li><strong>Charge defibrillator</strong> while CPR continues</li>
                <li><strong>Clear area:</strong> "I'm charging, everyone clear"</li>
                <li><strong>Visual check:</strong> Ensure no contact with patient</li>
                <li><strong>Deliver shock:</strong> Firm pressure, both pads</li>
                <li><strong>Resume CPR immediately</strong> (don't check pulse)</li>
            </ol>

            <h4>Pad/Paddle Placement:</h4>
            <ul>
                <li><strong>Standard:</strong> Right upper chest, left lower chest</li>
                <li><strong>Alternative:</strong> Anterior-posterior (especially for A-fib)</li>
                <li><strong>Avoid implanted devices</strong> by >8cm if possible</li>
            </ul>

            <div class="critical-details">
                <div class="critical-details-title">
                    Defibrillation Safety:
                </div>
                <ul>
                    <li><strong>Remove patches/jewelry</strong> from contact area</li>
                    <li><strong>Dry chest thoroughly</strong> - avoid burns</li>
                    <li><strong>Ensure everyone clear</strong> before discharge</li>
                    <li><strong>Resume CPR immediately</strong> - don't check pulse</li>
                </ul>
            </div>
        </div>

        <!-- Cardioversion Content -->
        <div class="algorithm-content" id="cardioversion" role="tabpanel" tabindex="0" aria-labelledby="tab-cardioversion">
            <h3>Synchronized Cardioversion</h3>

            <h4>Indications:</h4>
            <ul>
                <li><strong>Unstable tachycardia with pulse</strong></li>
                <li><strong>Stable A-fib/A-flutter</strong> (elective)</li>
                <li><strong>Stable SVT</strong> refractory to medications</li>
            </ul>

            <h4>Synchronization Process:</h4>
            <ol>
                <li><strong>Turn on sync mode</strong> (sync markers on R-waves)</li>
                <li><strong>Confirm sync markers</strong> appear on QRS complexes</li>
                <li><strong>Select energy level</strong> based on rhythm</li>
                <li><strong>Charge and deliver</strong> (may require longer press)</li>
                <li><strong>Turn OFF sync mode</strong> after each shock</li>
            </ol>

            <h4>Energy Levels by Rhythm:</h4>
            <section class="table-scroll" tabindex="0" aria-label="Synchronized cardioversion energy levels">
                <table class="energy-table">
                    <caption>Synchronized cardioversion energy levels</caption>
                    <thead>
                        <tr>
                            <th scope="col">Rhythm Type</th>
                            <th scope="col">Initial Energy</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Narrow regular (SVT)</td>
                            <td>50-100J</td>
                        </tr>
                        <tr>
                            <td>Narrow irregular (A-fib)</td>
                            <td>120-200J biphasic</td>
                        </tr>
                        <tr>
                            <td>Wide regular (VT)</td>
                            <td>100J initial</td>
                        </tr>
                        <tr>
                            <td>Unstable polymorphic VT</td>
                            <td>Defibrillation energy (unsynchronized)</td>
                        </tr>
                    </tbody>
                </table>
            </section>

            <div class="critical-details">
                <div class="critical-details-title">
                    Cardioversion Key Points:
                </div>
                <ul>
                    <li><strong>Always check anticoagulation</strong> for elective procedures</li>
                    <li><strong>Sedate conscious patients</strong> when time permits</li>
                    <li><strong>Have atropine ready</strong> - may cause bradycardia</li>
                    <li><strong>Turn off sync mode</strong> after each shock</li>
                </ul>
            </div>
        </div>

        <!-- Transcutaneous Pacing Content -->
        <div class="algorithm-content" id="pacing" role="tabpanel" tabindex="0" aria-labelledby="tab-pacing">
            <h3>Transcutaneous Pacing (TCP)</h3>

            <h4>Indications:</h4>
            <ul>
                <li><strong>Symptomatic bradycardia</strong> unresponsive to atropine</li>
                <li><strong>High-grade AV blocks</strong> (Mobitz II, complete)</li>
                <li><strong>Bradycardic arrest</strong> (not asystole)</li>
                <li><strong>Standby pacing</strong> in high-risk situations</li>
            </ul>

            <h4>TCP Procedure:</h4>
            <ol>
                <li><strong>Apply pacing pads:</strong> Anterior-posterior preferred</li>
                <li><strong>Set initial rate:</strong> 60-80 bpm (higher if severe)</li>
                <li><strong>Set initial output:</strong> Start at 0, increase gradually</li>
                <li><strong>Identify capture:</strong> Pacing spike followed by QRS</li>
                <li><strong>Set final output:</strong> Threshold + 10mA safety margin</li>
                <li><strong>Confirm mechanical capture:</strong> Check pulse</li>
            </ol>

            <h4>Assessment of Capture:</h4>
            <ul>
                <li><strong>Electrical capture:</strong> QRS after each pacing spike</li>
                <li><strong>Mechanical capture:</strong> Palpable pulse at set rate</li>
                <li><strong>Check femoral pulse</strong> (avoid carotid due to muscle stimulation)</li>
            </ul>

            <h4>TCP Settings &amp; Safety:</h4>
            <ul>
                <li><strong>Rate:</strong> Match clinical need (usually 60-80 bpm)</li>
                <li><strong>Output:</strong> Minimum required for consistent capture</li>
                <li><strong>Mode:</strong> Usually demand (paces only when needed)</li>
                <li><strong>Contraindications:</strong> Hypothermia, asystole, conscious patients</li>
            </ul>

            <div class="critical-details">
                <div class="critical-details-title">
                    TCP Key Points:
                </div>
                <ul>
                    <li><strong>Confirm mechanical capture</strong> - check femoral pulse</li>
                    <li><strong>Provide analgesia/sedation</strong> for conscious patients</li>
                    <li><strong>Anterior-posterior pad placement</strong> preferred</li>
                    <li><strong>Not effective for asystole</strong> - focus on reversible causes</li>
                </ul>
            </div>
        </div>
    </div>
</section>

<!-- Team Dynamics Section -->
<section class="section" id="team" aria-labelledby="team-heading">
    <h2 class="section-heading" id="team-heading">
        <button class="section-toggle" type="button" aria-expanded="true" aria-controls="team-content">
            <span>5. Team Dynamics &amp; Communication</span>
            <span class="section-toggle-icon" aria-hidden="true"></span>
        </button>
    </h2>
    <div class="section-content" id="team-content">
        <h3>High-Performance Team Structure</h3>

        <h4>Resuscitation Triangle Roles:</h4>
        <ol>
            <li><strong>Team Leader</strong> (directs overall care)</li>
            <li><strong>Compressor</strong> (chest compressions)</li>
            <li><strong>Airway Manager</strong> (ventilation and airway)</li>
        </ol>

        <h4>Additional Roles (larger teams):</h4>
        <ol start="4">
            <li><strong>IV/Medication</strong> (vascular access and drugs)</li>
            <li><strong>Monitor/Defibrillator</strong> (rhythm analysis and shocks)</li>
            <li><strong>Recorder</strong> (documentation and timing)</li>
        </ol>

        <h3>Team Leader Responsibilities</h3>

        <h4>Clinical Leadership:</h4>
        <ul>
            <li><strong>Treatment decisions</strong> based on algorithms</li>
            <li><strong>Rhythm interpretation</strong> and shock decisions</li>
            <li><strong>Drug selection and timing</strong></li>
            <li><strong>Decision to terminate</strong> resuscitation efforts</li>
        </ul>

        <h4>Team Management:</h4>
        <ul>
            <li><strong>Role assignments</strong> and reassignments</li>
            <li><strong>Performance monitoring</strong> and feedback</li>
            <li><strong>Resource coordination</strong> (equipment, personnel)</li>
            <li><strong>Communication</strong> with family and receiving facilities</li>
        </ul>

        <h4>Situational Awareness:</h4>
        <ul>
            <li><strong>Monitor team performance</strong> (CPR quality, drug timing)</li>
            <li><strong>Anticipate needs</strong> (prepare for algorithm branches)</li>
            <li><strong>Recognize complications</strong> (airway problems, IV issues)</li>
            <li><strong>Time awareness</strong> (duration of efforts, drug timing)</li>
        </ul>

        <h3>Effective Communication Strategies</h3>

        <h4>Closed-Loop Communication:</h4>
        <ol>
            <li><strong>Command:</strong> "Give 1mg epinephrine IV"</li>
            <li><strong>Acknowledgment:</strong> "1mg epinephrine IV" (repeat back)</li>
            <li><strong>Action:</strong> Prepare and administer drug</li>
            <li><strong>Confirmation:</strong> "1mg epinephrine given IV"</li>
        </ol>

        <h4>Clear Communication Principles:</h4>
        <ul>
            <li><strong>Use specific terms</strong> (avoid "push some epi")</li>
            <li><strong>Speak loudly and clearly</strong> (overcome ambient noise)</li>
            <li><strong>Make eye contact</strong> when giving critical instructions</li>
            <li><strong>Use names</strong> when assigning tasks ("John, start compressions")</li>
        </ul>

        <h4>Information Sharing:</h4>
        <ul>
            <li><strong>Brief team</strong> on patient condition and history</li>
            <li><strong>Announce rhythm changes</strong> clearly</li>
            <li><strong>Share time markers</strong> ("We're at 15 minutes")</li>
            <li><strong>Update on drug administration</strong> and response</li>
        </ul>

        <h3>High-Quality CPR Standards</h3>

        <h4>Compression Parameters:</h4>
        <ul>
            <li><strong>Rate:</strong> 100-120/minute (use metronome if available)</li>
            <li><strong>Depth:</strong> 5-6 cm (at least 2 inches, no more than 2.4 inches)</li>
            <li><strong>Recoil:</strong> Complete chest expansion between compressions</li>
            <li><strong>Position:</strong> Lower half of breastbone, heel of hand</li>
        </ul>

        <h4>CPR Quality Metrics:</h4>
        <ul>
            <li><strong>Compression fraction &gt;80%</strong> (minimize interruptions)</li>
            <li><strong>Pre-shock pause &lt;10 seconds</strong></li>
            <li><strong>Post-shock pause &lt;10 seconds</strong></li>
            <li><strong>No flow time</strong> minimized throughout</li>
        </ul>

        <h4>Team Performance:</h4>
        <ul>
            <li><strong>Switch compressors every 2 minutes</strong> (or sooner if fatigued)</li>
            <li><strong>Smooth transitions</strong> during role changes</li>
            <li><strong>Continuous feedback</strong> on quality</li>
            <li><strong>Avoid leaning</strong> on chest between compressions</li>
        </ul>

        <h3>Constructive Intervention</h3>

        <h4>Speaking Up Culture:</h4>
        <ul>
            <li><strong>Any team member</strong> can voice concerns</li>
            <li><strong>Stop dangerous actions</strong> immediately</li>
            <li><strong>Suggest alternatives</strong> respectfully</li>
            <li><strong>Support team member</strong> who speaks up</li>
        </ul>

        <h4>Intervention Techniques:</h4>
        <ul>
            <li><strong>"I need clarification..."</strong> (question approach)</li>
            <li><strong>"For safety, I recommend..."</strong> (suggest alternative)</li>
            <li><strong>"Let's pause and reassess"</strong> (if confused situation)</li>
        </ul>

        <h4>Team Leader Response:</h4>
        <ul>
            <li><strong>Listen to concerns</strong> without defensiveness</li>
            <li><strong>Thank member</strong> for speaking up</li>
            <li><strong>Reassess situation</strong> based on input</li>
            <li><strong>Adjust approach</strong> if indicated</li>
        </ul>

        <h3>Debriefing and Improvement</h3>

        <h4>Post-Event Debriefing:</h4>
        <ul>
            <li><strong>What went well?</strong> (positive reinforcement)</li>
            <li><strong>What could improve?</strong> (constructive feedback)</li>
            <li><strong>What will we do differently?</strong> (action items)</li>
            <li><strong>Any system issues?</strong> (equipment, processes)</li>
        </ul>

        <h4>Continuous Quality Improvement:</h4>
        <ul>
            <li><strong>Review CPR metrics</strong> if available</li>
            <li><strong>Analyze drug timing</strong> and appropriateness</li>
            <li><strong>Assess team communication</strong> effectiveness</li>
            <li><strong>Identify training needs</strong></li>
        </ul>
    </div>
</section>

<!-- H's and T's Section -->
<section class="section" id="ht" aria-labelledby="ht-heading">
    <h2 class="section-heading" id="ht-heading">
        <button class="section-toggle" type="button" aria-expanded="true" aria-controls="ht-content">
            <span>6. H's and T's (Reversible Causes) — Detailed</span>
            <span class="section-toggle-icon" aria-hidden="true"></span>
        </button>
    </h2>
    <div class="section-content" id="ht-content">
        <h3>The H's (Hypo/Hyper Conditions)</h3>

        <div class="ht-grid">
            <div class="ht-card">
                <div class="ht-title">1. Hypoxia</div>
                <p><strong>Recognition:</strong> Low SpO2, cyanosis, history of respiratory disease</p>
                <p><strong>Treatment:</strong> 100% oxygen, optimize ventilation, treat airway obstruction</p>
                <p><strong>Consider:</strong> Pneumothorax, pulmonary embolism, severe pneumonia</p>
            </div>

            <div class="ht-card">
                <div class="ht-title">2. Hypovolemia</div>
                <p><strong>Recognition:</strong> History of bleeding, dehydration, flat neck veins</p>
                <p><strong>Treatment:</strong> IV fluid bolus (1-2L crystalloid), blood products if bleeding</p>
                <p><strong>Monitor:</strong> Response to fluid challenge, hemoglobin levels</p>
            </div>

            <div class="ht-card">
                <div class="ht-title">3. Hydrogen ions (Acidosis)</div>
                <p><strong>Recognition:</strong> ABG pH &lt;7.30, hyperventilation, diabetic history</p>
                <p><strong>Treatment:</strong> Hyperventilation, sodium bicarbonate (1 mEq/kg) if severe</p>
                <p><strong>Causes:</strong> DKA, renal failure, methanol/ethylene glycol poisoning</p>
            </div>

            <div class="ht-card">
                <div class="ht-title">4. Hyperkalemia</div>
                <p><strong>Recognition:</strong> Peaked T waves, widened QRS, renal failure history</p>
                <p><strong>Treatment:</strong></p>
                <ul>
                    <li>Calcium chloride: 1g IV (stabilizes membrane)</li>
                    <li>Insulin + D50: 10 units insulin + 1 amp D50</li>
                    <li>Albuterol: 10-20mg nebulized</li>
                    <li>Sodium bicarbonate: 1 mEq/kg IV</li>
                </ul>
            </div>

            <div class="ht-card">
                <div class="ht-title">5. Hypokalemia</div>
                <p><strong>Recognition:</strong> U waves, flat T waves, diuretic use, diarrhea</p>
                <p><strong>Treatment:</strong></p>
                <ul>
                    <li>Potassium chloride: 10-20 mEq/hr IV (central line preferred)</li>
                    <li>Magnesium replacement (hypokalemia resistant without Mg)</li>
                </ul>
            </div>

            <div class="ht-card">
                <div class="ht-title">6. Hypothermia</div>
                <p><strong>Recognition:</strong> Core temperature &lt;35°C (95°F), cold exposure</p>
                <p><strong>Treatment:</strong></p>
                <ul>
                    <li>Active rewarming: Warm IV fluids, forced air warming</li>
                    <li>Continue CPR until rewarmed (30-32°C minimum)</li>
                    <li>"Not dead until warm and dead"</li>
                </ul>
            </div>
        </div>

        <h3>The T's (Toxins and Mechanical)</h3>

        <div class="ht-grid">
            <div class="ht-card">
                <div class="ht-title">1. Tension Pneumothorax</div>
                <p><strong>Recognition:</strong> Unilateral decreased breath sounds, tracheal deviation, hypotension</p>
                <p><strong>Treatment:</strong></p>
                <ul>
                    <li>Needle decompression: 14-16G, 2nd intercostal space, midclavicular line</li>
                    <li>Chest tube: Definitive management</li>
                    <li>Bilateral in arrest: Consider bilateral decompression</li>
                </ul>
            </div>

            <div class="ht-card">
                <div class="ht-title">2. Tamponade (Cardiac)</div>
                <p><strong>Recognition:</strong> Beck's triad (elevated JVP, hypotension, muffled heart sounds)</p>
                <p><strong>Ultrasound:</strong> Pericardial effusion with collapse</p>
                <p><strong>Treatment:</strong> <strong>Pericardiocentesis</strong> (subxiphoid approach)</p>
            </div>

            <div class="ht-card">
                <div class="ht-title">3. Toxins</div>
                <p><strong>Common causes:</strong> Beta-blockers, calcium channel blockers, tricyclics, opioids</p>
                <p><strong>Recognition:</strong> History, pill bottles, specific ECG changes</p>
                <p><strong>Treatment:</strong> Specific antidotes</p>
                <ul>
                    <li>Beta-blockers: Glucagon 5-10mg IV</li>
                    <li>Calcium channel blockers: Calcium chloride 1-3g, high-dose insulin</li>
                    <li>Tricyclics: Sodium bicarbonate</li>
                    <li>Opioids: Naloxone 0.4-2mg IV</li>
                </ul>
            </div>

            <div class="ht-card">
                <div class="ht-title">4. Thrombosis - Pulmonary</div>
                <p><strong>Recognition:</strong> Right heart strain, hypoxia, risk factors (immobility, surgery)</p>
                <p><strong>Treatment:</strong></p>
                <ul>
                    <li>Fibrinolytics: tPA 100mg IV or 1mg/kg</li>
                    <li>Consider ECMO if available</li>
                    <li>Anticoagulation post-ROSC</li>
                </ul>
            </div>

            <div class="ht-card">
                <div class="ht-title">5. Thrombosis - Coronary</div>
                <p><strong>Recognition:</strong> ST elevation on ECG, chest pain history</p>
                <p><strong>Treatment:</strong></p>
                <ul>
                    <li>Primary PCI preferred (&lt;90 minutes)</li>
                    <li>Fibrinolytics if PCI unavailable (&lt;30 minutes to treatment)</li>
                    <li>Antiplatelet therapy: Aspirin, P2Y12 inhibitor</li>
                </ul>
            </div>
        </div>

        <h3>Systematic Approach to H's and T's</h3>

        <h4>During CPR:</h4>
        <ul>
            <li><strong>Assign team member</strong> to consider reversible causes</li>
            <li><strong>Obtain history</strong> from family/EMS</li>
            <li><strong>Physical examination</strong> during pulse checks</li>
            <li><strong>Point-of-care ultrasound</strong> if trained</li>
            <li><strong>Laboratory studies</strong> as indicated</li>
        </ul>

        <h4>High-Yield Interventions:</h4>
        <ul>
            <li><strong>Fluid bolus</strong> for suspected hypovolemia</li>
            <li><strong>Calcium chloride</strong> for suspected hyperkalemia</li>
            <li><strong>Needle decompression</strong> for suspected tension pneumothorax</li>
            <li><strong>Naloxone</strong> for suspected opioid overdose</li>
        </ul>
    </div>
</section>

<!-- Special Situations Section -->
<section class="section" id="special" aria-labelledby="special-heading">
    <h2 class="section-heading" id="special-heading">
        <button class="section-toggle" type="button" aria-expanded="true" aria-controls="special-content">
            <span>7. Special Situations</span>
            <span class="section-toggle-icon" aria-hidden="true"></span>
        </button>
    </h2>
    <div class="section-content" id="special-content">
        <h3>Acute Coronary Syndrome (ACS) Recognition &amp; Management</h3>

        <h4>ACS Categories:</h4>
        <ol>
            <li><strong>STEMI:</strong> ST elevation ≥1mm in 2 contiguous leads or new LBBB</li>
            <li><strong>NSTEMI:</strong> Elevated troponins without ST elevation</li>
            <li><strong>Unstable Angina:</strong> ACS symptoms without troponin elevation</li>
        </ol>

        <h4>Initial Assessment (First 10 minutes):</h4>
        <ul>
            <li><strong>12-lead ECG</strong> within 10 minutes of arrival</li>
            <li><strong>History:</strong> Chest pain characteristics, radiation, associated symptoms</li>
            <li><strong>Physical exam:</strong> Signs of heart failure, hypotension</li>
            <li><strong>Risk stratification:</strong> TIMI score, GRACE score</li>
        </ul>

        <h4>STEMI Management:</h4>
        <ul>
            <li><strong>Time-sensitive:</strong> Door-to-balloon &lt;90 min, door-to-needle &lt;30 min</li>
            <li><strong>Primary PCI preferred</strong> if available within 90 minutes</li>
            <li><strong>Fibrinolytic therapy</strong> if PCI unavailable</li>
        </ul>

        <h4>Fibrinolytic Contraindications:</h4>
        <ul>
            <li><strong>Absolute:</strong> Active bleeding, stroke &lt;3 months, intracranial pathology</li>
            <li><strong>Relative:</strong> Age &gt;75, severe hypertension, recent surgery</li>
        </ul>

        <h4>Initial Medical Therapy (MONA):</h4>
        <ul>
            <li><strong>Morphine:</strong> 2-4mg IV for pain (avoid if possible - may worsen outcomes)</li>
            <li><strong>Oxygen:</strong> Only if SpO2 &lt;90% (avoid hyperoxia)</li>
            <li><strong>Nitroglycerin:</strong> 0.4mg SL q5min × 3 (avoid if hypotension)</li>
            <li><strong>Aspirin:</strong> 325mg chewed (unless allergic)</li>
        </ul>

        <h4>Additional ACS Therapies:</h4>
        <ul>
            <li><strong>P2Y12 inhibitor:</strong> Clopidogrel, prasugrel, or ticagrelor</li>
            <li><strong>Anticoagulation:</strong> Heparin, enoxaparin, or bivalirudin</li>
            <li><strong>Beta-blockers:</strong> Metoprolol (avoid if heart failure/hypotension)</li>
            <li><strong>Statin:</strong> High-intensity (atorvastatin 80mg)</li>
        </ul>

        <h3>Stroke Recognition and Management</h3>

        <h4>FAST Assessment:</h4>
        <ul>
            <li><strong>F</strong>ace: Facial droop (smile assessment)</li>
            <li><strong>A</strong>rms: Arm weakness (raise both arms)</li>
            <li><strong>S</strong>peech: Speech difficulties (repeat simple phrase)</li>
            <li><strong>T</strong>ime: Time to call EMS</li>
        </ul>

        <h4>Additional Signs:</h4>
        <ul>
            <li><strong>Sudden severe headache</strong></li>
            <li><strong>Sudden vision loss</strong></li>
            <li><strong>Sudden loss of balance/coordination</strong></li>
            <li><strong>Sudden numbness</strong> (face, arm, leg)</li>
        </ul>

        <h4>Time Windows:</h4>
        <ul>
            <li><strong>IV tPA:</strong> 0-4.5 hours from symptom onset</li>
            <li><strong>Endovascular therapy:</strong> 0-24 hours (selected patients)</li>
            <li><strong>"Time is brain"</strong> - every minute counts</li>
        </ul>

        <h4>Stroke Protocol:</h4>
        <ol>
            <li><strong>Activation:</strong> Stroke alert to hospital</li>
            <li><strong>CT scan:</strong> Within 25 minutes of arrival</li>
            <li><strong>Laboratory:</strong> Glucose, CBC, PT/INR, creatinine</li>
            <li><strong>Blood pressure:</strong> Carefully managed (don't drop rapidly)</li>
            <li><strong>Glucose:</strong> Treat if &lt;60mg/dL</li>
        </ol>

        <h4>tPA Contraindications:</h4>
        <ul>
            <li><strong>Recent stroke</strong> (&lt;3 months)</li>
            <li><strong>Recent surgery</strong> (&lt;14 days)</li>
            <li><strong>Active bleeding</strong></li>
            <li><strong>Severe hypertension</strong> (&gt;185/110 mmHg)</li>
            <li><strong>Platelets &lt;100,000</strong> or INR &gt;1.7</li>
        </ul>

        <h3>Respiratory Arrest Management</h3>

        <h4>Definition:</h4>
        <p>Absent or inadequate breathing with pulse present</p>

        <h4>Initial Management:</h4>
        <ol>
            <li><strong>Open airway:</strong> Head-tilt chin-lift or jaw thrust</li>
            <li><strong>Provide ventilation:</strong> Bag-mask at 10-12 breaths/min</li>
            <li><strong>Monitor pulse:</strong> Check every 2 minutes</li>
            <li><strong>Prepare for intubation</strong> if prolonged</li>
        </ol>

        <h4>Ventilation Parameters:</h4>
        <ul>
            <li><strong>Rate:</strong> 10-12 breaths/minute (1 breath every 5-6 seconds)</li>
            <li><strong>Volume:</strong> 500-600mL (watch chest rise)</li>
            <li><strong>Avoid hyperventilation:</strong> Can cause hypotension and gastric distension</li>
        </ul>

        <h4>Common Causes:</h4>
        <ul>
            <li><strong>Opioid overdose:</strong> Naloxone 0.4-2mg IV/IN</li>
            <li><strong>Upper airway obstruction:</strong> Direct laryngoscopy, foreign body removal</li>
            <li><strong>Neuromuscular:</strong> Consider intubation early</li>
            <li><strong>Metabolic:</strong> Correct underlying cause</li>
        </ul>

        <h4>Progression to Cardiac Arrest:</h4>
        <ul>
            <li><strong>Monitor closely:</strong> Pulse checks every 2 minutes</li>
            <li><strong>Prepare for CPR:</strong> If pulse disappears</li>
            <li><strong>Early intubation:</strong> Consider if cause unclear</li>
        </ul>

        <h4>Special Considerations:</h4>
        <ul>
            <li><strong>Drowning:</strong> May have pulmonary edema</li>
            <li><strong>Drug overdose:</strong> Consider specific antidotes</li>
            <li><strong>Anaphylaxis:</strong> Epinephrine, steroids, antihistamines</li>
            <li><strong>Choking:</strong> Back blows, abdominal thrusts, direct removal</li>
        </ul>
    </div>
</section>

<!-- Exam Tips Section -->
<section class="section" id="tips" aria-labelledby="tips-heading">
    <h2 class="section-heading" id="tips-heading">
        <button class="section-toggle" type="button" aria-expanded="true" aria-controls="tips-content">
            <span>8. Critical Exam Tips &amp; Mnemonics</span>
            <span class="section-toggle-icon" aria-hidden="true"></span>
        </button>
    </h2>
    <div class="section-content" id="tips-content">
        <h3>Key Algorithm Decision Points:</h3>
        <ol>
            <li><strong>Pulse present?</strong> → Determines CPR vs. supportive care</li>
            <li><strong>Rhythm shockable?</strong> → VF/VT gets shock, PEA/Asystole gets epinephrine</li>
            <li><strong>Stable vs. unstable?</strong> → Unstable gets immediate electrical therapy</li>
            <li><strong>Wide vs. narrow?</strong> → Determines medication choices</li>
            <li><strong>Regular vs. irregular?</strong> → Affects adenosine use</li>
        </ol>

        <h3>Drug Memory Aids:</h3>
        <ul>
            <li><strong>"1-2-3" for Adenosine:</strong> 6mg → 12mg → 18mg</li>
            <li><strong>"3-1-5" for Amiodarone:</strong> 300mg → 150mg → 1.5mg/min infusion</li>
            <li><strong>"Every 3-5" for Epinephrine:</strong> 1mg every 3-5 minutes</li>
            <li><strong>"1mg every 3-5" for Atropine:</strong> 1mg every 3-5 minutes (max 3mg)</li>
        </ul>

        <div class="critical-details">
            <div class="critical-details-title">
                High-Yield Facts:
            </div>
            <ul>
                <li><strong>Most important intervention:</strong> High-quality CPR</li>
                <li><strong>Don't delay shocks</strong> for anything in VF/VT</li>
                <li><strong>Epinephrine earlier</strong> in non-shockable rhythms</li>
                <li><strong>Waveform capnography</strong> is gold standard for ETT confirmation</li>
                <li><strong>H's and T's</strong> must be considered in every arrest</li>
            </ul>
        </div>

        <h3>Common Exam Scenarios:</h3>
        <ol>
            <li><strong>Witnessed VF:</strong> Immediate shock, then CPR</li>
            <li><strong>Unresponsive, no pulse:</strong> Check rhythm, start appropriate algorithm</li>
            <li><strong>Bradycardia with hypotension:</strong> Atropine, prepare for pacing</li>
            <li><strong>Wide complex tachycardia:</strong> Assume VT if unstable</li>
            <li><strong>Post-ROSC care:</strong> 12-lead ECG, avoid hyperoxia</li>
        </ol>

        <h3>Quality Measures:</h3>
        <ul>
            <li><strong>Compression rate:</strong> 100-120/min</li>
            <li><strong>Compression depth:</strong> 5-6 cm</li>
            <li><strong>Compression fraction:</strong> &gt;80%</li>
            <li><strong>Pre/post-shock pause:</strong> &lt;10 seconds</li>
            <li><strong>Ventilation rate:</strong> 10 breaths/min with advanced airway</li>
        </ul>

        <div class="critical-details">
            <div class="critical-details-title">
                Remember:
            </div>
            <p>ACLS is about systematic, algorithmic approaches. Know the algorithms, understand the physiology, and practice the skills. Good luck on your exam!</p>
        </div>
    </div>
</section>
~~~
