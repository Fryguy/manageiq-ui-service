# ManageIQ Service UI - React Migration Implementation Checklist

This is a detailed, commit-ready implementation checklist for the Angular to React migration. Each task is designed to be completed independently and committed as a discrete unit of work.

**Instructions for Agents:**
1. Work through tasks sequentially within each phase
2. Complete the task fully before checking the box
3. **BEFORE COMMITTING:** Verify Testing Requirements (see section below) are met
4. Commit your changes after checking the box and verifying tests
5. Update this file as part of your commit
6. Dependencies between tasks are noted where applicable

**Working Directory:** All React application work is done in the `react/` subdirectory of this repository. This is an in-repo incubation directory as described in PLAN.md Section 10.2-10.3.

**Directory Structure:**
```
manageiq-ui-service/
├── client/              # Existing Angular application (unchanged)
├── react/               # New React application (all work happens here)
│   ├── src/            # React source code
│   ├── config/         # Webpack configurations
│   ├── public/         # Static assets
│   ├── dist/           # Build output (gitignored)
│   ├── package.json    # React app dependencies
│   ├── tsconfig.json   # TypeScript configuration
│   └── ...
├── PLAN.md
└── IMPLEMENTATION_PLAN.md
```

**Reference:** See [PLAN.md](./PLAN.md) for detailed architecture and design decisions.

**NOTE** Skipped steps are marked with [-], indicating they are not possible and may need to be returned to later, perhaps manually.

## Testing Requirements

**CRITICAL:** Before committing ANY changes, you MUST verify that ALL three commands pass with clean console output:

```bash
cd react && yarn test
cd react && yarn lint
cd react && yarn type-check
```

## MANDATORY TESTING WORKFLOW

**YOU MUST FOLLOW THIS EXACT SEQUENCE - NO EXCEPTIONS:**

1. **Make your code changes**
2. **Run ALL THREE commands in sequence:**
   ```bash
   cd react && yarn test && yarn lint && yarn type-check
   ```
3. **If ANY command fails:**
   - Fix the issue
   - **RESTART from step 2** - run ALL THREE commands again
   - **NEVER assume** that fixing one command didn't break another
4. **Only when ALL THREE commands pass together:**
   - Proceed to commit
   - Amend the commit if requested

**COMMON MISTAKE TO AVOID:**
- ❌ Running `yarn type-check`, fixing errors, then committing without re-running `yarn test` and `yarn lint`
- ❌ Running commands individually and assuming they're all still passing
- ✅ Always run all three commands together as a single validation step

**Clean output means:**
- All tests pass (no failures)
- No `console.error` or `console.warning` messages
- No linting errors or warnings
- No TypeScript errors or warnings

**Coverage requirements** (see PLAN.md Section 9.2):
- Components: 80%+ | Hooks: 90%+ | Utilities: 95%+ | Redux slices: 90%+

**Testing strategy:**
- Write tests alongside feature implementation, not as a separate phase
- Integration tests required for all major feature flows (Phase 9.2)
- E2E tests required for critical user paths (Phase 9.3)

---

## Phase 1: Platform Foundation (Weeks 1-2)

### 1.1 Project Setup & Configuration
- [x] Create React project directory structure (`src/`, `src/api/`, `src/components/`, `src/features/`, `src/hooks/`, `src/store/`, `src/utils/`, `src/types/`, `src/i18n/`)
- [x] Add `tsconfig.json`, `.eslintrc.js`, `.prettierrc` configuration files
- [x] Update `.gitignore` for React build artifacts (ensure `react/dist/` is ignored)
- [x] Install React core dependencies (react, react-dom, react-router-dom)
- [x] Install Redux Toolkit and React Redux
- [x] Install Carbon Design System (@carbon/react, @carbon/icons-react, @carbon/charts)
- [x] Install utility libraries (axios, lodash, date-fns, numeral, classnames)
- [x] Install i18n dependencies (ttag, ttag-cli, gettext-parser, babel-plugin-ttag)
- [x] Install TypeScript and type definitions
- [x] Install Webpack, loaders, and Babel
- [x] Install testing dependencies (Jest, React Testing Library, MSW)
- [x] Create Webpack configurations (common, dev, prod)
- [x] Create Babel and Jest configurations
- [x] Add npm scripts to `package.json` (start, build, test, lint, format, type-check)
- [x] Create `public/index.html` template

