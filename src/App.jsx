import { useEffect, useMemo, useRef, useState } from "react";
import {
  Activity,
  Bot,
  CheckCircle2,
  Coffee,
  Gauge,
  HeartPulse,
  Mic,
  Music2,
  PauseCircle,
  RotateCcw,
  Sparkles,
  Square,
  Target,
  Timer,
  Trophy,
  Volume2,
  Waves,
} from "lucide-react";
import {
  analyzePitch,
  centsOff,
  formatFrequency,
  formatRange,
  frequencyToMidi,
  midiToFrequency,
  midiToNoteName,
  semitoneSpan,
} from "./audio";
import { loadCloudProgress, loadMe, saveCloudProgress } from "./api";
import { buildCoachTips, scoreAttempt } from "./coach";
import {
  dayKey,
  getDeviceId,
  loadProgress,
  loadTodaySession,
  mergeProgressRecords,
  mergeTodayIntoProgress,
  saveProgress,
  saveTodaySession,
} from "./storage";

const EXERCISE_STEPS = [57, 59, 60, 62, 64, 65, 67, 69, 71, 72];

const PRACTICE_FLOW = [
  {
    id: "warmup",
    label: "Warmup",
    title: "Gentle forward hum",
    prompt: "Hum softly on mmm, then open to mee without getting louder.",
    target: "Comfort first",
    icon: HeartPulse,
  },
  {
    id: "pitch",
    label: "Pitch",
    title: "Comfort pitch ladder",
    prompt: "Hear the tone, match it on ee, then repeat at the same effort.",
    target: "Accurate and easy",
    icon: Target,
  },
  {
    id: "resonance",
    label: "Resonance",
    title: "Bright resonance hold",
    prompt: "Keep the pitch steady while moving the buzz forward toward lips and teeth.",
    target: "Clearer, not louder",
    icon: Sparkles,
  },
  {
    id: "speech",
    label: "Speech",
    title: "Speech transfer",
    prompt: 'Say "hey, I am here" near the target note with the same bright shape.',
    target: "Carryover",
    icon: Waves,
  },
  {
    id: "cooldown",
    label: "Cooldown",
    title: "Release and reset",
    prompt: "Slide gently downward, sip water, and stop if anything feels scratchy.",
    target: "No strain",
    icon: PauseCircle,
  },
];

const HUM_DRILLS = [
  {
    title: "Closed-mouth hum",
    cue: "Lips together, teeth apart. Let the sound buzz around lips and nose for three easy breaths.",
    duration: "20 sec",
  },
  {
    title: "Hum into ee",
    cue: "Start on mmm, then open to a tiny ee without getting louder or heavier.",
    duration: "3 reps",
  },
  {
    title: "Tiny siren",
    cue: "Glide up and down only inside the comfortable range the app detected today.",
    duration: "4 slides",
  },
  {
    title: "Hum into words",
    cue: 'Hum once, then say "hey, I am here" with the same forward buzz.',
    duration: "3 phrases",
  },
];

const MODE_LABELS = {
  "comfort-ladder": "Comfort pitch ladder",
  "resonance-step": "Bright resonance hold",
  "speech-floor": "Speech floor support",
};

const PRACTICE_TIERS = {
  starter: {
    label: "Starter",
    minutes: 8,
    breakEvery: 4,
    description: "Tiny daily reps for a brand-new voice-training habit.",
  },
  steady: {
    label: "Steady",
    minutes: 14,
    breakEvery: 6,
    description: "Balanced practice with time for pitch, resonance, and speech.",
  },
  deep: {
    label: "Deep",
    minutes: 22,
    breakEvery: 7,
    description: "Longer session, only when the voice feels fresh and easy.",
  },
};

