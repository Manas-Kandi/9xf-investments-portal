# Tasks: Startup Fundraising Portal

## Overview

This document breaks down implementation into sprints. Each task includes estimated effort, dependencies, and acceptance criteria.

---

## 📊 Progress Summary

**Last Updated**: December 7, 2025

| Sprint | Status | Progress |
|--------|--------|----------|
| Sprint 0: Setup | ✅ Complete | 4/5 tasks done |
| Sprint 1: Onboarding | 🔄 In Progress | Schema ready, UI pending |
| Sprint 2-6 | ⏳ Not Started | — |
| Sprint 7: Polish | 🔄 Partial | Dashboard started |

### What's Built
- ✅ Next.js 15 + TypeScript + Tailwind CSS
- ✅ Custom design system (Manrope, Marck Script fonts)
- ✅ Landing page with 3D animation
- ✅ Prisma schema (14 models)
- ✅ Supabase Auth integration (with dev mock)
- ✅ UI Components: Button, Card, Input, Badge, Form, Logo, Spinner
- ✅ Auth pages: Login, Signup, Forgot Password
- ✅ Dashboard layout with navigation
- ✅ Dashboard page with progress timeline

### Files Created
```
/app
  ├── (auth)/login, signup, forgot-password
  ├── (dashboard)/dashboard
  ├── auth/callback, signout
/components
  ├── ui/button, card, input, badge, form, label, textarea, select, spinner
  ├── logo.tsx
  ├── floating-sphere.tsx (3D animation)
/lib
  ├── db.ts (Prisma client)
  ├── supabase/client, server, middleware
/prisma
  └── schema.prisma (14 models)
/docs
  └── design-system.md
```

---

## Sprint 0: Project Setup (Week 1)

### T0.1 — Initialize Repository ✅ COMPLETED
- **Effort**: 2 hours
- **Owner**: Engineering
- **Tasks**:
  - [x] Create Next.js 14 project with App Router
  - [x] Configure TypeScript strict mode
  - [x] Set up ESLint + Prettier
  - [x] Initialize Tailwind CSS
  - [x] Add shadcn/ui component library
  - [x] Configure path aliases (`@/components`, `@/lib`, etc.)
- **Acceptance**: `npm run dev` starts without errors ✅

### T0.2 — Database Setup ✅ COMPLETED
- **Effort**: 4 hours
- **Owner**: Engineering
- **Tasks**:
  - [x] Set up Supabase project (configured, pending credentials)
  - [x] Configure Prisma ORM with Supabase PostgreSQL
  - [x] Create initial schema migrations (14 models defined)
  - [ ] Set up row-level security policies
  - [ ] Configure database connection pooling
- **Acceptance**: Prisma schema created with User, Company, TeamMember, CapTableEntry, Raise, Filing, Document, Notification, AuditLog models

### T0.3 — Authentication ✅ COMPLETED
- **Effort**: 6 hours
- **Owner**: Engineering
- **Dependencies**: T0.2
- **Tasks**:
  - [x] Implement Supabase Auth
  - [x] Create sign-up flow with email verification
  - [x] Create sign-in flow
  - [x] Implement password reset
  - [ ] Add MFA setup (TOTP)
  - [x] Create auth middleware for protected routes
- **Acceptance**: Auth pages created (/login, /signup, /forgot-password), middleware protects routes, mock auth for development

### T0.4 — CI/CD Pipeline ✅ COMPLETED
- **Effort**: 3 hours
- **Owner**: Engineering
- **Tasks**:
  - [x] Configure GitHub Actions for linting
  - [x] Add type checking to CI
  - [x] Set up Vercel deployment
  - [x] Configure preview deployments for PRs
  - [x] Add environment variable management
- **Acceptance**: PRs trigger preview deployments automatically ✅

### T0.5 — Design System Foundation ✅ COMPLETED
- **Effort**: 4 hours
- **Owner**: Engineering
- **Tasks**:
  - [x] Configure color tokens in Tailwind
  - [x] Set up typography scale (Manrope, Marck Script, JetBrains Mono)
  - [x] Create base Button component variants (default, secondary, ghost, destructive)
  - [x] Create Card component (with Header, Title, Description, Content, Footer)
  - [x] Create Input and Form components (Input, Textarea, Select, Label, Form with react-hook-form)
  - [x] Create Badge/Status components (draft, pending, success, error, live, info)
  - [ ] Document components in Storybook (optional)
