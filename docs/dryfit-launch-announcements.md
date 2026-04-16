# Dryfit Launch Announcements

## 1. LinkedIn (personal — linkedin.com/in/vlad-nadymov)

We just open-sourced Dryfit — the tool we built internally at Beton to test whether our AI agents can actually find revenue signals in product analytics data.

The problem: when you're building agentic systems that detect expansion, churn, or upsell signals in customer behavior data, there's no good way to benchmark them. You can't use production data (privacy, access, ground truth unknown), and toy datasets don't capture the messiness of real product telemetry.

Dryfit generates synthetic PostHog-style event databases with hidden ground truth baked in. You define a SaaS business model scenario — seat-based, usage-based, freemium, marketplace, credits, hybrid — and it produces a realistic events table plus a manifest that tells you exactly which signals were planted and where.

Think of it as "unit tests for signal discovery." Your agent runs against the generated database. You check its findings against ground truth. You know exactly where it succeeded and where it missed.

We ship 12 business model configs out of the box, a Grafana inspection stack, and PostgreSQL as the default backend. MIT licensed.

GitHub: github.com/getbeton/dryfit
Blog post: getbeton.ai/blog/we-open-sourced-our-agent-testing-tool

If you're building anything that touches product analytics with AI — RevOps tools, PLG agents, customer health scoring — this might save you months of building your own test harness.

---

## 2a. X thread — @getbeton (company account)

**Tweet 1:**
We open-sourced Dryfit — synthetic analytics databases with hidden ground truth for testing AI agents on signal discovery.

We built it to benchmark our own RevOps agents. Now it's yours.

github.com/getbeton/dryfit

**Tweet 2:**
The problem: if you're building an AI agent that "finds signals" in product data, how do you know it actually works?

Production data has no ground truth. Toy datasets are too clean. You need something in between.

**Tweet 3:**
Dryfit generates realistic PostHog-style event tables in Postgres with planted behavioral signals — expansion, churn, upsell.

Alongside the data, it outputs a ground truth manifest. Run your agent. Compare results. Get precision and recall.

**Tweet 4:**
12 SaaS business model configs out of the box:
- seat-based
- usage-based
- freemium
- marketplace
- credits/tokens
- hybrid
- and 6 more

Each defines event vocabulary, positive/negative signal paths, and noise parameters. Use ours or write your own.

**Tweet 5:**
Who this is for:
- RevOps teams building signal detection
- PLG tools that score account health
- Data teams evaluating AI vendor claims
- Anyone building agents that analyze product telemetry

MIT licensed. getbeton.ai/blog/we-open-sourced-our-agent-testing-tool

---

## 2b. X thread — personal @vladnadymov (quote-tweets the @getbeton thread)

**Quote tweet of @getbeton tweet 1:**
We've been testing our own agents against Dryfit for months. The gap between "it works on the demo" and "it works on realistic data" was bigger than expected.

The hardest part wasn't building the agent — it was building a test harness that could tell us if the agent was actually good. So we open-sourced it.

---

## 3. Founders for Founders (Shmit 16 chat)

Парни, заопенсорсили тулзу которую делали для себя внутри Beton.

Dryfit — генерирует синтетические базы аналитики (события а-ля PostHog) с зашитым ground truth. Нужно чтобы тестировать AI-агентов которые ищут сигналы в продуктовых данных — churn, expansion, upsell.

Проблема простая: когда строишь агента который должен находить паттерны в данных клиентов, тестировать не на чем. Прод данные нельзя, тестовые слишком чистые. Dryfit даёт реалистичный датасет где ты точно знаешь правильный ответ.

12 бизнес-моделей из коробки (seat-based, usage, freemium, marketplace и т.д.), Postgres, Grafana для визуальной проверки. MIT лицензия.

github.com/getbeton/dryfit

---

## 4. Founders.cy internal launch chat

Запустили в опенсорс Dryfit — внутренний инструмент Beton для тестирования наших AI-агентов.

Генерит синтетические event-базы (PostHog-стиль) с заранее известными сигналами. Запускаешь агента на базу, сравниваешь с ground truth, видишь где он нашёл а где пропустил. Как юнит-тесты для signal discovery.

MIT, 12 SaaS-сценариев, Postgres + Grafana. github.com/getbeton/dryfit

---

## 5. Email newsletter (send via Resend)

**Subject:** we open-sourced our agent testing tool

**Preheader:** synthetic analytics databases with ground truth for benchmarking AI agents

**Body (plaintext Craigslist style, all lowercase):**

we just released dryfit — the tool we use internally at beton to test whether our ai agents can actually find revenue signals in product data.

the problem we kept hitting: you build an agent that detects expansion signals, churn risk, upsell timing in product analytics. it works great on your demo. but how do you know it works on real, messy data?

production data has no ground truth. toy datasets are too clean. you need something in between.

<b>what dryfit does</b>

generates synthetic posthog-style event databases in postgres with hidden behavioral signals planted inside — expansion sequences, churn patterns, upsell indicators. alongside the data, it outputs a ground truth manifest that maps every signal to specific event IDs.

run your agent against the database. compare its findings to the manifest. get a precise benchmark score.

<b>who this is for</b>

- revops teams building signal detection pipelines
- plg tools that score account health from usage data
- data teams evaluating whether an ai vendor's claims hold up
- anyone building agents that analyze product telemetry

<b>what's included</b>

12 saas business model configs out of the box (seat-based, usage-based, freemium, marketplace, credits, hybrid, and more). grafana inspection stack. postgresql backend. mit licensed.

github: github.com/getbeton/dryfit
blog post: getbeton.ai/blog/we-open-sourced-our-agent-testing-tool

if you're building or evaluating ai tools that touch product analytics, this might save you months. and if you want to see how we use it to power beton's signal detection — reply to this email.

vlad
