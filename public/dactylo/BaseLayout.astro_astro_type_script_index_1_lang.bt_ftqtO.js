var e=`dactylo-style`,t=`script,style,noscript,template,textarea,input,select,option,[data-dactylo-skip],[data-dactylo-original],[data-dactylo-output]`,n=[{sels:`h1,h2,h3,h4,h5,h6`,duration:600,parallel:!0},{sels:`p,li,dt,dd,figcaption,blockquote,pre,th,td,caption`,parallel:!0},{sels:`code,a,button,label,summary,mark`,parallel:!0}],r=`_`,i=`>`,a=600,o=500,s=!1,c=new WeakMap,l=0,u=0,d=e=>e??globalThis.document?.body??null,f=e=>`ownerDocument`in e&&e.ownerDocument?e.ownerDocument:`nodeType`in e&&e.nodeType===e.DOCUMENT_NODE?e:globalThis.document??null,p=e=>Array.isArray(e)?e.join(`,`):e,m=()=>({ended:!1,paused:!1,pausedDuration:0,pausedStarted:0,stopped:!1}),h=e=>e.paused?e.pausedDuration+Date.now()-e.pausedStarted:e.pausedDuration,g=e=>e.ended||e.paused||e.stopped?!1:(e.paused=!0,e.pausedStarted=Date.now(),!0),_=e=>!e.paused||e.ended||e.stopped?!1:(e.paused=!1,e.pausedDuration+=Date.now()-e.pausedStarted,e.pausedStarted=0,!0),v=(e,t)=>new Promise(n=>{let r=Date.now(),i=()=>{let a=Date.now()-r-h(t);if(t.ended||t.stopped||a>=e){n();return}requestAnimationFrame(i)};requestAnimationFrame(i)}),y=e=>e.stopped?`stopped`:e.ended?`ended`:e.paused?`paused`:`playing`,b=e=>e.reduce((e,t)=>e.then(t),Promise.resolve()),x=(e,t,n={})=>{t.dispatchEvent(new CustomEvent(e,{bubbles:!0,cancelable:!0,detail:n}))},S=(e,n,r=[])=>{let i=p(n),a=globalThis.HTMLElement&&e instanceof HTMLElement&&e.matches(i)&&!e.closest(t)?[e]:[],o=Array.from(e.querySelectorAll(i));return[...a,...o].filter((e,n,i)=>i.indexOf(e)===n&&!e.closest(t)&&!r.some(t=>e.closest(t))&&e.innerText.trim()!==``)},C=(e,t)=>{let n=e.createElement(`span`);return n.classList.add(`dactylo__output`),n.dataset.dactyloOutput=``,n.dataset.dactyloCaret=t,n},w=e=>{let t=e.ownerDocument.createElement(`span`),n=e.innerHTML,r=++l;return e.classList.add(`dactylo--typing`),t.classList.add(`dactylo__original`),t.dataset.dactyloOriginal=``,t.innerHTML=n,e.replaceChildren(t),c.set(e,{id:r,originalHtml:n}),{element:e,id:r,original:t,originalHtml:n}},T=({element:e,id:t,originalHtml:n})=>{let r=c.get(e);!r||r.id!==t||(e.innerHTML=n,e.classList.remove(`dactylo--typing`,`dactylo--caret`),c.delete(e))},E=({element:e,id:t,original:n,originalHtml:r})=>{let i=e.querySelector(`[data-dactylo-original]`)??n;i.innerHTML=r,e.replaceChildren(i),e.classList.add(`dactylo--typing`),e.classList.remove(`dactylo--caret`),c.set(e,{id:t,originalHtml:r})},D=(e,t,n,r,i,a,o)=>{let s=c.get(r.element);if(!s||s.id!==r.id||o.stopped)return!1;if(o.paused)return!0;let l=(Date.now()-e-o.pausedDuration)/t,u=l>1?n.length:Math.floor(l*n.length);return i.textContent=n.slice(0,u+1).join(``),i.append(r.element.ownerDocument.createElement(`wbr`)),i.classList.toggle(`dactylo__output--hide-caret`,!a.showFinalCaret&&u>=n.length-1),u<n.length?!0:(T(r),!1)},O=(e,t,n,r)=>new Promise(i=>{let a=Array.from(e.element.innerText),s=Date.now(),l=t.interval===void 0?t.duration??o:a.length*t.interval,u=C(e.element.ownerDocument,n.caret);if(c.get(e.element)?.id!==e.id){i();return}e.element.append(u);let d=()=>{if(D(s,l,a,e,u,n,r)){requestAnimationFrame(d);return}i()};requestAnimationFrame(d)}),k=async(e,t,n)=>{if(!e||c.get(e.element)?.id!==e.id||n.ended||n.stopped)return;let r=C(e.element.ownerDocument,t.caret);r.textContent=t.prompt,e.element.append(r),e.element.classList.add(`dactylo--caret`),await v(t.startDelay,n),!(c.get(e.element)?.id!==e.id||n.ended||n.stopped)&&(r.remove(),e.element.classList.remove(`dactylo--caret`))},A=(e,t,n,r,i)=>{let a=S(t,e.sels,e.notIn).map(e=>n.get(e)).filter(e=>e!==void 0).map(t=>()=>O(t,e,r,i));return e.parallel?Promise.all(a.map(e=>e())):b(a)},j=(t=globalThis.document)=>{if(!t||t.getElementById(e))return;let n=t.createElement(`style`);n.id=e,n.textContent=`
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
	`,t.head.append(n)},M=e=>{let t=d(e);if(!t)return;let n=[...globalThis.HTMLElement&&t instanceof HTMLElement&&t.classList.contains(`dactylo--typing`)?[t]:[],...Array.from(t.querySelectorAll(`.dactylo--typing`))];for(let e of n){let t=c.get(e),n=e.querySelector(`[data-dactylo-original]`);e.innerHTML=t?.originalHtml??n?.innerHTML??e.innerHTML,e.classList.remove(`dactylo--typing`,`dactylo--caret`),c.delete(e)}},N=(e,t={})=>{let o=e&&`querySelectorAll`in e?e:e?.root,c=e&&`querySelectorAll`in e?t:e??t,l=d(o),p=l?f(l):null,h=c.groups??n,v=c.caret??r,C=c.prompt??i,D=c.showFinalCaret??s,O=c.startDelay??a;if(!p||!l)return{elements:[],end:()=>void 0,finished:Promise.resolve(),pause:()=>void 0,play:()=>void 0,playPause:()=>void 0,root:l,reset:()=>void 0,state:`stopped`,stop:()=>void 0};M(l);let P=h.flatMap(e=>S(l,e.sels,e.notIn)),F=[...new Set(P)],I=new Map(F.map(e=>[e,w(e)])),L=++u,R=m(),z=null;j(p),p.documentElement.classList.remove(`dactylo--end`),p.documentElement.classList.add(`dactylo--active`);let B=e=>{if(u===L){u+=1,R.stopped=!0,p.documentElement.classList.remove(`dactylo--active`),p.documentElement.classList.remove(`dactylo--end`);for(let e of I.values())E(e);x(e,p.documentElement,{controller:H,state:`stopped`})}},V=()=>{if(u===L){u+=1,R.ended=!0,R.paused=!1,R.stopped=!1,p.documentElement.classList.remove(`dactylo--active`),p.documentElement.classList.add(`dactylo--end`);for(let e of I.values())T(e);x(`dactylo:end`,p.documentElement,{controller:H,state:`ended`})}},H={elements:F,end:()=>{if(z){z.end();return}if(!R.ended){if(R.stopped){z=N(l,c),z.end();return}V()}},finished:Promise.resolve().then(()=>b([()=>k(I.values().next().value,{caret:v,prompt:C,startDelay:O},R),...h.map(e=>()=>A(e,l,I,{caret:v,showFinalCaret:D},R))])).then(()=>{u===L&&(R.ended=!0,p.documentElement.classList.remove(`dactylo--active`),p.documentElement.classList.add(`dactylo--end`),x(`dactylo:end`,p.documentElement,{controller:H,state:`ended`}))}),get state(){return z?.state??y(R)},pause:()=>{if(z){z.pause();return}g(R)&&x(`dactylo:pause`,p.documentElement,{controller:H,state:y(R)})},play:()=>{if(z){z.play();return}if(R.ended||R.stopped){z=N(l,c);return}_(R)&&x(`dactylo:play`,p.documentElement,{controller:H,state:y(R)})},playPause:()=>{if((z?.state??y(R))===`playing`){if(z){z.pause();return}g(R)&&x(`dactylo:pause`,p.documentElement,{controller:H,state:y(R)});return}if(z){z.play();return}if(R.ended||R.stopped){z=N(l,c);return}_(R)&&x(`dactylo:play`,p.documentElement,{controller:H,state:y(R)})},root:l,reset:()=>{if(z){z.reset();return}if(R.ended){z=N(l,c),z.reset();return}B(`dactylo:reset`)},stop:()=>{if(z){z.stop();return}if(R.ended){z=N(l,c),z.stop();return}g(R),B(`dactylo:stop`)}};return x(`dactylo:start`,p.documentElement,{controller:H,state:`playing`}),x(`dactylo:play`,p.documentElement,{controller:H,state:`playing`}),H};typeof window<`u`&&(window.dactylo=N,window.injectDactyloStyles=j,window.resetDactylo=M);var P=()=>{N(document.body)};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,P,{once:!0}):P();var F=(e,t)=>Array.from(e.children).some(e=>e instanceof HTMLButtonElement&&e.classList.contains(t));(({root:e=document,blockSelector:t=`.code-block`,codeSelector:n=`code`,buttonClassName:r=`copy`,label:i=`Copy`,copiedLabel:a=`Copied!`,errorLabel:o=`Unable to copy`,resetDelay:s=1e3}={})=>{let c=[];return e.querySelectorAll(t).forEach(e=>{let t=e.querySelector(n);if(!t||F(e,r))return;let l=document.createElement(`button`);l.classList.add(r),l.type=`button`,l.textContent=i,l.addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(t.textContent??``),l.setAttribute(`aria-live`,`assertive`),l.textContent=a}catch{l.textContent=o}setTimeout(()=>{l.textContent=i,l.removeAttribute(`aria-live`)},s)}),e.appendChild(l),c.push(l)}),c})({blockSelector:`main .code-block`,copiedLabel:`Copied`});