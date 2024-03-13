OWASP

A01:2021 – Broken Access Control

* Least privilege by default
* Path traversal
* CSRF
* OAuth standards
* Only DAST is able to partially protect against that

Developers and QA staff should include functional access control unit and integration tests.

A02:2021 – Cryptographic Failures

* Discard sensitive data as soon as possible or use PCI DSS compliant tokenization or even truncation
* Make sure to encrypt all sensitive data at rest
* Ensure up-to-date and strong standard algorithms, protocols, and keys are in place
* Encrypt all data in transit with secure protocols such as TLS
* Disable caching for response that contain sensitive data
* SAST and DAST can be applied

A03:2021 – Injection

* Vulnerabilities that permit XSS attacks through DOM manipulation or abuse.
* Avoid using interpreters on not sanitized user input (js eval, html render, css eval)
* SAST can be applied but should be intelligent enough to avoid false positives

A04:2021 – Insecure Design

* Establish and use a secure development lifecycle with AppSec professionals
* Establish and use a library of secure design patterns or paved road ready to use components
* Use threat modeling for critical authentication, access control, business logic, and key flows
* Write unit and integration tests to validate that all critical flows are resistant to the threat model
* It is more about practice and methodology of developing an app. SAST and DAST are just parts of it

A05:2021 – Security Misconfiguration

* Unnecessary features are enabled or installed (e.g., unnecessary ports, services, pages, accounts, or privileges)
* Error handling reveals stack traces or other overly informative error messages to users (does this mean display or
  console? Or it is just about API calls)
* Directory listing (if not disabled) can be used to access source code of API handlers
* There is no way of preventing that using SAST. DAST is under question

A06:2021 – Vulnerable and Outdated Components

* Continuously inventory the versions of both client-side and server-side components (e.g., frameworks, libraries) and
  their dependencies using tools like versions, OWASP Dependency Check, retire.js, etc. Continuously monitor sources
  like
  Common Vulnerability and Exposures (CVE) and National Vulnerability Database (NVD) for vulnerabilities in the
  components.
  Use software composition analysis tools to automate the process. Subscribe to email alerts for security
  vulnerabilities
  related to components you use.
* Only obtain components from official sources over secure links. Prefer signed packages to reduce the chance of
  including a modified, malicious component.
* There are tools for analyzing and auditing third parties (SAST). It is a big problem, especially in the state of
  global conflicts.

A07:2021 – Identification and Authentication Failures

* It is more about how authentication process is implemented. There is nothing (or little) to do with client side
  implementation

A08:2021 – Software and Data Integrity Failures

* Use digital signatures or similar mechanisms to verify the software or data is from the expected source and has not
  been altered.
* Ensure libraries and dependencies, such as npm or Maven, are consuming trusted repositories. If you have a higher risk
  profile, consider hosting an internal known-good repository that's vetted.
* Ensure that a software supply chain security tool, such as OWASP Dependency Check or OWASP CycloneDX, is used to
  verify that components do not contain known vulnerabilities
* SAST for analyzing dependencies. And DAST (probably) for detecting insecure deserialization cases

A09:2021 – Security Logging and Monitoring Failures

* Penetration testing and scans by dynamic application security testing (DAST) tools (such as OWASP ZAP) do not trigger
  alerts.
* It is more about analyzing and reacting to threads, as soon as possible

A10:2021 – Server-Side Request Forgery (SSRF)

* It is about making requests from the server side, thus potentially gaining access to private information. Sensitive
  data exposure – Attackers can access local files or internal services to gain sensitive information such as file:
  ///etc/passwd and http://localhost:28017/.
* SAST can cover that partially. DAST also might help with it.

3. Sensitive Data Leakage

Inability to detect/prevent digital trackers and pixels across a web property to ensure national and international
privacy laws are complied with.

5. Lack of Third-party Origin Control

Origin control allows the restriction of certain web assets or resources by comparing the origin of the resource to the
origin of the third-party library. Without leveraging such controls, supply chain risk increases due to inclusion of
unknown or uncontrolled third-party code that has access to data in the site’s origin.

6. JavaScript Drift

Inability to detect changes at the asset and code level of JavaScript used client-side. This includes the inability to
detect behavioral changes of this code to determine if the changes are potentially malicious in nature. This is
particularly important for third-party libraries.

7. Sensitive Data Stored Client-Side

Storage of sensitive data like passwords, crypto secrets, API tokens, or PII data in persistent client-side storage like
LocalStorage, browser cache, or transient storage like JavaScript variables in a data layer.

9. Not Using Standard Browser Security Controls

Not using common standards-based security controls built into browsers such as iframe sandboxes, and security headers
like Content Security Policy (CSP), subresource integrity, and many other standard security features.

10. Including Proprietary Information on the Client-Side

Presence of sensitive business logic, developer comments, proprietary algorithms, or system information contained in
client-side code or stored data.