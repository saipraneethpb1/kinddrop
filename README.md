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
- Google Gemini via `@google/genai`

## Run locally

```bash
npm install
cp .env.example .env
# Add your Gemini API key to .env
npm start
```

Open http://localhost:3000

## Google AI usage

The backend sends the user's availability and constraints to Gemini and asks for a strict, structured generosity plan. The prompt explicitly includes safety, consent, privacy, dignity, accessibility, and anti-shaming constraints.

## Challenge

Built from scratch during the DEV Weekend Challenge: Generosity Edition submission window.
