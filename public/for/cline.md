# Beton + Cline

> Connect Beton's revenue intelligence to Cline via MCP. Let your autonomous coding agent detect signals, score leads, and route to CRM in VS Code.

## What is Beton?

Beton is open-source revenue intelligence for product-led growth companies. It detects behavioral signals in product usage data and routes them to CRM and sales tools.

## Quick Setup

1. Install the Cline extension in VS Code
2. Open Cline settings and navigate to MCP Servers
3. Add the Beton MCP server configuration:

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

4. Cline will discover Beton tools automatically on next activation

## Available MCP Tools

- `beton_check_signals` — Detect new revenue signals from product usage
- `beton_score_leads` — Score and qualify leads by account domain
- `beton_route_signal` — Route signals to CRM, Slack, or webhooks
- `beton_analyze_account` — Analyze account behavioral patterns
- `beton_list_signals` — Query signal history with filters

## Example Prompts

- "Check Beton for new product-qualified leads and list them"
- "Analyze the top 10 accounts by signal volume this month"
- "Route expansion signals for accounts over $10k ARR to Attio"
- "Give me a churn risk report for the enterprise segment"

## Links

- Full guide: https://www.getbeton.ai/for/cline/
- MCP docs: https://www.getbeton.ai/mcp.md
- GitHub: https://github.com/getbeton/inspector
