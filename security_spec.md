# Security Specification - Mujer Emprendedora

## 1. Data Invariants
1. **User Identity Isolation**: A user can only access, create, update, or delete records where `userId == request.auth.uid`.
2. **Path Parameter Integrity**: Any document creation or access under `/users/{userId}` or `/learning_states/{userId}` must strictly match `request.auth.uid`.
3. **No Cross-User Leaks**: Documents in `/products` and `/sales` must have `incoming().userId == request.auth.uid` on write, and `resource.data.userId == request.auth.uid` on read and delete.
4. **No Blanket Reads**: Querying `/products` or `/sales` collections must explicitly enforce `resource.data.userId == request.auth.uid`.
5. **Immutable Ownership**: The `userId` of existing products and sales cannot be modified or reassigned to another user.
6. **Data Bounds**: All string properties have max lengths to prevent resource exhaustion attacks.

## 2. The "Dirty Dozen" Payloads (Must be rejected)
1. **Unauthenticated Read**: Anonymous/unauthenticated `GET /users/some-uid` -> REJECTED.
2. **Cross-User Profile Read**: User A tries `GET /users/user-b` -> REJECTED.
3. **Cross-User Product Read**: User A tries `GET /products/product-of-b` -> REJECTED.
4. **Cross-User Sale Read**: User A tries `GET /sales/sale-of-b` -> REJECTED.
5. **Cross-User Product List**: User A queries `/products` without `userId == User A` -> REJECTED.
6. **Cross-User Sale List**: User A queries `/sales` without `userId == User A` -> REJECTED.
7. **Identity Spoofing on Product Create**: User A creates product with `userId: "user-b"` -> REJECTED.
8. **Identity Spoofing on Sale Create**: User A creates sale with `userId: "user-b"` -> REJECTED.
9. **Ownership Tampering**: User A updates product to change `userId` to "user-c" -> REJECTED.
10. **Cross-User Learning Progress Tamper**: User A writes to `/learning_states/user-b` -> REJECTED.
11. **Oversized String Injection Attack**: User writes 10KB junk to `name` or `description` -> REJECTED.
12. **Malicious ID Path Poisoning**: User requests path with invalid or injected characters -> REJECTED.
