exports.id=566,exports.ids=[566],exports.modules={6566:(t,e,r)=>{"use strict";r.d(e,{fileFromPath:()=>p});var i,o,s=r(9021),a=r(3873),n=r(9465),c=r(5893);let l=t=>Object.prototype.toString.call(t).slice(8,-1).toLowerCase(),d=function(t){if("object"!==l(t))return!1;let e=Object.getPrototypeOf(t);return null==e||(e.constructor&&e.constructor.toString())===Object.toString()};r(5325);var f=function(t,e,r,i,o){if("m"===i)throw TypeError("Private method is not writable");if("a"===i&&!o)throw TypeError("Private accessor was defined without a setter");if("function"==typeof e?t!==e||!o:!e.has(t))throw TypeError("Cannot write private member to an object whose class did not declare it");return"a"===i?o.call(t,r):o?o.value=r:e.set(t,r),r},h=function(t,e,r,i){if("a"===r&&!i)throw TypeError("Private accessor was defined without a getter");if("function"==typeof e?t!==e||!i:!e.has(t))throw TypeError("Cannot read private member from an object whose class did not declare it");return"m"===r?i:"a"===r?i.call(t):i?i.value:e.get(t)};class u{constructor(t){i.set(this,void 0),o.set(this,void 0),f(this,i,t.path,"f"),f(this,o,t.start||0,"f"),this.name=(0,a.basename)(h(this,i,"f")),this.size=t.size,this.lastModified=t.lastModified}slice(t,e){return new u({path:h(this,i,"f"),lastModified:this.lastModified,size:e-t,start:t})}async *stream(){let{mtimeMs:t}=await s.promises.stat(h(this,i,"f"));if(t>this.lastModified)throw new n("The requested file could not be read, typically due to permission problems that have occurred after a reference to a file was acquired.","NotReadableError");this.size&&(yield*(0,s.createReadStream)(h(this,i,"f"),{start:h(this,o,"f"),end:h(this,o,"f")+this.size-1}))}get[(i=new WeakMap,o=new WeakMap,Symbol.toStringTag)](){return"File"}}async function p(t,e,r){let i=await s.promises.stat(t);return function(t,{mtimeMs:e,size:r},i,o={}){let s;d(i)?[o,s]=[i,void 0]:s=i;let a=new u({path:t,size:r,lastModified:e});return s||(s=a.name),new c.Z([a],s,{...o,lastModified:a.lastModified})}(t,i,e,r)}},9465:(t,e,r)=>{if(!globalThis.DOMException)try{let{MessageChannel:t}=r(3566),e=new t().port1,i=new ArrayBuffer;e.postMessage(i,[i,i])}catch(t){"DOMException"===t.constructor.name&&(globalThis.DOMException=t.constructor)}t.exports=globalThis.DOMException}};