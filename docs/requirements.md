# Requirements Document: Startup Fundraising Portal

## 1. Functional Requirements

### 1.1 User Management

| ID | Requirement | Priority |
|----|-------------|----------|
| UM-01 | Users can register with email and password | P0 |
| UM-02 | Users must verify email before accessing platform | P0 |
| UM-03 | Users can enable MFA (required for SEC filings) | P0 |
| UM-04 | Users can invite team members with role-based permissions | P1 |
| UM-05 | Roles: Owner, Admin, Editor, Viewer | P1 |
| UM-06 | Users can reset password via email link | P0 |
| UM-07 | Session expires after 30 minutes of inactivity | P0 |

### 1.2 Company Profile

| ID | Requirement | Priority |
|----|-------------|----------|
| CP-01 | Users can create a company profile with legal name, EIN, entity type | P0 |
| CP-02 | System validates EIN format (XX-XXXXXXX) | P1 |
| CP-03 | Users can select entity type: C-Corp, S-Corp, LLC, PBC | P0 |
| CP-04 | Users can input state of incorporation | P0 |
| CP-05 | Users can upload company logo and banner | P2 |
| CP-06 | Users can add business address and mailing address | P1 |
| CP-07 | System stores formation date and fiscal year end | P1 |

### 1.3 Team & Bad Actor Check

| ID | Requirement | Priority |
|----|-------------|----------|
| BA-01 | Users can add team members: Officers, Directors, 20%+ Shareholders | P0 |
| BA-02 | Each team member requires: Name, Title, Email, SSN (encrypted) | P0 |
| BA-03 | System provides bad actor questionnaire per SEC Rule 506(d) | P0 |
| BA-04 | Users must attest to bad actor check completion before filing | P0 |
| BA-05 | System flags if any team member answers "Yes" to disqualifying events | P0 |
| BA-06 | Users can upload background check documentation | P1 |

### 1.4 Cap Table Management

| ID | Requirement | Priority |
|----|-------------|----------|
| CT-01 | Users can manually add shareholders with name, shares, class, price | P0 |
| CT-02 | Users can import cap table via CSV upload | P1 |
| CT-03 | System calculates ownership percentages automatically | P0 |
| CT-04 | System validates total shares match authorized shares | P1 |
| CT-05 | Users can add multiple share classes (Common, Preferred, Options) | P1 |
| CT-06 | System generates cap table summary for Form C / Form 1-A | P0 |

### 1.5 EDGAR Access

| ID | Requirement | Priority |
|----|-------------|----------|
| ED-01 | System provides step-by-step Form ID filing guide | P0 |
| ED-02 | Users can input CIK and CCC after receiving from SEC | P0 |
| ED-03 | System validates CIK format (10 digits) | P1 |
| ED-04 | System stores EDGAR credentials securely (encrypted) | P0 |
| ED-05 | System provides notarization checklist and template | P1 |

### 1.6 Pathway Selection

| ID | Requirement | Priority |
|----|-------------|----------|
| PS-01 | System presents Reg CF vs Reg A+ comparison | P0 |
| PS-02 | Interactive questionnaire recommends pathway based on: raise amount, timeline, budget | P1 |
| PS-03 | Users can override recommendation and select pathway manually | P0 |
| PS-04 | System locks pathway after filing begins (requires support to change) | P1 |

---

## 2. Regulation CF Requirements

### 2.1 Portal Selection

| ID | Requirement | Priority |
|----|-------------|----------|
| CF-01 | System displays list of SEC-registered funding portals | P0 |
| CF-02 | Portal listings include: name, fees, features, application link | P1 |
| CF-03 | Users can mark portal as "Selected" and track application status | P1 |
| CF-04 | System stores portal contract details (fee %, equity %) | P1 |

### 2.2 Financial Statements

