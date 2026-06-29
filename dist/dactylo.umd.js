/*! dactylo v0.1.0 | (c) 2026 Rémino Rem <https://remino.net/> | ISC Licence */
(function(e,t){typeof exports==`object`&&typeof module<`u`?t(exports):typeof define==`function`&&define.amd?define([`exports`],t):(e=typeof globalThis<`u`?globalThis:e||self,t(e.dactylo={}))})(this,function(e){Object.defineProperty(e,Symbol.toStringTag,{value:`Module`});var t=`dactylo-style`,n=`script,style,noscript,template,textarea,input,select,option,[data-dactylo-skip],[data-dactylo-original],[data-dactylo-output]`,r=[{sels:`h1,h2,h3,h4,h5,h6`,duration:600,parallel:!0},{sels:`p,li,dt,dd,figcaption,blockquote,pre,th,td,caption`,parallel:!0},{sels:`code,a,button,label,summary,mark`,parallel:!0}],i=`_`,a=`>`,o=600,s=500,c=e=>e??globalThis.document?.body??null,l=e=>`ownerDocument`in e&&e.ownerDocument?e.ownerDocument:`nodeType`in e&&e.nodeType===e.DOCUMENT_NODE?e:globalThis.document??null,u=e=>Array.isArray(e)?e.join(`,`):e,d=e=>new Promise(t=>setTimeout(t,e)),f=e=>e.reduce((e,t)=>e.then(t),Promise.resolve()),p=(e,t)=>{t.dispatchEvent(new CustomEvent(e,{bubbles:!0,cancelable:!0}))},m=(e,t,r=[])=>{let i=u(t),a=globalThis.HTMLElement&&e instanceof HTMLElement&&e.matches(i)&&!e.closest(n)?[e]:[],o=Array.from(e.querySelectorAll(i));return[...a,...o].filter((e,t,i)=>i.indexOf(e)===t&&!e.closest(n)&&!r.some(t=>e.closest(t))&&e.innerText.trim()!==``)},h=(e,t)=>{let n=e.createElement(`span`);return n.classList.add(`dactylo__output`),n.dataset.dactyloOutput=``,n.dataset.dactyloCaret=t,n},g=e=>{let t=e.ownerDocument.createElement(`span`),n=e.innerHTML;return e.classList.add(`dactylo--typing`),t.classList.add(`dactylo__original`),t.dataset.dactyloOriginal=``,t.innerHTML=n,e.replaceChildren(t),{element:e,original:t,originalHtml:n}},_=({element:e,originalHtml:t})=>{e.innerHTML=t,e.classList.remove(`dactylo--typing`,`dactylo--caret`)},v=(e,t,n,r,i)=>{let a=(Date.now()-e)/t,o=a>1?n.length:Math.floor(a*n.length);return i.textContent=n.slice(0,o+1).join(``),i.append(r.element.ownerDocument.createElement(`wbr`)),o<n.length?!0:(_(r),!1)},y=(e,t,n)=>new Promise(r=>{let i=Array.from(e.element.innerText),a=Date.now(),o=t.interval===void 0?t.duration??s:i.length*t.interval,c=h(e.element.ownerDocument,n.caret);e.element.append(c);let l=()=>{if(v(a,o,i,e,c)){requestAnimationFrame(l);return}r()};requestAnimationFrame(l)}),b=async(e,t)=>{if(!e)return;let n=h(e.element.ownerDocument,t.caret);n.textContent=t.prompt,e.element.append(n),e.element.classList.add(`dactylo--caret`),await d(t.startDelay),n.remove(),e.element.classList.remove(`dactylo--caret`)},x=(e,t,n,r)=>{let i=m(t,e.sels,e.notIn).map(e=>n.get(e)).filter(e=>e!==void 0).map(t=>()=>y(t,e,r));return e.parallel?Promise.all(i.map(e=>e())):f(i)},S=(e=globalThis.document)=>{if(!e||e.getElementById(t))return;let n=e.createElement(`style`);n.id=t,n.textContent=`
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
	`,e.head.append(n)},C=e=>{let t=c(e);if(t)for(let e of Array.from(t.querySelectorAll(`.dactylo--typing`)))e.innerHTML=e.querySelector(`[data-dactylo-original]`)?.innerHTML??e.innerHTML,e.classList.remove(`dactylo--typing`,`dactylo--caret`)},w=(e,t={})=>{let n=e&&`querySelectorAll`in e?e:e?.root,s=e&&`querySelectorAll`in e?t:e??t,u=c(n),d=u?l(u):null,h=s.groups??r,_=s.caret??i,v=s.prompt??a,y=s.startDelay??o,w=u?h.flatMap(e=>m(u,e.sels,e.notIn)):[],T=[...new Set(w)],E=new Map(T.map(e=>[e,g(e)]));return!d||!u?{elements:[],finished:Promise.resolve(),root:u,reset:()=>void 0}:(S(d),d.documentElement.classList.remove(`dactylo--end`),d.documentElement.classList.add(`dactylo--active`),p(`dactylo:start`,d.documentElement),{elements:T,finished:f([()=>b(E.values().next().value,{caret:_,prompt:v,startDelay:y}),...h.map(e=>()=>x(e,u,E,{caret:_}))]).then(()=>{d.documentElement.classList.remove(`dactylo--active`),d.documentElement.classList.add(`dactylo--end`),p(`dactylo:end`,d.documentElement)}),root:u,reset:()=>C(u)})};typeof window<`u`&&(window.dactylo=w,window.injectDactyloStyles=S,window.resetDactylo=C);var T=()=>{w(document.body)};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,T,{once:!0}):T(),e.dactylo=w,e.injectDactyloStyles=S,e.resetDactylo=C});