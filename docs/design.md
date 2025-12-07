# Design Document: Startup Fundraising Portal

## Overview

A minimal, web-based platform that guides startups through Regulation CF and Regulation A+ fundraising workflows. The system prioritizes clarity, compliance, and speed-to-launch.

---

## Design Principles

1. **Guided Simplicity** — Complex SEC workflows distilled into clear, sequential steps
2. **Compliance-First** — Built-in guardrails prevent regulatory missteps
3. **Progress Visibility** — Users always know where they are and what's next
4. **Mobile-Ready** — Founders work everywhere; the UI must follow

---

## Information Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        DASHBOARD                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │ Active Raise│  │ Quick Stats │  │ Next Action Required│  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│  PREREQUISITES│    │   REG CF      │    │   REG A+      │
│  (Phase 1)    │    │   (Phase 2A)  │    │   (Phase 2B)  │
└───────────────┘    └───────────────┘    └───────────────┘
```

---

## Core User Flows

### Flow 1: Onboarding & Prerequisites

```
Start → Company Profile → Entity Verification → Cap Table Upload 
    → Bad Actor Check → EDGAR Access → Pathway Selection
```

**Screens:**
1. **Welcome** — Explain Reg CF vs Reg A+ at a glance
2. **Company Setup** — Legal name, EIN, entity type, state of incorporation
3. **Team Roster** — Officers, directors, 20%+ shareholders (for bad actor screening)
4. **Cap Table Import** — CSV upload or manual entry
5. **EDGAR Wizard** — Step-by-step Form ID filing guide with notary instructions
6. **Pathway Selector** — Interactive decision tree based on raise amount, timeline, budget

### Flow 2: Regulation CF Campaign

```
Portal Selection → Financials Upload → Testing the Waters 
    → Form C Builder → Campaign Launch → Investor Management → Close & Report
```

**Screens:**
1. **Portal Marketplace** — Compare Wefunder, Republic, StartEngine (fees, features)
2. **Financials Center** — Upload reviewed/audited statements; auto-detect tier
3. **TTW Campaign Builder** — Create compliant "testing the waters" materials with required legends (auto-archived and exported for SEC upon Form C filing)
4. **Form C Editor** — Guided form with live validation
5. **Campaign Dashboard** — Real-time funding progress, investor list, 21-day countdown
6. **Close Manager** — Rolling close triggers, Form C-U automation
7. **Annual Reporting** — Form C-AR reminders and filing assistant

### Flow 3: Regulation A+ Offering

```
Team Assembly → Audit Coordination → Form 1-A Builder → SEC Review Tracker 
    → Qualification → Offering Page → Ongoing Compliance
```

**Screens:**
1. **Team Builder** — Attorney, auditor, broker-dealer directory with RFQ system
2. **Audit Tracker** — Document checklist, auditor communication log, timeline
3. **Form 1-A Editor** — Section-by-section builder with S-1 parity guidance
4. **SEC Comment Tracker** — Upload comments, track revisions, manage response deadlines
5. **Qualification Status** — Visual pipeline from filing to "No Comment" letter
6. **Offering Page Builder** — White-label investment page for direct sales
7. **Compliance Calendar** — 1-SA, 1-K, 1-U deadlines with auto-reminders (1-U has critical 4-day filing deadline)

---

## UI Components

### Navigation

```
┌──────────────────────────────────────────────────────────────┐
│ [Logo]   Dashboard   Raises   Documents   Team   Settings   │
└──────────────────────────────────────────────────────────────┘
```

- **Persistent sidebar** on desktop; **bottom nav** on mobile
- **Breadcrumbs** for multi-step flows
- **Progress indicator** showing completion percentage

### Cards

Used for: Active raises, action items, team members, document status

```
┌────────────────────────────────────────┐
│ [Icon]  Title                    [Tag] │
│ Subtitle / Description                 │
│ ─────────────────────────────────────  │
│ [Metric]  [Metric]  [Metric]           │
│                          [Action Btn]  │
└────────────────────────────────────────┘
```

### Stepper

Used for: Multi-phase workflows (Prerequisites → Filing → Campaign → Close)

```
○───────●───────○───────○
1       2       3       4
Done  Current  Locked  Locked
```

### Status Badges

| Status | Color | Use Case |
|--------|-------|----------|
| `Draft` | Gray | Incomplete documents |
| `In Review` | Yellow | Awaiting SEC/Portal response |
| `Action Required` | Red | User input needed |
| `Approved` | Green | Cleared to proceed |
| `Live` | Blue | Active campaign |

---

## Page Layouts

### Dashboard (Home)

```
┌─────────────────────────────────────────────────────────────┐
│  Welcome back, [Name]                                       │
│                                                             │
│  ┌─────────────────────────────┐  ┌───────────────────────┐ │
│  │ ACTIVE RAISE                │  │ NEXT STEPS            │ │
│  │ Series Seed — Reg CF        │  │ ☐ Upload financials   │ │
│  │ $127,500 / $500,000         │  │ ☐ Complete Form C     │ │
│  │ ████████░░░░░░░░░ 25%       │  │ ☐ Submit to portal    │ │
│  │ 14 days remaining           │  │                       │ │
│  └─────────────────────────────┘  └───────────────────────┘ │
│                                                             │
│  ┌─────────────────────────────────────────────────────────┐│
│  │ TIMELINE                                                ││
│  │ ──●────────●────────○────────○────────○──               ││
│  │   Setup   Filing   21-Day   Close    Report             ││
│  └─────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