### 1.2 API Client Layer
- [x] Create `src/api/client.ts` with Axios client and interceptors (X-Auth-Token, 401 handling)
- [x] Create `src/api/types.ts` for common API types
- [x] Create `src/api/auth.ts` for authentication endpoints
- [x] Create `src/api/services.ts` for services endpoints
- [x] Create `src/api/catalogs.ts` for catalog endpoints
- [x] Create `src/api/orders.ts` for orders endpoints
- [x] Create `src/api/vms.ts` for VM endpoints
- [x] Create `src/api/index.ts` to export all API modules

### 1.3 Redux Store & Routing
- [x] Create `src/store/rootReducer.ts` combining all feature slices
- [x] Create `src/store/index.ts` with store configuration
- [x] Create `src/store/hooks.ts` with typed hooks (useAppDispatch, useAppSelector)
- [x] Create `src/store/uiSlice.ts` for UI state (notifications, loading, modals)
- [x] Create `src/routes/index.tsx` with route configuration
- [x] Create `src/routes/PrivateRoutes.tsx` wrapper
- [x] Create `src/App.tsx` with router and error boundary
- [x] Create `src/index.tsx` as application entry point

### 1.4 Testing Framework & CI
- [x] Create `src/test/testUtils.tsx` with renderWithProviders
- [x] Create `src/test/mocks/handlers.ts` for MSW
- [x] Create `src/test/mocks/server.ts` for MSW setup
- [x] Write sample test for API client
- [x] Verify tests run locally with `yarn test`
- [x] Create `.github/workflows/ci.yaml` for linting, type-check, and tests
- [-] Test CI workflow with sample PR
- [-] Add CI status badge to README

### 1.5 API Client Layer Tests
- [x] Write tests for `src/api/client.ts` (interceptors, error handling, 401 handling)
- [x] Write tests for `src/api/auth.ts` endpoints
- [x] Write tests for `src/api/services.ts` endpoints
- [x] Write tests for `src/api/catalogs.ts` endpoints
- [x] Write tests for `src/api/orders.ts` endpoints
- [x] Write tests for `src/api/vms.ts` endpoints
- [x] Verify all API tests pass locally and in CI

### 1.6 Authentication & RBAC
- [x] Create `src/features/auth/types.ts` for auth types
- [x] Create `src/features/auth/store/authSlice.ts` with login/logout/refresh thunks
- [x] Create `src/features/auth/hooks/useAuth.ts` hook
- [x] Create `src/features/auth/hooks/usePermissions.ts` for RBAC (has, hasAny, hasRole)
- [x] Create `src/features/auth/components/LoginPage.tsx`
- [x] Create `src/features/auth/components/ProtectedRoute.tsx`
- [x] Create `src/features/auth/components/PermissionGate.tsx`
- [x] Write tests for authSlice and usePermissions

### 1.7 Internationalization
- [x] Create `src/i18n/index.ts` with ttag compatibility layer (__, N_, ngettext_)
- [x] Create `src/i18n/config.ts` for locale loading
- [x] Add i18n scripts to `package.json` (extract, update, compile)
- [x] Create `src/features/layout/components/LanguageSwitcher.tsx`
- [x] Test i18n extraction workflow with sample strings

### 1.8 Core Infrastructure
- [x] Create `src/components/common/ErrorBoundary.tsx`
- [x] Create `src/components/common/LoadingSpinner.tsx`
- [x] Create `src/hooks/useNotifications.ts` for toast notifications
- [x] Create `src/hooks/usePolling.ts` for long-running operations
- [x] Create `src/utils/errorHandling.ts` utilities
- [x] Create `src/utils/dateFormatting.ts` utilities

---

## Phase 2: Carbon Design System & Shared Primitives (Weeks 2-3)

