/*! dactylo v0.1.0 | (c) 2026 Rémino Rem <https://remino.net/> | ISC Licence */
(function(e,t){typeof exports==`object`&&typeof module<`u`?t(exports):typeof define==`function`&&define.amd?define([`exports`],t):(e=typeof globalThis<`u`?globalThis:e||self,t(e.dactylo={}))})(this,function(e){Object.defineProperty(e,Symbol.toStringTag,{value:`Module`});var t=`dactylo-style`,n=`script,style,noscript,template,textarea,input,select,option,[data-dactylo-skip],[data-dactylo-original],[data-dactylo-output]`,r=[{sels:`h1,h2,h3,h4,h5,h6`,duration:600,parallel:!0},{sels:`p,li,dt,dd,figcaption,blockquote,pre,th,td,caption`,parallel:!0},{sels:`code,a,button,label,summary,mark`,parallel:!0}],i=`_`,a=`>`,o=600,s=500,c=new WeakMap,l=0,u=0,d=e=>e??globalThis.document?.body??null,f=e=>`ownerDocument`in e&&e.ownerDocument?e.ownerDocument:`nodeType`in e&&e.nodeType===e.DOCUMENT_NODE?e:globalThis.document??null,p=e=>Array.isArray(e)?e.join(`,`):e,m=e=>new Promise(t=>setTimeout(t,e)),h=e=>e.reduce((e,t)=>e.then(t),Promise.resolve()),g=(e,t)=>{t.dispatchEvent(new CustomEvent(e,{bubbles:!0,cancelable:!0}))},_=(e,t,r=[])=>{let i=p(t),a=globalThis.HTMLElement&&e instanceof HTMLElement&&e.matches(i)&&!e.closest(n)?[e]:[],o=Array.from(e.querySelectorAll(i));return[...a,...o].filter((e,t,i)=>i.indexOf(e)===t&&!e.closest(n)&&!r.some(t=>e.closest(t))&&e.innerText.trim()!==``)},v=(e,t)=>{let n=e.createElement(`span`);return n.classList.add(`dactylo__output`),n.dataset.dactyloOutput=``,n.dataset.dactyloCaret=t,n},y=e=>{let t=e.ownerDocument.createElement(`span`),n=e.innerHTML,r=++l;return e.classList.add(`dactylo--typing`),t.classList.add(`dactylo__original`),t.dataset.dactyloOriginal=``,t.innerHTML=n,e.replaceChildren(t),c.set(e,{id:r,originalHtml:n}),{element:e,id:r,original:t,originalHtml:n}},b=({element:e,id:t,originalHtml:n})=>{let r=c.get(e);!r||r.id!==t||(e.innerHTML=n,e.classList.remove(`dactylo--typing`,`dactylo--caret`),c.delete(e))},x=(e,t,n,r,i)=>{let a=c.get(r.element);if(!a||a.id!==r.id)return!1;let o=(Date.now()-e)/t,s=o>1?n.length:Math.floor(o*n.length);return i.textContent=n.slice(0,s+1).join(``),i.append(r.element.ownerDocument.createElement(`wbr`)),s<n.length?!0:(b(r),!1)},S=(e,t,n)=>new Promise(r=>{let i=Array.from(e.element.innerText),a=Date.now(),o=t.interval===void 0?t.duration??s:i.length*t.interval,l=v(e.element.ownerDocument,n.caret);if(c.get(e.element)?.id!==e.id){r();return}e.element.append(l);let u=()=>{if(x(a,o,i,e,l)){requestAnimationFrame(u);return}r()};requestAnimationFrame(u)}),C=async(e,t)=>{if(!e)return;let n=v(e.element.ownerDocument,t.caret);n.textContent=t.prompt,e.element.append(n),e.element.classList.add(`dactylo--caret`),await m(t.startDelay),c.get(e.element)?.id===e.id&&(n.remove(),e.element.classList.remove(`dactylo--caret`))},w=(e,t,n,r)=>{let i=_(t,e.sels,e.notIn).map(e=>n.get(e)).filter(e=>e!==void 0).map(t=>()=>S(t,e,r));return e.parallel?Promise.all(i.map(e=>e())):h(i)},T=(e=globalThis.document)=>{if(!e||e.getElementById(t))return;let n=e.createElement(`style`);n.id=t,n.textContent=`
		@keyframes dactylo-caret-blink {
			0%,
			50% {
				opacity: 1;
			}

			70%,
			100% {
				opacity: 0;
			}
		}

		.dactylo--typing {
			position: relative;
		}

		.dactylo--typing > .dactylo__original {
			opacity: 0;
		}

		.dactylo--typing > .dactylo__output {
			display: inline;
			inset-block-start: 0;
			inset-inline: 0;
			position: absolute;
		}

		.dactylo--typing > .dactylo__output::after {
			content: attr(data-dactylo-caret);
			display: inline;
			font-weight: 700;
		}

		.dactylo--typing.dactylo--caret > .dactylo__output::after {
			animation: dactylo-caret-blink 1s infinite;
		}

		@media (prefers-reduced-motion: reduce) {
			.dactylo--typing > .dactylo__original {
				opacity: 1;
			}

			.dactylo--typing > .dactylo__output {
				display: none;
			}
		}
	`,e.head.append(n)},E=e=>{let t=d(e);if(!t)return;let n=[...globalThis.HTMLElement&&t instanceof HTMLElement&&t.classList.contains(`dactylo--typing`)?[t]:[],...Array.from(t.querySelectorAll(`.dactylo--typing`))];for(let e of n){let t=c.get(e),n=e.querySelector(`[data-dactylo-original]`);e.innerHTML=t?.originalHtml??n?.innerHTML??e.innerHTML,e.classList.remove(`dactylo--typing`,`dactylo--caret`),c.delete(e)}},D=(e,t={})=>{let n=e&&`querySelectorAll`in e?e:e?.root,s=e&&`querySelectorAll`in e?t:e??t,c=d(n),l=c?f(c):null,p=s.groups??r,m=s.caret??i,v=s.prompt??a,b=s.startDelay??o;if(!l||!c)return{elements:[],finished:Promise.resolve(),root:c,reset:()=>void 0};E(c);let x=p.flatMap(e=>_(c,e.sels,e.notIn)),S=[...new Set(x)],D=new Map(S.map(e=>[e,y(e)])),O=++u;return T(l),l.documentElement.classList.remove(`dactylo--end`),l.documentElement.classList.add(`dactylo--active`),g(`dactylo:start`,l.documentElement),{elements:S,finished:h([()=>C(D.values().next().value,{caret:m,prompt:v,startDelay:b}),...p.map(e=>()=>w(e,c,D,{caret:m}))]).then(()=>{u===O&&(l.documentElement.classList.remove(`dactylo--active`),l.documentElement.classList.add(`dactylo--end`),g(`dactylo:end`,l.documentElement))}),root:c,reset:()=>{u===O&&(u+=1),E(c)}}};typeof window<`u`&&(window.dactylo=D,window.injectDactyloStyles=T,window.resetDactylo=E);var O=()=>{D(document.body)};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,O,{once:!0}):O(),e.dactylo=D,e.injectDactyloStyles=T,e.resetDactylo=E});