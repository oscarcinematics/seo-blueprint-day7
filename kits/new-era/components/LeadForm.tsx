import { site, telHref } from "@/lib/site.config";

// Every lead form on the site is wrapped in this.
//
// The post goes to Web3Forms, which emails it to the address the access key
// was made for, with reply-to set to the customer. The key is public by
// design (Web3Forms keys only allow sending to their own inbox), so it ships
// in the page as NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY, set in .env.local and in
// the Vercel project. Make one at web3forms.com with the owner's email.
//
// WITHOUT A KEY THE FORM REFUSES TO SEND and tells the visitor to call
// instead. Deliberately loud: a lead vanishing silently is the worst thing a
// quote page can do.
//
// The field markup stays in each page as children, so this adds behaviour
// without touching any page's styling. The .h-lead class gives any fields
// inside the shared underline style (app/brand.css part 4).
//
// WHY THIS IS A RAW <script> AND NOT A CLIENT COMPONENT
// See the same note in components/HomeReveal.tsx. Short version: a "use
// client" form pulls ~200KB of React runtime and RSC payload onto every page
// for a form submit, and costs the money pages several Lighthouse points.

const ENDPOINT = "https://api.web3forms.com/submit";
const KEY = process.env.NEXT_PUBLIC_WEB3FORMS_ACCESS_KEY || "";

// JSON is a subset of JS, so this is safe to drop into a script body - except
// that a literal "</script>" inside a string would close the tag early. None of
// the values below contain one today; escaping the "<" keeps that true if one
// ever does.
const js = (v: unknown) => JSON.stringify(v ?? null).replace(/</g, "\\u003c");

// Finds its own form via document.currentScript.previousElementSibling: the
// script is emitted immediately after the </form> it belongs to, so no ids are
// needed and two forms on one page could not collide.
//
// The error paragraph is created on demand rather than rendered empty, exactly
// as the conditional JSX did. Inserting (or retexting) a role="alert" element
// is what makes a screen reader announce it, so building it lazily is not just
// parity, it is the behaviour that works.
const formScript = (subject: string) => `(function(){var f=document.currentScript.previousElementSibling;
var S=${js(subject)},PH=${js(site.phone)},TEL=${js(telHref)},K=${js(KEY)};
var sending=false,err=null;
function show(m){if(!err){err=document.createElement("p");err.setAttribute("role","alert");
err.style.cssText="margin:0;font-size:14px;line-height:1.5;color:var(--status-critical)";
var a=document.createElement("a");a.href=TEL;a.style.cssText="color:inherit;font-weight:700";
a.textContent="Call now";err.appendChild(document.createTextNode(""));err.appendChild(a);
f.appendChild(err)}err.firstChild.nodeValue=m+" "}
function clear(){if(err){err.remove();err=null}}
function lock(v){sending=v;var s=f.querySelector("fieldset");if(s)s.disabled=v}
f.addEventListener("submit",function(ev){ev.preventDefault();if(sending)return;
if(!K){show("This form is not connected yet. Please call "+PH+" instead.");return}
var d=new FormData(f);
d.append("access_key",K);d.append("subject",S);d.append("from_name",${js(site.name + " website")});
d.append("page",location.pathname);
lock(true);clear();
fetch(${js(ENDPOINT)},{method:"POST",body:d}).then(function(res){
return res.json().catch(function(){return null}).then(function(j){
if(!res.ok||!j||!j.success)throw 0;location.assign("/thank-you")})}).catch(function(){
show("Something went wrong sending that. Please call "+PH+" instead.");lock(false)})})})();`;

export default function LeadForm({
  children,
  subject,
  style,
}: {
  children: React.ReactNode;
  subject: string;
  style?: React.CSSProperties;
}) {
  return (
    <>
      <form className="h-lead" method="POST" style={style}>
        {/* Honeypot: invisible to people, irresistible to bots. Web3Forms
            drops any submission where a field named botcheck is filled in. */}
        <input type="checkbox" name="botcheck" tabIndex={-1} autoComplete="off" aria-hidden="true" style={{ display: "none" }} />
        <fieldset style={{ border: 0, margin: 0, padding: 0, display: "contents" }}>{children}</fieldset>
      </form>
      <script dangerouslySetInnerHTML={{ __html: formScript(subject) }} />
    </>
  );
}
