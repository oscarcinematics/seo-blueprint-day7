// The site's motion, one small script on every page. What it does:
//
//   arm       adds .h-on to the page wrapper at once (the script is running),
//             and .h-js unless reduced motion is on. .h-js is the only thing
//             that arms the hidden starting states in brand.css, so with JS
//             off or reduced motion on, nothing is ever hidden. Both are added
//             while the page is still parsing, so nothing paints and then
//             blinks out (the hidden states also need .is-wait, see below).
//   reveals   .h-rv blocks fade and rise the first time they enter the screen
//             (.is-in). Only blocks BELOW the first screen are hidden first
//             (.is-wait); blocks already on screen get .is-now, a
//             transform-only settle, so they paint at once and never hold
//             back the page's Largest Contentful Paint. Blocks inside .h-stagger or .h-faqs that arrive
//             together are numbered (--d) so they follow each other 90ms apart.
//   split     [data-split] headings: every word is wrapped in span.sw > span.si
//             and rises from behind its own mask (--i). Whitespace and nested
//             elements are kept as they are, so the heading text is unchanged.
//   frames    .h-frame photo wrappers (and the older .n-split-ph family) wipe
//             open, then the photo drifts inside the frame while it is on
//             screen (--py, strength data-par, default .06, 0 is off). Any
//             other [data-par] element drifts the same way.
//   scenes    [data-scene] elements get three scroll-progress numbers, written
//             as custom properties every frame while they are near the screen.
//             Pages choreograph their own motion from these in CSS with calc(),
//             so every section can move its own way off one engine:
//               --p    0 as the element's top meets the bottom of the screen,
//                      1 as its bottom leaves the top (the whole pass)
//               --pin  0 to 1 across the stretch where a tall element's
//                      position:sticky stage is pinned (top at 0 until its
//                      bottom reaches the bottom of the screen). Equals --p
//                      for an element no taller than the screen.
//               --in   0 as the top enters at the bottom, 1 once the top is a
//                      quarter of the way down (the arrival)
//             Children read the nearest scene's values. Scene styles belong
//             under .h-js in the CSS, so with JS off or reduced motion the
//             finished layout shows and nothing is pinned.
//   hold      [data-hold] elements get --hh, their own height in px (kept
//             current by a ResizeObserver) and the class .is-held, so CSS can
//             pin a block by its FOOT: sticky, top min(0px, 100svh - --hh).
//             They also get --cv, 0 as the next element's top meets the
//             bottom of the screen, 1 as it reaches the top: how far the
//             next section has slid up over the held one (the curtain).
//   hero      .h-hero gets .is-ready once the page has loaded. Its [data-split]
//             headings are marked .is-now, never .is-wait: the h1 paints in
//             the first frame and its words only nudge into place. At the
//             same moment the eager photos just under a Cover (Shot `eager`)
//             are decoded ahead, so Chrome does not decode them mid-scroll
//             and draw their squares blank for a frame (gallery, 13 Oct 2026).
//   cover     each Cover photo window (.h-cv-ph) gets .is-lit once its photo
//             has loaded and decoded, so the photo fades up over the night
//             ground instead of cutting in over an empty window. A photo
//             already complete gets .is-snap too: lit at once, no fade.
//   header    .h-head gets .is-scrolled past 40px, and .is-hidden while
//             scrolling down, so it comes back on the way up. Escape closes
//             the phone menu.
//   reload    a reload lands part way down the page, so the first painted
//             frame must already be the right frame for that spot. Every
//             scene and drift is measured once before the first paint, not
//             only after the observers report in a frame later, and the
//             header takes its scrolled size with its transitions off
//             (.h-snap), so nothing snaps or slides once the page shows.
//   smooth    .h-smooth on <html> turns on smooth in-page jumps (ds.css), at
//             the first click or key press and not before: the browser
//             restores a reload's scroll position AS a scroll, and with
//             smooth on it animates down from the top of the page, playing
//             every scene in fast forward.
//
// Everything visual it touches is transform, opacity or clip-path, read off
// one scroll handler batched into requestAnimationFrame, and only for the
// elements currently on screen (IntersectionObserver). If the script dies
// half way, a timer takes .h-js back off so nothing stays hidden.
//
// ⛔ WHY THIS IS A RAW <script> AND NOT A CLIENT COMPONENT
// A client component costs the whole React runtime: ~100KB of chunks plus
// ~110KB of inline RSC flight payload on every page. Measured on
// the service template page: 91 performance with it, 97 without. The
// runtime is stripped from the export by scripts/strip-next-runtime.mjs and
// the site's behaviour is plain script instead. Nothing hydrates.
//
// The arming runs inline as the script is parsed: it sits at the TOP of
// <main>, so the .h-page wrapper above it already exists. Everything else
// waits for DOMContentLoaded, because the elements below do not exist yet.
import HomeRevealDev from "./HomeRevealDev";

