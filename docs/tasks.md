# Tasks: Startup Fundraising Portal

## Overview

This document breaks down implementation into sprints. Each task includes estimated effort, dependencies, and acceptance criteria.

---

## Sprint 0: Project Setup (Week 1)

### T0.1 — Initialize Repository
- **Effort**: 2 hours
- **Owner**: Engineering
- **Tasks**:
  - [ ] Create Next.js 14 project with App Router
  - [ ] Configure TypeScript strict mode
  - [ ] Set up ESLint + Prettier
  - [ ] Initialize Tailwind CSS
  - [ ] Add shadcn/ui component library
  - [ ] Configure path aliases (`@/components`, `@/lib`, etc.)
- **Acceptance**: `npm run dev` starts without errors

### T0.2 — Database Setup
- **Effort**: 4 hours
- **Owner**: Engineering
- **Tasks**:
  - [ ] Set up Supabase project
  - [ ] Configure Prisma ORM with Supabase PostgreSQL
  - [ ] Create initial schema migrations
  - [ ] Set up row-level security policies
  - [ ] Configure database connection pooling
- **Acceptance**: Prisma migrations run successfully

### T0.3 — Authentication
- **Effort**: 6 hours
- **Owner**: Engineering
- **Dependencies**: T0.2
- **Tasks**:
  - [ ] Implement Supabase Auth
  - [ ] Create sign-up flow with email verification
  - [ ] Create sign-in flow
  - [ ] Implement password reset
  - [ ] Add MFA setup (TOTP)
  - [ ] Create auth middleware for protected routes
- **Acceptance**: User can register, verify email, sign in, and enable MFA

### T0.4 — CI/CD Pipeline
- **Effort**: 3 hours
- **Owner**: Engineering
- **Tasks**:
  - [ ] Configure GitHub Actions for linting
  - [ ] Add type checking to CI
  - [ ] Set up Vercel deployment
  - [ ] Configure preview deployments for PRs
  - [ ] Add environment variable management
- **Acceptance**: PRs trigger preview deployments automatically

### T0.5 — Design System Foundation
- **Effort**: 4 hours
- **Owner**: Engineering
- **Tasks**:
  - [ ] Configure color tokens in Tailwind
  - [ ] Set up typography scale
  - [ ] Create base Button component variants
  - [ ] Create Card component
  - [ ] Create Input and Form components
  - [ ] Create Badge/Status components
  - [ ] Document components in Storybook (optional)
- **Acceptance**: Core UI components render correctly

---

## Sprint 1: Company Onboarding (Weeks 2-3)

### T1.1 — Company Profile Form
- **Effort**: 8 hours
- **Owner**: Engineering
- **Dependencies**: T0.3
- **Tasks**:
  - [ ] Create `companies` table schema
  - [ ] Build multi-step company creation wizard
  - [ ] Step 1: Legal name, EIN (with validation), entity type
  - [ ] Step 2: State of incorporation, formation date
  - [ ] Step 3: Business address, mailing address
  - [ ] Step 4: Fiscal year end selection
  - [ ] Add logo upload with image cropping
  - [ ] Implement form validation with Zod
- **Acceptance**: User can create company profile with all required fields

### T1.2 — Team Roster
- **Effort**: 10 hours
- **Owner**: Engineering
- **Dependencies**: T1.1
- **Tasks**:
  - [ ] Create `team_members` table schema
  - [ ] Build team member add/edit modal
  - [ ] Fields: Name, title, email, role (officer/director/shareholder)
  - [ ] Add ownership percentage input (for 20%+ shareholders)
  - [ ] Implement SSN collection with encryption
  - [ ] Create team roster list view with edit/delete
  - [ ] Add role-based badges (Officer, Director, 20%+ Owner)
- **Acceptance**: User can add team members with all required fields

### T1.3 — Bad Actor Questionnaire
- **Effort**: 6 hours
- **Owner**: Engineering
- **Dependencies**: T1.2
- **Tasks**:
  - [ ] Create questionnaire based on SEC Rule 506(d)
  - [ ] 8 disqualifying event questions per team member
  - [ ] Implement yes/no responses with explanation fields
  - [ ] Flag team members with "Yes" answers
  - [ ] Block filing if any unresolved flags
  - [ ] Add attestation checkbox for company owner
  - [ ] Store questionnaire responses with timestamps
- **Acceptance**: Bad actor check blocks filing if disqualifying events exist

