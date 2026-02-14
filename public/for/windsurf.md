# Beton + Windsurf

> Connect Beton's revenue intelligence to Windsurf via MCP. Access revenue signals, score leads, and route to CRM from the agentic IDE.

## What is Beton?

Beton is open-source revenue intelligence for product-led growth companies. It detects behavioral signals in product usage data and routes them to CRM and sales tools.

## Quick Setup

1. Open Windsurf and go to Settings > MCP
2. Add Beton MCP server config to `~/.windsurf/mcp_config.json`:

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
4. Restart Windsurf — Beton tools are available in Cascade

## Available MCP Tools

- `beton_check_signals` — Detect new revenue signals from product usage
- `beton_score_leads` — Score and qualify leads by account domain
- `beton_route_signal` — Route signals to CRM, Slack, or webhooks
- `beton_analyze_account` — Analyze account behavioral patterns
- `beton_list_signals` — Query signal history with filters

## Example Prompts

- "Check Beton for any new signals since yesterday"
- "Score the lead from startup.dev and summarize their product usage"
- "Route all high-confidence expansion signals to our HubSpot pipeline"
- "What accounts show the strongest buying signals this week?"

## Links

- Full guide: https://www.getbeton.ai/for/windsurf/
- MCP docs: https://www.getbeton.ai/mcp.md
- GitHub: https://github.com/getbeton/inspector
