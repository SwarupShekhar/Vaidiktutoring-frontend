import { NextResponse } from "next/server";

const INDEXNOW_KEY = "e272a10c1b024b8fba7381203356b95e";
const HOST = "studyhours.com";

// All indexable public URLs — submit after deploy or content update
const URLS_TO_SUBMIT = [
  "https://studyhours.com/",
  "https://studyhours.com/singapore/o-level-tutors-singapore",
  "https://studyhours.com/singapore/a-level-tutors-singapore",
  "https://studyhours.com/singapore/primary-school-tutors-singapore",
  "https://studyhours.com/singapore/psle-tutors-online",
  "https://studyhours.com/singapore/ip-programme-tutors-singapore",
  "https://studyhours.com/singapore/moe-singapore-curriculum-tutors",
  "https://studyhours.com/uae/moe-uae-curriculum-tutors",
  "https://studyhours.com/uae/online-tutors-dubai",
  "https://studyhours.com/uae/online-tutors-abu-dhabi",
  "https://studyhours.com/uae/physics-maths-tutor",
  "https://studyhours.com/saudi/saudi-ministry-curriculum-tutors",
  "https://studyhours.com/saudi/online-tutors-riyadh",
  "https://studyhours.com/australia/vce-online-tutoring",
  "https://studyhours.com/australia/hsc-online-tutoring",
  "https://studyhours.com/australia/qce-online-tutoring",
  "https://studyhours.com/australia/wace-online-tutoring",
  "https://studyhours.com/australia/atar-online-tutoring",
  "https://studyhours.com/australia/curriculum-tutoring",
  "https://studyhours.com/igcse-online-tutoring",
  "https://studyhours.com/gcse-online-tutoring",
  "https://studyhours.com/a-level-online-tutoring",
  "https://studyhours.com/ib-online-tutoring",
  "https://studyhours.com/k-12-online-tutoring",
];

// POST /api/indexnow — call this after deploying content changes.
// Requires Authorization header matching INDEXNOW_SUBMIT_SECRET env var.
export async function POST(request: Request) {
  const secret = request.headers.get("authorization");
  const expectedSecret = process.env.INDEXNOW_SUBMIT_SECRET;

  if (!expectedSecret || secret !== `Bearer ${expectedSecret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = {
    host: HOST,
    key: INDEXNOW_KEY,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    urlList: URLS_TO_SUBMIT,
  };

  const engines = [
    "https://api.indexnow.org/indexnow",
    "https://www.bing.com/indexnow",
  ];

  const results = await Promise.allSettled(
    engines.map((endpoint) =>
      fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json; charset=utf-8" },
        body: JSON.stringify(body),
      }).then((r) => ({ endpoint, status: r.status }))
    )
  );

  return NextResponse.json({
    submitted: URLS_TO_SUBMIT.length,
    results: results.map((r) =>
      r.status === "fulfilled" ? r.value : { error: r.reason?.message }
    ),
  });
}

// GET /api/indexnow — health check, returns key info only
export async function GET() {
  return NextResponse.json({
    key: INDEXNOW_KEY,
    keyLocation: `https://${HOST}/${INDEXNOW_KEY}.txt`,
    urlCount: URLS_TO_SUBMIT.length,
  });
}
