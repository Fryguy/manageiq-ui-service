# ManageIQ Service UI - React Migration Implementation Checklist

This is a detailed, commit-ready implementation checklist for the Angular to React migration. Each task is designed to be completed independently and committed as a discrete unit of work.

**Instructions for Agents:**
1. Work through tasks sequentially within each phase
2. Complete the task fully before checking the box
3. Commit your changes after checking the box
4. Update this file as part of your commit
5. Dependencies between tasks are noted where applicable

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

### 1.3 Authentication & RBAC
- [ ] Create `src/features/auth/types.ts` for auth types
- [ ] Create `src/features/auth/store/authSlice.ts` with login/logout/refresh thunks
- [ ] Create `src/features/auth/hooks/useAuth.ts` hook
- [ ] Create `src/features/auth/hooks/usePermissions.ts` for RBAC (has, hasAny, hasRole)
- [ ] Create `src/features/auth/components/LoginPage.tsx`
- [ ] Create `src/features/auth/components/ProtectedRoute.tsx`
- [ ] Create `src/features/auth/components/PermissionGate.tsx`
- [ ] Write tests for authSlice and usePermissions

### 1.4 Redux Store & Routing
- [ ] Create `src/store/rootReducer.ts` combining all feature slices
- [ ] Create `src/store/index.ts` with store configuration
- [ ] Create `src/store/hooks.ts` with typed hooks (useAppDispatch, useAppSelector)
- [ ] Create `src/store/uiSlice.ts` for UI state (notifications, loading, modals)
- [ ] Create `src/routes/index.tsx` with route configuration
- [ ] Create `src/routes/PrivateRoutes.tsx` wrapper
- [ ] Create `src/App.tsx` with router and error boundary
- [ ] Create `src/index.tsx` as application entry point

### 1.5 Internationalization
- [ ] Create `src/i18n/index.ts` with ttag compatibility layer (__, N_, ngettext_)
- [ ] Create `src/i18n/config.ts` for locale loading
- [ ] Add i18n scripts to `package.json` (extract, update, compile)
- [ ] Create `src/features/layout/components/LanguageSwitcher.tsx`
- [ ] Test i18n extraction workflow with sample strings

### 1.6 Core Infrastructure
- [ ] Create `src/components/common/ErrorBoundary.tsx`
- [ ] Create `src/components/common/LoadingSpinner.tsx`
- [ ] Create `src/hooks/useNotifications.ts` for toast notifications
- [ ] Create `src/hooks/usePolling.ts` for long-running operations
- [ ] Create `src/utils/errorHandling.ts` utilities
- [ ] Create `src/utils/dateFormatting.ts` utilities

### 1.7 Testing Framework & CI
- [ ] Create `src/test/testUtils.tsx` with renderWithProviders
- [ ] Create `src/test/mocks/handlers.ts` for MSW
- [ ] Create `src/test/mocks/server.ts` for MSW setup
- [ ] Write sample test for LoginPage
- [ ] Verify tests run locally with `yarn test`
- [ ] Create `.github/workflows/ci.yaml` for linting, type-check, and tests
- [ ] Test CI workflow with sample PR
- [ ] Add CI status badge to README

---

## Phase 2: Carbon Design System & Shared Primitives (Weeks 2-3)

### 2.1 Application Shell
- [ ] Create `src/features/layout/components/Header.tsx` with Carbon components
- [ ] Create `src/features/layout/components/Sidebar.tsx` with RBAC-aware navigation
- [ ] Create `src/features/layout/components/Footer.tsx`
- [ ] Create `src/features/layout/components/Breadcrumbs.tsx`
- [ ] Create `src/features/layout/components/AppLayout.tsx` composing all layout components
- [ ] Write tests for layout components

### 2.2 Common UI Components
- [ ] Create `src/components/common/DataTable.tsx` with sorting/filtering/pagination
- [ ] Create `src/components/common/Pagination.tsx`
- [ ] Create `src/components/common/SearchBar.tsx`
- [ ] Create `src/components/common/FilterBar.tsx`
- [ ] Create `src/components/common/Modal.tsx`
- [ ] Create `src/components/common/ConfirmDialog.tsx`
- [ ] Create `src/components/common/EmptyState.tsx`
- [ ] Create `src/components/common/ErrorState.tsx`
- [ ] Write tests for common UI components

