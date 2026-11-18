"""Export supported walkways from the same footprint data as runtime navigation."""
from pathlib import Path
import subprocess,json
root=Path('assets/ark-between-worlds/floors')
# Runtime exports scene-layout.json before invoking this builder.
layout=json.loads(Path('assets/ark-between-worlds/scene-layout.json').read_text())
shapes={}
for floor,points in zip(layout['floors'],layout['polygons']):
 name=floor['id'];x,y,w,h=floor['x'],floor['y'],floor['width'],floor['height'];depth=28
 local=[(px-x,py-y) for px,py in points]
 p=' '.join(f'{px},{py}' for px,py in local)
 sides=[]
 for a,b in zip(local,local[1:]+local[:1]):
  if b[0]<a[0]:
   sides.append(f'<path d="M{a[0]} {a[1]}L{b[0]} {b[1]}V{b[1]+depth}L{a[0]} {a[1]+depth}Z" fill="url(#side)" stroke="#8b98aa" stroke-width=".8"/>')
 svg=f'''<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}"><defs><linearGradient id="stone" x2=".3" y2="1"><stop stop-color="#f9f5ec"/><stop offset="1" stop-color="#d9dde4"/></linearGradient><linearGradient id="side" x2="0" y2="1"><stop stop-color="#b4bdca"/><stop offset="1" stop-color="#8795aa"/></linearGradient><pattern id="tiles" width="108" height="54" patternUnits="userSpaceOnUse"><path d="M0 27L54 0L108 27L54 54Z" fill="none" stroke="#a8b3c1" stroke-opacity=".4" stroke-width=".8"/><path d="M55 28L104 28" stroke="#fffaf0" stroke-opacity=".3" stroke-width=".6"/></pattern><clipPath id="clip"><polygon points="{p}"/></clipPath></defs>{''.join(sides)}<polygon points="{p}" fill="url(#stone)" stroke="#a3acb9" stroke-width="2"/><polygon points="{p}" fill="url(#tiles)"/><g clip-path="url(#clip)"><polygon points="{p}" fill="none" stroke="#f7efde" stroke-width="15" stroke-linejoin="round"/><polygon points="{p}" fill="none" stroke="#baa77e" stroke-width="2" stroke-linejoin="round"/></g></svg>'''
 (root/(name+'.svg')).write_text(svg)
 subprocess.run(['magick','-background','none',str(root/(name+'.svg')),str(root/(name+'.png'))],check=True)
 shapes[name]={'box':[x,y,w,h],'points':points,'foundationDepth':depth}
(root/'floor-manifest.json').write_text(json.dumps(shapes,indent=2)+'\n')
print('Exported supported, beveled walkways from scene footprints.')
