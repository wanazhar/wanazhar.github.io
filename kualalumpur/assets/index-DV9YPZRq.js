(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();const Ys="181",Fi={ROTATE:0,DOLLY:1,PAN:2},Ni={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Wc=0,Ro=1,Xc=2,Xl=1,Kc=2,Cn=3,Jn=0,Xt=1,Pn=2,Un=0,Bi=1,Po=2,Lo=3,Do=4,qc=5,li=100,Yc=101,jc=102,$c=103,Zc=104,Jc=200,Qc=201,ed=202,td=203,is=204,as=205,nd=206,id=207,ad=208,rd=209,sd=210,od=211,ld=212,cd=213,dd=214,rs=0,ss=1,os=2,zi=3,ls=4,cs=5,ds=6,hs=7,js=0,hd=1,ud=2,$n=0,fd=1,pd=2,md=3,Kl=4,xd=5,gd=6,_d=7,ql=300,Gi=301,Vi=302,us=303,fs=304,dr=306,ps=1e3,Ln=1001,ms=1002,Zt=1003,vd=1004,Ta=1005,an=1006,_r=1007,di=1008,vn=1009,Yl=1010,jl=1011,fa=1012,$s=1013,ui=1014,gn=1015,qi=1016,Zs=1017,Js=1018,pa=1020,$l=35902,Zl=35899,Jl=1021,Ql=1022,fn=1023,ma=1026,xa=1027,Qs=1028,eo=1029,to=1030,no=1031,io=1033,ja=33776,$a=33777,Za=33778,Ja=33779,xs=35840,gs=35841,_s=35842,vs=35843,ys=36196,Ms=37492,bs=37496,Ss=37808,Ts=37809,Es=37810,ws=37811,As=37812,Cs=37813,Rs=37814,Ps=37815,Ls=37816,Ds=37817,Is=37818,Us=37819,Ns=37820,Fs=37821,Bs=36492,ks=36494,Os=36495,zs=36283,Gs=36284,Vs=36285,Hs=36286,yd=3200,Md=3201,ec=0,bd=1,Kn="",$t="srgb",Hi="srgb-linear",ir="linear",at="srgb",gi=7680,Io=519,Sd=512,Td=513,Ed=514,tc=515,wd=516,Ad=517,Cd=518,Rd=519,ar=35044,Uo="300 es",_n=2e3,rr=2001;function nc(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function sr(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Pd(){const i=sr("canvas");return i.style.display="block",i}const No={};function Fo(...i){const e="THREE."+i.shift();console.log(e,...i)}function Ie(...i){const e="THREE."+i.shift();console.warn(e,...i)}function gt(...i){const e="THREE."+i.shift();console.error(e,...i)}function ga(...i){const e=i.join(" ");e in No||(No[e]=!0,Ie(...i))}function Ld(i,e,t){return new Promise(function(n,a){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:a();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}class pi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const a=n[e];if(a!==void 0){const r=a.indexOf(t);r!==-1&&a.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const a=n.slice(0);for(let r=0,s=a.length;r<s;r++)a[r].call(this,e);e.target=null}}}const Ct=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Bo=1234567;const ha=Math.PI/180,_a=180/Math.PI;function Yi(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ct[i&255]+Ct[i>>8&255]+Ct[i>>16&255]+Ct[i>>24&255]+"-"+Ct[e&255]+Ct[e>>8&255]+"-"+Ct[e>>16&15|64]+Ct[e>>24&255]+"-"+Ct[t&63|128]+Ct[t>>8&255]+"-"+Ct[t>>16&255]+Ct[t>>24&255]+Ct[n&255]+Ct[n>>8&255]+Ct[n>>16&255]+Ct[n>>24&255]).toLowerCase()}function ze(i,e,t){return Math.max(e,Math.min(t,i))}function ao(i,e){return(i%e+e)%e}function Dd(i,e,t,n,a){return n+(i-e)*(a-n)/(t-e)}function Id(i,e,t){return i!==e?(t-i)/(e-i):0}function ua(i,e,t){return(1-t)*i+t*e}function Ud(i,e,t,n){return ua(i,e,1-Math.exp(-t*n))}function Nd(i,e=1){return e-Math.abs(ao(i,e*2)-e)}function Fd(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Bd(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function kd(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Od(i,e){return i+Math.random()*(e-i)}function zd(i){return i*(.5-Math.random())}function Gd(i){i!==void 0&&(Bo=i);let e=Bo+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Vd(i){return i*ha}function Hd(i){return i*_a}function Wd(i){return(i&i-1)===0&&i!==0}function Xd(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Kd(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function qd(i,e,t,n,a){const r=Math.cos,s=Math.sin,o=r(t/2),l=s(t/2),c=r((e+n)/2),d=s((e+n)/2),h=r((e-n)/2),u=s((e-n)/2),p=r((n-e)/2),x=s((n-e)/2);switch(a){case"XYX":i.set(o*d,l*h,l*u,o*c);break;case"YZY":i.set(l*u,o*d,l*h,o*c);break;case"ZXZ":i.set(l*h,l*u,o*d,o*c);break;case"XZX":i.set(o*d,l*x,l*p,o*c);break;case"YXY":i.set(l*p,o*d,l*x,o*c);break;case"ZYZ":i.set(l*x,l*p,o*d,o*c);break;default:Ie("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function Di(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Dt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const qn={DEG2RAD:ha,RAD2DEG:_a,generateUUID:Yi,clamp:ze,euclideanModulo:ao,mapLinear:Dd,inverseLerp:Id,lerp:ua,damp:Ud,pingpong:Nd,smoothstep:Fd,smootherstep:Bd,randInt:kd,randFloat:Od,randFloatSpread:zd,seededRandom:Gd,degToRad:Vd,radToDeg:Hd,isPowerOfTwo:Wd,ceilPowerOfTwo:Xd,floorPowerOfTwo:Kd,setQuaternionFromProperEuler:qd,normalize:Dt,denormalize:Di};class Ue{constructor(e=0,t=0){Ue.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,a=e.elements;return this.x=a[0]*t+a[3]*n+a[6],this.y=a[1]*t+a[4]*n+a[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ze(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),a=Math.sin(t),r=this.x-e.x,s=this.y-e.y;return this.x=r*n-s*a+e.x,this.y=r*a+s*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Bn{constructor(e=0,t=0,n=0,a=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=a}static slerpFlat(e,t,n,a,r,s,o){let l=n[a+0],c=n[a+1],d=n[a+2],h=n[a+3],u=r[s+0],p=r[s+1],x=r[s+2],_=r[s+3];if(o<=0){e[t+0]=l,e[t+1]=c,e[t+2]=d,e[t+3]=h;return}if(o>=1){e[t+0]=u,e[t+1]=p,e[t+2]=x,e[t+3]=_;return}if(h!==_||l!==u||c!==p||d!==x){let m=l*u+c*p+d*x+h*_;m<0&&(u=-u,p=-p,x=-x,_=-_,m=-m);let f=1-o;if(m<.9995){const E=Math.acos(m),T=Math.sin(E);f=Math.sin(f*E)/T,o=Math.sin(o*E)/T,l=l*f+u*o,c=c*f+p*o,d=d*f+x*o,h=h*f+_*o}else{l=l*f+u*o,c=c*f+p*o,d=d*f+x*o,h=h*f+_*o;const E=1/Math.sqrt(l*l+c*c+d*d+h*h);l*=E,c*=E,d*=E,h*=E}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,a,r,s){const o=n[a],l=n[a+1],c=n[a+2],d=n[a+3],h=r[s],u=r[s+1],p=r[s+2],x=r[s+3];return e[t]=o*x+d*h+l*p-c*u,e[t+1]=l*x+d*u+c*h-o*p,e[t+2]=c*x+d*p+o*u-l*h,e[t+3]=d*x-o*h-l*u-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,a){return this._x=e,this._y=t,this._z=n,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,a=e._y,r=e._z,s=e._order,o=Math.cos,l=Math.sin,c=o(n/2),d=o(a/2),h=o(r/2),u=l(n/2),p=l(a/2),x=l(r/2);switch(s){case"XYZ":this._x=u*d*h+c*p*x,this._y=c*p*h-u*d*x,this._z=c*d*x+u*p*h,this._w=c*d*h-u*p*x;break;case"YXZ":this._x=u*d*h+c*p*x,this._y=c*p*h-u*d*x,this._z=c*d*x-u*p*h,this._w=c*d*h+u*p*x;break;case"ZXY":this._x=u*d*h-c*p*x,this._y=c*p*h+u*d*x,this._z=c*d*x+u*p*h,this._w=c*d*h-u*p*x;break;case"ZYX":this._x=u*d*h-c*p*x,this._y=c*p*h+u*d*x,this._z=c*d*x-u*p*h,this._w=c*d*h+u*p*x;break;case"YZX":this._x=u*d*h+c*p*x,this._y=c*p*h+u*d*x,this._z=c*d*x-u*p*h,this._w=c*d*h-u*p*x;break;case"XZY":this._x=u*d*h-c*p*x,this._y=c*p*h-u*d*x,this._z=c*d*x+u*p*h,this._w=c*d*h+u*p*x;break;default:Ie("Quaternion: .setFromEuler() encountered an unknown order: "+s)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,a=Math.sin(n);return this._x=e.x*a,this._y=e.y*a,this._z=e.z*a,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],a=t[4],r=t[8],s=t[1],o=t[5],l=t[9],c=t[2],d=t[6],h=t[10],u=n+o+h;if(u>0){const p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(d-l)*p,this._y=(r-c)*p,this._z=(s-a)*p}else if(n>o&&n>h){const p=2*Math.sqrt(1+n-o-h);this._w=(d-l)/p,this._x=.25*p,this._y=(a+s)/p,this._z=(r+c)/p}else if(o>h){const p=2*Math.sqrt(1+o-n-h);this._w=(r-c)/p,this._x=(a+s)/p,this._y=.25*p,this._z=(l+d)/p}else{const p=2*Math.sqrt(1+h-n-o);this._w=(s-a)/p,this._x=(r+c)/p,this._y=(l+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ze(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const a=Math.min(1,t/n);return this.slerp(e,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,a=e._y,r=e._z,s=e._w,o=t._x,l=t._y,c=t._z,d=t._w;return this._x=n*d+s*o+a*c-r*l,this._y=a*d+s*l+r*o-n*c,this._z=r*d+s*c+n*l-a*o,this._w=s*d-n*o-a*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let n=e._x,a=e._y,r=e._z,s=e._w,o=this.dot(e);o<0&&(n=-n,a=-a,r=-r,s=-s,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),d=Math.sin(c);l=Math.sin(l*c)/d,t=Math.sin(t*c)/d,this._x=this._x*l+n*t,this._y=this._y*l+a*t,this._z=this._z*l+r*t,this._w=this._w*l+s*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+a*t,this._z=this._z*l+r*t,this._w=this._w*l+s*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),a=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(a*Math.sin(e),a*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(e=0,t=0,n=0){C.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(ko.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(ko.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,a=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*a,this.y=r[1]*t+r[4]*n+r[7]*a,this.z=r[2]*t+r[5]*n+r[8]*a,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,a=this.z,r=e.elements,s=1/(r[3]*t+r[7]*n+r[11]*a+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*a+r[12])*s,this.y=(r[1]*t+r[5]*n+r[9]*a+r[13])*s,this.z=(r[2]*t+r[6]*n+r[10]*a+r[14])*s,this}applyQuaternion(e){const t=this.x,n=this.y,a=this.z,r=e.x,s=e.y,o=e.z,l=e.w,c=2*(s*a-o*n),d=2*(o*t-r*a),h=2*(r*n-s*t);return this.x=t+l*c+s*h-o*d,this.y=n+l*d+o*c-r*h,this.z=a+l*h+r*d-s*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,a=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*a,this.y=r[1]*t+r[5]*n+r[9]*a,this.z=r[2]*t+r[6]*n+r[10]*a,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this.z=ze(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this.z=ze(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,a=e.y,r=e.z,s=t.x,o=t.y,l=t.z;return this.x=a*l-r*o,this.y=r*s-n*l,this.z=n*o-a*s,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return vr.copy(this).projectOnVector(e),this.sub(vr)}reflect(e){return this.sub(vr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ze(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,a=this.z-e.z;return t*t+n*n+a*a}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const a=Math.sin(t)*e;return this.x=a*Math.sin(n),this.y=Math.cos(t)*e,this.z=a*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),a=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=a,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const vr=new C,ko=new Bn;class Be{constructor(e,t,n,a,r,s,o,l,c){Be.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,a,r,s,o,l,c)}set(e,t,n,a,r,s,o,l,c){const d=this.elements;return d[0]=e,d[1]=a,d[2]=o,d[3]=t,d[4]=r,d[5]=l,d[6]=n,d[7]=s,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,a=t.elements,r=this.elements,s=n[0],o=n[3],l=n[6],c=n[1],d=n[4],h=n[7],u=n[2],p=n[5],x=n[8],_=a[0],m=a[3],f=a[6],E=a[1],T=a[4],w=a[7],L=a[2],b=a[5],R=a[8];return r[0]=s*_+o*E+l*L,r[3]=s*m+o*T+l*b,r[6]=s*f+o*w+l*R,r[1]=c*_+d*E+h*L,r[4]=c*m+d*T+h*b,r[7]=c*f+d*w+h*R,r[2]=u*_+p*E+x*L,r[5]=u*m+p*T+x*b,r[8]=u*f+p*w+x*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],a=e[2],r=e[3],s=e[4],o=e[5],l=e[6],c=e[7],d=e[8];return t*s*d-t*o*c-n*r*d+n*o*l+a*r*c-a*s*l}invert(){const e=this.elements,t=e[0],n=e[1],a=e[2],r=e[3],s=e[4],o=e[5],l=e[6],c=e[7],d=e[8],h=d*s-o*c,u=o*l-d*r,p=c*r-s*l,x=t*h+n*u+a*p;if(x===0)return this.set(0,0,0,0,0,0,0,0,0);const _=1/x;return e[0]=h*_,e[1]=(a*c-d*n)*_,e[2]=(o*n-a*s)*_,e[3]=u*_,e[4]=(d*t-a*l)*_,e[5]=(a*r-o*t)*_,e[6]=p*_,e[7]=(n*l-c*t)*_,e[8]=(s*t-n*r)*_,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,a,r,s,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*s+c*o)+s+e,-a*c,a*l,-a*(-c*s+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(yr.makeScale(e,t)),this}rotate(e){return this.premultiply(yr.makeRotation(-e)),this}translate(e,t){return this.premultiply(yr.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let a=0;a<9;a++)if(t[a]!==n[a])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const yr=new Be,Oo=new Be().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),zo=new Be().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Yd(){const i={enabled:!0,workingColorSpace:Hi,spaces:{},convert:function(a,r,s){return this.enabled===!1||r===s||!r||!s||(this.spaces[r].transfer===at&&(a.r=Nn(a.r),a.g=Nn(a.g),a.b=Nn(a.b)),this.spaces[r].primaries!==this.spaces[s].primaries&&(a.applyMatrix3(this.spaces[r].toXYZ),a.applyMatrix3(this.spaces[s].fromXYZ)),this.spaces[s].transfer===at&&(a.r=ki(a.r),a.g=ki(a.g),a.b=ki(a.b))),a},workingToColorSpace:function(a,r){return this.convert(a,this.workingColorSpace,r)},colorSpaceToWorking:function(a,r){return this.convert(a,r,this.workingColorSpace)},getPrimaries:function(a){return this.spaces[a].primaries},getTransfer:function(a){return a===Kn?ir:this.spaces[a].transfer},getToneMappingMode:function(a){return this.spaces[a].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(a,r=this.workingColorSpace){return a.fromArray(this.spaces[r].luminanceCoefficients)},define:function(a){Object.assign(this.spaces,a)},_getMatrix:function(a,r,s){return a.copy(this.spaces[r].toXYZ).multiply(this.spaces[s].fromXYZ)},_getDrawingBufferColorSpace:function(a){return this.spaces[a].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(a=this.workingColorSpace){return this.spaces[a].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(a,r){return ga("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(a,r)},toWorkingColorSpace:function(a,r){return ga("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(a,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Hi]:{primaries:e,whitePoint:n,transfer:ir,toXYZ:Oo,fromXYZ:zo,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:$t},outputColorSpaceConfig:{drawingBufferColorSpace:$t}},[$t]:{primaries:e,whitePoint:n,transfer:at,toXYZ:Oo,fromXYZ:zo,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:$t}}}),i}const je=Yd();function Nn(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ki(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let _i;class jd{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{_i===void 0&&(_i=sr("canvas")),_i.width=e.width,_i.height=e.height;const a=_i.getContext("2d");e instanceof ImageData?a.putImageData(e,0,0):a.drawImage(e,0,0,e.width,e.height),n=_i}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=sr("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const a=n.getImageData(0,0,e.width,e.height),r=a.data;for(let s=0;s<r.length;s++)r[s]=Nn(r[s]/255)*255;return n.putImageData(a,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Nn(t[n]/255)*255):t[n]=Nn(t[n]);return{data:t,width:e.width,height:e.height}}else return Ie("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let $d=0;class ro{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:$d++}),this.uuid=Yi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},a=this.data;if(a!==null){let r;if(Array.isArray(a)){r=[];for(let s=0,o=a.length;s<o;s++)a[s].isDataTexture?r.push(Mr(a[s].image)):r.push(Mr(a[s]))}else r=Mr(a);n.url=r}return t||(e.images[this.uuid]=n),n}}function Mr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?jd.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ie("Texture: Unable to serialize Texture."),{})}let Zd=0;const br=new C;class Ut extends pi{constructor(e=Ut.DEFAULT_IMAGE,t=Ut.DEFAULT_MAPPING,n=Ln,a=Ln,r=an,s=di,o=fn,l=vn,c=Ut.DEFAULT_ANISOTROPY,d=Kn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Zd++}),this.uuid=Yi(),this.name="",this.source=new ro(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=a,this.magFilter=r,this.minFilter=s,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ue(0,0),this.repeat=new Ue(1,1),this.center=new Ue(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Be,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(br).x}get height(){return this.source.getSize(br).y}get depth(){return this.source.getSize(br).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Ie(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const a=this[t];if(a===void 0){Ie(`Texture.setValues(): property '${t}' does not exist.`);continue}a&&n&&a.isVector2&&n.isVector2||a&&n&&a.isVector3&&n.isVector3||a&&n&&a.isMatrix3&&n.isMatrix3?a.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==ql)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case ps:e.x=e.x-Math.floor(e.x);break;case Ln:e.x=e.x<0?0:1;break;case ms:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case ps:e.y=e.y-Math.floor(e.y);break;case Ln:e.y=e.y<0?0:1;break;case ms:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ut.DEFAULT_IMAGE=null;Ut.DEFAULT_MAPPING=ql;Ut.DEFAULT_ANISOTROPY=1;class xt{constructor(e=0,t=0,n=0,a=1){xt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=a}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,a){return this.x=e,this.y=t,this.z=n,this.w=a,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,a=this.z,r=this.w,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*a+s[12]*r,this.y=s[1]*t+s[5]*n+s[9]*a+s[13]*r,this.z=s[2]*t+s[6]*n+s[10]*a+s[14]*r,this.w=s[3]*t+s[7]*n+s[11]*a+s[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,a,r;const l=e.elements,c=l[0],d=l[4],h=l[8],u=l[1],p=l[5],x=l[9],_=l[2],m=l[6],f=l[10];if(Math.abs(d-u)<.01&&Math.abs(h-_)<.01&&Math.abs(x-m)<.01){if(Math.abs(d+u)<.1&&Math.abs(h+_)<.1&&Math.abs(x+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const T=(c+1)/2,w=(p+1)/2,L=(f+1)/2,b=(d+u)/4,R=(h+_)/4,B=(x+m)/4;return T>w&&T>L?T<.01?(n=0,a=.707106781,r=.707106781):(n=Math.sqrt(T),a=b/n,r=R/n):w>L?w<.01?(n=.707106781,a=0,r=.707106781):(a=Math.sqrt(w),n=b/a,r=B/a):L<.01?(n=.707106781,a=.707106781,r=0):(r=Math.sqrt(L),n=R/r,a=B/r),this.set(n,a,r,t),this}let E=Math.sqrt((m-x)*(m-x)+(h-_)*(h-_)+(u-d)*(u-d));return Math.abs(E)<.001&&(E=1),this.x=(m-x)/E,this.y=(h-_)/E,this.z=(u-d)/E,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this.z=ze(this.z,e.z,t.z),this.w=ze(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this.z=ze(this.z,e,t),this.w=ze(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Jd extends pi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:an,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new xt(0,0,e,t),this.scissorTest=!1,this.viewport=new xt(0,0,e,t);const a={width:e,height:t,depth:n.depth},r=new Ut(a);this.textures=[];const s=n.count;for(let o=0;o<s;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:an,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let a=0,r=this.textures.length;a<r;a++)this.textures[a].image.width=e,this.textures[a].image.height=t,this.textures[a].image.depth=n,this.textures[a].isData3DTexture!==!0&&(this.textures[a].isArrayTexture=this.textures[a].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const a=Object.assign({},e.textures[t].image);this.textures[t].source=new ro(a)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class fi extends Jd{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class ic extends Ut{constructor(e=null,t=1,n=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:a},this.magFilter=Zt,this.minFilter=Zt,this.wrapR=Ln,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Qd extends Ut{constructor(e=null,t=1,n=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:a},this.magFilter=Zt,this.minFilter=Zt,this.wrapR=Ln,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class mi{constructor(e=new C(1/0,1/0,1/0),t=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ln.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ln.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=ln.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let s=0,o=r.count;s<o;s++)e.isMesh===!0?e.getVertexPosition(s,ln):ln.fromBufferAttribute(r,s),ln.applyMatrix4(e.matrixWorld),this.expandByPoint(ln);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ea.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ea.copy(n.boundingBox)),Ea.applyMatrix4(e.matrixWorld),this.union(Ea)}const a=e.children;for(let r=0,s=a.length;r<s;r++)this.expandByObject(a[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ln),ln.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ea),wa.subVectors(this.max,ea),vi.subVectors(e.a,ea),yi.subVectors(e.b,ea),Mi.subVectors(e.c,ea),On.subVectors(yi,vi),zn.subVectors(Mi,yi),ni.subVectors(vi,Mi);let t=[0,-On.z,On.y,0,-zn.z,zn.y,0,-ni.z,ni.y,On.z,0,-On.x,zn.z,0,-zn.x,ni.z,0,-ni.x,-On.y,On.x,0,-zn.y,zn.x,0,-ni.y,ni.x,0];return!Sr(t,vi,yi,Mi,wa)||(t=[1,0,0,0,1,0,0,0,1],!Sr(t,vi,yi,Mi,wa))?!1:(Aa.crossVectors(On,zn),t=[Aa.x,Aa.y,Aa.z],Sr(t,vi,yi,Mi,wa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ln).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ln).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(bn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),bn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),bn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),bn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),bn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),bn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),bn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),bn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(bn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const bn=[new C,new C,new C,new C,new C,new C,new C,new C],ln=new C,Ea=new mi,vi=new C,yi=new C,Mi=new C,On=new C,zn=new C,ni=new C,ea=new C,wa=new C,Aa=new C,ii=new C;function Sr(i,e,t,n,a){for(let r=0,s=i.length-3;r<=s;r+=3){ii.fromArray(i,r);const o=a.x*Math.abs(ii.x)+a.y*Math.abs(ii.y)+a.z*Math.abs(ii.z),l=e.dot(ii),c=t.dot(ii),d=n.dot(ii);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}const eh=new mi,ta=new C,Tr=new C;class ji{constructor(e=new C,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):eh.setFromPoints(e).getCenter(n);let a=0;for(let r=0,s=e.length;r<s;r++)a=Math.max(a,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(a),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ta.subVectors(e,this.center);const t=ta.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),a=(n-this.radius)*.5;this.center.addScaledVector(ta,a/n),this.radius+=a}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(Tr.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ta.copy(e.center).add(Tr)),this.expandByPoint(ta.copy(e.center).sub(Tr))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const Sn=new C,Er=new C,Ca=new C,Gn=new C,wr=new C,Ra=new C,Ar=new C;class so{constructor(e=new C,t=new C(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,Sn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=Sn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(Sn.copy(this.origin).addScaledVector(this.direction,t),Sn.distanceToSquared(e))}distanceSqToSegment(e,t,n,a){Er.copy(e).add(t).multiplyScalar(.5),Ca.copy(t).sub(e).normalize(),Gn.copy(this.origin).sub(Er);const r=e.distanceTo(t)*.5,s=-this.direction.dot(Ca),o=Gn.dot(this.direction),l=-Gn.dot(Ca),c=Gn.lengthSq(),d=Math.abs(1-s*s);let h,u,p,x;if(d>0)if(h=s*l-o,u=s*o-l,x=r*d,h>=0)if(u>=-x)if(u<=x){const _=1/d;h*=_,u*=_,p=h*(h+s*u+2*o)+u*(s*h+u+2*l)+c}else u=r,h=Math.max(0,-(s*u+o)),p=-h*h+u*(u+2*l)+c;else u=-r,h=Math.max(0,-(s*u+o)),p=-h*h+u*(u+2*l)+c;else u<=-x?(h=Math.max(0,-(-s*r+o)),u=h>0?-r:Math.min(Math.max(-r,-l),r),p=-h*h+u*(u+2*l)+c):u<=x?(h=0,u=Math.min(Math.max(-r,-l),r),p=u*(u+2*l)+c):(h=Math.max(0,-(s*r+o)),u=h>0?r:Math.min(Math.max(-r,-l),r),p=-h*h+u*(u+2*l)+c);else u=s>0?-r:r,h=Math.max(0,-(s*u+o)),p=-h*h+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),a&&a.copy(Er).addScaledVector(Ca,u),p}intersectSphere(e,t){Sn.subVectors(e.center,this.origin);const n=Sn.dot(this.direction),a=Sn.dot(Sn)-n*n,r=e.radius*e.radius;if(a>r)return null;const s=Math.sqrt(r-a),o=n-s,l=n+s;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,a,r,s,o,l;const c=1/this.direction.x,d=1/this.direction.y,h=1/this.direction.z,u=this.origin;return c>=0?(n=(e.min.x-u.x)*c,a=(e.max.x-u.x)*c):(n=(e.max.x-u.x)*c,a=(e.min.x-u.x)*c),d>=0?(r=(e.min.y-u.y)*d,s=(e.max.y-u.y)*d):(r=(e.max.y-u.y)*d,s=(e.min.y-u.y)*d),n>s||r>a||((r>n||isNaN(n))&&(n=r),(s<a||isNaN(a))&&(a=s),h>=0?(o=(e.min.z-u.z)*h,l=(e.max.z-u.z)*h):(o=(e.max.z-u.z)*h,l=(e.min.z-u.z)*h),n>l||o>a)||((o>n||n!==n)&&(n=o),(l<a||a!==a)&&(a=l),a<0)?null:this.at(n>=0?n:a,t)}intersectsBox(e){return this.intersectBox(e,Sn)!==null}intersectTriangle(e,t,n,a,r){wr.subVectors(t,e),Ra.subVectors(n,e),Ar.crossVectors(wr,Ra);let s=this.direction.dot(Ar),o;if(s>0){if(a)return null;o=1}else if(s<0)o=-1,s=-s;else return null;Gn.subVectors(this.origin,e);const l=o*this.direction.dot(Ra.crossVectors(Gn,Ra));if(l<0)return null;const c=o*this.direction.dot(wr.cross(Gn));if(c<0||l+c>s)return null;const d=-o*Gn.dot(Ar);return d<0?null:this.at(d/s,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class st{constructor(e,t,n,a,r,s,o,l,c,d,h,u,p,x,_,m){st.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,a,r,s,o,l,c,d,h,u,p,x,_,m)}set(e,t,n,a,r,s,o,l,c,d,h,u,p,x,_,m){const f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=a,f[1]=r,f[5]=s,f[9]=o,f[13]=l,f[2]=c,f[6]=d,f[10]=h,f[14]=u,f[3]=p,f[7]=x,f[11]=_,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new st().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,a=1/bi.setFromMatrixColumn(e,0).length(),r=1/bi.setFromMatrixColumn(e,1).length(),s=1/bi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*a,t[1]=n[1]*a,t[2]=n[2]*a,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*s,t[9]=n[9]*s,t[10]=n[10]*s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,a=e.y,r=e.z,s=Math.cos(n),o=Math.sin(n),l=Math.cos(a),c=Math.sin(a),d=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const u=s*d,p=s*h,x=o*d,_=o*h;t[0]=l*d,t[4]=-l*h,t[8]=c,t[1]=p+x*c,t[5]=u-_*c,t[9]=-o*l,t[2]=_-u*c,t[6]=x+p*c,t[10]=s*l}else if(e.order==="YXZ"){const u=l*d,p=l*h,x=c*d,_=c*h;t[0]=u+_*o,t[4]=x*o-p,t[8]=s*c,t[1]=s*h,t[5]=s*d,t[9]=-o,t[2]=p*o-x,t[6]=_+u*o,t[10]=s*l}else if(e.order==="ZXY"){const u=l*d,p=l*h,x=c*d,_=c*h;t[0]=u-_*o,t[4]=-s*h,t[8]=x+p*o,t[1]=p+x*o,t[5]=s*d,t[9]=_-u*o,t[2]=-s*c,t[6]=o,t[10]=s*l}else if(e.order==="ZYX"){const u=s*d,p=s*h,x=o*d,_=o*h;t[0]=l*d,t[4]=x*c-p,t[8]=u*c+_,t[1]=l*h,t[5]=_*c+u,t[9]=p*c-x,t[2]=-c,t[6]=o*l,t[10]=s*l}else if(e.order==="YZX"){const u=s*l,p=s*c,x=o*l,_=o*c;t[0]=l*d,t[4]=_-u*h,t[8]=x*h+p,t[1]=h,t[5]=s*d,t[9]=-o*d,t[2]=-c*d,t[6]=p*h+x,t[10]=u-_*h}else if(e.order==="XZY"){const u=s*l,p=s*c,x=o*l,_=o*c;t[0]=l*d,t[4]=-h,t[8]=c*d,t[1]=u*h+_,t[5]=s*d,t[9]=p*h-x,t[2]=x*h-p,t[6]=o*d,t[10]=_*h+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(th,e,nh)}lookAt(e,t,n){const a=this.elements;return Yt.subVectors(e,t),Yt.lengthSq()===0&&(Yt.z=1),Yt.normalize(),Vn.crossVectors(n,Yt),Vn.lengthSq()===0&&(Math.abs(n.z)===1?Yt.x+=1e-4:Yt.z+=1e-4,Yt.normalize(),Vn.crossVectors(n,Yt)),Vn.normalize(),Pa.crossVectors(Yt,Vn),a[0]=Vn.x,a[4]=Pa.x,a[8]=Yt.x,a[1]=Vn.y,a[5]=Pa.y,a[9]=Yt.y,a[2]=Vn.z,a[6]=Pa.z,a[10]=Yt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,a=t.elements,r=this.elements,s=n[0],o=n[4],l=n[8],c=n[12],d=n[1],h=n[5],u=n[9],p=n[13],x=n[2],_=n[6],m=n[10],f=n[14],E=n[3],T=n[7],w=n[11],L=n[15],b=a[0],R=a[4],B=a[8],M=a[12],y=a[1],D=a[5],O=a[9],V=a[13],X=a[2],H=a[6],Y=a[10],Q=a[14],W=a[3],ne=a[7],re=a[11],Me=a[15];return r[0]=s*b+o*y+l*X+c*W,r[4]=s*R+o*D+l*H+c*ne,r[8]=s*B+o*O+l*Y+c*re,r[12]=s*M+o*V+l*Q+c*Me,r[1]=d*b+h*y+u*X+p*W,r[5]=d*R+h*D+u*H+p*ne,r[9]=d*B+h*O+u*Y+p*re,r[13]=d*M+h*V+u*Q+p*Me,r[2]=x*b+_*y+m*X+f*W,r[6]=x*R+_*D+m*H+f*ne,r[10]=x*B+_*O+m*Y+f*re,r[14]=x*M+_*V+m*Q+f*Me,r[3]=E*b+T*y+w*X+L*W,r[7]=E*R+T*D+w*H+L*ne,r[11]=E*B+T*O+w*Y+L*re,r[15]=E*M+T*V+w*Q+L*Me,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],a=e[8],r=e[12],s=e[1],o=e[5],l=e[9],c=e[13],d=e[2],h=e[6],u=e[10],p=e[14],x=e[3],_=e[7],m=e[11],f=e[15];return x*(+r*l*h-a*c*h-r*o*u+n*c*u+a*o*p-n*l*p)+_*(+t*l*p-t*c*u+r*s*u-a*s*p+a*c*d-r*l*d)+m*(+t*c*h-t*o*p-r*s*h+n*s*p+r*o*d-n*c*d)+f*(-a*o*d-t*l*h+t*o*u+a*s*h-n*s*u+n*l*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const a=this.elements;return e.isVector3?(a[12]=e.x,a[13]=e.y,a[14]=e.z):(a[12]=e,a[13]=t,a[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],a=e[2],r=e[3],s=e[4],o=e[5],l=e[6],c=e[7],d=e[8],h=e[9],u=e[10],p=e[11],x=e[12],_=e[13],m=e[14],f=e[15],E=h*m*c-_*u*c+_*l*p-o*m*p-h*l*f+o*u*f,T=x*u*c-d*m*c-x*l*p+s*m*p+d*l*f-s*u*f,w=d*_*c-x*h*c+x*o*p-s*_*p-d*o*f+s*h*f,L=x*h*l-d*_*l-x*o*u+s*_*u+d*o*m-s*h*m,b=t*E+n*T+a*w+r*L;if(b===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/b;return e[0]=E*R,e[1]=(_*u*r-h*m*r-_*a*p+n*m*p+h*a*f-n*u*f)*R,e[2]=(o*m*r-_*l*r+_*a*c-n*m*c-o*a*f+n*l*f)*R,e[3]=(h*l*r-o*u*r-h*a*c+n*u*c+o*a*p-n*l*p)*R,e[4]=T*R,e[5]=(d*m*r-x*u*r+x*a*p-t*m*p-d*a*f+t*u*f)*R,e[6]=(x*l*r-s*m*r-x*a*c+t*m*c+s*a*f-t*l*f)*R,e[7]=(s*u*r-d*l*r+d*a*c-t*u*c-s*a*p+t*l*p)*R,e[8]=w*R,e[9]=(x*h*r-d*_*r-x*n*p+t*_*p+d*n*f-t*h*f)*R,e[10]=(s*_*r-x*o*r+x*n*c-t*_*c-s*n*f+t*o*f)*R,e[11]=(d*o*r-s*h*r-d*n*c+t*h*c+s*n*p-t*o*p)*R,e[12]=L*R,e[13]=(d*_*a-x*h*a+x*n*u-t*_*u-d*n*m+t*h*m)*R,e[14]=(x*o*a-s*_*a-x*n*l+t*_*l+s*n*m-t*o*m)*R,e[15]=(s*h*a-d*o*a+d*n*l-t*h*l-s*n*u+t*o*u)*R,this}scale(e){const t=this.elements,n=e.x,a=e.y,r=e.z;return t[0]*=n,t[4]*=a,t[8]*=r,t[1]*=n,t[5]*=a,t[9]*=r,t[2]*=n,t[6]*=a,t[10]*=r,t[3]*=n,t[7]*=a,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],a=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,a))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),a=Math.sin(t),r=1-n,s=e.x,o=e.y,l=e.z,c=r*s,d=r*o;return this.set(c*s+n,c*o-a*l,c*l+a*o,0,c*o+a*l,d*o+n,d*l-a*s,0,c*l-a*o,d*l+a*s,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,a,r,s){return this.set(1,n,r,0,e,1,s,0,t,a,1,0,0,0,0,1),this}compose(e,t,n){const a=this.elements,r=t._x,s=t._y,o=t._z,l=t._w,c=r+r,d=s+s,h=o+o,u=r*c,p=r*d,x=r*h,_=s*d,m=s*h,f=o*h,E=l*c,T=l*d,w=l*h,L=n.x,b=n.y,R=n.z;return a[0]=(1-(_+f))*L,a[1]=(p+w)*L,a[2]=(x-T)*L,a[3]=0,a[4]=(p-w)*b,a[5]=(1-(u+f))*b,a[6]=(m+E)*b,a[7]=0,a[8]=(x+T)*R,a[9]=(m-E)*R,a[10]=(1-(u+_))*R,a[11]=0,a[12]=e.x,a[13]=e.y,a[14]=e.z,a[15]=1,this}decompose(e,t,n){const a=this.elements;let r=bi.set(a[0],a[1],a[2]).length();const s=bi.set(a[4],a[5],a[6]).length(),o=bi.set(a[8],a[9],a[10]).length();this.determinant()<0&&(r=-r),e.x=a[12],e.y=a[13],e.z=a[14],cn.copy(this);const c=1/r,d=1/s,h=1/o;return cn.elements[0]*=c,cn.elements[1]*=c,cn.elements[2]*=c,cn.elements[4]*=d,cn.elements[5]*=d,cn.elements[6]*=d,cn.elements[8]*=h,cn.elements[9]*=h,cn.elements[10]*=h,t.setFromRotationMatrix(cn),n.x=r,n.y=s,n.z=o,this}makePerspective(e,t,n,a,r,s,o=_n,l=!1){const c=this.elements,d=2*r/(t-e),h=2*r/(n-a),u=(t+e)/(t-e),p=(n+a)/(n-a);let x,_;if(l)x=r/(s-r),_=s*r/(s-r);else if(o===_n)x=-(s+r)/(s-r),_=-2*s*r/(s-r);else if(o===rr)x=-s/(s-r),_=-s*r/(s-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=x,c[14]=_,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,a,r,s,o=_n,l=!1){const c=this.elements,d=2/(t-e),h=2/(n-a),u=-(t+e)/(t-e),p=-(n+a)/(n-a);let x,_;if(l)x=1/(s-r),_=s/(s-r);else if(o===_n)x=-2/(s-r),_=-(s+r)/(s-r);else if(o===rr)x=-1/(s-r),_=-r/(s-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=h,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=x,c[14]=_,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let a=0;a<16;a++)if(t[a]!==n[a])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const bi=new C,cn=new st,th=new C(0,0,0),nh=new C(1,1,1),Vn=new C,Pa=new C,Yt=new C,Go=new st,Vo=new Bn;class yn{constructor(e=0,t=0,n=0,a=yn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=a}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,a=this._order){return this._x=e,this._y=t,this._z=n,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const a=e.elements,r=a[0],s=a[4],o=a[8],l=a[1],c=a[5],d=a[9],h=a[2],u=a[6],p=a[10];switch(t){case"XYZ":this._y=Math.asin(ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-s,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ze(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(ze(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-s,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ze(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(u,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-s,c));break;case"YZX":this._z=Math.asin(ze(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-ze(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,p),this._y=0);break;default:Ie("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return Go.makeRotationFromQuaternion(e),this.setFromRotationMatrix(Go,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Vo.setFromEuler(this),this.setFromQuaternion(Vo,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}yn.DEFAULT_ORDER="XYZ";class ac{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let ih=0;const Ho=new C,Si=new Bn,Tn=new st,La=new C,na=new C,ah=new C,rh=new Bn,Wo=new C(1,0,0),Xo=new C(0,1,0),Ko=new C(0,0,1),qo={type:"added"},sh={type:"removed"},Ti={type:"childadded",child:null},Cr={type:"childremoved",child:null};class wt extends pi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:ih++}),this.uuid=Yi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=wt.DEFAULT_UP.clone();const e=new C,t=new yn,n=new Bn,a=new C(1,1,1);function r(){n.setFromEuler(t,!1)}function s(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new st},normalMatrix:{value:new Be}}),this.matrix=new st,this.matrixWorld=new st,this.matrixAutoUpdate=wt.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new ac,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Si.setFromAxisAngle(e,t),this.quaternion.multiply(Si),this}rotateOnWorldAxis(e,t){return Si.setFromAxisAngle(e,t),this.quaternion.premultiply(Si),this}rotateX(e){return this.rotateOnAxis(Wo,e)}rotateY(e){return this.rotateOnAxis(Xo,e)}rotateZ(e){return this.rotateOnAxis(Ko,e)}translateOnAxis(e,t){return Ho.copy(e).applyQuaternion(this.quaternion),this.position.add(Ho.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Wo,e)}translateY(e){return this.translateOnAxis(Xo,e)}translateZ(e){return this.translateOnAxis(Ko,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Tn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?La.copy(e):La.set(e,t,n);const a=this.parent;this.updateWorldMatrix(!0,!1),na.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Tn.lookAt(na,La,this.up):Tn.lookAt(La,na,this.up),this.quaternion.setFromRotationMatrix(Tn),a&&(Tn.extractRotation(a.matrixWorld),Si.setFromRotationMatrix(Tn),this.quaternion.premultiply(Si.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(gt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(qo),Ti.child=e,this.dispatchEvent(Ti),Ti.child=null):gt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(sh),Cr.child=e,this.dispatchEvent(Cr),Cr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Tn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Tn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Tn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(qo),Ti.child=e,this.dispatchEvent(Ti),Ti.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,a=this.children.length;n<a;n++){const s=this.children[n].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const a=this.children;for(let r=0,s=a.length;r<s;r++)a[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(na,e,ah),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(na,rh,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,a=t.length;n<a;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,a=t.length;n<a;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,a=t.length;n<a;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const a=this.children;for(let r=0,s=a.length;r<s;r++)a[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),a.instanceInfo=this._instanceInfo.map(o=>({...o})),a.availableInstanceIds=this._availableInstanceIds.slice(),a.availableGeometryIds=this._availableGeometryIds.slice(),a.nextIndexStart=this._nextIndexStart,a.nextVertexStart=this._nextVertexStart,a.geometryCount=this._geometryCount,a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.matricesTexture=this._matricesTexture.toJSON(e),a.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(a.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(a.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const h=l[c];r(e.shapes,h)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));a.material=o}else a.material=r(e.materials,this.material);if(this.children.length>0){a.children=[];for(let o=0;o<this.children.length;o++)a.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){a.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];a.animations.push(r(e.animations,l))}}if(t){const o=s(e.geometries),l=s(e.materials),c=s(e.textures),d=s(e.images),h=s(e.shapes),u=s(e.skeletons),p=s(e.animations),x=s(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),d.length>0&&(n.images=d),h.length>0&&(n.shapes=h),u.length>0&&(n.skeletons=u),p.length>0&&(n.animations=p),x.length>0&&(n.nodes=x)}return n.object=a,n;function s(o){const l=[];for(const c in o){const d=o[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const a=e.children[n];this.add(a.clone())}return this}}wt.DEFAULT_UP=new C(0,1,0);wt.DEFAULT_MATRIX_AUTO_UPDATE=!0;wt.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const dn=new C,En=new C,Rr=new C,wn=new C,Ei=new C,wi=new C,Yo=new C,Pr=new C,Lr=new C,Dr=new C,Ir=new xt,Ur=new xt,Nr=new xt;class hn{constructor(e=new C,t=new C,n=new C){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,a){a.subVectors(n,t),dn.subVectors(e,t),a.cross(dn);const r=a.lengthSq();return r>0?a.multiplyScalar(1/Math.sqrt(r)):a.set(0,0,0)}static getBarycoord(e,t,n,a,r){dn.subVectors(a,t),En.subVectors(n,t),Rr.subVectors(e,t);const s=dn.dot(dn),o=dn.dot(En),l=dn.dot(Rr),c=En.dot(En),d=En.dot(Rr),h=s*c-o*o;if(h===0)return r.set(0,0,0),null;const u=1/h,p=(c*l-o*d)*u,x=(s*d-o*l)*u;return r.set(1-p-x,x,p)}static containsPoint(e,t,n,a){return this.getBarycoord(e,t,n,a,wn)===null?!1:wn.x>=0&&wn.y>=0&&wn.x+wn.y<=1}static getInterpolation(e,t,n,a,r,s,o,l){return this.getBarycoord(e,t,n,a,wn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,wn.x),l.addScaledVector(s,wn.y),l.addScaledVector(o,wn.z),l)}static getInterpolatedAttribute(e,t,n,a,r,s){return Ir.setScalar(0),Ur.setScalar(0),Nr.setScalar(0),Ir.fromBufferAttribute(e,t),Ur.fromBufferAttribute(e,n),Nr.fromBufferAttribute(e,a),s.setScalar(0),s.addScaledVector(Ir,r.x),s.addScaledVector(Ur,r.y),s.addScaledVector(Nr,r.z),s}static isFrontFacing(e,t,n,a){return dn.subVectors(n,t),En.subVectors(e,t),dn.cross(En).dot(a)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,a){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[a]),this}setFromAttributeAndIndices(e,t,n,a){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,a),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return dn.subVectors(this.c,this.b),En.subVectors(this.a,this.b),dn.cross(En).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return hn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return hn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,a,r){return hn.getInterpolation(e,this.a,this.b,this.c,t,n,a,r)}containsPoint(e){return hn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return hn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,a=this.b,r=this.c;let s,o;Ei.subVectors(a,n),wi.subVectors(r,n),Pr.subVectors(e,n);const l=Ei.dot(Pr),c=wi.dot(Pr);if(l<=0&&c<=0)return t.copy(n);Lr.subVectors(e,a);const d=Ei.dot(Lr),h=wi.dot(Lr);if(d>=0&&h<=d)return t.copy(a);const u=l*h-d*c;if(u<=0&&l>=0&&d<=0)return s=l/(l-d),t.copy(n).addScaledVector(Ei,s);Dr.subVectors(e,r);const p=Ei.dot(Dr),x=wi.dot(Dr);if(x>=0&&p<=x)return t.copy(r);const _=p*c-l*x;if(_<=0&&c>=0&&x<=0)return o=c/(c-x),t.copy(n).addScaledVector(wi,o);const m=d*x-p*h;if(m<=0&&h-d>=0&&p-x>=0)return Yo.subVectors(r,a),o=(h-d)/(h-d+(p-x)),t.copy(a).addScaledVector(Yo,o);const f=1/(m+_+u);return s=_*f,o=u*f,t.copy(n).addScaledVector(Ei,s).addScaledVector(wi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const rc={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Hn={h:0,s:0,l:0},Da={h:0,s:0,l:0};function Fr(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Xe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const a=e;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=$t){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,je.colorSpaceToWorking(this,t),this}setRGB(e,t,n,a=je.workingColorSpace){return this.r=e,this.g=t,this.b=n,je.colorSpaceToWorking(this,a),this}setHSL(e,t,n,a=je.workingColorSpace){if(e=ao(e,1),t=ze(t,0,1),n=ze(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,s=2*n-r;this.r=Fr(s,r,e+1/3),this.g=Fr(s,r,e),this.b=Fr(s,r,e-1/3)}return je.colorSpaceToWorking(this,a),this}setStyle(e,t=$t){function n(r){r!==void 0&&parseFloat(r)<1&&Ie("Color: Alpha component of "+e+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const s=a[1],o=a[2];switch(s){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ie("Color: Unknown color model "+e)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=a[1],s=r.length;if(s===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(s===6)return this.setHex(parseInt(r,16),t);Ie("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=$t){const n=rc[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ie("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Nn(e.r),this.g=Nn(e.g),this.b=Nn(e.b),this}copyLinearToSRGB(e){return this.r=ki(e.r),this.g=ki(e.g),this.b=ki(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=$t){return je.workingToColorSpace(Rt.copy(this),e),Math.round(ze(Rt.r*255,0,255))*65536+Math.round(ze(Rt.g*255,0,255))*256+Math.round(ze(Rt.b*255,0,255))}getHexString(e=$t){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=je.workingColorSpace){je.workingToColorSpace(Rt.copy(this),t);const n=Rt.r,a=Rt.g,r=Rt.b,s=Math.max(n,a,r),o=Math.min(n,a,r);let l,c;const d=(o+s)/2;if(o===s)l=0,c=0;else{const h=s-o;switch(c=d<=.5?h/(s+o):h/(2-s-o),s){case n:l=(a-r)/h+(a<r?6:0);break;case a:l=(r-n)/h+2;break;case r:l=(n-a)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=je.workingColorSpace){return je.workingToColorSpace(Rt.copy(this),t),e.r=Rt.r,e.g=Rt.g,e.b=Rt.b,e}getStyle(e=$t){je.workingToColorSpace(Rt.copy(this),e);const t=Rt.r,n=Rt.g,a=Rt.b;return e!==$t?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(a*255)})`}offsetHSL(e,t,n){return this.getHSL(Hn),this.setHSL(Hn.h+e,Hn.s+t,Hn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Hn),e.getHSL(Da);const n=ua(Hn.h,Da.h,t),a=ua(Hn.s,Da.s,t),r=ua(Hn.l,Da.l,t);return this.setHSL(n,a,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,a=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*a,this.g=r[1]*t+r[4]*n+r[7]*a,this.b=r[2]*t+r[5]*n+r[8]*a,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Rt=new Xe;Xe.NAMES=rc;let oh=0;class $i extends pi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:oh++}),this.uuid=Yi(),this.name="",this.type="Material",this.blending=Bi,this.side=Jn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=is,this.blendDst=as,this.blendEquation=li,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xe(0,0,0),this.blendAlpha=0,this.depthFunc=zi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Io,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=gi,this.stencilZFail=gi,this.stencilZPass=gi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Ie(`Material: parameter '${t}' has value of undefined.`);continue}const a=this[t];if(a===void 0){Ie(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(n):a&&a.isVector3&&n&&n.isVector3?a.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Bi&&(n.blending=this.blending),this.side!==Jn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==is&&(n.blendSrc=this.blendSrc),this.blendDst!==as&&(n.blendDst=this.blendDst),this.blendEquation!==li&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==zi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Io&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==gi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==gi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==gi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function a(r){const s=[];for(const o in r){const l=r[o];delete l.metadata,s.push(l)}return s}if(t){const r=a(e.textures),s=a(e.images);r.length>0&&(n.textures=r),s.length>0&&(n.images=s)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const a=t.length;n=new Array(a);for(let r=0;r!==a;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class hr extends $i{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yn,this.combine=js,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const _t=new C,Ia=new Ue;let lh=0;class rn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:lh++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=ar,this.updateRanges=[],this.gpuType=gn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let a=0,r=this.itemSize;a<r;a++)this.array[e+a]=t.array[n+a];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ia.fromBufferAttribute(this,t),Ia.applyMatrix3(e),this.setXY(t,Ia.x,Ia.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix3(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyMatrix4(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.applyNormalMatrix(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)_t.fromBufferAttribute(this,t),_t.transformDirection(e),this.setXYZ(t,_t.x,_t.y,_t.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Di(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Dt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Di(t,this.array)),t}setX(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Di(t,this.array)),t}setY(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Di(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Di(t,this.array)),t}setW(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,a){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array),a=Dt(a,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=a,this}setXYZW(e,t,n,a,r){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array),a=Dt(a,this.array),r=Dt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=a,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==ar&&(e.usage=this.usage),e}}class sc extends rn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class oc extends rn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Jt extends rn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let ch=0;const tn=new st,Br=new wt,Ai=new C,jt=new mi,ia=new mi,St=new C;class sn extends pi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:ch++}),this.uuid=Yi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(nc(e)?oc:sc)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Be().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(e),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return tn.makeRotationFromQuaternion(e),this.applyMatrix4(tn),this}rotateX(e){return tn.makeRotationX(e),this.applyMatrix4(tn),this}rotateY(e){return tn.makeRotationY(e),this.applyMatrix4(tn),this}rotateZ(e){return tn.makeRotationZ(e),this.applyMatrix4(tn),this}translate(e,t,n){return tn.makeTranslation(e,t,n),this.applyMatrix4(tn),this}scale(e,t,n){return tn.makeScale(e,t,n),this.applyMatrix4(tn),this}lookAt(e){return Br.lookAt(e),Br.updateMatrix(),this.applyMatrix4(Br.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ai).negate(),this.translate(Ai.x,Ai.y,Ai.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let a=0,r=e.length;a<r;a++){const s=e[a];n.push(s.x,s.y,s.z||0)}this.setAttribute("position",new Jt(n,3))}else{const n=Math.min(e.length,t.count);for(let a=0;a<n;a++){const r=e[a];t.setXYZ(a,r.x,r.y,r.z||0)}e.length>t.count&&Ie("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new mi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){gt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,a=t.length;n<a;n++){const r=t[n];jt.setFromBufferAttribute(r),this.morphTargetsRelative?(St.addVectors(this.boundingBox.min,jt.min),this.boundingBox.expandByPoint(St),St.addVectors(this.boundingBox.max,jt.max),this.boundingBox.expandByPoint(St)):(this.boundingBox.expandByPoint(jt.min),this.boundingBox.expandByPoint(jt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&gt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ji);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){gt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(e){const n=this.boundingSphere.center;if(jt.setFromBufferAttribute(e),t)for(let r=0,s=t.length;r<s;r++){const o=t[r];ia.setFromBufferAttribute(o),this.morphTargetsRelative?(St.addVectors(jt.min,ia.min),jt.expandByPoint(St),St.addVectors(jt.max,ia.max),jt.expandByPoint(St)):(jt.expandByPoint(ia.min),jt.expandByPoint(ia.max))}jt.getCenter(n);let a=0;for(let r=0,s=e.count;r<s;r++)St.fromBufferAttribute(e,r),a=Math.max(a,n.distanceToSquared(St));if(t)for(let r=0,s=t.length;r<s;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)St.fromBufferAttribute(o,c),l&&(Ai.fromBufferAttribute(e,c),St.add(Ai)),a=Math.max(a,n.distanceToSquared(St))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&gt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){gt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,a=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new rn(new Float32Array(4*n.count),4));const s=this.getAttribute("tangent"),o=[],l=[];for(let B=0;B<n.count;B++)o[B]=new C,l[B]=new C;const c=new C,d=new C,h=new C,u=new Ue,p=new Ue,x=new Ue,_=new C,m=new C;function f(B,M,y){c.fromBufferAttribute(n,B),d.fromBufferAttribute(n,M),h.fromBufferAttribute(n,y),u.fromBufferAttribute(r,B),p.fromBufferAttribute(r,M),x.fromBufferAttribute(r,y),d.sub(c),h.sub(c),p.sub(u),x.sub(u);const D=1/(p.x*x.y-x.x*p.y);isFinite(D)&&(_.copy(d).multiplyScalar(x.y).addScaledVector(h,-p.y).multiplyScalar(D),m.copy(h).multiplyScalar(p.x).addScaledVector(d,-x.x).multiplyScalar(D),o[B].add(_),o[M].add(_),o[y].add(_),l[B].add(m),l[M].add(m),l[y].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let B=0,M=E.length;B<M;++B){const y=E[B],D=y.start,O=y.count;for(let V=D,X=D+O;V<X;V+=3)f(e.getX(V+0),e.getX(V+1),e.getX(V+2))}const T=new C,w=new C,L=new C,b=new C;function R(B){L.fromBufferAttribute(a,B),b.copy(L);const M=o[B];T.copy(M),T.sub(L.multiplyScalar(L.dot(M))).normalize(),w.crossVectors(b,M);const D=w.dot(l[B])<0?-1:1;s.setXYZW(B,T.x,T.y,T.z,D)}for(let B=0,M=E.length;B<M;++B){const y=E[B],D=y.start,O=y.count;for(let V=D,X=D+O;V<X;V+=3)R(e.getX(V+0)),R(e.getX(V+1)),R(e.getX(V+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new rn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,p=n.count;u<p;u++)n.setXYZ(u,0,0,0);const a=new C,r=new C,s=new C,o=new C,l=new C,c=new C,d=new C,h=new C;if(e)for(let u=0,p=e.count;u<p;u+=3){const x=e.getX(u+0),_=e.getX(u+1),m=e.getX(u+2);a.fromBufferAttribute(t,x),r.fromBufferAttribute(t,_),s.fromBufferAttribute(t,m),d.subVectors(s,r),h.subVectors(a,r),d.cross(h),o.fromBufferAttribute(n,x),l.fromBufferAttribute(n,_),c.fromBufferAttribute(n,m),o.add(d),l.add(d),c.add(d),n.setXYZ(x,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,p=t.count;u<p;u+=3)a.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),s.fromBufferAttribute(t,u+2),d.subVectors(s,r),h.subVectors(a,r),d.cross(h),n.setXYZ(u+0,d.x,d.y,d.z),n.setXYZ(u+1,d.x,d.y,d.z),n.setXYZ(u+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)St.fromBufferAttribute(e,t),St.normalize(),e.setXYZ(t,St.x,St.y,St.z)}toNonIndexed(){function e(o,l){const c=o.array,d=o.itemSize,h=o.normalized,u=new c.constructor(l.length*d);let p=0,x=0;for(let _=0,m=l.length;_<m;_++){o.isInterleavedBufferAttribute?p=l[_]*o.data.stride+o.offset:p=l[_]*d;for(let f=0;f<d;f++)u[x++]=c[p++]}return new rn(u,d,h)}if(this.index===null)return Ie("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new sn,n=this.index.array,a=this.attributes;for(const o in a){const l=a[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let d=0,h=c.length;d<h;d++){const u=c[d],p=e(u,n);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const s=this.groups;for(let o=0,l=s.length;o<l;o++){const c=s[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const a={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let h=0,u=c.length;h<u;h++){const p=c[h];d.push(p.toJSON(e.data))}d.length>0&&(a[l]=d,r=!0)}r&&(e.data.morphAttributes=a,e.data.morphTargetsRelative=this.morphTargetsRelative);const s=this.groups;s.length>0&&(e.data.groups=JSON.parse(JSON.stringify(s)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const a=e.attributes;for(const c in a){const d=a[c];this.setAttribute(c,d.clone(t))}const r=e.morphAttributes;for(const c in r){const d=[],h=r[c];for(let u=0,p=h.length;u<p;u++)d.push(h[u].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const s=e.groups;for(let c=0,d=s.length;c<d;c++){const h=s[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const jo=new st,ai=new so,Ua=new ji,$o=new C,Na=new C,Fa=new C,Ba=new C,kr=new C,ka=new C,Zo=new C,Oa=new C;class Et extends wt{constructor(e=new sn,t=new hr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const a=t[n[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=a.length;r<s;r++){const o=a[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,a=n.attributes.position,r=n.morphAttributes.position,s=n.morphTargetsRelative;t.fromBufferAttribute(a,e);const o=this.morphTargetInfluences;if(r&&o){ka.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const d=o[l],h=r[l];d!==0&&(kr.fromBufferAttribute(h,e),s?ka.addScaledVector(kr,d):ka.addScaledVector(kr.sub(t),d))}t.add(ka)}return t}raycast(e,t){const n=this.geometry,a=this.material,r=this.matrixWorld;a!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ua.copy(n.boundingSphere),Ua.applyMatrix4(r),ai.copy(e.ray).recast(e.near),!(Ua.containsPoint(ai.origin)===!1&&(ai.intersectSphere(Ua,$o)===null||ai.origin.distanceToSquared($o)>(e.far-e.near)**2))&&(jo.copy(r).invert(),ai.copy(e.ray).applyMatrix4(jo),!(n.boundingBox!==null&&ai.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ai)))}_computeIntersections(e,t,n){let a;const r=this.geometry,s=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,d=r.attributes.uv1,h=r.attributes.normal,u=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(s))for(let x=0,_=u.length;x<_;x++){const m=u[x],f=s[m.materialIndex],E=Math.max(m.start,p.start),T=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let w=E,L=T;w<L;w+=3){const b=o.getX(w),R=o.getX(w+1),B=o.getX(w+2);a=za(this,f,e,n,c,d,h,b,R,B),a&&(a.faceIndex=Math.floor(w/3),a.face.materialIndex=m.materialIndex,t.push(a))}}else{const x=Math.max(0,p.start),_=Math.min(o.count,p.start+p.count);for(let m=x,f=_;m<f;m+=3){const E=o.getX(m),T=o.getX(m+1),w=o.getX(m+2);a=za(this,s,e,n,c,d,h,E,T,w),a&&(a.faceIndex=Math.floor(m/3),t.push(a))}}else if(l!==void 0)if(Array.isArray(s))for(let x=0,_=u.length;x<_;x++){const m=u[x],f=s[m.materialIndex],E=Math.max(m.start,p.start),T=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let w=E,L=T;w<L;w+=3){const b=w,R=w+1,B=w+2;a=za(this,f,e,n,c,d,h,b,R,B),a&&(a.faceIndex=Math.floor(w/3),a.face.materialIndex=m.materialIndex,t.push(a))}}else{const x=Math.max(0,p.start),_=Math.min(l.count,p.start+p.count);for(let m=x,f=_;m<f;m+=3){const E=m,T=m+1,w=m+2;a=za(this,s,e,n,c,d,h,E,T,w),a&&(a.faceIndex=Math.floor(m/3),t.push(a))}}}}function dh(i,e,t,n,a,r,s,o){let l;if(e.side===Xt?l=n.intersectTriangle(s,r,a,!0,o):l=n.intersectTriangle(a,r,s,e.side===Jn,o),l===null)return null;Oa.copy(o),Oa.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Oa);return c<t.near||c>t.far?null:{distance:c,point:Oa.clone(),object:i}}function za(i,e,t,n,a,r,s,o,l,c){i.getVertexPosition(o,Na),i.getVertexPosition(l,Fa),i.getVertexPosition(c,Ba);const d=dh(i,e,t,n,Na,Fa,Ba,Zo);if(d){const h=new C;hn.getBarycoord(Zo,Na,Fa,Ba,h),a&&(d.uv=hn.getInterpolatedAttribute(a,o,l,c,h,new Ue)),r&&(d.uv1=hn.getInterpolatedAttribute(r,o,l,c,h,new Ue)),s&&(d.normal=hn.getInterpolatedAttribute(s,o,l,c,h,new C),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new C,materialIndex:0};hn.getNormal(Na,Fa,Ba,u.normal),d.face=u,d.barycoord=h}return d}class Mn extends sn{constructor(e=1,t=1,n=1,a=1,r=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:a,heightSegments:r,depthSegments:s};const o=this;a=Math.floor(a),r=Math.floor(r),s=Math.floor(s);const l=[],c=[],d=[],h=[];let u=0,p=0;x("z","y","x",-1,-1,n,t,e,s,r,0),x("z","y","x",1,-1,n,t,-e,s,r,1),x("x","z","y",1,1,e,n,t,a,s,2),x("x","z","y",1,-1,e,n,-t,a,s,3),x("x","y","z",1,-1,e,t,n,a,r,4),x("x","y","z",-1,-1,e,t,-n,a,r,5),this.setIndex(l),this.setAttribute("position",new Jt(c,3)),this.setAttribute("normal",new Jt(d,3)),this.setAttribute("uv",new Jt(h,2));function x(_,m,f,E,T,w,L,b,R,B,M){const y=w/R,D=L/B,O=w/2,V=L/2,X=b/2,H=R+1,Y=B+1;let Q=0,W=0;const ne=new C;for(let re=0;re<Y;re++){const Me=re*D-V;for(let Ge=0;Ge<H;Ge++){const qe=Ge*y-O;ne[_]=qe*E,ne[m]=Me*T,ne[f]=X,c.push(ne.x,ne.y,ne.z),ne[_]=0,ne[m]=0,ne[f]=b>0?1:-1,d.push(ne.x,ne.y,ne.z),h.push(Ge/R),h.push(1-re/B),Q+=1}}for(let re=0;re<B;re++)for(let Me=0;Me<R;Me++){const Ge=u+Me+H*re,qe=u+Me+H*(re+1),et=u+(Me+1)+H*(re+1),tt=u+(Me+1)+H*re;l.push(Ge,qe,tt),l.push(qe,et,tt),W+=6}o.addGroup(p,W,M),p+=W,u+=Q}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Mn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Wi(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const a=i[t][n];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(Ie("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=a.clone():Array.isArray(a)?e[t][n]=a.slice():e[t][n]=a}}return e}function It(i){const e={};for(let t=0;t<i.length;t++){const n=Wi(i[t]);for(const a in n)e[a]=n[a]}return e}function hh(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function lc(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:je.workingColorSpace}const uh={clone:Wi,merge:It};var fh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,ph=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class kn extends $i{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=fh,this.fragmentShader=ph,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Wi(e.uniforms),this.uniformsGroups=hh(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const a in this.uniforms){const s=this.uniforms[a].value;s&&s.isTexture?t.uniforms[a]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[a]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[a]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[a]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[a]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[a]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[a]={type:"m4",value:s.toArray()}:t.uniforms[a]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const a in this.extensions)this.extensions[a]===!0&&(n[a]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class cc extends wt{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new st,this.projectionMatrix=new st,this.projectionMatrixInverse=new st,this.coordinateSystem=_n,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Wn=new C,Jo=new Ue,Qo=new Ue;class nn extends cc{constructor(e=50,t=1,n=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=a,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=_a*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ha*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return _a*2*Math.atan(Math.tan(ha*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Wn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Wn.x,Wn.y).multiplyScalar(-e/Wn.z),Wn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Wn.x,Wn.y).multiplyScalar(-e/Wn.z)}getViewSize(e,t){return this.getViewBounds(e,Jo,Qo),t.subVectors(Qo,Jo)}setViewOffset(e,t,n,a,r,s){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=a,this.view.width=r,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ha*.5*this.fov)/this.zoom,n=2*t,a=this.aspect*n,r=-.5*a;const s=this.view;if(this.view!==null&&this.view.enabled){const l=s.fullWidth,c=s.fullHeight;r+=s.offsetX*a/l,t-=s.offsetY*n/c,a*=s.width/l,n*=s.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+a,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ci=-90,Ri=1;class mh extends wt{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new nn(Ci,Ri,e,t);a.layers=this.layers,this.add(a);const r=new nn(Ci,Ri,e,t);r.layers=this.layers,this.add(r);const s=new nn(Ci,Ri,e,t);s.layers=this.layers,this.add(s);const o=new nn(Ci,Ri,e,t);o.layers=this.layers,this.add(o);const l=new nn(Ci,Ri,e,t);l.layers=this.layers,this.add(l);const c=new nn(Ci,Ri,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,a,r,s,o,l]=t;for(const c of t)this.remove(c);if(e===_n)n.up.set(0,1,0),n.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),s.up.set(0,0,1),s.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===rr)n.up.set(0,-1,0),n.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),s.up.set(0,0,-1),s.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:a}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,s,o,l,c,d]=this.children,h=e.getRenderTarget(),u=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),x=e.xr.enabled;e.xr.enabled=!1;const _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,a),e.render(t,r),e.setRenderTarget(n,1,a),e.render(t,s),e.setRenderTarget(n,2,a),e.render(t,o),e.setRenderTarget(n,3,a),e.render(t,l),e.setRenderTarget(n,4,a),e.render(t,c),n.texture.generateMipmaps=_,e.setRenderTarget(n,5,a),e.render(t,d),e.setRenderTarget(h,u,p),e.xr.enabled=x,n.texture.needsPMREMUpdate=!0}}class dc extends Ut{constructor(e=[],t=Gi,n,a,r,s,o,l,c,d){super(e,t,n,a,r,s,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class xh extends fi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},a=[n,n,n,n,n,n];this.texture=new dc(a),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},a=new Mn(5,5,5),r=new kn({name:"CubemapFromEquirect",uniforms:Wi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Xt,blending:Un});r.uniforms.tEquirect.value=t;const s=new Et(a,r),o=t.minFilter;return t.minFilter===di&&(t.minFilter=an),new mh(1,10,this).update(e,s),t.minFilter=o,s.geometry.dispose(),s.material.dispose(),this}clear(e,t=!0,n=!0,a=!0){const r=e.getRenderTarget();for(let s=0;s<6;s++)e.setRenderTarget(this,s),e.clear(t,n,a);e.setRenderTarget(r)}}class Ht extends wt{constructor(){super(),this.isGroup=!0,this.type="Group"}}const gh={type:"move"};class Or{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Ht,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Ht,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Ht,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let a=null,r=null,s=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){s=!0;for(const _ of e.hand.values()){const m=t.getJointPose(_,n),f=this._getHandJoint(c,_);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const d=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],u=d.position.distanceTo(h.position),p=.02,x=.005;c.inputState.pinching&&u>p+x?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=p-x&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(a=t.getPose(e.targetRaySpace,n),a===null&&r!==null&&(a=r),a!==null&&(o.matrix.fromArray(a.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,a.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(a.linearVelocity)):o.hasLinearVelocity=!1,a.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(a.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(gh)))}return o!==null&&(o.visible=a!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=s!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new Ht;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class oo{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Xe(e),this.near=t,this.far=n}clone(){return new oo(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class _h extends wt{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new yn,this.environmentIntensity=1,this.environmentRotation=new yn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class hc extends Ut{constructor(e=null,t=1,n=1,a,r,s,o,l,c=Zt,d=Zt,h,u){super(null,s,o,l,c,d,a,r,h,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class el extends rn{constructor(e,t,n,a=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=a}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Pi=new st,tl=new st,Ga=[],nl=new mi,vh=new st,aa=new Et,ra=new ji;class uc extends Et{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new el(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let a=0;a<n;a++)this.setMatrixAt(a,vh)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new mi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Pi),nl.copy(e.boundingBox).applyMatrix4(Pi),this.boundingBox.union(nl)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ji),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Pi),ra.copy(e.boundingSphere).applyMatrix4(Pi),this.boundingSphere.union(ra)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,a=this.morphTexture.source.data.data,r=n.length+1,s=e*r+1;for(let o=0;o<n.length;o++)n[o]=a[s+o]}raycast(e,t){const n=this.matrixWorld,a=this.count;if(aa.geometry=this.geometry,aa.material=this.material,aa.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ra.copy(this.boundingSphere),ra.applyMatrix4(n),e.ray.intersectsSphere(ra)!==!1))for(let r=0;r<a;r++){this.getMatrixAt(r,Pi),tl.multiplyMatrices(n,Pi),aa.matrixWorld=tl,aa.raycast(e,Ga);for(let s=0,o=Ga.length;s<o;s++){const l=Ga[s];l.instanceId=r,l.object=this,t.push(l)}Ga.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new el(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,a=n.length+1;this.morphTexture===null&&(this.morphTexture=new hc(new Float32Array(a*this.count),a,this.count,Qs,gn));const r=this.morphTexture.source.data.data;let s=0;for(let c=0;c<n.length;c++)s+=n[c];const o=this.geometry.morphTargetsRelative?1:1-s,l=a*e;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const zr=new C,yh=new C,Mh=new Be;class Xn{constructor(e=new C(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,a){return this.normal.set(e,t,n),this.constant=a,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const a=zr.subVectors(n,t).cross(yh.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(a,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(zr),a=this.normal.dot(n);if(a===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/a;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||Mh.getNormalMatrix(e),a=this.coplanarPoint(zr).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-a.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ri=new ji,bh=new Ue(.5,.5),Va=new C;class lo{constructor(e=new Xn,t=new Xn,n=new Xn,a=new Xn,r=new Xn,s=new Xn){this.planes=[e,t,n,a,r,s]}set(e,t,n,a,r,s){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(a),o[4].copy(r),o[5].copy(s),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=_n,n=!1){const a=this.planes,r=e.elements,s=r[0],o=r[1],l=r[2],c=r[3],d=r[4],h=r[5],u=r[6],p=r[7],x=r[8],_=r[9],m=r[10],f=r[11],E=r[12],T=r[13],w=r[14],L=r[15];if(a[0].setComponents(c-s,p-d,f-x,L-E).normalize(),a[1].setComponents(c+s,p+d,f+x,L+E).normalize(),a[2].setComponents(c+o,p+h,f+_,L+T).normalize(),a[3].setComponents(c-o,p-h,f-_,L-T).normalize(),n)a[4].setComponents(l,u,m,w).normalize(),a[5].setComponents(c-l,p-u,f-m,L-w).normalize();else if(a[4].setComponents(c-l,p-u,f-m,L-w).normalize(),t===_n)a[5].setComponents(c+l,p+u,f+m,L+w).normalize();else if(t===rr)a[5].setComponents(l,u,m,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ri.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ri.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ri)}intersectsSprite(e){ri.center.set(0,0,0);const t=bh.distanceTo(e.center);return ri.radius=.7071067811865476+t,ri.applyMatrix4(e.matrixWorld),this.intersectsSphere(ri)}intersectsSphere(e){const t=this.planes,n=e.center,a=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<a)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const a=t[n];if(Va.x=a.normal.x>0?e.max.x:e.min.x,Va.y=a.normal.y>0?e.max.y:e.min.y,Va.z=a.normal.z>0?e.max.z:e.min.z,a.distanceToPoint(Va)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class fc extends $i{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Xe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const il=new st,Ws=new so,Ha=new ji,Wa=new C;class Sh extends wt{constructor(e=new sn,t=new fc){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,a=this.matrixWorld,r=e.params.Points.threshold,s=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ha.copy(n.boundingSphere),Ha.applyMatrix4(a),Ha.radius+=r,e.ray.intersectsSphere(Ha)===!1)return;il.copy(a).invert(),Ws.copy(e.ray).applyMatrix4(il);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,h=n.attributes.position;if(c!==null){const u=Math.max(0,s.start),p=Math.min(c.count,s.start+s.count);for(let x=u,_=p;x<_;x++){const m=c.getX(x);Wa.fromBufferAttribute(h,m),al(Wa,m,l,a,e,t,this)}}else{const u=Math.max(0,s.start),p=Math.min(h.count,s.start+s.count);for(let x=u,_=p;x<_;x++)Wa.fromBufferAttribute(h,x),al(Wa,x,l,a,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const a=t[n[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=a.length;r<s;r++){const o=a[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function al(i,e,t,n,a,r,s){const o=Ws.distanceSqToPoint(i);if(o<t){const l=new C;Ws.closestPointToPoint(i,l),l.applyMatrix4(n);const c=a.ray.origin.distanceTo(l);if(c<a.near||c>a.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:s})}}class pc extends Ut{constructor(e,t,n=ui,a,r,s,o=Zt,l=Zt,c,d=ma,h=1){if(d!==ma&&d!==xa)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:h};super(u,a,r,s,o,l,d,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ro(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class mc extends Ut{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class co extends sn{constructor(e=1,t=1,n=1,a=32,r=1,s=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:a,heightSegments:r,openEnded:s,thetaStart:o,thetaLength:l};const c=this;a=Math.floor(a),r=Math.floor(r);const d=[],h=[],u=[],p=[];let x=0;const _=[],m=n/2;let f=0;E(),s===!1&&(e>0&&T(!0),t>0&&T(!1)),this.setIndex(d),this.setAttribute("position",new Jt(h,3)),this.setAttribute("normal",new Jt(u,3)),this.setAttribute("uv",new Jt(p,2));function E(){const w=new C,L=new C;let b=0;const R=(t-e)/n;for(let B=0;B<=r;B++){const M=[],y=B/r,D=y*(t-e)+e;for(let O=0;O<=a;O++){const V=O/a,X=V*l+o,H=Math.sin(X),Y=Math.cos(X);L.x=D*H,L.y=-y*n+m,L.z=D*Y,h.push(L.x,L.y,L.z),w.set(H,R,Y).normalize(),u.push(w.x,w.y,w.z),p.push(V,1-y),M.push(x++)}_.push(M)}for(let B=0;B<a;B++)for(let M=0;M<r;M++){const y=_[M][B],D=_[M+1][B],O=_[M+1][B+1],V=_[M][B+1];(e>0||M!==0)&&(d.push(y,D,V),b+=3),(t>0||M!==r-1)&&(d.push(D,O,V),b+=3)}c.addGroup(f,b,0),f+=b}function T(w){const L=x,b=new Ue,R=new C;let B=0;const M=w===!0?e:t,y=w===!0?1:-1;for(let O=1;O<=a;O++)h.push(0,m*y,0),u.push(0,y,0),p.push(.5,.5),x++;const D=x;for(let O=0;O<=a;O++){const X=O/a*l+o,H=Math.cos(X),Y=Math.sin(X);R.x=M*Y,R.y=m*y,R.z=M*H,h.push(R.x,R.y,R.z),u.push(0,y,0),b.x=H*.5+.5,b.y=Y*.5*y+.5,p.push(b.x,b.y),x++}for(let O=0;O<a;O++){const V=L+O,X=D+O;w===!0?d.push(X,X+1,V):d.push(X+1,X,V),B+=3}c.addGroup(f,B,w===!0?1:2),f+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new co(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class ho extends co{constructor(e=1,t=1,n=32,a=1,r=!1,s=0,o=Math.PI*2){super(0,e,t,n,a,r,s,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:a,openEnded:r,thetaStart:s,thetaLength:o}}static fromJSON(e){return new ho(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class Th{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Ie("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,a=this.getPoint(0),r=0;t.push(0);for(let s=1;s<=e;s++)n=this.getPoint(s/e),r+=n.distanceTo(a),t.push(r),a=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let a=0;const r=n.length;let s;t?s=t:s=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(a=Math.floor(o+(l-o)/2),c=n[a]-s,c<0)o=a+1;else if(c>0)l=a-1;else{l=a;break}if(a=l,n[a]===s)return a/(r-1);const d=n[a],u=n[a+1]-d,p=(s-d)/u;return(a+p)/(r-1)}getTangent(e,t){let a=e-1e-4,r=e+1e-4;a<0&&(a=0),r>1&&(r=1);const s=this.getPoint(a),o=this.getPoint(r),l=t||(s.isVector2?new Ue:new C);return l.copy(o).sub(s).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new C,a=[],r=[],s=[],o=new C,l=new st;for(let p=0;p<=e;p++){const x=p/e;a[p]=this.getTangentAt(x,new C)}r[0]=new C,s[0]=new C;let c=Number.MAX_VALUE;const d=Math.abs(a[0].x),h=Math.abs(a[0].y),u=Math.abs(a[0].z);d<=c&&(c=d,n.set(1,0,0)),h<=c&&(c=h,n.set(0,1,0)),u<=c&&n.set(0,0,1),o.crossVectors(a[0],n).normalize(),r[0].crossVectors(a[0],o),s[0].crossVectors(a[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),s[p]=s[p-1].clone(),o.crossVectors(a[p-1],a[p]),o.length()>Number.EPSILON){o.normalize();const x=Math.acos(ze(a[p-1].dot(a[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(o,x))}s[p].crossVectors(a[p],r[p])}if(t===!0){let p=Math.acos(ze(r[0].dot(r[e]),-1,1));p/=e,a[0].dot(o.crossVectors(r[0],r[e]))>0&&(p=-p);for(let x=1;x<=e;x++)r[x].applyMatrix4(l.makeRotationAxis(a[x],p*x)),s[x].crossVectors(a[x],r[x])}return{tangents:a,normals:r,binormals:s}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}function uo(){let i=0,e=0,t=0,n=0;function a(r,s,o,l){i=r,e=o,t=-3*r+3*s-2*o-l,n=2*r-2*s+o+l}return{initCatmullRom:function(r,s,o,l,c){a(s,o,c*(o-r),c*(l-s))},initNonuniformCatmullRom:function(r,s,o,l,c,d,h){let u=(s-r)/c-(o-r)/(c+d)+(o-s)/d,p=(o-s)/d-(l-s)/(d+h)+(l-o)/h;u*=d,p*=d,a(s,o,u,p)},calc:function(r){const s=r*r,o=s*r;return i+e*r+t*s+n*o}}}const Xa=new C,Gr=new uo,Vr=new uo,Hr=new uo;class Eh extends Th{constructor(e=[],t=!1,n="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=a}getPoint(e,t=new C){const n=t,a=this.points,r=a.length,s=(r-(this.closed?0:1))*e;let o=Math.floor(s),l=s-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,d;this.closed||o>0?c=a[(o-1)%r]:(Xa.subVectors(a[0],a[1]).add(a[0]),c=Xa);const h=a[o%r],u=a[(o+1)%r];if(this.closed||o+2<r?d=a[(o+2)%r]:(Xa.subVectors(a[r-1],a[r-2]).add(a[r-1]),d=Xa),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let x=Math.pow(c.distanceToSquared(h),p),_=Math.pow(h.distanceToSquared(u),p),m=Math.pow(u.distanceToSquared(d),p);_<1e-4&&(_=1),x<1e-4&&(x=_),m<1e-4&&(m=_),Gr.initNonuniformCatmullRom(c.x,h.x,u.x,d.x,x,_,m),Vr.initNonuniformCatmullRom(c.y,h.y,u.y,d.y,x,_,m),Hr.initNonuniformCatmullRom(c.z,h.z,u.z,d.z,x,_,m)}else this.curveType==="catmullrom"&&(Gr.initCatmullRom(c.x,h.x,u.x,d.x,this.tension),Vr.initCatmullRom(c.y,h.y,u.y,d.y,this.tension),Hr.initCatmullRom(c.z,h.z,u.z,d.z,this.tension));return n.set(Gr.calc(l),Vr.calc(l),Hr.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const a=e.points[t];this.points.push(a.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const a=this.points[t];e.points.push(a.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const a=e.points[t];this.points.push(new C().fromArray(a))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}class ur extends sn{constructor(e=1,t=1,n=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:a};const r=e/2,s=t/2,o=Math.floor(n),l=Math.floor(a),c=o+1,d=l+1,h=e/o,u=t/l,p=[],x=[],_=[],m=[];for(let f=0;f<d;f++){const E=f*u-s;for(let T=0;T<c;T++){const w=T*h-r;x.push(w,-E,0),_.push(0,0,1),m.push(T/o),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let E=0;E<o;E++){const T=E+c*f,w=E+c*(f+1),L=E+1+c*(f+1),b=E+1+c*f;p.push(T,w,b),p.push(w,L,b)}this.setIndex(p),this.setAttribute("position",new Jt(x,3)),this.setAttribute("normal",new Jt(_,3)),this.setAttribute("uv",new Jt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new ur(e.width,e.height,e.widthSegments,e.heightSegments)}}class fo extends sn{constructor(e=1,t=32,n=16,a=0,r=Math.PI*2,s=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:a,phiLength:r,thetaStart:s,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(s+o,Math.PI);let c=0;const d=[],h=new C,u=new C,p=[],x=[],_=[],m=[];for(let f=0;f<=n;f++){const E=[],T=f/n;let w=0;f===0&&s===0?w=.5/t:f===n&&l===Math.PI&&(w=-.5/t);for(let L=0;L<=t;L++){const b=L/t;h.x=-e*Math.cos(a+b*r)*Math.sin(s+T*o),h.y=e*Math.cos(s+T*o),h.z=e*Math.sin(a+b*r)*Math.sin(s+T*o),x.push(h.x,h.y,h.z),u.copy(h).normalize(),_.push(u.x,u.y,u.z),m.push(b+w,1-T),E.push(c++)}d.push(E)}for(let f=0;f<n;f++)for(let E=0;E<t;E++){const T=d[f][E+1],w=d[f][E],L=d[f+1][E],b=d[f+1][E+1];(f!==0||s>0)&&p.push(T,w,b),(f!==n-1||l<Math.PI)&&p.push(w,L,b)}this.setIndex(p),this.setAttribute("position",new Jt(x,3)),this.setAttribute("normal",new Jt(_,3)),this.setAttribute("uv",new Jt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new fo(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class Tt extends $i{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ec,this.normalScale=new Ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yn,this.combine=js,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class wh extends $i{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=yd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Ah extends $i{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class po extends wt{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Xe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class Ch extends po{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(wt.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Xe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Wr=new st,rl=new C,sl=new C;class Rh{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ue(512,512),this.mapType=vn,this.map=null,this.mapPass=null,this.matrix=new st,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new lo,this._frameExtents=new Ue(1,1),this._viewportCount=1,this._viewports=[new xt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;rl.setFromMatrixPosition(e.matrixWorld),t.position.copy(rl),sl.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(sl),t.updateMatrixWorld(),Wr.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Wr,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Wr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class xc extends cc{constructor(e=-1,t=1,n=1,a=-1,r=.1,s=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=a,this.near=r,this.far=s,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,a,r,s){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=a,this.view.width=r,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let r=n-e,s=n+e,o=a+t,l=a-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,s=r+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,s,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Ph extends Rh{constructor(){super(new xc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Lh extends po{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(wt.DEFAULT_UP),this.updateMatrix(),this.target=new wt,this.shadow=new Ph}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class Dh extends po{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Ih extends nn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class ol{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=ze(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(ze(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Uh extends pi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Ie("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function ll(i,e,t,n){const a=Nh(n);switch(t){case Jl:return i*e;case Qs:return i*e/a.components*a.byteLength;case eo:return i*e/a.components*a.byteLength;case to:return i*e*2/a.components*a.byteLength;case no:return i*e*2/a.components*a.byteLength;case Ql:return i*e*3/a.components*a.byteLength;case fn:return i*e*4/a.components*a.byteLength;case io:return i*e*4/a.components*a.byteLength;case ja:case $a:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Za:case Ja:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case gs:case vs:return Math.max(i,16)*Math.max(e,8)/4;case xs:case _s:return Math.max(i,8)*Math.max(e,8)/2;case ys:case Ms:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case bs:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ss:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ts:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Es:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case ws:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case As:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case Cs:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case Rs:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Ps:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Ls:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Ds:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Is:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Us:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Ns:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Fs:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Bs:case ks:case Os:return Math.ceil(i/4)*Math.ceil(e/4)*16;case zs:case Gs:return Math.ceil(i/4)*Math.ceil(e/4)*8;case Vs:case Hs:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Nh(i){switch(i){case vn:case Yl:return{byteLength:1,components:1};case fa:case jl:case qi:return{byteLength:2,components:1};case Zs:case Js:return{byteLength:2,components:4};case ui:case $s:case gn:return{byteLength:4,components:1};case $l:case Zl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Ys}}));typeof window<"u"&&(window.__THREE__?Ie("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Ys);function gc(){let i=null,e=!1,t=null,n=null;function a(r,s){t(r,s),n=i.requestAnimationFrame(a)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(a),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Fh(i){const e=new WeakMap;function t(o,l){const c=o.array,d=o.usage,h=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,d),o.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function n(o,l,c){const d=l.array,h=l.updateRanges;if(i.bindBuffer(c,o),h.length===0)i.bufferSubData(c,0,d);else{h.sort((p,x)=>p.start-x.start);let u=0;for(let p=1;p<h.length;p++){const x=h[u],_=h[p];_.start<=x.start+x.count+1?x.count=Math.max(x.count,_.start+_.count-x.start):(++u,h[u]=_)}h.length=u+1;for(let p=0,x=h.length;p<x;p++){const _=h[p];i.bufferSubData(c,_.start*d.BYTES_PER_ELEMENT,d,_.start,_.count)}l.clearUpdateRanges()}l.onUploadCallback()}function a(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function s(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:a,remove:r,update:s}}var Bh=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,kh=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,Oh=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,zh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Gh=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Vh=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Hh=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,Wh=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Xh=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec3 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 ).rgb;
	}
#endif`,Kh=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,qh=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Yh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,jh=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,$h=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Zh=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Jh=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,Qh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,eu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,tu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,nu=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,iu=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,au=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,ru=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif
#ifdef USE_BATCHING_COLOR
	vec3 batchingColor = getBatchingColor( getIndirectIndex( gl_DrawID ) );
	vColor.xyz *= batchingColor.xyz;
#endif`,su=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,ou=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,lu=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,cu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,du=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,hu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,uu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,fu="gl_FragColor = linearToOutputTexel( gl_FragColor );",pu=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,mu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,xu=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,gu=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,_u=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,vu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,yu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Mu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,bu=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Su=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Tu=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,Eu=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,wu=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Au=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Cu=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,Ru=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Pu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Lu=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Du=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Iu=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Uu=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,Nu=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 uv = vec2( roughness, dotNV );
	return texture2D( dfgLUT, uv ).rg;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = DFGApprox( vec3(0.0, 0.0, 1.0), vec3(sqrt(1.0 - dotNV * dotNV), 0.0, dotNV), material.roughness );
	vec2 dfgL = DFGApprox( vec3(0.0, 0.0, 1.0), vec3(sqrt(1.0 - dotNL * dotNL), 0.0, dotNL), material.roughness );
	vec3 FssEss_V = material.specularColor * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColor * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColor + ( 1.0 - material.specularColor ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,Fu=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,Bu=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,ku=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Ou=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,zu=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Gu=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Vu=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Hu=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,Wu=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Xu=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,Ku=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,qu=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Yu=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ju=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,$u=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Zu=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ju=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Qu=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,ef=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,tf=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,nf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,af=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,rf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,sf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,of=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,lf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,cf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,df=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,hf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,uf=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,ff=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,pf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,mf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,xf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,gf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,_f=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,vf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		float depth = unpackRGBAToDepth( texture2D( depths, uv ) );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			return step( depth, compare );
		#else
			return step( compare, depth );
		#endif
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow( sampler2D shadow, vec2 uv, float compare ) {
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		#ifdef USE_REVERSED_DEPTH_BUFFER
			float hard_shadow = step( distribution.x, compare );
		#else
			float hard_shadow = step( compare, distribution.x );
		#endif
		if ( hard_shadow != 1.0 ) {
			float distance = compare - distribution.x;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		
		float lightToPositionLength = length( lightToPosition );
		if ( lightToPositionLength - shadowCameraFar <= 0.0 && lightToPositionLength - shadowCameraNear >= 0.0 ) {
			float dp = ( lightToPositionLength - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
			#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
				vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
				shadow = (
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
					texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
				) * ( 1.0 / 9.0 );
			#else
				shadow = texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
			#endif
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
#endif`,yf=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Mf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,bf=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Sf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Tf=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Ef=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,wf=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Af=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Cf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Rf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Pf=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,Lf=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,Df=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,If=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Uf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,Nf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,Ff=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Bf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,kf=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Of=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,zf=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Gf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Vf=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,Wf=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,Xf=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,Kf=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,qf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Yf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,jf=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,$f=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Zf=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,Jf=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Qf=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,ep=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,tp=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,np=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,ip=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,ap=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,rp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,sp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,op=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,lp=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,cp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,dp=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,hp=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,up=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,fp=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,pp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,mp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,xp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Oe={alphahash_fragment:Bh,alphahash_pars_fragment:kh,alphamap_fragment:Oh,alphamap_pars_fragment:zh,alphatest_fragment:Gh,alphatest_pars_fragment:Vh,aomap_fragment:Hh,aomap_pars_fragment:Wh,batching_pars_vertex:Xh,batching_vertex:Kh,begin_vertex:qh,beginnormal_vertex:Yh,bsdfs:jh,iridescence_fragment:$h,bumpmap_pars_fragment:Zh,clipping_planes_fragment:Jh,clipping_planes_pars_fragment:Qh,clipping_planes_pars_vertex:eu,clipping_planes_vertex:tu,color_fragment:nu,color_pars_fragment:iu,color_pars_vertex:au,color_vertex:ru,common:su,cube_uv_reflection_fragment:ou,defaultnormal_vertex:lu,displacementmap_pars_vertex:cu,displacementmap_vertex:du,emissivemap_fragment:hu,emissivemap_pars_fragment:uu,colorspace_fragment:fu,colorspace_pars_fragment:pu,envmap_fragment:mu,envmap_common_pars_fragment:xu,envmap_pars_fragment:gu,envmap_pars_vertex:_u,envmap_physical_pars_fragment:Ru,envmap_vertex:vu,fog_vertex:yu,fog_pars_vertex:Mu,fog_fragment:bu,fog_pars_fragment:Su,gradientmap_pars_fragment:Tu,lightmap_pars_fragment:Eu,lights_lambert_fragment:wu,lights_lambert_pars_fragment:Au,lights_pars_begin:Cu,lights_toon_fragment:Pu,lights_toon_pars_fragment:Lu,lights_phong_fragment:Du,lights_phong_pars_fragment:Iu,lights_physical_fragment:Uu,lights_physical_pars_fragment:Nu,lights_fragment_begin:Fu,lights_fragment_maps:Bu,lights_fragment_end:ku,logdepthbuf_fragment:Ou,logdepthbuf_pars_fragment:zu,logdepthbuf_pars_vertex:Gu,logdepthbuf_vertex:Vu,map_fragment:Hu,map_pars_fragment:Wu,map_particle_fragment:Xu,map_particle_pars_fragment:Ku,metalnessmap_fragment:qu,metalnessmap_pars_fragment:Yu,morphinstance_vertex:ju,morphcolor_vertex:$u,morphnormal_vertex:Zu,morphtarget_pars_vertex:Ju,morphtarget_vertex:Qu,normal_fragment_begin:ef,normal_fragment_maps:tf,normal_pars_fragment:nf,normal_pars_vertex:af,normal_vertex:rf,normalmap_pars_fragment:sf,clearcoat_normal_fragment_begin:of,clearcoat_normal_fragment_maps:lf,clearcoat_pars_fragment:cf,iridescence_pars_fragment:df,opaque_fragment:hf,packing:uf,premultiplied_alpha_fragment:ff,project_vertex:pf,dithering_fragment:mf,dithering_pars_fragment:xf,roughnessmap_fragment:gf,roughnessmap_pars_fragment:_f,shadowmap_pars_fragment:vf,shadowmap_pars_vertex:yf,shadowmap_vertex:Mf,shadowmask_pars_fragment:bf,skinbase_vertex:Sf,skinning_pars_vertex:Tf,skinning_vertex:Ef,skinnormal_vertex:wf,specularmap_fragment:Af,specularmap_pars_fragment:Cf,tonemapping_fragment:Rf,tonemapping_pars_fragment:Pf,transmission_fragment:Lf,transmission_pars_fragment:Df,uv_pars_fragment:If,uv_pars_vertex:Uf,uv_vertex:Nf,worldpos_vertex:Ff,background_vert:Bf,background_frag:kf,backgroundCube_vert:Of,backgroundCube_frag:zf,cube_vert:Gf,cube_frag:Vf,depth_vert:Hf,depth_frag:Wf,distanceRGBA_vert:Xf,distanceRGBA_frag:Kf,equirect_vert:qf,equirect_frag:Yf,linedashed_vert:jf,linedashed_frag:$f,meshbasic_vert:Zf,meshbasic_frag:Jf,meshlambert_vert:Qf,meshlambert_frag:ep,meshmatcap_vert:tp,meshmatcap_frag:np,meshnormal_vert:ip,meshnormal_frag:ap,meshphong_vert:rp,meshphong_frag:sp,meshphysical_vert:op,meshphysical_frag:lp,meshtoon_vert:cp,meshtoon_frag:dp,points_vert:hp,points_frag:up,shadow_vert:fp,shadow_frag:pp,sprite_vert:mp,sprite_frag:xp},ce={common:{diffuse:{value:new Xe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Be}},envmap:{envMap:{value:null},envMapRotation:{value:new Be},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Be}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Be}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Be},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Be},normalScale:{value:new Ue(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Be},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Be}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Be}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Be}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Xe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0},uvTransform:{value:new Be}},sprite:{diffuse:{value:new Xe(16777215)},opacity:{value:1},center:{value:new Ue(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Be},alphaMap:{value:null},alphaMapTransform:{value:new Be},alphaTest:{value:0}}},xn={basic:{uniforms:It([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.fog]),vertexShader:Oe.meshbasic_vert,fragmentShader:Oe.meshbasic_frag},lambert:{uniforms:It([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new Xe(0)}}]),vertexShader:Oe.meshlambert_vert,fragmentShader:Oe.meshlambert_frag},phong:{uniforms:It([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new Xe(0)},specular:{value:new Xe(1118481)},shininess:{value:30}}]),vertexShader:Oe.meshphong_vert,fragmentShader:Oe.meshphong_frag},standard:{uniforms:It([ce.common,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.roughnessmap,ce.metalnessmap,ce.fog,ce.lights,{emissive:{value:new Xe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag},toon:{uniforms:It([ce.common,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.gradientmap,ce.fog,ce.lights,{emissive:{value:new Xe(0)}}]),vertexShader:Oe.meshtoon_vert,fragmentShader:Oe.meshtoon_frag},matcap:{uniforms:It([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,{matcap:{value:null}}]),vertexShader:Oe.meshmatcap_vert,fragmentShader:Oe.meshmatcap_frag},points:{uniforms:It([ce.points,ce.fog]),vertexShader:Oe.points_vert,fragmentShader:Oe.points_frag},dashed:{uniforms:It([ce.common,ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Oe.linedashed_vert,fragmentShader:Oe.linedashed_frag},depth:{uniforms:It([ce.common,ce.displacementmap]),vertexShader:Oe.depth_vert,fragmentShader:Oe.depth_frag},normal:{uniforms:It([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,{opacity:{value:1}}]),vertexShader:Oe.meshnormal_vert,fragmentShader:Oe.meshnormal_frag},sprite:{uniforms:It([ce.sprite,ce.fog]),vertexShader:Oe.sprite_vert,fragmentShader:Oe.sprite_frag},background:{uniforms:{uvTransform:{value:new Be},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Oe.background_vert,fragmentShader:Oe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Be}},vertexShader:Oe.backgroundCube_vert,fragmentShader:Oe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Oe.cube_vert,fragmentShader:Oe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Oe.equirect_vert,fragmentShader:Oe.equirect_frag},distanceRGBA:{uniforms:It([ce.common,ce.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Oe.distanceRGBA_vert,fragmentShader:Oe.distanceRGBA_frag},shadow:{uniforms:It([ce.lights,ce.fog,{color:{value:new Xe(0)},opacity:{value:1}}]),vertexShader:Oe.shadow_vert,fragmentShader:Oe.shadow_frag}};xn.physical={uniforms:It([xn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Be},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Be},clearcoatNormalScale:{value:new Ue(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Be},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Be},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Be},sheen:{value:0},sheenColor:{value:new Xe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Be},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Be},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Be},transmissionSamplerSize:{value:new Ue},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Be},attenuationDistance:{value:0},attenuationColor:{value:new Xe(0)},specularColor:{value:new Xe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Be},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Be},anisotropyVector:{value:new Ue},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Be}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag};const Ka={r:0,b:0,g:0},si=new yn,gp=new st;function _p(i,e,t,n,a,r,s){const o=new Xe(0);let l=r===!0?0:1,c,d,h=null,u=0,p=null;function x(T){let w=T.isScene===!0?T.background:null;return w&&w.isTexture&&(w=(T.backgroundBlurriness>0?t:e).get(w)),w}function _(T){let w=!1;const L=x(T);L===null?f(o,l):L&&L.isColor&&(f(L,1),w=!0);const b=i.xr.getEnvironmentBlendMode();b==="additive"?n.buffers.color.setClear(0,0,0,1,s):b==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,s),(i.autoClear||w)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(T,w){const L=x(w);L&&(L.isCubeTexture||L.mapping===dr)?(d===void 0&&(d=new Et(new Mn(1,1,1),new kn({name:"BackgroundCubeMaterial",uniforms:Wi(xn.backgroundCube.uniforms),vertexShader:xn.backgroundCube.vertexShader,fragmentShader:xn.backgroundCube.fragmentShader,side:Xt,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(b,R,B){this.matrixWorld.copyPosition(B.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(d)),si.copy(w.backgroundRotation),si.x*=-1,si.y*=-1,si.z*=-1,L.isCubeTexture&&L.isRenderTargetTexture===!1&&(si.y*=-1,si.z*=-1),d.material.uniforms.envMap.value=L,d.material.uniforms.flipEnvMap.value=L.isCubeTexture&&L.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(gp.makeRotationFromEuler(si)),d.material.toneMapped=je.getTransfer(L.colorSpace)!==at,(h!==L||u!==L.version||p!==i.toneMapping)&&(d.material.needsUpdate=!0,h=L,u=L.version,p=i.toneMapping),d.layers.enableAll(),T.unshift(d,d.geometry,d.material,0,0,null)):L&&L.isTexture&&(c===void 0&&(c=new Et(new ur(2,2),new kn({name:"BackgroundMaterial",uniforms:Wi(xn.background.uniforms),vertexShader:xn.background.vertexShader,fragmentShader:xn.background.fragmentShader,side:Jn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(c)),c.material.uniforms.t2D.value=L,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.toneMapped=je.getTransfer(L.colorSpace)!==at,L.matrixAutoUpdate===!0&&L.updateMatrix(),c.material.uniforms.uvTransform.value.copy(L.matrix),(h!==L||u!==L.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,h=L,u=L.version,p=i.toneMapping),c.layers.enableAll(),T.unshift(c,c.geometry,c.material,0,0,null))}function f(T,w){T.getRGB(Ka,lc(i)),n.buffers.color.setClear(Ka.r,Ka.g,Ka.b,w,s)}function E(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(T,w=1){o.set(T),l=w,f(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(T){l=T,f(o,l)},render:_,addToRenderList:m,dispose:E}}function vp(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},a=u(null);let r=a,s=!1;function o(y,D,O,V,X){let H=!1;const Y=h(V,O,D);r!==Y&&(r=Y,c(r.object)),H=p(y,V,O,X),H&&x(y,V,O,X),X!==null&&e.update(X,i.ELEMENT_ARRAY_BUFFER),(H||s)&&(s=!1,w(y,D,O,V),X!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(X).buffer))}function l(){return i.createVertexArray()}function c(y){return i.bindVertexArray(y)}function d(y){return i.deleteVertexArray(y)}function h(y,D,O){const V=O.wireframe===!0;let X=n[y.id];X===void 0&&(X={},n[y.id]=X);let H=X[D.id];H===void 0&&(H={},X[D.id]=H);let Y=H[V];return Y===void 0&&(Y=u(l()),H[V]=Y),Y}function u(y){const D=[],O=[],V=[];for(let X=0;X<t;X++)D[X]=0,O[X]=0,V[X]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:O,attributeDivisors:V,object:y,attributes:{},index:null}}function p(y,D,O,V){const X=r.attributes,H=D.attributes;let Y=0;const Q=O.getAttributes();for(const W in Q)if(Q[W].location>=0){const re=X[W];let Me=H[W];if(Me===void 0&&(W==="instanceMatrix"&&y.instanceMatrix&&(Me=y.instanceMatrix),W==="instanceColor"&&y.instanceColor&&(Me=y.instanceColor)),re===void 0||re.attribute!==Me||Me&&re.data!==Me.data)return!0;Y++}return r.attributesNum!==Y||r.index!==V}function x(y,D,O,V){const X={},H=D.attributes;let Y=0;const Q=O.getAttributes();for(const W in Q)if(Q[W].location>=0){let re=H[W];re===void 0&&(W==="instanceMatrix"&&y.instanceMatrix&&(re=y.instanceMatrix),W==="instanceColor"&&y.instanceColor&&(re=y.instanceColor));const Me={};Me.attribute=re,re&&re.data&&(Me.data=re.data),X[W]=Me,Y++}r.attributes=X,r.attributesNum=Y,r.index=V}function _(){const y=r.newAttributes;for(let D=0,O=y.length;D<O;D++)y[D]=0}function m(y){f(y,0)}function f(y,D){const O=r.newAttributes,V=r.enabledAttributes,X=r.attributeDivisors;O[y]=1,V[y]===0&&(i.enableVertexAttribArray(y),V[y]=1),X[y]!==D&&(i.vertexAttribDivisor(y,D),X[y]=D)}function E(){const y=r.newAttributes,D=r.enabledAttributes;for(let O=0,V=D.length;O<V;O++)D[O]!==y[O]&&(i.disableVertexAttribArray(O),D[O]=0)}function T(y,D,O,V,X,H,Y){Y===!0?i.vertexAttribIPointer(y,D,O,X,H):i.vertexAttribPointer(y,D,O,V,X,H)}function w(y,D,O,V){_();const X=V.attributes,H=O.getAttributes(),Y=D.defaultAttributeValues;for(const Q in H){const W=H[Q];if(W.location>=0){let ne=X[Q];if(ne===void 0&&(Q==="instanceMatrix"&&y.instanceMatrix&&(ne=y.instanceMatrix),Q==="instanceColor"&&y.instanceColor&&(ne=y.instanceColor)),ne!==void 0){const re=ne.normalized,Me=ne.itemSize,Ge=e.get(ne);if(Ge===void 0)continue;const qe=Ge.buffer,et=Ge.type,tt=Ge.bytesPerElement,K=et===i.INT||et===i.UNSIGNED_INT||ne.gpuType===$s;if(ne.isInterleavedBufferAttribute){const Z=ne.data,me=Z.stride,Le=ne.offset;if(Z.isInstancedInterleavedBuffer){for(let ye=0;ye<W.locationSize;ye++)f(W.location+ye,Z.meshPerAttribute);y.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=Z.meshPerAttribute*Z.count)}else for(let ye=0;ye<W.locationSize;ye++)m(W.location+ye);i.bindBuffer(i.ARRAY_BUFFER,qe);for(let ye=0;ye<W.locationSize;ye++)T(W.location+ye,Me/W.locationSize,et,re,me*tt,(Le+Me/W.locationSize*ye)*tt,K)}else{if(ne.isInstancedBufferAttribute){for(let Z=0;Z<W.locationSize;Z++)f(W.location+Z,ne.meshPerAttribute);y.isInstancedMesh!==!0&&V._maxInstanceCount===void 0&&(V._maxInstanceCount=ne.meshPerAttribute*ne.count)}else for(let Z=0;Z<W.locationSize;Z++)m(W.location+Z);i.bindBuffer(i.ARRAY_BUFFER,qe);for(let Z=0;Z<W.locationSize;Z++)T(W.location+Z,Me/W.locationSize,et,re,Me*tt,Me/W.locationSize*Z*tt,K)}}else if(Y!==void 0){const re=Y[Q];if(re!==void 0)switch(re.length){case 2:i.vertexAttrib2fv(W.location,re);break;case 3:i.vertexAttrib3fv(W.location,re);break;case 4:i.vertexAttrib4fv(W.location,re);break;default:i.vertexAttrib1fv(W.location,re)}}}}E()}function L(){B();for(const y in n){const D=n[y];for(const O in D){const V=D[O];for(const X in V)d(V[X].object),delete V[X];delete D[O]}delete n[y]}}function b(y){if(n[y.id]===void 0)return;const D=n[y.id];for(const O in D){const V=D[O];for(const X in V)d(V[X].object),delete V[X];delete D[O]}delete n[y.id]}function R(y){for(const D in n){const O=n[D];if(O[y.id]===void 0)continue;const V=O[y.id];for(const X in V)d(V[X].object),delete V[X];delete O[y.id]}}function B(){M(),s=!0,r!==a&&(r=a,c(r.object))}function M(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:o,reset:B,resetDefaultState:M,dispose:L,releaseStatesOfGeometry:b,releaseStatesOfProgram:R,initAttributes:_,enableAttribute:m,disableUnusedAttributes:E}}function yp(i,e,t){let n;function a(c){n=c}function r(c,d){i.drawArrays(n,c,d),t.update(d,n,1)}function s(c,d,h){h!==0&&(i.drawArraysInstanced(n,c,d,h),t.update(d,n,h))}function o(c,d,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,d,0,h);let p=0;for(let x=0;x<h;x++)p+=d[x];t.update(p,n,1)}function l(c,d,h,u){if(h===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let x=0;x<c.length;x++)s(c[x],d[x],u[x]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,d,0,u,0,h);let x=0;for(let _=0;_<h;_++)x+=d[_]*u[_];t.update(x,n,1)}}this.setMode=a,this.render=r,this.renderInstances=s,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function Mp(i,e,t,n){let a;function r(){if(a!==void 0)return a;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");a=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function s(R){return!(R!==fn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const B=R===qi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==vn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==gn&&!B)}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const d=l(c);d!==c&&(Ie("WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const h=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),x=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),_=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),T=i.getParameter(i.MAX_VARYING_VECTORS),w=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),L=x>0,b=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:s,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:u,maxTextures:p,maxVertexTextures:x,maxTextureSize:_,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:E,maxVaryings:T,maxFragmentUniforms:w,vertexTextures:L,maxSamples:b}}function bp(i){const e=this;let t=null,n=0,a=!1,r=!1;const s=new Xn,o=new Be,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,u){const p=h.length!==0||u||n!==0||a;return a=u,n=h.length,p},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,u){t=d(h,u,0)},this.setState=function(h,u,p){const x=h.clippingPlanes,_=h.clipIntersection,m=h.clipShadows,f=i.get(h);if(!a||x===null||x.length===0||r&&!m)r?d(null):c();else{const E=r?0:n,T=E*4;let w=f.clippingState||null;l.value=w,w=d(x,u,T,p);for(let L=0;L!==T;++L)w[L]=t[L];f.clippingState=w,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(h,u,p,x){const _=h!==null?h.length:0;let m=null;if(_!==0){if(m=l.value,x!==!0||m===null){const f=p+_*4,E=u.matrixWorldInverse;o.getNormalMatrix(E),(m===null||m.length<f)&&(m=new Float32Array(f));for(let T=0,w=p;T!==_;++T,w+=4)s.copy(h[T]).applyMatrix4(E,o),s.normal.toArray(m,w),m[w+3]=s.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=_,e.numIntersection=0,m}}function Sp(i){let e=new WeakMap;function t(s,o){return o===us?s.mapping=Gi:o===fs&&(s.mapping=Vi),s}function n(s){if(s&&s.isTexture){const o=s.mapping;if(o===us||o===fs)if(e.has(s)){const l=e.get(s).texture;return t(l,s.mapping)}else{const l=s.image;if(l&&l.height>0){const c=new xh(l.height);return c.fromEquirectangularTexture(i,s),e.set(s,c),s.addEventListener("dispose",a),t(c.texture,s.mapping)}else return null}}return s}function a(s){const o=s.target;o.removeEventListener("dispose",a);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const jn=4,cl=[.125,.215,.35,.446,.526,.582],ci=20,Tp=256,sa=new xc,dl=new Xe;let Xr=null,Kr=0,qr=0,Yr=!1;const Ep=new C;class hl{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,a=100,r={}){const{size:s=256,position:o=Ep}=r;Xr=this._renderer.getRenderTarget(),Kr=this._renderer.getActiveCubeFace(),qr=this._renderer.getActiveMipmapLevel(),Yr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(s);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,a,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=pl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=fl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Xr,Kr,qr),this._renderer.xr.enabled=Yr,e.scissorTest=!1,Li(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Gi||e.mapping===Vi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Xr=this._renderer.getRenderTarget(),Kr=this._renderer.getActiveCubeFace(),qr=this._renderer.getActiveMipmapLevel(),Yr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:an,minFilter:an,generateMipmaps:!1,type:qi,format:fn,colorSpace:Hi,depthBuffer:!1},a=ul(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=ul(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=wp(r)),this._blurMaterial=Cp(r,e,t),this._ggxMaterial=Ap(r,e,t)}return a}_compileMaterial(e){const t=new Et(new sn,e);this._renderer.compile(t,sa)}_sceneToCubeUV(e,t,n,a,r){const l=new nn(90,1,t,n),c=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,p=h.toneMapping;h.getClearColor(dl),h.toneMapping=$n,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(a),h.clearDepth(),h.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Et(new Mn,new hr({name:"PMREM.Background",side:Xt,depthWrite:!1,depthTest:!1})));const _=this._backgroundBox,m=_.material;let f=!1;const E=e.background;E?E.isColor&&(m.color.copy(E),e.background=null,f=!0):(m.color.copy(dl),f=!0);for(let T=0;T<6;T++){const w=T%3;w===0?(l.up.set(0,c[T],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+d[T],r.y,r.z)):w===1?(l.up.set(0,0,c[T]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+d[T],r.z)):(l.up.set(0,c[T],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+d[T]));const L=this._cubeSize;Li(a,w*L,T>2?L:0,L,L),h.setRenderTarget(a),f&&h.render(_,l),h.render(e,l)}h.toneMapping=p,h.autoClear=u,e.background=E}_textureToCubeUV(e,t){const n=this._renderer,a=e.mapping===Gi||e.mapping===Vi;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=pl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=fl());const r=a?this._cubemapMaterial:this._equirectMaterial,s=this._lodMeshes[0];s.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Li(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(s,sa)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const a=this._lodMeshes.length;for(let r=1;r<a;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const a=this._renderer,r=this._pingPongRenderTarget,s=this._ggxMaterial,o=this._lodMeshes[n];o.material=s;const l=s.uniforms,c=n/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),h=Math.sqrt(c*c-d*d),u=.05+c*.95,p=h*u,{_lodMax:x}=this,_=this._sizeLods[n],m=3*_*(n>x-jn?n-x+jn:0),f=4*(this._cubeSize-_);l.envMap.value=e.texture,l.roughness.value=p,l.mipInt.value=x-t,Li(r,m,f,3*_,2*_),a.setRenderTarget(r),a.render(o,sa),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=x-n,Li(e,m,f,3*_,2*_),a.setRenderTarget(e),a.render(o,sa)}_blur(e,t,n,a,r){const s=this._pingPongRenderTarget;this._halfBlur(e,s,t,n,a,"latitudinal",r),this._halfBlur(s,e,n,n,a,"longitudinal",r)}_halfBlur(e,t,n,a,r,s,o){const l=this._renderer,c=this._blurMaterial;s!=="latitudinal"&&s!=="longitudinal"&&gt("blur direction must be either latitudinal or longitudinal!");const d=3,h=this._lodMeshes[a];h.material=c;const u=c.uniforms,p=this._sizeLods[n]-1,x=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*ci-1),_=r/x,m=isFinite(r)?1+Math.floor(d*_):ci;m>ci&&Ie(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ci}`);const f=[];let E=0;for(let R=0;R<ci;++R){const B=R/_,M=Math.exp(-B*B/2);f.push(M),R===0?E+=M:R<m&&(E+=2*M)}for(let R=0;R<f.length;R++)f[R]=f[R]/E;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=f,u.latitudinal.value=s==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:T}=this;u.dTheta.value=x,u.mipInt.value=T-n;const w=this._sizeLods[a],L=3*w*(a>T-jn?a-T+jn:0),b=4*(this._cubeSize-w);Li(t,L,b,3*w,2*w),l.setRenderTarget(t),l.render(h,sa)}}function wp(i){const e=[],t=[],n=[];let a=i;const r=i-jn+1+cl.length;for(let s=0;s<r;s++){const o=Math.pow(2,a);e.push(o);let l=1/o;s>i-jn?l=cl[s-i+jn-1]:s===0&&(l=0),t.push(l);const c=1/(o-2),d=-c,h=1+c,u=[d,d,h,d,h,h,d,d,h,h,d,h],p=6,x=6,_=3,m=2,f=1,E=new Float32Array(_*x*p),T=new Float32Array(m*x*p),w=new Float32Array(f*x*p);for(let b=0;b<p;b++){const R=b%3*2/3-1,B=b>2?0:-1,M=[R,B,0,R+2/3,B,0,R+2/3,B+1,0,R,B,0,R+2/3,B+1,0,R,B+1,0];E.set(M,_*x*b),T.set(u,m*x*b);const y=[b,b,b,b,b,b];w.set(y,f*x*b)}const L=new sn;L.setAttribute("position",new rn(E,_)),L.setAttribute("uv",new rn(T,m)),L.setAttribute("faceIndex",new rn(w,f)),n.push(new Et(L,null)),a>jn&&a--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function ul(i,e,t){const n=new fi(i,e,t);return n.texture.mapping=dr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Li(i,e,t,n,a){i.viewport.set(e,t,n,a),i.scissor.set(e,t,n,a)}function Ap(i,e,t){return new kn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Tp,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:fr(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 3.2: Transform view direction to hemisphere configuration
				vec3 Vh = normalize(vec3(alpha * V.x, alpha * V.y, V.z));

				// Section 4.1: Orthonormal basis
				float lensq = Vh.x * Vh.x + Vh.y * Vh.y;
				vec3 T1 = lensq > 0.0 ? vec3(-Vh.y, Vh.x, 0.0) / sqrt(lensq) : vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(Vh, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + Vh.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * Vh;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Un,depthTest:!1,depthWrite:!1})}function Cp(i,e,t){const n=new Float32Array(ci),a=new C(0,1,0);return new kn({name:"SphericalGaussianBlur",defines:{n:ci,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:fr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Un,depthTest:!1,depthWrite:!1})}function fl(){return new kn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:fr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Un,depthTest:!1,depthWrite:!1})}function pl(){return new kn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:fr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Un,depthTest:!1,depthWrite:!1})}function fr(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function Rp(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===us||l===fs,d=l===Gi||l===Vi;if(c||d){let h=e.get(o);const u=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==u)return t===null&&(t=new hl(i)),h=c?t.fromEquirectangular(o,h):t.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),h.texture;if(h!==void 0)return h.texture;{const p=o.image;return c&&p&&p.height>0||d&&p&&a(p)?(t===null&&(t=new hl(i)),h=c?t.fromEquirectangular(o):t.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),o.addEventListener("dispose",r),h.texture):null}}}return o}function a(o){let l=0;const c=6;for(let d=0;d<c;d++)o[d]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function s(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:s}}function Pp(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const a=i.getExtension(n);return e[n]=a,a}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const a=t(n);return a===null&&ga("WebGLRenderer: "+n+" extension not supported."),a}}}function Lp(i,e,t,n){const a={},r=new WeakMap;function s(h){const u=h.target;u.index!==null&&e.remove(u.index);for(const x in u.attributes)e.remove(u.attributes[x]);u.removeEventListener("dispose",s),delete a[u.id];const p=r.get(u);p&&(e.remove(p),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(h,u){return a[u.id]===!0||(u.addEventListener("dispose",s),a[u.id]=!0,t.memory.geometries++),u}function l(h){const u=h.attributes;for(const p in u)e.update(u[p],i.ARRAY_BUFFER)}function c(h){const u=[],p=h.index,x=h.attributes.position;let _=0;if(p!==null){const E=p.array;_=p.version;for(let T=0,w=E.length;T<w;T+=3){const L=E[T+0],b=E[T+1],R=E[T+2];u.push(L,b,b,R,R,L)}}else if(x!==void 0){const E=x.array;_=x.version;for(let T=0,w=E.length/3-1;T<w;T+=3){const L=T+0,b=T+1,R=T+2;u.push(L,b,b,R,R,L)}}else return;const m=new(nc(u)?oc:sc)(u,1);m.version=_;const f=r.get(h);f&&e.remove(f),r.set(h,m)}function d(h){const u=r.get(h);if(u){const p=h.index;p!==null&&u.version<p.version&&c(h)}else c(h);return r.get(h)}return{get:o,update:l,getWireframeAttribute:d}}function Dp(i,e,t){let n;function a(u){n=u}let r,s;function o(u){r=u.type,s=u.bytesPerElement}function l(u,p){i.drawElements(n,p,r,u*s),t.update(p,n,1)}function c(u,p,x){x!==0&&(i.drawElementsInstanced(n,p,r,u*s,x),t.update(p,n,x))}function d(u,p,x){if(x===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,u,0,x);let m=0;for(let f=0;f<x;f++)m+=p[f];t.update(m,n,1)}function h(u,p,x,_){if(x===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<u.length;f++)c(u[f]/s,p[f],_[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,u,0,_,0,x);let f=0;for(let E=0;E<x;E++)f+=p[E]*_[E];t.update(f,n,1)}}this.setMode=a,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=h}function Ip(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,s,o){switch(t.calls++,s){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:gt("WebGLInfo: Unknown draw mode:",s);break}}function a(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:a,update:n}}function Up(i,e,t){const n=new WeakMap,a=new xt;function r(s,o,l){const c=s.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=d!==void 0?d.length:0;let u=n.get(o);if(u===void 0||u.count!==h){let y=function(){B.dispose(),n.delete(o),o.removeEventListener("dispose",y)};var p=y;u!==void 0&&u.texture.dispose();const x=o.morphAttributes.position!==void 0,_=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],E=o.morphAttributes.normal||[],T=o.morphAttributes.color||[];let w=0;x===!0&&(w=1),_===!0&&(w=2),m===!0&&(w=3);let L=o.attributes.position.count*w,b=1;L>e.maxTextureSize&&(b=Math.ceil(L/e.maxTextureSize),L=e.maxTextureSize);const R=new Float32Array(L*b*4*h),B=new ic(R,L,b,h);B.type=gn,B.needsUpdate=!0;const M=w*4;for(let D=0;D<h;D++){const O=f[D],V=E[D],X=T[D],H=L*b*4*D;for(let Y=0;Y<O.count;Y++){const Q=Y*M;x===!0&&(a.fromBufferAttribute(O,Y),R[H+Q+0]=a.x,R[H+Q+1]=a.y,R[H+Q+2]=a.z,R[H+Q+3]=0),_===!0&&(a.fromBufferAttribute(V,Y),R[H+Q+4]=a.x,R[H+Q+5]=a.y,R[H+Q+6]=a.z,R[H+Q+7]=0),m===!0&&(a.fromBufferAttribute(X,Y),R[H+Q+8]=a.x,R[H+Q+9]=a.y,R[H+Q+10]=a.z,R[H+Q+11]=X.itemSize===4?a.w:1)}}u={count:h,texture:B,size:new Ue(L,b)},n.set(o,u),o.addEventListener("dispose",y)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",s.morphTexture,t);else{let x=0;for(let m=0;m<c.length;m++)x+=c[m];const _=o.morphTargetsRelative?1:1-x;l.getUniforms().setValue(i,"morphTargetBaseInfluence",_),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function Np(i,e,t,n){let a=new WeakMap;function r(l){const c=n.render.frame,d=l.geometry,h=e.get(l,d);if(a.get(h)!==c&&(e.update(h),a.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),a.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),a.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;a.get(u)!==c&&(u.update(),a.set(u,c))}return h}function s(){a=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:s}}const _c=new Ut,ml=new pc(1,1),vc=new ic,yc=new Qd,Mc=new dc,xl=[],gl=[],_l=new Float32Array(16),vl=new Float32Array(9),yl=new Float32Array(4);function Zi(i,e,t){const n=i[0];if(n<=0||n>0)return i;const a=e*t;let r=xl[a];if(r===void 0&&(r=new Float32Array(a),xl[a]=r),e!==0){n.toArray(r,0);for(let s=1,o=0;s!==e;++s)o+=t,i[s].toArray(r,o)}return r}function Mt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function bt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function pr(i,e){let t=gl[e];t===void 0&&(t=new Int32Array(e),gl[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Fp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Bp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2fv(this.addr,e),bt(t,e)}}function kp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Mt(t,e))return;i.uniform3fv(this.addr,e),bt(t,e)}}function Op(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4fv(this.addr,e),bt(t,e)}}function zp(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Mt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),bt(t,e)}else{if(Mt(t,n))return;yl.set(n),i.uniformMatrix2fv(this.addr,!1,yl),bt(t,n)}}function Gp(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Mt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),bt(t,e)}else{if(Mt(t,n))return;vl.set(n),i.uniformMatrix3fv(this.addr,!1,vl),bt(t,n)}}function Vp(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Mt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),bt(t,e)}else{if(Mt(t,n))return;_l.set(n),i.uniformMatrix4fv(this.addr,!1,_l),bt(t,n)}}function Hp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function Wp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2iv(this.addr,e),bt(t,e)}}function Xp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Mt(t,e))return;i.uniform3iv(this.addr,e),bt(t,e)}}function Kp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4iv(this.addr,e),bt(t,e)}}function qp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Yp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2uiv(this.addr,e),bt(t,e)}}function jp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Mt(t,e))return;i.uniform3uiv(this.addr,e),bt(t,e)}}function $p(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4uiv(this.addr,e),bt(t,e)}}function Zp(i,e,t){const n=this.cache,a=t.allocateTextureUnit();n[0]!==a&&(i.uniform1i(this.addr,a),n[0]=a);let r;this.type===i.SAMPLER_2D_SHADOW?(ml.compareFunction=tc,r=ml):r=_c,t.setTexture2D(e||r,a)}function Jp(i,e,t){const n=this.cache,a=t.allocateTextureUnit();n[0]!==a&&(i.uniform1i(this.addr,a),n[0]=a),t.setTexture3D(e||yc,a)}function Qp(i,e,t){const n=this.cache,a=t.allocateTextureUnit();n[0]!==a&&(i.uniform1i(this.addr,a),n[0]=a),t.setTextureCube(e||Mc,a)}function em(i,e,t){const n=this.cache,a=t.allocateTextureUnit();n[0]!==a&&(i.uniform1i(this.addr,a),n[0]=a),t.setTexture2DArray(e||vc,a)}function tm(i){switch(i){case 5126:return Fp;case 35664:return Bp;case 35665:return kp;case 35666:return Op;case 35674:return zp;case 35675:return Gp;case 35676:return Vp;case 5124:case 35670:return Hp;case 35667:case 35671:return Wp;case 35668:case 35672:return Xp;case 35669:case 35673:return Kp;case 5125:return qp;case 36294:return Yp;case 36295:return jp;case 36296:return $p;case 35678:case 36198:case 36298:case 36306:case 35682:return Zp;case 35679:case 36299:case 36307:return Jp;case 35680:case 36300:case 36308:case 36293:return Qp;case 36289:case 36303:case 36311:case 36292:return em}}function nm(i,e){i.uniform1fv(this.addr,e)}function im(i,e){const t=Zi(e,this.size,2);i.uniform2fv(this.addr,t)}function am(i,e){const t=Zi(e,this.size,3);i.uniform3fv(this.addr,t)}function rm(i,e){const t=Zi(e,this.size,4);i.uniform4fv(this.addr,t)}function sm(i,e){const t=Zi(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function om(i,e){const t=Zi(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function lm(i,e){const t=Zi(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function cm(i,e){i.uniform1iv(this.addr,e)}function dm(i,e){i.uniform2iv(this.addr,e)}function hm(i,e){i.uniform3iv(this.addr,e)}function um(i,e){i.uniform4iv(this.addr,e)}function fm(i,e){i.uniform1uiv(this.addr,e)}function pm(i,e){i.uniform2uiv(this.addr,e)}function mm(i,e){i.uniform3uiv(this.addr,e)}function xm(i,e){i.uniform4uiv(this.addr,e)}function gm(i,e,t){const n=this.cache,a=e.length,r=pr(t,a);Mt(n,r)||(i.uniform1iv(this.addr,r),bt(n,r));for(let s=0;s!==a;++s)t.setTexture2D(e[s]||_c,r[s])}function _m(i,e,t){const n=this.cache,a=e.length,r=pr(t,a);Mt(n,r)||(i.uniform1iv(this.addr,r),bt(n,r));for(let s=0;s!==a;++s)t.setTexture3D(e[s]||yc,r[s])}function vm(i,e,t){const n=this.cache,a=e.length,r=pr(t,a);Mt(n,r)||(i.uniform1iv(this.addr,r),bt(n,r));for(let s=0;s!==a;++s)t.setTextureCube(e[s]||Mc,r[s])}function ym(i,e,t){const n=this.cache,a=e.length,r=pr(t,a);Mt(n,r)||(i.uniform1iv(this.addr,r),bt(n,r));for(let s=0;s!==a;++s)t.setTexture2DArray(e[s]||vc,r[s])}function Mm(i){switch(i){case 5126:return nm;case 35664:return im;case 35665:return am;case 35666:return rm;case 35674:return sm;case 35675:return om;case 35676:return lm;case 5124:case 35670:return cm;case 35667:case 35671:return dm;case 35668:case 35672:return hm;case 35669:case 35673:return um;case 5125:return fm;case 36294:return pm;case 36295:return mm;case 36296:return xm;case 35678:case 36198:case 36298:case 36306:case 35682:return gm;case 35679:case 36299:case 36307:return _m;case 35680:case 36300:case 36308:case 36293:return vm;case 36289:case 36303:case 36311:case 36292:return ym}}class bm{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=tm(t.type)}}class Sm{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=Mm(t.type)}}class Tm{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const a=this.seq;for(let r=0,s=a.length;r!==s;++r){const o=a[r];o.setValue(e,t[o.id],n)}}}const jr=/(\w+)(\])?(\[|\.)?/g;function Ml(i,e){i.seq.push(e),i.map[e.id]=e}function Em(i,e,t){const n=i.name,a=n.length;for(jr.lastIndex=0;;){const r=jr.exec(n),s=jr.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&s+2===a){Ml(t,c===void 0?new bm(o,i,e):new Sm(o,i,e));break}else{let h=t.map[o];h===void 0&&(h=new Tm(o),Ml(t,h)),t=h}}}class Qa{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const r=e.getActiveUniform(t,a),s=e.getUniformLocation(t,r.name);Em(r,s,this)}}setValue(e,t,n,a){const r=this.map[t];r!==void 0&&r.setValue(e,n,a)}setOptional(e,t,n){const a=t[n];a!==void 0&&this.setValue(e,n,a)}static upload(e,t,n,a){for(let r=0,s=t.length;r!==s;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,a)}}static seqWithValue(e,t){const n=[];for(let a=0,r=e.length;a!==r;++a){const s=e[a];s.id in t&&n.push(s)}return n}}function bl(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const wm=37297;let Am=0;function Cm(i,e){const t=i.split(`
`),n=[],a=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let s=a;s<r;s++){const o=s+1;n.push(`${o===e?">":" "} ${o}: ${t[s]}`)}return n.join(`
`)}const Sl=new Be;function Rm(i){je._getMatrix(Sl,je.workingColorSpace,i);const e=`mat3( ${Sl.elements.map(t=>t.toFixed(4))} )`;switch(je.getTransfer(i)){case ir:return[e,"LinearTransferOETF"];case at:return[e,"sRGBTransferOETF"];default:return Ie("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Tl(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+Cm(i.getShaderSource(e),o)}else return r}function Pm(i,e){const t=Rm(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Lm(i,e){let t;switch(e){case fd:t="Linear";break;case pd:t="Reinhard";break;case md:t="Cineon";break;case Kl:t="ACESFilmic";break;case gd:t="AgX";break;case _d:t="Neutral";break;case xd:t="Custom";break;default:Ie("WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const qa=new C;function Dm(){je.getLuminanceCoefficients(qa);const i=qa.x.toFixed(4),e=qa.y.toFixed(4),t=qa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Im(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ca).join(`
`)}function Um(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Nm(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let a=0;a<n;a++){const r=i.getActiveAttrib(e,a),s=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[s]={type:r.type,location:i.getAttribLocation(e,s),locationSize:o}}return t}function ca(i){return i!==""}function El(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function wl(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Fm=/^[ \t]*#include +<([\w\d./]+)>/gm;function Xs(i){return i.replace(Fm,km)}const Bm=new Map;function km(i,e){let t=Oe[e];if(t===void 0){const n=Bm.get(e);if(n!==void 0)t=Oe[n],Ie('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Xs(t)}const Om=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Al(i){return i.replace(Om,zm)}function zm(i,e,t,n){let a="";for(let r=parseInt(e);r<parseInt(t);r++)a+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return a}function Cl(i){let e=`precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;return i.precision==="highp"?e+=`
#define HIGH_PRECISION`:i.precision==="mediump"?e+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(e+=`
#define LOW_PRECISION`),e}function Gm(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Xl?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Kc?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Cn&&(e="SHADOWMAP_TYPE_VSM"),e}function Vm(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Gi:case Vi:e="ENVMAP_TYPE_CUBE";break;case dr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Hm(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Vi&&(e="ENVMAP_MODE_REFRACTION"),e}function Wm(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case js:e="ENVMAP_BLENDING_MULTIPLY";break;case hd:e="ENVMAP_BLENDING_MIX";break;case ud:e="ENVMAP_BLENDING_ADD";break}return e}function Xm(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function Km(i,e,t,n){const a=i.getContext(),r=t.defines;let s=t.vertexShader,o=t.fragmentShader;const l=Gm(t),c=Vm(t),d=Hm(t),h=Wm(t),u=Xm(t),p=Im(t),x=Um(r),_=a.createProgram();let m,f,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(ca).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x].filter(ca).join(`
`),f.length>0&&(f+=`
`)):(m=[Cl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ca).join(`
`),f=[Cl(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,x,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+h:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==$n?"#define TONE_MAPPING":"",t.toneMapping!==$n?Oe.tonemapping_pars_fragment:"",t.toneMapping!==$n?Lm("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Oe.colorspace_pars_fragment,Pm("linearToOutputTexel",t.outputColorSpace),Dm(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ca).join(`
`)),s=Xs(s),s=El(s,t),s=wl(s,t),o=Xs(o),o=El(o,t),o=wl(o,t),s=Al(s),o=Al(o),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===Uo?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Uo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const T=E+m+s,w=E+f+o,L=bl(a,a.VERTEX_SHADER,T),b=bl(a,a.FRAGMENT_SHADER,w);a.attachShader(_,L),a.attachShader(_,b),t.index0AttributeName!==void 0?a.bindAttribLocation(_,0,t.index0AttributeName):t.morphTargets===!0&&a.bindAttribLocation(_,0,"position"),a.linkProgram(_);function R(D){if(i.debug.checkShaderErrors){const O=a.getProgramInfoLog(_)||"",V=a.getShaderInfoLog(L)||"",X=a.getShaderInfoLog(b)||"",H=O.trim(),Y=V.trim(),Q=X.trim();let W=!0,ne=!0;if(a.getProgramParameter(_,a.LINK_STATUS)===!1)if(W=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(a,_,L,b);else{const re=Tl(a,L,"vertex"),Me=Tl(a,b,"fragment");gt("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(_,a.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+H+`
`+re+`
`+Me)}else H!==""?Ie("WebGLProgram: Program Info Log:",H):(Y===""||Q==="")&&(ne=!1);ne&&(D.diagnostics={runnable:W,programLog:H,vertexShader:{log:Y,prefix:m},fragmentShader:{log:Q,prefix:f}})}a.deleteShader(L),a.deleteShader(b),B=new Qa(a,_),M=Nm(a,_)}let B;this.getUniforms=function(){return B===void 0&&R(this),B};let M;this.getAttributes=function(){return M===void 0&&R(this),M};let y=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return y===!1&&(y=a.getProgramParameter(_,wm)),y},this.destroy=function(){n.releaseStatesOfProgram(this),a.deleteProgram(_),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Am++,this.cacheKey=e,this.usedTimes=1,this.program=_,this.vertexShader=L,this.fragmentShader=b,this}let qm=0;class Ym{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,a=this._getShaderStage(t),r=this._getShaderStage(n),s=this._getShaderCacheForMaterial(e);return s.has(a)===!1&&(s.add(a),a.usedTimes++),s.has(r)===!1&&(s.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new jm(e),t.set(e,n)),n}}class jm{constructor(e){this.id=qm++,this.code=e,this.usedTimes=0}}function $m(i,e,t,n,a,r,s){const o=new ac,l=new Ym,c=new Set,d=[],h=a.logarithmicDepthBuffer,u=a.vertexTextures;let p=a.precision;const x={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(M){return c.add(M),M===0?"uv":`uv${M}`}function m(M,y,D,O,V){const X=O.fog,H=V.geometry,Y=M.isMeshStandardMaterial?O.environment:null,Q=(M.isMeshStandardMaterial?t:e).get(M.envMap||Y),W=Q&&Q.mapping===dr?Q.image.height:null,ne=x[M.type];M.precision!==null&&(p=a.getMaxPrecision(M.precision),p!==M.precision&&Ie("WebGLProgram.getParameters:",M.precision,"not supported, using",p,"instead."));const re=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,Me=re!==void 0?re.length:0;let Ge=0;H.morphAttributes.position!==void 0&&(Ge=1),H.morphAttributes.normal!==void 0&&(Ge=2),H.morphAttributes.color!==void 0&&(Ge=3);let qe,et,tt,K;if(ne){const nt=xn[ne];qe=nt.vertexShader,et=nt.fragmentShader}else qe=M.vertexShader,et=M.fragmentShader,l.update(M),tt=l.getVertexShaderID(M),K=l.getFragmentShaderID(M);const Z=i.getRenderTarget(),me=i.state.buffers.depth.getReversed(),Le=V.isInstancedMesh===!0,ye=V.isBatchedMesh===!0,Ve=!!M.map,Ze=!!M.matcap,Fe=!!Q,ot=!!M.aoMap,A=!!M.lightMap,ke=!!M.bumpMap,He=!!M.normalMap,Qe=!!M.displacementMap,pe=!!M.emissiveMap,Je=!!M.metalnessMap,be=!!M.roughnessMap,De=M.anisotropy>0,S=M.clearcoat>0,g=M.dispersion>0,k=M.iridescence>0,q=M.sheen>0,U=M.transmission>0,I=De&&!!M.anisotropyMap,te=S&&!!M.clearcoatMap,J=S&&!!M.clearcoatNormalMap,ue=S&&!!M.clearcoatRoughnessMap,se=k&&!!M.iridescenceMap,j=k&&!!M.iridescenceThicknessMap,ie=q&&!!M.sheenColorMap,Ee=q&&!!M.sheenRoughnessMap,Se=!!M.specularMap,he=!!M.specularColorMap,Ce=!!M.specularIntensityMap,P=U&&!!M.transmissionMap,de=U&&!!M.thicknessMap,oe=!!M.gradientMap,le=!!M.alphaMap,ee=M.alphaTest>0,$=!!M.alphaHash,_e=!!M.extensions;let Ne=$n;M.toneMapped&&(Z===null||Z.isXRRenderTarget===!0)&&(Ne=i.toneMapping);const ct={shaderID:ne,shaderType:M.type,shaderName:M.name,vertexShader:qe,fragmentShader:et,defines:M.defines,customVertexShaderID:tt,customFragmentShaderID:K,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:p,batching:ye,batchingColor:ye&&V._colorsTexture!==null,instancing:Le,instancingColor:Le&&V.instanceColor!==null,instancingMorph:Le&&V.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:Z===null?i.outputColorSpace:Z.isXRRenderTarget===!0?Z.texture.colorSpace:Hi,alphaToCoverage:!!M.alphaToCoverage,map:Ve,matcap:Ze,envMap:Fe,envMapMode:Fe&&Q.mapping,envMapCubeUVHeight:W,aoMap:ot,lightMap:A,bumpMap:ke,normalMap:He,displacementMap:u&&Qe,emissiveMap:pe,normalMapObjectSpace:He&&M.normalMapType===bd,normalMapTangentSpace:He&&M.normalMapType===ec,metalnessMap:Je,roughnessMap:be,anisotropy:De,anisotropyMap:I,clearcoat:S,clearcoatMap:te,clearcoatNormalMap:J,clearcoatRoughnessMap:ue,dispersion:g,iridescence:k,iridescenceMap:se,iridescenceThicknessMap:j,sheen:q,sheenColorMap:ie,sheenRoughnessMap:Ee,specularMap:Se,specularColorMap:he,specularIntensityMap:Ce,transmission:U,transmissionMap:P,thicknessMap:de,gradientMap:oe,opaque:M.transparent===!1&&M.blending===Bi&&M.alphaToCoverage===!1,alphaMap:le,alphaTest:ee,alphaHash:$,combine:M.combine,mapUv:Ve&&_(M.map.channel),aoMapUv:ot&&_(M.aoMap.channel),lightMapUv:A&&_(M.lightMap.channel),bumpMapUv:ke&&_(M.bumpMap.channel),normalMapUv:He&&_(M.normalMap.channel),displacementMapUv:Qe&&_(M.displacementMap.channel),emissiveMapUv:pe&&_(M.emissiveMap.channel),metalnessMapUv:Je&&_(M.metalnessMap.channel),roughnessMapUv:be&&_(M.roughnessMap.channel),anisotropyMapUv:I&&_(M.anisotropyMap.channel),clearcoatMapUv:te&&_(M.clearcoatMap.channel),clearcoatNormalMapUv:J&&_(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ue&&_(M.clearcoatRoughnessMap.channel),iridescenceMapUv:se&&_(M.iridescenceMap.channel),iridescenceThicknessMapUv:j&&_(M.iridescenceThicknessMap.channel),sheenColorMapUv:ie&&_(M.sheenColorMap.channel),sheenRoughnessMapUv:Ee&&_(M.sheenRoughnessMap.channel),specularMapUv:Se&&_(M.specularMap.channel),specularColorMapUv:he&&_(M.specularColorMap.channel),specularIntensityMapUv:Ce&&_(M.specularIntensityMap.channel),transmissionMapUv:P&&_(M.transmissionMap.channel),thicknessMapUv:de&&_(M.thicknessMap.channel),alphaMapUv:le&&_(M.alphaMap.channel),vertexTangents:!!H.attributes.tangent&&(He||De),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,pointsUvs:V.isPoints===!0&&!!H.attributes.uv&&(Ve||le),fog:!!X,useFog:M.fog===!0,fogExp2:!!X&&X.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:me,skinning:V.isSkinnedMesh===!0,morphTargets:H.morphAttributes.position!==void 0,morphNormals:H.morphAttributes.normal!==void 0,morphColors:H.morphAttributes.color!==void 0,morphTargetsCount:Me,morphTextureStride:Ge,numDirLights:y.directional.length,numPointLights:y.point.length,numSpotLights:y.spot.length,numSpotLightMaps:y.spotLightMap.length,numRectAreaLights:y.rectArea.length,numHemiLights:y.hemi.length,numDirLightShadows:y.directionalShadowMap.length,numPointLightShadows:y.pointShadowMap.length,numSpotLightShadows:y.spotShadowMap.length,numSpotLightShadowsWithMaps:y.numSpotLightShadowsWithMaps,numLightProbes:y.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ne,decodeVideoTexture:Ve&&M.map.isVideoTexture===!0&&je.getTransfer(M.map.colorSpace)===at,decodeVideoTextureEmissive:pe&&M.emissiveMap.isVideoTexture===!0&&je.getTransfer(M.emissiveMap.colorSpace)===at,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Pn,flipSided:M.side===Xt,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:_e&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(_e&&M.extensions.multiDraw===!0||ye)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return ct.vertexUv1s=c.has(1),ct.vertexUv2s=c.has(2),ct.vertexUv3s=c.has(3),c.clear(),ct}function f(M){const y=[];if(M.shaderID?y.push(M.shaderID):(y.push(M.customVertexShaderID),y.push(M.customFragmentShaderID)),M.defines!==void 0)for(const D in M.defines)y.push(D),y.push(M.defines[D]);return M.isRawShaderMaterial===!1&&(E(y,M),T(y,M),y.push(i.outputColorSpace)),y.push(M.customProgramCacheKey),y.join()}function E(M,y){M.push(y.precision),M.push(y.outputColorSpace),M.push(y.envMapMode),M.push(y.envMapCubeUVHeight),M.push(y.mapUv),M.push(y.alphaMapUv),M.push(y.lightMapUv),M.push(y.aoMapUv),M.push(y.bumpMapUv),M.push(y.normalMapUv),M.push(y.displacementMapUv),M.push(y.emissiveMapUv),M.push(y.metalnessMapUv),M.push(y.roughnessMapUv),M.push(y.anisotropyMapUv),M.push(y.clearcoatMapUv),M.push(y.clearcoatNormalMapUv),M.push(y.clearcoatRoughnessMapUv),M.push(y.iridescenceMapUv),M.push(y.iridescenceThicknessMapUv),M.push(y.sheenColorMapUv),M.push(y.sheenRoughnessMapUv),M.push(y.specularMapUv),M.push(y.specularColorMapUv),M.push(y.specularIntensityMapUv),M.push(y.transmissionMapUv),M.push(y.thicknessMapUv),M.push(y.combine),M.push(y.fogExp2),M.push(y.sizeAttenuation),M.push(y.morphTargetsCount),M.push(y.morphAttributeCount),M.push(y.numDirLights),M.push(y.numPointLights),M.push(y.numSpotLights),M.push(y.numSpotLightMaps),M.push(y.numHemiLights),M.push(y.numRectAreaLights),M.push(y.numDirLightShadows),M.push(y.numPointLightShadows),M.push(y.numSpotLightShadows),M.push(y.numSpotLightShadowsWithMaps),M.push(y.numLightProbes),M.push(y.shadowMapType),M.push(y.toneMapping),M.push(y.numClippingPlanes),M.push(y.numClipIntersection),M.push(y.depthPacking)}function T(M,y){o.disableAll(),y.supportsVertexTextures&&o.enable(0),y.instancing&&o.enable(1),y.instancingColor&&o.enable(2),y.instancingMorph&&o.enable(3),y.matcap&&o.enable(4),y.envMap&&o.enable(5),y.normalMapObjectSpace&&o.enable(6),y.normalMapTangentSpace&&o.enable(7),y.clearcoat&&o.enable(8),y.iridescence&&o.enable(9),y.alphaTest&&o.enable(10),y.vertexColors&&o.enable(11),y.vertexAlphas&&o.enable(12),y.vertexUv1s&&o.enable(13),y.vertexUv2s&&o.enable(14),y.vertexUv3s&&o.enable(15),y.vertexTangents&&o.enable(16),y.anisotropy&&o.enable(17),y.alphaHash&&o.enable(18),y.batching&&o.enable(19),y.dispersion&&o.enable(20),y.batchingColor&&o.enable(21),y.gradientMap&&o.enable(22),M.push(o.mask),o.disableAll(),y.fog&&o.enable(0),y.useFog&&o.enable(1),y.flatShading&&o.enable(2),y.logarithmicDepthBuffer&&o.enable(3),y.reversedDepthBuffer&&o.enable(4),y.skinning&&o.enable(5),y.morphTargets&&o.enable(6),y.morphNormals&&o.enable(7),y.morphColors&&o.enable(8),y.premultipliedAlpha&&o.enable(9),y.shadowMapEnabled&&o.enable(10),y.doubleSided&&o.enable(11),y.flipSided&&o.enable(12),y.useDepthPacking&&o.enable(13),y.dithering&&o.enable(14),y.transmission&&o.enable(15),y.sheen&&o.enable(16),y.opaque&&o.enable(17),y.pointsUvs&&o.enable(18),y.decodeVideoTexture&&o.enable(19),y.decodeVideoTextureEmissive&&o.enable(20),y.alphaToCoverage&&o.enable(21),M.push(o.mask)}function w(M){const y=x[M.type];let D;if(y){const O=xn[y];D=uh.clone(O.uniforms)}else D=M.uniforms;return D}function L(M,y){let D;for(let O=0,V=d.length;O<V;O++){const X=d[O];if(X.cacheKey===y){D=X,++D.usedTimes;break}}return D===void 0&&(D=new Km(i,y,M,r),d.push(D)),D}function b(M){if(--M.usedTimes===0){const y=d.indexOf(M);d[y]=d[d.length-1],d.pop(),M.destroy()}}function R(M){l.remove(M)}function B(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:w,acquireProgram:L,releaseProgram:b,releaseShaderCache:R,programs:d,dispose:B}}function Zm(){let i=new WeakMap;function e(s){return i.has(s)}function t(s){let o=i.get(s);return o===void 0&&(o={},i.set(s,o)),o}function n(s){i.delete(s)}function a(s,o,l){i.get(s)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:a,dispose:r}}function Jm(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function Rl(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Pl(){const i=[];let e=0;const t=[],n=[],a=[];function r(){e=0,t.length=0,n.length=0,a.length=0}function s(h,u,p,x,_,m){let f=i[e];return f===void 0?(f={id:h.id,object:h,geometry:u,material:p,groupOrder:x,renderOrder:h.renderOrder,z:_,group:m},i[e]=f):(f.id=h.id,f.object=h,f.geometry=u,f.material=p,f.groupOrder=x,f.renderOrder=h.renderOrder,f.z=_,f.group=m),e++,f}function o(h,u,p,x,_,m){const f=s(h,u,p,x,_,m);p.transmission>0?n.push(f):p.transparent===!0?a.push(f):t.push(f)}function l(h,u,p,x,_,m){const f=s(h,u,p,x,_,m);p.transmission>0?n.unshift(f):p.transparent===!0?a.unshift(f):t.unshift(f)}function c(h,u){t.length>1&&t.sort(h||Jm),n.length>1&&n.sort(u||Rl),a.length>1&&a.sort(u||Rl)}function d(){for(let h=e,u=i.length;h<u;h++){const p=i[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:a,init:r,push:o,unshift:l,finish:d,sort:c}}function Qm(){let i=new WeakMap;function e(n,a){const r=i.get(n);let s;return r===void 0?(s=new Pl,i.set(n,[s])):a>=r.length?(s=new Pl,r.push(s)):s=r[a],s}function t(){i=new WeakMap}return{get:e,dispose:t}}function e0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new C,color:new Xe};break;case"SpotLight":t={position:new C,direction:new C,color:new Xe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new C,color:new Xe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new C,skyColor:new Xe,groundColor:new Xe};break;case"RectAreaLight":t={color:new Xe,position:new C,halfWidth:new C,halfHeight:new C};break}return i[e.id]=t,t}}}function t0(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let n0=0;function i0(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function a0(i){const e=new e0,t=t0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new C);const a=new C,r=new st,s=new st;function o(c){let d=0,h=0,u=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let p=0,x=0,_=0,m=0,f=0,E=0,T=0,w=0,L=0,b=0,R=0;c.sort(i0);for(let M=0,y=c.length;M<y;M++){const D=c[M],O=D.color,V=D.intensity,X=D.distance,H=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)d+=O.r*V,h+=O.g*V,u+=O.b*V;else if(D.isLightProbe){for(let Y=0;Y<9;Y++)n.probe[Y].addScaledVector(D.sh.coefficients[Y],V);R++}else if(D.isDirectionalLight){const Y=e.get(D);if(Y.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const Q=D.shadow,W=t.get(D);W.shadowIntensity=Q.intensity,W.shadowBias=Q.bias,W.shadowNormalBias=Q.normalBias,W.shadowRadius=Q.radius,W.shadowMapSize=Q.mapSize,n.directionalShadow[p]=W,n.directionalShadowMap[p]=H,n.directionalShadowMatrix[p]=D.shadow.matrix,E++}n.directional[p]=Y,p++}else if(D.isSpotLight){const Y=e.get(D);Y.position.setFromMatrixPosition(D.matrixWorld),Y.color.copy(O).multiplyScalar(V),Y.distance=X,Y.coneCos=Math.cos(D.angle),Y.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),Y.decay=D.decay,n.spot[_]=Y;const Q=D.shadow;if(D.map&&(n.spotLightMap[L]=D.map,L++,Q.updateMatrices(D),D.castShadow&&b++),n.spotLightMatrix[_]=Q.matrix,D.castShadow){const W=t.get(D);W.shadowIntensity=Q.intensity,W.shadowBias=Q.bias,W.shadowNormalBias=Q.normalBias,W.shadowRadius=Q.radius,W.shadowMapSize=Q.mapSize,n.spotShadow[_]=W,n.spotShadowMap[_]=H,w++}_++}else if(D.isRectAreaLight){const Y=e.get(D);Y.color.copy(O).multiplyScalar(V),Y.halfWidth.set(D.width*.5,0,0),Y.halfHeight.set(0,D.height*.5,0),n.rectArea[m]=Y,m++}else if(D.isPointLight){const Y=e.get(D);if(Y.color.copy(D.color).multiplyScalar(D.intensity),Y.distance=D.distance,Y.decay=D.decay,D.castShadow){const Q=D.shadow,W=t.get(D);W.shadowIntensity=Q.intensity,W.shadowBias=Q.bias,W.shadowNormalBias=Q.normalBias,W.shadowRadius=Q.radius,W.shadowMapSize=Q.mapSize,W.shadowCameraNear=Q.camera.near,W.shadowCameraFar=Q.camera.far,n.pointShadow[x]=W,n.pointShadowMap[x]=H,n.pointShadowMatrix[x]=D.shadow.matrix,T++}n.point[x]=Y,x++}else if(D.isHemisphereLight){const Y=e.get(D);Y.skyColor.copy(D.color).multiplyScalar(V),Y.groundColor.copy(D.groundColor).multiplyScalar(V),n.hemi[f]=Y,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ce.LTC_FLOAT_1,n.rectAreaLTC2=ce.LTC_FLOAT_2):(n.rectAreaLTC1=ce.LTC_HALF_1,n.rectAreaLTC2=ce.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=h,n.ambient[2]=u;const B=n.hash;(B.directionalLength!==p||B.pointLength!==x||B.spotLength!==_||B.rectAreaLength!==m||B.hemiLength!==f||B.numDirectionalShadows!==E||B.numPointShadows!==T||B.numSpotShadows!==w||B.numSpotMaps!==L||B.numLightProbes!==R)&&(n.directional.length=p,n.spot.length=_,n.rectArea.length=m,n.point.length=x,n.hemi.length=f,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=T,n.pointShadowMap.length=T,n.spotShadow.length=w,n.spotShadowMap.length=w,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=T,n.spotLightMatrix.length=w+L-b,n.spotLightMap.length=L,n.numSpotLightShadowsWithMaps=b,n.numLightProbes=R,B.directionalLength=p,B.pointLength=x,B.spotLength=_,B.rectAreaLength=m,B.hemiLength=f,B.numDirectionalShadows=E,B.numPointShadows=T,B.numSpotShadows=w,B.numSpotMaps=L,B.numLightProbes=R,n.version=n0++)}function l(c,d){let h=0,u=0,p=0,x=0,_=0;const m=d.matrixWorldInverse;for(let f=0,E=c.length;f<E;f++){const T=c[f];if(T.isDirectionalLight){const w=n.directional[h];w.direction.setFromMatrixPosition(T.matrixWorld),a.setFromMatrixPosition(T.target.matrixWorld),w.direction.sub(a),w.direction.transformDirection(m),h++}else if(T.isSpotLight){const w=n.spot[p];w.position.setFromMatrixPosition(T.matrixWorld),w.position.applyMatrix4(m),w.direction.setFromMatrixPosition(T.matrixWorld),a.setFromMatrixPosition(T.target.matrixWorld),w.direction.sub(a),w.direction.transformDirection(m),p++}else if(T.isRectAreaLight){const w=n.rectArea[x];w.position.setFromMatrixPosition(T.matrixWorld),w.position.applyMatrix4(m),s.identity(),r.copy(T.matrixWorld),r.premultiply(m),s.extractRotation(r),w.halfWidth.set(T.width*.5,0,0),w.halfHeight.set(0,T.height*.5,0),w.halfWidth.applyMatrix4(s),w.halfHeight.applyMatrix4(s),x++}else if(T.isPointLight){const w=n.point[u];w.position.setFromMatrixPosition(T.matrixWorld),w.position.applyMatrix4(m),u++}else if(T.isHemisphereLight){const w=n.hemi[_];w.direction.setFromMatrixPosition(T.matrixWorld),w.direction.transformDirection(m),_++}}}return{setup:o,setupView:l,state:n}}function Ll(i){const e=new a0(i),t=[],n=[];function a(d){c.camera=d,t.length=0,n.length=0}function r(d){t.push(d)}function s(d){n.push(d)}function o(){e.setup(t)}function l(d){e.setupView(t,d)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:a,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:s}}function r0(i){let e=new WeakMap;function t(a,r=0){const s=e.get(a);let o;return s===void 0?(o=new Ll(i),e.set(a,[o])):r>=s.length?(o=new Ll(i),s.push(o)):o=s[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const s0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,o0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function l0(i,e,t){let n=new lo;const a=new Ue,r=new Ue,s=new xt,o=new wh({depthPacking:Md}),l=new Ah,c={},d=t.maxTextureSize,h={[Jn]:Xt,[Xt]:Jn,[Pn]:Pn},u=new kn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ue},radius:{value:4}},vertexShader:s0,fragmentShader:o0}),p=u.clone();p.defines.HORIZONTAL_PASS=1;const x=new sn;x.setAttribute("position",new rn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const _=new Et(x,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Xl;let f=this.type;this.render=function(b,R,B){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||b.length===0)return;const M=i.getRenderTarget(),y=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),O=i.state;O.setBlending(Un),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const V=f!==Cn&&this.type===Cn,X=f===Cn&&this.type!==Cn;for(let H=0,Y=b.length;H<Y;H++){const Q=b[H],W=Q.shadow;if(W===void 0){Ie("WebGLShadowMap:",Q,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;a.copy(W.mapSize);const ne=W.getFrameExtents();if(a.multiply(ne),r.copy(W.mapSize),(a.x>d||a.y>d)&&(a.x>d&&(r.x=Math.floor(d/ne.x),a.x=r.x*ne.x,W.mapSize.x=r.x),a.y>d&&(r.y=Math.floor(d/ne.y),a.y=r.y*ne.y,W.mapSize.y=r.y)),W.map===null||V===!0||X===!0){const Me=this.type!==Cn?{minFilter:Zt,magFilter:Zt}:{};W.map!==null&&W.map.dispose(),W.map=new fi(a.x,a.y,Me),W.map.texture.name=Q.name+".shadowMap",W.camera.updateProjectionMatrix()}i.setRenderTarget(W.map),i.clear();const re=W.getViewportCount();for(let Me=0;Me<re;Me++){const Ge=W.getViewport(Me);s.set(r.x*Ge.x,r.y*Ge.y,r.x*Ge.z,r.y*Ge.w),O.viewport(s),W.updateMatrices(Q,Me),n=W.getFrustum(),w(R,B,W.camera,Q,this.type)}W.isPointLightShadow!==!0&&this.type===Cn&&E(W,B),W.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(M,y,D)};function E(b,R){const B=e.update(_);u.defines.VSM_SAMPLES!==b.blurSamples&&(u.defines.VSM_SAMPLES=b.blurSamples,p.defines.VSM_SAMPLES=b.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0),b.mapPass===null&&(b.mapPass=new fi(a.x,a.y)),u.uniforms.shadow_pass.value=b.map.texture,u.uniforms.resolution.value=b.mapSize,u.uniforms.radius.value=b.radius,i.setRenderTarget(b.mapPass),i.clear(),i.renderBufferDirect(R,null,B,u,_,null),p.uniforms.shadow_pass.value=b.mapPass.texture,p.uniforms.resolution.value=b.mapSize,p.uniforms.radius.value=b.radius,i.setRenderTarget(b.map),i.clear(),i.renderBufferDirect(R,null,B,p,_,null)}function T(b,R,B,M){let y=null;const D=B.isPointLight===!0?b.customDistanceMaterial:b.customDepthMaterial;if(D!==void 0)y=D;else if(y=B.isPointLight===!0?l:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const O=y.uuid,V=R.uuid;let X=c[O];X===void 0&&(X={},c[O]=X);let H=X[V];H===void 0&&(H=y.clone(),X[V]=H,R.addEventListener("dispose",L)),y=H}if(y.visible=R.visible,y.wireframe=R.wireframe,M===Cn?y.side=R.shadowSide!==null?R.shadowSide:R.side:y.side=R.shadowSide!==null?R.shadowSide:h[R.side],y.alphaMap=R.alphaMap,y.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,y.map=R.map,y.clipShadows=R.clipShadows,y.clippingPlanes=R.clippingPlanes,y.clipIntersection=R.clipIntersection,y.displacementMap=R.displacementMap,y.displacementScale=R.displacementScale,y.displacementBias=R.displacementBias,y.wireframeLinewidth=R.wireframeLinewidth,y.linewidth=R.linewidth,B.isPointLight===!0&&y.isMeshDistanceMaterial===!0){const O=i.properties.get(y);O.light=B}return y}function w(b,R,B,M,y){if(b.visible===!1)return;if(b.layers.test(R.layers)&&(b.isMesh||b.isLine||b.isPoints)&&(b.castShadow||b.receiveShadow&&y===Cn)&&(!b.frustumCulled||n.intersectsObject(b))){b.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,b.matrixWorld);const V=e.update(b),X=b.material;if(Array.isArray(X)){const H=V.groups;for(let Y=0,Q=H.length;Y<Q;Y++){const W=H[Y],ne=X[W.materialIndex];if(ne&&ne.visible){const re=T(b,ne,M,y);b.onBeforeShadow(i,b,R,B,V,re,W),i.renderBufferDirect(B,null,V,re,b,W),b.onAfterShadow(i,b,R,B,V,re,W)}}}else if(X.visible){const H=T(b,X,M,y);b.onBeforeShadow(i,b,R,B,V,H,null),i.renderBufferDirect(B,null,V,H,b,null),b.onAfterShadow(i,b,R,B,V,H,null)}}const O=b.children;for(let V=0,X=O.length;V<X;V++)w(O[V],R,B,M,y)}function L(b){b.target.removeEventListener("dispose",L);for(const B in c){const M=c[B],y=b.target.uuid;y in M&&(M[y].dispose(),delete M[y])}}}const c0={[rs]:ss,[os]:ds,[ls]:hs,[zi]:cs,[ss]:rs,[ds]:os,[hs]:ls,[cs]:zi};function d0(i,e){function t(){let P=!1;const de=new xt;let oe=null;const le=new xt(0,0,0,0);return{setMask:function(ee){oe!==ee&&!P&&(i.colorMask(ee,ee,ee,ee),oe=ee)},setLocked:function(ee){P=ee},setClear:function(ee,$,_e,Ne,ct){ct===!0&&(ee*=Ne,$*=Ne,_e*=Ne),de.set(ee,$,_e,Ne),le.equals(de)===!1&&(i.clearColor(ee,$,_e,Ne),le.copy(de))},reset:function(){P=!1,oe=null,le.set(-1,0,0,0)}}}function n(){let P=!1,de=!1,oe=null,le=null,ee=null;return{setReversed:function($){if(de!==$){const _e=e.get("EXT_clip_control");$?_e.clipControlEXT(_e.LOWER_LEFT_EXT,_e.ZERO_TO_ONE_EXT):_e.clipControlEXT(_e.LOWER_LEFT_EXT,_e.NEGATIVE_ONE_TO_ONE_EXT),de=$;const Ne=ee;ee=null,this.setClear(Ne)}},getReversed:function(){return de},setTest:function($){$?Z(i.DEPTH_TEST):me(i.DEPTH_TEST)},setMask:function($){oe!==$&&!P&&(i.depthMask($),oe=$)},setFunc:function($){if(de&&($=c0[$]),le!==$){switch($){case rs:i.depthFunc(i.NEVER);break;case ss:i.depthFunc(i.ALWAYS);break;case os:i.depthFunc(i.LESS);break;case zi:i.depthFunc(i.LEQUAL);break;case ls:i.depthFunc(i.EQUAL);break;case cs:i.depthFunc(i.GEQUAL);break;case ds:i.depthFunc(i.GREATER);break;case hs:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}le=$}},setLocked:function($){P=$},setClear:function($){ee!==$&&(de&&($=1-$),i.clearDepth($),ee=$)},reset:function(){P=!1,oe=null,le=null,ee=null,de=!1}}}function a(){let P=!1,de=null,oe=null,le=null,ee=null,$=null,_e=null,Ne=null,ct=null;return{setTest:function(nt){P||(nt?Z(i.STENCIL_TEST):me(i.STENCIL_TEST))},setMask:function(nt){de!==nt&&!P&&(i.stencilMask(nt),de=nt)},setFunc:function(nt,pn,on){(oe!==nt||le!==pn||ee!==on)&&(i.stencilFunc(nt,pn,on),oe=nt,le=pn,ee=on)},setOp:function(nt,pn,on){($!==nt||_e!==pn||Ne!==on)&&(i.stencilOp(nt,pn,on),$=nt,_e=pn,Ne=on)},setLocked:function(nt){P=nt},setClear:function(nt){ct!==nt&&(i.clearStencil(nt),ct=nt)},reset:function(){P=!1,de=null,oe=null,le=null,ee=null,$=null,_e=null,Ne=null,ct=null}}}const r=new t,s=new n,o=new a,l=new WeakMap,c=new WeakMap;let d={},h={},u=new WeakMap,p=[],x=null,_=!1,m=null,f=null,E=null,T=null,w=null,L=null,b=null,R=new Xe(0,0,0),B=0,M=!1,y=null,D=null,O=null,V=null,X=null;const H=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,Q=0;const W=i.getParameter(i.VERSION);W.indexOf("WebGL")!==-1?(Q=parseFloat(/^WebGL (\d)/.exec(W)[1]),Y=Q>=1):W.indexOf("OpenGL ES")!==-1&&(Q=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),Y=Q>=2);let ne=null,re={};const Me=i.getParameter(i.SCISSOR_BOX),Ge=i.getParameter(i.VIEWPORT),qe=new xt().fromArray(Me),et=new xt().fromArray(Ge);function tt(P,de,oe,le){const ee=new Uint8Array(4),$=i.createTexture();i.bindTexture(P,$),i.texParameteri(P,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(P,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let _e=0;_e<oe;_e++)P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY?i.texImage3D(de,0,i.RGBA,1,1,le,0,i.RGBA,i.UNSIGNED_BYTE,ee):i.texImage2D(de+_e,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ee);return $}const K={};K[i.TEXTURE_2D]=tt(i.TEXTURE_2D,i.TEXTURE_2D,1),K[i.TEXTURE_CUBE_MAP]=tt(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),K[i.TEXTURE_2D_ARRAY]=tt(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),K[i.TEXTURE_3D]=tt(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),s.setClear(1),o.setClear(0),Z(i.DEPTH_TEST),s.setFunc(zi),ke(!1),He(Ro),Z(i.CULL_FACE),ot(Un);function Z(P){d[P]!==!0&&(i.enable(P),d[P]=!0)}function me(P){d[P]!==!1&&(i.disable(P),d[P]=!1)}function Le(P,de){return h[P]!==de?(i.bindFramebuffer(P,de),h[P]=de,P===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=de),P===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=de),!0):!1}function ye(P,de){let oe=p,le=!1;if(P){oe=u.get(de),oe===void 0&&(oe=[],u.set(de,oe));const ee=P.textures;if(oe.length!==ee.length||oe[0]!==i.COLOR_ATTACHMENT0){for(let $=0,_e=ee.length;$<_e;$++)oe[$]=i.COLOR_ATTACHMENT0+$;oe.length=ee.length,le=!0}}else oe[0]!==i.BACK&&(oe[0]=i.BACK,le=!0);le&&i.drawBuffers(oe)}function Ve(P){return x!==P?(i.useProgram(P),x=P,!0):!1}const Ze={[li]:i.FUNC_ADD,[Yc]:i.FUNC_SUBTRACT,[jc]:i.FUNC_REVERSE_SUBTRACT};Ze[$c]=i.MIN,Ze[Zc]=i.MAX;const Fe={[Jc]:i.ZERO,[Qc]:i.ONE,[ed]:i.SRC_COLOR,[is]:i.SRC_ALPHA,[sd]:i.SRC_ALPHA_SATURATE,[ad]:i.DST_COLOR,[nd]:i.DST_ALPHA,[td]:i.ONE_MINUS_SRC_COLOR,[as]:i.ONE_MINUS_SRC_ALPHA,[rd]:i.ONE_MINUS_DST_COLOR,[id]:i.ONE_MINUS_DST_ALPHA,[od]:i.CONSTANT_COLOR,[ld]:i.ONE_MINUS_CONSTANT_COLOR,[cd]:i.CONSTANT_ALPHA,[dd]:i.ONE_MINUS_CONSTANT_ALPHA};function ot(P,de,oe,le,ee,$,_e,Ne,ct,nt){if(P===Un){_===!0&&(me(i.BLEND),_=!1);return}if(_===!1&&(Z(i.BLEND),_=!0),P!==qc){if(P!==m||nt!==M){if((f!==li||w!==li)&&(i.blendEquation(i.FUNC_ADD),f=li,w=li),nt)switch(P){case Bi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Po:i.blendFunc(i.ONE,i.ONE);break;case Lo:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Do:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:gt("WebGLState: Invalid blending: ",P);break}else switch(P){case Bi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Po:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Lo:gt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Do:gt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:gt("WebGLState: Invalid blending: ",P);break}E=null,T=null,L=null,b=null,R.set(0,0,0),B=0,m=P,M=nt}return}ee=ee||de,$=$||oe,_e=_e||le,(de!==f||ee!==w)&&(i.blendEquationSeparate(Ze[de],Ze[ee]),f=de,w=ee),(oe!==E||le!==T||$!==L||_e!==b)&&(i.blendFuncSeparate(Fe[oe],Fe[le],Fe[$],Fe[_e]),E=oe,T=le,L=$,b=_e),(Ne.equals(R)===!1||ct!==B)&&(i.blendColor(Ne.r,Ne.g,Ne.b,ct),R.copy(Ne),B=ct),m=P,M=!1}function A(P,de){P.side===Pn?me(i.CULL_FACE):Z(i.CULL_FACE);let oe=P.side===Xt;de&&(oe=!oe),ke(oe),P.blending===Bi&&P.transparent===!1?ot(Un):ot(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),s.setFunc(P.depthFunc),s.setTest(P.depthTest),s.setMask(P.depthWrite),r.setMask(P.colorWrite);const le=P.stencilWrite;o.setTest(le),le&&(o.setMask(P.stencilWriteMask),o.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),o.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),pe(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?Z(i.SAMPLE_ALPHA_TO_COVERAGE):me(i.SAMPLE_ALPHA_TO_COVERAGE)}function ke(P){y!==P&&(P?i.frontFace(i.CW):i.frontFace(i.CCW),y=P)}function He(P){P!==Wc?(Z(i.CULL_FACE),P!==D&&(P===Ro?i.cullFace(i.BACK):P===Xc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):me(i.CULL_FACE),D=P}function Qe(P){P!==O&&(Y&&i.lineWidth(P),O=P)}function pe(P,de,oe){P?(Z(i.POLYGON_OFFSET_FILL),(V!==de||X!==oe)&&(i.polygonOffset(de,oe),V=de,X=oe)):me(i.POLYGON_OFFSET_FILL)}function Je(P){P?Z(i.SCISSOR_TEST):me(i.SCISSOR_TEST)}function be(P){P===void 0&&(P=i.TEXTURE0+H-1),ne!==P&&(i.activeTexture(P),ne=P)}function De(P,de,oe){oe===void 0&&(ne===null?oe=i.TEXTURE0+H-1:oe=ne);let le=re[oe];le===void 0&&(le={type:void 0,texture:void 0},re[oe]=le),(le.type!==P||le.texture!==de)&&(ne!==oe&&(i.activeTexture(oe),ne=oe),i.bindTexture(P,de||K[P]),le.type=P,le.texture=de)}function S(){const P=re[ne];P!==void 0&&P.type!==void 0&&(i.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function g(){try{i.compressedTexImage2D(...arguments)}catch(P){P("WebGLState:",P)}}function k(){try{i.compressedTexImage3D(...arguments)}catch(P){P("WebGLState:",P)}}function q(){try{i.texSubImage2D(...arguments)}catch(P){P("WebGLState:",P)}}function U(){try{i.texSubImage3D(...arguments)}catch(P){P("WebGLState:",P)}}function I(){try{i.compressedTexSubImage2D(...arguments)}catch(P){P("WebGLState:",P)}}function te(){try{i.compressedTexSubImage3D(...arguments)}catch(P){P("WebGLState:",P)}}function J(){try{i.texStorage2D(...arguments)}catch(P){P("WebGLState:",P)}}function ue(){try{i.texStorage3D(...arguments)}catch(P){P("WebGLState:",P)}}function se(){try{i.texImage2D(...arguments)}catch(P){P("WebGLState:",P)}}function j(){try{i.texImage3D(...arguments)}catch(P){P("WebGLState:",P)}}function ie(P){qe.equals(P)===!1&&(i.scissor(P.x,P.y,P.z,P.w),qe.copy(P))}function Ee(P){et.equals(P)===!1&&(i.viewport(P.x,P.y,P.z,P.w),et.copy(P))}function Se(P,de){let oe=c.get(de);oe===void 0&&(oe=new WeakMap,c.set(de,oe));let le=oe.get(P);le===void 0&&(le=i.getUniformBlockIndex(de,P.name),oe.set(P,le))}function he(P,de){const le=c.get(de).get(P);l.get(de)!==le&&(i.uniformBlockBinding(de,le,P.__bindingPointIndex),l.set(de,le))}function Ce(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),s.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},ne=null,re={},h={},u=new WeakMap,p=[],x=null,_=!1,m=null,f=null,E=null,T=null,w=null,L=null,b=null,R=new Xe(0,0,0),B=0,M=!1,y=null,D=null,O=null,V=null,X=null,qe.set(0,0,i.canvas.width,i.canvas.height),et.set(0,0,i.canvas.width,i.canvas.height),r.reset(),s.reset(),o.reset()}return{buffers:{color:r,depth:s,stencil:o},enable:Z,disable:me,bindFramebuffer:Le,drawBuffers:ye,useProgram:Ve,setBlending:ot,setMaterial:A,setFlipSided:ke,setCullFace:He,setLineWidth:Qe,setPolygonOffset:pe,setScissorTest:Je,activeTexture:be,bindTexture:De,unbindTexture:S,compressedTexImage2D:g,compressedTexImage3D:k,texImage2D:se,texImage3D:j,updateUBOMapping:Se,uniformBlockBinding:he,texStorage2D:J,texStorage3D:ue,texSubImage2D:q,texSubImage3D:U,compressedTexSubImage2D:I,compressedTexSubImage3D:te,scissor:ie,viewport:Ee,reset:Ce}}function h0(i,e,t,n,a,r,s){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ue,d=new WeakMap;let h;const u=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function x(S,g){return p?new OffscreenCanvas(S,g):sr("canvas")}function _(S,g,k){let q=1;const U=De(S);if((U.width>k||U.height>k)&&(q=k/Math.max(U.width,U.height)),q<1)if(typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&S instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&S instanceof ImageBitmap||typeof VideoFrame<"u"&&S instanceof VideoFrame){const I=Math.floor(q*U.width),te=Math.floor(q*U.height);h===void 0&&(h=x(I,te));const J=g?x(I,te):h;return J.width=I,J.height=te,J.getContext("2d").drawImage(S,0,0,I,te),Ie("WebGLRenderer: Texture has been resized from ("+U.width+"x"+U.height+") to ("+I+"x"+te+")."),J}else return"data"in S&&Ie("WebGLRenderer: Image in DataTexture is too big ("+U.width+"x"+U.height+")."),S;return S}function m(S){return S.generateMipmaps}function f(S){i.generateMipmap(S)}function E(S){return S.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:S.isWebGL3DRenderTarget?i.TEXTURE_3D:S.isWebGLArrayRenderTarget||S.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function T(S,g,k,q,U=!1){if(S!==null){if(i[S]!==void 0)return i[S];Ie("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+S+"'")}let I=g;if(g===i.RED&&(k===i.FLOAT&&(I=i.R32F),k===i.HALF_FLOAT&&(I=i.R16F),k===i.UNSIGNED_BYTE&&(I=i.R8)),g===i.RED_INTEGER&&(k===i.UNSIGNED_BYTE&&(I=i.R8UI),k===i.UNSIGNED_SHORT&&(I=i.R16UI),k===i.UNSIGNED_INT&&(I=i.R32UI),k===i.BYTE&&(I=i.R8I),k===i.SHORT&&(I=i.R16I),k===i.INT&&(I=i.R32I)),g===i.RG&&(k===i.FLOAT&&(I=i.RG32F),k===i.HALF_FLOAT&&(I=i.RG16F),k===i.UNSIGNED_BYTE&&(I=i.RG8)),g===i.RG_INTEGER&&(k===i.UNSIGNED_BYTE&&(I=i.RG8UI),k===i.UNSIGNED_SHORT&&(I=i.RG16UI),k===i.UNSIGNED_INT&&(I=i.RG32UI),k===i.BYTE&&(I=i.RG8I),k===i.SHORT&&(I=i.RG16I),k===i.INT&&(I=i.RG32I)),g===i.RGB_INTEGER&&(k===i.UNSIGNED_BYTE&&(I=i.RGB8UI),k===i.UNSIGNED_SHORT&&(I=i.RGB16UI),k===i.UNSIGNED_INT&&(I=i.RGB32UI),k===i.BYTE&&(I=i.RGB8I),k===i.SHORT&&(I=i.RGB16I),k===i.INT&&(I=i.RGB32I)),g===i.RGBA_INTEGER&&(k===i.UNSIGNED_BYTE&&(I=i.RGBA8UI),k===i.UNSIGNED_SHORT&&(I=i.RGBA16UI),k===i.UNSIGNED_INT&&(I=i.RGBA32UI),k===i.BYTE&&(I=i.RGBA8I),k===i.SHORT&&(I=i.RGBA16I),k===i.INT&&(I=i.RGBA32I)),g===i.RGB&&(k===i.UNSIGNED_INT_5_9_9_9_REV&&(I=i.RGB9_E5),k===i.UNSIGNED_INT_10F_11F_11F_REV&&(I=i.R11F_G11F_B10F)),g===i.RGBA){const te=U?ir:je.getTransfer(q);k===i.FLOAT&&(I=i.RGBA32F),k===i.HALF_FLOAT&&(I=i.RGBA16F),k===i.UNSIGNED_BYTE&&(I=te===at?i.SRGB8_ALPHA8:i.RGBA8),k===i.UNSIGNED_SHORT_4_4_4_4&&(I=i.RGBA4),k===i.UNSIGNED_SHORT_5_5_5_1&&(I=i.RGB5_A1)}return(I===i.R16F||I===i.R32F||I===i.RG16F||I===i.RG32F||I===i.RGBA16F||I===i.RGBA32F)&&e.get("EXT_color_buffer_float"),I}function w(S,g){let k;return S?g===null||g===ui||g===pa?k=i.DEPTH24_STENCIL8:g===gn?k=i.DEPTH32F_STENCIL8:g===fa&&(k=i.DEPTH24_STENCIL8,Ie("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):g===null||g===ui||g===pa?k=i.DEPTH_COMPONENT24:g===gn?k=i.DEPTH_COMPONENT32F:g===fa&&(k=i.DEPTH_COMPONENT16),k}function L(S,g){return m(S)===!0||S.isFramebufferTexture&&S.minFilter!==Zt&&S.minFilter!==an?Math.log2(Math.max(g.width,g.height))+1:S.mipmaps!==void 0&&S.mipmaps.length>0?S.mipmaps.length:S.isCompressedTexture&&Array.isArray(S.image)?g.mipmaps.length:1}function b(S){const g=S.target;g.removeEventListener("dispose",b),B(g),g.isVideoTexture&&d.delete(g)}function R(S){const g=S.target;g.removeEventListener("dispose",R),y(g)}function B(S){const g=n.get(S);if(g.__webglInit===void 0)return;const k=S.source,q=u.get(k);if(q){const U=q[g.__cacheKey];U.usedTimes--,U.usedTimes===0&&M(S),Object.keys(q).length===0&&u.delete(k)}n.remove(S)}function M(S){const g=n.get(S);i.deleteTexture(g.__webglTexture);const k=S.source,q=u.get(k);delete q[g.__cacheKey],s.memory.textures--}function y(S){const g=n.get(S);if(S.depthTexture&&(S.depthTexture.dispose(),n.remove(S.depthTexture)),S.isWebGLCubeRenderTarget)for(let q=0;q<6;q++){if(Array.isArray(g.__webglFramebuffer[q]))for(let U=0;U<g.__webglFramebuffer[q].length;U++)i.deleteFramebuffer(g.__webglFramebuffer[q][U]);else i.deleteFramebuffer(g.__webglFramebuffer[q]);g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer[q])}else{if(Array.isArray(g.__webglFramebuffer))for(let q=0;q<g.__webglFramebuffer.length;q++)i.deleteFramebuffer(g.__webglFramebuffer[q]);else i.deleteFramebuffer(g.__webglFramebuffer);if(g.__webglDepthbuffer&&i.deleteRenderbuffer(g.__webglDepthbuffer),g.__webglMultisampledFramebuffer&&i.deleteFramebuffer(g.__webglMultisampledFramebuffer),g.__webglColorRenderbuffer)for(let q=0;q<g.__webglColorRenderbuffer.length;q++)g.__webglColorRenderbuffer[q]&&i.deleteRenderbuffer(g.__webglColorRenderbuffer[q]);g.__webglDepthRenderbuffer&&i.deleteRenderbuffer(g.__webglDepthRenderbuffer)}const k=S.textures;for(let q=0,U=k.length;q<U;q++){const I=n.get(k[q]);I.__webglTexture&&(i.deleteTexture(I.__webglTexture),s.memory.textures--),n.remove(k[q])}n.remove(S)}let D=0;function O(){D=0}function V(){const S=D;return S>=a.maxTextures&&Ie("WebGLTextures: Trying to use "+S+" texture units while this GPU supports only "+a.maxTextures),D+=1,S}function X(S){const g=[];return g.push(S.wrapS),g.push(S.wrapT),g.push(S.wrapR||0),g.push(S.magFilter),g.push(S.minFilter),g.push(S.anisotropy),g.push(S.internalFormat),g.push(S.format),g.push(S.type),g.push(S.generateMipmaps),g.push(S.premultiplyAlpha),g.push(S.flipY),g.push(S.unpackAlignment),g.push(S.colorSpace),g.join()}function H(S,g){const k=n.get(S);if(S.isVideoTexture&&Je(S),S.isRenderTargetTexture===!1&&S.isExternalTexture!==!0&&S.version>0&&k.__version!==S.version){const q=S.image;if(q===null)Ie("WebGLRenderer: Texture marked for update but no image data found.");else if(q.complete===!1)Ie("WebGLRenderer: Texture marked for update but image is incomplete");else{K(k,S,g);return}}else S.isExternalTexture&&(k.__webglTexture=S.sourceTexture?S.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,k.__webglTexture,i.TEXTURE0+g)}function Y(S,g){const k=n.get(S);if(S.isRenderTargetTexture===!1&&S.version>0&&k.__version!==S.version){K(k,S,g);return}else S.isExternalTexture&&(k.__webglTexture=S.sourceTexture?S.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,k.__webglTexture,i.TEXTURE0+g)}function Q(S,g){const k=n.get(S);if(S.isRenderTargetTexture===!1&&S.version>0&&k.__version!==S.version){K(k,S,g);return}t.bindTexture(i.TEXTURE_3D,k.__webglTexture,i.TEXTURE0+g)}function W(S,g){const k=n.get(S);if(S.version>0&&k.__version!==S.version){Z(k,S,g);return}t.bindTexture(i.TEXTURE_CUBE_MAP,k.__webglTexture,i.TEXTURE0+g)}const ne={[ps]:i.REPEAT,[Ln]:i.CLAMP_TO_EDGE,[ms]:i.MIRRORED_REPEAT},re={[Zt]:i.NEAREST,[vd]:i.NEAREST_MIPMAP_NEAREST,[Ta]:i.NEAREST_MIPMAP_LINEAR,[an]:i.LINEAR,[_r]:i.LINEAR_MIPMAP_NEAREST,[di]:i.LINEAR_MIPMAP_LINEAR},Me={[Sd]:i.NEVER,[Rd]:i.ALWAYS,[Td]:i.LESS,[tc]:i.LEQUAL,[Ed]:i.EQUAL,[Cd]:i.GEQUAL,[wd]:i.GREATER,[Ad]:i.NOTEQUAL};function Ge(S,g){if(g.type===gn&&e.has("OES_texture_float_linear")===!1&&(g.magFilter===an||g.magFilter===_r||g.magFilter===Ta||g.magFilter===di||g.minFilter===an||g.minFilter===_r||g.minFilter===Ta||g.minFilter===di)&&Ie("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(S,i.TEXTURE_WRAP_S,ne[g.wrapS]),i.texParameteri(S,i.TEXTURE_WRAP_T,ne[g.wrapT]),(S===i.TEXTURE_3D||S===i.TEXTURE_2D_ARRAY)&&i.texParameteri(S,i.TEXTURE_WRAP_R,ne[g.wrapR]),i.texParameteri(S,i.TEXTURE_MAG_FILTER,re[g.magFilter]),i.texParameteri(S,i.TEXTURE_MIN_FILTER,re[g.minFilter]),g.compareFunction&&(i.texParameteri(S,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(S,i.TEXTURE_COMPARE_FUNC,Me[g.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(g.magFilter===Zt||g.minFilter!==Ta&&g.minFilter!==di||g.type===gn&&e.has("OES_texture_float_linear")===!1)return;if(g.anisotropy>1||n.get(g).__currentAnisotropy){const k=e.get("EXT_texture_filter_anisotropic");i.texParameterf(S,k.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(g.anisotropy,a.getMaxAnisotropy())),n.get(g).__currentAnisotropy=g.anisotropy}}}function qe(S,g){let k=!1;S.__webglInit===void 0&&(S.__webglInit=!0,g.addEventListener("dispose",b));const q=g.source;let U=u.get(q);U===void 0&&(U={},u.set(q,U));const I=X(g);if(I!==S.__cacheKey){U[I]===void 0&&(U[I]={texture:i.createTexture(),usedTimes:0},s.memory.textures++,k=!0),U[I].usedTimes++;const te=U[S.__cacheKey];te!==void 0&&(U[S.__cacheKey].usedTimes--,te.usedTimes===0&&M(g)),S.__cacheKey=I,S.__webglTexture=U[I].texture}return k}function et(S,g,k){return Math.floor(Math.floor(S/k)/g)}function tt(S,g,k,q){const I=S.updateRanges;if(I.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,g.width,g.height,k,q,g.data);else{I.sort((j,ie)=>j.start-ie.start);let te=0;for(let j=1;j<I.length;j++){const ie=I[te],Ee=I[j],Se=ie.start+ie.count,he=et(Ee.start,g.width,4),Ce=et(ie.start,g.width,4);Ee.start<=Se+1&&he===Ce&&et(Ee.start+Ee.count-1,g.width,4)===he?ie.count=Math.max(ie.count,Ee.start+Ee.count-ie.start):(++te,I[te]=Ee)}I.length=te+1;const J=i.getParameter(i.UNPACK_ROW_LENGTH),ue=i.getParameter(i.UNPACK_SKIP_PIXELS),se=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,g.width);for(let j=0,ie=I.length;j<ie;j++){const Ee=I[j],Se=Math.floor(Ee.start/4),he=Math.ceil(Ee.count/4),Ce=Se%g.width,P=Math.floor(Se/g.width),de=he,oe=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Ce),i.pixelStorei(i.UNPACK_SKIP_ROWS,P),t.texSubImage2D(i.TEXTURE_2D,0,Ce,P,de,oe,k,q,g.data)}S.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,J),i.pixelStorei(i.UNPACK_SKIP_PIXELS,ue),i.pixelStorei(i.UNPACK_SKIP_ROWS,se)}}function K(S,g,k){let q=i.TEXTURE_2D;(g.isDataArrayTexture||g.isCompressedArrayTexture)&&(q=i.TEXTURE_2D_ARRAY),g.isData3DTexture&&(q=i.TEXTURE_3D);const U=qe(S,g),I=g.source;t.bindTexture(q,S.__webglTexture,i.TEXTURE0+k);const te=n.get(I);if(I.version!==te.__version||U===!0){t.activeTexture(i.TEXTURE0+k);const J=je.getPrimaries(je.workingColorSpace),ue=g.colorSpace===Kn?null:je.getPrimaries(g.colorSpace),se=g.colorSpace===Kn||J===ue?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,se);let j=_(g.image,!1,a.maxTextureSize);j=be(g,j);const ie=r.convert(g.format,g.colorSpace),Ee=r.convert(g.type);let Se=T(g.internalFormat,ie,Ee,g.colorSpace,g.isVideoTexture);Ge(q,g);let he;const Ce=g.mipmaps,P=g.isVideoTexture!==!0,de=te.__version===void 0||U===!0,oe=I.dataReady,le=L(g,j);if(g.isDepthTexture)Se=w(g.format===xa,g.type),de&&(P?t.texStorage2D(i.TEXTURE_2D,1,Se,j.width,j.height):t.texImage2D(i.TEXTURE_2D,0,Se,j.width,j.height,0,ie,Ee,null));else if(g.isDataTexture)if(Ce.length>0){P&&de&&t.texStorage2D(i.TEXTURE_2D,le,Se,Ce[0].width,Ce[0].height);for(let ee=0,$=Ce.length;ee<$;ee++)he=Ce[ee],P?oe&&t.texSubImage2D(i.TEXTURE_2D,ee,0,0,he.width,he.height,ie,Ee,he.data):t.texImage2D(i.TEXTURE_2D,ee,Se,he.width,he.height,0,ie,Ee,he.data);g.generateMipmaps=!1}else P?(de&&t.texStorage2D(i.TEXTURE_2D,le,Se,j.width,j.height),oe&&tt(g,j,ie,Ee)):t.texImage2D(i.TEXTURE_2D,0,Se,j.width,j.height,0,ie,Ee,j.data);else if(g.isCompressedTexture)if(g.isCompressedArrayTexture){P&&de&&t.texStorage3D(i.TEXTURE_2D_ARRAY,le,Se,Ce[0].width,Ce[0].height,j.depth);for(let ee=0,$=Ce.length;ee<$;ee++)if(he=Ce[ee],g.format!==fn)if(ie!==null)if(P){if(oe)if(g.layerUpdates.size>0){const _e=ll(he.width,he.height,g.format,g.type);for(const Ne of g.layerUpdates){const ct=he.data.subarray(Ne*_e/he.data.BYTES_PER_ELEMENT,(Ne+1)*_e/he.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ee,0,0,Ne,he.width,he.height,1,ie,ct)}g.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ee,0,0,0,he.width,he.height,j.depth,ie,he.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ee,Se,he.width,he.height,j.depth,0,he.data,0,0);else Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else P?oe&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,ee,0,0,0,he.width,he.height,j.depth,ie,Ee,he.data):t.texImage3D(i.TEXTURE_2D_ARRAY,ee,Se,he.width,he.height,j.depth,0,ie,Ee,he.data)}else{P&&de&&t.texStorage2D(i.TEXTURE_2D,le,Se,Ce[0].width,Ce[0].height);for(let ee=0,$=Ce.length;ee<$;ee++)he=Ce[ee],g.format!==fn?ie!==null?P?oe&&t.compressedTexSubImage2D(i.TEXTURE_2D,ee,0,0,he.width,he.height,ie,he.data):t.compressedTexImage2D(i.TEXTURE_2D,ee,Se,he.width,he.height,0,he.data):Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):P?oe&&t.texSubImage2D(i.TEXTURE_2D,ee,0,0,he.width,he.height,ie,Ee,he.data):t.texImage2D(i.TEXTURE_2D,ee,Se,he.width,he.height,0,ie,Ee,he.data)}else if(g.isDataArrayTexture)if(P){if(de&&t.texStorage3D(i.TEXTURE_2D_ARRAY,le,Se,j.width,j.height,j.depth),oe)if(g.layerUpdates.size>0){const ee=ll(j.width,j.height,g.format,g.type);for(const $ of g.layerUpdates){const _e=j.data.subarray($*ee/j.data.BYTES_PER_ELEMENT,($+1)*ee/j.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,$,j.width,j.height,1,ie,Ee,_e)}g.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,j.width,j.height,j.depth,ie,Ee,j.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,Se,j.width,j.height,j.depth,0,ie,Ee,j.data);else if(g.isData3DTexture)P?(de&&t.texStorage3D(i.TEXTURE_3D,le,Se,j.width,j.height,j.depth),oe&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,j.width,j.height,j.depth,ie,Ee,j.data)):t.texImage3D(i.TEXTURE_3D,0,Se,j.width,j.height,j.depth,0,ie,Ee,j.data);else if(g.isFramebufferTexture){if(de)if(P)t.texStorage2D(i.TEXTURE_2D,le,Se,j.width,j.height);else{let ee=j.width,$=j.height;for(let _e=0;_e<le;_e++)t.texImage2D(i.TEXTURE_2D,_e,Se,ee,$,0,ie,Ee,null),ee>>=1,$>>=1}}else if(Ce.length>0){if(P&&de){const ee=De(Ce[0]);t.texStorage2D(i.TEXTURE_2D,le,Se,ee.width,ee.height)}for(let ee=0,$=Ce.length;ee<$;ee++)he=Ce[ee],P?oe&&t.texSubImage2D(i.TEXTURE_2D,ee,0,0,ie,Ee,he):t.texImage2D(i.TEXTURE_2D,ee,Se,ie,Ee,he);g.generateMipmaps=!1}else if(P){if(de){const ee=De(j);t.texStorage2D(i.TEXTURE_2D,le,Se,ee.width,ee.height)}oe&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ie,Ee,j)}else t.texImage2D(i.TEXTURE_2D,0,Se,ie,Ee,j);m(g)&&f(q),te.__version=I.version,g.onUpdate&&g.onUpdate(g)}S.__version=g.version}function Z(S,g,k){if(g.image.length!==6)return;const q=qe(S,g),U=g.source;t.bindTexture(i.TEXTURE_CUBE_MAP,S.__webglTexture,i.TEXTURE0+k);const I=n.get(U);if(U.version!==I.__version||q===!0){t.activeTexture(i.TEXTURE0+k);const te=je.getPrimaries(je.workingColorSpace),J=g.colorSpace===Kn?null:je.getPrimaries(g.colorSpace),ue=g.colorSpace===Kn||te===J?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,g.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,g.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,g.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ue);const se=g.isCompressedTexture||g.image[0].isCompressedTexture,j=g.image[0]&&g.image[0].isDataTexture,ie=[];for(let $=0;$<6;$++)!se&&!j?ie[$]=_(g.image[$],!0,a.maxCubemapSize):ie[$]=j?g.image[$].image:g.image[$],ie[$]=be(g,ie[$]);const Ee=ie[0],Se=r.convert(g.format,g.colorSpace),he=r.convert(g.type),Ce=T(g.internalFormat,Se,he,g.colorSpace),P=g.isVideoTexture!==!0,de=I.__version===void 0||q===!0,oe=U.dataReady;let le=L(g,Ee);Ge(i.TEXTURE_CUBE_MAP,g);let ee;if(se){P&&de&&t.texStorage2D(i.TEXTURE_CUBE_MAP,le,Ce,Ee.width,Ee.height);for(let $=0;$<6;$++){ee=ie[$].mipmaps;for(let _e=0;_e<ee.length;_e++){const Ne=ee[_e];g.format!==fn?Se!==null?P?oe&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,_e,0,0,Ne.width,Ne.height,Se,Ne.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,_e,Ce,Ne.width,Ne.height,0,Ne.data):Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):P?oe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,_e,0,0,Ne.width,Ne.height,Se,he,Ne.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,_e,Ce,Ne.width,Ne.height,0,Se,he,Ne.data)}}}else{if(ee=g.mipmaps,P&&de){ee.length>0&&le++;const $=De(ie[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,le,Ce,$.width,$.height)}for(let $=0;$<6;$++)if(j){P?oe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,ie[$].width,ie[$].height,Se,he,ie[$].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Ce,ie[$].width,ie[$].height,0,Se,he,ie[$].data);for(let _e=0;_e<ee.length;_e++){const ct=ee[_e].image[$].image;P?oe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,_e+1,0,0,ct.width,ct.height,Se,he,ct.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,_e+1,Ce,ct.width,ct.height,0,Se,he,ct.data)}}else{P?oe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,0,0,Se,he,ie[$]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,0,Ce,Se,he,ie[$]);for(let _e=0;_e<ee.length;_e++){const Ne=ee[_e];P?oe&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,_e+1,0,0,Se,he,Ne.image[$]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+$,_e+1,Ce,Se,he,Ne.image[$])}}}m(g)&&f(i.TEXTURE_CUBE_MAP),I.__version=U.version,g.onUpdate&&g.onUpdate(g)}S.__version=g.version}function me(S,g,k,q,U,I){const te=r.convert(k.format,k.colorSpace),J=r.convert(k.type),ue=T(k.internalFormat,te,J,k.colorSpace),se=n.get(g),j=n.get(k);if(j.__renderTarget=g,!se.__hasExternalTextures){const ie=Math.max(1,g.width>>I),Ee=Math.max(1,g.height>>I);U===i.TEXTURE_3D||U===i.TEXTURE_2D_ARRAY?t.texImage3D(U,I,ue,ie,Ee,g.depth,0,te,J,null):t.texImage2D(U,I,ue,ie,Ee,0,te,J,null)}t.bindFramebuffer(i.FRAMEBUFFER,S),pe(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,q,U,j.__webglTexture,0,Qe(g)):(U===i.TEXTURE_2D||U>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&U<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,q,U,j.__webglTexture,I),t.bindFramebuffer(i.FRAMEBUFFER,null)}function Le(S,g,k){if(i.bindRenderbuffer(i.RENDERBUFFER,S),g.depthBuffer){const q=g.depthTexture,U=q&&q.isDepthTexture?q.type:null,I=w(g.stencilBuffer,U),te=g.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,J=Qe(g);pe(g)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,J,I,g.width,g.height):k?i.renderbufferStorageMultisample(i.RENDERBUFFER,J,I,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,I,g.width,g.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,te,i.RENDERBUFFER,S)}else{const q=g.textures;for(let U=0;U<q.length;U++){const I=q[U],te=r.convert(I.format,I.colorSpace),J=r.convert(I.type),ue=T(I.internalFormat,te,J,I.colorSpace),se=Qe(g);k&&pe(g)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,se,ue,g.width,g.height):pe(g)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,se,ue,g.width,g.height):i.renderbufferStorage(i.RENDERBUFFER,ue,g.width,g.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function ye(S,g){if(g&&g.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,S),!(g.depthTexture&&g.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const q=n.get(g.depthTexture);q.__renderTarget=g,(!q.__webglTexture||g.depthTexture.image.width!==g.width||g.depthTexture.image.height!==g.height)&&(g.depthTexture.image.width=g.width,g.depthTexture.image.height=g.height,g.depthTexture.needsUpdate=!0),H(g.depthTexture,0);const U=q.__webglTexture,I=Qe(g);if(g.depthTexture.format===ma)pe(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,U,0,I):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,U,0);else if(g.depthTexture.format===xa)pe(g)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,U,0,I):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,U,0);else throw new Error("Unknown depthTexture format")}function Ve(S){const g=n.get(S),k=S.isWebGLCubeRenderTarget===!0;if(g.__boundDepthTexture!==S.depthTexture){const q=S.depthTexture;if(g.__depthDisposeCallback&&g.__depthDisposeCallback(),q){const U=()=>{delete g.__boundDepthTexture,delete g.__depthDisposeCallback,q.removeEventListener("dispose",U)};q.addEventListener("dispose",U),g.__depthDisposeCallback=U}g.__boundDepthTexture=q}if(S.depthTexture&&!g.__autoAllocateDepthBuffer){if(k)throw new Error("target.depthTexture not supported in Cube render targets");const q=S.texture.mipmaps;q&&q.length>0?ye(g.__webglFramebuffer[0],S):ye(g.__webglFramebuffer,S)}else if(k){g.__webglDepthbuffer=[];for(let q=0;q<6;q++)if(t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[q]),g.__webglDepthbuffer[q]===void 0)g.__webglDepthbuffer[q]=i.createRenderbuffer(),Le(g.__webglDepthbuffer[q],S,!1);else{const U=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,I=g.__webglDepthbuffer[q];i.bindRenderbuffer(i.RENDERBUFFER,I),i.framebufferRenderbuffer(i.FRAMEBUFFER,U,i.RENDERBUFFER,I)}}else{const q=S.texture.mipmaps;if(q&&q.length>0?t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,g.__webglFramebuffer),g.__webglDepthbuffer===void 0)g.__webglDepthbuffer=i.createRenderbuffer(),Le(g.__webglDepthbuffer,S,!1);else{const U=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,I=g.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,I),i.framebufferRenderbuffer(i.FRAMEBUFFER,U,i.RENDERBUFFER,I)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function Ze(S,g,k){const q=n.get(S);g!==void 0&&me(q.__webglFramebuffer,S,S.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),k!==void 0&&Ve(S)}function Fe(S){const g=S.texture,k=n.get(S),q=n.get(g);S.addEventListener("dispose",R);const U=S.textures,I=S.isWebGLCubeRenderTarget===!0,te=U.length>1;if(te||(q.__webglTexture===void 0&&(q.__webglTexture=i.createTexture()),q.__version=g.version,s.memory.textures++),I){k.__webglFramebuffer=[];for(let J=0;J<6;J++)if(g.mipmaps&&g.mipmaps.length>0){k.__webglFramebuffer[J]=[];for(let ue=0;ue<g.mipmaps.length;ue++)k.__webglFramebuffer[J][ue]=i.createFramebuffer()}else k.__webglFramebuffer[J]=i.createFramebuffer()}else{if(g.mipmaps&&g.mipmaps.length>0){k.__webglFramebuffer=[];for(let J=0;J<g.mipmaps.length;J++)k.__webglFramebuffer[J]=i.createFramebuffer()}else k.__webglFramebuffer=i.createFramebuffer();if(te)for(let J=0,ue=U.length;J<ue;J++){const se=n.get(U[J]);se.__webglTexture===void 0&&(se.__webglTexture=i.createTexture(),s.memory.textures++)}if(S.samples>0&&pe(S)===!1){k.__webglMultisampledFramebuffer=i.createFramebuffer(),k.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,k.__webglMultisampledFramebuffer);for(let J=0;J<U.length;J++){const ue=U[J];k.__webglColorRenderbuffer[J]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,k.__webglColorRenderbuffer[J]);const se=r.convert(ue.format,ue.colorSpace),j=r.convert(ue.type),ie=T(ue.internalFormat,se,j,ue.colorSpace,S.isXRRenderTarget===!0),Ee=Qe(S);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ee,ie,S.width,S.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+J,i.RENDERBUFFER,k.__webglColorRenderbuffer[J])}i.bindRenderbuffer(i.RENDERBUFFER,null),S.depthBuffer&&(k.__webglDepthRenderbuffer=i.createRenderbuffer(),Le(k.__webglDepthRenderbuffer,S,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(I){t.bindTexture(i.TEXTURE_CUBE_MAP,q.__webglTexture),Ge(i.TEXTURE_CUBE_MAP,g);for(let J=0;J<6;J++)if(g.mipmaps&&g.mipmaps.length>0)for(let ue=0;ue<g.mipmaps.length;ue++)me(k.__webglFramebuffer[J][ue],S,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+J,ue);else me(k.__webglFramebuffer[J],S,g,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+J,0);m(g)&&f(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(te){for(let J=0,ue=U.length;J<ue;J++){const se=U[J],j=n.get(se);let ie=i.TEXTURE_2D;(S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(ie=S.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ie,j.__webglTexture),Ge(ie,se),me(k.__webglFramebuffer,S,se,i.COLOR_ATTACHMENT0+J,ie,0),m(se)&&f(ie)}t.unbindTexture()}else{let J=i.TEXTURE_2D;if((S.isWebGL3DRenderTarget||S.isWebGLArrayRenderTarget)&&(J=S.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(J,q.__webglTexture),Ge(J,g),g.mipmaps&&g.mipmaps.length>0)for(let ue=0;ue<g.mipmaps.length;ue++)me(k.__webglFramebuffer[ue],S,g,i.COLOR_ATTACHMENT0,J,ue);else me(k.__webglFramebuffer,S,g,i.COLOR_ATTACHMENT0,J,0);m(g)&&f(J),t.unbindTexture()}S.depthBuffer&&Ve(S)}function ot(S){const g=S.textures;for(let k=0,q=g.length;k<q;k++){const U=g[k];if(m(U)){const I=E(S),te=n.get(U).__webglTexture;t.bindTexture(I,te),f(I),t.unbindTexture()}}}const A=[],ke=[];function He(S){if(S.samples>0){if(pe(S)===!1){const g=S.textures,k=S.width,q=S.height;let U=i.COLOR_BUFFER_BIT;const I=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,te=n.get(S),J=g.length>1;if(J)for(let se=0;se<g.length;se++)t.bindFramebuffer(i.FRAMEBUFFER,te.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+se,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,te.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+se,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,te.__webglMultisampledFramebuffer);const ue=S.texture.mipmaps;ue&&ue.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,te.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,te.__webglFramebuffer);for(let se=0;se<g.length;se++){if(S.resolveDepthBuffer&&(S.depthBuffer&&(U|=i.DEPTH_BUFFER_BIT),S.stencilBuffer&&S.resolveStencilBuffer&&(U|=i.STENCIL_BUFFER_BIT)),J){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,te.__webglColorRenderbuffer[se]);const j=n.get(g[se]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,j,0)}i.blitFramebuffer(0,0,k,q,0,0,k,q,U,i.NEAREST),l===!0&&(A.length=0,ke.length=0,A.push(i.COLOR_ATTACHMENT0+se),S.depthBuffer&&S.resolveDepthBuffer===!1&&(A.push(I),ke.push(I),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,ke)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,A))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),J)for(let se=0;se<g.length;se++){t.bindFramebuffer(i.FRAMEBUFFER,te.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+se,i.RENDERBUFFER,te.__webglColorRenderbuffer[se]);const j=n.get(g[se]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,te.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+se,i.TEXTURE_2D,j,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,te.__webglMultisampledFramebuffer)}else if(S.depthBuffer&&S.resolveDepthBuffer===!1&&l){const g=S.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[g])}}}function Qe(S){return Math.min(a.maxSamples,S.samples)}function pe(S){const g=n.get(S);return S.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&g.__useRenderToTexture!==!1}function Je(S){const g=s.render.frame;d.get(S)!==g&&(d.set(S,g),S.update())}function be(S,g){const k=S.colorSpace,q=S.format,U=S.type;return S.isCompressedTexture===!0||S.isVideoTexture===!0||k!==Hi&&k!==Kn&&(je.getTransfer(k)===at?(q!==fn||U!==vn)&&Ie("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):gt("WebGLTextures: Unsupported texture color space:",k)),g}function De(S){return typeof HTMLImageElement<"u"&&S instanceof HTMLImageElement?(c.width=S.naturalWidth||S.width,c.height=S.naturalHeight||S.height):typeof VideoFrame<"u"&&S instanceof VideoFrame?(c.width=S.displayWidth,c.height=S.displayHeight):(c.width=S.width,c.height=S.height),c}this.allocateTextureUnit=V,this.resetTextureUnits=O,this.setTexture2D=H,this.setTexture2DArray=Y,this.setTexture3D=Q,this.setTextureCube=W,this.rebindTextures=Ze,this.setupRenderTarget=Fe,this.updateRenderTargetMipmap=ot,this.updateMultisampleRenderTarget=He,this.setupDepthRenderbuffer=Ve,this.setupFrameBufferTexture=me,this.useMultisampledRTT=pe}function u0(i,e){function t(n,a=Kn){let r;const s=je.getTransfer(a);if(n===vn)return i.UNSIGNED_BYTE;if(n===Zs)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Js)return i.UNSIGNED_SHORT_5_5_5_1;if(n===$l)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Zl)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Yl)return i.BYTE;if(n===jl)return i.SHORT;if(n===fa)return i.UNSIGNED_SHORT;if(n===$s)return i.INT;if(n===ui)return i.UNSIGNED_INT;if(n===gn)return i.FLOAT;if(n===qi)return i.HALF_FLOAT;if(n===Jl)return i.ALPHA;if(n===Ql)return i.RGB;if(n===fn)return i.RGBA;if(n===ma)return i.DEPTH_COMPONENT;if(n===xa)return i.DEPTH_STENCIL;if(n===Qs)return i.RED;if(n===eo)return i.RED_INTEGER;if(n===to)return i.RG;if(n===no)return i.RG_INTEGER;if(n===io)return i.RGBA_INTEGER;if(n===ja||n===$a||n===Za||n===Ja)if(s===at)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===ja)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===$a)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Za)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ja)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===ja)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===$a)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Za)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ja)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===xs||n===gs||n===_s||n===vs)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===xs)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===gs)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===_s)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===vs)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===ys||n===Ms||n===bs)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===ys||n===Ms)return s===at?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===bs)return s===at?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Ss||n===Ts||n===Es||n===ws||n===As||n===Cs||n===Rs||n===Ps||n===Ls||n===Ds||n===Is||n===Us||n===Ns||n===Fs)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ss)return s===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===Ts)return s===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Es)return s===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===ws)return s===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===As)return s===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Cs)return s===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Rs)return s===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ps)return s===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Ls)return s===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ds)return s===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Is)return s===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Us)return s===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Ns)return s===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Fs)return s===at?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Bs||n===ks||n===Os)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Bs)return s===at?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===ks)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Os)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===zs||n===Gs||n===Vs||n===Hs)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===zs)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Gs)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Vs)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Hs)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===pa?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const f0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,p0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class m0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new mc(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new kn({vertexShader:f0,fragmentShader:p0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Et(new ur(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class x0 extends pi{constructor(e,t){super();const n=this;let a=null,r=1,s=null,o="local-floor",l=1,c=null,d=null,h=null,u=null,p=null,x=null;const _=typeof XRWebGLBinding<"u",m=new m0,f={},E=t.getContextAttributes();let T=null,w=null;const L=[],b=[],R=new Ue;let B=null;const M=new nn;M.viewport=new xt;const y=new nn;y.viewport=new xt;const D=[M,y],O=new Ih;let V=null,X=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(K){let Z=L[K];return Z===void 0&&(Z=new Or,L[K]=Z),Z.getTargetRaySpace()},this.getControllerGrip=function(K){let Z=L[K];return Z===void 0&&(Z=new Or,L[K]=Z),Z.getGripSpace()},this.getHand=function(K){let Z=L[K];return Z===void 0&&(Z=new Or,L[K]=Z),Z.getHandSpace()};function H(K){const Z=b.indexOf(K.inputSource);if(Z===-1)return;const me=L[Z];me!==void 0&&(me.update(K.inputSource,K.frame,c||s),me.dispatchEvent({type:K.type,data:K.inputSource}))}function Y(){a.removeEventListener("select",H),a.removeEventListener("selectstart",H),a.removeEventListener("selectend",H),a.removeEventListener("squeeze",H),a.removeEventListener("squeezestart",H),a.removeEventListener("squeezeend",H),a.removeEventListener("end",Y),a.removeEventListener("inputsourceschange",Q);for(let K=0;K<L.length;K++){const Z=b[K];Z!==null&&(b[K]=null,L[K].disconnect(Z))}V=null,X=null,m.reset();for(const K in f)delete f[K];e.setRenderTarget(T),p=null,u=null,h=null,a=null,w=null,tt.stop(),n.isPresenting=!1,e.setPixelRatio(B),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(K){r=K,n.isPresenting===!0&&Ie("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(K){o=K,n.isPresenting===!0&&Ie("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||s},this.setReferenceSpace=function(K){c=K},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return h===null&&_&&(h=new XRWebGLBinding(a,t)),h},this.getFrame=function(){return x},this.getSession=function(){return a},this.setSession=async function(K){if(a=K,a!==null){if(T=e.getRenderTarget(),a.addEventListener("select",H),a.addEventListener("selectstart",H),a.addEventListener("selectend",H),a.addEventListener("squeeze",H),a.addEventListener("squeezestart",H),a.addEventListener("squeezeend",H),a.addEventListener("end",Y),a.addEventListener("inputsourceschange",Q),E.xrCompatible!==!0&&await t.makeXRCompatible(),B=e.getPixelRatio(),e.getSize(R),_&&"createProjectionLayer"in XRWebGLBinding.prototype){let me=null,Le=null,ye=null;E.depth&&(ye=E.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,me=E.stencil?xa:ma,Le=E.stencil?pa:ui);const Ve={colorFormat:t.RGBA8,depthFormat:ye,scaleFactor:r};h=this.getBinding(),u=h.createProjectionLayer(Ve),a.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),w=new fi(u.textureWidth,u.textureHeight,{format:fn,type:vn,depthTexture:new pc(u.textureWidth,u.textureHeight,Le,void 0,void 0,void 0,void 0,void 0,void 0,me),stencilBuffer:E.stencil,colorSpace:e.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const me={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(a,t,me),a.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),w=new fi(p.framebufferWidth,p.framebufferHeight,{format:fn,type:vn,colorSpace:e.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(l),c=null,s=await a.requestReferenceSpace(o),tt.setContext(a),tt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function Q(K){for(let Z=0;Z<K.removed.length;Z++){const me=K.removed[Z],Le=b.indexOf(me);Le>=0&&(b[Le]=null,L[Le].disconnect(me))}for(let Z=0;Z<K.added.length;Z++){const me=K.added[Z];let Le=b.indexOf(me);if(Le===-1){for(let Ve=0;Ve<L.length;Ve++)if(Ve>=b.length){b.push(me),Le=Ve;break}else if(b[Ve]===null){b[Ve]=me,Le=Ve;break}if(Le===-1)break}const ye=L[Le];ye&&ye.connect(me)}}const W=new C,ne=new C;function re(K,Z,me){W.setFromMatrixPosition(Z.matrixWorld),ne.setFromMatrixPosition(me.matrixWorld);const Le=W.distanceTo(ne),ye=Z.projectionMatrix.elements,Ve=me.projectionMatrix.elements,Ze=ye[14]/(ye[10]-1),Fe=ye[14]/(ye[10]+1),ot=(ye[9]+1)/ye[5],A=(ye[9]-1)/ye[5],ke=(ye[8]-1)/ye[0],He=(Ve[8]+1)/Ve[0],Qe=Ze*ke,pe=Ze*He,Je=Le/(-ke+He),be=Je*-ke;if(Z.matrixWorld.decompose(K.position,K.quaternion,K.scale),K.translateX(be),K.translateZ(Je),K.matrixWorld.compose(K.position,K.quaternion,K.scale),K.matrixWorldInverse.copy(K.matrixWorld).invert(),ye[10]===-1)K.projectionMatrix.copy(Z.projectionMatrix),K.projectionMatrixInverse.copy(Z.projectionMatrixInverse);else{const De=Ze+Je,S=Fe+Je,g=Qe-be,k=pe+(Le-be),q=ot*Fe/S*De,U=A*Fe/S*De;K.projectionMatrix.makePerspective(g,k,q,U,De,S),K.projectionMatrixInverse.copy(K.projectionMatrix).invert()}}function Me(K,Z){Z===null?K.matrixWorld.copy(K.matrix):K.matrixWorld.multiplyMatrices(Z.matrixWorld,K.matrix),K.matrixWorldInverse.copy(K.matrixWorld).invert()}this.updateCamera=function(K){if(a===null)return;let Z=K.near,me=K.far;m.texture!==null&&(m.depthNear>0&&(Z=m.depthNear),m.depthFar>0&&(me=m.depthFar)),O.near=y.near=M.near=Z,O.far=y.far=M.far=me,(V!==O.near||X!==O.far)&&(a.updateRenderState({depthNear:O.near,depthFar:O.far}),V=O.near,X=O.far),O.layers.mask=K.layers.mask|6,M.layers.mask=O.layers.mask&3,y.layers.mask=O.layers.mask&5;const Le=K.parent,ye=O.cameras;Me(O,Le);for(let Ve=0;Ve<ye.length;Ve++)Me(ye[Ve],Le);ye.length===2?re(O,M,y):O.projectionMatrix.copy(M.projectionMatrix),Ge(K,O,Le)};function Ge(K,Z,me){me===null?K.matrix.copy(Z.matrixWorld):(K.matrix.copy(me.matrixWorld),K.matrix.invert(),K.matrix.multiply(Z.matrixWorld)),K.matrix.decompose(K.position,K.quaternion,K.scale),K.updateMatrixWorld(!0),K.projectionMatrix.copy(Z.projectionMatrix),K.projectionMatrixInverse.copy(Z.projectionMatrixInverse),K.isPerspectiveCamera&&(K.fov=_a*2*Math.atan(1/K.projectionMatrix.elements[5]),K.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(!(u===null&&p===null))return l},this.setFoveation=function(K){l=K,u!==null&&(u.fixedFoveation=K),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=K)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(O)},this.getCameraTexture=function(K){return f[K]};let qe=null;function et(K,Z){if(d=Z.getViewerPose(c||s),x=Z,d!==null){const me=d.views;p!==null&&(e.setRenderTargetFramebuffer(w,p.framebuffer),e.setRenderTarget(w));let Le=!1;me.length!==O.cameras.length&&(O.cameras.length=0,Le=!0);for(let Fe=0;Fe<me.length;Fe++){const ot=me[Fe];let A=null;if(p!==null)A=p.getViewport(ot);else{const He=h.getViewSubImage(u,ot);A=He.viewport,Fe===0&&(e.setRenderTargetTextures(w,He.colorTexture,He.depthStencilTexture),e.setRenderTarget(w))}let ke=D[Fe];ke===void 0&&(ke=new nn,ke.layers.enable(Fe),ke.viewport=new xt,D[Fe]=ke),ke.matrix.fromArray(ot.transform.matrix),ke.matrix.decompose(ke.position,ke.quaternion,ke.scale),ke.projectionMatrix.fromArray(ot.projectionMatrix),ke.projectionMatrixInverse.copy(ke.projectionMatrix).invert(),ke.viewport.set(A.x,A.y,A.width,A.height),Fe===0&&(O.matrix.copy(ke.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),Le===!0&&O.cameras.push(ke)}const ye=a.enabledFeatures;if(ye&&ye.includes("depth-sensing")&&a.depthUsage=="gpu-optimized"&&_){h=n.getBinding();const Fe=h.getDepthInformation(me[0]);Fe&&Fe.isValid&&Fe.texture&&m.init(Fe,a.renderState)}if(ye&&ye.includes("camera-access")&&_){e.state.unbindTexture(),h=n.getBinding();for(let Fe=0;Fe<me.length;Fe++){const ot=me[Fe].camera;if(ot){let A=f[ot];A||(A=new mc,f[ot]=A);const ke=h.getCameraImage(ot);A.sourceTexture=ke}}}}for(let me=0;me<L.length;me++){const Le=b[me],ye=L[me];Le!==null&&ye!==void 0&&ye.update(Le,Z,c||s)}qe&&qe(K,Z),Z.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Z}),x=null}const tt=new gc;tt.setAnimationLoop(et),this.setAnimationLoop=function(K){qe=K},this.dispose=function(){}}}const oi=new yn,g0=new st;function _0(i,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,lc(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function a(m,f,E,T,w){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),h(m,f)):f.isMeshPhongMaterial?(r(m,f),d(m,f)):f.isMeshStandardMaterial?(r(m,f),u(m,f),f.isMeshPhysicalMaterial&&p(m,f,w)):f.isMeshMatcapMaterial?(r(m,f),x(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),_(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(s(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?l(m,f,E,T):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Xt&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Xt&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const E=e.get(f),T=E.envMap,w=E.envMapRotation;T&&(m.envMap.value=T,oi.copy(w),oi.x*=-1,oi.y*=-1,oi.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(oi.y*=-1,oi.z*=-1),m.envMapRotation.value.setFromMatrix4(g0.makeRotationFromEuler(oi)),m.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function s(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,E,T){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*E,m.scale.value=T*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function d(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function h(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function u(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,E){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Xt&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function x(m,f){f.matcap&&(m.matcap.value=f.matcap)}function _(m,f){const E=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:a}}function v0(i,e,t,n){let a={},r={},s=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(E,T){const w=T.program;n.uniformBlockBinding(E,w)}function c(E,T){let w=a[E.id];w===void 0&&(x(E),w=d(E),a[E.id]=w,E.addEventListener("dispose",m));const L=T.program;n.updateUBOMapping(E,L);const b=e.render.frame;r[E.id]!==b&&(u(E),r[E.id]=b)}function d(E){const T=h();E.__bindingPointIndex=T;const w=i.createBuffer(),L=E.__size,b=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,w),i.bufferData(i.UNIFORM_BUFFER,L,b),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,T,w),w}function h(){for(let E=0;E<o;E++)if(s.indexOf(E)===-1)return s.push(E),E;return gt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(E){const T=a[E.id],w=E.uniforms,L=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,T);for(let b=0,R=w.length;b<R;b++){const B=Array.isArray(w[b])?w[b]:[w[b]];for(let M=0,y=B.length;M<y;M++){const D=B[M];if(p(D,b,M,L)===!0){const O=D.__offset,V=Array.isArray(D.value)?D.value:[D.value];let X=0;for(let H=0;H<V.length;H++){const Y=V[H],Q=_(Y);typeof Y=="number"||typeof Y=="boolean"?(D.__data[0]=Y,i.bufferSubData(i.UNIFORM_BUFFER,O+X,D.__data)):Y.isMatrix3?(D.__data[0]=Y.elements[0],D.__data[1]=Y.elements[1],D.__data[2]=Y.elements[2],D.__data[3]=0,D.__data[4]=Y.elements[3],D.__data[5]=Y.elements[4],D.__data[6]=Y.elements[5],D.__data[7]=0,D.__data[8]=Y.elements[6],D.__data[9]=Y.elements[7],D.__data[10]=Y.elements[8],D.__data[11]=0):(Y.toArray(D.__data,X),X+=Q.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,O,D.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(E,T,w,L){const b=E.value,R=T+"_"+w;if(L[R]===void 0)return typeof b=="number"||typeof b=="boolean"?L[R]=b:L[R]=b.clone(),!0;{const B=L[R];if(typeof b=="number"||typeof b=="boolean"){if(B!==b)return L[R]=b,!0}else if(B.equals(b)===!1)return B.copy(b),!0}return!1}function x(E){const T=E.uniforms;let w=0;const L=16;for(let R=0,B=T.length;R<B;R++){const M=Array.isArray(T[R])?T[R]:[T[R]];for(let y=0,D=M.length;y<D;y++){const O=M[y],V=Array.isArray(O.value)?O.value:[O.value];for(let X=0,H=V.length;X<H;X++){const Y=V[X],Q=_(Y),W=w%L,ne=W%Q.boundary,re=W+ne;w+=ne,re!==0&&L-re<Q.storage&&(w+=L-re),O.__data=new Float32Array(Q.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=w,w+=Q.storage}}}const b=w%L;return b>0&&(w+=L-b),E.__size=w,E.__cache={},this}function _(E){const T={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(T.boundary=4,T.storage=4):E.isVector2?(T.boundary=8,T.storage=8):E.isVector3||E.isColor?(T.boundary=16,T.storage=12):E.isVector4?(T.boundary=16,T.storage=16):E.isMatrix3?(T.boundary=48,T.storage=48):E.isMatrix4?(T.boundary=64,T.storage=64):E.isTexture?Ie("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Ie("WebGLRenderer: Unsupported uniform value type.",E),T}function m(E){const T=E.target;T.removeEventListener("dispose",m);const w=s.indexOf(T.__bindingPointIndex);s.splice(w,1),i.deleteBuffer(a[T.id]),delete a[T.id],delete r[T.id]}function f(){for(const E in a)i.deleteBuffer(a[E]);s=[],a={},r={}}return{bind:l,update:c,dispose:f}}const y0=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let An=null;function M0(){return An===null&&(An=new hc(y0,32,32,to,qi),An.minFilter=an,An.magFilter=an,An.wrapS=Ln,An.wrapT=Ln,An.generateMipmaps=!1,An.needsUpdate=!0),An}class b0{constructor(e={}){const{canvas:t=Pd(),context:n=null,depth:a=!0,stencil:r=!1,alpha:s=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:u=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=s;const x=new Set([io,no,eo]),_=new Set([vn,ui,fa,pa,Zs,Js]),m=new Uint32Array(4),f=new Int32Array(4);let E=null,T=null;const w=[],L=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=$n,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const b=this;let R=!1;this._outputColorSpace=$t;let B=0,M=0,y=null,D=-1,O=null;const V=new xt,X=new xt;let H=null;const Y=new Xe(0);let Q=0,W=t.width,ne=t.height,re=1,Me=null,Ge=null;const qe=new xt(0,0,W,ne),et=new xt(0,0,W,ne);let tt=!1;const K=new lo;let Z=!1,me=!1;const Le=new st,ye=new C,Ve=new xt,Ze={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let Fe=!1;function ot(){return y===null?re:1}let A=n;function ke(v,N){return t.getContext(v,N)}try{const v={alpha:!0,depth:a,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${Ys}`),t.addEventListener("webglcontextlost",ee,!1),t.addEventListener("webglcontextrestored",$,!1),t.addEventListener("webglcontextcreationerror",_e,!1),A===null){const N="webgl2";if(A=ke(N,v),A===null)throw ke(N)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(v){throw v("WebGLRenderer: "+v.message),v}let He,Qe,pe,Je,be,De,S,g,k,q,U,I,te,J,ue,se,j,ie,Ee,Se,he,Ce,P,de;function oe(){He=new Pp(A),He.init(),Ce=new u0(A,He),Qe=new Mp(A,He,e,Ce),pe=new d0(A,He),Qe.reversedDepthBuffer&&u&&pe.buffers.depth.setReversed(!0),Je=new Ip(A),be=new Zm,De=new h0(A,He,pe,be,Qe,Ce,Je),S=new Sp(b),g=new Rp(b),k=new Fh(A),P=new vp(A,k),q=new Lp(A,k,Je,P),U=new Np(A,q,k,Je),Ee=new Up(A,Qe,De),se=new bp(be),I=new $m(b,S,g,He,Qe,P,se),te=new _0(b,be),J=new Qm,ue=new r0(He),ie=new _p(b,S,g,pe,U,p,l),j=new l0(b,U,Qe),de=new v0(A,Je,Qe,pe),Se=new yp(A,He,Je),he=new Dp(A,He,Je),Je.programs=I.programs,b.capabilities=Qe,b.extensions=He,b.properties=be,b.renderLists=J,b.shadowMap=j,b.state=pe,b.info=Je}oe();const le=new x0(b,A);this.xr=le,this.getContext=function(){return A},this.getContextAttributes=function(){return A.getContextAttributes()},this.forceContextLoss=function(){const v=He.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){const v=He.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return re},this.setPixelRatio=function(v){v!==void 0&&(re=v,this.setSize(W,ne,!1))},this.getSize=function(v){return v.set(W,ne)},this.setSize=function(v,N,z=!0){if(le.isPresenting){Ie("WebGLRenderer: Can't change size while VR device is presenting.");return}W=v,ne=N,t.width=Math.floor(v*re),t.height=Math.floor(N*re),z===!0&&(t.style.width=v+"px",t.style.height=N+"px"),this.setViewport(0,0,v,N)},this.getDrawingBufferSize=function(v){return v.set(W*re,ne*re).floor()},this.setDrawingBufferSize=function(v,N,z){W=v,ne=N,re=z,t.width=Math.floor(v*z),t.height=Math.floor(N*z),this.setViewport(0,0,v,N)},this.getCurrentViewport=function(v){return v.copy(V)},this.getViewport=function(v){return v.copy(qe)},this.setViewport=function(v,N,z,G){v.isVector4?qe.set(v.x,v.y,v.z,v.w):qe.set(v,N,z,G),pe.viewport(V.copy(qe).multiplyScalar(re).round())},this.getScissor=function(v){return v.copy(et)},this.setScissor=function(v,N,z,G){v.isVector4?et.set(v.x,v.y,v.z,v.w):et.set(v,N,z,G),pe.scissor(X.copy(et).multiplyScalar(re).round())},this.getScissorTest=function(){return tt},this.setScissorTest=function(v){pe.setScissorTest(tt=v)},this.setOpaqueSort=function(v){Me=v},this.setTransparentSort=function(v){Ge=v},this.getClearColor=function(v){return v.copy(ie.getClearColor())},this.setClearColor=function(){ie.setClearColor(...arguments)},this.getClearAlpha=function(){return ie.getClearAlpha()},this.setClearAlpha=function(){ie.setClearAlpha(...arguments)},this.clear=function(v=!0,N=!0,z=!0){let G=0;if(v){let F=!1;if(y!==null){const ae=y.texture.format;F=x.has(ae)}if(F){const ae=y.texture.type,fe=_.has(ae),ve=ie.getClearColor(),ge=ie.getClearAlpha(),Ae=ve.r,Pe=ve.g,Te=ve.b;fe?(m[0]=Ae,m[1]=Pe,m[2]=Te,m[3]=ge,A.clearBufferuiv(A.COLOR,0,m)):(f[0]=Ae,f[1]=Pe,f[2]=Te,f[3]=ge,A.clearBufferiv(A.COLOR,0,f))}else G|=A.COLOR_BUFFER_BIT}N&&(G|=A.DEPTH_BUFFER_BIT),z&&(G|=A.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),A.clear(G)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",ee,!1),t.removeEventListener("webglcontextrestored",$,!1),t.removeEventListener("webglcontextcreationerror",_e,!1),ie.dispose(),J.dispose(),ue.dispose(),be.dispose(),S.dispose(),g.dispose(),U.dispose(),P.dispose(),de.dispose(),I.dispose(),le.dispose(),le.removeEventListener("sessionstart",bo),le.removeEventListener("sessionend",So),ei.stop()};function ee(v){v.preventDefault(),Fo("WebGLRenderer: Context Lost."),R=!0}function $(){Fo("WebGLRenderer: Context Restored."),R=!1;const v=Je.autoReset,N=j.enabled,z=j.autoUpdate,G=j.needsUpdate,F=j.type;oe(),Je.autoReset=v,j.enabled=N,j.autoUpdate=z,j.needsUpdate=G,j.type=F}function _e(v){gt("WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function Ne(v){const N=v.target;N.removeEventListener("dispose",Ne),ct(N)}function ct(v){nt(v),be.remove(v)}function nt(v){const N=be.get(v).programs;N!==void 0&&(N.forEach(function(z){I.releaseProgram(z)}),v.isShaderMaterial&&I.releaseShaderCache(v))}this.renderBufferDirect=function(v,N,z,G,F,ae){N===null&&(N=Ze);const fe=F.isMesh&&F.matrixWorld.determinant()<0,ve=kc(v,N,z,G,F);pe.setMaterial(G,fe);let ge=z.index,Ae=1;if(G.wireframe===!0){if(ge=q.getWireframeAttribute(z),ge===void 0)return;Ae=2}const Pe=z.drawRange,Te=z.attributes.position;let We=Pe.start*Ae,it=(Pe.start+Pe.count)*Ae;ae!==null&&(We=Math.max(We,ae.start*Ae),it=Math.min(it,(ae.start+ae.count)*Ae)),ge!==null?(We=Math.max(We,0),it=Math.min(it,ge.count)):Te!=null&&(We=Math.max(We,0),it=Math.min(it,Te.count));const ft=it-We;if(ft<0||ft===1/0)return;P.setup(F,G,ve,z,ge);let pt,lt=Se;if(ge!==null&&(pt=k.get(ge),lt=he,lt.setIndex(pt)),F.isMesh)G.wireframe===!0?(pe.setLineWidth(G.wireframeLinewidth*ot()),lt.setMode(A.LINES)):lt.setMode(A.TRIANGLES);else if(F.isLine){let we=G.linewidth;we===void 0&&(we=1),pe.setLineWidth(we*ot()),F.isLineSegments?lt.setMode(A.LINES):F.isLineLoop?lt.setMode(A.LINE_LOOP):lt.setMode(A.LINE_STRIP)}else F.isPoints?lt.setMode(A.POINTS):F.isSprite&&lt.setMode(A.TRIANGLES);if(F.isBatchedMesh)if(F._multiDrawInstances!==null)ga("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),lt.renderMultiDrawInstances(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount,F._multiDrawInstances);else if(He.get("WEBGL_multi_draw"))lt.renderMultiDraw(F._multiDrawStarts,F._multiDrawCounts,F._multiDrawCount);else{const we=F._multiDrawStarts,ht=F._multiDrawCounts,Ye=F._multiDrawCount,Kt=ge?k.get(ge).bytesPerElement:1,xi=be.get(G).currentProgram.getUniforms();for(let qt=0;qt<Ye;qt++)xi.setValue(A,"_gl_DrawID",qt),lt.render(we[qt]/Kt,ht[qt])}else if(F.isInstancedMesh)lt.renderInstances(We,ft,F.count);else if(z.isInstancedBufferGeometry){const we=z._maxInstanceCount!==void 0?z._maxInstanceCount:1/0,ht=Math.min(z.instanceCount,we);lt.renderInstances(We,ft,ht)}else lt.render(We,ft)};function pn(v,N,z){v.transparent===!0&&v.side===Pn&&v.forceSinglePass===!1?(v.side=Xt,v.needsUpdate=!0,Sa(v,N,z),v.side=Jn,v.needsUpdate=!0,Sa(v,N,z),v.side=Pn):Sa(v,N,z)}this.compile=function(v,N,z=null){z===null&&(z=v),T=ue.get(z),T.init(N),L.push(T),z.traverseVisible(function(F){F.isLight&&F.layers.test(N.layers)&&(T.pushLight(F),F.castShadow&&T.pushShadow(F))}),v!==z&&v.traverseVisible(function(F){F.isLight&&F.layers.test(N.layers)&&(T.pushLight(F),F.castShadow&&T.pushShadow(F))}),T.setupLights();const G=new Set;return v.traverse(function(F){if(!(F.isMesh||F.isPoints||F.isLine||F.isSprite))return;const ae=F.material;if(ae)if(Array.isArray(ae))for(let fe=0;fe<ae.length;fe++){const ve=ae[fe];pn(ve,z,F),G.add(ve)}else pn(ae,z,F),G.add(ae)}),T=L.pop(),G},this.compileAsync=function(v,N,z=null){const G=this.compile(v,N,z);return new Promise(F=>{function ae(){if(G.forEach(function(fe){be.get(fe).currentProgram.isReady()&&G.delete(fe)}),G.size===0){F(v);return}setTimeout(ae,10)}He.get("KHR_parallel_shader_compile")!==null?ae():setTimeout(ae,10)})};let on=null;function Bc(v){on&&on(v)}function bo(){ei.stop()}function So(){ei.start()}const ei=new gc;ei.setAnimationLoop(Bc),typeof self<"u"&&ei.setContext(self),this.setAnimationLoop=function(v){on=v,le.setAnimationLoop(v),v===null?ei.stop():ei.start()},le.addEventListener("sessionstart",bo),le.addEventListener("sessionend",So),this.render=function(v,N){if(N!==void 0&&N.isCamera!==!0){gt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),N.parent===null&&N.matrixWorldAutoUpdate===!0&&N.updateMatrixWorld(),le.enabled===!0&&le.isPresenting===!0&&(le.cameraAutoUpdate===!0&&le.updateCamera(N),N=le.getCamera()),v.isScene===!0&&v.onBeforeRender(b,v,N,y),T=ue.get(v,L.length),T.init(N),L.push(T),Le.multiplyMatrices(N.projectionMatrix,N.matrixWorldInverse),K.setFromProjectionMatrix(Le,_n,N.reversedDepth),me=this.localClippingEnabled,Z=se.init(this.clippingPlanes,me),E=J.get(v,w.length),E.init(),w.push(E),le.enabled===!0&&le.isPresenting===!0){const ae=b.xr.getDepthSensingMesh();ae!==null&&xr(ae,N,-1/0,b.sortObjects)}xr(v,N,0,b.sortObjects),E.finish(),b.sortObjects===!0&&E.sort(Me,Ge),Fe=le.enabled===!1||le.isPresenting===!1||le.hasDepthSensing()===!1,Fe&&ie.addToRenderList(E,v),this.info.render.frame++,Z===!0&&se.beginShadows();const z=T.state.shadowsArray;j.render(z,v,N),Z===!0&&se.endShadows(),this.info.autoReset===!0&&this.info.reset();const G=E.opaque,F=E.transmissive;if(T.setupLights(),N.isArrayCamera){const ae=N.cameras;if(F.length>0)for(let fe=0,ve=ae.length;fe<ve;fe++){const ge=ae[fe];Eo(G,F,v,ge)}Fe&&ie.render(v);for(let fe=0,ve=ae.length;fe<ve;fe++){const ge=ae[fe];To(E,v,ge,ge.viewport)}}else F.length>0&&Eo(G,F,v,N),Fe&&ie.render(v),To(E,v,N);y!==null&&M===0&&(De.updateMultisampleRenderTarget(y),De.updateRenderTargetMipmap(y)),v.isScene===!0&&v.onAfterRender(b,v,N),P.resetDefaultState(),D=-1,O=null,L.pop(),L.length>0?(T=L[L.length-1],Z===!0&&se.setGlobalState(b.clippingPlanes,T.state.camera)):T=null,w.pop(),w.length>0?E=w[w.length-1]:E=null};function xr(v,N,z,G){if(v.visible===!1)return;if(v.layers.test(N.layers)){if(v.isGroup)z=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(N);else if(v.isLight)T.pushLight(v),v.castShadow&&T.pushShadow(v);else if(v.isSprite){if(!v.frustumCulled||K.intersectsSprite(v)){G&&Ve.setFromMatrixPosition(v.matrixWorld).applyMatrix4(Le);const fe=U.update(v),ve=v.material;ve.visible&&E.push(v,fe,ve,z,Ve.z,null)}}else if((v.isMesh||v.isLine||v.isPoints)&&(!v.frustumCulled||K.intersectsObject(v))){const fe=U.update(v),ve=v.material;if(G&&(v.boundingSphere!==void 0?(v.boundingSphere===null&&v.computeBoundingSphere(),Ve.copy(v.boundingSphere.center)):(fe.boundingSphere===null&&fe.computeBoundingSphere(),Ve.copy(fe.boundingSphere.center)),Ve.applyMatrix4(v.matrixWorld).applyMatrix4(Le)),Array.isArray(ve)){const ge=fe.groups;for(let Ae=0,Pe=ge.length;Ae<Pe;Ae++){const Te=ge[Ae],We=ve[Te.materialIndex];We&&We.visible&&E.push(v,fe,We,z,Ve.z,Te)}}else ve.visible&&E.push(v,fe,ve,z,Ve.z,null)}}const ae=v.children;for(let fe=0,ve=ae.length;fe<ve;fe++)xr(ae[fe],N,z,G)}function To(v,N,z,G){const{opaque:F,transmissive:ae,transparent:fe}=v;T.setupLightsView(z),Z===!0&&se.setGlobalState(b.clippingPlanes,z),G&&pe.viewport(V.copy(G)),F.length>0&&ba(F,N,z),ae.length>0&&ba(ae,N,z),fe.length>0&&ba(fe,N,z),pe.buffers.depth.setTest(!0),pe.buffers.depth.setMask(!0),pe.buffers.color.setMask(!0),pe.setPolygonOffset(!1)}function Eo(v,N,z,G){if((z.isScene===!0?z.overrideMaterial:null)!==null)return;T.state.transmissionRenderTarget[G.id]===void 0&&(T.state.transmissionRenderTarget[G.id]=new fi(1,1,{generateMipmaps:!0,type:He.has("EXT_color_buffer_half_float")||He.has("EXT_color_buffer_float")?qi:vn,minFilter:di,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:je.workingColorSpace}));const ae=T.state.transmissionRenderTarget[G.id],fe=G.viewport||V;ae.setSize(fe.z*b.transmissionResolutionScale,fe.w*b.transmissionResolutionScale);const ve=b.getRenderTarget(),ge=b.getActiveCubeFace(),Ae=b.getActiveMipmapLevel();b.setRenderTarget(ae),b.getClearColor(Y),Q=b.getClearAlpha(),Q<1&&b.setClearColor(16777215,.5),b.clear(),Fe&&ie.render(z);const Pe=b.toneMapping;b.toneMapping=$n;const Te=G.viewport;if(G.viewport!==void 0&&(G.viewport=void 0),T.setupLightsView(G),Z===!0&&se.setGlobalState(b.clippingPlanes,G),ba(v,z,G),De.updateMultisampleRenderTarget(ae),De.updateRenderTargetMipmap(ae),He.has("WEBGL_multisampled_render_to_texture")===!1){let We=!1;for(let it=0,ft=N.length;it<ft;it++){const pt=N[it],{object:lt,geometry:we,material:ht,group:Ye}=pt;if(ht.side===Pn&&lt.layers.test(G.layers)){const Kt=ht.side;ht.side=Xt,ht.needsUpdate=!0,wo(lt,z,G,we,ht,Ye),ht.side=Kt,ht.needsUpdate=!0,We=!0}}We===!0&&(De.updateMultisampleRenderTarget(ae),De.updateRenderTargetMipmap(ae))}b.setRenderTarget(ve,ge,Ae),b.setClearColor(Y,Q),Te!==void 0&&(G.viewport=Te),b.toneMapping=Pe}function ba(v,N,z){const G=N.isScene===!0?N.overrideMaterial:null;for(let F=0,ae=v.length;F<ae;F++){const fe=v[F],{object:ve,geometry:ge,group:Ae}=fe;let Pe=fe.material;Pe.allowOverride===!0&&G!==null&&(Pe=G),ve.layers.test(z.layers)&&wo(ve,N,z,ge,Pe,Ae)}}function wo(v,N,z,G,F,ae){v.onBeforeRender(b,N,z,G,F,ae),v.modelViewMatrix.multiplyMatrices(z.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),F.onBeforeRender(b,N,z,G,v,ae),F.transparent===!0&&F.side===Pn&&F.forceSinglePass===!1?(F.side=Xt,F.needsUpdate=!0,b.renderBufferDirect(z,N,G,F,v,ae),F.side=Jn,F.needsUpdate=!0,b.renderBufferDirect(z,N,G,F,v,ae),F.side=Pn):b.renderBufferDirect(z,N,G,F,v,ae),v.onAfterRender(b,N,z,G,F,ae)}function Sa(v,N,z){N.isScene!==!0&&(N=Ze);const G=be.get(v),F=T.state.lights,ae=T.state.shadowsArray,fe=F.state.version,ve=I.getParameters(v,F.state,ae,N,z),ge=I.getProgramCacheKey(ve);let Ae=G.programs;G.environment=v.isMeshStandardMaterial?N.environment:null,G.fog=N.fog,G.envMap=(v.isMeshStandardMaterial?g:S).get(v.envMap||G.environment),G.envMapRotation=G.environment!==null&&v.envMap===null?N.environmentRotation:v.envMapRotation,Ae===void 0&&(v.addEventListener("dispose",Ne),Ae=new Map,G.programs=Ae);let Pe=Ae.get(ge);if(Pe!==void 0){if(G.currentProgram===Pe&&G.lightsStateVersion===fe)return Co(v,ve),Pe}else ve.uniforms=I.getUniforms(v),v.onBeforeCompile(ve,b),Pe=I.acquireProgram(ve,ge),Ae.set(ge,Pe),G.uniforms=ve.uniforms;const Te=G.uniforms;return(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(Te.clippingPlanes=se.uniform),Co(v,ve),G.needsLights=zc(v),G.lightsStateVersion=fe,G.needsLights&&(Te.ambientLightColor.value=F.state.ambient,Te.lightProbe.value=F.state.probe,Te.directionalLights.value=F.state.directional,Te.directionalLightShadows.value=F.state.directionalShadow,Te.spotLights.value=F.state.spot,Te.spotLightShadows.value=F.state.spotShadow,Te.rectAreaLights.value=F.state.rectArea,Te.ltc_1.value=F.state.rectAreaLTC1,Te.ltc_2.value=F.state.rectAreaLTC2,Te.pointLights.value=F.state.point,Te.pointLightShadows.value=F.state.pointShadow,Te.hemisphereLights.value=F.state.hemi,Te.directionalShadowMap.value=F.state.directionalShadowMap,Te.directionalShadowMatrix.value=F.state.directionalShadowMatrix,Te.spotShadowMap.value=F.state.spotShadowMap,Te.spotLightMatrix.value=F.state.spotLightMatrix,Te.spotLightMap.value=F.state.spotLightMap,Te.pointShadowMap.value=F.state.pointShadowMap,Te.pointShadowMatrix.value=F.state.pointShadowMatrix),G.currentProgram=Pe,G.uniformsList=null,Pe}function Ao(v){if(v.uniformsList===null){const N=v.currentProgram.getUniforms();v.uniformsList=Qa.seqWithValue(N.seq,v.uniforms)}return v.uniformsList}function Co(v,N){const z=be.get(v);z.outputColorSpace=N.outputColorSpace,z.batching=N.batching,z.batchingColor=N.batchingColor,z.instancing=N.instancing,z.instancingColor=N.instancingColor,z.instancingMorph=N.instancingMorph,z.skinning=N.skinning,z.morphTargets=N.morphTargets,z.morphNormals=N.morphNormals,z.morphColors=N.morphColors,z.morphTargetsCount=N.morphTargetsCount,z.numClippingPlanes=N.numClippingPlanes,z.numIntersection=N.numClipIntersection,z.vertexAlphas=N.vertexAlphas,z.vertexTangents=N.vertexTangents,z.toneMapping=N.toneMapping}function kc(v,N,z,G,F){N.isScene!==!0&&(N=Ze),De.resetTextureUnits();const ae=N.fog,fe=G.isMeshStandardMaterial?N.environment:null,ve=y===null?b.outputColorSpace:y.isXRRenderTarget===!0?y.texture.colorSpace:Hi,ge=(G.isMeshStandardMaterial?g:S).get(G.envMap||fe),Ae=G.vertexColors===!0&&!!z.attributes.color&&z.attributes.color.itemSize===4,Pe=!!z.attributes.tangent&&(!!G.normalMap||G.anisotropy>0),Te=!!z.morphAttributes.position,We=!!z.morphAttributes.normal,it=!!z.morphAttributes.color;let ft=$n;G.toneMapped&&(y===null||y.isXRRenderTarget===!0)&&(ft=b.toneMapping);const pt=z.morphAttributes.position||z.morphAttributes.normal||z.morphAttributes.color,lt=pt!==void 0?pt.length:0,we=be.get(G),ht=T.state.lights;if(Z===!0&&(me===!0||v!==O)){const Lt=v===O&&G.id===D;se.setState(G,v,Lt)}let Ye=!1;G.version===we.__version?(we.needsLights&&we.lightsStateVersion!==ht.state.version||we.outputColorSpace!==ve||F.isBatchedMesh&&we.batching===!1||!F.isBatchedMesh&&we.batching===!0||F.isBatchedMesh&&we.batchingColor===!0&&F.colorTexture===null||F.isBatchedMesh&&we.batchingColor===!1&&F.colorTexture!==null||F.isInstancedMesh&&we.instancing===!1||!F.isInstancedMesh&&we.instancing===!0||F.isSkinnedMesh&&we.skinning===!1||!F.isSkinnedMesh&&we.skinning===!0||F.isInstancedMesh&&we.instancingColor===!0&&F.instanceColor===null||F.isInstancedMesh&&we.instancingColor===!1&&F.instanceColor!==null||F.isInstancedMesh&&we.instancingMorph===!0&&F.morphTexture===null||F.isInstancedMesh&&we.instancingMorph===!1&&F.morphTexture!==null||we.envMap!==ge||G.fog===!0&&we.fog!==ae||we.numClippingPlanes!==void 0&&(we.numClippingPlanes!==se.numPlanes||we.numIntersection!==se.numIntersection)||we.vertexAlphas!==Ae||we.vertexTangents!==Pe||we.morphTargets!==Te||we.morphNormals!==We||we.morphColors!==it||we.toneMapping!==ft||we.morphTargetsCount!==lt)&&(Ye=!0):(Ye=!0,we.__version=G.version);let Kt=we.currentProgram;Ye===!0&&(Kt=Sa(G,N,F));let xi=!1,qt=!1,Qi=!1;const ut=Kt.getUniforms(),Ft=we.uniforms;if(pe.useProgram(Kt.program)&&(xi=!0,qt=!0,Qi=!0),G.id!==D&&(D=G.id,qt=!0),xi||O!==v){pe.buffers.depth.getReversed()&&v.reversedDepth!==!0&&(v._reversedDepth=!0,v.updateProjectionMatrix()),ut.setValue(A,"projectionMatrix",v.projectionMatrix),ut.setValue(A,"viewMatrix",v.matrixWorldInverse);const Bt=ut.map.cameraPosition;Bt!==void 0&&Bt.setValue(A,ye.setFromMatrixPosition(v.matrixWorld)),Qe.logarithmicDepthBuffer&&ut.setValue(A,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),(G.isMeshPhongMaterial||G.isMeshToonMaterial||G.isMeshLambertMaterial||G.isMeshBasicMaterial||G.isMeshStandardMaterial||G.isShaderMaterial)&&ut.setValue(A,"isOrthographic",v.isOrthographicCamera===!0),O!==v&&(O=v,qt=!0,Qi=!0)}if(F.isSkinnedMesh){ut.setOptional(A,F,"bindMatrix"),ut.setOptional(A,F,"bindMatrixInverse");const Lt=F.skeleton;Lt&&(Lt.boneTexture===null&&Lt.computeBoneTexture(),ut.setValue(A,"boneTexture",Lt.boneTexture,De))}F.isBatchedMesh&&(ut.setOptional(A,F,"batchingTexture"),ut.setValue(A,"batchingTexture",F._matricesTexture,De),ut.setOptional(A,F,"batchingIdTexture"),ut.setValue(A,"batchingIdTexture",F._indirectTexture,De),ut.setOptional(A,F,"batchingColorTexture"),F._colorsTexture!==null&&ut.setValue(A,"batchingColorTexture",F._colorsTexture,De));const en=z.morphAttributes;if((en.position!==void 0||en.normal!==void 0||en.color!==void 0)&&Ee.update(F,z,Kt),(qt||we.receiveShadow!==F.receiveShadow)&&(we.receiveShadow=F.receiveShadow,ut.setValue(A,"receiveShadow",F.receiveShadow)),G.isMeshGouraudMaterial&&G.envMap!==null&&(Ft.envMap.value=ge,Ft.flipEnvMap.value=ge.isCubeTexture&&ge.isRenderTargetTexture===!1?-1:1),G.isMeshStandardMaterial&&G.envMap===null&&N.environment!==null&&(Ft.envMapIntensity.value=N.environmentIntensity),Ft.dfgLUT!==void 0&&(Ft.dfgLUT.value=M0()),qt&&(ut.setValue(A,"toneMappingExposure",b.toneMappingExposure),we.needsLights&&Oc(Ft,Qi),ae&&G.fog===!0&&te.refreshFogUniforms(Ft,ae),te.refreshMaterialUniforms(Ft,G,re,ne,T.state.transmissionRenderTarget[v.id]),Qa.upload(A,Ao(we),Ft,De)),G.isShaderMaterial&&G.uniformsNeedUpdate===!0&&(Qa.upload(A,Ao(we),Ft,De),G.uniformsNeedUpdate=!1),G.isSpriteMaterial&&ut.setValue(A,"center",F.center),ut.setValue(A,"modelViewMatrix",F.modelViewMatrix),ut.setValue(A,"normalMatrix",F.normalMatrix),ut.setValue(A,"modelMatrix",F.matrixWorld),G.isShaderMaterial||G.isRawShaderMaterial){const Lt=G.uniformsGroups;for(let Bt=0,gr=Lt.length;Bt<gr;Bt++){const ti=Lt[Bt];de.update(ti,Kt),de.bind(ti,Kt)}}return Kt}function Oc(v,N){v.ambientLightColor.needsUpdate=N,v.lightProbe.needsUpdate=N,v.directionalLights.needsUpdate=N,v.directionalLightShadows.needsUpdate=N,v.pointLights.needsUpdate=N,v.pointLightShadows.needsUpdate=N,v.spotLights.needsUpdate=N,v.spotLightShadows.needsUpdate=N,v.rectAreaLights.needsUpdate=N,v.hemisphereLights.needsUpdate=N}function zc(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return B},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return y},this.setRenderTargetTextures=function(v,N,z){const G=be.get(v);G.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,G.__autoAllocateDepthBuffer===!1&&(G.__useRenderToTexture=!1),be.get(v.texture).__webglTexture=N,be.get(v.depthTexture).__webglTexture=G.__autoAllocateDepthBuffer?void 0:z,G.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,N){const z=be.get(v);z.__webglFramebuffer=N,z.__useDefaultFramebuffer=N===void 0};const Gc=A.createFramebuffer();this.setRenderTarget=function(v,N=0,z=0){y=v,B=N,M=z;let G=!0,F=null,ae=!1,fe=!1;if(v){const ge=be.get(v);if(ge.__useDefaultFramebuffer!==void 0)pe.bindFramebuffer(A.FRAMEBUFFER,null),G=!1;else if(ge.__webglFramebuffer===void 0)De.setupRenderTarget(v);else if(ge.__hasExternalTextures)De.rebindTextures(v,be.get(v.texture).__webglTexture,be.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){const Te=v.depthTexture;if(ge.__boundDepthTexture!==Te){if(Te!==null&&be.has(Te)&&(v.width!==Te.image.width||v.height!==Te.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");De.setupDepthRenderbuffer(v)}}const Ae=v.texture;(Ae.isData3DTexture||Ae.isDataArrayTexture||Ae.isCompressedArrayTexture)&&(fe=!0);const Pe=be.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Array.isArray(Pe[N])?F=Pe[N][z]:F=Pe[N],ae=!0):v.samples>0&&De.useMultisampledRTT(v)===!1?F=be.get(v).__webglMultisampledFramebuffer:Array.isArray(Pe)?F=Pe[z]:F=Pe,V.copy(v.viewport),X.copy(v.scissor),H=v.scissorTest}else V.copy(qe).multiplyScalar(re).floor(),X.copy(et).multiplyScalar(re).floor(),H=tt;if(z!==0&&(F=Gc),pe.bindFramebuffer(A.FRAMEBUFFER,F)&&G&&pe.drawBuffers(v,F),pe.viewport(V),pe.scissor(X),pe.setScissorTest(H),ae){const ge=be.get(v.texture);A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_CUBE_MAP_POSITIVE_X+N,ge.__webglTexture,z)}else if(fe){const ge=N;for(let Ae=0;Ae<v.textures.length;Ae++){const Pe=be.get(v.textures[Ae]);A.framebufferTextureLayer(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0+Ae,Pe.__webglTexture,z,ge)}}else if(v!==null&&z!==0){const ge=be.get(v.texture);A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,ge.__webglTexture,z)}D=-1},this.readRenderTargetPixels=function(v,N,z,G,F,ae,fe,ve=0){if(!(v&&v.isWebGLRenderTarget)){gt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let ge=be.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&fe!==void 0&&(ge=ge[fe]),ge){pe.bindFramebuffer(A.FRAMEBUFFER,ge);try{const Ae=v.textures[ve],Pe=Ae.format,Te=Ae.type;if(!Qe.textureFormatReadable(Pe)){gt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Qe.textureTypeReadable(Te)){gt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}N>=0&&N<=v.width-G&&z>=0&&z<=v.height-F&&(v.textures.length>1&&A.readBuffer(A.COLOR_ATTACHMENT0+ve),A.readPixels(N,z,G,F,Ce.convert(Pe),Ce.convert(Te),ae))}finally{const Ae=y!==null?be.get(y).__webglFramebuffer:null;pe.bindFramebuffer(A.FRAMEBUFFER,Ae)}}},this.readRenderTargetPixelsAsync=async function(v,N,z,G,F,ae,fe,ve=0){if(!(v&&v.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let ge=be.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&fe!==void 0&&(ge=ge[fe]),ge)if(N>=0&&N<=v.width-G&&z>=0&&z<=v.height-F){pe.bindFramebuffer(A.FRAMEBUFFER,ge);const Ae=v.textures[ve],Pe=Ae.format,Te=Ae.type;if(!Qe.textureFormatReadable(Pe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Qe.textureTypeReadable(Te))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const We=A.createBuffer();A.bindBuffer(A.PIXEL_PACK_BUFFER,We),A.bufferData(A.PIXEL_PACK_BUFFER,ae.byteLength,A.STREAM_READ),v.textures.length>1&&A.readBuffer(A.COLOR_ATTACHMENT0+ve),A.readPixels(N,z,G,F,Ce.convert(Pe),Ce.convert(Te),0);const it=y!==null?be.get(y).__webglFramebuffer:null;pe.bindFramebuffer(A.FRAMEBUFFER,it);const ft=A.fenceSync(A.SYNC_GPU_COMMANDS_COMPLETE,0);return A.flush(),await Ld(A,ft,4),A.bindBuffer(A.PIXEL_PACK_BUFFER,We),A.getBufferSubData(A.PIXEL_PACK_BUFFER,0,ae),A.deleteBuffer(We),A.deleteSync(ft),ae}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,N=null,z=0){const G=Math.pow(2,-z),F=Math.floor(v.image.width*G),ae=Math.floor(v.image.height*G),fe=N!==null?N.x:0,ve=N!==null?N.y:0;De.setTexture2D(v,0),A.copyTexSubImage2D(A.TEXTURE_2D,z,0,0,fe,ve,F,ae),pe.unbindTexture()};const Vc=A.createFramebuffer(),Hc=A.createFramebuffer();this.copyTextureToTexture=function(v,N,z=null,G=null,F=0,ae=null){ae===null&&(F!==0?(ga("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ae=F,F=0):ae=0);let fe,ve,ge,Ae,Pe,Te,We,it,ft;const pt=v.isCompressedTexture?v.mipmaps[ae]:v.image;if(z!==null)fe=z.max.x-z.min.x,ve=z.max.y-z.min.y,ge=z.isBox3?z.max.z-z.min.z:1,Ae=z.min.x,Pe=z.min.y,Te=z.isBox3?z.min.z:0;else{const en=Math.pow(2,-F);fe=Math.floor(pt.width*en),ve=Math.floor(pt.height*en),v.isDataArrayTexture?ge=pt.depth:v.isData3DTexture?ge=Math.floor(pt.depth*en):ge=1,Ae=0,Pe=0,Te=0}G!==null?(We=G.x,it=G.y,ft=G.z):(We=0,it=0,ft=0);const lt=Ce.convert(N.format),we=Ce.convert(N.type);let ht;N.isData3DTexture?(De.setTexture3D(N,0),ht=A.TEXTURE_3D):N.isDataArrayTexture||N.isCompressedArrayTexture?(De.setTexture2DArray(N,0),ht=A.TEXTURE_2D_ARRAY):(De.setTexture2D(N,0),ht=A.TEXTURE_2D),A.pixelStorei(A.UNPACK_FLIP_Y_WEBGL,N.flipY),A.pixelStorei(A.UNPACK_PREMULTIPLY_ALPHA_WEBGL,N.premultiplyAlpha),A.pixelStorei(A.UNPACK_ALIGNMENT,N.unpackAlignment);const Ye=A.getParameter(A.UNPACK_ROW_LENGTH),Kt=A.getParameter(A.UNPACK_IMAGE_HEIGHT),xi=A.getParameter(A.UNPACK_SKIP_PIXELS),qt=A.getParameter(A.UNPACK_SKIP_ROWS),Qi=A.getParameter(A.UNPACK_SKIP_IMAGES);A.pixelStorei(A.UNPACK_ROW_LENGTH,pt.width),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,pt.height),A.pixelStorei(A.UNPACK_SKIP_PIXELS,Ae),A.pixelStorei(A.UNPACK_SKIP_ROWS,Pe),A.pixelStorei(A.UNPACK_SKIP_IMAGES,Te);const ut=v.isDataArrayTexture||v.isData3DTexture,Ft=N.isDataArrayTexture||N.isData3DTexture;if(v.isDepthTexture){const en=be.get(v),Lt=be.get(N),Bt=be.get(en.__renderTarget),gr=be.get(Lt.__renderTarget);pe.bindFramebuffer(A.READ_FRAMEBUFFER,Bt.__webglFramebuffer),pe.bindFramebuffer(A.DRAW_FRAMEBUFFER,gr.__webglFramebuffer);for(let ti=0;ti<ge;ti++)ut&&(A.framebufferTextureLayer(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,be.get(v).__webglTexture,F,Te+ti),A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,be.get(N).__webglTexture,ae,ft+ti)),A.blitFramebuffer(Ae,Pe,fe,ve,We,it,fe,ve,A.DEPTH_BUFFER_BIT,A.NEAREST);pe.bindFramebuffer(A.READ_FRAMEBUFFER,null),pe.bindFramebuffer(A.DRAW_FRAMEBUFFER,null)}else if(F!==0||v.isRenderTargetTexture||be.has(v)){const en=be.get(v),Lt=be.get(N);pe.bindFramebuffer(A.READ_FRAMEBUFFER,Vc),pe.bindFramebuffer(A.DRAW_FRAMEBUFFER,Hc);for(let Bt=0;Bt<ge;Bt++)ut?A.framebufferTextureLayer(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,en.__webglTexture,F,Te+Bt):A.framebufferTexture2D(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,en.__webglTexture,F),Ft?A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,Lt.__webglTexture,ae,ft+Bt):A.framebufferTexture2D(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,Lt.__webglTexture,ae),F!==0?A.blitFramebuffer(Ae,Pe,fe,ve,We,it,fe,ve,A.COLOR_BUFFER_BIT,A.NEAREST):Ft?A.copyTexSubImage3D(ht,ae,We,it,ft+Bt,Ae,Pe,fe,ve):A.copyTexSubImage2D(ht,ae,We,it,Ae,Pe,fe,ve);pe.bindFramebuffer(A.READ_FRAMEBUFFER,null),pe.bindFramebuffer(A.DRAW_FRAMEBUFFER,null)}else Ft?v.isDataTexture||v.isData3DTexture?A.texSubImage3D(ht,ae,We,it,ft,fe,ve,ge,lt,we,pt.data):N.isCompressedArrayTexture?A.compressedTexSubImage3D(ht,ae,We,it,ft,fe,ve,ge,lt,pt.data):A.texSubImage3D(ht,ae,We,it,ft,fe,ve,ge,lt,we,pt):v.isDataTexture?A.texSubImage2D(A.TEXTURE_2D,ae,We,it,fe,ve,lt,we,pt.data):v.isCompressedTexture?A.compressedTexSubImage2D(A.TEXTURE_2D,ae,We,it,pt.width,pt.height,lt,pt.data):A.texSubImage2D(A.TEXTURE_2D,ae,We,it,fe,ve,lt,we,pt);A.pixelStorei(A.UNPACK_ROW_LENGTH,Ye),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,Kt),A.pixelStorei(A.UNPACK_SKIP_PIXELS,xi),A.pixelStorei(A.UNPACK_SKIP_ROWS,qt),A.pixelStorei(A.UNPACK_SKIP_IMAGES,Qi),ae===0&&N.generateMipmaps&&A.generateMipmap(ht),pe.unbindTexture()},this.initRenderTarget=function(v){be.get(v).__webglFramebuffer===void 0&&De.setupRenderTarget(v)},this.initTexture=function(v){v.isCubeTexture?De.setTextureCube(v,0):v.isData3DTexture?De.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?De.setTexture2DArray(v,0):De.setTexture2D(v,0),pe.unbindTexture()},this.resetState=function(){B=0,M=0,y=null,pe.reset(),P.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return _n}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=je._getDrawingBufferColorSpace(e),t.unpackColorSpace=je._getUnpackColorSpace()}}const Dl={type:"change"},mo={type:"start"},bc={type:"end"},Ya=new so,Il=new Xn,S0=Math.cos(70*qn.DEG2RAD),vt=new C,kt=2*Math.PI,rt={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},$r=1e-6;class T0 extends Uh{constructor(e,t=null){super(e,t),this.state=rt.NONE,this.target=new C,this.cursor=new C,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Fi.ROTATE,MIDDLE:Fi.DOLLY,RIGHT:Fi.PAN},this.touches={ONE:Ni.ROTATE,TWO:Ni.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new C,this._lastQuaternion=new Bn,this._lastTargetPosition=new C,this._quat=new Bn().setFromUnitVectors(e.up,new C(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new ol,this._sphericalDelta=new ol,this._scale=1,this._panOffset=new C,this._rotateStart=new Ue,this._rotateEnd=new Ue,this._rotateDelta=new Ue,this._panStart=new Ue,this._panEnd=new Ue,this._panDelta=new Ue,this._dollyStart=new Ue,this._dollyEnd=new Ue,this._dollyDelta=new Ue,this._dollyDirection=new C,this._mouse=new Ue,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=w0.bind(this),this._onPointerDown=E0.bind(this),this._onPointerUp=A0.bind(this),this._onContextMenu=U0.bind(this),this._onMouseWheel=P0.bind(this),this._onKeyDown=L0.bind(this),this._onTouchStart=D0.bind(this),this._onTouchMove=I0.bind(this),this._onMouseDown=C0.bind(this),this._onMouseMove=R0.bind(this),this._interceptControlDown=N0.bind(this),this._interceptControlUp=F0.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Dl),this.update(),this.state=rt.NONE}update(e=null){const t=this.object.position;vt.copy(t).sub(this.target),vt.applyQuaternion(this._quat),this._spherical.setFromVector3(vt),this.autoRotate&&this.state===rt.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,a=this.maxAzimuthAngle;isFinite(n)&&isFinite(a)&&(n<-Math.PI?n+=kt:n>Math.PI&&(n-=kt),a<-Math.PI?a+=kt:a>Math.PI&&(a-=kt),n<=a?this._spherical.theta=Math.max(n,Math.min(a,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+a)/2?Math.max(n,this._spherical.theta):Math.min(a,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const s=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=s!=this._spherical.radius}if(vt.setFromSpherical(this._spherical),vt.applyQuaternion(this._quatInverse),t.copy(this.target).add(vt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let s=null;if(this.object.isPerspectiveCamera){const o=vt.length();s=this._clampDistance(o*this._scale);const l=o-s;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new C(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new C(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),s=vt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;s!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(s).add(this.object.position):(Ya.origin.copy(this.object.position),Ya.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ya.direction))<S0?this.object.lookAt(this.target):(Il.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ya.intersectPlane(Il,this.target))))}else if(this.object.isOrthographicCamera){const s=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),s!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>$r||8*(1-this._lastQuaternion.dot(this.object.quaternion))>$r||this._lastTargetPosition.distanceToSquared(this.target)>$r?(this.dispatchEvent(Dl),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?kt/60*this.autoRotateSpeed*e:kt/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){vt.setFromMatrixColumn(t,0),vt.multiplyScalar(-e),this._panOffset.add(vt)}_panUp(e,t){this.screenSpacePanning===!0?vt.setFromMatrixColumn(t,1):(vt.setFromMatrixColumn(t,0),vt.crossVectors(this.object.up,vt)),vt.multiplyScalar(e),this._panOffset.add(vt)}_pan(e,t){const n=this.domElement;if(this.object.isPerspectiveCamera){const a=this.object.position;vt.copy(a).sub(this.target);let r=vt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),a=e-n.left,r=t-n.top,s=n.width,o=n.height;this._mouse.x=a/s*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(kt*this._rotateDelta.x/t.clientHeight),this._rotateUp(kt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(kt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-kt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(kt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-kt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),a=.5*(e.pageY+t.y);this._rotateStart.set(n,a)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),a=.5*(e.pageY+t.y);this._panStart.set(n,a)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,a=e.pageY-t.y,r=Math.sqrt(n*n+a*a);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),a=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(a,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(kt*this._rotateDelta.x/t.clientHeight),this._rotateUp(kt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),a=.5*(e.pageY+t.y);this._panEnd.set(n,a)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,a=e.pageY-t.y,r=Math.sqrt(n*n+a*a);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const s=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(s,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Ue,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function E0(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function w0(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function A0(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(bc),this.state=rt.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function C0(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Fi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=rt.DOLLY;break;case Fi.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=rt.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=rt.ROTATE}break;case Fi.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=rt.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=rt.PAN}break;default:this.state=rt.NONE}this.state!==rt.NONE&&this.dispatchEvent(mo)}function R0(i){switch(this.state){case rt.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case rt.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case rt.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function P0(i){this.enabled===!1||this.enableZoom===!1||this.state!==rt.NONE||(i.preventDefault(),this.dispatchEvent(mo),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(bc))}function L0(i){this.enabled!==!1&&this._handleKeyDown(i)}function D0(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Ni.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=rt.TOUCH_ROTATE;break;case Ni.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=rt.TOUCH_PAN;break;default:this.state=rt.NONE}break;case 2:switch(this.touches.TWO){case Ni.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=rt.TOUCH_DOLLY_PAN;break;case Ni.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=rt.TOUCH_DOLLY_ROTATE;break;default:this.state=rt.NONE}break;default:this.state=rt.NONE}this.state!==rt.NONE&&this.dispatchEvent(mo)}function I0(i){switch(this._trackPointer(i),this.state){case rt.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case rt.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case rt.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case rt.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=rt.NONE}}function U0(i){this.enabled!==!1&&i.preventDefault()}function N0(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function F0(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}class B0{constructor(e){this.renderer=new b0({canvas:e,antialias:!0,powerPreference:"high-performance",alpha:!1}),this.renderer.outputColorSpace=$t,this.renderer.toneMapping=Kl,this.renderer.toneMappingExposure=1.05,this.renderer.shadowMap.enabled=!1,this.pixelRatio=Math.min(window.devicePixelRatio||1,1.5),this.minPixelRatio=.68,this.maxPixelRatio=Math.min(window.devicePixelRatio||1,1.75),this.frameCostEMA=16.7,this.lastPixelChange=0,this.setPixelRatio(this.pixelRatio)}setPixelRatio(e){this.pixelRatio=Number(e.toFixed(2)),this.renderer.setPixelRatio(this.pixelRatio),this.renderer.setSize(window.innerWidth,window.innerHeight,!1)}resize(e){const t=window.innerWidth,n=window.innerHeight;e.aspect=t/n,e.updateProjectionMatrix(),this.renderer.setSize(t,n,!1)}render(e,t){const n=performance.now();this.renderer.render(e,t);const a=performance.now()-n;this.frameCostEMA=this.frameCostEMA*.92+a*.08,this.adjustPixelRatio()}adjustPixelRatio(){const e=performance.now();e-this.lastPixelChange<1400||(this.frameCostEMA>22&&this.pixelRatio>this.minPixelRatio?(this.setPixelRatio(Math.max(this.minPixelRatio,this.pixelRatio-.12)),this.lastPixelChange=e):this.frameCostEMA<9.5&&this.pixelRatio<this.maxPixelRatio&&(this.setPixelRatio(Math.min(this.maxPixelRatio,this.pixelRatio+.08)),this.lastPixelChange=e))}get domElement(){return this.renderer.domElement}get info(){return this.renderer.info}}const Ma=64;function k0(i=globalThis){const e=i.navigator??{},t=i.window??i,n=!!t.matchMedia?.("(pointer: coarse)").matches,a=!!t.matchMedia?.("(max-width: 860px)").matches,r=e.deviceMemory??4;return n||a||r<=4?"mobile":r<=8?"balanced":"desktop"}const O0={mobile:{highRadius:1,mediumRadius:2,visibleInstanceCap:11e5},balanced:{highRadius:2,mediumRadius:3,visibleInstanceCap:11e5},desktop:{highRadius:2,mediumRadius:4,visibleInstanceCap:11e5}};function xo(i,e,t=Ma){return{cx:Math.floor(i/t),cz:Math.floor(e/t)}}function z0(i,e,t=Ma){const{cx:n,cz:a}=xo(i,e,t);return`${n}_${a}`}function Sc(i,e){return Math.max(Math.abs(i.cx-e.cx),Math.abs(i.cz-e.cz))}class G0{constructor(e){this.palette=e,this.materials=new Map}get(e){if(this.materials.has(e))return this.materials.get(e);const t=this.palette[e];if(t===void 0)return null;const n=new Tt({color:t,flatShading:!0,fog:!0});return this.materials.set(e,n),n}dispose(){this.materials.forEach(e=>e.dispose()),this.materials.clear()}}function V0(i,e={}){const t=e.chunkSize??Ma,n=new Map;for(const[a,r]of i.entries())for(const s of r){const o=z0(s.x,s.z,t);if(!n.has(o)){const[c,d]=o.split("_").map(Number);n.set(o,{id:o,cx:c,cz:d,count:0,materials:new Map})}const l=n.get(o);l.materials.has(a)||l.materials.set(a,[]),l.materials.get(a).push(s),l.count+=1}return[...n.values()].sort((a,r)=>a.cx-r.cx||a.cz-r.cz)}class H0{constructor(e,t={}){this.scene=e,this.palette=t.palette,this.castShadow=t.castShadow??!1,this.receiveShadow=t.receiveShadow??!0,this.geometry=t.geometry??new Mn(1,1,1),this.geometry.computeBoundingBox(),this.materialRegistry=t.materialRegistry??new G0(this.palette)}createChunkGroup(e){const t=new Ht;t.name=`voxel_chunk_${e.id}`;const n={};t.userData.voxelChunk={id:e.id,count:e.count,cx:e.cx,cz:e.cz,materialCounts:n};const a=new st,r=new C,s=new Bn,o=new C;let l=0;for(const[c,d]of e.materials.entries()){const h=this.materialRegistry.get(c);if(!h){console.warn(`Missing voxel palette color: ${c}`);continue}n[c]=d.length;const u=new uc(this.geometry,h,d.length);u.name=`voxels_${c}_chunk_${e.id}`,u.userData.voxelMaterialKey=c,u.castShadow=this.castShadow,u.receiveShadow=this.receiveShadow,u.instanceMatrix.setUsage(ar),d.forEach((p,x)=>{r.set(p.x,p.y,p.z),o.set(p.sx,p.sy,p.sz),a.compose(r,s,o),u.setMatrixAt(x,a)}),u.computeBoundingSphere(),t.add(u),l+=1}return this.scene.add(t),{group:t,meshCount:l,materialCounts:n}}}class W0{constructor(e={}){this.chunkSize=e.chunkSize??Ma,this.tier=e.tier??k0(),this.budget=e.budget??O0[this.tier],this.visibleRadius=e.visibleRadius??8,this.chunks=[],this.lastOrigin=null,this.visibleInstances=0}addChunk(e){this.chunks.push(e)}update(e){const t=e?.position??e;if(!t)return{changed:!1,visibleInstances:this.visibleInstances};const n=xo(t.x,t.z,this.chunkSize);if(this.lastOrigin&&this.lastOrigin.cx===n.cx&&this.lastOrigin.cz===n.cz)return{changed:!1,visibleInstances:this.visibleInstances};this.lastOrigin=n,this.visibleInstances=0;let a=!1;for(const r of this.chunks){const o=Sc(r,n)<=this.visibleRadius;r.group.visible!==o&&(r.group.visible=o,a=!0),o&&(this.visibleInstances+=r.count)}return{changed:a,visibleInstances:this.visibleInstances}}getStats(){const e=this.chunks.filter(t=>t.group.visible).length;return{tier:this.tier,chunkSize:this.chunkSize,chunks:this.chunks.length,visibleChunks:e,visibleInstances:this.visibleInstances,visibleInstanceCap:this.budget.visibleInstanceCap,visibleRadius:this.visibleRadius}}}const go={grass:4168527,grass2:5813855,grassDark:3109952,dirt:8017464,clay:10187602,stone:7830659,stoneDark:5200228,road:2238259,roadLight:3818064,lineWhite:15857407,lineYellow:16765286,rail:9345191,concrete:11450045,concreteDark:7371140,glass:7059670,glassDark:2312285,glassGreen:4433819,silver:13621215,steel:9871530,blackGlass:1120551,petronasTrim:15332088,merdekaGlass:3693699,merdekaTrim:16769693,klTowerWhite:15262159,klTowerRed:14171453,roofCopper:11823676,mosqueBlue:2516952,mosqueWhite:16054261,monumentBronze:9133874,treeTrunk:8015405,treeLeaf:2854730,treeLeaf2:2059583,water:1668771,trainBlue:2068205,trainYellow:16238920,trainWhite:16119802,trainWindow:1254968,station:14209732,stationRoof:5989747,plaza:12364423,redBrick:10439992,lantern:16743252,warning:16754224,mallGold:14133581,templeRed:13123381,templeGold:16764774,marketBlue:3108767,museumBrown:9067061,lampGlow:16773288,busGreen:2795638,parkPath:13154700,riverBlue:1019829,marketRed:14042437,awningStripe:16315096,palaceGold:14792797,palaceWall:15854290,caveLimestone:11972512,littleIndiaPink:14179487,pavilionRed:11738933,gatewayPurple:8346352};class X0{constructor(e,t={}){this.scene=e,this.palette=t.palette??go,this.castShadow=t.castShadow??!1,this.receiveShadow=t.receiveShadow??!0,this.instances=new Map,this.meshes=[],this.total=0,this.sectionCounts=new Map,this.currentSection="world",this.chunkSize=t.chunkSize??Ma,this.chunkManager=t.chunkManager??new W0({chunkSize:this.chunkSize})}withSection(e,t){const n=this.currentSection;this.currentSection=e;try{return t()}finally{this.currentSection=n}}addVoxel(e,t,n,a){this.addBox(e+.5,t+.5,n+.5,1,1,1,a)}addBox(e,t,n,a,r,s,o){a<=0||r<=0||s<=0||(this.instances.has(o)||this.instances.set(o,[]),this.instances.get(o).push({x:e,y:t,z:n,sx:a,sy:r,sz:s}),this.total+=1,this.sectionCounts.set(this.currentSection,(this.sectionCounts.get(this.currentSection)??0)+1))}addColumn(e,t,n,a,r){for(let s=n;s<=a;s+=1)this.addVoxel(e,s,t,r)}addVoxelBox(e,t,n,a,r,s,o){for(let l=e;l<e+a;l+=1)for(let c=t;c<t+r;c+=1)for(let d=n;d<n+s;d+=1)this.addVoxel(l,c,d,o)}addWireVoxelBox(e,t,n,a,r,s,o){for(let l=e;l<e+a;l+=1)for(let c=t;c<t+r;c+=1)for(let d=n;d<n+s;d+=1)+(l===e||l===e+a-1)+ +(c===t||c===t+r-1)+ +(d===n||d===n+s-1)>=2&&this.addVoxel(l,c,d,o)}finalize(){const e=V0(this.instances,{chunkSize:this.chunkSize}),t=new H0(this.scene,{palette:this.palette,castShadow:this.castShadow,receiveShadow:this.receiveShadow}),n=[];for(const s of e){const{group:o,meshCount:l,materialCounts:c}=t.createChunkGroup(s);this.chunkManager.addChunk({id:s.id,cx:s.cx,cz:s.cz,count:s.count,group:o,materialCounts:c}),this.meshes.push(...o.children),s.meshCount=l,n.push({id:s.id,cx:s.cx,cz:s.cz,count:s.count,meshCount:l,materialCounts:c})}const a=Object.fromEntries([...this.instances.entries()].map(([s,o])=>[s,o.length])),r=Object.fromEntries([...this.sectionCounts.entries()].sort((s,o)=>o[1]-s[1]));return this.instances.clear(),{total:this.total,meshes:this.meshes.length,chunks:e.length,chunkSize:this.chunkSize,materials:a,sections:r,chunkManifest:n,chunkManager:this.chunkManager}}}function Tc(i){let e=i>>>0;return function(){e+=1831565813;let n=e;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}function da(i,e,t=1337){let n=t^Math.imul(i,374761393)^Math.imul(e,668265263);return n=(n^n>>>13)>>>0,n=Math.imul(n,1274126177)>>>0,((n^n>>>16)>>>0)/4294967295}function Ul(i){return i*i*(3-2*i)}function Zr(i,e,t){return i+(e-i)*t}function K0(i,e,t=1337){const n=Math.floor(i),a=Math.floor(e),r=i-n,s=e-a,o=da(n,a,t),l=da(n+1,a,t),c=da(n,a+1,t),d=da(n+1,a+1,t),h=Ul(r),u=Ul(s);return Zr(Zr(o,l,h),Zr(c,d,h),u)}function Nl(i,e,t=1337,n=4){let a=.5,r=1,s=0,o=0;for(let l=0;l<n;l+=1)s+=a*K0(i*r,e*r,t+l*97),o+=a,r*=2,a*=.5;return s/o}function Ii(i,e,t){return Math.max(e,Math.min(t,i))}const Ot={minLat:2.72,maxLat:3.45,minLon:101.23,maxLon:102.02,minX:-214,maxX:214,minZ:-214,maxZ:214},q0=188;function Y0({lat:i,lon:e}){const t=(e-Ot.minLon)/(Ot.maxLon-Ot.minLon),n=(i-Ot.minLat)/(Ot.maxLat-Ot.minLat),a=r=>Math.max(Ot.minX,Math.min(Ot.maxX,r));return{x:Math.round(a(Ot.minX+t*(Ot.maxX-Ot.minX))),z:Math.round(a(Ot.minZ+n*(Ot.maxZ-Ot.minZ)))}}const j0=[{name:"Petronas Twin Towers",district:"KLCC",category:"skyline",tags:["architecture","shopping"],bestTime:"Golden Hour",note:"Twin towers, Suria KLCC, and the classic city skyline photo stop.",tip:"Walk through the park side for the broadest tower view.",x:-12,z:22},{name:"KLCC Park",district:"KLCC",category:"park",tags:["garden","family"],bestTime:"Day",note:"A landscaped city park with lake views below the towers.",tip:"Use the shaded paths when the afternoon heat builds.",x:-25,z:43},{name:"Merdeka 118",district:"Merdeka",category:"skyline",tags:["architecture"],bestTime:"Sunset",note:"A new supertall tower overlooking the historic core.",tip:"Pair it with Merdeka Square and Chinatown on foot.",x:35,z:18},{name:"KL Tower",district:"Bukit Nanas",category:"viewpoint",tags:["skyline","forest"],bestTime:"Sunset",note:"Observation tower beside the Bukit Nanas forest reserve.",tip:"Clear evenings give the best tower-to-tower skyline angle.",x:58,z:-25},{name:"Merdeka Square",district:"Colonial Core",category:"heritage",tags:["history","photography"],bestTime:"Golden Hour",note:"Civic field framed by colonial-era landmarks and flags.",tip:"Look for the city gallery and old club facades nearby.",x:0,z:-55},{name:"Sultan Abdul Samad Building",district:"Colonial Core",category:"heritage",tags:["architecture"],bestTime:"Night",note:"Moorish-style clock tower and arcades beside Merdeka Square.",tip:"Night lighting makes the facade easy to photograph.",x:0,z:-48},{name:"Masjid Jamek / River of Life",district:"Confluence",category:"heritage",tags:["mosque","river"],bestTime:"Night",note:"Historic mosque at the Klang and Gombak river meeting point.",tip:"Use respectful dress and follow mosque access signs.",x:-9,z:-38},{name:"Royal Selangor Club",district:"Colonial Core",category:"heritage",tags:["history"],bestTime:"Golden Hour",note:"Mock-Tudor club frontage facing the Padang.",tip:"Best appreciated as part of a Merdeka Square walk.",x:-12,z:-55},{name:"Petaling Street / Chinatown",district:"Chinatown",category:"market",tags:["food","heritage"],bestTime:"Night",note:"Busy market streets, temples, cafes, and old shophouses.",tip:"Keep small notes handy for snacks and market browsing.",x:-18,z:-42},{name:"Central Market",district:"Chinatown",category:"market",tags:["craft","shopping"],bestTime:"Day",note:"Indoor craft market and an easy stop for souvenirs.",tip:"Use it as a cool break during a heritage walk.",x:-20,z:-60},{name:"Jalan Alor",district:"Bukit Bintang",category:"food",tags:["night market","street food"],bestTime:"Night",note:"Open-air food street with grills, fruit, noodles, and crowds.",tip:"Arrive hungry and compare menus before sitting down.",x:23,z:-32},{name:"Bukit Bintang",district:"Golden Triangle",category:"shopping",tags:["nightlife","retail"],bestTime:"Night",note:"Central shopping and entertainment district.",tip:"Monorail stops make it easy to avoid traffic.",x:30,z:-22},{name:"Pavilion KL",district:"Bukit Bintang",category:"shopping",tags:["mall","food"],bestTime:"Day",note:"Major mall with dining, fashion, and covered walk links.",tip:"Use the KLCC pedestrian bridge for a shaded connection.",x:39,z:-18},{name:"TRX Exchange 106",district:"TRX",category:"skyline",tags:["architecture","shopping"],bestTime:"Golden Hour",note:"Financial district tower and modern retail precinct.",tip:"Good contrast with older heritage stops in one day.",x:66,z:32},{name:"Masjid Negara",district:"Lake Gardens",category:"culture",tags:["mosque","architecture"],bestTime:"Day",note:"National Mosque with a folded blue roof and minaret.",tip:"Check visitor hours and dress modestly.",x:-48,z:-32},{name:"Islamic Arts Museum",district:"Lake Gardens",category:"museum",tags:["art","architecture"],bestTime:"Day",note:"Museum known for domes, galleries, models, and textiles.",tip:"Combine with the mosque and gardens on a low-heat morning.",x:-58,z:-40},{name:"National Planetarium",district:"Lake Gardens",category:"museum",tags:["science","family"],bestTime:"Day",note:"Space science stop near the gardens and museum cluster.",tip:"Good family-friendly indoor stop when it rains.",x:-64,z:-34},{name:"Lake Gardens",district:"Perdana Botanical Garden",category:"park",tags:["garden","walking"],bestTime:"Day",note:"Large green retreat with lake paths near museums.",tip:"Start early for cooler walking weather.",x:-70,z:65},{name:"Tugu Negara",district:"Lake Gardens",category:"heritage",tags:["monument"],bestTime:"Golden Hour",note:"National monument set in a landscaped park.",tip:"Pair with Lake Gardens rather than a standalone taxi stop.",x:-70,z:43},{name:"Old Railway Station",district:"Brickfields",category:"heritage",tags:["rail","architecture"],bestTime:"Day",note:"Historic station architecture near the old city edge.",tip:"Great bridge between Chinatown and Brickfields.",x:-36,z:-58},{name:"National Museum",district:"Brickfields",category:"museum",tags:["history"],bestTime:"Day",note:"Introductory stop for Malaysian history and culture.",tip:"Visit before exploring regional highlights.",x:-58,z:-66},{name:"Little India Brickfields",district:"Brickfields",category:"culture",tags:["food","shops"],bestTime:"Day",note:"Colorful shops, snacks, textiles, and South Asian culture.",tip:"Try sweets or banana leaf rice nearby.",x:-55,z:-74},{name:"Thean Hou Temple",district:"Seputeh",category:"culture",tags:["temple","viewpoint"],bestTime:"Golden Hour",note:"Layered Chinese temple with lanterns and city views.",tip:"Use a ride-hail or taxi unless you enjoy hilly walks.",x:-75,z:-20},{name:"Istana Negara",district:"Jalan Duta",category:"heritage",tags:["palace"],bestTime:"Day",note:"Royal palace gateway and formal photo stop.",tip:"Viewing is from the gate area; respect restricted zones.",x:-86,z:10},{name:"Batu Caves Gateway",district:"Gombak Gateway",category:"excursion",tags:["temple","limestone"],bestTime:"Day",note:"Gateway pad for the limestone caves north of KL.",tip:"Morning visits are cooler for the stair climb.",x:82,z:68},{name:"Kampung Baru",district:"Kampung Baru",category:"food",tags:["village","night food"],bestTime:"Night",note:"Traditional Malay village atmosphere near the skyline.",tip:"Look for nasi lemak and satay while watching the towers.",x:-35,z:8},{name:"Chow Kit Market",district:"Chow Kit",category:"market",tags:["wet market","local life"],bestTime:"Day",note:"Local market energy, produce, textiles, and street scenes.",tip:"Go early, watch your footing, and ask before close photos.",x:-44,z:-12},{name:"LRT / MRT Hub",district:"Transit Core",category:"transit",tags:["rail","fast travel"],bestTime:"Anytime",note:"Stylized interchange for exploring the map by rail.",tip:"Use fast travel to sample districts quickly.",x:18,z:22},{name:"Penang George Town Gateway",district:"Malaysia Highlights",category:"gateway",tags:["unesco","food"],bestTime:"Day",note:"Off-map highlight for murals, clan houses, and hawker food.",tip:"Plan at least two nights for food and heritage lanes.",x:188,z:92},{name:"Langkawi Gateway",district:"Malaysia Highlights",category:"gateway",tags:["island","nature"],bestTime:"Day",note:"Off-map highlight for beaches, mangroves, and cable car views.",tip:"Check ferry and flight timing before booking island hops.",x:188,z:72},{name:"Malacca Gateway",district:"Malaysia Highlights",category:"gateway",tags:["unesco","history"],bestTime:"Golden Hour",note:"Off-map highlight for river walks and layered colonial history.",tip:"Weekend traffic can be heavy; start early from KL.",x:188,z:52},{name:"Cameron Highlands Gateway",district:"Malaysia Highlights",category:"gateway",tags:["tea","highlands"],bestTime:"Day",note:"Off-map highlight for tea plantations and cool weather.",tip:"Pack a light layer and expect winding roads.",x:188,z:32},{name:"Taman Negara Gateway",district:"Malaysia Highlights",category:"gateway",tags:["rainforest","river"],bestTime:"Day",note:"Off-map highlight for rainforest walks and river travel.",tip:"Use proper shoes and book transfers in advance.",x:188,z:12},{name:"Kinabalu Gateway",district:"Malaysia Highlights",category:"gateway",tags:["borneo","mountain"],bestTime:"Day",note:"Off-map highlight for Sabah, Mount Kinabalu, and parks.",tip:"Altitude and permits matter if climbing.",x:188,z:-8},{name:"Perhentian Islands Gateway",district:"Malaysia Highlights",category:"gateway",tags:["snorkeling","islands"],bestTime:"Day",note:"Off-map highlight for clear water and beach stays.",tip:"Seasonality matters; monsoon closures can affect boats.",x:188,z:-28},{name:"Putrajaya Gateway",district:"Malaysia Highlights",category:"gateway",tags:["architecture","lake"],bestTime:"Sunset",note:"Off-map highlight for bridges, lakefront, and civic buildings.",tip:"Best as a half-day from KL or KLIA transfer stop.",x:188,z:-58},{name:"Sepang / KLIA Gateway",district:"Malaysia Highlights",category:"gateway",tags:["airport","motorsport"],bestTime:"Anytime",note:"Gateway for airport travel and Sepang circuit events.",tip:"Budget extra time for airport transfers.",x:188,z:-82},{name:"Putrajaya Lake & Mosque",district:"Putrajaya",category:"excursion",tags:["architecture","lake","mosque"],bestTime:"Sunset",note:"Civic lakefront, pink mosque silhouette, bridges, and broad ceremonial avenues south of KL.",tip:"Best by train or ride-hail as a half-day paired with KLIA.",x:132,z:-136},{name:"Sunway Lagoon & Pyramid",district:"Sunway",category:"family",tags:["theme park","shopping"],bestTime:"Day",note:"Theme park, mall, resort cluster, and a strong family day-trip option.",tip:"Bring swim gear and plan for a full day if entering the park.",x:-156,z:-126},{name:"Shah Alam Blue Mosque",district:"Shah Alam",category:"culture",tags:["mosque","architecture"],bestTime:"Golden Hour",note:"Large blue-domed mosque and state capital civic area west of KL.",tip:"Check visitor hours and dress rules before going.",x:-184,z:-38},{name:"Genting Highlands Gateway",district:"Highlands",category:"excursion",tags:["highlands","theme park"],bestTime:"Day",note:"Cool mountain resort, cable car, views, and indoor/outdoor attractions.",tip:"Weather changes quickly; bring a light layer.",x:148,z:162},{name:"FRIM Forest Reserve",district:"Kepong",category:"nature",tags:["forest","walking"],bestTime:"Day",note:"Forest trails and shade north-west of the city, good for a greenery reset.",tip:"Start early and use shoes with grip after rain.",x:-138,z:128},{name:"Zoo Negara",district:"Ampang / Ulu Klang",category:"family",tags:["zoo","family"],bestTime:"Day",note:"National zoo stop on the eastern side of Kuala Lumpur.",tip:"Go early for cooler walking and more active animals.",x:142,z:68},{name:"Ampang Lookout Ridge",district:"Ampang",category:"viewpoint",tags:["skyline","hill"],bestTime:"Night",note:"Eastern ridge viewpoint zone for a wide KL skyline impression.",tip:"Use safe, well-lit viewpoints and check road access.",x:126,z:18},{name:"Bangsar Village",district:"Bangsar",category:"food",tags:["cafes","nightlife"],bestTime:"Night",note:"Neighbourhood dining, cafes, and nightlife west of the central rail hub.",tip:"Good dinner district after Brickfields or Mid Valley.",x:-94,z:-108},{name:"Mid Valley Megamall",district:"Mid Valley",category:"shopping",tags:["mall","food"],bestTime:"Day",note:"Large mall and transit-adjacent retail cluster between Bangsar and Seputeh.",tip:"Useful rainy-day stop with many food choices.",x:-82,z:-88},{name:"Mont Kiara Dining Cluster",district:"Mont Kiara",category:"food",tags:["cafes","expat"],bestTime:"Night",note:"Dining and cafe cluster north-west of the city centre.",tip:"Ride-hail is usually easier than rail for this zone.",x:-92,z:92},{name:"Damansara Arts & Cafes",district:"Damansara",category:"culture",tags:["cafes","creative"],bestTime:"Day",note:"Neighbourhood creative, cafe, and shopping corridor beyond the immediate core.",tip:"Treat it as a local-life extension rather than a first-day must-see.",x:-148,z:42},{name:"Klang Royal Town",district:"Klang",category:"heritage",tags:["royal town","food"],bestTime:"Day",note:"Royal town heritage and famous bak kut teh corridor toward the coast.",tip:"Best as a food-led side trip from KL or Shah Alam.",x:-204,z:-88},{name:"Port Klang Coastal Gate",district:"Port Klang",category:"gateway",tags:["coast","ferry"],bestTime:"Day",note:"Coastal and ferry gateway west of the Klang Valley.",tip:"Check ferry schedules and return times before committing.",x:-210,z:-150},{name:"Kajang Satay Town",district:"Kajang",category:"food",tags:["satay","local food"],bestTime:"Night",note:"Food side trip known for satay and a more local town feel.",tip:"Evening works well, but traffic can stretch travel time.",x:68,z:-184},{name:"Cyberjaya Tech Garden",district:"Cyberjaya",category:"modern",tags:["tech","parks"],bestTime:"Day",note:"Tech-city landscape near Putrajaya with lakes, campuses, and broad roads.",tip:"Pair with Putrajaya instead of making a standalone trip.",x:114,z:-168},{name:"Broga Hill Sunrise",district:"Semenyih",category:"nature",tags:["hiking","sunrise"],bestTime:"Golden Hour",note:"Hiking gateway south-east of KL, represented as a sunrise ridge.",tip:"Start before dawn only with proper lights, shoes, and weather checks.",x:154,z:-202},{name:"Kuala Selangor Fireflies",district:"Kuala Selangor",category:"nature",tags:["river","wildlife"],bestTime:"Night",note:"Evening river firefly excursion and seafood side trip from the Klang Valley.",tip:"Book boats ahead and avoid bright phone lights on the river.",x:-204,z:152},{name:"Rawang Forest Gateway",district:"Rawang",category:"nature",tags:["forest","waterfall"],bestTime:"Day",note:"Northern green gateway for forest, waterfall, and road-trip style outings.",tip:"Check trail access and avoid storms.",x:-44,z:184},{name:"Setia City Park",district:"Setia Alam",category:"park",tags:["park","family"],bestTime:"Day",note:"Outer Klang Valley family park and mall-side green space.",tip:"Good relaxed stop if exploring Shah Alam and Klang.",x:-196,z:18},{name:"i-City Shah Alam",district:"Shah Alam",category:"family",tags:["lights","theme park"],bestTime:"Night",note:"Lightscape and family attraction zone in Shah Alam.",tip:"Night is the point here; combine with food nearby.",x:-176,z:-8},{name:"Sultan Alam Shah Museum",district:"Shah Alam",category:"museum",tags:["history","culture"],bestTime:"Day",note:"State museum stop near the Shah Alam civic district.",tip:"Pair with the Blue Mosque for a slower cultural loop.",x:-190,z:-20},{name:"Subang Airport Heritage Strip",district:"Subang",category:"transit",tags:["airport","aviation"],bestTime:"Day",note:"Old airport-side gateway and aviation corridor west of KL.",tip:"Useful mental marker for the PJ/Subang side of the valley.",x:-146,z:-62},{name:"SS15 Food Street",district:"Subang Jaya",category:"food",tags:["cafes","local food"],bestTime:"Night",note:"Student-town food, bubble tea, cafes, and quick local meals.",tip:"Good casual dinner district after Sunway.",x:-136,z:-92},{name:"USJ Taipan",district:"USJ",category:"food",tags:["shops","food"],bestTime:"Night",note:"Suburban food and shoplot cluster south-west of KL.",tip:"A local-life stop rather than a postcard landmark.",x:-126,z:-116},{name:"Puchong IOI Boulevard",district:"Puchong",category:"food",tags:["shops","night food"],bestTime:"Night",note:"Busy suburban food and retail corridor.",tip:"Use this as a bridge between Sunway and Putrajaya.",x:-78,z:-150},{name:"Seri Kembangan Food Quarter",district:"Seri Kembangan",category:"food",tags:["local food"],bestTime:"Night",note:"Suburban dinner belt south of KL.",tip:"Best treated as a food detour from the south corridor.",x:4,z:-168},{name:"Mines Lake",district:"Seri Kembangan",category:"park",tags:["lake","mall"],bestTime:"Day",note:"Lake and mall district on the southern corridor.",tip:"Use as a softer stop before Kajang or Putrajaya.",x:24,z:-150},{name:"IOI City Mall",district:"Putrajaya / Serdang",category:"shopping",tags:["mall","family"],bestTime:"Day",note:"Huge mall between Putrajaya and the south Klang Valley.",tip:"A practical rainy-day mega mall stop.",x:88,z:-144},{name:"Putrajaya Pink Mosque",district:"Putrajaya",category:"culture",tags:["mosque","architecture"],bestTime:"Sunset",note:"Masjid Putra on the lakefront civic axis.",tip:"Dress modestly and check visitor access windows.",x:124,z:-126},{name:"Putrajaya Bridge Promenade",district:"Putrajaya",category:"viewpoint",tags:["bridge","lake"],bestTime:"Sunset",note:"Bridge and lake promenade viewpoint for Putrajaya architecture.",tip:"Evening light makes the lake and bridges work better.",x:144,z:-126},{name:"Dengkil Kampung Food",district:"Dengkil",category:"food",tags:["kampung","food"],bestTime:"Night",note:"Small-town food stop near Cyberjaya and KLIA routes.",tip:"Good if you want less polished local atmosphere.",x:142,z:-172},{name:"Sepang Circuit",district:"Sepang",category:"excursion",tags:["motorsport"],bestTime:"Day",note:"Motorsport circuit gateway near KLIA.",tip:"Check event calendars before going.",x:176,z:-116},{name:"KLIA Terminal Gateway",district:"Sepang / KLIA",category:"transit",tags:["airport"],bestTime:"Anytime",note:"Main international airport gateway for Malaysia trips.",tip:"Leave buffer for terminal transfers and check-in.",x:198,z:-106},{name:"Nilai Outlet Corridor",district:"Nilai",category:"shopping",tags:["outlet","airport route"],bestTime:"Day",note:"Outlet and airport-side shopping corridor south of KL.",tip:"Works best before or after airport travel.",x:134,z:-206},{name:"Cheras Leisure Mall",district:"Cheras",category:"shopping",tags:["mall","local"],bestTime:"Day",note:"Cheras neighbourhood retail and food marker.",tip:"A local urban stop south-east of the centre.",x:74,z:-96},{name:"Taman Connaught Night Market",district:"Cheras",category:"market",tags:["night market","food"],bestTime:"Night",note:"Long pasar malam-style food and shopping strip.",tip:"Go hungry and expect crowds.",x:82,z:-120},{name:"Ampang Korean Village",district:"Ampang",category:"food",tags:["korean food","local"],bestTime:"Night",note:"Dining enclave east of KL with Korean restaurants and local options.",tip:"Good dinner extension after KLCC or Zoo Negara.",x:112,z:-8},{name:"Ulu Klang Ridge Trail",district:"Ulu Klang",category:"nature",tags:["trail","views"],bestTime:"Golden Hour",note:"Ridge and hill-view marker on the eastern edge.",tip:"Avoid storms and use proper shoes.",x:156,z:26},{name:"Melawati Food & Hills",district:"Taman Melawati",category:"food",tags:["hills","food"],bestTime:"Night",note:"Food and hill-neighbourhood marker near Zoo Negara.",tip:"Nice pairing with the eastern family/nature stops.",x:158,z:88},{name:"Gombak Transit Gate",district:"Gombak",category:"transit",tags:["rail","gateway"],bestTime:"Anytime",note:"Northern/eastern transit gateway toward Batu Caves and highlands.",tip:"Use it as a staging point for outer excursions.",x:104,z:112},{name:"Selayang Market",district:"Selayang",category:"market",tags:["wholesale","local life"],bestTime:"Day",note:"Large market area north of KL.",tip:"Go early and expect a working-market feel.",x:48,z:142},{name:"Kepong Food Row",district:"Kepong",category:"food",tags:["local food"],bestTime:"Night",note:"Northern food district with a strong local following.",tip:"Good dinner stop after FRIM.",x:-88,z:126},{name:"Desa ParkCity Lake",district:"Desa ParkCity",category:"park",tags:["lake","family"],bestTime:"Day",note:"Lake, walking paths, cafes, and pet-friendly public life.",tip:"A calm break between Kepong and Mont Kiara.",x:-88,z:74},{name:"Publika Arts Mall",district:"Dutamas",category:"culture",tags:["arts","cafes"],bestTime:"Day",note:"Arts, cafes, weekend markets, and creative retail.",tip:"Pair with Mont Kiara rather than central KL icons.",x:-74,z:58},{name:"Sentul Depot",district:"Sentul",category:"culture",tags:["events","heritage"],bestTime:"Day",note:"Industrial heritage and event space marker north of the core.",tip:"Check event listings first.",x:-36,z:72},{name:"Titiwangsa Lake Gardens",district:"Titiwangsa",category:"park",tags:["lake","skyline"],bestTime:"Golden Hour",note:"Lake park with skyline views back toward the towers.",tip:"Excellent sunset skyline angle.",x:8,z:82},{name:"Wangsa Maju Town Centre",district:"Wangsa Maju",category:"food",tags:["student food","shops"],bestTime:"Night",note:"Dense local town centre north-east of KL.",tip:"Good affordable food stop.",x:76,z:78},{name:"Setapak Food Quarter",district:"Setapak",category:"food",tags:["local food"],bestTime:"Night",note:"Student and neighbourhood food district north-east of KL.",tip:"A practical food marker between Titiwangsa and Wangsa Maju.",x:52,z:62},{name:"PJ Old Town",district:"Petaling Jaya",category:"heritage",tags:["old town","food"],bestTime:"Day",note:"Older Petaling Jaya town fabric and food streets.",tip:"Works as a bridge from KL to Subang/Sunway.",x:-122,z:-62},{name:"Section 17 Market",district:"Petaling Jaya",category:"market",tags:["market","local food"],bestTime:"Day",note:"Neighbourhood market and food district in PJ.",tip:"Morning is better for market texture.",x:-114,z:-34},{name:"TTDI Market",district:"TTDI",category:"market",tags:["wet market","cafes"],bestTime:"Day",note:"Market and cafe district near the north-west city edge.",tip:"Good local breakfast zone.",x:-126,z:22},{name:"1 Utama & Bandar Utama",district:"Bandar Utama",category:"shopping",tags:["mall","family"],bestTime:"Day",note:"Huge mall and PJ retail district.",tip:"Better as a suburban shopping day than a central sightseeing stop.",x:-156,z:12},{name:"Mutiara Damansara Curve",district:"Mutiara Damansara",category:"shopping",tags:["mall","cafes"],bestTime:"Day",note:"Retail and cafe cluster near Damansara.",tip:"Pair with 1 Utama or TTDI.",x:-168,z:42},{name:"Bukit Jelutong Park",district:"Bukit Jelutong",category:"park",tags:["park","suburb"],bestTime:"Day",note:"Leafy suburb and park marker between Shah Alam and Subang.",tip:"A green pause in the western ring.",x:-164,z:-42},{name:"Klang Little India",district:"Klang",category:"culture",tags:["shops","food"],bestTime:"Day",note:"Textile, food, and culture strip in Klang town.",tip:"Pair with Klang Royal Town and food stops.",x:-198,z:-72},{name:"Pulau Ketam Ferry Gate",district:"Port Klang",category:"gateway",tags:["ferry","island"],bestTime:"Day",note:"Ferry gateway toward Pulau Ketam from the coast.",tip:"Check tide and ferry timing.",x:-210,z:-126},{name:"Morib Beach Gateway",district:"Banting Coast",category:"gateway",tags:["beach","coast"],bestTime:"Sunset",note:"Coastal day-trip marker south-west of Klang Valley.",tip:"More local coast than tropical island.",x:-186,z:-198},{name:"Banting Food Stop",district:"Banting",category:"food",tags:["small town","food"],bestTime:"Night",note:"Small-town food stop on the coastward route.",tip:"Useful if extending toward Morib.",x:-148,z:-188},{name:"Janda Baik Gateway",district:"Bentong Foothills",category:"nature",tags:["river","retreat"],bestTime:"Day",note:"Foothill retreat gateway beyond Gombak and Genting routes.",tip:"Book stays and transport ahead.",x:178,z:190},{name:"Bukit Tinggi Village Gate",district:"Bentong Foothills",category:"gateway",tags:["highlands","village"],bestTime:"Day",note:"Highland village gateway east of KL.",tip:"Pair with Genting or Janda Baik style trips.",x:204,z:166},{name:"Rawang Waterfall Gate",district:"Rawang",category:"nature",tags:["waterfall","forest"],bestTime:"Day",note:"Northern forest-waterfall excursion marker.",tip:"Avoid after heavy rain.",x:-28,z:206},{name:"Sungai Buloh Nursery Belt",district:"Sungai Buloh",category:"park",tags:["plants","local"],bestTime:"Day",note:"Plant nursery and suburban green corridor.",tip:"Good for a quiet local detour.",x:-104,z:150},{name:"Elmina Rainbow Bridge",district:"Elmina",category:"viewpoint",tags:["bridge","photo"],bestTime:"Golden Hour",note:"Photo-friendly suburban bridge marker north-west of Shah Alam.",tip:"Go for quick photos, not a long visit.",x:-176,z:84},{name:"Sasaran Sky Mirror Gate",district:"Kuala Selangor Coast",category:"gateway",tags:["coast","photo"],bestTime:"Day",note:"Coastal photo excursion gateway beyond Kuala Selangor.",tip:"Highly tide-dependent; book operators carefully.",x:-214,z:186},{name:"Bukit Melawati",district:"Kuala Selangor",category:"heritage",tags:["hill","history"],bestTime:"Golden Hour",note:"Hilltop heritage marker near Kuala Selangor.",tip:"Pair with seafood and fireflies.",x:-190,z:134},{name:"Selangor River Seafood",district:"Kuala Selangor",category:"food",tags:["seafood","river"],bestTime:"Night",note:"River seafood stop tied to the firefly excursion area.",tip:"Evening works well before boat rides.",x:-210,z:124},{name:"Batu Caves Temple Steps",district:"Gombak",category:"culture",tags:["temple","limestone"],bestTime:"Day",note:"Main cave-temple stair climb marker north of KL.",tip:"Respect temple rules and watch belongings around monkeys.",x:88,z:92},{name:"Kanching Falls",district:"Rawang / Selayang",category:"nature",tags:["waterfall","forest"],bestTime:"Day",note:"Waterfall park gateway north of the city.",tip:"Go early and avoid slippery rocks after rain.",x:18,z:176},{name:"Templer Park",district:"Rawang / Selayang",category:"nature",tags:["forest","picnic"],bestTime:"Day",note:"Forest park and picnic marker north of KL.",tip:"Works with Kanching or Rawang as a nature loop.",x:12,z:156},{name:"Bukit Kiara Trails",district:"TTDI / Kiara",category:"nature",tags:["trail","cycling"],bestTime:"Day",note:"Urban forest trail marker between TTDI and Mont Kiara.",tip:"Use proper shoes and respect trail users.",x:-104,z:44},{name:"Rimba Ilmu UM",district:"University Malaya",category:"nature",tags:["botanical","education"],bestTime:"Day",note:"Botanical and education-oriented green marker near UM.",tip:"Check public access before visiting.",x:-94,z:-48},{name:"KL Gateway Mall",district:"Kerinchi",category:"shopping",tags:["mall","transit"],bestTime:"Day",note:"Transit-linked mall marker between Bangsar South and PJ.",tip:"Useful connector rather than a destination.",x:-80,z:-62},{name:"Bangsar South Business Park",district:"Bangsar South",category:"modern",tags:["business","food"],bestTime:"Day",note:"Modern office, food, and transit district south-west of KL.",tip:"Good for cafes and practical stops.",x:-74,z:-76},{name:"Saloma Bridge",district:"Kampung Baru / KLCC",category:"viewpoint",tags:["bridge","photo"],bestTime:"Night",note:"Pedestrian bridge linking Kampung Baru to KLCC views.",tip:"Night lighting gives the strongest photo effect.",x:-22,z:8},{name:"RexKL",district:"Chinatown",category:"culture",tags:["creative","food"],bestTime:"Day",note:"Creative reuse space with books, food, and events in Chinatown.",tip:"Check pop-ups and weekend events.",x:-12,z:-46},{name:"Kwong Tong Cemetery View",district:"Sungai Besi Edge",category:"heritage",tags:["history","hill"],bestTime:"Golden Hour",note:"Historic hillside marker on the southern city edge.",tip:"Be respectful; it is not a theme-park stop.",x:42,z:-84},{name:"National Stadium Bukit Jalil",district:"Bukit Jalil",category:"sports",tags:["stadium","events"],bestTime:"Night",note:"Major stadium and event precinct south of KL.",tip:"Check event days and rail crowding.",x:36,z:-126},{name:"Bukit Jalil Park",district:"Bukit Jalil",category:"park",tags:["park","walking"],bestTime:"Day",note:"Large park marker near the stadium precinct.",tip:"Morning and evening are most comfortable.",x:18,z:-126}],$0={"Petronas Twin Towers":{lat:3.1579,lon:101.7116},"KLCC Park":{lat:3.1553,lon:101.7141},"Merdeka 118":{lat:3.1417,lon:101.7006},"KL Tower":{lat:3.1528,lon:101.7033},"Merdeka Square":{lat:3.1478,lon:101.6937},"Sultan Abdul Samad Building":{lat:3.1486,lon:101.6941},"Masjid Jamek / River of Life":{lat:3.1489,lon:101.6968},"Royal Selangor Club":{lat:3.1474,lon:101.6931},"Petaling Street / Chinatown":{lat:3.1442,lon:101.6979},"Central Market":{lat:3.1459,lon:101.6955},"Jalan Alor":{lat:3.1467,lon:101.7087},"Bukit Bintang":{lat:3.1461,lon:101.711},"Pavilion KL":{lat:3.1491,lon:101.7135},"TRX Exchange 106":{lat:3.1426,lon:101.7194},"Masjid Negara":{lat:3.1416,lon:101.6915},"Islamic Arts Museum":{lat:3.1423,lon:101.6893},"National Planetarium":{lat:3.1396,lon:101.6885},"Lake Gardens":{lat:3.1437,lon:101.684},"Tugu Negara":{lat:3.149,lon:101.6839},"Old Railway Station":{lat:3.1395,lon:101.6935},"National Museum":{lat:3.1378,lon:101.6869},"Little India Brickfields":{lat:3.1307,lon:101.686},"Thean Hou Temple":{lat:3.1216,lon:101.6877},"Istana Negara":{lat:3.1589,lon:101.6669},"Batu Caves Gateway":{lat:3.2379,lon:101.684},"Kampung Baru":{lat:3.1647,lon:101.706},"Chow Kit Market":{lat:3.1672,lon:101.6984},"LRT / MRT Hub":{lat:3.1448,lon:101.6957},"Putrajaya Lake & Mosque":{lat:2.936,lon:101.6901},"Sunway Lagoon & Pyramid":{lat:3.071,lon:101.605},"Shah Alam Blue Mosque":{lat:3.0789,lon:101.5197},"Genting Highlands Gateway":{lat:3.4239,lon:101.7933},"FRIM Forest Reserve":{lat:3.235,lon:101.6346},"Zoo Negara":{lat:3.2073,lon:101.7582},"Ampang Lookout Ridge":{lat:3.148,lon:101.7748},"Bangsar Village":{lat:3.1288,lon:101.67},"Mid Valley Megamall":{lat:3.1186,lon:101.677},"Mont Kiara Dining Cluster":{lat:3.169,lon:101.65},"Damansara Arts & Cafes":{lat:3.153,lon:101.613},"Klang Royal Town":{lat:3.0449,lon:101.4456},"Port Klang Coastal Gate":{lat:3,lon:101.392},"Kajang Satay Town":{lat:2.9935,lon:101.787},"Cyberjaya Tech Garden":{lat:2.9225,lon:101.6559},"Broga Hill Sunrise":{lat:2.938,lon:101.9},"Kuala Selangor Fireflies":{lat:3.34,lon:101.25},"Rawang Forest Gateway":{lat:3.3213,lon:101.5767},"Setia City Park":{lat:3.1108,lon:101.4609},"i-City Shah Alam":{lat:3.0657,lon:101.4846},"Sultan Alam Shah Museum":{lat:3.073,lon:101.518},"Subang Airport Heritage Strip":{lat:3.1306,lon:101.5497},"SS15 Food Street":{lat:3.0755,lon:101.5881},"USJ Taipan":{lat:3.0472,lon:101.59},"Puchong IOI Boulevard":{lat:3.0467,lon:101.6177},"Seri Kembangan Food Quarter":{lat:3.022,lon:101.705},"Mines Lake":{lat:3.029,lon:101.715},"IOI City Mall":{lat:2.9705,lon:101.7139},"Putrajaya Pink Mosque":{lat:2.9357,lon:101.6905},"Putrajaya Bridge Promenade":{lat:2.9305,lon:101.6918},"Dengkil Kampung Food":{lat:2.863,lon:101.68},"Sepang Circuit":{lat:2.76,lon:101.738},"KLIA Terminal Gateway":{lat:2.7456,lon:101.7072},"Nilai Outlet Corridor":{lat:2.8178,lon:101.7983},"Cheras Leisure Mall":{lat:3.0905,lon:101.7426},"Taman Connaught Night Market":{lat:3.0828,lon:101.737},"Ampang Korean Village":{lat:3.1545,lon:101.7609},"Ulu Klang Ridge Trail":{lat:3.208,lon:101.785},"Melawati Food & Hills":{lat:3.2145,lon:101.747},"Gombak Transit Gate":{lat:3.2319,lon:101.7245},"Selayang Market":{lat:3.252,lon:101.653},"Kepong Food Row":{lat:3.214,lon:101.637},"Desa ParkCity Lake":{lat:3.186,lon:101.6305},"Publika Arts Mall":{lat:3.1718,lon:101.6661},"Sentul Depot":{lat:3.184,lon:101.69},"Titiwangsa Lake Gardens":{lat:3.1772,lon:101.7044},"Wangsa Maju Town Centre":{lat:3.2057,lon:101.7315},"Setapak Food Quarter":{lat:3.198,lon:101.717},"PJ Old Town":{lat:3.0852,lon:101.6462},"Section 17 Market":{lat:3.123,lon:101.635},"TTDI Market":{lat:3.14,lon:101.629},"1 Utama & Bandar Utama":{lat:3.15,lon:101.615},"Mutiara Damansara Curve":{lat:3.157,lon:101.609},"Bukit Jelutong Park":{lat:3.098,lon:101.536},"Klang Little India":{lat:3.043,lon:101.448},"Pulau Ketam Ferry Gate":{lat:3.001,lon:101.392},"Morib Beach Gateway":{lat:2.746,lon:101.442},"Banting Food Stop":{lat:2.813,lon:101.501},"Janda Baik Gateway":{lat:3.316,lon:101.854},"Bukit Tinggi Village Gate":{lat:3.349,lon:101.826},"Rawang Waterfall Gate":{lat:3.342,lon:101.596},"Sungai Buloh Nursery Belt":{lat:3.211,lon:101.565},"Elmina Rainbow Bridge":{lat:3.163,lon:101.519},"Sasaran Sky Mirror Gate":{lat:3.35,lon:101.248},"Bukit Melawati":{lat:3.3417,lon:101.2469},"Selangor River Seafood":{lat:3.336,lon:101.252},"Batu Caves Temple Steps":{lat:3.2379,lon:101.684},"Kanching Falls":{lat:3.299,lon:101.624},"Templer Park":{lat:3.287,lon:101.653},"Bukit Kiara Trails":{lat:3.143,lon:101.644},"Rimba Ilmu UM":{lat:3.129,lon:101.657},"KL Gateway Mall":{lat:3.112,lon:101.665},"Bangsar South Business Park":{lat:3.111,lon:101.667},"Saloma Bridge":{lat:3.1602,lon:101.7079},RexKL:{lat:3.1429,lon:101.6972},"Kwong Tong Cemetery View":{lat:3.114,lon:101.706},"National Stadium Bukit Jalil":{lat:3.0548,lon:101.6912},"Bukit Jalil Park":{lat:3.061,lon:101.674}},Xi=j0.map(i=>{if(i.district==="Malaysia Highlights")return{...i,isSchematicGateway:!0,schematicX:q0,schematicZ:i.z};const e=$0[i.name];return e?{...i,...Y0(e),lat:e.lat,lon:e.lon,coordinateSource:"latLon"}:{...i,coordinateSource:"schematic"}}),Z0=[{name:"KLCC and Golden Triangle",summary:"Towers, parks, malls, nightlife, and modern skyline stops."},{name:"Heritage Core",summary:"Merdeka Square, river confluence, Chinatown, markets, and colonial architecture."},{name:"Lake Gardens and Museums",summary:"Mosque, museums, planetarium, monument, and shaded gardens."},{name:"Brickfields and Transit",summary:"Rail heritage, Little India, museum access, and interchanges."},{name:"Greater Klang Valley",summary:"Satellite districts, family parks, food towns, forest reserves, and airport-side day trips."},{name:"Petaling Jaya / Subang / Sunway",summary:"PJ markets, malls, Subang food streets, Sunway attractions, and suburban local life."},{name:"Shah Alam / Klang / Coast",summary:"Blue Mosque, royal Klang, coastal ferry gates, fireflies, seafood, and beaches."},{name:"Putrajaya / Cyberjaya / South Corridor",summary:"Civic lakefront, tech city, airport, Sepang, Kajang, and southern food stops."},{name:"North & East Nature Ring",summary:"FRIM, Kepong, Rawang, Selayang, Gombak, Ampang, Genting, and foothill escapes."},{name:"Malaysia Highlights",summary:"Gateway pads for trip planning beyond the KL map."}],J0=["Carry water and plan outdoor walks around heat and afternoon rain.","Use rail for KLCC, Bukit Bintang, Chinatown, and Brickfields when traffic is heavy.","Dress modestly for mosque and temple visits, and remove shoes where requested.","Ask before close-up market photos and keep valuables secure in crowds.","Use ride-hail or taxis for hilly or off-rail stops such as Thean Hou Temple."],Q0=["Kuala Lumpur grew around the Klang and Gombak river confluence.","The city mixes Malay, Chinese, Indian, Islamic, colonial, and contemporary architecture.","Night markets and food streets are major parts of local urban life.","Malaysia highlights often require separate travel planning because the country spans Peninsular Malaysia and Borneo."],ex=[{term:"Masjid",meaning:"Mosque."},{term:"Jalan",meaning:"Road or street."},{term:"Kampung",meaning:"Village."},{term:"Pasar",meaning:"Market."},{term:"Merdeka",meaning:"Independence."}],zt=-220,Gt=220,tx=Gt-zt+1,nx=new Map(Xi.map(i=>[i.name,i]));function Re(i,e){const t=nx.get(i);return t?{x:t.x,z:t.z}:e}function xe(i,e,t){const n=Re(i,t);return new C(n.x,e,n.z)}function Fl(i,e){return`${i},${e}`}function Rn(i,e,t){return Math.floor(e+i()*(t-e+1))}function Ec(i,e,t,n){return Math.hypot(i-t,e-n)}function wc(i,e,t,n){return t.some(a=>Ec(i,e,a.x,a.z)<n)}function Dn(i,e,t,n,a=4){const r=e.surfaceYAt(t,n);i.addBox(t,r+a/2,n,.7,a,.7,"treeTrunk"),i.addBox(t,r+a+.8,n,3.4,1.2,3.4,"treeLeaf"),i.addBox(t,r+a+1.4,n,2.1,1.1,2.1,"treeLeaf2"),i.addBox(t,r+a+.4,n,4.8,.55,1.2,"treeLeaf"),i.addBox(t,r+a+.4,n,1.2,.55,4.8,"treeLeaf")}function In(i,e,t,n,a=1,r=1,s="road"){const o=e.surfaceYAt(t,n)+.04;i.addBox(t+.5,o,n+.5,a,.08,r,s)}function Vt(i,e,t,n,a=5){const r=Math.sign(n.x-t.x),s=Math.sign(n.z-t.z),o=Math.max(Math.abs(n.x-t.x),Math.abs(n.z-t.z)),l=Math.floor(a/2);for(let c=0;c<=o;c+=1){const d=t.x+r*c,h=t.z+s*c;if(Math.abs(r)>0){for(let u=-l;u<=l;u+=1)In(i,e,d,h+u);c%7===0&&In(i,e,d,h,.9,.18,"lineWhite")}else{for(let u=-l;u<=l;u+=1)In(i,e,d+u,h);c%7===0&&In(i,e,d,h,.18,.9,"lineWhite")}}}function Pt(i,e,t,n,a,r,s="plaza"){const o=Math.floor(t-a/2),l=Math.floor(n-r/2);for(let c=o;c<o+a;c+=1)for(let d=l;d<l+r;d+=1){const h=(c+d)%2===0?s:"concrete",u=e.surfaceYAt(c,d)+.05;i.addBox(c+.5,u,d+.5,1,.09,1,h)}}function ix(i,e,t,n,a,r,s,o,l="glassDark"){for(let c=1;c<s;c+=2){const d=r+c*o;i.addBox(e+n/2,d,t-.06,Math.max(1,n-1),.42,.08,l),i.addBox(e+n/2,d,t+a+.06,Math.max(1,n-1),.42,.08,l),i.addBox(e-.06,d,t+a/2,.08,.42,Math.max(1,a-1),l),i.addBox(e+n+.06,d,t+a/2,.08,.42,Math.max(1,a-1),l)}}function va(i,e,t,n,a,r,s,o,l="glassDark"){const c=e.surfaceYAt(t+a/2,n+r/2),d=2,h=Math.max(2,Math.floor(s/d)),u=h*d;i.addBox(t+a/2,c+u/2,n+r/2,a,u,r,o),i.addBox(t+a/2,c+u+.25,n+r/2,a+.6,.5,r+.6,"concreteDark"),ix(i,t,n,a,r,c+.9,h,d,l),u>24&&i.addBox(t+a/2,c+u+2,n+r/2,Math.max(1.5,a*.38),3.5,Math.max(1.5,r*.38),"steel")}function Bl(i,e,t,n){for(let r=0;r<70;r+=2){const s=r/70,o=s<.38?7:s<.67?6:s<.86?5:4,l=r%8===0?"petronasTrim":"silver";i.addBox(t,e+r+1,n,o,2,o,"glass"),i.addBox(t,e+r+1.03,n,o+1.1,.22,o+1.1,l),i.addBox(t-o/2-.3,e+r+1,n,.45,2,1.5,"petronasTrim"),i.addBox(t+o/2+.3,e+r+1,n,.45,2,1.5,"petronasTrim"),i.addBox(t,e+r+1,n-o/2-.3,1.5,2,.45,"petronasTrim"),i.addBox(t,e+r+1,n+o/2+.3,1.5,2,.45,"petronasTrim")}for(let r=0;r<8;r+=1)i.addBox(t,e+70+1.2+r*1.7,n,3.6-r*.35,1.5,3.6-r*.35,r%2?"petronasTrim":"silver");i.addBox(t,e+70+17,n,.8,12,.8,"petronasTrim"),i.addBox(t,e+70+24,n,.35,5,.35,"petronasTrim")}function ax(i,e){const{x:t,z:n}=Re("Petronas Twin Towers",{x:-12,z:22}),a=t-6.5,r=t+6.5,s=e.surfaceYAt(t,n);Pt(i,e,t,n,38,28,"concrete"),Bl(i,s,a,n),Bl(i,s,r,n),i.addBox((a+r)/2,s+35,n,Math.abs(r-a)+4,3,3.2,"petronasTrim"),i.addBox((a+r)/2,s+35,n,Math.abs(r-a)+2,1.5,4.6,"glass"),i.addBox(t,s+2.4,n+16,20,4.8,8,"concreteDark"),i.addBox(t,s+5.2,n+16,22,1.2,9.5,"petronasTrim")}function rx(i,e){const{x:t,z:n}=Re("Merdeka 118",{x:35,z:18}),a=e.surfaceYAt(t,n);Pt(i,e,t,n,30,26,"plaza");for(let r=0;r<86;r+=3){const s=r/86,o=12-s*5.8,l=10-s*3.6,c=Math.sin(s*Math.PI*2)*.9;i.addBox(t+c,a+r+1.5,n,o,3,l,"merdekaGlass"),r%9===0&&i.addBox(t+c,a+r+1.55,n,o+.7,.35,l+.7,"merdekaTrim"),i.addBox(t+o/2+c+.16,a+r+1.5,n,.22,3,l*.8,"blackGlass")}i.addBox(t,a+91,n,3.3,9,3.3,"merdekaTrim"),i.addBox(t,a+101,n,1.1,16,1.1,"merdekaTrim"),i.addBox(t,a+111,n,.45,8,.45,"merdekaTrim")}function sx(i,e){const{x:t,z:n}=Re("KL Tower",{x:58,z:-25}),a=e.surfaceYAt(t,n);Pt(i,e,t,n,22,20,"concrete"),i.addBox(t,a+27,n,3,54,3,"klTowerWhite"),i.addBox(t,a+28,n,1.3,58,1.3,"stoneDark"),i.addBox(t,a+56,n,12,5,12,"klTowerWhite"),i.addBox(t,a+58,n,15,2,7,"glassGreen"),i.addBox(t,a+58,n,7,2,15,"glassGreen"),i.addBox(t,a+61.6,n,10,2,10,"klTowerRed"),i.addBox(t,a+70,n,1.3,18,1.3,"klTowerWhite"),i.addBox(t,a+83,n,.45,8,.45,"klTowerRed")}function ox(i,e){const{x:t,z:n}=Re("Sultan Abdul Samad Building",{x:0,z:-55}),a=e.surfaceYAt(t,n);Pt(i,e,t,n,62,22,"plaza"),i.addBox(t,a+4,n,54,8,8,"redBrick"),i.addBox(t,a+8.8,n,56,1.2,9.2,"stone");for(let r=-24;r<=24;r+=8)i.addBox(t+r,a+4.8,n-4.5,2.4,5.6,.6,"mosqueWhite"),i.addBox(t+r,a+4.8,n+4.5,2.4,5.6,.6,"mosqueWhite");i.addBox(t,a+12,n,7,24,7,"redBrick"),i.addBox(t,a+19.5,n-3.7,4.5,4,.7,"mosqueWhite"),i.addBox(t,a+19.5,n+3.7,4.5,4,.7,"mosqueWhite"),i.addBox(t,a+25.2,n,8.5,2.4,8.5,"roofCopper"),i.addBox(t,a+28.2,n,5.8,3.4,5.8,"roofCopper"),i.addBox(t,a+31.6,n,2.8,3.2,2.8,"roofCopper"),[-25,25].forEach(r=>{i.addBox(t+r,a+10,n,5.2,14,5.2,"redBrick"),i.addBox(t+r,a+18.8,n,6.6,2.2,6.6,"roofCopper"),i.addBox(t+r,a+21.2,n,3.8,2.8,3.8,"roofCopper")})}function lx(i,e){const{x:t,z:n}=Re("Masjid Negara",{x:-48,z:-32}),a=e.surfaceYAt(t,n);Pt(i,e,t,n,34,26,"concrete"),i.addBox(t,a+3,n,22,6,14,"mosqueWhite");for(let r=0;r<6;r+=1)i.addBox(t,a+6.2+r*.72,n,25-r*3.2,.7,17-r*2,"mosqueBlue");i.addBox(t-17,a+14,n+4,2.4,28,2.4,"mosqueWhite"),i.addBox(t-17,a+29.5,n+4,4.5,3.2,4.5,"mosqueBlue"),i.addBox(t-17,a+33,n+4,1.1,6,1.1,"mosqueWhite")}function cx(i,e){const{x:t,z:n}=Re("Tugu Negara",{x:-70,z:43}),a=e.surfaceYAt(t,n);Pt(i,e,t,n,26,20,"plaza"),i.addBox(t,a+1.3,n,16,2.6,10,"stone"),i.addBox(t,a+3.4,n,12,1.2,7,"concrete"),[-4,-2,0,2,4].forEach((s,o)=>{const l=(o-2)*.25;i.addBox(t+s,a+7,n+l,1.2,6,1.2,"monumentBronze"),i.addBox(t+s,a+10.4,n+l,2,1.6,1.8,"monumentBronze"),i.addBox(t+s-1.2,a+7.6,n+l,1.1,3.8,.9,"monumentBronze"),i.addBox(t+s+1.2,a+8.2,n+l,1.1,4.2,.9,"monumentBronze")}),i.addBox(t+4,a+14,n,1,9,1,"monumentBronze"),i.addBox(t+4,a+17.6,n,5,1.2,.8,"monumentBronze")}function dx(i,e){const{x:t,z:n}=Re("TRX Exchange 106",{x:66,z:32}),a=e.surfaceYAt(t,n);Pt(i,e,t,n,28,22,"concrete");for(let r=0;r<74;r+=3){const s=r/74;i.addBox(t,a+r+1.5,n,11-s*4,3,9-s*3,"glassGreen"),r%12===0&&i.addBox(t,a+r+1.6,n,12-s*4,.3,10-s*3,"mallGold")}i.addBox(t,a+78,n,5,6,5,"mallGold"),i.addBox(t,a+84,n,1,8,1,"mallGold"),va(i,e,t-18,n-6,8,8,34,"blackGlass","glassDark"),va(i,e,t+12,n-8,7,9,28,"merdekaGlass","glass")}function hx(i,e){const{x:t,z:n}=Re("Bukit Bintang",{x:30,z:-22}),a=e.surfaceYAt(t,n);Pt(i,e,t,n,30,24,"plaza"),i.addBox(t-8,a+5,n,18,10,10,"mallGold"),i.addBox(t+8,a+4,n+4,13,8,9,"glassDark"),i.addBox(t,a+10.5,n,32,1,14,"concreteDark");for(let r=-10;r<=10;r+=5)i.addBox(t+r,a+11.6,n-7,2.5,1.4,.5,"lampGlow")}function ux(i,e){const{x:t,z:n}=Re("Central Market",{x:-20,z:-60}),a=e.surfaceYAt(t,n);Pt(i,e,t,n,24,16,"concrete"),i.addBox(t,a+3.8,n,20,7.6,9,"marketBlue"),i.addBox(t,a+8.2,n,22,1.2,10.5,"concrete"),i.addBox(t,a+10,n,12,2.2,5,"marketBlue")}function fx(i,e){const{x:t,z:n}=Re("Old Railway Station",{x:-36,z:-58}),a=e.surfaceYAt(t,n);i.addBox(t,a+4,n,24,8,7,"mosqueWhite");for(let r=-10;r<=10;r+=5)i.addBox(t+r,a+9,n,3,4,3,"mosqueWhite");i.addBox(t,a+11.8,n,26,1,8.5,"stationRoof"),i.addBox(t-13,a+10,n,2,12,2,"mosqueWhite"),i.addBox(t+13,a+10,n,2,12,2,"mosqueWhite")}function px(i,e){const{x:t,z:n}=Re("Thean Hou Temple",{x:-75,z:-20}),a=e.surfaceYAt(t,n);Pt(i,e,t,n,22,18,"plaza"),i.addBox(t,a+3,n,16,6,10,"templeRed");for(let r=0;r<3;r+=1)i.addBox(t,a+6.6+r*.7,n,19-r*2,.65,12-r,"templeGold");[-7,7].forEach(r=>{i.addBox(t+r,a+7,n,3.5,7,3.5,"templeRed"),i.addBox(t+r,a+11,n,5,1,5,"templeGold")})}function mx(i,e){const{x:t,z:n}=Re("National Museum",{x:-58,z:-66}),a=e.surfaceYAt(t,n);Pt(i,e,t,n,24,18,"concrete"),i.addBox(t,a+3.5,n,18,7,10,"museumBrown"),i.addBox(t,a+8,n,20,2,12,"roofCopper"),i.addBox(t,a+10.2,n,10,2.2,6,"roofCopper")}function xx(i,e){[[18,-8],[18,42],[-62,-55],[-24,22],[46,22],[0,-55]].forEach(([n,a])=>{for(let r=-3;r<=3;r+=2)In(i,e,n+r,a,.65,5.4,"lineWhite"),In(i,e,n,a+r,5.4,.65,"lineWhite")});for(let n=-80;n<=80;n+=16)[[n,-12],[n,46]].forEach(([a,r])=>{const s=e.surfaceYAt(a,r);i.addBox(a,s+2,r,.35,4,.35,"concreteDark"),i.addBox(a,s+4.2,r,1.1,.45,1.1,"lampGlow")});[[-30,-8],[34,-8],[52,42],[-70,42]].forEach(([n,a])=>{const r=e.surfaceYAt(n,a);i.addBox(n,r+1.2,a,4,2.4,2.2,"busGreen"),i.addBox(n,r+2.7,a,4.6,.5,2.8,"stationRoof")}),[[-8,-50],[-52,-24],[22,34],[41,-18],[-72,52]].forEach(([n,a])=>{const r=e.surfaceYAt(n,a);i.addBox(n,r+1,a,3.2,2,1.8,"warning"),i.addBox(n-1.5,r+2.3,a,.8,.8,.8,"lampGlow")})}function oa(i,e,t,n,a,r,s=13){const o=Math.min(a,r),l=Math.max(a,r);for(let c=o;c<=l;c+=2){const d=t==="x"?c:n,h=t==="x"?n:c,u=e.surfaceYAt(d,h);c%10===0&&i.addBox(d,u+5.2,h,1.2,10.4,1.2,"concreteDark"),t==="x"?(i.addBox(d+.5,s,h,2.2,.35,5.2,"concrete"),i.addBox(d+.5,s+.45,h-1.4,2.2,.25,.35,"rail"),i.addBox(d+.5,s+.45,h+1.4,2.2,.25,.35,"rail")):(i.addBox(d,s,h+.5,5.2,.35,2.2,"concrete"),i.addBox(d-1.4,s+.45,h+.5,.35,.25,2.2,"rail"),i.addBox(d+1.4,s+.45,h+.5,.35,.25,2.2,"rail"))}}function kl(i,e,t,n,a="station"){const r=e.surfaceYAt(t,n),s=13;i.addBox(t,s+1.8,n,13,3,8,a),i.addBox(t,s+4,n,15,1.4,10,"stationRoof"),i.addBox(t-5,r+6,n-3,1.2,12,1.2,"concreteDark"),i.addBox(t+5,r+6,n+3,1.2,12,1.2,"concreteDark"),i.addBox(t,r+1.8,n+7,9,3.6,3,"station")}function gx(i,e){const t=Tc(20260604),n=["Petronas Twin Towers","Merdeka 118","KL Tower","Sultan Abdul Samad Building","Masjid Negara","Tugu Negara"].map(r=>Re(r,{x:0,z:0})),a=["glass","glassGreen","merdekaGlass","silver","concreteDark","blackGlass"];for(let r=0;r<88;r+=1){const s=Rn(t,-70,72),o=Rn(t,-70,65),l=Rn(t,4,10),c=Rn(t,4,10);if(wc(s,o,n,19)||Math.abs(o+8)<6||Math.abs(s-18)<6||Math.abs(o-42)<5||Math.abs(s+60)<5)continue;const d=Ii(1.4-Ec(s,o,8,6)/85,.35,1.4),h=Math.floor((Rn(t,8,34)+t()*20)*d),u=a[Rn(t,0,a.length-1)],p=u==="blackGlass"?"glass":"glassDark";va(i,e,s,o,l,c,Math.max(7,h),u,p)}}function _x(i){const e=new Map;for(let a=zt;a<=Gt;a+=1)for(let r=zt;r<=Gt;r+=1){const s=Math.hypot(a*.78,r)/100,o=Nl(a/44,r/44,8808,4)*5.5+Nl(a/18,r/18,9020,3)*2.4,l=Math.max(0,1-Math.hypot(a-8,r+2)/92),c=2.4+o+s*4.5-l*2.8,d=Math.floor(c/1.35)*1.35,h=Ii(Math.round(d),0,11);e.set(Fl(a,r),h)}const t=(a,r)=>{const s=Ii(Math.floor(a),zt,Gt),o=Ii(Math.floor(r),zt,Gt);return e.get(Fl(s,o))??1},n={min:zt,max:Gt,size:tx,heightAtCell:t,surfaceYAt(a,r){return t(a,r)+1},clampXZ(a){return a.x=Ii(a.x,zt+2,Gt-2),a.z=Ii(a.z,zt+2,Gt-2),a}};for(let a=zt;a<=Gt;a+=1)for(let r=zt;r<=Gt;r+=1){const s=t(a,r),o=da(a,r,4477),l=o>.72?"grass2":o<.18?"grassDark":"grass";i.addVoxel(a,s,r,l);const c=Math.min(t(a-1,r),t(a+1,r),t(a,r-1),t(a,r+1),a===zt||a===Gt||r===zt||r===Gt?0:s);for(let d=c+1;d<s;d+=1)i.addVoxel(a,d,r,d>s-3?"dirt":"clay");if(a===zt||a===Gt||r===zt||r===Gt)for(let d=0;d<s;d+=1)i.addVoxel(a,d,r,d>s-4?"dirt":"stoneDark")}return n}function vx(i,e){for(let n=-82;n<-58;n+=1)for(let a=53;a<77;a+=1){const r=(n+70)/12,s=(a-65)/12;if(r*r+s*s<1){const o=e.surfaceYAt(n,a)+.09;i.addBox(n+.5,o,a+.5,1,.1,1,"water")}}[[-77,50],[-65,38],[-58,44],[-75,70],[-59,72],[-42,28],[-34,32],[-28,-38],[-54,-18],[-63,-21],[-8,-42],[14,-43],[43,-12],[50,-8],[66,-14],[72,-34],[24,42],[12,48],[-10,48],[-20,40]].forEach(([n,a],r)=>Dn(i,e,n,a,3.5+r%4*.6));for(let n=-78;n<=78;n+=11)Math.abs(n)<18||Dn(i,e,n,77,4)}function yx(i,e){for(let t=-62;t<=-28;t+=1){const n=Math.round(-8+Math.sin(t*.18)*3);for(let a=-2;a<=2;a+=1)In(i,e,n+a,t,1,1,"riverBlue")}for(let t=-24;t<=6;t+=1){const n=Math.round(-39+Math.sin(t*.22)*2);for(let a=-1;a<=1;a+=1)In(i,e,t,n+a,1,1,"riverBlue")}}function Ol(i,e,t,n,a="warning"){const r=e.surfaceYAt(t,n);i.addBox(t,r+1.8,n,.45,3.2,.45,"concreteDark"),i.addBox(t,r+3.6,n,4.2,1.5,.55,a)}function Ui(i,e,t,n,a,r="marketRed"){for(let s=0;s<a;s+=1){const o=t+s%5*4-8,l=n+Math.floor(s/5)*4-4,c=e.surfaceYAt(o,l);i.addBox(o,c+1.1,l,2.6,2.2,2.2,"concreteDark"),i.addBox(o,c+2.5,l,3.2,.55,2.8,s%2?r:"awningStripe"),i.addBox(o,c+.65,l+2,1.1,1.3,1.1,"lampGlow")}}function Mx(i,e){yx(i,e);const t=Re("KLCC Park",{x:-25,z:43}),n=Re("Petaling Street / Chinatown",{x:-18,z:-42}),a=Re("Jalan Alor",{x:23,z:-32}),r=Re("Masjid Jamek / River of Life",{x:-9,z:-38}),s=Re("Royal Selangor Club",{x:-12,z:-55}),o=Re("Islamic Arts Museum",{x:-58,z:-40}),l=Re("National Planetarium",{x:-64,z:-34}),c=Re("Istana Negara",{x:-86,z:10}),d=Re("Batu Caves Gateway",{x:82,z:68}),h=Re("Kampung Baru",{x:-35,z:8}),u=Re("Chow Kit Market",{x:-44,z:-12}),p=Re("Little India Brickfields",{x:-55,z:-74}),x=Re("Pavilion KL",{x:39,z:-18});Pt(i,e,t.x,t.z,24,18,"parkPath"),[[-6,-4],[3,-5],[7,5],[-7,7],[1,1]].forEach(([b,R])=>Dn(i,e,t.x+b,t.z+R,4)),Ui(i,e,n.x,n.z,9,"marketRed"),Ol(i,e,n.x+3,n.z+6,"templeRed"),Ui(i,e,a.x,a.z,10,"lampGlow");for(let b=-8;b<=8;b+=4){const R=e.surfaceYAt(a.x+b,a.z+5);i.addBox(a.x+b,R+1,a.z+5,1.4,.7,1.4,"mallGold")}const _=e.surfaceYAt(r.x,r.z);i.addBox(r.x,_+3,r.z,12,6,8,"mosqueWhite"),i.addBox(r.x,_+7,r.z,8,2,8,"roofCopper"),i.addBox(r.x-5,_+9,r.z+4,1.4,12,1.4,"mosqueWhite");const m=e.surfaceYAt(s.x,s.z);i.addBox(s.x,m+3,s.z,16,6,7,"stationRoof"),i.addBox(s.x,m+6.8,s.z,18,1,8,"mosqueWhite");const f=e.surfaceYAt(o.x,o.z);i.addBox(o.x,f+3.6,o.z,18,7.2,12,"mosqueWhite"),i.addBox(o.x,f+8.1,o.z,9,2.5,9,"mosqueBlue");const E=e.surfaceYAt(l.x,l.z);i.addBox(l.x,E+3,l.z,12,6,10,"museumBrown"),i.addBox(l.x,E+7.2,l.z,8,3,8,"glassGreen");const T=e.surfaceYAt(c.x,c.z);Pt(i,e,c.x,c.z,18,16,"plaza"),i.addBox(c.x,T+4,c.z,16,8,9,"palaceWall"),i.addBox(c.x,T+9,c.z,12,2.2,6,"palaceGold"),i.addBox(c.x-8,T+5,c.z-4,2,10,2,"palaceGold");const w=e.surfaceYAt(d.x,d.z);i.addBox(d.x,w+8,d.z,18,16,8,"caveLimestone"),i.addBox(d.x,w+3,d.z-5,5,6,3,"templeGold");for(let b=0;b<8;b+=1)i.addBox(d.x,w+.2+b*.25,d.z-10+b,9-b*.5,.3,1,"concrete");Ui(i,e,h.x,h.z,8,"templeGold"),Ui(i,e,u.x,u.z,8,"marketBlue"),Ui(i,e,p.x,p.z,7,"littleIndiaPink");const L=e.surfaceYAt(x.x,x.z);i.addBox(x.x,L+4.5,x.z,18,9,12,"pavilionRed"),i.addBox(x.x,L+9.5,x.z,20,1,13,"mallGold"),Xi.filter(b=>b.isSchematicGateway).forEach((b,R)=>{const B=e.surfaceYAt(b.x,b.z);Pt(i,e,b.x,b.z,8,7,R%2?"plaza":"concrete"),i.addBox(b.x,B+.8,b.z,7,1.2,5.5,"gatewayPurple"),i.addBox(b.x,B+3.2,b.z,4.5,3.6,.8,"lampGlow"),Ol(i,e,b.x-3,b.z+3,"gatewayPurple")})}function Ac(i,e,t,n,a,r="gatewayPurple"){const s=e.surfaceYAt(t,n);i.addBox(t,s+.7,n,a,.8,2.2,r),i.addBox(t-a/2+.5,s+2.1,n,.6,2.8,.6,"concreteDark"),i.addBox(t+a/2-.5,s+2.1,n,.6,2.8,.6,"concreteDark")}function zl(i,e,t,n,a=1){const r=e.surfaceYAt(t,n);i.addBox(t,r+2.4*a,n,9*a,4.8*a,6*a,"mosqueWhite"),i.addBox(t,r+5.4*a,n,7*a,1.8*a,7*a,"mosqueBlue"),i.addBox(t-6*a,r+6*a,n+2*a,1.1*a,10*a,1.1*a,"mosqueWhite")}function bx(i,e,t,n,a="mallGold"){const r=e.surfaceYAt(t,n);i.addBox(t,r+4,n,18,8,12,a),i.addBox(t,r+8.8,n,20,1.2,14,"concreteDark"),i.addBox(t-6,r+4.2,n-6.1,4,2.4,.4,"glassDark"),i.addBox(t+5,r+4.2,n-6.1,4,2.4,.4,"glassDark")}function Sx(i,e,t,n,a="treeLeaf"){const r=e.surfaceYAt(t,n);for(let s=0;s<5;s+=1)i.addBox(t+(s-2)*4,r+1+s*.8,n+s*2,14-s*1.6,2+s*.8,10-s,s%2?a:"grassDark");Dn(i,e,t-7,n-4,5),Dn(i,e,t+8,n+6,4.5)}function Tx(i,e,t,n){Ui(i,e,t,n,12,"marketRed");const a=e.surfaceYAt(t,n);for(let r=-8;r<=8;r+=4)i.addBox(t+r,a+4,n-8,.45,5.2,.45,"concreteDark"),i.addBox(t+r,a+6.8,n-8,1.4,.7,1.4,"lampGlow")}function Ex(i,e,t,n,a){const r=e.surfaceYAt(t,n);Pt(i,e,t,n,18,14,a%2?"plaza":"concrete"),i.addBox(t,r+1.4,n,14,2.2,9,"gatewayPurple"),i.addBox(t,r+5,n,7,7,1.4,"lampGlow"),i.addBox(t,r+8.8,n,4,2,4,a%2?"templeGold":"glassGreen"),Ac(i,e,t,n+9,12,"gatewayPurple")}function wx(i,e,t,n){if(Pt(i,e,t.x,t.z,t.category==="gateway"?18:22,t.category==="gateway"?14:18,n%2?"plaza":"parkPath"),t.category==="gateway")Ex(i,e,t.x,t.z,n);else if(["nature","excursion","viewpoint"].includes(t.category)){if(Sx(i,e,t.x,t.z,t.category==="excursion"?"caveLimestone":"treeLeaf"),t.name.includes("Putrajaya")){for(let a=t.x-12;a<=t.x+12;a+=1)for(let r=t.z+10;r<=t.z+18;r+=1)In(i,e,a,r,1,1,"water");zl(i,e,t.x-8,t.z-4,1.15)}}else["food","market"].includes(t.category)?Tx(i,e,t.x,t.z):["shopping","family","modern"].includes(t.category)?bx(i,e,t.x,t.z,t.category==="family"?"pavilionRed":"mallGold"):["culture","heritage"].includes(t.category)?zl(i,e,t.x,t.z,t.name.includes("Blue Mosque")?1.3:1):va(i,e,t.x-6,t.z-5,12,10,22,"glassGreen","glassDark");Ac(i,e,t.x,t.z-12,Math.min(18,Math.max(8,t.name.length*.36)),t.category==="gateway"?"gatewayPurple":"warning")}function Ax(i,e,t,n){const a=e.surfaceYAt(t.x,t.z),s={skyline:"merdekaTrim",viewpoint:"lampGlow",heritage:"redBrick",culture:"templeGold",museum:"museumBrown",market:"marketRed",food:"warning",shopping:"mallGold",family:"pavilionRed",park:"treeLeaf2",nature:"treeLeaf",excursion:"caveLimestone",transit:"station",modern:"glassGreen",sports:"stationRoof",gateway:"gatewayPurple"}[t.category]??"warning",o=t.category==="gateway"?3.2:t.category==="skyline"?2.8:2.4;i.addBox(t.x,a+.16,t.z,7.4,.24,7.4,n%2?"plaza":"concrete"),i.addBox(t.x,a+2.1,t.z,.5,4.1,.5,"concreteDark"),i.addBox(t.x,a+4.5,t.z,o,o,o,s),i.addBox(t.x,a+6.2,t.z,Math.max(2.1,o*.7),.45,Math.max(2.1,o*.7),"lampGlow"),n%3===0&&(i.addBox(t.x-3.2,a+1.2,t.z+3.1,1.2,2.4,1.2,s),i.addBox(t.x+3.1,a+1.2,t.z-3.2,1.2,2.4,1.2,s))}function Cx(i,e){Xi.forEach((t,n)=>{["Petronas Twin Towers","Merdeka 118","KL Tower","Sultan Abdul Samad Building","Masjid Negara","Tugu Negara","TRX Exchange 106","Bukit Bintang","Central Market","Old Railway Station","Thean Hou Temple","National Museum"].includes(t.name)||Ax(i,e,t,n)})}function Rx(i,e){[["Sunway Lagoon & Pyramid","SS15 Food Street","PJ Old Town","Section 17 Market","TTDI Market","Mutiara Damansara Curve"],["Shah Alam Blue Mosque","i-City Shah Alam","Setia City Park","Klang Little India","Pulau Ketam Ferry Gate","Morib Beach Gateway"],["Mines Lake","IOI City Mall","Putrajaya Pink Mosque","Putrajaya Bridge Promenade","Dengkil Kampung Food","KLIA Terminal Gateway"],["Titiwangsa Lake Gardens","Setapak Food Quarter","Wangsa Maju Town Centre","Batu Caves Temple Steps","Gombak Transit Gate","Kanching Falls","Rawang Waterfall Gate"],["Mont Kiara Dining Cluster","Kepong Food Row","Sungai Buloh Nursery Belt","Elmina Rainbow Bridge","Kuala Selangor Fireflies","Sasaran Sky Mirror Gate"],["Ampang Korean Village","Ulu Klang Ridge Trail","Melawati Food & Hills","Janda Baik Gateway","Bukit Tinggi Village Gate"]].map(n=>n.map(a=>Re(a,{x:0,z:0}))).forEach((n,a)=>{for(let r=0;r<n.length-1;r+=1)Vt(i,e,n[r],n[r+1],a%2?3:5)})}function Px(i,e){const t=[-170,-128,-88,-38,12,52,92,138,178],n=[-188,-148,-108,-62,-18,38,88,132,176];t.forEach((a,r)=>Vt(i,e,{x:-208,z:a},{x:208,z:a},r%3===0?5:3)),n.forEach((a,r)=>Vt(i,e,{x:a,z:-208},{x:a,z:208},r%3===0?5:3)),Vt(i,e,Re("Kuala Selangor Fireflies",{x:-204,z:152}),Re("Damansara Arts & Cafes",{x:-148,z:42}),5),Vt(i,e,Re("Damansara Arts & Cafes",{x:-148,z:42}),Re("Mid Valley Megamall",{x:-82,z:-88}),5),Vt(i,e,Re("Mid Valley Megamall",{x:-82,z:-88}),Re("Kajang Satay Town",{x:68,z:-184}),5),Vt(i,e,Re("Kajang Satay Town",{x:68,z:-184}),Re("KLIA Terminal Gateway",{x:198,z:-106}),5),Vt(i,e,Re("Ampang Lookout Ridge",{x:126,z:18}),Re("Genting Highlands Gateway",{x:148,z:162}),5)}function Lx(i,e){Px(i,e),Rx(i,e),Xi.filter(a=>Math.abs(a.x)>96||Math.abs(a.z)>96||a.category==="gateway").forEach((a,r)=>wx(i,e,a,r));const t=Tc(20260426);[{...Re("Sunway Lagoon & Pyramid",{x:-156,z:-126}),radius:34,count:34,key:"glassGreen"},{...Re("Shah Alam Blue Mosque",{x:-184,z:-38}),radius:30,count:24,key:"concreteDark"},{...Re("Mont Kiara Dining Cluster",{x:-92,z:92}),radius:32,count:28,key:"blackGlass"},{...Re("Putrajaya Lake & Mosque",{x:132,z:-136}),radius:42,count:34,key:"mosqueWhite"},{...Re("Cyberjaya Tech Garden",{x:114,z:-168}),radius:34,count:26,key:"glass"},{...Re("Zoo Negara",{x:142,z:68}),radius:30,count:20,key:"parkPath"},{...Re("Taman Negara Gateway",{x:188,z:12}),radius:55,count:42,key:"gatewayPurple"},{...Re("Klang Royal Town",{x:-204,z:-88}),radius:26,count:18,key:"redBrick"}].map(a=>({...a,cx:a.x,cz:a.z})).forEach(a=>{for(let r=0;r<a.count;r+=1){const s=t()*Math.PI*2,o=Math.sqrt(t())*a.radius,l=Math.round(a.cx+Math.cos(s)*o),c=Math.round(a.cz+Math.sin(s)*o);if(Math.abs(l)>214||Math.abs(c)>214||wc(l,c,Xi,10))continue;const d=Rn(t,4,9),h=Rn(t,4,9),u=Rn(t,7,a.key==="blackGlass"||a.key==="glass"?34:20);va(i,e,l,c,d,h,u,a.key,a.key==="blackGlass"?"glass":"glassDark")}});for(let a=-208;a<=208;a+=24)Dn(i,e,a,204,4.5),Dn(i,e,a,-204,4.2);for(let a=-180;a<=180;a+=28)Dn(i,e,-210,a,4),Dn(i,e,210,a,4)}function Dx(i,e){Vt(i,e,{x:-88,z:-8},{x:88,z:-8},7),Vt(i,e,{x:-86,z:42},{x:86,z:42},5),Vt(i,e,{x:18,z:-84},{x:18,z:78},7),Vt(i,e,{x:-62,z:-80},{x:-62,z:78},5),Vt(i,e,{x:-42,z:-55},{x:44,z:-55},5),Vt(i,e,{x:-24,z:22},{x:46,z:22},5)}function Ix(i,e){oa(i,e,"x",-8,-84,86,13.2),oa(i,e,"z",18,-75,74,15.8),oa(i,e,"x",-128,-198,178,14.8),oa(i,e,"z",132,-188,172,15.5),oa(i,e,"x",92,-204,188,15),["Petaling Street / Chinatown","LRT / MRT Hub","KL Tower","Old Railway Station"].forEach(t=>{const{x:n,z:a}=Re(t,{x:0,z:0});kl(i,e,n,a)}),["Sunway Lagoon & Pyramid","Shah Alam Blue Mosque","Mont Kiara Dining Cluster","Putrajaya Lake & Mosque","Cyberjaya Tech Garden","Zoo Negara","Penang George Town Gateway","Sepang / KLIA Gateway"].forEach(t=>{const{x:n,z:a}=Re(t,{x:188,z:92});kl(i,e,n,a,"gatewayPurple")})}function Ux(i){i.background=new Xe(462879),i.fog=new oo(462879,170,620);const e=new X0(i,{castShadow:!1,receiveShadow:!0}),t=e.withSection("terrain",()=>_x(e)),n=(l,c)=>e.withSection(l,c);n("parksAndWater",()=>vx(e,t)),n("outerDistrictExpansion",()=>Lx(e,t)),n("roads",()=>Dx(e,t)),n("transit",()=>Ix(e,t)),n("streetDetails",()=>xx(e,t)),n("tourismExpansion",()=>Mx(e,t)),n("cityBuildings",()=>gx(e,t)),n("landmarkPins",()=>Cx(e,t)),n("petronas",()=>ax(e,t)),n("merdeka118",()=>rx(e,t)),n("klTower",()=>sx(e,t)),n("sultanAbdulSamad",()=>ox(e,t)),n("nationalMosque",()=>lx(e,t)),n("nationalMonument",()=>cx(e,t)),n("exchange106",()=>dx(e,t)),n("bukitBintang",()=>hx(e,t)),n("centralMarket",()=>ux(e,t)),n("railwayStation",()=>fx(e,t)),n("theanHouTemple",()=>px(e,t)),n("nationalMuseum",()=>mx(e,t));const a=new Et(new fo(6,16,8),new hr({color:16770218}));a.position.set(-82,92,-110),i.add(a);const r=e.finalize(),s=Xi.map(l=>({...l,position:new C(l.x,t.surfaceYAt(l.x,l.z)+(l.category==="gateway"?2:4),l.z),visitRadius:l.category==="gateway"?9:10})),o=[{name:"Kelana Jaya inspired elevated line",label:"LRT",stations:["Subang Gateway","Pasar Seni","KLCC","Bukit Bintang Link","KL Tower","Ampang Park"],points:[xe("Subang Airport Heritage Strip",14.4,{x:-82,z:-8}),xe("Central Market",14.4,{x:-48,z:-8}),xe("Petronas Twin Towers",14.4,{x:-12,z:-8}),xe("Bukit Bintang",17,{x:18,z:22}),xe("KL Tower",14.4,{x:54,z:-8}),xe("Ampang Korean Village",14.4,{x:84,z:-8})],color:"blue"},{name:"Monorail inspired north-south line",label:"Monorail",stations:["KL Sentral","Imbi","Bukit Bintang","Titiwangsa"],points:[xe("National Museum",17,{x:18,z:-72}),xe("Jalan Alor",17,{x:18,z:-28}),xe("Bukit Bintang",17,{x:18,z:22}),xe("Titiwangsa Lake Gardens",17,{x:18,z:72})],color:"yellow"},{name:"MRT heritage loop",label:"MRT",stations:["National Museum","Merdeka","TRX","KLCC Park"],points:[xe("National Museum",14.4,{x:-58,z:-66}),xe("Merdeka 118",14.4,{x:-18,z:-42}),xe("TRX Exchange 106",14.4,{x:66,z:32}),xe("Petronas Twin Towers",14.4,{x:-12,z:22}),xe("KLCC Park",14.4,{x:-25,z:43})],color:"green"},{name:"KTM tourism gateway",label:"KTM",stations:["Old Railway Station","Batu Caves Gateway","Malaysia Highlights"],points:[xe("Old Railway Station",14.4,{x:-36,z:-58}),xe("LRT / MRT Hub",16,{x:18,z:22}),xe("Batu Caves Gateway",14.4,{x:82,z:68}),xe("Putrajaya Lake & Mosque",15.5,{x:132,z:-136}),xe("Sepang / KLIA Gateway",15.5,{x:188,z:-82})],color:"purple"},{name:"Greater KL outer ring",label:"BRT",stations:["Mont Kiara","FRIM","Kuala Selangor","Shah Alam","Sunway","Bangsar","Kajang","Putrajaya","Zoo Negara","Genting Base"],points:[xe("Mont Kiara Dining Cluster",15.2,{x:-92,z:92}),xe("FRIM Forest Reserve",15.2,{x:-138,z:128}),xe("Kuala Selangor Fireflies",15.2,{x:-204,z:152}),xe("Shah Alam Blue Mosque",15.2,{x:-184,z:-38}),xe("Sunway Lagoon & Pyramid",15.2,{x:-156,z:-126}),xe("Bangsar Village",15.2,{x:-94,z:-108}),xe("Kajang Satay Town",15.2,{x:68,z:-184}),xe("Putrajaya Lake & Mosque",15.2,{x:132,z:-136}),xe("Zoo Negara",15.2,{x:142,z:68}),xe("Genting Highlands Gateway",15.2,{x:148,z:162})],color:"green"},,{name:"PJ Subang Sunway connector",label:"Rapid",stations:["TTDI","Bandar Utama","PJ Old Town","SS15","Sunway","USJ","Puchong"],points:[xe("TTDI Market",15.2,{x:-126,z:22}),xe("1 Utama & Bandar Utama",15.2,{x:-156,z:12}),xe("PJ Old Town",15.2,{x:-122,z:-62}),xe("SS15 Food Street",15.2,{x:-136,z:-92}),xe("Sunway Lagoon & Pyramid",15.2,{x:-156,z:-126}),xe("USJ Taipan",15.2,{x:-126,z:-116}),xe("Puchong IOI Boulevard",15.2,{x:-78,z:-150})],color:"blue"},{name:"Shah Alam Klang coast connector",label:"Coast",stations:["Shah Alam","i-City","Klang Little India","Port Klang","Pulau Ketam Ferry","Morib Gate"],points:[xe("Shah Alam Blue Mosque",15.2,{x:-184,z:-38}),xe("i-City Shah Alam",15.2,{x:-176,z:-8}),xe("Klang Little India",15.2,{x:-198,z:-72}),xe("Port Klang Coastal Gate",15.2,{x:-210,z:-150}),xe("Pulau Ketam Ferry Gate",15.2,{x:-210,z:-126}),xe("Morib Beach Gateway",15.2,{x:-186,z:-198})],color:"purple"},{name:"Putrajaya KLIA south connector",label:"ERL",stations:["Mines Lake","IOI City","Putrajaya Mosque","Cyberjaya","Sepang Circuit","KLIA","Nilai"],points:[xe("Mines Lake",15.2,{x:24,z:-150}),xe("IOI City Mall",15.2,{x:88,z:-144}),xe("Putrajaya Pink Mosque",15.2,{x:124,z:-126}),xe("Cyberjaya Tech Garden",15.2,{x:114,z:-168}),xe("Sepang Circuit",15.2,{x:176,z:-116}),xe("KLIA Terminal Gateway",15.2,{x:198,z:-106}),xe("Nilai Outlet Corridor",15.2,{x:134,z:-206})],color:"yellow"},{name:"North east nature connector",label:"Green",stations:["Titiwangsa","Setapak","Wangsa Maju","Batu Caves","Gombak","Kanching","Rawang Falls"],points:[xe("Titiwangsa Lake Gardens",15.2,{x:8,z:82}),xe("Setapak Food Quarter",15.2,{x:52,z:62}),xe("Wangsa Maju Town Centre",15.2,{x:76,z:78}),xe("Batu Caves Temple Steps",15.2,{x:88,z:92}),xe("Gombak Transit Gate",15.2,{x:104,z:112}),xe("Kanching Falls",15.2,{x:18,z:176}),xe("Rawang Waterfall Gate",15.2,{x:-28,z:206})],color:"green"},{name:"Malaysia gateway spine",label:"Tour",stations:["Penang Gate","Langkawi Gate","Malacca Gate","Cameron Gate","Taman Negara Gate","Kinabalu Gate","Perhentian Gate","Putrajaya Gate","KLIA Gate"],points:[xe("Penang George Town Gateway",15,{x:188,z:92}),xe("Langkawi Gateway",15,{x:188,z:72}),xe("Malacca Gateway",15,{x:188,z:52}),xe("Cameron Highlands Gateway",15,{x:188,z:32}),xe("Taman Negara Gateway",15,{x:188,z:12}),xe("Kinabalu Gateway",15,{x:188,z:-8}),xe("Perhentian Islands Gateway",15,{x:188,z:-28}),xe("Putrajaya Gateway",15,{x:188,z:-58}),xe("Sepang / KLIA Gateway",15,{x:188,z:-82})],color:"yellow"}];return{terrain:t,palette:go,landmarks:s,transportPaths:o,voxelStats:r,chunkManager:r.chunkManager,startPosition:new C(-38,t.surfaceYAt(-38,8)+.1,8)}}function mn(i,e,t,n){const a=new Et(i,e);return a.position.copy(t),a.scale.copy(n),a.castShadow=!1,a.receiveShadow=!0,a}function Nx(){const i=new Ht;i.name="explorer-character";const e=new Mn(1,1,1),t={skin:new Tt({color:14394219}),hair:new Tt({color:2236457}),shirt:new Tt({color:2915301}),pants:new Tt({color:2042167}),shoes:new Tt({color:1120295}),bag:new Tt({color:16096779})},n=mn(e,t.shirt,new C(0,1.65,0),new C(.82,1.15,.46)),a=mn(e,t.skin,new C(0,2.55,0),new C(.62,.62,.62)),r=mn(e,t.hair,new C(0,2.92,-.03),new C(.67,.18,.68)),s=mn(e,t.bag,new C(0,1.65,.34),new C(.72,.86,.22)),o=new Ht;o.position.set(-.62,2,0),o.add(mn(e,t.skin,new C(0,-.42,0),new C(.28,.85,.28)));const l=new Ht;l.position.set(.62,2,0),l.add(mn(e,t.skin,new C(0,-.42,0),new C(.28,.85,.28)));const c=new Ht;c.position.set(-.24,1.08,0),c.add(mn(e,t.pants,new C(0,-.42,0),new C(.3,.86,.32))),c.add(mn(e,t.shoes,new C(0,-.9,-.08),new C(.34,.18,.48)));const d=new Ht;return d.position.set(.24,1.08,0),d.add(mn(e,t.pants,new C(0,-.42,0),new C(.3,.86,.32))),d.add(mn(e,t.shoes,new C(0,-.9,-.08),new C(.34,.18,.48))),i.add(n,a,r,s,o,l,c,d),i.userData.parts={leftArm:o,rightArm:l,leftLeg:c,rightLeg:d},i}class Fx{constructor(e,t,n){this.terrain=t,this.group=Nx(),this.group.position.copy(n),this.velocity=new C,this.heading=0,this.walkTime=0,this.onGround=!0,this.keys=new Set,this.virtualKeys=new Set,this.virtualAxis=new Ue(0,0),this.enabled=!0,e.add(this.group),window.addEventListener("keydown",a=>this.handleKey(a,!0)),window.addEventListener("keyup",a=>this.handleKey(a,!1))}handleKey(e,t){const n=e.key.toLowerCase(),a={w:"forward",arrowup:"forward",s:"back",arrowdown:"back",a:"left",arrowleft:"left",d:"right",arrowright:"right",shift:"sprint"," ":"jump"}[n];a&&(["arrowup","arrowdown","arrowleft","arrowright"," "].includes(n)&&e.preventDefault(),t?this.keys.add(a):this.keys.delete(a))}setVirtualKey(e,t){t?this.virtualKeys.add(e):this.virtualKeys.delete(e)}setVirtualAxis(e=0,t=0){this.virtualAxis.set(qn.clamp(e,-1,1),qn.clamp(t,-1,1))}hasInput(e){return this.keys.has(e)||this.virtualKeys.has(e)}warpTo(e){const t=this.terrain.surfaceYAt(e.x,e.z);this.group.position.set(e.x,t+.05,e.z),this.velocity.set(0,0,0),this.onGround=!0}update(e,t){if(!this.enabled)return!1;const n=Number(this.hasInput("forward"))-Number(this.hasInput("back")),a=Number(this.hasInput("right"))-Number(this.hasInput("left")),r=qn.clamp(n+this.virtualAxis.y,-1,1),s=qn.clamp(a+this.virtualAxis.x,-1,1),o=qn.clamp(Math.hypot(r,s),0,1),l=o>.03,c=new C;t.getWorldDirection(c),c.y=0,c.normalize();const d=new C(c.z,0,-c.x).normalize(),h=new C;h.addScaledVector(c,r),h.addScaledVector(d,s),h.lengthSq()>0&&h.normalize();const p=16*(this.hasInput("sprint")?2.05:1)*(l?o:0),x=this.group.position.clone();this.group.position.addScaledVector(h,p*e),this.terrain.clampXZ(this.group.position),l&&(this.heading=Math.atan2(h.x,h.z),this.group.rotation.y=this.heading,this.walkTime+=e*p*.9);const _=this.terrain.surfaceYAt(this.group.position.x,this.group.position.z)+.05;this.onGround&&this.hasInput("jump")&&(this.velocity.y=10.5,this.onGround=!1),this.velocity.y-=28*e,this.group.position.y+=this.velocity.y*e,this.group.position.y<=_&&(this.group.position.y=_,this.velocity.y=0,this.onGround=!0);const m=this.group.userData.parts,f=l?Math.sin(this.walkTime)*.62:0;return m.leftLeg.rotation.x=f,m.rightLeg.rotation.x=-f,m.leftArm.rotation.x=-f*.85,m.rightArm.rotation.x=f*.85,l||(this.walkTime+=e*1.3),x.distanceToSquared(this.group.position)>1e-6||l||!this.onGround}}function Bx(i,e,t,n){const a=new Ht;a.name=`voxel-train-car-${n}`;const r=new Et(i,e[t]);r.scale.set(2.2,1.8,5.2),r.position.y=.8,a.add(r);const s=new Et(i,e.trainWhite);s.scale.set(2.35,.35,5.4),s.position.y=1.9,a.add(s);for(let l=-1.7;l<=1.7;l+=1.7){const c=new Et(i,e.trainWindow);c.scale.set(.08,.62,1.05),c.position.set(1.14,1.05,l),a.add(c);const d=c.clone();d.position.x=-1.14,a.add(d)}const o=new Et(i,e.trainWhite);return o.scale.set(2,1.45,.35),o.position.set(0,.82,-2.78),a.add(o),a}function kx(i){const e=new Mn(1,1,1),t={trainBlue:new Tt({color:2068205}),trainYellow:new Tt({color:16238920}),trainGreen:new Tt({color:3327117}),trainPurple:new Tt({color:9133302}),trainWhite:new Tt({color:16119802}),trainWindow:new Tt({color:1254968})};return Array.from({length:4},(n,a)=>Bx(e,t,i,a))}class Ox{constructor(e,t){this.trains=[],this.stations=[],this.ride=null,this.motionEnabled=!0,this.permanentMotion=!1,this.activeUntil=performance.now()+9e3,t.forEach((n,a)=>{const r=new Eh(n.points,!1,"catmullrom",.1),s=n.color==="yellow"?"trainYellow":n.color==="green"?"trainGreen":n.color==="purple"?"trainPurple":"trainBlue",o=kx(s);o.forEach(l=>e.add(l)),this.trains.push({cars:o,curve:r,progress:a*.42,speed:a===0?.035:.027,lengthOffset:.024,name:n.name,label:n.label??n.name}),n.points.forEach((l,c)=>this.stations.push({point:l,name:n.stations?.[c]??`${n.label??"Rail"} Station ${c+1}`,routeName:n.name,label:n.label??n.name}))})}wake(e=8e3){this.activeUntil=Math.max(this.activeUntil,performance.now()+e)}togglePermanentMotion(){return this.permanentMotion=!this.permanentMotion,this.wake(12e3),this.permanentMotion}get isActive(){return this.motionEnabled&&(this.ride||this.permanentMotion||performance.now()<this.activeUntil)}findBoardingStation(e,t=12){let n=null;for(const a of this.stations){const r=Math.hypot(e.x-a.point.x,e.z-a.point.z);r<t&&(!n||r<n.distance)&&(n={...a,distance:r})}return n}startRide(e){const t=this.findBoardingStation(e,14);if(!t||this.trains.length===0)return null;const n=this.trains.find(a=>a.name===t.routeName)??this.trains[0];return this.ride={train:n,elapsed:0,duration:9,exitPoint:t.point.clone()},this.wake(12e3),this.ride}fastTravelTo(e,t){const n=this.stations.find(r=>r.name===e);if(!n)return null;const a=n.point.clone();return a.x+=4,a.z+=4,a.y=t.surfaceYAt(a.x,a.z)+.1,this.wake(5e3),a}exitRide(e){if(!this.ride)return null;const t=this.ride.train,n=(t.progress+.08)%1,r=t.curve.getPointAt(n).clone();return r.x+=5,r.z+=5,r.y=e.surfaceYAt(r.x,r.z)+.1,this.ride=null,r}update(e){if(!this.isActive)return!1;for(const t of this.trains)t.progress=(t.progress+e*t.speed)%1,t.cars.forEach((n,a)=>{const r=(t.progress-t.lengthOffset*a+1)%1,s=t.curve.getPointAt(r),o=t.curve.getPointAt((r+.006)%1);n.position.copy(s),n.lookAt(o)});return this.ride&&(this.ride.elapsed+=e,this.ride.elapsed>this.ride.duration&&(this.ride.elapsed=this.ride.duration)),!0}}class zx{constructor(e,t=10,n=[]){this.landmarks=e,this.radius=t,this.visited=new Set(n),this.temp=new C}get count(){return this.visited.size}get total(){return this.landmarks.length}isVisited(e){return this.visited.has(e.name)}markVisited(e){const t=this.isVisited(e);return this.visited.add(e.name),!t}check(e){this.temp.copy(e),this.temp.y=0;for(const t of this.landmarks){const n=t.position;if(Math.hypot(this.temp.x-n.x,this.temp.z-n.z)<=(t.visitRadius??this.radius)&&this.markVisited(t))return t}return null}}class Gx{constructor(e,t){this.landmarks=e,this.routeId="custom",this.route=[],this.setStops(t),this.active=!1,this.index=0}setStops(e,t=this.routeId){this.routeId=t,this.route=e.map(n=>this.landmarks.find(a=>a.name===n)).filter(Boolean),this.index=0}get current(){return this.active?this.route[this.index]:null}get progressText(){return!this.active||this.route.length===0?"Off":`${this.index+1}/${this.route.length}`}start(){return this.active=!0,this.index=0,this.current}cancel(){return this.active=!1,null}toggle(){return this.active?this.cancel():this.start()}update(e,t=11){const n=this.current;if(!n)return{advanced:!1,complete:!1,destination:null,distance:0};const a=Math.hypot(e.x-n.position.x,e.z-n.position.z);return a>t?{advanced:!1,complete:!1,destination:n,distance:a}:(this.index+=1,this.index>=this.route.length?(this.active=!1,{advanced:!0,complete:!0,destination:n,distance:a}):{advanced:!0,complete:!1,destination:this.current,distance:0})}}function Jr(i,e,t){const n=new Et(new Mn(1,1,1),i);return n.scale.copy(e),n.position.copy(t),n}class Vx{constructor(e,t){this.actors=[],this.activeUntil=performance.now()+1e4;const n={taxi:new Tt({color:16238920}),car:new Tt({color:2915301}),pedestrian:new Tt({color:16743252}),window:new Tt({color:1254968})};[[new C(-78,0,-8),new C(78,0,-8)],[new C(18,0,-72),new C(18,0,70)],[new C(-72,0,42),new C(78,0,42)]].forEach((r,s)=>{for(let o=0;o<3;o+=1){const l=new Ht,c=(o+s)%2?"taxi":"car";l.add(Jr(n[c],new C(1.4,.65,2.2),new C(0,.45,0))),l.add(Jr(n.window,new C(1,.35,1),new C(0,.95,-.2))),e.add(l),this.actors.push({group:l,points:r,progress:(o/3+s*.17)%1,speed:.028+o*.004,terrain:t})}}),[[-6,-55],[-48,-32],[-12,38],[35,30],[56,-18]].forEach(([r,s],o)=>{const l=new Ht;l.add(Jr(n.pedestrian,new C(.45,1.2,.45),new C(0,.6,0))),e.add(l),this.actors.push({group:l,points:[new C(r-4,0,s),new C(r+4,0,s+2)],progress:o*.21,speed:.015,terrain:t})})}wake(e=8e3){this.activeUntil=Math.max(this.activeUntil,performance.now()+e)}get isActive(){return performance.now()<this.activeUntil}update(e){if(!this.isActive)return!1;for(const t of this.actors){t.progress=(t.progress+e*t.speed)%1;const n=t.progress<.5?t.progress*2:(1-t.progress)*2,a=t.points[0],r=t.points[1],s=qn.lerp(a.x,r.x,n),o=qn.lerp(a.z,r.z,n),l=t.terrain.surfaceYAt(s,o)+.12;t.group.position.set(s,l,o),t.group.lookAt(r.x,l,r.z),t.progress>=.5&&t.group.rotateY(Math.PI)}return!0}}function Hx({landmarks:i,player:e,trainSystem:t,requestRender:n,focusLandmark:a,refocusPlayer:r,setCameraMode:s,toggleTour:o,cycleTimeMode:l,boardTrain:c,tourismContent:d,routes:h,questSystem:u,saveSystem:p,setRoute:x,fastTravel:_,resetProgress:m}){const f=document.getElementById("fps"),E=document.getElementById("pixel-ratio"),T=document.getElementById("voxel-count"),w=document.getElementById("generated-chunks"),L=document.getElementById("generated-visible"),b=document.getElementById("generated-authored"),R=document.getElementById("total-authored"),B=document.getElementById("visible-budget"),M=document.getElementById("stamp-count"),y=document.getElementById("tour-state"),D=document.getElementById("tour-next"),O=document.getElementById("render-state"),V=document.getElementById("landmark-buttons"),X=document.getElementById("toast"),H=document.getElementById("touch-joystick"),Y=document.getElementById("touch-stick"),Q=new Map,W=document.getElementById("btn-board-train"),ne=document.getElementById("route-selector"),re=document.getElementById("station-selector"),Me=document.getElementById("guidebook-panel"),Ge=document.getElementById("quest-panel"),qe=document.getElementById("tips-panel"),et=document.getElementById("guidebook-title"),tt=document.getElementById("guidebook-note"),K=document.getElementById("guidebook-details"),Z=document.getElementById("highlight-list"),me=document.getElementById("quest-list"),Le=document.getElementById("tips-list");i.forEach(U=>{const I=document.createElement("button");I.type="button",I.textContent=U.name.replace("Petronas Twin Towers","Petronas").replace("National ",""),I.title=U.name,I.addEventListener("click",()=>{a(U),A(U),pe(`Focused: ${U.name}`)}),Q.set(U.name,I),V.appendChild(I)});const ye=U=>{U&&(U.addEventListener("touchstart",I=>I.preventDefault(),{passive:!1}),U.addEventListener("touchmove",I=>I.preventDefault(),{passive:!1}))},Ve=(U,I,{toastOnDown:te}={})=>{const J=document.getElementById(U);if(!J)return;const ue=j=>{j.preventDefault(),J.setPointerCapture?.(j.pointerId),J.classList.add("is-active"),e.setVirtualKey(I,!0),t.wake(),te&&pe(te),n()},se=j=>{j.preventDefault(),J.releasePointerCapture?.(j.pointerId),J.classList.remove("is-active"),e.setVirtualKey(I,!1),n()};J.addEventListener("pointerdown",ue),J.addEventListener("pointerup",se),J.addEventListener("pointercancel",se),J.addEventListener("lostpointercapture",se),ye(J)},Ze=(U,I)=>{const te=document.getElementById(U);te&&(te.addEventListener("pointerdown",J=>{J.preventDefault(),te.classList.add("is-active"),I(),n()}),te.addEventListener("pointerup",()=>te.classList.remove("is-active")),te.addEventListener("pointercancel",()=>te.classList.remove("is-active")),ye(te))};Ve("btn-touch-jump","jump"),Ve("btn-touch-sprint","sprint",{toastOnDown:"Sprint held. Push the left thumb-stick to run."}),Ze("btn-touch-focus",()=>{r?.(),pe("Camera refocused on the explorer.")}),Ze("btn-touch-trains",()=>{const U=t.togglePermanentMotion();pe(U?"Continuous train motion enabled.":"Train motion now auto-pauses when idle.")}),Ze("btn-camera-walk",()=>s?.("walk")),Ze("btn-camera-landmark",()=>s?.("landmark")),Ze("btn-camera-skyline",()=>s?.("skyline")),Ze("btn-tour",()=>o?.()),Ze("btn-time",()=>l?.()),Ze("btn-board-train",()=>c?.()),Ze("btn-guidebook",()=>Fe(Me)),Ze("btn-quests",()=>{ke(),Fe(Ge)}),Ze("btn-tips",()=>Fe(qe)),Ze("btn-save-now",()=>{p?.persist(),pe("Progress saved on this device.")}),Ze("btn-reset-progress",()=>{m?.(),pe("Progress reset.")}),h?.forEach(U=>{const I=document.createElement("option");I.value=U.id,I.textContent=U.name,ne.appendChild(I)}),p?.data.activeRoute&&(ne.value=p.data.activeRoute),ne.addEventListener("change",()=>{x?.(ne.value),n()}),t.stations.forEach(U=>{const I=document.createElement("option");I.value=U.name,I.textContent=`${U.label}: ${U.name}`,re.appendChild(I)}),re.addEventListener("change",()=>{_?.(re.value),n()});function Fe(U){if(!U)return;const I=!U.hidden;[Me,Ge,qe].forEach(te=>{te&&te!==U&&window.matchMedia("(max-width: 860px)").matches&&(te.hidden=!0)}),U.hidden=I,n()}function ot(U){U&&(U.hidden=!0,n())}[Me,Ge,qe].forEach(U=>{U?.addEventListener("pointerdown",I=>I.stopPropagation())}),document.querySelectorAll("[data-close-panel]").forEach(U=>{U.addEventListener("click",()=>ot(document.getElementById(U.dataset.closePanel)))}),document.querySelectorAll("[data-collapse-panel]").forEach(U=>{const I=document.getElementById(U.dataset.collapsePanel);I&&U.addEventListener("click",te=>{te.stopPropagation();const J=I.classList.toggle("is-collapsed");U.textContent=J?"+":"−",U.setAttribute("aria-label",J?`Restore ${I.id}`:`Minimize ${I.id}`),n()})}),window.addEventListener("keydown",U=>{U.key==="Escape"&&[Me,Ge,qe].forEach(ot)});function A(U){U&&(et.textContent=U.name,tt.textContent=U.note??"Tourism stop in the stylized KL guide.",K.innerHTML="",[["District",U.district],["Best time",U.bestTime],["Category",U.category],["Tip",U.tip]].forEach(([I,te])=>{const J=document.createElement("dt");J.textContent=I;const ue=document.createElement("dd");ue.textContent=te??"-",K.append(J,ue)}),Z.innerHTML="",d?.zones?.forEach(I=>{const te=document.createElement("p");te.textContent=`${I.name}: ${I.summary}`,Z.appendChild(te)}))}function ke(){me.innerHTML="",u?.summaries().forEach(U=>{const I=document.createElement("p");I.className=U.complete?"is-complete":"",I.textContent=`${U.complete?"Done":`${U.progress}/${U.target}`} · ${U.name}: ${U.description}`,me.appendChild(I)})}function He(){Le.innerHTML="",[...d?.tips??[],...d?.facts??[],...(d?.glossary??[]).map(U=>`${U.term}: ${U.meaning}`)].forEach(U=>{const I=document.createElement("p");I.textContent=U,Le.appendChild(I)})}if(A(i[0]),He(),H&&Y){let I=null,te={x:0,y:0};const J=(se,j)=>{const ie=Math.hypot(se,j),Ee=ie>46?46/ie:1,Se=se*Ee,he=j*Ee,Ce=Se/46,P=-he/46;Y.style.transform=`translate(calc(-50% + ${Se}px), calc(-50% + ${he}px))`,e.setVirtualAxis(Ce,P),t.wake(),n()},ue=()=>{I=null,Y.style.transform="translate(-50%, -50%)",e.setVirtualAxis(0,0),H.classList.remove("is-active"),n()};H.addEventListener("pointerdown",se=>{se.preventDefault(),I=se.pointerId,H.setPointerCapture?.(se.pointerId);const j=H.getBoundingClientRect();te={x:j.left+j.width/2,y:j.top+j.height/2},H.classList.add("is-active"),J(se.clientX-te.x,se.clientY-te.y)}),H.addEventListener("pointermove",se=>{se.pointerId===I&&(se.preventDefault(),J(se.clientX-te.x,se.clientY-te.y))}),H.addEventListener("pointerup",se=>{se.pointerId===I&&(se.preventDefault(),H.releasePointerCapture?.(se.pointerId),ue())}),H.addEventListener("pointercancel",ue),H.addEventListener("lostpointercapture",ue),ye(H)}let Qe=0;function pe(U){X.textContent=U,X.style.opacity="1",clearTimeout(Qe),Qe=setTimeout(()=>{X.style.opacity="0.75"},2200)}const Je=U=>Number.isFinite(U)?Intl.NumberFormat("en",{notation:"compact",maximumFractionDigits:1}).format(U):"--";function be(U){T.textContent=U.total.toLocaleString();const I=U.generatedDetail;I&&(b.textContent=Je(I.authoredTotal),R.textContent=Je(U.total+I.authoredTotal),B.textContent=Je(I.visibleBudget))}function De(U){M.textContent=`${U.count}/${U.total}`,i.forEach(I=>{Q.get(I.name)?.classList.toggle("is-visited",U.isVisited(I))}),ke()}function S({active:U,nextName:I,distance:te,progressText:J}){const ue=document.getElementById("btn-tour");ue.textContent=U?"Cancel Tour":"Start KL Tour",y.textContent=J??"Off",D.textContent=U&&I?`Next destination: ${I} · ${Math.round(te)}m`:"Next destination: none"}function g(U){document.getElementById("btn-time").textContent=U}function k(U){W.hidden=!U}function q({fps:U,pixelRatio:I,running:te,trainsActive:J,generatedDetail:ue}){f.textContent=U>0?String(Math.round(U)):"--",E.textContent=`${I.toFixed(2)}x`,O.textContent=te?J?"Active + transit":"Active":"Paused",ue&&(w.textContent=`${ue.activeChunks}/${ue.loadedChunks}`,L.textContent=`${Je(ue.visibleRendered)}/${Je(ue.visibleAuthored)}`,b.textContent=Je(ue.authoredTotal),B.textContent=Je(ue.visibleBudget))}return{setVoxelStats:be,setProgress:De,setTour:S,setTimeMode:g,setBoardTrainAvailable:k,update:q,showToast:pe,setGuidebook:A,renderQuests:ke}}function Wx({canvas:i,terrain:e,landmarks:t,player:n,onLandmarkClick:a}){const r=i.getContext("2d");let s=180;const o=Math.min(window.devicePixelRatio||1,2),l=[];function c(){return window.matchMedia("(max-width: 460px)").matches?86:window.matchMedia("(pointer: coarse), (max-width: 860px)").matches?120:180}function d(){s=c(),i.width=s*o,i.height=s*o,i.style.width=`${s}px`,i.style.height=`${s}px`,r.setTransform(o,0,0,o,0,0)}function h(p){const x=e.max-e.min;return{x:(p.x-e.min)/x*s,y:(p.z-e.min)/x*s}}function u({nextLandmark:p,visited:x}){l.length=0,r.clearRect(0,0,s,s),r.fillStyle="rgba(5, 12, 24, 0.72)",r.fillRect(0,0,s,s),r.strokeStyle="rgba(255,255,255,0.12)",r.lineWidth=1;for(let m=0;m<=4;m+=1){const f=m/4*s;r.beginPath(),r.moveTo(f,0),r.lineTo(f,s),r.moveTo(0,f),r.lineTo(s,f),r.stroke()}for(const m of t){const f=h(m.position),E=p?.name===m.name;l.push({landmark:m,x:f.x,y:f.y}),r.fillStyle=x?.(m)?"#ffd166":"#68e1fd",r.strokeStyle=E?"#ffffff":"rgba(0,0,0,0.45)",r.lineWidth=E?3:1,r.beginPath(),r.arc(f.x,f.y,E?5.5:3.8,0,Math.PI*2),r.fill(),r.stroke()}const _=h(n.group.position);r.save(),r.translate(_.x,_.y),r.rotate(n.heading),r.fillStyle="#ffffff",r.beginPath(),r.moveTo(0,-8),r.lineTo(5,6),r.lineTo(0,3),r.lineTo(-5,6),r.closePath(),r.fill(),r.restore(),r.fillStyle="rgba(255,255,255,0.82)",r.font="700 11px system-ui, sans-serif",r.fillText("N",s-17,16)}return i.addEventListener("pointerdown",p=>{const x=i.getBoundingClientRect(),_=p.clientX-x.left,m=p.clientY-x.top,f=l.find(E=>Math.hypot(E.x-_,E.y-m)<10);f&&a?.(f.landmark)}),d(),window.addEventListener("resize",d),{draw:u}}const Xx=[{id:"classic",name:"Classic KL",caption:"Greetings from Kuala Lumpur."},{id:"heritage",name:"Heritage Walk",caption:"Layers of rivers, markets, mosques, and old civic streets."},{id:"food",name:"Food Trail",caption:"Street grills, market colors, and late-night Jalan Alor energy."},{id:"rainy",name:"Monsoon Mood",caption:"Wet roads and tower lights after tropical rain."},{id:"malaysia",name:"Malaysia Highlights",caption:"KL as a launchpad for islands, highlands, rainforest, and Borneo."}];function Kx(i,e="Day"){const t=i?.name??"Kuala Lumpur";return e==="Rain"||e==="Thunderstorm"?`${t} after rain, with roads glowing under city lights.`:e==="Night"?`${t} at night in the tourism city map.`:`${t}, captured from the voxel tourism guide.`}function qx({renderer:i,scene:e,camera:t,controls:n,hudRoot:a,landmarks:r,postcards:s,getCurrentLandmark:o,getTimeMode:l,applyPreset:c,requestRender:d,showToast:h,onCapture:u}){const p=document.getElementById("photo-mode"),x=document.getElementById("btn-photo-mode"),_=document.getElementById("btn-photo-exit"),m=document.getElementById("btn-photo-shot"),f=document.getElementById("photo-fov"),E=document.getElementById("photo-presets"),T=document.getElementById("postcard-template"),w=document.getElementById("postcard-caption");let L=!1;["Skyline","Petronas","Merdeka","KL Tower","Tour Poster"].forEach(M=>{const y=document.createElement("button");y.type="button",y.textContent=M,y.addEventListener("click",()=>{const D=r.find(O=>O.name.includes(M.replace("KL Tower","KL Tower").replace("Merdeka","Merdeka 118")));c(M,D),h(`Photo preset: ${M}`),d()}),E.appendChild(y)}),s?.forEach(M=>{const y=document.createElement("option");y.value=M.id,y.textContent=M.name,T.appendChild(y)});function R(){const M=s?.find(y=>y.id===T.value);w.textContent=M?.caption??Kx(o?.(),l?.())}T.addEventListener("change",R),R();function B(M){L=M,p.hidden=!L,a.classList.toggle("is-photo-clean",L),h(L?"Photo mode enabled.":"Photo mode closed."),d()}return x.addEventListener("click",()=>B(!0)),_.addEventListener("click",()=>B(!1)),f.addEventListener("input",()=>{t.fov=Number(f.value),t.updateProjectionMatrix(),d()}),m.addEventListener("click",()=>{n.update(),i.render(e,t);const M=i.domElement.toDataURL("image/png"),y=document.createElement("a");y.href=M,y.download=`voxel-kl-${Date.now()}.png`,"download"in y?y.click():window.open(M,"_blank","noopener"),u?.({postcardId:T.value,caption:w.textContent}),h(`Postcard captured: ${w.textContent}`)}),{setActive:B,get active(){return L}}}const ya=[{id:"first-timer-kl",name:"First Timer KL",stops:["Petronas Twin Towers","KLCC Park","KL Tower","Merdeka Square","Petaling Street / Chinatown","Jalan Alor"],summary:"A compact introduction to skyline, heritage, and food."},{id:"heritage-trail",name:"Heritage Trail",stops:["Merdeka Square","Sultan Abdul Samad Building","Royal Selangor Club","Masjid Jamek / River of Life","Central Market","Petaling Street / Chinatown","Old Railway Station"],summary:"Colonial core, river history, markets, and old rail architecture."},{id:"food-night-market",name:"Food & Night Market",stops:["Kampung Baru","Chow Kit Market","Petaling Street / Chinatown","Jalan Alor","Bukit Bintang"],summary:"Markets, street food, and evening city energy."},{id:"garden-museum",name:"Garden & Museum",stops:["Masjid Negara","Islamic Arts Museum","National Planetarium","Lake Gardens","Tugu Negara","National Museum"],summary:"Indoor culture stops and green paths for a slower day."},{id:"skyline-modern-kl",name:"Skyline Modern KL",stops:["Petronas Twin Towers","KLCC Park","Pavilion KL","TRX Exchange 106","Merdeka 118","KL Tower"],summary:"Towers, malls, and modern city viewpoints."},{id:"greater-kl-megaloop",name:"Greater KL Mega Loop",stops:["Petronas Twin Towers","Mont Kiara Dining Cluster","FRIM Forest Reserve","Kuala Selangor Fireflies","Shah Alam Blue Mosque","Sunway Lagoon & Pyramid","Putrajaya Lake & Mosque","Zoo Negara","Genting Highlands Gateway"],summary:"A huge ring route through satellite districts, nature, family parks, and day-trip edges."},{id:"food-suburbs",name:"Food Suburbs",stops:["Kampung Baru","Bangsar Village","Mid Valley Megamall","Klang Royal Town","Kajang Satay Town","Jalan Alor"],summary:"Local food districts beyond the old compact tourist triangle."},{id:"nature-highlands",name:"Nature & Highlands",stops:["Lake Gardens","FRIM Forest Reserve","Rawang Forest Gateway","Genting Highlands Gateway","Zoo Negara","Broga Hill Sunrise","Kuala Selangor Fireflies"],summary:"A green outer-map itinerary for forests, hills, wildlife, and cooler air."},{id:"pj-subang-sunway",name:"PJ / Subang / Sunway",stops:["TTDI Market","1 Utama & Bandar Utama","PJ Old Town","Section 17 Market","SS15 Food Street","Sunway Lagoon & Pyramid","USJ Taipan"],summary:"A dense west-side suburban food, mall, and family-attraction loop."},{id:"shah-alam-klang-coast",name:"Shah Alam / Klang / Coast",stops:["Shah Alam Blue Mosque","i-City Shah Alam","Sultan Alam Shah Museum","Klang Royal Town","Klang Little India","Port Klang Coastal Gate","Pulau Ketam Ferry Gate","Morib Beach Gateway"],summary:"Blue Mosque, royal Klang, coastal gateways, ferry points, and local food."},{id:"putrajaya-airport-south",name:"Putrajaya / Airport / South",stops:["IOI City Mall","Putrajaya Pink Mosque","Putrajaya Lake & Mosque","Putrajaya Bridge Promenade","Cyberjaya Tech Garden","Dengkil Kampung Food","Sepang Circuit","KLIA Terminal Gateway","Kajang Satay Town"],summary:"Civic lakefront, Cyberjaya, KLIA, Sepang, and south-corridor food."},{id:"north-east-nature-ring",name:"North-East Nature Ring",stops:["Titiwangsa Lake Gardens","Setapak Food Quarter","Wangsa Maju Town Centre","Zoo Negara","Batu Caves Temple Steps","Gombak Transit Gate","Templer Park","Kanching Falls","Rawang Waterfall Gate"],summary:"Lake views, local food, Batu Caves, waterfalls, and forest gateways."},{id:"central-hidden-gems",name:"Central Hidden Gems",stops:["Saloma Bridge","Kampung Baru","RexKL","Petaling Street / Chinatown","Masjid Jamek / River of Life","Sentul Depot","Titiwangsa Lake Gardens","Publika Arts Mall"],summary:"Useful central additions beyond the standard tower-and-market circuit."},{id:"malaysia-highlights",name:"Malaysia Highlights",stops:["Penang George Town Gateway","Langkawi Gateway","Malacca Gateway","Cameron Highlands Gateway","Taman Negara Gateway","Kinabalu Gateway","Perhentian Islands Gateway","Putrajaya Gateway","Sepang / KLIA Gateway"],summary:"Gateway pads for planning beyond Kuala Lumpur."}],Yx=[{id:"welcome-walk",name:"Welcome Walk",description:"Collect any 5 landmark stamps.",type:"visitCount",target:5},{id:"heritage-steps",name:"Heritage Steps",description:"Visit 5 heritage or culture stops.",type:"tagVisits",tags:["heritage","history","mosque","temple","architecture"],target:5},{id:"food-scout",name:"Food Scout",description:"Visit 3 food or market places.",type:"tagVisits",tags:["food","market","night market","wet market"],target:3},{id:"rail-rider",name:"Rail Rider",description:"Take 2 train rides.",type:"trainRides",target:2},{id:"postcard-starter",name:"Postcard Starter",description:"Capture 3 postcards.",type:"photos",target:3},{id:"weather-watcher",name:"Weather Watcher",description:"Try Rain or Thunderstorm mode.",type:"weather",modes:["Rain","Thunderstorm"],target:1},{id:"malaysia-planner",name:"Malaysia Planner",description:"Visit 4 Malaysia highlight gateway pads.",type:"districtVisits",district:"Malaysia Highlights",target:4}],jx=[{id:"kl-completist",name:"KL Completist",description:"Collect 20 stamps."},{id:"route-finisher",name:"Route Finisher",description:"Complete any guided route."},{id:"night-photographer",name:"Night Photographer",description:"Take a postcard in Night, Rain, or Thunderstorm mode."}],Qr="voxel-kl-tourism-save-v2",Cc=2,$x={version:Cc,visited:[],completedQuests:[],unlockedPostcards:["classic"],activeRoute:"first-timer-kl",timeMode:"Day",trainRides:0,photoCaptures:0,weatherModes:[],completedRoutes:[],updatedAt:0};function la(){return{...$x,visited:[],completedQuests:[],unlockedPostcards:["classic"],weatherModes:[],completedRoutes:[]}}class Zx{constructor(e=window.localStorage){this.storage=e,this.data=this.load()}load(){try{const e=this.storage?.getItem(Qr);if(!e)return la();const t=JSON.parse(e);return!t||t.version!==Cc?la():{...la(),...t}}catch{return la()}}persist(){this.data.updatedAt=Date.now();try{this.storage?.setItem(Qr,JSON.stringify(this.data))}catch{}}reset(){this.data=la();try{this.storage?.removeItem(Qr)}catch{}}setActiveRoute(e){this.data.activeRoute=e,this.persist()}setTimeMode(e){this.data.timeMode=e,this.data.weatherModes.includes(e)||this.data.weatherModes.push(e),this.persist()}markVisited(e){return this.data.visited.includes(e)?!1:(this.data.visited.push(e),this.persist(),!0)}completeQuest(e){return this.data.completedQuests.includes(e)?!1:(this.data.completedQuests.push(e),this.persist(),!0)}unlockPostcard(e){return this.data.unlockedPostcards.includes(e)?!1:(this.data.unlockedPostcards.push(e),this.persist(),!0)}addTrainRide(e){this.data.trainRides+=1,this.data.lastTrainRoute=e,this.persist()}addPhotoCapture({postcardId:e,timeMode:t}){this.data.photoCaptures+=1,e&&this.unlockPostcard(e),["Night","Rain","Thunderstorm"].includes(t)&&(this.data.nightPhoto=!0),this.persist()}completeRoute(e){return this.data.completedRoutes.includes(e)?!1:(this.data.completedRoutes.push(e),this.persist(),!0)}}class Jx{constructor(e,t,n,a){this.quests=e,this.achievements=t,this.saveSystem=n,this.landmarks=a,this.completedAchievements=new Set}get visitedLandmarks(){const e=new Set(this.saveSystem.data.visited);return this.landmarks.filter(t=>e.has(t.name))}progressFor(e){const t=this.visitedLandmarks;if(e.type==="visitCount")return Math.min(t.length,e.target);if(e.type==="trainRides")return Math.min(this.saveSystem.data.trainRides,e.target);if(e.type==="photos")return Math.min(this.saveSystem.data.photoCaptures,e.target);if(e.type==="weather")return this.saveSystem.data.weatherModes.some(n=>e.modes.includes(n))?1:0;if(e.type==="districtVisits")return Math.min(t.filter(n=>n.district===e.district).length,e.target);if(e.type==="tagVisits"){const n=t.filter(a=>a.tags?.some(r=>e.tags.includes(r))||e.tags.includes(a.category)).length;return Math.min(n,e.target)}return 0}evaluate(){const e=[];for(const t of this.quests)this.saveSystem.data.completedQuests.includes(t.id)||this.progressFor(t)>=t.target&&this.saveSystem.completeQuest(t.id)&&e.push(t);for(const t of this.achievements)t.id==="kl-completist"&&this.saveSystem.data.visited.length>=20&&this.completedAchievements.add(t.id),t.id==="route-finisher"&&this.saveSystem.data.completedRoutes.length>0&&this.completedAchievements.add(t.id),t.id==="night-photographer"&&this.saveSystem.data.nightPhoto&&this.completedAchievements.add(t.id);return e}summaries(){return this.quests.map(e=>({...e,progress:this.progressFor(e),complete:this.saveSystem.data.completedQuests.includes(e.id)}))}}function Qx(i="chunks/metadata.json",e=globalThis.location?.href){return e?new URL(i,e).toString():i}async function eg(i={}){const e=i.fetcher??globalThis.fetch?.bind(globalThis);if(!e)return null;const t=i.url??Qx(i.path??"chunks/metadata.json",i.baseUrl),n=await e(t,{cache:i.cache??"force-cache"});if(!n.ok)throw new Error(`Failed to load static chunk manifest: ${n.status} ${t}`);const a=await n.json();if(!a||!Array.isArray(a.chunks))throw new Error("Invalid static chunk manifest: chunks array missing");return a}const Gl=1e7,tg=11e5,ng=64,Vl=-7,Hl=7,Wl=["glassDark","concrete","road","grassDark","lampGlow"],ig=[{name:"KLCC / Golden Triangle",x:47,z:43,weight:1.55},{name:"Bukit Bintang / TRX",x:41,z:30,weight:1.45},{name:"Merdeka / Chinatown",x:37,z:37,weight:1.28},{name:"Bangsar / Mid Valley",x:10,z:18,weight:1.05},{name:"Petaling Jaya",x:-42,z:13,weight:1.05},{name:"Subang / Sunway",x:-82,z:-25,weight:.98},{name:"Shah Alam",x:-57,z:-4,weight:.92},{name:"Klang",x:-150,z:-3,weight:.72},{name:"Putrajaya",x:35,z:-88,weight:.8},{name:"KLIA / Sepang",x:45,z:-199,weight:.54},{name:"Batu Caves / Gombak",x:57,z:88,weight:.72},{name:"Genting foothills",x:91,z:199,weight:.45},{name:"Kuala Selangor coast",x:-203,z:150,weight:.38}];function ag(i,e,t){return Math.max(e,Math.min(t,i))}function rg(i,e,t=ng){return{x:i*t+t/2,z:e*t+t/2}}function sg(i,e){let t=.08;for(const r of ig){const s=Math.hypot(i-r.x,e-r.z);t+=r.weight*Math.exp(-(s*s)/12168)}const n=Math.exp(-(Math.abs(e-20)**2)/2312)*.34,a=Math.exp(-(Math.abs(i-42)**2)/2888)*.22;return ag(t+n+a,.08,2.4)}function og(){const i=[];let e=0;for(let a=Vl;a<=Hl;a+=1)for(let r=Vl;r<=Hl;r+=1){const s=rg(a,r),o=sg(s.x,s.z);e+=o,i.push({id:`detail_${a}_${r}`,cx:a,cz:r,center:s,density:o,authoredCount:0,lod:Math.abs(a)<=4&&Math.abs(r)<=4?"high":"medium"})}let t=0;for(const a of i)a.authoredCount=Math.max(1,Math.floor(a.density/e*Gl)),t+=a.authoredCount;let n=Gl-t;i.sort((a,r)=>r.density-a.density);for(let a=0;n>0;a=(a+1)%i.length,n-=1)i[a].authoredCount+=1;return i.sort((a,r)=>a.cx-r.cx||a.cz-r.cz)}function lg(i){let e=i>>>0;return()=>{e+=1831565813;let t=e;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}}function cg(i,e){return(i+101)*73856093^(e+103)*19349663^2654435769}function dg(i,e){const t=i();return Math.abs(e)<.08&&t<.72?"road":t<.08?"lampGlow":t<.2?"grassDark":t<.58?"concrete":"glassDark"}function hg(i){return new Tt({color:go[i],flatShading:!0,fog:!0})}class ug{constructor(e,t,n={}){this.scene=e,this.terrain=t,this.chunkSize=n.chunkSize??64,this.baseVisibleInstances=n.baseVisibleInstances??0,this.visibleBudget=n.visibleBudget??tg,this.detailBudget=Math.max(0,this.visibleBudget-this.baseVisibleInstances),this.chunkPlan=n.chunkPlan??og(),this.loaded=new Map,this.geometry=new Mn(1,1,1),this.geometry.computeBoundingBox(),this.materials=new Map(Wl.map(a=>[a,hg(a)])),this.lastOrigin=null,this.visibleAuthored=0,this.visibleRendered=0}chooseChunks(e){const t=xo(e.x,e.z,this.chunkSize),n=this.chunkPlan.map(s=>({...s,distance:Sc(s,t)})).sort((s,o)=>s.distance-o.distance||o.authoredCount-s.authoredCount),a=[];let r=0;for(const s of n){if(r>=this.detailBudget&&a.length>0||s.distance>4&&r>this.detailBudget*.85)break;a.push(s),r+=s.authoredCount}return{origin:t,chunks:a,authored:r}}createChunkGroup(e,t){const n=new Ht;n.name=`generated_detail_${e.id}`,n.userData.generatedDetail={id:e.id,authoredCount:e.authoredCount,renderCount:t};const a=new Map(Wl.map(u=>[u,[]])),r=lg(cg(e.cx,e.cz)),s=e.cx*this.chunkSize,o=e.cz*this.chunkSize;for(let u=0;u<t;u+=1){const p=r(),x=r(),_=s+p*this.chunkSize,m=o+x*this.chunkSize,f=this.terrain.surfaceYAt(_,m),E=x-.5,T=dg(r,E),w=T==="glassDark",L=w?.9+r()*1.4:.8+r()*1.8,b=w?.9+r()*1.4:.8+r()*1.8,R=T==="road"?.08:T==="lampGlow"?.5:w?2+r()*10:.4+r()*3.8;a.get(T).push({x:_,y:f+R/2+.08,z:m,sx:L,sy:R,sz:b})}const l=new st,c=new C,d=new Bn,h=new C;for(const[u,p]of a.entries()){if(!p.length)continue;const x=new uc(this.geometry,this.materials.get(u),p.length);x.name=`generated_detail_${u}_${e.id}`,x.userData.voxelMaterialKey=u,x.instanceMatrix.setUsage(ar),x.castShadow=!1,x.receiveShadow=!0,p.forEach((_,m)=>{c.set(_.x,_.y,_.z),h.set(_.sx,_.sy,_.sz),l.compose(c,d,h),x.setMatrixAt(m,l)}),x.computeBoundingSphere(),n.add(x)}return this.scene.add(n),n}update(e){const{origin:t,chunks:n,authored:a}=this.chooseChunks(e);if(this.lastOrigin&&this.lastOrigin.cx===t.cx&&this.lastOrigin.cz===t.cz)return{changed:!1,visibleAuthored:this.visibleAuthored,visibleRendered:this.visibleRendered};this.lastOrigin=t;const r=new Set(n.map(c=>c.id));let s=!1,o=0;const l=a>this.detailBudget?this.detailBudget/a:1;for(const c of n){const d=Math.max(1,Math.floor(c.authoredCount*l));this.loaded.has(c.id)||(this.loaded.set(c.id,this.createChunkGroup(c,d)),s=!0);const h=this.loaded.get(c.id);h.visible||(h.visible=!0,s=!0),o+=h.userData.generatedDetail.renderCount}for(const[c,d]of this.loaded.entries())!r.has(c)&&d.visible&&(d.visible=!1,s=!0);return this.visibleAuthored=a,this.visibleRendered=o,{changed:s,visibleAuthored:a,visibleRendered:o}}getStats(){const e=[...this.loaded.values()].filter(t=>t.visible).length;return{authoredTotal:this.chunkPlan.reduce((t,n)=>t+n.authoredCount,0),chunks:this.chunkPlan.length,loadedChunks:this.loaded.size,activeChunks:e,visibleAuthored:this.visibleAuthored,visibleRendered:this.visibleRendered,visibleBudget:this.visibleBudget,detailBudget:this.detailBudget}}}const fg=document.getElementById("game-canvas"),hi=new B0(fg),Nt=new _h,Wt=new nn(64,window.innerWidth/window.innerHeight,.1,1800),Rc=new Ch(14544639,2437663,1.7);Nt.add(Rc);const Pc=new Dh(16777215,.38);Nt.add(Pc);const _o=new Lh(16774095,2.6);_o.position.set(-55,96,-75);Nt.add(_o);const $e=Ux(Nt),er=new ug(Nt,$e.terrain,{baseVisibleInstances:$e.voxelStats.total}),mt=new Fx(Nt,$e.terrain,$e.startPosition),yt=new Ox(Nt,$e.transportPaths),Lc=new Vx(Nt,$e.terrain),Qt=new Zx,Zn=new zx($e.landmarks,10,Qt.data.visited),Dc=ya.find(i=>i.id===Qt.data.activeRoute)??ya[0],un=new Gx($e.landmarks,Dc.stops);un.routeId=Dc.id;const Ji=new Jx(Yx,jx,Qt,$e.landmarks);Wt.position.copy($e.startPosition).add(new C(22,18,24));Wt.lookAt(mt.group.position);const dt=new T0(Wt,hi.domElement);dt.enableDamping=!0;dt.dampingFactor=.08;dt.enablePan=!1;dt.minDistance=7;dt.maxDistance=520;dt.maxPolarAngle=Math.PI*.495;dt.target.copy(mt.group.position).add(new C(0,2,0));dt.update();let or=!1,tr=!0,Ks=performance.now(),es=0,ts=0,ns=performance.now(),vo=dt.target.clone(),lr=$e.landmarks[0],Fn=0,qs=!1;const Qn=["Day","Golden Hour","Sunset","Night","Rain","Thunderstorm"];Fn=Math.max(0,Qn.indexOf(Qt.data.timeMode));const cr=new Et(new ho(3.2,10,4),new hr({color:16765286,transparent:!0,opacity:.52}));cr.visible=!1;Nt.add(cr);const Ic=new sn,yo=360,nr=new Float32Array(yo*3);for(let i=0;i<yo;i+=1)nr[i*3]=$e.terrain.min+Math.random()*$e.terrain.size,nr[i*3+1]=18+Math.random()*95,nr[i*3+2]=$e.terrain.min+Math.random()*$e.terrain.size;Ic.setAttribute("position",new rn(nr,3));const Yn=new Sh(Ic,new fc({color:11130879,size:.24,transparent:!0,opacity:.62}));Yn.visible=!1;Nt.add(Yn);function At(){tr=!0,yt.wake(4500),Lc.wake(4500),or||(or=!0,Ks=performance.now(),requestAnimationFrame(Fc))}function Ki(i,e=44){dt.target.copy(i),vo.copy(i),Wt.position.copy(i).add(new C(e,e*.72,e)),Wt.lookAt(i),dt.update()}function Oi(i,e=lr){const t=mt.group.position.clone().add(new C(0,2,0));if(i==="walk")Ki(t,22),Ke?.showToast("Walk camera.");else if(i==="landmark"){const n=e?.position?.clone()??t;Ki(n,58),Ke?.showToast("Landmark camera.")}else{const n=new C(0,30,0);dt.target.copy(n),vo.copy(n),Wt.position.set(310,260,325),Wt.lookAt(n),dt.update(),Ke?.showToast("Skyline overview.")}At()}function Uc(i){lr=i;const e=i.position.clone(),t=new C(8,0,8);mt.warpTo(e.clone().add(t)),Zn.markVisited(i),Qt.markVisited(i.name),Ji.evaluate().forEach(n=>Ke?.showToast(`Quest complete: ${n.name}`)),Ke?.setProgress(Zn),Ke?.setGuidebook(i),Ki(e,58),At()}function mr(i={}){const e=un.current,t=e?Math.hypot(mt.group.position.x-e.position.x,mt.group.position.z-e.position.z):0;Ke.setTour({active:un.active,nextName:e?.name,distance:i.distance??t,progressText:un.progressText}),cr.visible=!!e,e&&cr.position.set(e.position.x,e.position.y+18+Math.sin(performance.now()/280)*2,e.position.z)}function pg(i){const e=ya.find(t=>t.id===i)??ya[0];un.setStops(e.stops,e.id),Qt.setActiveRoute(e.id),mr(),Ke?.showToast(`Route selected: ${e.name}`)}function mg(){const i=un.toggle();mr(),Ke.showToast(i?`KL Tour started: ${i.name}`:"KL Tour cancelled.")}function Nc(i){const e={Day:{bg:462879,fog:462879,hemi:1.7,ambient:.38,sun:2.6,exposure:1.05,wet:!1,rain:!1},"Golden Hour":{bg:1712432,fog:3813696,hemi:1.5,ambient:.44,sun:2.4,exposure:1.08,wet:!1,rain:!1},Sunset:{bg:2364458,fog:3744571,hemi:1.35,ambient:.48,sun:2.2,exposure:1.08,wet:!1,rain:!1},Night:{bg:198420,fog:329750,hemi:.72,ambient:.62,sun:.55,exposure:1.18,wet:!1,rain:!1},Rain:{bg:462879,fog:1780534,hemi:1,ambient:.58,sun:.8,exposure:1.1,wet:!0,rain:!0},Thunderstorm:{bg:132881,fog:1121322,hemi:.78,ambient:.7,sun:.35,exposure:1.2,wet:!0,rain:!0}}[i];Nt.background.setHex(e.bg),Nt.fog.color.setHex(e.fog),Rc.intensity=e.hemi,Pc.intensity=e.ambient,_o.intensity=e.sun,hi.renderer.toneMappingExposure=e.exposure,Nt.traverse(t=>{if(!t.isInstancedMesh||!t.name.includes("voxels_"))return;const n=t.userData.voxelMaterialKey??t.name.replace("voxels_","").split("_chunk_")[0];["glassDark","blackGlass","trainWindow","lampGlow"].includes(n)?t.material.color.setHex(i==="Night"?16765286:$e.palette[n]):n==="road"?t.material.color.setHex(e.wet?1186341:$e.palette[n]):$e.palette[n]&&t.material.color.setHex($e.palette[n])}),Yn.visible=e.rain,Qt.setTimeMode(i),Ji.evaluate().forEach(t=>Ke?.showToast(`Quest complete: ${t.name}`)),Ke?.setTimeMode(i),At()}function xg(){Fn=(Fn+1)%Qn.length;const i=Qn[Fn];Nc(i),Ke.showToast(`${i} mode.`)}function Mo(){if(yt.ride){const i=yt.exitRide($e.terrain);mt.enabled=!0,dt.enabled=!0,i&&mt.warpTo(i),Ke.showToast("Exited train."),At();return}yt.startRide(mt.group.position)&&(Qt.addTrainRide(yt.ride.train.name),Ji.evaluate().forEach(i=>Ke?.showToast(`Quest complete: ${i.name}`)),mt.enabled=!1,dt.enabled=!1,Ke.showToast("Boarded train cinematic. Press E or Exit to leave."),At())}const Ke=Hx({landmarks:$e.landmarks,player:mt,trainSystem:yt,requestRender:At,focusLandmark:Uc,refocusPlayer:()=>Ki(mt.group.position.clone().add(new C(0,2,0)),34),setCameraMode:Oi,toggleTour:mg,cycleTimeMode:xg,boardTrain:Mo,tourismContent:{zones:Z0,tips:J0,facts:Q0,glossary:ex},routes:ya,questSystem:Ji,saveSystem:Qt,setRoute:pg,fastTravel:i=>{const e=yt.fastTravelTo(i,$e.terrain);e&&(mt.warpTo(e),Ki(e.clone().add(new C(0,2,0)),34),Ke.showToast(`Fast travel: ${i}`))},resetProgress:()=>{Qt.reset(),Zn.visited.clear(),Ke.setProgress(Zn),Ke.renderQuests()}});Ke.setVoxelStats({...$e.voxelStats,generatedDetail:er.getStats()});Ke.setProgress(Zn);mr();Ke.setTimeMode(Qn[Fn]);Nc(Qn[Fn]);Ke.showToast("Explore Kuala Lumpur: WASD to move, touch joystick on mobile, routes and guidebook in panels.");eg().then(i=>{if(!i)return;$e.staticChunkManifest=i;const e=i.totalAuthoredWithGeneratedDetail??i.totalInstances;console.info(`Static chunk manifest ready: ${i.chunks.length} base chunks + ${i.generatedDetailChunks?.length??0} generated detail chunks / ${e.toLocaleString()} authored instances`)}).catch(i=>{console.info("Static chunk manifest not available yet; using bundled world.",i.message)});const gg=Wx({canvas:document.getElementById("mini-map"),terrain:$e.terrain,landmarks:$e.landmarks,player:mt,onLandmarkClick:Uc});qx({renderer:hi.renderer,scene:Nt,camera:Wt,controls:dt,hudRoot:document.getElementById("app"),landmarks:$e.landmarks,postcards:Xx,getCurrentLandmark:()=>lr,getTimeMode:()=>Qn[Fn],applyPreset:(i,e)=>{i==="Skyline"||i==="Tour Poster"?Oi("skyline"):Oi("landmark",e??lr)},requestRender:At,showToast:Ke.showToast,onCapture:({postcardId:i})=>{Qt.addPhotoCapture({postcardId:i,timeMode:Qn[Fn]}),Ji.evaluate().forEach(e=>Ke.showToast(`Quest complete: ${e.name}`)),Ke.renderQuests()}});function _g(){const i=mt.group.position.clone().add(new C(0,2.05,0)),e=dt.target.clone();dt.target.lerp(i,.24);const t=dt.target.clone().sub(e);Wt.position.add(t),vo.copy(dt.target)}function Fc(i){if(document.hidden){or=!1;return}const e=Math.min(.05,Math.max(.001,(i-Ks)/1e3));Ks=i;const t=mt.update(e,Wt);t&&_g();const n=yt.update(e),a=Lc.update(e);if(Yn.visible){const u=Yn.geometry.attributes.position.array;for(let p=0;p<yo;p+=1)u[p*3+1]-=e*(Qn[Fn]==="Thunderstorm"?46:30),u[p*3+1]<4&&(u[p*3]=$e.terrain.min+Math.random()*$e.terrain.size,u[p*3+1]=108,u[p*3+2]=$e.terrain.min+Math.random()*$e.terrain.size);Yn.geometry.attributes.position.needsUpdate=!0}const r=$e.chunkManager?.update(mt.group.position).changed??!1,s=er.update(mt.group.position).changed;if(yt.ride){const p=yt.ride.train.cars[0].position.clone();dt.target.copy(p),Wt.position.copy(p).add(new C(12,8,16)),Wt.lookAt(p),yt.ride.elapsed>=yt.ride.duration&&Mo()}const o=Zn.check(mt.group.position);o&&(Ke.setProgress(Zn),Qt.markVisited(o.name),Ji.evaluate().forEach(u=>Ke.showToast(`Quest complete: ${u.name}`)),Ke.showToast(`Stamp collected: ${o.name}`));const l=un.update(mt.group.position);l.advanced&&(l.complete&&Qt.completeRoute(un.routeId),Ke.showToast(l.complete?"KL Tour complete.":`Next stop: ${l.destination.name}`)),mr(l),qs=!!yt.findBoardingStation(mt.group.position)||!!yt.ride,Ke.setBoardTrainAvailable(qs),gg.draw({nextLandmark:un.current,visited:u=>Zn.isVisited(u)});const d=dt.update();(t||n||a||d||r||s||tr||un.active||yt.ride||Yn.visible)&&(hi.render(Nt,Wt),ts+=1),i-ns>500&&(es=ts*1e3/(i-ns),ts=0,ns=i);const h=t||n||a||d||r||s||tr||un.active||yt.ride||Yn.visible;Ke.update({fps:es,pixelRatio:hi.pixelRatio,running:h,trainsActive:yt.isActive,generatedDetail:er.getStats()}),tr=!1,h?requestAnimationFrame(Fc):(or=!1,Ke.update({fps:es,pixelRatio:hi.pixelRatio,running:!1,trainsActive:!1,generatedDetail:er.getStats()}))}dt.addEventListener("start",()=>{yt.wake(),At()});dt.addEventListener("change",At);dt.addEventListener("end",At);window.addEventListener("resize",()=>{hi.resize(Wt),At()});window.addEventListener("keydown",i=>{const e=i.key.toLowerCase();if(e==="f"&&(Ki(mt.group.position.clone().add(new C(0,2,0)),34),Ke.showToast("Camera refocused on the explorer.")),e==="1"&&Oi("walk"),e==="2"&&Oi("landmark"),e==="3"&&Oi("skyline"),e==="e"&&qs&&Mo(),e==="p"){const t=yt.togglePermanentMotion();Ke.showToast(t?"Continuous train motion enabled.":"Train motion now auto-pauses when idle.")}At()});window.addEventListener("keyup",At);window.addEventListener("pointerdown",At);window.addEventListener("wheel",At,{passive:!0});document.addEventListener("visibilitychange",()=>{document.hidden||At()});At();
