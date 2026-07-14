/*! dactylo v0.1.0 | (c) 2026 Rémino Rem <https://remino.net/> | ISC Licence */
(function(e,t){typeof exports==`object`&&typeof module<`u`?t(exports):typeof define==`function`&&define.amd?define([`exports`],t):(e=typeof globalThis<`u`?globalThis:e||self,t(e.dactylo={}))})(this,function(e){Object.defineProperty(e,Symbol.toStringTag,{value:`Module`});var t=`dactylo-style`,n=`script,style,noscript,template,textarea,input,select,option,[data-dactylo-skip],[data-dactylo-original],[data-dactylo-output]`,r=[{sels:`h1,h2,h3,h4,h5,h6`,duration:600,parallel:!0},{sels:`p,li,dt,dd,figcaption,blockquote,pre,th,td,caption`,parallel:!0},{sels:`code,a,button,label,summary,mark`,parallel:!0}],i=`_`,a=`>`,o=600,s=500,c=!1,l=new WeakMap,u=0,d=0,f=e=>e??globalThis.document?.body??null,p=e=>`ownerDocument`in e&&e.ownerDocument?e.ownerDocument:`nodeType`in e&&e.nodeType===e.DOCUMENT_NODE?e:globalThis.document??null,m=e=>Array.isArray(e)?e.join(`,`):e,h=e=>new Promise(t=>setTimeout(t,e)),g=e=>e.reduce((e,t)=>e.then(t),Promise.resolve()),_=(e,t)=>{t.dispatchEvent(new CustomEvent(e,{bubbles:!0,cancelable:!0}))},v=(e,t,r=[])=>{let i=m(t),a=globalThis.HTMLElement&&e instanceof HTMLElement&&e.matches(i)&&!e.closest(n)?[e]:[],o=Array.from(e.querySelectorAll(i));return[...a,...o].filter((e,t,i)=>i.indexOf(e)===t&&!e.closest(n)&&!r.some(t=>e.closest(t))&&e.innerText.trim()!==``)},y=(e,t)=>{let n=e.createElement(`span`);return n.classList.add(`dactylo__output`),n.dataset.dactyloOutput=``,n.dataset.dactyloCaret=t,n},b=e=>{let t=e.ownerDocument.createElement(`span`),n=e.innerHTML,r=++u;return e.classList.add(`dactylo--typing`),t.classList.add(`dactylo__original`),t.dataset.dactyloOriginal=``,t.innerHTML=n,e.replaceChildren(t),l.set(e,{id:r,originalHtml:n}),{element:e,id:r,original:t,originalHtml:n}},x=({element:e,id:t,originalHtml:n})=>{let r=l.get(e);!r||r.id!==t||(e.innerHTML=n,e.classList.remove(`dactylo--typing`,`dactylo--caret`),l.delete(e))},S=(e,t,n,r,i,a)=>{let o=l.get(r.element);if(!o||o.id!==r.id)return!1;let s=(Date.now()-e)/t,c=s>1?n.length:Math.floor(s*n.length);return i.textContent=n.slice(0,c+1).join(``),i.append(r.element.ownerDocument.createElement(`wbr`)),i.classList.toggle(`dactylo__output--hide-caret`,!a.showFinalCaret&&c>=n.length-1),c<n.length?!0:(x(r),!1)},C=(e,t,n)=>new Promise(r=>{let i=Array.from(e.element.innerText),a=Date.now(),o=t.interval===void 0?t.duration??s:i.length*t.interval,c=y(e.element.ownerDocument,n.caret);if(l.get(e.element)?.id!==e.id){r();return}e.element.append(c);let u=()=>{if(S(a,o,i,e,c,n)){requestAnimationFrame(u);return}r()};requestAnimationFrame(u)}),w=async(e,t)=>{if(!e)return;let n=y(e.element.ownerDocument,t.caret);n.textContent=t.prompt,e.element.append(n),e.element.classList.add(`dactylo--caret`),await h(t.startDelay),l.get(e.element)?.id===e.id&&(n.remove(),e.element.classList.remove(`dactylo--caret`))},T=(e,t,n,r)=>{let i=v(t,e.sels,e.notIn).map(e=>n.get(e)).filter(e=>e!==void 0).map(t=>()=>C(t,e,r));return e.parallel?Promise.all(i.map(e=>e())):g(i)},E=(e=globalThis.document)=>{if(!e||e.getElementById(t))return;let n=e.createElement(`style`);n.id=t,n.textContent=`
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
			box-sizing: border-box;
			display: block;
			inset-block-start: 0;
			inset-inline: 0;
			padding: inherit;
			position: absolute;
			white-space: inherit;
		}

		.dactylo--typing > .dactylo__output::after {
			content: attr(data-dactylo-caret);
			display: inline;
			font-weight: 700;
		}

		.dactylo--typing.dactylo--caret > .dactylo__output::after {
			animation: dactylo-caret-blink 1s infinite;
		}

		.dactylo--typing > .dactylo__output--hide-caret::after {
			content: "";
		}

		@media (prefers-reduced-motion: reduce) {
			.dactylo--typing > .dactylo__original {
				opacity: 1;
			}

			.dactylo--typing > .dactylo__output {
				display: none;
			}
		}
	`,e.head.append(n)},D=e=>{let t=f(e);if(!t)return;let n=[...globalThis.HTMLElement&&t instanceof HTMLElement&&t.classList.contains(`dactylo--typing`)?[t]:[],...Array.from(t.querySelectorAll(`.dactylo--typing`))];for(let e of n){let t=l.get(e),n=e.querySelector(`[data-dactylo-original]`);e.innerHTML=t?.originalHtml??n?.innerHTML??e.innerHTML,e.classList.remove(`dactylo--typing`,`dactylo--caret`),l.delete(e)}},O=(e,t={})=>{let n=e&&`querySelectorAll`in e?e:e?.root,s=e&&`querySelectorAll`in e?t:e??t,l=f(n),u=l?p(l):null,m=s.groups??r,h=s.caret??i,y=s.prompt??a,x=s.showFinalCaret??c,S=s.startDelay??o;if(!u||!l)return{elements:[],finished:Promise.resolve(),root:l,reset:()=>void 0};D(l);let C=m.flatMap(e=>v(l,e.sels,e.notIn)),O=[...new Set(C)],k=new Map(O.map(e=>[e,b(e)])),A=++d;return E(u),u.documentElement.classList.remove(`dactylo--end`),u.documentElement.classList.add(`dactylo--active`),_(`dactylo:start`,u.documentElement),{elements:O,finished:g([()=>w(k.values().next().value,{caret:h,prompt:y,startDelay:S}),...m.map(e=>()=>T(e,l,k,{caret:h,showFinalCaret:x}))]).then(()=>{d===A&&(u.documentElement.classList.remove(`dactylo--active`),u.documentElement.classList.add(`dactylo--end`),_(`dactylo:end`,u.documentElement))}),root:l,reset:()=>{d===A&&(d+=1),D(l)}}};typeof window<`u`&&(window.dactylo=O,window.injectDactyloStyles=E,window.resetDactylo=D);var k=()=>{O(document.body)};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,k,{once:!0}):k(),e.dactylo=O,e.injectDactyloStyles=E,e.resetDactylo=D});