| ID | Requirement | Priority |
|----|-------------|----------|
| CF-05 | System determines financial requirement tier based on raise amount | P0 |
| CF-06 | Tier thresholds: <$124k (CEO certified), $124k-$1.235M (reviewed), >$1.235M (audited for repeat) | P0 |
| CF-07 | Users can upload financial statements (PDF, Excel) | P0 |
| CF-08 | System tracks financial statement status: Draft, Under Review, Certified | P1 |
| CF-09 | Users can input CPA firm details for reviewed/audited statements | P1 |

### 2.3 Testing the Waters (TTW)

| ID | Requirement | Priority |
|----|-------------|----------|
| CF-10 | Users can create TTW campaign materials | P1 |
| CF-11 | System auto-appends required SEC disclaimer to all TTW content | P0 |
| CF-12 | Users can generate shareable TTW landing page | P1 |
| CF-13 | System collects email addresses of interested investors | P1 |
| CF-14 | TTW materials must be archived upon Form C filing | P0 |
| CF-15 | System exports TTW materials for SEC submission | P1 |

### 2.4 Form C Builder

| ID | Requirement | Priority |
|----|-------------|----------|
| CF-16 | Guided form builder with all Form C sections | P0 |
| CF-17 | Sections: Company Info, Officers/Directors, Offering Terms, Risk Factors, Use of Proceeds, Financials | P0 |
| CF-18 | Real-time validation for required fields | P0 |
| CF-19 | Auto-save every 30 seconds | P1 |
| CF-20 | Users can preview Form C as PDF | P1 |
| CF-21 | System generates XML for EDGAR submission | P0 |
| CF-22 | Users can export Form C for portal submission | P0 |

### 2.5 Campaign Management

| ID | Requirement | Priority |
|----|-------------|----------|
| CF-23 | Dashboard shows real-time funding progress | P0 |
| CF-24 | System displays 21-day countdown from Form C filing | P0 |
| CF-25 | Users can view investor list (synced from portal) | P1 |
| CF-26 | System tracks minimum/maximum raise amounts | P0 |
| CF-27 | Users can initiate rolling close after minimum is met | P1 |
| CF-28 | System auto-generates Form C-U at 50% and 100% milestones | P1 |

### 2.6 Post-Raise Compliance

| ID | Requirement | Priority |
|----|-------------|----------|
| CF-29 | System sends Form C-AR reminder 90 days before due date | P0 |
| CF-30 | Form C-AR builder with guided sections | P1 |
| CF-31 | System tracks annual reporting obligation status | P0 |
| CF-32 | Users can mark reporting obligation as terminated (with reason) | P1 |

---

## 3. Regulation A+ Requirements

### 3.1 Team Assembly

| ID | Requirement | Priority |
|----|-------------|----------|
| RA-01 | Directory of securities attorneys with RFQ capability | P1 |
| RA-02 | Directory of PCAOB-registered auditors | P1 |
| RA-03 | Directory of broker-dealers | P2 |
| RA-04 | Users can track vendor selection status and contracts | P1 |
| RA-05 | System stores vendor contact info and engagement letters | P1 |

### 3.2 Audit Coordination

| ID | Requirement | Priority |
|----|-------------|----------|
| RA-06 | Document checklist for 2-year audit preparation | P0 |
| RA-07 | Users can upload audit-related documents | P0 |
| RA-08 | System tracks audit status: Not Started, In Progress, Draft, Final | P0 |
| RA-09 | Users can log auditor communications | P1 |
| RA-10 | System stores final audited financials for Form 1-A | P0 |

### 3.3 Form 1-A Builder

| ID | Requirement | Priority |
|----|-------------|----------|
| RA-11 | Guided form builder for all Form 1-A parts | P0 |
| RA-12 | Part I: Notification, Part II: Offering Circular, Part III: Exhibits | P0 |
| RA-13 | Real-time validation for required disclosures | P0 |
| RA-14 | Users can attach exhibits (financials, legal opinions, consents) | P0 |
| RA-15 | System generates EDGAR-compliant XML | P0 |
| RA-16 | Users can preview Offering Circular as PDF | P1 |

