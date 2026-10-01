---
name: create-scoped-offer
description: Create a fixed-scope freelance offer with deposit checkout from a messy client brief using the Scoped MCP tools. Use when the user wants to quote a client, lock scope, or send a pay-to-start link.
---

# Create a Scoped offer

When the user has a client brief (Slack dump, email, voice notes), turn it into a live Scoped offer.

## Steps

1. Extract: freelancer name, client name, title, brief, included items, excluded items, fixed price, deposit %, delivery days.
2. If anything critical is missing, ask once — then proceed with sensible defaults (deposit 40%, currency USD).
3. Call MCP tool `create_scoped_offer` with prices in **cents** (e.g. $1,800 → `180000`).
4. Return the public `url` and tell the user to send it to the client for deposit before work starts.
5. Optionally call `list_scoped_offers` or `get_scoped_offer` to confirm.

## Rules

- Prefer fixed scope over hourly.
- Always list what is **out of scope**.
- Never invent a deposit as paid — only the client checkout marks it paid.
- Free API keys keep one live offer (creating again replaces it).
