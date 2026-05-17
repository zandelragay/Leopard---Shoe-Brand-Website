# Security Specification for Leopard Site Manager

## Data Invariants
1. Only authenticated users listed in the `admins` collection can modify site content.
2. All strings must have a maximum length to prevent resource exhaustion.
3. Timestamps should be server-generated where applicable.
4. Product IDs must match the document ID.

## The "Dirty Dozen" Payloads
1. **Unauthorized Write**: Non-authenticated user tries to update the hero section.
2. **Identity Spoofing**: Changing the `id` of a product in the payload to mismatch the document ID.
3. **Privilege Escalation**: Attempting to write to the `admins` collection.
4. **Massive String**: Injecting a 1MB string into the hero title.
5. **Shadow Field**: Adding `isPublished: true` to a product when not allowed.
6. **Type Mismatch**: Sending a number for a product description.
7. **Negative Price**: Sending a negative value for price (though it's a string here, we could check format).
8. **Orphaned Write**: Creating a package without required fields.
9. **Junk ID**: Using a 2KB string as a product ID.
10. **State Shortcut**: (Not applicable yet as there's no workflow).
11. **PII Leak**: (Not applicable yet as no user data).
12. **Conflict**: Updating `updatedAt` with a client timestamp.

## Test Runner
(Will be implemented if firestore-unit-test is available, but for now focus on rules).
