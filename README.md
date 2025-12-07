# 9xf Investments

**The Robinhood of startup investing.**

Most of a company's wealth is created before it goes public—when it grows from nothing into a billion-dollar enterprise. Today, venture capital firms capture nearly all of these gains because they have the capital to invest early.

We're changing that.

---

## The Problem

### For Investors
Everyday people are locked out of early-stage investing. By the time a company IPOs, the explosive growth phase is over. The 100x returns? Already captured by VCs and accredited investors.

### For Startups
Regulations like Reg CF and Reg A+ were designed to democratize fundraising. In practice, they create a $50k–$100k+ compliance burden that startups can't afford. The companies that need crowdfunding most—those without VC backing—spend their entire raise on lawyers and auditors.

**The JOBS Act promised democratization. It delivered paperwork.**

---

## Our Solution

9xf Investments removes the friction from both sides:

| For Investors | For Startups |
|---------------|--------------|
| Invest $20–$30 in startups you believe in | List shares with near-zero upfront cost |
| Own real equity, not tokens or perks | We handle all SEC filings and compliance |
| Simple as buying a coffee | Focus on building, not paperwork |

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                         FOR STARTUPS                            │
│                                                                 │
│   1. Apply    →    2. We File    →    3. You Raise              │
│   (5 min)          (We handle         (Shares listed            │
│                    Reg CF/A+)          on 9xf)                  │
│                                                                 │
│   Cost: 1-2% equity stake (no upfront cash)                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        FOR INVESTORS                            │
│                                                                 │
│   1. Sign Up   →   2. Browse    →    3. Invest                  │
│   (One-time        (Vetted           (Tap amount,               │
│    KYC)            startups)          confirm)                  │
│                                                                 │
│   Minimum: $20 | Maximum: Based on income (per SEC rules)       │
└─────────────────────────────────────────────────────────────────┘
```

---

## Key Principles

### 🎯 Democratized
- **Low minimums**: Start with $20
- **Per-person caps**: No whales dominating rounds
- **Broad access**: Non-accredited investors welcome

### ⚡ Simple
- **One-time onboarding**: KYC once, invest forever
- **Tap to invest**: Amount → Confirm → Done
- **No jargon**: Plain English, always

### 🔒 Clean
- **Compliance handled**: SEC filings, audits, legal—all under the hood
- **Partner network**: Attorneys, auditors, and portals pre-integrated
- **Automated reporting**: Annual filings generated automatically

### 💬 Honest
- **Risk is real**: Startups fail. We say so clearly.
- **Illiquidity is real**: Your money is locked up. We explain what that means.
- **No hype**: Just facts about each company

---

## The Regulatory Reality

We operate under two SEC frameworks:

| | Regulation CF | Regulation A+ |
|---|---------------|---------------|
| **Max Raise** | $5M / year | $75M / year |
| **Best For** | Seed rounds, community raises | Growth rounds, mini-IPOs |
| **Time to Launch** | 60–90 days | 4–6 months |
| **Traditional Cost** | $15k–$25k | $50k–$100k+ |
| **9xf Cost** | 1-2% equity | 1-2% equity |

**Our edge**: We've productized the entire filing workflow. What takes lawyers weeks, our platform does in days—with human review at critical checkpoints.

---

## Business Model

We align our success with startup success:

| Revenue Stream | Description |
|----------------|-------------|
| **Equity stake** | 1-2% of each company we help list (in lieu of upfront fees) |
| **Platform fee** | Small % of funds raised (paid at close, not upfront) |
| **Investor fees** | Minimal transaction fees on investments |

**We only win when startups raise successfully.**

---

## Tech Stack

```
Frontend        Next.js 14, React, TypeScript, Tailwind CSS, shadcn/ui
Backend         Supabase (PostgreSQL, Auth, Storage, Edge Functions)
Payments        Stripe Connect
Identity        Plaid (bank verification), DocuSign (agreements)
Infrastructure  Vercel, AWS S3
```

---

## Project Structure

```
9xf-investments-startup:portal/
├── docs/
│   ├── design.md        # UI/UX specifications
│   ├── requirements.md  # Functional & non-functional requirements
│   └── tasks.md         # Sprint breakdown & implementation tasks
├── src/
│   ├── app/             # Next.js App Router pages
│   ├── components/      # React components
│   ├── lib/             # Utilities, API clients
│   └── types/           # TypeScript definitions
├── prisma/
│   └── schema.prisma    # Database schema
└── README.md
```

---

## Roadmap

### Phase 1: Prerequisites & Foundation (Weeks 1-4)
- [x] Design system and documentation
- [ ] User authentication with MFA
- [ ] Company onboarding (entity type, EIN, state)
- [ ] Team roster with bad actor check
- [ ] Cap table management
- [ ] EDGAR access wizard (Form ID, CIK/CCC)

### Phase 2A: Reg CF Launch (Weeks 5-8)
- [ ] Form C builder with validation
- [ ] Portal integration (Wefunder, Republic)
- [ ] Campaign dashboard
- [ ] Investor waitlist

### Phase 2B: Reg A+ Launch (Weeks 9-13)
- [ ] Vendor directory (attorneys, PCAOB auditors, broker-dealers)
- [ ] 2-year audit coordination
- [ ] Form 1-A builder
- [ ] SEC comment tracker
- [ ] White-label offering pages
- [ ] Direct investment flow
- [ ] Ongoing compliance (1-SA, 1-K, 1-U)

### Phase 3: Scale
- [ ] AI-assisted form generation
- [ ] Secondary market for shares
- [ ] Mobile apps (iOS, Android)

---

## Getting Started

```bash
# Clone the repository
git clone https://github.com/9xf-investments/portal.git
cd portal

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Add your Supabase, Stripe, and other API keys

# Run database migrations
npx prisma migrate dev

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## Contributing

We're building in public. Contributions welcome.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## Legal

9xf Investments facilitates offerings under SEC Regulation CF and Regulation A+. All investments involve risk, including the possible loss of principal. Past performance does not guarantee future results. Securities offered through registered funding portals and broker-dealers.

**This is not investment advice.**

---

## Contact

- **Website**: [9xf.investments](https://9xf.investments)
- **Email**: hello@9xf.investments
- **Twitter**: [@9xfinvestments](https://twitter.com/9xfinvestments)

---

<p align="center">
  <strong>Democratizing startup investing, one $20 stake at a time.</strong>
</p>