### 3.4 SEC Review Tracker

| ID | Requirement | Priority |
|----|-------------|----------|
| RA-17 | Users can log Form 1-A filing date | P0 |
| RA-18 | System tracks SEC comment letter receipt | P0 |
| RA-19 | Users can upload SEC comment letters | P0 |
| RA-20 | Users can draft responses to each comment | P1 |
| RA-21 | System tracks amendment filings (1-A/A) | P0 |
| RA-22 | Visual pipeline: Filed → Comments → Response → Re-filed → Qualified | P0 |
| RA-23 | Users can mark offering as "Qualified" with date | P0 |

### 3.5 Testing the Waters (Reg A+)

| ID | Requirement | Priority |
|----|-------------|----------|
| RA-24 | Users can create TTW materials during SEC review | P1 |
| RA-25 | System auto-appends Rule 255 disclaimer | P0 |
| RA-26 | Users can build investor waitlist | P1 |
| RA-27 | System tracks TTW interest amounts (non-binding) | P1 |

### 3.6 Offering Page

| ID | Requirement | Priority |
|----|-------------|----------|
| RA-28 | Users can create white-label investment page | P1 |
| RA-29 | Page includes: company info, offering terms, risks, invest button | P0 |
| RA-30 | Invest button integrates with payment processor | P1 |
| RA-31 | System collects investor information and subscription agreements | P0 |
| RA-32 | Users can set investment minimums and maximums | P0 |

### 3.7 Ongoing Compliance

| ID | Requirement | Priority |
|----|-------------|----------|
| RA-33 | System sends Form 1-SA reminder (semi-annual) | P0 |
| RA-34 | System sends Form 1-K reminder (annual) | P0 |
| RA-35 | Form 1-U builder for current event reporting | P0 |
| RA-36 | System alerts for 1-U trigger events (4-day deadline) | P0 |
| RA-37 | Compliance calendar with all filing deadlines | P1 |

---

## 4. Document Management

| ID | Requirement | Priority |
|----|-------------|----------|
| DM-01 | Users can upload documents (PDF, DOCX, XLSX, CSV) | P0 |
| DM-02 | Maximum file size: 50MB | P1 |
| DM-03 | Documents organized by category: Financials, Legal, Filings, Marketing | P1 |
| DM-04 | Version history for all documents | P1 |
| DM-05 | Documents searchable by name and tags | P2 |
| DM-06 | Secure document sharing with expiring links | P1 |

---

## 5. Notifications & Reminders

| ID | Requirement | Priority |
|----|-------------|----------|
| NF-01 | Email notifications for: filing deadlines, SEC comments, investor activity | P0 |
| NF-02 | In-app notification center | P1 |
| NF-03 | Users can configure notification preferences | P1 |
| NF-04 | SMS notifications for critical deadlines (optional) | P2 |
| NF-05 | Weekly digest email summarizing pending actions | P1 |

---

## 6. Non-Functional Requirements

### 6.1 Performance

| ID | Requirement | Priority |
|----|-------------|----------|
| PF-01 | Page load time < 2 seconds (P95) | P0 |
| PF-02 | API response time < 500ms (P95) | P0 |
| PF-03 | Support 1,000 concurrent users | P1 |
| PF-04 | 99.9% uptime SLA | P0 |

### 6.2 Security

| ID | Requirement | Priority |
|----|-------------|----------|
| SC-01 | All data encrypted in transit (TLS 1.3) | P0 |
| SC-02 | All PII encrypted at rest (AES-256) | P0 |
| SC-03 | SOC 2 Type II compliance | P1 |
| SC-04 | Annual penetration testing | P1 |
| SC-05 | Audit log for all user actions | P0 |
| SC-06 | IP-based rate limiting | P0 |

### 6.3 Compliance

