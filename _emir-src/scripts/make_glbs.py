from __future__ import annotations
from pathlib import Path
import json, struct, math

PROFILES = {
    'sedan':      {'dims': (1.85, .92, 4.45), 'wb': 2.72, 'ax': 1.72, 'wheel': (.36, .26), 'color': (0.09,0.09,0.09,1)},
    'hatchback':  {'dims': (1.76, .98, 3.75), 'wb': 2.42, 'ax': 1.62, 'wheel': (.32, .23), 'color': (0.88,0.86,0.82,1)},
    'offroader':  {'dims': (2.05,1.28, 4.70), 'wb': 2.86, 'ax': 1.90, 'wheel': (.48, .34), 'color': (0.26,0.25,0.20,1)},
    'truck':      {'dims': (2.45,1.72, 7.40), 'wb': 4.20, 'ax': 2.16, 'wheel': (.55, .42), 'color': (0.55,0.10,0.10,1)},
    'excavator':  {'dims': (2.85,1.95, 5.60), 'wb': 3.05, 'ax': 2.38, 'wheel': (.58, .54), 'color': (0.82,0.63,0.08,1)},
}

# Cube with 24 vertices so each face has clean normals.
FACES = [
    # normal, vertices
    ((0,0,1),  [(-.5,-.5,.5), (.5,-.5,.5), (.5,.5,.5), (-.5,.5,.5)]),
    ((0,0,-1), [(.5,-.5,-.5), (-.5,-.5,-.5), (-.5,.5,-.5), (.5,.5,-.5)]),
    ((1,0,0),  [(.5,-.5,.5), (.5,-.5,-.5), (.5,.5,-.5), (.5,.5,.5)]),
    ((-1,0,0), [(-.5,-.5,-.5), (-.5,-.5,.5), (-.5,.5,.5), (-.5,.5,-.5)]),
    ((0,1,0),  [(-.5,.5,.5), (.5,.5,.5), (.5,.5,-.5), (-.5,.5,-.5)]),
    ((0,-1,0), [(-.5,-.5,-.5), (.5,-.5,-.5), (.5,-.5,.5), (-.5,-.5,.5)]),
]

def cube_binary():
    positions=[]; normals=[]; indices=[]
    for face_i, (n, verts) in enumerate(FACES):
        base=face_i*4
        positions.extend(verts)
        normals.extend([n]*4)
        indices.extend([base,base+1,base+2, base,base+2,base+3])
    bin_blob=b''
    views=[]; accessors=[]
    def add_blob(data, target, component_type, type_, count, minv=None, maxv=None):
        nonlocal bin_blob
        while len(bin_blob)%4: bin_blob+=b'\x00'
        offset=len(bin_blob)
        bin_blob += data
        views.append({'buffer':0,'byteOffset':offset,'byteLength':len(data),'target':target})
        accessor={'bufferView':len(views)-1,'componentType':component_type,'count':count,'type':type_}
        if minv is not None: accessor['min']=minv
        if maxv is not None: accessor['max']=maxv
        accessors.append(accessor)
        return len(accessors)-1
    pos_data=b''.join(struct.pack('<3f', *p) for p in positions)
    nrm_data=b''.join(struct.pack('<3f', *n) for n in normals)
    idx_data=b''.join(struct.pack('<H', i) for i in indices)
    pos_acc=add_blob(pos_data, 34962, 5126, 'VEC3', len(positions), [-.5,-.5,-.5],[.5,.5,.5])
    nrm_acc=add_blob(nrm_data, 34962, 5126, 'VEC3', len(normals))
    idx_acc=add_blob(idx_data, 34963, 5123, 'SCALAR', len(indices), [0], [23])
    return bin_blob, views, accessors, pos_acc, nrm_acc, idx_acc

def make_glb(name, profile, outdir):
    bin_blob, views, accessors, pos_acc, nrm_acc, idx_acc = cube_binary()
    mats=[
        {'name':'body','pbrMetallicRoughness':{'baseColorFactor':profile['color'],'roughnessFactor':.78,'metallicFactor':.04}},
        {'name':'wheel','pbrMetallicRoughness':{'baseColorFactor':[.02,.02,.02,1],'roughnessFactor':.95,'metallicFactor':0}},
        {'name':'accent','pbrMetallicRoughness':{'baseColorFactor':[.96,.94,.88,1],'roughnessFactor':.65,'metallicFactor':.02}},
    ]
    meshes=[]
    for material in range(3):
        meshes.append({'primitives':[{'attributes':{'POSITION':pos_acc,'NORMAL':nrm_acc},'indices':idx_acc,'material':material}]})
    w,h,l=profile['dims']; wb=profile['wb']; ax=profile['ax']; wr, ww=profile['wheel']
    nodes=[]
    def node(node_name, mesh, translation, scale, rotation=None):
        n={'name':node_name,'mesh':mesh,'translation':list(translation),'scale':list(scale)}
        if rotation: n['rotation']=list(rotation)
        nodes.append(n); return len(nodes)-1
    scene_nodes=[]
    scene_nodes.append(node('chassis',0,(0,.42,0),(w,h,l)))
    scene_nodes.append(node('cabin_voxel',2,(0,h*.94,-l*.08),(w*.62,h*.55,l*.34)))
    # wheel cube is later animated by runtime; z-rotation initial is cosmetic only.
    rz=math.sin(math.pi/4); rw=math.cos(math.pi/4)
    wheel_scale=(wr*1.18, wr*1.18, ww)
    for key,x,z in [('fl',-ax*.5,-wb*.5),('fr',ax*.5,-wb*.5),('rl',-ax*.5,wb*.5),('rr',ax*.5,wb*.5)]:
        scene_nodes.append(node(f'wheel_{key}',1,(x,-.12,z),wheel_scale,(0,0,rz,rw)))
    if name=='truck':
        scene_nodes.append(node('cargo_box_voxel',0,(0,1.05,1.2),(w*.96,h*1.05,l*.46)))
    if name=='excavator':
        scene_nodes.append(node('excavator_boom_voxel',0,(0,2.2,-2.9),(.55,.55,5.6),(math.sin(-.18),0,0,math.cos(-.18))))
        scene_nodes.append(node('excavator_bucket_voxel',1,(0,1.2,-5.65),(1.2,.65,.8)))
    gltf={
        'asset': {'version':'2.0','generator':'Emir Car World placeholder generator'},
        'scene':0,
        'scenes':[{'nodes':scene_nodes}],
        'nodes':nodes,
        'meshes':meshes,
        'materials':mats,
        'buffers':[{'byteLength':len(bin_blob)}],
        'bufferViews':views,
        'accessors':accessors
    }
    json_blob=json.dumps(gltf,separators=(',',':')).encode('utf8')
    while len(json_blob)%4: json_blob+=b' '
    while len(bin_blob)%4: bin_blob+=b'\x00'
    total=12+8+len(json_blob)+8+len(bin_blob)
    out=struct.pack('<4sII',b'glTF',2,total)
    out+=struct.pack('<I4s',len(json_blob),b'JSON')+json_blob
    out+=struct.pack('<I4s',len(bin_blob),b'BIN\x00')+bin_blob
    (outdir/f'{name}.glb').write_bytes(out)

def generate_all(outdir: Path):
    outdir.mkdir(parents=True, exist_ok=True)
    for name, profile in PROFILES.items():
        make_glb(name, profile, outdir)
        print('wrote', outdir/f'{name}.glb')

if __name__=='__main__':
    generate_all(Path(__file__).resolve().parents[1]/'public/models/vehicles')