### 2.1 Application Shell
- [x] Create `src/features/layout/components/Header.tsx` with Carbon components
- [x] Create `src/features/layout/components/Sidebar.tsx` with RBAC-aware navigation
- [x] Create `src/features/layout/components/Footer.tsx`
- [x] Create `src/features/layout/components/Breadcrumbs.tsx`
- [x] Create `src/features/layout/components/AppLayout.tsx` composing all layout components
- [x] Write tests for layout components

### 2.2 Common UI Components
- [x] Create `src/components/common/DataTable.tsx` with sorting/filtering/pagination
- [x] Create `src/components/common/Pagination.tsx`
- [x] Create `src/components/common/SearchBar.tsx`
- [x] Create `src/components/common/FilterBar.tsx`
- [x] Create `src/components/common/Modal.tsx`
- [x] Create `src/components/common/ConfirmDialog.tsx`
- [x] Create `src/components/common/EmptyState.tsx`
- [x] Create `src/components/common/ErrorState.tsx`
- [x] Write tests for common UI components

### 2.3 Data Display Components
- [x] Create `src/components/common/Card.tsx`
- [x] Create `src/components/common/List.tsx`
- [x] Create `src/components/common/DetailView.tsx`
- [x] Create `src/components/common/StatusIndicator.tsx`
- [x] Create `src/components/common/IconDisplay.tsx`
- [x] Create `src/components/common/Timeline.tsx`
- [x] Create `src/components/common/TagDisplay.tsx`
- [x] Write tests for data display components

### 2.4 Action Components
- [x] Create `src/components/common/ActionButton.tsx` with permission checking
- [x] Create `src/components/common/ActionMenu.tsx` with RBAC integration
- [x] Create `src/components/common/Toolbar.tsx`
- [x] Create `src/components/common/ActionButtonGroup.tsx` with permission filtering
- [x] Write tests for action components

### 2.5 Accessibility
- [x] Document Carbon usage guidelines in `docs/carbon-guidelines.md`
- [x] Document keyboard interaction patterns in `docs/accessibility.md`
- [x] Implement focus management utilities in `src/utils/focus.ts`
- [x] Run accessibility audit on shared components with axe DevTools

---

## Phase 3: Dashboard & Profile Features (Weeks 3-4)

### 3.1 Dashboard
- [x] Create `src/features/dashboard/types.ts`
- [x] Create `src/features/dashboard/store/dashboardSlice.ts`
- [x] Create `src/features/dashboard/components/DashboardGrid.tsx`
- [x] Create `src/features/dashboard/components/ServiceSummaryCard.tsx`
- [x] Create `src/features/dashboard/components/RecentServicesWidget.tsx`
- [x] Create `src/features/dashboard/components/RecentOrdersWidget.tsx`
- [x] Create `src/features/dashboard/components/QuickActionsWidget.tsx` with RBAC
- [x] Create `src/features/dashboard/pages/DashboardPage.tsx`
- [x] Write tests for dashboard components
- [x] Write integration test for dashboard page

### 3.2 User Profile & Settings
- [x] Create `src/features/profile/types.ts`
- [x] Create `src/features/profile/store/profileSlice.ts`
- [x] Create `src/features/profile/components/ProfileInfo.tsx`
- [x] Create `src/features/profile/components/ProfileEditForm.tsx`
- [x] Create `src/features/profile/components/LanguageSettings.tsx`
- [x] Create `src/features/profile/components/NotificationSettings.tsx` (if in scope)
- [x] Create `src/features/profile/pages/ProfilePage.tsx`
- [x] Write tests for profile components

### 3.3 About Page
- [x] Create `src/features/about/components/VersionInfo.tsx`
- [x] Create `src/features/about/components/LicenseInfo.tsx`
- [x] Create `src/features/about/components/HelpResources.tsx`
- [x] Create `src/features/about/pages/AboutPage.tsx`
- [x] Write tests for about page

---

## Phase 4: Layout & Navigation Integration (Week 4)

### 4.1 Integrate AppLayout into Routing
- [x] Modify `src/routes/PrivateRoutes.tsx` to wrap `<Outlet />` with `<AppLayout>`
- [x] Verify Carbon Theme context is established
- [x] Test that Header, Sidebar, Footer appear on authenticated pages
- [x] Write tests for layout integration