- **Acceptance**: Core UI components render correctly ✅
- **Additional**: Created Logo component, Spinner, design-system.md documentation

---

## Sprint 1: Company Onboarding (Weeks 2-3)

### T1.1 — Company Profile Form ✅ COMPLETED
- **Effort**: 8 hours
- **Owner**: Engineering
- **Dependencies**: T0.3
- **Tasks**:
  - [x] Create `companies` table schema (in Prisma)
  - [x] Build multi-step company creation wizard
  - [x] Step 1: Legal name, EIN (with validation), entity type
  - [x] Step 2: State of incorporation, formation date
  - [x] Step 3: Business address, mailing address
  - [x] Step 4: Fiscal year end selection
  - [x] Add logo upload with image cropping
  - [x] Implement form validation with Zod
- **Acceptance**: User can create company profile with all required fields ✅

### T1.2 — Team Roster ✅ COMPLETED
- **Effort**: 10 hours
- **Owner**: Engineering
- **Dependencies**: T1.1
- **Tasks**:
  - [x] Create `team_members` table schema (in Prisma)
  - [x] Build team member add/edit modal
  - [x] Fields: Name, title, email, role (officer/director/shareholder)
  - [x] Add ownership percentage input (for 20%+ shareholders)
  - [x] Implement SSN collection with encryption
  - [x] Create team roster list view with edit/delete
  - [x] Add role-based badges (Officer, Director, 20%+ Owner)
- **Acceptance**: User can add team members with all required fields ✅

### T1.3 — Bad Actor Questionnaire ✅ COMPLETED
- **Effort**: 6 hours
- **Owner**: Engineering
- **Dependencies**: T1.2
- **Tasks**:
  - [x] Create questionnaire based on SEC Rule 506(d)
  - [x] 8 disqualifying event questions per team member
  - [x] Implement yes/no responses with explanation fields
  - [x] Flag team members with "Yes" answers
  - [ ] Block filing if any unresolved flags
  - [x] Add attestation checkbox for company owner
  - [x] Store questionnaire responses with timestamps
- **Acceptance**: Bad actor check blocks filing if disqualifying events exist ✅

### T1.4 — Cap Table Management ✅ COMPLETED
- **Effort**: 12 hours
- **Owner**: Engineering
- **Dependencies**: T1.1
- **Tasks**:
  - [x] Create `cap_table_entries` table schema (in Prisma)
  - [x] Build shareholder add/edit form
  - [x] Fields: Name, share class, shares, price, issue date
  - [x] Create share class management (Common, Preferred Series A/B, Options)
  - [x] Implement CSV import with column mapping
  - [x] Auto-calculate ownership percentages
  - [x] Validate total shares vs authorized shares
  - [x] Create cap table summary view
  - [ ] Export cap table as PDF
- **Acceptance**: User can manage cap table manually and via CSV import ✅

### T1.5 — EDGAR Access Wizard ✅ COMPLETED
- **Effort**: 6 hours
- **Owner**: Engineering
- **Dependencies**: T1.1
- **Tasks**:
  - [x] Create step-by-step Form ID guide
  - [x] Step 1: Explain EDGAR and why it's needed
  - [x] Step 2: Link to SEC EDGAR Filer Management
  - [x] Step 3: Notarization instructions with printable template download (notarized document required for SEC upload)
  - [x] Step 4: CIK and CCC input fields (received within 48 hours of SEC approval)
  - [x] Validate CIK format (10 digits)
  - [x] Store credentials encrypted
  - [x] Show EDGAR status on company dashboard
- **Acceptance**: User can complete EDGAR setup and store credentials ✅

---

## Sprint 2: Regulation CF — Core (Weeks 4-5)

### T2.1 — Pathway Selection
- **Effort**: 4 hours
- **Owner**: Engineering
- **Dependencies**: T1.5
- **Tasks**:
  - [x] Create Reg CF vs Reg A+ comparison page
  - [x] Build interactive questionnaire (raise amount, timeline, budget)
  - [x] Implement recommendation algorithm
  - [x] Allow manual pathway override
  - [x] Create `raises` table schema (in Prisma)
  - [x] Initialize raise record with selected pathway
- **Acceptance**: User can select fundraising pathway with guidance

