# Security reporting

Send suspected vulnerabilities to the maintainer contact listed in the root
package metadata: [frank@arcanea.ai](mailto:frank@arcanea.ai), with subject
`Arcanea security report`. GitHub private vulnerability reporting was disabled
when this guidance was prepared. If the repository's
[security page](https://github.com/frankxai/arcanea-ai-app/security) later offers
“Report a vulnerability”, that private form is another reporting route.

Public issues, pull requests and logs are visible to others. Keep exploit details,
keys, access tokens, private manuscript content and personal data out of them.
If private contact is unavailable, open an issue asking only for a secure reporting
channel; leave the vulnerability details out.

Include the affected commit or package/version, impacted feature, expected and
observed behavior, and minimal reproduction using your own local/test data.
Describe whether accounts, private worlds, provider keys, publishing permissions
or payment data could be affected. Redact credentials from evidence.

Use an isolated environment and accounts you control. This policy does not authorize
testing other users' data, live publishing/payment actions or disruptive production
traffic. A public source repository does not imply a paid bounty or testing agreement.

Fix review should bind reproduction and verification to the affected and repaired
revisions. Coordinate disclosure with the maintainer after review. There is no
published response-time guarantee or historical-version support commitment here.

[GitHub's private reporting guidance](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/report-privately)
explains the private form and the fallback when it is unavailable.
