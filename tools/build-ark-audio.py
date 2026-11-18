"""Small original PCM cues/loops, reusable as Unity AudioClips (no downloads)."""
from pathlib import Path
import math,random,struct,wave
root=Path('assets/ark-between-worlds/audio');root.mkdir(exist_ok=True)
rate=22050;rng=random.Random(28)
def save(name,seconds,sample):
 count=int(seconds*rate)
 with wave.open(str(root/(name+'.wav')),'wb') as f:
  f.setnchannels(1);f.setsampwidth(2);f.setframerate(rate)
  f.writeframes(b''.join(struct.pack('<h',int(max(-1,min(1,sample(i/rate,i/count)))*32767)) for i in range(count)))
wind=0
def air(t,u):
 global wind
 wind=wind*.985+rng.uniform(-1,1)*.015
 return wind*.9*(math.sin(math.pi*u)**.3)
save('void-air',4,air)
save('core-hum',4,lambda t,u:(math.sin(t*math.tau*110)*.09+math.sin(t*math.tau*165)*.03+math.sin(t*math.tau*330)*.01)*(.85+.15*math.sin(t*math.tau*.5)))
save('dock-machinery',4,lambda t,u:math.sin(t*math.tau*55)*.07+math.sin(t*math.tau*82.5)*.025*(.65+.35*math.sin(t*math.tau*.5)))
for name,freq,noise in [('step-metal',680,.16),('step-stone',230,.25),('step-stairs',340,.2)]:
 save(name,.16,lambda t,u,f=freq,n=noise:(math.sin(t*math.tau*f)*.15+rng.uniform(-1,1)*n)*math.exp(-t*38)*min(1,t*800))
save('link-chime',.65,lambda t,u:(math.sin(t*math.tau*660)*.16+math.sin(t*math.tau*990)*.07)*math.exp(-t*6)*min(1,t*100))
save('blocked',.15,lambda t,u:math.sin(t*math.tau*(210-t*400))*.12*math.sin(math.pi*u)**2)
print('Exported eight original WAV ambient loops and interaction/footstep cues.')