### 4.2 Add Missing Routes
- [x] Add `/profile` route to `src/routes/index.tsx` pointing to `ProfilePage`
- [x] Add `/about` route to `src/routes/index.tsx` pointing to `AboutPage`
- [x] Verify routes are protected by authentication
- [x] Test direct URL access to `/profile` and `/about`
- [x] Write tests for new routes

### 4.3 Connect Sidebar Navigation
- [x] Review `src/features/layout/components/Sidebar.tsx` navigation items
- [x] Ensure navigation items use React Router `Link` or `useNavigate`
- [x] Verify RBAC checks are applied to navigation items
- [x] Test navigation between Dashboard, Profile, and About
- [x] Write tests for navigation functionality

### 4.4 Verify Carbon Styling
- [x] Confirm Carbon theme is applied to all pages
- [x] Verify Carbon components render correctly
- [x] Check that Header, Sidebar, Footer styling is consistent
- [x] Test responsive behavior of layout
- [-] Run visual regression tests if available

### 4.5 Integration Testing
- [x] Write integration test: Login → Dashboard (with layout)
- [x] Write integration test: Dashboard → Profile (via sidebar)
- [x] Write integration test: Dashboard → About (via sidebar or footer)
- [x] Write integration test: Breadcrumbs update correctly
- [x] Write integration test: Logout from any page
- [x] Verify all tests pass with `yarn test && yarn lint && yarn type-check`

### 4.6 Acceptance Criteria Verification
- [x] All authenticated pages render within AppLayout
- [x] Header, Sidebar, Footer visible on Dashboard, Profile, About
- [x] Profile page accessible via `/profile` route
- [x] About page accessible via `/about` route
- [x] Sidebar navigation links work correctly
- [x] Carbon styling applied consistently
- [x] Breadcrumbs reflect current location
- [x] RBAC checks applied to navigation items
- [x] All tests pass (unit, integration, type-check, lint)
- [x] No console errors or warnings

---

## Phase 5: Feature Parity True-Up & UX Alignment (Week 5)

### 5.1 Header Profile Menu Realignment
- [x] Remove the dedicated Profile page from the target UX
- [x] Remove the Profile entry from the side navigation
- [x] Replace profile-page behavior with a user information dropdown under the header profile icon
- [x] Align the profile dropdown with the IBM product header profile menu pattern

### 5.2 Logout & Language Switcher Consolidation
- [x] Remove Logout from the side navigation
- [x] Place Logout as the bottom-most entry in the header profile menu
- [x] Use a logout icon for the Logout menu action
- [x] Remove the standalone header language switcher entry
- [x] Embed the language switcher as a dropdown within the user profile menu, matching the Angular-side behavior

### 5.3 About Experience Realignment
- [x] Remove the dedicated About page and route from the target UX
- [x] Replace the page-based implementation with an About modal aligned to the IBM product About modal pattern
- [x] Ensure the About modal content matches the Angular About modal content
- [x] Add a header action that opens the About modal using a question-mark-in-a-circle style help icon

### 5.4 Documentation, Website, and Footer Consolidation
- [x] Move the Documentation link into the About modal
- [x] Move the website link into the About modal
- [x] Remove the footer from the target application shell
- [x] Verify the resulting shell remains consistent with Carbon and IBM product guidance

### 5.5 Dashboard Summary & Terminology Alignment
- [ ] Align the dashboard service summary cards with the Angular dashboard categories: Retiring Soon, Current Services, Retired Services, and Monthly Charges - This Month To Date
- [ ] Investigate and correct the React dashboard summary data mapping so the displayed values align with the Angular application rather than defaulting to incorrect zero values
- [ ] Add the missing dashboard order summary section corresponding to Angular Requests, but label it as Orders
- [ ] Keep the preferred Orders terminology on the dashboard to match the existing side navigation terminology
- [ ] Preserve the Recent Services and Recent Orders sections from the React dashboard even though those features are not in the Angular dashboard.

