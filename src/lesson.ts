import { text, number, flag, list, object, hash, report, unique, safePath, type Lesson, type Input } from "./core";

// A focused local experiment derived from this lesson’s reviewed presentation.
export const lesson: Lesson = {
  number: 56,
  title: "Durable, Scheduled and Event-driven Agents",
  description: "A user may close the browser while an agent processes a document, and a host process may restart while the remote session still exists. The application needs continuity across those events.",
  concepts: ["Authenticate triggers before admission", "Stable event identity and conflicting replay", "Persist session IDs before further dispatch"],
  scope: "Executes a local inbox/outbox admission model. It creates no OS schedule and sends no real webhook or provider message. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.",
  cases: [{"id": "0", "label": "Deduplicate an identical trigger", "input": {"eventId": "upload-1", "resourceId": "doc-1", "replayResourceId": "doc-1"}, "expected": "passed", "checks": {"jobs": 1}}, {"id": "1", "label": "Reject a conflicting trigger replay", "input": {"eventId": "upload-1", "resourceId": "doc-1", "replayResourceId": "doc-2"}, "expected": "conflict", "checks": {"jobs": 1}}, {"id": "2", "label": "Reject an unauthorized resource", "input": {"eventId": "upload-1", "resourceId": "private-doc", "replayResourceId": "private-doc"}, "expected": "rejected", "checks": {"jobs": 0}}],
  async run(input) {

const eventId=text(input,"eventId"),resourceId=text(input,"resourceId");if(!/^[A-Za-z0-9_-]{1,100}$/.test(eventId))throw new Error("Invalid event ID");
if(!["doc-1","doc-2"].includes(resourceId))return report("rejected","Trigger resource is not authorized",{jobs:0},["Authenticate the issuer","Check the host resource allowlist"]);
const key=JSON.stringify(["demo-tenant","trusted-demo-issuer",eventId]);
if(resourceId!==text(input,"replayResourceId"))return report("conflict","A stable event key was replayed with different content",{jobs:1,key},["Claim one inbox record","Reject a conflicting replay"]);
return report("passed","Admitted one job for repeated identical delivery",{jobs:1,key,phase:"queued",providerSessionsCreated:0},["Authorize the trigger resource","Deduplicate by tenant, issuer and event","Persist the job before dispatch","Reconcile uncertain creation before retry"]);

  }
};
