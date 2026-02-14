# Beton + Cursor

> Connect Beton's revenue intelligence to Cursor via MCP. Query signals, score leads, and route to CRM — from your AI code editor.

## What is Beton?

Beton is open-source revenue intelligence for product-led growth companies. It detects behavioral signals in product usage data and routes them to CRM and sales tools.

## Quick Setup

1. Open Cursor Settings > MCP Servers
2. Add Beton MCP server config to `~/.cursor/mcp.json`:

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
4. Reload Cursor — Beton tools appear in the agent panel

## Available MCP Tools

- `beton_check_signals` — Detect new revenue signals from product usage
- `beton_score_leads` — Score and qualify leads by account domain
- `beton_route_signal` — Route signals to CRM, Slack, or webhooks
- `beton_analyze_account` — Analyze account behavioral patterns
- `beton_list_signals` — Query signal history with filters

## Example Prompts

- "What signals has Beton detected for our top 5 accounts?"
- "Score the lead from newcustomer.io and tell me if they're sales-ready"
- "Route this expansion signal to our Attio pipeline"
- "Show me all churn risk signals from the last 7 days"

## Links

- Full guide: https://www.getbeton.ai/for/cursor/
- MCP docs: https://www.getbeton.ai/mcp.md
- Beton docs: https://docs.getbeton.ai
- GitHub: https://github.com/getbeton/inspector