### 5.6 Dashboard Actions & Header Access Realignment
- [ ] Remove the Quick Actions section from the dashboard
- [ ] Add shopping cart access as a dedicated header action with a shopping-cart icon
- [ ] Verify dashboard actions are not duplicating destinations already available in the primary navigation

### 5.7 Virtual Machine Navigation Realignment
- [ ] Remove the Virtual Machines side navigation entry
- [ ] Remove any Virtual Machines placeholder routes or destinations that imply top-level navigation
- [ ] Ensure Virtual Machines are not exposed as a directly navigable top-level area when that behavior does not exist in the Angular application
- [ ] Treat VM visibility and access as part of the service details experience instead of standalone navigation
- [ ] Defer VM-specific entry points until the service details work in Phase 8, especially the Service Details & Resources work package


---

## Phase 6: Catalogs & Ordering Foundations (Weeks 5-7)

### 6.1 Catalog Explorer
- [ ] Create `src/features/catalogs/types.ts`
- [ ] Create `src/features/catalogs/store/catalogsSlice.ts`
- [ ] Create `src/features/catalogs/components/CatalogList.tsx`
- [ ] Create `src/features/catalogs/components/CatalogTree.tsx`
- [ ] Create `src/features/catalogs/components/ServiceTemplateCard.tsx`
- [ ] Create `src/features/catalogs/components/CatalogSearchBar.tsx`
- [ ] Create `src/features/catalogs/components/CatalogSortOptions.tsx`
- [ ] Create `src/features/catalogs/pages/CatalogExplorerPage.tsx`
- [ ] Write tests for catalog explorer

### 6.2 Catalog Item Details Foundations
- [ ] Create `src/features/catalogs/components/ServiceTemplateDetails.tsx`
- [ ] Create `src/features/catalogs/components/TemplateInfo.tsx`
- [ ] Create `src/features/catalogs/pages/ServiceTemplatePage.tsx`
- [ ] Identify where dynamic provisioning dialogs will attach later without implementing them yet
- [ ] Defer `src/features/catalogs/components/ProvisioningDialog.tsx` and `src/features/catalogs/hooks/useProvisioningForm.ts` until the late dynamic provisioning dialog phase
- [ ] Write tests for non-dialog catalog item details

### 6.3 Shopping Cart
- [ ] Create `src/features/catalogs/store/cartSlice.ts` with persistence
- [ ] Create `src/features/catalogs/components/CartButton.tsx`
- [ ] Create `src/features/catalogs/components/CartDrawer.tsx`
- [ ] Create `src/features/catalogs/components/CartItem.tsx`
- [ ] Create `src/features/catalogs/components/CartSummary.tsx`
- [ ] Create `src/features/catalogs/components/CheckoutButton.tsx`
- [ ] Create `src/features/catalogs/components/OrderConfirmation.tsx`
- [ ] Implement cart persistence in localStorage
- [ ] Build order submission scaffolding that can be completed without dynamic provisioning dialogs
- [ ] Write tests for shopping cart

### 6.4 Integration Tests
- [ ] Write integration test for catalog browsing flow (browse → details)
- [ ] Write integration test for non-dialog cart flow foundations

---

## Phase 7: Services Domain Migration (Weeks 7-10)

### 7.1 Services List & Filtering
- [ ] Create `src/features/services/types.ts`
- [ ] Create `src/features/services/store/servicesSlice.ts`
- [ ] Create `src/features/services/components/ServiceList.tsx`
- [ ] Create `src/features/services/components/ServiceCard.tsx`
- [ ] Create `src/features/services/components/ViewToggle.tsx`
- [ ] Create `src/features/services/components/ServiceSearchBar.tsx`
- [ ] Create `src/features/services/components/ServiceFilters.tsx`
- [ ] Create `src/features/services/components/ServiceSortOptions.tsx`
- [ ] Create `src/features/services/pages/ServiceExplorerPage.tsx`
- [ ] Write tests for services list and filtering