### 2.3 Data Display Components
- [ ] Create `src/components/common/Card.tsx`
- [ ] Create `src/components/common/List.tsx`
- [ ] Create `src/components/common/DetailView.tsx`
- [ ] Create `src/components/common/StatusIndicator.tsx`
- [ ] Create `src/components/common/IconDisplay.tsx`
- [ ] Create `src/components/common/Timeline.tsx`
- [ ] Create `src/components/common/TagDisplay.tsx`
- [ ] Write tests for data display components

### 2.4 Action Components
- [ ] Create `src/components/common/ActionButton.tsx` with permission checking
- [ ] Create `src/components/common/ActionMenu.tsx` with RBAC integration
- [ ] Create `src/components/common/Toolbar.tsx`
- [ ] Create `src/components/common/ActionButtonGroup.tsx` with permission filtering
- [ ] Write tests for action components

### 2.5 Accessibility
- [ ] Document Carbon usage guidelines in `docs/carbon-guidelines.md`
- [ ] Document keyboard interaction patterns in `docs/accessibility.md`
- [ ] Implement focus management utilities in `src/utils/focus.ts`
- [ ] Run accessibility audit on shared components with axe DevTools

---

## Phase 3: Forms & Dialog Platform (Weeks 3-4)

### 3.1 Data Driven Forms Integration
- [ ] Install Data Driven Forms dependencies (@data-driven-forms/react-form-renderer, @data-driven-forms/carbon-component-mapper)
- [ ] Create `src/features/forms/types.ts` for form types
- [ ] Create `src/features/forms/components/FormRenderer.tsx` with Carbon mapper
- [ ] Verify Carbon mapper compatibility with sample schema

### 3.2 Schema Normalization
- [ ] Create `src/features/forms/utils/schemaNormalizer.ts` for ManageIQ dialog → DDF conversion
- [ ] Create `src/features/forms/utils/fieldAdapters.ts` for field metadata, validation, visibility
- [ ] Document schema normalization in `docs/forms-schema.md`
- [ ] Write tests for schema normalization

### 3.3 Custom Field Adapters
- [ ] Create `src/features/forms/components/fields/` directory
- [ ] Create custom field adapters for ManageIQ-specific widgets
- [ ] Create `src/features/forms/utils/submissionTransformer.ts`
- [ ] Create `src/features/forms/utils/validation.ts`
- [ ] Write tests for custom field adapters

### 3.4 Dialog Runtime
- [ ] Create `src/features/forms/components/DialogModal.tsx`
- [ ] Create `src/features/forms/components/DialogPage.tsx`
- [ ] Create `src/features/forms/hooks/useDialogForm.ts` for async fields and dependencies
- [ ] Create `src/features/forms/utils/errorHandling.ts` for form errors
- [ ] Write integration tests for dialog runtime
- [ ] Create `src/features/forms/test/DialogTestHarness.tsx`

---

## Phase 4: Dashboard & Profile Features (Weeks 4-5)

### 4.1 Dashboard
- [ ] Create `src/features/dashboard/types.ts`
- [ ] Create `src/features/dashboard/store/dashboardSlice.ts`
- [ ] Create `src/features/dashboard/components/DashboardGrid.tsx`
- [ ] Create `src/features/dashboard/components/ServiceSummaryCard.tsx`
- [ ] Create `src/features/dashboard/components/RecentServicesWidget.tsx`
- [ ] Create `src/features/dashboard/components/RecentOrdersWidget.tsx`
- [ ] Create `src/features/dashboard/components/QuickActionsWidget.tsx` with RBAC
- [ ] Create `src/features/dashboard/pages/DashboardPage.tsx`
- [ ] Write tests for dashboard components
- [ ] Write integration test for dashboard page