### Form Builder (Example: Form C)

```
┌─────────────────────────────────────────────────────────────┐
│  Form C: Offering Statement                    [Save Draft] │
│  ───────────────────────────────────────────────────────────│
│  Section Progress: ████████░░ 80%                           │
│                                                             │
│  ┌─────────────┐  ┌─────────────────────────────────────────┐
│  │ SECTIONS    │  │ EDITOR                                  │
│  │             │  │                                         │
│  │ ✓ Company   │  │ Risk Factors                            │
│  │ ✓ Team      │  │ ─────────────────────────────────────── │
│  │ ✓ Offering  │  │ Describe the material risks of your    │
│  │ ● Risks     │  │ business...                             │
│  │ ○ Financials│  │                                         │
│  │ ○ Use of $  │  │ ┌─────────────────────────────────────┐ │
│  │             │  │ │                                     │ │
│  │             │  │ │  [Rich text editor]                 │ │
│  │             │  │ │                                     │ │
│  │             │  │ └─────────────────────────────────────┘ │
│  │             │  │                                         │
│  │             │  │ ⚠️ Tip: Be specific. Vague risks can   │
│  │             │  │    trigger SEC comments.                │
│  └─────────────┘  └─────────────────────────────────────────┘
│                                        [Back] [Save & Next] │
└─────────────────────────────────────────────────────────────┘
```

---

## Color System

| Token | Hex | Usage |
|-------|-----|-------|
| `primary` | `#2563EB` | CTAs, links, active states |
| `success` | `#16A34A` | Approved, complete |
| `warning` | `#CA8A04` | Pending, in review |
| `danger` | `#DC2626` | Errors, action required |
| `neutral-50` | `#FAFAFA` | Page background |
| `neutral-900` | `#171717` | Primary text |

---

## Typography

| Element | Font | Size | Weight |
|---------|------|------|--------|
| H1 | Inter | 32px | 700 |
| H2 | Inter | 24px | 600 |
| H3 | Inter | 18px | 600 |
| Body | Inter | 16px | 400 |
| Caption | Inter | 14px | 400 |
| Label | Inter | 12px | 500 |

---

## Responsive Breakpoints

| Breakpoint | Width | Layout |
|------------|-------|--------|
| Mobile | < 640px | Single column, bottom nav |
| Tablet | 640–1024px | Two columns, collapsible sidebar |
| Desktop | > 1024px | Three columns, persistent sidebar |

---

## Accessibility

- **WCAG 2.1 AA** compliance minimum
- All interactive elements keyboard-navigable
- Color contrast ratio ≥ 4.5:1 for text
- Form fields with visible labels (no placeholder-only)
- Screen reader announcements for status changes

---

## Security Considerations

- **Authentication**: Email + password with MFA required for filing actions
- **Data Encryption**: TLS 1.3 in transit, AES-256 at rest
- **Document Storage**: Signed URLs with 15-minute expiry
- **Audit Log**: All SEC-related actions logged with timestamp and IP
- **Session Management**: 30-minute idle timeout, single active session per user

---

## Integration Points

| System | Purpose | Method |
|--------|---------|--------|
| SEC EDGAR | Form filing, status checks | EDGAR API / Manual upload |
| Funding Portals | Campaign sync, investor data | Webhooks + REST API |
| Stripe | Payment processing (platform fees) | Stripe Connect |
| DocuSign | Subscription agreements | eSignature API |
| Plaid | Bank verification for investors | Plaid Link |
| SendGrid | Transactional emails | SMTP API |

---

## Future Considerations

1. **AI Form Assistant** — Auto-generate risk factors and business descriptions from pitch deck
2. **Investor CRM** — Track leads from TTW through conversion
3. **Secondary Market** — Enable Reg A+ share trading post-qualification
4. **Multi-Entity Support** — Holding companies managing multiple offerings