### T2.2 — Portal Marketplace
- **Effort**: 6 hours
- **Owner**: Engineering
- **Dependencies**: T2.1
- **Tasks**:
  - [x] Create `portals` table with seed data (Wefunder, Republic, StartEngine)
  - [x] Portal fields: name, logo, cash_fee_percent, equity_fee_percent, features
  - [x] Build portal comparison grid
  - [x] Add "Select Portal" action
  - [x] Track portal application status (Applied, Accepted, Rejected)
  - [x] Store portal contract details
- **Acceptance**: User can compare and select funding portal

### T2.3 — Financial Tier Calculator
- **Effort**: 4 hours
- **Owner**: Engineering
- **Dependencies**: T2.1
- **Tasks**:
  - [x] Calculate financial requirement tier based on raise amount (including prior Reg CF raises in last 12 months)
  - [x] Display tier requirements (CEO certified / Reviewed / Audited)
  - [x] Track if first-time vs repeat issuer (first-time: reviewed OK for $1.235M-$5M; repeat: audited required)
  - [x] Create `financial_statements` table
  - [x] Build upload interface for financial documents
  - [x] Track statement status (Draft, Under Review, Certified)
- **Acceptance**: System correctly determines financial requirements

### T2.4 — Form C Builder (Part 1)
- **Effort**: 16 hours
- **Owner**: Engineering
- **Dependencies**: T2.3
- **Tasks**:
  - [x] Create `filings` table schema (in Prisma)
  - [x] Build section-based form editor
  - [x] Section: Issuer Information (auto-populated from company profile)
  - [x] Section: Officers, Directors, and Owners (from team roster)
  - [x] Section: Offering Information (terms, price, min/max)
  - [x] Section: Risk Factors (rich text editor)
  - [x] Implement auto-save (30-second interval)
  - [x] Add progress indicator per section
  - [x] Real-time validation for required fields
- **Acceptance**: User can complete first 4 sections of Form C

### T2.5 — Form C Builder (Part 2)
- **Effort**: 12 hours
- **Owner**: Engineering
- **Dependencies**: T2.4
- **Tasks**:
  - [x] Section: Use of Proceeds (table with categories and amounts)
  - [x] Section: Financial Condition (narrative + financials attachment)
  - [x] Section: Related Party Transactions
  - [x] Section: Other Material Information
  - [x] Generate Form C preview as PDF
  - [x] Export Form C data for portal submission
  - [x] Mark Form C as "Ready to File"
- **Acceptance**: User can complete all Form C sections and export

---

## Sprint 3: Regulation CF — Campaign (Weeks 6-7)

### T3.1 — Testing the Waters
- **Effort**: 8 hours
- **Owner**: Engineering
- **Dependencies**: T2.1
- **Tasks**:
  - [ ] Create TTW campaign builder
  - [ ] Rich text editor for campaign content
  - [ ] Auto-append SEC disclaimer to all content
  - [ ] Generate shareable landing page URL
  - [ ] Email capture form for interested investors
  - [ ] Create `ttw_leads` table
  - [ ] Archive TTW materials upon Form C filing
  - [ ] Export TTW materials for SEC submission
- **Acceptance**: User can create compliant TTW campaign and collect leads

### T3.2 — Campaign Dashboard
- **Effort**: 10 hours
- **Owner**: Engineering
- **Dependencies**: T2.5
- **Tasks**:
  - [ ] Build campaign overview page
  - [ ] Display funding progress bar (amount raised / target)
  - [ ] Show 21-day countdown timer from Form C filing
  - [ ] Display investor count and average investment
  - [ ] Create investor list view (name, amount, date)
  - [ ] Add campaign status badges (Draft, Filed, Live, Closed)
  - [ ] Show minimum threshold progress
- **Acceptance**: User can monitor campaign progress in real-time

### T3.3 — Rolling Close & Form C-U
- **Effort**: 6 hours
- **Owner**: Engineering
- **Dependencies**: T3.2
- **Tasks**:
  - [ ] Detect when minimum raise threshold is met
  - [ ] Enable "Initiate Rolling Close" action
  - [ ] Auto-generate Form C-U at 50% milestone
  - [ ] Auto-generate Form C-U at 100% milestone
  - [ ] Create Form C-U preview and export
  - [ ] Track close history with dates and amounts
- **Acceptance**: System auto-generates progress updates at milestones

### T3.4 — Post-Raise Compliance
- **Effort**: 6 hours
- **Owner**: Engineering
- **Dependencies**: T3.3
- **Tasks**:
  - [ ] Calculate Form C-AR due date (120 days after fiscal year end)
  - [ ] Send reminder emails at 90, 60, 30, 7 days before due
  - [ ] Build Form C-AR guided editor
  - [ ] Track annual reporting obligation status
  - [ ] Allow termination of reporting (with reason selection)
  - [ ] Create compliance calendar view
