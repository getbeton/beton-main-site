# Beton MCP Server

> Connect Beton's revenue intelligence tools to any AI agent that supports the Model Context Protocol (MCP).

## What is Beton?

Beton is open-source revenue intelligence for product-led growth companies. It detects behavioral signals in product usage data (from PostHog) and routes them to CRM and sales tools (HubSpot, Attio, Pipedrive, webhooks).

- **Open source** (AGPLv3), self-hostable
- **Behavioral signals** from actual product usage, not arbitrary lead scores
- **Multi-destination routing**: one signal to many tools simultaneously

## MCP Tools

Beton exposes five tools via MCP:

### `beton_check_signals`

Detect new revenue signals from product usage data.

**Parameters:**
- `confidence_threshold` (number, optional): Minimum confidence score (0-1). Default: 0.7
- `signal_type` (string, optional): Filter by type — `pql`, `expansion`, `churn`, `trial_conversion`, `usage_spike`
- `since` (string, optional): ISO 8601 timestamp. Only return signals detected after this time.

**Returns:** Array of signal objects with `id`, `type`, `confidence`, `account`, `events`, `detected_at`.

### `beton_score_leads`

Score and qualify leads based on behavioral product data.

**Parameters:**
- `account_domain` (string, required): The domain to score (e.g., `acme.com`)
- `scoring_model` (string, optional): Model to use — `default`, `enterprise`, `plg`. Default: `default`

**Returns:** Lead score object with `score` (0-100), `qualification` (`hot`, `warm`, `cold`), `signals`, `reasoning`.

### `beton_route_signal`

Route a detected signal to one or more destinations.

**Parameters:**
- `signal_id` (string, required): The signal ID to route
- `destinations` (string[], optional): Target destinations. If omitted, routes to all configured destinations.
- `priority` (string, optional): `high`, `normal`, `low`. Default: `normal`

**Returns:** Routing confirmation with `destination`, `status`, `delivered_at` for each target.

### `beton_analyze_account`

Analyze account-level behavioral patterns and engagement.

**Parameters:**
- `account_domain` (string, required): The account domain to analyze
- `period` (string, optional): Time period — `7d`, `30d`, `90d`. Default: `30d`

**Returns:** Account analysis with `usage_trend`, `key_events`, `signal_history`, `health_score`, `risk_factors`.

### `beton_list_signals`

Query signal history with filters.

**Parameters:**
- `signal_type` (string, optional): Filter by type
- `account_domain` (string, optional): Filter by account
- `min_confidence` (number, optional): Minimum confidence threshold
- `since` (string, optional): ISO 8601 start date
- `until` (string, optional): ISO 8601 end date
- `limit` (number, optional): Max results. Default: 50

**Returns:** Array of historical signal objects with full metadata.

## Setup

### Installation

```bash
npx -y @getbeton/mcp-server
```

### Configuration

Add to your agent's MCP config file:

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

### Agent-Specific Setup

| Agent | Config File | Guide |
|-------|-------------|-------|
| Claude Code | `~/.claude/claude_desktop_config.json` | [Setup Guide](https://www.getbeton.ai/for/claude-code/) |
| Cursor | `~/.cursor/mcp.json` | [Setup Guide](https://www.getbeton.ai/for/cursor/) |
| Gemini CLI | `~/.gemini/settings.json` | [Setup Guide](https://www.getbeton.ai/for/gemini/) |
| OpenClaw | `openclaw.config.json` | [Setup Guide](https://www.getbeton.ai/for/openclaw/) |
| Windsurf | `~/.windsurf/mcp_config.json` | [Setup Guide](https://www.getbeton.ai/for/windsurf/) |
| Cline | VS Code Settings > Cline > MCP Servers | [Setup Guide](https://www.getbeton.ai/for/cline/) |

## Example Prompts

These work with any MCP-compatible agent:

- "Check if there are any new high-confidence signals today"
- "Score the leads from acme.com and route to HubSpot if qualified"
- "Analyze the account activity for widget-corp.io this week"
- "Show me all churn risk signals from the last 7 days"
- "Route all PQL signals above 0.8 confidence to the sales team channel"

## Links

- Website: https://www.getbeton.ai
- GitHub: https://github.com/getbeton/inspector
- Docs: https://docs.getbeton.ai
- App: https://inspector.getbeton.ai
- Agent Integrations: https://www.getbeton.ai/for/