### T1.4 — Cap Table Management
- **Effort**: 12 hours
- **Owner**: Engineering
- **Dependencies**: T1.1
- **Tasks**:
  - [ ] Create `cap_table_entries` table schema
  - [ ] Build shareholder add/edit form
  - [ ] Fields: Name, share class, shares, price, issue date
  - [ ] Create share class management (Common, Preferred Series A/B, Options)
  - [ ] Implement CSV import with column mapping
  - [ ] Auto-calculate ownership percentages
  - [ ] Validate total shares vs authorized shares
  - [ ] Create cap table summary view
  - [ ] Export cap table as PDF
- **Acceptance**: User can manage cap table manually and via CSV import

### T1.5 — EDGAR Access Wizard
- **Effort**: 6 hours
- **Owner**: Engineering
- **Dependencies**: T1.1
- **Tasks**:
  - [ ] Create step-by-step Form ID guide
  - [ ] Step 1: Explain EDGAR and why it's needed
  - [ ] Step 2: Link to SEC EDGAR Filer Management
  - [ ] Step 3: Notarization instructions with template download
  - [ ] Step 4: CIK and CCC input fields
  - [ ] Validate CIK format (10 digits)
  - [ ] Store credentials encrypted
  - [ ] Show EDGAR status on company dashboard
- **Acceptance**: User can complete EDGAR setup and store credentials

---

## Sprint 2: Regulation CF — Core (Weeks 4-5)

### T2.1 — Pathway Selection
- **Effort**: 4 hours
- **Owner**: Engineering
- **Dependencies**: T1.5
- **Tasks**:
  - [ ] Create Reg CF vs Reg A+ comparison page
  - [ ] Build interactive questionnaire (raise amount, timeline, budget)
  - [ ] Implement recommendation algorithm
  - [ ] Allow manual pathway override
  - [ ] Create `raises` table schema
  - [ ] Initialize raise record with selected pathway
- **Acceptance**: User can select fundraising pathway with guidance

### T2.2 — Portal Marketplace
- **Effort**: 6 hours
- **Owner**: Engineering
- **Dependencies**: T2.1
- **Tasks**:
  - [ ] Create `portals` table with seed data (Wefunder, Republic, StartEngine)
  - [ ] Portal fields: name, logo, cash_fee_percent, equity_fee_percent, features
  - [ ] Build portal comparison grid
  - [ ] Add "Select Portal" action
  - [ ] Track portal application status (Applied, Accepted, Rejected)
  - [ ] Store portal contract details
- **Acceptance**: User can compare and select funding portal

### T2.3 — Financial Tier Calculator
- **Effort**: 4 hours
- **Owner**: Engineering
- **Dependencies**: T2.1
- **Tasks**:
  - [ ] Calculate financial requirement tier based on raise amount
  - [ ] Display tier requirements (CEO certified / Reviewed / Audited)
  - [ ] Check if repeat issuer (requires audited for >$1.235M)
  - [ ] Create `financial_statements` table
  - [ ] Build upload interface for financial documents
  - [ ] Track statement status (Draft, Under Review, Certified)
- **Acceptance**: System correctly determines financial requirements

### T2.4 — Form C Builder (Part 1)
- **Effort**: 16 hours
- **Owner**: Engineering
- **Dependencies**: T2.3
- **Tasks**:
  - [ ] Create `filings` table schema
  - [ ] Build section-based form editor
  - [ ] Section: Issuer Information (auto-populated from company profile)
  - [ ] Section: Officers, Directors, and Owners (from team roster)
  - [ ] Section: Offering Information (terms, price, min/max)
  - [ ] Section: Risk Factors (rich text editor)
  - [ ] Implement auto-save (30-second interval)
  - [ ] Add progress indicator per section
  - [ ] Real-time validation for required fields
- **Acceptance**: User can complete first 4 sections of Form C

### T2.5 — Form C Builder (Part 2)
- **Effort**: 12 hours
- **Owner**: Engineering
- **Dependencies**: T2.4
- **Tasks**:
  - [ ] Section: Use of Proceeds (table with categories and amounts)
  - [ ] Section: Financial Condition (narrative + financials attachment)
  - [ ] Section: Related Party Transactions
  - [ ] Section: Other Material Information
  - [ ] Generate Form C preview as PDF
  - [ ] Export Form C data for portal submission
  - [ ] Mark Form C as "Ready to File"
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
  - [ ] Create `documents` table schema
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
  - [ ] Create `notifications` table schema
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
  - [ ] Create `audit_logs` table schema
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

### T7.1 — Dashboard Refinement
- **Effort**: 8 hours
- **Owner**: Engineering
- **Tasks**:
  - [ ] Redesign home dashboard with key metrics
  - [ ] Add "Next Steps" action list
  - [ ] Create timeline visualization
  - [ ] Add quick actions (start raise, upload document, invite team)
  - [ ] Implement empty states for new users
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
