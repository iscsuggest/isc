# Security Policy for Ibn-e-Sina Portal

## Supported Versions

We actively support the latest stable version of our web portal. Security fixes are backported to the previous version for critical issues only.

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please **do not open a public issue**. Instead, email the project maintainer at: ***raahim_fahd@outlook.com*** 


Include as much detail as possible, such as:

- Steps to reproduce
- Screenshots, if applicable
- Browser/OS environment
- Any relevant logs or error messages

We will respond as quickly as possible and coordinate with you before publicly disclosing any security issues.

## Security Guidelines for Users

- **Authentication:** Users must sign in with Google to submit suggestions or complaints.
- **Rate Limiting:** Certain features have rate limits to prevent abuse.
- **Sensitive Information:** API keys and emails should **never** be exposed publicly. We use client-side Firebase configuration but sensitive operations like sending emails are handled server-side (via Google Apps Script).

## Security Practices

- **Firebase Rules:** Firestore has rules to restrict who can read/write data.
- **Data Validation:** All user inputs are validated on both client and server.
- **HTTPS Only:** The site is hosted over HTTPS to secure data in transit.
- **No Secrets in Repo:** Emails and API keys used in backend functions are kept hidden and not committed to GitHub.

## Disclosure Policy

- The project team will acknowledge reporters of security issues.
- Vulnerabilities will be fixed in a timely manner.
- Users should update to the latest version when fixes are deployed.


