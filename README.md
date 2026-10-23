# C56 · Durable, Scheduled and Event-driven Agents

Executes a local inbox/outbox admission model. It creates no OS schedule and sends no real webhook or provider message. Each run starts from a fresh local seed. The run journal stores results, not production workflow state.

## Concepts students will learn

- Authenticate triggers before admission
- Stable event identity and conflicting replay
- Persist session IDs before further dispatch

## Configure and run

Use Node.js 24 or later. In PowerShell, from this repository's folder:

```powershell
node --version
npm ci
Copy-Item .env.example .env
notepad .env
```

No API key is required for the local experiment. Optional live commentary requires your own API key, agent ID and environment ID. It explains the local result; it does not activate the integration discussed in the lesson.

For the optional live path, set your API key, then run npm run setup if you do not already have resource IDs. The script creates the environment before a text-only agent, saves each ID immediately, and reuses IDs already configured. It uses CLAUDE_MODEL or the source default; choose a model available to your account. An uncertain network failure may have created a resource: inspect your account before retrying.

```powershell
npm start
```

Open `http://127.0.0.1:3056`. Navigation leads to `/guide.html#learning`, `/guide.html#run-guide`, `/architecture.html`, and the application lab. If you change `PORT`, use the configured port. Keep the terminal running; stop with Ctrl+C. `npm run dev` also starts the web application.

Select the first scenario, inspect its editable fields, press Run experiment, and compare the outcome and evidence with the table above. Select another scenario to investigate the boundary condition.

## Create your .env file

Copy `.env.example` to `.env` and enter your own values. Do not commit the real file. Restart the server after editing it. The example contains safe placeholders; optional settings may be left blank to use source defaults. Resource IDs and keys stay on the server.

```dotenv
ANTHROPIC_API_KEY=your_api_key
CLAUDE_MANAGED_AGENT_ID=your_agent_id
CLAUDE_MANAGED_ENVIRONMENT_ID=your_environment_id
PORT=3056
```

The snapshot below uses the current local file's variable names. Every non-PORT value, including IDs, is redacted **before** rendering the image.

![Sanitized local .env configuration](docs/images/env-redacted.png)

Regenerate it locally with `python scripts/capture-env-example.py` after installing Python Playwright and its Chromium browser. This optional documentation tool is not needed to run the app.

## How the application was developed

The browser collects inputs; the Node host validates requests; the lesson implementation produces observable evidence. The architecture page walks through the real source with numbered steps, prerequisite configuration, source filenames and code excerpts.

### Lesson implementation

[src/lesson.ts](https://github.com/luiscoco/Udemy-claude-managed-agents-lesson-c56-app/blob/main/src/lesson.ts)

```typescript
  async run(input) {

const eventId=text(input,"eventId"),resourceId=text(input,"resourceId");if(!/^[A-Za-z0-9_-]{1,100}$/.test(eventId))throw new Error("Invalid event ID");
if(!["doc-1","doc-2"].includes(resourceId))return report("rejected","Trigger resource is not authorized",{jobs:0},["Authenticate the issuer","Check the host resource allowlist"]);
const key=JSON.stringify(["demo-tenant","trusted-demo-issuer",eventId]);
if(resourceId!==text(input,"replayResourceId"))return report("conflict","A stable event key was replayed with different content",{jobs:1,key},["Claim one inbox record","Reject a conflicting replay"]);
return report("passed","Admitted one job for repeated identical delivery",{jobs:1,key,phase:"queued",providerSessionsCreated:0},["Authorize the trigger resource","Deduplicate by tenant, issuer and event","Persist the job before dispatch","Reconcile uncertain creation before retry"]);

  }
};
```

Read the architecture page for the remaining source excerpts and explanations, including input handling and optional provider behavior. The diagram describes this application, rather than implying that an external integration has been implemented.

## Validation

```powershell
npm test
python scripts/verify-walkthrough.py
```

The source hash check detects when walkthrough excerpts need refreshing. Browser verification covers page navigation, readable text, mobile layout, dark mode, diagram and image routes. Local scenarios and live provider calls are recorded separately in the workspace verification report; local success is not evidence of a live provider operation.

## Repository contents

Application sources, student web pages, safe configuration example and documentation images are included. `node_modules`, `presentation`, `output`, `reviewed`, `v3`, `teaching-material`, build output, local journals, credentials and local resource files are ignored. Existing teaching videos and presentations remain in the original workspace.
