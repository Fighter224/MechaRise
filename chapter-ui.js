(function(root){
 class StoryDialogue{
  constructor(){this.active=false;this.lines=[];this.index=0;this.after=null;this.node=document.createElement('section');this.node.className='story-dialogue';this.node.hidden=true;this.node.setAttribute('aria-label','Story dialogue');this.node.innerHTML='<div class="speaker-icon" aria-hidden="true"></div><div class="story-copy"><span class="story-speaker"></span><p class="story-line" aria-live="polite"></p></div><button class="story-next">CONTINUE →</button>';document.body.append(this.node);this.speaker=this.node.querySelector('.story-speaker');this.line=this.node.querySelector('.story-line');this.button=this.node.querySelector('button');this.button.onclick=()=>this.next();
   window.addEventListener('keydown',e=>{if(!this.active)return;e.stopImmediatePropagation();if(['enter',' ','e'].includes(e.key.toLowerCase())){e.preventDefault();if(!e.repeat)this.next();}},true);
  }
  show(lines,after=()=>{}){this.lines=lines;this.index=0;this.after=after;this.active=true;this.node.hidden=false;this.present();window.dispatchEvent(new Event('story-lock'));}
  present(){const [speaker,line]=this.lines[this.index];this.speaker.textContent=speaker;this.line.textContent=line;this.node.dataset.speaker=speaker.toLowerCase();this.button.textContent=this.index===this.lines.length-1?'CONTINUE ✓':'CONTINUE →';}
  next(){if(!this.active)return;this.index++;if(this.index<this.lines.length){this.present();return;}this.active=false;this.node.hidden=true;const after=this.after;this.after=null;after?.();}
 }
 root.StoryDialogue=StoryDialogue;
})(window);
