# KIT-F2 OBSERVABILITY — safe slice

Datum: 2026-07-03
Scope: bez deploya, bez slanja testnih Slack/Sentry/uptime eventova.

## Napravljeno

- `/api/health` ostaje side-effect free.
- `/api/health` sada vraća `buildSha` iz `VERCEL_GIT_COMMIT_SHA` ili `NEXT_PUBLIC_VERCEL_GIT_COMMIT_SHA`, bez tajni.
- Request ID infrastruktura postoji:
  - `lib/request-context.ts`
  - `lib/api/request-logger.ts`
  - response header `x-request-id`

## Sentry status

- Web Sentry config postoji kroz `sentry.client.config.ts`, `sentry.server.config.ts`, `sentry.edge.config.ts`, `next.config.ts`.
- Error capture postoji u `app/error.tsx`, `app/global-error.tsx`, `lib/error-tracking.ts`.
- Slack alert pravila nisu testirana jer to zahtijeva produkcijski Sentry/Slack pristup i slanje test eventa.

## Uptime status

- Monitor targeti za launch:
  - `/`
  - `/api/health`
- Nije kreiran vanjski uptime monitor u ovom autonomous sliceu.

## Otvoreno do vlasnika

- Sentry org/project/alert rules: novi error type, error-rate spike, auth/upload/payment critical tags.
- Slack webhook/channel potvrda.
- Uptime provider i alert recipient.
