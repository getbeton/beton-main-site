---
title: "Infisical Pricing Teardown"
description: "Infisical uses MIT for the core and a proprietary license for enterprise features. The clever part is what counts as an 'identity.'"
publishedAt: "2026-04-06"
author: "Vlad Nadymov"
tags: ["pricing teardown", "open source", "secrets management"]
featured: false
draft: true
seo:
  metaTitle: "Infisical Pricing Teardown — MIT Core, EE Upsell"
  metaDescription: "Infisical charges $18/mo per identity — and identities include both humans and machines. Analysis of pricing, licensing, and the Vault alternative play."
---

Hey, it's Vlad, founder of Beton.

Infisical is the open-source secrets manager that's been eating into HashiCorp Vault's territory from below. The pitch is simple: Vault is powerful but painful. Infisical is Vault for teams that don't want to hire a dedicated Vault engineer.

25,700+ GitHub stars, founded in 2022, growing fast in the DevOps/platform engineering space. Let's look at how they make money.

*This post is a part of series on commercial open source software pricing.*

## What is Infisical

Infisical is an open-source platform for secrets management, certificate management (PKI), SSH key management, and privileged access management (PAM).

Think of it as the layer that stores your API keys, database passwords, certificates, and environment variables — then distributes them to your apps, CI/CD pipelines, and infrastructure through integrations with AWS, Kubernetes, Terraform, GitHub Actions, GitLab CI/CD, Docker, Jenkins, Ansible, and dozens more.

They also handle secret rotation, dynamic secrets (short-lived credentials generated on demand), secret scanning and leak prevention, and audit logging. It's a full platform, not just a key-value store.

They've raised venture capital and are positioning themselves as the modern alternative to HashiCorp Vault for teams that want something operational without a PhD in HCL configuration.

## The licensing play

This one is a textbook open-core split, executed cleanly.

**The core platform is MIT**

The main codebase — the API server, CLI, SDKs, Kubernetes operator, agent, dashboard UI, all integrations — is MIT licensed. Do whatever you want with it. Fork it, embed it, sell it. No strings.

This is generous. More generous than AGPL (which Plane and many others use), and more generous than the various "sustainable use" or "source available" licenses. MIT is real open source, no asterisks.

**Enterprise features live under a proprietary license**

Everything inside the `backend/src/ee/` directory (over 800 files) is covered by the Infisical Enterprise License. You can read the code on GitHub, but you can't run it in production without purchasing a license key.

The enterprise license is straightforward: you can modify the code and publish patches, but Infisical retains all rights to those modifications, and you can only use them with a valid subscription for the correct number of user seats. You can copy and modify for development and testing without a subscription.

The enterprise-gated features include:

- SAML SSO (Okta, Azure AD, JumpCloud) and OIDC — *this is on Pro, not Enterprise*
- SCIM provisioning
- LDAP authentication
- Dynamic secrets
- Secret approval workflows and access requests
- Audit log streaming and custom retention
- User groups and custom roles
- Sub-organizations
- KMIP and HSM support
- Gateways for private network access
- IP allowlisting
- Secret rotation

Here's the interesting part: SAML SSO and RBAC are gated at the Pro tier, not Enterprise. This means even mid-size teams hit a paywall the moment they need anything beyond Google/GitHub SSO or basic role assignment. That's a smart trigger — SSO is usually the first enterprise requirement any growing team runs into.

Google SSO and GitHub SSO are free across both cloud and self-hosted. So the free tier isn't crippled for small teams that standardize on one of those providers.

## Pricing structure

Infisical uses identity-based pricing. An "identity" is either a human user or a machine identity (a service, CI/CD pipeline, Kubernetes service account, or agent that authenticates to Infisical). This is the key detail.

**Free — $0/month**
- Up to 5 identities
- Up to 3 projects
- Up to 3 environments per project
- Up to 10 integrations
- Dashboard UI, API, CLI, SDKs
- Kubernetes Operator, Infisical Agent
- All third-party integrations (AWS, Vercel, GitHub Actions, GitLab CI/CD, Jenkins, Ansible, etc.)
- Webhooks, 2FA
- Secret referencing and overrides
- Secret scanning and leak prevention
- Secret sharing
- Self-hosting or Infisical Cloud
- Community Slack support