const REVEAL_JS = `(function(){var D=document,W=window,p=D.querySelector(".h-page");if(!p||p.classList.contains("h-on"))return;
var RM=matchMedia("(prefers-reduced-motion: reduce)").matches,ok=false;
p.classList.add("h-on");if(!RM&&"IntersectionObserver" in W)p.classList.add("h-js");
setTimeout(function(){if(!ok)p.classList.remove("h-js")},6000);
function r(){
var vh=innerHeight,head=D.querySelector(".h-head"),menu=head&&head.querySelector(".h-menu"),lastY=scrollY,js=p.classList.contains("h-js");
function q(s,c){return Array.prototype.slice.call((c||p).querySelectorAll(s))}
function cl(v,a,b){return v<a?a:v>b?b:v}
var ticking=false,jobs=[];
function frame(){ticking=false;var y=scrollY;
if(head){var open=menu&&menu.open,hh=head.offsetHeight;head.classList.toggle("is-scrolled",y>40);
if(!RM&&!open&&y>lastY+2&&y>hh*2&&!head.contains(D.activeElement))head.classList.add("is-hidden");
else if(open||y<lastY-2||y<=hh*2)head.classList.remove("is-hidden")}
lastY=y;for(var i=0;i<jobs.length;i++)jobs[i]()}
function req(){if(!ticking){ticking=true;requestAnimationFrame(frame)}}
addEventListener("scroll",req,{passive:true});
addEventListener("resize",function(){vh=innerHeight;if(menu&&menu.open&&innerWidth>999)menu.open=false;req()});
if(menu){D.addEventListener("keydown",function(e){if(e.key==="Escape"&&menu.open){menu.open=false;menu.querySelector("summary").focus()}});
q(".h-links a",head).forEach(function(a){a.addEventListener("click",function(){menu.open=false})})}
function sm(){D.documentElement.classList.add("h-smooth")}addEventListener("pointerdown",sm,{once:true});addEventListener("keydown",sm,{once:true});
function go(){if(head)head.classList.add("h-snap");frame();if(head){void head.offsetWidth;head.classList.remove("h-snap")}ok=true}
function ready(){q(".h-hero").forEach(function(h){h.classList.add("is-ready")});
q('img[loading="eager"]:not([fetchpriority])').forEach(function(i){if(i.decode)i.decode().catch(function(){})})}
if(D.readyState==="complete")ready();else{addEventListener("load",ready);setTimeout(ready,2500)}
if(!js){go();return}
q(".h-cv-ph").forEach(function(f){var im=f.querySelector("img"),lit=function(){f.classList.add("is-lit")},once=false;
if(!im||im.complete){f.classList.add("is-snap");lit();return}
im.addEventListener("load",function(){if(once)return;once=true;(im.decode?im.decode():Promise.resolve()).then(lit,lit)});
im.addEventListener("error",lit);setTimeout(lit,4000)});

var o=new IntersectionObserver(function(es){var n=new Map();es.forEach(function(e){if(!e.isIntersecting)return;
var t=e.target,g=t.parentElement;if(g&&(g.classList.contains("h-stagger")||g.classList.contains("h-faqs"))){var k=n.get(g)||0;t.style.setProperty("--d",k);n.set(g,k+1)}
t.classList.add("is-in");o.unobserve(t)})},{rootMargin:"0px 0px -8% 0px"});
function hero(el){return el.closest(".h-hero")}
var first=new Map();function arm(n){var b=n.getBoundingClientRect();if(b.top<vh&&b.bottom>0){var g=n.parentElement;
if(g&&(g.classList.contains("h-stagger")||g.classList.contains("h-faqs"))){var k=first.get(g)||0;n.style.setProperty("--d",k);first.set(g,k+1)}
n.classList.add("is-now")}else{n.classList.add("is-wait");o.observe(n)}}

q("[data-split]").forEach(function(el){var tw=D.createTreeWalker(el,4),ns=[],t,i=0;while(t=tw.nextNode())ns.push(t);
ns.forEach(function(t){if(!/\\S/.test(t.nodeValue))return;var f=D.createDocumentFragment();
t.nodeValue.split(/(\\s+)/).forEach(function(s){if(!s)return;if(/^\\s+$/.test(s)){f.appendChild(D.createTextNode(s));return}
var w=D.createElement("span"),c=D.createElement("span");w.className="sw";c.className="si";c.textContent=s;c.style.setProperty("--i",i++);w.appendChild(c);f.appendChild(w)});
t.parentNode.replaceChild(f,t)});if(hero(el))el.classList.add("is-now");else arm(el)});

q(".h-stagger>*").forEach(function(c){if(!c.classList.contains("h-frame"))c.classList.add("h-rv")});
q(".h-rv").forEach(function(n){if(n.classList.contains("h-frame")||n.matches(".n-split-ph,.n-svc-ph,.n-row-ph,.n-shot,.n-post-ph,.n-hub-ph,.n-work>*"))return;if(hero(n))n.classList.add("is-wait");else arm(n)});

var par=[];
q(".h-frame,.n-split-ph,.n-svc-ph,.n-row-ph,.n-shot,.n-post-ph,.n-hub-ph,.n-work>*").forEach(function(f){f.classList.add("h-frame");
var a=f.getAttribute("data-par"),k=a===null?.06:(+a||0);f.style.setProperty("--pk",k);arm(f);if(k)par.push({el:f,k:k})});
q("[data-par]").forEach(function(f){if(!f.classList.contains("h-frame")&&+f.getAttribute("data-par"))par.push({el:f,k:+f.getAttribute("data-par")})});
var vis=new Set(),io=new IntersectionObserver(function(es){es.forEach(function(e){
var it=par.filter(function(x){return x.el===e.target})[0];if(e.isIntersecting)vis.add(it);else vis.delete(it)});req()},{rootMargin:"20% 0px"});
par.forEach(function(x){vis.add(x);io.observe(x.el)});
jobs.push(function(){vis.forEach(function(x){var b=x.el.getBoundingClientRect(),
t=cl((b.top+b.height/2-vh/2)/(vh/2+b.height/2),-1,1);x.el.style.setProperty("--py",(-t*b.height*x.k).toFixed(1)+"px")})});

var sc=q("[data-scene]"),sv=new Set(),so=new IntersectionObserver(function(es){es.forEach(function(e){
if(e.isIntersecting)sv.add(e.target);else sv.delete(e.target)});req()},{rootMargin:"25% 0px"});
sc.forEach(function(s){sv.add(s);so.observe(s)});
function put(s,k,v){v=v.toFixed(4);if(s["_"+k]!==v){s["_"+k]=v;s.style.setProperty(k,v)}}
jobs.push(function(){sv.forEach(function(s){var b=s.getBoundingClientRect(),h=b.height,
P=cl((vh-b.top)/(vh+h),0,1);put(s,"--p",P);put(s,"--pin",h>vh+1?cl(-b.top/(h-vh),0,1):P);put(s,"--in",cl((vh-b.top)/(vh*.75),0,1))})});

var hd=q("[data-hold]");function hsz(){hd.forEach(function(e){e.style.setProperty("--hh",e.offsetHeight+"px");e.classList.add("is-held")})}
if(hd.length){hsz();if("ResizeObserver" in W){var ro=new ResizeObserver(hsz);hd.forEach(function(e){ro.observe(e)})}else addEventListener("resize",hsz);
jobs.push(function(){hd.forEach(function(e){var n=e.nextElementSibling;if(n)put(e,"--cv",cl((vh-n.getBoundingClientRect().top)/vh,0,1))})})}

go()}
if(D.readyState==="loading")D.addEventListener("DOMContentLoaded",r);else r()})();`;

