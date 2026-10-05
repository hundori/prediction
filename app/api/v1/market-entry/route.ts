function hasPositive(text:string, positive:RegExp, negative:RegExp){
  return positive.test(text) && !negative.test(text);
}

export async function POST(req:Request){
  const b=await req.json();
  const t=String(b.businessDescription||"").toLowerCase();

  const virtualAssetActivity=/stablecoin|virtual asset|crypto|wallet|token/.test(t);
  const koreanMarketNexus=/korean|korea|kr user|한국/.test(t);
  const custody=hasPositive(
    t,
    /(custod|hold[^.]{0,20}private key|control[^.]{0,20}private key)/,
    /(do not|don't|does not|doesn't|not)\s+(hold|store|control|custod)/
  );
  const krw=hasPositive(
    t,
    /(krw|korean won|won deposit|won withdrawal|merchant settlement)/,
    /(do not|don't|does not|doesn't|not)\s+(support|offer|accept|process|handle)[^.]{0,30}(krw|won)/
  );

  const findings:any[]=[];

  if(virtualAssetActivity){
    findings.push({
      ruleId:"KR-001 / KR-005–009",
      finding:"Virtual-asset and VASP perimeter must be tested by the actual functions performed, not by the product label alone.",
      legalState:"IN_FORCE",
      confidence:"확실",
      verificationStatus:"VERIFIED",
      sourceUrl:"https://law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1024562527"
    });
  }

  if(koreanMarketNexus){
    findings.push({
      ruleId:"KR-010",
      finding:"Offshore conduct can still fall within the Virtual Asset User Protection Act when its effects reach Korea.",
      legalState:"IN_FORCE",
      confidence:"확실",
      verificationStatus:"VERIFIED",
      sourceUrl:"https://www.law.go.kr/lsInfoP.do?lsId=014474"
    });
  }

  if(custody){
    findings.push({
      ruleId:"KR-008",
      finding:"Custody or management of customer virtual assets is expressly included in the statutory VASP definition.",
      legalState:"IN_FORCE",
      confidence:"확실",
      verificationStatus:"VERIFIED",
      sourceUrl:"https://law.go.kr/lsLinkCommonInfo.do?chrClsCd=010202&lsJoLnkSeq=1024562527"
    });
  }

  if(krw){
    findings.push({
      ruleId:"Payments workstream",
      finding:"KRW or merchant-settlement functionality requires a separate electronic-finance and payment perimeter review.",
      legalState:"IN_FORCE",
      confidence:"변호사 확인 필요",
      verificationStatus:"REVIEW_REQUIRED",
      sourceUrl:"https://www.law.go.kr/"
    });
  }

  if(virtualAssetActivity){
    findings.push({
      ruleId:"KR-100",
      finding:"Korean second-stage digital-asset legislation is still evolving. The FSC has stated that key stablecoin issuer terms are not finalized.",
      legalState:"PENDING",
      confidence:"법안 변동 가능",
      verificationStatus:"VERIFIED_STATUS_ONLY",
      sourceUrl:"https://www.fsc.go.kr/no010102/85997"
    });
  }

  return Response.json({
    apiVersion:"v1",
    schemaVersion:"2026-10-05.2",
    decisionModelVersion:"beta-0.4",
    asOf:"2026-10-05",
    decision:"REVIEW_REQUIRED",
    confidence: findings.some(x=>x.confidence==="확실") ? "MEDIUM" : "LOW",
    evidenceStrength: findings.length>=2 ? "MEDIUM" : "LOW",
    ambiguity: /custod|private key|krw|won|personal data|merchant|exchange|broker|remit|transfer/.test(t) ? "MEDIUM" : "HIGH",
    humanReviewRequired:true,
    assumptions:{
      virtualAssetOrTokenActivity:virtualAssetActivity,
      koreanMarketNexus,
      custodyOrPrivateKeyControl:custody,
      krwOrMerchantSettlement:krw
    },
    findings,
    nextActions:[
      "Map the exact transaction flow, customer location, responsible legal entity and custody/key-control model.",
      "Separate rules already in force from enacted-but-not-effective rules and pending bills.",
      "Open each cited source and verify the specific provision before relying on the result for a launch decision."
    ],
    disclaimer:"Decision-support information only. Not legal advice."
  });
}