- **Acceptance**: User receives reminders and can file annual reports

---

## Sprint 4: Document Management & Notifications (Week 8)

### T4.1 — Document Center
- **Effort**: 10 hours
- **Owner**: Engineering
- **Dependencies**: T0.2
- **Tasks**:
  - [x] Create `documents` table schema (in Prisma)
  - [ ] Build document upload interface (drag-and-drop)
  - [ ] Support PDF, DOCX, XLSX, CSV (max 50MB)
  - [ ] Organize by category (Financials, Legal, Filings, Marketing)
  - [ ] Implement version history
  - [ ] Add document tagging
  - [ ] Create document search
  - [ ] Generate secure sharing links (15-min expiry)
- **Acceptance**: User can upload, organize, and share documents

### T4.2 — Notification System
- **Effort**: 8 hours
- **Owner**: Engineering
- **Dependencies**: T0.2
- **Tasks**:
  - [x] Create `notifications` table schema (in Prisma)
  - [ ] Build in-app notification center (bell icon)
  - [ ] Implement notification types: deadline, action_required, update
  - [ ] Mark notifications as read
  - [ ] Configure SendGrid for transactional emails
  - [ ] Email templates: welcome, deadline reminder, action required
  - [ ] User notification preferences (email on/off per type)
  - [ ] Weekly digest email (pending actions summary)
- **Acceptance**: User receives in-app and email notifications

### T4.3 — Audit Logging
- **Effort**: 4 hours
- **Owner**: Engineering
- **Dependencies**: T0.2
- **Tasks**:
  - [x] Create `audit_logs` table schema (in Prisma)
  - [ ] Log all SEC-related actions (filing, document upload, team changes)
  - [ ] Capture: user_id, action, entity, timestamp, IP address
  - [ ] Build audit log viewer (admin only)
  - [ ] Export audit log as CSV for regulatory review
- **Acceptance**: All sensitive actions are logged and exportable

---

## Sprint 5: Regulation A+ — Core (Weeks 9-11)

### T5.1 — Vendor Directory
- **Effort**: 8 hours
- **Owner**: Engineering
- **Dependencies**: T2.1
- **Tasks**:
  - [ ] Create `vendors` table (attorneys, auditors, broker-dealers)
  - [ ] Seed with initial vendor data
  - [ ] Build vendor search and filter interface
  - [ ] Display vendor profiles (name, specialty, location, typical fees)
  - [ ] Implement RFQ (Request for Quote) form
  - [ ] Track vendor selection status per raise
  - [ ] Store engagement letter uploads
- **Acceptance**: User can find and engage vendors for Reg A+

### T5.2 — Audit Tracker
- **Effort**: 8 hours
- **Owner**: Engineering
- **Dependencies**: T5.1
- **Tasks**:
  - [ ] Create audit preparation checklist (2-year lookback)
  - [ ] Checklist items: bank statements, invoices, contracts, etc.
  - [ ] Track checklist item status (pending, uploaded, verified)
  - [ ] Build auditor communication log
  - [ ] Track audit status (Not Started, In Progress, Draft, Final)
  - [ ] Store final audited financials
  - [ ] Display audit timeline with milestones
- **Acceptance**: User can track audit progress and upload documents

### T5.3 — Form 1-A Builder (Part 1)
- **Effort**: 16 hours
- **Owner**: Engineering
- **Dependencies**: T5.2
- **Tasks**:
  - [ ] Create Form 1-A filing record
  - [ ] Build Part I: Notification section
  - [ ] Build Part II: Offering Circular sections
  - [ ] Section: Cover Page
  - [ ] Section: Summary
  - [ ] Section: Risk Factors
  - [ ] Section: Dilution
  - [ ] Section: Use of Proceeds
  - [ ] Implement auto-save and progress tracking
- **Acceptance**: User can complete Part I and initial Part II sections

### T5.4 — Form 1-A Builder (Part 2)
- **Effort**: 16 hours
- **Owner**: Engineering
- **Dependencies**: T5.3
- **Tasks**:
  - [ ] Section: Business Description
  - [ ] Section: Management Discussion & Analysis
  - [ ] Section: Directors, Officers, and Significant Employees
  - [ ] Section: Compensation
  - [ ] Section: Security Ownership
  - [ ] Section: Related Party Transactions
  - [ ] Section: Financial Statements (attach audited financials)
  - [ ] Build Part III: Exhibits attachment
  - [ ] Generate Form 1-A preview as PDF