// ⛔ Dev server only: run the same script after hydration instead, or React
// reports a mismatch on every block the script has already touched. See
// HomeRevealDev.tsx. The production export is unaffected.
//
// Hydration takes about half a second on `next dev`, and until then the page
// sat in its unarmed layout (the homepage hero is 100svh there, 210vh armed),
// then jumped, and a reload restored its scroll against the wrong layout.
// DEV_ARM runs while the page parses, as production does: it puts .h-js on
// <html> (React checks .h-page's class, but <html> has suppressHydrationWarning
// in app/layout.tsx), so every `.h-js x` rule lays the page out armed from the
// first paint, and DEV_CSS keeps .h-page hidden until the real script has run
// (.h-on), so the first frame shown is the production first frame. A timer
// shows the page anyway if the script never runs.
const DEV_ARM = `(function(){var c=document.documentElement.classList;if(matchMedia("(prefers-reduced-motion: reduce)").matches||!("IntersectionObserver" in window))return;c.add("h-js","h-dev");setTimeout(function(){c.remove("h-dev")},4000)})();`;
const DEV_CSS = ".h-dev .h-page:not(.h-on){visibility:hidden}";

export default function HomeReveal() {
  if (process.env.NODE_ENV === "development")
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: DEV_CSS }} />
        <script dangerouslySetInnerHTML={{ __html: DEV_ARM }} />
        <HomeRevealDev js={REVEAL_JS} />
      </>
    );
  return <script dangerouslySetInnerHTML={{ __html: REVEAL_JS }} />;
}
