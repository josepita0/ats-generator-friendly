# Security Policy

## Supported Versions

Only the latest version of ATS-Friendly CV Generator receives security updates.

| Version | Supported          |
| ------- | ------------------ |
| latest  | :white_check_mark: |
| < latest | :x:               |

## Reporting a Vulnerability

If you discover a security vulnerability, please report it responsibly.

**Do not open a public GitHub issue for security vulnerabilities.**

Instead, please use [GitHub Security Advisories](https://github.com/josepita0/ats-generator-friendly/security/advisories/new) to report vulnerabilities privately. This ensures the issue can be triaged and addressed before public disclosure.

### What to include

- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

### Response timeline

- Acknowledgment within 72 hours
- Assessment and initial response within 1 week
- Fix or mitigation as soon as practical

## Scope

This is a personal-use, client-side application with no backend persistence. The primary security concerns are:

- **API key exposure**: Gemini API keys must never be exposed to the client bundle
- **XSS**: User input rendered in the browser should be sanitized
- **localStorage**: Data stored locally is not encrypted — users should be aware this is not a secure storage mechanism

There is no bug bounty program.

## Best Practices for Users

- Do not enter real API keys in shared or public environments
- Be aware that all resume data is stored locally in your browser
- Clear localStorage if you no longer need your data
