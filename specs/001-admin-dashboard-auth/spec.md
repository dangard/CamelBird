# Feature Specification: Admin dashboard with authenticated CRUD

**Feature Branch**: `001-admin-dashboard-auth`

**Created**: 2026-05-13

**Status**: Draft

**Input**: User description: "Add an Admin Screen requiring login. This takes you to an Admin Dashboard. Admin Dashboard has two sub pages: User CRUD and Devlog CRUD. API calls should be secured via JWT (including renewal via JWT refresh where the backend supports it). Link to admin via a gear icon at the right end of the footer."

**Alignment (CamelBird-API plan)**: (**1**) **Single `users` model** — every account requires a password; (**2**) **Standard verbs** — `GET`/`POST`/`PATCH`/`DELETE` on plural `/users` and `/devlogs` (no RPC-style deactivate URLs); (**3**) **Roles** — **Admin**, **Read Only** (`read_only`), **Maintainer** (`maintainer`: **GET + PATCH** only—no **POST**/**DELETE**); (**4**) **Public devlog read** — visitor-facing devlog use stays **unauthenticated** (**FR-023**); **`GET /devlogs`** (or equivalent public contract) remains available **without** login for the **narrow public projection** while staff admin uses authenticated verbs; (**5**) **Email uniqueness** — each staff **email** is globally unique (**FR-024**), enforced by the API and reflected in admin create/update flows.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Staff signs in and reaches dashboard (Priority: P1)

An authorized **staff member** (**Admin**, **Read Only**, or **Maintainer**) discovers admin entry from
the public site footer, signs in with valid credentials, and lands on an administrative dashboard that
shows where to work with users and devlogs—subject to **role** (dashboard chrome may be identical;
available actions differ by role).

**Why this priority**: Without authenticated entry and a hub screen, no administrative work can
begin; this is the minimum viable slice.

**Independent Test**: Using footer navigation, login, and session lifecycle checks (refresh failure, sign-out, history restore, second tab), verify behavior in **User story 1** scenarios **3–10** without exposing CRUD before auth or after exit.

**Acceptance Scenarios**:

1. **Given** a visitor on any public page with the footer visible, **When** they activate the admin
   entry control at the **right end** of the footer, **Then** they are taken to an administrative
   **login experience** (not the dashboard content itself until authenticated).
2. **Given** the login screen, **When** staff submit **valid** credentials, **Then** they are taken to the
   **Admin Dashboard** home that confirms successful entry, reflects their **assigned role**, and surfaces
   paths to **User administration** and **Devlog administration** (create/delete/destructive controls MUST be absent
   or disabled for **`read_only`**; **`maintainer`** MUST NOT see create or delete—only read and permitted **PATCH** actions).
3. **Given** a staff member has been actively working past the nominal lifetime of their initial
   **access JWT**, **When** they trigger protected actions or navigation that requires
   authorization, **Then** the session MUST remain usable **without repeating password entry** provided
   **JWT refresh** succeeds under backend policy (otherwise they MUST be guided to sign in again); **in-progress form entries MUST NOT be discarded solely because access-token expiry triggered refresh** when refresh succeeds.
4. **Given** refresh credentials are **missing, expired, or revoked**, **When** the access JWT is no longer
   accepted, **Then** the operator MUST reach a safe sign-in experience **without** prior administrative CRUD
   content leaking (**FR-011**).
5. **Given** a protected API response, **When** it indicates **401** (authentication—including **malformed** `Authorization` or wrong scheme), **Then** the product
   follows refresh-then-sign-in policy; **When** it indicates **403** insufficient **role**, **Then** messaging
   MUST differ from **401** and from **not found** wherever the API distinguishes (**FR-015**).
6. **Given** **two browser contexts** (e.g. tabs) share one signed-in session, **When** tokens refresh or rotate,
   **Then** client-held credentials MUST stay coherent (serialized refresh or equivalent)—no undefined mixed token state.
7. **Given** a **bookmark or direct URL** to an administrative route **without** a session, **Then** login
   precedes any CRUD view. **Given** staff open the **login** experience **while already authenticated**, **Then** behavior follows a single documented policy (e.g. redirect to dashboard or replace session) **without** credentials in URLs or conflicting token sets. **Given** staff **sign out**, **Then** credentials clear and admin routes require
   login again; **tokens MUST NOT appear in URL query strings**. **Given** **browser history restores** an admin
   page, **Then** session MUST be **re-verified** before showing protected content (**FR-019**).
8. **Given** the server changes the signed-in user’s **`role`** or **`is_active`** while the client still holds a prior token, **When** the next protected interaction completes, **Then** affordances MUST match current server permissions or force sign-in (**FR-018**). **Given** an **Admin** **demotes their own role**, **Then** the next forbidden mutation yields **403** and chrome downgrades without indefinite stale **Admin** controls (**SC-009**).
9. **Given** the signed-in account is **deactivated** or refresh returns **401** repeatedly, **Then** sensitive admin UI MUST clear with **bounded refresh retries** (backoff)—no CRUD flash. **Given** **429** on login or throttled API calls, **Then** operator-visible retry guidance without credential oracle (**FR-013**/**FR-015**). **Given** **5xx**, empty or unparseable API bodies, or **client timeouts**, **Then** outcomes follow **FR-020** (no false success).
10. **Given** token validation errors tied to **clock skew**, **When** the API signals not-yet-valid or expired access, **Then** recovery follows the agreed contract **without infinite retry loops**.
11. **Given** the **hosted SPA origin** (e.g. staging or production) is **not** permitted by **CamelBird-API** **CORS** policy, **When** staff attempt administrative API calls from that deployment, **Then** the product MUST surface a **predictable**, operator-actionable outcome (**FR-022**, **FR-015**) that indicates **configuration or environment mismatch**—not a vague generic application fault.

