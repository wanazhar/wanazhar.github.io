(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const a of document.querySelectorAll('link[rel="modulepreload"]'))n(a);new MutationObserver(a=>{for(const r of a)if(r.type==="childList")for(const s of r.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function t(a){const r={};return a.integrity&&(r.integrity=a.integrity),a.referrerPolicy&&(r.referrerPolicy=a.referrerPolicy),a.crossOrigin==="use-credentials"?r.credentials="include":a.crossOrigin==="anonymous"?r.credentials="omit":r.credentials="same-origin",r}function n(a){if(a.ep)return;a.ep=!0;const r=t(a);fetch(a.href,r)}})();const qs="181",Fi={ROTATE:0,DOLLY:1,PAN:2},Ni={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},Bc=0,wo=1,kc=2,kl=1,Oc=2,An=3,Zn=0,Ht=1,Rn=2,In=0,Bi=1,Ao=2,Co=3,Ro=4,zc=5,li=100,Gc=101,Vc=102,Hc=103,Wc=104,Xc=200,Kc=201,qc=202,Yc=203,ts=204,ns=205,jc=206,$c=207,Zc=208,Jc=209,Qc=210,ed=211,td=212,nd=213,id=214,is=0,as=1,rs=2,zi=3,ss=4,os=5,ls=6,cs=7,Ys=0,ad=1,rd=2,jn=0,sd=1,od=2,ld=3,Ol=4,cd=5,dd=6,hd=7,zl=300,Gi=301,Vi=302,ds=303,hs=304,lr=306,us=1e3,Pn=1001,fs=1002,Zt=1003,ud=1004,Ta=1005,an=1006,xr=1007,di=1008,vn=1009,Gl=1010,Vl=1011,fa=1012,js=1013,ui=1014,gn=1015,qi=1016,$s=1017,Zs=1018,pa=1020,Hl=35902,Wl=35899,Xl=1021,Kl=1022,fn=1023,ma=1026,xa=1027,Js=1028,Qs=1029,eo=1030,to=1031,no=1033,ja=33776,$a=33777,Za=33778,Ja=33779,ps=35840,ms=35841,xs=35842,gs=35843,_s=36196,vs=37492,ys=37496,Ms=37808,bs=37809,Ss=37810,Ts=37811,Es=37812,ws=37813,As=37814,Cs=37815,Rs=37816,Ps=37817,Ls=37818,Ds=37819,Is=37820,Us=37821,Ns=36492,Fs=36494,Bs=36495,ks=36283,Os=36284,zs=36285,Gs=36286,fd=3200,pd=3201,ql=0,md=1,Xn="",jt="srgb",Hi="srgb-linear",nr="linear",it="srgb",gi=7680,Po=519,xd=512,gd=513,_d=514,Yl=515,vd=516,yd=517,Md=518,bd=519,Vs=35044,Lo="300 es",_n=2e3,ir=2001;function jl(i){for(let e=i.length-1;e>=0;--e)if(i[e]>=65535)return!0;return!1}function ar(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Sd(){const i=ar("canvas");return i.style.display="block",i}const Do={};function Io(...i){const e="THREE."+i.shift();console.log(e,...i)}function Ie(...i){const e="THREE."+i.shift();console.warn(e,...i)}function mt(...i){const e="THREE."+i.shift();console.error(e,...i)}function ga(...i){const e=i.join(" ");e in Do||(Do[e]=!0,Ie(...i))}function Td(i,e,t){return new Promise(function(n,a){function r(){switch(i.clientWaitSync(e,i.SYNC_FLUSH_COMMANDS_BIT,0)){case i.WAIT_FAILED:a();break;case i.TIMEOUT_EXPIRED:setTimeout(r,t);break;default:n()}}setTimeout(r,t)})}class pi{addEventListener(e,t){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[e]===void 0&&(n[e]=[]),n[e].indexOf(t)===-1&&n[e].push(t)}hasEventListener(e,t){const n=this._listeners;return n===void 0?!1:n[e]!==void 0&&n[e].indexOf(t)!==-1}removeEventListener(e,t){const n=this._listeners;if(n===void 0)return;const a=n[e];if(a!==void 0){const r=a.indexOf(t);r!==-1&&a.splice(r,1)}}dispatchEvent(e){const t=this._listeners;if(t===void 0)return;const n=t[e.type];if(n!==void 0){e.target=this;const a=n.slice(0);for(let r=0,s=a.length;r<s;r++)a[r].call(this,e);e.target=null}}}const Ct=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"];let Uo=1234567;const ha=Math.PI/180,_a=180/Math.PI;function Yi(){const i=Math.random()*4294967295|0,e=Math.random()*4294967295|0,t=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ct[i&255]+Ct[i>>8&255]+Ct[i>>16&255]+Ct[i>>24&255]+"-"+Ct[e&255]+Ct[e>>8&255]+"-"+Ct[e>>16&15|64]+Ct[e>>24&255]+"-"+Ct[t&63|128]+Ct[t>>8&255]+"-"+Ct[t>>16&255]+Ct[t>>24&255]+Ct[n&255]+Ct[n>>8&255]+Ct[n>>16&255]+Ct[n>>24&255]).toLowerCase()}function ze(i,e,t){return Math.max(e,Math.min(t,i))}function io(i,e){return(i%e+e)%e}function Ed(i,e,t,n,a){return n+(i-e)*(a-n)/(t-e)}function wd(i,e,t){return i!==e?(t-i)/(e-i):0}function ua(i,e,t){return(1-t)*i+t*e}function Ad(i,e,t,n){return ua(i,e,1-Math.exp(-t*n))}function Cd(i,e=1){return e-Math.abs(io(i,e*2)-e)}function Rd(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*(3-2*i))}function Pd(i,e,t){return i<=e?0:i>=t?1:(i=(i-e)/(t-e),i*i*i*(i*(i*6-15)+10))}function Ld(i,e){return i+Math.floor(Math.random()*(e-i+1))}function Dd(i,e){return i+Math.random()*(e-i)}function Id(i){return i*(.5-Math.random())}function Ud(i){i!==void 0&&(Uo=i);let e=Uo+=1831565813;return e=Math.imul(e^e>>>15,e|1),e^=e+Math.imul(e^e>>>7,e|61),((e^e>>>14)>>>0)/4294967296}function Nd(i){return i*ha}function Fd(i){return i*_a}function Bd(i){return(i&i-1)===0&&i!==0}function kd(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Od(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function zd(i,e,t,n,a){const r=Math.cos,s=Math.sin,o=r(t/2),l=s(t/2),c=r((e+n)/2),d=s((e+n)/2),h=r((e-n)/2),u=s((e-n)/2),p=r((n-e)/2),g=s((n-e)/2);switch(a){case"XYX":i.set(o*d,l*h,l*u,o*c);break;case"YZY":i.set(l*u,o*d,l*h,o*c);break;case"ZXZ":i.set(l*h,l*u,o*d,o*c);break;case"XZX":i.set(o*d,l*g,l*p,o*c);break;case"YXY":i.set(l*p,o*d,l*g,o*c);break;case"ZYZ":i.set(l*g,l*p,o*d,o*c);break;default:Ie("MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+a)}}function Di(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Dt(i,e){switch(e.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}const Kn={DEG2RAD:ha,RAD2DEG:_a,generateUUID:Yi,clamp:ze,euclideanModulo:io,mapLinear:Ed,inverseLerp:wd,lerp:ua,damp:Ad,pingpong:Cd,smoothstep:Rd,smootherstep:Pd,randInt:Ld,randFloat:Dd,randFloatSpread:Id,seededRandom:Ud,degToRad:Nd,radToDeg:Fd,isPowerOfTwo:Bd,ceilPowerOfTwo:kd,floorPowerOfTwo:Od,setQuaternionFromProperEuler:zd,normalize:Dt,denormalize:Di};class Ue{constructor(e=0,t=0){Ue.prototype.isVector2=!0,this.x=e,this.y=t}get width(){return this.x}set width(e){this.x=e}get height(){return this.y}set height(e){this.y=e}set(e,t){return this.x=e,this.y=t,this}setScalar(e){return this.x=e,this.y=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y)}copy(e){return this.x=e.x,this.y=e.y,this}add(e){return this.x+=e.x,this.y+=e.y,this}addScalar(e){return this.x+=e,this.y+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this}subScalar(e){return this.x-=e,this.y-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this}multiply(e){return this.x*=e.x,this.y*=e.y,this}multiplyScalar(e){return this.x*=e,this.y*=e,this}divide(e){return this.x/=e.x,this.y/=e.y,this}divideScalar(e){return this.multiplyScalar(1/e)}applyMatrix3(e){const t=this.x,n=this.y,a=e.elements;return this.x=a[0]*t+a[3]*n+a[6],this.y=a[1]*t+a[4]*n+a[7],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(e){return this.x*e.x+this.y*e.y}cross(e){return this.x*e.y-this.y*e.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ze(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y;return t*t+n*n}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this}equals(e){return e.x===this.x&&e.y===this.y}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this}rotateAround(e,t){const n=Math.cos(t),a=Math.sin(t),r=this.x-e.x,s=this.y-e.y;return this.x=r*n-s*a+e.x,this.y=r*a+s*n+e.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}}class Jn{constructor(e=0,t=0,n=0,a=1){this.isQuaternion=!0,this._x=e,this._y=t,this._z=n,this._w=a}static slerpFlat(e,t,n,a,r,s,o){let l=n[a+0],c=n[a+1],d=n[a+2],h=n[a+3],u=r[s+0],p=r[s+1],g=r[s+2],y=r[s+3];if(o<=0){e[t+0]=l,e[t+1]=c,e[t+2]=d,e[t+3]=h;return}if(o>=1){e[t+0]=u,e[t+1]=p,e[t+2]=g,e[t+3]=y;return}if(h!==y||l!==u||c!==p||d!==g){let m=l*u+c*p+d*g+h*y;m<0&&(u=-u,p=-p,g=-g,y=-y,m=-m);let f=1-o;if(m<.9995){const E=Math.acos(m),T=Math.sin(E);f=Math.sin(f*E)/T,o=Math.sin(o*E)/T,l=l*f+u*o,c=c*f+p*o,d=d*f+g*o,h=h*f+y*o}else{l=l*f+u*o,c=c*f+p*o,d=d*f+g*o,h=h*f+y*o;const E=1/Math.sqrt(l*l+c*c+d*d+h*h);l*=E,c*=E,d*=E,h*=E}}e[t]=l,e[t+1]=c,e[t+2]=d,e[t+3]=h}static multiplyQuaternionsFlat(e,t,n,a,r,s){const o=n[a],l=n[a+1],c=n[a+2],d=n[a+3],h=r[s],u=r[s+1],p=r[s+2],g=r[s+3];return e[t]=o*g+d*h+l*p-c*u,e[t+1]=l*g+d*u+c*h-o*p,e[t+2]=c*g+d*p+o*u-l*h,e[t+3]=d*g-o*h-l*u-c*p,e}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get w(){return this._w}set w(e){this._w=e,this._onChangeCallback()}set(e,t,n,a){return this._x=e,this._y=t,this._z=n,this._w=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(e){return this._x=e.x,this._y=e.y,this._z=e.z,this._w=e.w,this._onChangeCallback(),this}setFromEuler(e,t=!0){const n=e._x,a=e._y,r=e._z,s=e._order,o=Math.cos,l=Math.sin,c=o(n/2),d=o(a/2),h=o(r/2),u=l(n/2),p=l(a/2),g=l(r/2);switch(s){case"XYZ":this._x=u*d*h+c*p*g,this._y=c*p*h-u*d*g,this._z=c*d*g+u*p*h,this._w=c*d*h-u*p*g;break;case"YXZ":this._x=u*d*h+c*p*g,this._y=c*p*h-u*d*g,this._z=c*d*g-u*p*h,this._w=c*d*h+u*p*g;break;case"ZXY":this._x=u*d*h-c*p*g,this._y=c*p*h+u*d*g,this._z=c*d*g+u*p*h,this._w=c*d*h-u*p*g;break;case"ZYX":this._x=u*d*h-c*p*g,this._y=c*p*h+u*d*g,this._z=c*d*g-u*p*h,this._w=c*d*h+u*p*g;break;case"YZX":this._x=u*d*h+c*p*g,this._y=c*p*h+u*d*g,this._z=c*d*g-u*p*h,this._w=c*d*h-u*p*g;break;case"XZY":this._x=u*d*h-c*p*g,this._y=c*p*h-u*d*g,this._z=c*d*g+u*p*h,this._w=c*d*h+u*p*g;break;default:Ie("Quaternion: .setFromEuler() encountered an unknown order: "+s)}return t===!0&&this._onChangeCallback(),this}setFromAxisAngle(e,t){const n=t/2,a=Math.sin(n);return this._x=e.x*a,this._y=e.y*a,this._z=e.z*a,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(e){const t=e.elements,n=t[0],a=t[4],r=t[8],s=t[1],o=t[5],l=t[9],c=t[2],d=t[6],h=t[10],u=n+o+h;if(u>0){const p=.5/Math.sqrt(u+1);this._w=.25/p,this._x=(d-l)*p,this._y=(r-c)*p,this._z=(s-a)*p}else if(n>o&&n>h){const p=2*Math.sqrt(1+n-o-h);this._w=(d-l)/p,this._x=.25*p,this._y=(a+s)/p,this._z=(r+c)/p}else if(o>h){const p=2*Math.sqrt(1+o-n-h);this._w=(r-c)/p,this._x=(a+s)/p,this._y=.25*p,this._z=(l+d)/p}else{const p=2*Math.sqrt(1+h-n-o);this._w=(s-a)/p,this._x=(r+c)/p,this._y=(l+d)/p,this._z=.25*p}return this._onChangeCallback(),this}setFromUnitVectors(e,t){let n=e.dot(t)+1;return n<1e-8?(n=0,Math.abs(e.x)>Math.abs(e.z)?(this._x=-e.y,this._y=e.x,this._z=0,this._w=n):(this._x=0,this._y=-e.z,this._z=e.y,this._w=n)):(this._x=e.y*t.z-e.z*t.y,this._y=e.z*t.x-e.x*t.z,this._z=e.x*t.y-e.y*t.x,this._w=n),this.normalize()}angleTo(e){return 2*Math.acos(Math.abs(ze(this.dot(e),-1,1)))}rotateTowards(e,t){const n=this.angleTo(e);if(n===0)return this;const a=Math.min(1,t/n);return this.slerp(e,a),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(e){return this._x*e._x+this._y*e._y+this._z*e._z+this._w*e._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let e=this.length();return e===0?(this._x=0,this._y=0,this._z=0,this._w=1):(e=1/e,this._x=this._x*e,this._y=this._y*e,this._z=this._z*e,this._w=this._w*e),this._onChangeCallback(),this}multiply(e){return this.multiplyQuaternions(this,e)}premultiply(e){return this.multiplyQuaternions(e,this)}multiplyQuaternions(e,t){const n=e._x,a=e._y,r=e._z,s=e._w,o=t._x,l=t._y,c=t._z,d=t._w;return this._x=n*d+s*o+a*c-r*l,this._y=a*d+s*l+r*o-n*c,this._z=r*d+s*c+n*l-a*o,this._w=s*d-n*o-a*l-r*c,this._onChangeCallback(),this}slerp(e,t){if(t<=0)return this;if(t>=1)return this.copy(e);let n=e._x,a=e._y,r=e._z,s=e._w,o=this.dot(e);o<0&&(n=-n,a=-a,r=-r,s=-s,o=-o);let l=1-t;if(o<.9995){const c=Math.acos(o),d=Math.sin(c);l=Math.sin(l*c)/d,t=Math.sin(t*c)/d,this._x=this._x*l+n*t,this._y=this._y*l+a*t,this._z=this._z*l+r*t,this._w=this._w*l+s*t,this._onChangeCallback()}else this._x=this._x*l+n*t,this._y=this._y*l+a*t,this._z=this._z*l+r*t,this._w=this._w*l+s*t,this.normalize();return this}slerpQuaternions(e,t,n){return this.copy(e).slerp(t,n)}random(){const e=2*Math.PI*Math.random(),t=2*Math.PI*Math.random(),n=Math.random(),a=Math.sqrt(1-n),r=Math.sqrt(n);return this.set(a*Math.sin(e),a*Math.cos(e),r*Math.sin(t),r*Math.cos(t))}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._w===this._w}fromArray(e,t=0){return this._x=e[t],this._y=e[t+1],this._z=e[t+2],this._w=e[t+3],this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._w,e}fromBufferAttribute(e,t){return this._x=e.getX(t),this._y=e.getY(t),this._z=e.getZ(t),this._w=e.getW(t),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}class C{constructor(e=0,t=0,n=0){C.prototype.isVector3=!0,this.x=e,this.y=t,this.z=n}set(e,t,n){return n===void 0&&(n=this.z),this.x=e,this.y=t,this.z=n,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this}multiplyVectors(e,t){return this.x=e.x*t.x,this.y=e.y*t.y,this.z=e.z*t.z,this}applyEuler(e){return this.applyQuaternion(No.setFromEuler(e))}applyAxisAngle(e,t){return this.applyQuaternion(No.setFromAxisAngle(e,t))}applyMatrix3(e){const t=this.x,n=this.y,a=this.z,r=e.elements;return this.x=r[0]*t+r[3]*n+r[6]*a,this.y=r[1]*t+r[4]*n+r[7]*a,this.z=r[2]*t+r[5]*n+r[8]*a,this}applyNormalMatrix(e){return this.applyMatrix3(e).normalize()}applyMatrix4(e){const t=this.x,n=this.y,a=this.z,r=e.elements,s=1/(r[3]*t+r[7]*n+r[11]*a+r[15]);return this.x=(r[0]*t+r[4]*n+r[8]*a+r[12])*s,this.y=(r[1]*t+r[5]*n+r[9]*a+r[13])*s,this.z=(r[2]*t+r[6]*n+r[10]*a+r[14])*s,this}applyQuaternion(e){const t=this.x,n=this.y,a=this.z,r=e.x,s=e.y,o=e.z,l=e.w,c=2*(s*a-o*n),d=2*(o*t-r*a),h=2*(r*n-s*t);return this.x=t+l*c+s*h-o*d,this.y=n+l*d+o*c-r*h,this.z=a+l*h+r*d-s*c,this}project(e){return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(e.projectionMatrix)}unproject(e){return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(e.matrixWorld)}transformDirection(e){const t=this.x,n=this.y,a=this.z,r=e.elements;return this.x=r[0]*t+r[4]*n+r[8]*a,this.y=r[1]*t+r[5]*n+r[9]*a,this.z=r[2]*t+r[6]*n+r[10]*a,this.normalize()}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this}divideScalar(e){return this.multiplyScalar(1/e)}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this.z=ze(this.z,e.z,t.z),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this.z=ze(this.z,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this}cross(e){return this.crossVectors(this,e)}crossVectors(e,t){const n=e.x,a=e.y,r=e.z,s=t.x,o=t.y,l=t.z;return this.x=a*l-r*o,this.y=r*s-n*l,this.z=n*o-a*s,this}projectOnVector(e){const t=e.lengthSq();if(t===0)return this.set(0,0,0);const n=e.dot(this)/t;return this.copy(e).multiplyScalar(n)}projectOnPlane(e){return gr.copy(this).projectOnVector(e),this.sub(gr)}reflect(e){return this.sub(gr.copy(e).multiplyScalar(2*this.dot(e)))}angleTo(e){const t=Math.sqrt(this.lengthSq()*e.lengthSq());if(t===0)return Math.PI/2;const n=this.dot(e)/t;return Math.acos(ze(n,-1,1))}distanceTo(e){return Math.sqrt(this.distanceToSquared(e))}distanceToSquared(e){const t=this.x-e.x,n=this.y-e.y,a=this.z-e.z;return t*t+n*n+a*a}manhattanDistanceTo(e){return Math.abs(this.x-e.x)+Math.abs(this.y-e.y)+Math.abs(this.z-e.z)}setFromSpherical(e){return this.setFromSphericalCoords(e.radius,e.phi,e.theta)}setFromSphericalCoords(e,t,n){const a=Math.sin(t)*e;return this.x=a*Math.sin(n),this.y=Math.cos(t)*e,this.z=a*Math.cos(n),this}setFromCylindrical(e){return this.setFromCylindricalCoords(e.radius,e.theta,e.y)}setFromCylindricalCoords(e,t,n){return this.x=e*Math.sin(t),this.y=n,this.z=e*Math.cos(t),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this}setFromMatrixScale(e){const t=this.setFromMatrixColumn(e,0).length(),n=this.setFromMatrixColumn(e,1).length(),a=this.setFromMatrixColumn(e,2).length();return this.x=t,this.y=n,this.z=a,this}setFromMatrixColumn(e,t){return this.fromArray(e.elements,t*4)}setFromMatrix3Column(e,t){return this.fromArray(e.elements,t*3)}setFromEuler(e){return this.x=e._x,this.y=e._y,this.z=e._z,this}setFromColor(e){return this.x=e.r,this.y=e.g,this.z=e.b,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const e=Math.random()*Math.PI*2,t=Math.random()*2-1,n=Math.sqrt(1-t*t);return this.x=n*Math.cos(e),this.y=t,this.z=n*Math.sin(e),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}}const gr=new C,No=new Jn;class Fe{constructor(e,t,n,a,r,s,o,l,c){Fe.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],e!==void 0&&this.set(e,t,n,a,r,s,o,l,c)}set(e,t,n,a,r,s,o,l,c){const d=this.elements;return d[0]=e,d[1]=a,d[2]=o,d[3]=t,d[4]=r,d[5]=l,d[6]=n,d[7]=s,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],this}extractBasis(e,t,n){return e.setFromMatrix3Column(this,0),t.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(e){const t=e.elements;return this.set(t[0],t[4],t[8],t[1],t[5],t[9],t[2],t[6],t[10]),this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,a=t.elements,r=this.elements,s=n[0],o=n[3],l=n[6],c=n[1],d=n[4],h=n[7],u=n[2],p=n[5],g=n[8],y=a[0],m=a[3],f=a[6],E=a[1],T=a[4],w=a[7],L=a[2],S=a[5],R=a[8];return r[0]=s*y+o*E+l*L,r[3]=s*m+o*T+l*S,r[6]=s*f+o*w+l*R,r[1]=c*y+d*E+h*L,r[4]=c*m+d*T+h*S,r[7]=c*f+d*w+h*R,r[2]=u*y+p*E+g*L,r[5]=u*m+p*T+g*S,r[8]=u*f+p*w+g*R,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[3]*=e,t[6]*=e,t[1]*=e,t[4]*=e,t[7]*=e,t[2]*=e,t[5]*=e,t[8]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[1],a=e[2],r=e[3],s=e[4],o=e[5],l=e[6],c=e[7],d=e[8];return t*s*d-t*o*c-n*r*d+n*o*l+a*r*c-a*s*l}invert(){const e=this.elements,t=e[0],n=e[1],a=e[2],r=e[3],s=e[4],o=e[5],l=e[6],c=e[7],d=e[8],h=d*s-o*c,u=o*l-d*r,p=c*r-s*l,g=t*h+n*u+a*p;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/g;return e[0]=h*y,e[1]=(a*c-d*n)*y,e[2]=(o*n-a*s)*y,e[3]=u*y,e[4]=(d*t-a*l)*y,e[5]=(a*r-o*t)*y,e[6]=p*y,e[7]=(n*l-c*t)*y,e[8]=(s*t-n*r)*y,this}transpose(){let e;const t=this.elements;return e=t[1],t[1]=t[3],t[3]=e,e=t[2],t[2]=t[6],t[6]=e,e=t[5],t[5]=t[7],t[7]=e,this}getNormalMatrix(e){return this.setFromMatrix4(e).invert().transpose()}transposeIntoArray(e){const t=this.elements;return e[0]=t[0],e[1]=t[3],e[2]=t[6],e[3]=t[1],e[4]=t[4],e[5]=t[7],e[6]=t[2],e[7]=t[5],e[8]=t[8],this}setUvTransform(e,t,n,a,r,s,o){const l=Math.cos(r),c=Math.sin(r);return this.set(n*l,n*c,-n*(l*s+c*o)+s+e,-a*c,a*l,-a*(-c*s+l*o)+o+t,0,0,1),this}scale(e,t){return this.premultiply(_r.makeScale(e,t)),this}rotate(e){return this.premultiply(_r.makeRotation(-e)),this}translate(e,t){return this.premultiply(_r.makeTranslation(e,t)),this}makeTranslation(e,t){return e.isVector2?this.set(1,0,e.x,0,1,e.y,0,0,1):this.set(1,0,e,0,1,t,0,0,1),this}makeRotation(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,n,t,0,0,0,1),this}makeScale(e,t){return this.set(e,0,0,0,t,0,0,0,1),this}equals(e){const t=this.elements,n=e.elements;for(let a=0;a<9;a++)if(t[a]!==n[a])return!1;return!0}fromArray(e,t=0){for(let n=0;n<9;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e}clone(){return new this.constructor().fromArray(this.elements)}}const _r=new Fe,Fo=new Fe().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Bo=new Fe().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Gd(){const i={enabled:!0,workingColorSpace:Hi,spaces:{},convert:function(a,r,s){return this.enabled===!1||r===s||!r||!s||(this.spaces[r].transfer===it&&(a.r=Un(a.r),a.g=Un(a.g),a.b=Un(a.b)),this.spaces[r].primaries!==this.spaces[s].primaries&&(a.applyMatrix3(this.spaces[r].toXYZ),a.applyMatrix3(this.spaces[s].fromXYZ)),this.spaces[s].transfer===it&&(a.r=ki(a.r),a.g=ki(a.g),a.b=ki(a.b))),a},workingToColorSpace:function(a,r){return this.convert(a,this.workingColorSpace,r)},colorSpaceToWorking:function(a,r){return this.convert(a,r,this.workingColorSpace)},getPrimaries:function(a){return this.spaces[a].primaries},getTransfer:function(a){return a===Xn?nr:this.spaces[a].transfer},getToneMappingMode:function(a){return this.spaces[a].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(a,r=this.workingColorSpace){return a.fromArray(this.spaces[r].luminanceCoefficients)},define:function(a){Object.assign(this.spaces,a)},_getMatrix:function(a,r,s){return a.copy(this.spaces[r].toXYZ).multiply(this.spaces[s].fromXYZ)},_getDrawingBufferColorSpace:function(a){return this.spaces[a].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(a=this.workingColorSpace){return this.spaces[a].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(a,r){return ga("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),i.workingToColorSpace(a,r)},toWorkingColorSpace:function(a,r){return ga("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),i.colorSpaceToWorking(a,r)}},e=[.64,.33,.3,.6,.15,.06],t=[.2126,.7152,.0722],n=[.3127,.329];return i.define({[Hi]:{primaries:e,whitePoint:n,transfer:nr,toXYZ:Fo,fromXYZ:Bo,luminanceCoefficients:t,workingColorSpaceConfig:{unpackColorSpace:jt},outputColorSpaceConfig:{drawingBufferColorSpace:jt}},[jt]:{primaries:e,whitePoint:n,transfer:it,toXYZ:Fo,fromXYZ:Bo,luminanceCoefficients:t,outputColorSpaceConfig:{drawingBufferColorSpace:jt}}}),i}const je=Gd();function Un(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ki(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}let _i;class Vd{static getDataURL(e,t="image/png"){if(/^data:/i.test(e.src)||typeof HTMLCanvasElement>"u")return e.src;let n;if(e instanceof HTMLCanvasElement)n=e;else{_i===void 0&&(_i=ar("canvas")),_i.width=e.width,_i.height=e.height;const a=_i.getContext("2d");e instanceof ImageData?a.putImageData(e,0,0):a.drawImage(e,0,0,e.width,e.height),n=_i}return n.toDataURL(t)}static sRGBToLinear(e){if(typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&e instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&e instanceof ImageBitmap){const t=ar("canvas");t.width=e.width,t.height=e.height;const n=t.getContext("2d");n.drawImage(e,0,0,e.width,e.height);const a=n.getImageData(0,0,e.width,e.height),r=a.data;for(let s=0;s<r.length;s++)r[s]=Un(r[s]/255)*255;return n.putImageData(a,0,0),t}else if(e.data){const t=e.data.slice(0);for(let n=0;n<t.length;n++)t instanceof Uint8Array||t instanceof Uint8ClampedArray?t[n]=Math.floor(Un(t[n]/255)*255):t[n]=Un(t[n]);return{data:t,width:e.width,height:e.height}}else return Ie("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),e}}let Hd=0;class ao{constructor(e=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Hd++}),this.uuid=Yi(),this.data=e,this.dataReady=!0,this.version=0}getSize(e){const t=this.data;return typeof HTMLVideoElement<"u"&&t instanceof HTMLVideoElement?e.set(t.videoWidth,t.videoHeight,0):t instanceof VideoFrame?e.set(t.displayHeight,t.displayWidth,0):t!==null?e.set(t.width,t.height,t.depth||0):e.set(0,0,0),e}set needsUpdate(e){e===!0&&this.version++}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.images[this.uuid]!==void 0)return e.images[this.uuid];const n={uuid:this.uuid,url:""},a=this.data;if(a!==null){let r;if(Array.isArray(a)){r=[];for(let s=0,o=a.length;s<o;s++)a[s].isDataTexture?r.push(vr(a[s].image)):r.push(vr(a[s]))}else r=vr(a);n.url=r}return t||(e.images[this.uuid]=n),n}}function vr(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Vd.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(Ie("Texture: Unable to serialize Texture."),{})}let Wd=0;const yr=new C;class Ut extends pi{constructor(e=Ut.DEFAULT_IMAGE,t=Ut.DEFAULT_MAPPING,n=Pn,a=Pn,r=an,s=di,o=fn,l=vn,c=Ut.DEFAULT_ANISOTROPY,d=Xn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Wd++}),this.uuid=Yi(),this.name="",this.source=new ao(e),this.mipmaps=[],this.mapping=t,this.channel=0,this.wrapS=n,this.wrapT=a,this.magFilter=r,this.minFilter=s,this.anisotropy=c,this.format=o,this.internalFormat=null,this.type=l,this.offset=new Ue(0,0),this.repeat=new Ue(1,1),this.center=new Ue(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Fe,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(e&&e.depth&&e.depth>1),this.pmremVersion=0}get width(){return this.source.getSize(yr).x}get height(){return this.source.getSize(yr).y}get depth(){return this.source.getSize(yr).z}get image(){return this.source.data}set image(e=null){this.source.data=e}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(e){return this.name=e.name,this.source=e.source,this.mipmaps=e.mipmaps.slice(0),this.mapping=e.mapping,this.channel=e.channel,this.wrapS=e.wrapS,this.wrapT=e.wrapT,this.magFilter=e.magFilter,this.minFilter=e.minFilter,this.anisotropy=e.anisotropy,this.format=e.format,this.internalFormat=e.internalFormat,this.type=e.type,this.offset.copy(e.offset),this.repeat.copy(e.repeat),this.center.copy(e.center),this.rotation=e.rotation,this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrix.copy(e.matrix),this.generateMipmaps=e.generateMipmaps,this.premultiplyAlpha=e.premultiplyAlpha,this.flipY=e.flipY,this.unpackAlignment=e.unpackAlignment,this.colorSpace=e.colorSpace,this.renderTarget=e.renderTarget,this.isRenderTargetTexture=e.isRenderTargetTexture,this.isArrayTexture=e.isArrayTexture,this.userData=JSON.parse(JSON.stringify(e.userData)),this.needsUpdate=!0,this}setValues(e){for(const t in e){const n=e[t];if(n===void 0){Ie(`Texture.setValues(): parameter '${t}' has value of undefined.`);continue}const a=this[t];if(a===void 0){Ie(`Texture.setValues(): property '${t}' does not exist.`);continue}a&&n&&a.isVector2&&n.isVector2||a&&n&&a.isVector3&&n.isVector3||a&&n&&a.isMatrix3&&n.isMatrix3?a.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";if(!t&&e.textures[this.uuid]!==void 0)return e.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(e).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),t||(e.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(e){if(this.mapping!==zl)return e;if(e.applyMatrix3(this.matrix),e.x<0||e.x>1)switch(this.wrapS){case us:e.x=e.x-Math.floor(e.x);break;case Pn:e.x=e.x<0?0:1;break;case fs:Math.abs(Math.floor(e.x)%2)===1?e.x=Math.ceil(e.x)-e.x:e.x=e.x-Math.floor(e.x);break}if(e.y<0||e.y>1)switch(this.wrapT){case us:e.y=e.y-Math.floor(e.y);break;case Pn:e.y=e.y<0?0:1;break;case fs:Math.abs(Math.floor(e.y)%2)===1?e.y=Math.ceil(e.y)-e.y:e.y=e.y-Math.floor(e.y);break}return this.flipY&&(e.y=1-e.y),e}set needsUpdate(e){e===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(e){e===!0&&this.pmremVersion++}}Ut.DEFAULT_IMAGE=null;Ut.DEFAULT_MAPPING=zl;Ut.DEFAULT_ANISOTROPY=1;class pt{constructor(e=0,t=0,n=0,a=1){pt.prototype.isVector4=!0,this.x=e,this.y=t,this.z=n,this.w=a}get width(){return this.z}set width(e){this.z=e}get height(){return this.w}set height(e){this.w=e}set(e,t,n,a){return this.x=e,this.y=t,this.z=n,this.w=a,this}setScalar(e){return this.x=e,this.y=e,this.z=e,this.w=e,this}setX(e){return this.x=e,this}setY(e){return this.y=e,this}setZ(e){return this.z=e,this}setW(e){return this.w=e,this}setComponent(e,t){switch(e){case 0:this.x=t;break;case 1:this.y=t;break;case 2:this.z=t;break;case 3:this.w=t;break;default:throw new Error("index is out of range: "+e)}return this}getComponent(e){switch(e){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+e)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(e){return this.x=e.x,this.y=e.y,this.z=e.z,this.w=e.w!==void 0?e.w:1,this}add(e){return this.x+=e.x,this.y+=e.y,this.z+=e.z,this.w+=e.w,this}addScalar(e){return this.x+=e,this.y+=e,this.z+=e,this.w+=e,this}addVectors(e,t){return this.x=e.x+t.x,this.y=e.y+t.y,this.z=e.z+t.z,this.w=e.w+t.w,this}addScaledVector(e,t){return this.x+=e.x*t,this.y+=e.y*t,this.z+=e.z*t,this.w+=e.w*t,this}sub(e){return this.x-=e.x,this.y-=e.y,this.z-=e.z,this.w-=e.w,this}subScalar(e){return this.x-=e,this.y-=e,this.z-=e,this.w-=e,this}subVectors(e,t){return this.x=e.x-t.x,this.y=e.y-t.y,this.z=e.z-t.z,this.w=e.w-t.w,this}multiply(e){return this.x*=e.x,this.y*=e.y,this.z*=e.z,this.w*=e.w,this}multiplyScalar(e){return this.x*=e,this.y*=e,this.z*=e,this.w*=e,this}applyMatrix4(e){const t=this.x,n=this.y,a=this.z,r=this.w,s=e.elements;return this.x=s[0]*t+s[4]*n+s[8]*a+s[12]*r,this.y=s[1]*t+s[5]*n+s[9]*a+s[13]*r,this.z=s[2]*t+s[6]*n+s[10]*a+s[14]*r,this.w=s[3]*t+s[7]*n+s[11]*a+s[15]*r,this}divide(e){return this.x/=e.x,this.y/=e.y,this.z/=e.z,this.w/=e.w,this}divideScalar(e){return this.multiplyScalar(1/e)}setAxisAngleFromQuaternion(e){this.w=2*Math.acos(e.w);const t=Math.sqrt(1-e.w*e.w);return t<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=e.x/t,this.y=e.y/t,this.z=e.z/t),this}setAxisAngleFromRotationMatrix(e){let t,n,a,r;const l=e.elements,c=l[0],d=l[4],h=l[8],u=l[1],p=l[5],g=l[9],y=l[2],m=l[6],f=l[10];if(Math.abs(d-u)<.01&&Math.abs(h-y)<.01&&Math.abs(g-m)<.01){if(Math.abs(d+u)<.1&&Math.abs(h+y)<.1&&Math.abs(g+m)<.1&&Math.abs(c+p+f-3)<.1)return this.set(1,0,0,0),this;t=Math.PI;const T=(c+1)/2,w=(p+1)/2,L=(f+1)/2,S=(d+u)/4,R=(h+y)/4,B=(g+m)/4;return T>w&&T>L?T<.01?(n=0,a=.707106781,r=.707106781):(n=Math.sqrt(T),a=S/n,r=R/n):w>L?w<.01?(n=.707106781,a=0,r=.707106781):(a=Math.sqrt(w),n=S/a,r=B/a):L<.01?(n=.707106781,a=.707106781,r=0):(r=Math.sqrt(L),n=R/r,a=B/r),this.set(n,a,r,t),this}let E=Math.sqrt((m-g)*(m-g)+(h-y)*(h-y)+(u-d)*(u-d));return Math.abs(E)<.001&&(E=1),this.x=(m-g)/E,this.y=(h-y)/E,this.z=(u-d)/E,this.w=Math.acos((c+p+f-1)/2),this}setFromMatrixPosition(e){const t=e.elements;return this.x=t[12],this.y=t[13],this.z=t[14],this.w=t[15],this}min(e){return this.x=Math.min(this.x,e.x),this.y=Math.min(this.y,e.y),this.z=Math.min(this.z,e.z),this.w=Math.min(this.w,e.w),this}max(e){return this.x=Math.max(this.x,e.x),this.y=Math.max(this.y,e.y),this.z=Math.max(this.z,e.z),this.w=Math.max(this.w,e.w),this}clamp(e,t){return this.x=ze(this.x,e.x,t.x),this.y=ze(this.y,e.y,t.y),this.z=ze(this.z,e.z,t.z),this.w=ze(this.w,e.w,t.w),this}clampScalar(e,t){return this.x=ze(this.x,e,t),this.y=ze(this.y,e,t),this.z=ze(this.z,e,t),this.w=ze(this.w,e,t),this}clampLength(e,t){const n=this.length();return this.divideScalar(n||1).multiplyScalar(ze(n,e,t))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(e){return this.x*e.x+this.y*e.y+this.z*e.z+this.w*e.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(e){return this.normalize().multiplyScalar(e)}lerp(e,t){return this.x+=(e.x-this.x)*t,this.y+=(e.y-this.y)*t,this.z+=(e.z-this.z)*t,this.w+=(e.w-this.w)*t,this}lerpVectors(e,t,n){return this.x=e.x+(t.x-e.x)*n,this.y=e.y+(t.y-e.y)*n,this.z=e.z+(t.z-e.z)*n,this.w=e.w+(t.w-e.w)*n,this}equals(e){return e.x===this.x&&e.y===this.y&&e.z===this.z&&e.w===this.w}fromArray(e,t=0){return this.x=e[t],this.y=e[t+1],this.z=e[t+2],this.w=e[t+3],this}toArray(e=[],t=0){return e[t]=this.x,e[t+1]=this.y,e[t+2]=this.z,e[t+3]=this.w,e}fromBufferAttribute(e,t){return this.x=e.getX(t),this.y=e.getY(t),this.z=e.getZ(t),this.w=e.getW(t),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}}class Xd extends pi{constructor(e=1,t=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:an,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=e,this.height=t,this.depth=n.depth,this.scissor=new pt(0,0,e,t),this.scissorTest=!1,this.viewport=new pt(0,0,e,t);const a={width:e,height:t,depth:n.depth},r=new Ut(a);this.textures=[];const s=n.count;for(let o=0;o<s;o++)this.textures[o]=r.clone(),this.textures[o].isRenderTargetTexture=!0,this.textures[o].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(e={}){const t={minFilter:an,generateMipmaps:!1,flipY:!1,internalFormat:null};e.mapping!==void 0&&(t.mapping=e.mapping),e.wrapS!==void 0&&(t.wrapS=e.wrapS),e.wrapT!==void 0&&(t.wrapT=e.wrapT),e.wrapR!==void 0&&(t.wrapR=e.wrapR),e.magFilter!==void 0&&(t.magFilter=e.magFilter),e.minFilter!==void 0&&(t.minFilter=e.minFilter),e.format!==void 0&&(t.format=e.format),e.type!==void 0&&(t.type=e.type),e.anisotropy!==void 0&&(t.anisotropy=e.anisotropy),e.colorSpace!==void 0&&(t.colorSpace=e.colorSpace),e.flipY!==void 0&&(t.flipY=e.flipY),e.generateMipmaps!==void 0&&(t.generateMipmaps=e.generateMipmaps),e.internalFormat!==void 0&&(t.internalFormat=e.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(t)}get texture(){return this.textures[0]}set texture(e){this.textures[0]=e}set depthTexture(e){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),e!==null&&(e.renderTarget=this),this._depthTexture=e}get depthTexture(){return this._depthTexture}setSize(e,t,n=1){if(this.width!==e||this.height!==t||this.depth!==n){this.width=e,this.height=t,this.depth=n;for(let a=0,r=this.textures.length;a<r;a++)this.textures[a].image.width=e,this.textures[a].image.height=t,this.textures[a].image.depth=n,this.textures[a].isData3DTexture!==!0&&(this.textures[a].isArrayTexture=this.textures[a].image.depth>1);this.dispose()}this.viewport.set(0,0,e,t),this.scissor.set(0,0,e,t)}clone(){return new this.constructor().copy(this)}copy(e){this.width=e.width,this.height=e.height,this.depth=e.depth,this.scissor.copy(e.scissor),this.scissorTest=e.scissorTest,this.viewport.copy(e.viewport),this.textures.length=0;for(let t=0,n=e.textures.length;t<n;t++){this.textures[t]=e.textures[t].clone(),this.textures[t].isRenderTargetTexture=!0,this.textures[t].renderTarget=this;const a=Object.assign({},e.textures[t].image);this.textures[t].source=new ao(a)}return this.depthBuffer=e.depthBuffer,this.stencilBuffer=e.stencilBuffer,this.resolveDepthBuffer=e.resolveDepthBuffer,this.resolveStencilBuffer=e.resolveStencilBuffer,e.depthTexture!==null&&(this.depthTexture=e.depthTexture.clone()),this.samples=e.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}}class fi extends Xd{constructor(e=1,t=1,n={}){super(e,t,n),this.isWebGLRenderTarget=!0}}class $l extends Ut{constructor(e=null,t=1,n=1,a=1){super(null),this.isDataArrayTexture=!0,this.image={data:e,width:t,height:n,depth:a},this.magFilter=Zt,this.minFilter=Zt,this.wrapR=Pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(e){this.layerUpdates.add(e)}clearLayerUpdates(){this.layerUpdates.clear()}}class Kd extends Ut{constructor(e=null,t=1,n=1,a=1){super(null),this.isData3DTexture=!0,this.image={data:e,width:t,height:n,depth:a},this.magFilter=Zt,this.minFilter=Zt,this.wrapR=Pn,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class mi{constructor(e=new C(1/0,1/0,1/0),t=new C(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=e,this.max=t}set(e,t){return this.min.copy(e),this.max.copy(t),this}setFromArray(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t+=3)this.expandByPoint(ln.fromArray(e,t));return this}setFromBufferAttribute(e){this.makeEmpty();for(let t=0,n=e.count;t<n;t++)this.expandByPoint(ln.fromBufferAttribute(e,t));return this}setFromPoints(e){this.makeEmpty();for(let t=0,n=e.length;t<n;t++)this.expandByPoint(e[t]);return this}setFromCenterAndSize(e,t){const n=ln.copy(t).multiplyScalar(.5);return this.min.copy(e).sub(n),this.max.copy(e).add(n),this}setFromObject(e,t=!1){return this.makeEmpty(),this.expandByObject(e,t)}clone(){return new this.constructor().copy(this)}copy(e){return this.min.copy(e.min),this.max.copy(e.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(e){return this.isEmpty()?e.set(0,0,0):e.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(e){return this.isEmpty()?e.set(0,0,0):e.subVectors(this.max,this.min)}expandByPoint(e){return this.min.min(e),this.max.max(e),this}expandByVector(e){return this.min.sub(e),this.max.add(e),this}expandByScalar(e){return this.min.addScalar(-e),this.max.addScalar(e),this}expandByObject(e,t=!1){e.updateWorldMatrix(!1,!1);const n=e.geometry;if(n!==void 0){const r=n.getAttribute("position");if(t===!0&&r!==void 0&&e.isInstancedMesh!==!0)for(let s=0,o=r.count;s<o;s++)e.isMesh===!0?e.getVertexPosition(s,ln):ln.fromBufferAttribute(r,s),ln.applyMatrix4(e.matrixWorld),this.expandByPoint(ln);else e.boundingBox!==void 0?(e.boundingBox===null&&e.computeBoundingBox(),Ea.copy(e.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),Ea.copy(n.boundingBox)),Ea.applyMatrix4(e.matrixWorld),this.union(Ea)}const a=e.children;for(let r=0,s=a.length;r<s;r++)this.expandByObject(a[r],t);return this}containsPoint(e){return e.x>=this.min.x&&e.x<=this.max.x&&e.y>=this.min.y&&e.y<=this.max.y&&e.z>=this.min.z&&e.z<=this.max.z}containsBox(e){return this.min.x<=e.min.x&&e.max.x<=this.max.x&&this.min.y<=e.min.y&&e.max.y<=this.max.y&&this.min.z<=e.min.z&&e.max.z<=this.max.z}getParameter(e,t){return t.set((e.x-this.min.x)/(this.max.x-this.min.x),(e.y-this.min.y)/(this.max.y-this.min.y),(e.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(e){return e.max.x>=this.min.x&&e.min.x<=this.max.x&&e.max.y>=this.min.y&&e.min.y<=this.max.y&&e.max.z>=this.min.z&&e.min.z<=this.max.z}intersectsSphere(e){return this.clampPoint(e.center,ln),ln.distanceToSquared(e.center)<=e.radius*e.radius}intersectsPlane(e){let t,n;return e.normal.x>0?(t=e.normal.x*this.min.x,n=e.normal.x*this.max.x):(t=e.normal.x*this.max.x,n=e.normal.x*this.min.x),e.normal.y>0?(t+=e.normal.y*this.min.y,n+=e.normal.y*this.max.y):(t+=e.normal.y*this.max.y,n+=e.normal.y*this.min.y),e.normal.z>0?(t+=e.normal.z*this.min.z,n+=e.normal.z*this.max.z):(t+=e.normal.z*this.max.z,n+=e.normal.z*this.min.z),t<=-e.constant&&n>=-e.constant}intersectsTriangle(e){if(this.isEmpty())return!1;this.getCenter(ea),wa.subVectors(this.max,ea),vi.subVectors(e.a,ea),yi.subVectors(e.b,ea),Mi.subVectors(e.c,ea),kn.subVectors(yi,vi),On.subVectors(Mi,yi),ni.subVectors(vi,Mi);let t=[0,-kn.z,kn.y,0,-On.z,On.y,0,-ni.z,ni.y,kn.z,0,-kn.x,On.z,0,-On.x,ni.z,0,-ni.x,-kn.y,kn.x,0,-On.y,On.x,0,-ni.y,ni.x,0];return!Mr(t,vi,yi,Mi,wa)||(t=[1,0,0,0,1,0,0,0,1],!Mr(t,vi,yi,Mi,wa))?!1:(Aa.crossVectors(kn,On),t=[Aa.x,Aa.y,Aa.z],Mr(t,vi,yi,Mi,wa))}clampPoint(e,t){return t.copy(e).clamp(this.min,this.max)}distanceToPoint(e){return this.clampPoint(e,ln).distanceTo(e)}getBoundingSphere(e){return this.isEmpty()?e.makeEmpty():(this.getCenter(e.center),e.radius=this.getSize(ln).length()*.5),e}intersect(e){return this.min.max(e.min),this.max.min(e.max),this.isEmpty()&&this.makeEmpty(),this}union(e){return this.min.min(e.min),this.max.max(e.max),this}applyMatrix4(e){return this.isEmpty()?this:(Mn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(e),Mn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(e),Mn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(e),Mn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(e),Mn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(e),Mn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(e),Mn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(e),Mn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(e),this.setFromPoints(Mn),this)}translate(e){return this.min.add(e),this.max.add(e),this}equals(e){return e.min.equals(this.min)&&e.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(e){return this.min.fromArray(e.min),this.max.fromArray(e.max),this}}const Mn=[new C,new C,new C,new C,new C,new C,new C,new C],ln=new C,Ea=new mi,vi=new C,yi=new C,Mi=new C,kn=new C,On=new C,ni=new C,ea=new C,wa=new C,Aa=new C,ii=new C;function Mr(i,e,t,n,a){for(let r=0,s=i.length-3;r<=s;r+=3){ii.fromArray(i,r);const o=a.x*Math.abs(ii.x)+a.y*Math.abs(ii.y)+a.z*Math.abs(ii.z),l=e.dot(ii),c=t.dot(ii),d=n.dot(ii);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>o)return!1}return!0}const qd=new mi,ta=new C,br=new C;class ji{constructor(e=new C,t=-1){this.isSphere=!0,this.center=e,this.radius=t}set(e,t){return this.center.copy(e),this.radius=t,this}setFromPoints(e,t){const n=this.center;t!==void 0?n.copy(t):qd.setFromPoints(e).getCenter(n);let a=0;for(let r=0,s=e.length;r<s;r++)a=Math.max(a,n.distanceToSquared(e[r]));return this.radius=Math.sqrt(a),this}copy(e){return this.center.copy(e.center),this.radius=e.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(e){return e.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(e){return e.distanceTo(this.center)-this.radius}intersectsSphere(e){const t=this.radius+e.radius;return e.center.distanceToSquared(this.center)<=t*t}intersectsBox(e){return e.intersectsSphere(this)}intersectsPlane(e){return Math.abs(e.distanceToPoint(this.center))<=this.radius}clampPoint(e,t){const n=this.center.distanceToSquared(e);return t.copy(e),n>this.radius*this.radius&&(t.sub(this.center).normalize(),t.multiplyScalar(this.radius).add(this.center)),t}getBoundingBox(e){return this.isEmpty()?(e.makeEmpty(),e):(e.set(this.center,this.center),e.expandByScalar(this.radius),e)}applyMatrix4(e){return this.center.applyMatrix4(e),this.radius=this.radius*e.getMaxScaleOnAxis(),this}translate(e){return this.center.add(e),this}expandByPoint(e){if(this.isEmpty())return this.center.copy(e),this.radius=0,this;ta.subVectors(e,this.center);const t=ta.lengthSq();if(t>this.radius*this.radius){const n=Math.sqrt(t),a=(n-this.radius)*.5;this.center.addScaledVector(ta,a/n),this.radius+=a}return this}union(e){return e.isEmpty()?this:this.isEmpty()?(this.copy(e),this):(this.center.equals(e.center)===!0?this.radius=Math.max(this.radius,e.radius):(br.subVectors(e.center,this.center).setLength(e.radius),this.expandByPoint(ta.copy(e.center).add(br)),this.expandByPoint(ta.copy(e.center).sub(br))),this)}equals(e){return e.center.equals(this.center)&&e.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(e){return this.radius=e.radius,this.center.fromArray(e.center),this}}const bn=new C,Sr=new C,Ca=new C,zn=new C,Tr=new C,Ra=new C,Er=new C;class ro{constructor(e=new C,t=new C(0,0,-1)){this.origin=e,this.direction=t}set(e,t){return this.origin.copy(e),this.direction.copy(t),this}copy(e){return this.origin.copy(e.origin),this.direction.copy(e.direction),this}at(e,t){return t.copy(this.origin).addScaledVector(this.direction,e)}lookAt(e){return this.direction.copy(e).sub(this.origin).normalize(),this}recast(e){return this.origin.copy(this.at(e,bn)),this}closestPointToPoint(e,t){t.subVectors(e,this.origin);const n=t.dot(this.direction);return n<0?t.copy(this.origin):t.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(e){return Math.sqrt(this.distanceSqToPoint(e))}distanceSqToPoint(e){const t=bn.subVectors(e,this.origin).dot(this.direction);return t<0?this.origin.distanceToSquared(e):(bn.copy(this.origin).addScaledVector(this.direction,t),bn.distanceToSquared(e))}distanceSqToSegment(e,t,n,a){Sr.copy(e).add(t).multiplyScalar(.5),Ca.copy(t).sub(e).normalize(),zn.copy(this.origin).sub(Sr);const r=e.distanceTo(t)*.5,s=-this.direction.dot(Ca),o=zn.dot(this.direction),l=-zn.dot(Ca),c=zn.lengthSq(),d=Math.abs(1-s*s);let h,u,p,g;if(d>0)if(h=s*l-o,u=s*o-l,g=r*d,h>=0)if(u>=-g)if(u<=g){const y=1/d;h*=y,u*=y,p=h*(h+s*u+2*o)+u*(s*h+u+2*l)+c}else u=r,h=Math.max(0,-(s*u+o)),p=-h*h+u*(u+2*l)+c;else u=-r,h=Math.max(0,-(s*u+o)),p=-h*h+u*(u+2*l)+c;else u<=-g?(h=Math.max(0,-(-s*r+o)),u=h>0?-r:Math.min(Math.max(-r,-l),r),p=-h*h+u*(u+2*l)+c):u<=g?(h=0,u=Math.min(Math.max(-r,-l),r),p=u*(u+2*l)+c):(h=Math.max(0,-(s*r+o)),u=h>0?r:Math.min(Math.max(-r,-l),r),p=-h*h+u*(u+2*l)+c);else u=s>0?-r:r,h=Math.max(0,-(s*u+o)),p=-h*h+u*(u+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,h),a&&a.copy(Sr).addScaledVector(Ca,u),p}intersectSphere(e,t){bn.subVectors(e.center,this.origin);const n=bn.dot(this.direction),a=bn.dot(bn)-n*n,r=e.radius*e.radius;if(a>r)return null;const s=Math.sqrt(r-a),o=n-s,l=n+s;return l<0?null:o<0?this.at(l,t):this.at(o,t)}intersectsSphere(e){return e.radius<0?!1:this.distanceSqToPoint(e.center)<=e.radius*e.radius}distanceToPlane(e){const t=e.normal.dot(this.direction);if(t===0)return e.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(e.normal)+e.constant)/t;return n>=0?n:null}intersectPlane(e,t){const n=this.distanceToPlane(e);return n===null?null:this.at(n,t)}intersectsPlane(e){const t=e.distanceToPoint(this.origin);return t===0||e.normal.dot(this.direction)*t<0}intersectBox(e,t){let n,a,r,s,o,l;const c=1/this.direction.x,d=1/this.direction.y,h=1/this.direction.z,u=this.origin;return c>=0?(n=(e.min.x-u.x)*c,a=(e.max.x-u.x)*c):(n=(e.max.x-u.x)*c,a=(e.min.x-u.x)*c),d>=0?(r=(e.min.y-u.y)*d,s=(e.max.y-u.y)*d):(r=(e.max.y-u.y)*d,s=(e.min.y-u.y)*d),n>s||r>a||((r>n||isNaN(n))&&(n=r),(s<a||isNaN(a))&&(a=s),h>=0?(o=(e.min.z-u.z)*h,l=(e.max.z-u.z)*h):(o=(e.max.z-u.z)*h,l=(e.min.z-u.z)*h),n>l||o>a)||((o>n||n!==n)&&(n=o),(l<a||a!==a)&&(a=l),a<0)?null:this.at(n>=0?n:a,t)}intersectsBox(e){return this.intersectBox(e,bn)!==null}intersectTriangle(e,t,n,a,r){Tr.subVectors(t,e),Ra.subVectors(n,e),Er.crossVectors(Tr,Ra);let s=this.direction.dot(Er),o;if(s>0){if(a)return null;o=1}else if(s<0)o=-1,s=-s;else return null;zn.subVectors(this.origin,e);const l=o*this.direction.dot(Ra.crossVectors(zn,Ra));if(l<0)return null;const c=o*this.direction.dot(Tr.cross(zn));if(c<0||l+c>s)return null;const d=-o*zn.dot(Er);return d<0?null:this.at(d/s,r)}applyMatrix4(e){return this.origin.applyMatrix4(e),this.direction.transformDirection(e),this}equals(e){return e.origin.equals(this.origin)&&e.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class st{constructor(e,t,n,a,r,s,o,l,c,d,h,u,p,g,y,m){st.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],e!==void 0&&this.set(e,t,n,a,r,s,o,l,c,d,h,u,p,g,y,m)}set(e,t,n,a,r,s,o,l,c,d,h,u,p,g,y,m){const f=this.elements;return f[0]=e,f[4]=t,f[8]=n,f[12]=a,f[1]=r,f[5]=s,f[9]=o,f[13]=l,f[2]=c,f[6]=d,f[10]=h,f[14]=u,f[3]=p,f[7]=g,f[11]=y,f[15]=m,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new st().fromArray(this.elements)}copy(e){const t=this.elements,n=e.elements;return t[0]=n[0],t[1]=n[1],t[2]=n[2],t[3]=n[3],t[4]=n[4],t[5]=n[5],t[6]=n[6],t[7]=n[7],t[8]=n[8],t[9]=n[9],t[10]=n[10],t[11]=n[11],t[12]=n[12],t[13]=n[13],t[14]=n[14],t[15]=n[15],this}copyPosition(e){const t=this.elements,n=e.elements;return t[12]=n[12],t[13]=n[13],t[14]=n[14],this}setFromMatrix3(e){const t=e.elements;return this.set(t[0],t[3],t[6],0,t[1],t[4],t[7],0,t[2],t[5],t[8],0,0,0,0,1),this}extractBasis(e,t,n){return e.setFromMatrixColumn(this,0),t.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(e,t,n){return this.set(e.x,t.x,n.x,0,e.y,t.y,n.y,0,e.z,t.z,n.z,0,0,0,0,1),this}extractRotation(e){const t=this.elements,n=e.elements,a=1/bi.setFromMatrixColumn(e,0).length(),r=1/bi.setFromMatrixColumn(e,1).length(),s=1/bi.setFromMatrixColumn(e,2).length();return t[0]=n[0]*a,t[1]=n[1]*a,t[2]=n[2]*a,t[3]=0,t[4]=n[4]*r,t[5]=n[5]*r,t[6]=n[6]*r,t[7]=0,t[8]=n[8]*s,t[9]=n[9]*s,t[10]=n[10]*s,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromEuler(e){const t=this.elements,n=e.x,a=e.y,r=e.z,s=Math.cos(n),o=Math.sin(n),l=Math.cos(a),c=Math.sin(a),d=Math.cos(r),h=Math.sin(r);if(e.order==="XYZ"){const u=s*d,p=s*h,g=o*d,y=o*h;t[0]=l*d,t[4]=-l*h,t[8]=c,t[1]=p+g*c,t[5]=u-y*c,t[9]=-o*l,t[2]=y-u*c,t[6]=g+p*c,t[10]=s*l}else if(e.order==="YXZ"){const u=l*d,p=l*h,g=c*d,y=c*h;t[0]=u+y*o,t[4]=g*o-p,t[8]=s*c,t[1]=s*h,t[5]=s*d,t[9]=-o,t[2]=p*o-g,t[6]=y+u*o,t[10]=s*l}else if(e.order==="ZXY"){const u=l*d,p=l*h,g=c*d,y=c*h;t[0]=u-y*o,t[4]=-s*h,t[8]=g+p*o,t[1]=p+g*o,t[5]=s*d,t[9]=y-u*o,t[2]=-s*c,t[6]=o,t[10]=s*l}else if(e.order==="ZYX"){const u=s*d,p=s*h,g=o*d,y=o*h;t[0]=l*d,t[4]=g*c-p,t[8]=u*c+y,t[1]=l*h,t[5]=y*c+u,t[9]=p*c-g,t[2]=-c,t[6]=o*l,t[10]=s*l}else if(e.order==="YZX"){const u=s*l,p=s*c,g=o*l,y=o*c;t[0]=l*d,t[4]=y-u*h,t[8]=g*h+p,t[1]=h,t[5]=s*d,t[9]=-o*d,t[2]=-c*d,t[6]=p*h+g,t[10]=u-y*h}else if(e.order==="XZY"){const u=s*l,p=s*c,g=o*l,y=o*c;t[0]=l*d,t[4]=-h,t[8]=c*d,t[1]=u*h+y,t[5]=s*d,t[9]=p*h-g,t[2]=g*h-p,t[6]=o*d,t[10]=y*h+u}return t[3]=0,t[7]=0,t[11]=0,t[12]=0,t[13]=0,t[14]=0,t[15]=1,this}makeRotationFromQuaternion(e){return this.compose(Yd,e,jd)}lookAt(e,t,n){const a=this.elements;return qt.subVectors(e,t),qt.lengthSq()===0&&(qt.z=1),qt.normalize(),Gn.crossVectors(n,qt),Gn.lengthSq()===0&&(Math.abs(n.z)===1?qt.x+=1e-4:qt.z+=1e-4,qt.normalize(),Gn.crossVectors(n,qt)),Gn.normalize(),Pa.crossVectors(qt,Gn),a[0]=Gn.x,a[4]=Pa.x,a[8]=qt.x,a[1]=Gn.y,a[5]=Pa.y,a[9]=qt.y,a[2]=Gn.z,a[6]=Pa.z,a[10]=qt.z,this}multiply(e){return this.multiplyMatrices(this,e)}premultiply(e){return this.multiplyMatrices(e,this)}multiplyMatrices(e,t){const n=e.elements,a=t.elements,r=this.elements,s=n[0],o=n[4],l=n[8],c=n[12],d=n[1],h=n[5],u=n[9],p=n[13],g=n[2],y=n[6],m=n[10],f=n[14],E=n[3],T=n[7],w=n[11],L=n[15],S=a[0],R=a[4],B=a[8],M=a[12],_=a[1],D=a[5],F=a[9],z=a[13],K=a[2],X=a[6],Y=a[10],ee=a[14],W=a[3],ie=a[7],re=a[11],be=a[15];return r[0]=s*S+o*_+l*K+c*W,r[4]=s*R+o*D+l*X+c*ie,r[8]=s*B+o*F+l*Y+c*re,r[12]=s*M+o*z+l*ee+c*be,r[1]=d*S+h*_+u*K+p*W,r[5]=d*R+h*D+u*X+p*ie,r[9]=d*B+h*F+u*Y+p*re,r[13]=d*M+h*z+u*ee+p*be,r[2]=g*S+y*_+m*K+f*W,r[6]=g*R+y*D+m*X+f*ie,r[10]=g*B+y*F+m*Y+f*re,r[14]=g*M+y*z+m*ee+f*be,r[3]=E*S+T*_+w*K+L*W,r[7]=E*R+T*D+w*X+L*ie,r[11]=E*B+T*F+w*Y+L*re,r[15]=E*M+T*z+w*ee+L*be,this}multiplyScalar(e){const t=this.elements;return t[0]*=e,t[4]*=e,t[8]*=e,t[12]*=e,t[1]*=e,t[5]*=e,t[9]*=e,t[13]*=e,t[2]*=e,t[6]*=e,t[10]*=e,t[14]*=e,t[3]*=e,t[7]*=e,t[11]*=e,t[15]*=e,this}determinant(){const e=this.elements,t=e[0],n=e[4],a=e[8],r=e[12],s=e[1],o=e[5],l=e[9],c=e[13],d=e[2],h=e[6],u=e[10],p=e[14],g=e[3],y=e[7],m=e[11],f=e[15];return g*(+r*l*h-a*c*h-r*o*u+n*c*u+a*o*p-n*l*p)+y*(+t*l*p-t*c*u+r*s*u-a*s*p+a*c*d-r*l*d)+m*(+t*c*h-t*o*p-r*s*h+n*s*p+r*o*d-n*c*d)+f*(-a*o*d-t*l*h+t*o*u+a*s*h-n*s*u+n*l*d)}transpose(){const e=this.elements;let t;return t=e[1],e[1]=e[4],e[4]=t,t=e[2],e[2]=e[8],e[8]=t,t=e[6],e[6]=e[9],e[9]=t,t=e[3],e[3]=e[12],e[12]=t,t=e[7],e[7]=e[13],e[13]=t,t=e[11],e[11]=e[14],e[14]=t,this}setPosition(e,t,n){const a=this.elements;return e.isVector3?(a[12]=e.x,a[13]=e.y,a[14]=e.z):(a[12]=e,a[13]=t,a[14]=n),this}invert(){const e=this.elements,t=e[0],n=e[1],a=e[2],r=e[3],s=e[4],o=e[5],l=e[6],c=e[7],d=e[8],h=e[9],u=e[10],p=e[11],g=e[12],y=e[13],m=e[14],f=e[15],E=h*m*c-y*u*c+y*l*p-o*m*p-h*l*f+o*u*f,T=g*u*c-d*m*c-g*l*p+s*m*p+d*l*f-s*u*f,w=d*y*c-g*h*c+g*o*p-s*y*p-d*o*f+s*h*f,L=g*h*l-d*y*l-g*o*u+s*y*u+d*o*m-s*h*m,S=t*E+n*T+a*w+r*L;if(S===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const R=1/S;return e[0]=E*R,e[1]=(y*u*r-h*m*r-y*a*p+n*m*p+h*a*f-n*u*f)*R,e[2]=(o*m*r-y*l*r+y*a*c-n*m*c-o*a*f+n*l*f)*R,e[3]=(h*l*r-o*u*r-h*a*c+n*u*c+o*a*p-n*l*p)*R,e[4]=T*R,e[5]=(d*m*r-g*u*r+g*a*p-t*m*p-d*a*f+t*u*f)*R,e[6]=(g*l*r-s*m*r-g*a*c+t*m*c+s*a*f-t*l*f)*R,e[7]=(s*u*r-d*l*r+d*a*c-t*u*c-s*a*p+t*l*p)*R,e[8]=w*R,e[9]=(g*h*r-d*y*r-g*n*p+t*y*p+d*n*f-t*h*f)*R,e[10]=(s*y*r-g*o*r+g*n*c-t*y*c-s*n*f+t*o*f)*R,e[11]=(d*o*r-s*h*r-d*n*c+t*h*c+s*n*p-t*o*p)*R,e[12]=L*R,e[13]=(d*y*a-g*h*a+g*n*u-t*y*u-d*n*m+t*h*m)*R,e[14]=(g*o*a-s*y*a-g*n*l+t*y*l+s*n*m-t*o*m)*R,e[15]=(s*h*a-d*o*a+d*n*l-t*h*l-s*n*u+t*o*u)*R,this}scale(e){const t=this.elements,n=e.x,a=e.y,r=e.z;return t[0]*=n,t[4]*=a,t[8]*=r,t[1]*=n,t[5]*=a,t[9]*=r,t[2]*=n,t[6]*=a,t[10]*=r,t[3]*=n,t[7]*=a,t[11]*=r,this}getMaxScaleOnAxis(){const e=this.elements,t=e[0]*e[0]+e[1]*e[1]+e[2]*e[2],n=e[4]*e[4]+e[5]*e[5]+e[6]*e[6],a=e[8]*e[8]+e[9]*e[9]+e[10]*e[10];return Math.sqrt(Math.max(t,n,a))}makeTranslation(e,t,n){return e.isVector3?this.set(1,0,0,e.x,0,1,0,e.y,0,0,1,e.z,0,0,0,1):this.set(1,0,0,e,0,1,0,t,0,0,1,n,0,0,0,1),this}makeRotationX(e){const t=Math.cos(e),n=Math.sin(e);return this.set(1,0,0,0,0,t,-n,0,0,n,t,0,0,0,0,1),this}makeRotationY(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,0,n,0,0,1,0,0,-n,0,t,0,0,0,0,1),this}makeRotationZ(e){const t=Math.cos(e),n=Math.sin(e);return this.set(t,-n,0,0,n,t,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(e,t){const n=Math.cos(t),a=Math.sin(t),r=1-n,s=e.x,o=e.y,l=e.z,c=r*s,d=r*o;return this.set(c*s+n,c*o-a*l,c*l+a*o,0,c*o+a*l,d*o+n,d*l-a*s,0,c*l-a*o,d*l+a*s,r*l*l+n,0,0,0,0,1),this}makeScale(e,t,n){return this.set(e,0,0,0,0,t,0,0,0,0,n,0,0,0,0,1),this}makeShear(e,t,n,a,r,s){return this.set(1,n,r,0,e,1,s,0,t,a,1,0,0,0,0,1),this}compose(e,t,n){const a=this.elements,r=t._x,s=t._y,o=t._z,l=t._w,c=r+r,d=s+s,h=o+o,u=r*c,p=r*d,g=r*h,y=s*d,m=s*h,f=o*h,E=l*c,T=l*d,w=l*h,L=n.x,S=n.y,R=n.z;return a[0]=(1-(y+f))*L,a[1]=(p+w)*L,a[2]=(g-T)*L,a[3]=0,a[4]=(p-w)*S,a[5]=(1-(u+f))*S,a[6]=(m+E)*S,a[7]=0,a[8]=(g+T)*R,a[9]=(m-E)*R,a[10]=(1-(u+y))*R,a[11]=0,a[12]=e.x,a[13]=e.y,a[14]=e.z,a[15]=1,this}decompose(e,t,n){const a=this.elements;let r=bi.set(a[0],a[1],a[2]).length();const s=bi.set(a[4],a[5],a[6]).length(),o=bi.set(a[8],a[9],a[10]).length();this.determinant()<0&&(r=-r),e.x=a[12],e.y=a[13],e.z=a[14],cn.copy(this);const c=1/r,d=1/s,h=1/o;return cn.elements[0]*=c,cn.elements[1]*=c,cn.elements[2]*=c,cn.elements[4]*=d,cn.elements[5]*=d,cn.elements[6]*=d,cn.elements[8]*=h,cn.elements[9]*=h,cn.elements[10]*=h,t.setFromRotationMatrix(cn),n.x=r,n.y=s,n.z=o,this}makePerspective(e,t,n,a,r,s,o=_n,l=!1){const c=this.elements,d=2*r/(t-e),h=2*r/(n-a),u=(t+e)/(t-e),p=(n+a)/(n-a);let g,y;if(l)g=r/(s-r),y=s*r/(s-r);else if(o===_n)g=-(s+r)/(s-r),y=-2*s*r/(s-r);else if(o===ir)g=-s/(s-r),y=-s*r/(s-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=u,c[12]=0,c[1]=0,c[5]=h,c[9]=p,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(e,t,n,a,r,s,o=_n,l=!1){const c=this.elements,d=2/(t-e),h=2/(n-a),u=-(t+e)/(t-e),p=-(n+a)/(n-a);let g,y;if(l)g=1/(s-r),y=s/(s-r);else if(o===_n)g=-2/(s-r),y=-(s+r)/(s-r);else if(o===ir)g=-1/(s-r),y=-r/(s-r);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=d,c[4]=0,c[8]=0,c[12]=u,c[1]=0,c[5]=h,c[9]=0,c[13]=p,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(e){const t=this.elements,n=e.elements;for(let a=0;a<16;a++)if(t[a]!==n[a])return!1;return!0}fromArray(e,t=0){for(let n=0;n<16;n++)this.elements[n]=e[n+t];return this}toArray(e=[],t=0){const n=this.elements;return e[t]=n[0],e[t+1]=n[1],e[t+2]=n[2],e[t+3]=n[3],e[t+4]=n[4],e[t+5]=n[5],e[t+6]=n[6],e[t+7]=n[7],e[t+8]=n[8],e[t+9]=n[9],e[t+10]=n[10],e[t+11]=n[11],e[t+12]=n[12],e[t+13]=n[13],e[t+14]=n[14],e[t+15]=n[15],e}}const bi=new C,cn=new st,Yd=new C(0,0,0),jd=new C(1,1,1),Gn=new C,Pa=new C,qt=new C,ko=new st,Oo=new Jn;class yn{constructor(e=0,t=0,n=0,a=yn.DEFAULT_ORDER){this.isEuler=!0,this._x=e,this._y=t,this._z=n,this._order=a}get x(){return this._x}set x(e){this._x=e,this._onChangeCallback()}get y(){return this._y}set y(e){this._y=e,this._onChangeCallback()}get z(){return this._z}set z(e){this._z=e,this._onChangeCallback()}get order(){return this._order}set order(e){this._order=e,this._onChangeCallback()}set(e,t,n,a=this._order){return this._x=e,this._y=t,this._z=n,this._order=a,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(e){return this._x=e._x,this._y=e._y,this._z=e._z,this._order=e._order,this._onChangeCallback(),this}setFromRotationMatrix(e,t=this._order,n=!0){const a=e.elements,r=a[0],s=a[4],o=a[8],l=a[1],c=a[5],d=a[9],h=a[2],u=a[6],p=a[10];switch(t){case"XYZ":this._y=Math.asin(ze(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-d,p),this._z=Math.atan2(-s,r)):(this._x=Math.atan2(u,c),this._z=0);break;case"YXZ":this._x=Math.asin(-ze(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(o,p),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-h,r),this._z=0);break;case"ZXY":this._x=Math.asin(ze(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(-h,p),this._z=Math.atan2(-s,c)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-ze(h,-1,1)),Math.abs(h)<.9999999?(this._x=Math.atan2(u,p),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-s,c));break;case"YZX":this._z=Math.asin(ze(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-h,r)):(this._x=0,this._y=Math.atan2(o,p));break;case"XZY":this._z=Math.asin(-ze(s,-1,1)),Math.abs(s)<.9999999?(this._x=Math.atan2(u,c),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-d,p),this._y=0);break;default:Ie("Euler: .setFromRotationMatrix() encountered an unknown order: "+t)}return this._order=t,n===!0&&this._onChangeCallback(),this}setFromQuaternion(e,t,n){return ko.makeRotationFromQuaternion(e),this.setFromRotationMatrix(ko,t,n)}setFromVector3(e,t=this._order){return this.set(e.x,e.y,e.z,t)}reorder(e){return Oo.setFromEuler(this),this.setFromQuaternion(Oo,e)}equals(e){return e._x===this._x&&e._y===this._y&&e._z===this._z&&e._order===this._order}fromArray(e){return this._x=e[0],this._y=e[1],this._z=e[2],e[3]!==void 0&&(this._order=e[3]),this._onChangeCallback(),this}toArray(e=[],t=0){return e[t]=this._x,e[t+1]=this._y,e[t+2]=this._z,e[t+3]=this._order,e}_onChange(e){return this._onChangeCallback=e,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}yn.DEFAULT_ORDER="XYZ";class Zl{constructor(){this.mask=1}set(e){this.mask=(1<<e|0)>>>0}enable(e){this.mask|=1<<e|0}enableAll(){this.mask=-1}toggle(e){this.mask^=1<<e|0}disable(e){this.mask&=~(1<<e|0)}disableAll(){this.mask=0}test(e){return(this.mask&e.mask)!==0}isEnabled(e){return(this.mask&(1<<e|0))!==0}}let $d=0;const zo=new C,Si=new Jn,Sn=new st,La=new C,na=new C,Zd=new C,Jd=new Jn,Go=new C(1,0,0),Vo=new C(0,1,0),Ho=new C(0,0,1),Wo={type:"added"},Qd={type:"removed"},Ti={type:"childadded",child:null},wr={type:"childremoved",child:null};class Et extends pi{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:$d++}),this.uuid=Yi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Et.DEFAULT_UP.clone();const e=new C,t=new yn,n=new Jn,a=new C(1,1,1);function r(){n.setFromEuler(t,!1)}function s(){t.setFromQuaternion(n,void 0,!1)}t._onChange(r),n._onChange(s),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:e},rotation:{configurable:!0,enumerable:!0,value:t},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:a},modelViewMatrix:{value:new st},normalMatrix:{value:new Fe}}),this.matrix=new st,this.matrixWorld=new st,this.matrixAutoUpdate=Et.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new Zl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(e){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(e),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(e){return this.quaternion.premultiply(e),this}setRotationFromAxisAngle(e,t){this.quaternion.setFromAxisAngle(e,t)}setRotationFromEuler(e){this.quaternion.setFromEuler(e,!0)}setRotationFromMatrix(e){this.quaternion.setFromRotationMatrix(e)}setRotationFromQuaternion(e){this.quaternion.copy(e)}rotateOnAxis(e,t){return Si.setFromAxisAngle(e,t),this.quaternion.multiply(Si),this}rotateOnWorldAxis(e,t){return Si.setFromAxisAngle(e,t),this.quaternion.premultiply(Si),this}rotateX(e){return this.rotateOnAxis(Go,e)}rotateY(e){return this.rotateOnAxis(Vo,e)}rotateZ(e){return this.rotateOnAxis(Ho,e)}translateOnAxis(e,t){return zo.copy(e).applyQuaternion(this.quaternion),this.position.add(zo.multiplyScalar(t)),this}translateX(e){return this.translateOnAxis(Go,e)}translateY(e){return this.translateOnAxis(Vo,e)}translateZ(e){return this.translateOnAxis(Ho,e)}localToWorld(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(this.matrixWorld)}worldToLocal(e){return this.updateWorldMatrix(!0,!1),e.applyMatrix4(Sn.copy(this.matrixWorld).invert())}lookAt(e,t,n){e.isVector3?La.copy(e):La.set(e,t,n);const a=this.parent;this.updateWorldMatrix(!0,!1),na.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Sn.lookAt(na,La,this.up):Sn.lookAt(La,na,this.up),this.quaternion.setFromRotationMatrix(Sn),a&&(Sn.extractRotation(a.matrixWorld),Si.setFromRotationMatrix(Sn),this.quaternion.premultiply(Si.invert()))}add(e){if(arguments.length>1){for(let t=0;t<arguments.length;t++)this.add(arguments[t]);return this}return e===this?(mt("Object3D.add: object can't be added as a child of itself.",e),this):(e&&e.isObject3D?(e.removeFromParent(),e.parent=this,this.children.push(e),e.dispatchEvent(Wo),Ti.child=e,this.dispatchEvent(Ti),Ti.child=null):mt("Object3D.add: object not an instance of THREE.Object3D.",e),this)}remove(e){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const t=this.children.indexOf(e);return t!==-1&&(e.parent=null,this.children.splice(t,1),e.dispatchEvent(Qd),wr.child=e,this.dispatchEvent(wr),wr.child=null),this}removeFromParent(){const e=this.parent;return e!==null&&e.remove(this),this}clear(){return this.remove(...this.children)}attach(e){return this.updateWorldMatrix(!0,!1),Sn.copy(this.matrixWorld).invert(),e.parent!==null&&(e.parent.updateWorldMatrix(!0,!1),Sn.multiply(e.parent.matrixWorld)),e.applyMatrix4(Sn),e.removeFromParent(),e.parent=this,this.children.push(e),e.updateWorldMatrix(!1,!0),e.dispatchEvent(Wo),Ti.child=e,this.dispatchEvent(Ti),Ti.child=null,this}getObjectById(e){return this.getObjectByProperty("id",e)}getObjectByName(e){return this.getObjectByProperty("name",e)}getObjectByProperty(e,t){if(this[e]===t)return this;for(let n=0,a=this.children.length;n<a;n++){const s=this.children[n].getObjectByProperty(e,t);if(s!==void 0)return s}}getObjectsByProperty(e,t,n=[]){this[e]===t&&n.push(this);const a=this.children;for(let r=0,s=a.length;r<s;r++)a[r].getObjectsByProperty(e,t,n);return n}getWorldPosition(e){return this.updateWorldMatrix(!0,!1),e.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(na,e,Zd),e}getWorldScale(e){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(na,Jd,e),e}getWorldDirection(e){this.updateWorldMatrix(!0,!1);const t=this.matrixWorld.elements;return e.set(t[8],t[9],t[10]).normalize()}raycast(){}traverse(e){e(this);const t=this.children;for(let n=0,a=t.length;n<a;n++)t[n].traverse(e)}traverseVisible(e){if(this.visible===!1)return;e(this);const t=this.children;for(let n=0,a=t.length;n<a;n++)t[n].traverseVisible(e)}traverseAncestors(e){const t=this.parent;t!==null&&(e(t),t.traverseAncestors(e))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(e){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||e)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,e=!0);const t=this.children;for(let n=0,a=t.length;n<a;n++)t[n].updateMatrixWorld(e)}updateWorldMatrix(e,t){const n=this.parent;if(e===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),t===!0){const a=this.children;for(let r=0,s=a.length;r<s;r++)a[r].updateWorldMatrix(!1,!0)}}toJSON(e){const t=e===void 0||typeof e=="string",n={};t&&(e={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const a={};a.uuid=this.uuid,a.type=this.type,this.name!==""&&(a.name=this.name),this.castShadow===!0&&(a.castShadow=!0),this.receiveShadow===!0&&(a.receiveShadow=!0),this.visible===!1&&(a.visible=!1),this.frustumCulled===!1&&(a.frustumCulled=!1),this.renderOrder!==0&&(a.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(a.userData=this.userData),a.layers=this.layers.mask,a.matrix=this.matrix.toArray(),a.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(a.matrixAutoUpdate=!1),this.isInstancedMesh&&(a.type="InstancedMesh",a.count=this.count,a.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(a.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(a.type="BatchedMesh",a.perObjectFrustumCulled=this.perObjectFrustumCulled,a.sortObjects=this.sortObjects,a.drawRanges=this._drawRanges,a.reservedRanges=this._reservedRanges,a.geometryInfo=this._geometryInfo.map(o=>({...o,boundingBox:o.boundingBox?o.boundingBox.toJSON():void 0,boundingSphere:o.boundingSphere?o.boundingSphere.toJSON():void 0})),a.instanceInfo=this._instanceInfo.map(o=>({...o})),a.availableInstanceIds=this._availableInstanceIds.slice(),a.availableGeometryIds=this._availableGeometryIds.slice(),a.nextIndexStart=this._nextIndexStart,a.nextVertexStart=this._nextVertexStart,a.geometryCount=this._geometryCount,a.maxInstanceCount=this._maxInstanceCount,a.maxVertexCount=this._maxVertexCount,a.maxIndexCount=this._maxIndexCount,a.geometryInitialized=this._geometryInitialized,a.matricesTexture=this._matricesTexture.toJSON(e),a.indirectTexture=this._indirectTexture.toJSON(e),this._colorsTexture!==null&&(a.colorsTexture=this._colorsTexture.toJSON(e)),this.boundingSphere!==null&&(a.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(a.boundingBox=this.boundingBox.toJSON()));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(e)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?a.background=this.background.toJSON():this.background.isTexture&&(a.background=this.background.toJSON(e).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(a.environment=this.environment.toJSON(e).uuid);else if(this.isMesh||this.isLine||this.isPoints){a.geometry=r(e.geometries,this.geometry);const o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){const l=o.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const h=l[c];r(e.shapes,h)}else r(e.shapes,l)}}if(this.isSkinnedMesh&&(a.bindMode=this.bindMode,a.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(e.skeletons,this.skeleton),a.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const o=[];for(let l=0,c=this.material.length;l<c;l++)o.push(r(e.materials,this.material[l]));a.material=o}else a.material=r(e.materials,this.material);if(this.children.length>0){a.children=[];for(let o=0;o<this.children.length;o++)a.children.push(this.children[o].toJSON(e).object)}if(this.animations.length>0){a.animations=[];for(let o=0;o<this.animations.length;o++){const l=this.animations[o];a.animations.push(r(e.animations,l))}}if(t){const o=s(e.geometries),l=s(e.materials),c=s(e.textures),d=s(e.images),h=s(e.shapes),u=s(e.skeletons),p=s(e.animations),g=s(e.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),d.length>0&&(n.images=d),h.length>0&&(n.shapes=h),u.length>0&&(n.skeletons=u),p.length>0&&(n.animations=p),g.length>0&&(n.nodes=g)}return n.object=a,n;function s(o){const l=[];for(const c in o){const d=o[c];delete d.metadata,l.push(d)}return l}}clone(e){return new this.constructor().copy(this,e)}copy(e,t=!0){if(this.name=e.name,this.up.copy(e.up),this.position.copy(e.position),this.rotation.order=e.rotation.order,this.quaternion.copy(e.quaternion),this.scale.copy(e.scale),this.matrix.copy(e.matrix),this.matrixWorld.copy(e.matrixWorld),this.matrixAutoUpdate=e.matrixAutoUpdate,this.matrixWorldAutoUpdate=e.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=e.matrixWorldNeedsUpdate,this.layers.mask=e.layers.mask,this.visible=e.visible,this.castShadow=e.castShadow,this.receiveShadow=e.receiveShadow,this.frustumCulled=e.frustumCulled,this.renderOrder=e.renderOrder,this.animations=e.animations.slice(),this.userData=JSON.parse(JSON.stringify(e.userData)),t===!0)for(let n=0;n<e.children.length;n++){const a=e.children[n];this.add(a.clone())}return this}}Et.DEFAULT_UP=new C(0,1,0);Et.DEFAULT_MATRIX_AUTO_UPDATE=!0;Et.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;const dn=new C,Tn=new C,Ar=new C,En=new C,Ei=new C,wi=new C,Xo=new C,Cr=new C,Rr=new C,Pr=new C,Lr=new pt,Dr=new pt,Ir=new pt;class hn{constructor(e=new C,t=new C,n=new C){this.a=e,this.b=t,this.c=n}static getNormal(e,t,n,a){a.subVectors(n,t),dn.subVectors(e,t),a.cross(dn);const r=a.lengthSq();return r>0?a.multiplyScalar(1/Math.sqrt(r)):a.set(0,0,0)}static getBarycoord(e,t,n,a,r){dn.subVectors(a,t),Tn.subVectors(n,t),Ar.subVectors(e,t);const s=dn.dot(dn),o=dn.dot(Tn),l=dn.dot(Ar),c=Tn.dot(Tn),d=Tn.dot(Ar),h=s*c-o*o;if(h===0)return r.set(0,0,0),null;const u=1/h,p=(c*l-o*d)*u,g=(s*d-o*l)*u;return r.set(1-p-g,g,p)}static containsPoint(e,t,n,a){return this.getBarycoord(e,t,n,a,En)===null?!1:En.x>=0&&En.y>=0&&En.x+En.y<=1}static getInterpolation(e,t,n,a,r,s,o,l){return this.getBarycoord(e,t,n,a,En)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,En.x),l.addScaledVector(s,En.y),l.addScaledVector(o,En.z),l)}static getInterpolatedAttribute(e,t,n,a,r,s){return Lr.setScalar(0),Dr.setScalar(0),Ir.setScalar(0),Lr.fromBufferAttribute(e,t),Dr.fromBufferAttribute(e,n),Ir.fromBufferAttribute(e,a),s.setScalar(0),s.addScaledVector(Lr,r.x),s.addScaledVector(Dr,r.y),s.addScaledVector(Ir,r.z),s}static isFrontFacing(e,t,n,a){return dn.subVectors(n,t),Tn.subVectors(e,t),dn.cross(Tn).dot(a)<0}set(e,t,n){return this.a.copy(e),this.b.copy(t),this.c.copy(n),this}setFromPointsAndIndices(e,t,n,a){return this.a.copy(e[t]),this.b.copy(e[n]),this.c.copy(e[a]),this}setFromAttributeAndIndices(e,t,n,a){return this.a.fromBufferAttribute(e,t),this.b.fromBufferAttribute(e,n),this.c.fromBufferAttribute(e,a),this}clone(){return new this.constructor().copy(this)}copy(e){return this.a.copy(e.a),this.b.copy(e.b),this.c.copy(e.c),this}getArea(){return dn.subVectors(this.c,this.b),Tn.subVectors(this.a,this.b),dn.cross(Tn).length()*.5}getMidpoint(e){return e.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(e){return hn.getNormal(this.a,this.b,this.c,e)}getPlane(e){return e.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(e,t){return hn.getBarycoord(e,this.a,this.b,this.c,t)}getInterpolation(e,t,n,a,r){return hn.getInterpolation(e,this.a,this.b,this.c,t,n,a,r)}containsPoint(e){return hn.containsPoint(e,this.a,this.b,this.c)}isFrontFacing(e){return hn.isFrontFacing(this.a,this.b,this.c,e)}intersectsBox(e){return e.intersectsTriangle(this)}closestPointToPoint(e,t){const n=this.a,a=this.b,r=this.c;let s,o;Ei.subVectors(a,n),wi.subVectors(r,n),Cr.subVectors(e,n);const l=Ei.dot(Cr),c=wi.dot(Cr);if(l<=0&&c<=0)return t.copy(n);Rr.subVectors(e,a);const d=Ei.dot(Rr),h=wi.dot(Rr);if(d>=0&&h<=d)return t.copy(a);const u=l*h-d*c;if(u<=0&&l>=0&&d<=0)return s=l/(l-d),t.copy(n).addScaledVector(Ei,s);Pr.subVectors(e,r);const p=Ei.dot(Pr),g=wi.dot(Pr);if(g>=0&&p<=g)return t.copy(r);const y=p*c-l*g;if(y<=0&&c>=0&&g<=0)return o=c/(c-g),t.copy(n).addScaledVector(wi,o);const m=d*g-p*h;if(m<=0&&h-d>=0&&p-g>=0)return Xo.subVectors(r,a),o=(h-d)/(h-d+(p-g)),t.copy(a).addScaledVector(Xo,o);const f=1/(m+y+u);return s=y*f,o=u*f,t.copy(n).addScaledVector(Ei,s).addScaledVector(wi,o)}equals(e){return e.a.equals(this.a)&&e.b.equals(this.b)&&e.c.equals(this.c)}}const Jl={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Vn={h:0,s:0,l:0},Da={h:0,s:0,l:0};function Ur(i,e,t){return t<0&&(t+=1),t>1&&(t-=1),t<1/6?i+(e-i)*6*t:t<1/2?e:t<2/3?i+(e-i)*6*(2/3-t):i}class Xe{constructor(e,t,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(e,t,n)}set(e,t,n){if(t===void 0&&n===void 0){const a=e;a&&a.isColor?this.copy(a):typeof a=="number"?this.setHex(a):typeof a=="string"&&this.setStyle(a)}else this.setRGB(e,t,n);return this}setScalar(e){return this.r=e,this.g=e,this.b=e,this}setHex(e,t=jt){return e=Math.floor(e),this.r=(e>>16&255)/255,this.g=(e>>8&255)/255,this.b=(e&255)/255,je.colorSpaceToWorking(this,t),this}setRGB(e,t,n,a=je.workingColorSpace){return this.r=e,this.g=t,this.b=n,je.colorSpaceToWorking(this,a),this}setHSL(e,t,n,a=je.workingColorSpace){if(e=io(e,1),t=ze(t,0,1),n=ze(n,0,1),t===0)this.r=this.g=this.b=n;else{const r=n<=.5?n*(1+t):n+t-n*t,s=2*n-r;this.r=Ur(s,r,e+1/3),this.g=Ur(s,r,e),this.b=Ur(s,r,e-1/3)}return je.colorSpaceToWorking(this,a),this}setStyle(e,t=jt){function n(r){r!==void 0&&parseFloat(r)<1&&Ie("Color: Alpha component of "+e+" will be ignored.")}let a;if(a=/^(\w+)\(([^\)]*)\)/.exec(e)){let r;const s=a[1],o=a[2];switch(s){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,t);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,t);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,t);break;default:Ie("Color: Unknown color model "+e)}}else if(a=/^\#([A-Fa-f\d]+)$/.exec(e)){const r=a[1],s=r.length;if(s===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,t);if(s===6)return this.setHex(parseInt(r,16),t);Ie("Color: Invalid hex color "+e)}else if(e&&e.length>0)return this.setColorName(e,t);return this}setColorName(e,t=jt){const n=Jl[e.toLowerCase()];return n!==void 0?this.setHex(n,t):Ie("Color: Unknown color "+e),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(e){return this.r=e.r,this.g=e.g,this.b=e.b,this}copySRGBToLinear(e){return this.r=Un(e.r),this.g=Un(e.g),this.b=Un(e.b),this}copyLinearToSRGB(e){return this.r=ki(e.r),this.g=ki(e.g),this.b=ki(e.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(e=jt){return je.workingToColorSpace(Rt.copy(this),e),Math.round(ze(Rt.r*255,0,255))*65536+Math.round(ze(Rt.g*255,0,255))*256+Math.round(ze(Rt.b*255,0,255))}getHexString(e=jt){return("000000"+this.getHex(e).toString(16)).slice(-6)}getHSL(e,t=je.workingColorSpace){je.workingToColorSpace(Rt.copy(this),t);const n=Rt.r,a=Rt.g,r=Rt.b,s=Math.max(n,a,r),o=Math.min(n,a,r);let l,c;const d=(o+s)/2;if(o===s)l=0,c=0;else{const h=s-o;switch(c=d<=.5?h/(s+o):h/(2-s-o),s){case n:l=(a-r)/h+(a<r?6:0);break;case a:l=(r-n)/h+2;break;case r:l=(n-a)/h+4;break}l/=6}return e.h=l,e.s=c,e.l=d,e}getRGB(e,t=je.workingColorSpace){return je.workingToColorSpace(Rt.copy(this),t),e.r=Rt.r,e.g=Rt.g,e.b=Rt.b,e}getStyle(e=jt){je.workingToColorSpace(Rt.copy(this),e);const t=Rt.r,n=Rt.g,a=Rt.b;return e!==jt?`color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${a.toFixed(3)})`:`rgb(${Math.round(t*255)},${Math.round(n*255)},${Math.round(a*255)})`}offsetHSL(e,t,n){return this.getHSL(Vn),this.setHSL(Vn.h+e,Vn.s+t,Vn.l+n)}add(e){return this.r+=e.r,this.g+=e.g,this.b+=e.b,this}addColors(e,t){return this.r=e.r+t.r,this.g=e.g+t.g,this.b=e.b+t.b,this}addScalar(e){return this.r+=e,this.g+=e,this.b+=e,this}sub(e){return this.r=Math.max(0,this.r-e.r),this.g=Math.max(0,this.g-e.g),this.b=Math.max(0,this.b-e.b),this}multiply(e){return this.r*=e.r,this.g*=e.g,this.b*=e.b,this}multiplyScalar(e){return this.r*=e,this.g*=e,this.b*=e,this}lerp(e,t){return this.r+=(e.r-this.r)*t,this.g+=(e.g-this.g)*t,this.b+=(e.b-this.b)*t,this}lerpColors(e,t,n){return this.r=e.r+(t.r-e.r)*n,this.g=e.g+(t.g-e.g)*n,this.b=e.b+(t.b-e.b)*n,this}lerpHSL(e,t){this.getHSL(Vn),e.getHSL(Da);const n=ua(Vn.h,Da.h,t),a=ua(Vn.s,Da.s,t),r=ua(Vn.l,Da.l,t);return this.setHSL(n,a,r),this}setFromVector3(e){return this.r=e.x,this.g=e.y,this.b=e.z,this}applyMatrix3(e){const t=this.r,n=this.g,a=this.b,r=e.elements;return this.r=r[0]*t+r[3]*n+r[6]*a,this.g=r[1]*t+r[4]*n+r[7]*a,this.b=r[2]*t+r[5]*n+r[8]*a,this}equals(e){return e.r===this.r&&e.g===this.g&&e.b===this.b}fromArray(e,t=0){return this.r=e[t],this.g=e[t+1],this.b=e[t+2],this}toArray(e=[],t=0){return e[t]=this.r,e[t+1]=this.g,e[t+2]=this.b,e}fromBufferAttribute(e,t){return this.r=e.getX(t),this.g=e.getY(t),this.b=e.getZ(t),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const Rt=new Xe;Xe.NAMES=Jl;let eh=0;class $i extends pi{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:eh++}),this.uuid=Yi(),this.name="",this.type="Material",this.blending=Bi,this.side=Zn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=ts,this.blendDst=ns,this.blendEquation=li,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new Xe(0,0,0),this.blendAlpha=0,this.depthFunc=zi,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Po,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=gi,this.stencilZFail=gi,this.stencilZPass=gi,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(e){this._alphaTest>0!=e>0&&this.version++,this._alphaTest=e}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(e){if(e!==void 0)for(const t in e){const n=e[t];if(n===void 0){Ie(`Material: parameter '${t}' has value of undefined.`);continue}const a=this[t];if(a===void 0){Ie(`Material: '${t}' is not a property of THREE.${this.type}.`);continue}a&&a.isColor?a.set(n):a&&a.isVector3&&n&&n.isVector3?a.copy(n):this[t]=n}}toJSON(e){const t=e===void 0||typeof e=="string";t&&(e={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(e).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(e).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(e).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(e).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(e).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(e).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(e).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(e).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(e).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(e).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(e).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(e).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(e).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(e).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(e).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(e).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(e).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(e).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(e).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(e).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(e).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(e).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(e).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(e).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(e).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(e).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Bi&&(n.blending=this.blending),this.side!==Zn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==ts&&(n.blendSrc=this.blendSrc),this.blendDst!==ns&&(n.blendDst=this.blendDst),this.blendEquation!==li&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==zi&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Po&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==gi&&(n.stencilFail=this.stencilFail),this.stencilZFail!==gi&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==gi&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function a(r){const s=[];for(const o in r){const l=r[o];delete l.metadata,s.push(l)}return s}if(t){const r=a(e.textures),s=a(e.images);r.length>0&&(n.textures=r),s.length>0&&(n.images=s)}return n}clone(){return new this.constructor().copy(this)}copy(e){this.name=e.name,this.blending=e.blending,this.side=e.side,this.vertexColors=e.vertexColors,this.opacity=e.opacity,this.transparent=e.transparent,this.blendSrc=e.blendSrc,this.blendDst=e.blendDst,this.blendEquation=e.blendEquation,this.blendSrcAlpha=e.blendSrcAlpha,this.blendDstAlpha=e.blendDstAlpha,this.blendEquationAlpha=e.blendEquationAlpha,this.blendColor.copy(e.blendColor),this.blendAlpha=e.blendAlpha,this.depthFunc=e.depthFunc,this.depthTest=e.depthTest,this.depthWrite=e.depthWrite,this.stencilWriteMask=e.stencilWriteMask,this.stencilFunc=e.stencilFunc,this.stencilRef=e.stencilRef,this.stencilFuncMask=e.stencilFuncMask,this.stencilFail=e.stencilFail,this.stencilZFail=e.stencilZFail,this.stencilZPass=e.stencilZPass,this.stencilWrite=e.stencilWrite;const t=e.clippingPlanes;let n=null;if(t!==null){const a=t.length;n=new Array(a);for(let r=0;r!==a;++r)n[r]=t[r].clone()}return this.clippingPlanes=n,this.clipIntersection=e.clipIntersection,this.clipShadows=e.clipShadows,this.shadowSide=e.shadowSide,this.colorWrite=e.colorWrite,this.precision=e.precision,this.polygonOffset=e.polygonOffset,this.polygonOffsetFactor=e.polygonOffsetFactor,this.polygonOffsetUnits=e.polygonOffsetUnits,this.dithering=e.dithering,this.alphaTest=e.alphaTest,this.alphaHash=e.alphaHash,this.alphaToCoverage=e.alphaToCoverage,this.premultipliedAlpha=e.premultipliedAlpha,this.forceSinglePass=e.forceSinglePass,this.visible=e.visible,this.toneMapped=e.toneMapped,this.userData=JSON.parse(JSON.stringify(e.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(e){e===!0&&this.version++}}class cr extends $i{constructor(e){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new Xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yn,this.combine=Ys,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.fog=e.fog,this}}const gt=new C,Ia=new Ue;let th=0;class rn{constructor(e,t,n=!1){if(Array.isArray(e))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:th++}),this.name="",this.array=e,this.itemSize=t,this.count=e!==void 0?e.length/t:0,this.normalized=n,this.usage=Vs,this.updateRanges=[],this.gpuType=gn,this.version=0}onUploadCallback(){}set needsUpdate(e){e===!0&&this.version++}setUsage(e){return this.usage=e,this}addUpdateRange(e,t){this.updateRanges.push({start:e,count:t})}clearUpdateRanges(){this.updateRanges.length=0}copy(e){return this.name=e.name,this.array=new e.array.constructor(e.array),this.itemSize=e.itemSize,this.count=e.count,this.normalized=e.normalized,this.usage=e.usage,this.gpuType=e.gpuType,this}copyAt(e,t,n){e*=this.itemSize,n*=t.itemSize;for(let a=0,r=this.itemSize;a<r;a++)this.array[e+a]=t.array[n+a];return this}copyArray(e){return this.array.set(e),this}applyMatrix3(e){if(this.itemSize===2)for(let t=0,n=this.count;t<n;t++)Ia.fromBufferAttribute(this,t),Ia.applyMatrix3(e),this.setXY(t,Ia.x,Ia.y);else if(this.itemSize===3)for(let t=0,n=this.count;t<n;t++)gt.fromBufferAttribute(this,t),gt.applyMatrix3(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}applyMatrix4(e){for(let t=0,n=this.count;t<n;t++)gt.fromBufferAttribute(this,t),gt.applyMatrix4(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}applyNormalMatrix(e){for(let t=0,n=this.count;t<n;t++)gt.fromBufferAttribute(this,t),gt.applyNormalMatrix(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}transformDirection(e){for(let t=0,n=this.count;t<n;t++)gt.fromBufferAttribute(this,t),gt.transformDirection(e),this.setXYZ(t,gt.x,gt.y,gt.z);return this}set(e,t=0){return this.array.set(e,t),this}getComponent(e,t){let n=this.array[e*this.itemSize+t];return this.normalized&&(n=Di(n,this.array)),n}setComponent(e,t,n){return this.normalized&&(n=Dt(n,this.array)),this.array[e*this.itemSize+t]=n,this}getX(e){let t=this.array[e*this.itemSize];return this.normalized&&(t=Di(t,this.array)),t}setX(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize]=t,this}getY(e){let t=this.array[e*this.itemSize+1];return this.normalized&&(t=Di(t,this.array)),t}setY(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+1]=t,this}getZ(e){let t=this.array[e*this.itemSize+2];return this.normalized&&(t=Di(t,this.array)),t}setZ(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+2]=t,this}getW(e){let t=this.array[e*this.itemSize+3];return this.normalized&&(t=Di(t,this.array)),t}setW(e,t){return this.normalized&&(t=Dt(t,this.array)),this.array[e*this.itemSize+3]=t,this}setXY(e,t,n){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array)),this.array[e+0]=t,this.array[e+1]=n,this}setXYZ(e,t,n,a){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array),a=Dt(a,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=a,this}setXYZW(e,t,n,a,r){return e*=this.itemSize,this.normalized&&(t=Dt(t,this.array),n=Dt(n,this.array),a=Dt(a,this.array),r=Dt(r,this.array)),this.array[e+0]=t,this.array[e+1]=n,this.array[e+2]=a,this.array[e+3]=r,this}onUpload(e){return this.onUploadCallback=e,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const e={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(e.name=this.name),this.usage!==Vs&&(e.usage=this.usage),e}}class Ql extends rn{constructor(e,t,n){super(new Uint16Array(e),t,n)}}class ec extends rn{constructor(e,t,n){super(new Uint32Array(e),t,n)}}class Jt extends rn{constructor(e,t,n){super(new Float32Array(e),t,n)}}let nh=0;const tn=new st,Nr=new Et,Ai=new C,Yt=new mi,ia=new mi,St=new C;class sn extends pi{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:nh++}),this.uuid=Yi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(e){return Array.isArray(e)?this.index=new(jl(e)?ec:Ql)(e,1):this.index=e,this}setIndirect(e){return this.indirect=e,this}getIndirect(){return this.indirect}getAttribute(e){return this.attributes[e]}setAttribute(e,t){return this.attributes[e]=t,this}deleteAttribute(e){return delete this.attributes[e],this}hasAttribute(e){return this.attributes[e]!==void 0}addGroup(e,t,n=0){this.groups.push({start:e,count:t,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(e,t){this.drawRange.start=e,this.drawRange.count=t}applyMatrix4(e){const t=this.attributes.position;t!==void 0&&(t.applyMatrix4(e),t.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const r=new Fe().getNormalMatrix(e);n.applyNormalMatrix(r),n.needsUpdate=!0}const a=this.attributes.tangent;return a!==void 0&&(a.transformDirection(e),a.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(e){return tn.makeRotationFromQuaternion(e),this.applyMatrix4(tn),this}rotateX(e){return tn.makeRotationX(e),this.applyMatrix4(tn),this}rotateY(e){return tn.makeRotationY(e),this.applyMatrix4(tn),this}rotateZ(e){return tn.makeRotationZ(e),this.applyMatrix4(tn),this}translate(e,t,n){return tn.makeTranslation(e,t,n),this.applyMatrix4(tn),this}scale(e,t,n){return tn.makeScale(e,t,n),this.applyMatrix4(tn),this}lookAt(e){return Nr.lookAt(e),Nr.updateMatrix(),this.applyMatrix4(Nr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(Ai).negate(),this.translate(Ai.x,Ai.y,Ai.z),this}setFromPoints(e){const t=this.getAttribute("position");if(t===void 0){const n=[];for(let a=0,r=e.length;a<r;a++){const s=e[a];n.push(s.x,s.y,s.z||0)}this.setAttribute("position",new Jt(n,3))}else{const n=Math.min(e.length,t.count);for(let a=0;a<n;a++){const r=e[a];t.setXYZ(a,r.x,r.y,r.z||0)}e.length>t.count&&Ie("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),t.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new mi);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){mt("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new C(-1/0,-1/0,-1/0),new C(1/0,1/0,1/0));return}if(e!==void 0){if(this.boundingBox.setFromBufferAttribute(e),t)for(let n=0,a=t.length;n<a;n++){const r=t[n];Yt.setFromBufferAttribute(r),this.morphTargetsRelative?(St.addVectors(this.boundingBox.min,Yt.min),this.boundingBox.expandByPoint(St),St.addVectors(this.boundingBox.max,Yt.max),this.boundingBox.expandByPoint(St)):(this.boundingBox.expandByPoint(Yt.min),this.boundingBox.expandByPoint(Yt.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&mt('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ji);const e=this.attributes.position,t=this.morphAttributes.position;if(e&&e.isGLBufferAttribute){mt("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new C,1/0);return}if(e){const n=this.boundingSphere.center;if(Yt.setFromBufferAttribute(e),t)for(let r=0,s=t.length;r<s;r++){const o=t[r];ia.setFromBufferAttribute(o),this.morphTargetsRelative?(St.addVectors(Yt.min,ia.min),Yt.expandByPoint(St),St.addVectors(Yt.max,ia.max),Yt.expandByPoint(St)):(Yt.expandByPoint(ia.min),Yt.expandByPoint(ia.max))}Yt.getCenter(n);let a=0;for(let r=0,s=e.count;r<s;r++)St.fromBufferAttribute(e,r),a=Math.max(a,n.distanceToSquared(St));if(t)for(let r=0,s=t.length;r<s;r++){const o=t[r],l=this.morphTargetsRelative;for(let c=0,d=o.count;c<d;c++)St.fromBufferAttribute(o,c),l&&(Ai.fromBufferAttribute(e,c),St.add(Ai)),a=Math.max(a,n.distanceToSquared(St))}this.boundingSphere.radius=Math.sqrt(a),isNaN(this.boundingSphere.radius)&&mt('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const e=this.index,t=this.attributes;if(e===null||t.position===void 0||t.normal===void 0||t.uv===void 0){mt("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=t.position,a=t.normal,r=t.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new rn(new Float32Array(4*n.count),4));const s=this.getAttribute("tangent"),o=[],l=[];for(let B=0;B<n.count;B++)o[B]=new C,l[B]=new C;const c=new C,d=new C,h=new C,u=new Ue,p=new Ue,g=new Ue,y=new C,m=new C;function f(B,M,_){c.fromBufferAttribute(n,B),d.fromBufferAttribute(n,M),h.fromBufferAttribute(n,_),u.fromBufferAttribute(r,B),p.fromBufferAttribute(r,M),g.fromBufferAttribute(r,_),d.sub(c),h.sub(c),p.sub(u),g.sub(u);const D=1/(p.x*g.y-g.x*p.y);isFinite(D)&&(y.copy(d).multiplyScalar(g.y).addScaledVector(h,-p.y).multiplyScalar(D),m.copy(h).multiplyScalar(p.x).addScaledVector(d,-g.x).multiplyScalar(D),o[B].add(y),o[M].add(y),o[_].add(y),l[B].add(m),l[M].add(m),l[_].add(m))}let E=this.groups;E.length===0&&(E=[{start:0,count:e.count}]);for(let B=0,M=E.length;B<M;++B){const _=E[B],D=_.start,F=_.count;for(let z=D,K=D+F;z<K;z+=3)f(e.getX(z+0),e.getX(z+1),e.getX(z+2))}const T=new C,w=new C,L=new C,S=new C;function R(B){L.fromBufferAttribute(a,B),S.copy(L);const M=o[B];T.copy(M),T.sub(L.multiplyScalar(L.dot(M))).normalize(),w.crossVectors(S,M);const D=w.dot(l[B])<0?-1:1;s.setXYZW(B,T.x,T.y,T.z,D)}for(let B=0,M=E.length;B<M;++B){const _=E[B],D=_.start,F=_.count;for(let z=D,K=D+F;z<K;z+=3)R(e.getX(z+0)),R(e.getX(z+1)),R(e.getX(z+2))}}computeVertexNormals(){const e=this.index,t=this.getAttribute("position");if(t!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new rn(new Float32Array(t.count*3),3),this.setAttribute("normal",n);else for(let u=0,p=n.count;u<p;u++)n.setXYZ(u,0,0,0);const a=new C,r=new C,s=new C,o=new C,l=new C,c=new C,d=new C,h=new C;if(e)for(let u=0,p=e.count;u<p;u+=3){const g=e.getX(u+0),y=e.getX(u+1),m=e.getX(u+2);a.fromBufferAttribute(t,g),r.fromBufferAttribute(t,y),s.fromBufferAttribute(t,m),d.subVectors(s,r),h.subVectors(a,r),d.cross(h),o.fromBufferAttribute(n,g),l.fromBufferAttribute(n,y),c.fromBufferAttribute(n,m),o.add(d),l.add(d),c.add(d),n.setXYZ(g,o.x,o.y,o.z),n.setXYZ(y,l.x,l.y,l.z),n.setXYZ(m,c.x,c.y,c.z)}else for(let u=0,p=t.count;u<p;u+=3)a.fromBufferAttribute(t,u+0),r.fromBufferAttribute(t,u+1),s.fromBufferAttribute(t,u+2),d.subVectors(s,r),h.subVectors(a,r),d.cross(h),n.setXYZ(u+0,d.x,d.y,d.z),n.setXYZ(u+1,d.x,d.y,d.z),n.setXYZ(u+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const e=this.attributes.normal;for(let t=0,n=e.count;t<n;t++)St.fromBufferAttribute(e,t),St.normalize(),e.setXYZ(t,St.x,St.y,St.z)}toNonIndexed(){function e(o,l){const c=o.array,d=o.itemSize,h=o.normalized,u=new c.constructor(l.length*d);let p=0,g=0;for(let y=0,m=l.length;y<m;y++){o.isInterleavedBufferAttribute?p=l[y]*o.data.stride+o.offset:p=l[y]*d;for(let f=0;f<d;f++)u[g++]=c[p++]}return new rn(u,d,h)}if(this.index===null)return Ie("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const t=new sn,n=this.index.array,a=this.attributes;for(const o in a){const l=a[o],c=e(l,n);t.setAttribute(o,c)}const r=this.morphAttributes;for(const o in r){const l=[],c=r[o];for(let d=0,h=c.length;d<h;d++){const u=c[d],p=e(u,n);l.push(p)}t.morphAttributes[o]=l}t.morphTargetsRelative=this.morphTargetsRelative;const s=this.groups;for(let o=0,l=s.length;o<l;o++){const c=s[o];t.addGroup(c.start,c.count,c.materialIndex)}return t}toJSON(){const e={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(e.uuid=this.uuid,e.type=this.type,this.name!==""&&(e.name=this.name),Object.keys(this.userData).length>0&&(e.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(e[c]=l[c]);return e}e.data={attributes:{}};const t=this.index;t!==null&&(e.data.index={type:t.array.constructor.name,array:Array.prototype.slice.call(t.array)});const n=this.attributes;for(const l in n){const c=n[l];e.data.attributes[l]=c.toJSON(e.data)}const a={};let r=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let h=0,u=c.length;h<u;h++){const p=c[h];d.push(p.toJSON(e.data))}d.length>0&&(a[l]=d,r=!0)}r&&(e.data.morphAttributes=a,e.data.morphTargetsRelative=this.morphTargetsRelative);const s=this.groups;s.length>0&&(e.data.groups=JSON.parse(JSON.stringify(s)));const o=this.boundingSphere;return o!==null&&(e.data.boundingSphere=o.toJSON()),e}clone(){return new this.constructor().copy(this)}copy(e){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const t={};this.name=e.name;const n=e.index;n!==null&&this.setIndex(n.clone());const a=e.attributes;for(const c in a){const d=a[c];this.setAttribute(c,d.clone(t))}const r=e.morphAttributes;for(const c in r){const d=[],h=r[c];for(let u=0,p=h.length;u<p;u++)d.push(h[u].clone(t));this.morphAttributes[c]=d}this.morphTargetsRelative=e.morphTargetsRelative;const s=e.groups;for(let c=0,d=s.length;c<d;c++){const h=s[c];this.addGroup(h.start,h.count,h.materialIndex)}const o=e.boundingBox;o!==null&&(this.boundingBox=o.clone());const l=e.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=e.drawRange.start,this.drawRange.count=e.drawRange.count,this.userData=e.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}const Ko=new st,ai=new ro,Ua=new ji,qo=new C,Na=new C,Fa=new C,Ba=new C,Fr=new C,ka=new C,Yo=new C,Oa=new C;class Tt extends Et{constructor(e=new sn,t=new cr){super(),this.isMesh=!0,this.type="Mesh",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),e.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=e.morphTargetInfluences.slice()),e.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},e.morphTargetDictionary)),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const a=t[n[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=a.length;r<s;r++){const o=a[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(e,t){const n=this.geometry,a=n.attributes.position,r=n.morphAttributes.position,s=n.morphTargetsRelative;t.fromBufferAttribute(a,e);const o=this.morphTargetInfluences;if(r&&o){ka.set(0,0,0);for(let l=0,c=r.length;l<c;l++){const d=o[l],h=r[l];d!==0&&(Fr.fromBufferAttribute(h,e),s?ka.addScaledVector(Fr,d):ka.addScaledVector(Fr.sub(t),d))}t.add(ka)}return t}raycast(e,t){const n=this.geometry,a=this.material,r=this.matrixWorld;a!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ua.copy(n.boundingSphere),Ua.applyMatrix4(r),ai.copy(e.ray).recast(e.near),!(Ua.containsPoint(ai.origin)===!1&&(ai.intersectSphere(Ua,qo)===null||ai.origin.distanceToSquared(qo)>(e.far-e.near)**2))&&(Ko.copy(r).invert(),ai.copy(e.ray).applyMatrix4(Ko),!(n.boundingBox!==null&&ai.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(e,t,ai)))}_computeIntersections(e,t,n){let a;const r=this.geometry,s=this.material,o=r.index,l=r.attributes.position,c=r.attributes.uv,d=r.attributes.uv1,h=r.attributes.normal,u=r.groups,p=r.drawRange;if(o!==null)if(Array.isArray(s))for(let g=0,y=u.length;g<y;g++){const m=u[g],f=s[m.materialIndex],E=Math.max(m.start,p.start),T=Math.min(o.count,Math.min(m.start+m.count,p.start+p.count));for(let w=E,L=T;w<L;w+=3){const S=o.getX(w),R=o.getX(w+1),B=o.getX(w+2);a=za(this,f,e,n,c,d,h,S,R,B),a&&(a.faceIndex=Math.floor(w/3),a.face.materialIndex=m.materialIndex,t.push(a))}}else{const g=Math.max(0,p.start),y=Math.min(o.count,p.start+p.count);for(let m=g,f=y;m<f;m+=3){const E=o.getX(m),T=o.getX(m+1),w=o.getX(m+2);a=za(this,s,e,n,c,d,h,E,T,w),a&&(a.faceIndex=Math.floor(m/3),t.push(a))}}else if(l!==void 0)if(Array.isArray(s))for(let g=0,y=u.length;g<y;g++){const m=u[g],f=s[m.materialIndex],E=Math.max(m.start,p.start),T=Math.min(l.count,Math.min(m.start+m.count,p.start+p.count));for(let w=E,L=T;w<L;w+=3){const S=w,R=w+1,B=w+2;a=za(this,f,e,n,c,d,h,S,R,B),a&&(a.faceIndex=Math.floor(w/3),a.face.materialIndex=m.materialIndex,t.push(a))}}else{const g=Math.max(0,p.start),y=Math.min(l.count,p.start+p.count);for(let m=g,f=y;m<f;m+=3){const E=m,T=m+1,w=m+2;a=za(this,s,e,n,c,d,h,E,T,w),a&&(a.faceIndex=Math.floor(m/3),t.push(a))}}}}function ih(i,e,t,n,a,r,s,o){let l;if(e.side===Ht?l=n.intersectTriangle(s,r,a,!0,o):l=n.intersectTriangle(a,r,s,e.side===Zn,o),l===null)return null;Oa.copy(o),Oa.applyMatrix4(i.matrixWorld);const c=t.ray.origin.distanceTo(Oa);return c<t.near||c>t.far?null:{distance:c,point:Oa.clone(),object:i}}function za(i,e,t,n,a,r,s,o,l,c){i.getVertexPosition(o,Na),i.getVertexPosition(l,Fa),i.getVertexPosition(c,Ba);const d=ih(i,e,t,n,Na,Fa,Ba,Yo);if(d){const h=new C;hn.getBarycoord(Yo,Na,Fa,Ba,h),a&&(d.uv=hn.getInterpolatedAttribute(a,o,l,c,h,new Ue)),r&&(d.uv1=hn.getInterpolatedAttribute(r,o,l,c,h,new Ue)),s&&(d.normal=hn.getInterpolatedAttribute(s,o,l,c,h,new C),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const u={a:o,b:l,c,normal:new C,materialIndex:0};hn.getNormal(Na,Fa,Ba,u.normal),d.face=u,d.barycoord=h}return d}class Bn extends sn{constructor(e=1,t=1,n=1,a=1,r=1,s=1){super(),this.type="BoxGeometry",this.parameters={width:e,height:t,depth:n,widthSegments:a,heightSegments:r,depthSegments:s};const o=this;a=Math.floor(a),r=Math.floor(r),s=Math.floor(s);const l=[],c=[],d=[],h=[];let u=0,p=0;g("z","y","x",-1,-1,n,t,e,s,r,0),g("z","y","x",1,-1,n,t,-e,s,r,1),g("x","z","y",1,1,e,n,t,a,s,2),g("x","z","y",1,-1,e,n,-t,a,s,3),g("x","y","z",1,-1,e,t,n,a,r,4),g("x","y","z",-1,-1,e,t,-n,a,r,5),this.setIndex(l),this.setAttribute("position",new Jt(c,3)),this.setAttribute("normal",new Jt(d,3)),this.setAttribute("uv",new Jt(h,2));function g(y,m,f,E,T,w,L,S,R,B,M){const _=w/R,D=L/B,F=w/2,z=L/2,K=S/2,X=R+1,Y=B+1;let ee=0,W=0;const ie=new C;for(let re=0;re<Y;re++){const be=re*D-z;for(let He=0;He<X;He++){const $e=He*_-F;ie[y]=$e*E,ie[m]=be*T,ie[f]=K,c.push(ie.x,ie.y,ie.z),ie[y]=0,ie[m]=0,ie[f]=S>0?1:-1,d.push(ie.x,ie.y,ie.z),h.push(He/R),h.push(1-re/B),ee+=1}}for(let re=0;re<B;re++)for(let be=0;be<R;be++){const He=u+be+X*re,$e=u+be+X*(re+1),Qe=u+(be+1)+X*(re+1),Ze=u+(be+1)+X*re;l.push(He,$e,Ze),l.push($e,Qe,Ze),W+=6}o.addGroup(p,W,M),p+=W,u+=ee}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new Bn(e.width,e.height,e.depth,e.widthSegments,e.heightSegments,e.depthSegments)}}function Wi(i){const e={};for(const t in i){e[t]={};for(const n in i[t]){const a=i[t][n];a&&(a.isColor||a.isMatrix3||a.isMatrix4||a.isVector2||a.isVector3||a.isVector4||a.isTexture||a.isQuaternion)?a.isRenderTargetTexture?(Ie("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),e[t][n]=null):e[t][n]=a.clone():Array.isArray(a)?e[t][n]=a.slice():e[t][n]=a}}return e}function It(i){const e={};for(let t=0;t<i.length;t++){const n=Wi(i[t]);for(const a in n)e[a]=n[a]}return e}function ah(i){const e=[];for(let t=0;t<i.length;t++)e.push(i[t].clone());return e}function tc(i){const e=i.getRenderTarget();return e===null?i.outputColorSpace:e.isXRRenderTarget===!0?e.texture.colorSpace:je.workingColorSpace}const rh={clone:Wi,merge:It};var sh=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,oh=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class Fn extends $i{constructor(e){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=sh,this.fragmentShader=oh,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,e!==void 0&&this.setValues(e)}copy(e){return super.copy(e),this.fragmentShader=e.fragmentShader,this.vertexShader=e.vertexShader,this.uniforms=Wi(e.uniforms),this.uniformsGroups=ah(e.uniformsGroups),this.defines=Object.assign({},e.defines),this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.fog=e.fog,this.lights=e.lights,this.clipping=e.clipping,this.extensions=Object.assign({},e.extensions),this.glslVersion=e.glslVersion,this}toJSON(e){const t=super.toJSON(e);t.glslVersion=this.glslVersion,t.uniforms={};for(const a in this.uniforms){const s=this.uniforms[a].value;s&&s.isTexture?t.uniforms[a]={type:"t",value:s.toJSON(e).uuid}:s&&s.isColor?t.uniforms[a]={type:"c",value:s.getHex()}:s&&s.isVector2?t.uniforms[a]={type:"v2",value:s.toArray()}:s&&s.isVector3?t.uniforms[a]={type:"v3",value:s.toArray()}:s&&s.isVector4?t.uniforms[a]={type:"v4",value:s.toArray()}:s&&s.isMatrix3?t.uniforms[a]={type:"m3",value:s.toArray()}:s&&s.isMatrix4?t.uniforms[a]={type:"m4",value:s.toArray()}:t.uniforms[a]={value:s}}Object.keys(this.defines).length>0&&(t.defines=this.defines),t.vertexShader=this.vertexShader,t.fragmentShader=this.fragmentShader,t.lights=this.lights,t.clipping=this.clipping;const n={};for(const a in this.extensions)this.extensions[a]===!0&&(n[a]=!0);return Object.keys(n).length>0&&(t.extensions=n),t}}class nc extends Et{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new st,this.projectionMatrix=new st,this.projectionMatrixInverse=new st,this.coordinateSystem=_n,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(e,t){return super.copy(e,t),this.matrixWorldInverse.copy(e.matrixWorldInverse),this.projectionMatrix.copy(e.projectionMatrix),this.projectionMatrixInverse.copy(e.projectionMatrixInverse),this.coordinateSystem=e.coordinateSystem,this}getWorldDirection(e){return super.getWorldDirection(e).negate()}updateMatrixWorld(e){super.updateMatrixWorld(e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(e,t){super.updateWorldMatrix(e,t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}}const Hn=new C,jo=new Ue,$o=new Ue;class nn extends nc{constructor(e=50,t=1,n=.1,a=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=e,this.zoom=1,this.near=n,this.far=a,this.focus=10,this.aspect=t,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.fov=e.fov,this.zoom=e.zoom,this.near=e.near,this.far=e.far,this.focus=e.focus,this.aspect=e.aspect,this.view=e.view===null?null:Object.assign({},e.view),this.filmGauge=e.filmGauge,this.filmOffset=e.filmOffset,this}setFocalLength(e){const t=.5*this.getFilmHeight()/e;this.fov=_a*2*Math.atan(t),this.updateProjectionMatrix()}getFocalLength(){const e=Math.tan(ha*.5*this.fov);return .5*this.getFilmHeight()/e}getEffectiveFOV(){return _a*2*Math.atan(Math.tan(ha*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(e,t,n){Hn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),t.set(Hn.x,Hn.y).multiplyScalar(-e/Hn.z),Hn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Hn.x,Hn.y).multiplyScalar(-e/Hn.z)}getViewSize(e,t){return this.getViewBounds(e,jo,$o),t.subVectors($o,jo)}setViewOffset(e,t,n,a,r,s){this.aspect=e/t,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=a,this.view.width=r,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=this.near;let t=e*Math.tan(ha*.5*this.fov)/this.zoom,n=2*t,a=this.aspect*n,r=-.5*a;const s=this.view;if(this.view!==null&&this.view.enabled){const l=s.fullWidth,c=s.fullHeight;r+=s.offsetX*a/l,t-=s.offsetY*n/c,a*=s.width/l,n*=s.height/c}const o=this.filmOffset;o!==0&&(r+=e*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+a,t,t-n,e,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.fov=this.fov,t.object.zoom=this.zoom,t.object.near=this.near,t.object.far=this.far,t.object.focus=this.focus,t.object.aspect=this.aspect,this.view!==null&&(t.object.view=Object.assign({},this.view)),t.object.filmGauge=this.filmGauge,t.object.filmOffset=this.filmOffset,t}}const Ci=-90,Ri=1;class lh extends Et{constructor(e,t,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const a=new nn(Ci,Ri,e,t);a.layers=this.layers,this.add(a);const r=new nn(Ci,Ri,e,t);r.layers=this.layers,this.add(r);const s=new nn(Ci,Ri,e,t);s.layers=this.layers,this.add(s);const o=new nn(Ci,Ri,e,t);o.layers=this.layers,this.add(o);const l=new nn(Ci,Ri,e,t);l.layers=this.layers,this.add(l);const c=new nn(Ci,Ri,e,t);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const e=this.coordinateSystem,t=this.children.concat(),[n,a,r,s,o,l]=t;for(const c of t)this.remove(c);if(e===_n)n.up.set(0,1,0),n.lookAt(1,0,0),a.up.set(0,1,0),a.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),s.up.set(0,0,1),s.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(e===ir)n.up.set(0,-1,0),n.lookAt(-1,0,0),a.up.set(0,-1,0),a.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),s.up.set(0,0,-1),s.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+e);for(const c of t)this.add(c),c.updateMatrixWorld()}update(e,t){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:a}=this;this.coordinateSystem!==e.coordinateSystem&&(this.coordinateSystem=e.coordinateSystem,this.updateCoordinateSystem());const[r,s,o,l,c,d]=this.children,h=e.getRenderTarget(),u=e.getActiveCubeFace(),p=e.getActiveMipmapLevel(),g=e.xr.enabled;e.xr.enabled=!1;const y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,e.setRenderTarget(n,0,a),e.render(t,r),e.setRenderTarget(n,1,a),e.render(t,s),e.setRenderTarget(n,2,a),e.render(t,o),e.setRenderTarget(n,3,a),e.render(t,l),e.setRenderTarget(n,4,a),e.render(t,c),n.texture.generateMipmaps=y,e.setRenderTarget(n,5,a),e.render(t,d),e.setRenderTarget(h,u,p),e.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class ic extends Ut{constructor(e=[],t=Gi,n,a,r,s,o,l,c,d){super(e,t,n,a,r,s,o,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(e){this.image=e}}class ch extends fi{constructor(e=1,t={}){super(e,e,t),this.isWebGLCubeRenderTarget=!0;const n={width:e,height:e,depth:1},a=[n,n,n,n,n,n];this.texture=new ic(a),this._setTextureOptions(t),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(e,t){this.texture.type=t.type,this.texture.colorSpace=t.colorSpace,this.texture.generateMipmaps=t.generateMipmaps,this.texture.minFilter=t.minFilter,this.texture.magFilter=t.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},a=new Bn(5,5,5),r=new Fn({name:"CubemapFromEquirect",uniforms:Wi(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ht,blending:In});r.uniforms.tEquirect.value=t;const s=new Tt(a,r),o=t.minFilter;return t.minFilter===di&&(t.minFilter=an),new lh(1,10,this).update(e,s),t.minFilter=o,s.geometry.dispose(),s.material.dispose(),this}clear(e,t=!0,n=!0,a=!0){const r=e.getRenderTarget();for(let s=0;s<6;s++)e.setRenderTarget(this,s),e.clear(t,n,a);e.setRenderTarget(r)}}class $t extends Et{constructor(){super(),this.isGroup=!0,this.type="Group"}}const dh={type:"move"};class Br{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new $t,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new $t,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new C,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new C),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new $t,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new C,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new C),this._grip}dispatchEvent(e){return this._targetRay!==null&&this._targetRay.dispatchEvent(e),this._grip!==null&&this._grip.dispatchEvent(e),this._hand!==null&&this._hand.dispatchEvent(e),this}connect(e){if(e&&e.hand){const t=this._hand;if(t)for(const n of e.hand.values())this._getHandJoint(t,n)}return this.dispatchEvent({type:"connected",data:e}),this}disconnect(e){return this.dispatchEvent({type:"disconnected",data:e}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(e,t,n){let a=null,r=null,s=null;const o=this._targetRay,l=this._grip,c=this._hand;if(e&&t.session.visibilityState!=="visible-blurred"){if(c&&e.hand){s=!0;for(const y of e.hand.values()){const m=t.getJointPose(y,n),f=this._getHandJoint(c,y);m!==null&&(f.matrix.fromArray(m.transform.matrix),f.matrix.decompose(f.position,f.rotation,f.scale),f.matrixWorldNeedsUpdate=!0,f.jointRadius=m.radius),f.visible=m!==null}const d=c.joints["index-finger-tip"],h=c.joints["thumb-tip"],u=d.position.distanceTo(h.position),p=.02,g=.005;c.inputState.pinching&&u>p+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:e.handedness,target:this})):!c.inputState.pinching&&u<=p-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:e.handedness,target:this}))}else l!==null&&e.gripSpace&&(r=t.getPose(e.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(a=t.getPose(e.targetRaySpace,n),a===null&&r!==null&&(a=r),a!==null&&(o.matrix.fromArray(a.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,a.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(a.linearVelocity)):o.hasLinearVelocity=!1,a.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(a.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(dh)))}return o!==null&&(o.visible=a!==null),l!==null&&(l.visible=r!==null),c!==null&&(c.visible=s!==null),this}_getHandJoint(e,t){if(e.joints[t.jointName]===void 0){const n=new $t;n.matrixAutoUpdate=!1,n.visible=!1,e.joints[t.jointName]=n,e.add(n)}return e.joints[t.jointName]}}class so{constructor(e,t=1,n=1e3){this.isFog=!0,this.name="",this.color=new Xe(e),this.near=t,this.far=n}clone(){return new so(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class hh extends Et{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new yn,this.environmentIntensity=1,this.environmentRotation=new yn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(e,t){return super.copy(e,t),e.background!==null&&(this.background=e.background.clone()),e.environment!==null&&(this.environment=e.environment.clone()),e.fog!==null&&(this.fog=e.fog.clone()),this.backgroundBlurriness=e.backgroundBlurriness,this.backgroundIntensity=e.backgroundIntensity,this.backgroundRotation.copy(e.backgroundRotation),this.environmentIntensity=e.environmentIntensity,this.environmentRotation.copy(e.environmentRotation),e.overrideMaterial!==null&&(this.overrideMaterial=e.overrideMaterial.clone()),this.matrixAutoUpdate=e.matrixAutoUpdate,this}toJSON(e){const t=super.toJSON(e);return this.fog!==null&&(t.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(t.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(t.object.backgroundIntensity=this.backgroundIntensity),t.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(t.object.environmentIntensity=this.environmentIntensity),t.object.environmentRotation=this.environmentRotation.toArray(),t}}class ac extends Ut{constructor(e=null,t=1,n=1,a,r,s,o,l,c=Zt,d=Zt,h,u){super(null,s,o,l,c,d,a,r,h,u),this.isDataTexture=!0,this.image={data:e,width:t,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class Zo extends rn{constructor(e,t,n,a=1){super(e,t,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=a}copy(e){return super.copy(e),this.meshPerAttribute=e.meshPerAttribute,this}toJSON(){const e=super.toJSON();return e.meshPerAttribute=this.meshPerAttribute,e.isInstancedBufferAttribute=!0,e}}const Pi=new st,Jo=new st,Ga=[],Qo=new mi,uh=new st,aa=new Tt,ra=new ji;class fh extends Tt{constructor(e,t,n){super(e,t),this.isInstancedMesh=!0,this.instanceMatrix=new Zo(new Float32Array(n*16),16),this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let a=0;a<n;a++)this.setMatrixAt(a,uh)}computeBoundingBox(){const e=this.geometry,t=this.count;this.boundingBox===null&&(this.boundingBox=new mi),e.boundingBox===null&&e.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Pi),Qo.copy(e.boundingBox).applyMatrix4(Pi),this.boundingBox.union(Qo)}computeBoundingSphere(){const e=this.geometry,t=this.count;this.boundingSphere===null&&(this.boundingSphere=new ji),e.boundingSphere===null&&e.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<t;n++)this.getMatrixAt(n,Pi),ra.copy(e.boundingSphere).applyMatrix4(Pi),this.boundingSphere.union(ra)}copy(e,t){return super.copy(e,t),this.instanceMatrix.copy(e.instanceMatrix),e.morphTexture!==null&&(this.morphTexture=e.morphTexture.clone()),e.instanceColor!==null&&(this.instanceColor=e.instanceColor.clone()),this.count=e.count,e.boundingBox!==null&&(this.boundingBox=e.boundingBox.clone()),e.boundingSphere!==null&&(this.boundingSphere=e.boundingSphere.clone()),this}getColorAt(e,t){t.fromArray(this.instanceColor.array,e*3)}getMatrixAt(e,t){t.fromArray(this.instanceMatrix.array,e*16)}getMorphAt(e,t){const n=t.morphTargetInfluences,a=this.morphTexture.source.data.data,r=n.length+1,s=e*r+1;for(let o=0;o<n.length;o++)n[o]=a[s+o]}raycast(e,t){const n=this.matrixWorld,a=this.count;if(aa.geometry=this.geometry,aa.material=this.material,aa.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),ra.copy(this.boundingSphere),ra.applyMatrix4(n),e.ray.intersectsSphere(ra)!==!1))for(let r=0;r<a;r++){this.getMatrixAt(r,Pi),Jo.multiplyMatrices(n,Pi),aa.matrixWorld=Jo,aa.raycast(e,Ga);for(let s=0,o=Ga.length;s<o;s++){const l=Ga[s];l.instanceId=r,l.object=this,t.push(l)}Ga.length=0}}setColorAt(e,t){this.instanceColor===null&&(this.instanceColor=new Zo(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),t.toArray(this.instanceColor.array,e*3)}setMatrixAt(e,t){t.toArray(this.instanceMatrix.array,e*16)}setMorphAt(e,t){const n=t.morphTargetInfluences,a=n.length+1;this.morphTexture===null&&(this.morphTexture=new ac(new Float32Array(a*this.count),a,this.count,Js,gn));const r=this.morphTexture.source.data.data;let s=0;for(let c=0;c<n.length;c++)s+=n[c];const o=this.geometry.morphTargetsRelative?1:1-s,l=a*e;r[l]=o,r.set(n,l+1)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const kr=new C,ph=new C,mh=new Fe;class Wn{constructor(e=new C(1,0,0),t=0){this.isPlane=!0,this.normal=e,this.constant=t}set(e,t){return this.normal.copy(e),this.constant=t,this}setComponents(e,t,n,a){return this.normal.set(e,t,n),this.constant=a,this}setFromNormalAndCoplanarPoint(e,t){return this.normal.copy(e),this.constant=-t.dot(this.normal),this}setFromCoplanarPoints(e,t,n){const a=kr.subVectors(n,t).cross(ph.subVectors(e,t)).normalize();return this.setFromNormalAndCoplanarPoint(a,e),this}copy(e){return this.normal.copy(e.normal),this.constant=e.constant,this}normalize(){const e=1/this.normal.length();return this.normal.multiplyScalar(e),this.constant*=e,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(e){return this.normal.dot(e)+this.constant}distanceToSphere(e){return this.distanceToPoint(e.center)-e.radius}projectPoint(e,t){return t.copy(e).addScaledVector(this.normal,-this.distanceToPoint(e))}intersectLine(e,t){const n=e.delta(kr),a=this.normal.dot(n);if(a===0)return this.distanceToPoint(e.start)===0?t.copy(e.start):null;const r=-(e.start.dot(this.normal)+this.constant)/a;return r<0||r>1?null:t.copy(e.start).addScaledVector(n,r)}intersectsLine(e){const t=this.distanceToPoint(e.start),n=this.distanceToPoint(e.end);return t<0&&n>0||n<0&&t>0}intersectsBox(e){return e.intersectsPlane(this)}intersectsSphere(e){return e.intersectsPlane(this)}coplanarPoint(e){return e.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(e,t){const n=t||mh.getNormalMatrix(e),a=this.coplanarPoint(kr).applyMatrix4(e),r=this.normal.applyMatrix3(n).normalize();return this.constant=-a.dot(r),this}translate(e){return this.constant-=e.dot(this.normal),this}equals(e){return e.normal.equals(this.normal)&&e.constant===this.constant}clone(){return new this.constructor().copy(this)}}const ri=new ji,xh=new Ue(.5,.5),Va=new C;class oo{constructor(e=new Wn,t=new Wn,n=new Wn,a=new Wn,r=new Wn,s=new Wn){this.planes=[e,t,n,a,r,s]}set(e,t,n,a,r,s){const o=this.planes;return o[0].copy(e),o[1].copy(t),o[2].copy(n),o[3].copy(a),o[4].copy(r),o[5].copy(s),this}copy(e){const t=this.planes;for(let n=0;n<6;n++)t[n].copy(e.planes[n]);return this}setFromProjectionMatrix(e,t=_n,n=!1){const a=this.planes,r=e.elements,s=r[0],o=r[1],l=r[2],c=r[3],d=r[4],h=r[5],u=r[6],p=r[7],g=r[8],y=r[9],m=r[10],f=r[11],E=r[12],T=r[13],w=r[14],L=r[15];if(a[0].setComponents(c-s,p-d,f-g,L-E).normalize(),a[1].setComponents(c+s,p+d,f+g,L+E).normalize(),a[2].setComponents(c+o,p+h,f+y,L+T).normalize(),a[3].setComponents(c-o,p-h,f-y,L-T).normalize(),n)a[4].setComponents(l,u,m,w).normalize(),a[5].setComponents(c-l,p-u,f-m,L-w).normalize();else if(a[4].setComponents(c-l,p-u,f-m,L-w).normalize(),t===_n)a[5].setComponents(c+l,p+u,f+m,L+w).normalize();else if(t===ir)a[5].setComponents(l,u,m,w).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+t);return this}intersectsObject(e){if(e.boundingSphere!==void 0)e.boundingSphere===null&&e.computeBoundingSphere(),ri.copy(e.boundingSphere).applyMatrix4(e.matrixWorld);else{const t=e.geometry;t.boundingSphere===null&&t.computeBoundingSphere(),ri.copy(t.boundingSphere).applyMatrix4(e.matrixWorld)}return this.intersectsSphere(ri)}intersectsSprite(e){ri.center.set(0,0,0);const t=xh.distanceTo(e.center);return ri.radius=.7071067811865476+t,ri.applyMatrix4(e.matrixWorld),this.intersectsSphere(ri)}intersectsSphere(e){const t=this.planes,n=e.center,a=-e.radius;for(let r=0;r<6;r++)if(t[r].distanceToPoint(n)<a)return!1;return!0}intersectsBox(e){const t=this.planes;for(let n=0;n<6;n++){const a=t[n];if(Va.x=a.normal.x>0?e.max.x:e.min.x,Va.y=a.normal.y>0?e.max.y:e.min.y,Va.z=a.normal.z>0?e.max.z:e.min.z,a.distanceToPoint(Va)<0)return!1}return!0}containsPoint(e){const t=this.planes;for(let n=0;n<6;n++)if(t[n].distanceToPoint(e)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class rc extends $i{constructor(e){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new Xe(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.alphaMap=e.alphaMap,this.size=e.size,this.sizeAttenuation=e.sizeAttenuation,this.fog=e.fog,this}}const el=new st,Hs=new ro,Ha=new ji,Wa=new C;class gh extends Et{constructor(e=new sn,t=new rc){super(),this.isPoints=!0,this.type="Points",this.geometry=e,this.material=t,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(e,t){return super.copy(e,t),this.material=Array.isArray(e.material)?e.material.slice():e.material,this.geometry=e.geometry,this}raycast(e,t){const n=this.geometry,a=this.matrixWorld,r=e.params.Points.threshold,s=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Ha.copy(n.boundingSphere),Ha.applyMatrix4(a),Ha.radius+=r,e.ray.intersectsSphere(Ha)===!1)return;el.copy(a).invert(),Hs.copy(e.ray).applyMatrix4(el);const o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,c=n.index,h=n.attributes.position;if(c!==null){const u=Math.max(0,s.start),p=Math.min(c.count,s.start+s.count);for(let g=u,y=p;g<y;g++){const m=c.getX(g);Wa.fromBufferAttribute(h,m),tl(Wa,m,l,a,e,t,this)}}else{const u=Math.max(0,s.start),p=Math.min(h.count,s.start+s.count);for(let g=u,y=p;g<y;g++)Wa.fromBufferAttribute(h,g),tl(Wa,g,l,a,e,t,this)}}updateMorphTargets(){const t=this.geometry.morphAttributes,n=Object.keys(t);if(n.length>0){const a=t[n[0]];if(a!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,s=a.length;r<s;r++){const o=a[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}}function tl(i,e,t,n,a,r,s){const o=Hs.distanceSqToPoint(i);if(o<t){const l=new C;Hs.closestPointToPoint(i,l),l.applyMatrix4(n);const c=a.ray.origin.distanceTo(l);if(c<a.near||c>a.far)return;r.push({distance:c,distanceToRay:Math.sqrt(o),point:l,index:e,face:null,faceIndex:null,barycoord:null,object:s})}}class sc extends Ut{constructor(e,t,n=ui,a,r,s,o=Zt,l=Zt,c,d=ma,h=1){if(d!==ma&&d!==xa)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const u={width:e,height:t,depth:h};super(u,a,r,s,o,l,d,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(e){return super.copy(e),this.source=new ao(Object.assign({},e.image)),this.compareFunction=e.compareFunction,this}toJSON(e){const t=super.toJSON(e);return this.compareFunction!==null&&(t.compareFunction=this.compareFunction),t}}class oc extends Ut{constructor(e=null){super(),this.sourceTexture=e,this.isExternalTexture=!0}copy(e){return super.copy(e),this.sourceTexture=e.sourceTexture,this}}class lo extends sn{constructor(e=1,t=1,n=1,a=32,r=1,s=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:e,radiusBottom:t,height:n,radialSegments:a,heightSegments:r,openEnded:s,thetaStart:o,thetaLength:l};const c=this;a=Math.floor(a),r=Math.floor(r);const d=[],h=[],u=[],p=[];let g=0;const y=[],m=n/2;let f=0;E(),s===!1&&(e>0&&T(!0),t>0&&T(!1)),this.setIndex(d),this.setAttribute("position",new Jt(h,3)),this.setAttribute("normal",new Jt(u,3)),this.setAttribute("uv",new Jt(p,2));function E(){const w=new C,L=new C;let S=0;const R=(t-e)/n;for(let B=0;B<=r;B++){const M=[],_=B/r,D=_*(t-e)+e;for(let F=0;F<=a;F++){const z=F/a,K=z*l+o,X=Math.sin(K),Y=Math.cos(K);L.x=D*X,L.y=-_*n+m,L.z=D*Y,h.push(L.x,L.y,L.z),w.set(X,R,Y).normalize(),u.push(w.x,w.y,w.z),p.push(z,1-_),M.push(g++)}y.push(M)}for(let B=0;B<a;B++)for(let M=0;M<r;M++){const _=y[M][B],D=y[M+1][B],F=y[M+1][B+1],z=y[M][B+1];(e>0||M!==0)&&(d.push(_,D,z),S+=3),(t>0||M!==r-1)&&(d.push(D,F,z),S+=3)}c.addGroup(f,S,0),f+=S}function T(w){const L=g,S=new Ue,R=new C;let B=0;const M=w===!0?e:t,_=w===!0?1:-1;for(let F=1;F<=a;F++)h.push(0,m*_,0),u.push(0,_,0),p.push(.5,.5),g++;const D=g;for(let F=0;F<=a;F++){const K=F/a*l+o,X=Math.cos(K),Y=Math.sin(K);R.x=M*Y,R.y=m*_,R.z=M*X,h.push(R.x,R.y,R.z),u.push(0,_,0),S.x=X*.5+.5,S.y=Y*.5*_+.5,p.push(S.x,S.y),g++}for(let F=0;F<a;F++){const z=L+F,K=D+F;w===!0?d.push(K,K+1,z):d.push(K+1,K,z),B+=3}c.addGroup(f,B,w===!0?1:2),f+=B}}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new lo(e.radiusTop,e.radiusBottom,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class co extends lo{constructor(e=1,t=1,n=32,a=1,r=!1,s=0,o=Math.PI*2){super(0,e,t,n,a,r,s,o),this.type="ConeGeometry",this.parameters={radius:e,height:t,radialSegments:n,heightSegments:a,openEnded:r,thetaStart:s,thetaLength:o}}static fromJSON(e){return new co(e.radius,e.height,e.radialSegments,e.heightSegments,e.openEnded,e.thetaStart,e.thetaLength)}}class _h{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Ie("Curve: .getPoint() not implemented.")}getPointAt(e,t){const n=this.getUtoTmapping(e);return this.getPoint(n,t)}getPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPoint(n/e));return t}getSpacedPoints(e=5){const t=[];for(let n=0;n<=e;n++)t.push(this.getPointAt(n/e));return t}getLength(){const e=this.getLengths();return e[e.length-1]}getLengths(e=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===e+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const t=[];let n,a=this.getPoint(0),r=0;t.push(0);for(let s=1;s<=e;s++)n=this.getPoint(s/e),r+=n.distanceTo(a),t.push(r),a=n;return this.cacheArcLengths=t,t}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(e,t=null){const n=this.getLengths();let a=0;const r=n.length;let s;t?s=t:s=e*n[r-1];let o=0,l=r-1,c;for(;o<=l;)if(a=Math.floor(o+(l-o)/2),c=n[a]-s,c<0)o=a+1;else if(c>0)l=a-1;else{l=a;break}if(a=l,n[a]===s)return a/(r-1);const d=n[a],u=n[a+1]-d,p=(s-d)/u;return(a+p)/(r-1)}getTangent(e,t){let a=e-1e-4,r=e+1e-4;a<0&&(a=0),r>1&&(r=1);const s=this.getPoint(a),o=this.getPoint(r),l=t||(s.isVector2?new Ue:new C);return l.copy(o).sub(s).normalize(),l}getTangentAt(e,t){const n=this.getUtoTmapping(e);return this.getTangent(n,t)}computeFrenetFrames(e,t=!1){const n=new C,a=[],r=[],s=[],o=new C,l=new st;for(let p=0;p<=e;p++){const g=p/e;a[p]=this.getTangentAt(g,new C)}r[0]=new C,s[0]=new C;let c=Number.MAX_VALUE;const d=Math.abs(a[0].x),h=Math.abs(a[0].y),u=Math.abs(a[0].z);d<=c&&(c=d,n.set(1,0,0)),h<=c&&(c=h,n.set(0,1,0)),u<=c&&n.set(0,0,1),o.crossVectors(a[0],n).normalize(),r[0].crossVectors(a[0],o),s[0].crossVectors(a[0],r[0]);for(let p=1;p<=e;p++){if(r[p]=r[p-1].clone(),s[p]=s[p-1].clone(),o.crossVectors(a[p-1],a[p]),o.length()>Number.EPSILON){o.normalize();const g=Math.acos(ze(a[p-1].dot(a[p]),-1,1));r[p].applyMatrix4(l.makeRotationAxis(o,g))}s[p].crossVectors(a[p],r[p])}if(t===!0){let p=Math.acos(ze(r[0].dot(r[e]),-1,1));p/=e,a[0].dot(o.crossVectors(r[0],r[e]))>0&&(p=-p);for(let g=1;g<=e;g++)r[g].applyMatrix4(l.makeRotationAxis(a[g],p*g)),s[g].crossVectors(a[g],r[g])}return{tangents:a,normals:r,binormals:s}}clone(){return new this.constructor().copy(this)}copy(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}toJSON(){const e={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return e.arcLengthDivisions=this.arcLengthDivisions,e.type=this.type,e}fromJSON(e){return this.arcLengthDivisions=e.arcLengthDivisions,this}}function ho(){let i=0,e=0,t=0,n=0;function a(r,s,o,l){i=r,e=o,t=-3*r+3*s-2*o-l,n=2*r-2*s+o+l}return{initCatmullRom:function(r,s,o,l,c){a(s,o,c*(o-r),c*(l-s))},initNonuniformCatmullRom:function(r,s,o,l,c,d,h){let u=(s-r)/c-(o-r)/(c+d)+(o-s)/d,p=(o-s)/d-(l-s)/(d+h)+(l-o)/h;u*=d,p*=d,a(s,o,u,p)},calc:function(r){const s=r*r,o=s*r;return i+e*r+t*s+n*o}}}const Xa=new C,Or=new ho,zr=new ho,Gr=new ho;class vh extends _h{constructor(e=[],t=!1,n="centripetal",a=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=e,this.closed=t,this.curveType=n,this.tension=a}getPoint(e,t=new C){const n=t,a=this.points,r=a.length,s=(r-(this.closed?0:1))*e;let o=Math.floor(s),l=s-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let c,d;this.closed||o>0?c=a[(o-1)%r]:(Xa.subVectors(a[0],a[1]).add(a[0]),c=Xa);const h=a[o%r],u=a[(o+1)%r];if(this.closed||o+2<r?d=a[(o+2)%r]:(Xa.subVectors(a[r-1],a[r-2]).add(a[r-1]),d=Xa),this.curveType==="centripetal"||this.curveType==="chordal"){const p=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(h),p),y=Math.pow(h.distanceToSquared(u),p),m=Math.pow(u.distanceToSquared(d),p);y<1e-4&&(y=1),g<1e-4&&(g=y),m<1e-4&&(m=y),Or.initNonuniformCatmullRom(c.x,h.x,u.x,d.x,g,y,m),zr.initNonuniformCatmullRom(c.y,h.y,u.y,d.y,g,y,m),Gr.initNonuniformCatmullRom(c.z,h.z,u.z,d.z,g,y,m)}else this.curveType==="catmullrom"&&(Or.initCatmullRom(c.x,h.x,u.x,d.x,this.tension),zr.initCatmullRom(c.y,h.y,u.y,d.y,this.tension),Gr.initCatmullRom(c.z,h.z,u.z,d.z,this.tension));return n.set(Or.calc(l),zr.calc(l),Gr.calc(l)),n}copy(e){super.copy(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const a=e.points[t];this.points.push(a.clone())}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}toJSON(){const e=super.toJSON();e.points=[];for(let t=0,n=this.points.length;t<n;t++){const a=this.points[t];e.points.push(a.toArray())}return e.closed=this.closed,e.curveType=this.curveType,e.tension=this.tension,e}fromJSON(e){super.fromJSON(e),this.points=[];for(let t=0,n=e.points.length;t<n;t++){const a=e.points[t];this.points.push(new C().fromArray(a))}return this.closed=e.closed,this.curveType=e.curveType,this.tension=e.tension,this}}class dr extends sn{constructor(e=1,t=1,n=1,a=1){super(),this.type="PlaneGeometry",this.parameters={width:e,height:t,widthSegments:n,heightSegments:a};const r=e/2,s=t/2,o=Math.floor(n),l=Math.floor(a),c=o+1,d=l+1,h=e/o,u=t/l,p=[],g=[],y=[],m=[];for(let f=0;f<d;f++){const E=f*u-s;for(let T=0;T<c;T++){const w=T*h-r;g.push(w,-E,0),y.push(0,0,1),m.push(T/o),m.push(1-f/l)}}for(let f=0;f<l;f++)for(let E=0;E<o;E++){const T=E+c*f,w=E+c*(f+1),L=E+1+c*(f+1),S=E+1+c*f;p.push(T,w,S),p.push(w,L,S)}this.setIndex(p),this.setAttribute("position",new Jt(g,3)),this.setAttribute("normal",new Jt(y,3)),this.setAttribute("uv",new Jt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new dr(e.width,e.height,e.widthSegments,e.heightSegments)}}class uo extends sn{constructor(e=1,t=32,n=16,a=0,r=Math.PI*2,s=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:e,widthSegments:t,heightSegments:n,phiStart:a,phiLength:r,thetaStart:s,thetaLength:o},t=Math.max(3,Math.floor(t)),n=Math.max(2,Math.floor(n));const l=Math.min(s+o,Math.PI);let c=0;const d=[],h=new C,u=new C,p=[],g=[],y=[],m=[];for(let f=0;f<=n;f++){const E=[],T=f/n;let w=0;f===0&&s===0?w=.5/t:f===n&&l===Math.PI&&(w=-.5/t);for(let L=0;L<=t;L++){const S=L/t;h.x=-e*Math.cos(a+S*r)*Math.sin(s+T*o),h.y=e*Math.cos(s+T*o),h.z=e*Math.sin(a+S*r)*Math.sin(s+T*o),g.push(h.x,h.y,h.z),u.copy(h).normalize(),y.push(u.x,u.y,u.z),m.push(S+w,1-T),E.push(c++)}d.push(E)}for(let f=0;f<n;f++)for(let E=0;E<t;E++){const T=d[f][E+1],w=d[f][E],L=d[f+1][E],S=d[f+1][E+1];(f!==0||s>0)&&p.push(T,w,S),(f!==n-1||l<Math.PI)&&p.push(w,L,S)}this.setIndex(p),this.setAttribute("position",new Jt(g,3)),this.setAttribute("normal",new Jt(y,3)),this.setAttribute("uv",new Jt(m,2))}copy(e){return super.copy(e),this.parameters=Object.assign({},e.parameters),this}static fromJSON(e){return new uo(e.radius,e.widthSegments,e.heightSegments,e.phiStart,e.phiLength,e.thetaStart,e.thetaLength)}}class wt extends $i{constructor(e){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new Xe(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new Xe(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=ql,this.normalScale=new Ue(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new yn,this.combine=Ys,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(e)}copy(e){return super.copy(e),this.color.copy(e.color),this.map=e.map,this.lightMap=e.lightMap,this.lightMapIntensity=e.lightMapIntensity,this.aoMap=e.aoMap,this.aoMapIntensity=e.aoMapIntensity,this.emissive.copy(e.emissive),this.emissiveMap=e.emissiveMap,this.emissiveIntensity=e.emissiveIntensity,this.bumpMap=e.bumpMap,this.bumpScale=e.bumpScale,this.normalMap=e.normalMap,this.normalMapType=e.normalMapType,this.normalScale.copy(e.normalScale),this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.specularMap=e.specularMap,this.alphaMap=e.alphaMap,this.envMap=e.envMap,this.envMapRotation.copy(e.envMapRotation),this.combine=e.combine,this.reflectivity=e.reflectivity,this.refractionRatio=e.refractionRatio,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this.wireframeLinecap=e.wireframeLinecap,this.wireframeLinejoin=e.wireframeLinejoin,this.flatShading=e.flatShading,this.fog=e.fog,this}}class yh extends $i{constructor(e){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=fd,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(e)}copy(e){return super.copy(e),this.depthPacking=e.depthPacking,this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this.wireframe=e.wireframe,this.wireframeLinewidth=e.wireframeLinewidth,this}}class Mh extends $i{constructor(e){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(e)}copy(e){return super.copy(e),this.map=e.map,this.alphaMap=e.alphaMap,this.displacementMap=e.displacementMap,this.displacementScale=e.displacementScale,this.displacementBias=e.displacementBias,this}}class fo extends Et{constructor(e,t=1){super(),this.isLight=!0,this.type="Light",this.color=new Xe(e),this.intensity=t}dispose(){}copy(e,t){return super.copy(e,t),this.color.copy(e.color),this.intensity=e.intensity,this}toJSON(e){const t=super.toJSON(e);return t.object.color=this.color.getHex(),t.object.intensity=this.intensity,this.groundColor!==void 0&&(t.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(t.object.distance=this.distance),this.angle!==void 0&&(t.object.angle=this.angle),this.decay!==void 0&&(t.object.decay=this.decay),this.penumbra!==void 0&&(t.object.penumbra=this.penumbra),this.shadow!==void 0&&(t.object.shadow=this.shadow.toJSON()),this.target!==void 0&&(t.object.target=this.target.uuid),t}}class bh extends fo{constructor(e,t,n){super(e,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.groundColor=new Xe(t)}copy(e,t){return super.copy(e,t),this.groundColor.copy(e.groundColor),this}}const Vr=new st,nl=new C,il=new C;class Sh{constructor(e){this.camera=e,this.intensity=1,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new Ue(512,512),this.mapType=vn,this.map=null,this.mapPass=null,this.matrix=new st,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new oo,this._frameExtents=new Ue(1,1),this._viewportCount=1,this._viewports=[new pt(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(e){const t=this.camera,n=this.matrix;nl.setFromMatrixPosition(e.matrixWorld),t.position.copy(nl),il.setFromMatrixPosition(e.target.matrixWorld),t.lookAt(il),t.updateMatrixWorld(),Vr.multiplyMatrices(t.projectionMatrix,t.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Vr,t.coordinateSystem,t.reversedDepth),t.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Vr)}getViewport(e){return this._viewports[e]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(e){return this.camera=e.camera.clone(),this.intensity=e.intensity,this.bias=e.bias,this.radius=e.radius,this.autoUpdate=e.autoUpdate,this.needsUpdate=e.needsUpdate,this.normalBias=e.normalBias,this.blurSamples=e.blurSamples,this.mapSize.copy(e.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){const e={};return this.intensity!==1&&(e.intensity=this.intensity),this.bias!==0&&(e.bias=this.bias),this.normalBias!==0&&(e.normalBias=this.normalBias),this.radius!==1&&(e.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(e.mapSize=this.mapSize.toArray()),e.camera=this.camera.toJSON(!1).object,delete e.camera.matrix,e}}class lc extends nc{constructor(e=-1,t=1,n=1,a=-1,r=.1,s=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=e,this.right=t,this.top=n,this.bottom=a,this.near=r,this.far=s,this.updateProjectionMatrix()}copy(e,t){return super.copy(e,t),this.left=e.left,this.right=e.right,this.top=e.top,this.bottom=e.bottom,this.near=e.near,this.far=e.far,this.zoom=e.zoom,this.view=e.view===null?null:Object.assign({},e.view),this}setViewOffset(e,t,n,a,r,s){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=e,this.view.fullHeight=t,this.view.offsetX=n,this.view.offsetY=a,this.view.width=r,this.view.height=s,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const e=(this.right-this.left)/(2*this.zoom),t=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,a=(this.top+this.bottom)/2;let r=n-e,s=n+e,o=a+t,l=a-t;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=c*this.view.offsetX,s=r+c*this.view.width,o-=d*this.view.offsetY,l=o-d*this.view.height}this.projectionMatrix.makeOrthographic(r,s,o,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(e){const t=super.toJSON(e);return t.object.zoom=this.zoom,t.object.left=this.left,t.object.right=this.right,t.object.top=this.top,t.object.bottom=this.bottom,t.object.near=this.near,t.object.far=this.far,this.view!==null&&(t.object.view=Object.assign({},this.view)),t}}class Th extends Sh{constructor(){super(new lc(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class Eh extends fo{constructor(e,t){super(e,t),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Et.DEFAULT_UP),this.updateMatrix(),this.target=new Et,this.shadow=new Th}dispose(){this.shadow.dispose()}copy(e){return super.copy(e),this.target=e.target.clone(),this.shadow=e.shadow.clone(),this}}class wh extends fo{constructor(e,t){super(e,t),this.isAmbientLight=!0,this.type="AmbientLight"}}class Ah extends nn{constructor(e=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=e}}class al{constructor(e=1,t=0,n=0){this.radius=e,this.phi=t,this.theta=n}set(e,t,n){return this.radius=e,this.phi=t,this.theta=n,this}copy(e){return this.radius=e.radius,this.phi=e.phi,this.theta=e.theta,this}makeSafe(){return this.phi=ze(this.phi,1e-6,Math.PI-1e-6),this}setFromVector3(e){return this.setFromCartesianCoords(e.x,e.y,e.z)}setFromCartesianCoords(e,t,n){return this.radius=Math.sqrt(e*e+t*t+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(e,n),this.phi=Math.acos(ze(t/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}}class Ch extends pi{constructor(e,t=null){super(),this.object=e,this.domElement=t,this.enabled=!0,this.state=-1,this.keys={},this.mouseButtons={LEFT:null,MIDDLE:null,RIGHT:null},this.touches={ONE:null,TWO:null}}connect(e){if(e===void 0){Ie("Controls: connect() now requires an element.");return}this.domElement!==null&&this.disconnect(),this.domElement=e}disconnect(){}dispose(){}update(){}}function rl(i,e,t,n){const a=Rh(n);switch(t){case Xl:return i*e;case Js:return i*e/a.components*a.byteLength;case Qs:return i*e/a.components*a.byteLength;case eo:return i*e*2/a.components*a.byteLength;case to:return i*e*2/a.components*a.byteLength;case Kl:return i*e*3/a.components*a.byteLength;case fn:return i*e*4/a.components*a.byteLength;case no:return i*e*4/a.components*a.byteLength;case ja:case $a:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case Za:case Ja:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case ms:case gs:return Math.max(i,16)*Math.max(e,8)/4;case ps:case xs:return Math.max(i,8)*Math.max(e,8)/2;case _s:case vs:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*8;case ys:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case Ms:return Math.floor((i+3)/4)*Math.floor((e+3)/4)*16;case bs:return Math.floor((i+4)/5)*Math.floor((e+3)/4)*16;case Ss:return Math.floor((i+4)/5)*Math.floor((e+4)/5)*16;case Ts:return Math.floor((i+5)/6)*Math.floor((e+4)/5)*16;case Es:return Math.floor((i+5)/6)*Math.floor((e+5)/6)*16;case ws:return Math.floor((i+7)/8)*Math.floor((e+4)/5)*16;case As:return Math.floor((i+7)/8)*Math.floor((e+5)/6)*16;case Cs:return Math.floor((i+7)/8)*Math.floor((e+7)/8)*16;case Rs:return Math.floor((i+9)/10)*Math.floor((e+4)/5)*16;case Ps:return Math.floor((i+9)/10)*Math.floor((e+5)/6)*16;case Ls:return Math.floor((i+9)/10)*Math.floor((e+7)/8)*16;case Ds:return Math.floor((i+9)/10)*Math.floor((e+9)/10)*16;case Is:return Math.floor((i+11)/12)*Math.floor((e+9)/10)*16;case Us:return Math.floor((i+11)/12)*Math.floor((e+11)/12)*16;case Ns:case Fs:case Bs:return Math.ceil(i/4)*Math.ceil(e/4)*16;case ks:case Os:return Math.ceil(i/4)*Math.ceil(e/4)*8;case zs:case Gs:return Math.ceil(i/4)*Math.ceil(e/4)*16}throw new Error(`Unable to determine texture byte length for ${t} format.`)}function Rh(i){switch(i){case vn:case Gl:return{byteLength:1,components:1};case fa:case Vl:case qi:return{byteLength:2,components:1};case $s:case Zs:return{byteLength:2,components:4};case ui:case js:case gn:return{byteLength:4,components:1};case Hl:case Wl:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${i}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:qs}}));typeof window<"u"&&(window.__THREE__?Ie("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=qs);function cc(){let i=null,e=!1,t=null,n=null;function a(r,s){t(r,s),n=i.requestAnimationFrame(a)}return{start:function(){e!==!0&&t!==null&&(n=i.requestAnimationFrame(a),e=!0)},stop:function(){i.cancelAnimationFrame(n),e=!1},setAnimationLoop:function(r){t=r},setContext:function(r){i=r}}}function Ph(i){const e=new WeakMap;function t(o,l){const c=o.array,d=o.usage,h=c.byteLength,u=i.createBuffer();i.bindBuffer(l,u),i.bufferData(l,c,d),o.onUploadCallback();let p;if(c instanceof Float32Array)p=i.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)p=i.HALF_FLOAT;else if(c instanceof Uint16Array)o.isFloat16BufferAttribute?p=i.HALF_FLOAT:p=i.UNSIGNED_SHORT;else if(c instanceof Int16Array)p=i.SHORT;else if(c instanceof Uint32Array)p=i.UNSIGNED_INT;else if(c instanceof Int32Array)p=i.INT;else if(c instanceof Int8Array)p=i.BYTE;else if(c instanceof Uint8Array)p=i.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)p=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:u,type:p,bytesPerElement:c.BYTES_PER_ELEMENT,version:o.version,size:h}}function n(o,l,c){const d=l.array,h=l.updateRanges;if(i.bindBuffer(c,o),h.length===0)i.bufferSubData(c,0,d);else{h.sort((p,g)=>p.start-g.start);let u=0;for(let p=1;p<h.length;p++){const g=h[u],y=h[p];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++u,h[u]=y)}h.length=u+1;for(let p=0,g=h.length;p<g;p++){const y=h[p];i.bufferSubData(c,y.start*d.BYTES_PER_ELEMENT,d,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function a(o){return o.isInterleavedBufferAttribute&&(o=o.data),e.get(o)}function r(o){o.isInterleavedBufferAttribute&&(o=o.data);const l=e.get(o);l&&(i.deleteBuffer(l.buffer),e.delete(o))}function s(o,l){if(o.isInterleavedBufferAttribute&&(o=o.data),o.isGLBufferAttribute){const d=e.get(o);(!d||d.version<o.version)&&e.set(o,{buffer:o.buffer,type:o.type,bytesPerElement:o.elementSize,version:o.version});return}const c=e.get(o);if(c===void 0)e.set(o,t(o,l));else if(c.version<o.version){if(c.size!==o.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,o,l),c.version=o.version}}return{get:a,remove:r,update:s}}var Lh=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,Dh=`#ifdef USE_ALPHAHASH
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
#endif`,Ih=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Uh=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,Nh=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,Fh=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Bh=`#ifdef USE_AOMAP
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
#endif`,kh=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,Oh=`#ifdef USE_BATCHING
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
#endif`,zh=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,Gh=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,Vh=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,Hh=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,Wh=`#ifdef USE_IRIDESCENCE
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
#endif`,Xh=`#ifdef USE_BUMPMAP
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
#endif`,Kh=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,qh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,Yh=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,jh=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,$h=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,Zh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,Jh=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec3 vColor;
#endif`,Qh=`#if defined( USE_COLOR_ALPHA )
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
#endif`,eu=`#define PI 3.141592653589793
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
} // validated`,tu=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,nu=`vec3 transformedNormal = objectNormal;
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
#endif`,iu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,au=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,ru=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,su=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,ou="gl_FragColor = linearToOutputTexel( gl_FragColor );",lu=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,cu=`#ifdef USE_ENVMAP
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
#endif`,du=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,hu=`#ifdef USE_ENVMAP
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
#endif`,uu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,fu=`#ifdef USE_ENVMAP
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
#endif`,pu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,mu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,xu=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,gu=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,_u=`#ifdef USE_GRADIENTMAP
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
}`,vu=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,yu=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Mu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,bu=`uniform bool receiveShadow;
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
#endif`,Su=`#ifdef USE_ENVMAP
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
#endif`,Tu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,Eu=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,wu=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,Au=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,Cu=`PhysicalMaterial material;
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
#endif`,Ru=`uniform sampler2D dfgLUT;
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
}`,Pu=`
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
#endif`,Lu=`#if defined( RE_IndirectDiffuse )
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
#endif`,Du=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,Iu=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,Uu=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Nu=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,Fu=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,Bu=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ku=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,Ou=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,zu=`#if defined( USE_POINTS_UV )
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
#endif`,Gu=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Vu=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Hu=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Wu=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Xu=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Ku=`#ifdef USE_MORPHTARGETS
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
#endif`,qu=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Yu=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,ju=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,$u=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Zu=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Ju=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Qu=`#ifdef USE_NORMALMAP
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
#endif`,ef=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,tf=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,nf=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,af=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,rf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,sf=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,of=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,lf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,cf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,df=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,hf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,uf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,ff=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,pf=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,mf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,xf=`float getShadowMask() {
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
}`,gf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,_f=`#ifdef USE_SKINNING
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
#endif`,vf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,yf=`#ifdef USE_SKINNING
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
#endif`,Mf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,bf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Sf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Tf=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Ef=`#ifdef USE_TRANSMISSION
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
#endif`,wf=`#ifdef USE_TRANSMISSION
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
#endif`,Af=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Cf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Rf=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Pf=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const Lf=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Df=`uniform sampler2D t2D;
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
}`,If=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Uf=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Nf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Ff=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Bf=`#include <common>
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
}`,kf=`#if DEPTH_PACKING == 3200
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
}`,Of=`#define DISTANCE
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
}`,zf=`#define DISTANCE
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
}`,Gf=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,Vf=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Hf=`uniform float scale;
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
}`,Wf=`uniform vec3 diffuse;
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
}`,Xf=`#include <common>
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
}`,Kf=`uniform vec3 diffuse;
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
}`,qf=`#define LAMBERT
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
}`,Yf=`#define LAMBERT
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
}`,jf=`#define MATCAP
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
}`,$f=`#define MATCAP
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
}`,Zf=`#define NORMAL
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
}`,Jf=`#define NORMAL
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
}`,Qf=`#define PHONG
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
}`,ep=`#define PHONG
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
}`,tp=`#define STANDARD
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
}`,np=`#define STANDARD
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
}`,ip=`#define TOON
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
}`,ap=`#define TOON
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
}`,rp=`uniform float size;
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
}`,sp=`uniform vec3 diffuse;
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
}`,op=`#include <common>
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
}`,lp=`uniform vec3 color;
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
}`,cp=`uniform float rotation;
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
}`,dp=`uniform vec3 diffuse;
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
}`,Oe={alphahash_fragment:Lh,alphahash_pars_fragment:Dh,alphamap_fragment:Ih,alphamap_pars_fragment:Uh,alphatest_fragment:Nh,alphatest_pars_fragment:Fh,aomap_fragment:Bh,aomap_pars_fragment:kh,batching_pars_vertex:Oh,batching_vertex:zh,begin_vertex:Gh,beginnormal_vertex:Vh,bsdfs:Hh,iridescence_fragment:Wh,bumpmap_pars_fragment:Xh,clipping_planes_fragment:Kh,clipping_planes_pars_fragment:qh,clipping_planes_pars_vertex:Yh,clipping_planes_vertex:jh,color_fragment:$h,color_pars_fragment:Zh,color_pars_vertex:Jh,color_vertex:Qh,common:eu,cube_uv_reflection_fragment:tu,defaultnormal_vertex:nu,displacementmap_pars_vertex:iu,displacementmap_vertex:au,emissivemap_fragment:ru,emissivemap_pars_fragment:su,colorspace_fragment:ou,colorspace_pars_fragment:lu,envmap_fragment:cu,envmap_common_pars_fragment:du,envmap_pars_fragment:hu,envmap_pars_vertex:uu,envmap_physical_pars_fragment:Su,envmap_vertex:fu,fog_vertex:pu,fog_pars_vertex:mu,fog_fragment:xu,fog_pars_fragment:gu,gradientmap_pars_fragment:_u,lightmap_pars_fragment:vu,lights_lambert_fragment:yu,lights_lambert_pars_fragment:Mu,lights_pars_begin:bu,lights_toon_fragment:Tu,lights_toon_pars_fragment:Eu,lights_phong_fragment:wu,lights_phong_pars_fragment:Au,lights_physical_fragment:Cu,lights_physical_pars_fragment:Ru,lights_fragment_begin:Pu,lights_fragment_maps:Lu,lights_fragment_end:Du,logdepthbuf_fragment:Iu,logdepthbuf_pars_fragment:Uu,logdepthbuf_pars_vertex:Nu,logdepthbuf_vertex:Fu,map_fragment:Bu,map_pars_fragment:ku,map_particle_fragment:Ou,map_particle_pars_fragment:zu,metalnessmap_fragment:Gu,metalnessmap_pars_fragment:Vu,morphinstance_vertex:Hu,morphcolor_vertex:Wu,morphnormal_vertex:Xu,morphtarget_pars_vertex:Ku,morphtarget_vertex:qu,normal_fragment_begin:Yu,normal_fragment_maps:ju,normal_pars_fragment:$u,normal_pars_vertex:Zu,normal_vertex:Ju,normalmap_pars_fragment:Qu,clearcoat_normal_fragment_begin:ef,clearcoat_normal_fragment_maps:tf,clearcoat_pars_fragment:nf,iridescence_pars_fragment:af,opaque_fragment:rf,packing:sf,premultiplied_alpha_fragment:of,project_vertex:lf,dithering_fragment:cf,dithering_pars_fragment:df,roughnessmap_fragment:hf,roughnessmap_pars_fragment:uf,shadowmap_pars_fragment:ff,shadowmap_pars_vertex:pf,shadowmap_vertex:mf,shadowmask_pars_fragment:xf,skinbase_vertex:gf,skinning_pars_vertex:_f,skinning_vertex:vf,skinnormal_vertex:yf,specularmap_fragment:Mf,specularmap_pars_fragment:bf,tonemapping_fragment:Sf,tonemapping_pars_fragment:Tf,transmission_fragment:Ef,transmission_pars_fragment:wf,uv_pars_fragment:Af,uv_pars_vertex:Cf,uv_vertex:Rf,worldpos_vertex:Pf,background_vert:Lf,background_frag:Df,backgroundCube_vert:If,backgroundCube_frag:Uf,cube_vert:Nf,cube_frag:Ff,depth_vert:Bf,depth_frag:kf,distanceRGBA_vert:Of,distanceRGBA_frag:zf,equirect_vert:Gf,equirect_frag:Vf,linedashed_vert:Hf,linedashed_frag:Wf,meshbasic_vert:Xf,meshbasic_frag:Kf,meshlambert_vert:qf,meshlambert_frag:Yf,meshmatcap_vert:jf,meshmatcap_frag:$f,meshnormal_vert:Zf,meshnormal_frag:Jf,meshphong_vert:Qf,meshphong_frag:ep,meshphysical_vert:tp,meshphysical_frag:np,meshtoon_vert:ip,meshtoon_frag:ap,points_vert:rp,points_frag:sp,shadow_vert:op,shadow_frag:lp,sprite_vert:cp,sprite_frag:dp},ce={common:{diffuse:{value:new Xe(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Fe}},envmap:{envMap:{value:null},envMapRotation:{value:new Fe},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Fe}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Fe}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Fe},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Fe},normalScale:{value:new Ue(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Fe},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Fe}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Fe}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Fe}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new Xe(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new Xe(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0},uvTransform:{value:new Fe}},sprite:{diffuse:{value:new Xe(16777215)},opacity:{value:1},center:{value:new Ue(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Fe},alphaMap:{value:null},alphaMapTransform:{value:new Fe},alphaTest:{value:0}}},xn={basic:{uniforms:It([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.fog]),vertexShader:Oe.meshbasic_vert,fragmentShader:Oe.meshbasic_frag},lambert:{uniforms:It([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new Xe(0)}}]),vertexShader:Oe.meshlambert_vert,fragmentShader:Oe.meshlambert_frag},phong:{uniforms:It([ce.common,ce.specularmap,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,ce.lights,{emissive:{value:new Xe(0)},specular:{value:new Xe(1118481)},shininess:{value:30}}]),vertexShader:Oe.meshphong_vert,fragmentShader:Oe.meshphong_frag},standard:{uniforms:It([ce.common,ce.envmap,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.roughnessmap,ce.metalnessmap,ce.fog,ce.lights,{emissive:{value:new Xe(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag},toon:{uniforms:It([ce.common,ce.aomap,ce.lightmap,ce.emissivemap,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.gradientmap,ce.fog,ce.lights,{emissive:{value:new Xe(0)}}]),vertexShader:Oe.meshtoon_vert,fragmentShader:Oe.meshtoon_frag},matcap:{uniforms:It([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,ce.fog,{matcap:{value:null}}]),vertexShader:Oe.meshmatcap_vert,fragmentShader:Oe.meshmatcap_frag},points:{uniforms:It([ce.points,ce.fog]),vertexShader:Oe.points_vert,fragmentShader:Oe.points_frag},dashed:{uniforms:It([ce.common,ce.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Oe.linedashed_vert,fragmentShader:Oe.linedashed_frag},depth:{uniforms:It([ce.common,ce.displacementmap]),vertexShader:Oe.depth_vert,fragmentShader:Oe.depth_frag},normal:{uniforms:It([ce.common,ce.bumpmap,ce.normalmap,ce.displacementmap,{opacity:{value:1}}]),vertexShader:Oe.meshnormal_vert,fragmentShader:Oe.meshnormal_frag},sprite:{uniforms:It([ce.sprite,ce.fog]),vertexShader:Oe.sprite_vert,fragmentShader:Oe.sprite_frag},background:{uniforms:{uvTransform:{value:new Fe},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Oe.background_vert,fragmentShader:Oe.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Fe}},vertexShader:Oe.backgroundCube_vert,fragmentShader:Oe.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Oe.cube_vert,fragmentShader:Oe.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Oe.equirect_vert,fragmentShader:Oe.equirect_frag},distanceRGBA:{uniforms:It([ce.common,ce.displacementmap,{referencePosition:{value:new C},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Oe.distanceRGBA_vert,fragmentShader:Oe.distanceRGBA_frag},shadow:{uniforms:It([ce.lights,ce.fog,{color:{value:new Xe(0)},opacity:{value:1}}]),vertexShader:Oe.shadow_vert,fragmentShader:Oe.shadow_frag}};xn.physical={uniforms:It([xn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Fe},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Fe},clearcoatNormalScale:{value:new Ue(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Fe},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Fe},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Fe},sheen:{value:0},sheenColor:{value:new Xe(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Fe},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Fe},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Fe},transmissionSamplerSize:{value:new Ue},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Fe},attenuationDistance:{value:0},attenuationColor:{value:new Xe(0)},specularColor:{value:new Xe(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Fe},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Fe},anisotropyVector:{value:new Ue},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Fe}}]),vertexShader:Oe.meshphysical_vert,fragmentShader:Oe.meshphysical_frag};const Ka={r:0,b:0,g:0},si=new yn,hp=new st;function up(i,e,t,n,a,r,s){const o=new Xe(0);let l=r===!0?0:1,c,d,h=null,u=0,p=null;function g(T){let w=T.isScene===!0?T.background:null;return w&&w.isTexture&&(w=(T.backgroundBlurriness>0?t:e).get(w)),w}function y(T){let w=!1;const L=g(T);L===null?f(o,l):L&&L.isColor&&(f(L,1),w=!0);const S=i.xr.getEnvironmentBlendMode();S==="additive"?n.buffers.color.setClear(0,0,0,1,s):S==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,s),(i.autoClear||w)&&(n.buffers.depth.setTest(!0),n.buffers.depth.setMask(!0),n.buffers.color.setMask(!0),i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil))}function m(T,w){const L=g(w);L&&(L.isCubeTexture||L.mapping===lr)?(d===void 0&&(d=new Tt(new Bn(1,1,1),new Fn({name:"BackgroundCubeMaterial",uniforms:Wi(xn.backgroundCube.uniforms),vertexShader:xn.backgroundCube.vertexShader,fragmentShader:xn.backgroundCube.fragmentShader,side:Ht,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),d.geometry.deleteAttribute("normal"),d.geometry.deleteAttribute("uv"),d.onBeforeRender=function(S,R,B){this.matrixWorld.copyPosition(B.matrixWorld)},Object.defineProperty(d.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),a.update(d)),si.copy(w.backgroundRotation),si.x*=-1,si.y*=-1,si.z*=-1,L.isCubeTexture&&L.isRenderTargetTexture===!1&&(si.y*=-1,si.z*=-1),d.material.uniforms.envMap.value=L,d.material.uniforms.flipEnvMap.value=L.isCubeTexture&&L.isRenderTargetTexture===!1?-1:1,d.material.uniforms.backgroundBlurriness.value=w.backgroundBlurriness,d.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,d.material.uniforms.backgroundRotation.value.setFromMatrix4(hp.makeRotationFromEuler(si)),d.material.toneMapped=je.getTransfer(L.colorSpace)!==it,(h!==L||u!==L.version||p!==i.toneMapping)&&(d.material.needsUpdate=!0,h=L,u=L.version,p=i.toneMapping),d.layers.enableAll(),T.unshift(d,d.geometry,d.material,0,0,null)):L&&L.isTexture&&(c===void 0&&(c=new Tt(new dr(2,2),new Fn({name:"BackgroundMaterial",uniforms:Wi(xn.background.uniforms),vertexShader:xn.background.vertexShader,fragmentShader:xn.background.fragmentShader,side:Zn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),Object.defineProperty(c.material,"map",{get:function(){return this.uniforms.t2D.value}}),a.update(c)),c.material.uniforms.t2D.value=L,c.material.uniforms.backgroundIntensity.value=w.backgroundIntensity,c.material.toneMapped=je.getTransfer(L.colorSpace)!==it,L.matrixAutoUpdate===!0&&L.updateMatrix(),c.material.uniforms.uvTransform.value.copy(L.matrix),(h!==L||u!==L.version||p!==i.toneMapping)&&(c.material.needsUpdate=!0,h=L,u=L.version,p=i.toneMapping),c.layers.enableAll(),T.unshift(c,c.geometry,c.material,0,0,null))}function f(T,w){T.getRGB(Ka,tc(i)),n.buffers.color.setClear(Ka.r,Ka.g,Ka.b,w,s)}function E(){d!==void 0&&(d.geometry.dispose(),d.material.dispose(),d=void 0),c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0)}return{getClearColor:function(){return o},setClearColor:function(T,w=1){o.set(T),l=w,f(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(T){l=T,f(o,l)},render:y,addToRenderList:m,dispose:E}}function fp(i,e){const t=i.getParameter(i.MAX_VERTEX_ATTRIBS),n={},a=u(null);let r=a,s=!1;function o(_,D,F,z,K){let X=!1;const Y=h(z,F,D);r!==Y&&(r=Y,c(r.object)),X=p(_,z,F,K),X&&g(_,z,F,K),K!==null&&e.update(K,i.ELEMENT_ARRAY_BUFFER),(X||s)&&(s=!1,w(_,D,F,z),K!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(K).buffer))}function l(){return i.createVertexArray()}function c(_){return i.bindVertexArray(_)}function d(_){return i.deleteVertexArray(_)}function h(_,D,F){const z=F.wireframe===!0;let K=n[_.id];K===void 0&&(K={},n[_.id]=K);let X=K[D.id];X===void 0&&(X={},K[D.id]=X);let Y=X[z];return Y===void 0&&(Y=u(l()),X[z]=Y),Y}function u(_){const D=[],F=[],z=[];for(let K=0;K<t;K++)D[K]=0,F[K]=0,z[K]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:D,enabledAttributes:F,attributeDivisors:z,object:_,attributes:{},index:null}}function p(_,D,F,z){const K=r.attributes,X=D.attributes;let Y=0;const ee=F.getAttributes();for(const W in ee)if(ee[W].location>=0){const re=K[W];let be=X[W];if(be===void 0&&(W==="instanceMatrix"&&_.instanceMatrix&&(be=_.instanceMatrix),W==="instanceColor"&&_.instanceColor&&(be=_.instanceColor)),re===void 0||re.attribute!==be||be&&re.data!==be.data)return!0;Y++}return r.attributesNum!==Y||r.index!==z}function g(_,D,F,z){const K={},X=D.attributes;let Y=0;const ee=F.getAttributes();for(const W in ee)if(ee[W].location>=0){let re=X[W];re===void 0&&(W==="instanceMatrix"&&_.instanceMatrix&&(re=_.instanceMatrix),W==="instanceColor"&&_.instanceColor&&(re=_.instanceColor));const be={};be.attribute=re,re&&re.data&&(be.data=re.data),K[W]=be,Y++}r.attributes=K,r.attributesNum=Y,r.index=z}function y(){const _=r.newAttributes;for(let D=0,F=_.length;D<F;D++)_[D]=0}function m(_){f(_,0)}function f(_,D){const F=r.newAttributes,z=r.enabledAttributes,K=r.attributeDivisors;F[_]=1,z[_]===0&&(i.enableVertexAttribArray(_),z[_]=1),K[_]!==D&&(i.vertexAttribDivisor(_,D),K[_]=D)}function E(){const _=r.newAttributes,D=r.enabledAttributes;for(let F=0,z=D.length;F<z;F++)D[F]!==_[F]&&(i.disableVertexAttribArray(F),D[F]=0)}function T(_,D,F,z,K,X,Y){Y===!0?i.vertexAttribIPointer(_,D,F,K,X):i.vertexAttribPointer(_,D,F,z,K,X)}function w(_,D,F,z){y();const K=z.attributes,X=F.getAttributes(),Y=D.defaultAttributeValues;for(const ee in X){const W=X[ee];if(W.location>=0){let ie=K[ee];if(ie===void 0&&(ee==="instanceMatrix"&&_.instanceMatrix&&(ie=_.instanceMatrix),ee==="instanceColor"&&_.instanceColor&&(ie=_.instanceColor)),ie!==void 0){const re=ie.normalized,be=ie.itemSize,He=e.get(ie);if(He===void 0)continue;const $e=He.buffer,Qe=He.type,Ze=He.bytesPerElement,j=Qe===i.INT||Qe===i.UNSIGNED_INT||ie.gpuType===js;if(ie.isInterleavedBufferAttribute){const $=ie.data,fe=$.stride,De=ie.offset;if($.isInstancedInterleavedBuffer){for(let Me=0;Me<W.locationSize;Me++)f(W.location+Me,$.meshPerAttribute);_.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=$.meshPerAttribute*$.count)}else for(let Me=0;Me<W.locationSize;Me++)m(W.location+Me);i.bindBuffer(i.ARRAY_BUFFER,$e);for(let Me=0;Me<W.locationSize;Me++)T(W.location+Me,be/W.locationSize,Qe,re,fe*Ze,(De+be/W.locationSize*Me)*Ze,j)}else{if(ie.isInstancedBufferAttribute){for(let $=0;$<W.locationSize;$++)f(W.location+$,ie.meshPerAttribute);_.isInstancedMesh!==!0&&z._maxInstanceCount===void 0&&(z._maxInstanceCount=ie.meshPerAttribute*ie.count)}else for(let $=0;$<W.locationSize;$++)m(W.location+$);i.bindBuffer(i.ARRAY_BUFFER,$e);for(let $=0;$<W.locationSize;$++)T(W.location+$,be/W.locationSize,Qe,re,be*Ze,be/W.locationSize*$*Ze,j)}}else if(Y!==void 0){const re=Y[ee];if(re!==void 0)switch(re.length){case 2:i.vertexAttrib2fv(W.location,re);break;case 3:i.vertexAttrib3fv(W.location,re);break;case 4:i.vertexAttrib4fv(W.location,re);break;default:i.vertexAttrib1fv(W.location,re)}}}}E()}function L(){B();for(const _ in n){const D=n[_];for(const F in D){const z=D[F];for(const K in z)d(z[K].object),delete z[K];delete D[F]}delete n[_]}}function S(_){if(n[_.id]===void 0)return;const D=n[_.id];for(const F in D){const z=D[F];for(const K in z)d(z[K].object),delete z[K];delete D[F]}delete n[_.id]}function R(_){for(const D in n){const F=n[D];if(F[_.id]===void 0)continue;const z=F[_.id];for(const K in z)d(z[K].object),delete z[K];delete F[_.id]}}function B(){M(),s=!0,r!==a&&(r=a,c(r.object))}function M(){a.geometry=null,a.program=null,a.wireframe=!1}return{setup:o,reset:B,resetDefaultState:M,dispose:L,releaseStatesOfGeometry:S,releaseStatesOfProgram:R,initAttributes:y,enableAttribute:m,disableUnusedAttributes:E}}function pp(i,e,t){let n;function a(c){n=c}function r(c,d){i.drawArrays(n,c,d),t.update(d,n,1)}function s(c,d,h){h!==0&&(i.drawArraysInstanced(n,c,d,h),t.update(d,n,h))}function o(c,d,h){if(h===0)return;e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,c,0,d,0,h);let p=0;for(let g=0;g<h;g++)p+=d[g];t.update(p,n,1)}function l(c,d,h,u){if(h===0)return;const p=e.get("WEBGL_multi_draw");if(p===null)for(let g=0;g<c.length;g++)s(c[g],d[g],u[g]);else{p.multiDrawArraysInstancedWEBGL(n,c,0,d,0,u,0,h);let g=0;for(let y=0;y<h;y++)g+=d[y]*u[y];t.update(g,n,1)}}this.setMode=a,this.render=r,this.renderInstances=s,this.renderMultiDraw=o,this.renderMultiDrawInstances=l}function mp(i,e,t,n){let a;function r(){if(a!==void 0)return a;if(e.has("EXT_texture_filter_anisotropic")===!0){const R=e.get("EXT_texture_filter_anisotropic");a=i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else a=0;return a}function s(R){return!(R!==fn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT))}function o(R){const B=R===qi&&(e.has("EXT_color_buffer_half_float")||e.has("EXT_color_buffer_float"));return!(R!==vn&&n.convert(R)!==i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==gn&&!B)}function l(R){if(R==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=t.precision!==void 0?t.precision:"highp";const d=l(c);d!==c&&(Ie("WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const h=t.logarithmicDepthBuffer===!0,u=t.reversedDepthBuffer===!0&&e.has("EXT_clip_control"),p=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=i.getParameter(i.MAX_TEXTURE_SIZE),m=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),f=i.getParameter(i.MAX_VERTEX_ATTRIBS),E=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),T=i.getParameter(i.MAX_VARYING_VECTORS),w=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),L=g>0,S=i.getParameter(i.MAX_SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:r,getMaxPrecision:l,textureFormatReadable:s,textureTypeReadable:o,precision:c,logarithmicDepthBuffer:h,reversedDepthBuffer:u,maxTextures:p,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:m,maxAttributes:f,maxVertexUniforms:E,maxVaryings:T,maxFragmentUniforms:w,vertexTextures:L,maxSamples:S}}function xp(i){const e=this;let t=null,n=0,a=!1,r=!1;const s=new Wn,o=new Fe,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(h,u){const p=h.length!==0||u||n!==0||a;return a=u,n=h.length,p},this.beginShadows=function(){r=!0,d(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(h,u){t=d(h,u,0)},this.setState=function(h,u,p){const g=h.clippingPlanes,y=h.clipIntersection,m=h.clipShadows,f=i.get(h);if(!a||g===null||g.length===0||r&&!m)r?d(null):c();else{const E=r?0:n,T=E*4;let w=f.clippingState||null;l.value=w,w=d(g,u,T,p);for(let L=0;L!==T;++L)w[L]=t[L];f.clippingState=w,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=E}};function c(){l.value!==t&&(l.value=t,l.needsUpdate=n>0),e.numPlanes=n,e.numIntersection=0}function d(h,u,p,g){const y=h!==null?h.length:0;let m=null;if(y!==0){if(m=l.value,g!==!0||m===null){const f=p+y*4,E=u.matrixWorldInverse;o.getNormalMatrix(E),(m===null||m.length<f)&&(m=new Float32Array(f));for(let T=0,w=p;T!==y;++T,w+=4)s.copy(h[T]).applyMatrix4(E,o),s.normal.toArray(m,w),m[w+3]=s.constant}l.value=m,l.needsUpdate=!0}return e.numPlanes=y,e.numIntersection=0,m}}function gp(i){let e=new WeakMap;function t(s,o){return o===ds?s.mapping=Gi:o===hs&&(s.mapping=Vi),s}function n(s){if(s&&s.isTexture){const o=s.mapping;if(o===ds||o===hs)if(e.has(s)){const l=e.get(s).texture;return t(l,s.mapping)}else{const l=s.image;if(l&&l.height>0){const c=new ch(l.height);return c.fromEquirectangularTexture(i,s),e.set(s,c),s.addEventListener("dispose",a),t(c.texture,s.mapping)}else return null}}return s}function a(s){const o=s.target;o.removeEventListener("dispose",a);const l=e.get(o);l!==void 0&&(e.delete(o),l.dispose())}function r(){e=new WeakMap}return{get:n,dispose:r}}const Yn=4,sl=[.125,.215,.35,.446,.526,.582],ci=20,_p=256,sa=new lc,ol=new Xe;let Hr=null,Wr=0,Xr=0,Kr=!1;const vp=new C;class ll{constructor(e){this._renderer=e,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(e,t=0,n=.1,a=100,r={}){const{size:s=256,position:o=vp}=r;Hr=this._renderer.getRenderTarget(),Wr=this._renderer.getActiveCubeFace(),Xr=this._renderer.getActiveMipmapLevel(),Kr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(s);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(e,n,a,l,o),t>0&&this._blur(l,0,0,t),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(e,t=null){return this._fromTexture(e,t)}fromCubemap(e,t=null){return this._fromTexture(e,t)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=hl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=dl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(e){this._lodMax=Math.floor(Math.log2(e)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let e=0;e<this._lodMeshes.length;e++)this._lodMeshes[e].geometry.dispose()}_cleanup(e){this._renderer.setRenderTarget(Hr,Wr,Xr),this._renderer.xr.enabled=Kr,e.scissorTest=!1,Li(e,0,0,e.width,e.height)}_fromTexture(e,t){e.mapping===Gi||e.mapping===Vi?this._setSize(e.image.length===0?16:e.image[0].width||e.image[0].image.width):this._setSize(e.image.width/4),Hr=this._renderer.getRenderTarget(),Wr=this._renderer.getActiveCubeFace(),Xr=this._renderer.getActiveMipmapLevel(),Kr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=t||this._allocateTargets();return this._textureToCubeUV(e,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const e=3*Math.max(this._cubeSize,112),t=4*this._cubeSize,n={magFilter:an,minFilter:an,generateMipmaps:!1,type:qi,format:fn,colorSpace:Hi,depthBuffer:!1},a=cl(e,t,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==e||this._pingPongRenderTarget.height!==t){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=cl(e,t,n);const{_lodMax:r}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=yp(r)),this._blurMaterial=bp(r,e,t),this._ggxMaterial=Mp(r,e,t)}return a}_compileMaterial(e){const t=new Tt(new sn,e);this._renderer.compile(t,sa)}_sceneToCubeUV(e,t,n,a,r){const l=new nn(90,1,t,n),c=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],h=this._renderer,u=h.autoClear,p=h.toneMapping;h.getClearColor(ol),h.toneMapping=jn,h.autoClear=!1,h.state.buffers.depth.getReversed()&&(h.setRenderTarget(a),h.clearDepth(),h.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Tt(new Bn,new cr({name:"PMREM.Background",side:Ht,depthWrite:!1,depthTest:!1})));const y=this._backgroundBox,m=y.material;let f=!1;const E=e.background;E?E.isColor&&(m.color.copy(E),e.background=null,f=!0):(m.color.copy(ol),f=!0);for(let T=0;T<6;T++){const w=T%3;w===0?(l.up.set(0,c[T],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x+d[T],r.y,r.z)):w===1?(l.up.set(0,0,c[T]),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y+d[T],r.z)):(l.up.set(0,c[T],0),l.position.set(r.x,r.y,r.z),l.lookAt(r.x,r.y,r.z+d[T]));const L=this._cubeSize;Li(a,w*L,T>2?L:0,L,L),h.setRenderTarget(a),f&&h.render(y,l),h.render(e,l)}h.toneMapping=p,h.autoClear=u,e.background=E}_textureToCubeUV(e,t){const n=this._renderer,a=e.mapping===Gi||e.mapping===Vi;a?(this._cubemapMaterial===null&&(this._cubemapMaterial=hl()),this._cubemapMaterial.uniforms.flipEnvMap.value=e.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=dl());const r=a?this._cubemapMaterial:this._equirectMaterial,s=this._lodMeshes[0];s.material=r;const o=r.uniforms;o.envMap.value=e;const l=this._cubeSize;Li(t,0,0,3*l,2*l),n.setRenderTarget(t),n.render(s,sa)}_applyPMREM(e){const t=this._renderer,n=t.autoClear;t.autoClear=!1;const a=this._lodMeshes.length;for(let r=1;r<a;r++)this._applyGGXFilter(e,r-1,r);t.autoClear=n}_applyGGXFilter(e,t,n){const a=this._renderer,r=this._pingPongRenderTarget,s=this._ggxMaterial,o=this._lodMeshes[n];o.material=s;const l=s.uniforms,c=n/(this._lodMeshes.length-1),d=t/(this._lodMeshes.length-1),h=Math.sqrt(c*c-d*d),u=.05+c*.95,p=h*u,{_lodMax:g}=this,y=this._sizeLods[n],m=3*y*(n>g-Yn?n-g+Yn:0),f=4*(this._cubeSize-y);l.envMap.value=e.texture,l.roughness.value=p,l.mipInt.value=g-t,Li(r,m,f,3*y,2*y),a.setRenderTarget(r),a.render(o,sa),l.envMap.value=r.texture,l.roughness.value=0,l.mipInt.value=g-n,Li(e,m,f,3*y,2*y),a.setRenderTarget(e),a.render(o,sa)}_blur(e,t,n,a,r){const s=this._pingPongRenderTarget;this._halfBlur(e,s,t,n,a,"latitudinal",r),this._halfBlur(s,e,n,n,a,"longitudinal",r)}_halfBlur(e,t,n,a,r,s,o){const l=this._renderer,c=this._blurMaterial;s!=="latitudinal"&&s!=="longitudinal"&&mt("blur direction must be either latitudinal or longitudinal!");const d=3,h=this._lodMeshes[a];h.material=c;const u=c.uniforms,p=this._sizeLods[n]-1,g=isFinite(r)?Math.PI/(2*p):2*Math.PI/(2*ci-1),y=r/g,m=isFinite(r)?1+Math.floor(d*y):ci;m>ci&&Ie(`sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${ci}`);const f=[];let E=0;for(let R=0;R<ci;++R){const B=R/y,M=Math.exp(-B*B/2);f.push(M),R===0?E+=M:R<m&&(E+=2*M)}for(let R=0;R<f.length;R++)f[R]=f[R]/E;u.envMap.value=e.texture,u.samples.value=m,u.weights.value=f,u.latitudinal.value=s==="latitudinal",o&&(u.poleAxis.value=o);const{_lodMax:T}=this;u.dTheta.value=g,u.mipInt.value=T-n;const w=this._sizeLods[a],L=3*w*(a>T-Yn?a-T+Yn:0),S=4*(this._cubeSize-w);Li(t,L,S,3*w,2*w),l.setRenderTarget(t),l.render(h,sa)}}function yp(i){const e=[],t=[],n=[];let a=i;const r=i-Yn+1+sl.length;for(let s=0;s<r;s++){const o=Math.pow(2,a);e.push(o);let l=1/o;s>i-Yn?l=sl[s-i+Yn-1]:s===0&&(l=0),t.push(l);const c=1/(o-2),d=-c,h=1+c,u=[d,d,h,d,h,h,d,d,h,h,d,h],p=6,g=6,y=3,m=2,f=1,E=new Float32Array(y*g*p),T=new Float32Array(m*g*p),w=new Float32Array(f*g*p);for(let S=0;S<p;S++){const R=S%3*2/3-1,B=S>2?0:-1,M=[R,B,0,R+2/3,B,0,R+2/3,B+1,0,R,B,0,R+2/3,B+1,0,R,B+1,0];E.set(M,y*g*S),T.set(u,m*g*S);const _=[S,S,S,S,S,S];w.set(_,f*g*S)}const L=new sn;L.setAttribute("position",new rn(E,y)),L.setAttribute("uv",new rn(T,m)),L.setAttribute("faceIndex",new rn(w,f)),n.push(new Tt(L,null)),a>Yn&&a--}return{lodMeshes:n,sizeLods:e,sigmas:t}}function cl(i,e,t){const n=new fi(i,e,t);return n.texture.mapping=lr,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Li(i,e,t,n,a){i.viewport.set(e,t,n,a),i.scissor.set(e,t,n,a)}function Mp(i,e,t){return new Fn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:_p,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:hr(),fragmentShader:`

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
		`,blending:In,depthTest:!1,depthWrite:!1})}function bp(i,e,t){const n=new Float32Array(ci),a=new C(0,1,0);return new Fn({name:"SphericalGaussianBlur",defines:{n:ci,CUBEUV_TEXEL_WIDTH:1/e,CUBEUV_TEXEL_HEIGHT:1/t,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:a}},vertexShader:hr(),fragmentShader:`

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
		`,blending:In,depthTest:!1,depthWrite:!1})}function dl(){return new Fn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:hr(),fragmentShader:`

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
		`,blending:In,depthTest:!1,depthWrite:!1})}function hl(){return new Fn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:hr(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:In,depthTest:!1,depthWrite:!1})}function hr(){return`

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
	`}function Sp(i){let e=new WeakMap,t=null;function n(o){if(o&&o.isTexture){const l=o.mapping,c=l===ds||l===hs,d=l===Gi||l===Vi;if(c||d){let h=e.get(o);const u=h!==void 0?h.texture.pmremVersion:0;if(o.isRenderTargetTexture&&o.pmremVersion!==u)return t===null&&(t=new ll(i)),h=c?t.fromEquirectangular(o,h):t.fromCubemap(o,h),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),h.texture;if(h!==void 0)return h.texture;{const p=o.image;return c&&p&&p.height>0||d&&p&&a(p)?(t===null&&(t=new ll(i)),h=c?t.fromEquirectangular(o):t.fromCubemap(o),h.texture.pmremVersion=o.pmremVersion,e.set(o,h),o.addEventListener("dispose",r),h.texture):null}}}return o}function a(o){let l=0;const c=6;for(let d=0;d<c;d++)o[d]!==void 0&&l++;return l===c}function r(o){const l=o.target;l.removeEventListener("dispose",r);const c=e.get(l);c!==void 0&&(e.delete(l),c.dispose())}function s(){e=new WeakMap,t!==null&&(t.dispose(),t=null)}return{get:n,dispose:s}}function Tp(i){const e={};function t(n){if(e[n]!==void 0)return e[n];const a=i.getExtension(n);return e[n]=a,a}return{has:function(n){return t(n)!==null},init:function(){t("EXT_color_buffer_float"),t("WEBGL_clip_cull_distance"),t("OES_texture_float_linear"),t("EXT_color_buffer_half_float"),t("WEBGL_multisampled_render_to_texture"),t("WEBGL_render_shared_exponent")},get:function(n){const a=t(n);return a===null&&ga("WebGLRenderer: "+n+" extension not supported."),a}}}function Ep(i,e,t,n){const a={},r=new WeakMap;function s(h){const u=h.target;u.index!==null&&e.remove(u.index);for(const g in u.attributes)e.remove(u.attributes[g]);u.removeEventListener("dispose",s),delete a[u.id];const p=r.get(u);p&&(e.remove(p),r.delete(u)),n.releaseStatesOfGeometry(u),u.isInstancedBufferGeometry===!0&&delete u._maxInstanceCount,t.memory.geometries--}function o(h,u){return a[u.id]===!0||(u.addEventListener("dispose",s),a[u.id]=!0,t.memory.geometries++),u}function l(h){const u=h.attributes;for(const p in u)e.update(u[p],i.ARRAY_BUFFER)}function c(h){const u=[],p=h.index,g=h.attributes.position;let y=0;if(p!==null){const E=p.array;y=p.version;for(let T=0,w=E.length;T<w;T+=3){const L=E[T+0],S=E[T+1],R=E[T+2];u.push(L,S,S,R,R,L)}}else if(g!==void 0){const E=g.array;y=g.version;for(let T=0,w=E.length/3-1;T<w;T+=3){const L=T+0,S=T+1,R=T+2;u.push(L,S,S,R,R,L)}}else return;const m=new(jl(u)?ec:Ql)(u,1);m.version=y;const f=r.get(h);f&&e.remove(f),r.set(h,m)}function d(h){const u=r.get(h);if(u){const p=h.index;p!==null&&u.version<p.version&&c(h)}else c(h);return r.get(h)}return{get:o,update:l,getWireframeAttribute:d}}function wp(i,e,t){let n;function a(u){n=u}let r,s;function o(u){r=u.type,s=u.bytesPerElement}function l(u,p){i.drawElements(n,p,r,u*s),t.update(p,n,1)}function c(u,p,g){g!==0&&(i.drawElementsInstanced(n,p,r,u*s,g),t.update(p,n,g))}function d(u,p,g){if(g===0)return;e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,p,0,r,u,0,g);let m=0;for(let f=0;f<g;f++)m+=p[f];t.update(m,n,1)}function h(u,p,g,y){if(g===0)return;const m=e.get("WEBGL_multi_draw");if(m===null)for(let f=0;f<u.length;f++)c(u[f]/s,p[f],y[f]);else{m.multiDrawElementsInstancedWEBGL(n,p,0,r,u,0,y,0,g);let f=0;for(let E=0;E<g;E++)f+=p[E]*y[E];t.update(f,n,1)}}this.setMode=a,this.setIndex=o,this.render=l,this.renderInstances=c,this.renderMultiDraw=d,this.renderMultiDrawInstances=h}function Ap(i){const e={geometries:0,textures:0},t={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,s,o){switch(t.calls++,s){case i.TRIANGLES:t.triangles+=o*(r/3);break;case i.LINES:t.lines+=o*(r/2);break;case i.LINE_STRIP:t.lines+=o*(r-1);break;case i.LINE_LOOP:t.lines+=o*r;break;case i.POINTS:t.points+=o*r;break;default:mt("WebGLInfo: Unknown draw mode:",s);break}}function a(){t.calls=0,t.triangles=0,t.points=0,t.lines=0}return{memory:e,render:t,programs:null,autoReset:!0,reset:a,update:n}}function Cp(i,e,t){const n=new WeakMap,a=new pt;function r(s,o,l){const c=s.morphTargetInfluences,d=o.morphAttributes.position||o.morphAttributes.normal||o.morphAttributes.color,h=d!==void 0?d.length:0;let u=n.get(o);if(u===void 0||u.count!==h){let _=function(){B.dispose(),n.delete(o),o.removeEventListener("dispose",_)};var p=_;u!==void 0&&u.texture.dispose();const g=o.morphAttributes.position!==void 0,y=o.morphAttributes.normal!==void 0,m=o.morphAttributes.color!==void 0,f=o.morphAttributes.position||[],E=o.morphAttributes.normal||[],T=o.morphAttributes.color||[];let w=0;g===!0&&(w=1),y===!0&&(w=2),m===!0&&(w=3);let L=o.attributes.position.count*w,S=1;L>e.maxTextureSize&&(S=Math.ceil(L/e.maxTextureSize),L=e.maxTextureSize);const R=new Float32Array(L*S*4*h),B=new $l(R,L,S,h);B.type=gn,B.needsUpdate=!0;const M=w*4;for(let D=0;D<h;D++){const F=f[D],z=E[D],K=T[D],X=L*S*4*D;for(let Y=0;Y<F.count;Y++){const ee=Y*M;g===!0&&(a.fromBufferAttribute(F,Y),R[X+ee+0]=a.x,R[X+ee+1]=a.y,R[X+ee+2]=a.z,R[X+ee+3]=0),y===!0&&(a.fromBufferAttribute(z,Y),R[X+ee+4]=a.x,R[X+ee+5]=a.y,R[X+ee+6]=a.z,R[X+ee+7]=0),m===!0&&(a.fromBufferAttribute(K,Y),R[X+ee+8]=a.x,R[X+ee+9]=a.y,R[X+ee+10]=a.z,R[X+ee+11]=K.itemSize===4?a.w:1)}}u={count:h,texture:B,size:new Ue(L,S)},n.set(o,u),o.addEventListener("dispose",_)}if(s.isInstancedMesh===!0&&s.morphTexture!==null)l.getUniforms().setValue(i,"morphTexture",s.morphTexture,t);else{let g=0;for(let m=0;m<c.length;m++)g+=c[m];const y=o.morphTargetsRelative?1:1-g;l.getUniforms().setValue(i,"morphTargetBaseInfluence",y),l.getUniforms().setValue(i,"morphTargetInfluences",c)}l.getUniforms().setValue(i,"morphTargetsTexture",u.texture,t),l.getUniforms().setValue(i,"morphTargetsTextureSize",u.size)}return{update:r}}function Rp(i,e,t,n){let a=new WeakMap;function r(l){const c=n.render.frame,d=l.geometry,h=e.get(l,d);if(a.get(h)!==c&&(e.update(h),a.set(h,c)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),a.get(l)!==c&&(t.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&t.update(l.instanceColor,i.ARRAY_BUFFER),a.set(l,c))),l.isSkinnedMesh){const u=l.skeleton;a.get(u)!==c&&(u.update(),a.set(u,c))}return h}function s(){a=new WeakMap}function o(l){const c=l.target;c.removeEventListener("dispose",o),t.remove(c.instanceMatrix),c.instanceColor!==null&&t.remove(c.instanceColor)}return{update:r,dispose:s}}const dc=new Ut,ul=new sc(1,1),hc=new $l,uc=new Kd,fc=new ic,fl=[],pl=[],ml=new Float32Array(16),xl=new Float32Array(9),gl=new Float32Array(4);function Zi(i,e,t){const n=i[0];if(n<=0||n>0)return i;const a=e*t;let r=fl[a];if(r===void 0&&(r=new Float32Array(a),fl[a]=r),e!==0){n.toArray(r,0);for(let s=1,o=0;s!==e;++s)o+=t,i[s].toArray(r,o)}return r}function Mt(i,e){if(i.length!==e.length)return!1;for(let t=0,n=i.length;t<n;t++)if(i[t]!==e[t])return!1;return!0}function bt(i,e){for(let t=0,n=e.length;t<n;t++)i[t]=e[t]}function ur(i,e){let t=pl[e];t===void 0&&(t=new Int32Array(e),pl[e]=t);for(let n=0;n!==e;++n)t[n]=i.allocateTextureUnit();return t}function Pp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1f(this.addr,e),t[0]=e)}function Lp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2f(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2fv(this.addr,e),bt(t,e)}}function Dp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3f(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else if(e.r!==void 0)(t[0]!==e.r||t[1]!==e.g||t[2]!==e.b)&&(i.uniform3f(this.addr,e.r,e.g,e.b),t[0]=e.r,t[1]=e.g,t[2]=e.b);else{if(Mt(t,e))return;i.uniform3fv(this.addr,e),bt(t,e)}}function Ip(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4f(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4fv(this.addr,e),bt(t,e)}}function Up(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Mt(t,e))return;i.uniformMatrix2fv(this.addr,!1,e),bt(t,e)}else{if(Mt(t,n))return;gl.set(n),i.uniformMatrix2fv(this.addr,!1,gl),bt(t,n)}}function Np(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Mt(t,e))return;i.uniformMatrix3fv(this.addr,!1,e),bt(t,e)}else{if(Mt(t,n))return;xl.set(n),i.uniformMatrix3fv(this.addr,!1,xl),bt(t,n)}}function Fp(i,e){const t=this.cache,n=e.elements;if(n===void 0){if(Mt(t,e))return;i.uniformMatrix4fv(this.addr,!1,e),bt(t,e)}else{if(Mt(t,n))return;ml.set(n),i.uniformMatrix4fv(this.addr,!1,ml),bt(t,n)}}function Bp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1i(this.addr,e),t[0]=e)}function kp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2i(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2iv(this.addr,e),bt(t,e)}}function Op(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3i(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Mt(t,e))return;i.uniform3iv(this.addr,e),bt(t,e)}}function zp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4i(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4iv(this.addr,e),bt(t,e)}}function Gp(i,e){const t=this.cache;t[0]!==e&&(i.uniform1ui(this.addr,e),t[0]=e)}function Vp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y)&&(i.uniform2ui(this.addr,e.x,e.y),t[0]=e.x,t[1]=e.y);else{if(Mt(t,e))return;i.uniform2uiv(this.addr,e),bt(t,e)}}function Hp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z)&&(i.uniform3ui(this.addr,e.x,e.y,e.z),t[0]=e.x,t[1]=e.y,t[2]=e.z);else{if(Mt(t,e))return;i.uniform3uiv(this.addr,e),bt(t,e)}}function Wp(i,e){const t=this.cache;if(e.x!==void 0)(t[0]!==e.x||t[1]!==e.y||t[2]!==e.z||t[3]!==e.w)&&(i.uniform4ui(this.addr,e.x,e.y,e.z,e.w),t[0]=e.x,t[1]=e.y,t[2]=e.z,t[3]=e.w);else{if(Mt(t,e))return;i.uniform4uiv(this.addr,e),bt(t,e)}}function Xp(i,e,t){const n=this.cache,a=t.allocateTextureUnit();n[0]!==a&&(i.uniform1i(this.addr,a),n[0]=a);let r;this.type===i.SAMPLER_2D_SHADOW?(ul.compareFunction=Yl,r=ul):r=dc,t.setTexture2D(e||r,a)}function Kp(i,e,t){const n=this.cache,a=t.allocateTextureUnit();n[0]!==a&&(i.uniform1i(this.addr,a),n[0]=a),t.setTexture3D(e||uc,a)}function qp(i,e,t){const n=this.cache,a=t.allocateTextureUnit();n[0]!==a&&(i.uniform1i(this.addr,a),n[0]=a),t.setTextureCube(e||fc,a)}function Yp(i,e,t){const n=this.cache,a=t.allocateTextureUnit();n[0]!==a&&(i.uniform1i(this.addr,a),n[0]=a),t.setTexture2DArray(e||hc,a)}function jp(i){switch(i){case 5126:return Pp;case 35664:return Lp;case 35665:return Dp;case 35666:return Ip;case 35674:return Up;case 35675:return Np;case 35676:return Fp;case 5124:case 35670:return Bp;case 35667:case 35671:return kp;case 35668:case 35672:return Op;case 35669:case 35673:return zp;case 5125:return Gp;case 36294:return Vp;case 36295:return Hp;case 36296:return Wp;case 35678:case 36198:case 36298:case 36306:case 35682:return Xp;case 35679:case 36299:case 36307:return Kp;case 35680:case 36300:case 36308:case 36293:return qp;case 36289:case 36303:case 36311:case 36292:return Yp}}function $p(i,e){i.uniform1fv(this.addr,e)}function Zp(i,e){const t=Zi(e,this.size,2);i.uniform2fv(this.addr,t)}function Jp(i,e){const t=Zi(e,this.size,3);i.uniform3fv(this.addr,t)}function Qp(i,e){const t=Zi(e,this.size,4);i.uniform4fv(this.addr,t)}function em(i,e){const t=Zi(e,this.size,4);i.uniformMatrix2fv(this.addr,!1,t)}function tm(i,e){const t=Zi(e,this.size,9);i.uniformMatrix3fv(this.addr,!1,t)}function nm(i,e){const t=Zi(e,this.size,16);i.uniformMatrix4fv(this.addr,!1,t)}function im(i,e){i.uniform1iv(this.addr,e)}function am(i,e){i.uniform2iv(this.addr,e)}function rm(i,e){i.uniform3iv(this.addr,e)}function sm(i,e){i.uniform4iv(this.addr,e)}function om(i,e){i.uniform1uiv(this.addr,e)}function lm(i,e){i.uniform2uiv(this.addr,e)}function cm(i,e){i.uniform3uiv(this.addr,e)}function dm(i,e){i.uniform4uiv(this.addr,e)}function hm(i,e,t){const n=this.cache,a=e.length,r=ur(t,a);Mt(n,r)||(i.uniform1iv(this.addr,r),bt(n,r));for(let s=0;s!==a;++s)t.setTexture2D(e[s]||dc,r[s])}function um(i,e,t){const n=this.cache,a=e.length,r=ur(t,a);Mt(n,r)||(i.uniform1iv(this.addr,r),bt(n,r));for(let s=0;s!==a;++s)t.setTexture3D(e[s]||uc,r[s])}function fm(i,e,t){const n=this.cache,a=e.length,r=ur(t,a);Mt(n,r)||(i.uniform1iv(this.addr,r),bt(n,r));for(let s=0;s!==a;++s)t.setTextureCube(e[s]||fc,r[s])}function pm(i,e,t){const n=this.cache,a=e.length,r=ur(t,a);Mt(n,r)||(i.uniform1iv(this.addr,r),bt(n,r));for(let s=0;s!==a;++s)t.setTexture2DArray(e[s]||hc,r[s])}function mm(i){switch(i){case 5126:return $p;case 35664:return Zp;case 35665:return Jp;case 35666:return Qp;case 35674:return em;case 35675:return tm;case 35676:return nm;case 5124:case 35670:return im;case 35667:case 35671:return am;case 35668:case 35672:return rm;case 35669:case 35673:return sm;case 5125:return om;case 36294:return lm;case 36295:return cm;case 36296:return dm;case 35678:case 36198:case 36298:case 36306:case 35682:return hm;case 35679:case 36299:case 36307:return um;case 35680:case 36300:case 36308:case 36293:return fm;case 36289:case 36303:case 36311:case 36292:return pm}}class xm{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.setValue=jp(t.type)}}class gm{constructor(e,t,n){this.id=e,this.addr=n,this.cache=[],this.type=t.type,this.size=t.size,this.setValue=mm(t.type)}}class _m{constructor(e){this.id=e,this.seq=[],this.map={}}setValue(e,t,n){const a=this.seq;for(let r=0,s=a.length;r!==s;++r){const o=a[r];o.setValue(e,t[o.id],n)}}}const qr=/(\w+)(\])?(\[|\.)?/g;function _l(i,e){i.seq.push(e),i.map[e.id]=e}function vm(i,e,t){const n=i.name,a=n.length;for(qr.lastIndex=0;;){const r=qr.exec(n),s=qr.lastIndex;let o=r[1];const l=r[2]==="]",c=r[3];if(l&&(o=o|0),c===void 0||c==="["&&s+2===a){_l(t,c===void 0?new xm(o,i,e):new gm(o,i,e));break}else{let h=t.map[o];h===void 0&&(h=new _m(o),_l(t,h)),t=h}}}class Qa{constructor(e,t){this.seq=[],this.map={};const n=e.getProgramParameter(t,e.ACTIVE_UNIFORMS);for(let a=0;a<n;++a){const r=e.getActiveUniform(t,a),s=e.getUniformLocation(t,r.name);vm(r,s,this)}}setValue(e,t,n,a){const r=this.map[t];r!==void 0&&r.setValue(e,n,a)}setOptional(e,t,n){const a=t[n];a!==void 0&&this.setValue(e,n,a)}static upload(e,t,n,a){for(let r=0,s=t.length;r!==s;++r){const o=t[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(e,l.value,a)}}static seqWithValue(e,t){const n=[];for(let a=0,r=e.length;a!==r;++a){const s=e[a];s.id in t&&n.push(s)}return n}}function vl(i,e,t){const n=i.createShader(e);return i.shaderSource(n,t),i.compileShader(n),n}const ym=37297;let Mm=0;function bm(i,e){const t=i.split(`
`),n=[],a=Math.max(e-6,0),r=Math.min(e+6,t.length);for(let s=a;s<r;s++){const o=s+1;n.push(`${o===e?">":" "} ${o}: ${t[s]}`)}return n.join(`
`)}const yl=new Fe;function Sm(i){je._getMatrix(yl,je.workingColorSpace,i);const e=`mat3( ${yl.elements.map(t=>t.toFixed(4))} )`;switch(je.getTransfer(i)){case nr:return[e,"LinearTransferOETF"];case it:return[e,"sRGBTransferOETF"];default:return Ie("WebGLProgram: Unsupported color space: ",i),[e,"LinearTransferOETF"]}}function Ml(i,e,t){const n=i.getShaderParameter(e,i.COMPILE_STATUS),r=(i.getShaderInfoLog(e)||"").trim();if(n&&r==="")return"";const s=/ERROR: 0:(\d+)/.exec(r);if(s){const o=parseInt(s[1]);return t.toUpperCase()+`

`+r+`

`+bm(i.getShaderSource(e),o)}else return r}function Tm(i,e){const t=Sm(e);return[`vec4 ${i}( vec4 value ) {`,`	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,"}"].join(`
`)}function Em(i,e){let t;switch(e){case sd:t="Linear";break;case od:t="Reinhard";break;case ld:t="Cineon";break;case Ol:t="ACESFilmic";break;case dd:t="AgX";break;case hd:t="Neutral";break;case cd:t="Custom";break;default:Ie("WebGLProgram: Unsupported toneMapping:",e),t="Linear"}return"vec3 "+i+"( vec3 color ) { return "+t+"ToneMapping( color ); }"}const qa=new C;function wm(){je.getLuminanceCoefficients(qa);const i=qa.x.toFixed(4),e=qa.y.toFixed(4),t=qa.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,"	return dot( weights, rgb );","}"].join(`
`)}function Am(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",i.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(ca).join(`
`)}function Cm(i){const e=[];for(const t in i){const n=i[t];n!==!1&&e.push("#define "+t+" "+n)}return e.join(`
`)}function Rm(i,e){const t={},n=i.getProgramParameter(e,i.ACTIVE_ATTRIBUTES);for(let a=0;a<n;a++){const r=i.getActiveAttrib(e,a),s=r.name;let o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),t[s]={type:r.type,location:i.getAttribLocation(e,s),locationSize:o}}return t}function ca(i){return i!==""}function bl(i,e){const t=e.numSpotLightShadows+e.numSpotLightMaps-e.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,e.numDirLights).replace(/NUM_SPOT_LIGHTS/g,e.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,e.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,t).replace(/NUM_RECT_AREA_LIGHTS/g,e.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,e.numPointLights).replace(/NUM_HEMI_LIGHTS/g,e.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,e.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,e.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,e.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,e.numPointLightShadows)}function Sl(i,e){return i.replace(/NUM_CLIPPING_PLANES/g,e.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,e.numClippingPlanes-e.numClipIntersection)}const Pm=/^[ \t]*#include +<([\w\d./]+)>/gm;function Ws(i){return i.replace(Pm,Dm)}const Lm=new Map;function Dm(i,e){let t=Oe[e];if(t===void 0){const n=Lm.get(e);if(n!==void 0)t=Oe[n],Ie('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',e,n);else throw new Error("Can not resolve #include <"+e+">")}return Ws(t)}const Im=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Tl(i){return i.replace(Im,Um)}function Um(i,e,t,n){let a="";for(let r=parseInt(e);r<parseInt(t);r++)a+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return a}function El(i){let e=`precision ${i.precision} float;
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
#define LOW_PRECISION`),e}function Nm(i){let e="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===kl?e="SHADOWMAP_TYPE_PCF":i.shadowMapType===Oc?e="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===An&&(e="SHADOWMAP_TYPE_VSM"),e}function Fm(i){let e="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Gi:case Vi:e="ENVMAP_TYPE_CUBE";break;case lr:e="ENVMAP_TYPE_CUBE_UV";break}return e}function Bm(i){let e="ENVMAP_MODE_REFLECTION";return i.envMap&&i.envMapMode===Vi&&(e="ENVMAP_MODE_REFRACTION"),e}function km(i){let e="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ys:e="ENVMAP_BLENDING_MULTIPLY";break;case ad:e="ENVMAP_BLENDING_MIX";break;case rd:e="ENVMAP_BLENDING_ADD";break}return e}function Om(i){const e=i.envMapCubeUVHeight;if(e===null)return null;const t=Math.log2(e)-2,n=1/e;return{texelWidth:1/(3*Math.max(Math.pow(2,t),112)),texelHeight:n,maxMip:t}}function zm(i,e,t,n){const a=i.getContext(),r=t.defines;let s=t.vertexShader,o=t.fragmentShader;const l=Nm(t),c=Fm(t),d=Bm(t),h=km(t),u=Om(t),p=Am(t),g=Cm(r),y=a.createProgram();let m,f,E=t.glslVersion?"#version "+t.glslVersion+`
`:"";t.isRawShaderMaterial?(m=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ca).join(`
`),m.length>0&&(m+=`
`),f=["#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g].filter(ca).join(`
`),f.length>0&&(f+=`
`)):(m=[El(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",t.batching?"#define USE_BATCHING":"",t.batchingColor?"#define USE_BATCHING_COLOR":"",t.instancing?"#define USE_INSTANCING":"",t.instancingColor?"#define USE_INSTANCING_COLOR":"",t.instancingMorph?"#define USE_INSTANCING_MORPH":"",t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.map?"#define USE_MAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+d:"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.displacementMap?"#define USE_DISPLACEMENTMAP":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.mapUv?"#define MAP_UV "+t.mapUv:"",t.alphaMapUv?"#define ALPHAMAP_UV "+t.alphaMapUv:"",t.lightMapUv?"#define LIGHTMAP_UV "+t.lightMapUv:"",t.aoMapUv?"#define AOMAP_UV "+t.aoMapUv:"",t.emissiveMapUv?"#define EMISSIVEMAP_UV "+t.emissiveMapUv:"",t.bumpMapUv?"#define BUMPMAP_UV "+t.bumpMapUv:"",t.normalMapUv?"#define NORMALMAP_UV "+t.normalMapUv:"",t.displacementMapUv?"#define DISPLACEMENTMAP_UV "+t.displacementMapUv:"",t.metalnessMapUv?"#define METALNESSMAP_UV "+t.metalnessMapUv:"",t.roughnessMapUv?"#define ROUGHNESSMAP_UV "+t.roughnessMapUv:"",t.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+t.anisotropyMapUv:"",t.clearcoatMapUv?"#define CLEARCOATMAP_UV "+t.clearcoatMapUv:"",t.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+t.clearcoatNormalMapUv:"",t.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+t.clearcoatRoughnessMapUv:"",t.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+t.iridescenceMapUv:"",t.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+t.iridescenceThicknessMapUv:"",t.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+t.sheenColorMapUv:"",t.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+t.sheenRoughnessMapUv:"",t.specularMapUv?"#define SPECULARMAP_UV "+t.specularMapUv:"",t.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+t.specularColorMapUv:"",t.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+t.specularIntensityMapUv:"",t.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+t.transmissionMapUv:"",t.thicknessMapUv?"#define THICKNESSMAP_UV "+t.thicknessMapUv:"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.flatShading?"#define FLAT_SHADED":"",t.skinning?"#define USE_SKINNING":"",t.morphTargets?"#define USE_MORPHTARGETS":"",t.morphNormals&&t.flatShading===!1?"#define USE_MORPHNORMALS":"",t.morphColors?"#define USE_MORPHCOLORS":"",t.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+t.morphTextureStride:"",t.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+t.morphTargetsCount:"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.sizeAttenuation?"#define USE_SIZEATTENUATION":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ca).join(`
`),f=[El(t),"#define SHADER_TYPE "+t.shaderType,"#define SHADER_NAME "+t.shaderName,g,t.useFog&&t.fog?"#define USE_FOG":"",t.useFog&&t.fogExp2?"#define FOG_EXP2":"",t.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",t.map?"#define USE_MAP":"",t.matcap?"#define USE_MATCAP":"",t.envMap?"#define USE_ENVMAP":"",t.envMap?"#define "+c:"",t.envMap?"#define "+d:"",t.envMap?"#define "+h:"",u?"#define CUBEUV_TEXEL_WIDTH "+u.texelWidth:"",u?"#define CUBEUV_TEXEL_HEIGHT "+u.texelHeight:"",u?"#define CUBEUV_MAX_MIP "+u.maxMip+".0":"",t.lightMap?"#define USE_LIGHTMAP":"",t.aoMap?"#define USE_AOMAP":"",t.bumpMap?"#define USE_BUMPMAP":"",t.normalMap?"#define USE_NORMALMAP":"",t.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",t.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",t.emissiveMap?"#define USE_EMISSIVEMAP":"",t.anisotropy?"#define USE_ANISOTROPY":"",t.anisotropyMap?"#define USE_ANISOTROPYMAP":"",t.clearcoat?"#define USE_CLEARCOAT":"",t.clearcoatMap?"#define USE_CLEARCOATMAP":"",t.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",t.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",t.dispersion?"#define USE_DISPERSION":"",t.iridescence?"#define USE_IRIDESCENCE":"",t.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",t.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",t.specularMap?"#define USE_SPECULARMAP":"",t.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",t.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",t.roughnessMap?"#define USE_ROUGHNESSMAP":"",t.metalnessMap?"#define USE_METALNESSMAP":"",t.alphaMap?"#define USE_ALPHAMAP":"",t.alphaTest?"#define USE_ALPHATEST":"",t.alphaHash?"#define USE_ALPHAHASH":"",t.sheen?"#define USE_SHEEN":"",t.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",t.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",t.transmission?"#define USE_TRANSMISSION":"",t.transmissionMap?"#define USE_TRANSMISSIONMAP":"",t.thicknessMap?"#define USE_THICKNESSMAP":"",t.vertexTangents&&t.flatShading===!1?"#define USE_TANGENT":"",t.vertexColors||t.instancingColor||t.batchingColor?"#define USE_COLOR":"",t.vertexAlphas?"#define USE_COLOR_ALPHA":"",t.vertexUv1s?"#define USE_UV1":"",t.vertexUv2s?"#define USE_UV2":"",t.vertexUv3s?"#define USE_UV3":"",t.pointsUvs?"#define USE_POINTS_UV":"",t.gradientMap?"#define USE_GRADIENTMAP":"",t.flatShading?"#define FLAT_SHADED":"",t.doubleSided?"#define DOUBLE_SIDED":"",t.flipSided?"#define FLIP_SIDED":"",t.shadowMapEnabled?"#define USE_SHADOWMAP":"",t.shadowMapEnabled?"#define "+l:"",t.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",t.numLightProbes>0?"#define USE_LIGHT_PROBES":"",t.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",t.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",t.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",t.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",t.toneMapping!==jn?"#define TONE_MAPPING":"",t.toneMapping!==jn?Oe.tonemapping_pars_fragment:"",t.toneMapping!==jn?Em("toneMapping",t.toneMapping):"",t.dithering?"#define DITHERING":"",t.opaque?"#define OPAQUE":"",Oe.colorspace_pars_fragment,Tm("linearToOutputTexel",t.outputColorSpace),wm(),t.useDepthPacking?"#define DEPTH_PACKING "+t.depthPacking:"",`
`].filter(ca).join(`
`)),s=Ws(s),s=bl(s,t),s=Sl(s,t),o=Ws(o),o=bl(o,t),o=Sl(o,t),s=Tl(s),o=Tl(o),t.isRawShaderMaterial!==!0&&(E=`#version 300 es
`,m=[p,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+m,f=["#define varying in",t.glslVersion===Lo?"":"layout(location = 0) out highp vec4 pc_fragColor;",t.glslVersion===Lo?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+f);const T=E+m+s,w=E+f+o,L=vl(a,a.VERTEX_SHADER,T),S=vl(a,a.FRAGMENT_SHADER,w);a.attachShader(y,L),a.attachShader(y,S),t.index0AttributeName!==void 0?a.bindAttribLocation(y,0,t.index0AttributeName):t.morphTargets===!0&&a.bindAttribLocation(y,0,"position"),a.linkProgram(y);function R(D){if(i.debug.checkShaderErrors){const F=a.getProgramInfoLog(y)||"",z=a.getShaderInfoLog(L)||"",K=a.getShaderInfoLog(S)||"",X=F.trim(),Y=z.trim(),ee=K.trim();let W=!0,ie=!0;if(a.getProgramParameter(y,a.LINK_STATUS)===!1)if(W=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(a,y,L,S);else{const re=Ml(a,L,"vertex"),be=Ml(a,S,"fragment");mt("THREE.WebGLProgram: Shader Error "+a.getError()+" - VALIDATE_STATUS "+a.getProgramParameter(y,a.VALIDATE_STATUS)+`

Material Name: `+D.name+`
Material Type: `+D.type+`

Program Info Log: `+X+`
`+re+`
`+be)}else X!==""?Ie("WebGLProgram: Program Info Log:",X):(Y===""||ee==="")&&(ie=!1);ie&&(D.diagnostics={runnable:W,programLog:X,vertexShader:{log:Y,prefix:m},fragmentShader:{log:ee,prefix:f}})}a.deleteShader(L),a.deleteShader(S),B=new Qa(a,y),M=Rm(a,y)}let B;this.getUniforms=function(){return B===void 0&&R(this),B};let M;this.getAttributes=function(){return M===void 0&&R(this),M};let _=t.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return _===!1&&(_=a.getProgramParameter(y,ym)),_},this.destroy=function(){n.releaseStatesOfProgram(this),a.deleteProgram(y),this.program=void 0},this.type=t.shaderType,this.name=t.shaderName,this.id=Mm++,this.cacheKey=e,this.usedTimes=1,this.program=y,this.vertexShader=L,this.fragmentShader=S,this}let Gm=0;class Vm{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(e){const t=e.vertexShader,n=e.fragmentShader,a=this._getShaderStage(t),r=this._getShaderStage(n),s=this._getShaderCacheForMaterial(e);return s.has(a)===!1&&(s.add(a),a.usedTimes++),s.has(r)===!1&&(s.add(r),r.usedTimes++),this}remove(e){const t=this.materialCache.get(e);for(const n of t)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(e),this}getVertexShaderID(e){return this._getShaderStage(e.vertexShader).id}getFragmentShaderID(e){return this._getShaderStage(e.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(e){const t=this.materialCache;let n=t.get(e);return n===void 0&&(n=new Set,t.set(e,n)),n}_getShaderStage(e){const t=this.shaderCache;let n=t.get(e);return n===void 0&&(n=new Hm(e),t.set(e,n)),n}}class Hm{constructor(e){this.id=Gm++,this.code=e,this.usedTimes=0}}function Wm(i,e,t,n,a,r,s){const o=new Zl,l=new Vm,c=new Set,d=[],h=a.logarithmicDepthBuffer,u=a.vertexTextures;let p=a.precision;const g={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function y(M){return c.add(M),M===0?"uv":`uv${M}`}function m(M,_,D,F,z){const K=F.fog,X=z.geometry,Y=M.isMeshStandardMaterial?F.environment:null,ee=(M.isMeshStandardMaterial?t:e).get(M.envMap||Y),W=ee&&ee.mapping===lr?ee.image.height:null,ie=g[M.type];M.precision!==null&&(p=a.getMaxPrecision(M.precision),p!==M.precision&&Ie("WebGLProgram.getParameters:",M.precision,"not supported, using",p,"instead."));const re=X.morphAttributes.position||X.morphAttributes.normal||X.morphAttributes.color,be=re!==void 0?re.length:0;let He=0;X.morphAttributes.position!==void 0&&(He=1),X.morphAttributes.normal!==void 0&&(He=2),X.morphAttributes.color!==void 0&&(He=3);let $e,Qe,Ze,j;if(ie){const tt=xn[ie];$e=tt.vertexShader,Qe=tt.fragmentShader}else $e=M.vertexShader,Qe=M.fragmentShader,l.update(M),Ze=l.getVertexShaderID(M),j=l.getFragmentShaderID(M);const $=i.getRenderTarget(),fe=i.state.buffers.depth.getReversed(),De=z.isInstancedMesh===!0,Me=z.isBatchedMesh===!0,Be=!!M.map,_t=!!M.matcap,ke=!!ee,qe=!!M.aoMap,A=!!M.lightMap,Ge=!!M.bumpMap,Ve=!!M.normalMap,et=!!M.displacementMap,xe=!!M.emissiveMap,ot=!!M.metalnessMap,G=!!M.roughnessMap,J=M.anisotropy>0,b=M.clearcoat>0,x=M.dispersion>0,N=M.iridescence>0,V=M.sheen>0,q=M.transmission>0,H=J&&!!M.anisotropyMap,ye=b&&!!M.clearcoatMap,le=b&&!!M.clearcoatNormalMap,Se=b&&!!M.clearcoatRoughnessMap,ve=N&&!!M.iridescenceMap,Q=N&&!!M.iridescenceThicknessMap,ae=V&&!!M.sheenColorMap,Ce=V&&!!M.sheenRoughnessMap,we=!!M.specularMap,ue=!!M.specularColorMap,Le=!!M.specularIntensityMap,P=q&&!!M.transmissionMap,de=q&&!!M.thicknessMap,se=!!M.gradientMap,oe=!!M.alphaMap,te=M.alphaTest>0,Z=!!M.alphaHash,ge=!!M.extensions;let Ne=jn;M.toneMapped&&($===null||$.isXRRenderTarget===!0)&&(Ne=i.toneMapping);const lt={shaderID:ie,shaderType:M.type,shaderName:M.name,vertexShader:$e,fragmentShader:Qe,defines:M.defines,customVertexShaderID:Ze,customFragmentShaderID:j,isRawShaderMaterial:M.isRawShaderMaterial===!0,glslVersion:M.glslVersion,precision:p,batching:Me,batchingColor:Me&&z._colorsTexture!==null,instancing:De,instancingColor:De&&z.instanceColor!==null,instancingMorph:De&&z.morphTexture!==null,supportsVertexTextures:u,outputColorSpace:$===null?i.outputColorSpace:$.isXRRenderTarget===!0?$.texture.colorSpace:Hi,alphaToCoverage:!!M.alphaToCoverage,map:Be,matcap:_t,envMap:ke,envMapMode:ke&&ee.mapping,envMapCubeUVHeight:W,aoMap:qe,lightMap:A,bumpMap:Ge,normalMap:Ve,displacementMap:u&&et,emissiveMap:xe,normalMapObjectSpace:Ve&&M.normalMapType===md,normalMapTangentSpace:Ve&&M.normalMapType===ql,metalnessMap:ot,roughnessMap:G,anisotropy:J,anisotropyMap:H,clearcoat:b,clearcoatMap:ye,clearcoatNormalMap:le,clearcoatRoughnessMap:Se,dispersion:x,iridescence:N,iridescenceMap:ve,iridescenceThicknessMap:Q,sheen:V,sheenColorMap:ae,sheenRoughnessMap:Ce,specularMap:we,specularColorMap:ue,specularIntensityMap:Le,transmission:q,transmissionMap:P,thicknessMap:de,gradientMap:se,opaque:M.transparent===!1&&M.blending===Bi&&M.alphaToCoverage===!1,alphaMap:oe,alphaTest:te,alphaHash:Z,combine:M.combine,mapUv:Be&&y(M.map.channel),aoMapUv:qe&&y(M.aoMap.channel),lightMapUv:A&&y(M.lightMap.channel),bumpMapUv:Ge&&y(M.bumpMap.channel),normalMapUv:Ve&&y(M.normalMap.channel),displacementMapUv:et&&y(M.displacementMap.channel),emissiveMapUv:xe&&y(M.emissiveMap.channel),metalnessMapUv:ot&&y(M.metalnessMap.channel),roughnessMapUv:G&&y(M.roughnessMap.channel),anisotropyMapUv:H&&y(M.anisotropyMap.channel),clearcoatMapUv:ye&&y(M.clearcoatMap.channel),clearcoatNormalMapUv:le&&y(M.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:Se&&y(M.clearcoatRoughnessMap.channel),iridescenceMapUv:ve&&y(M.iridescenceMap.channel),iridescenceThicknessMapUv:Q&&y(M.iridescenceThicknessMap.channel),sheenColorMapUv:ae&&y(M.sheenColorMap.channel),sheenRoughnessMapUv:Ce&&y(M.sheenRoughnessMap.channel),specularMapUv:we&&y(M.specularMap.channel),specularColorMapUv:ue&&y(M.specularColorMap.channel),specularIntensityMapUv:Le&&y(M.specularIntensityMap.channel),transmissionMapUv:P&&y(M.transmissionMap.channel),thicknessMapUv:de&&y(M.thicknessMap.channel),alphaMapUv:oe&&y(M.alphaMap.channel),vertexTangents:!!X.attributes.tangent&&(Ve||J),vertexColors:M.vertexColors,vertexAlphas:M.vertexColors===!0&&!!X.attributes.color&&X.attributes.color.itemSize===4,pointsUvs:z.isPoints===!0&&!!X.attributes.uv&&(Be||oe),fog:!!K,useFog:M.fog===!0,fogExp2:!!K&&K.isFogExp2,flatShading:M.flatShading===!0&&M.wireframe===!1,sizeAttenuation:M.sizeAttenuation===!0,logarithmicDepthBuffer:h,reversedDepthBuffer:fe,skinning:z.isSkinnedMesh===!0,morphTargets:X.morphAttributes.position!==void 0,morphNormals:X.morphAttributes.normal!==void 0,morphColors:X.morphAttributes.color!==void 0,morphTargetsCount:be,morphTextureStride:He,numDirLights:_.directional.length,numPointLights:_.point.length,numSpotLights:_.spot.length,numSpotLightMaps:_.spotLightMap.length,numRectAreaLights:_.rectArea.length,numHemiLights:_.hemi.length,numDirLightShadows:_.directionalShadowMap.length,numPointLightShadows:_.pointShadowMap.length,numSpotLightShadows:_.spotShadowMap.length,numSpotLightShadowsWithMaps:_.numSpotLightShadowsWithMaps,numLightProbes:_.numLightProbes,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:M.dithering,shadowMapEnabled:i.shadowMap.enabled&&D.length>0,shadowMapType:i.shadowMap.type,toneMapping:Ne,decodeVideoTexture:Be&&M.map.isVideoTexture===!0&&je.getTransfer(M.map.colorSpace)===it,decodeVideoTextureEmissive:xe&&M.emissiveMap.isVideoTexture===!0&&je.getTransfer(M.emissiveMap.colorSpace)===it,premultipliedAlpha:M.premultipliedAlpha,doubleSided:M.side===Rn,flipSided:M.side===Ht,useDepthPacking:M.depthPacking>=0,depthPacking:M.depthPacking||0,index0AttributeName:M.index0AttributeName,extensionClipCullDistance:ge&&M.extensions.clipCullDistance===!0&&n.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ge&&M.extensions.multiDraw===!0||Me)&&n.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:M.customProgramCacheKey()};return lt.vertexUv1s=c.has(1),lt.vertexUv2s=c.has(2),lt.vertexUv3s=c.has(3),c.clear(),lt}function f(M){const _=[];if(M.shaderID?_.push(M.shaderID):(_.push(M.customVertexShaderID),_.push(M.customFragmentShaderID)),M.defines!==void 0)for(const D in M.defines)_.push(D),_.push(M.defines[D]);return M.isRawShaderMaterial===!1&&(E(_,M),T(_,M),_.push(i.outputColorSpace)),_.push(M.customProgramCacheKey),_.join()}function E(M,_){M.push(_.precision),M.push(_.outputColorSpace),M.push(_.envMapMode),M.push(_.envMapCubeUVHeight),M.push(_.mapUv),M.push(_.alphaMapUv),M.push(_.lightMapUv),M.push(_.aoMapUv),M.push(_.bumpMapUv),M.push(_.normalMapUv),M.push(_.displacementMapUv),M.push(_.emissiveMapUv),M.push(_.metalnessMapUv),M.push(_.roughnessMapUv),M.push(_.anisotropyMapUv),M.push(_.clearcoatMapUv),M.push(_.clearcoatNormalMapUv),M.push(_.clearcoatRoughnessMapUv),M.push(_.iridescenceMapUv),M.push(_.iridescenceThicknessMapUv),M.push(_.sheenColorMapUv),M.push(_.sheenRoughnessMapUv),M.push(_.specularMapUv),M.push(_.specularColorMapUv),M.push(_.specularIntensityMapUv),M.push(_.transmissionMapUv),M.push(_.thicknessMapUv),M.push(_.combine),M.push(_.fogExp2),M.push(_.sizeAttenuation),M.push(_.morphTargetsCount),M.push(_.morphAttributeCount),M.push(_.numDirLights),M.push(_.numPointLights),M.push(_.numSpotLights),M.push(_.numSpotLightMaps),M.push(_.numHemiLights),M.push(_.numRectAreaLights),M.push(_.numDirLightShadows),M.push(_.numPointLightShadows),M.push(_.numSpotLightShadows),M.push(_.numSpotLightShadowsWithMaps),M.push(_.numLightProbes),M.push(_.shadowMapType),M.push(_.toneMapping),M.push(_.numClippingPlanes),M.push(_.numClipIntersection),M.push(_.depthPacking)}function T(M,_){o.disableAll(),_.supportsVertexTextures&&o.enable(0),_.instancing&&o.enable(1),_.instancingColor&&o.enable(2),_.instancingMorph&&o.enable(3),_.matcap&&o.enable(4),_.envMap&&o.enable(5),_.normalMapObjectSpace&&o.enable(6),_.normalMapTangentSpace&&o.enable(7),_.clearcoat&&o.enable(8),_.iridescence&&o.enable(9),_.alphaTest&&o.enable(10),_.vertexColors&&o.enable(11),_.vertexAlphas&&o.enable(12),_.vertexUv1s&&o.enable(13),_.vertexUv2s&&o.enable(14),_.vertexUv3s&&o.enable(15),_.vertexTangents&&o.enable(16),_.anisotropy&&o.enable(17),_.alphaHash&&o.enable(18),_.batching&&o.enable(19),_.dispersion&&o.enable(20),_.batchingColor&&o.enable(21),_.gradientMap&&o.enable(22),M.push(o.mask),o.disableAll(),_.fog&&o.enable(0),_.useFog&&o.enable(1),_.flatShading&&o.enable(2),_.logarithmicDepthBuffer&&o.enable(3),_.reversedDepthBuffer&&o.enable(4),_.skinning&&o.enable(5),_.morphTargets&&o.enable(6),_.morphNormals&&o.enable(7),_.morphColors&&o.enable(8),_.premultipliedAlpha&&o.enable(9),_.shadowMapEnabled&&o.enable(10),_.doubleSided&&o.enable(11),_.flipSided&&o.enable(12),_.useDepthPacking&&o.enable(13),_.dithering&&o.enable(14),_.transmission&&o.enable(15),_.sheen&&o.enable(16),_.opaque&&o.enable(17),_.pointsUvs&&o.enable(18),_.decodeVideoTexture&&o.enable(19),_.decodeVideoTextureEmissive&&o.enable(20),_.alphaToCoverage&&o.enable(21),M.push(o.mask)}function w(M){const _=g[M.type];let D;if(_){const F=xn[_];D=rh.clone(F.uniforms)}else D=M.uniforms;return D}function L(M,_){let D;for(let F=0,z=d.length;F<z;F++){const K=d[F];if(K.cacheKey===_){D=K,++D.usedTimes;break}}return D===void 0&&(D=new zm(i,_,M,r),d.push(D)),D}function S(M){if(--M.usedTimes===0){const _=d.indexOf(M);d[_]=d[d.length-1],d.pop(),M.destroy()}}function R(M){l.remove(M)}function B(){l.dispose()}return{getParameters:m,getProgramCacheKey:f,getUniforms:w,acquireProgram:L,releaseProgram:S,releaseShaderCache:R,programs:d,dispose:B}}function Xm(){let i=new WeakMap;function e(s){return i.has(s)}function t(s){let o=i.get(s);return o===void 0&&(o={},i.set(s,o)),o}function n(s){i.delete(s)}function a(s,o,l){i.get(s)[o]=l}function r(){i=new WeakMap}return{has:e,get:t,remove:n,update:a,dispose:r}}function Km(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.material.id!==e.material.id?i.material.id-e.material.id:i.z!==e.z?i.z-e.z:i.id-e.id}function wl(i,e){return i.groupOrder!==e.groupOrder?i.groupOrder-e.groupOrder:i.renderOrder!==e.renderOrder?i.renderOrder-e.renderOrder:i.z!==e.z?e.z-i.z:i.id-e.id}function Al(){const i=[];let e=0;const t=[],n=[],a=[];function r(){e=0,t.length=0,n.length=0,a.length=0}function s(h,u,p,g,y,m){let f=i[e];return f===void 0?(f={id:h.id,object:h,geometry:u,material:p,groupOrder:g,renderOrder:h.renderOrder,z:y,group:m},i[e]=f):(f.id=h.id,f.object=h,f.geometry=u,f.material=p,f.groupOrder=g,f.renderOrder=h.renderOrder,f.z=y,f.group=m),e++,f}function o(h,u,p,g,y,m){const f=s(h,u,p,g,y,m);p.transmission>0?n.push(f):p.transparent===!0?a.push(f):t.push(f)}function l(h,u,p,g,y,m){const f=s(h,u,p,g,y,m);p.transmission>0?n.unshift(f):p.transparent===!0?a.unshift(f):t.unshift(f)}function c(h,u){t.length>1&&t.sort(h||Km),n.length>1&&n.sort(u||wl),a.length>1&&a.sort(u||wl)}function d(){for(let h=e,u=i.length;h<u;h++){const p=i[h];if(p.id===null)break;p.id=null,p.object=null,p.geometry=null,p.material=null,p.group=null}}return{opaque:t,transmissive:n,transparent:a,init:r,push:o,unshift:l,finish:d,sort:c}}function qm(){let i=new WeakMap;function e(n,a){const r=i.get(n);let s;return r===void 0?(s=new Al,i.set(n,[s])):a>=r.length?(s=new Al,r.push(s)):s=r[a],s}function t(){i=new WeakMap}return{get:e,dispose:t}}function Ym(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={direction:new C,color:new Xe};break;case"SpotLight":t={position:new C,direction:new C,color:new Xe,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":t={position:new C,color:new Xe,distance:0,decay:0};break;case"HemisphereLight":t={direction:new C,skyColor:new Xe,groundColor:new Xe};break;case"RectAreaLight":t={color:new Xe,position:new C,halfWidth:new C,halfHeight:new C};break}return i[e.id]=t,t}}}function jm(){const i={};return{get:function(e){if(i[e.id]!==void 0)return i[e.id];let t;switch(e.type){case"DirectionalLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"SpotLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue};break;case"PointLight":t={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new Ue,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[e.id]=t,t}}}let $m=0;function Zm(i,e){return(e.castShadow?2:0)-(i.castShadow?2:0)+(e.map?1:0)-(i.map?1:0)}function Jm(i){const e=new Ym,t=jm(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new C);const a=new C,r=new st,s=new st;function o(c){let d=0,h=0,u=0;for(let M=0;M<9;M++)n.probe[M].set(0,0,0);let p=0,g=0,y=0,m=0,f=0,E=0,T=0,w=0,L=0,S=0,R=0;c.sort(Zm);for(let M=0,_=c.length;M<_;M++){const D=c[M],F=D.color,z=D.intensity,K=D.distance,X=D.shadow&&D.shadow.map?D.shadow.map.texture:null;if(D.isAmbientLight)d+=F.r*z,h+=F.g*z,u+=F.b*z;else if(D.isLightProbe){for(let Y=0;Y<9;Y++)n.probe[Y].addScaledVector(D.sh.coefficients[Y],z);R++}else if(D.isDirectionalLight){const Y=e.get(D);if(Y.color.copy(D.color).multiplyScalar(D.intensity),D.castShadow){const ee=D.shadow,W=t.get(D);W.shadowIntensity=ee.intensity,W.shadowBias=ee.bias,W.shadowNormalBias=ee.normalBias,W.shadowRadius=ee.radius,W.shadowMapSize=ee.mapSize,n.directionalShadow[p]=W,n.directionalShadowMap[p]=X,n.directionalShadowMatrix[p]=D.shadow.matrix,E++}n.directional[p]=Y,p++}else if(D.isSpotLight){const Y=e.get(D);Y.position.setFromMatrixPosition(D.matrixWorld),Y.color.copy(F).multiplyScalar(z),Y.distance=K,Y.coneCos=Math.cos(D.angle),Y.penumbraCos=Math.cos(D.angle*(1-D.penumbra)),Y.decay=D.decay,n.spot[y]=Y;const ee=D.shadow;if(D.map&&(n.spotLightMap[L]=D.map,L++,ee.updateMatrices(D),D.castShadow&&S++),n.spotLightMatrix[y]=ee.matrix,D.castShadow){const W=t.get(D);W.shadowIntensity=ee.intensity,W.shadowBias=ee.bias,W.shadowNormalBias=ee.normalBias,W.shadowRadius=ee.radius,W.shadowMapSize=ee.mapSize,n.spotShadow[y]=W,n.spotShadowMap[y]=X,w++}y++}else if(D.isRectAreaLight){const Y=e.get(D);Y.color.copy(F).multiplyScalar(z),Y.halfWidth.set(D.width*.5,0,0),Y.halfHeight.set(0,D.height*.5,0),n.rectArea[m]=Y,m++}else if(D.isPointLight){const Y=e.get(D);if(Y.color.copy(D.color).multiplyScalar(D.intensity),Y.distance=D.distance,Y.decay=D.decay,D.castShadow){const ee=D.shadow,W=t.get(D);W.shadowIntensity=ee.intensity,W.shadowBias=ee.bias,W.shadowNormalBias=ee.normalBias,W.shadowRadius=ee.radius,W.shadowMapSize=ee.mapSize,W.shadowCameraNear=ee.camera.near,W.shadowCameraFar=ee.camera.far,n.pointShadow[g]=W,n.pointShadowMap[g]=X,n.pointShadowMatrix[g]=D.shadow.matrix,T++}n.point[g]=Y,g++}else if(D.isHemisphereLight){const Y=e.get(D);Y.skyColor.copy(D.color).multiplyScalar(z),Y.groundColor.copy(D.groundColor).multiplyScalar(z),n.hemi[f]=Y,f++}}m>0&&(i.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=ce.LTC_FLOAT_1,n.rectAreaLTC2=ce.LTC_FLOAT_2):(n.rectAreaLTC1=ce.LTC_HALF_1,n.rectAreaLTC2=ce.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=h,n.ambient[2]=u;const B=n.hash;(B.directionalLength!==p||B.pointLength!==g||B.spotLength!==y||B.rectAreaLength!==m||B.hemiLength!==f||B.numDirectionalShadows!==E||B.numPointShadows!==T||B.numSpotShadows!==w||B.numSpotMaps!==L||B.numLightProbes!==R)&&(n.directional.length=p,n.spot.length=y,n.rectArea.length=m,n.point.length=g,n.hemi.length=f,n.directionalShadow.length=E,n.directionalShadowMap.length=E,n.pointShadow.length=T,n.pointShadowMap.length=T,n.spotShadow.length=w,n.spotShadowMap.length=w,n.directionalShadowMatrix.length=E,n.pointShadowMatrix.length=T,n.spotLightMatrix.length=w+L-S,n.spotLightMap.length=L,n.numSpotLightShadowsWithMaps=S,n.numLightProbes=R,B.directionalLength=p,B.pointLength=g,B.spotLength=y,B.rectAreaLength=m,B.hemiLength=f,B.numDirectionalShadows=E,B.numPointShadows=T,B.numSpotShadows=w,B.numSpotMaps=L,B.numLightProbes=R,n.version=$m++)}function l(c,d){let h=0,u=0,p=0,g=0,y=0;const m=d.matrixWorldInverse;for(let f=0,E=c.length;f<E;f++){const T=c[f];if(T.isDirectionalLight){const w=n.directional[h];w.direction.setFromMatrixPosition(T.matrixWorld),a.setFromMatrixPosition(T.target.matrixWorld),w.direction.sub(a),w.direction.transformDirection(m),h++}else if(T.isSpotLight){const w=n.spot[p];w.position.setFromMatrixPosition(T.matrixWorld),w.position.applyMatrix4(m),w.direction.setFromMatrixPosition(T.matrixWorld),a.setFromMatrixPosition(T.target.matrixWorld),w.direction.sub(a),w.direction.transformDirection(m),p++}else if(T.isRectAreaLight){const w=n.rectArea[g];w.position.setFromMatrixPosition(T.matrixWorld),w.position.applyMatrix4(m),s.identity(),r.copy(T.matrixWorld),r.premultiply(m),s.extractRotation(r),w.halfWidth.set(T.width*.5,0,0),w.halfHeight.set(0,T.height*.5,0),w.halfWidth.applyMatrix4(s),w.halfHeight.applyMatrix4(s),g++}else if(T.isPointLight){const w=n.point[u];w.position.setFromMatrixPosition(T.matrixWorld),w.position.applyMatrix4(m),u++}else if(T.isHemisphereLight){const w=n.hemi[y];w.direction.setFromMatrixPosition(T.matrixWorld),w.direction.transformDirection(m),y++}}}return{setup:o,setupView:l,state:n}}function Cl(i){const e=new Jm(i),t=[],n=[];function a(d){c.camera=d,t.length=0,n.length=0}function r(d){t.push(d)}function s(d){n.push(d)}function o(){e.setup(t)}function l(d){e.setupView(t,d)}const c={lightsArray:t,shadowsArray:n,camera:null,lights:e,transmissionRenderTarget:{}};return{init:a,state:c,setupLights:o,setupLightsView:l,pushLight:r,pushShadow:s}}function Qm(i){let e=new WeakMap;function t(a,r=0){const s=e.get(a);let o;return s===void 0?(o=new Cl(i),e.set(a,[o])):r>=s.length?(o=new Cl(i),s.push(o)):o=s[r],o}function n(){e=new WeakMap}return{get:t,dispose:n}}const e0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,t0=`uniform sampler2D shadow_pass;
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
}`;function n0(i,e,t){let n=new oo;const a=new Ue,r=new Ue,s=new pt,o=new yh({depthPacking:pd}),l=new Mh,c={},d=t.maxTextureSize,h={[Zn]:Ht,[Ht]:Zn,[Rn]:Rn},u=new Fn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new Ue},radius:{value:4}},vertexShader:e0,fragmentShader:t0}),p=u.clone();p.defines.HORIZONTAL_PASS=1;const g=new sn;g.setAttribute("position",new rn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new Tt(g,u),m=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=kl;let f=this.type;this.render=function(S,R,B){if(m.enabled===!1||m.autoUpdate===!1&&m.needsUpdate===!1||S.length===0)return;const M=i.getRenderTarget(),_=i.getActiveCubeFace(),D=i.getActiveMipmapLevel(),F=i.state;F.setBlending(In),F.buffers.depth.getReversed()===!0?F.buffers.color.setClear(0,0,0,0):F.buffers.color.setClear(1,1,1,1),F.buffers.depth.setTest(!0),F.setScissorTest(!1);const z=f!==An&&this.type===An,K=f===An&&this.type!==An;for(let X=0,Y=S.length;X<Y;X++){const ee=S[X],W=ee.shadow;if(W===void 0){Ie("WebGLShadowMap:",ee,"has no shadow.");continue}if(W.autoUpdate===!1&&W.needsUpdate===!1)continue;a.copy(W.mapSize);const ie=W.getFrameExtents();if(a.multiply(ie),r.copy(W.mapSize),(a.x>d||a.y>d)&&(a.x>d&&(r.x=Math.floor(d/ie.x),a.x=r.x*ie.x,W.mapSize.x=r.x),a.y>d&&(r.y=Math.floor(d/ie.y),a.y=r.y*ie.y,W.mapSize.y=r.y)),W.map===null||z===!0||K===!0){const be=this.type!==An?{minFilter:Zt,magFilter:Zt}:{};W.map!==null&&W.map.dispose(),W.map=new fi(a.x,a.y,be),W.map.texture.name=ee.name+".shadowMap",W.camera.updateProjectionMatrix()}i.setRenderTarget(W.map),i.clear();const re=W.getViewportCount();for(let be=0;be<re;be++){const He=W.getViewport(be);s.set(r.x*He.x,r.y*He.y,r.x*He.z,r.y*He.w),F.viewport(s),W.updateMatrices(ee,be),n=W.getFrustum(),w(R,B,W.camera,ee,this.type)}W.isPointLightShadow!==!0&&this.type===An&&E(W,B),W.needsUpdate=!1}f=this.type,m.needsUpdate=!1,i.setRenderTarget(M,_,D)};function E(S,R){const B=e.update(y);u.defines.VSM_SAMPLES!==S.blurSamples&&(u.defines.VSM_SAMPLES=S.blurSamples,p.defines.VSM_SAMPLES=S.blurSamples,u.needsUpdate=!0,p.needsUpdate=!0),S.mapPass===null&&(S.mapPass=new fi(a.x,a.y)),u.uniforms.shadow_pass.value=S.map.texture,u.uniforms.resolution.value=S.mapSize,u.uniforms.radius.value=S.radius,i.setRenderTarget(S.mapPass),i.clear(),i.renderBufferDirect(R,null,B,u,y,null),p.uniforms.shadow_pass.value=S.mapPass.texture,p.uniforms.resolution.value=S.mapSize,p.uniforms.radius.value=S.radius,i.setRenderTarget(S.map),i.clear(),i.renderBufferDirect(R,null,B,p,y,null)}function T(S,R,B,M){let _=null;const D=B.isPointLight===!0?S.customDistanceMaterial:S.customDepthMaterial;if(D!==void 0)_=D;else if(_=B.isPointLight===!0?l:o,i.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const F=_.uuid,z=R.uuid;let K=c[F];K===void 0&&(K={},c[F]=K);let X=K[z];X===void 0&&(X=_.clone(),K[z]=X,R.addEventListener("dispose",L)),_=X}if(_.visible=R.visible,_.wireframe=R.wireframe,M===An?_.side=R.shadowSide!==null?R.shadowSide:R.side:_.side=R.shadowSide!==null?R.shadowSide:h[R.side],_.alphaMap=R.alphaMap,_.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,_.map=R.map,_.clipShadows=R.clipShadows,_.clippingPlanes=R.clippingPlanes,_.clipIntersection=R.clipIntersection,_.displacementMap=R.displacementMap,_.displacementScale=R.displacementScale,_.displacementBias=R.displacementBias,_.wireframeLinewidth=R.wireframeLinewidth,_.linewidth=R.linewidth,B.isPointLight===!0&&_.isMeshDistanceMaterial===!0){const F=i.properties.get(_);F.light=B}return _}function w(S,R,B,M,_){if(S.visible===!1)return;if(S.layers.test(R.layers)&&(S.isMesh||S.isLine||S.isPoints)&&(S.castShadow||S.receiveShadow&&_===An)&&(!S.frustumCulled||n.intersectsObject(S))){S.modelViewMatrix.multiplyMatrices(B.matrixWorldInverse,S.matrixWorld);const z=e.update(S),K=S.material;if(Array.isArray(K)){const X=z.groups;for(let Y=0,ee=X.length;Y<ee;Y++){const W=X[Y],ie=K[W.materialIndex];if(ie&&ie.visible){const re=T(S,ie,M,_);S.onBeforeShadow(i,S,R,B,z,re,W),i.renderBufferDirect(B,null,z,re,S,W),S.onAfterShadow(i,S,R,B,z,re,W)}}}else if(K.visible){const X=T(S,K,M,_);S.onBeforeShadow(i,S,R,B,z,X,null),i.renderBufferDirect(B,null,z,X,S,null),S.onAfterShadow(i,S,R,B,z,X,null)}}const F=S.children;for(let z=0,K=F.length;z<K;z++)w(F[z],R,B,M,_)}function L(S){S.target.removeEventListener("dispose",L);for(const B in c){const M=c[B],_=S.target.uuid;_ in M&&(M[_].dispose(),delete M[_])}}}const i0={[is]:as,[rs]:ls,[ss]:cs,[zi]:os,[as]:is,[ls]:rs,[cs]:ss,[os]:zi};function a0(i,e){function t(){let P=!1;const de=new pt;let se=null;const oe=new pt(0,0,0,0);return{setMask:function(te){se!==te&&!P&&(i.colorMask(te,te,te,te),se=te)},setLocked:function(te){P=te},setClear:function(te,Z,ge,Ne,lt){lt===!0&&(te*=Ne,Z*=Ne,ge*=Ne),de.set(te,Z,ge,Ne),oe.equals(de)===!1&&(i.clearColor(te,Z,ge,Ne),oe.copy(de))},reset:function(){P=!1,se=null,oe.set(-1,0,0,0)}}}function n(){let P=!1,de=!1,se=null,oe=null,te=null;return{setReversed:function(Z){if(de!==Z){const ge=e.get("EXT_clip_control");Z?ge.clipControlEXT(ge.LOWER_LEFT_EXT,ge.ZERO_TO_ONE_EXT):ge.clipControlEXT(ge.LOWER_LEFT_EXT,ge.NEGATIVE_ONE_TO_ONE_EXT),de=Z;const Ne=te;te=null,this.setClear(Ne)}},getReversed:function(){return de},setTest:function(Z){Z?$(i.DEPTH_TEST):fe(i.DEPTH_TEST)},setMask:function(Z){se!==Z&&!P&&(i.depthMask(Z),se=Z)},setFunc:function(Z){if(de&&(Z=i0[Z]),oe!==Z){switch(Z){case is:i.depthFunc(i.NEVER);break;case as:i.depthFunc(i.ALWAYS);break;case rs:i.depthFunc(i.LESS);break;case zi:i.depthFunc(i.LEQUAL);break;case ss:i.depthFunc(i.EQUAL);break;case os:i.depthFunc(i.GEQUAL);break;case ls:i.depthFunc(i.GREATER);break;case cs:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}oe=Z}},setLocked:function(Z){P=Z},setClear:function(Z){te!==Z&&(de&&(Z=1-Z),i.clearDepth(Z),te=Z)},reset:function(){P=!1,se=null,oe=null,te=null,de=!1}}}function a(){let P=!1,de=null,se=null,oe=null,te=null,Z=null,ge=null,Ne=null,lt=null;return{setTest:function(tt){P||(tt?$(i.STENCIL_TEST):fe(i.STENCIL_TEST))},setMask:function(tt){de!==tt&&!P&&(i.stencilMask(tt),de=tt)},setFunc:function(tt,pn,on){(se!==tt||oe!==pn||te!==on)&&(i.stencilFunc(tt,pn,on),se=tt,oe=pn,te=on)},setOp:function(tt,pn,on){(Z!==tt||ge!==pn||Ne!==on)&&(i.stencilOp(tt,pn,on),Z=tt,ge=pn,Ne=on)},setLocked:function(tt){P=tt},setClear:function(tt){lt!==tt&&(i.clearStencil(tt),lt=tt)},reset:function(){P=!1,de=null,se=null,oe=null,te=null,Z=null,ge=null,Ne=null,lt=null}}}const r=new t,s=new n,o=new a,l=new WeakMap,c=new WeakMap;let d={},h={},u=new WeakMap,p=[],g=null,y=!1,m=null,f=null,E=null,T=null,w=null,L=null,S=null,R=new Xe(0,0,0),B=0,M=!1,_=null,D=null,F=null,z=null,K=null;const X=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let Y=!1,ee=0;const W=i.getParameter(i.VERSION);W.indexOf("WebGL")!==-1?(ee=parseFloat(/^WebGL (\d)/.exec(W)[1]),Y=ee>=1):W.indexOf("OpenGL ES")!==-1&&(ee=parseFloat(/^OpenGL ES (\d)/.exec(W)[1]),Y=ee>=2);let ie=null,re={};const be=i.getParameter(i.SCISSOR_BOX),He=i.getParameter(i.VIEWPORT),$e=new pt().fromArray(be),Qe=new pt().fromArray(He);function Ze(P,de,se,oe){const te=new Uint8Array(4),Z=i.createTexture();i.bindTexture(P,Z),i.texParameteri(P,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(P,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let ge=0;ge<se;ge++)P===i.TEXTURE_3D||P===i.TEXTURE_2D_ARRAY?i.texImage3D(de,0,i.RGBA,1,1,oe,0,i.RGBA,i.UNSIGNED_BYTE,te):i.texImage2D(de+ge,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,te);return Z}const j={};j[i.TEXTURE_2D]=Ze(i.TEXTURE_2D,i.TEXTURE_2D,1),j[i.TEXTURE_CUBE_MAP]=Ze(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),j[i.TEXTURE_2D_ARRAY]=Ze(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),j[i.TEXTURE_3D]=Ze(i.TEXTURE_3D,i.TEXTURE_3D,1,1),r.setClear(0,0,0,1),s.setClear(1),o.setClear(0),$(i.DEPTH_TEST),s.setFunc(zi),Ge(!1),Ve(wo),$(i.CULL_FACE),qe(In);function $(P){d[P]!==!0&&(i.enable(P),d[P]=!0)}function fe(P){d[P]!==!1&&(i.disable(P),d[P]=!1)}function De(P,de){return h[P]!==de?(i.bindFramebuffer(P,de),h[P]=de,P===i.DRAW_FRAMEBUFFER&&(h[i.FRAMEBUFFER]=de),P===i.FRAMEBUFFER&&(h[i.DRAW_FRAMEBUFFER]=de),!0):!1}function Me(P,de){let se=p,oe=!1;if(P){se=u.get(de),se===void 0&&(se=[],u.set(de,se));const te=P.textures;if(se.length!==te.length||se[0]!==i.COLOR_ATTACHMENT0){for(let Z=0,ge=te.length;Z<ge;Z++)se[Z]=i.COLOR_ATTACHMENT0+Z;se.length=te.length,oe=!0}}else se[0]!==i.BACK&&(se[0]=i.BACK,oe=!0);oe&&i.drawBuffers(se)}function Be(P){return g!==P?(i.useProgram(P),g=P,!0):!1}const _t={[li]:i.FUNC_ADD,[Gc]:i.FUNC_SUBTRACT,[Vc]:i.FUNC_REVERSE_SUBTRACT};_t[Hc]=i.MIN,_t[Wc]=i.MAX;const ke={[Xc]:i.ZERO,[Kc]:i.ONE,[qc]:i.SRC_COLOR,[ts]:i.SRC_ALPHA,[Qc]:i.SRC_ALPHA_SATURATE,[Zc]:i.DST_COLOR,[jc]:i.DST_ALPHA,[Yc]:i.ONE_MINUS_SRC_COLOR,[ns]:i.ONE_MINUS_SRC_ALPHA,[Jc]:i.ONE_MINUS_DST_COLOR,[$c]:i.ONE_MINUS_DST_ALPHA,[ed]:i.CONSTANT_COLOR,[td]:i.ONE_MINUS_CONSTANT_COLOR,[nd]:i.CONSTANT_ALPHA,[id]:i.ONE_MINUS_CONSTANT_ALPHA};function qe(P,de,se,oe,te,Z,ge,Ne,lt,tt){if(P===In){y===!0&&(fe(i.BLEND),y=!1);return}if(y===!1&&($(i.BLEND),y=!0),P!==zc){if(P!==m||tt!==M){if((f!==li||w!==li)&&(i.blendEquation(i.FUNC_ADD),f=li,w=li),tt)switch(P){case Bi:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ao:i.blendFunc(i.ONE,i.ONE);break;case Co:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case Ro:i.blendFuncSeparate(i.DST_COLOR,i.ONE_MINUS_SRC_ALPHA,i.ZERO,i.ONE);break;default:mt("WebGLState: Invalid blending: ",P);break}else switch(P){case Bi:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case Ao:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE,i.ONE,i.ONE);break;case Co:mt("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Ro:mt("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:mt("WebGLState: Invalid blending: ",P);break}E=null,T=null,L=null,S=null,R.set(0,0,0),B=0,m=P,M=tt}return}te=te||de,Z=Z||se,ge=ge||oe,(de!==f||te!==w)&&(i.blendEquationSeparate(_t[de],_t[te]),f=de,w=te),(se!==E||oe!==T||Z!==L||ge!==S)&&(i.blendFuncSeparate(ke[se],ke[oe],ke[Z],ke[ge]),E=se,T=oe,L=Z,S=ge),(Ne.equals(R)===!1||lt!==B)&&(i.blendColor(Ne.r,Ne.g,Ne.b,lt),R.copy(Ne),B=lt),m=P,M=!1}function A(P,de){P.side===Rn?fe(i.CULL_FACE):$(i.CULL_FACE);let se=P.side===Ht;de&&(se=!se),Ge(se),P.blending===Bi&&P.transparent===!1?qe(In):qe(P.blending,P.blendEquation,P.blendSrc,P.blendDst,P.blendEquationAlpha,P.blendSrcAlpha,P.blendDstAlpha,P.blendColor,P.blendAlpha,P.premultipliedAlpha),s.setFunc(P.depthFunc),s.setTest(P.depthTest),s.setMask(P.depthWrite),r.setMask(P.colorWrite);const oe=P.stencilWrite;o.setTest(oe),oe&&(o.setMask(P.stencilWriteMask),o.setFunc(P.stencilFunc,P.stencilRef,P.stencilFuncMask),o.setOp(P.stencilFail,P.stencilZFail,P.stencilZPass)),xe(P.polygonOffset,P.polygonOffsetFactor,P.polygonOffsetUnits),P.alphaToCoverage===!0?$(i.SAMPLE_ALPHA_TO_COVERAGE):fe(i.SAMPLE_ALPHA_TO_COVERAGE)}function Ge(P){_!==P&&(P?i.frontFace(i.CW):i.frontFace(i.CCW),_=P)}function Ve(P){P!==Bc?($(i.CULL_FACE),P!==D&&(P===wo?i.cullFace(i.BACK):P===kc?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):fe(i.CULL_FACE),D=P}function et(P){P!==F&&(Y&&i.lineWidth(P),F=P)}function xe(P,de,se){P?($(i.POLYGON_OFFSET_FILL),(z!==de||K!==se)&&(i.polygonOffset(de,se),z=de,K=se)):fe(i.POLYGON_OFFSET_FILL)}function ot(P){P?$(i.SCISSOR_TEST):fe(i.SCISSOR_TEST)}function G(P){P===void 0&&(P=i.TEXTURE0+X-1),ie!==P&&(i.activeTexture(P),ie=P)}function J(P,de,se){se===void 0&&(ie===null?se=i.TEXTURE0+X-1:se=ie);let oe=re[se];oe===void 0&&(oe={type:void 0,texture:void 0},re[se]=oe),(oe.type!==P||oe.texture!==de)&&(ie!==se&&(i.activeTexture(se),ie=se),i.bindTexture(P,de||j[P]),oe.type=P,oe.texture=de)}function b(){const P=re[ie];P!==void 0&&P.type!==void 0&&(i.bindTexture(P.type,null),P.type=void 0,P.texture=void 0)}function x(){try{i.compressedTexImage2D(...arguments)}catch(P){P("WebGLState:",P)}}function N(){try{i.compressedTexImage3D(...arguments)}catch(P){P("WebGLState:",P)}}function V(){try{i.texSubImage2D(...arguments)}catch(P){P("WebGLState:",P)}}function q(){try{i.texSubImage3D(...arguments)}catch(P){P("WebGLState:",P)}}function H(){try{i.compressedTexSubImage2D(...arguments)}catch(P){P("WebGLState:",P)}}function ye(){try{i.compressedTexSubImage3D(...arguments)}catch(P){P("WebGLState:",P)}}function le(){try{i.texStorage2D(...arguments)}catch(P){P("WebGLState:",P)}}function Se(){try{i.texStorage3D(...arguments)}catch(P){P("WebGLState:",P)}}function ve(){try{i.texImage2D(...arguments)}catch(P){P("WebGLState:",P)}}function Q(){try{i.texImage3D(...arguments)}catch(P){P("WebGLState:",P)}}function ae(P){$e.equals(P)===!1&&(i.scissor(P.x,P.y,P.z,P.w),$e.copy(P))}function Ce(P){Qe.equals(P)===!1&&(i.viewport(P.x,P.y,P.z,P.w),Qe.copy(P))}function we(P,de){let se=c.get(de);se===void 0&&(se=new WeakMap,c.set(de,se));let oe=se.get(P);oe===void 0&&(oe=i.getUniformBlockIndex(de,P.name),se.set(P,oe))}function ue(P,de){const oe=c.get(de).get(P);l.get(de)!==oe&&(i.uniformBlockBinding(de,oe,P.__bindingPointIndex),l.set(de,oe))}function Le(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),s.setReversed(!1),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),d={},ie=null,re={},h={},u=new WeakMap,p=[],g=null,y=!1,m=null,f=null,E=null,T=null,w=null,L=null,S=null,R=new Xe(0,0,0),B=0,M=!1,_=null,D=null,F=null,z=null,K=null,$e.set(0,0,i.canvas.width,i.canvas.height),Qe.set(0,0,i.canvas.width,i.canvas.height),r.reset(),s.reset(),o.reset()}return{buffers:{color:r,depth:s,stencil:o},enable:$,disable:fe,bindFramebuffer:De,drawBuffers:Me,useProgram:Be,setBlending:qe,setMaterial:A,setFlipSided:Ge,setCullFace:Ve,setLineWidth:et,setPolygonOffset:xe,setScissorTest:ot,activeTexture:G,bindTexture:J,unbindTexture:b,compressedTexImage2D:x,compressedTexImage3D:N,texImage2D:ve,texImage3D:Q,updateUBOMapping:we,uniformBlockBinding:ue,texStorage2D:le,texStorage3D:Se,texSubImage2D:V,texSubImage3D:q,compressedTexSubImage2D:H,compressedTexSubImage3D:ye,scissor:ae,viewport:Ce,reset:Le}}function r0(i,e,t,n,a,r,s){const o=e.has("WEBGL_multisampled_render_to_texture")?e.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new Ue,d=new WeakMap;let h;const u=new WeakMap;let p=!1;try{p=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function g(b,x){return p?new OffscreenCanvas(b,x):ar("canvas")}function y(b,x,N){let V=1;const q=J(b);if((q.width>N||q.height>N)&&(V=N/Math.max(q.width,q.height)),V<1)if(typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&b instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&b instanceof ImageBitmap||typeof VideoFrame<"u"&&b instanceof VideoFrame){const H=Math.floor(V*q.width),ye=Math.floor(V*q.height);h===void 0&&(h=g(H,ye));const le=x?g(H,ye):h;return le.width=H,le.height=ye,le.getContext("2d").drawImage(b,0,0,H,ye),Ie("WebGLRenderer: Texture has been resized from ("+q.width+"x"+q.height+") to ("+H+"x"+ye+")."),le}else return"data"in b&&Ie("WebGLRenderer: Image in DataTexture is too big ("+q.width+"x"+q.height+")."),b;return b}function m(b){return b.generateMipmaps}function f(b){i.generateMipmap(b)}function E(b){return b.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:b.isWebGL3DRenderTarget?i.TEXTURE_3D:b.isWebGLArrayRenderTarget||b.isCompressedArrayTexture?i.TEXTURE_2D_ARRAY:i.TEXTURE_2D}function T(b,x,N,V,q=!1){if(b!==null){if(i[b]!==void 0)return i[b];Ie("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+b+"'")}let H=x;if(x===i.RED&&(N===i.FLOAT&&(H=i.R32F),N===i.HALF_FLOAT&&(H=i.R16F),N===i.UNSIGNED_BYTE&&(H=i.R8)),x===i.RED_INTEGER&&(N===i.UNSIGNED_BYTE&&(H=i.R8UI),N===i.UNSIGNED_SHORT&&(H=i.R16UI),N===i.UNSIGNED_INT&&(H=i.R32UI),N===i.BYTE&&(H=i.R8I),N===i.SHORT&&(H=i.R16I),N===i.INT&&(H=i.R32I)),x===i.RG&&(N===i.FLOAT&&(H=i.RG32F),N===i.HALF_FLOAT&&(H=i.RG16F),N===i.UNSIGNED_BYTE&&(H=i.RG8)),x===i.RG_INTEGER&&(N===i.UNSIGNED_BYTE&&(H=i.RG8UI),N===i.UNSIGNED_SHORT&&(H=i.RG16UI),N===i.UNSIGNED_INT&&(H=i.RG32UI),N===i.BYTE&&(H=i.RG8I),N===i.SHORT&&(H=i.RG16I),N===i.INT&&(H=i.RG32I)),x===i.RGB_INTEGER&&(N===i.UNSIGNED_BYTE&&(H=i.RGB8UI),N===i.UNSIGNED_SHORT&&(H=i.RGB16UI),N===i.UNSIGNED_INT&&(H=i.RGB32UI),N===i.BYTE&&(H=i.RGB8I),N===i.SHORT&&(H=i.RGB16I),N===i.INT&&(H=i.RGB32I)),x===i.RGBA_INTEGER&&(N===i.UNSIGNED_BYTE&&(H=i.RGBA8UI),N===i.UNSIGNED_SHORT&&(H=i.RGBA16UI),N===i.UNSIGNED_INT&&(H=i.RGBA32UI),N===i.BYTE&&(H=i.RGBA8I),N===i.SHORT&&(H=i.RGBA16I),N===i.INT&&(H=i.RGBA32I)),x===i.RGB&&(N===i.UNSIGNED_INT_5_9_9_9_REV&&(H=i.RGB9_E5),N===i.UNSIGNED_INT_10F_11F_11F_REV&&(H=i.R11F_G11F_B10F)),x===i.RGBA){const ye=q?nr:je.getTransfer(V);N===i.FLOAT&&(H=i.RGBA32F),N===i.HALF_FLOAT&&(H=i.RGBA16F),N===i.UNSIGNED_BYTE&&(H=ye===it?i.SRGB8_ALPHA8:i.RGBA8),N===i.UNSIGNED_SHORT_4_4_4_4&&(H=i.RGBA4),N===i.UNSIGNED_SHORT_5_5_5_1&&(H=i.RGB5_A1)}return(H===i.R16F||H===i.R32F||H===i.RG16F||H===i.RG32F||H===i.RGBA16F||H===i.RGBA32F)&&e.get("EXT_color_buffer_float"),H}function w(b,x){let N;return b?x===null||x===ui||x===pa?N=i.DEPTH24_STENCIL8:x===gn?N=i.DEPTH32F_STENCIL8:x===fa&&(N=i.DEPTH24_STENCIL8,Ie("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):x===null||x===ui||x===pa?N=i.DEPTH_COMPONENT24:x===gn?N=i.DEPTH_COMPONENT32F:x===fa&&(N=i.DEPTH_COMPONENT16),N}function L(b,x){return m(b)===!0||b.isFramebufferTexture&&b.minFilter!==Zt&&b.minFilter!==an?Math.log2(Math.max(x.width,x.height))+1:b.mipmaps!==void 0&&b.mipmaps.length>0?b.mipmaps.length:b.isCompressedTexture&&Array.isArray(b.image)?x.mipmaps.length:1}function S(b){const x=b.target;x.removeEventListener("dispose",S),B(x),x.isVideoTexture&&d.delete(x)}function R(b){const x=b.target;x.removeEventListener("dispose",R),_(x)}function B(b){const x=n.get(b);if(x.__webglInit===void 0)return;const N=b.source,V=u.get(N);if(V){const q=V[x.__cacheKey];q.usedTimes--,q.usedTimes===0&&M(b),Object.keys(V).length===0&&u.delete(N)}n.remove(b)}function M(b){const x=n.get(b);i.deleteTexture(x.__webglTexture);const N=b.source,V=u.get(N);delete V[x.__cacheKey],s.memory.textures--}function _(b){const x=n.get(b);if(b.depthTexture&&(b.depthTexture.dispose(),n.remove(b.depthTexture)),b.isWebGLCubeRenderTarget)for(let V=0;V<6;V++){if(Array.isArray(x.__webglFramebuffer[V]))for(let q=0;q<x.__webglFramebuffer[V].length;q++)i.deleteFramebuffer(x.__webglFramebuffer[V][q]);else i.deleteFramebuffer(x.__webglFramebuffer[V]);x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer[V])}else{if(Array.isArray(x.__webglFramebuffer))for(let V=0;V<x.__webglFramebuffer.length;V++)i.deleteFramebuffer(x.__webglFramebuffer[V]);else i.deleteFramebuffer(x.__webglFramebuffer);if(x.__webglDepthbuffer&&i.deleteRenderbuffer(x.__webglDepthbuffer),x.__webglMultisampledFramebuffer&&i.deleteFramebuffer(x.__webglMultisampledFramebuffer),x.__webglColorRenderbuffer)for(let V=0;V<x.__webglColorRenderbuffer.length;V++)x.__webglColorRenderbuffer[V]&&i.deleteRenderbuffer(x.__webglColorRenderbuffer[V]);x.__webglDepthRenderbuffer&&i.deleteRenderbuffer(x.__webglDepthRenderbuffer)}const N=b.textures;for(let V=0,q=N.length;V<q;V++){const H=n.get(N[V]);H.__webglTexture&&(i.deleteTexture(H.__webglTexture),s.memory.textures--),n.remove(N[V])}n.remove(b)}let D=0;function F(){D=0}function z(){const b=D;return b>=a.maxTextures&&Ie("WebGLTextures: Trying to use "+b+" texture units while this GPU supports only "+a.maxTextures),D+=1,b}function K(b){const x=[];return x.push(b.wrapS),x.push(b.wrapT),x.push(b.wrapR||0),x.push(b.magFilter),x.push(b.minFilter),x.push(b.anisotropy),x.push(b.internalFormat),x.push(b.format),x.push(b.type),x.push(b.generateMipmaps),x.push(b.premultiplyAlpha),x.push(b.flipY),x.push(b.unpackAlignment),x.push(b.colorSpace),x.join()}function X(b,x){const N=n.get(b);if(b.isVideoTexture&&ot(b),b.isRenderTargetTexture===!1&&b.isExternalTexture!==!0&&b.version>0&&N.__version!==b.version){const V=b.image;if(V===null)Ie("WebGLRenderer: Texture marked for update but no image data found.");else if(V.complete===!1)Ie("WebGLRenderer: Texture marked for update but image is incomplete");else{j(N,b,x);return}}else b.isExternalTexture&&(N.__webglTexture=b.sourceTexture?b.sourceTexture:null);t.bindTexture(i.TEXTURE_2D,N.__webglTexture,i.TEXTURE0+x)}function Y(b,x){const N=n.get(b);if(b.isRenderTargetTexture===!1&&b.version>0&&N.__version!==b.version){j(N,b,x);return}else b.isExternalTexture&&(N.__webglTexture=b.sourceTexture?b.sourceTexture:null);t.bindTexture(i.TEXTURE_2D_ARRAY,N.__webglTexture,i.TEXTURE0+x)}function ee(b,x){const N=n.get(b);if(b.isRenderTargetTexture===!1&&b.version>0&&N.__version!==b.version){j(N,b,x);return}t.bindTexture(i.TEXTURE_3D,N.__webglTexture,i.TEXTURE0+x)}function W(b,x){const N=n.get(b);if(b.version>0&&N.__version!==b.version){$(N,b,x);return}t.bindTexture(i.TEXTURE_CUBE_MAP,N.__webglTexture,i.TEXTURE0+x)}const ie={[us]:i.REPEAT,[Pn]:i.CLAMP_TO_EDGE,[fs]:i.MIRRORED_REPEAT},re={[Zt]:i.NEAREST,[ud]:i.NEAREST_MIPMAP_NEAREST,[Ta]:i.NEAREST_MIPMAP_LINEAR,[an]:i.LINEAR,[xr]:i.LINEAR_MIPMAP_NEAREST,[di]:i.LINEAR_MIPMAP_LINEAR},be={[xd]:i.NEVER,[bd]:i.ALWAYS,[gd]:i.LESS,[Yl]:i.LEQUAL,[_d]:i.EQUAL,[Md]:i.GEQUAL,[vd]:i.GREATER,[yd]:i.NOTEQUAL};function He(b,x){if(x.type===gn&&e.has("OES_texture_float_linear")===!1&&(x.magFilter===an||x.magFilter===xr||x.magFilter===Ta||x.magFilter===di||x.minFilter===an||x.minFilter===xr||x.minFilter===Ta||x.minFilter===di)&&Ie("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),i.texParameteri(b,i.TEXTURE_WRAP_S,ie[x.wrapS]),i.texParameteri(b,i.TEXTURE_WRAP_T,ie[x.wrapT]),(b===i.TEXTURE_3D||b===i.TEXTURE_2D_ARRAY)&&i.texParameteri(b,i.TEXTURE_WRAP_R,ie[x.wrapR]),i.texParameteri(b,i.TEXTURE_MAG_FILTER,re[x.magFilter]),i.texParameteri(b,i.TEXTURE_MIN_FILTER,re[x.minFilter]),x.compareFunction&&(i.texParameteri(b,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(b,i.TEXTURE_COMPARE_FUNC,be[x.compareFunction])),e.has("EXT_texture_filter_anisotropic")===!0){if(x.magFilter===Zt||x.minFilter!==Ta&&x.minFilter!==di||x.type===gn&&e.has("OES_texture_float_linear")===!1)return;if(x.anisotropy>1||n.get(x).__currentAnisotropy){const N=e.get("EXT_texture_filter_anisotropic");i.texParameterf(b,N.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(x.anisotropy,a.getMaxAnisotropy())),n.get(x).__currentAnisotropy=x.anisotropy}}}function $e(b,x){let N=!1;b.__webglInit===void 0&&(b.__webglInit=!0,x.addEventListener("dispose",S));const V=x.source;let q=u.get(V);q===void 0&&(q={},u.set(V,q));const H=K(x);if(H!==b.__cacheKey){q[H]===void 0&&(q[H]={texture:i.createTexture(),usedTimes:0},s.memory.textures++,N=!0),q[H].usedTimes++;const ye=q[b.__cacheKey];ye!==void 0&&(q[b.__cacheKey].usedTimes--,ye.usedTimes===0&&M(x)),b.__cacheKey=H,b.__webglTexture=q[H].texture}return N}function Qe(b,x,N){return Math.floor(Math.floor(b/N)/x)}function Ze(b,x,N,V){const H=b.updateRanges;if(H.length===0)t.texSubImage2D(i.TEXTURE_2D,0,0,0,x.width,x.height,N,V,x.data);else{H.sort((Q,ae)=>Q.start-ae.start);let ye=0;for(let Q=1;Q<H.length;Q++){const ae=H[ye],Ce=H[Q],we=ae.start+ae.count,ue=Qe(Ce.start,x.width,4),Le=Qe(ae.start,x.width,4);Ce.start<=we+1&&ue===Le&&Qe(Ce.start+Ce.count-1,x.width,4)===ue?ae.count=Math.max(ae.count,Ce.start+Ce.count-ae.start):(++ye,H[ye]=Ce)}H.length=ye+1;const le=i.getParameter(i.UNPACK_ROW_LENGTH),Se=i.getParameter(i.UNPACK_SKIP_PIXELS),ve=i.getParameter(i.UNPACK_SKIP_ROWS);i.pixelStorei(i.UNPACK_ROW_LENGTH,x.width);for(let Q=0,ae=H.length;Q<ae;Q++){const Ce=H[Q],we=Math.floor(Ce.start/4),ue=Math.ceil(Ce.count/4),Le=we%x.width,P=Math.floor(we/x.width),de=ue,se=1;i.pixelStorei(i.UNPACK_SKIP_PIXELS,Le),i.pixelStorei(i.UNPACK_SKIP_ROWS,P),t.texSubImage2D(i.TEXTURE_2D,0,Le,P,de,se,N,V,x.data)}b.clearUpdateRanges(),i.pixelStorei(i.UNPACK_ROW_LENGTH,le),i.pixelStorei(i.UNPACK_SKIP_PIXELS,Se),i.pixelStorei(i.UNPACK_SKIP_ROWS,ve)}}function j(b,x,N){let V=i.TEXTURE_2D;(x.isDataArrayTexture||x.isCompressedArrayTexture)&&(V=i.TEXTURE_2D_ARRAY),x.isData3DTexture&&(V=i.TEXTURE_3D);const q=$e(b,x),H=x.source;t.bindTexture(V,b.__webglTexture,i.TEXTURE0+N);const ye=n.get(H);if(H.version!==ye.__version||q===!0){t.activeTexture(i.TEXTURE0+N);const le=je.getPrimaries(je.workingColorSpace),Se=x.colorSpace===Xn?null:je.getPrimaries(x.colorSpace),ve=x.colorSpace===Xn||le===Se?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,ve);let Q=y(x.image,!1,a.maxTextureSize);Q=G(x,Q);const ae=r.convert(x.format,x.colorSpace),Ce=r.convert(x.type);let we=T(x.internalFormat,ae,Ce,x.colorSpace,x.isVideoTexture);He(V,x);let ue;const Le=x.mipmaps,P=x.isVideoTexture!==!0,de=ye.__version===void 0||q===!0,se=H.dataReady,oe=L(x,Q);if(x.isDepthTexture)we=w(x.format===xa,x.type),de&&(P?t.texStorage2D(i.TEXTURE_2D,1,we,Q.width,Q.height):t.texImage2D(i.TEXTURE_2D,0,we,Q.width,Q.height,0,ae,Ce,null));else if(x.isDataTexture)if(Le.length>0){P&&de&&t.texStorage2D(i.TEXTURE_2D,oe,we,Le[0].width,Le[0].height);for(let te=0,Z=Le.length;te<Z;te++)ue=Le[te],P?se&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,ue.width,ue.height,ae,Ce,ue.data):t.texImage2D(i.TEXTURE_2D,te,we,ue.width,ue.height,0,ae,Ce,ue.data);x.generateMipmaps=!1}else P?(de&&t.texStorage2D(i.TEXTURE_2D,oe,we,Q.width,Q.height),se&&Ze(x,Q,ae,Ce)):t.texImage2D(i.TEXTURE_2D,0,we,Q.width,Q.height,0,ae,Ce,Q.data);else if(x.isCompressedTexture)if(x.isCompressedArrayTexture){P&&de&&t.texStorage3D(i.TEXTURE_2D_ARRAY,oe,we,Le[0].width,Le[0].height,Q.depth);for(let te=0,Z=Le.length;te<Z;te++)if(ue=Le[te],x.format!==fn)if(ae!==null)if(P){if(se)if(x.layerUpdates.size>0){const ge=rl(ue.width,ue.height,x.format,x.type);for(const Ne of x.layerUpdates){const lt=ue.data.subarray(Ne*ge/ue.data.BYTES_PER_ELEMENT,(Ne+1)*ge/ue.data.BYTES_PER_ELEMENT);t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,Ne,ue.width,ue.height,1,ae,lt)}x.clearLayerUpdates()}else t.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,ue.width,ue.height,Q.depth,ae,ue.data)}else t.compressedTexImage3D(i.TEXTURE_2D_ARRAY,te,we,ue.width,ue.height,Q.depth,0,ue.data,0,0);else Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else P?se&&t.texSubImage3D(i.TEXTURE_2D_ARRAY,te,0,0,0,ue.width,ue.height,Q.depth,ae,Ce,ue.data):t.texImage3D(i.TEXTURE_2D_ARRAY,te,we,ue.width,ue.height,Q.depth,0,ae,Ce,ue.data)}else{P&&de&&t.texStorage2D(i.TEXTURE_2D,oe,we,Le[0].width,Le[0].height);for(let te=0,Z=Le.length;te<Z;te++)ue=Le[te],x.format!==fn?ae!==null?P?se&&t.compressedTexSubImage2D(i.TEXTURE_2D,te,0,0,ue.width,ue.height,ae,ue.data):t.compressedTexImage2D(i.TEXTURE_2D,te,we,ue.width,ue.height,0,ue.data):Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):P?se&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,ue.width,ue.height,ae,Ce,ue.data):t.texImage2D(i.TEXTURE_2D,te,we,ue.width,ue.height,0,ae,Ce,ue.data)}else if(x.isDataArrayTexture)if(P){if(de&&t.texStorage3D(i.TEXTURE_2D_ARRAY,oe,we,Q.width,Q.height,Q.depth),se)if(x.layerUpdates.size>0){const te=rl(Q.width,Q.height,x.format,x.type);for(const Z of x.layerUpdates){const ge=Q.data.subarray(Z*te/Q.data.BYTES_PER_ELEMENT,(Z+1)*te/Q.data.BYTES_PER_ELEMENT);t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,Z,Q.width,Q.height,1,ae,Ce,ge)}x.clearLayerUpdates()}else t.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,Q.width,Q.height,Q.depth,ae,Ce,Q.data)}else t.texImage3D(i.TEXTURE_2D_ARRAY,0,we,Q.width,Q.height,Q.depth,0,ae,Ce,Q.data);else if(x.isData3DTexture)P?(de&&t.texStorage3D(i.TEXTURE_3D,oe,we,Q.width,Q.height,Q.depth),se&&t.texSubImage3D(i.TEXTURE_3D,0,0,0,0,Q.width,Q.height,Q.depth,ae,Ce,Q.data)):t.texImage3D(i.TEXTURE_3D,0,we,Q.width,Q.height,Q.depth,0,ae,Ce,Q.data);else if(x.isFramebufferTexture){if(de)if(P)t.texStorage2D(i.TEXTURE_2D,oe,we,Q.width,Q.height);else{let te=Q.width,Z=Q.height;for(let ge=0;ge<oe;ge++)t.texImage2D(i.TEXTURE_2D,ge,we,te,Z,0,ae,Ce,null),te>>=1,Z>>=1}}else if(Le.length>0){if(P&&de){const te=J(Le[0]);t.texStorage2D(i.TEXTURE_2D,oe,we,te.width,te.height)}for(let te=0,Z=Le.length;te<Z;te++)ue=Le[te],P?se&&t.texSubImage2D(i.TEXTURE_2D,te,0,0,ae,Ce,ue):t.texImage2D(i.TEXTURE_2D,te,we,ae,Ce,ue);x.generateMipmaps=!1}else if(P){if(de){const te=J(Q);t.texStorage2D(i.TEXTURE_2D,oe,we,te.width,te.height)}se&&t.texSubImage2D(i.TEXTURE_2D,0,0,0,ae,Ce,Q)}else t.texImage2D(i.TEXTURE_2D,0,we,ae,Ce,Q);m(x)&&f(V),ye.__version=H.version,x.onUpdate&&x.onUpdate(x)}b.__version=x.version}function $(b,x,N){if(x.image.length!==6)return;const V=$e(b,x),q=x.source;t.bindTexture(i.TEXTURE_CUBE_MAP,b.__webglTexture,i.TEXTURE0+N);const H=n.get(q);if(q.version!==H.__version||V===!0){t.activeTexture(i.TEXTURE0+N);const ye=je.getPrimaries(je.workingColorSpace),le=x.colorSpace===Xn?null:je.getPrimaries(x.colorSpace),Se=x.colorSpace===Xn||ye===le?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,x.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,x.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,x.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Se);const ve=x.isCompressedTexture||x.image[0].isCompressedTexture,Q=x.image[0]&&x.image[0].isDataTexture,ae=[];for(let Z=0;Z<6;Z++)!ve&&!Q?ae[Z]=y(x.image[Z],!0,a.maxCubemapSize):ae[Z]=Q?x.image[Z].image:x.image[Z],ae[Z]=G(x,ae[Z]);const Ce=ae[0],we=r.convert(x.format,x.colorSpace),ue=r.convert(x.type),Le=T(x.internalFormat,we,ue,x.colorSpace),P=x.isVideoTexture!==!0,de=H.__version===void 0||V===!0,se=q.dataReady;let oe=L(x,Ce);He(i.TEXTURE_CUBE_MAP,x);let te;if(ve){P&&de&&t.texStorage2D(i.TEXTURE_CUBE_MAP,oe,Le,Ce.width,Ce.height);for(let Z=0;Z<6;Z++){te=ae[Z].mipmaps;for(let ge=0;ge<te.length;ge++){const Ne=te[ge];x.format!==fn?we!==null?P?se&&t.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ge,0,0,Ne.width,Ne.height,we,Ne.data):t.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ge,Le,Ne.width,Ne.height,0,Ne.data):Ie("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):P?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ge,0,0,Ne.width,Ne.height,we,ue,Ne.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ge,Le,Ne.width,Ne.height,0,we,ue,Ne.data)}}}else{if(te=x.mipmaps,P&&de){te.length>0&&oe++;const Z=J(ae[0]);t.texStorage2D(i.TEXTURE_CUBE_MAP,oe,Le,Z.width,Z.height)}for(let Z=0;Z<6;Z++)if(Q){P?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,ae[Z].width,ae[Z].height,we,ue,ae[Z].data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Le,ae[Z].width,ae[Z].height,0,we,ue,ae[Z].data);for(let ge=0;ge<te.length;ge++){const lt=te[ge].image[Z].image;P?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ge+1,0,0,lt.width,lt.height,we,ue,lt.data):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ge+1,Le,lt.width,lt.height,0,we,ue,lt.data)}}else{P?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,0,0,we,ue,ae[Z]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,0,Le,we,ue,ae[Z]);for(let ge=0;ge<te.length;ge++){const Ne=te[ge];P?se&&t.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ge+1,0,0,we,ue,Ne.image[Z]):t.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+Z,ge+1,Le,we,ue,Ne.image[Z])}}}m(x)&&f(i.TEXTURE_CUBE_MAP),H.__version=q.version,x.onUpdate&&x.onUpdate(x)}b.__version=x.version}function fe(b,x,N,V,q,H){const ye=r.convert(N.format,N.colorSpace),le=r.convert(N.type),Se=T(N.internalFormat,ye,le,N.colorSpace),ve=n.get(x),Q=n.get(N);if(Q.__renderTarget=x,!ve.__hasExternalTextures){const ae=Math.max(1,x.width>>H),Ce=Math.max(1,x.height>>H);q===i.TEXTURE_3D||q===i.TEXTURE_2D_ARRAY?t.texImage3D(q,H,Se,ae,Ce,x.depth,0,ye,le,null):t.texImage2D(q,H,Se,ae,Ce,0,ye,le,null)}t.bindFramebuffer(i.FRAMEBUFFER,b),xe(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,V,q,Q.__webglTexture,0,et(x)):(q===i.TEXTURE_2D||q>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&q<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,V,q,Q.__webglTexture,H),t.bindFramebuffer(i.FRAMEBUFFER,null)}function De(b,x,N){if(i.bindRenderbuffer(i.RENDERBUFFER,b),x.depthBuffer){const V=x.depthTexture,q=V&&V.isDepthTexture?V.type:null,H=w(x.stencilBuffer,q),ye=x.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,le=et(x);xe(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,le,H,x.width,x.height):N?i.renderbufferStorageMultisample(i.RENDERBUFFER,le,H,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,H,x.width,x.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,ye,i.RENDERBUFFER,b)}else{const V=x.textures;for(let q=0;q<V.length;q++){const H=V[q],ye=r.convert(H.format,H.colorSpace),le=r.convert(H.type),Se=T(H.internalFormat,ye,le,H.colorSpace),ve=et(x);N&&xe(x)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,ve,Se,x.width,x.height):xe(x)?o.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ve,Se,x.width,x.height):i.renderbufferStorage(i.RENDERBUFFER,Se,x.width,x.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Me(b,x){if(x&&x.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(t.bindFramebuffer(i.FRAMEBUFFER,b),!(x.depthTexture&&x.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const V=n.get(x.depthTexture);V.__renderTarget=x,(!V.__webglTexture||x.depthTexture.image.width!==x.width||x.depthTexture.image.height!==x.height)&&(x.depthTexture.image.width=x.width,x.depthTexture.image.height=x.height,x.depthTexture.needsUpdate=!0),X(x.depthTexture,0);const q=V.__webglTexture,H=et(x);if(x.depthTexture.format===ma)xe(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,q,0,H):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,q,0);else if(x.depthTexture.format===xa)xe(x)?o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,q,0,H):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,q,0);else throw new Error("Unknown depthTexture format")}function Be(b){const x=n.get(b),N=b.isWebGLCubeRenderTarget===!0;if(x.__boundDepthTexture!==b.depthTexture){const V=b.depthTexture;if(x.__depthDisposeCallback&&x.__depthDisposeCallback(),V){const q=()=>{delete x.__boundDepthTexture,delete x.__depthDisposeCallback,V.removeEventListener("dispose",q)};V.addEventListener("dispose",q),x.__depthDisposeCallback=q}x.__boundDepthTexture=V}if(b.depthTexture&&!x.__autoAllocateDepthBuffer){if(N)throw new Error("target.depthTexture not supported in Cube render targets");const V=b.texture.mipmaps;V&&V.length>0?Me(x.__webglFramebuffer[0],b):Me(x.__webglFramebuffer,b)}else if(N){x.__webglDepthbuffer=[];for(let V=0;V<6;V++)if(t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[V]),x.__webglDepthbuffer[V]===void 0)x.__webglDepthbuffer[V]=i.createRenderbuffer(),De(x.__webglDepthbuffer[V],b,!1);else{const q=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,H=x.__webglDepthbuffer[V];i.bindRenderbuffer(i.RENDERBUFFER,H),i.framebufferRenderbuffer(i.FRAMEBUFFER,q,i.RENDERBUFFER,H)}}else{const V=b.texture.mipmaps;if(V&&V.length>0?t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer[0]):t.bindFramebuffer(i.FRAMEBUFFER,x.__webglFramebuffer),x.__webglDepthbuffer===void 0)x.__webglDepthbuffer=i.createRenderbuffer(),De(x.__webglDepthbuffer,b,!1);else{const q=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,H=x.__webglDepthbuffer;i.bindRenderbuffer(i.RENDERBUFFER,H),i.framebufferRenderbuffer(i.FRAMEBUFFER,q,i.RENDERBUFFER,H)}}t.bindFramebuffer(i.FRAMEBUFFER,null)}function _t(b,x,N){const V=n.get(b);x!==void 0&&fe(V.__webglFramebuffer,b,b.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),N!==void 0&&Be(b)}function ke(b){const x=b.texture,N=n.get(b),V=n.get(x);b.addEventListener("dispose",R);const q=b.textures,H=b.isWebGLCubeRenderTarget===!0,ye=q.length>1;if(ye||(V.__webglTexture===void 0&&(V.__webglTexture=i.createTexture()),V.__version=x.version,s.memory.textures++),H){N.__webglFramebuffer=[];for(let le=0;le<6;le++)if(x.mipmaps&&x.mipmaps.length>0){N.__webglFramebuffer[le]=[];for(let Se=0;Se<x.mipmaps.length;Se++)N.__webglFramebuffer[le][Se]=i.createFramebuffer()}else N.__webglFramebuffer[le]=i.createFramebuffer()}else{if(x.mipmaps&&x.mipmaps.length>0){N.__webglFramebuffer=[];for(let le=0;le<x.mipmaps.length;le++)N.__webglFramebuffer[le]=i.createFramebuffer()}else N.__webglFramebuffer=i.createFramebuffer();if(ye)for(let le=0,Se=q.length;le<Se;le++){const ve=n.get(q[le]);ve.__webglTexture===void 0&&(ve.__webglTexture=i.createTexture(),s.memory.textures++)}if(b.samples>0&&xe(b)===!1){N.__webglMultisampledFramebuffer=i.createFramebuffer(),N.__webglColorRenderbuffer=[],t.bindFramebuffer(i.FRAMEBUFFER,N.__webglMultisampledFramebuffer);for(let le=0;le<q.length;le++){const Se=q[le];N.__webglColorRenderbuffer[le]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,N.__webglColorRenderbuffer[le]);const ve=r.convert(Se.format,Se.colorSpace),Q=r.convert(Se.type),ae=T(Se.internalFormat,ve,Q,Se.colorSpace,b.isXRRenderTarget===!0),Ce=et(b);i.renderbufferStorageMultisample(i.RENDERBUFFER,Ce,ae,b.width,b.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+le,i.RENDERBUFFER,N.__webglColorRenderbuffer[le])}i.bindRenderbuffer(i.RENDERBUFFER,null),b.depthBuffer&&(N.__webglDepthRenderbuffer=i.createRenderbuffer(),De(N.__webglDepthRenderbuffer,b,!0)),t.bindFramebuffer(i.FRAMEBUFFER,null)}}if(H){t.bindTexture(i.TEXTURE_CUBE_MAP,V.__webglTexture),He(i.TEXTURE_CUBE_MAP,x);for(let le=0;le<6;le++)if(x.mipmaps&&x.mipmaps.length>0)for(let Se=0;Se<x.mipmaps.length;Se++)fe(N.__webglFramebuffer[le][Se],b,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+le,Se);else fe(N.__webglFramebuffer[le],b,x,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+le,0);m(x)&&f(i.TEXTURE_CUBE_MAP),t.unbindTexture()}else if(ye){for(let le=0,Se=q.length;le<Se;le++){const ve=q[le],Q=n.get(ve);let ae=i.TEXTURE_2D;(b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(ae=b.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(ae,Q.__webglTexture),He(ae,ve),fe(N.__webglFramebuffer,b,ve,i.COLOR_ATTACHMENT0+le,ae,0),m(ve)&&f(ae)}t.unbindTexture()}else{let le=i.TEXTURE_2D;if((b.isWebGL3DRenderTarget||b.isWebGLArrayRenderTarget)&&(le=b.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY),t.bindTexture(le,V.__webglTexture),He(le,x),x.mipmaps&&x.mipmaps.length>0)for(let Se=0;Se<x.mipmaps.length;Se++)fe(N.__webglFramebuffer[Se],b,x,i.COLOR_ATTACHMENT0,le,Se);else fe(N.__webglFramebuffer,b,x,i.COLOR_ATTACHMENT0,le,0);m(x)&&f(le),t.unbindTexture()}b.depthBuffer&&Be(b)}function qe(b){const x=b.textures;for(let N=0,V=x.length;N<V;N++){const q=x[N];if(m(q)){const H=E(b),ye=n.get(q).__webglTexture;t.bindTexture(H,ye),f(H),t.unbindTexture()}}}const A=[],Ge=[];function Ve(b){if(b.samples>0){if(xe(b)===!1){const x=b.textures,N=b.width,V=b.height;let q=i.COLOR_BUFFER_BIT;const H=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,ye=n.get(b),le=x.length>1;if(le)for(let ve=0;ve<x.length;ve++)t.bindFramebuffer(i.FRAMEBUFFER,ye.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ve,i.RENDERBUFFER,null),t.bindFramebuffer(i.FRAMEBUFFER,ye.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ve,i.TEXTURE_2D,null,0);t.bindFramebuffer(i.READ_FRAMEBUFFER,ye.__webglMultisampledFramebuffer);const Se=b.texture.mipmaps;Se&&Se.length>0?t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ye.__webglFramebuffer[0]):t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ye.__webglFramebuffer);for(let ve=0;ve<x.length;ve++){if(b.resolveDepthBuffer&&(b.depthBuffer&&(q|=i.DEPTH_BUFFER_BIT),b.stencilBuffer&&b.resolveStencilBuffer&&(q|=i.STENCIL_BUFFER_BIT)),le){i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,ye.__webglColorRenderbuffer[ve]);const Q=n.get(x[ve]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,Q,0)}i.blitFramebuffer(0,0,N,V,0,0,N,V,q,i.NEAREST),l===!0&&(A.length=0,Ge.length=0,A.push(i.COLOR_ATTACHMENT0+ve),b.depthBuffer&&b.resolveDepthBuffer===!1&&(A.push(H),Ge.push(H),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,Ge)),i.invalidateFramebuffer(i.READ_FRAMEBUFFER,A))}if(t.bindFramebuffer(i.READ_FRAMEBUFFER,null),t.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),le)for(let ve=0;ve<x.length;ve++){t.bindFramebuffer(i.FRAMEBUFFER,ye.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+ve,i.RENDERBUFFER,ye.__webglColorRenderbuffer[ve]);const Q=n.get(x[ve]).__webglTexture;t.bindFramebuffer(i.FRAMEBUFFER,ye.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+ve,i.TEXTURE_2D,Q,0)}t.bindFramebuffer(i.DRAW_FRAMEBUFFER,ye.__webglMultisampledFramebuffer)}else if(b.depthBuffer&&b.resolveDepthBuffer===!1&&l){const x=b.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT;i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[x])}}}function et(b){return Math.min(a.maxSamples,b.samples)}function xe(b){const x=n.get(b);return b.samples>0&&e.has("WEBGL_multisampled_render_to_texture")===!0&&x.__useRenderToTexture!==!1}function ot(b){const x=s.render.frame;d.get(b)!==x&&(d.set(b,x),b.update())}function G(b,x){const N=b.colorSpace,V=b.format,q=b.type;return b.isCompressedTexture===!0||b.isVideoTexture===!0||N!==Hi&&N!==Xn&&(je.getTransfer(N)===it?(V!==fn||q!==vn)&&Ie("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):mt("WebGLTextures: Unsupported texture color space:",N)),x}function J(b){return typeof HTMLImageElement<"u"&&b instanceof HTMLImageElement?(c.width=b.naturalWidth||b.width,c.height=b.naturalHeight||b.height):typeof VideoFrame<"u"&&b instanceof VideoFrame?(c.width=b.displayWidth,c.height=b.displayHeight):(c.width=b.width,c.height=b.height),c}this.allocateTextureUnit=z,this.resetTextureUnits=F,this.setTexture2D=X,this.setTexture2DArray=Y,this.setTexture3D=ee,this.setTextureCube=W,this.rebindTextures=_t,this.setupRenderTarget=ke,this.updateRenderTargetMipmap=qe,this.updateMultisampleRenderTarget=Ve,this.setupDepthRenderbuffer=Be,this.setupFrameBufferTexture=fe,this.useMultisampledRTT=xe}function s0(i,e){function t(n,a=Xn){let r;const s=je.getTransfer(a);if(n===vn)return i.UNSIGNED_BYTE;if(n===$s)return i.UNSIGNED_SHORT_4_4_4_4;if(n===Zs)return i.UNSIGNED_SHORT_5_5_5_1;if(n===Hl)return i.UNSIGNED_INT_5_9_9_9_REV;if(n===Wl)return i.UNSIGNED_INT_10F_11F_11F_REV;if(n===Gl)return i.BYTE;if(n===Vl)return i.SHORT;if(n===fa)return i.UNSIGNED_SHORT;if(n===js)return i.INT;if(n===ui)return i.UNSIGNED_INT;if(n===gn)return i.FLOAT;if(n===qi)return i.HALF_FLOAT;if(n===Xl)return i.ALPHA;if(n===Kl)return i.RGB;if(n===fn)return i.RGBA;if(n===ma)return i.DEPTH_COMPONENT;if(n===xa)return i.DEPTH_STENCIL;if(n===Js)return i.RED;if(n===Qs)return i.RED_INTEGER;if(n===eo)return i.RG;if(n===to)return i.RG_INTEGER;if(n===no)return i.RGBA_INTEGER;if(n===ja||n===$a||n===Za||n===Ja)if(s===it)if(r=e.get("WEBGL_compressed_texture_s3tc_srgb"),r!==null){if(n===ja)return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===$a)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===Za)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ja)return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(r=e.get("WEBGL_compressed_texture_s3tc"),r!==null){if(n===ja)return r.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===$a)return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===Za)return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ja)return r.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===ps||n===ms||n===xs||n===gs)if(r=e.get("WEBGL_compressed_texture_pvrtc"),r!==null){if(n===ps)return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===ms)return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===xs)return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===gs)return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===_s||n===vs||n===ys)if(r=e.get("WEBGL_compressed_texture_etc"),r!==null){if(n===_s||n===vs)return s===it?r.COMPRESSED_SRGB8_ETC2:r.COMPRESSED_RGB8_ETC2;if(n===ys)return s===it?r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:r.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(n===Ms||n===bs||n===Ss||n===Ts||n===Es||n===ws||n===As||n===Cs||n===Rs||n===Ps||n===Ls||n===Ds||n===Is||n===Us)if(r=e.get("WEBGL_compressed_texture_astc"),r!==null){if(n===Ms)return s===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:r.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===bs)return s===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:r.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Ss)return s===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:r.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===Ts)return s===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:r.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===Es)return s===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:r.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===ws)return s===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:r.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===As)return s===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:r.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Cs)return s===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:r.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Rs)return s===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:r.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Ps)return s===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:r.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Ls)return s===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:r.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Ds)return s===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:r.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===Is)return s===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:r.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Us)return s===it?r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:r.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Ns||n===Fs||n===Bs)if(r=e.get("EXT_texture_compression_bptc"),r!==null){if(n===Ns)return s===it?r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:r.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Fs)return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Bs)return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ks||n===Os||n===zs||n===Gs)if(r=e.get("EXT_texture_compression_rgtc"),r!==null){if(n===ks)return r.COMPRESSED_RED_RGTC1_EXT;if(n===Os)return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===zs)return r.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Gs)return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===pa?i.UNSIGNED_INT_24_8:i[n]!==void 0?i[n]:null}return{convert:t}}const o0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,l0=`
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

}`;class c0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(e,t){if(this.texture===null){const n=new oc(e.texture);(e.depthNear!==t.depthNear||e.depthFar!==t.depthFar)&&(this.depthNear=e.depthNear,this.depthFar=e.depthFar),this.texture=n}}getMesh(e){if(this.texture!==null&&this.mesh===null){const t=e.cameras[0].viewport,n=new Fn({vertexShader:o0,fragmentShader:l0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:t.z},depthHeight:{value:t.w}}});this.mesh=new Tt(new dr(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class d0 extends pi{constructor(e,t){super();const n=this;let a=null,r=1,s=null,o="local-floor",l=1,c=null,d=null,h=null,u=null,p=null,g=null;const y=typeof XRWebGLBinding<"u",m=new c0,f={},E=t.getContextAttributes();let T=null,w=null;const L=[],S=[],R=new Ue;let B=null;const M=new nn;M.viewport=new pt;const _=new nn;_.viewport=new pt;const D=[M,_],F=new Ah;let z=null,K=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(j){let $=L[j];return $===void 0&&($=new Br,L[j]=$),$.getTargetRaySpace()},this.getControllerGrip=function(j){let $=L[j];return $===void 0&&($=new Br,L[j]=$),$.getGripSpace()},this.getHand=function(j){let $=L[j];return $===void 0&&($=new Br,L[j]=$),$.getHandSpace()};function X(j){const $=S.indexOf(j.inputSource);if($===-1)return;const fe=L[$];fe!==void 0&&(fe.update(j.inputSource,j.frame,c||s),fe.dispatchEvent({type:j.type,data:j.inputSource}))}function Y(){a.removeEventListener("select",X),a.removeEventListener("selectstart",X),a.removeEventListener("selectend",X),a.removeEventListener("squeeze",X),a.removeEventListener("squeezestart",X),a.removeEventListener("squeezeend",X),a.removeEventListener("end",Y),a.removeEventListener("inputsourceschange",ee);for(let j=0;j<L.length;j++){const $=S[j];$!==null&&(S[j]=null,L[j].disconnect($))}z=null,K=null,m.reset();for(const j in f)delete f[j];e.setRenderTarget(T),p=null,u=null,h=null,a=null,w=null,Ze.stop(),n.isPresenting=!1,e.setPixelRatio(B),e.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(j){r=j,n.isPresenting===!0&&Ie("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(j){o=j,n.isPresenting===!0&&Ie("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||s},this.setReferenceSpace=function(j){c=j},this.getBaseLayer=function(){return u!==null?u:p},this.getBinding=function(){return h===null&&y&&(h=new XRWebGLBinding(a,t)),h},this.getFrame=function(){return g},this.getSession=function(){return a},this.setSession=async function(j){if(a=j,a!==null){if(T=e.getRenderTarget(),a.addEventListener("select",X),a.addEventListener("selectstart",X),a.addEventListener("selectend",X),a.addEventListener("squeeze",X),a.addEventListener("squeezestart",X),a.addEventListener("squeezeend",X),a.addEventListener("end",Y),a.addEventListener("inputsourceschange",ee),E.xrCompatible!==!0&&await t.makeXRCompatible(),B=e.getPixelRatio(),e.getSize(R),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let fe=null,De=null,Me=null;E.depth&&(Me=E.stencil?t.DEPTH24_STENCIL8:t.DEPTH_COMPONENT24,fe=E.stencil?xa:ma,De=E.stencil?pa:ui);const Be={colorFormat:t.RGBA8,depthFormat:Me,scaleFactor:r};h=this.getBinding(),u=h.createProjectionLayer(Be),a.updateRenderState({layers:[u]}),e.setPixelRatio(1),e.setSize(u.textureWidth,u.textureHeight,!1),w=new fi(u.textureWidth,u.textureHeight,{format:fn,type:vn,depthTexture:new sc(u.textureWidth,u.textureHeight,De,void 0,void 0,void 0,void 0,void 0,void 0,fe),stencilBuffer:E.stencil,colorSpace:e.outputColorSpace,samples:E.antialias?4:0,resolveDepthBuffer:u.ignoreDepthValues===!1,resolveStencilBuffer:u.ignoreDepthValues===!1})}else{const fe={antialias:E.antialias,alpha:!0,depth:E.depth,stencil:E.stencil,framebufferScaleFactor:r};p=new XRWebGLLayer(a,t,fe),a.updateRenderState({baseLayer:p}),e.setPixelRatio(1),e.setSize(p.framebufferWidth,p.framebufferHeight,!1),w=new fi(p.framebufferWidth,p.framebufferHeight,{format:fn,type:vn,colorSpace:e.outputColorSpace,stencilBuffer:E.stencil,resolveDepthBuffer:p.ignoreDepthValues===!1,resolveStencilBuffer:p.ignoreDepthValues===!1})}w.isXRRenderTarget=!0,this.setFoveation(l),c=null,s=await a.requestReferenceSpace(o),Ze.setContext(a),Ze.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(a!==null)return a.environmentBlendMode},this.getDepthTexture=function(){return m.getDepthTexture()};function ee(j){for(let $=0;$<j.removed.length;$++){const fe=j.removed[$],De=S.indexOf(fe);De>=0&&(S[De]=null,L[De].disconnect(fe))}for(let $=0;$<j.added.length;$++){const fe=j.added[$];let De=S.indexOf(fe);if(De===-1){for(let Be=0;Be<L.length;Be++)if(Be>=S.length){S.push(fe),De=Be;break}else if(S[Be]===null){S[Be]=fe,De=Be;break}if(De===-1)break}const Me=L[De];Me&&Me.connect(fe)}}const W=new C,ie=new C;function re(j,$,fe){W.setFromMatrixPosition($.matrixWorld),ie.setFromMatrixPosition(fe.matrixWorld);const De=W.distanceTo(ie),Me=$.projectionMatrix.elements,Be=fe.projectionMatrix.elements,_t=Me[14]/(Me[10]-1),ke=Me[14]/(Me[10]+1),qe=(Me[9]+1)/Me[5],A=(Me[9]-1)/Me[5],Ge=(Me[8]-1)/Me[0],Ve=(Be[8]+1)/Be[0],et=_t*Ge,xe=_t*Ve,ot=De/(-Ge+Ve),G=ot*-Ge;if($.matrixWorld.decompose(j.position,j.quaternion,j.scale),j.translateX(G),j.translateZ(ot),j.matrixWorld.compose(j.position,j.quaternion,j.scale),j.matrixWorldInverse.copy(j.matrixWorld).invert(),Me[10]===-1)j.projectionMatrix.copy($.projectionMatrix),j.projectionMatrixInverse.copy($.projectionMatrixInverse);else{const J=_t+ot,b=ke+ot,x=et-G,N=xe+(De-G),V=qe*ke/b*J,q=A*ke/b*J;j.projectionMatrix.makePerspective(x,N,V,q,J,b),j.projectionMatrixInverse.copy(j.projectionMatrix).invert()}}function be(j,$){$===null?j.matrixWorld.copy(j.matrix):j.matrixWorld.multiplyMatrices($.matrixWorld,j.matrix),j.matrixWorldInverse.copy(j.matrixWorld).invert()}this.updateCamera=function(j){if(a===null)return;let $=j.near,fe=j.far;m.texture!==null&&(m.depthNear>0&&($=m.depthNear),m.depthFar>0&&(fe=m.depthFar)),F.near=_.near=M.near=$,F.far=_.far=M.far=fe,(z!==F.near||K!==F.far)&&(a.updateRenderState({depthNear:F.near,depthFar:F.far}),z=F.near,K=F.far),F.layers.mask=j.layers.mask|6,M.layers.mask=F.layers.mask&3,_.layers.mask=F.layers.mask&5;const De=j.parent,Me=F.cameras;be(F,De);for(let Be=0;Be<Me.length;Be++)be(Me[Be],De);Me.length===2?re(F,M,_):F.projectionMatrix.copy(M.projectionMatrix),He(j,F,De)};function He(j,$,fe){fe===null?j.matrix.copy($.matrixWorld):(j.matrix.copy(fe.matrixWorld),j.matrix.invert(),j.matrix.multiply($.matrixWorld)),j.matrix.decompose(j.position,j.quaternion,j.scale),j.updateMatrixWorld(!0),j.projectionMatrix.copy($.projectionMatrix),j.projectionMatrixInverse.copy($.projectionMatrixInverse),j.isPerspectiveCamera&&(j.fov=_a*2*Math.atan(1/j.projectionMatrix.elements[5]),j.zoom=1)}this.getCamera=function(){return F},this.getFoveation=function(){if(!(u===null&&p===null))return l},this.setFoveation=function(j){l=j,u!==null&&(u.fixedFoveation=j),p!==null&&p.fixedFoveation!==void 0&&(p.fixedFoveation=j)},this.hasDepthSensing=function(){return m.texture!==null},this.getDepthSensingMesh=function(){return m.getMesh(F)},this.getCameraTexture=function(j){return f[j]};let $e=null;function Qe(j,$){if(d=$.getViewerPose(c||s),g=$,d!==null){const fe=d.views;p!==null&&(e.setRenderTargetFramebuffer(w,p.framebuffer),e.setRenderTarget(w));let De=!1;fe.length!==F.cameras.length&&(F.cameras.length=0,De=!0);for(let ke=0;ke<fe.length;ke++){const qe=fe[ke];let A=null;if(p!==null)A=p.getViewport(qe);else{const Ve=h.getViewSubImage(u,qe);A=Ve.viewport,ke===0&&(e.setRenderTargetTextures(w,Ve.colorTexture,Ve.depthStencilTexture),e.setRenderTarget(w))}let Ge=D[ke];Ge===void 0&&(Ge=new nn,Ge.layers.enable(ke),Ge.viewport=new pt,D[ke]=Ge),Ge.matrix.fromArray(qe.transform.matrix),Ge.matrix.decompose(Ge.position,Ge.quaternion,Ge.scale),Ge.projectionMatrix.fromArray(qe.projectionMatrix),Ge.projectionMatrixInverse.copy(Ge.projectionMatrix).invert(),Ge.viewport.set(A.x,A.y,A.width,A.height),ke===0&&(F.matrix.copy(Ge.matrix),F.matrix.decompose(F.position,F.quaternion,F.scale)),De===!0&&F.cameras.push(Ge)}const Me=a.enabledFeatures;if(Me&&Me.includes("depth-sensing")&&a.depthUsage=="gpu-optimized"&&y){h=n.getBinding();const ke=h.getDepthInformation(fe[0]);ke&&ke.isValid&&ke.texture&&m.init(ke,a.renderState)}if(Me&&Me.includes("camera-access")&&y){e.state.unbindTexture(),h=n.getBinding();for(let ke=0;ke<fe.length;ke++){const qe=fe[ke].camera;if(qe){let A=f[qe];A||(A=new oc,f[qe]=A);const Ge=h.getCameraImage(qe);A.sourceTexture=Ge}}}}for(let fe=0;fe<L.length;fe++){const De=S[fe],Me=L[fe];De!==null&&Me!==void 0&&Me.update(De,$,c||s)}$e&&$e(j,$),$.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:$}),g=null}const Ze=new cc;Ze.setAnimationLoop(Qe),this.setAnimationLoop=function(j){$e=j},this.dispose=function(){}}}const oi=new yn,h0=new st;function u0(i,e){function t(m,f){m.matrixAutoUpdate===!0&&m.updateMatrix(),f.value.copy(m.matrix)}function n(m,f){f.color.getRGB(m.fogColor.value,tc(i)),f.isFog?(m.fogNear.value=f.near,m.fogFar.value=f.far):f.isFogExp2&&(m.fogDensity.value=f.density)}function a(m,f,E,T,w){f.isMeshBasicMaterial||f.isMeshLambertMaterial?r(m,f):f.isMeshToonMaterial?(r(m,f),h(m,f)):f.isMeshPhongMaterial?(r(m,f),d(m,f)):f.isMeshStandardMaterial?(r(m,f),u(m,f),f.isMeshPhysicalMaterial&&p(m,f,w)):f.isMeshMatcapMaterial?(r(m,f),g(m,f)):f.isMeshDepthMaterial?r(m,f):f.isMeshDistanceMaterial?(r(m,f),y(m,f)):f.isMeshNormalMaterial?r(m,f):f.isLineBasicMaterial?(s(m,f),f.isLineDashedMaterial&&o(m,f)):f.isPointsMaterial?l(m,f,E,T):f.isSpriteMaterial?c(m,f):f.isShadowMaterial?(m.color.value.copy(f.color),m.opacity.value=f.opacity):f.isShaderMaterial&&(f.uniformsNeedUpdate=!1)}function r(m,f){m.opacity.value=f.opacity,f.color&&m.diffuse.value.copy(f.color),f.emissive&&m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.bumpMap&&(m.bumpMap.value=f.bumpMap,t(f.bumpMap,m.bumpMapTransform),m.bumpScale.value=f.bumpScale,f.side===Ht&&(m.bumpScale.value*=-1)),f.normalMap&&(m.normalMap.value=f.normalMap,t(f.normalMap,m.normalMapTransform),m.normalScale.value.copy(f.normalScale),f.side===Ht&&m.normalScale.value.negate()),f.displacementMap&&(m.displacementMap.value=f.displacementMap,t(f.displacementMap,m.displacementMapTransform),m.displacementScale.value=f.displacementScale,m.displacementBias.value=f.displacementBias),f.emissiveMap&&(m.emissiveMap.value=f.emissiveMap,t(f.emissiveMap,m.emissiveMapTransform)),f.specularMap&&(m.specularMap.value=f.specularMap,t(f.specularMap,m.specularMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest);const E=e.get(f),T=E.envMap,w=E.envMapRotation;T&&(m.envMap.value=T,oi.copy(w),oi.x*=-1,oi.y*=-1,oi.z*=-1,T.isCubeTexture&&T.isRenderTargetTexture===!1&&(oi.y*=-1,oi.z*=-1),m.envMapRotation.value.setFromMatrix4(h0.makeRotationFromEuler(oi)),m.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,m.reflectivity.value=f.reflectivity,m.ior.value=f.ior,m.refractionRatio.value=f.refractionRatio),f.lightMap&&(m.lightMap.value=f.lightMap,m.lightMapIntensity.value=f.lightMapIntensity,t(f.lightMap,m.lightMapTransform)),f.aoMap&&(m.aoMap.value=f.aoMap,m.aoMapIntensity.value=f.aoMapIntensity,t(f.aoMap,m.aoMapTransform))}function s(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform))}function o(m,f){m.dashSize.value=f.dashSize,m.totalSize.value=f.dashSize+f.gapSize,m.scale.value=f.scale}function l(m,f,E,T){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.size.value=f.size*E,m.scale.value=T*.5,f.map&&(m.map.value=f.map,t(f.map,m.uvTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function c(m,f){m.diffuse.value.copy(f.color),m.opacity.value=f.opacity,m.rotation.value=f.rotation,f.map&&(m.map.value=f.map,t(f.map,m.mapTransform)),f.alphaMap&&(m.alphaMap.value=f.alphaMap,t(f.alphaMap,m.alphaMapTransform)),f.alphaTest>0&&(m.alphaTest.value=f.alphaTest)}function d(m,f){m.specular.value.copy(f.specular),m.shininess.value=Math.max(f.shininess,1e-4)}function h(m,f){f.gradientMap&&(m.gradientMap.value=f.gradientMap)}function u(m,f){m.metalness.value=f.metalness,f.metalnessMap&&(m.metalnessMap.value=f.metalnessMap,t(f.metalnessMap,m.metalnessMapTransform)),m.roughness.value=f.roughness,f.roughnessMap&&(m.roughnessMap.value=f.roughnessMap,t(f.roughnessMap,m.roughnessMapTransform)),f.envMap&&(m.envMapIntensity.value=f.envMapIntensity)}function p(m,f,E){m.ior.value=f.ior,f.sheen>0&&(m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),m.sheenRoughness.value=f.sheenRoughness,f.sheenColorMap&&(m.sheenColorMap.value=f.sheenColorMap,t(f.sheenColorMap,m.sheenColorMapTransform)),f.sheenRoughnessMap&&(m.sheenRoughnessMap.value=f.sheenRoughnessMap,t(f.sheenRoughnessMap,m.sheenRoughnessMapTransform))),f.clearcoat>0&&(m.clearcoat.value=f.clearcoat,m.clearcoatRoughness.value=f.clearcoatRoughness,f.clearcoatMap&&(m.clearcoatMap.value=f.clearcoatMap,t(f.clearcoatMap,m.clearcoatMapTransform)),f.clearcoatRoughnessMap&&(m.clearcoatRoughnessMap.value=f.clearcoatRoughnessMap,t(f.clearcoatRoughnessMap,m.clearcoatRoughnessMapTransform)),f.clearcoatNormalMap&&(m.clearcoatNormalMap.value=f.clearcoatNormalMap,t(f.clearcoatNormalMap,m.clearcoatNormalMapTransform),m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),f.side===Ht&&m.clearcoatNormalScale.value.negate())),f.dispersion>0&&(m.dispersion.value=f.dispersion),f.iridescence>0&&(m.iridescence.value=f.iridescence,m.iridescenceIOR.value=f.iridescenceIOR,m.iridescenceThicknessMinimum.value=f.iridescenceThicknessRange[0],m.iridescenceThicknessMaximum.value=f.iridescenceThicknessRange[1],f.iridescenceMap&&(m.iridescenceMap.value=f.iridescenceMap,t(f.iridescenceMap,m.iridescenceMapTransform)),f.iridescenceThicknessMap&&(m.iridescenceThicknessMap.value=f.iridescenceThicknessMap,t(f.iridescenceThicknessMap,m.iridescenceThicknessMapTransform))),f.transmission>0&&(m.transmission.value=f.transmission,m.transmissionSamplerMap.value=E.texture,m.transmissionSamplerSize.value.set(E.width,E.height),f.transmissionMap&&(m.transmissionMap.value=f.transmissionMap,t(f.transmissionMap,m.transmissionMapTransform)),m.thickness.value=f.thickness,f.thicknessMap&&(m.thicknessMap.value=f.thicknessMap,t(f.thicknessMap,m.thicknessMapTransform)),m.attenuationDistance.value=f.attenuationDistance,m.attenuationColor.value.copy(f.attenuationColor)),f.anisotropy>0&&(m.anisotropyVector.value.set(f.anisotropy*Math.cos(f.anisotropyRotation),f.anisotropy*Math.sin(f.anisotropyRotation)),f.anisotropyMap&&(m.anisotropyMap.value=f.anisotropyMap,t(f.anisotropyMap,m.anisotropyMapTransform))),m.specularIntensity.value=f.specularIntensity,m.specularColor.value.copy(f.specularColor),f.specularColorMap&&(m.specularColorMap.value=f.specularColorMap,t(f.specularColorMap,m.specularColorMapTransform)),f.specularIntensityMap&&(m.specularIntensityMap.value=f.specularIntensityMap,t(f.specularIntensityMap,m.specularIntensityMapTransform))}function g(m,f){f.matcap&&(m.matcap.value=f.matcap)}function y(m,f){const E=e.get(f).light;m.referencePosition.value.setFromMatrixPosition(E.matrixWorld),m.nearDistance.value=E.shadow.camera.near,m.farDistance.value=E.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:a}}function f0(i,e,t,n){let a={},r={},s=[];const o=i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);function l(E,T){const w=T.program;n.uniformBlockBinding(E,w)}function c(E,T){let w=a[E.id];w===void 0&&(g(E),w=d(E),a[E.id]=w,E.addEventListener("dispose",m));const L=T.program;n.updateUBOMapping(E,L);const S=e.render.frame;r[E.id]!==S&&(u(E),r[E.id]=S)}function d(E){const T=h();E.__bindingPointIndex=T;const w=i.createBuffer(),L=E.__size,S=E.usage;return i.bindBuffer(i.UNIFORM_BUFFER,w),i.bufferData(i.UNIFORM_BUFFER,L,S),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,T,w),w}function h(){for(let E=0;E<o;E++)if(s.indexOf(E)===-1)return s.push(E),E;return mt("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function u(E){const T=a[E.id],w=E.uniforms,L=E.__cache;i.bindBuffer(i.UNIFORM_BUFFER,T);for(let S=0,R=w.length;S<R;S++){const B=Array.isArray(w[S])?w[S]:[w[S]];for(let M=0,_=B.length;M<_;M++){const D=B[M];if(p(D,S,M,L)===!0){const F=D.__offset,z=Array.isArray(D.value)?D.value:[D.value];let K=0;for(let X=0;X<z.length;X++){const Y=z[X],ee=y(Y);typeof Y=="number"||typeof Y=="boolean"?(D.__data[0]=Y,i.bufferSubData(i.UNIFORM_BUFFER,F+K,D.__data)):Y.isMatrix3?(D.__data[0]=Y.elements[0],D.__data[1]=Y.elements[1],D.__data[2]=Y.elements[2],D.__data[3]=0,D.__data[4]=Y.elements[3],D.__data[5]=Y.elements[4],D.__data[6]=Y.elements[5],D.__data[7]=0,D.__data[8]=Y.elements[6],D.__data[9]=Y.elements[7],D.__data[10]=Y.elements[8],D.__data[11]=0):(Y.toArray(D.__data,K),K+=ee.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,F,D.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function p(E,T,w,L){const S=E.value,R=T+"_"+w;if(L[R]===void 0)return typeof S=="number"||typeof S=="boolean"?L[R]=S:L[R]=S.clone(),!0;{const B=L[R];if(typeof S=="number"||typeof S=="boolean"){if(B!==S)return L[R]=S,!0}else if(B.equals(S)===!1)return B.copy(S),!0}return!1}function g(E){const T=E.uniforms;let w=0;const L=16;for(let R=0,B=T.length;R<B;R++){const M=Array.isArray(T[R])?T[R]:[T[R]];for(let _=0,D=M.length;_<D;_++){const F=M[_],z=Array.isArray(F.value)?F.value:[F.value];for(let K=0,X=z.length;K<X;K++){const Y=z[K],ee=y(Y),W=w%L,ie=W%ee.boundary,re=W+ie;w+=ie,re!==0&&L-re<ee.storage&&(w+=L-re),F.__data=new Float32Array(ee.storage/Float32Array.BYTES_PER_ELEMENT),F.__offset=w,w+=ee.storage}}}const S=w%L;return S>0&&(w+=L-S),E.__size=w,E.__cache={},this}function y(E){const T={boundary:0,storage:0};return typeof E=="number"||typeof E=="boolean"?(T.boundary=4,T.storage=4):E.isVector2?(T.boundary=8,T.storage=8):E.isVector3||E.isColor?(T.boundary=16,T.storage=12):E.isVector4?(T.boundary=16,T.storage=16):E.isMatrix3?(T.boundary=48,T.storage=48):E.isMatrix4?(T.boundary=64,T.storage=64):E.isTexture?Ie("WebGLRenderer: Texture samplers can not be part of an uniforms group."):Ie("WebGLRenderer: Unsupported uniform value type.",E),T}function m(E){const T=E.target;T.removeEventListener("dispose",m);const w=s.indexOf(T.__bindingPointIndex);s.splice(w,1),i.deleteBuffer(a[T.id]),delete a[T.id],delete r[T.id]}function f(){for(const E in a)i.deleteBuffer(a[E]);s=[],a={},r={}}return{bind:l,update:c,dispose:f}}const p0=new Uint16Array([11481,15204,11534,15171,11808,15015,12385,14843,12894,14716,13396,14600,13693,14483,13976,14366,14237,14171,14405,13961,14511,13770,14605,13598,14687,13444,14760,13305,14822,13066,14876,12857,14923,12675,14963,12517,14997,12379,15025,12230,15049,12023,15070,11843,15086,11687,15100,11551,15111,11433,15120,11330,15127,11217,15132,11060,15135,10922,15138,10801,15139,10695,15139,10600,13012,14923,13020,14917,13064,14886,13176,14800,13349,14666,13513,14526,13724,14398,13960,14230,14200,14020,14383,13827,14488,13651,14583,13491,14667,13348,14740,13132,14803,12908,14856,12713,14901,12542,14938,12394,14968,12241,14992,12017,15010,11822,15024,11654,15034,11507,15041,11380,15044,11269,15044,11081,15042,10913,15037,10764,15031,10635,15023,10520,15014,10419,15003,10330,13657,14676,13658,14673,13670,14660,13698,14622,13750,14547,13834,14442,13956,14317,14112,14093,14291,13889,14407,13704,14499,13538,14586,13389,14664,13201,14733,12966,14792,12758,14842,12577,14882,12418,14915,12272,14940,12033,14959,11826,14972,11646,14980,11490,14983,11355,14983,11212,14979,11008,14971,10830,14961,10675,14950,10540,14936,10420,14923,10315,14909,10204,14894,10041,14089,14460,14090,14459,14096,14452,14112,14431,14141,14388,14186,14305,14252,14130,14341,13941,14399,13756,14467,13585,14539,13430,14610,13272,14677,13026,14737,12808,14790,12617,14833,12449,14869,12303,14896,12065,14916,11845,14929,11655,14937,11490,14939,11347,14936,11184,14930,10970,14921,10783,14912,10621,14900,10480,14885,10356,14867,10247,14848,10062,14827,9894,14805,9745,14400,14208,14400,14206,14402,14198,14406,14174,14415,14122,14427,14035,14444,13913,14469,13767,14504,13613,14548,13463,14598,13324,14651,13082,14704,12858,14752,12658,14795,12483,14831,12330,14860,12106,14881,11875,14895,11675,14903,11501,14905,11351,14903,11178,14900,10953,14892,10757,14880,10589,14865,10442,14847,10313,14827,10162,14805,9965,14782,9792,14757,9642,14731,9507,14562,13883,14562,13883,14563,13877,14566,13862,14570,13830,14576,13773,14584,13689,14595,13582,14613,13461,14637,13336,14668,13120,14704,12897,14741,12695,14776,12516,14808,12358,14835,12150,14856,11910,14870,11701,14878,11519,14882,11361,14884,11187,14880,10951,14871,10748,14858,10572,14842,10418,14823,10286,14801,10099,14777,9897,14751,9722,14725,9567,14696,9430,14666,9309,14702,13604,14702,13604,14702,13600,14703,13591,14705,13570,14707,13533,14709,13477,14712,13400,14718,13305,14727,13106,14743,12907,14762,12716,14784,12539,14807,12380,14827,12190,14844,11943,14855,11727,14863,11539,14870,11376,14871,11204,14868,10960,14858,10748,14845,10565,14829,10406,14809,10269,14786,10058,14761,9852,14734,9671,14705,9512,14674,9374,14641,9253,14608,9076,14821,13366,14821,13365,14821,13364,14821,13358,14821,13344,14821,13320,14819,13252,14817,13145,14815,13011,14814,12858,14817,12698,14823,12539,14832,12389,14841,12214,14850,11968,14856,11750,14861,11558,14866,11390,14867,11226,14862,10972,14853,10754,14840,10565,14823,10401,14803,10259,14780,10032,14754,9820,14725,9635,14694,9473,14661,9333,14627,9203,14593,8988,14557,8798,14923,13014,14922,13014,14922,13012,14922,13004,14920,12987,14919,12957,14915,12907,14909,12834,14902,12738,14894,12623,14888,12498,14883,12370,14880,12203,14878,11970,14875,11759,14873,11569,14874,11401,14872,11243,14865,10986,14855,10762,14842,10568,14825,10401,14804,10255,14781,10017,14754,9799,14725,9611,14692,9445,14658,9301,14623,9139,14587,8920,14548,8729,14509,8562,15008,12672,15008,12672,15008,12671,15007,12667,15005,12656,15001,12637,14997,12605,14989,12556,14978,12490,14966,12407,14953,12313,14940,12136,14927,11934,14914,11742,14903,11563,14896,11401,14889,11247,14879,10992,14866,10767,14851,10570,14833,10400,14812,10252,14789,10007,14761,9784,14731,9592,14698,9424,14663,9279,14627,9088,14588,8868,14548,8676,14508,8508,14467,8360,15080,12386,15080,12386,15079,12385,15078,12383,15076,12378,15072,12367,15066,12347,15057,12315,15045,12253,15030,12138,15012,11998,14993,11845,14972,11685,14951,11530,14935,11383,14920,11228,14904,10981,14887,10762,14870,10567,14850,10397,14827,10248,14803,9997,14774,9771,14743,9578,14710,9407,14674,9259,14637,9048,14596,8826,14555,8632,14514,8464,14471,8317,14427,8182,15139,12008,15139,12008,15138,12008,15137,12007,15135,12003,15130,11990,15124,11969,15115,11929,15102,11872,15086,11794,15064,11693,15041,11581,15013,11459,14987,11336,14966,11170,14944,10944,14921,10738,14898,10552,14875,10387,14850,10239,14824,9983,14794,9758,14762,9563,14728,9392,14692,9244,14653,9014,14611,8791,14569,8597,14526,8427,14481,8281,14436,8110,14391,7885,15188,11617,15188,11617,15187,11617,15186,11618,15183,11617,15179,11612,15173,11601,15163,11581,15150,11546,15133,11495,15110,11427,15083,11346,15051,11246,15024,11057,14996,10868,14967,10687,14938,10517,14911,10362,14882,10206,14853,9956,14821,9737,14787,9543,14752,9375,14715,9228,14675,8980,14632,8760,14589,8565,14544,8395,14498,8248,14451,8049,14404,7824,14357,7630,15228,11298,15228,11298,15227,11299,15226,11301,15223,11303,15219,11302,15213,11299,15204,11290,15191,11271,15174,11217,15150,11129,15119,11015,15087,10886,15057,10744,15024,10599,14990,10455,14957,10318,14924,10143,14891,9911,14856,9701,14820,9516,14782,9352,14744,9200,14703,8946,14659,8725,14615,8533,14568,8366,14521,8220,14472,7992,14423,7770,14374,7578,14315,7408,15260,10819,15260,10819,15259,10822,15258,10826,15256,10832,15251,10836,15246,10841,15237,10838,15225,10821,15207,10788,15183,10734,15151,10660,15120,10571,15087,10469,15049,10359,15012,10249,14974,10041,14937,9837,14900,9647,14860,9475,14820,9320,14779,9147,14736,8902,14691,8688,14646,8499,14598,8335,14549,8189,14499,7940,14448,7720,14397,7529,14347,7363,14256,7218,15285,10410,15285,10411,15285,10413,15284,10418,15282,10425,15278,10434,15272,10442,15264,10449,15252,10445,15235,10433,15210,10403,15179,10358,15149,10301,15113,10218,15073,10059,15033,9894,14991,9726,14951,9565,14909,9413,14865,9273,14822,9073,14777,8845,14730,8641,14682,8459,14633,8300,14583,8129,14531,7883,14479,7670,14426,7482,14373,7321,14305,7176,14201,6939,15305,9939,15305,9940,15305,9945,15304,9955,15302,9967,15298,9989,15293,10010,15286,10033,15274,10044,15258,10045,15233,10022,15205,9975,15174,9903,15136,9808,15095,9697,15053,9578,15009,9451,14965,9327,14918,9198,14871,8973,14825,8766,14775,8579,14725,8408,14675,8259,14622,8058,14569,7821,14515,7615,14460,7435,14405,7276,14350,7108,14256,6866,14149,6653,15321,9444,15321,9445,15321,9448,15320,9458,15317,9470,15314,9490,15310,9515,15302,9540,15292,9562,15276,9579,15251,9577,15226,9559,15195,9519,15156,9463,15116,9389,15071,9304,15025,9208,14978,9023,14927,8838,14878,8661,14827,8496,14774,8344,14722,8206,14667,7973,14612,7749,14556,7555,14499,7382,14443,7229,14385,7025,14322,6791,14210,6588,14100,6409,15333,8920,15333,8921,15332,8927,15332,8943,15329,8965,15326,9002,15322,9048,15316,9106,15307,9162,15291,9204,15267,9221,15244,9221,15212,9196,15175,9134,15133,9043,15088,8930,15040,8801,14990,8665,14938,8526,14886,8391,14830,8261,14775,8087,14719,7866,14661,7664,14603,7482,14544,7322,14485,7178,14426,6936,14367,6713,14281,6517,14166,6348,14054,6198,15341,8360,15341,8361,15341,8366,15341,8379,15339,8399,15336,8431,15332,8473,15326,8527,15318,8585,15302,8632,15281,8670,15258,8690,15227,8690,15191,8664,15149,8612,15104,8543,15055,8456,15001,8360,14948,8259,14892,8122,14834,7923,14776,7734,14716,7558,14656,7397,14595,7250,14534,7070,14472,6835,14410,6628,14350,6443,14243,6283,14125,6135,14010,5889,15348,7715,15348,7717,15348,7725,15347,7745,15345,7780,15343,7836,15339,7905,15334,8e3,15326,8103,15310,8193,15293,8239,15270,8270,15240,8287,15204,8283,15163,8260,15118,8223,15067,8143,15014,8014,14958,7873,14899,7723,14839,7573,14778,7430,14715,7293,14652,7164,14588,6931,14524,6720,14460,6531,14396,6362,14330,6210,14207,6015,14086,5781,13969,5576,15352,7114,15352,7116,15352,7128,15352,7159,15350,7195,15348,7237,15345,7299,15340,7374,15332,7457,15317,7544,15301,7633,15280,7703,15251,7754,15216,7775,15176,7767,15131,7733,15079,7670,15026,7588,14967,7492,14906,7387,14844,7278,14779,7171,14714,6965,14648,6770,14581,6587,14515,6420,14448,6269,14382,6123,14299,5881,14172,5665,14049,5477,13929,5310,15355,6329,15355,6330,15355,6339,15355,6362,15353,6410,15351,6472,15349,6572,15344,6688,15337,6835,15323,6985,15309,7142,15287,7220,15260,7277,15226,7310,15188,7326,15142,7318,15090,7285,15036,7239,14976,7177,14914,7045,14849,6892,14782,6736,14714,6581,14645,6433,14576,6293,14506,6164,14438,5946,14369,5733,14270,5540,14140,5369,14014,5216,13892,5043,15357,5483,15357,5484,15357,5496,15357,5528,15356,5597,15354,5692,15351,5835,15347,6011,15339,6195,15328,6317,15314,6446,15293,6566,15268,6668,15235,6746,15197,6796,15152,6811,15101,6790,15046,6748,14985,6673,14921,6583,14854,6479,14785,6371,14714,6259,14643,6149,14571,5946,14499,5750,14428,5567,14358,5401,14242,5250,14109,5111,13980,4870,13856,4657,15359,4555,15359,4557,15358,4573,15358,4633,15357,4715,15355,4841,15353,5061,15349,5216,15342,5391,15331,5577,15318,5770,15299,5967,15274,6150,15243,6223,15206,6280,15161,6310,15111,6317,15055,6300,14994,6262,14928,6208,14860,6141,14788,5994,14715,5838,14641,5684,14566,5529,14492,5384,14418,5247,14346,5121,14216,4892,14079,4682,13948,4496,13822,4330,15359,3498,15359,3501,15359,3520,15359,3598,15358,3719,15356,3860,15355,4137,15351,4305,15344,4563,15334,4809,15321,5116,15303,5273,15280,5418,15250,5547,15214,5653,15170,5722,15120,5761,15064,5763,15002,5733,14935,5673,14865,5597,14792,5504,14716,5400,14640,5294,14563,5185,14486,5041,14410,4841,14335,4655,14191,4482,14051,4325,13918,4183,13790,4012,15360,2282,15360,2285,15360,2306,15360,2401,15359,2547,15357,2748,15355,3103,15352,3349,15345,3675,15336,4020,15324,4272,15307,4496,15285,4716,15255,4908,15220,5086,15178,5170,15128,5214,15072,5234,15010,5231,14943,5206,14871,5166,14796,5102,14718,4971,14639,4833,14559,4687,14480,4541,14402,4401,14315,4268,14167,4142,14025,3958,13888,3747,13759,3556,15360,923,15360,925,15360,946,15360,1052,15359,1214,15357,1494,15356,1892,15352,2274,15346,2663,15338,3099,15326,3393,15309,3679,15288,3980,15260,4183,15226,4325,15185,4437,15136,4517,15080,4570,15018,4591,14950,4581,14877,4545,14800,4485,14720,4411,14638,4325,14556,4231,14475,4136,14395,3988,14297,3803,14145,3628,13999,3465,13861,3314,13729,3177,15360,263,15360,264,15360,272,15360,325,15359,407,15358,548,15356,780,15352,1144,15347,1580,15339,2099,15328,2425,15312,2795,15292,3133,15264,3329,15232,3517,15191,3689,15143,3819,15088,3923,15025,3978,14956,3999,14882,3979,14804,3931,14722,3855,14639,3756,14554,3645,14470,3529,14388,3409,14279,3289,14124,3173,13975,3055,13834,2848,13701,2658,15360,49,15360,49,15360,52,15360,75,15359,111,15358,201,15356,283,15353,519,15348,726,15340,1045,15329,1415,15314,1795,15295,2173,15269,2410,15237,2649,15197,2866,15150,3054,15095,3140,15032,3196,14963,3228,14888,3236,14808,3224,14725,3191,14639,3146,14553,3088,14466,2976,14382,2836,14262,2692,14103,2549,13952,2409,13808,2278,13674,2154,15360,4,15360,4,15360,4,15360,13,15359,33,15358,59,15357,112,15353,199,15348,302,15341,456,15331,628,15316,827,15297,1082,15272,1332,15241,1601,15202,1851,15156,2069,15101,2172,15039,2256,14970,2314,14894,2348,14813,2358,14728,2344,14640,2311,14551,2263,14463,2203,14376,2133,14247,2059,14084,1915,13930,1761,13784,1609,13648,1464,15360,0,15360,0,15360,0,15360,3,15359,18,15358,26,15357,53,15354,80,15348,97,15341,165,15332,238,15318,326,15299,427,15275,529,15245,654,15207,771,15161,885,15108,994,15046,1089,14976,1170,14900,1229,14817,1266,14731,1284,14641,1282,14550,1260,14460,1223,14370,1174,14232,1116,14066,1050,13909,981,13761,910,13623,839]);let wn=null;function m0(){return wn===null&&(wn=new ac(p0,32,32,eo,qi),wn.minFilter=an,wn.magFilter=an,wn.wrapS=Pn,wn.wrapT=Pn,wn.generateMipmaps=!1,wn.needsUpdate=!0),wn}class x0{constructor(e={}){const{canvas:t=Sd(),context:n=null,depth:a=!0,stencil:r=!1,alpha:s=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:h=!1,reversedDepthBuffer:u=!1}=e;this.isWebGLRenderer=!0;let p;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");p=n.getContextAttributes().alpha}else p=s;const g=new Set([no,to,Qs]),y=new Set([vn,ui,fa,pa,$s,Zs]),m=new Uint32Array(4),f=new Int32Array(4);let E=null,T=null;const w=[],L=[];this.domElement=t,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=jn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const S=this;let R=!1;this._outputColorSpace=jt;let B=0,M=0,_=null,D=-1,F=null;const z=new pt,K=new pt;let X=null;const Y=new Xe(0);let ee=0,W=t.width,ie=t.height,re=1,be=null,He=null;const $e=new pt(0,0,W,ie),Qe=new pt(0,0,W,ie);let Ze=!1;const j=new oo;let $=!1,fe=!1;const De=new st,Me=new C,Be=new pt,_t={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ke=!1;function qe(){return _===null?re:1}let A=n;function Ge(v,I){return t.getContext(v,I)}try{const v={alpha:!0,depth:a,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:h};if("setAttribute"in t&&t.setAttribute("data-engine",`three.js r${qs}`),t.addEventListener("webglcontextlost",te,!1),t.addEventListener("webglcontextrestored",Z,!1),t.addEventListener("webglcontextcreationerror",ge,!1),A===null){const I="webgl2";if(A=Ge(I,v),A===null)throw Ge(I)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(v){throw v("WebGLRenderer: "+v.message),v}let Ve,et,xe,ot,G,J,b,x,N,V,q,H,ye,le,Se,ve,Q,ae,Ce,we,ue,Le,P,de;function se(){Ve=new Tp(A),Ve.init(),Le=new s0(A,Ve),et=new mp(A,Ve,e,Le),xe=new a0(A,Ve),et.reversedDepthBuffer&&u&&xe.buffers.depth.setReversed(!0),ot=new Ap(A),G=new Xm,J=new r0(A,Ve,xe,G,et,Le,ot),b=new gp(S),x=new Sp(S),N=new Ph(A),P=new fp(A,N),V=new Ep(A,N,ot,P),q=new Rp(A,V,N,ot),Ce=new Cp(A,et,J),ve=new xp(G),H=new Wm(S,b,x,Ve,et,P,ve),ye=new u0(S,G),le=new qm,Se=new Qm(Ve),ae=new up(S,b,x,xe,q,p,l),Q=new n0(S,q,et),de=new f0(A,ot,et,xe),we=new pp(A,Ve,ot),ue=new wp(A,Ve,ot),ot.programs=H.programs,S.capabilities=et,S.extensions=Ve,S.properties=G,S.renderLists=le,S.shadowMap=Q,S.state=xe,S.info=ot}se();const oe=new d0(S,A);this.xr=oe,this.getContext=function(){return A},this.getContextAttributes=function(){return A.getContextAttributes()},this.forceContextLoss=function(){const v=Ve.get("WEBGL_lose_context");v&&v.loseContext()},this.forceContextRestore=function(){const v=Ve.get("WEBGL_lose_context");v&&v.restoreContext()},this.getPixelRatio=function(){return re},this.setPixelRatio=function(v){v!==void 0&&(re=v,this.setSize(W,ie,!1))},this.getSize=function(v){return v.set(W,ie)},this.setSize=function(v,I,k=!0){if(oe.isPresenting){Ie("WebGLRenderer: Can't change size while VR device is presenting.");return}W=v,ie=I,t.width=Math.floor(v*re),t.height=Math.floor(I*re),k===!0&&(t.style.width=v+"px",t.style.height=I+"px"),this.setViewport(0,0,v,I)},this.getDrawingBufferSize=function(v){return v.set(W*re,ie*re).floor()},this.setDrawingBufferSize=function(v,I,k){W=v,ie=I,re=k,t.width=Math.floor(v*k),t.height=Math.floor(I*k),this.setViewport(0,0,v,I)},this.getCurrentViewport=function(v){return v.copy(z)},this.getViewport=function(v){return v.copy($e)},this.setViewport=function(v,I,k,O){v.isVector4?$e.set(v.x,v.y,v.z,v.w):$e.set(v,I,k,O),xe.viewport(z.copy($e).multiplyScalar(re).round())},this.getScissor=function(v){return v.copy(Qe)},this.setScissor=function(v,I,k,O){v.isVector4?Qe.set(v.x,v.y,v.z,v.w):Qe.set(v,I,k,O),xe.scissor(K.copy(Qe).multiplyScalar(re).round())},this.getScissorTest=function(){return Ze},this.setScissorTest=function(v){xe.setScissorTest(Ze=v)},this.setOpaqueSort=function(v){be=v},this.setTransparentSort=function(v){He=v},this.getClearColor=function(v){return v.copy(ae.getClearColor())},this.setClearColor=function(){ae.setClearColor(...arguments)},this.getClearAlpha=function(){return ae.getClearAlpha()},this.setClearAlpha=function(){ae.setClearAlpha(...arguments)},this.clear=function(v=!0,I=!0,k=!0){let O=0;if(v){let U=!1;if(_!==null){const ne=_.texture.format;U=g.has(ne)}if(U){const ne=_.texture.type,he=y.has(ne),_e=ae.getClearColor(),me=ae.getClearAlpha(),Ae=_e.r,Pe=_e.g,Te=_e.b;he?(m[0]=Ae,m[1]=Pe,m[2]=Te,m[3]=me,A.clearBufferuiv(A.COLOR,0,m)):(f[0]=Ae,f[1]=Pe,f[2]=Te,f[3]=me,A.clearBufferiv(A.COLOR,0,f))}else O|=A.COLOR_BUFFER_BIT}I&&(O|=A.DEPTH_BUFFER_BIT),k&&(O|=A.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),A.clear(O)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){t.removeEventListener("webglcontextlost",te,!1),t.removeEventListener("webglcontextrestored",Z,!1),t.removeEventListener("webglcontextcreationerror",ge,!1),ae.dispose(),le.dispose(),Se.dispose(),G.dispose(),b.dispose(),x.dispose(),q.dispose(),P.dispose(),de.dispose(),H.dispose(),oe.dispose(),oe.removeEventListener("sessionstart",vo),oe.removeEventListener("sessionend",yo),ei.stop()};function te(v){v.preventDefault(),Io("WebGLRenderer: Context Lost."),R=!0}function Z(){Io("WebGLRenderer: Context Restored."),R=!1;const v=ot.autoReset,I=Q.enabled,k=Q.autoUpdate,O=Q.needsUpdate,U=Q.type;se(),ot.autoReset=v,Q.enabled=I,Q.autoUpdate=k,Q.needsUpdate=O,Q.type=U}function ge(v){mt("WebGLRenderer: A WebGL context could not be created. Reason: ",v.statusMessage)}function Ne(v){const I=v.target;I.removeEventListener("dispose",Ne),lt(I)}function lt(v){tt(v),G.remove(v)}function tt(v){const I=G.get(v).programs;I!==void 0&&(I.forEach(function(k){H.releaseProgram(k)}),v.isShaderMaterial&&H.releaseShaderCache(v))}this.renderBufferDirect=function(v,I,k,O,U,ne){I===null&&(I=_t);const he=U.isMesh&&U.matrixWorld.determinant()<0,_e=Lc(v,I,k,O,U);xe.setMaterial(O,he);let me=k.index,Ae=1;if(O.wireframe===!0){if(me=V.getWireframeAttribute(k),me===void 0)return;Ae=2}const Pe=k.drawRange,Te=k.attributes.position;let We=Pe.start*Ae,nt=(Pe.start+Pe.count)*Ae;ne!==null&&(We=Math.max(We,ne.start*Ae),nt=Math.min(nt,(ne.start+ne.count)*Ae)),me!==null?(We=Math.max(We,0),nt=Math.min(nt,me.count)):Te!=null&&(We=Math.max(We,0),nt=Math.min(nt,Te.count));const ut=nt-We;if(ut<0||ut===1/0)return;P.setup(U,O,_e,k,me);let ft,rt=we;if(me!==null&&(ft=N.get(me),rt=ue,rt.setIndex(ft)),U.isMesh)O.wireframe===!0?(xe.setLineWidth(O.wireframeLinewidth*qe()),rt.setMode(A.LINES)):rt.setMode(A.TRIANGLES);else if(U.isLine){let Ee=O.linewidth;Ee===void 0&&(Ee=1),xe.setLineWidth(Ee*qe()),U.isLineSegments?rt.setMode(A.LINES):U.isLineLoop?rt.setMode(A.LINE_LOOP):rt.setMode(A.LINE_STRIP)}else U.isPoints?rt.setMode(A.POINTS):U.isSprite&&rt.setMode(A.TRIANGLES);if(U.isBatchedMesh)if(U._multiDrawInstances!==null)ga("WebGLRenderer: renderMultiDrawInstances has been deprecated and will be removed in r184. Append to renderMultiDraw arguments and use indirection."),rt.renderMultiDrawInstances(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount,U._multiDrawInstances);else if(Ve.get("WEBGL_multi_draw"))rt.renderMultiDraw(U._multiDrawStarts,U._multiDrawCounts,U._multiDrawCount);else{const Ee=U._multiDrawStarts,dt=U._multiDrawCounts,Ye=U._multiDrawCount,Xt=me?N.get(me).bytesPerElement:1,xi=G.get(O).currentProgram.getUniforms();for(let Kt=0;Kt<Ye;Kt++)xi.setValue(A,"_gl_DrawID",Kt),rt.render(Ee[Kt]/Xt,dt[Kt])}else if(U.isInstancedMesh)rt.renderInstances(We,ut,U.count);else if(k.isInstancedBufferGeometry){const Ee=k._maxInstanceCount!==void 0?k._maxInstanceCount:1/0,dt=Math.min(k.instanceCount,Ee);rt.renderInstances(We,ut,dt)}else rt.render(We,ut)};function pn(v,I,k){v.transparent===!0&&v.side===Rn&&v.forceSinglePass===!1?(v.side=Ht,v.needsUpdate=!0,Sa(v,I,k),v.side=Zn,v.needsUpdate=!0,Sa(v,I,k),v.side=Rn):Sa(v,I,k)}this.compile=function(v,I,k=null){k===null&&(k=v),T=Se.get(k),T.init(I),L.push(T),k.traverseVisible(function(U){U.isLight&&U.layers.test(I.layers)&&(T.pushLight(U),U.castShadow&&T.pushShadow(U))}),v!==k&&v.traverseVisible(function(U){U.isLight&&U.layers.test(I.layers)&&(T.pushLight(U),U.castShadow&&T.pushShadow(U))}),T.setupLights();const O=new Set;return v.traverse(function(U){if(!(U.isMesh||U.isPoints||U.isLine||U.isSprite))return;const ne=U.material;if(ne)if(Array.isArray(ne))for(let he=0;he<ne.length;he++){const _e=ne[he];pn(_e,k,U),O.add(_e)}else pn(ne,k,U),O.add(ne)}),T=L.pop(),O},this.compileAsync=function(v,I,k=null){const O=this.compile(v,I,k);return new Promise(U=>{function ne(){if(O.forEach(function(he){G.get(he).currentProgram.isReady()&&O.delete(he)}),O.size===0){U(v);return}setTimeout(ne,10)}Ve.get("KHR_parallel_shader_compile")!==null?ne():setTimeout(ne,10)})};let on=null;function Pc(v){on&&on(v)}function vo(){ei.stop()}function yo(){ei.start()}const ei=new cc;ei.setAnimationLoop(Pc),typeof self<"u"&&ei.setContext(self),this.setAnimationLoop=function(v){on=v,oe.setAnimationLoop(v),v===null?ei.stop():ei.start()},oe.addEventListener("sessionstart",vo),oe.addEventListener("sessionend",yo),this.render=function(v,I){if(I!==void 0&&I.isCamera!==!0){mt("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(R===!0)return;if(v.matrixWorldAutoUpdate===!0&&v.updateMatrixWorld(),I.parent===null&&I.matrixWorldAutoUpdate===!0&&I.updateMatrixWorld(),oe.enabled===!0&&oe.isPresenting===!0&&(oe.cameraAutoUpdate===!0&&oe.updateCamera(I),I=oe.getCamera()),v.isScene===!0&&v.onBeforeRender(S,v,I,_),T=Se.get(v,L.length),T.init(I),L.push(T),De.multiplyMatrices(I.projectionMatrix,I.matrixWorldInverse),j.setFromProjectionMatrix(De,_n,I.reversedDepth),fe=this.localClippingEnabled,$=ve.init(this.clippingPlanes,fe),E=le.get(v,w.length),E.init(),w.push(E),oe.enabled===!0&&oe.isPresenting===!0){const ne=S.xr.getDepthSensingMesh();ne!==null&&pr(ne,I,-1/0,S.sortObjects)}pr(v,I,0,S.sortObjects),E.finish(),S.sortObjects===!0&&E.sort(be,He),ke=oe.enabled===!1||oe.isPresenting===!1||oe.hasDepthSensing()===!1,ke&&ae.addToRenderList(E,v),this.info.render.frame++,$===!0&&ve.beginShadows();const k=T.state.shadowsArray;Q.render(k,v,I),$===!0&&ve.endShadows(),this.info.autoReset===!0&&this.info.reset();const O=E.opaque,U=E.transmissive;if(T.setupLights(),I.isArrayCamera){const ne=I.cameras;if(U.length>0)for(let he=0,_e=ne.length;he<_e;he++){const me=ne[he];bo(O,U,v,me)}ke&&ae.render(v);for(let he=0,_e=ne.length;he<_e;he++){const me=ne[he];Mo(E,v,me,me.viewport)}}else U.length>0&&bo(O,U,v,I),ke&&ae.render(v),Mo(E,v,I);_!==null&&M===0&&(J.updateMultisampleRenderTarget(_),J.updateRenderTargetMipmap(_)),v.isScene===!0&&v.onAfterRender(S,v,I),P.resetDefaultState(),D=-1,F=null,L.pop(),L.length>0?(T=L[L.length-1],$===!0&&ve.setGlobalState(S.clippingPlanes,T.state.camera)):T=null,w.pop(),w.length>0?E=w[w.length-1]:E=null};function pr(v,I,k,O){if(v.visible===!1)return;if(v.layers.test(I.layers)){if(v.isGroup)k=v.renderOrder;else if(v.isLOD)v.autoUpdate===!0&&v.update(I);else if(v.isLight)T.pushLight(v),v.castShadow&&T.pushShadow(v);else if(v.isSprite){if(!v.frustumCulled||j.intersectsSprite(v)){O&&Be.setFromMatrixPosition(v.matrixWorld).applyMatrix4(De);const he=q.update(v),_e=v.material;_e.visible&&E.push(v,he,_e,k,Be.z,null)}}else if((v.isMesh||v.isLine||v.isPoints)&&(!v.frustumCulled||j.intersectsObject(v))){const he=q.update(v),_e=v.material;if(O&&(v.boundingSphere!==void 0?(v.boundingSphere===null&&v.computeBoundingSphere(),Be.copy(v.boundingSphere.center)):(he.boundingSphere===null&&he.computeBoundingSphere(),Be.copy(he.boundingSphere.center)),Be.applyMatrix4(v.matrixWorld).applyMatrix4(De)),Array.isArray(_e)){const me=he.groups;for(let Ae=0,Pe=me.length;Ae<Pe;Ae++){const Te=me[Ae],We=_e[Te.materialIndex];We&&We.visible&&E.push(v,he,We,k,Be.z,Te)}}else _e.visible&&E.push(v,he,_e,k,Be.z,null)}}const ne=v.children;for(let he=0,_e=ne.length;he<_e;he++)pr(ne[he],I,k,O)}function Mo(v,I,k,O){const{opaque:U,transmissive:ne,transparent:he}=v;T.setupLightsView(k),$===!0&&ve.setGlobalState(S.clippingPlanes,k),O&&xe.viewport(z.copy(O)),U.length>0&&ba(U,I,k),ne.length>0&&ba(ne,I,k),he.length>0&&ba(he,I,k),xe.buffers.depth.setTest(!0),xe.buffers.depth.setMask(!0),xe.buffers.color.setMask(!0),xe.setPolygonOffset(!1)}function bo(v,I,k,O){if((k.isScene===!0?k.overrideMaterial:null)!==null)return;T.state.transmissionRenderTarget[O.id]===void 0&&(T.state.transmissionRenderTarget[O.id]=new fi(1,1,{generateMipmaps:!0,type:Ve.has("EXT_color_buffer_half_float")||Ve.has("EXT_color_buffer_float")?qi:vn,minFilter:di,samples:4,stencilBuffer:r,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:je.workingColorSpace}));const ne=T.state.transmissionRenderTarget[O.id],he=O.viewport||z;ne.setSize(he.z*S.transmissionResolutionScale,he.w*S.transmissionResolutionScale);const _e=S.getRenderTarget(),me=S.getActiveCubeFace(),Ae=S.getActiveMipmapLevel();S.setRenderTarget(ne),S.getClearColor(Y),ee=S.getClearAlpha(),ee<1&&S.setClearColor(16777215,.5),S.clear(),ke&&ae.render(k);const Pe=S.toneMapping;S.toneMapping=jn;const Te=O.viewport;if(O.viewport!==void 0&&(O.viewport=void 0),T.setupLightsView(O),$===!0&&ve.setGlobalState(S.clippingPlanes,O),ba(v,k,O),J.updateMultisampleRenderTarget(ne),J.updateRenderTargetMipmap(ne),Ve.has("WEBGL_multisampled_render_to_texture")===!1){let We=!1;for(let nt=0,ut=I.length;nt<ut;nt++){const ft=I[nt],{object:rt,geometry:Ee,material:dt,group:Ye}=ft;if(dt.side===Rn&&rt.layers.test(O.layers)){const Xt=dt.side;dt.side=Ht,dt.needsUpdate=!0,So(rt,k,O,Ee,dt,Ye),dt.side=Xt,dt.needsUpdate=!0,We=!0}}We===!0&&(J.updateMultisampleRenderTarget(ne),J.updateRenderTargetMipmap(ne))}S.setRenderTarget(_e,me,Ae),S.setClearColor(Y,ee),Te!==void 0&&(O.viewport=Te),S.toneMapping=Pe}function ba(v,I,k){const O=I.isScene===!0?I.overrideMaterial:null;for(let U=0,ne=v.length;U<ne;U++){const he=v[U],{object:_e,geometry:me,group:Ae}=he;let Pe=he.material;Pe.allowOverride===!0&&O!==null&&(Pe=O),_e.layers.test(k.layers)&&So(_e,I,k,me,Pe,Ae)}}function So(v,I,k,O,U,ne){v.onBeforeRender(S,I,k,O,U,ne),v.modelViewMatrix.multiplyMatrices(k.matrixWorldInverse,v.matrixWorld),v.normalMatrix.getNormalMatrix(v.modelViewMatrix),U.onBeforeRender(S,I,k,O,v,ne),U.transparent===!0&&U.side===Rn&&U.forceSinglePass===!1?(U.side=Ht,U.needsUpdate=!0,S.renderBufferDirect(k,I,O,U,v,ne),U.side=Zn,U.needsUpdate=!0,S.renderBufferDirect(k,I,O,U,v,ne),U.side=Rn):S.renderBufferDirect(k,I,O,U,v,ne),v.onAfterRender(S,I,k,O,U,ne)}function Sa(v,I,k){I.isScene!==!0&&(I=_t);const O=G.get(v),U=T.state.lights,ne=T.state.shadowsArray,he=U.state.version,_e=H.getParameters(v,U.state,ne,I,k),me=H.getProgramCacheKey(_e);let Ae=O.programs;O.environment=v.isMeshStandardMaterial?I.environment:null,O.fog=I.fog,O.envMap=(v.isMeshStandardMaterial?x:b).get(v.envMap||O.environment),O.envMapRotation=O.environment!==null&&v.envMap===null?I.environmentRotation:v.envMapRotation,Ae===void 0&&(v.addEventListener("dispose",Ne),Ae=new Map,O.programs=Ae);let Pe=Ae.get(me);if(Pe!==void 0){if(O.currentProgram===Pe&&O.lightsStateVersion===he)return Eo(v,_e),Pe}else _e.uniforms=H.getUniforms(v),v.onBeforeCompile(_e,S),Pe=H.acquireProgram(_e,me),Ae.set(me,Pe),O.uniforms=_e.uniforms;const Te=O.uniforms;return(!v.isShaderMaterial&&!v.isRawShaderMaterial||v.clipping===!0)&&(Te.clippingPlanes=ve.uniform),Eo(v,_e),O.needsLights=Ic(v),O.lightsStateVersion=he,O.needsLights&&(Te.ambientLightColor.value=U.state.ambient,Te.lightProbe.value=U.state.probe,Te.directionalLights.value=U.state.directional,Te.directionalLightShadows.value=U.state.directionalShadow,Te.spotLights.value=U.state.spot,Te.spotLightShadows.value=U.state.spotShadow,Te.rectAreaLights.value=U.state.rectArea,Te.ltc_1.value=U.state.rectAreaLTC1,Te.ltc_2.value=U.state.rectAreaLTC2,Te.pointLights.value=U.state.point,Te.pointLightShadows.value=U.state.pointShadow,Te.hemisphereLights.value=U.state.hemi,Te.directionalShadowMap.value=U.state.directionalShadowMap,Te.directionalShadowMatrix.value=U.state.directionalShadowMatrix,Te.spotShadowMap.value=U.state.spotShadowMap,Te.spotLightMatrix.value=U.state.spotLightMatrix,Te.spotLightMap.value=U.state.spotLightMap,Te.pointShadowMap.value=U.state.pointShadowMap,Te.pointShadowMatrix.value=U.state.pointShadowMatrix),O.currentProgram=Pe,O.uniformsList=null,Pe}function To(v){if(v.uniformsList===null){const I=v.currentProgram.getUniforms();v.uniformsList=Qa.seqWithValue(I.seq,v.uniforms)}return v.uniformsList}function Eo(v,I){const k=G.get(v);k.outputColorSpace=I.outputColorSpace,k.batching=I.batching,k.batchingColor=I.batchingColor,k.instancing=I.instancing,k.instancingColor=I.instancingColor,k.instancingMorph=I.instancingMorph,k.skinning=I.skinning,k.morphTargets=I.morphTargets,k.morphNormals=I.morphNormals,k.morphColors=I.morphColors,k.morphTargetsCount=I.morphTargetsCount,k.numClippingPlanes=I.numClippingPlanes,k.numIntersection=I.numClipIntersection,k.vertexAlphas=I.vertexAlphas,k.vertexTangents=I.vertexTangents,k.toneMapping=I.toneMapping}function Lc(v,I,k,O,U){I.isScene!==!0&&(I=_t),J.resetTextureUnits();const ne=I.fog,he=O.isMeshStandardMaterial?I.environment:null,_e=_===null?S.outputColorSpace:_.isXRRenderTarget===!0?_.texture.colorSpace:Hi,me=(O.isMeshStandardMaterial?x:b).get(O.envMap||he),Ae=O.vertexColors===!0&&!!k.attributes.color&&k.attributes.color.itemSize===4,Pe=!!k.attributes.tangent&&(!!O.normalMap||O.anisotropy>0),Te=!!k.morphAttributes.position,We=!!k.morphAttributes.normal,nt=!!k.morphAttributes.color;let ut=jn;O.toneMapped&&(_===null||_.isXRRenderTarget===!0)&&(ut=S.toneMapping);const ft=k.morphAttributes.position||k.morphAttributes.normal||k.morphAttributes.color,rt=ft!==void 0?ft.length:0,Ee=G.get(O),dt=T.state.lights;if($===!0&&(fe===!0||v!==F)){const Lt=v===F&&O.id===D;ve.setState(O,v,Lt)}let Ye=!1;O.version===Ee.__version?(Ee.needsLights&&Ee.lightsStateVersion!==dt.state.version||Ee.outputColorSpace!==_e||U.isBatchedMesh&&Ee.batching===!1||!U.isBatchedMesh&&Ee.batching===!0||U.isBatchedMesh&&Ee.batchingColor===!0&&U.colorTexture===null||U.isBatchedMesh&&Ee.batchingColor===!1&&U.colorTexture!==null||U.isInstancedMesh&&Ee.instancing===!1||!U.isInstancedMesh&&Ee.instancing===!0||U.isSkinnedMesh&&Ee.skinning===!1||!U.isSkinnedMesh&&Ee.skinning===!0||U.isInstancedMesh&&Ee.instancingColor===!0&&U.instanceColor===null||U.isInstancedMesh&&Ee.instancingColor===!1&&U.instanceColor!==null||U.isInstancedMesh&&Ee.instancingMorph===!0&&U.morphTexture===null||U.isInstancedMesh&&Ee.instancingMorph===!1&&U.morphTexture!==null||Ee.envMap!==me||O.fog===!0&&Ee.fog!==ne||Ee.numClippingPlanes!==void 0&&(Ee.numClippingPlanes!==ve.numPlanes||Ee.numIntersection!==ve.numIntersection)||Ee.vertexAlphas!==Ae||Ee.vertexTangents!==Pe||Ee.morphTargets!==Te||Ee.morphNormals!==We||Ee.morphColors!==nt||Ee.toneMapping!==ut||Ee.morphTargetsCount!==rt)&&(Ye=!0):(Ye=!0,Ee.__version=O.version);let Xt=Ee.currentProgram;Ye===!0&&(Xt=Sa(O,I,U));let xi=!1,Kt=!1,Qi=!1;const ht=Xt.getUniforms(),Nt=Ee.uniforms;if(xe.useProgram(Xt.program)&&(xi=!0,Kt=!0,Qi=!0),O.id!==D&&(D=O.id,Kt=!0),xi||F!==v){xe.buffers.depth.getReversed()&&v.reversedDepth!==!0&&(v._reversedDepth=!0,v.updateProjectionMatrix()),ht.setValue(A,"projectionMatrix",v.projectionMatrix),ht.setValue(A,"viewMatrix",v.matrixWorldInverse);const Ft=ht.map.cameraPosition;Ft!==void 0&&Ft.setValue(A,Me.setFromMatrixPosition(v.matrixWorld)),et.logarithmicDepthBuffer&&ht.setValue(A,"logDepthBufFC",2/(Math.log(v.far+1)/Math.LN2)),(O.isMeshPhongMaterial||O.isMeshToonMaterial||O.isMeshLambertMaterial||O.isMeshBasicMaterial||O.isMeshStandardMaterial||O.isShaderMaterial)&&ht.setValue(A,"isOrthographic",v.isOrthographicCamera===!0),F!==v&&(F=v,Kt=!0,Qi=!0)}if(U.isSkinnedMesh){ht.setOptional(A,U,"bindMatrix"),ht.setOptional(A,U,"bindMatrixInverse");const Lt=U.skeleton;Lt&&(Lt.boneTexture===null&&Lt.computeBoneTexture(),ht.setValue(A,"boneTexture",Lt.boneTexture,J))}U.isBatchedMesh&&(ht.setOptional(A,U,"batchingTexture"),ht.setValue(A,"batchingTexture",U._matricesTexture,J),ht.setOptional(A,U,"batchingIdTexture"),ht.setValue(A,"batchingIdTexture",U._indirectTexture,J),ht.setOptional(A,U,"batchingColorTexture"),U._colorsTexture!==null&&ht.setValue(A,"batchingColorTexture",U._colorsTexture,J));const en=k.morphAttributes;if((en.position!==void 0||en.normal!==void 0||en.color!==void 0)&&Ce.update(U,k,Xt),(Kt||Ee.receiveShadow!==U.receiveShadow)&&(Ee.receiveShadow=U.receiveShadow,ht.setValue(A,"receiveShadow",U.receiveShadow)),O.isMeshGouraudMaterial&&O.envMap!==null&&(Nt.envMap.value=me,Nt.flipEnvMap.value=me.isCubeTexture&&me.isRenderTargetTexture===!1?-1:1),O.isMeshStandardMaterial&&O.envMap===null&&I.environment!==null&&(Nt.envMapIntensity.value=I.environmentIntensity),Nt.dfgLUT!==void 0&&(Nt.dfgLUT.value=m0()),Kt&&(ht.setValue(A,"toneMappingExposure",S.toneMappingExposure),Ee.needsLights&&Dc(Nt,Qi),ne&&O.fog===!0&&ye.refreshFogUniforms(Nt,ne),ye.refreshMaterialUniforms(Nt,O,re,ie,T.state.transmissionRenderTarget[v.id]),Qa.upload(A,To(Ee),Nt,J)),O.isShaderMaterial&&O.uniformsNeedUpdate===!0&&(Qa.upload(A,To(Ee),Nt,J),O.uniformsNeedUpdate=!1),O.isSpriteMaterial&&ht.setValue(A,"center",U.center),ht.setValue(A,"modelViewMatrix",U.modelViewMatrix),ht.setValue(A,"normalMatrix",U.normalMatrix),ht.setValue(A,"modelMatrix",U.matrixWorld),O.isShaderMaterial||O.isRawShaderMaterial){const Lt=O.uniformsGroups;for(let Ft=0,mr=Lt.length;Ft<mr;Ft++){const ti=Lt[Ft];de.update(ti,Xt),de.bind(ti,Xt)}}return Xt}function Dc(v,I){v.ambientLightColor.needsUpdate=I,v.lightProbe.needsUpdate=I,v.directionalLights.needsUpdate=I,v.directionalLightShadows.needsUpdate=I,v.pointLights.needsUpdate=I,v.pointLightShadows.needsUpdate=I,v.spotLights.needsUpdate=I,v.spotLightShadows.needsUpdate=I,v.rectAreaLights.needsUpdate=I,v.hemisphereLights.needsUpdate=I}function Ic(v){return v.isMeshLambertMaterial||v.isMeshToonMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isShadowMaterial||v.isShaderMaterial&&v.lights===!0}this.getActiveCubeFace=function(){return B},this.getActiveMipmapLevel=function(){return M},this.getRenderTarget=function(){return _},this.setRenderTargetTextures=function(v,I,k){const O=G.get(v);O.__autoAllocateDepthBuffer=v.resolveDepthBuffer===!1,O.__autoAllocateDepthBuffer===!1&&(O.__useRenderToTexture=!1),G.get(v.texture).__webglTexture=I,G.get(v.depthTexture).__webglTexture=O.__autoAllocateDepthBuffer?void 0:k,O.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(v,I){const k=G.get(v);k.__webglFramebuffer=I,k.__useDefaultFramebuffer=I===void 0};const Uc=A.createFramebuffer();this.setRenderTarget=function(v,I=0,k=0){_=v,B=I,M=k;let O=!0,U=null,ne=!1,he=!1;if(v){const me=G.get(v);if(me.__useDefaultFramebuffer!==void 0)xe.bindFramebuffer(A.FRAMEBUFFER,null),O=!1;else if(me.__webglFramebuffer===void 0)J.setupRenderTarget(v);else if(me.__hasExternalTextures)J.rebindTextures(v,G.get(v.texture).__webglTexture,G.get(v.depthTexture).__webglTexture);else if(v.depthBuffer){const Te=v.depthTexture;if(me.__boundDepthTexture!==Te){if(Te!==null&&G.has(Te)&&(v.width!==Te.image.width||v.height!==Te.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");J.setupDepthRenderbuffer(v)}}const Ae=v.texture;(Ae.isData3DTexture||Ae.isDataArrayTexture||Ae.isCompressedArrayTexture)&&(he=!0);const Pe=G.get(v).__webglFramebuffer;v.isWebGLCubeRenderTarget?(Array.isArray(Pe[I])?U=Pe[I][k]:U=Pe[I],ne=!0):v.samples>0&&J.useMultisampledRTT(v)===!1?U=G.get(v).__webglMultisampledFramebuffer:Array.isArray(Pe)?U=Pe[k]:U=Pe,z.copy(v.viewport),K.copy(v.scissor),X=v.scissorTest}else z.copy($e).multiplyScalar(re).floor(),K.copy(Qe).multiplyScalar(re).floor(),X=Ze;if(k!==0&&(U=Uc),xe.bindFramebuffer(A.FRAMEBUFFER,U)&&O&&xe.drawBuffers(v,U),xe.viewport(z),xe.scissor(K),xe.setScissorTest(X),ne){const me=G.get(v.texture);A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_CUBE_MAP_POSITIVE_X+I,me.__webglTexture,k)}else if(he){const me=I;for(let Ae=0;Ae<v.textures.length;Ae++){const Pe=G.get(v.textures[Ae]);A.framebufferTextureLayer(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0+Ae,Pe.__webglTexture,k,me)}}else if(v!==null&&k!==0){const me=G.get(v.texture);A.framebufferTexture2D(A.FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,me.__webglTexture,k)}D=-1},this.readRenderTargetPixels=function(v,I,k,O,U,ne,he,_e=0){if(!(v&&v.isWebGLRenderTarget)){mt("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let me=G.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&he!==void 0&&(me=me[he]),me){xe.bindFramebuffer(A.FRAMEBUFFER,me);try{const Ae=v.textures[_e],Pe=Ae.format,Te=Ae.type;if(!et.textureFormatReadable(Pe)){mt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!et.textureTypeReadable(Te)){mt("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}I>=0&&I<=v.width-O&&k>=0&&k<=v.height-U&&(v.textures.length>1&&A.readBuffer(A.COLOR_ATTACHMENT0+_e),A.readPixels(I,k,O,U,Le.convert(Pe),Le.convert(Te),ne))}finally{const Ae=_!==null?G.get(_).__webglFramebuffer:null;xe.bindFramebuffer(A.FRAMEBUFFER,Ae)}}},this.readRenderTargetPixelsAsync=async function(v,I,k,O,U,ne,he,_e=0){if(!(v&&v.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let me=G.get(v).__webglFramebuffer;if(v.isWebGLCubeRenderTarget&&he!==void 0&&(me=me[he]),me)if(I>=0&&I<=v.width-O&&k>=0&&k<=v.height-U){xe.bindFramebuffer(A.FRAMEBUFFER,me);const Ae=v.textures[_e],Pe=Ae.format,Te=Ae.type;if(!et.textureFormatReadable(Pe))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!et.textureTypeReadable(Te))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const We=A.createBuffer();A.bindBuffer(A.PIXEL_PACK_BUFFER,We),A.bufferData(A.PIXEL_PACK_BUFFER,ne.byteLength,A.STREAM_READ),v.textures.length>1&&A.readBuffer(A.COLOR_ATTACHMENT0+_e),A.readPixels(I,k,O,U,Le.convert(Pe),Le.convert(Te),0);const nt=_!==null?G.get(_).__webglFramebuffer:null;xe.bindFramebuffer(A.FRAMEBUFFER,nt);const ut=A.fenceSync(A.SYNC_GPU_COMMANDS_COMPLETE,0);return A.flush(),await Td(A,ut,4),A.bindBuffer(A.PIXEL_PACK_BUFFER,We),A.getBufferSubData(A.PIXEL_PACK_BUFFER,0,ne),A.deleteBuffer(We),A.deleteSync(ut),ne}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(v,I=null,k=0){const O=Math.pow(2,-k),U=Math.floor(v.image.width*O),ne=Math.floor(v.image.height*O),he=I!==null?I.x:0,_e=I!==null?I.y:0;J.setTexture2D(v,0),A.copyTexSubImage2D(A.TEXTURE_2D,k,0,0,he,_e,U,ne),xe.unbindTexture()};const Nc=A.createFramebuffer(),Fc=A.createFramebuffer();this.copyTextureToTexture=function(v,I,k=null,O=null,U=0,ne=null){ne===null&&(U!==0?(ga("WebGLRenderer: copyTextureToTexture function signature has changed to support src and dst mipmap levels."),ne=U,U=0):ne=0);let he,_e,me,Ae,Pe,Te,We,nt,ut;const ft=v.isCompressedTexture?v.mipmaps[ne]:v.image;if(k!==null)he=k.max.x-k.min.x,_e=k.max.y-k.min.y,me=k.isBox3?k.max.z-k.min.z:1,Ae=k.min.x,Pe=k.min.y,Te=k.isBox3?k.min.z:0;else{const en=Math.pow(2,-U);he=Math.floor(ft.width*en),_e=Math.floor(ft.height*en),v.isDataArrayTexture?me=ft.depth:v.isData3DTexture?me=Math.floor(ft.depth*en):me=1,Ae=0,Pe=0,Te=0}O!==null?(We=O.x,nt=O.y,ut=O.z):(We=0,nt=0,ut=0);const rt=Le.convert(I.format),Ee=Le.convert(I.type);let dt;I.isData3DTexture?(J.setTexture3D(I,0),dt=A.TEXTURE_3D):I.isDataArrayTexture||I.isCompressedArrayTexture?(J.setTexture2DArray(I,0),dt=A.TEXTURE_2D_ARRAY):(J.setTexture2D(I,0),dt=A.TEXTURE_2D),A.pixelStorei(A.UNPACK_FLIP_Y_WEBGL,I.flipY),A.pixelStorei(A.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),A.pixelStorei(A.UNPACK_ALIGNMENT,I.unpackAlignment);const Ye=A.getParameter(A.UNPACK_ROW_LENGTH),Xt=A.getParameter(A.UNPACK_IMAGE_HEIGHT),xi=A.getParameter(A.UNPACK_SKIP_PIXELS),Kt=A.getParameter(A.UNPACK_SKIP_ROWS),Qi=A.getParameter(A.UNPACK_SKIP_IMAGES);A.pixelStorei(A.UNPACK_ROW_LENGTH,ft.width),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,ft.height),A.pixelStorei(A.UNPACK_SKIP_PIXELS,Ae),A.pixelStorei(A.UNPACK_SKIP_ROWS,Pe),A.pixelStorei(A.UNPACK_SKIP_IMAGES,Te);const ht=v.isDataArrayTexture||v.isData3DTexture,Nt=I.isDataArrayTexture||I.isData3DTexture;if(v.isDepthTexture){const en=G.get(v),Lt=G.get(I),Ft=G.get(en.__renderTarget),mr=G.get(Lt.__renderTarget);xe.bindFramebuffer(A.READ_FRAMEBUFFER,Ft.__webglFramebuffer),xe.bindFramebuffer(A.DRAW_FRAMEBUFFER,mr.__webglFramebuffer);for(let ti=0;ti<me;ti++)ht&&(A.framebufferTextureLayer(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,G.get(v).__webglTexture,U,Te+ti),A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,G.get(I).__webglTexture,ne,ut+ti)),A.blitFramebuffer(Ae,Pe,he,_e,We,nt,he,_e,A.DEPTH_BUFFER_BIT,A.NEAREST);xe.bindFramebuffer(A.READ_FRAMEBUFFER,null),xe.bindFramebuffer(A.DRAW_FRAMEBUFFER,null)}else if(U!==0||v.isRenderTargetTexture||G.has(v)){const en=G.get(v),Lt=G.get(I);xe.bindFramebuffer(A.READ_FRAMEBUFFER,Nc),xe.bindFramebuffer(A.DRAW_FRAMEBUFFER,Fc);for(let Ft=0;Ft<me;Ft++)ht?A.framebufferTextureLayer(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,en.__webglTexture,U,Te+Ft):A.framebufferTexture2D(A.READ_FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,en.__webglTexture,U),Nt?A.framebufferTextureLayer(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,Lt.__webglTexture,ne,ut+Ft):A.framebufferTexture2D(A.DRAW_FRAMEBUFFER,A.COLOR_ATTACHMENT0,A.TEXTURE_2D,Lt.__webglTexture,ne),U!==0?A.blitFramebuffer(Ae,Pe,he,_e,We,nt,he,_e,A.COLOR_BUFFER_BIT,A.NEAREST):Nt?A.copyTexSubImage3D(dt,ne,We,nt,ut+Ft,Ae,Pe,he,_e):A.copyTexSubImage2D(dt,ne,We,nt,Ae,Pe,he,_e);xe.bindFramebuffer(A.READ_FRAMEBUFFER,null),xe.bindFramebuffer(A.DRAW_FRAMEBUFFER,null)}else Nt?v.isDataTexture||v.isData3DTexture?A.texSubImage3D(dt,ne,We,nt,ut,he,_e,me,rt,Ee,ft.data):I.isCompressedArrayTexture?A.compressedTexSubImage3D(dt,ne,We,nt,ut,he,_e,me,rt,ft.data):A.texSubImage3D(dt,ne,We,nt,ut,he,_e,me,rt,Ee,ft):v.isDataTexture?A.texSubImage2D(A.TEXTURE_2D,ne,We,nt,he,_e,rt,Ee,ft.data):v.isCompressedTexture?A.compressedTexSubImage2D(A.TEXTURE_2D,ne,We,nt,ft.width,ft.height,rt,ft.data):A.texSubImage2D(A.TEXTURE_2D,ne,We,nt,he,_e,rt,Ee,ft);A.pixelStorei(A.UNPACK_ROW_LENGTH,Ye),A.pixelStorei(A.UNPACK_IMAGE_HEIGHT,Xt),A.pixelStorei(A.UNPACK_SKIP_PIXELS,xi),A.pixelStorei(A.UNPACK_SKIP_ROWS,Kt),A.pixelStorei(A.UNPACK_SKIP_IMAGES,Qi),ne===0&&I.generateMipmaps&&A.generateMipmap(dt),xe.unbindTexture()},this.initRenderTarget=function(v){G.get(v).__webglFramebuffer===void 0&&J.setupRenderTarget(v)},this.initTexture=function(v){v.isCubeTexture?J.setTextureCube(v,0):v.isData3DTexture?J.setTexture3D(v,0):v.isDataArrayTexture||v.isCompressedArrayTexture?J.setTexture2DArray(v,0):J.setTexture2D(v,0),xe.unbindTexture()},this.resetState=function(){B=0,M=0,_=null,xe.reset(),P.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return _n}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(e){this._outputColorSpace=e;const t=this.getContext();t.drawingBufferColorSpace=je._getDrawingBufferColorSpace(e),t.unpackColorSpace=je._getUnpackColorSpace()}}const Rl={type:"change"},po={type:"start"},pc={type:"end"},Ya=new ro,Pl=new Wn,g0=Math.cos(70*Kn.DEG2RAD),vt=new C,Bt=2*Math.PI,at={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},Yr=1e-6;class _0 extends Ch{constructor(e,t=null){super(e,t),this.state=at.NONE,this.target=new C,this.cursor=new C,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.keyRotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Fi.ROTATE,MIDDLE:Fi.DOLLY,RIGHT:Fi.PAN},this.touches={ONE:Ni.ROTATE,TWO:Ni.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this._lastPosition=new C,this._lastQuaternion=new Jn,this._lastTargetPosition=new C,this._quat=new Jn().setFromUnitVectors(e.up,new C(0,1,0)),this._quatInverse=this._quat.clone().invert(),this._spherical=new al,this._sphericalDelta=new al,this._scale=1,this._panOffset=new C,this._rotateStart=new Ue,this._rotateEnd=new Ue,this._rotateDelta=new Ue,this._panStart=new Ue,this._panEnd=new Ue,this._panDelta=new Ue,this._dollyStart=new Ue,this._dollyEnd=new Ue,this._dollyDelta=new Ue,this._dollyDirection=new C,this._mouse=new Ue,this._performCursorZoom=!1,this._pointers=[],this._pointerPositions={},this._controlActive=!1,this._onPointerMove=y0.bind(this),this._onPointerDown=v0.bind(this),this._onPointerUp=M0.bind(this),this._onContextMenu=C0.bind(this),this._onMouseWheel=T0.bind(this),this._onKeyDown=E0.bind(this),this._onTouchStart=w0.bind(this),this._onTouchMove=A0.bind(this),this._onMouseDown=b0.bind(this),this._onMouseMove=S0.bind(this),this._interceptControlDown=R0.bind(this),this._interceptControlUp=P0.bind(this),this.domElement!==null&&this.connect(this.domElement),this.update()}connect(e){super.connect(e),this.domElement.addEventListener("pointerdown",this._onPointerDown),this.domElement.addEventListener("pointercancel",this._onPointerUp),this.domElement.addEventListener("contextmenu",this._onContextMenu),this.domElement.addEventListener("wheel",this._onMouseWheel,{passive:!1}),this.domElement.getRootNode().addEventListener("keydown",this._interceptControlDown,{passive:!0,capture:!0}),this.domElement.style.touchAction="none"}disconnect(){this.domElement.removeEventListener("pointerdown",this._onPointerDown),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.domElement.removeEventListener("pointercancel",this._onPointerUp),this.domElement.removeEventListener("wheel",this._onMouseWheel),this.domElement.removeEventListener("contextmenu",this._onContextMenu),this.stopListenToKeyEvents(),this.domElement.getRootNode().removeEventListener("keydown",this._interceptControlDown,{capture:!0}),this.domElement.style.touchAction="auto"}dispose(){this.disconnect()}getPolarAngle(){return this._spherical.phi}getAzimuthalAngle(){return this._spherical.theta}getDistance(){return this.object.position.distanceTo(this.target)}listenToKeyEvents(e){e.addEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=e}stopListenToKeyEvents(){this._domElementKeyEvents!==null&&(this._domElementKeyEvents.removeEventListener("keydown",this._onKeyDown),this._domElementKeyEvents=null)}saveState(){this.target0.copy(this.target),this.position0.copy(this.object.position),this.zoom0=this.object.zoom}reset(){this.target.copy(this.target0),this.object.position.copy(this.position0),this.object.zoom=this.zoom0,this.object.updateProjectionMatrix(),this.dispatchEvent(Rl),this.update(),this.state=at.NONE}update(e=null){const t=this.object.position;vt.copy(t).sub(this.target),vt.applyQuaternion(this._quat),this._spherical.setFromVector3(vt),this.autoRotate&&this.state===at.NONE&&this._rotateLeft(this._getAutoRotationAngle(e)),this.enableDamping?(this._spherical.theta+=this._sphericalDelta.theta*this.dampingFactor,this._spherical.phi+=this._sphericalDelta.phi*this.dampingFactor):(this._spherical.theta+=this._sphericalDelta.theta,this._spherical.phi+=this._sphericalDelta.phi);let n=this.minAzimuthAngle,a=this.maxAzimuthAngle;isFinite(n)&&isFinite(a)&&(n<-Math.PI?n+=Bt:n>Math.PI&&(n-=Bt),a<-Math.PI?a+=Bt:a>Math.PI&&(a-=Bt),n<=a?this._spherical.theta=Math.max(n,Math.min(a,this._spherical.theta)):this._spherical.theta=this._spherical.theta>(n+a)/2?Math.max(n,this._spherical.theta):Math.min(a,this._spherical.theta)),this._spherical.phi=Math.max(this.minPolarAngle,Math.min(this.maxPolarAngle,this._spherical.phi)),this._spherical.makeSafe(),this.enableDamping===!0?this.target.addScaledVector(this._panOffset,this.dampingFactor):this.target.add(this._panOffset),this.target.sub(this.cursor),this.target.clampLength(this.minTargetRadius,this.maxTargetRadius),this.target.add(this.cursor);let r=!1;if(this.zoomToCursor&&this._performCursorZoom||this.object.isOrthographicCamera)this._spherical.radius=this._clampDistance(this._spherical.radius);else{const s=this._spherical.radius;this._spherical.radius=this._clampDistance(this._spherical.radius*this._scale),r=s!=this._spherical.radius}if(vt.setFromSpherical(this._spherical),vt.applyQuaternion(this._quatInverse),t.copy(this.target).add(vt),this.object.lookAt(this.target),this.enableDamping===!0?(this._sphericalDelta.theta*=1-this.dampingFactor,this._sphericalDelta.phi*=1-this.dampingFactor,this._panOffset.multiplyScalar(1-this.dampingFactor)):(this._sphericalDelta.set(0,0,0),this._panOffset.set(0,0,0)),this.zoomToCursor&&this._performCursorZoom){let s=null;if(this.object.isPerspectiveCamera){const o=vt.length();s=this._clampDistance(o*this._scale);const l=o-s;this.object.position.addScaledVector(this._dollyDirection,l),this.object.updateMatrixWorld(),r=!!l}else if(this.object.isOrthographicCamera){const o=new C(this._mouse.x,this._mouse.y,0);o.unproject(this.object);const l=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),this.object.updateProjectionMatrix(),r=l!==this.object.zoom;const c=new C(this._mouse.x,this._mouse.y,0);c.unproject(this.object),this.object.position.sub(c).add(o),this.object.updateMatrixWorld(),s=vt.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),this.zoomToCursor=!1;s!==null&&(this.screenSpacePanning?this.target.set(0,0,-1).transformDirection(this.object.matrix).multiplyScalar(s).add(this.object.position):(Ya.origin.copy(this.object.position),Ya.direction.set(0,0,-1).transformDirection(this.object.matrix),Math.abs(this.object.up.dot(Ya.direction))<g0?this.object.lookAt(this.target):(Pl.setFromNormalAndCoplanarPoint(this.object.up,this.target),Ya.intersectPlane(Pl,this.target))))}else if(this.object.isOrthographicCamera){const s=this.object.zoom;this.object.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.object.zoom/this._scale)),s!==this.object.zoom&&(this.object.updateProjectionMatrix(),r=!0)}return this._scale=1,this._performCursorZoom=!1,r||this._lastPosition.distanceToSquared(this.object.position)>Yr||8*(1-this._lastQuaternion.dot(this.object.quaternion))>Yr||this._lastTargetPosition.distanceToSquared(this.target)>Yr?(this.dispatchEvent(Rl),this._lastPosition.copy(this.object.position),this._lastQuaternion.copy(this.object.quaternion),this._lastTargetPosition.copy(this.target),!0):!1}_getAutoRotationAngle(e){return e!==null?Bt/60*this.autoRotateSpeed*e:Bt/60/60*this.autoRotateSpeed}_getZoomScale(e){const t=Math.abs(e*.01);return Math.pow(.95,this.zoomSpeed*t)}_rotateLeft(e){this._sphericalDelta.theta-=e}_rotateUp(e){this._sphericalDelta.phi-=e}_panLeft(e,t){vt.setFromMatrixColumn(t,0),vt.multiplyScalar(-e),this._panOffset.add(vt)}_panUp(e,t){this.screenSpacePanning===!0?vt.setFromMatrixColumn(t,1):(vt.setFromMatrixColumn(t,0),vt.crossVectors(this.object.up,vt)),vt.multiplyScalar(e),this._panOffset.add(vt)}_pan(e,t){const n=this.domElement;if(this.object.isPerspectiveCamera){const a=this.object.position;vt.copy(a).sub(this.target);let r=vt.length();r*=Math.tan(this.object.fov/2*Math.PI/180),this._panLeft(2*e*r/n.clientHeight,this.object.matrix),this._panUp(2*t*r/n.clientHeight,this.object.matrix)}else this.object.isOrthographicCamera?(this._panLeft(e*(this.object.right-this.object.left)/this.object.zoom/n.clientWidth,this.object.matrix),this._panUp(t*(this.object.top-this.object.bottom)/this.object.zoom/n.clientHeight,this.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),this.enablePan=!1)}_dollyOut(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale/=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_dollyIn(e){this.object.isPerspectiveCamera||this.object.isOrthographicCamera?this._scale*=e:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),this.enableZoom=!1)}_updateZoomParameters(e,t){if(!this.zoomToCursor)return;this._performCursorZoom=!0;const n=this.domElement.getBoundingClientRect(),a=e-n.left,r=t-n.top,s=n.width,o=n.height;this._mouse.x=a/s*2-1,this._mouse.y=-(r/o)*2+1,this._dollyDirection.set(this._mouse.x,this._mouse.y,1).unproject(this.object).sub(this.object.position).normalize()}_clampDistance(e){return Math.max(this.minDistance,Math.min(this.maxDistance,e))}_handleMouseDownRotate(e){this._rotateStart.set(e.clientX,e.clientY)}_handleMouseDownDolly(e){this._updateZoomParameters(e.clientX,e.clientX),this._dollyStart.set(e.clientX,e.clientY)}_handleMouseDownPan(e){this._panStart.set(e.clientX,e.clientY)}_handleMouseMoveRotate(e){this._rotateEnd.set(e.clientX,e.clientY),this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Bt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Bt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd),this.update()}_handleMouseMoveDolly(e){this._dollyEnd.set(e.clientX,e.clientY),this._dollyDelta.subVectors(this._dollyEnd,this._dollyStart),this._dollyDelta.y>0?this._dollyOut(this._getZoomScale(this._dollyDelta.y)):this._dollyDelta.y<0&&this._dollyIn(this._getZoomScale(this._dollyDelta.y)),this._dollyStart.copy(this._dollyEnd),this.update()}_handleMouseMovePan(e){this._panEnd.set(e.clientX,e.clientY),this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd),this.update()}_handleMouseWheel(e){this._updateZoomParameters(e.clientX,e.clientY),e.deltaY<0?this._dollyIn(this._getZoomScale(e.deltaY)):e.deltaY>0&&this._dollyOut(this._getZoomScale(e.deltaY)),this.update()}_handleKeyDown(e){let t=!1;switch(e.code){case this.keys.UP:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(Bt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,this.keyPanSpeed),t=!0;break;case this.keys.BOTTOM:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateUp(-Bt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(0,-this.keyPanSpeed),t=!0;break;case this.keys.LEFT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(Bt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(this.keyPanSpeed,0),t=!0;break;case this.keys.RIGHT:e.ctrlKey||e.metaKey||e.shiftKey?this.enableRotate&&this._rotateLeft(-Bt*this.keyRotateSpeed/this.domElement.clientHeight):this.enablePan&&this._pan(-this.keyPanSpeed,0),t=!0;break}t&&(e.preventDefault(),this.update())}_handleTouchStartRotate(e){if(this._pointers.length===1)this._rotateStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),a=.5*(e.pageY+t.y);this._rotateStart.set(n,a)}}_handleTouchStartPan(e){if(this._pointers.length===1)this._panStart.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),a=.5*(e.pageY+t.y);this._panStart.set(n,a)}}_handleTouchStartDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,a=e.pageY-t.y,r=Math.sqrt(n*n+a*a);this._dollyStart.set(0,r)}_handleTouchStartDollyPan(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enablePan&&this._handleTouchStartPan(e)}_handleTouchStartDollyRotate(e){this.enableZoom&&this._handleTouchStartDolly(e),this.enableRotate&&this._handleTouchStartRotate(e)}_handleTouchMoveRotate(e){if(this._pointers.length==1)this._rotateEnd.set(e.pageX,e.pageY);else{const n=this._getSecondPointerPosition(e),a=.5*(e.pageX+n.x),r=.5*(e.pageY+n.y);this._rotateEnd.set(a,r)}this._rotateDelta.subVectors(this._rotateEnd,this._rotateStart).multiplyScalar(this.rotateSpeed);const t=this.domElement;this._rotateLeft(Bt*this._rotateDelta.x/t.clientHeight),this._rotateUp(Bt*this._rotateDelta.y/t.clientHeight),this._rotateStart.copy(this._rotateEnd)}_handleTouchMovePan(e){if(this._pointers.length===1)this._panEnd.set(e.pageX,e.pageY);else{const t=this._getSecondPointerPosition(e),n=.5*(e.pageX+t.x),a=.5*(e.pageY+t.y);this._panEnd.set(n,a)}this._panDelta.subVectors(this._panEnd,this._panStart).multiplyScalar(this.panSpeed),this._pan(this._panDelta.x,this._panDelta.y),this._panStart.copy(this._panEnd)}_handleTouchMoveDolly(e){const t=this._getSecondPointerPosition(e),n=e.pageX-t.x,a=e.pageY-t.y,r=Math.sqrt(n*n+a*a);this._dollyEnd.set(0,r),this._dollyDelta.set(0,Math.pow(this._dollyEnd.y/this._dollyStart.y,this.zoomSpeed)),this._dollyOut(this._dollyDelta.y),this._dollyStart.copy(this._dollyEnd);const s=(e.pageX+t.x)*.5,o=(e.pageY+t.y)*.5;this._updateZoomParameters(s,o)}_handleTouchMoveDollyPan(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enablePan&&this._handleTouchMovePan(e)}_handleTouchMoveDollyRotate(e){this.enableZoom&&this._handleTouchMoveDolly(e),this.enableRotate&&this._handleTouchMoveRotate(e)}_addPointer(e){this._pointers.push(e.pointerId)}_removePointer(e){delete this._pointerPositions[e.pointerId];for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId){this._pointers.splice(t,1);return}}_isTrackingPointer(e){for(let t=0;t<this._pointers.length;t++)if(this._pointers[t]==e.pointerId)return!0;return!1}_trackPointer(e){let t=this._pointerPositions[e.pointerId];t===void 0&&(t=new Ue,this._pointerPositions[e.pointerId]=t),t.set(e.pageX,e.pageY)}_getSecondPointerPosition(e){const t=e.pointerId===this._pointers[0]?this._pointers[1]:this._pointers[0];return this._pointerPositions[t]}_customWheelEvent(e){const t=e.deltaMode,n={clientX:e.clientX,clientY:e.clientY,deltaY:e.deltaY};switch(t){case 1:n.deltaY*=16;break;case 2:n.deltaY*=100;break}return e.ctrlKey&&!this._controlActive&&(n.deltaY*=10),n}}function v0(i){this.enabled!==!1&&(this._pointers.length===0&&(this.domElement.setPointerCapture(i.pointerId),this.domElement.addEventListener("pointermove",this._onPointerMove),this.domElement.addEventListener("pointerup",this._onPointerUp)),!this._isTrackingPointer(i)&&(this._addPointer(i),i.pointerType==="touch"?this._onTouchStart(i):this._onMouseDown(i)))}function y0(i){this.enabled!==!1&&(i.pointerType==="touch"?this._onTouchMove(i):this._onMouseMove(i))}function M0(i){switch(this._removePointer(i),this._pointers.length){case 0:this.domElement.releasePointerCapture(i.pointerId),this.domElement.removeEventListener("pointermove",this._onPointerMove),this.domElement.removeEventListener("pointerup",this._onPointerUp),this.dispatchEvent(pc),this.state=at.NONE;break;case 1:const e=this._pointers[0],t=this._pointerPositions[e];this._onTouchStart({pointerId:e,pageX:t.x,pageY:t.y});break}}function b0(i){let e;switch(i.button){case 0:e=this.mouseButtons.LEFT;break;case 1:e=this.mouseButtons.MIDDLE;break;case 2:e=this.mouseButtons.RIGHT;break;default:e=-1}switch(e){case Fi.DOLLY:if(this.enableZoom===!1)return;this._handleMouseDownDolly(i),this.state=at.DOLLY;break;case Fi.ROTATE:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=at.PAN}else{if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=at.ROTATE}break;case Fi.PAN:if(i.ctrlKey||i.metaKey||i.shiftKey){if(this.enableRotate===!1)return;this._handleMouseDownRotate(i),this.state=at.ROTATE}else{if(this.enablePan===!1)return;this._handleMouseDownPan(i),this.state=at.PAN}break;default:this.state=at.NONE}this.state!==at.NONE&&this.dispatchEvent(po)}function S0(i){switch(this.state){case at.ROTATE:if(this.enableRotate===!1)return;this._handleMouseMoveRotate(i);break;case at.DOLLY:if(this.enableZoom===!1)return;this._handleMouseMoveDolly(i);break;case at.PAN:if(this.enablePan===!1)return;this._handleMouseMovePan(i);break}}function T0(i){this.enabled===!1||this.enableZoom===!1||this.state!==at.NONE||(i.preventDefault(),this.dispatchEvent(po),this._handleMouseWheel(this._customWheelEvent(i)),this.dispatchEvent(pc))}function E0(i){this.enabled!==!1&&this._handleKeyDown(i)}function w0(i){switch(this._trackPointer(i),this._pointers.length){case 1:switch(this.touches.ONE){case Ni.ROTATE:if(this.enableRotate===!1)return;this._handleTouchStartRotate(i),this.state=at.TOUCH_ROTATE;break;case Ni.PAN:if(this.enablePan===!1)return;this._handleTouchStartPan(i),this.state=at.TOUCH_PAN;break;default:this.state=at.NONE}break;case 2:switch(this.touches.TWO){case Ni.DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchStartDollyPan(i),this.state=at.TOUCH_DOLLY_PAN;break;case Ni.DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchStartDollyRotate(i),this.state=at.TOUCH_DOLLY_ROTATE;break;default:this.state=at.NONE}break;default:this.state=at.NONE}this.state!==at.NONE&&this.dispatchEvent(po)}function A0(i){switch(this._trackPointer(i),this.state){case at.TOUCH_ROTATE:if(this.enableRotate===!1)return;this._handleTouchMoveRotate(i),this.update();break;case at.TOUCH_PAN:if(this.enablePan===!1)return;this._handleTouchMovePan(i),this.update();break;case at.TOUCH_DOLLY_PAN:if(this.enableZoom===!1&&this.enablePan===!1)return;this._handleTouchMoveDollyPan(i),this.update();break;case at.TOUCH_DOLLY_ROTATE:if(this.enableZoom===!1&&this.enableRotate===!1)return;this._handleTouchMoveDollyRotate(i),this.update();break;default:this.state=at.NONE}}function C0(i){this.enabled!==!1&&i.preventDefault()}function R0(i){i.key==="Control"&&(this._controlActive=!0,this.domElement.getRootNode().addEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}function P0(i){i.key==="Control"&&(this._controlActive=!1,this.domElement.getRootNode().removeEventListener("keyup",this._interceptControlUp,{passive:!0,capture:!0}))}class L0{constructor(e){this.renderer=new x0({canvas:e,antialias:!0,powerPreference:"high-performance",alpha:!1}),this.renderer.outputColorSpace=jt,this.renderer.toneMapping=Ol,this.renderer.toneMappingExposure=1.05,this.renderer.shadowMap.enabled=!1,this.pixelRatio=Math.min(window.devicePixelRatio||1,1.5),this.minPixelRatio=.68,this.maxPixelRatio=Math.min(window.devicePixelRatio||1,1.75),this.frameCostEMA=16.7,this.lastPixelChange=0,this.setPixelRatio(this.pixelRatio)}setPixelRatio(e){this.pixelRatio=Number(e.toFixed(2)),this.renderer.setPixelRatio(this.pixelRatio),this.renderer.setSize(window.innerWidth,window.innerHeight,!1)}resize(e){const t=window.innerWidth,n=window.innerHeight;e.aspect=t/n,e.updateProjectionMatrix(),this.renderer.setSize(t,n,!1)}render(e,t){const n=performance.now();this.renderer.render(e,t);const a=performance.now()-n;this.frameCostEMA=this.frameCostEMA*.92+a*.08,this.adjustPixelRatio()}adjustPixelRatio(){const e=performance.now();e-this.lastPixelChange<1400||(this.frameCostEMA>22&&this.pixelRatio>this.minPixelRatio?(this.setPixelRatio(Math.max(this.minPixelRatio,this.pixelRatio-.12)),this.lastPixelChange=e):this.frameCostEMA<9.5&&this.pixelRatio<this.maxPixelRatio&&(this.setPixelRatio(Math.min(this.maxPixelRatio,this.pixelRatio+.08)),this.lastPixelChange=e))}get domElement(){return this.renderer.domElement}get info(){return this.renderer.info}}const Ma=64;function D0(i=globalThis){const e=i.navigator??{},t=i.window??i,n=!!t.matchMedia?.("(pointer: coarse)").matches,a=!!t.matchMedia?.("(max-width: 860px)").matches,r=e.deviceMemory??4;return n||a||r<=4?"mobile":r<=8?"balanced":"desktop"}const I0={mobile:{highRadius:1,mediumRadius:2,visibleInstanceCap:5e5},balanced:{highRadius:2,mediumRadius:3,visibleInstanceCap:7e5},desktop:{highRadius:2,mediumRadius:4,visibleInstanceCap:1e6}};function mc(i,e,t=Ma){return{cx:Math.floor(i/t),cz:Math.floor(e/t)}}function U0(i,e,t=Ma){const{cx:n,cz:a}=mc(i,e,t);return`${n}_${a}`}function N0(i,e){return Math.max(Math.abs(i.cx-e.cx),Math.abs(i.cz-e.cz))}class F0{constructor(e){this.palette=e,this.materials=new Map}get(e){if(this.materials.has(e))return this.materials.get(e);const t=this.palette[e];if(t===void 0)return null;const n=new wt({color:t,flatShading:!0,fog:!0});return this.materials.set(e,n),n}dispose(){this.materials.forEach(e=>e.dispose()),this.materials.clear()}}function B0(i,e={}){const t=e.chunkSize??Ma,n=new Map;for(const[a,r]of i.entries())for(const s of r){const o=U0(s.x,s.z,t);if(!n.has(o)){const[c,d]=o.split("_").map(Number);n.set(o,{id:o,cx:c,cz:d,count:0,materials:new Map})}const l=n.get(o);l.materials.has(a)||l.materials.set(a,[]),l.materials.get(a).push(s),l.count+=1}return[...n.values()].sort((a,r)=>a.cx-r.cx||a.cz-r.cz)}class k0{constructor(e,t={}){this.scene=e,this.palette=t.palette,this.castShadow=t.castShadow??!1,this.receiveShadow=t.receiveShadow??!0,this.geometry=t.geometry??new Bn(1,1,1),this.geometry.computeBoundingBox(),this.materialRegistry=t.materialRegistry??new F0(this.palette)}createChunkGroup(e){const t=new $t;t.name=`voxel_chunk_${e.id}`;const n={};t.userData.voxelChunk={id:e.id,count:e.count,cx:e.cx,cz:e.cz,materialCounts:n};const a=new st,r=new C,s=new Jn,o=new C;let l=0;for(const[c,d]of e.materials.entries()){const h=this.materialRegistry.get(c);if(!h){console.warn(`Missing voxel palette color: ${c}`);continue}n[c]=d.length;const u=new fh(this.geometry,h,d.length);u.name=`voxels_${c}_chunk_${e.id}`,u.userData.voxelMaterialKey=c,u.castShadow=this.castShadow,u.receiveShadow=this.receiveShadow,u.instanceMatrix.setUsage(Vs),d.forEach((p,g)=>{r.set(p.x,p.y,p.z),o.set(p.sx,p.sy,p.sz),a.compose(r,s,o),u.setMatrixAt(g,a)}),u.computeBoundingSphere(),t.add(u),l+=1}return this.scene.add(t),{group:t,meshCount:l,materialCounts:n}}}class O0{constructor(e={}){this.chunkSize=e.chunkSize??Ma,this.tier=e.tier??D0(),this.budget=e.budget??I0[this.tier],this.visibleRadius=e.visibleRadius??8,this.chunks=[],this.lastOrigin=null,this.visibleInstances=0}addChunk(e){this.chunks.push(e)}update(e){const t=e?.position??e;if(!t)return{changed:!1,visibleInstances:this.visibleInstances};const n=mc(t.x,t.z,this.chunkSize);if(this.lastOrigin&&this.lastOrigin.cx===n.cx&&this.lastOrigin.cz===n.cz)return{changed:!1,visibleInstances:this.visibleInstances};this.lastOrigin=n,this.visibleInstances=0;let a=!1;for(const r of this.chunks){const o=N0(r,n)<=this.visibleRadius;r.group.visible!==o&&(r.group.visible=o,a=!0),o&&(this.visibleInstances+=r.count)}return{changed:a,visibleInstances:this.visibleInstances}}getStats(){const e=this.chunks.filter(t=>t.group.visible).length;return{tier:this.tier,chunkSize:this.chunkSize,chunks:this.chunks.length,visibleChunks:e,visibleInstances:this.visibleInstances,visibleInstanceCap:this.budget.visibleInstanceCap,visibleRadius:this.visibleRadius}}}const xc={grass:4168527,grass2:5813855,grassDark:3109952,dirt:8017464,clay:10187602,stone:7830659,stoneDark:5200228,road:2238259,roadLight:3818064,lineWhite:15857407,lineYellow:16765286,rail:9345191,concrete:11450045,concreteDark:7371140,glass:7059670,glassDark:2312285,glassGreen:4433819,silver:13621215,steel:9871530,blackGlass:1120551,petronasTrim:15332088,merdekaGlass:3693699,merdekaTrim:16769693,klTowerWhite:15262159,klTowerRed:14171453,roofCopper:11823676,mosqueBlue:2516952,mosqueWhite:16054261,monumentBronze:9133874,treeTrunk:8015405,treeLeaf:2854730,treeLeaf2:2059583,water:1668771,trainBlue:2068205,trainYellow:16238920,trainWhite:16119802,trainWindow:1254968,station:14209732,stationRoof:5989747,plaza:12364423,redBrick:10439992,lantern:16743252,warning:16754224,mallGold:14133581,templeRed:13123381,templeGold:16764774,marketBlue:3108767,museumBrown:9067061,lampGlow:16773288,busGreen:2795638,parkPath:13154700,riverBlue:1019829,marketRed:14042437,awningStripe:16315096,palaceGold:14792797,palaceWall:15854290,caveLimestone:11972512,littleIndiaPink:14179487,pavilionRed:11738933,gatewayPurple:8346352};class z0{constructor(e,t={}){this.scene=e,this.palette=t.palette??xc,this.castShadow=t.castShadow??!1,this.receiveShadow=t.receiveShadow??!0,this.instances=new Map,this.meshes=[],this.total=0,this.sectionCounts=new Map,this.currentSection="world",this.chunkSize=t.chunkSize??Ma,this.chunkManager=t.chunkManager??new O0({chunkSize:this.chunkSize})}withSection(e,t){const n=this.currentSection;this.currentSection=e;try{return t()}finally{this.currentSection=n}}addVoxel(e,t,n,a){this.addBox(e+.5,t+.5,n+.5,1,1,1,a)}addBox(e,t,n,a,r,s,o){a<=0||r<=0||s<=0||(this.instances.has(o)||this.instances.set(o,[]),this.instances.get(o).push({x:e,y:t,z:n,sx:a,sy:r,sz:s}),this.total+=1,this.sectionCounts.set(this.currentSection,(this.sectionCounts.get(this.currentSection)??0)+1))}addColumn(e,t,n,a,r){for(let s=n;s<=a;s+=1)this.addVoxel(e,s,t,r)}addVoxelBox(e,t,n,a,r,s,o){for(let l=e;l<e+a;l+=1)for(let c=t;c<t+r;c+=1)for(let d=n;d<n+s;d+=1)this.addVoxel(l,c,d,o)}addWireVoxelBox(e,t,n,a,r,s,o){for(let l=e;l<e+a;l+=1)for(let c=t;c<t+r;c+=1)for(let d=n;d<n+s;d+=1)+(l===e||l===e+a-1)+ +(c===t||c===t+r-1)+ +(d===n||d===n+s-1)>=2&&this.addVoxel(l,c,d,o)}finalize(){const e=B0(this.instances,{chunkSize:this.chunkSize}),t=new k0(this.scene,{palette:this.palette,castShadow:this.castShadow,receiveShadow:this.receiveShadow}),n=[];for(const s of e){const{group:o,meshCount:l,materialCounts:c}=t.createChunkGroup(s);this.chunkManager.addChunk({id:s.id,cx:s.cx,cz:s.cz,count:s.count,group:o,materialCounts:c}),this.meshes.push(...o.children),s.meshCount=l,n.push({id:s.id,cx:s.cx,cz:s.cz,count:s.count,meshCount:l,materialCounts:c})}const a=Object.fromEntries([...this.instances.entries()].map(([s,o])=>[s,o.length])),r=Object.fromEntries([...this.sectionCounts.entries()].sort((s,o)=>o[1]-s[1]));return this.instances.clear(),{total:this.total,meshes:this.meshes.length,chunks:e.length,chunkSize:this.chunkSize,materials:a,sections:r,chunkManifest:n,chunkManager:this.chunkManager}}}function gc(i){let e=i>>>0;return function(){e+=1831565813;let n=e;return n=Math.imul(n^n>>>15,n|1),n^=n+Math.imul(n^n>>>7,n|61),((n^n>>>14)>>>0)/4294967296}}function da(i,e,t=1337){let n=t^Math.imul(i,374761393)^Math.imul(e,668265263);return n=(n^n>>>13)>>>0,n=Math.imul(n,1274126177)>>>0,((n^n>>>16)>>>0)/4294967295}function Ll(i){return i*i*(3-2*i)}function jr(i,e,t){return i+(e-i)*t}function G0(i,e,t=1337){const n=Math.floor(i),a=Math.floor(e),r=i-n,s=e-a,o=da(n,a,t),l=da(n+1,a,t),c=da(n,a+1,t),d=da(n+1,a+1,t),h=Ll(r),u=Ll(s);return jr(jr(o,l,h),jr(c,d,h),u)}function Dl(i,e,t=1337,n=4){let a=.5,r=1,s=0,o=0;for(let l=0;l<n;l+=1)s+=a*G0(i*r,e*r,t+l*97),o+=a,r*=2,a*=.5;return s/o}function Ii(i,e,t){return Math.max(e,Math.min(t,i))}const kt={minLat:2.72,maxLat:3.45,minLon:101.23,maxLon:102.02,minX:-214,maxX:214,minZ:-214,maxZ:214},V0=188;function H0({lat:i,lon:e}){const t=(e-kt.minLon)/(kt.maxLon-kt.minLon),n=(i-kt.minLat)/(kt.maxLat-kt.minLat),a=r=>Math.max(kt.minX,Math.min(kt.maxX,r));return{x:Math.round(a(kt.minX+t*(kt.maxX-kt.minX))),z:Math.round(a(kt.minZ+n*(kt.maxZ-kt.minZ)))}}const W0=[{name:"Petronas Twin Towers",district:"KLCC",category:"skyline",tags:["architecture","shopping"],bestTime:"Golden Hour",note:"Twin towers, Suria KLCC, and the classic city skyline photo stop.",tip:"Walk through the park side for the broadest tower view.",x:-12,z:22},{name:"KLCC Park",district:"KLCC",category:"park",tags:["garden","family"],bestTime:"Day",note:"A landscaped city park with lake views below the towers.",tip:"Use the shaded paths when the afternoon heat builds.",x:-25,z:43},{name:"Merdeka 118",district:"Merdeka",category:"skyline",tags:["architecture"],bestTime:"Sunset",note:"A new supertall tower overlooking the historic core.",tip:"Pair it with Merdeka Square and Chinatown on foot.",x:35,z:18},{name:"KL Tower",district:"Bukit Nanas",category:"viewpoint",tags:["skyline","forest"],bestTime:"Sunset",note:"Observation tower beside the Bukit Nanas forest reserve.",tip:"Clear evenings give the best tower-to-tower skyline angle.",x:58,z:-25},{name:"Merdeka Square",district:"Colonial Core",category:"heritage",tags:["history","photography"],bestTime:"Golden Hour",note:"Civic field framed by colonial-era landmarks and flags.",tip:"Look for the city gallery and old club facades nearby.",x:0,z:-55},{name:"Sultan Abdul Samad Building",district:"Colonial Core",category:"heritage",tags:["architecture"],bestTime:"Night",note:"Moorish-style clock tower and arcades beside Merdeka Square.",tip:"Night lighting makes the facade easy to photograph.",x:0,z:-48},{name:"Masjid Jamek / River of Life",district:"Confluence",category:"heritage",tags:["mosque","river"],bestTime:"Night",note:"Historic mosque at the Klang and Gombak river meeting point.",tip:"Use respectful dress and follow mosque access signs.",x:-9,z:-38},{name:"Royal Selangor Club",district:"Colonial Core",category:"heritage",tags:["history"],bestTime:"Golden Hour",note:"Mock-Tudor club frontage facing the Padang.",tip:"Best appreciated as part of a Merdeka Square walk.",x:-12,z:-55},{name:"Petaling Street / Chinatown",district:"Chinatown",category:"market",tags:["food","heritage"],bestTime:"Night",note:"Busy market streets, temples, cafes, and old shophouses.",tip:"Keep small notes handy for snacks and market browsing.",x:-18,z:-42},{name:"Central Market",district:"Chinatown",category:"market",tags:["craft","shopping"],bestTime:"Day",note:"Indoor craft market and an easy stop for souvenirs.",tip:"Use it as a cool break during a heritage walk.",x:-20,z:-60},{name:"Jalan Alor",district:"Bukit Bintang",category:"food",tags:["night market","street food"],bestTime:"Night",note:"Open-air food street with grills, fruit, noodles, and crowds.",tip:"Arrive hungry and compare menus before sitting down.",x:23,z:-32},{name:"Bukit Bintang",district:"Golden Triangle",category:"shopping",tags:["nightlife","retail"],bestTime:"Night",note:"Central shopping and entertainment district.",tip:"Monorail stops make it easy to avoid traffic.",x:30,z:-22},{name:"Pavilion KL",district:"Bukit Bintang",category:"shopping",tags:["mall","food"],bestTime:"Day",note:"Major mall with dining, fashion, and covered walk links.",tip:"Use the KLCC pedestrian bridge for a shaded connection.",x:39,z:-18},{name:"TRX Exchange 106",district:"TRX",category:"skyline",tags:["architecture","shopping"],bestTime:"Golden Hour",note:"Financial district tower and modern retail precinct.",tip:"Good contrast with older heritage stops in one day.",x:66,z:32},{name:"Masjid Negara",district:"Lake Gardens",category:"culture",tags:["mosque","architecture"],bestTime:"Day",note:"National Mosque with a folded blue roof and minaret.",tip:"Check visitor hours and dress modestly.",x:-48,z:-32},{name:"Islamic Arts Museum",district:"Lake Gardens",category:"museum",tags:["art","architecture"],bestTime:"Day",note:"Museum known for domes, galleries, models, and textiles.",tip:"Combine with the mosque and gardens on a low-heat morning.",x:-58,z:-40},{name:"National Planetarium",district:"Lake Gardens",category:"museum",tags:["science","family"],bestTime:"Day",note:"Space science stop near the gardens and museum cluster.",tip:"Good family-friendly indoor stop when it rains.",x:-64,z:-34},{name:"Lake Gardens",district:"Perdana Botanical Garden",category:"park",tags:["garden","walking"],bestTime:"Day",note:"Large green retreat with lake paths near museums.",tip:"Start early for cooler walking weather.",x:-70,z:65},{name:"Tugu Negara",district:"Lake Gardens",category:"heritage",tags:["monument"],bestTime:"Golden Hour",note:"National monument set in a landscaped park.",tip:"Pair with Lake Gardens rather than a standalone taxi stop.",x:-70,z:43},{name:"Old Railway Station",district:"Brickfields",category:"heritage",tags:["rail","architecture"],bestTime:"Day",note:"Historic station architecture near the old city edge.",tip:"Great bridge between Chinatown and Brickfields.",x:-36,z:-58},{name:"National Museum",district:"Brickfields",category:"museum",tags:["history"],bestTime:"Day",note:"Introductory stop for Malaysian history and culture.",tip:"Visit before exploring regional highlights.",x:-58,z:-66},{name:"Little India Brickfields",district:"Brickfields",category:"culture",tags:["food","shops"],bestTime:"Day",note:"Colorful shops, snacks, textiles, and South Asian culture.",tip:"Try sweets or banana leaf rice nearby.",x:-55,z:-74},{name:"Thean Hou Temple",district:"Seputeh",category:"culture",tags:["temple","viewpoint"],bestTime:"Golden Hour",note:"Layered Chinese temple with lanterns and city views.",tip:"Use a ride-hail or taxi unless you enjoy hilly walks.",x:-75,z:-20},{name:"Istana Negara",district:"Jalan Duta",category:"heritage",tags:["palace"],bestTime:"Day",note:"Royal palace gateway and formal photo stop.",tip:"Viewing is from the gate area; respect restricted zones.",x:-86,z:10},{name:"Batu Caves Gateway",district:"Gombak Gateway",category:"excursion",tags:["temple","limestone"],bestTime:"Day",note:"Gateway pad for the limestone caves north of KL.",tip:"Morning visits are cooler for the stair climb.",x:82,z:68},{name:"Kampung Baru",district:"Kampung Baru",category:"food",tags:["village","night food"],bestTime:"Night",note:"Traditional Malay village atmosphere near the skyline.",tip:"Look for nasi lemak and satay while watching the towers.",x:-35,z:8},{name:"Chow Kit Market",district:"Chow Kit",category:"market",tags:["wet market","local life"],bestTime:"Day",note:"Local market energy, produce, textiles, and street scenes.",tip:"Go early, watch your footing, and ask before close photos.",x:-44,z:-12},{name:"LRT / MRT Hub",district:"Transit Core",category:"transit",tags:["rail","fast travel"],bestTime:"Anytime",note:"Stylized interchange for exploring the map by rail.",tip:"Use fast travel to sample districts quickly.",x:18,z:22},{name:"Penang George Town Gateway",district:"Malaysia Highlights",category:"gateway",tags:["unesco","food"],bestTime:"Day",note:"Off-map highlight for murals, clan houses, and hawker food.",tip:"Plan at least two nights for food and heritage lanes.",x:188,z:92},{name:"Langkawi Gateway",district:"Malaysia Highlights",category:"gateway",tags:["island","nature"],bestTime:"Day",note:"Off-map highlight for beaches, mangroves, and cable car views.",tip:"Check ferry and flight timing before booking island hops.",x:188,z:72},{name:"Malacca Gateway",district:"Malaysia Highlights",category:"gateway",tags:["unesco","history"],bestTime:"Golden Hour",note:"Off-map highlight for river walks and layered colonial history.",tip:"Weekend traffic can be heavy; start early from KL.",x:188,z:52},{name:"Cameron Highlands Gateway",district:"Malaysia Highlights",category:"gateway",tags:["tea","highlands"],bestTime:"Day",note:"Off-map highlight for tea plantations and cool weather.",tip:"Pack a light layer and expect winding roads.",x:188,z:32},{name:"Taman Negara Gateway",district:"Malaysia Highlights",category:"gateway",tags:["rainforest","river"],bestTime:"Day",note:"Off-map highlight for rainforest walks and river travel.",tip:"Use proper shoes and book transfers in advance.",x:188,z:12},{name:"Kinabalu Gateway",district:"Malaysia Highlights",category:"gateway",tags:["borneo","mountain"],bestTime:"Day",note:"Off-map highlight for Sabah, Mount Kinabalu, and parks.",tip:"Altitude and permits matter if climbing.",x:188,z:-8},{name:"Perhentian Islands Gateway",district:"Malaysia Highlights",category:"gateway",tags:["snorkeling","islands"],bestTime:"Day",note:"Off-map highlight for clear water and beach stays.",tip:"Seasonality matters; monsoon closures can affect boats.",x:188,z:-28},{name:"Putrajaya Gateway",district:"Malaysia Highlights",category:"gateway",tags:["architecture","lake"],bestTime:"Sunset",note:"Off-map highlight for bridges, lakefront, and civic buildings.",tip:"Best as a half-day from KL or KLIA transfer stop.",x:188,z:-58},{name:"Sepang / KLIA Gateway",district:"Malaysia Highlights",category:"gateway",tags:["airport","motorsport"],bestTime:"Anytime",note:"Gateway for airport travel and Sepang circuit events.",tip:"Budget extra time for airport transfers.",x:188,z:-82},{name:"Putrajaya Lake & Mosque",district:"Putrajaya",category:"excursion",tags:["architecture","lake","mosque"],bestTime:"Sunset",note:"Civic lakefront, pink mosque silhouette, bridges, and broad ceremonial avenues south of KL.",tip:"Best by train or ride-hail as a half-day paired with KLIA.",x:132,z:-136},{name:"Sunway Lagoon & Pyramid",district:"Sunway",category:"family",tags:["theme park","shopping"],bestTime:"Day",note:"Theme park, mall, resort cluster, and a strong family day-trip option.",tip:"Bring swim gear and plan for a full day if entering the park.",x:-156,z:-126},{name:"Shah Alam Blue Mosque",district:"Shah Alam",category:"culture",tags:["mosque","architecture"],bestTime:"Golden Hour",note:"Large blue-domed mosque and state capital civic area west of KL.",tip:"Check visitor hours and dress rules before going.",x:-184,z:-38},{name:"Genting Highlands Gateway",district:"Highlands",category:"excursion",tags:["highlands","theme park"],bestTime:"Day",note:"Cool mountain resort, cable car, views, and indoor/outdoor attractions.",tip:"Weather changes quickly; bring a light layer.",x:148,z:162},{name:"FRIM Forest Reserve",district:"Kepong",category:"nature",tags:["forest","walking"],bestTime:"Day",note:"Forest trails and shade north-west of the city, good for a greenery reset.",tip:"Start early and use shoes with grip after rain.",x:-138,z:128},{name:"Zoo Negara",district:"Ampang / Ulu Klang",category:"family",tags:["zoo","family"],bestTime:"Day",note:"National zoo stop on the eastern side of Kuala Lumpur.",tip:"Go early for cooler walking and more active animals.",x:142,z:68},{name:"Ampang Lookout Ridge",district:"Ampang",category:"viewpoint",tags:["skyline","hill"],bestTime:"Night",note:"Eastern ridge viewpoint zone for a wide KL skyline impression.",tip:"Use safe, well-lit viewpoints and check road access.",x:126,z:18},{name:"Bangsar Village",district:"Bangsar",category:"food",tags:["cafes","nightlife"],bestTime:"Night",note:"Neighbourhood dining, cafes, and nightlife west of the central rail hub.",tip:"Good dinner district after Brickfields or Mid Valley.",x:-94,z:-108},{name:"Mid Valley Megamall",district:"Mid Valley",category:"shopping",tags:["mall","food"],bestTime:"Day",note:"Large mall and transit-adjacent retail cluster between Bangsar and Seputeh.",tip:"Useful rainy-day stop with many food choices.",x:-82,z:-88},{name:"Mont Kiara Dining Cluster",district:"Mont Kiara",category:"food",tags:["cafes","expat"],bestTime:"Night",note:"Dining and cafe cluster north-west of the city centre.",tip:"Ride-hail is usually easier than rail for this zone.",x:-92,z:92},{name:"Damansara Arts & Cafes",district:"Damansara",category:"culture",tags:["cafes","creative"],bestTime:"Day",note:"Neighbourhood creative, cafe, and shopping corridor beyond the immediate core.",tip:"Treat it as a local-life extension rather than a first-day must-see.",x:-148,z:42},{name:"Klang Royal Town",district:"Klang",category:"heritage",tags:["royal town","food"],bestTime:"Day",note:"Royal town heritage and famous bak kut teh corridor toward the coast.",tip:"Best as a food-led side trip from KL or Shah Alam.",x:-204,z:-88},{name:"Port Klang Coastal Gate",district:"Port Klang",category:"gateway",tags:["coast","ferry"],bestTime:"Day",note:"Coastal and ferry gateway west of the Klang Valley.",tip:"Check ferry schedules and return times before committing.",x:-210,z:-150},{name:"Kajang Satay Town",district:"Kajang",category:"food",tags:["satay","local food"],bestTime:"Night",note:"Food side trip known for satay and a more local town feel.",tip:"Evening works well, but traffic can stretch travel time.",x:68,z:-184},{name:"Cyberjaya Tech Garden",district:"Cyberjaya",category:"modern",tags:["tech","parks"],bestTime:"Day",note:"Tech-city landscape near Putrajaya with lakes, campuses, and broad roads.",tip:"Pair with Putrajaya instead of making a standalone trip.",x:114,z:-168},{name:"Broga Hill Sunrise",district:"Semenyih",category:"nature",tags:["hiking","sunrise"],bestTime:"Golden Hour",note:"Hiking gateway south-east of KL, represented as a sunrise ridge.",tip:"Start before dawn only with proper lights, shoes, and weather checks.",x:154,z:-202},{name:"Kuala Selangor Fireflies",district:"Kuala Selangor",category:"nature",tags:["river","wildlife"],bestTime:"Night",note:"Evening river firefly excursion and seafood side trip from the Klang Valley.",tip:"Book boats ahead and avoid bright phone lights on the river.",x:-204,z:152},{name:"Rawang Forest Gateway",district:"Rawang",category:"nature",tags:["forest","waterfall"],bestTime:"Day",note:"Northern green gateway for forest, waterfall, and road-trip style outings.",tip:"Check trail access and avoid storms.",x:-44,z:184},{name:"Setia City Park",district:"Setia Alam",category:"park",tags:["park","family"],bestTime:"Day",note:"Outer Klang Valley family park and mall-side green space.",tip:"Good relaxed stop if exploring Shah Alam and Klang.",x:-196,z:18},{name:"i-City Shah Alam",district:"Shah Alam",category:"family",tags:["lights","theme park"],bestTime:"Night",note:"Lightscape and family attraction zone in Shah Alam.",tip:"Night is the point here; combine with food nearby.",x:-176,z:-8},{name:"Sultan Alam Shah Museum",district:"Shah Alam",category:"museum",tags:["history","culture"],bestTime:"Day",note:"State museum stop near the Shah Alam civic district.",tip:"Pair with the Blue Mosque for a slower cultural loop.",x:-190,z:-20},{name:"Subang Airport Heritage Strip",district:"Subang",category:"transit",tags:["airport","aviation"],bestTime:"Day",note:"Old airport-side gateway and aviation corridor west of KL.",tip:"Useful mental marker for the PJ/Subang side of the valley.",x:-146,z:-62},{name:"SS15 Food Street",district:"Subang Jaya",category:"food",tags:["cafes","local food"],bestTime:"Night",note:"Student-town food, bubble tea, cafes, and quick local meals.",tip:"Good casual dinner district after Sunway.",x:-136,z:-92},{name:"USJ Taipan",district:"USJ",category:"food",tags:["shops","food"],bestTime:"Night",note:"Suburban food and shoplot cluster south-west of KL.",tip:"A local-life stop rather than a postcard landmark.",x:-126,z:-116},{name:"Puchong IOI Boulevard",district:"Puchong",category:"food",tags:["shops","night food"],bestTime:"Night",note:"Busy suburban food and retail corridor.",tip:"Use this as a bridge between Sunway and Putrajaya.",x:-78,z:-150},{name:"Seri Kembangan Food Quarter",district:"Seri Kembangan",category:"food",tags:["local food"],bestTime:"Night",note:"Suburban dinner belt south of KL.",tip:"Best treated as a food detour from the south corridor.",x:4,z:-168},{name:"Mines Lake",district:"Seri Kembangan",category:"park",tags:["lake","mall"],bestTime:"Day",note:"Lake and mall district on the southern corridor.",tip:"Use as a softer stop before Kajang or Putrajaya.",x:24,z:-150},{name:"IOI City Mall",district:"Putrajaya / Serdang",category:"shopping",tags:["mall","family"],bestTime:"Day",note:"Huge mall between Putrajaya and the south Klang Valley.",tip:"A practical rainy-day mega mall stop.",x:88,z:-144},{name:"Putrajaya Pink Mosque",district:"Putrajaya",category:"culture",tags:["mosque","architecture"],bestTime:"Sunset",note:"Masjid Putra on the lakefront civic axis.",tip:"Dress modestly and check visitor access windows.",x:124,z:-126},{name:"Putrajaya Bridge Promenade",district:"Putrajaya",category:"viewpoint",tags:["bridge","lake"],bestTime:"Sunset",note:"Bridge and lake promenade viewpoint for Putrajaya architecture.",tip:"Evening light makes the lake and bridges work better.",x:144,z:-126},{name:"Dengkil Kampung Food",district:"Dengkil",category:"food",tags:["kampung","food"],bestTime:"Night",note:"Small-town food stop near Cyberjaya and KLIA routes.",tip:"Good if you want less polished local atmosphere.",x:142,z:-172},{name:"Sepang Circuit",district:"Sepang",category:"excursion",tags:["motorsport"],bestTime:"Day",note:"Motorsport circuit gateway near KLIA.",tip:"Check event calendars before going.",x:176,z:-116},{name:"KLIA Terminal Gateway",district:"Sepang / KLIA",category:"transit",tags:["airport"],bestTime:"Anytime",note:"Main international airport gateway for Malaysia trips.",tip:"Leave buffer for terminal transfers and check-in.",x:198,z:-106},{name:"Nilai Outlet Corridor",district:"Nilai",category:"shopping",tags:["outlet","airport route"],bestTime:"Day",note:"Outlet and airport-side shopping corridor south of KL.",tip:"Works best before or after airport travel.",x:134,z:-206},{name:"Cheras Leisure Mall",district:"Cheras",category:"shopping",tags:["mall","local"],bestTime:"Day",note:"Cheras neighbourhood retail and food marker.",tip:"A local urban stop south-east of the centre.",x:74,z:-96},{name:"Taman Connaught Night Market",district:"Cheras",category:"market",tags:["night market","food"],bestTime:"Night",note:"Long pasar malam-style food and shopping strip.",tip:"Go hungry and expect crowds.",x:82,z:-120},{name:"Ampang Korean Village",district:"Ampang",category:"food",tags:["korean food","local"],bestTime:"Night",note:"Dining enclave east of KL with Korean restaurants and local options.",tip:"Good dinner extension after KLCC or Zoo Negara.",x:112,z:-8},{name:"Ulu Klang Ridge Trail",district:"Ulu Klang",category:"nature",tags:["trail","views"],bestTime:"Golden Hour",note:"Ridge and hill-view marker on the eastern edge.",tip:"Avoid storms and use proper shoes.",x:156,z:26},{name:"Melawati Food & Hills",district:"Taman Melawati",category:"food",tags:["hills","food"],bestTime:"Night",note:"Food and hill-neighbourhood marker near Zoo Negara.",tip:"Nice pairing with the eastern family/nature stops.",x:158,z:88},{name:"Gombak Transit Gate",district:"Gombak",category:"transit",tags:["rail","gateway"],bestTime:"Anytime",note:"Northern/eastern transit gateway toward Batu Caves and highlands.",tip:"Use it as a staging point for outer excursions.",x:104,z:112},{name:"Selayang Market",district:"Selayang",category:"market",tags:["wholesale","local life"],bestTime:"Day",note:"Large market area north of KL.",tip:"Go early and expect a working-market feel.",x:48,z:142},{name:"Kepong Food Row",district:"Kepong",category:"food",tags:["local food"],bestTime:"Night",note:"Northern food district with a strong local following.",tip:"Good dinner stop after FRIM.",x:-88,z:126},{name:"Desa ParkCity Lake",district:"Desa ParkCity",category:"park",tags:["lake","family"],bestTime:"Day",note:"Lake, walking paths, cafes, and pet-friendly public life.",tip:"A calm break between Kepong and Mont Kiara.",x:-88,z:74},{name:"Publika Arts Mall",district:"Dutamas",category:"culture",tags:["arts","cafes"],bestTime:"Day",note:"Arts, cafes, weekend markets, and creative retail.",tip:"Pair with Mont Kiara rather than central KL icons.",x:-74,z:58},{name:"Sentul Depot",district:"Sentul",category:"culture",tags:["events","heritage"],bestTime:"Day",note:"Industrial heritage and event space marker north of the core.",tip:"Check event listings first.",x:-36,z:72},{name:"Titiwangsa Lake Gardens",district:"Titiwangsa",category:"park",tags:["lake","skyline"],bestTime:"Golden Hour",note:"Lake park with skyline views back toward the towers.",tip:"Excellent sunset skyline angle.",x:8,z:82},{name:"Wangsa Maju Town Centre",district:"Wangsa Maju",category:"food",tags:["student food","shops"],bestTime:"Night",note:"Dense local town centre north-east of KL.",tip:"Good affordable food stop.",x:76,z:78},{name:"Setapak Food Quarter",district:"Setapak",category:"food",tags:["local food"],bestTime:"Night",note:"Student and neighbourhood food district north-east of KL.",tip:"A practical food marker between Titiwangsa and Wangsa Maju.",x:52,z:62},{name:"PJ Old Town",district:"Petaling Jaya",category:"heritage",tags:["old town","food"],bestTime:"Day",note:"Older Petaling Jaya town fabric and food streets.",tip:"Works as a bridge from KL to Subang/Sunway.",x:-122,z:-62},{name:"Section 17 Market",district:"Petaling Jaya",category:"market",tags:["market","local food"],bestTime:"Day",note:"Neighbourhood market and food district in PJ.",tip:"Morning is better for market texture.",x:-114,z:-34},{name:"TTDI Market",district:"TTDI",category:"market",tags:["wet market","cafes"],bestTime:"Day",note:"Market and cafe district near the north-west city edge.",tip:"Good local breakfast zone.",x:-126,z:22},{name:"1 Utama & Bandar Utama",district:"Bandar Utama",category:"shopping",tags:["mall","family"],bestTime:"Day",note:"Huge mall and PJ retail district.",tip:"Better as a suburban shopping day than a central sightseeing stop.",x:-156,z:12},{name:"Mutiara Damansara Curve",district:"Mutiara Damansara",category:"shopping",tags:["mall","cafes"],bestTime:"Day",note:"Retail and cafe cluster near Damansara.",tip:"Pair with 1 Utama or TTDI.",x:-168,z:42},{name:"Bukit Jelutong Park",district:"Bukit Jelutong",category:"park",tags:["park","suburb"],bestTime:"Day",note:"Leafy suburb and park marker between Shah Alam and Subang.",tip:"A green pause in the western ring.",x:-164,z:-42},{name:"Klang Little India",district:"Klang",category:"culture",tags:["shops","food"],bestTime:"Day",note:"Textile, food, and culture strip in Klang town.",tip:"Pair with Klang Royal Town and food stops.",x:-198,z:-72},{name:"Pulau Ketam Ferry Gate",district:"Port Klang",category:"gateway",tags:["ferry","island"],bestTime:"Day",note:"Ferry gateway toward Pulau Ketam from the coast.",tip:"Check tide and ferry timing.",x:-210,z:-126},{name:"Morib Beach Gateway",district:"Banting Coast",category:"gateway",tags:["beach","coast"],bestTime:"Sunset",note:"Coastal day-trip marker south-west of Klang Valley.",tip:"More local coast than tropical island.",x:-186,z:-198},{name:"Banting Food Stop",district:"Banting",category:"food",tags:["small town","food"],bestTime:"Night",note:"Small-town food stop on the coastward route.",tip:"Useful if extending toward Morib.",x:-148,z:-188},{name:"Janda Baik Gateway",district:"Bentong Foothills",category:"nature",tags:["river","retreat"],bestTime:"Day",note:"Foothill retreat gateway beyond Gombak and Genting routes.",tip:"Book stays and transport ahead.",x:178,z:190},{name:"Bukit Tinggi Village Gate",district:"Bentong Foothills",category:"gateway",tags:["highlands","village"],bestTime:"Day",note:"Highland village gateway east of KL.",tip:"Pair with Genting or Janda Baik style trips.",x:204,z:166},{name:"Rawang Waterfall Gate",district:"Rawang",category:"nature",tags:["waterfall","forest"],bestTime:"Day",note:"Northern forest-waterfall excursion marker.",tip:"Avoid after heavy rain.",x:-28,z:206},{name:"Sungai Buloh Nursery Belt",district:"Sungai Buloh",category:"park",tags:["plants","local"],bestTime:"Day",note:"Plant nursery and suburban green corridor.",tip:"Good for a quiet local detour.",x:-104,z:150},{name:"Elmina Rainbow Bridge",district:"Elmina",category:"viewpoint",tags:["bridge","photo"],bestTime:"Golden Hour",note:"Photo-friendly suburban bridge marker north-west of Shah Alam.",tip:"Go for quick photos, not a long visit.",x:-176,z:84},{name:"Sasaran Sky Mirror Gate",district:"Kuala Selangor Coast",category:"gateway",tags:["coast","photo"],bestTime:"Day",note:"Coastal photo excursion gateway beyond Kuala Selangor.",tip:"Highly tide-dependent; book operators carefully.",x:-214,z:186},{name:"Bukit Melawati",district:"Kuala Selangor",category:"heritage",tags:["hill","history"],bestTime:"Golden Hour",note:"Hilltop heritage marker near Kuala Selangor.",tip:"Pair with seafood and fireflies.",x:-190,z:134},{name:"Selangor River Seafood",district:"Kuala Selangor",category:"food",tags:["seafood","river"],bestTime:"Night",note:"River seafood stop tied to the firefly excursion area.",tip:"Evening works well before boat rides.",x:-210,z:124},{name:"Batu Caves Temple Steps",district:"Gombak",category:"culture",tags:["temple","limestone"],bestTime:"Day",note:"Main cave-temple stair climb marker north of KL.",tip:"Respect temple rules and watch belongings around monkeys.",x:88,z:92},{name:"Kanching Falls",district:"Rawang / Selayang",category:"nature",tags:["waterfall","forest"],bestTime:"Day",note:"Waterfall park gateway north of the city.",tip:"Go early and avoid slippery rocks after rain.",x:18,z:176},{name:"Templer Park",district:"Rawang / Selayang",category:"nature",tags:["forest","picnic"],bestTime:"Day",note:"Forest park and picnic marker north of KL.",tip:"Works with Kanching or Rawang as a nature loop.",x:12,z:156},{name:"Bukit Kiara Trails",district:"TTDI / Kiara",category:"nature",tags:["trail","cycling"],bestTime:"Day",note:"Urban forest trail marker between TTDI and Mont Kiara.",tip:"Use proper shoes and respect trail users.",x:-104,z:44},{name:"Rimba Ilmu UM",district:"University Malaya",category:"nature",tags:["botanical","education"],bestTime:"Day",note:"Botanical and education-oriented green marker near UM.",tip:"Check public access before visiting.",x:-94,z:-48},{name:"KL Gateway Mall",district:"Kerinchi",category:"shopping",tags:["mall","transit"],bestTime:"Day",note:"Transit-linked mall marker between Bangsar South and PJ.",tip:"Useful connector rather than a destination.",x:-80,z:-62},{name:"Bangsar South Business Park",district:"Bangsar South",category:"modern",tags:["business","food"],bestTime:"Day",note:"Modern office, food, and transit district south-west of KL.",tip:"Good for cafes and practical stops.",x:-74,z:-76},{name:"Saloma Bridge",district:"Kampung Baru / KLCC",category:"viewpoint",tags:["bridge","photo"],bestTime:"Night",note:"Pedestrian bridge linking Kampung Baru to KLCC views.",tip:"Night lighting gives the strongest photo effect.",x:-22,z:8},{name:"RexKL",district:"Chinatown",category:"culture",tags:["creative","food"],bestTime:"Day",note:"Creative reuse space with books, food, and events in Chinatown.",tip:"Check pop-ups and weekend events.",x:-12,z:-46},{name:"Kwong Tong Cemetery View",district:"Sungai Besi Edge",category:"heritage",tags:["history","hill"],bestTime:"Golden Hour",note:"Historic hillside marker on the southern city edge.",tip:"Be respectful; it is not a theme-park stop.",x:42,z:-84},{name:"National Stadium Bukit Jalil",district:"Bukit Jalil",category:"sports",tags:["stadium","events"],bestTime:"Night",note:"Major stadium and event precinct south of KL.",tip:"Check event days and rail crowding.",x:36,z:-126},{name:"Bukit Jalil Park",district:"Bukit Jalil",category:"park",tags:["park","walking"],bestTime:"Day",note:"Large park marker near the stadium precinct.",tip:"Morning and evening are most comfortable.",x:18,z:-126}],X0={"Petronas Twin Towers":{lat:3.1579,lon:101.7116},"KLCC Park":{lat:3.1553,lon:101.7141},"Merdeka 118":{lat:3.1417,lon:101.7006},"KL Tower":{lat:3.1528,lon:101.7033},"Merdeka Square":{lat:3.1478,lon:101.6937},"Sultan Abdul Samad Building":{lat:3.1486,lon:101.6941},"Masjid Jamek / River of Life":{lat:3.1489,lon:101.6968},"Royal Selangor Club":{lat:3.1474,lon:101.6931},"Petaling Street / Chinatown":{lat:3.1442,lon:101.6979},"Central Market":{lat:3.1459,lon:101.6955},"Jalan Alor":{lat:3.1467,lon:101.7087},"Bukit Bintang":{lat:3.1461,lon:101.711},"Pavilion KL":{lat:3.1491,lon:101.7135},"TRX Exchange 106":{lat:3.1426,lon:101.7194},"Masjid Negara":{lat:3.1416,lon:101.6915},"Islamic Arts Museum":{lat:3.1423,lon:101.6893},"National Planetarium":{lat:3.1396,lon:101.6885},"Lake Gardens":{lat:3.1437,lon:101.684},"Tugu Negara":{lat:3.149,lon:101.6839},"Old Railway Station":{lat:3.1395,lon:101.6935},"National Museum":{lat:3.1378,lon:101.6869},"Little India Brickfields":{lat:3.1307,lon:101.686},"Thean Hou Temple":{lat:3.1216,lon:101.6877},"Istana Negara":{lat:3.1589,lon:101.6669},"Batu Caves Gateway":{lat:3.2379,lon:101.684},"Kampung Baru":{lat:3.1647,lon:101.706},"Chow Kit Market":{lat:3.1672,lon:101.6984},"LRT / MRT Hub":{lat:3.1448,lon:101.6957},"Putrajaya Lake & Mosque":{lat:2.936,lon:101.6901},"Sunway Lagoon & Pyramid":{lat:3.071,lon:101.605},"Shah Alam Blue Mosque":{lat:3.0789,lon:101.5197},"Genting Highlands Gateway":{lat:3.4239,lon:101.7933},"FRIM Forest Reserve":{lat:3.235,lon:101.6346},"Zoo Negara":{lat:3.2073,lon:101.7582},"Ampang Lookout Ridge":{lat:3.148,lon:101.7748},"Bangsar Village":{lat:3.1288,lon:101.67},"Mid Valley Megamall":{lat:3.1186,lon:101.677},"Mont Kiara Dining Cluster":{lat:3.169,lon:101.65},"Damansara Arts & Cafes":{lat:3.153,lon:101.613},"Klang Royal Town":{lat:3.0449,lon:101.4456},"Port Klang Coastal Gate":{lat:3,lon:101.392},"Kajang Satay Town":{lat:2.9935,lon:101.787},"Cyberjaya Tech Garden":{lat:2.9225,lon:101.6559},"Broga Hill Sunrise":{lat:2.938,lon:101.9},"Kuala Selangor Fireflies":{lat:3.34,lon:101.25},"Rawang Forest Gateway":{lat:3.3213,lon:101.5767},"Setia City Park":{lat:3.1108,lon:101.4609},"i-City Shah Alam":{lat:3.0657,lon:101.4846},"Sultan Alam Shah Museum":{lat:3.073,lon:101.518},"Subang Airport Heritage Strip":{lat:3.1306,lon:101.5497},"SS15 Food Street":{lat:3.0755,lon:101.5881},"USJ Taipan":{lat:3.0472,lon:101.59},"Puchong IOI Boulevard":{lat:3.0467,lon:101.6177},"Seri Kembangan Food Quarter":{lat:3.022,lon:101.705},"Mines Lake":{lat:3.029,lon:101.715},"IOI City Mall":{lat:2.9705,lon:101.7139},"Putrajaya Pink Mosque":{lat:2.9357,lon:101.6905},"Putrajaya Bridge Promenade":{lat:2.9305,lon:101.6918},"Dengkil Kampung Food":{lat:2.863,lon:101.68},"Sepang Circuit":{lat:2.76,lon:101.738},"KLIA Terminal Gateway":{lat:2.7456,lon:101.7072},"Nilai Outlet Corridor":{lat:2.8178,lon:101.7983},"Cheras Leisure Mall":{lat:3.0905,lon:101.7426},"Taman Connaught Night Market":{lat:3.0828,lon:101.737},"Ampang Korean Village":{lat:3.1545,lon:101.7609},"Ulu Klang Ridge Trail":{lat:3.208,lon:101.785},"Melawati Food & Hills":{lat:3.2145,lon:101.747},"Gombak Transit Gate":{lat:3.2319,lon:101.7245},"Selayang Market":{lat:3.252,lon:101.653},"Kepong Food Row":{lat:3.214,lon:101.637},"Desa ParkCity Lake":{lat:3.186,lon:101.6305},"Publika Arts Mall":{lat:3.1718,lon:101.6661},"Sentul Depot":{lat:3.184,lon:101.69},"Titiwangsa Lake Gardens":{lat:3.1772,lon:101.7044},"Wangsa Maju Town Centre":{lat:3.2057,lon:101.7315},"Setapak Food Quarter":{lat:3.198,lon:101.717},"PJ Old Town":{lat:3.0852,lon:101.6462},"Section 17 Market":{lat:3.123,lon:101.635},"TTDI Market":{lat:3.14,lon:101.629},"1 Utama & Bandar Utama":{lat:3.15,lon:101.615},"Mutiara Damansara Curve":{lat:3.157,lon:101.609},"Bukit Jelutong Park":{lat:3.098,lon:101.536},"Klang Little India":{lat:3.043,lon:101.448},"Pulau Ketam Ferry Gate":{lat:3.001,lon:101.392},"Morib Beach Gateway":{lat:2.746,lon:101.442},"Banting Food Stop":{lat:2.813,lon:101.501},"Janda Baik Gateway":{lat:3.316,lon:101.854},"Bukit Tinggi Village Gate":{lat:3.349,lon:101.826},"Rawang Waterfall Gate":{lat:3.342,lon:101.596},"Sungai Buloh Nursery Belt":{lat:3.211,lon:101.565},"Elmina Rainbow Bridge":{lat:3.163,lon:101.519},"Sasaran Sky Mirror Gate":{lat:3.35,lon:101.248},"Bukit Melawati":{lat:3.3417,lon:101.2469},"Selangor River Seafood":{lat:3.336,lon:101.252},"Batu Caves Temple Steps":{lat:3.2379,lon:101.684},"Kanching Falls":{lat:3.299,lon:101.624},"Templer Park":{lat:3.287,lon:101.653},"Bukit Kiara Trails":{lat:3.143,lon:101.644},"Rimba Ilmu UM":{lat:3.129,lon:101.657},"KL Gateway Mall":{lat:3.112,lon:101.665},"Bangsar South Business Park":{lat:3.111,lon:101.667},"Saloma Bridge":{lat:3.1602,lon:101.7079},RexKL:{lat:3.1429,lon:101.6972},"Kwong Tong Cemetery View":{lat:3.114,lon:101.706},"National Stadium Bukit Jalil":{lat:3.0548,lon:101.6912},"Bukit Jalil Park":{lat:3.061,lon:101.674}},Xi=W0.map(i=>{if(i.district==="Malaysia Highlights")return{...i,isSchematicGateway:!0,schematicX:V0,schematicZ:i.z};const e=X0[i.name];return e?{...i,...H0(e),lat:e.lat,lon:e.lon,coordinateSource:"latLon"}:{...i,coordinateSource:"schematic"}}),K0=[{name:"KLCC and Golden Triangle",summary:"Towers, parks, malls, nightlife, and modern skyline stops."},{name:"Heritage Core",summary:"Merdeka Square, river confluence, Chinatown, markets, and colonial architecture."},{name:"Lake Gardens and Museums",summary:"Mosque, museums, planetarium, monument, and shaded gardens."},{name:"Brickfields and Transit",summary:"Rail heritage, Little India, museum access, and interchanges."},{name:"Greater Klang Valley",summary:"Satellite districts, family parks, food towns, forest reserves, and airport-side day trips."},{name:"Petaling Jaya / Subang / Sunway",summary:"PJ markets, malls, Subang food streets, Sunway attractions, and suburban local life."},{name:"Shah Alam / Klang / Coast",summary:"Blue Mosque, royal Klang, coastal ferry gates, fireflies, seafood, and beaches."},{name:"Putrajaya / Cyberjaya / South Corridor",summary:"Civic lakefront, tech city, airport, Sepang, Kajang, and southern food stops."},{name:"North & East Nature Ring",summary:"FRIM, Kepong, Rawang, Selayang, Gombak, Ampang, Genting, and foothill escapes."},{name:"Malaysia Highlights",summary:"Gateway pads for trip planning beyond the KL map."}],q0=["Carry water and plan outdoor walks around heat and afternoon rain.","Use rail for KLCC, Bukit Bintang, Chinatown, and Brickfields when traffic is heavy.","Dress modestly for mosque and temple visits, and remove shoes where requested.","Ask before close-up market photos and keep valuables secure in crowds.","Use ride-hail or taxis for hilly or off-rail stops such as Thean Hou Temple."],Y0=["Kuala Lumpur grew around the Klang and Gombak river confluence.","The city mixes Malay, Chinese, Indian, Islamic, colonial, and contemporary architecture.","Night markets and food streets are major parts of local urban life.","Malaysia highlights often require separate travel planning because the country spans Peninsular Malaysia and Borneo."],j0=[{term:"Masjid",meaning:"Mosque."},{term:"Jalan",meaning:"Road or street."},{term:"Kampung",meaning:"Village."},{term:"Pasar",meaning:"Market."},{term:"Merdeka",meaning:"Independence."}],Ot=-220,zt=220,$0=zt-Ot+1,Z0=new Map(Xi.map(i=>[i.name,i]));function Re(i,e){const t=Z0.get(i);return t?{x:t.x,z:t.z}:e}function pe(i,e,t){const n=Re(i,t);return new C(n.x,e,n.z)}function Il(i,e){return`${i},${e}`}function Cn(i,e,t){return Math.floor(e+i()*(t-e+1))}function _c(i,e,t,n){return Math.hypot(i-t,e-n)}function vc(i,e,t,n){return t.some(a=>_c(i,e,a.x,a.z)<n)}function Ln(i,e,t,n,a=4){const r=e.surfaceYAt(t,n);i.addBox(t,r+a/2,n,.7,a,.7,"treeTrunk"),i.addBox(t,r+a+.8,n,3.4,1.2,3.4,"treeLeaf"),i.addBox(t,r+a+1.4,n,2.1,1.1,2.1,"treeLeaf2"),i.addBox(t,r+a+.4,n,4.8,.55,1.2,"treeLeaf"),i.addBox(t,r+a+.4,n,1.2,.55,4.8,"treeLeaf")}function Dn(i,e,t,n,a=1,r=1,s="road"){const o=e.surfaceYAt(t,n)+.04;i.addBox(t+.5,o,n+.5,a,.08,r,s)}function Gt(i,e,t,n,a=5){const r=Math.sign(n.x-t.x),s=Math.sign(n.z-t.z),o=Math.max(Math.abs(n.x-t.x),Math.abs(n.z-t.z)),l=Math.floor(a/2);for(let c=0;c<=o;c+=1){const d=t.x+r*c,h=t.z+s*c;if(Math.abs(r)>0){for(let u=-l;u<=l;u+=1)Dn(i,e,d,h+u);c%7===0&&Dn(i,e,d,h,.9,.18,"lineWhite")}else{for(let u=-l;u<=l;u+=1)Dn(i,e,d+u,h);c%7===0&&Dn(i,e,d,h,.18,.9,"lineWhite")}}}function Pt(i,e,t,n,a,r,s="plaza"){const o=Math.floor(t-a/2),l=Math.floor(n-r/2);for(let c=o;c<o+a;c+=1)for(let d=l;d<l+r;d+=1){const h=(c+d)%2===0?s:"concrete",u=e.surfaceYAt(c,d)+.05;i.addBox(c+.5,u,d+.5,1,.09,1,h)}}function J0(i,e,t,n,a,r,s,o,l="glassDark"){for(let c=1;c<s;c+=2){const d=r+c*o;i.addBox(e+n/2,d,t-.06,Math.max(1,n-1),.42,.08,l),i.addBox(e+n/2,d,t+a+.06,Math.max(1,n-1),.42,.08,l),i.addBox(e-.06,d,t+a/2,.08,.42,Math.max(1,a-1),l),i.addBox(e+n+.06,d,t+a/2,.08,.42,Math.max(1,a-1),l)}}function va(i,e,t,n,a,r,s,o,l="glassDark"){const c=e.surfaceYAt(t+a/2,n+r/2),d=2,h=Math.max(2,Math.floor(s/d)),u=h*d;i.addBox(t+a/2,c+u/2,n+r/2,a,u,r,o),i.addBox(t+a/2,c+u+.25,n+r/2,a+.6,.5,r+.6,"concreteDark"),J0(i,t,n,a,r,c+.9,h,d,l),u>24&&i.addBox(t+a/2,c+u+2,n+r/2,Math.max(1.5,a*.38),3.5,Math.max(1.5,r*.38),"steel")}function Ul(i,e,t,n){for(let r=0;r<70;r+=2){const s=r/70,o=s<.38?7:s<.67?6:s<.86?5:4,l=r%8===0?"petronasTrim":"silver";i.addBox(t,e+r+1,n,o,2,o,"glass"),i.addBox(t,e+r+1.03,n,o+1.1,.22,o+1.1,l),i.addBox(t-o/2-.3,e+r+1,n,.45,2,1.5,"petronasTrim"),i.addBox(t+o/2+.3,e+r+1,n,.45,2,1.5,"petronasTrim"),i.addBox(t,e+r+1,n-o/2-.3,1.5,2,.45,"petronasTrim"),i.addBox(t,e+r+1,n+o/2+.3,1.5,2,.45,"petronasTrim")}for(let r=0;r<8;r+=1)i.addBox(t,e+70+1.2+r*1.7,n,3.6-r*.35,1.5,3.6-r*.35,r%2?"petronasTrim":"silver");i.addBox(t,e+70+17,n,.8,12,.8,"petronasTrim"),i.addBox(t,e+70+24,n,.35,5,.35,"petronasTrim")}function Q0(i,e){const{x:t,z:n}=Re("Petronas Twin Towers",{x:-12,z:22}),a=t-6.5,r=t+6.5,s=e.surfaceYAt(t,n);Pt(i,e,t,n,38,28,"concrete"),Ul(i,s,a,n),Ul(i,s,r,n),i.addBox((a+r)/2,s+35,n,Math.abs(r-a)+4,3,3.2,"petronasTrim"),i.addBox((a+r)/2,s+35,n,Math.abs(r-a)+2,1.5,4.6,"glass"),i.addBox(t,s+2.4,n+16,20,4.8,8,"concreteDark"),i.addBox(t,s+5.2,n+16,22,1.2,9.5,"petronasTrim")}function ex(i,e){const{x:t,z:n}=Re("Merdeka 118",{x:35,z:18}),a=e.surfaceYAt(t,n);Pt(i,e,t,n,30,26,"plaza");for(let r=0;r<86;r+=3){const s=r/86,o=12-s*5.8,l=10-s*3.6,c=Math.sin(s*Math.PI*2)*.9;i.addBox(t+c,a+r+1.5,n,o,3,l,"merdekaGlass"),r%9===0&&i.addBox(t+c,a+r+1.55,n,o+.7,.35,l+.7,"merdekaTrim"),i.addBox(t+o/2+c+.16,a+r+1.5,n,.22,3,l*.8,"blackGlass")}i.addBox(t,a+91,n,3.3,9,3.3,"merdekaTrim"),i.addBox(t,a+101,n,1.1,16,1.1,"merdekaTrim"),i.addBox(t,a+111,n,.45,8,.45,"merdekaTrim")}function tx(i,e){const{x:t,z:n}=Re("KL Tower",{x:58,z:-25}),a=e.surfaceYAt(t,n);Pt(i,e,t,n,22,20,"concrete"),i.addBox(t,a+27,n,3,54,3,"klTowerWhite"),i.addBox(t,a+28,n,1.3,58,1.3,"stoneDark"),i.addBox(t,a+56,n,12,5,12,"klTowerWhite"),i.addBox(t,a+58,n,15,2,7,"glassGreen"),i.addBox(t,a+58,n,7,2,15,"glassGreen"),i.addBox(t,a+61.6,n,10,2,10,"klTowerRed"),i.addBox(t,a+70,n,1.3,18,1.3,"klTowerWhite"),i.addBox(t,a+83,n,.45,8,.45,"klTowerRed")}function nx(i,e){const{x:t,z:n}=Re("Sultan Abdul Samad Building",{x:0,z:-55}),a=e.surfaceYAt(t,n);Pt(i,e,t,n,62,22,"plaza"),i.addBox(t,a+4,n,54,8,8,"redBrick"),i.addBox(t,a+8.8,n,56,1.2,9.2,"stone");for(let r=-24;r<=24;r+=8)i.addBox(t+r,a+4.8,n-4.5,2.4,5.6,.6,"mosqueWhite"),i.addBox(t+r,a+4.8,n+4.5,2.4,5.6,.6,"mosqueWhite");i.addBox(t,a+12,n,7,24,7,"redBrick"),i.addBox(t,a+19.5,n-3.7,4.5,4,.7,"mosqueWhite"),i.addBox(t,a+19.5,n+3.7,4.5,4,.7,"mosqueWhite"),i.addBox(t,a+25.2,n,8.5,2.4,8.5,"roofCopper"),i.addBox(t,a+28.2,n,5.8,3.4,5.8,"roofCopper"),i.addBox(t,a+31.6,n,2.8,3.2,2.8,"roofCopper"),[-25,25].forEach(r=>{i.addBox(t+r,a+10,n,5.2,14,5.2,"redBrick"),i.addBox(t+r,a+18.8,n,6.6,2.2,6.6,"roofCopper"),i.addBox(t+r,a+21.2,n,3.8,2.8,3.8,"roofCopper")})}function ix(i,e){const{x:t,z:n}=Re("Masjid Negara",{x:-48,z:-32}),a=e.surfaceYAt(t,n);Pt(i,e,t,n,34,26,"concrete"),i.addBox(t,a+3,n,22,6,14,"mosqueWhite");for(let r=0;r<6;r+=1)i.addBox(t,a+6.2+r*.72,n,25-r*3.2,.7,17-r*2,"mosqueBlue");i.addBox(t-17,a+14,n+4,2.4,28,2.4,"mosqueWhite"),i.addBox(t-17,a+29.5,n+4,4.5,3.2,4.5,"mosqueBlue"),i.addBox(t-17,a+33,n+4,1.1,6,1.1,"mosqueWhite")}function ax(i,e){const{x:t,z:n}=Re("Tugu Negara",{x:-70,z:43}),a=e.surfaceYAt(t,n);Pt(i,e,t,n,26,20,"plaza"),i.addBox(t,a+1.3,n,16,2.6,10,"stone"),i.addBox(t,a+3.4,n,12,1.2,7,"concrete"),[-4,-2,0,2,4].forEach((s,o)=>{const l=(o-2)*.25;i.addBox(t+s,a+7,n+l,1.2,6,1.2,"monumentBronze"),i.addBox(t+s,a+10.4,n+l,2,1.6,1.8,"monumentBronze"),i.addBox(t+s-1.2,a+7.6,n+l,1.1,3.8,.9,"monumentBronze"),i.addBox(t+s+1.2,a+8.2,n+l,1.1,4.2,.9,"monumentBronze")}),i.addBox(t+4,a+14,n,1,9,1,"monumentBronze"),i.addBox(t+4,a+17.6,n,5,1.2,.8,"monumentBronze")}function rx(i,e){const{x:t,z:n}=Re("TRX Exchange 106",{x:66,z:32}),a=e.surfaceYAt(t,n);Pt(i,e,t,n,28,22,"concrete");for(let r=0;r<74;r+=3){const s=r/74;i.addBox(t,a+r+1.5,n,11-s*4,3,9-s*3,"glassGreen"),r%12===0&&i.addBox(t,a+r+1.6,n,12-s*4,.3,10-s*3,"mallGold")}i.addBox(t,a+78,n,5,6,5,"mallGold"),i.addBox(t,a+84,n,1,8,1,"mallGold"),va(i,e,t-18,n-6,8,8,34,"blackGlass","glassDark"),va(i,e,t+12,n-8,7,9,28,"merdekaGlass","glass")}function sx(i,e){const{x:t,z:n}=Re("Bukit Bintang",{x:30,z:-22}),a=e.surfaceYAt(t,n);Pt(i,e,t,n,30,24,"plaza"),i.addBox(t-8,a+5,n,18,10,10,"mallGold"),i.addBox(t+8,a+4,n+4,13,8,9,"glassDark"),i.addBox(t,a+10.5,n,32,1,14,"concreteDark");for(let r=-10;r<=10;r+=5)i.addBox(t+r,a+11.6,n-7,2.5,1.4,.5,"lampGlow")}function ox(i,e){const{x:t,z:n}=Re("Central Market",{x:-20,z:-60}),a=e.surfaceYAt(t,n);Pt(i,e,t,n,24,16,"concrete"),i.addBox(t,a+3.8,n,20,7.6,9,"marketBlue"),i.addBox(t,a+8.2,n,22,1.2,10.5,"concrete"),i.addBox(t,a+10,n,12,2.2,5,"marketBlue")}function lx(i,e){const{x:t,z:n}=Re("Old Railway Station",{x:-36,z:-58}),a=e.surfaceYAt(t,n);i.addBox(t,a+4,n,24,8,7,"mosqueWhite");for(let r=-10;r<=10;r+=5)i.addBox(t+r,a+9,n,3,4,3,"mosqueWhite");i.addBox(t,a+11.8,n,26,1,8.5,"stationRoof"),i.addBox(t-13,a+10,n,2,12,2,"mosqueWhite"),i.addBox(t+13,a+10,n,2,12,2,"mosqueWhite")}function cx(i,e){const{x:t,z:n}=Re("Thean Hou Temple",{x:-75,z:-20}),a=e.surfaceYAt(t,n);Pt(i,e,t,n,22,18,"plaza"),i.addBox(t,a+3,n,16,6,10,"templeRed");for(let r=0;r<3;r+=1)i.addBox(t,a+6.6+r*.7,n,19-r*2,.65,12-r,"templeGold");[-7,7].forEach(r=>{i.addBox(t+r,a+7,n,3.5,7,3.5,"templeRed"),i.addBox(t+r,a+11,n,5,1,5,"templeGold")})}function dx(i,e){const{x:t,z:n}=Re("National Museum",{x:-58,z:-66}),a=e.surfaceYAt(t,n);Pt(i,e,t,n,24,18,"concrete"),i.addBox(t,a+3.5,n,18,7,10,"museumBrown"),i.addBox(t,a+8,n,20,2,12,"roofCopper"),i.addBox(t,a+10.2,n,10,2.2,6,"roofCopper")}function hx(i,e){[[18,-8],[18,42],[-62,-55],[-24,22],[46,22],[0,-55]].forEach(([n,a])=>{for(let r=-3;r<=3;r+=2)Dn(i,e,n+r,a,.65,5.4,"lineWhite"),Dn(i,e,n,a+r,5.4,.65,"lineWhite")});for(let n=-80;n<=80;n+=16)[[n,-12],[n,46]].forEach(([a,r])=>{const s=e.surfaceYAt(a,r);i.addBox(a,s+2,r,.35,4,.35,"concreteDark"),i.addBox(a,s+4.2,r,1.1,.45,1.1,"lampGlow")});[[-30,-8],[34,-8],[52,42],[-70,42]].forEach(([n,a])=>{const r=e.surfaceYAt(n,a);i.addBox(n,r+1.2,a,4,2.4,2.2,"busGreen"),i.addBox(n,r+2.7,a,4.6,.5,2.8,"stationRoof")}),[[-8,-50],[-52,-24],[22,34],[41,-18],[-72,52]].forEach(([n,a])=>{const r=e.surfaceYAt(n,a);i.addBox(n,r+1,a,3.2,2,1.8,"warning"),i.addBox(n-1.5,r+2.3,a,.8,.8,.8,"lampGlow")})}function oa(i,e,t,n,a,r,s=13){const o=Math.min(a,r),l=Math.max(a,r);for(let c=o;c<=l;c+=2){const d=t==="x"?c:n,h=t==="x"?n:c,u=e.surfaceYAt(d,h);c%10===0&&i.addBox(d,u+5.2,h,1.2,10.4,1.2,"concreteDark"),t==="x"?(i.addBox(d+.5,s,h,2.2,.35,5.2,"concrete"),i.addBox(d+.5,s+.45,h-1.4,2.2,.25,.35,"rail"),i.addBox(d+.5,s+.45,h+1.4,2.2,.25,.35,"rail")):(i.addBox(d,s,h+.5,5.2,.35,2.2,"concrete"),i.addBox(d-1.4,s+.45,h+.5,.35,.25,2.2,"rail"),i.addBox(d+1.4,s+.45,h+.5,.35,.25,2.2,"rail"))}}function Nl(i,e,t,n,a="station"){const r=e.surfaceYAt(t,n),s=13;i.addBox(t,s+1.8,n,13,3,8,a),i.addBox(t,s+4,n,15,1.4,10,"stationRoof"),i.addBox(t-5,r+6,n-3,1.2,12,1.2,"concreteDark"),i.addBox(t+5,r+6,n+3,1.2,12,1.2,"concreteDark"),i.addBox(t,r+1.8,n+7,9,3.6,3,"station")}function ux(i,e){const t=gc(20260604),n=["Petronas Twin Towers","Merdeka 118","KL Tower","Sultan Abdul Samad Building","Masjid Negara","Tugu Negara"].map(r=>Re(r,{x:0,z:0})),a=["glass","glassGreen","merdekaGlass","silver","concreteDark","blackGlass"];for(let r=0;r<88;r+=1){const s=Cn(t,-70,72),o=Cn(t,-70,65),l=Cn(t,4,10),c=Cn(t,4,10);if(vc(s,o,n,19)||Math.abs(o+8)<6||Math.abs(s-18)<6||Math.abs(o-42)<5||Math.abs(s+60)<5)continue;const d=Ii(1.4-_c(s,o,8,6)/85,.35,1.4),h=Math.floor((Cn(t,8,34)+t()*20)*d),u=a[Cn(t,0,a.length-1)],p=u==="blackGlass"?"glass":"glassDark";va(i,e,s,o,l,c,Math.max(7,h),u,p)}}function fx(i){const e=new Map;for(let a=Ot;a<=zt;a+=1)for(let r=Ot;r<=zt;r+=1){const s=Math.hypot(a*.78,r)/100,o=Dl(a/44,r/44,8808,4)*5.5+Dl(a/18,r/18,9020,3)*2.4,l=Math.max(0,1-Math.hypot(a-8,r+2)/92),c=2.4+o+s*4.5-l*2.8,d=Math.floor(c/1.35)*1.35,h=Ii(Math.round(d),0,11);e.set(Il(a,r),h)}const t=(a,r)=>{const s=Ii(Math.floor(a),Ot,zt),o=Ii(Math.floor(r),Ot,zt);return e.get(Il(s,o))??1},n={min:Ot,max:zt,size:$0,heightAtCell:t,surfaceYAt(a,r){return t(a,r)+1},clampXZ(a){return a.x=Ii(a.x,Ot+2,zt-2),a.z=Ii(a.z,Ot+2,zt-2),a}};for(let a=Ot;a<=zt;a+=1)for(let r=Ot;r<=zt;r+=1){const s=t(a,r),o=da(a,r,4477),l=o>.72?"grass2":o<.18?"grassDark":"grass";i.addVoxel(a,s,r,l);const c=Math.min(t(a-1,r),t(a+1,r),t(a,r-1),t(a,r+1),a===Ot||a===zt||r===Ot||r===zt?0:s);for(let d=c+1;d<s;d+=1)i.addVoxel(a,d,r,d>s-3?"dirt":"clay");if(a===Ot||a===zt||r===Ot||r===zt)for(let d=0;d<s;d+=1)i.addVoxel(a,d,r,d>s-4?"dirt":"stoneDark")}return n}function px(i,e){for(let n=-82;n<-58;n+=1)for(let a=53;a<77;a+=1){const r=(n+70)/12,s=(a-65)/12;if(r*r+s*s<1){const o=e.surfaceYAt(n,a)+.09;i.addBox(n+.5,o,a+.5,1,.1,1,"water")}}[[-77,50],[-65,38],[-58,44],[-75,70],[-59,72],[-42,28],[-34,32],[-28,-38],[-54,-18],[-63,-21],[-8,-42],[14,-43],[43,-12],[50,-8],[66,-14],[72,-34],[24,42],[12,48],[-10,48],[-20,40]].forEach(([n,a],r)=>Ln(i,e,n,a,3.5+r%4*.6));for(let n=-78;n<=78;n+=11)Math.abs(n)<18||Ln(i,e,n,77,4)}function mx(i,e){for(let t=-62;t<=-28;t+=1){const n=Math.round(-8+Math.sin(t*.18)*3);for(let a=-2;a<=2;a+=1)Dn(i,e,n+a,t,1,1,"riverBlue")}for(let t=-24;t<=6;t+=1){const n=Math.round(-39+Math.sin(t*.22)*2);for(let a=-1;a<=1;a+=1)Dn(i,e,t,n+a,1,1,"riverBlue")}}function Fl(i,e,t,n,a="warning"){const r=e.surfaceYAt(t,n);i.addBox(t,r+1.8,n,.45,3.2,.45,"concreteDark"),i.addBox(t,r+3.6,n,4.2,1.5,.55,a)}function Ui(i,e,t,n,a,r="marketRed"){for(let s=0;s<a;s+=1){const o=t+s%5*4-8,l=n+Math.floor(s/5)*4-4,c=e.surfaceYAt(o,l);i.addBox(o,c+1.1,l,2.6,2.2,2.2,"concreteDark"),i.addBox(o,c+2.5,l,3.2,.55,2.8,s%2?r:"awningStripe"),i.addBox(o,c+.65,l+2,1.1,1.3,1.1,"lampGlow")}}function xx(i,e){mx(i,e);const t=Re("KLCC Park",{x:-25,z:43}),n=Re("Petaling Street / Chinatown",{x:-18,z:-42}),a=Re("Jalan Alor",{x:23,z:-32}),r=Re("Masjid Jamek / River of Life",{x:-9,z:-38}),s=Re("Royal Selangor Club",{x:-12,z:-55}),o=Re("Islamic Arts Museum",{x:-58,z:-40}),l=Re("National Planetarium",{x:-64,z:-34}),c=Re("Istana Negara",{x:-86,z:10}),d=Re("Batu Caves Gateway",{x:82,z:68}),h=Re("Kampung Baru",{x:-35,z:8}),u=Re("Chow Kit Market",{x:-44,z:-12}),p=Re("Little India Brickfields",{x:-55,z:-74}),g=Re("Pavilion KL",{x:39,z:-18});Pt(i,e,t.x,t.z,24,18,"parkPath"),[[-6,-4],[3,-5],[7,5],[-7,7],[1,1]].forEach(([S,R])=>Ln(i,e,t.x+S,t.z+R,4)),Ui(i,e,n.x,n.z,9,"marketRed"),Fl(i,e,n.x+3,n.z+6,"templeRed"),Ui(i,e,a.x,a.z,10,"lampGlow");for(let S=-8;S<=8;S+=4){const R=e.surfaceYAt(a.x+S,a.z+5);i.addBox(a.x+S,R+1,a.z+5,1.4,.7,1.4,"mallGold")}const y=e.surfaceYAt(r.x,r.z);i.addBox(r.x,y+3,r.z,12,6,8,"mosqueWhite"),i.addBox(r.x,y+7,r.z,8,2,8,"roofCopper"),i.addBox(r.x-5,y+9,r.z+4,1.4,12,1.4,"mosqueWhite");const m=e.surfaceYAt(s.x,s.z);i.addBox(s.x,m+3,s.z,16,6,7,"stationRoof"),i.addBox(s.x,m+6.8,s.z,18,1,8,"mosqueWhite");const f=e.surfaceYAt(o.x,o.z);i.addBox(o.x,f+3.6,o.z,18,7.2,12,"mosqueWhite"),i.addBox(o.x,f+8.1,o.z,9,2.5,9,"mosqueBlue");const E=e.surfaceYAt(l.x,l.z);i.addBox(l.x,E+3,l.z,12,6,10,"museumBrown"),i.addBox(l.x,E+7.2,l.z,8,3,8,"glassGreen");const T=e.surfaceYAt(c.x,c.z);Pt(i,e,c.x,c.z,18,16,"plaza"),i.addBox(c.x,T+4,c.z,16,8,9,"palaceWall"),i.addBox(c.x,T+9,c.z,12,2.2,6,"palaceGold"),i.addBox(c.x-8,T+5,c.z-4,2,10,2,"palaceGold");const w=e.surfaceYAt(d.x,d.z);i.addBox(d.x,w+8,d.z,18,16,8,"caveLimestone"),i.addBox(d.x,w+3,d.z-5,5,6,3,"templeGold");for(let S=0;S<8;S+=1)i.addBox(d.x,w+.2+S*.25,d.z-10+S,9-S*.5,.3,1,"concrete");Ui(i,e,h.x,h.z,8,"templeGold"),Ui(i,e,u.x,u.z,8,"marketBlue"),Ui(i,e,p.x,p.z,7,"littleIndiaPink");const L=e.surfaceYAt(g.x,g.z);i.addBox(g.x,L+4.5,g.z,18,9,12,"pavilionRed"),i.addBox(g.x,L+9.5,g.z,20,1,13,"mallGold"),Xi.filter(S=>S.isSchematicGateway).forEach((S,R)=>{const B=e.surfaceYAt(S.x,S.z);Pt(i,e,S.x,S.z,8,7,R%2?"plaza":"concrete"),i.addBox(S.x,B+.8,S.z,7,1.2,5.5,"gatewayPurple"),i.addBox(S.x,B+3.2,S.z,4.5,3.6,.8,"lampGlow"),Fl(i,e,S.x-3,S.z+3,"gatewayPurple")})}function yc(i,e,t,n,a,r="gatewayPurple"){const s=e.surfaceYAt(t,n);i.addBox(t,s+.7,n,a,.8,2.2,r),i.addBox(t-a/2+.5,s+2.1,n,.6,2.8,.6,"concreteDark"),i.addBox(t+a/2-.5,s+2.1,n,.6,2.8,.6,"concreteDark")}function Bl(i,e,t,n,a=1){const r=e.surfaceYAt(t,n);i.addBox(t,r+2.4*a,n,9*a,4.8*a,6*a,"mosqueWhite"),i.addBox(t,r+5.4*a,n,7*a,1.8*a,7*a,"mosqueBlue"),i.addBox(t-6*a,r+6*a,n+2*a,1.1*a,10*a,1.1*a,"mosqueWhite")}function gx(i,e,t,n,a="mallGold"){const r=e.surfaceYAt(t,n);i.addBox(t,r+4,n,18,8,12,a),i.addBox(t,r+8.8,n,20,1.2,14,"concreteDark"),i.addBox(t-6,r+4.2,n-6.1,4,2.4,.4,"glassDark"),i.addBox(t+5,r+4.2,n-6.1,4,2.4,.4,"glassDark")}function _x(i,e,t,n,a="treeLeaf"){const r=e.surfaceYAt(t,n);for(let s=0;s<5;s+=1)i.addBox(t+(s-2)*4,r+1+s*.8,n+s*2,14-s*1.6,2+s*.8,10-s,s%2?a:"grassDark");Ln(i,e,t-7,n-4,5),Ln(i,e,t+8,n+6,4.5)}function vx(i,e,t,n){Ui(i,e,t,n,12,"marketRed");const a=e.surfaceYAt(t,n);for(let r=-8;r<=8;r+=4)i.addBox(t+r,a+4,n-8,.45,5.2,.45,"concreteDark"),i.addBox(t+r,a+6.8,n-8,1.4,.7,1.4,"lampGlow")}function yx(i,e,t,n,a){const r=e.surfaceYAt(t,n);Pt(i,e,t,n,18,14,a%2?"plaza":"concrete"),i.addBox(t,r+1.4,n,14,2.2,9,"gatewayPurple"),i.addBox(t,r+5,n,7,7,1.4,"lampGlow"),i.addBox(t,r+8.8,n,4,2,4,a%2?"templeGold":"glassGreen"),yc(i,e,t,n+9,12,"gatewayPurple")}function Mx(i,e,t,n){if(Pt(i,e,t.x,t.z,t.category==="gateway"?18:22,t.category==="gateway"?14:18,n%2?"plaza":"parkPath"),t.category==="gateway")yx(i,e,t.x,t.z,n);else if(["nature","excursion","viewpoint"].includes(t.category)){if(_x(i,e,t.x,t.z,t.category==="excursion"?"caveLimestone":"treeLeaf"),t.name.includes("Putrajaya")){for(let a=t.x-12;a<=t.x+12;a+=1)for(let r=t.z+10;r<=t.z+18;r+=1)Dn(i,e,a,r,1,1,"water");Bl(i,e,t.x-8,t.z-4,1.15)}}else["food","market"].includes(t.category)?vx(i,e,t.x,t.z):["shopping","family","modern"].includes(t.category)?gx(i,e,t.x,t.z,t.category==="family"?"pavilionRed":"mallGold"):["culture","heritage"].includes(t.category)?Bl(i,e,t.x,t.z,t.name.includes("Blue Mosque")?1.3:1):va(i,e,t.x-6,t.z-5,12,10,22,"glassGreen","glassDark");yc(i,e,t.x,t.z-12,Math.min(18,Math.max(8,t.name.length*.36)),t.category==="gateway"?"gatewayPurple":"warning")}function bx(i,e,t,n){const a=e.surfaceYAt(t.x,t.z),s={skyline:"merdekaTrim",viewpoint:"lampGlow",heritage:"redBrick",culture:"templeGold",museum:"museumBrown",market:"marketRed",food:"warning",shopping:"mallGold",family:"pavilionRed",park:"treeLeaf2",nature:"treeLeaf",excursion:"caveLimestone",transit:"station",modern:"glassGreen",sports:"stationRoof",gateway:"gatewayPurple"}[t.category]??"warning",o=t.category==="gateway"?3.2:t.category==="skyline"?2.8:2.4;i.addBox(t.x,a+.16,t.z,7.4,.24,7.4,n%2?"plaza":"concrete"),i.addBox(t.x,a+2.1,t.z,.5,4.1,.5,"concreteDark"),i.addBox(t.x,a+4.5,t.z,o,o,o,s),i.addBox(t.x,a+6.2,t.z,Math.max(2.1,o*.7),.45,Math.max(2.1,o*.7),"lampGlow"),n%3===0&&(i.addBox(t.x-3.2,a+1.2,t.z+3.1,1.2,2.4,1.2,s),i.addBox(t.x+3.1,a+1.2,t.z-3.2,1.2,2.4,1.2,s))}function Sx(i,e){Xi.forEach((t,n)=>{["Petronas Twin Towers","Merdeka 118","KL Tower","Sultan Abdul Samad Building","Masjid Negara","Tugu Negara","TRX Exchange 106","Bukit Bintang","Central Market","Old Railway Station","Thean Hou Temple","National Museum"].includes(t.name)||bx(i,e,t,n)})}function Tx(i,e){[["Sunway Lagoon & Pyramid","SS15 Food Street","PJ Old Town","Section 17 Market","TTDI Market","Mutiara Damansara Curve"],["Shah Alam Blue Mosque","i-City Shah Alam","Setia City Park","Klang Little India","Pulau Ketam Ferry Gate","Morib Beach Gateway"],["Mines Lake","IOI City Mall","Putrajaya Pink Mosque","Putrajaya Bridge Promenade","Dengkil Kampung Food","KLIA Terminal Gateway"],["Titiwangsa Lake Gardens","Setapak Food Quarter","Wangsa Maju Town Centre","Batu Caves Temple Steps","Gombak Transit Gate","Kanching Falls","Rawang Waterfall Gate"],["Mont Kiara Dining Cluster","Kepong Food Row","Sungai Buloh Nursery Belt","Elmina Rainbow Bridge","Kuala Selangor Fireflies","Sasaran Sky Mirror Gate"],["Ampang Korean Village","Ulu Klang Ridge Trail","Melawati Food & Hills","Janda Baik Gateway","Bukit Tinggi Village Gate"]].map(n=>n.map(a=>Re(a,{x:0,z:0}))).forEach((n,a)=>{for(let r=0;r<n.length-1;r+=1)Gt(i,e,n[r],n[r+1],a%2?3:5)})}function Ex(i,e){const t=[-170,-128,-88,-38,12,52,92,138,178],n=[-188,-148,-108,-62,-18,38,88,132,176];t.forEach((a,r)=>Gt(i,e,{x:-208,z:a},{x:208,z:a},r%3===0?5:3)),n.forEach((a,r)=>Gt(i,e,{x:a,z:-208},{x:a,z:208},r%3===0?5:3)),Gt(i,e,Re("Kuala Selangor Fireflies",{x:-204,z:152}),Re("Damansara Arts & Cafes",{x:-148,z:42}),5),Gt(i,e,Re("Damansara Arts & Cafes",{x:-148,z:42}),Re("Mid Valley Megamall",{x:-82,z:-88}),5),Gt(i,e,Re("Mid Valley Megamall",{x:-82,z:-88}),Re("Kajang Satay Town",{x:68,z:-184}),5),Gt(i,e,Re("Kajang Satay Town",{x:68,z:-184}),Re("KLIA Terminal Gateway",{x:198,z:-106}),5),Gt(i,e,Re("Ampang Lookout Ridge",{x:126,z:18}),Re("Genting Highlands Gateway",{x:148,z:162}),5)}function wx(i,e){Ex(i,e),Tx(i,e),Xi.filter(a=>Math.abs(a.x)>96||Math.abs(a.z)>96||a.category==="gateway").forEach((a,r)=>Mx(i,e,a,r));const t=gc(20260426);[{...Re("Sunway Lagoon & Pyramid",{x:-156,z:-126}),radius:34,count:34,key:"glassGreen"},{...Re("Shah Alam Blue Mosque",{x:-184,z:-38}),radius:30,count:24,key:"concreteDark"},{...Re("Mont Kiara Dining Cluster",{x:-92,z:92}),radius:32,count:28,key:"blackGlass"},{...Re("Putrajaya Lake & Mosque",{x:132,z:-136}),radius:42,count:34,key:"mosqueWhite"},{...Re("Cyberjaya Tech Garden",{x:114,z:-168}),radius:34,count:26,key:"glass"},{...Re("Zoo Negara",{x:142,z:68}),radius:30,count:20,key:"parkPath"},{...Re("Taman Negara Gateway",{x:188,z:12}),radius:55,count:42,key:"gatewayPurple"},{...Re("Klang Royal Town",{x:-204,z:-88}),radius:26,count:18,key:"redBrick"}].map(a=>({...a,cx:a.x,cz:a.z})).forEach(a=>{for(let r=0;r<a.count;r+=1){const s=t()*Math.PI*2,o=Math.sqrt(t())*a.radius,l=Math.round(a.cx+Math.cos(s)*o),c=Math.round(a.cz+Math.sin(s)*o);if(Math.abs(l)>214||Math.abs(c)>214||vc(l,c,Xi,10))continue;const d=Cn(t,4,9),h=Cn(t,4,9),u=Cn(t,7,a.key==="blackGlass"||a.key==="glass"?34:20);va(i,e,l,c,d,h,u,a.key,a.key==="blackGlass"?"glass":"glassDark")}});for(let a=-208;a<=208;a+=24)Ln(i,e,a,204,4.5),Ln(i,e,a,-204,4.2);for(let a=-180;a<=180;a+=28)Ln(i,e,-210,a,4),Ln(i,e,210,a,4)}function Ax(i,e){Gt(i,e,{x:-88,z:-8},{x:88,z:-8},7),Gt(i,e,{x:-86,z:42},{x:86,z:42},5),Gt(i,e,{x:18,z:-84},{x:18,z:78},7),Gt(i,e,{x:-62,z:-80},{x:-62,z:78},5),Gt(i,e,{x:-42,z:-55},{x:44,z:-55},5),Gt(i,e,{x:-24,z:22},{x:46,z:22},5)}function Cx(i,e){oa(i,e,"x",-8,-84,86,13.2),oa(i,e,"z",18,-75,74,15.8),oa(i,e,"x",-128,-198,178,14.8),oa(i,e,"z",132,-188,172,15.5),oa(i,e,"x",92,-204,188,15),["Petaling Street / Chinatown","LRT / MRT Hub","KL Tower","Old Railway Station"].forEach(t=>{const{x:n,z:a}=Re(t,{x:0,z:0});Nl(i,e,n,a)}),["Sunway Lagoon & Pyramid","Shah Alam Blue Mosque","Mont Kiara Dining Cluster","Putrajaya Lake & Mosque","Cyberjaya Tech Garden","Zoo Negara","Penang George Town Gateway","Sepang / KLIA Gateway"].forEach(t=>{const{x:n,z:a}=Re(t,{x:188,z:92});Nl(i,e,n,a,"gatewayPurple")})}function Rx(i){i.background=new Xe(462879),i.fog=new so(462879,170,620);const e=new z0(i,{castShadow:!1,receiveShadow:!0}),t=e.withSection("terrain",()=>fx(e)),n=(l,c)=>e.withSection(l,c);n("parksAndWater",()=>px(e,t)),n("outerDistrictExpansion",()=>wx(e,t)),n("roads",()=>Ax(e,t)),n("transit",()=>Cx(e,t)),n("streetDetails",()=>hx(e,t)),n("tourismExpansion",()=>xx(e,t)),n("cityBuildings",()=>ux(e,t)),n("landmarkPins",()=>Sx(e,t)),n("petronas",()=>Q0(e,t)),n("merdeka118",()=>ex(e,t)),n("klTower",()=>tx(e,t)),n("sultanAbdulSamad",()=>nx(e,t)),n("nationalMosque",()=>ix(e,t)),n("nationalMonument",()=>ax(e,t)),n("exchange106",()=>rx(e,t)),n("bukitBintang",()=>sx(e,t)),n("centralMarket",()=>ox(e,t)),n("railwayStation",()=>lx(e,t)),n("theanHouTemple",()=>cx(e,t)),n("nationalMuseum",()=>dx(e,t));const a=new Tt(new uo(6,16,8),new cr({color:16770218}));a.position.set(-82,92,-110),i.add(a);const r=e.finalize(),s=Xi.map(l=>({...l,position:new C(l.x,t.surfaceYAt(l.x,l.z)+(l.category==="gateway"?2:4),l.z),visitRadius:l.category==="gateway"?9:10})),o=[{name:"Kelana Jaya inspired elevated line",label:"LRT",stations:["Subang Gateway","Pasar Seni","KLCC","Bukit Bintang Link","KL Tower","Ampang Park"],points:[pe("Subang Airport Heritage Strip",14.4,{x:-82,z:-8}),pe("Central Market",14.4,{x:-48,z:-8}),pe("Petronas Twin Towers",14.4,{x:-12,z:-8}),pe("Bukit Bintang",17,{x:18,z:22}),pe("KL Tower",14.4,{x:54,z:-8}),pe("Ampang Korean Village",14.4,{x:84,z:-8})],color:"blue"},{name:"Monorail inspired north-south line",label:"Monorail",stations:["KL Sentral","Imbi","Bukit Bintang","Titiwangsa"],points:[pe("National Museum",17,{x:18,z:-72}),pe("Jalan Alor",17,{x:18,z:-28}),pe("Bukit Bintang",17,{x:18,z:22}),pe("Titiwangsa Lake Gardens",17,{x:18,z:72})],color:"yellow"},{name:"MRT heritage loop",label:"MRT",stations:["National Museum","Merdeka","TRX","KLCC Park"],points:[pe("National Museum",14.4,{x:-58,z:-66}),pe("Merdeka 118",14.4,{x:-18,z:-42}),pe("TRX Exchange 106",14.4,{x:66,z:32}),pe("Petronas Twin Towers",14.4,{x:-12,z:22}),pe("KLCC Park",14.4,{x:-25,z:43})],color:"green"},{name:"KTM tourism gateway",label:"KTM",stations:["Old Railway Station","Batu Caves Gateway","Malaysia Highlights"],points:[pe("Old Railway Station",14.4,{x:-36,z:-58}),pe("LRT / MRT Hub",16,{x:18,z:22}),pe("Batu Caves Gateway",14.4,{x:82,z:68}),pe("Putrajaya Lake & Mosque",15.5,{x:132,z:-136}),pe("Sepang / KLIA Gateway",15.5,{x:188,z:-82})],color:"purple"},{name:"Greater KL outer ring",label:"BRT",stations:["Mont Kiara","FRIM","Kuala Selangor","Shah Alam","Sunway","Bangsar","Kajang","Putrajaya","Zoo Negara","Genting Base"],points:[pe("Mont Kiara Dining Cluster",15.2,{x:-92,z:92}),pe("FRIM Forest Reserve",15.2,{x:-138,z:128}),pe("Kuala Selangor Fireflies",15.2,{x:-204,z:152}),pe("Shah Alam Blue Mosque",15.2,{x:-184,z:-38}),pe("Sunway Lagoon & Pyramid",15.2,{x:-156,z:-126}),pe("Bangsar Village",15.2,{x:-94,z:-108}),pe("Kajang Satay Town",15.2,{x:68,z:-184}),pe("Putrajaya Lake & Mosque",15.2,{x:132,z:-136}),pe("Zoo Negara",15.2,{x:142,z:68}),pe("Genting Highlands Gateway",15.2,{x:148,z:162})],color:"green"},,{name:"PJ Subang Sunway connector",label:"Rapid",stations:["TTDI","Bandar Utama","PJ Old Town","SS15","Sunway","USJ","Puchong"],points:[pe("TTDI Market",15.2,{x:-126,z:22}),pe("1 Utama & Bandar Utama",15.2,{x:-156,z:12}),pe("PJ Old Town",15.2,{x:-122,z:-62}),pe("SS15 Food Street",15.2,{x:-136,z:-92}),pe("Sunway Lagoon & Pyramid",15.2,{x:-156,z:-126}),pe("USJ Taipan",15.2,{x:-126,z:-116}),pe("Puchong IOI Boulevard",15.2,{x:-78,z:-150})],color:"blue"},{name:"Shah Alam Klang coast connector",label:"Coast",stations:["Shah Alam","i-City","Klang Little India","Port Klang","Pulau Ketam Ferry","Morib Gate"],points:[pe("Shah Alam Blue Mosque",15.2,{x:-184,z:-38}),pe("i-City Shah Alam",15.2,{x:-176,z:-8}),pe("Klang Little India",15.2,{x:-198,z:-72}),pe("Port Klang Coastal Gate",15.2,{x:-210,z:-150}),pe("Pulau Ketam Ferry Gate",15.2,{x:-210,z:-126}),pe("Morib Beach Gateway",15.2,{x:-186,z:-198})],color:"purple"},{name:"Putrajaya KLIA south connector",label:"ERL",stations:["Mines Lake","IOI City","Putrajaya Mosque","Cyberjaya","Sepang Circuit","KLIA","Nilai"],points:[pe("Mines Lake",15.2,{x:24,z:-150}),pe("IOI City Mall",15.2,{x:88,z:-144}),pe("Putrajaya Pink Mosque",15.2,{x:124,z:-126}),pe("Cyberjaya Tech Garden",15.2,{x:114,z:-168}),pe("Sepang Circuit",15.2,{x:176,z:-116}),pe("KLIA Terminal Gateway",15.2,{x:198,z:-106}),pe("Nilai Outlet Corridor",15.2,{x:134,z:-206})],color:"yellow"},{name:"North east nature connector",label:"Green",stations:["Titiwangsa","Setapak","Wangsa Maju","Batu Caves","Gombak","Kanching","Rawang Falls"],points:[pe("Titiwangsa Lake Gardens",15.2,{x:8,z:82}),pe("Setapak Food Quarter",15.2,{x:52,z:62}),pe("Wangsa Maju Town Centre",15.2,{x:76,z:78}),pe("Batu Caves Temple Steps",15.2,{x:88,z:92}),pe("Gombak Transit Gate",15.2,{x:104,z:112}),pe("Kanching Falls",15.2,{x:18,z:176}),pe("Rawang Waterfall Gate",15.2,{x:-28,z:206})],color:"green"},{name:"Malaysia gateway spine",label:"Tour",stations:["Penang Gate","Langkawi Gate","Malacca Gate","Cameron Gate","Taman Negara Gate","Kinabalu Gate","Perhentian Gate","Putrajaya Gate","KLIA Gate"],points:[pe("Penang George Town Gateway",15,{x:188,z:92}),pe("Langkawi Gateway",15,{x:188,z:72}),pe("Malacca Gateway",15,{x:188,z:52}),pe("Cameron Highlands Gateway",15,{x:188,z:32}),pe("Taman Negara Gateway",15,{x:188,z:12}),pe("Kinabalu Gateway",15,{x:188,z:-8}),pe("Perhentian Islands Gateway",15,{x:188,z:-28}),pe("Putrajaya Gateway",15,{x:188,z:-58}),pe("Sepang / KLIA Gateway",15,{x:188,z:-82})],color:"yellow"}];return{terrain:t,palette:xc,landmarks:s,transportPaths:o,voxelStats:r,chunkManager:r.chunkManager,startPosition:new C(-38,t.surfaceYAt(-38,8)+.1,8)}}function mn(i,e,t,n){const a=new Tt(i,e);return a.position.copy(t),a.scale.copy(n),a.castShadow=!1,a.receiveShadow=!0,a}function Px(){const i=new $t;i.name="explorer-character";const e=new Bn(1,1,1),t={skin:new wt({color:14394219}),hair:new wt({color:2236457}),shirt:new wt({color:2915301}),pants:new wt({color:2042167}),shoes:new wt({color:1120295}),bag:new wt({color:16096779})},n=mn(e,t.shirt,new C(0,1.65,0),new C(.82,1.15,.46)),a=mn(e,t.skin,new C(0,2.55,0),new C(.62,.62,.62)),r=mn(e,t.hair,new C(0,2.92,-.03),new C(.67,.18,.68)),s=mn(e,t.bag,new C(0,1.65,.34),new C(.72,.86,.22)),o=new $t;o.position.set(-.62,2,0),o.add(mn(e,t.skin,new C(0,-.42,0),new C(.28,.85,.28)));const l=new $t;l.position.set(.62,2,0),l.add(mn(e,t.skin,new C(0,-.42,0),new C(.28,.85,.28)));const c=new $t;c.position.set(-.24,1.08,0),c.add(mn(e,t.pants,new C(0,-.42,0),new C(.3,.86,.32))),c.add(mn(e,t.shoes,new C(0,-.9,-.08),new C(.34,.18,.48)));const d=new $t;return d.position.set(.24,1.08,0),d.add(mn(e,t.pants,new C(0,-.42,0),new C(.3,.86,.32))),d.add(mn(e,t.shoes,new C(0,-.9,-.08),new C(.34,.18,.48))),i.add(n,a,r,s,o,l,c,d),i.userData.parts={leftArm:o,rightArm:l,leftLeg:c,rightLeg:d},i}class Lx{constructor(e,t,n){this.terrain=t,this.group=Px(),this.group.position.copy(n),this.velocity=new C,this.heading=0,this.walkTime=0,this.onGround=!0,this.keys=new Set,this.virtualKeys=new Set,this.virtualAxis=new Ue(0,0),this.enabled=!0,e.add(this.group),window.addEventListener("keydown",a=>this.handleKey(a,!0)),window.addEventListener("keyup",a=>this.handleKey(a,!1))}handleKey(e,t){const n=e.key.toLowerCase(),a={w:"forward",arrowup:"forward",s:"back",arrowdown:"back",a:"left",arrowleft:"left",d:"right",arrowright:"right",shift:"sprint"," ":"jump"}[n];a&&(["arrowup","arrowdown","arrowleft","arrowright"," "].includes(n)&&e.preventDefault(),t?this.keys.add(a):this.keys.delete(a))}setVirtualKey(e,t){t?this.virtualKeys.add(e):this.virtualKeys.delete(e)}setVirtualAxis(e=0,t=0){this.virtualAxis.set(Kn.clamp(e,-1,1),Kn.clamp(t,-1,1))}hasInput(e){return this.keys.has(e)||this.virtualKeys.has(e)}warpTo(e){const t=this.terrain.surfaceYAt(e.x,e.z);this.group.position.set(e.x,t+.05,e.z),this.velocity.set(0,0,0),this.onGround=!0}update(e,t){if(!this.enabled)return!1;const n=Number(this.hasInput("forward"))-Number(this.hasInput("back")),a=Number(this.hasInput("right"))-Number(this.hasInput("left")),r=Kn.clamp(n+this.virtualAxis.y,-1,1),s=Kn.clamp(a+this.virtualAxis.x,-1,1),o=Kn.clamp(Math.hypot(r,s),0,1),l=o>.03,c=new C;t.getWorldDirection(c),c.y=0,c.normalize();const d=new C(c.z,0,-c.x).normalize(),h=new C;h.addScaledVector(c,r),h.addScaledVector(d,s),h.lengthSq()>0&&h.normalize();const p=16*(this.hasInput("sprint")?2.05:1)*(l?o:0),g=this.group.position.clone();this.group.position.addScaledVector(h,p*e),this.terrain.clampXZ(this.group.position),l&&(this.heading=Math.atan2(h.x,h.z),this.group.rotation.y=this.heading,this.walkTime+=e*p*.9);const y=this.terrain.surfaceYAt(this.group.position.x,this.group.position.z)+.05;this.onGround&&this.hasInput("jump")&&(this.velocity.y=10.5,this.onGround=!1),this.velocity.y-=28*e,this.group.position.y+=this.velocity.y*e,this.group.position.y<=y&&(this.group.position.y=y,this.velocity.y=0,this.onGround=!0);const m=this.group.userData.parts,f=l?Math.sin(this.walkTime)*.62:0;return m.leftLeg.rotation.x=f,m.rightLeg.rotation.x=-f,m.leftArm.rotation.x=-f*.85,m.rightArm.rotation.x=f*.85,l||(this.walkTime+=e*1.3),g.distanceToSquared(this.group.position)>1e-6||l||!this.onGround}}function Dx(i,e,t,n){const a=new $t;a.name=`voxel-train-car-${n}`;const r=new Tt(i,e[t]);r.scale.set(2.2,1.8,5.2),r.position.y=.8,a.add(r);const s=new Tt(i,e.trainWhite);s.scale.set(2.35,.35,5.4),s.position.y=1.9,a.add(s);for(let l=-1.7;l<=1.7;l+=1.7){const c=new Tt(i,e.trainWindow);c.scale.set(.08,.62,1.05),c.position.set(1.14,1.05,l),a.add(c);const d=c.clone();d.position.x=-1.14,a.add(d)}const o=new Tt(i,e.trainWhite);return o.scale.set(2,1.45,.35),o.position.set(0,.82,-2.78),a.add(o),a}function Ix(i){const e=new Bn(1,1,1),t={trainBlue:new wt({color:2068205}),trainYellow:new wt({color:16238920}),trainGreen:new wt({color:3327117}),trainPurple:new wt({color:9133302}),trainWhite:new wt({color:16119802}),trainWindow:new wt({color:1254968})};return Array.from({length:4},(n,a)=>Dx(e,t,i,a))}class Ux{constructor(e,t){this.trains=[],this.stations=[],this.ride=null,this.motionEnabled=!0,this.permanentMotion=!1,this.activeUntil=performance.now()+9e3,t.forEach((n,a)=>{const r=new vh(n.points,!1,"catmullrom",.1),s=n.color==="yellow"?"trainYellow":n.color==="green"?"trainGreen":n.color==="purple"?"trainPurple":"trainBlue",o=Ix(s);o.forEach(l=>e.add(l)),this.trains.push({cars:o,curve:r,progress:a*.42,speed:a===0?.035:.027,lengthOffset:.024,name:n.name,label:n.label??n.name}),n.points.forEach((l,c)=>this.stations.push({point:l,name:n.stations?.[c]??`${n.label??"Rail"} Station ${c+1}`,routeName:n.name,label:n.label??n.name}))})}wake(e=8e3){this.activeUntil=Math.max(this.activeUntil,performance.now()+e)}togglePermanentMotion(){return this.permanentMotion=!this.permanentMotion,this.wake(12e3),this.permanentMotion}get isActive(){return this.motionEnabled&&(this.ride||this.permanentMotion||performance.now()<this.activeUntil)}findBoardingStation(e,t=12){let n=null;for(const a of this.stations){const r=Math.hypot(e.x-a.point.x,e.z-a.point.z);r<t&&(!n||r<n.distance)&&(n={...a,distance:r})}return n}startRide(e){const t=this.findBoardingStation(e,14);if(!t||this.trains.length===0)return null;const n=this.trains.find(a=>a.name===t.routeName)??this.trains[0];return this.ride={train:n,elapsed:0,duration:9,exitPoint:t.point.clone()},this.wake(12e3),this.ride}fastTravelTo(e,t){const n=this.stations.find(r=>r.name===e);if(!n)return null;const a=n.point.clone();return a.x+=4,a.z+=4,a.y=t.surfaceYAt(a.x,a.z)+.1,this.wake(5e3),a}exitRide(e){if(!this.ride)return null;const t=this.ride.train,n=(t.progress+.08)%1,r=t.curve.getPointAt(n).clone();return r.x+=5,r.z+=5,r.y=e.surfaceYAt(r.x,r.z)+.1,this.ride=null,r}update(e){if(!this.isActive)return!1;for(const t of this.trains)t.progress=(t.progress+e*t.speed)%1,t.cars.forEach((n,a)=>{const r=(t.progress-t.lengthOffset*a+1)%1,s=t.curve.getPointAt(r),o=t.curve.getPointAt((r+.006)%1);n.position.copy(s),n.lookAt(o)});return this.ride&&(this.ride.elapsed+=e,this.ride.elapsed>this.ride.duration&&(this.ride.elapsed=this.ride.duration)),!0}}class Nx{constructor(e,t=10,n=[]){this.landmarks=e,this.radius=t,this.visited=new Set(n),this.temp=new C}get count(){return this.visited.size}get total(){return this.landmarks.length}isVisited(e){return this.visited.has(e.name)}markVisited(e){const t=this.isVisited(e);return this.visited.add(e.name),!t}check(e){this.temp.copy(e),this.temp.y=0;for(const t of this.landmarks){const n=t.position;if(Math.hypot(this.temp.x-n.x,this.temp.z-n.z)<=(t.visitRadius??this.radius)&&this.markVisited(t))return t}return null}}class Fx{constructor(e,t){this.landmarks=e,this.routeId="custom",this.route=[],this.setStops(t),this.active=!1,this.index=0}setStops(e,t=this.routeId){this.routeId=t,this.route=e.map(n=>this.landmarks.find(a=>a.name===n)).filter(Boolean),this.index=0}get current(){return this.active?this.route[this.index]:null}get progressText(){return!this.active||this.route.length===0?"Off":`${this.index+1}/${this.route.length}`}start(){return this.active=!0,this.index=0,this.current}cancel(){return this.active=!1,null}toggle(){return this.active?this.cancel():this.start()}update(e,t=11){const n=this.current;if(!n)return{advanced:!1,complete:!1,destination:null,distance:0};const a=Math.hypot(e.x-n.position.x,e.z-n.position.z);return a>t?{advanced:!1,complete:!1,destination:n,distance:a}:(this.index+=1,this.index>=this.route.length?(this.active=!1,{advanced:!0,complete:!0,destination:n,distance:a}):{advanced:!0,complete:!1,destination:this.current,distance:0})}}function $r(i,e,t){const n=new Tt(new Bn(1,1,1),i);return n.scale.copy(e),n.position.copy(t),n}class Bx{constructor(e,t){this.actors=[],this.activeUntil=performance.now()+1e4;const n={taxi:new wt({color:16238920}),car:new wt({color:2915301}),pedestrian:new wt({color:16743252}),window:new wt({color:1254968})};[[new C(-78,0,-8),new C(78,0,-8)],[new C(18,0,-72),new C(18,0,70)],[new C(-72,0,42),new C(78,0,42)]].forEach((r,s)=>{for(let o=0;o<3;o+=1){const l=new $t,c=(o+s)%2?"taxi":"car";l.add($r(n[c],new C(1.4,.65,2.2),new C(0,.45,0))),l.add($r(n.window,new C(1,.35,1),new C(0,.95,-.2))),e.add(l),this.actors.push({group:l,points:r,progress:(o/3+s*.17)%1,speed:.028+o*.004,terrain:t})}}),[[-6,-55],[-48,-32],[-12,38],[35,30],[56,-18]].forEach(([r,s],o)=>{const l=new $t;l.add($r(n.pedestrian,new C(.45,1.2,.45),new C(0,.6,0))),e.add(l),this.actors.push({group:l,points:[new C(r-4,0,s),new C(r+4,0,s+2)],progress:o*.21,speed:.015,terrain:t})})}wake(e=8e3){this.activeUntil=Math.max(this.activeUntil,performance.now()+e)}get isActive(){return performance.now()<this.activeUntil}update(e){if(!this.isActive)return!1;for(const t of this.actors){t.progress=(t.progress+e*t.speed)%1;const n=t.progress<.5?t.progress*2:(1-t.progress)*2,a=t.points[0],r=t.points[1],s=Kn.lerp(a.x,r.x,n),o=Kn.lerp(a.z,r.z,n),l=t.terrain.surfaceYAt(s,o)+.12;t.group.position.set(s,l,o),t.group.lookAt(r.x,l,r.z),t.progress>=.5&&t.group.rotateY(Math.PI)}return!0}}function kx({landmarks:i,player:e,trainSystem:t,requestRender:n,focusLandmark:a,refocusPlayer:r,setCameraMode:s,toggleTour:o,cycleTimeMode:l,boardTrain:c,tourismContent:d,routes:h,questSystem:u,saveSystem:p,setRoute:g,fastTravel:y,resetProgress:m}){const f=document.getElementById("fps"),E=document.getElementById("pixel-ratio"),T=document.getElementById("voxel-count"),w=document.getElementById("stamp-count"),L=document.getElementById("tour-state"),S=document.getElementById("tour-next"),R=document.getElementById("render-state"),B=document.getElementById("landmark-buttons"),M=document.getElementById("toast"),_=document.getElementById("touch-joystick"),D=document.getElementById("touch-stick"),F=new Map,z=document.getElementById("btn-board-train"),K=document.getElementById("route-selector"),X=document.getElementById("station-selector"),Y=document.getElementById("guidebook-panel"),ee=document.getElementById("quest-panel"),W=document.getElementById("tips-panel"),ie=document.getElementById("guidebook-title"),re=document.getElementById("guidebook-note"),be=document.getElementById("guidebook-details"),He=document.getElementById("highlight-list"),$e=document.getElementById("quest-list"),Qe=document.getElementById("tips-list");i.forEach(G=>{const J=document.createElement("button");J.type="button",J.textContent=G.name.replace("Petronas Twin Towers","Petronas").replace("National ",""),J.title=G.name,J.addEventListener("click",()=>{a(G),Me(G),qe(`Focused: ${G.name}`)}),F.set(G.name,J),B.appendChild(J)});const Ze=G=>{G&&(G.addEventListener("touchstart",J=>J.preventDefault(),{passive:!1}),G.addEventListener("touchmove",J=>J.preventDefault(),{passive:!1}))},j=(G,J,{toastOnDown:b}={})=>{const x=document.getElementById(G);if(!x)return;const N=q=>{q.preventDefault(),x.setPointerCapture?.(q.pointerId),x.classList.add("is-active"),e.setVirtualKey(J,!0),t.wake(),b&&qe(b),n()},V=q=>{q.preventDefault(),x.releasePointerCapture?.(q.pointerId),x.classList.remove("is-active"),e.setVirtualKey(J,!1),n()};x.addEventListener("pointerdown",N),x.addEventListener("pointerup",V),x.addEventListener("pointercancel",V),x.addEventListener("lostpointercapture",V),Ze(x)},$=(G,J)=>{const b=document.getElementById(G);b&&(b.addEventListener("pointerdown",x=>{x.preventDefault(),b.classList.add("is-active"),J(),n()}),b.addEventListener("pointerup",()=>b.classList.remove("is-active")),b.addEventListener("pointercancel",()=>b.classList.remove("is-active")),Ze(b))};j("btn-touch-jump","jump"),j("btn-touch-sprint","sprint",{toastOnDown:"Sprint held. Push the left thumb-stick to run."}),$("btn-touch-focus",()=>{r?.(),qe("Camera refocused on the explorer.")}),$("btn-touch-trains",()=>{const G=t.togglePermanentMotion();qe(G?"Continuous train motion enabled.":"Train motion now auto-pauses when idle.")}),$("btn-camera-walk",()=>s?.("walk")),$("btn-camera-landmark",()=>s?.("landmark")),$("btn-camera-skyline",()=>s?.("skyline")),$("btn-tour",()=>o?.()),$("btn-time",()=>l?.()),$("btn-board-train",()=>c?.()),$("btn-guidebook",()=>fe(Y)),$("btn-quests",()=>{Be(),fe(ee)}),$("btn-tips",()=>fe(W)),$("btn-save-now",()=>{p?.persist(),qe("Progress saved on this device.")}),$("btn-reset-progress",()=>{m?.(),qe("Progress reset.")}),h?.forEach(G=>{const J=document.createElement("option");J.value=G.id,J.textContent=G.name,K.appendChild(J)}),p?.data.activeRoute&&(K.value=p.data.activeRoute),K.addEventListener("change",()=>{g?.(K.value),n()}),t.stations.forEach(G=>{const J=document.createElement("option");J.value=G.name,J.textContent=`${G.label}: ${G.name}`,X.appendChild(J)}),X.addEventListener("change",()=>{y?.(X.value),n()});function fe(G){if(!G)return;const J=!G.hidden;[Y,ee,W].forEach(b=>{b&&b!==G&&window.matchMedia("(max-width: 860px)").matches&&(b.hidden=!0)}),G.hidden=J,n()}function De(G){G&&(G.hidden=!0,n())}[Y,ee,W].forEach(G=>{G?.addEventListener("pointerdown",J=>J.stopPropagation())}),document.querySelectorAll("[data-close-panel]").forEach(G=>{G.addEventListener("click",()=>De(document.getElementById(G.dataset.closePanel)))}),document.querySelectorAll("[data-collapse-panel]").forEach(G=>{const J=document.getElementById(G.dataset.collapsePanel);J&&G.addEventListener("click",b=>{b.stopPropagation();const x=J.classList.toggle("is-collapsed");G.textContent=x?"+":"−",G.setAttribute("aria-label",x?`Restore ${J.id}`:`Minimize ${J.id}`),n()})}),window.addEventListener("keydown",G=>{G.key==="Escape"&&[Y,ee,W].forEach(De)});function Me(G){G&&(ie.textContent=G.name,re.textContent=G.note??"Tourism stop in the stylized KL guide.",be.innerHTML="",[["District",G.district],["Best time",G.bestTime],["Category",G.category],["Tip",G.tip]].forEach(([J,b])=>{const x=document.createElement("dt");x.textContent=J;const N=document.createElement("dd");N.textContent=b??"-",be.append(x,N)}),He.innerHTML="",d?.zones?.forEach(J=>{const b=document.createElement("p");b.textContent=`${J.name}: ${J.summary}`,He.appendChild(b)}))}function Be(){$e.innerHTML="",u?.summaries().forEach(G=>{const J=document.createElement("p");J.className=G.complete?"is-complete":"",J.textContent=`${G.complete?"Done":`${G.progress}/${G.target}`} · ${G.name}: ${G.description}`,$e.appendChild(J)})}function _t(){Qe.innerHTML="",[...d?.tips??[],...d?.facts??[],...(d?.glossary??[]).map(G=>`${G.term}: ${G.meaning}`)].forEach(G=>{const J=document.createElement("p");J.textContent=G,Qe.appendChild(J)})}if(Me(i[0]),_t(),_&&D){let J=null,b={x:0,y:0};const x=(V,q)=>{const H=Math.hypot(V,q),ye=H>46?46/H:1,le=V*ye,Se=q*ye,ve=le/46,Q=-Se/46;D.style.transform=`translate(calc(-50% + ${le}px), calc(-50% + ${Se}px))`,e.setVirtualAxis(ve,Q),t.wake(),n()},N=()=>{J=null,D.style.transform="translate(-50%, -50%)",e.setVirtualAxis(0,0),_.classList.remove("is-active"),n()};_.addEventListener("pointerdown",V=>{V.preventDefault(),J=V.pointerId,_.setPointerCapture?.(V.pointerId);const q=_.getBoundingClientRect();b={x:q.left+q.width/2,y:q.top+q.height/2},_.classList.add("is-active"),x(V.clientX-b.x,V.clientY-b.y)}),_.addEventListener("pointermove",V=>{V.pointerId===J&&(V.preventDefault(),x(V.clientX-b.x,V.clientY-b.y))}),_.addEventListener("pointerup",V=>{V.pointerId===J&&(V.preventDefault(),_.releasePointerCapture?.(V.pointerId),N())}),_.addEventListener("pointercancel",N),_.addEventListener("lostpointercapture",N),Ze(_)}let ke=0;function qe(G){M.textContent=G,M.style.opacity="1",clearTimeout(ke),ke=setTimeout(()=>{M.style.opacity="0.75"},2200)}function A(G){T.textContent=G.total.toLocaleString()}function Ge(G){w.textContent=`${G.count}/${G.total}`,i.forEach(J=>{F.get(J.name)?.classList.toggle("is-visited",G.isVisited(J))}),Be()}function Ve({active:G,nextName:J,distance:b,progressText:x}){const N=document.getElementById("btn-tour");N.textContent=G?"Cancel Tour":"Start KL Tour",L.textContent=x??"Off",S.textContent=G&&J?`Next destination: ${J} · ${Math.round(b)}m`:"Next destination: none"}function et(G){document.getElementById("btn-time").textContent=G}function xe(G){z.hidden=!G}function ot({fps:G,pixelRatio:J,running:b,trainsActive:x}){f.textContent=G>0?String(Math.round(G)):"--",E.textContent=`${J.toFixed(2)}x`,R.textContent=b?x?"Active + transit":"Active":"Paused"}return{setVoxelStats:A,setProgress:Ge,setTour:Ve,setTimeMode:et,setBoardTrainAvailable:xe,update:ot,showToast:qe,setGuidebook:Me,renderQuests:Be}}function Ox({canvas:i,terrain:e,landmarks:t,player:n,onLandmarkClick:a}){const r=i.getContext("2d");let s=180;const o=Math.min(window.devicePixelRatio||1,2),l=[];function c(){return window.matchMedia("(max-width: 460px)").matches?86:window.matchMedia("(pointer: coarse), (max-width: 860px)").matches?120:180}function d(){s=c(),i.width=s*o,i.height=s*o,i.style.width=`${s}px`,i.style.height=`${s}px`,r.setTransform(o,0,0,o,0,0)}function h(p){const g=e.max-e.min;return{x:(p.x-e.min)/g*s,y:(p.z-e.min)/g*s}}function u({nextLandmark:p,visited:g}){l.length=0,r.clearRect(0,0,s,s),r.fillStyle="rgba(5, 12, 24, 0.72)",r.fillRect(0,0,s,s),r.strokeStyle="rgba(255,255,255,0.12)",r.lineWidth=1;for(let m=0;m<=4;m+=1){const f=m/4*s;r.beginPath(),r.moveTo(f,0),r.lineTo(f,s),r.moveTo(0,f),r.lineTo(s,f),r.stroke()}for(const m of t){const f=h(m.position),E=p?.name===m.name;l.push({landmark:m,x:f.x,y:f.y}),r.fillStyle=g?.(m)?"#ffd166":"#68e1fd",r.strokeStyle=E?"#ffffff":"rgba(0,0,0,0.45)",r.lineWidth=E?3:1,r.beginPath(),r.arc(f.x,f.y,E?5.5:3.8,0,Math.PI*2),r.fill(),r.stroke()}const y=h(n.group.position);r.save(),r.translate(y.x,y.y),r.rotate(n.heading),r.fillStyle="#ffffff",r.beginPath(),r.moveTo(0,-8),r.lineTo(5,6),r.lineTo(0,3),r.lineTo(-5,6),r.closePath(),r.fill(),r.restore(),r.fillStyle="rgba(255,255,255,0.82)",r.font="700 11px system-ui, sans-serif",r.fillText("N",s-17,16)}return i.addEventListener("pointerdown",p=>{const g=i.getBoundingClientRect(),y=p.clientX-g.left,m=p.clientY-g.top,f=l.find(E=>Math.hypot(E.x-y,E.y-m)<10);f&&a?.(f.landmark)}),d(),window.addEventListener("resize",d),{draw:u}}const zx=[{id:"classic",name:"Classic KL",caption:"Greetings from Kuala Lumpur."},{id:"heritage",name:"Heritage Walk",caption:"Layers of rivers, markets, mosques, and old civic streets."},{id:"food",name:"Food Trail",caption:"Street grills, market colors, and late-night Jalan Alor energy."},{id:"rainy",name:"Monsoon Mood",caption:"Wet roads and tower lights after tropical rain."},{id:"malaysia",name:"Malaysia Highlights",caption:"KL as a launchpad for islands, highlands, rainforest, and Borneo."}];function Gx(i,e="Day"){const t=i?.name??"Kuala Lumpur";return e==="Rain"||e==="Thunderstorm"?`${t} after rain, with roads glowing under city lights.`:e==="Night"?`${t} at night in the tourism city map.`:`${t}, captured from the voxel tourism guide.`}function Vx({renderer:i,scene:e,camera:t,controls:n,hudRoot:a,landmarks:r,postcards:s,getCurrentLandmark:o,getTimeMode:l,applyPreset:c,requestRender:d,showToast:h,onCapture:u}){const p=document.getElementById("photo-mode"),g=document.getElementById("btn-photo-mode"),y=document.getElementById("btn-photo-exit"),m=document.getElementById("btn-photo-shot"),f=document.getElementById("photo-fov"),E=document.getElementById("photo-presets"),T=document.getElementById("postcard-template"),w=document.getElementById("postcard-caption");let L=!1;["Skyline","Petronas","Merdeka","KL Tower","Tour Poster"].forEach(M=>{const _=document.createElement("button");_.type="button",_.textContent=M,_.addEventListener("click",()=>{const D=r.find(F=>F.name.includes(M.replace("KL Tower","KL Tower").replace("Merdeka","Merdeka 118")));c(M,D),h(`Photo preset: ${M}`),d()}),E.appendChild(_)}),s?.forEach(M=>{const _=document.createElement("option");_.value=M.id,_.textContent=M.name,T.appendChild(_)});function R(){const M=s?.find(_=>_.id===T.value);w.textContent=M?.caption??Gx(o?.(),l?.())}T.addEventListener("change",R),R();function B(M){L=M,p.hidden=!L,a.classList.toggle("is-photo-clean",L),h(L?"Photo mode enabled.":"Photo mode closed."),d()}return g.addEventListener("click",()=>B(!0)),y.addEventListener("click",()=>B(!1)),f.addEventListener("input",()=>{t.fov=Number(f.value),t.updateProjectionMatrix(),d()}),m.addEventListener("click",()=>{n.update(),i.render(e,t);const M=i.domElement.toDataURL("image/png"),_=document.createElement("a");_.href=M,_.download=`voxel-kl-${Date.now()}.png`,"download"in _?_.click():window.open(M,"_blank","noopener"),u?.({postcardId:T.value,caption:w.textContent}),h(`Postcard captured: ${w.textContent}`)}),{setActive:B,get active(){return L}}}const ya=[{id:"first-timer-kl",name:"First Timer KL",stops:["Petronas Twin Towers","KLCC Park","KL Tower","Merdeka Square","Petaling Street / Chinatown","Jalan Alor"],summary:"A compact introduction to skyline, heritage, and food."},{id:"heritage-trail",name:"Heritage Trail",stops:["Merdeka Square","Sultan Abdul Samad Building","Royal Selangor Club","Masjid Jamek / River of Life","Central Market","Petaling Street / Chinatown","Old Railway Station"],summary:"Colonial core, river history, markets, and old rail architecture."},{id:"food-night-market",name:"Food & Night Market",stops:["Kampung Baru","Chow Kit Market","Petaling Street / Chinatown","Jalan Alor","Bukit Bintang"],summary:"Markets, street food, and evening city energy."},{id:"garden-museum",name:"Garden & Museum",stops:["Masjid Negara","Islamic Arts Museum","National Planetarium","Lake Gardens","Tugu Negara","National Museum"],summary:"Indoor culture stops and green paths for a slower day."},{id:"skyline-modern-kl",name:"Skyline Modern KL",stops:["Petronas Twin Towers","KLCC Park","Pavilion KL","TRX Exchange 106","Merdeka 118","KL Tower"],summary:"Towers, malls, and modern city viewpoints."},{id:"greater-kl-megaloop",name:"Greater KL Mega Loop",stops:["Petronas Twin Towers","Mont Kiara Dining Cluster","FRIM Forest Reserve","Kuala Selangor Fireflies","Shah Alam Blue Mosque","Sunway Lagoon & Pyramid","Putrajaya Lake & Mosque","Zoo Negara","Genting Highlands Gateway"],summary:"A huge ring route through satellite districts, nature, family parks, and day-trip edges."},{id:"food-suburbs",name:"Food Suburbs",stops:["Kampung Baru","Bangsar Village","Mid Valley Megamall","Klang Royal Town","Kajang Satay Town","Jalan Alor"],summary:"Local food districts beyond the old compact tourist triangle."},{id:"nature-highlands",name:"Nature & Highlands",stops:["Lake Gardens","FRIM Forest Reserve","Rawang Forest Gateway","Genting Highlands Gateway","Zoo Negara","Broga Hill Sunrise","Kuala Selangor Fireflies"],summary:"A green outer-map itinerary for forests, hills, wildlife, and cooler air."},{id:"pj-subang-sunway",name:"PJ / Subang / Sunway",stops:["TTDI Market","1 Utama & Bandar Utama","PJ Old Town","Section 17 Market","SS15 Food Street","Sunway Lagoon & Pyramid","USJ Taipan"],summary:"A dense west-side suburban food, mall, and family-attraction loop."},{id:"shah-alam-klang-coast",name:"Shah Alam / Klang / Coast",stops:["Shah Alam Blue Mosque","i-City Shah Alam","Sultan Alam Shah Museum","Klang Royal Town","Klang Little India","Port Klang Coastal Gate","Pulau Ketam Ferry Gate","Morib Beach Gateway"],summary:"Blue Mosque, royal Klang, coastal gateways, ferry points, and local food."},{id:"putrajaya-airport-south",name:"Putrajaya / Airport / South",stops:["IOI City Mall","Putrajaya Pink Mosque","Putrajaya Lake & Mosque","Putrajaya Bridge Promenade","Cyberjaya Tech Garden","Dengkil Kampung Food","Sepang Circuit","KLIA Terminal Gateway","Kajang Satay Town"],summary:"Civic lakefront, Cyberjaya, KLIA, Sepang, and south-corridor food."},{id:"north-east-nature-ring",name:"North-East Nature Ring",stops:["Titiwangsa Lake Gardens","Setapak Food Quarter","Wangsa Maju Town Centre","Zoo Negara","Batu Caves Temple Steps","Gombak Transit Gate","Templer Park","Kanching Falls","Rawang Waterfall Gate"],summary:"Lake views, local food, Batu Caves, waterfalls, and forest gateways."},{id:"central-hidden-gems",name:"Central Hidden Gems",stops:["Saloma Bridge","Kampung Baru","RexKL","Petaling Street / Chinatown","Masjid Jamek / River of Life","Sentul Depot","Titiwangsa Lake Gardens","Publika Arts Mall"],summary:"Useful central additions beyond the standard tower-and-market circuit."},{id:"malaysia-highlights",name:"Malaysia Highlights",stops:["Penang George Town Gateway","Langkawi Gateway","Malacca Gateway","Cameron Highlands Gateway","Taman Negara Gateway","Kinabalu Gateway","Perhentian Islands Gateway","Putrajaya Gateway","Sepang / KLIA Gateway"],summary:"Gateway pads for planning beyond Kuala Lumpur."}],Hx=[{id:"welcome-walk",name:"Welcome Walk",description:"Collect any 5 landmark stamps.",type:"visitCount",target:5},{id:"heritage-steps",name:"Heritage Steps",description:"Visit 5 heritage or culture stops.",type:"tagVisits",tags:["heritage","history","mosque","temple","architecture"],target:5},{id:"food-scout",name:"Food Scout",description:"Visit 3 food or market places.",type:"tagVisits",tags:["food","market","night market","wet market"],target:3},{id:"rail-rider",name:"Rail Rider",description:"Take 2 train rides.",type:"trainRides",target:2},{id:"postcard-starter",name:"Postcard Starter",description:"Capture 3 postcards.",type:"photos",target:3},{id:"weather-watcher",name:"Weather Watcher",description:"Try Rain or Thunderstorm mode.",type:"weather",modes:["Rain","Thunderstorm"],target:1},{id:"malaysia-planner",name:"Malaysia Planner",description:"Visit 4 Malaysia highlight gateway pads.",type:"districtVisits",district:"Malaysia Highlights",target:4}],Wx=[{id:"kl-completist",name:"KL Completist",description:"Collect 20 stamps."},{id:"route-finisher",name:"Route Finisher",description:"Complete any guided route."},{id:"night-photographer",name:"Night Photographer",description:"Take a postcard in Night, Rain, or Thunderstorm mode."}],Zr="voxel-kl-tourism-save-v2",Mc=2,Xx={version:Mc,visited:[],completedQuests:[],unlockedPostcards:["classic"],activeRoute:"first-timer-kl",timeMode:"Day",trainRides:0,photoCaptures:0,weatherModes:[],completedRoutes:[],updatedAt:0};function la(){return{...Xx,visited:[],completedQuests:[],unlockedPostcards:["classic"],weatherModes:[],completedRoutes:[]}}class Kx{constructor(e=window.localStorage){this.storage=e,this.data=this.load()}load(){try{const e=this.storage?.getItem(Zr);if(!e)return la();const t=JSON.parse(e);return!t||t.version!==Mc?la():{...la(),...t}}catch{return la()}}persist(){this.data.updatedAt=Date.now();try{this.storage?.setItem(Zr,JSON.stringify(this.data))}catch{}}reset(){this.data=la();try{this.storage?.removeItem(Zr)}catch{}}setActiveRoute(e){this.data.activeRoute=e,this.persist()}setTimeMode(e){this.data.timeMode=e,this.data.weatherModes.includes(e)||this.data.weatherModes.push(e),this.persist()}markVisited(e){return this.data.visited.includes(e)?!1:(this.data.visited.push(e),this.persist(),!0)}completeQuest(e){return this.data.completedQuests.includes(e)?!1:(this.data.completedQuests.push(e),this.persist(),!0)}unlockPostcard(e){return this.data.unlockedPostcards.includes(e)?!1:(this.data.unlockedPostcards.push(e),this.persist(),!0)}addTrainRide(e){this.data.trainRides+=1,this.data.lastTrainRoute=e,this.persist()}addPhotoCapture({postcardId:e,timeMode:t}){this.data.photoCaptures+=1,e&&this.unlockPostcard(e),["Night","Rain","Thunderstorm"].includes(t)&&(this.data.nightPhoto=!0),this.persist()}completeRoute(e){return this.data.completedRoutes.includes(e)?!1:(this.data.completedRoutes.push(e),this.persist(),!0)}}class qx{constructor(e,t,n,a){this.quests=e,this.achievements=t,this.saveSystem=n,this.landmarks=a,this.completedAchievements=new Set}get visitedLandmarks(){const e=new Set(this.saveSystem.data.visited);return this.landmarks.filter(t=>e.has(t.name))}progressFor(e){const t=this.visitedLandmarks;if(e.type==="visitCount")return Math.min(t.length,e.target);if(e.type==="trainRides")return Math.min(this.saveSystem.data.trainRides,e.target);if(e.type==="photos")return Math.min(this.saveSystem.data.photoCaptures,e.target);if(e.type==="weather")return this.saveSystem.data.weatherModes.some(n=>e.modes.includes(n))?1:0;if(e.type==="districtVisits")return Math.min(t.filter(n=>n.district===e.district).length,e.target);if(e.type==="tagVisits"){const n=t.filter(a=>a.tags?.some(r=>e.tags.includes(r))||e.tags.includes(a.category)).length;return Math.min(n,e.target)}return 0}evaluate(){const e=[];for(const t of this.quests)this.saveSystem.data.completedQuests.includes(t.id)||this.progressFor(t)>=t.target&&this.saveSystem.completeQuest(t.id)&&e.push(t);for(const t of this.achievements)t.id==="kl-completist"&&this.saveSystem.data.visited.length>=20&&this.completedAchievements.add(t.id),t.id==="route-finisher"&&this.saveSystem.data.completedRoutes.length>0&&this.completedAchievements.add(t.id),t.id==="night-photographer"&&this.saveSystem.data.nightPhoto&&this.completedAchievements.add(t.id);return e}summaries(){return this.quests.map(e=>({...e,progress:this.progressFor(e),complete:this.saveSystem.data.completedQuests.includes(e.id)}))}}function Yx(i="chunks/metadata.json",e=globalThis.location?.href){return e?new URL(i,e).toString():i}async function jx(i={}){const e=i.fetcher??globalThis.fetch?.bind(globalThis);if(!e)return null;const t=i.url??Yx(i.path??"chunks/metadata.json",i.baseUrl),n=await e(t,{cache:i.cache??"force-cache"});if(!n.ok)throw new Error(`Failed to load static chunk manifest: ${n.status} ${t}`);const a=await n.json();if(!a||!Array.isArray(a.chunks))throw new Error("Invalid static chunk manifest: chunks array missing");return a}const $x=document.getElementById("game-canvas"),hi=new L0($x),Wt=new hh,Vt=new nn(64,window.innerWidth/window.innerHeight,.1,1800),bc=new bh(14544639,2437663,1.7);Wt.add(bc);const Sc=new wh(16777215,.38);Wt.add(Sc);const mo=new Eh(16774095,2.6);mo.position.set(-55,96,-75);Wt.add(mo);const Je=Rx(Wt),xt=new Lx(Wt,Je.terrain,Je.startPosition),yt=new Ux(Wt,Je.transportPaths),Tc=new Bx(Wt,Je.terrain),Qt=new Kx,$n=new Nx(Je.landmarks,10,Qt.data.visited),Ec=ya.find(i=>i.id===Qt.data.activeRoute)??ya[0],un=new Fx(Je.landmarks,Ec.stops);un.routeId=Ec.id;const Ji=new qx(Hx,Wx,Qt,Je.landmarks);Vt.position.copy(Je.startPosition).add(new C(22,18,24));Vt.lookAt(xt.group.position);const ct=new _0(Vt,hi.domElement);ct.enableDamping=!0;ct.dampingFactor=.08;ct.enablePan=!1;ct.minDistance=7;ct.maxDistance=520;ct.maxPolarAngle=Math.PI*.495;ct.target.copy(xt.group.position).add(new C(0,2,0));ct.update();let rr=!1,er=!0,Xs=performance.now(),Jr=0,Qr=0,es=performance.now(),xo=ct.target.clone(),sr=Je.landmarks[0],Nn=0,Ks=!1;const Qn=["Day","Golden Hour","Sunset","Night","Rain","Thunderstorm"];Nn=Math.max(0,Qn.indexOf(Qt.data.timeMode));const or=new Tt(new co(3.2,10,4),new cr({color:16765286,transparent:!0,opacity:.52}));or.visible=!1;Wt.add(or);const wc=new sn,go=360,tr=new Float32Array(go*3);for(let i=0;i<go;i+=1)tr[i*3]=Je.terrain.min+Math.random()*Je.terrain.size,tr[i*3+1]=18+Math.random()*95,tr[i*3+2]=Je.terrain.min+Math.random()*Je.terrain.size;wc.setAttribute("position",new rn(tr,3));const qn=new gh(wc,new rc({color:11130879,size:.24,transparent:!0,opacity:.62}));qn.visible=!1;Wt.add(qn);function At(){er=!0,yt.wake(4500),Tc.wake(4500),rr||(rr=!0,Xs=performance.now(),requestAnimationFrame(Rc))}function Ki(i,e=44){ct.target.copy(i),xo.copy(i),Vt.position.copy(i).add(new C(e,e*.72,e)),Vt.lookAt(i),ct.update()}function Oi(i,e=sr){const t=xt.group.position.clone().add(new C(0,2,0));if(i==="walk")Ki(t,22),Ke?.showToast("Walk camera.");else if(i==="landmark"){const n=e?.position?.clone()??t;Ki(n,58),Ke?.showToast("Landmark camera.")}else{const n=new C(0,30,0);ct.target.copy(n),xo.copy(n),Vt.position.set(310,260,325),Vt.lookAt(n),ct.update(),Ke?.showToast("Skyline overview.")}At()}function Ac(i){sr=i;const e=i.position.clone(),t=new C(8,0,8);xt.warpTo(e.clone().add(t)),$n.markVisited(i),Qt.markVisited(i.name),Ji.evaluate().forEach(n=>Ke?.showToast(`Quest complete: ${n.name}`)),Ke?.setProgress($n),Ke?.setGuidebook(i),Ki(e,58),At()}function fr(i={}){const e=un.current,t=e?Math.hypot(xt.group.position.x-e.position.x,xt.group.position.z-e.position.z):0;Ke.setTour({active:un.active,nextName:e?.name,distance:i.distance??t,progressText:un.progressText}),or.visible=!!e,e&&or.position.set(e.position.x,e.position.y+18+Math.sin(performance.now()/280)*2,e.position.z)}function Zx(i){const e=ya.find(t=>t.id===i)??ya[0];un.setStops(e.stops,e.id),Qt.setActiveRoute(e.id),fr(),Ke?.showToast(`Route selected: ${e.name}`)}function Jx(){const i=un.toggle();fr(),Ke.showToast(i?`KL Tour started: ${i.name}`:"KL Tour cancelled.")}function Cc(i){const e={Day:{bg:462879,fog:462879,hemi:1.7,ambient:.38,sun:2.6,exposure:1.05,wet:!1,rain:!1},"Golden Hour":{bg:1712432,fog:3813696,hemi:1.5,ambient:.44,sun:2.4,exposure:1.08,wet:!1,rain:!1},Sunset:{bg:2364458,fog:3744571,hemi:1.35,ambient:.48,sun:2.2,exposure:1.08,wet:!1,rain:!1},Night:{bg:198420,fog:329750,hemi:.72,ambient:.62,sun:.55,exposure:1.18,wet:!1,rain:!1},Rain:{bg:462879,fog:1780534,hemi:1,ambient:.58,sun:.8,exposure:1.1,wet:!0,rain:!0},Thunderstorm:{bg:132881,fog:1121322,hemi:.78,ambient:.7,sun:.35,exposure:1.2,wet:!0,rain:!0}}[i];Wt.background.setHex(e.bg),Wt.fog.color.setHex(e.fog),bc.intensity=e.hemi,Sc.intensity=e.ambient,mo.intensity=e.sun,hi.renderer.toneMappingExposure=e.exposure,Wt.traverse(t=>{if(!t.isInstancedMesh||!t.name.includes("voxels_"))return;const n=t.userData.voxelMaterialKey??t.name.replace("voxels_","").split("_chunk_")[0];["glassDark","blackGlass","trainWindow","lampGlow"].includes(n)?t.material.color.setHex(i==="Night"?16765286:Je.palette[n]):n==="road"?t.material.color.setHex(e.wet?1186341:Je.palette[n]):Je.palette[n]&&t.material.color.setHex(Je.palette[n])}),qn.visible=e.rain,Qt.setTimeMode(i),Ji.evaluate().forEach(t=>Ke?.showToast(`Quest complete: ${t.name}`)),Ke?.setTimeMode(i),At()}function Qx(){Nn=(Nn+1)%Qn.length;const i=Qn[Nn];Cc(i),Ke.showToast(`${i} mode.`)}function _o(){if(yt.ride){const i=yt.exitRide(Je.terrain);xt.enabled=!0,ct.enabled=!0,i&&xt.warpTo(i),Ke.showToast("Exited train."),At();return}yt.startRide(xt.group.position)&&(Qt.addTrainRide(yt.ride.train.name),Ji.evaluate().forEach(i=>Ke?.showToast(`Quest complete: ${i.name}`)),xt.enabled=!1,ct.enabled=!1,Ke.showToast("Boarded train cinematic. Press E or Exit to leave."),At())}const Ke=kx({landmarks:Je.landmarks,player:xt,trainSystem:yt,requestRender:At,focusLandmark:Ac,refocusPlayer:()=>Ki(xt.group.position.clone().add(new C(0,2,0)),34),setCameraMode:Oi,toggleTour:Jx,cycleTimeMode:Qx,boardTrain:_o,tourismContent:{zones:K0,tips:q0,facts:Y0,glossary:j0},routes:ya,questSystem:Ji,saveSystem:Qt,setRoute:Zx,fastTravel:i=>{const e=yt.fastTravelTo(i,Je.terrain);e&&(xt.warpTo(e),Ki(e.clone().add(new C(0,2,0)),34),Ke.showToast(`Fast travel: ${i}`))},resetProgress:()=>{Qt.reset(),$n.visited.clear(),Ke.setProgress($n),Ke.renderQuests()}});Ke.setVoxelStats(Je.voxelStats);Ke.setProgress($n);fr();Ke.setTimeMode(Qn[Nn]);Cc(Qn[Nn]);Ke.showToast("Explore Kuala Lumpur: WASD to move, touch joystick on mobile, routes and guidebook in panels.");jx().then(i=>{i&&(Je.staticChunkManifest=i,console.info(`Static chunk manifest ready: ${i.chunks.length} chunks / ${i.totalInstances.toLocaleString()} instances`))}).catch(i=>{console.info("Static chunk manifest not available yet; using bundled world.",i.message)});const eg=Ox({canvas:document.getElementById("mini-map"),terrain:Je.terrain,landmarks:Je.landmarks,player:xt,onLandmarkClick:Ac});Vx({renderer:hi.renderer,scene:Wt,camera:Vt,controls:ct,hudRoot:document.getElementById("app"),landmarks:Je.landmarks,postcards:zx,getCurrentLandmark:()=>sr,getTimeMode:()=>Qn[Nn],applyPreset:(i,e)=>{i==="Skyline"||i==="Tour Poster"?Oi("skyline"):Oi("landmark",e??sr)},requestRender:At,showToast:Ke.showToast,onCapture:({postcardId:i})=>{Qt.addPhotoCapture({postcardId:i,timeMode:Qn[Nn]}),Ji.evaluate().forEach(e=>Ke.showToast(`Quest complete: ${e.name}`)),Ke.renderQuests()}});function tg(){const i=xt.group.position.clone().add(new C(0,2.05,0)),e=ct.target.clone();ct.target.lerp(i,.24);const t=ct.target.clone().sub(e);Vt.position.add(t),xo.copy(ct.target)}function Rc(i){if(document.hidden){rr=!1;return}const e=Math.min(.05,Math.max(.001,(i-Xs)/1e3));Xs=i;const t=xt.update(e,Vt);t&&tg();const n=yt.update(e),a=Tc.update(e);if(qn.visible){const h=qn.geometry.attributes.position.array;for(let u=0;u<go;u+=1)h[u*3+1]-=e*(Qn[Nn]==="Thunderstorm"?46:30),h[u*3+1]<4&&(h[u*3]=Je.terrain.min+Math.random()*Je.terrain.size,h[u*3+1]=108,h[u*3+2]=Je.terrain.min+Math.random()*Je.terrain.size);qn.geometry.attributes.position.needsUpdate=!0}const r=Je.chunkManager?.update(xt.group.position).changed??!1;if(yt.ride){const u=yt.ride.train.cars[0].position.clone();ct.target.copy(u),Vt.position.copy(u).add(new C(12,8,16)),Vt.lookAt(u),yt.ride.elapsed>=yt.ride.duration&&_o()}const s=$n.check(xt.group.position);s&&(Ke.setProgress($n),Qt.markVisited(s.name),Ji.evaluate().forEach(h=>Ke.showToast(`Quest complete: ${h.name}`)),Ke.showToast(`Stamp collected: ${s.name}`));const o=un.update(xt.group.position);o.advanced&&(o.complete&&Qt.completeRoute(un.routeId),Ke.showToast(o.complete?"KL Tour complete.":`Next stop: ${o.destination.name}`)),fr(o),Ks=!!yt.findBoardingStation(xt.group.position)||!!yt.ride,Ke.setBoardTrainAvailable(Ks),eg.draw({nextLandmark:un.current,visited:h=>$n.isVisited(h)});const c=ct.update();(t||n||a||c||r||er||un.active||yt.ride||qn.visible)&&(hi.render(Wt,Vt),Qr+=1),i-es>500&&(Jr=Qr*1e3/(i-es),Qr=0,es=i);const d=t||n||a||c||r||er||un.active||yt.ride||qn.visible;Ke.update({fps:Jr,pixelRatio:hi.pixelRatio,running:d,trainsActive:yt.isActive}),er=!1,d?requestAnimationFrame(Rc):(rr=!1,Ke.update({fps:Jr,pixelRatio:hi.pixelRatio,running:!1,trainsActive:!1}))}ct.addEventListener("start",()=>{yt.wake(),At()});ct.addEventListener("change",At);ct.addEventListener("end",At);window.addEventListener("resize",()=>{hi.resize(Vt),At()});window.addEventListener("keydown",i=>{const e=i.key.toLowerCase();if(e==="f"&&(Ki(xt.group.position.clone().add(new C(0,2,0)),34),Ke.showToast("Camera refocused on the explorer.")),e==="1"&&Oi("walk"),e==="2"&&Oi("landmark"),e==="3"&&Oi("skyline"),e==="e"&&Ks&&_o(),e==="p"){const t=yt.togglePermanentMotion();Ke.showToast(t?"Continuous train motion enabled.":"Train motion now auto-pauses when idle.")}At()});window.addEventListener("keyup",At);window.addEventListener("pointerdown",At);window.addEventListener("wheel",At,{passive:!0});document.addEventListener("visibilitychange",()=>{document.hidden||At()});At();