### 7.2 Service Details & Resources
- [ ] Create `src/features/services/components/ServiceDetails.tsx`
- [ ] Create `src/features/services/components/ServiceInfo.tsx`
- [ ] Create `src/features/services/components/ServiceResources.tsx`
- [ ] Create `src/features/services/components/ServiceTopology.tsx`
- [ ] Create `src/features/services/components/GenericObjects.tsx`
- [ ] Create `src/features/services/components/ServiceTabs.tsx`
- [ ] Create `src/features/services/pages/ServiceDetailsPage.tsx`
- [ ] Write tests for service details

### 7.3 Permission-Aware Service Actions
- [ ] Create `src/features/services/components/ServiceActions.tsx` with permission filtering
- [ ] Create `src/features/services/components/PowerOperations.tsx` (start, stop, suspend)
- [ ] Create `src/features/services/components/RetireService.tsx`
- [ ] Create `src/features/services/components/ReconfigureService.tsx`
- [ ] Create `src/features/services/components/EditService.tsx`
- [ ] Create `src/features/services/components/OwnershipManagement.tsx`
- [ ] Create `src/features/services/components/ConfirmActionDialog.tsx`
- [ ] Write tests for service actions with permission scenarios

### 7.4 Custom Buttons & Dialog-Backed Actions
- [ ] Create `src/features/services/components/CustomButtonGroup.tsx` with role filtering
- [ ] Create `src/features/services/components/CustomButton.tsx`
- [ ] Create `src/features/services/hooks/useCustomButtonAction.ts`
- [ ] Defer `src/features/services/components/CustomButtonDialog.tsx` until the late dynamic provisioning dialog phase if it depends on schema-driven dialog infrastructure
- [ ] Write tests for custom buttons that do not depend on the late dialog platform

### 7.5 VM & Console Capabilities
- [ ] Create `src/features/services/components/VMDetails.tsx`
- [ ] Create `src/features/services/components/ConsoleAccess.tsx` (noVNC, SPICE, WebMKS)
- [ ] Create `src/features/services/components/SnapshotList.tsx`
- [ ] Create `src/features/services/components/NetworkDetails.tsx` (if in scope)
- [ ] Create `src/features/services/components/StorageDetails.tsx` (if in scope)
- [ ] Write tests for VM and console capabilities

### 7.6 Ansible & Orchestration
- [ ] Create `src/features/services/components/AnsiblePlaybook.tsx`
- [ ] Create `src/features/services/components/PlaybookExecution.tsx`
- [ ] Create `src/features/services/components/PlaybookOutput.tsx`
- [ ] Write tests for Ansible views

### 7.7 Service State Management
- [ ] Implement polling mechanism in servicesSlice for long-running operations
- [ ] Create `src/features/services/hooks/useServicePolling.ts`
- [ ] Write tests for service state management and polling

### 7.8 Integration Tests
- [ ] Write integration test for service browsing flow (list → details → actions)
- [ ] Write integration test for service power operations
- [ ] Write integration test for custom button execution

---

## Phase 8: Orders & Approval Workflows (Weeks 10-11)

### 8.1 Order Explorer
- [ ] Create `src/features/orders/types.ts`
- [ ] Create `src/features/orders/store/ordersSlice.ts`
- [ ] Create `src/features/orders/components/OrderList.tsx`
- [ ] Create `src/features/orders/components/OrderFilters.tsx`
- [ ] Create `src/features/orders/components/OrderSearch.tsx`
- [ ] Create `src/features/orders/components/OrderStatusDisplay.tsx`
- [ ] Create `src/features/orders/pages/OrderExplorerPage.tsx`
- [ ] Write tests for order explorer

### 8.2 Order Details Foundations
- [ ] Create `src/features/orders/components/OrderDetails.tsx`
- [ ] Create `src/features/orders/components/OrderTimeline.tsx`
- [ ] Create `src/features/orders/components/ApprovalWorkflow.tsx`
- [ ] Create `src/features/orders/components/OrderItems.tsx`
- [ ] Create `src/features/orders/pages/OrderDetailsPage.tsx`
- [ ] Exclude dynamic provisioning dialog replay until the late dynamic provisioning dialog phase
- [ ] Write tests for non-dialog order details