---

### User Story 2 - Staff manage users by role (Priority: P2)

From the dashboard, staff open **User** administration and perform the **create**, **view/list**, **update**,
and **deactivate/archive** operations **their role allows**, consistent with **CamelBird-API RBAC**: **Admin** — full verbs the API exposes; **Read Only** — **GET** (list/detail) only; **Maintainer** —
**GET + PATCH** only (**no create**, **no DELETE**).

**Why this priority**: User lifecycle management is one of two mandated administrative surfaces.

**Independent Test**: From an authenticated session, exercise user flows **per role** (e.g. **Admin**:
create → view → edit → deactivate where applicable; **Maintainer**: view → edit only; **Read Only**:
view only) without using Devlog administration.

**Acceptance Scenarios**:

1. **Given** an authenticated staff member on the dashboard, **When** they open **User**
   administration, **Then** they see a list or searchable overview of user records with key
   identifying fields appropriate for staff (not excessive personal data)—and MUST NOT see
   create/edit/deactivate controls for actions their **role** forbids.
2. **Given** **Admin** User administration, **When** they create a user supplying required fields **including initial password**, **Then** the new user appears in the overview and can be opened for viewing/editing (**password** MUST NOT echo in UI or logs).
3. **Given** an existing user, **When** staff with permitted role save substantive corrections (**PATCH** semantics),
   **Then** subsequent views reflect those corrections for callers with adequate permission.
4. **Given** **Admin** organization policy supports withdrawal of access, **When** they perform the
   documented deactivate/archive action (typically **PATCH**), **Then** that user is excluded from active operational states
   described in acceptance guidance (without ambiguity about whether login remains possible).