**Pro — $18/month per identity**
- Everything in Free, plus:
- Unlimited projects, environments, and integrations
- Secret versioning
- Point-in-time recovery
- Role-based access controls
- Secret rotation
- Temporary access provisioning
- SAML SSO
- IP allowlisting
- 90-day audit log retention
- Higher rate limits
- Priority support
- Free trial available

**Enterprise — custom pricing (contact sales)**
- Everything in Pro, plus:
- Dedicated infrastructure
- Enterprise SCIM
- LDAP authentication
- Dynamic secrets
- AI Security Advisor
- Approval workflows
- Access requests
- Gateways
- Sub-organizations
- KMIP
- KMS & HSM support
- Audit log streaming
- Custom audit log retention
- Custom rate limits
- User groups and custom roles
- 99.99% SLA
- SOC2 & PenTest reports
- Dedicated support engineer

The Pro tier slider goes from 1 to 50 identities on the pricing page. Beyond that, you're in Enterprise territory.

## The identity pricing model

This is where Infisical gets clever — and potentially expensive.

Most secrets managers charge per user (human). Infisical charges per identity, which includes both humans *and* machines.

If you have 10 developers and 20 machine identities (production apps, CI/CD pipelines, staging environments, Kubernetes service accounts), you're paying for 30 identities at $18/month each. That's $540/month, or $6,480/year.

The free tier gives you 5 identities total. For a solo developer with a couple of apps and a CI pipeline, that's workable. For a team of 5 engineers? You've already used all your identities on humans alone, with zero machine identities.

The upgrade trigger is effectively: "the moment you have more than 5 things talking to Infisical." That's early. Very early.

Their FAQ even includes: "If I upgrade to Pro, do I keep the 5 free identities from the Free plan?" — which tells you this is a common friction point users hit.

## Does it make sense to pay?

For **small teams (under 5 people, a few services)**: the free tier is legitimately usable. MIT-licensed self-hosting means you can run it on your own infrastructure with no licensing cost and no catch. All integrations are included. If you only need Google or GitHub SSO, you're covered. This is a real free tier, not a demo.

For **growing teams (10-30 engineers)**: yes, paying makes sense. The alternative is HashiCorp Vault, which requires significant operational expertise. A team of 15 engineers with 25 machine identities would pay $720/month for Pro. That's less than the salary cost of the fractional DevOps time you'd spend wrestling with Vault policies, token renewal, and seal/unseal ceremonies.

The real question is whether you need Pro or Enterprise. The Enterprise tier gates some features that many teams consider essential once they hit a certain maturity: dynamic secrets, approval workflows, SCIM provisioning, LDAP. If your organization uses Okta or Azure AD for everything, you'll need at least Pro for SAML SSO.

For **self-hosting**: this is where it gets nuanced. The MIT-licensed core is genuinely complete for basic secrets management. You can self-host it, use all integrations, and pay nothing. But the moment you need RBAC, secret versioning, or SSO beyond Google/GitHub, you need a Pro license. And for dynamic secrets, SCIM, or LDAP, you need an Enterprise license — even on your own infrastructure.

Self-hosting Infisical isn't like self-hosting Vault where you get everything for free. The enterprise features require a license key that phones home to Infisical's license server (or an offline key for air-gapped environments). This is the standard open-core playbook: the deployment is yours, but the premium features are still paywalled.

**Bottom line**: the identity-based pricing model is elegant but it scales faster than pure seat-based pricing. Every new microservice, every new CI/CD pipeline, every new Kubernetes namespace that needs its own credentials — they all count. For organizations with many services and few humans, this can add up quickly. For small teams with a handful of services, it's straightforward and reasonably priced.

The MIT license on the core is the most permissive in this series so far. If you just need a secrets store with good integrations and don't need the enterprise security features, you genuinely get a complete product for free. That's the real wedge against Vault.