export default function App() {
  const [deviceId] = useState(getDeviceId);
  const [listening, setListening] = useState(false);
  const [micError, setMicError] = useState("");
  const [current, setCurrent] = useState({ frequency: null, clarity: 0, volume: 0 });
  const [history, setHistory] = useState([]);
  const [dailySession, setDailySession] = useState(loadTodaySession);
  const [progress, setProgress] = useState(loadProgress);
  const [targetIndex, setTargetIndex] = useState(() => loadProgress().lastTargetIndex ?? 0);
  const [exerciseMode, setExerciseMode] = useState(() => loadProgress().lastMode ?? "comfort-ladder");
  const [activeStep, setActiveStep] = useState(() => loadProgress().lastStep ?? "warmup");
  const [practiceTier, setPracticeTier] = useState(() => loadProgress().practiceTier ?? "starter");
  const [humDrillIndex, setHumDrillIndex] = useState(0);
  const [lastScore, setLastScore] = useState(null);
  const [isPlayingTone, setIsPlayingTone] = useState(false);
  const [recordingAttempt, setRecordingAttempt] = useState(false);
  const [attemptProgress, setAttemptProgress] = useState(0);
  const [syncStatus, setSyncStatus] = useState("local");
  const [authInfo, setAuthInfo] = useState({ authenticated: false, user: null });

  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const rafRef = useRef(null);
  const recordingRef = useRef(false);
  const attemptSamplesRef = useRef([]);
  const startTimeRef = useRef(Date.now());
  const progressTimerRef = useRef(null);
  const cloudLoadedRef = useRef(false);

  const targetMidi = useMemo(() => {
    if (exerciseMode === "resonance-step" && dailySession.highMidi !== null) {
      return Math.min(76, Math.max(62, dailySession.highMidi));
    }
    if (exerciseMode === "speech-floor" && dailySession.lowMidi !== null) {
      return Math.max(52, Math.min(64, dailySession.lowMidi + 2));
    }
    return EXERCISE_STEPS[targetIndex] ?? EXERCISE_STEPS[0];
  }, [dailySession.highMidi, dailySession.lowMidi, exerciseMode, targetIndex]);

  const targetFrequency = midiToFrequency(targetMidi);
  const currentMidi = current.frequency ? frequencyToMidi(current.frequency) : null;
  const currentCents = current.frequency ? centsOff(current.frequency, targetFrequency) : null;
  const sessionStats = useMemo(() => summarizeSession(history, current, dailySession), [history, current, dailySession]);
  const progressStats = useMemo(() => summarizeProgress(progress), [progress]);
  const tips = buildCoachTips({ history, targetFrequency, currentFrequency: current.frequency, dailySession });
  const activePractice = PRACTICE_FLOW.find((step) => step.id === activeStep) ?? PRACTICE_FLOW[0];
  const activeHumDrill = HUM_DRILLS[humDrillIndex] ?? HUM_DRILLS[0];
  const activeTier = PRACTICE_TIERS[practiceTier] ?? PRACTICE_TIERS.starter;
  const sessionPlan = useMemo(() => buildSessionPlan(activeTier, dailySession.minutes), [activeTier, dailySession.minutes]);
  const breakReminder = useMemo(
    () => getBreakReminder(activeTier, dailySession),
    [activeTier, dailySession],
  );
  const beginnerInstruction = getBeginnerInstruction({
    activeStep,
    listening,
    current,
    currentCents,
    recordingAttempt,
    lastScore,
  });

  useEffect(() => {
    saveTodaySession(dailySession);
    setProgress((currentProgress) => mergeTodayIntoProgress(currentProgress, dailySession, {
      targetIndex,
      activeStep,
      exerciseMode,
      practiceTier,
    }));
  }, [dailySession]);

  useEffect(() => {
    setProgress((currentProgress) => mergeTodayIntoProgress(currentProgress, dailySession, {
      targetIndex,
      activeStep,
      exerciseMode,
      practiceTier,
    }));
  }, [targetIndex, activeStep, exerciseMode, practiceTier]);

  useEffect(() => {
    saveProgress(progress);
    if (!cloudLoadedRef.current) return;
    setSyncStatus("syncing");
    const timeout = window.setTimeout(() => {
      saveCloudProgress(deviceId, progress)
        .then(() => setSyncStatus("synced"))
        .catch(() => setSyncStatus("local"));
    }, 500);
    return () => window.clearTimeout(timeout);
  }, [deviceId, progress]);

  useEffect(() => {
    let cancelled = false;
    loadMe().then((me) => {
      if (!cancelled) setAuthInfo(me);
    });
    loadCloudProgress(deviceId)
      .then((cloudProgress) => {
        if (cancelled) return;
        cloudLoadedRef.current = true;
        if (cloudProgress) {
          const merged = mergeProgressRecords(cloudProgress, progress);
          setProgress(merged);
          setTargetIndex(merged.lastTargetIndex ?? 0);
          setActiveStep(merged.lastStep ?? "warmup");
          setExerciseMode(merged.lastMode ?? "comfort-ladder");
          setPracticeTier(merged.practiceTier ?? "starter");
        }
        setSyncStatus("synced");
      })
      .catch(() => {
        if (!cancelled) {
          cloudLoadedRef.current = true;
          setSyncStatus("local");
        }
      });
    return () => {
      cancelled = true;
    };
  }, [deviceId]);

  useEffect(() => {
    drawVisualizer();
  }, [history, targetFrequency, current.frequency]);

  useEffect(() => () => stopListening(), []);

  async function startListening() {
    try {
      setMicError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
      });
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 4096;
      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);
      audioRef.current = { audioContext, analyser, stream, buffer: new Float32Array(analyser.fftSize) };
      setListening(true);
      startTimeRef.current = Date.now();
      tick();
      return true;
    } catch (error) {
      setMicError(error.message || "Could not access the microphone.");
      return false;
    }
  }

  function stopListening() {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (progressTimerRef.current) window.clearInterval(progressTimerRef.current);
    rafRef.current = null;
    progressTimerRef.current = null;
    recordingRef.current = false;
    const audio = audioRef.current;
    if (audio) {
      audio.stream.getTracks().forEach((track) => track.stop());
      audio.audioContext.close();
    }
    audioRef.current = null;
    setListening(false);
    setRecordingAttempt(false);
    setAttemptProgress(0);
  }

  function tick() {
    const audio = audioRef.current;
    if (!audio) return;
    audio.analyser.getFloatTimeDomainData(audio.buffer);
    const analysis = analyzePitch(audio.buffer, audio.audioContext.sampleRate);
    const sample = { ...analysis, time: Date.now() };
    setCurrent(analysis);
    setHistory((samples) => [...samples.slice(-300), sample]);

    if (recordingRef.current) {
      attemptSamplesRef.current = [...attemptSamplesRef.current.slice(-90), sample];
    }

    if (analysis.frequency && analysis.clarity > 0.35) {
      const midi = frequencyToMidi(analysis.frequency);
      setDailySession((session) => ({
        ...session,
        lowMidi: session.lowMidi === null ? midi : Math.min(session.lowMidi, midi),
        highMidi: session.highMidi === null ? midi : Math.max(session.highMidi, midi),
        minutes: Math.max(session.minutes, Math.round((Date.now() - startTimeRef.current) / 60000)),
      }));
    }
    rafRef.current = requestAnimationFrame(tick);
  }

  async function playTone() {
    setIsPlayingTone(true);
    const audioContext = new AudioContext();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = activeStep === "warmup" ? "triangle" : "sine";
    oscillator.frequency.value = targetFrequency;
    gain.gain.setValueAtTime(0, audioContext.currentTime);
    gain.gain.linearRampToValueAtTime(0.16, audioContext.currentTime + 0.04);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 1.35);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + 1.4);
    oscillator.onended = () => {
      audioContext.close();
      setIsPlayingTone(false);
    };
  }

  async function beginAttempt() {
    if (!listening) {
      const started = await startListening();
      if (!started) return;
    }
    attemptSamplesRef.current = [];
    recordingRef.current = true;
    setAttemptProgress(0);
    setLastScore(null);
    setRecordingAttempt(true);

    const startedAt = Date.now();
    progressTimerRef.current = window.setInterval(() => {
      setAttemptProgress(Math.min(100, ((Date.now() - startedAt) / 3000) * 100));
    }, 80);

    window.setTimeout(() => {
      recordingRef.current = false;
      setRecordingAttempt(false);
      setAttemptProgress(100);
      if (progressTimerRef.current) window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
      const result = scoreAttempt({ targetFrequency, samples: attemptSamplesRef.current });
      const enriched = { ...result, mode: exerciseMode, step: activeStep, time: Date.now() };
      setLastScore(enriched);
      setDailySession((session) => ({ ...session, attempts: [...session.attempts.slice(-17), enriched] }));
      if (result.score >= 86 && activeStep === "pitch") {
        setTargetIndex((index) => Math.min(EXERCISE_STEPS.length - 1, index + 1));
      }
    }, 3000);
  }

  function resetDay() {
    const reset = { date: dayKey(), lowMidi: null, highMidi: null, attempts: [], minutes: 0, breakAcknowledged: [] };
    setDailySession(reset);
    saveTodaySession(reset);
    setHistory([]);
    setLastScore(null);
    setAttemptProgress(0);
  }

  function acknowledgeBreak(id) {
    setDailySession((session) => ({
      ...session,
      breakAcknowledged: [...new Set([...(session.breakAcknowledged ?? []), id])],
    }));
  }

  function nextHumDrill() {
    setHumDrillIndex((index) => (index + 1) % HUM_DRILLS.length);
  }

  function drawVisualizer() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);

    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, "#fff8ed");
    gradient.addColorStop(1, "#edf8f5");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    const minMidi = 45;
    const maxMidi = 84;
    const xFor = (index, total) => (total <= 1 ? 0 : (index / (total - 1)) * width);
    const yForMidi = (midi) => height - ((midi - minMidi) / (maxMidi - minMidi)) * height;

    ctx.fillStyle = "rgba(123, 79, 214, 0.08)";
    ctx.fillRect(0, yForMidi(76), width, yForMidi(60) - yForMidi(76));
    ctx.fillStyle = "rgba(20, 122, 126, 0.09)";
    ctx.fillRect(0, yForMidi(targetMidi + 0.18), width, yForMidi(targetMidi - 0.18) - yForMidi(targetMidi + 0.18));

    ctx.strokeStyle = "rgba(34, 35, 32, 0.13)";
    ctx.lineWidth = 1;
    for (let midi = 48; midi <= 84; midi += 6) {
      const y = yForMidi(midi);
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
      if (midi % 12 === 0) {
        ctx.fillStyle = "rgba(34, 35, 32, 0.58)";
        ctx.font = "12px system-ui";
        ctx.fillText(midiToNoteName(midi), 12, y - 6);
      }
    }

    const targetY = yForMidi(targetMidi);
    ctx.strokeStyle = "#147a7e";
    ctx.lineWidth = 2;
    ctx.setLineDash([8, 8]);
    ctx.beginPath();
    ctx.moveTo(0, targetY);
    ctx.lineTo(width, targetY);
    ctx.stroke();
    ctx.setLineDash([]);

    const voiced = history.filter((sample) => sample.frequency && sample.clarity > 0.35);
    ctx.strokeStyle = "#7b4fd6";
    ctx.lineWidth = 3;
    ctx.beginPath();
    voiced.forEach((sample, index) => {
      const midi = 69 + 12 * Math.log2(sample.frequency / 440);
      const x = xFor(index, Math.max(1, voiced.length));
      const y = yForMidi(midi);
      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.stroke();

    if (current.frequency) {
      const y = yForMidi(69 + 12 * Math.log2(current.frequency / 440));
      ctx.fillStyle = "#222320";
      ctx.beginPath();
      ctx.arc(width - 18, y, 6, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  return (
    <main className="app-shell">
      <section className="hero">
        <div>
          <p className="eyebrow">LuovaVoice</p>
          <h1>Build a transfemme voice that feels bright, easy, and yours.</h1>
          <p className="hero-copy">
            Real-time pitch tracking, gentle AI-style coaching, and guided drills for resonance, pitch comfort,
            and speech carryover. Stop if you feel pain, scratchiness, or fatigue.
          </p>
        </div>
        <div className="hero-actions">
          {authInfo.authenticated ? (
            <a className="auth-action" href="/auth/logout">
              {authInfo.user?.display_name || authInfo.user?.username || "Signed in"}
            </a>
          ) : (
            <a className="auth-action" href="/auth/login">Sign in with LuovaAuth</a>
          )}
          <button className="primary-action" onClick={listening ? stopListening : startListening}>
            {listening ? <Square /> : <Mic />}
            {listening ? "Stop mic" : "Start mic"}
          </button>
          <button className="icon-action" onClick={resetDay} aria-label="Reset today's session">
            <RotateCcw />
          </button>
        </div>
      </section>

      <section className="beginner-coach" aria-label="Beginner coach">
        <div className="coach-script">
          <span className="coach-avatar"><Bot /></span>
          <div>
            <p className="eyebrow">Start here</p>
            <h2>{beginnerInstruction.title}</h2>
            <p>{beginnerInstruction.text}</p>
          </div>
        </div>
        <ol className="session-plan">
          <li className={activeStep === "warmup" ? "current" : ""}>
            <strong>Warm up</strong>
            <span>Quiet hums, no performance voice yet.</span>
          </li>
          <li className={activeStep === "pitch" ? "current" : ""}>
            <strong>Match one note</strong>
            <span>Play tone, repeat, then let the app score it.</span>
          </li>
          <li className={activeStep === "resonance" ? "current" : ""}>
            <strong>Make it brighter</strong>
            <span>Same effort, more forward buzz.</span>
          </li>
          <li className={activeStep === "speech" ? "current" : ""}>
            <strong>Use words</strong>
            <span>Carry the shape into a short phrase.</span>
          </li>
        </ol>
      </section>

      {micError && <p className="alert">{micError}</p>}

      <section className="metrics-grid" aria-label="Daily voice metrics">
        <Metric icon={<Music2 />} label="Detected now" value={current.frequency ? midiToNoteName(currentMidi) : "--"} detail={formatFrequency(current.frequency)} />
        <Metric icon={<Gauge />} label="Comfort range today" value={formatRange(dailySession.lowMidi, dailySession.highMidi)} detail={`${semitoneSpan(dailySession.lowMidi, dailySession.highMidi)} semitones mapped`} />
        <Metric icon={<Activity />} label="Stability" value={`${sessionStats.stability}%`} detail={`${sessionStats.stabilityLabel} pitch hold`} />
        <Metric icon={<HeartPulse />} label="Effort signal" value={sessionStats.effortLabel} detail={`Mic level ${Math.round(current.volume * 1000)}`} />
      </section>

      <section className="progress-dashboard" aria-label="Progress over time">
        <div className="progress-summary">
          <p className="eyebrow">Progress memory</p>
          <h2>Last time you reached {midiToNoteName(EXERCISE_STEPS[progress.lastTargetIndex] ?? EXERCISE_STEPS[0])} in {MODE_LABELS[progress.lastMode]}.</h2>
          <p>
            Best saved range: {formatRange(progress.bestLowMidi, progress.bestHighMidi)}.
            {progress.bestScore !== null ? ` Best scored repeat: ${progress.bestScore}/100 on ${progress.bestScoreNote}.` : " Score a repeat to start building your history."}
          </p>
          <span className={syncStatus === "synced" ? "sync-pill synced" : "sync-pill"}>
            {syncStatus === "synced"
              ? authInfo.authenticated ? "LuovaAuth progress synced" : "Anonymous cloud synced"
              : syncStatus === "syncing" ? "Syncing progress" : "Saved on this device"}
          </span>
        </div>
        <div className="progress-stats">
          <ProgressStat icon={<Trophy />} label="Practice days" value={progress.totalPracticeDays} detail={`${progressStats.streak} day streak`} />
          <ProgressStat icon={<Target />} label="Scored repeats" value={progress.totalAttempts} detail={`${progressStats.averageScore}% recent avg`} />
          <ProgressStat icon={<Gauge />} label="All-time range" value={`${progressStats.bestSpan} st`} detail={formatRange(progress.bestLowMidi, progress.bestHighMidi)} />
        </div>
        <div className="history-bars" aria-label="Recent practice history">
          {progressStats.daysForChart.map((day) => (
            <div className="history-day" key={day.date}>
              <span style={{ height: `${day.height}%` }} />
              <small>{day.label}</small>
            </div>
          ))}
        </div>
      </section>

      <section className="practice-tier-panel" aria-label="Practice tier and rest guidance">
        <div>
          <p className="eyebrow">Today’s training tier</p>
          <h2>{activeTier.label} session: {dailySession.minutes}/{activeTier.minutes} minutes</h2>
          <p>{sessionPlan.message}</p>
        </div>
        <div className="tier-options">
          {Object.entries(PRACTICE_TIERS).map(([id, tier]) => (
            <button
              className={practiceTier === id ? "tier-option selected" : "tier-option"}
              key={id}
              onClick={() => setPracticeTier(id)}
              aria-pressed={practiceTier === id}
            >
              <strong>{tier.label}</strong>
              <span>{tier.minutes} min</span>
            </button>
          ))}
        </div>
        <div className="tier-meter" aria-label="Daily practice target">
          <span style={{ width: `${sessionPlan.percent}%` }} />
        </div>
        {breakReminder && (
          <div className={breakReminder.kind === "done" ? "rest-reminder done" : "rest-reminder"}>
            <Coffee />
            <div>
              <strong>{breakReminder.title}</strong>
              <p>{breakReminder.text}</p>
            </div>
            <button onClick={() => acknowledgeBreak(breakReminder.id)}>
              {breakReminder.kind === "done" ? "Done for today" : "I took a break"}
            </button>
          </div>
        )}
      </section>

      <section className="practice-flow" aria-label="Practice flow">
        {PRACTICE_FLOW.map((step) => {
          const Icon = step.icon;
          const selected = step.id === activeStep;
          return (
            <button
              className={selected ? "flow-step selected" : "flow-step"}
              key={step.id}
              onClick={() => setActiveStep(step.id)}
              aria-pressed={selected}
            >
              <Icon />
              <span>{step.label}</span>
            </button>
          );
        })}
      </section>

      <section className="workspace">
        <article className="training-panel">
          <div className="panel-heading">
            <div>
              <p className="eyebrow">Guided practice</p>
              <h2>{activePractice.title}</h2>
              <p>{activePractice.prompt}</p>
            </div>
            <span className={Math.abs(currentCents ?? 999) <= 18 ? "status good" : "status"}>
              {currentCents === null ? "Waiting" : `${currentCents > 0 ? "+" : ""}${currentCents} cents`}
            </span>
          </div>

          <div className="exercise-controls">
            <label>
              Mode
              <select value={exerciseMode} onChange={(event) => setExerciseMode(event.target.value)}>
                <option value="comfort-ladder">Comfort pitch ladder</option>
                <option value="resonance-step">Bright resonance hold</option>
                <option value="speech-floor">Speech floor support</option>
              </select>
            </label>
            <div className="target-chip">
              <span>Target</span>
              <strong>{midiToNoteName(targetMidi)}</strong>
            </div>
            <button onClick={playTone} disabled={isPlayingTone}>
              <Volume2 />
              Play tone
            </button>
            <button className="primary-action" onClick={beginAttempt} disabled={recordingAttempt}>
              <Target />
              {recordingAttempt ? "Listening..." : "Score repeat"}
            </button>
          </div>

          <div className="coach-nudge">
            <strong>{beginnerInstruction.action}</strong>
            <span>{beginnerInstruction.why}</span>
          </div>

          <div className="hum-circuit" aria-label="Guided humming warmup">
            <div className="hum-circuit-heading">
              <div>
                <p className="eyebrow">Humming circuit</p>
                <h3>{activeHumDrill.title}</h3>
              </div>
              <span>{activeHumDrill.duration}</span>
            </div>
            <p>{activeHumDrill.cue}</p>
            <div className="hum-drill-steps">
              {HUM_DRILLS.map((drill, index) => (
                <button
                  className={index === humDrillIndex ? "selected" : ""}
                  key={drill.title}
                  onClick={() => setHumDrillIndex(index)}
                  aria-pressed={index === humDrillIndex}
                >
                  {index + 1}
                </button>
              ))}
              <button className="next-hum" onClick={nextHumDrill}>
                Next hum
              </button>
            </div>
          </div>

          {recordingAttempt && (
            <div className="recording-bar" aria-label="Recording progress">
              <span style={{ width: `${attemptProgress}%` }} />
            </div>
          )}

          <canvas ref={canvasRef} width="980" height="340" aria-label="Pitch trace against the exercise target" />

          <div className="micro-drills" aria-label="Transfemme voice practice prompts">
            <PracticeCard number="1" title="Hear it" text="Play the tone once, then imagine it as small, forward, and unforced." />
            <PracticeCard number="2" title="Shape it" text='Repeat on "ee", "ih", or a soft hum while keeping throat effort low.' />
            <PracticeCard number="3" title="Speak it" text='Say "hey, I am here" near the same pitch, keeping the resonance bright.' />
          </div>

          {lastScore && (
            <div className="score-card">
              <div className="score-ring" style={{ "--score": `${lastScore.score * 3.6}deg` }}>
                <strong>{lastScore.score}</strong>
                <span>/100</span>
              </div>
              <div>
                <h3>{lastScore.label}</h3>
                <p>
                  {lastScore.cents !== null
                    ? `${lastScore.cents > 0 ? "+" : ""}${lastScore.cents} cents average on ${lastScore.targetNote}.`
                    : "Try a longer, steadier sound so the coach has enough data."}
                </p>
              </div>
            </div>
          )}
        </article>

        <aside className="coach-panel">
          <div className="panel-heading compact">
            <div>
              <p className="eyebrow">Coach</p>
              <h2>What to adjust</h2>
            </div>
            <Bot />
          </div>

          <div className="coach-readout">
            <Readout label="Mode" value={MODE_LABELS[exerciseMode]} />
            <Readout label="Goal" value={activePractice.target} />
            <Readout label="Tier" value={`${activeTier.label} ${activeTier.minutes} min`} />
            <Readout label="Session" value={`${dailySession.attempts.length} scored repeats`} />
            <Readout label="Remembered target" value={midiToNoteName(EXERCISE_STEPS[progress.lastTargetIndex] ?? EXERCISE_STEPS[0])} />
          </div>

          <div className="lesson-card">
            <h3><Timer /> What matters</h3>
            <p>
              For transfemme voice, pitch helps, but it is not the whole voice. This app coaches toward
              comfortable pitch, brighter resonance, steady airflow, and speech habits you can actually keep.
            </p>
          </div>

          <div className="tip-list">
            {tips.map((tip) => (
              <div className="tip" key={tip.title}>
                <CheckCircle2 />
                <div>
                  <strong>{tip.title}</strong>
                  <p>{tip.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="attempt-log">
            <h3>Recent attempts</h3>
            {dailySession.attempts.length === 0 ? (
              <p className="muted">No scored repeats yet.</p>
            ) : (
              dailySession.attempts.slice().reverse().map((attempt, index) => (
                <div className="attempt" key={`${attempt.targetNote}-${attempt.time ?? index}`}>
                  <span>{attempt.targetNote}</span>
                  <small>{attempt.mode ? MODE_LABELS[attempt.mode] : "Practice"}</small>
                  <strong>{attempt.score}</strong>
                </div>
              ))
            )}
          </div>
        </aside>
      </section>
    </main>
  );
}

function summarizeSession(history, current, dailySession) {
  const voiced = history.filter((sample) => sample.frequency && sample.clarity > 0.35).slice(-50);
  if (voiced.length < 8) {
    return {
      stability: 0,
      stabilityLabel: "Waiting for",
      effortLabel: current.volume > 0.2 ? "High" : "Easy",
    };
  }
  const midiValues = voiced.map((sample) => 69 + 12 * Math.log2(sample.frequency / 440));
  const mean = midiValues.reduce((sum, value) => sum + value, 0) / midiValues.length;
  const spread = Math.sqrt(midiValues.reduce((sum, value) => sum + (value - mean) ** 2, 0) / midiValues.length);
  const stability = Math.round(Math.max(0, Math.min(100, 100 - spread * 95)));
  const effortLabel = current.volume > 0.2 ? "Too loud" : current.volume > 0.12 ? "Strong" : "Easy";
  const attemptsBonus = Math.min(8, dailySession.attempts.length);
  return {
    stability: Math.min(100, stability + attemptsBonus),
    stabilityLabel: stability > 78 ? "Steady" : stability > 50 ? "Settling" : "Wobbly",
    effortLabel,
  };
}

function summarizeProgress(progress) {
  const bestSpan = semitoneSpan(progress.bestLowMidi, progress.bestHighMidi);
  const scoredDays = progress.days.filter((day) => day.bestScore !== null);
  const recentScores = scoredDays.slice(0, 7).map((day) => day.bestScore);
  const averageScore = recentScores.length
    ? Math.round(recentScores.reduce((sum, score) => sum + score, 0) / recentScores.length)
    : 0;
  const daysForChart = buildDayChart(progress.days);
  return {
    bestSpan,
    streak: calculateStreak(progress.days),
    averageScore,
    daysForChart,
  };
}

function buildSessionPlan(tier, minutes) {
  const percent = Math.max(4, Math.min(100, Math.round((minutes / tier.minutes) * 100)));
  const remaining = Math.max(0, tier.minutes - minutes);
  if (remaining === 0) {
    return {
      percent,
      message: "You reached today’s planned practice time. Cool down, drink water, and let the voice rest.",
    };
  }
  if (minutes === 0) {
    return {
      percent,
      message: `${tier.description} Start with warmups, then do a few scored repeats.`,
    };
  }
  return {
    percent,
    message: `${remaining} minute${remaining === 1 ? "" : "s"} left. Keep everything gentle enough that you could still chat afterward.`,
  };
}

function getBreakReminder(tier, session) {
  const acknowledged = new Set(session.breakAcknowledged ?? []);
  if (session.minutes >= tier.minutes) {
    const id = `done-${tier.minutes}`;
    if (acknowledged.has(id)) return null;
    return {
      id,
      kind: "done",
      title: "Stop while it still feels easy",
      text: "You hit the plan for today. Do a soft slide down, sip water, and save the next reps for tomorrow.",
    };
  }
  const nextBreakMinute = Math.floor(session.minutes / tier.breakEvery) * tier.breakEvery;
  if (nextBreakMinute >= tier.breakEvery) {
    const id = `break-${nextBreakMinute}`;
    if (!acknowledged.has(id)) {
      return {
        id,
        kind: "break",
        title: "Take a quiet reset",
        text: "Rest for 60-90 seconds. Swallow, loosen the jaw, breathe low, and restart only if the voice still feels clear.",
      };
    }
  }
  return null;
}

function buildDayChart(days) {
  const byDate = new Map(days.map((day) => [day.date, day]));
  const today = new Date();
  return Array.from({ length: 14 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (13 - index));
    const key = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
    const day = byDate.get(key);
    const score = day?.bestScore ?? 0;
    const range = semitoneSpan(day?.lowMidi, day?.highMidi);
    return {
      date: key,
      label: `${date.getMonth() + 1}/${date.getDate()}`,
      height: Math.max(8, Math.min(100, score || range * 7 || 0)),
      active: Boolean(day),
    };
  });
}

function calculateStreak(days) {
  const practiced = new Set(days.map((day) => day.date));
  let streak = 0;
  const cursor = new Date();
  while (true) {
    const key = [
      cursor.getFullYear(),
      String(cursor.getMonth() + 1).padStart(2, "0"),
      String(cursor.getDate()).padStart(2, "0"),
    ].join("-");
    if (!practiced.has(key)) break;
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function getBeginnerInstruction({ activeStep, listening, current, currentCents, recordingAttempt, lastScore }) {
  if (!listening) {
    return {
      title: "Click Start mic, then make a tiny comfortable sound.",
      text: "You do not need to know your range yet. The app will detect notes as you hum and will keep today’s comfortable range for you.",
      action: "First move: press Start mic.",
      why: "Localhost will ask for microphone permission. Your audio stays in the browser.",
    };
  }
  if (!current.frequency) {
    return {
      title: "Make a soft hum until the note appears.",
      text: "Try mmm or ee at normal speaking volume. If nothing shows up, move a little closer to the mic.",
      action: "Give me 2-3 seconds of steady sound.",
      why: "The coach needs a stable note before it can give useful feedback.",
    };
  }
  if (recordingAttempt) {
    return {
      title: "Hold the sound gently until the bar finishes.",
      text: "Do not chase the meter. Keep the throat easy, the sound small, and the buzz forward.",
      action: "Keep going, no extra volume.",
      why: "A calm, repeatable voice matters more than forcing a perfect score.",
    };
  }
  if (lastScore?.score >= 86) {
    return {
      title: "Nice. Keep the feeling, not just the note.",
      text: "You matched the target well. Now try saying the short phrase while preserving the same light resonance.",
      action: "Move to Speech or try the next pitch.",
      why: "Voice training sticks when the exercise becomes speech.",
    };
  }
  if (currentCents !== null && Math.abs(currentCents) > 45 && activeStep === "pitch") {
    return {
      title: currentCents > 0 ? "You are above the target. Let it settle." : "You are below the target. Lift lightly.",
      text: "Use the tone as a reference, then adjust gently. Avoid squeezing upward or dropping into a heavy voice.",
      action: "Play tone, then Score repeat.",
      why: "Small adjustments train control faster than big jumps.",
    };
  }
  if (activeStep === "warmup") {
    return {
      title: "Warm up like you are waking the voice up.",
      text: "Use quiet hums and slides. The goal is easy vibration, not range or loudness.",
      action: "Hum softly for 20-30 seconds.",
      why: "A relaxed start makes the rest of practice safer and more accurate.",
    };
  }
  if (activeStep === "resonance") {
    return {
      title: "Make the same pitch feel brighter.",
      text: "Try ee or ih, smile slightly with the eyes, and feel the buzz closer to lips and teeth.",
      action: "Keep pitch steady while changing shape.",
      why: "Resonance is a major cue for feminine perception and everyday comfort.",
    };
  }
  if (activeStep === "speech") {
    return {
      title: "Now turn the sound into a tiny sentence.",
      text: 'Say "hey, I am here" lightly. If the phrase drops, go back to one easy hum and try again.',
      action: "Speak it, then score another repeat.",
      why: "The real goal is a voice you can use outside drills.",
    };
  }
  return {
    title: "You are ready for a scored repeat.",
    text: "Play the tone once, repeat it on a light vowel, and let the coach score the attempt.",
    action: "Press Score repeat.",
    why: "The score checks accuracy and steadiness, while coach notes help you adjust the next try.",
  };
}

function Metric({ icon, label, value, detail }) {
  return (
    <article className="metric">
      <div className="metric-icon">{icon}</div>
      <div>
        <span>{label}</span>
        <strong>{value}</strong>
        <small>{detail}</small>
      </div>
    </article>
  );
}

function ProgressStat({ icon, label, value, detail }) {
  return (
    <article>
      <div>{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{detail}</small>
    </article>
  );
}

function PracticeCard({ number, title, text }) {
  return (
    <div>
      <b>{number}</b>
      <strong>{title}</strong>
      <span>{text}</span>
    </div>
  );
}

function Readout({ label, value }) {
  return (
    <div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}