5. **Given** a **Read Only** or **Maintainer** session, **When** they invoke user **create**, **DELETE**, or (**Maintainer**) privileged fields the API restricts (examples: **`role`**, **`is_active`**, resetting another user's password—per backend contract),
   **Then** the UI MUST either prevent the action entirely **or** explain **403**/field denial distinctly from validation errors (**FR-015**).
6. **Given** user **create** or **update** fails **validation**, **Then** field-level messages appear and salvageable input remains. **Given** a **user id** does not exist, **Then** **not found** handling without a broken shell. **Given** **duplicate username** or **duplicate email** (**FR-024**), **Then** operator-friendly **conflict** messaging without stack traces (**FR-015**). **Given** the request body is **malformed or empty** when the API rejects it, **Then** visible failure with retry guidance—no assumed success.
7. **Given** the user directory is **empty**, **Then** an intentional **empty state** appears—not a blank error.
8. **Given** staff view a user **detail** while the record is **removed or deactivated elsewhere**, **When** they refresh or continue, **Then** **not found** (or equivalent) without app collapse.
9. **Given** **two staff** edit the **same user**, **Then** behavior matches documented **last-save wins** or conflict handling.
10. **Given** **intermittent connectivity** during user save, **Then** success vs failure is visible—no silent loss of operator work (**FR-021**).
11. **Given** **Maintainer** submits a **PATCH** rejected as disallowed or empty, **Then** no false “saved” success. **Given** **Read_only** opens a **URL intended for editing**, **Then** mutation entry is blocked like disabled controls (**FR-016**).
12. **Given** **CamelBird-API** does not yet expose a user verb the UI would otherwise offer, **Then** that action is hidden or labeled unsupported for this API version—never silent success.
13. **Given** staff have **unsaved** changes on a user form, **When** they navigate away or close the tab per product policy, **Then** discard confirm, block, or autosave behavior matches **FR-021**; **Given** they **double-submit** save, **Then** duplicate destructive mutation is mitigated where feasible (**FR-012**).

---

### User Story 3 - Staff manage devlogs by role (Priority: P3)

From the dashboard, staff open **Devlog** administration and perform create, read, update, and delete (or unpublish via **PATCH**)
workflows **their role allows**: **Admin** — full CRUD per API; **Read Only** — **GET** only; **Maintainer**
— **GET + PATCH** (**no POST /devlogs**, **no DELETE**).

**Why this priority**: Devlog moderation completes the second mandated administrative slice.

**Independent Test**: From an authenticated session, complete devlog flows **per role** (e.g. **Admin**: create,
edit, remove/unpublish; **Maintainer**: edit existing only; **Read Only**: list/read only) without using User administration.

**Acceptance Scenarios**:

1. **Given** authenticated staff on the dashboard, **When** they open **Devlog**
   administration, **Then** they see devlog entries they are permitted to see with sufficient detail
   to distinguish entries (title and publication timeline at minimum); controls for forbidden verbs MUST NOT appear or MUST be inactive for **Read Only** / **Maintainer** as applicable.
2. **Given** **Admin** Devlog administration, **When** they create an entry (**POST /devlogs**) with required fields satisfied,
   **Then** the entry appears in the administrative list and reflects authored content accurately.
3. **Given** an existing devlog entry and a role that may update, **When** they edit permitted fields (**PATCH**),
   **Then** saved changes appear consistently after refresh/re-navigation within the session.
4. **Given** **Admin** moderation requires removal from public visibility, **When** they execute delete or unpublish (**DELETE** or **PATCH** per API contract),
   **Then** the entry state reflects removal expectations described in QA acceptance notes.
5. **Given** **Maintainer** tries **POST** (**create**) or **DELETE**, **Then** backend **403** (e.g. `INSUFFICIENT_ROLE`) MUST be surfaced clearly—not as a silent no-op (**FR-015**).
6. **Given** devlog **create** or **update** fails **validation**, **Then** field-level feedback and preserved input. **Given** an unknown **devlog id**, **Then** **not found** without broken shell. **Given** the devlog list is **empty**, **Then** empty state—not an error shell. **Given** a **malformed or empty** request body when the API rejects it, **Then** visible failure with retry guidance—no assumed success.
7. **Given** a devlog **body** may exceed API size (**413** if applicable), **Then** friendly failure. **Given** body content may include **HTML or markup**, **Then** administrative display follows a documented **safe rendering** policy.
8. **Given** **stale detail** after another actor **deleted or unpublished** the entry, **Then** **not found** or equivalent without shell break. **Given** **two staff** edit the **same devlog**, **Then** documented concurrency outcome.
9. **Given** **flaky connectivity** on devlog save, **Then** explicit outcome; **Given** **Maintainer** invalid **PATCH**, **Then** no false success; **Given** **Read_only** write URL, **Then** blocked per **FR-016**.
10. **Given** **CamelBird-API** lacks a devlog verb the UI would offer, **Then** hidden or labeled unsupported—never silent success.
11. **Given** **unsaved** devlog edits, **When** navigating away or closing the tab per policy, **Then** behavior matches **FR-021**; **Given** **double-submit** on save, **Then** mitigation per **FR-012** where feasible.

---

### Edge Cases

Most failure and edge behaviors are **specified under User stories 1–3** (acceptance scenarios) and under **FR-015–FR-024** (global error mapping, reconciliation, sign-out, transport failures, forms, **CORS/deploy**, **public devlog read**, **email uniqueness**).

- **CORS / deployment alignment**: For every deployed SPA base URL (**staging** and **production** at minimum), origin configuration MUST satisfy **FR-022**; residual risk is **ops coordination** (see **Assumptions**).
- **Public vs admin devlogs**: Visitor read of **published** devlogs without login (**FR-023**) MUST NOT be regressed by auth work on **administrative** routes (**FR-002**, **FR-007**).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The product MUST expose a clear administrative entry control anchored at the **right
  end** of the site footer on applicable public layouts.
- **FR-002**: Unauthenticated visitors MUST NOT access administrative dashboard content or CRUD data.
  **Public** visitor experiences that use **published** devlog material MUST remain **usable without login** (**FR-023**).
- **FR-003**: The product MUST collect **staff credentials** (username/password) through a dedicated login experience
  reached from the footer entry.
- **FR-004**: Successful authentication MUST transition the **signed-in staff member** to an **Admin Dashboard**
  overview that visibly distinguishes authenticated session state from public pages **and** communicates their
  **effective role** (slug or label) for entitlement expectations.
- **FR-005**: The Admin Dashboard MUST provide navigation to exactly **two** administrative areas:
  **User administration** and **Devlog administration** (visibility of **create / delete** affordances MUST follow **FR-016**).
- **FR-006**: **User administration MUST be role-aware**. **Admin**: **create** (including **initial password**, never echoed; **email** per **FR-024**), **view/list**, **update** (**PATCH**), **deactivate/archive** via **PATCH** (or equivalent documented contract). **Read Only** (**`read_only`**): **view/list** and read detail only—no create, update, deactivate, or delete. **Maintainer** (**`maintainer`**): **view/list**, read detail, **update** (**PATCH**) **only**—**no user create**, **no DELETE**; sensitive fields blocked by API MUST be hidden or read-only in UI. All behavior MUST stay consistent with **CamelBird-API** RBAC.
- **FR-007**: **Devlog administration MUST be role-aware**. **Admin**: **create** (**POST**), **view/list**, **update** (**PATCH**), **delete** or **unpublish** per API (**DELETE** **or PATCH**). **Read Only**: **GET** only. **Maintainer**: **GET + PATCH** only—**no devlog create**, **no DELETE**. Surfaces MUST reflect these limits before any network call where feasible.
- **FR-008**: Every administrative operation that reads or mutates portfolio data MUST occur only while
  the caller holds **valid authenticated authorization** (JWT + **role** recognized by **CamelBird-API**).
- **FR-009**: Backend interactions from administrative screens MUST include **Bearer proof** on each protected operation; **verb and path** conventions follow **FR-017** and the published API (plural **`/users`** and **`/devlogs`**).
- **FR-010**: When an **access JWT** expires during an otherwise legitimate **staff session**, the
  product MUST attempt **JWT refresh** (using backend-issued refresh credentials per policy) so that
  ongoing permitted actions can succeed **without forcing password re-entry**, unless refresh fails,
  refresh credentials are invalid/expired/revoked, or policy forbids silent renewal.
- **FR-011**: Failed JWT refresh flows MUST surface clear guidance that sign-in is required again without
  exposing prior administrative content.
- **FR-012**: JWT refresh and subsequent retries MUST avoid unintended duplicate destructive CRUD
  submissions (idempotent retry semantics or explicit operator acknowledgment—finalized during planning).
- **FR-013**: Invalid credential submissions MUST produce user-visible feedback without revealing which
  credential component failed beyond generic guidance suitable for security expectations.
- **FR-014**: Administrative navigation SHOULD preserve clear orientation (which subsection is active)
  across pages within the authenticated session.
- **FR-015**: Administrative screens MUST map common API failure classes to understandable operator
  outcomes: validation errors with field detail where the API provides it, **not found** for missing
  resources when distinguishable, **conflict** for uniqueness or integrity violations,
  authentication/refresh failures (**401**), **insufficient role** (**403**, e.g. **`INSUFFICIENT_ROLE`**) distinctly from **not found**,
  **rate limiting** (**429**), **server errors** (**5xx**), **request timeouts** / ambiguous transport failures, and **browser CORS or preflight blocks** (see **FR-022**)—with operator-visible messaging and **no** false success—and generic fallback messaging only when the API response is
  nondescript—without surfacing internal implementation details.
- **FR-016**: The UI MUST **reflect RBAC**: controls for verbs a **role cannot invoke** SHOULD be omitted or disabled with accessible explanation **before** destructive attempts; accidental forbidden calls MUST still surface **FR-015** outcomes rather than silent failure.
- **FR-017**: Integration with **CamelBird-API** MUST use the published **REST shape**: plural **`/users`**, **`/devlogs`**; **GET** read, **POST** create, **PATCH** partial update (including deactivate/unpublish when modeled as **PATCH**), **DELETE** when exposed; **`POST /auth/login`** and **`POST /auth/refresh`** for session establishment and renewal (**role** surfaced on login/JWT claims per contract). **Cross-origin access** from each hosted SPA environment MUST satisfy **FR-022**. **Public** visitor read of **published** devlogs MUST remain available **without** staff authentication, consistent with **FR-023** and the API’s documented **anonymous** read contract (e.g. narrowed **`GET /devlogs`**).
- **FR-018**: After successful login and whenever **401**, **403**, or equivalent auth signals occur on protected calls, the product MUST **reconcile effective `role` and `is_active`** with server truth (or force sign-in) so UI affordances cannot diverge indefinitely from backend RBAC.
- **FR-019**: **Sign-out** MUST clear client session artifacts (access and refresh credentials) and MUST ensure restored or cached admin views cannot display protected data without a new successful authentication (**User story 1**, scenario 7).
- **FR-020**: **429**, **5xx**, empty or unparseable API responses, and **client timeouts** MUST each map to a clear operator outcome per **FR-015**—never silent success and never conflate with validation success.
- **FR-021**: Administrative forms MUST define behavior for **unsaved changes** on navigation or tab close (confirm discard, block navigation, or documented autosave) and MUST mitigate **accidental double-submit** on the same mutation where feasible (**FR-012**).
- **FR-022** (**CORS and deployment alignment**): For **each** environment where the administrative UI is hosted (**staging** and **production** at minimum), the **CamelBird-API** MUST include that SPA **origin** on its **CORS allowlist**, with **`Access-Control-Allow-Headers`** and methods sufficient for **`Authorization`** and administrative verbs (**GET**, **POST**, **PATCH**, **DELETE**, **`OPTIONS`** preflight). Release processes MUST verify alignment **before** cutover. **When** origins are **misaligned**, browser-enforced failures (blocked request, failed preflight) MUST be surfaced to operators as a **clear configuration or deployment mismatch**—**not** as an unexplained or generic application error—and MUST remain consistent with **FR-015** messaging expectations.
- **FR-023** (**Public devlog read**): Visitor-facing pages that load or display **published** devlog content for the public portfolio MUST **not** require authentication for ordinary read access (list, detail, or excerpts as the product defines). This requirement is **distinct** from **Devlog administration** (**FR-007**), which remains staff-only behind login.
- **FR-024** (**Email uniqueness**): Each staff **user** MUST have an **email** address that is **unique** across the entire **`users`** directory (normalization and comparison rules per published **CamelBird-API** contract). **Create** and **update** that would duplicate another account’s **email** MUST fail as a **conflict** class response consumable under **FR-015** (including field-level detail when the API provides it).

### Key Entities

- **Staff account** (API **`users` row**): Authenticated identity with **required password**, **unique username**, **unique email** (**FR-024**), **`role`**, and
  **`is_active`**; surfaced in admin UI per permissions. There is **no** separate class of passwordless
  “managed contacts” in the **CamelBird-API** model aligned with this release.
- **`Role`**: One of **`admin`**, **`read_only`**, **`maintainer`** (API slugs)—**Maintainer** limited to
  **GET + PATCH** on users and devlogs; **Read Only** to **GET**; **Admin** full CRUD verbs the API exposes.
- **Access JWT**: Short-lived credential proving authentication; carries **`sub`** (user id) and **`role`**;
  subject to **refresh** while policy allows.
- **Refresh credential** (typically a **refresh JWT** or opaque token): Backend-issued credential used to obtain renewed access JWTs within documented lifetime and rotation rules; not a substitute for access JWT on CRUD
  calls unless the backend contract explicitly defines otherwise.
- **User account** (directory): The same **`users`** entities the product lists and edits in User administration (each has login credentials per backend, **unique email** per **FR-024**).
- **Devlog entry**: Publishable unit staff moderate; lifecycle states visible in the administrative list.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least **95%** of moderated QA scripts covering login success and failure scenarios pass
  without ambiguity about expected messaging or routing on first formal QA cycle.
- **SC-002**: **Admin** role completes **both** full CRUD journeys (User story 2 **and** User story 3)
  **within one uninterrupted authenticated session** during moderated usability rehearsal without abandoning due to navigation confusion (target **≤ 2** navigation mis-clicks per journey beyond login).
- **SC-003**: **100%** of scripted attempts by unauthenticated testers to access administrative CRUD
  surfaces directly **without login** result in denial of administrative data exposure (verified via QA checklist).
- **SC-004**: Administrative reviewers rate clarity of footer discoverability **≥ 4 / 5** on an internal rubric after single-session hallway review (**n ≥ 3** reviewers).
- **SC-005**: Complete moderation lifecycle for **≥ 10** synthetic devlog rows without systemic duplicate or orphaned rows unexplained by documented concurrency behavior.
- **SC-006**: In moderated QA covering simulated **authorization expiry mid-task** (aligned with short-lived access credentials per backend policy), **≥ 90%** of scripted flows complete successfully **without password re-entry** while renewal remains valid; remaining cases MUST deterministically prompt for sign-in.
- **SC-007**: Moderated QA scripts for **`read_only`** and **`maintainer`** roles: **100%** of attempts to perform **API-forbidden verbs** (**POST**/**DELETE** for **maintainer**, any mutation for **read_only**) are **blocked by UI affordances or** surfaced as clear **403**/**FR-015** outcomes—**no silent success** **and** **no unintended data mutations**.
- **SC-008**: Moderated QA for **429**, **5xx**, and **timeout** paths: **100%** of scripted cases show non-success messaging aligned with **FR-015**/**FR-020** and **no** mistaken “saved” or “loaded” states for failed calls.
- **SC-009**: After a **simulated server-side role downgrade** (e.g. **Admin** → **`read_only`**), **100%** of moderated scripts show **correct affordances** within one navigation cycle or the documented reconciliation trigger—without completing a forbidden mutation.

## Assumptions

- **Authentication transport**: Stakeholders requested **JWT access tokens** validated per administrative
  API request, plus **JWT refresh** (or equivalent refresh credential exchange) supported by the backend
  so renewed access tokens can be obtained **without repeating password entry** until refresh credentials
  expire or are revoked; exact endpoints, rotation, and lifetimes are implemented in **CamelBird-API**—the
  SPA follows published contracts. Until JWT enforcement ships on all administrative routes, QA treats
  open endpoints as **temporary** and verifies the SPA behavior against the agreed API release tag.
- **CamelBird-API coordination**: The administrative feature is backed by the **CamelBird-API** JSON
  service. It exposes a **single `users` table** (every row has **`password_hash` NOT NULL**, **`email` UNIQUE** per **FR-024**), **JWT + refresh**, **three roles**, and plural REST resources **`/users`**, **`/devlogs`** using **GET** / **POST** / **PATCH** / **DELETE** as published. **Anonymous** **`GET`** of **published** devlogs for visitors MUST remain supported (**FR-023**). Error shapes—including **403** **`INSUFFICIENT_ROLE`** distinct from **401**/**404**—PATCH field allowlists per role, and which verbs exist **per role** are **versioned with that API**; the SPA MUST match the agreed release tag. **CORS allowlists and preflight** for every SPA deploy URL are **mandatory contract** items—see **FR-022**; ops MUST keep **staging** and **production** origins registered before go-live.

- **Bootstrap account**: Creation of **initial** **`admin`** accounts occurs via **ops or backend bootstrap** when needed—the UI assumes at least **one Admin** exists for QA.
- **Backend availability**: Depends on CamelBird-API releases exposing **`POST /auth/login`**, **`POST /auth/refresh`**, **RBAC-aware** **`/users*`** **and `/devlogs*`**, **FR-022**-compliant **CORS**, stable **`FR-015`**-consumable bodies (validation, not found, conflict, auth, forbidden role), **FR-023**-compliant **anonymous** read of **published** devlogs for visitor traffic (e.g. **`GET /devlogs`** public projection unchanged for unauthenticated callers), and **FR-024**-compliant **unique `email`** on **`users`** with **409**/**conflict** on duplicates.

- **RBAC fidelity**: Frontend role behavior MUST stay aligned with **`users.role`** / JWT **`role`** and server enforcement—**trusted server**, not UI-only security.
- **Public portfolio**: Existing visitor-facing storytelling pages remain materially unchanged aside from
  footer enhancement unless stakeholders explicitly broaden scope later. Pages that consume **published**
  devlog content for visitors MUST stay **login-free** for ordinary read access (**FR-023**); only **administrative**
  devlog tooling requires staff authentication.
