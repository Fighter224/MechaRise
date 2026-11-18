from pathlib import Path
import subprocess,json
root=Path('assets/lobby/modular');out=[]
def export(source,folder,names,cols,rows,trim=True):
 w,h=map(int,subprocess.check_output(['identify','-format','%w %h',str(root/'source'/source)]).decode().split())
 for i,name in enumerate(names):
  col=i%cols;row=i//cols;x=round(col*w/cols);y=round(row*h/rows);cw=round((col+1)*w/cols)-x;ch=round((row+1)*h/rows)-y
  if source=='buildings-isometric-v2.png':
   cuts=[0,round(h*.34505),round(h*.65885),h];y=cuts[row];ch=cuts[row+1]-y
  dest=root/folder/(name+'.png');cmd=['magick',str(root/'source'/source),'-crop',f'{cw}x{ch}+{x}+{y}','+repage']
  # Preserve frame padding for pilot animation; trim other sprites after export.
  subprocess.run(cmd+[str(dest)],check=True)
  bounds=None
  if trim:
   bounds=subprocess.check_output(['magick',str(dest),'-alpha','extract','-threshold','12%','-format','%@','info:']).decode().strip()
   subprocess.run(['magick',str(dest),'-crop',bounds,'+repage',str(dest)],check=True)
  dw,dh=map(int,subprocess.check_output(['identify','-format','%w %h',str(dest)]).decode().split());out.append({'id':name,'file':str(dest),'size':[dw,dh],'sourceRect':[x,y,cw,ch],'pivot':[.5,.94] if folder!='tiles' else [.5,.5],'unityPivot':[.5,.02] if folder=='pilot' else ([.5,.5] if folder=='tiles' else [.5,.06]),'trimBounds':bounds})
export('buildings-isometric-v2.png','buildings',['hangar','command','medical','supply','lounge','deploy'],2,3)
export('props.png','props',['tree-green','tree-pink','lamp-amber','lamp-cyan','crates','bench','planter','sector-gate'],4,2)
export('landscape.png','props',['cliff-bank','waterfall','garden-pond','garden-terrace'],2,2)
export('terrain.png','tiles',['grass','path','flowers','water'],2,2)
export('pilot.png','pilot',[f'{direction}-{i+1:02}' for direction in ['down','left','right','up'] for i in range(4)],4,4,False)
(root/'asset-manifest.json').write_text(json.dumps({'version':1,'pixelPilot':True,'assets':out},indent=2)+'\n')
print('Exported',len(out),'individual transparent PNG assets.')