### 8.3 Order Operations
- [ ] Create `src/features/orders/components/ApproveOrderButton.tsx`
- [ ] Create `src/features/orders/components/DenyOrderButton.tsx`
- [ ] Create `src/features/orders/components/CancelOrderButton.tsx`
- [ ] Create `src/features/orders/components/ResubmitOrderButton.tsx`
- [ ] Write tests for order operations

### 8.4 Order State Management
- [ ] Implement order status polling in ordersSlice
- [ ] Create `src/features/orders/hooks/useOrderPolling.ts`
- [ ] Write tests for order state management

### 8.5 Integration Tests
- [ ] Write integration test for order approval workflow
- [ ] Write integration test for non-dialog order tracking

---

## Phase 9: VM-Specific Gap Closure (Weeks 11-12)

### 9.1 VM Details
- [ ] Create `src/features/vms/types.ts`
- [ ] Create `src/features/vms/store/vmsSlice.ts`
- [ ] Create `src/features/vms/components/VMInfo.tsx`
- [ ] Create `src/features/vms/components/VMMetrics.tsx`
- [ ] Create `src/features/vms/components/VMRelationships.tsx`
- [ ] Create `src/features/vms/pages/VMDetailsPage.tsx`
- [ ] Write tests for VM details

### 9.2 VM Snapshots
- [ ] Create `src/features/vms/components/SnapshotList.tsx`
- [ ] Create `src/features/vms/components/CreateSnapshotDialog.tsx`
- [ ] Create `src/features/vms/components/RevertSnapshotDialog.tsx`
- [ ] Create `src/features/vms/components/DeleteSnapshotDialog.tsx`
- [ ] Write tests for snapshot management

### 9.3 VM Operations
- [ ] Create `src/features/vms/components/VMPowerOperations.tsx`
- [ ] Create `src/features/vms/components/VMConsoleAccess.tsx`
- [ ] Create `src/features/vms/components/RetireVMDialog.tsx`
- [ ] Write tests for VM operations

### 9.4 Gap Analysis
- [ ] Document any remaining VM gaps not covered by Services domain
- [ ] Confirm no VM-specific features are missing

---

## Phase 10: Dynamic Provisioning Dialog Platform (Weeks 12-13)

### 10.1 Data Driven Forms Integration
- [ ] Install Data Driven Forms dependencies (@data-driven-forms/react-form-renderer, @data-driven-forms/carbon-component-mapper)
- [ ] Create `src/features/forms/types.ts` for form types
- [ ] Create `src/features/forms/components/FormRenderer.tsx` with Carbon mapper
- [ ] Verify Carbon mapper compatibility with sample schema

### 10.2 Schema Normalization
- [ ] Create `src/features/forms/utils/schemaNormalizer.ts` for ManageIQ dialog → DDF conversion
- [ ] Create `src/features/forms/utils/fieldAdapters.ts` for field metadata, validation, visibility
- [ ] Document schema normalization in `docs/forms-schema.md`
- [ ] Write tests for schema normalization

### 10.3 Custom Field Adapters
- [ ] Create `src/features/forms/components/fields/` directory
- [ ] Create custom field adapters for ManageIQ-specific widgets
- [ ] Create `src/features/forms/utils/submissionTransformer.ts`
- [ ] Create `src/features/forms/utils/validation.ts`
- [ ] Write tests for custom field adapters

### 10.4 Dynamic Provisioning Dialog Runtime
- [ ] Create `src/features/forms/components/DialogModal.tsx`
- [ ] Create `src/features/forms/components/DialogPage.tsx`
- [ ] Create `src/features/forms/hooks/useDialogForm.ts` for async fields and dependencies
- [ ] Create `src/features/forms/utils/errorHandling.ts` for form errors
- [ ] Write integration tests for dialog runtime
- [ ] Create `src/features/forms/test/DialogTestHarness.tsx`

