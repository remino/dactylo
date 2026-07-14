/*! dactylo v0.2.0 | (c) 2026 Rémino Rem <https://remino.net/> | ISC Licence */
(function(e,t){typeof exports==`object`&&typeof module<`u`?t(exports):typeof define==`function`&&define.amd?define([`exports`],t):(e=typeof globalThis<`u`?globalThis:e||self,t(e.dactylo={}))})(this,function(e){Object.defineProperty(e,Symbol.toStringTag,{value:`Module`});var t=`dactylo-style`,n=`script,style,noscript,template,textarea,input,select,option,[data-dactylo-skip],[data-dactylo-original],[data-dactylo-output]`,r=[{sels:`h1,h2,h3,h4,h5,h6`,duration:600,parallel:!0},{sels:`p,li,dt,dd,figcaption,blockquote,pre,th,td,caption`,parallel:!0},{sels:`code,a,button,label,summary,mark`,parallel:!0}],i=`_`,a=`>`,o=600,s=500,c=!1,l=new WeakMap,u=0,d=0,f=e=>e??globalThis.document?.body??null,p=e=>`ownerDocument`in e&&e.ownerDocument?e.ownerDocument:`nodeType`in e&&e.nodeType===e.DOCUMENT_NODE?e:globalThis.document??null,m=e=>Array.isArray(e)?e.join(`,`):e,h=()=>({ended:!1,paused:!1,pausedDuration:0,pausedStarted:0,stopped:!1}),g=e=>e.paused?e.pausedDuration+Date.now()-e.pausedStarted:e.pausedDuration,_=e=>e.ended||e.paused||e.stopped?!1:(e.paused=!0,e.pausedStarted=Date.now(),!0),v=e=>!e.paused||e.ended||e.stopped?!1:(e.paused=!1,e.pausedDuration+=Date.now()-e.pausedStarted,e.pausedStarted=0,!0),y=(e,t)=>new Promise(n=>{let r=Date.now(),i=()=>{let a=Date.now()-r-g(t);if(t.ended||t.stopped||a>=e){n();return}requestAnimationFrame(i)};requestAnimationFrame(i)}),b=e=>e.stopped?`stopped`:e.ended?`ended`:e.paused?`paused`:`playing`,x=e=>e.reduce((e,t)=>e.then(t),Promise.resolve()),S=(e,t,n={})=>{t.dispatchEvent(new CustomEvent(e,{bubbles:!0,cancelable:!0,detail:n}))},C=(e,t,r=[])=>{let i=m(t),a=globalThis.HTMLElement&&e instanceof HTMLElement&&e.matches(i)&&!e.closest(n)?[e]:[],o=Array.from(e.querySelectorAll(i));return[...a,...o].filter((e,t,i)=>i.indexOf(e)===t&&!e.closest(n)&&!r.some(t=>e.closest(t))&&e.innerText.trim()!==``)},w=(e,t)=>{let n=e.createElement(`span`);return n.classList.add(`dactylo__output`),n.dataset.dactyloOutput=``,n.dataset.dactyloCaret=t,n},T=e=>{let t=e.ownerDocument.createElement(`span`),n=e.innerHTML,r=++u;return e.classList.add(`dactylo--typing`),t.classList.add(`dactylo__original`),t.dataset.dactyloOriginal=``,t.innerHTML=n,e.replaceChildren(t),l.set(e,{id:r,originalHtml:n}),{element:e,id:r,original:t,originalHtml:n}},E=({element:e,id:t,originalHtml:n})=>{let r=l.get(e);!r||r.id!==t||(e.innerHTML=n,e.classList.remove(`dactylo--typing`,`dactylo--caret`),l.delete(e))},D=({element:e,id:t,original:n,originalHtml:r})=>{let i=e.querySelector(`[data-dactylo-original]`)??n;i.innerHTML=r,e.replaceChildren(i),e.classList.add(`dactylo--typing`),e.classList.remove(`dactylo--caret`),l.set(e,{id:t,originalHtml:r})},O=(e,t,n,r,i,a,o)=>{let s=l.get(r.element);if(!s||s.id!==r.id||o.stopped)return!1;if(o.paused)return!0;let c=(Date.now()-e-o.pausedDuration)/t,u=c>1?n.length:Math.floor(c*n.length);return i.textContent=n.slice(0,u+1).join(``),i.append(r.element.ownerDocument.createElement(`wbr`)),i.classList.toggle(`dactylo__output--hide-caret`,!a.showFinalCaret&&u>=n.length-1),u<n.length?!0:(E(r),!1)},k=(e,t,n,r)=>new Promise(i=>{let a=Array.from(e.element.innerText),o=Date.now(),c=t.interval===void 0?t.duration??s:a.length*t.interval,u=w(e.element.ownerDocument,n.caret);if(l.get(e.element)?.id!==e.id){i();return}e.element.append(u);let d=()=>{if(O(o,c,a,e,u,n,r)){requestAnimationFrame(d);return}i()};requestAnimationFrame(d)}),A=async(e,t,n)=>{if(!e||l.get(e.element)?.id!==e.id||n.ended||n.stopped)return;let r=w(e.element.ownerDocument,t.caret);r.textContent=t.prompt,e.element.append(r),e.element.classList.add(`dactylo--caret`),await y(t.startDelay,n),!(l.get(e.element)?.id!==e.id||n.ended||n.stopped)&&(r.remove(),e.element.classList.remove(`dactylo--caret`))},j=(e,t,n,r,i)=>{let a=C(t,e.sels,e.notIn).map(e=>n.get(e)).filter(e=>e!==void 0).map(t=>()=>k(t,e,r,i));return e.parallel?Promise.all(a.map(e=>e())):x(a)},M=(e=globalThis.document)=>{if(!e||e.getElementById(t))return;let n=e.createElement(`style`);n.id=t,n.textContent=`
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
	`,e.head.append(n)},N=e=>{let t=f(e);if(!t)return;let n=[...globalThis.HTMLElement&&t instanceof HTMLElement&&t.classList.contains(`dactylo--typing`)?[t]:[],...Array.from(t.querySelectorAll(`.dactylo--typing`))];for(let e of n){let t=l.get(e),n=e.querySelector(`[data-dactylo-original]`);e.innerHTML=t?.originalHtml??n?.innerHTML??e.innerHTML,e.classList.remove(`dactylo--typing`,`dactylo--caret`),l.delete(e)}},P=(e,t={})=>{let n=e&&`querySelectorAll`in e?e:e?.root,s=e&&`querySelectorAll`in e?t:e??t,l=f(n),u=l?p(l):null,m=s.groups??r,g=s.caret??i,y=s.prompt??a,w=s.showFinalCaret??c,O=s.startDelay??o;if(!u||!l)return{elements:[],end:()=>void 0,finished:Promise.resolve(),pause:()=>void 0,play:()=>void 0,playPause:()=>void 0,root:l,reset:()=>void 0,state:`stopped`,stop:()=>void 0};N(l);let k=m.flatMap(e=>C(l,e.sels,e.notIn)),F=[...new Set(k)],I=new Map(F.map(e=>[e,T(e)])),L=++d,R=h(),z=null;M(u),u.documentElement.classList.remove(`dactylo--end`),u.documentElement.classList.add(`dactylo--active`);let B=e=>{if(d===L){d+=1,R.stopped=!0,u.documentElement.classList.remove(`dactylo--active`),u.documentElement.classList.remove(`dactylo--end`);for(let e of I.values())D(e);S(e,u.documentElement,{controller:H,state:`stopped`})}},V=()=>{if(d===L){d+=1,R.ended=!0,R.paused=!1,R.stopped=!1,u.documentElement.classList.remove(`dactylo--active`),u.documentElement.classList.add(`dactylo--end`);for(let e of I.values())E(e);S(`dactylo:end`,u.documentElement,{controller:H,state:`ended`})}},H={elements:F,end:()=>{if(z){z.end();return}if(!R.ended){if(R.stopped){z=P(l,s),z.end();return}V()}},finished:Promise.resolve().then(()=>x([()=>A(I.values().next().value,{caret:g,prompt:y,startDelay:O},R),...m.map(e=>()=>j(e,l,I,{caret:g,showFinalCaret:w},R))])).then(()=>{d===L&&(R.ended=!0,u.documentElement.classList.remove(`dactylo--active`),u.documentElement.classList.add(`dactylo--end`),S(`dactylo:end`,u.documentElement,{controller:H,state:`ended`}))}),get state(){return z?.state??b(R)},pause:()=>{if(z){z.pause();return}_(R)&&S(`dactylo:pause`,u.documentElement,{controller:H,state:b(R)})},play:()=>{if(z){z.play();return}if(R.ended||R.stopped){z=P(l,s);return}v(R)&&S(`dactylo:play`,u.documentElement,{controller:H,state:b(R)})},playPause:()=>{if((z?.state??b(R))===`playing`){if(z){z.pause();return}_(R)&&S(`dactylo:pause`,u.documentElement,{controller:H,state:b(R)});return}if(z){z.play();return}if(R.ended||R.stopped){z=P(l,s);return}v(R)&&S(`dactylo:play`,u.documentElement,{controller:H,state:b(R)})},root:l,reset:()=>{if(z){z.reset();return}if(R.ended){z=P(l,s),z.reset();return}B(`dactylo:reset`)},stop:()=>{if(z){z.stop();return}if(R.ended){z=P(l,s),z.stop();return}_(R),B(`dactylo:stop`)}};return S(`dactylo:start`,u.documentElement,{controller:H,state:`playing`}),S(`dactylo:play`,u.documentElement,{controller:H,state:`playing`}),H};typeof window<`u`&&(window.dactylo=P,window.injectDactyloStyles=M,window.resetDactylo=N);var F=()=>{P(document.body)};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,F,{once:!0}):F(),e.dactylo=P,e.injectDactyloStyles=M,e.resetDactylo=N});