### 4.2 User Profile & Settings
- [ ] Create `src/features/profile/types.ts`
- [ ] Create `src/features/profile/store/profileSlice.ts`
- [ ] Create `src/features/profile/components/ProfileInfo.tsx`
- [ ] Create `src/features/profile/components/ProfileEditForm.tsx`
- [ ] Create `src/features/profile/components/LanguageSettings.tsx`
- [ ] Create `src/features/profile/components/NotificationSettings.tsx` (if in scope)
- [ ] Create `src/features/profile/pages/ProfilePage.tsx`
- [ ] Write tests for profile components

### 4.3 About Page
- [ ] Create `src/features/about/components/VersionInfo.tsx`
- [ ] Create `src/features/about/components/LicenseInfo.tsx`
- [ ] Create `src/features/about/components/HelpResources.tsx`
- [ ] Create `src/features/about/pages/AboutPage.tsx`
- [ ] Write tests for about page

---

## Phase 5: Catalogs & Ordering (Weeks 5-7)

### 5.1 Catalog Explorer
- [ ] Create `src/features/catalogs/types.ts`
- [ ] Create `src/features/catalogs/store/catalogsSlice.ts`
- [ ] Create `src/features/catalogs/components/CatalogList.tsx`
- [ ] Create `src/features/catalogs/components/CatalogTree.tsx`
- [ ] Create `src/features/catalogs/components/ServiceTemplateCard.tsx`
- [ ] Create `src/features/catalogs/components/CatalogSearchBar.tsx`
- [ ] Create `src/features/catalogs/components/CatalogSortOptions.tsx`
- [ ] Create `src/features/catalogs/pages/CatalogExplorerPage.tsx`
- [ ] Write tests for catalog explorer

### 5.2 Catalog Item Details
- [ ] Create `src/features/catalogs/components/ServiceTemplateDetails.tsx`
- [ ] Create `src/features/catalogs/components/TemplateInfo.tsx`
- [ ] Create `src/features/catalogs/components/ProvisioningDialog.tsx` using Data Driven Forms
- [ ] Create `src/features/catalogs/hooks/useProvisioningForm.ts`
- [ ] Create `src/features/catalogs/pages/ServiceTemplatePage.tsx`
- [ ] Write tests for catalog item details

### 5.3 Shopping Cart
- [ ] Create `src/features/catalogs/store/cartSlice.ts` with persistence
- [ ] Create `src/features/catalogs/components/CartButton.tsx`
- [ ] Create `src/features/catalogs/components/CartDrawer.tsx`
- [ ] Create `src/features/catalogs/components/CartItem.tsx`
- [ ] Create `src/features/catalogs/components/CartSummary.tsx`
- [ ] Create `src/features/catalogs/components/CheckoutButton.tsx`
- [ ] Create `src/features/catalogs/components/OrderConfirmation.tsx`
- [ ] Implement cart persistence in localStorage
- [ ] Write tests for shopping cart

### 5.4 Integration Tests
- [ ] Write integration test for catalog browsing flow (browse → details → add to cart)
- [ ] Write integration test for order submission flow (cart → checkout → confirmation)

---

## Phase 6: Services Domain Migration (Weeks 7-10)

### 6.1 Services List & Filtering
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

### 6.2 Service Details & Resources
- [ ] Create `src/features/services/components/ServiceDetails.tsx`
- [ ] Create `src/features/services/components/ServiceInfo.tsx`
- [ ] Create `src/features/services/components/ServiceResources.tsx`
- [ ] Create `src/features/services/components/ServiceTopology.tsx`
- [ ] Create `src/features/services/components/GenericObjects.tsx`
- [ ] Create `src/features/services/components/ServiceTabs.tsx`
- [ ] Create `src/features/services/pages/ServiceDetailsPage.tsx`
- [ ] Write tests for service details

