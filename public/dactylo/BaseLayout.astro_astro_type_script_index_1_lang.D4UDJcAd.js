var e=`dactylo-style`,t=`script,style,noscript,template,textarea,input,select,option,[data-dactylo-skip],[data-dactylo-original],[data-dactylo-output]`,n=[{sels:`h1,h2,h3,h4,h5,h6`,duration:600,parallel:!0},{sels:`p,li,dt,dd,figcaption,blockquote,pre,th,td,caption`,parallel:!0},{sels:`code,a,button,label,summary,mark`,parallel:!0}],r=`_`,i=`>`,a=600,o=500,s=e=>e??globalThis.document?.body??null,c=e=>`ownerDocument`in e&&e.ownerDocument?e.ownerDocument:`nodeType`in e&&e.nodeType===e.DOCUMENT_NODE?e:globalThis.document??null,l=e=>Array.isArray(e)?e.join(`,`):e,u=e=>new Promise(t=>setTimeout(t,e)),d=e=>e.reduce((e,t)=>e.then(t),Promise.resolve()),f=(e,t)=>{t.dispatchEvent(new CustomEvent(e,{bubbles:!0,cancelable:!0}))},p=(e,n,r=[])=>{let i=l(n),a=globalThis.HTMLElement&&e instanceof HTMLElement&&e.matches(i)&&!e.closest(t)?[e]:[],o=Array.from(e.querySelectorAll(i));return[...a,...o].filter((e,n,i)=>i.indexOf(e)===n&&!e.closest(t)&&!r.some(t=>e.closest(t))&&e.innerText.trim()!==``)},m=(e,t)=>{let n=e.createElement(`span`);return n.classList.add(`dactylo__output`),n.dataset.dactyloOutput=``,n.dataset.dactyloCaret=t,n},h=e=>{let t=e.ownerDocument.createElement(`span`),n=e.innerHTML;return e.classList.add(`dactylo--typing`),t.classList.add(`dactylo__original`),t.dataset.dactyloOriginal=``,t.innerHTML=n,e.replaceChildren(t),{element:e,original:t,originalHtml:n}},g=({element:e,originalHtml:t})=>{e.innerHTML=t,e.classList.remove(`dactylo--typing`,`dactylo--caret`)},_=(e,t,n,r,i)=>{let a=(Date.now()-e)/t,o=a>1?n.length:Math.floor(a*n.length);return i.textContent=n.slice(0,o+1).join(``),i.append(r.element.ownerDocument.createElement(`wbr`)),o<n.length?!0:(g(r),!1)},v=(e,t,n)=>new Promise(r=>{let i=Array.from(e.element.innerText),a=Date.now(),s=t.interval===void 0?t.duration??o:i.length*t.interval,c=m(e.element.ownerDocument,n.caret);e.element.append(c);let l=()=>{if(_(a,s,i,e,c)){requestAnimationFrame(l);return}r()};requestAnimationFrame(l)}),y=async(e,t)=>{if(!e)return;let n=m(e.element.ownerDocument,t.caret);n.textContent=t.prompt,e.element.append(n),e.element.classList.add(`dactylo--caret`),await u(t.startDelay),n.remove(),e.element.classList.remove(`dactylo--caret`)},b=(e,t,n,r)=>{let i=p(t,e.sels,e.notIn).map(e=>n.get(e)).filter(e=>e!==void 0).map(t=>()=>v(t,e,r));return e.parallel?Promise.all(i.map(e=>e())):d(i)},x=(t=globalThis.document)=>{if(!t||t.getElementById(e))return;let n=t.createElement(`style`);n.id=e,n.textContent=`
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
	`,t.head.append(n)},S=e=>{let t=s(e);if(t)for(let e of Array.from(t.querySelectorAll(`.dactylo--typing`)))e.innerHTML=e.querySelector(`[data-dactylo-original]`)?.innerHTML??e.innerHTML,e.classList.remove(`dactylo--typing`,`dactylo--caret`)},C=(e,t={})=>{let o=e&&`querySelectorAll`in e?e:e?.root,l=e&&`querySelectorAll`in e?t:e??t,u=s(o),m=u?c(u):null,g=l.groups??n,_=l.caret??r,v=l.prompt??i,C=l.startDelay??a,w=u?g.flatMap(e=>p(u,e.sels,e.notIn)):[],T=[...new Set(w)],E=new Map(T.map(e=>[e,h(e)]));return!m||!u?{elements:[],finished:Promise.resolve(),root:u,reset:()=>void 0}:(x(m),m.documentElement.classList.remove(`dactylo--end`),m.documentElement.classList.add(`dactylo--active`),f(`dactylo:start`,m.documentElement),{elements:T,finished:d([()=>y(E.values().next().value,{caret:_,prompt:v,startDelay:C}),...g.map(e=>()=>b(e,u,E,{caret:_}))]).then(()=>{m.documentElement.classList.remove(`dactylo--active`),m.documentElement.classList.add(`dactylo--end`),f(`dactylo:end`,m.documentElement)}),root:u,reset:()=>S(u)})};typeof window<`u`&&(window.dactylo=C,window.injectDactyloStyles=x,window.resetDactylo=S);var w=()=>{C(document.body)};document.readyState===`loading`?document.addEventListener(`DOMContentLoaded`,w,{once:!0}):w();