
export const playSound = (type, ctx) => {
  if (!ctx) return;
  if (ctx.state === 'suspended') ctx.resume();

  const t = ctx.currentTime;

  if (type === 'pop') {
      // Whimsical "Bloop"
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      // Random pitch for variety
      const freq = 500 + Math.random() * 200;
      osc.frequency.setValueAtTime(freq, t);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.5, t + 0.15);
      
      gain.gain.setValueAtTime(0, t);
      gain.gain.linearRampToValueAtTime(0.3, t + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.2);
  } else if (type === 'celebrate') {
      // Major Chord Arpeggio (Fanfare)
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C
      notes.forEach((note, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(note, t + i * 0.08);
          
          gain.gain.setValueAtTime(0, t + i * 0.08);
          gain.gain.linearRampToValueAtTime(0.2, t + i * 0.08 + 0.05);
          gain.gain.exponentialRampToValueAtTime(0.01, t + i * 0.08 + 0.8);
          
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(t + i * 0.08);
          osc.stop(t + i * 0.08 + 1.0);
      });
  }
};
