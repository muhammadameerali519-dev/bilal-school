# Security Specification & Hardened Rules Audit — BILAL SHEIKH

## 1. Data Invariants
1. **Catalog Integrity**: Only verified store administrators (`isAdmin()`) may create, update, or delete `/products/{productId}`, `/storeSettings/{settingId}`, and `/galleryItems/{itemId}`.
2. **PII Isolation (Orders & Custom Requests)**: Customer personal data (`customerName`, `whatsappNumber`, `email`, `deliveryAddress`) in `/orders/{orderId}` and `/customRequests/{requestId}` can NEVER be read or listed by other customers or unauthenticated visitors. Only `isAdmin()` or the authenticated creator (`resource.data.customerUid == request.auth.uid`) may read their own records.
3. **Immutable Order Initial State**: Newly created orders MUST have `status == 'Awaiting WhatsApp Confirmation'` and custom requests MUST have `status == 'Pending Review'`. Customers cannot self-confirm an order or alter pricing/status after submission.
4. **User & Wishlist Isolation**: `/users/{userId}` and `/users/{userId}/wishlist/{productId}` are strictly accessible only to the verified authenticated owner (`request.auth.uid == userId && request.auth.token.email_verified == true`) or `isAdmin()`.
5. **No Client-Claim Admin Escalation**: Admin access requires `request.auth.token.email_verified == true` matched against the bootstrapped runtime admin email or `/admins/{uid}`. Users cannot write to `/admins`.
6. **Temporal Integrity**: All `createdAt` and `updatedAt` fields must equal `request.time`.

## 2. Adversarial "Dirty Dozen" Payloads (Expected: PERMISSION_DENIED)
1. **Shadow Field Injection on Product Create**: `{ ..., "isVerified": true }` -> Blocked by `keys().hasOnly(...)`.
2. **Unverified Email Admin Spoof**: Token has `email: "80880q0q0@gmail.com"`, `email_verified: false` -> Blocked by `email_verified == true`.
3. **Customer Self-Confirming Order**: Order create with `status: "Confirmed"` -> Blocked by `incoming().status == 'Awaiting WhatsApp Confirmation'`.
4. **Cross-User Order Read/List**: Signed-in user `uid_A` calling `get` or `list` on `/orders` where `customerUid == 'uid_B'` -> Blocked by `resource.data.customerUid == request.auth.uid`.
5. **Guest Reading Orders**: Unauthenticated `list` on `/orders` -> Blocked.
6. **ID Poisoning**: Document ID > 128 chars or containing `../` -> Blocked by `isValidId(id)`.
7. **Payload Exhaustion (Denial of Wallet)**: `description` string > 2000 chars or `items` list > 30 -> Blocked by strict `.size()` bounds.
8. **Identity Spoofing on Order**: Signed-in user `uid_A` creating an order with `customerUid: "uid_B"` or `"guest"` -> Blocked by `data.customerUid == request.auth.uid`.
9. **Immortal Field Mutation**: Updating an order's `createdAt` or `customerUid` -> Blocked by immutability checks.
10. **Blanket User Profile Read**: Signed-in user `uid_A` reading `/users/uid_B` -> Blocked by `isOwner(userId)`.
11. **Privilege Escalation**: Signed-in user creating `/admins/{uid}` -> Blocked (`allow write: if isAdmin()`).
12. **Client Timestamp Forgery**: Creating a document with backdated `createdAt` (`!= request.time`) -> Blocked by `incoming().createdAt == request.time`.
