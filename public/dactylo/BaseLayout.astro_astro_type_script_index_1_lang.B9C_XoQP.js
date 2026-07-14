var e=`dactylo-style`,t=`script,style,noscript,template,textarea,input,select,option,[data-dactylo-skip],[data-dactylo-original],[data-dactylo-output]`,n=[{sels:`h1,h2,h3,h4,h5,h6`,duration:600,parallel:!0},{sels:`p,li,dt,dd,figcaption,blockquote,pre,th,td,caption`,parallel:!0},{sels:`code,a,button,label,summary,mark`,parallel:!0}],r=`_`,i=`>`,a=600,o=500,s=!1,c=new WeakMap,l=0,u=0,d=e=>e??globalThis.document?.body??null,f=e=>`ownerDocument`in e&&e.ownerDocument?e.ownerDocument:`nodeType`in e&&e.nodeType===e.DOCUMENT_NODE?e:globalThis.document??null,p=e=>Array.isArray(e)?e.join(`,`):e,m=e=>new Promise(t=>setTimeout(t,e)),h=e=>e.reduce((e,t)=>e.then(t),Promise.resolve()),g=(e,t)=>{t.dispatchEvent(new CustomEvent(e,{bubbles:!0,cancelable:!0}))},_=(e,n,r=[])=>{let i=p(n),a=globalThis.HTMLElement&&e instanceof HTMLElement&&e.matches(i)&&!e.closest(t)?[e]:[],o=Array.from(e.querySelectorAll(i));return[...a,...o].filter((e,n,i)=>i.indexOf(e)===n&&!e.closest(t)&&!r.some(t=>e.closest(t))&&e.innerText.trim()!==``)},v=(e,t)=>{let n=e.createElement(`span`);return n.classList.add(`dactylo__output`),n.dataset.dactyloOutput=``,n.dataset.dactyloCaret=t,n},y=e=>{let t=e.ownerDocument.createElement(`span`),n=e.innerHTML,r=++l;return e.classList.add(`dactylo--typing`),t.classList.add(`dactylo__original`),t.dataset.dactyloOriginal=``,t.innerHTML=n,e.replaceChildren(t),c.set(e,{id:r,originalHtml:n}),{element:e,id:r,original:t,originalHtml:n}},b=({element:e,id:t,originalHtml:n})=>{let r=c.get(e);!r||r.id!==t||(e.innerHTML=n,e.classList.remove(`dactylo--typing`,`dactylo--caret`),c.delete(e))},x=(e,t,n,r,i,a)=>{let o=c.get(r.element);if(!o||o.id!==r.id)return!1;let s=(Date.now()-e)/t,l=s>1?n.length:Math.floor(s*n.length);return i.textContent=n.slice(0,l+1).join(``),i.append(r.element.ownerDocument.createElement(`wbr`)),i.classList.toggle(`dactylo__output--hide-caret`,!a.showFinalCaret&&l>=n.length-1),l<n.length?!0:(b(r),!1)},S=(e,t,n)=>new Promise(r=>{let i=Array.from(e.element.innerText),a=Date.now(),s=t.interval===void 0?t.duration??o:i.length*t.interval,l=v(e.element.ownerDocument,n.caret);if(c.get(e.element)?.id!==e.id){r();return}e.element.append(l);let u=()=>{if(x(a,s,i,e,l,n)){requestAnimationFrame(u);return}r()};requestAnimationFrame(u)}),C=async(e,t)=>{if(!e)return;let n=v(e.element.ownerDocument,t.caret);n.textContent=t.prompt,e.element.append(n),e.element.classList.add(`dactylo--caret`),await m(t.startDelay),c.get(e.element)?.id===e.id&&(n.remove(),e.element.classList.remove(`dactylo--caret`))},w=(e,t,n,r)=>{let i=_(t,e.sels,e.notIn).map(e=>n.get(e)).filter(e=>e!==void 0).map(t=>()=>S(t,e,r));return e.parallel?Promise.all(i.map(e=>e())):h(i)},T=(t=globalThis.document)=>{if(!t||t.getElementById(e))return;let n=t.createElement(`style`);n.id=e,n.textContent=`
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
	`,t.head.append(n)},E=e=>{let t=d(e);if(!t)return;let n=[...globalThis.HTMLElement&&t instanceof HTMLElement&&t.classList.contains(`dactylo--typing`)?[t]:[],...Array.from(t.querySelectorAll(`.dactylo--typing`))];for(let e of n){let t=c.get(e),n=e.querySelector(`[data-dactylo-original]`);e.innerHTML=t?.originalHtml??n?.innerHTML??e.innerHTML,e.classList.remove(`dactylo--typing`,`dactylo--caret`),c.delete(e)}},D=(e,t={})=>{let o=e&&`querySelectorAll`in e?e:e?.root,c=e&&`querySelectorAll`in e?t:e??t,l=d(o),p=l?f(l):null,m=c.groups??n,v=c.caret??r,b=c.prompt??i,x=c.showFinalCaret??s,S=c.startDelay??a;if(!p||!l)return{elements:[],finished:Promise.resolve(),root:l,reset:()=>void 0};E(l);let D=m.flatMap(e=>_(l,e.sels,e.notIn)),O=[...new Set(D)],k=new Map(O.map(e=>[e,y(e)])),A=++u;return T(p),p.documentElement.classList.remove(`dactylo--end`),p.documentElement.classList.add(`dactylo--active`),g(`dactylo:start`,p.documentElement),{elements:O,finished:h([()=>C(k.values().next().value,{caret:v,prompt:b,startDelay:S}),...m.map(e=>()=>w(e,l,k,{caret:v,showFinalCaret:x}))]).then(()=>{u===A&&(p.documentElement.classList.remove(`dactylo--active`),p.documentElement.classList.add(`dactylo--end`),g(`dactylo:end`,p.documentElement))}),root:l,reset:()=>{u===A&&(u+=1),E(l)}}};typeof window<`u`&&(window.dactylo=D,window.injectDactyloStyles=T,window.resetDactylo=E);var O=()=>{D(document.body)};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,O,{once:!0}):O();var k=(e,t)=>Array.from(e.children).some(e=>e instanceof HTMLButtonElement&&e.classList.contains(t));(({root:e=document,blockSelector:t=`.code-block`,codeSelector:n=`code`,buttonClassName:r=`copy`,label:i=`Copy`,copiedLabel:a=`Copied!`,errorLabel:o=`Unable to copy`,resetDelay:s=1e3}={})=>{let c=[];return e.querySelectorAll(t).forEach(e=>{let t=e.querySelector(n);if(!t||k(e,r))return;let l=document.createElement(`button`);l.classList.add(r),l.type=`button`,l.textContent=i,l.addEventListener(`click`,async()=>{try{await navigator.clipboard.writeText(t.textContent??``),l.setAttribute(`aria-live`,`assertive`),l.textContent=a}catch{l.textContent=o}setTimeout(()=>{l.textContent=i,l.removeAttribute(`aria-live`)},s)}),e.appendChild(l),c.push(l)}),c})({blockSelector:`main .code-block`,copiedLabel:`Copied`});