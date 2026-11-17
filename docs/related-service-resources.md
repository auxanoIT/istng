# Related resources

In Sanity Studio, use **Related Services**, **Related Industries** and **Related Reading** on a resource. Select the service or industry by name; these menus use the current website navigation. The original **Related Sub-Service** field on articles still works for existing documents.

Published resources appear both in their resource collection and in **Related Resources** on the selected service or industry page. Their detail pages link back to those same services and industries. The page shows up to six related resources and leaves the section out when there are no matches.

Example: link a hotel solar article to a commercial load assessment guide, the Hospitality & Leisure industry and Commercial Solar Installation.

The resource queries use the published perspective and request-driven cache refresh. The signed publish webhook can invalidate the cache immediately. See [Sanity setup](sanity-setup.md).

Validate the relationship queries locally with `node scripts/check-related-service-resources.mjs`. The fixtures are never uploaded.