| ID | Requirement | Priority |
|----|-------------|----------|
| CM-01 | Data retention: 7 years for SEC-related documents | P0 |
| CM-02 | GDPR compliance for EU users | P1 |
| CM-03 | CCPA compliance for California users | P1 |
| CM-04 | Audit trail exportable for regulatory review | P0 |

### 6.4 Accessibility

| ID | Requirement | Priority |
|----|-------------|----------|
| AC-01 | WCAG 2.1 AA compliance | P0 |
| AC-02 | Keyboard navigation for all features | P0 |
| AC-03 | Screen reader compatibility | P0 |
| AC-04 | Color contrast ratio ≥ 4.5:1 | P0 |

### 6.5 Browser Support

| ID | Requirement | Priority |
|----|-------------|----------|
| BR-01 | Chrome (last 2 versions) | P0 |
| BR-02 | Firefox (last 2 versions) | P0 |
| BR-03 | Safari (last 2 versions) | P0 |
| BR-04 | Edge (last 2 versions) | P0 |
| BR-05 | Mobile Safari (iOS 14+) | P0 |
| BR-06 | Chrome Mobile (Android 10+) | P0 |

---

## 7. Integration Requirements

| ID | Integration | Purpose | Priority |
|----|-------------|---------|----------|
| IN-01 | Stripe Connect | Platform fees, investor payments | P0 |
| IN-02 | Plaid | Bank account verification | P1 |
| IN-03 | DocuSign | Subscription agreement signing | P1 |
| IN-04 | SendGrid | Transactional emails | P0 |
| IN-05 | Twilio | SMS notifications | P2 |
| IN-06 | AWS S3 | Document storage | P0 |
| IN-07 | Wefunder API | Campaign sync (if available) | P2 |
| IN-08 | Republic API | Campaign sync (if available) | P2 |

---

## 8. Data Model (Core Entities)

```
Company
├── id, name, ein, entity_type, state, formed_at
├── address, logo_url, fiscal_year_end
└── edgar_cik, edgar_ccc

TeamMember
├── id, company_id, name, title, email
├── role (officer, director, shareholder)
├── ownership_percentage, bad_actor_status
└── ssn_encrypted

CapTableEntry
├── id, company_id, shareholder_name
├── share_class, shares, price_per_share
└── issue_date, vesting_schedule

Raise
├── id, company_id, regulation (cf, reg_a)
├── status (draft, filed, live, closed)
├── target_amount, minimum_amount, amount_raised
├── start_date, end_date
└── portal_id (for CF)

Document
├── id, company_id, raise_id
├── type (financial, legal, filing, marketing)
├── name, url, version
└── uploaded_at, uploaded_by

Filing
├── id, raise_id, form_type (C, C-U, C-AR, 1-A, 1-K, 1-SA, 1-U)
├── status (draft, submitted, qualified)
├── filed_at, sec_accession_number
└── content_json

Investor
├── id, raise_id, name, email
├── amount_invested, shares_issued
├── accredited_status, investment_date
└── subscription_agreement_url

Notification
├── id, user_id, type, title, body
├── read_at, created_at
└── action_url
```

---

## 9. Acceptance Criteria Summary

### MVP (Phase 1)
- [ ] User registration and authentication with MFA
- [ ] Company profile creation with entity validation
- [ ] Team roster with bad actor questionnaire
- [ ] Cap table manual entry and CSV import
- [ ] EDGAR access wizard
- [ ] Reg CF Form C builder with validation
- [ ] Document upload and management
- [ ] Email notifications for deadlines

### Phase 2
- [ ] Reg A+ Form 1-A builder
- [ ] SEC comment tracker
- [ ] Testing the Waters campaign builder
- [ ] Portal marketplace with comparison
- [ ] Investor waitlist management
- [ ] Form C-U auto-generation

### Phase 3
- [ ] White-label offering page for Reg A+
- [ ] Stripe integration for payments
- [ ] DocuSign integration for subscriptions
- [ ] Compliance calendar
- [ ] Vendor directory with RFQ
- [ ] Mobile-optimized experience
