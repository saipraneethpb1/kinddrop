# KindDrop

**Turn what you already have into one small act of generosity you can do today.**

KindDrop is a tiny generosity planner built for the DEV Weekend Challenge: Generosity Edition. A user enters what they can offer (time, a skill, useful items, attention), how much time they have, and optional constraints. Google Gemini returns one specific, consent-aware action plan.

## Why

People often want to help but get stuck between good intentions and large commitments. KindDrop deliberately optimizes for small, immediately actionable generosity.

## Features

- 15 / 30 / 60 / 120-minute action plans
- Uses what the user already has instead of encouraging spending
- Respectful message template
- Safety, consent, dignity, and privacy guardrails
- Non-performative impact check-in
- No name, email, phone number, or precise address required

## Tech

- Node.js + Express
- Vanilla HTML/CSS/JS
- Google Gemini (`gemini-3.8-flash`) via the Interactions API in `@google/genai`

## Run locally

```bash
npm install
cp .env.example .env
# Add your Gemini API key to .env
npm start
```

Open http://localhost:3000

## Deploy

`render.yaml` is a ready Render blueprint. Connect the repo at
[render.com](https://render.com), and set `GEMINI_API_KEY` as an environment
variable in the dashboard (it is marked `sync: false` so it never lands in git).
Health checks hit `/api/health`.

## Google AI usage

The backend sends the user's availability and constraints to Gemini and asks for
a generosity plan. Two things make it dependable rather than decorative:

**Structured output.** The response shape is declared as a JSON schema
(`PLAN_SCHEMA` in `server.js`) and passed via `response_format`, so Gemini
returns parseable JSON by construction. There is no markdown-fence stripping or
regex cleanup in the response path.

**Guardrails in the prompt.** The prompt explicitly constrains for safety,
consent, privacy, dignity, accessibility, and anti-shaming, and forbids
recommending dangerous locations, medical-crisis intervention, or giving away
essential personal resources. User answers are quoted and labelled as data, so a
user's free text is not read as instructions to the model.

## Endpoints

| Route | Method | Purpose |
| --- | --- | --- |
| `/api/idea` | POST | Generate one generosity plan |
| `/api/health` | GET | Liveness + whether the API key is configured |

`/api/idea` validates `minutes` against an allowlist, trims every text field to
its documented cap, and applies a per-IP rate limit (20 requests/hour) so a
public deploy cannot burn the whole API quota.

## Challenge

Built from scratch during the DEV Weekend Challenge: Generosity Edition submission window.

## License

MIT — see [LICENSE](LICENSE).
