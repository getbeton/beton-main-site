# Beton + Gemini CLI

> Connect Beton's revenue intelligence to Gemini CLI via MCP. Detect signals, score leads, and route to CRM — from Google's AI agent in your terminal.

## What is Beton?

Beton is open-source revenue intelligence for product-led growth companies. It detects behavioral signals in product usage data and routes them to CRM and sales tools.

## Quick Setup

1. Install Gemini CLI or use `npx`
2. Create or edit `~/.gemini/settings.json`:

```json
{
  "mcpServers": {
    "beton": {
      "command": "npx",
      "args": ["-y", "@getbeton/mcp-server"],
      "env": {
        "BETON_API_KEY": "your-api-key"
      }
    }
  }
}
```

3. Set your `BETON_API_KEY` in the environment variables
4. Run `gemini` — Beton tools are automatically discovered

## Available MCP Tools

- `beton_check_signals` — Detect new revenue signals from product usage
- `beton_score_leads` — Score and qualify leads by account domain
- `beton_route_signal` — Route signals to CRM, Slack, or webhooks
- `beton_analyze_account` — Analyze account behavioral patterns
- `beton_list_signals` — Query signal history with filters

## Example Prompts

- "Use Beton to check for any PQL signals above 0.85 confidence"
- "Analyze the account data for enterprise-co.com through Beton"
- "List all expansion signals from the past month"
- "Score and route the latest trial conversion signals to Pipedrive"

## Links

- Full guide: https://www.getbeton.ai/for/gemini/
- MCP docs: https://www.getbeton.ai/mcp.md
- GitHub: https://github.com/getbeton/inspector
