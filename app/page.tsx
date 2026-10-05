"use client";
import {useEffect,useMemo,useState} from "react";

const STATE_LABEL:any={
  IN_FORCE:"시행 중",
  ENACTED_NOT_EFFECTIVE:"공포·미시행",
  PROPOSED:"입법 제안",
  PENDING:"계류·정책협의"
};

export default function Home(){
  const [text,setText]=useState("We are a US fintech company offering a non-custodial USD stablecoin wallet to Korean users. We do not hold private keys and do not support KRW deposits or withdrawals.");
  const [result,setResult]=useState<any>(null);
  const [rules,setRules]=useState<any[]>([]);
  const [q,setQ]=useState("");
  const [status,setStatus]=useState("");

  useEffect(()=>{fetch("/api/v1/rules").then(r=>r.json()).then(d=>setRules(d.rules||[]));},[]);

  async function run(){
    const r=await fetch("/api/v1/market-entry",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({businessDescription:text})});
    setResult(await r.json());
  }

  const filtered=useMemo(()=>rules.filter(r=>{
    const hay=[r.rule_id,r.title,r.category,r.law_name,r.article,r.regulator].join(" ").toLowerCase();
    return (!q||hay.includes(q.toLowerCase()))&&(!status||r.legal_state===status);
  }),[rules,q,status]);

  const verified=rules.filter(r=>r.verification_status==="VERIFIED").length;

  return <main>
    <header className="hero">
      <nav><a className="brand" href="/" aria-label="Korea Fintech Entry Intelligence"><img src="/kfei-logo.svg" alt="Korea Fintech Entry Intelligence"/></a><span>Assessment · Evidence Rules · Legislative Watch · API</span></nav>
      <div className="heroGrid">
        <section>
          <small>EVIDENCE-BASED REGULATORY INTELLIGENCE</small>
          <h1>Enter Korea with evidence, not assumptions.</h1>
          <p>For digital assets, payments, tokenized finance and fintech. Every rule exposes its legal state, cited basis, source and verification status.</p>
          <div className="heroActions">
            <button onClick={()=>document.getElementById("assess")?.scrollIntoView({behavior:"smooth"})}>Assess a business model →</button>
            <a href="/openapi.json">OpenAPI specification</a>
          </div>
        </section>
        <aside>
          <div><b>{rules.length||"—"}</b><span>unique evidence rules</span></div>
          <div><b>8</b><span>digital-finance domains</span></div>
          <div><b>{verified||"—"}</b><span>directly verified rules</span></div>
          <div><b>4</b><span>legal-state classes</span></div>
        </aside>
      </div>
    </header>

    <section className="strip"><span>Official-source linked</span><span>Legal-state separated</span><span>Verification visible</span><span>Decision support, not legal advice</span></section>

    <section id="assess" className="section">
      <div className="intro"><div><small>MARKET ENTRY ASSESSMENT</small><h2>A preliminary decision with confidence and evidence.</h2></div><p>No black-box entry score. The output shows assumptions, evidence strength, ambiguity and where human legal review is still required.</p></div>
      <div className="assessment">
        <div><textarea value={text} onChange={e=>setText(e.target.value)}/><button onClick={run}>RUN KOREA ENTRY ASSESSMENT</button></div>
        <div className="output">{result?<>
          <label>PRELIMINARY DECISION</label><h3>{result.decision}</h3>
          <div className="metrics"><b>Confidence {result.confidence}</b><b>Evidence {result.evidenceStrength}</b><b>Ambiguity {result.ambiguity}</b></div>
          {result.findings.map((x:any,i:number)=><div className="finding" key={i}><strong>{x.ruleId}</strong><p>{x.finding}</p><span>{STATE_LABEL[x.legalState]||x.legalState} · {x.confidence}</span><a href={x.sourceUrl} target="_blank">Official source ↗</a></div>)}
          <p className="warning">Human review required: {String(result.humanReviewRequired)}</p>
        </>:<p>Run an assessment to see evidence-linked output.</p>}</div>
      </div>
    </section>

    <section className="watch section">
      <div className="intro"><div><small>LEGISLATIVE WATCH</small><h2>Current law and future law are kept separate.</h2></div><p>Only official-source facts are treated as verified. Unverified bill claims are not promoted into current rules.</p></div>
      <div className="watchGrid">
        <article><span>공포·미시행</span><h3>Token securities framework</h3><p>Capital Markets Act implementation is scheduled for 4 February 2027. FSC subordinate-rule notices were published on 2 October 2026.</p><a href="https://www.fsc.go.kr/po040301/view?noticeId=4180" target="_blank">FSC official notice ↗</a></article>
        <article><span>계류·정책협의</span><h3>Digital-asset second-stage legislation</h3><p>The FSC has publicly stated that key terms including stablecoin issuer eligibility have not yet been finalized.</p><a href="https://www.fsc.go.kr/no010102/85997" target="_blank">FSC official explanation ↗</a></article>
      </div>
    </section>

    <section className="dark section">
      <div className="intro"><div><small>EVIDENCE RULE LIBRARY</small><h2>{rules.length||100} unique decision rules.</h2></div><p>Search by activity, law, article, regulator or legal state. Rules requiring further verification are labeled openly.</p></div>
      <div className="filters"><input className="search" placeholder="Search stablecoin, KYC, custody, privacy, law…" value={q} onChange={e=>setQ(e.target.value)}/><select value={status} onChange={e=>setStatus(e.target.value)}><option value="">All legal states</option><option value="IN_FORCE">시행 중</option><option value="ENACTED_NOT_EFFECTIVE">공포·미시행</option><option value="PROPOSED">입법 제안</option><option value="PENDING">계류·정책협의</option></select></div>
      <div className="rules">{filtered.slice(0,40).map(r=><article key={r.rule_id}>
        <div className="ruleTop"><span>{r.rule_id}</span><i>{STATE_LABEL[r.legal_state]||r.legal_state}</i></div>
        <h3>{r.title}</h3>
        <p className="category">{r.category}</p>
        <dl><dt>법률</dt><dd>{r.law_name||"—"}</dd><dt>조문</dt><dd>{r.article||"—"}</dd><dt>감독기관</dt><dd>{r.regulator||"—"}</dd><dt>시행일</dt><dd>{r.effective_date||"확인 필요"}</dd><dt>검증</dt><dd>{r.verification_status} · {r.confidence_label}</dd><dt>마지막 확인</dt><dd>{r.last_checked}</dd></dl>
        {r.official_source_url?<a href={r.official_source_url} target="_blank">Official source ↗</a>:<span className="noSource">Source verification required</span>}
      </article>)}</div>
      {filtered.length>40&&<p className="more">Showing 40 of {filtered.length}. Use search or API for the full set.</p>}
    </section>

    <section className="section apiBlock"><small>API</small><h2>Machine-readable evidence, not just a chatbot answer.</h2><p><code>GET /api/v1/rules</code> · <code>POST /api/v1/market-entry</code> · <code>GET /openapi.json</code></p><a href="/openapi.json">View API specification →</a></section>
    <footer>Source-linked beta. A VERIFIED label means the cited proposition was checked against the stated official source; REVIEW_REQUIRED means it must not be treated as a verified legal conclusion. Last dataset check: 2026-10-05.</footer>
  </main>
}