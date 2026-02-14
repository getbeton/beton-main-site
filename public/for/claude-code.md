# Beton + Claude Code

> Connect Beton's revenue intelligence to Claude Code via MCP. Detect signals, score leads, and route to your CRM — from your terminal.

## What is Beton?

Beton is open-source revenue intelligence for product-led growth companies. It detects behavioral signals in product usage data and routes them to CRM and sales tools.

## Quick Setup

1. Install Claude Code: `npm install -g @anthropic-ai/claude-code`
2. Add Beton MCP config to `~/.claude/claude_desktop_config.json`:

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

3. Set your `BETON_API_KEY` in the config
4. Restart Claude Code — Beton tools are now available

## Available MCP Tools

- `beton_check_signals` — Detect new revenue signals from product usage
- `beton_score_leads` — Score and qualify leads by account domain
- `beton_route_signal` — Route signals to CRM, Slack, or webhooks
- `beton_analyze_account` — Analyze account behavioral patterns
- `beton_list_signals` — Query signal history with filters

## Example Prompts

- "Check if there are any new high-confidence signals today"
- "Score the leads from acme.com and route to HubSpot if qualified"
- "Analyze the account activity for widget-corp.io this week"
- "Route all PQL signals above 0.8 confidence to the sales team channel"

## Links

- Full guide: https://www.getbeton.ai/for/claude-code/
- MCP docs: https://www.getbeton.ai/mcp.md
- GitHub: https://github.com/getbeton/inspector