### 6.3 Permission-Aware Service Actions
- [ ] Create `src/features/services/components/ServiceActions.tsx` with permission filtering
- [ ] Create `src/features/services/components/PowerOperations.tsx` (start, stop, suspend)
- [ ] Create `src/features/services/components/RetireService.tsx`
- [ ] Create `src/features/services/components/ReconfigureService.tsx`
- [ ] Create `src/features/services/components/EditService.tsx`
- [ ] Create `src/features/services/components/OwnershipManagement.tsx`
- [ ] Create `src/features/services/components/ConfirmActionDialog.tsx`
- [ ] Write tests for service actions with permission scenarios

### 6.4 Custom Buttons & Dialog-Backed Actions
- [ ] Create `src/features/services/components/CustomButtonGroup.tsx` with role filtering
- [ ] Create `src/features/services/components/CustomButton.tsx`
- [ ] Create `src/features/services/hooks/useCustomButtonAction.ts`
- [ ] Create `src/features/services/components/CustomButtonDialog.tsx` using Data Driven Forms
- [ ] Write tests for custom buttons

### 6.5 VM & Console Capabilities
- [ ] Create `src/features/services/components/VMDetails.tsx`
- [ ] Create `src/features/services/components/ConsoleAccess.tsx` (noVNC, SPICE, WebMKS)
- [ ] Create `src/features/services/components/SnapshotList.tsx`
- [ ] Create `src/features/services/components/NetworkDetails.tsx` (if in scope)
- [ ] Create `src/features/services/components/StorageDetails.tsx` (if in scope)
- [ ] Write tests for VM and console capabilities

### 6.6 Ansible & Orchestration
- [ ] Create `src/features/services/components/AnsiblePlaybook.tsx`
- [ ] Create `src/features/services/components/PlaybookExecution.tsx`
- [ ] Create `src/features/services/components/PlaybookOutput.tsx`
- [ ] Write tests for Ansible views

### 6.7 Service State Management
- [ ] Implement polling mechanism in servicesSlice for long-running operations
- [ ] Create `src/features/services/hooks/useServicePolling.ts`
- [ ] Write tests for service state management and polling

### 6.8 Integration Tests
- [ ] Write integration test for service browsing flow (list → details → actions)
- [ ] Write integration test for service power operations
- [ ] Write integration test for custom button execution

---

## Phase 7: Orders & Approval Workflows (Weeks 10-11)

### 7.1 Order Explorer
- [ ] Create `src/features/orders/types.ts`
- [ ] Create `src/features/orders/store/ordersSlice.ts`
- [ ] Create `src/features/orders/components/OrderList.tsx`
- [ ] Create `src/features/orders/components/OrderFilters.tsx`
- [ ] Create `src/features/orders/components/OrderSearch.tsx`
- [ ] Create `src/features/orders/components/OrderStatusDisplay.tsx`
- [ ] Create `src/features/orders/pages/OrderExplorerPage.tsx`
- [ ] Write tests for order explorer

### 7.2 Order Details
- [ ] Create `src/features/orders/components/OrderDetails.tsx`
- [ ] Create `src/features/orders/components/OrderTimeline.tsx`
- [ ] Create `src/features/orders/components/ApprovalWorkflow.tsx`
- [ ] Create `src/features/orders/components/OrderItems.tsx`
- [ ] Create `src/features/orders/pages/OrderDetailsPage.tsx`
- [ ] Write tests for order details

### 7.3 Order Operations
- [ ] Create `src/features/orders/components/ApproveOrderButton.tsx`
- [ ] Create `src/features/orders/components/DenyOrderButton.tsx`
- [ ] Create `src/features/orders/components/CancelOrderButton.tsx`
- [ ] Create `src/features/orders/components/ResubmitOrderButton.tsx`
- [ ] Write tests for order operations

### 7.4 Order State Management
- [ ] Implement order status polling in ordersSlice
- [ ] Create `src/features/orders/hooks/useOrderPolling.ts`
- [ ] Write tests for order state management

### 7.5 Integration Tests
- [ ] Write integration test for order approval workflow
- [ ] Write integration test for order tracking

---

## Phase 8: VM-Specific Gap Closure (Weeks 11-12)

