# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in Artlypet, please report it responsibly.

**Email:** security@artlypet.com

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Any suggested fixes

We will acknowledge your report within 48 hours and aim to resolve critical issues within 7 days.

## Breach Notification Procedure (GDPR Article 33)

In the event of a personal data breach:

1. **Detection & Assessment** (0-4 hours)
   - Identify the scope, nature, and categories of affected data
   - Assess the risk to individuals' rights and freedoms
   - Document findings in the incident log

2. **Internal Notification** (4-12 hours)
   - Notify the development team and designated DPO
   - Activate incident response team
   - Begin containment measures

3. **Authority Notification** (within 72 hours)
   - Notify the relevant EU Data Protection Authority
   - Include: nature of breach, categories of data, approximate number of affected individuals, likely consequences, measures taken

4. **User Notification** (without undue delay)
   - If the breach is likely to result in high risk to individuals, notify affected users directly
   - Include: description of the breach, contact details of DPO, likely consequences, measures taken to address the breach

5. **Post-Incident Review** (within 30 days)
   - Root cause analysis
   - Update security measures
   - Update this policy if needed

## Incident Response Contacts

| Role | Contact |
|------|---------|
| Security Lead | security@artlypet.com |
| Privacy / DPO | privacy@artlypet.com |
| General Support | support@artlypet.com |

## Supported Versions

Only the latest production version receives security updates.

## Security Measures

- All data encrypted in transit (HTTPS/TLS)
- Supabase Row Level Security on all tables
- Stripe handles all payment data (PCI-DSS compliant)
- Edge Functions validate JWT on every request
- Rate limiting on sensitive endpoints
- Audit logging of all sensitive operations
- GDPR right-to-deletion implemented
- Cookie consent with granular controls
