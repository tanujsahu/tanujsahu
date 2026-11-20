let context: AudioContext | null = null;
let master: GainNode | null = null;
let oscillators: OscillatorNode[] = [];

export function setAmbientEnabled(enabled: boolean) {
  if (typeof window === "undefined") return;

  if (!enabled) {
    stopAmbient();
    return;
  }

  const AudioContextCtor =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;
  if (!AudioContextCtor) return;

  if (!context) context = new AudioContextCtor();
  void context.resume();
  if (oscillators.length > 0) return;

  master = context.createGain();
  master.gain.value = 0.012;

  const filter = context.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = 380;
  filter.Q.value = 0.7;
  filter.connect(master);
  master.connect(context.destination);

  const tones = [
    { frequency: 98, type: "sine" as OscillatorType, gain: 0.55 },
    { frequency: 146.8, type: "sine" as OscillatorType, gain: 0.22 },
    { frequency: 196, type: "triangle" as OscillatorType, gain: 0.08 },
  ];

  oscillators = tones.map((tone) => {
    const oscillator = context!.createOscillator();
    const gain = context!.createGain();
    oscillator.type = tone.type;
    oscillator.frequency.value = tone.frequency;
    gain.gain.value = tone.gain;
    oscillator.connect(gain);
    gain.connect(filter);
    oscillator.start();
    return oscillator;
  });
}

function stopAmbient() {
  for (const oscillator of oscillators) {
    try {
      oscillator.stop();
    } catch {
      // already stopped
    }
    oscillator.disconnect();
  }
  oscillators = [];
  master?.disconnect();
  master = null;
  if (context && context.state === "running") {
    void context.suspend();
  }
}