- **Acceptance**: User can complete all Form 1-A sections

### T5.5 — SEC Comment Tracker
- **Effort**: 10 hours
- **Owner**: Engineering
- **Dependencies**: T5.4
- **Tasks**:
  - [ ] Create `sec_comments` table
  - [ ] Log Form 1-A filing date
  - [ ] Upload SEC comment letter (PDF)
  - [ ] Parse comments into individual items (manual)
  - [ ] Draft response per comment
  - [ ] Track amendment filings (1-A/A)
  - [ ] Build visual pipeline: Filed → Comments → Response → Qualified
  - [ ] Mark offering as "Qualified" with date
- **Acceptance**: User can track SEC review process end-to-end

---

## Sprint 6: Regulation A+ — Offering & Compliance (Weeks 12-13)

### T6.1 — Testing the Waters (Reg A+)
- **Effort**: 6 hours
- **Owner**: Engineering
- **Dependencies**: T5.3
- **Tasks**:
  - [ ] Enable TTW during SEC review period
  - [ ] Auto-append Rule 255 disclaimer
  - [ ] Build investor waitlist with interest amounts
  - [ ] Track non-binding indications of interest
  - [ ] Convert waitlist to investors post-qualification
- **Acceptance**: User can build waitlist during SEC review

### T6.2 — Offering Page Builder
- **Effort**: 12 hours
- **Owner**: Engineering
- **Dependencies**: T5.5
- **Tasks**:
  - [ ] Create white-label offering page template
  - [ ] Customizable sections: hero, company info, team, terms, risks
  - [ ] Embed offering circular PDF
  - [ ] Add "Invest Now" button
  - [ ] Investment amount input with min/max validation
  - [ ] Investor information collection form
  - [ ] Accreditation status selection
  - [ ] Generate unique offering page URL
- **Acceptance**: User can create public offering page

### T6.3 — Investor Onboarding
- **Effort**: 10 hours
- **Owner**: Engineering
- **Dependencies**: T6.2
- **Tasks**:
  - [ ] Create `investors` table schema
  - [ ] Build investor registration flow
  - [ ] Collect: name, email, address, SSN, accreditation status
  - [ ] Integrate Plaid for bank account verification
  - [ ] Generate subscription agreement (DocuSign)
  - [ ] Track investment status (pending, signed, funded, completed)
  - [ ] Send investor confirmation emails
- **Acceptance**: Investors can complete investment flow

### T6.4 — Payment Processing
- **Effort**: 8 hours
- **Owner**: Engineering
- **Dependencies**: T6.3
- **Tasks**:
  - [ ] Integrate Stripe Connect for platform
  - [ ] Create connected account for each issuer
  - [ ] Process ACH payments from investors
  - [ ] Handle payment failures and retries
  - [ ] Track funds in escrow
  - [ ] Release funds to issuer upon close
  - [ ] Generate payment receipts
- **Acceptance**: Payments flow from investor to issuer via Stripe

### T6.5 — Ongoing Compliance (Reg A+)
- **Effort**: 8 hours
- **Owner**: Engineering
- **Dependencies**: T5.5
- **Tasks**:
  - [ ] Calculate Form 1-SA due date (semi-annual)
  - [ ] Calculate Form 1-K due date (annual)
  - [ ] Build Form 1-SA editor
  - [ ] Build Form 1-K editor
  - [ ] Build Form 1-U editor (current events)
  - [ ] Alert for 1-U trigger events (4-day deadline)
  - [ ] Compliance calendar with all deadlines
  - [ ] Send reminder emails for each filing type
- **Acceptance**: User can file ongoing Reg A+ reports

---

## Sprint 7: Polish & Launch (Weeks 14-15)

### T7.1 — Dashboard Refinement 🔄 PARTIAL
- **Effort**: 8 hours
- **Owner**: Engineering
- **Tasks**:
  - [x] Redesign home dashboard with key metrics (initial version)
  - [x] Add "Next Steps" action list
  - [x] Create timeline visualization
  - [ ] Add quick actions (start raise, upload document, invite team)
  - [x] Implement empty states for new users
  - [ ] Add loading skeletons
- **Acceptance**: Dashboard provides clear overview and guidance

