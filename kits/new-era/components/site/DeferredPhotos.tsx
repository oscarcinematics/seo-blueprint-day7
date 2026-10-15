// Native lazy loading can fetch every horizontal gallery strip immediately.
// Start these images 600px before they enter view. Shot retains a complete
// noscript picture, including alt text and WebP fallback, for non-JS visitors.
const loader = `(function(){function init(){
var photos=document.querySelectorAll('[data-deferred-photo]');
function load(p){p.querySelectorAll('source[data-srcset]').forEach(function(s){s.srcset=s.dataset.srcset;s.removeAttribute('data-srcset')});
var i=p.querySelector('img');i.loading='eager';i.srcset=i.dataset.srcset;i.src=i.dataset.src;i.removeAttribute('data-src');i.removeAttribute('data-srcset');p.removeAttribute('data-deferred-photo')}
if(!('IntersectionObserver' in window)){photos.forEach(load);return}
var observer=new IntersectionObserver(function(entries){entries.forEach(function(e){if(e.isIntersecting){load(e.target.parentElement);observer.unobserve(e.target)}})},{rootMargin:'600px'});
photos.forEach(function(p){observer.observe(p.querySelector('img'))})
}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init()})();`;

export default function DeferredPhotos() {
  return <>
    <style>{'[data-deferred-photo] img:not([src]){visibility:hidden}'}</style>
    <noscript><style>{'[data-deferred-photo]{display:none!important}'}</style></noscript>
    <script dangerouslySetInnerHTML={{ __html: loader }} />
  </>;
}