### 10.5 Catalog & Order Integration
- [ ] Create `src/features/catalogs/components/ProvisioningDialog.tsx` using Data Driven Forms
- [ ] Create `src/features/catalogs/hooks/useProvisioningForm.ts`
- [ ] Integrate provisioning dialogs into catalog ordering flows
- [ ] Add read-only rendering of provisioning dialog content to order details
- [ ] Implement `src/features/services/components/CustomButtonDialog.tsx` if still required by the schema-driven dialog platform
- [ ] Write integration test for order submission flow (cart → checkout → confirmation)
- [ ] Write integration test for provisioning dialog replay in order details

---

## Phase 11: Quality, Accessibility & Performance (Weeks 13-14)

### 11.1 Unit Testing
- [ ] Ensure all components have unit tests
- [ ] Ensure all hooks have unit tests
- [ ] Ensure all utility functions have tests
- [ ] Ensure all Redux slices have tests
- [ ] Verify reliable local test execution
- [ ] Verify CI test execution

### 11.2 Integration Testing
- [ ] Write integration tests for all major feature flows
- [ ] Write API integration tests
- [ ] Write user flow tests
- [ ] Ensure PR CI coverage meets requirements

### 11.3 End-to-End Testing
- [ ] Write E2E tests for critical paths
- [ ] Perform cross-browser testing
- [ ] Run accessibility testing with axe DevTools
- [ ] Run performance testing with Lighthouse

### 11.4 Bug Fixes & Hardening
- [ ] Address all test failures
- [ ] Fix identified bugs
- [ ] Optimize performance bottlenecks
- [ ] Fix accessibility issues
- [ ] Complete security review

### 11.5 Quality Gates
- [ ] Verify all unit tests passing
- [ ] Verify all integration tests passing
- [ ] Verify E2E tests passing
- [ ] Verify accessibility compliance (WCAG 2.1 AA)
- [ ] Verify performance benchmarks met
- [ ] Complete security audit

---

## Phase 12: Deployment, Cutover & Documentation (Weeks 14-15)

### 12.1 Documentation
- [ ] Update `README.md` with React setup instructions
- [ ] Create migration guide in `docs/migration-guide.md`
- [ ] Update API documentation
- [ ] Document deployment process in `docs/deployment.md`
- [ ] Document rollback procedures in `docs/rollback.md`

### 12.2 Deployment Preparation
- [ ] Optimize production build configuration
- [ ] Optimize assets (images, fonts, etc.)
- [ ] Run bundle size analysis with webpack-bundle-analyzer
- [ ] Complete security audit
- [ ] Perform performance tuning

### 12.3 Cutover Planning
- [ ] Deploy to staging environment
- [ ] Conduct user acceptance testing (UAT)
- [ ] Create production deployment plan
- [ ] Document rollback procedures
- [ ] Set up monitoring and alerting
- [ ] Obtain feature parity sign-off from stakeholders

### 12.4 User & Support Resources
- [ ] Create user documentation
- [ ] Create support documentation
- [ ] Document known limitations
- [ ] Create follow-up backlog for post-migration improvements

### 12.5 Production Deployment
- [ ] Execute production deployment
- [ ] Verify application functionality in production
- [ ] Monitor for errors and performance issues
- [ ] Communicate deployment status to stakeholders

---

## Completion Criteria

The migration is complete when:
- [ ] All phases 1-12 tasks are checked off
- [ ] All tests are passing (unit, integration, E2E)
- [ ] CI/CD pipeline is green
- [ ] Accessibility audit passed
- [ ] Performance benchmarks met
- [ ] Security audit passed
- [ ] Feature parity confirmed by stakeholders
- [ ] Production deployment successful
- [ ] Rollback plan tested and documented
- [ ] User and support documentation complete

---

## Notes

- **Task Dependencies:** Some tasks have dependencies on earlier tasks. Ensure prerequisites are complete before starting dependent tasks.
- **Parallel Work:** Within phases, some tasks can be worked on in parallel by different agents (e.g., different feature modules).
- **Testing:** Write tests as you build features, not as a separate phase at the end.
- **Commits:** Each checked task should result in at least one commit. Use descriptive commit messages following the style guide in `.bob/rules/commit-style.md`.
- **Code Review:** All commits should go through PR review process with CI checks passing.