### T7.2 — Mobile Optimization
- **Effort**: 10 hours
- **Owner**: Engineering
- **Tasks**:
  - [ ] Audit all pages for mobile responsiveness
  - [ ] Implement bottom navigation for mobile
  - [ ] Optimize form inputs for touch
  - [ ] Test on iOS Safari and Android Chrome
  - [ ] Fix any layout issues
  - [ ] Optimize images for mobile bandwidth
- **Acceptance**: All features work on mobile devices

### T7.3 — Accessibility Audit
- **Effort**: 6 hours
- **Owner**: Engineering
- **Tasks**:
  - [ ] Run automated accessibility scan (axe)
  - [ ] Fix all critical and serious issues
  - [ ] Test keyboard navigation
  - [ ] Test with screen reader (VoiceOver)
  - [ ] Verify color contrast ratios
  - [ ] Add ARIA labels where needed
- **Acceptance**: WCAG 2.1 AA compliance achieved

### T7.4 — Performance Optimization
- **Effort**: 6 hours
- **Owner**: Engineering
- **Tasks**:
  - [ ] Analyze bundle size and code-split
  - [ ] Implement lazy loading for routes
  - [ ] Optimize images (WebP, lazy load)
  - [ ] Add caching headers
  - [ ] Run Lighthouse audit
  - [ ] Achieve 90+ performance score
- **Acceptance**: Page load < 2 seconds on 3G

### T7.5 — Security Hardening
- **Effort**: 6 hours
- **Owner**: Engineering
- **Tasks**:
  - [ ] Implement rate limiting on all endpoints
  - [ ] Add CSRF protection
  - [ ] Review and tighten RLS policies
  - [ ] Ensure all PII is encrypted
  - [ ] Add security headers (CSP, HSTS)
  - [ ] Run OWASP ZAP scan
- **Acceptance**: No critical security vulnerabilities

### T7.6 — Documentation & Help
- **Effort**: 8 hours
- **Owner**: Product
- **Tasks**:
  - [ ] Write user guide for Reg CF workflow
  - [ ] Write user guide for Reg A+ workflow
  - [ ] Create FAQ page
  - [ ] Add contextual help tooltips
  - [ ] Create video walkthrough (optional)
  - [ ] Set up help desk (Intercom/Zendesk)
- **Acceptance**: Users have access to comprehensive help resources

---

## Post-Launch Backlog

### Future Enhancements

| ID | Feature | Priority | Effort |
|----|---------|----------|--------|
| F-01 | AI-powered risk factor generator | P2 | 20h |
| F-02 | Investor CRM with lead scoring | P2 | 30h |
| F-03 | Secondary market for Reg A+ shares | P3 | 60h |
| F-04 | Multi-entity support (holding companies) | P2 | 40h |
| F-05 | EDGAR API integration for auto-filing | P2 | 40h |
| F-06 | Investor portal with portfolio view | P2 | 30h |
| F-07 | Analytics dashboard (conversion, traffic) | P2 | 20h |
| F-08 | White-label platform for portals | P3 | 80h |

---

## Sprint Summary

| Sprint | Focus | Duration | Key Deliverables |
|--------|-------|----------|------------------|
| 0 | Setup | 1 week | Repo, DB, Auth, CI/CD, Design System |
| 1 | Onboarding | 2 weeks | Company Profile, Team, Cap Table, EDGAR |
| 2 | Reg CF Core | 2 weeks | Pathway, Portal, Financials, Form C |
| 3 | Reg CF Campaign | 2 weeks | TTW, Dashboard, Rolling Close, Compliance |
| 4 | Documents & Notifications | 1 week | Document Center, Notifications, Audit Log |
| 5 | Reg A+ Core | 3 weeks | Vendors, Audit, Form 1-A, SEC Tracker |
| 6 | Reg A+ Offering | 2 weeks | TTW, Offering Page, Investors, Payments |
| 7 | Polish & Launch | 2 weeks | Dashboard, Mobile, A11y, Performance, Security |

**Total Duration**: 15 weeks

---

## Definition of Done

A task is complete when:

1. [ ] Code is written and passes linting
2. [ ] Unit tests cover critical paths
3. [ ] Feature works on Chrome, Firefox, Safari
4. [ ] Feature works on mobile (iOS Safari, Android Chrome)
5. [ ] Accessibility requirements met
6. [ ] Code reviewed and approved
7. [ ] Deployed to staging and tested
8. [ ] Product owner accepts feature