### 8.1 VM Details
- [ ] Create `src/features/vms/types.ts`
- [ ] Create `src/features/vms/store/vmsSlice.ts`
- [ ] Create `src/features/vms/components/VMInfo.tsx`
- [ ] Create `src/features/vms/components/VMMetrics.tsx`
- [ ] Create `src/features/vms/components/VMRelationships.tsx`
- [ ] Create `src/features/vms/pages/VMDetailsPage.tsx`
- [ ] Write tests for VM details

### 8.2 VM Snapshots
- [ ] Create `src/features/vms/components/SnapshotList.tsx`
- [ ] Create `src/features/vms/components/CreateSnapshotDialog.tsx`
- [ ] Create `src/features/vms/components/RevertSnapshotDialog.tsx`
- [ ] Create `src/features/vms/components/DeleteSnapshotDialog.tsx`
- [ ] Write tests for snapshot management

### 8.3 VM Operations
- [ ] Create `src/features/vms/components/VMPowerOperations.tsx`
- [ ] Create `src/features/vms/components/VMConsoleAccess.tsx`
- [ ] Create `src/features/vms/components/RetireVMDialog.tsx`
- [ ] Write tests for VM operations

### 8.4 Gap Analysis
- [ ] Document any remaining VM gaps not covered by Services domain
- [ ] Confirm no VM-specific features are missing

---

## Phase 9: Quality, Accessibility & Performance (Weeks 12-13)

### 9.1 Unit Testing
- [ ] Ensure all components have unit tests
- [ ] Ensure all hooks have unit tests
- [ ] Ensure all utility functions have tests
- [ ] Ensure all Redux slices have tests
- [ ] Verify reliable local test execution
- [ ] Verify CI test execution

### 9.2 Integration Testing
- [ ] Write integration tests for all major feature flows
- [ ] Write API integration tests
- [ ] Write user flow tests
- [ ] Ensure PR CI coverage meets requirements

### 9.3 End-to-End Testing
- [ ] Write E2E tests for critical paths
- [ ] Perform cross-browser testing
- [ ] Run accessibility testing with axe DevTools
- [ ] Run performance testing with Lighthouse

### 9.4 Bug Fixes & Hardening
- [ ] Address all test failures
- [ ] Fix identified bugs
- [ ] Optimize performance bottlenecks
- [ ] Fix accessibility issues
- [ ] Complete security review

### 9.5 Quality Gates
- [ ] Verify all unit tests passing
- [ ] Verify all integration tests passing
- [ ] Verify E2E tests passing
- [ ] Verify accessibility compliance (WCAG 2.1 AA)
- [ ] Verify performance benchmarks met
- [ ] Complete security audit

---

## Phase 10: Deployment, Cutover & Documentation (Weeks 13-14)

### 10.1 Documentation
- [ ] Update `README.md` with React setup instructions
- [ ] Create migration guide in `docs/migration-guide.md`
- [ ] Update API documentation
- [ ] Document deployment process in `docs/deployment.md`
- [ ] Document rollback procedures in `docs/rollback.md`

### 10.2 Deployment Preparation
- [ ] Optimize production build configuration
- [ ] Optimize assets (images, fonts, etc.)
- [ ] Run bundle size analysis with webpack-bundle-analyzer
- [ ] Complete security audit
- [ ] Perform performance tuning

### 10.3 Cutover Planning
- [ ] Deploy to staging environment
- [ ] Conduct user acceptance testing (UAT)
- [ ] Create production deployment plan
- [ ] Document rollback procedures
- [ ] Set up monitoring and alerting
- [ ] Obtain feature parity sign-off from stakeholders

### 10.4 User & Support Resources
- [ ] Create user documentation
- [ ] Create support documentation
- [ ] Document known limitations
- [ ] Create follow-up backlog for post-migration improvements

### 10.5 Production Deployment
- [ ] Execute production deployment
- [ ] Verify application functionality in production
- [ ] Monitor for errors and performance issues
- [ ] Communicate deployment status to stakeholders

---

## Completion Criteria

The migration is complete when:
- [ ] All phases 1-10 tasks are checked off
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
