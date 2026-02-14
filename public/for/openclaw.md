# Beton + OpenClaw

> Add Beton's revenue signal detection to OpenClaw agent pipelines via MCP. Automate lead scoring, CRM routing, and account analysis.

## What is Beton?

Beton is open-source revenue intelligence for product-led growth companies. It detects behavioral signals in product usage data and routes them to CRM and sales tools.

## Quick Setup

1. Install OpenClaw following their setup guide
2. Add Beton as an MCP server in your `openclaw.config.json`:

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

3. Set your `BETON_API_KEY` in the environment configuration
4. Beton tools are now available to all agents in your pipeline

## Available MCP Tools

- `beton_check_signals` — Detect new revenue signals from product usage
- `beton_score_leads` — Score and qualify leads by account domain
- `beton_route_signal` — Route signals to CRM, Slack, or webhooks
- `beton_analyze_account` — Analyze account behavioral patterns
- `beton_list_signals` — Query signal history with filters

## Example Prompts

- "Build an agent that checks Beton signals every hour and routes PQLs to Slack"
- "Use Beton to score all leads and create a summary report"
- "Chain Beton signal detection with our custom enrichment tools"
- "Analyze churn risk across all accounts and alert on critical ones"

## Links

- Full guide: https://www.getbeton.ai/for/openclaw/
- MCP docs: https://www.getbeton.ai/mcp.md
- GitHub: https://github.com/getbeton/inspector
