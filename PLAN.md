# ManageIQ Service UI - Angular to React Migration Plan

## Executive Summary

This document outlines the comprehensive plan for migrating the ManageIQ Service UI from Angular 1.8 to React. This is a greenfield React rewrite where the new application will be built alongside the existing Angular application, validated for feature parity, and then cut over once the deployment and rollback gates are satisfied.

**Migration Strategy**: Complete Rewrite / Greenfield React Application
**Estimated Timeline**: 14 weeks (sequential phases)
**Target Framework**: React 18+
**UI Library**: IBM Carbon Design System (required)
**Forms Strategy**: Data Driven Forms with Carbon component mapper for schema-driven dialogs
**State Management**: Redux Toolkit as the default application state layer
**Routing**: React Router v6
**Build Tool**: Webpack 5 (retained intentionally for ManageIQ consistency and CI/CD compatibility)
**Package Manager**: Yarn 4 (retained intentionally for ManageIQ consistency and CI/CD compatibility)
**Internationalization**: Gettext-compatible workflow using `ttag` and existing `.po` / `.pot` assets
**API Integration**: Existing ManageIQ REST API with session-token, authorization, and 401-handling behavior preserved from the current application

---

## Table of Contents

1. [Current Application Analysis](#1-current-application-analysis)
2. [Technology Stack](#2-technology-stack)
3. [Project Structure](#3-project-structure)
4. [Migration Phases](#4-migration-phases)
5. [Module Inventory](#5-module-inventory)
6. [API Integration Strategy](#6-api-integration-strategy)
7. [State Management Architecture](#7-state-management-architecture)
8. [Component Migration Mapping](#8-component-migration-mapping)
9. [Testing Strategy](#9-testing-strategy)
10. [Deployment Strategy](#10-deployment-strategy)
11. [Risk Mitigation](#11-risk-mitigation)
12. [Timeline Considerations](#12-timeline-considerations)

---

## 1. Current Application Analysis

### 1.1 Application Overview

The ManageIQ Service UI is an Angular 1.8 application that provides a self-service interface for:
- Service catalog browsing and ordering
- Service lifecycle management
- VM/resource management
- Order tracking and approval workflows
- Dashboard and reporting

### 1.2 Current Architecture

**Framework**: Angular 1.8 (AngularJS)
**Build Tool**: Webpack 5
**UI Framework**: PatternFly 3 (Angular PatternFly)
**State Management**: Angular services with `$rootScope`
**Routing**: UI-Router (`@uirouter/angularjs`)
**HTTP Client**: `$http` / `angular-resource`
**i18n**: angular-gettext

### 1.3 Key Dependencies

```
Core Angular Dependencies:
- angular@1.8.0
- angular-animate, angular-cookies, angular-resource
- angular-sanitize, angular-messages
- @uirouter/angularjs
- angular-ui-bootstrap
- angular-patternfly

UI/Styling:
- patternfly@3.59.5
- bootstrap@3.x (via patternfly)
- font-awesome@4.7.0
- c3/d3 for charts

Utilities:
- lodash@4.18.0
- moment@2.29.4
- jquery@3.7.0
- numeral@2.0.6
```

### 1.4 Module Structure

```
client/app/
├── app.js                    # Entry point
├── app.module.js            # Main Angular module
├── app.controller.js        # Root controller
├── catalogs/                # Catalog browsing module
├── components/              # Shared components (dashboard)
├── core/                    # Core services and utilities
├── layouts/                 # Layout templates
├── orders/                  # Order management module
├── services/                # Service management module
├── shared/                  # Shared components library
├── states/                  # UI-Router state definitions
└── skin/                    # Theming/customization
```

### 1.5 Feature Modules

1. **Authentication & Authorization**
   - Login/logout flows
   - OIDC integration
   - Session management
   - RBAC (Role-Based Access Control)

2. **Dashboard**
   - Service summary cards
   - Recent activity
   - Quick actions

3. **Catalogs**
   - Catalog explorer
   - Service template browsing
   - Catalog item details
   - Shopping cart

4. **Services**
   - Service explorer/list
   - Service details
   - Service lifecycle operations (start, stop, suspend, retire)
   - Service reconfiguration
   - Custom buttons
   - Resource details (VMs, networks, etc.)
   - Ansible playbook integration

5. **Orders/Requests**
   - Order history
   - Request tracking
   - Order approval workflows
   - Order details

6. **VMs/Resources**
   - VM details
   - VM snapshots
   - Console access (noVNC, SPICE, WebMKS)

7. **User Profile**
   - User settings
   - Language preferences
   - About page

---

## 2. Technology Stack

### 2.1 Core Technologies

Install with: `yarn add react react-dom react-router-dom @reduxjs/toolkit react-redux`

```json
{
  "react": "^18.3.0",
  "react-dom": "^18.3.0",
  "react-router-dom": "^6.26.0",
  "@reduxjs/toolkit": "^2.2.0",
  "react-redux": "^9.1.0"
}
```

### 2.2 UI Framework

Install with: `yarn add @carbon/react @carbon/icons-react @carbon/charts @carbon/charts-react`

```json
{
  "@carbon/react": "^1.65.0",
  "@carbon/icons-react": "^11.49.0",
  "@carbon/charts": "^1.19.0",
  "@carbon/charts-react": "^1.19.0"
}
```

### 2.3 Utilities

Install with: `yarn add axios lodash date-fns numeral classnames`

```json
{
  "axios": "^1.7.0",
  "lodash": "^4.17.21",
  "date-fns": "^3.6.0",
  "numeral": "^2.0.6",
  "classnames": "^2.5.0"
}
```

### 2.4 Internationalization

**Decision**: The React application must preserve a gettext-based internationalization workflow for compatibility with the existing translation process and ManageIQ conventions. This is a hard requirement, not an interchangeable implementation detail.

Install with: `yarn add ttag`

```json
{
  "ttag": "^1.8.6"
}
```

**Dev Dependencies** (for gettext extraction and compilation):
Install with: `yarn add -D ttag-cli gettext-parser`

```json
{
  "ttag-cli": "^1.10.1",
  "gettext-parser": "^8.0.0"
}
```

**Selected Approach**: Use `ttag` because it provides native gettext support for React with `.pot` / `.po` compatibility, allows the migration to preserve existing translation assets and marker conventions, and supports a documented `.po` to `.json` runtime translation path for production deployments.

#### 2.4.1 Gettext Implementation with ttag

**Validated constraints from the current application**:
- The current application compiles translations from `client/gettext/po/**/*.po` into `client/gettext/json/manageiq-ui-service.json` via [`gettext:compile`](package.json:18)
- Extraction currently recognizes `__` and `N_` marker functions via [`gettext:extract`](package.json:19)
- Runtime translation setup exposes `window.__` and `window.N_` in [`gettextInit()`](client/app/core/gettext.config.js:4)
- Existing `.po` files should remain the source of truth unless there is an explicit repository-level decision to relocate them

**Why ttag?**
- Native gettext support (`.pot` / `.po`)
- No conversion needed from existing `angular-gettext` files
- Compatible with the existing translation workflow
- Can maintain existing `__()` and `N_()` syntax via a compatibility layer
- Minimizes migration churn in code paths that already rely on gettext markers

**Target implementation pattern**:
- Preserve `.po` / `.pot` assets as source translations
- Preserve `__()` and `N_()` compatibility where that reduces migration churn
- Replace Angular template translation directives with React-compatible translation calls
- Precompile runtime translation assets from `.po` files during the build
- Keep extraction configured to recognize `__` and `N_`

**Illustrative compatibility layer**:
```typescript
// src/i18n/index.ts
import { t, msgid, ngettext } from 'ttag';

export function __(str: string): string {
  return t`${str}`;
}

export function N_(str: string): string {
  return msgid`${str}`;
}

export function ngettext_(singular: string, plural: string, count: number): string {
  return ngettext(msgid`${singular}`, msgid`${plural}`, count);
}

export { t, msgid, ngettext } from 'ttag';
```

**Illustrative build scripts**:
```json
{
  "scripts": {
    "i18n:extract": "ttag extract --marker-names __,N_ $(find src -name '*.ts' -o -name '*.tsx') -o client/gettext/po/manageiq-ui-service.pot",
    "i18n:update": "ttag update client/gettext/po/*/manageiq-ui-service.po client/gettext/po/manageiq-ui-service.pot",
    "i18n:compile": "ttag po2json client/gettext/po/*/manageiq-ui-service.po -o public/locales"
  }
}
```

**Migration notes**:
- Existing `.po` files can be used directly
- Preserve marker compatibility first; optimize syntax later if desired
- Validate the final runtime asset format and output path against the chosen repository layout before implementation

---

### 2.5 Forms Strategy

**Decision**: Schema-driven dialogs and provisioning forms should default to Data Driven Forms with a Carbon component mapper. This is especially important for catalog ordering, service dialogs, and custom button dialogs where the backend or API defines form structure.

**Use Data Driven Forms when**:
- The form schema is server-defined or dynamically generated
- The same dialog structure must be rendered in multiple contexts
- Validation rules and field visibility are data-driven
- The form needs a consistent Carbon-based rendering layer

**Use conventional React forms when**:
- The form is small, static, and local to a single component
- The overhead of schema normalization would outweigh the benefits
- The UI is not driven by backend dialog metadata

**Implementation Notes**:
- Prefer the Carbon mapper for standard field rendering
- Expect custom field adapters for ManageIQ-specific dialog widgets
- Add a schema normalization layer if API dialog payloads do not map directly to Data Driven Forms
- Keep submission, validation, and conditional field logic centralized so dialog behavior is testable and reusable

---

### 2.6 Build Tools

Install with: `yarn add -D webpack webpack-cli webpack-dev-server @babel/core @babel/preset-react @babel/preset-typescript typescript`

```json
{
  "webpack": "^5.94.0",
  "webpack-cli": "^5.1.0",
  "webpack-dev-server": "^5.0.0",
  "@babel/core": "^7.24.0",
  "@babel/preset-react": "^7.24.0",
  "@babel/preset-typescript": "^7.24.0",
  "typescript": "^5.4.0"
}
```

---

### 2.7 Testing

**Current repository baseline**:
- Angular tests currently run through Karma/Mocha/Chai in [`package.json`](package.json:23)
- Any React testing stack change must account for CI coexistence or migration cost

**Proposed React testing stack**:
Install with: `yarn add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event jest jest-environment-jsdom babel-jest msw`

```json
{
  "@testing-library/react": "^15.0.0",
  "@testing-library/jest-dom": "^6.4.0",
  "@testing-library/user-event": "^14.5.0",
  "jest": "^29.7.0",
  "jest-environment-jsdom": "^29.7.0",
  "babel-jest": "^29.7.0",
  "msw": "^2.3.0"
}
```

**Migration note**:
- Use Jest as the proposed React test runner and `@testing-library/react` as the component-testing utility layer

---

## 3. Project Structure

### 3.1 Proposed Directory Structure

```
manageiq-ui-service/
├── .yarn/                    # Yarn cache and PnP files
│   ├── cache/                # Dependency cache
│   ├── releases/             # Yarn binary
│   └── unplugged/            # Unplugged packages (if any)
├── .pnp.cjs                  # PnP resolution file (generated)
├── .pnp.loader.mjs           # PnP loader (generated)
├── .yarnrc.yml               # Yarn configuration with PnP enabled
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── locales/              # i18n translation files
│       ├── en/
│       ├── de/
│       ├── es/
│       └── ...
├── src/
│   ├── index.tsx             # Application entry point
│   ├── App.tsx               # Root component
│   ├── api/                  # API client layer
│   │   ├── client.ts         # Axios instance configuration
│   │   ├── auth.ts           # Authentication endpoints
│   │   ├── catalogs.ts       # Catalog endpoints
│   │   ├── services.ts       # Service endpoints
│   │   ├── orders.ts         # Order endpoints
│   │   └── types.ts          # API type definitions
│   ├── assets/               # Static assets
│   │   ├── images/
│   │   └── styles/
│   ├── components/           # Shared/reusable components
│   │   ├── common/           # Generic UI components
│   │   ├── layout/           # Layout components
│   │   └── forms/            # Form components
│   ├── features/             # Feature modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── store/
│   │   │   └── types.ts
│   │   ├── dashboard/
│   │   ├── catalogs/
│   │   ├── services/
│   │   ├── orders/
│   │   ├── vms/
│   │   └── profile/
│   ├── hooks/                # Shared custom hooks
│   ├── i18n/                 # i18n configuration
│   ├── routes/               # Route definitions
│   ├── store/                # Redux store configuration
│   │   ├── index.ts
│   │   ├── rootReducer.ts
│   │   └── middleware.ts
│   ├── types/                # Shared TypeScript types
│   ├── utils/                # Utility functions
│   └── constants/            # Application constants
├── tests/
│   ├── setup.ts
│   ├── mocks/
│   └── fixtures/
├── config/
│   ├── webpack.common.js
│   ├── webpack.dev.js
│   └── webpack.prod.js
├── .eslintrc.js
├── .prettierrc
├── tsconfig.json
├── package.json
└── README.md
```

### 3.2 Feature Module Structure

Each feature module follows a consistent structure:

```
features/[feature-name]/
├── components/               # Feature-specific components
│   ├── FeatureList.tsx
│   ├── FeatureDetail.tsx
│   └── FeatureForm.tsx
├── hooks/                    # Feature-specific hooks
│   ├── useFeatureData.ts
│   └── useFeatureActions.ts
├── store/                    # Redux slice for this feature
│   ├── featureSlice.ts
│   ├── featureThunks.ts
│   └── featureSelectors.ts
├── types.ts                  # Feature-specific types
├── utils.ts                  # Feature-specific utilities
└── index.ts                  # Public API exports
```

---

## 4. Migration Phases

The migration should be executed as dependency-aware workstreams rather than as a purely linear feature sequence. This makes the plan easier to parallelize across AI agents while preserving the hard architectural decisions: greenfield React, IBM Carbon, gettext compatibility, and Data Driven Forms for schema-driven dialogs.

### Phase 1: Platform Foundation (Weeks 1-2)

**Goal**: Establish the React platform, repository conventions, and non-negotiable architectural primitives.

#### Tasks:
1. **Project Setup**
   - Initialize the greenfield React project with TypeScript
   - Configure Webpack build system aligned with ManageIQ conventions
   - Set up ESLint, Prettier, Babel, and TypeScript configs
   - Configure development and production builds
   - Confirm Yarn 4 / Berry behavior and CI compatibility

2. **API Client Layer**
   - Create Axios-based API client
   - Implement request/response interceptors
   - Add error handling middleware
   - Create API endpoint modules
   - Define TypeScript interfaces for API responses

3. **Testing Framework & CI**
   - Establish the automated test framework during initial setup, not as a later hardening task
   - Configure Jest and React Testing Library
   - Set up Mock Service Worker (MSW) for API mocking
   - Create test utilities and helpers
   - Ensure tests can be run locally with stable developer commands
   - Add `.github/workflows/ci.yaml` to run linting and tests on pull requests
   - Make GitHub Actions CI a required validation path for the new React application

4. **API Client Layer Tests**
   - Write comprehensive tests for API client (interceptors, error handling, 401 handling)
   - Write tests for all API endpoint modules (auth, services, catalogs, orders, vms)
   - Verify API error handling and retry logic
   - Ensure all API tests pass locally and in CI

5. **Authentication, Session, and RBAC**
   - Implement login/logout flows
   - Integrate OIDC and session lifecycle handling
   - Implement session management with Redux Toolkit
   - Add token refresh behavior if required by the backend flow
   - Create protected route wrappers
   - Preserve the Angular authorization model:
     - feature checks (`has`)
     - grouped permission checks (`hasAny`)
     - role checks (`hasRole`)
   - Create route-, component-, action-, and menu-level authorization utilities

6. **Core Infrastructure**
   - Redux store setup with Redux Toolkit
   - Router configuration with React Router
   - Error boundary implementation
   - Loading state management
   - Toast / notification system
   - Polling and refresh primitives for long-running operations

7. **i18n Setup**
   - Configure `ttag` for gettext-based i18n
   - Migrate existing `.po` files from `angular-gettext` without conversion
   - Set up extraction scripts for `.pot` generation
   - Create translation utilities compatible with existing gettext markers
   - Create language switcher component
   - Configure build process to compile `.po` files

**Deliverables**:
- Working authentication flow with RBAC
- API client ready for use
- Redux store configured
- Routing infrastructure in place with permission guards
- i18n system operational
- RBAC hooks and utilities ready for use
- Automated test framework operational locally and in GitHub Actions
- Pull request CI workflow in `.github/workflows/ci.yaml`

---

### Phase 2: Carbon Design System and Shared Primitives (Weeks 2-3)

**Goal**: Build the shared UI foundation on IBM Carbon and establish reusable primitives for feature teams.

#### Tasks:
1. **Application Shell**
   - Application shell / frame
   - Navigation header
   - Sidebar navigation
   - Footer
   - Breadcrumbs

2. **Common UI Components**
   - Carbon-based data tables with sorting/filtering
   - Pagination
   - Search/filter bars
   - Modal dialogs
   - Confirmation dialogs
   - Loading indicators
   - Empty states
   - Error states

3. **Data Display Components**
   - Cards
   - Lists
   - Detail views
   - Status indicators
   - Icon components
   - Timeline component
   - Tag display

4. **Action Components**
   - Action buttons
   - Dropdown menus
   - Toolbars
   - Permission-aware action groups
   - Custom button group primitives

5. **Accessibility and UX Standards**
   - Carbon usage guidelines
   - Keyboard interaction patterns
   - Focus management
   - Accessible status and error messaging

**Deliverables**:
- Carbon-based application shell
- Shared component library
- Accessibility baseline established
- Component unit tests

---

### Phase 3: Forms and Dialog Platform (Weeks 3-4)

**Goal**: Establish a reusable strategy for schema-driven dialogs and provisioning workflows.

#### Tasks:
1. **Data Driven Forms Integration**
   - Add Data Driven Forms and Carbon component mapper
   - Validate mapper compatibility with the selected Carbon version
   - Establish form renderer composition patterns

2. **Schema Normalization**
   - Define how ManageIQ dialog payloads map to Data Driven Forms schema
   - Create adapters for field metadata, validation, and conditional visibility
   - Document unsupported or custom field types

3. **Custom Field Adapters**
   - Implement adapters for ManageIQ-specific widgets
   - Standardize submission payload transformation
   - Centralize validation and conditional logic

4. **Dialog Runtime**
   - Modal and full-page dialog rendering patterns
   - Async field loading and dependent field updates
   - Error handling and retry behavior
   - Test harnesses for schema-driven forms

**Deliverables**:
- Data Driven Forms platform ready for feature use
- Carbon mapper integrated
- Schema normalization strategy documented
- Reusable dialog runtime and tests

---

### Phase 4: Dashboard and Profile Features (Weeks 4-5)

**Goal**: Migrate lower-complexity user-facing features to validate the platform.

#### Tasks:
1. **Dashboard**
   - Dashboard grid layout
   - Widget containers
   - Service summary cards
   - Recent services widget
   - Recent orders widget
   - Quick action buttons
   - Dashboard API integration

2. **User Profile and Settings**
   - Profile information display
   - Profile editing
   - Language preferences
   - Notification preferences if still in scope
   - Theme settings if still in scope

3. **About Page**
   - Application version info
   - License information
   - Help resources

**Deliverables**:
- Functional dashboard page
- User profile and settings
- About page
- Integration tests for migrated flows

---

### Phase 5: Catalogs and Ordering (Weeks 5-7)

**Goal**: Migrate catalog browsing, ordering, and provisioning workflows.

#### Tasks:
1. **Catalog Explorer**
   - Catalog list view
   - Catalog tree navigation
   - Service template cards
   - Search and filtering
   - Sorting options

2. **Catalog Item Details**
   - Service template detail view
   - Template information display
   - Provisioning dialog forms
   - Dynamic form rendering through Data Driven Forms where schema-driven
   - Form validation and submission handling

3. **Shopping Cart**
   - Cart component
   - Add/remove items
   - Cart persistence
   - Order submission
   - Order confirmation

4. **Catalog State Management**
   - Redux slices for catalogs
   - Shopping cart state
   - Form state management
   - API integration

**Deliverables**:
- Complete catalog browsing experience
- Working order submission flow
- Shopping cart functionality
- Provisioning dialogs rendered through the selected forms strategy
- Integration tests

---

### Phase 6: Services Domain Migration (Weeks 7-10)

**Goal**: Migrate the most complex domain in smaller, testable work packages.

#### Tasks:
1. **Services List and Filtering**
   - Service list view
   - Service cards / tiles
   - List/grid view toggle
   - Search and filtering
   - Sorting and pagination
   - Query filter translation from current Angular behavior

2. **Service Details and Related Resources**
   - Service detail page
   - Service information tabs
   - Resource relationships
   - Service topology view
   - Generic objects display
   - Embedded VM/resource details that are service-scoped

3. **Permission-Aware Service Actions**
   - Power operations (start, stop, suspend)
   - Service retirement
   - Service reconfiguration
   - Service editing
   - Ownership management
   - Lifecycle / policy / configuration action groups
   - Confirmation flows for destructive actions

4. **Custom Buttons and Dialog-Backed Actions**
   - Role-aware custom button filtering
   - Dialog-backed custom actions
   - Direct API-backed custom actions
   - Success and failure notification handling

5. **Service-Adjacent VM and Console Capabilities**
   - Console access integration
   - Snapshot visibility and operations where exposed through services
   - Network and storage detail views where still in scope

6. **Ansible and Orchestration Views**
   - Ansible playbook display
   - Playbook execution status
   - Playbook output viewing

7. **Service State Management**
   - Redux slices for services
   - Service operations state
   - Polling mechanism
   - Auto-refresh behavior for long-running operations

**Deliverables**:
- Complete service management interface
- Permission-aware action system
- Custom button flows operational
- Resource and console integration
- Integration tests for service-critical workflows

---

### Phase 7: Orders and Approval Workflows (Weeks 10-11)

**Goal**: Migrate order tracking, request visibility, and approval flows.

#### Tasks:
1. **Order Explorer**
   - Order list view
   - Order filtering
   - Order search
   - Order status display

2. **Order Details**
   - Order detail page
   - Order timeline
   - Approval workflow display
   - Order item details

3. **Order Operations**
   - Order approval / denial
   - Order cancellation
   - Order resubmission

4. **Order State Management**
   - Redux slices for orders
   - Order status polling
   - API integration

**Deliverables**:
- Complete order management interface
- Order approval workflows
- Integration tests

---

### Phase 8: VM-Specific Gap Closure (Weeks 11-12)

**Goal**: Close any VM-specific gaps that are not already satisfied through the Services domain.

#### Tasks:
1. **VM Details**
   - VM information display
   - VM metrics and charts
   - VM relationships

2. **VM Snapshots**
   - Snapshot list
   - Snapshot creation
   - Snapshot reversion
   - Snapshot deletion

3. **VM Operations**
   - Power operations
   - Console access
   - VM retirement

**Deliverables**:
- VM detail views
- Snapshot management
- Console integration
- Explicit confirmation that no remaining VM gaps exist outside Services

---

### Phase 9: Quality, Accessibility, and Performance (Weeks 12-13)

**Goal**: Validate the migrated application against functional, accessibility, and performance gates.

#### Tasks:
1. **Unit Testing**
   - Component unit tests
   - Hook unit tests
   - Utility function tests
   - Redux slice tests
   - Maintain reliable local execution and CI execution for the full unit test suite

2. **Integration Testing**
   - Feature integration tests
   - API integration tests
   - User flow tests
   - Keep pull request CI coverage aligned with the selected test pyramid and critical-path expectations

3. **End-to-End Testing**
   - Critical path testing
   - Cross-browser testing
   - Accessibility testing
   - Performance testing

4. **Bug Fixes and Hardening**
   - Address test failures
   - Fix identified bugs
   - Performance optimization
   - Accessibility improvements
   - Security review follow-up

**Deliverables**:
- Comprehensive test coverage
- All critical bugs resolved
- Performance benchmarks met
- Accessibility compliance

---

### Phase 10: Deployment, Cutover, and Documentation (Weeks 13-14)

**Goal**: Prepare for staged rollout, validate rollback, and complete repository transition planning.

#### Tasks:
1. **Documentation**
   - Update setup guide
   - Create migration guide
   - Update API documentation
   - Document deployment and rollback process

2. **Deployment Preparation**
   - Production build optimization
   - Asset optimization
   - Bundle size analysis
   - Security audit
   - Performance tuning

3. **Cutover Planning**
   - Staging environment deployment
   - User acceptance testing
   - Production deployment plan
   - Rollback procedures
   - Monitoring setup
   - Feature parity sign-off

4. **User and Support Resources**
   - User documentation
   - Support documentation
   - Known limitations and follow-up backlog

**Deliverables**:
- Complete documentation
- Production-ready build
- Deployment and rollback procedures
- Cutover readiness sign-off

---

## 5. Module Inventory

### 5.1 Current Angular Modules

| Module | Components | Services | States | Priority |
|--------|-----------|----------|--------|----------|
| **Core** | Navigation, Shopping Cart, Site Switcher | Session, RBAC, Collections API, Event Notifications, Polling, Tagging | - | Critical |
| **Auth** | Login Form | Authentication API | Login, Logout, OIDC | Critical |
| **Dashboard** | Dashboard Component | Dashboard Service | Dashboard | High |
| **Catalogs** | Catalog Explorer, Catalog Cards | Catalogs State | Catalogs, Explorer, Details | High |
| **Services** | Service Explorer, Service Details, Resource Details, Custom Buttons, VM Snapshots | Services State, VMs Service, Power Operations, Consoles | Services, Explorer, Details, Reconfigure, Resource Details | High |
| **Orders** | Order Explorer, Requests List, Process Order Modal | Orders State | Orders, Explorer, Details | High |
| **VMs** | - | - | VMs, Snapshots | Medium |
| **Profile** | - | - | About Me | Medium |
| **Shared** | SS Card, Pagination, Timeline, Tagging, Icon List, Action Buttons, Custom Dropdown, Language Switcher | - | - | Critical |
| **Layouts** | Application Layout, Blank Layout | - | - | Critical |

### 5.2 Component Count Estimate

- **Total Angular Components**: ~50-60 components
- **Total Angular Services**: ~25-30 services
- **Total Routes/States**: ~20 states
- **Estimated React Components**: ~70-80 components (more granular)

---

## 6. API Integration Strategy

### 6.1 API Client Architecture

**Validated constraints from the current application**:
- Session state is bootstrapped from a stored token and user authorization payload in [`SessionFactory`](client/app/core/session.service.js:2)
- The current application sends the session token in the `X-Auth-Token` header via [`setAuthToken()`](client/app/core/session.service.js:32)
- Authorization data is refreshed from `/api?attributes=authorization` in [`getUserAuthorizations()`](client/app/core/session.service.js:105)
- 401 responses trigger session teardown and redirect behavior in [`authConfig()`](client/app/core/authorization.config.js:4)

**Target React API client requirements**:
- Preserve compatibility with the current ManageIQ session-token flow unless the backend contract is intentionally changed
- Centralize request defaults, error handling, and 401 handling
- Support collection queries, resource fetches, action posts, and polling-friendly refresh behavior
- Keep the client implementation independent from feature modules

**Illustrative client shape**:
```typescript
// src/api/client.ts
import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

class ApiClient {
  private client: AxiosInstance;

  constructor(getToken: () => string | null, onUnauthorized: () => void) {
    this.client = axios.create({
      baseURL: '/api',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use((config) => {
      const token = getToken();
      if (token) {
        config.headers['X-Auth-Token'] = token;
      }
      return config;
    });

    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          onUnauthorized();
        }
        return Promise.reject(error);
      }
    );
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.get<T>(url, config);
    return response.data;
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> {
    const response = await this.client.post<T>(url, data, config);
    return response.data;
  }
}
```

### 6.2 API Endpoint Modules

Each feature should have its own API module, but the exact request and response shapes must be derived from the current ManageIQ REST API behavior rather than assumed from simplified examples.

**Illustrative service API shape**:
```typescript
// src/api/services.ts
import { apiClient } from './client';

export const servicesApi = {
  getServices: (params?: Record<string, unknown>) =>
    apiClient.get('/services', { params }),

  getService: (id: string, params?: Record<string, unknown>) =>
    apiClient.get(`/services/${id}`, { params }),

  postAction: (id: string, action: string, payload?: Record<string, unknown>) =>
    apiClient.post(`/services/${id}`, { action, ...payload }),
};
```

### 6.3 API Type Definitions

**Guidance**:
- Treat type definitions as generated or validated artifacts derived from real API payloads
- Do not assume a single generic `ApiResponse<T>` shape for every endpoint
- Model collection queries, expanded resources, and action responses separately where needed

---

## 7. State Management Architecture

### 7.1 RBAC Implementation

**Current Angular RBAC Service** ([`rbac.service.js`](client/app/core/rbac.service.js:1)):
- Uses product feature constants from JSON
- Stores the current feature set separately from the feature constant catalog
- Treats permission checks as presence-based (`feature in features`), not strict boolean checks
- Supports `has`, `hasAny`, `hasRole`, and `suiAuthorized` semantics
- Receives role and authorization data from the session bootstrap flow in [`SessionFactory`](client/app/core/session.service.js:2)

**React RBAC Architecture**:

**Requirements to preserve**:
- Preserve feature checks equivalent to [`has()`](client/app/core/rbac.service.js:24)
- Preserve grouped permission checks equivalent to [`hasAny()`](client/app/core/rbac.service.js:28)
- Preserve role checks equivalent to [`hasRole()`](client/app/core/rbac.service.js:32)
- Preserve the service UI authorization gate equivalent to [`suiAuthorized()`](client/app/core/rbac.service.js:44)

**Illustrative state shape**:
```typescript
// src/features/auth/types.ts
export interface UserIdentity {
  role?: string;
  group?: string;
  [key: string]: unknown;
}

export interface RBACState {
  identity: UserIdentity | null;
  features: Record<string, unknown>;
  loading: boolean;
}
```

**Illustrative slice shape**:
```typescript
// src/features/auth/store/rbacSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RBACPayload {
  identity: UserIdentity | null;
  features: Record<string, unknown>;
}

const initialState: RBACState = {
  identity: null,
  features: {},
  loading: false,
};

const rbacSlice = createSlice({
  name: 'rbac',
  initialState,
  reducers: {
    setAuthorization(state, action: PayloadAction<RBACPayload>) {
      state.identity = action.payload.identity;
      state.features = action.payload.features || {};
    },
    clearAuthorization(state) {
      state.identity = null;
      state.features = {};
    },
  },
});

export const { setAuthorization, clearAuthorization } = rbacSlice.actions;
export default rbacSlice.reducer;
```

**Illustrative permission hooks**:
```typescript
// src/features/auth/hooks/usePermissions.ts
import { useAppSelector } from '@/hooks/redux';

export const usePermissions = () => {
  const { identity, features } = useAppSelector((state) => state.rbac);

  const has = (featureId: string): boolean => featureId in features;
  const hasAny = (featureIds: string[]): boolean => featureIds.some((id) => id in features);
  const hasRole = (...roles: string[]): boolean => roles.some((role) => role === identity?.role || role === '_ALL_');

  return {
    identity,
    has,
    hasAny,
    hasRole,
  };
};
```

**Route and component guards**:
- Route guards should distinguish unauthenticated users from authenticated-but-unauthorized users
- Component-level guards should support feature checks, grouped permission checks, and role checks
- Menu and action filtering should preserve the current permission-aware behavior used by service actions and dropdowns in [`services-state.service.js`](client/app/services/services-state.service.js:132)

### 7.2 Redux Store Structure

```typescript
// src/store/rootReducer.ts
import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/store/authSlice';
import catalogsReducer from '../features/catalogs/store/catalogsSlice';
import servicesReducer from '../features/services/store/servicesSlice';
import ordersReducer from '../features/orders/store/ordersSlice';
import cartReducer from '../features/catalogs/store/cartSlice';
import uiReducer from './uiSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  catalogs: catalogsReducer,
  services: servicesReducer,
  orders: ordersReducer,
  cart: cartReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
```

### 7.3 Feature Slice Example

```typescript
// src/features/services/store/servicesSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { servicesApi } from '../../../api/services';
import { Service } from '../../../api/types';

interface ServicesState {
  items: Service[];
  selectedService: Service | null;
  loading: boolean;
  error: string | null;
}

const initialState: ServicesState = {
  items: [],
  selectedService: null,
  loading: false,
  error: null,
};

export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (params?: ServiceQueryParams) => {
    return await servicesApi.getServices(params);
  }
);

export const fetchService = createAsyncThunk(
  'services/fetchService',
  async (id: string) => {
    return await servicesApi.getService(id);
  }
);

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    clearSelectedService: (state) => {
      state.selectedService = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.data;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch services';
      });
    // ... other cases
  },
});

export const { clearSelectedService } = servicesSlice.actions;
export default servicesSlice.reducer;
```

### 7.4 Custom Hooks for State Access

```typescript
// src/features/services/hooks/useServices.ts
import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/redux';
import { fetchServices } from '../store/servicesSlice';

export const useServices = (params?: ServiceQueryParams) => {
  const dispatch = useAppDispatch();
  const { items, loading, error } = useAppSelector((state) => state.services);

  useEffect(() => {
    dispatch(fetchServices(params));
  }, [dispatch, params]);

  return { services: items, loading, error };
};
```

---

## 8. Component Migration Mapping

### 8.1 Angular to React Component Mapping

| Angular Component | React Component | Notes |
|-------------------|-----------------|-------|
| `app.controller.js` | `App.tsx` | Root component |
| `navigation-controller.js` | `Navigation.tsx` | Header navigation |
| `shopping-cart.component.js` | `ShoppingCart.tsx` | Cart component |
| `ss-card.component.js` | `ServiceCard.tsx` | Service/catalog card |
| `pagination.component.js` | `Pagination.tsx` | Use Carbon pagination |
| `timeline.component.js` | `Timeline.tsx` | Custom or Carbon timeline |
| `tagging.component.js` | `TagEditor.tsx` | Tag management |
| `catalog-explorer.component.js` | `CatalogExplorer.tsx` | Catalog browser |
| `service-explorer.component.js` | `ServiceExplorer.tsx` | Service list |
| `service-details.component.js` | `ServiceDetails.tsx` | Service detail view |
| `resource-details.component.js` | `ResourceDetails.tsx` | VM/resource details |
| `custom-button.component.js` | `CustomButton.tsx` | Custom action buttons |
| `order-explorer.component.js` | `OrderExplorer.tsx` | Order list |
| `requests-list.component.js` | `RequestsList.tsx` | Request list |
| `dashboard.component.js` | `Dashboard.tsx` | Dashboard page |

### 8.2 Service to Hook/API Mapping

| Angular Service | React Equivalent | Notes |
|-----------------|------------------|-------|
| `session.service.js` | `useAuth()` hook + Redux | Authentication state |
| `collections-api.factory.js` | `api/` modules | API client |
| `navigation.service.js` | `useNavigation()` hook | Navigation state |
| `shopping-cart.service.js` | `useCart()` hook + Redux | Cart state |
| `services-state.service.js` | `servicesSlice` + hooks | Service state |
| `catalogs-state.service.js` | `catalogsSlice` + hooks | Catalog state |
| `orders-state.service.js` | `ordersSlice` + hooks | Order state |
| `polling.service.js` | `usePolling()` hook | Polling utility |
| `event-notifications.service.js` | `useNotifications()` hook | Toast notifications |
| `rbac.service.js` | `usePermissions()` hook | RBAC checks |
| `tagging.service.js` | `useTagging()` hook | Tag operations |

---

## 9. Testing Strategy

### 9.1 Testing Pyramid

```
        /\
       /  \
      / E2E \
     /--------\
    /          \
   / Integration \
  /--------------\
 /                \
/   Unit Tests     \
--------------------
```

### 9.2 Unit Testing

**Proposed React tools**: Jest, React Testing Library

**Current repository baseline**:
- Angular tests currently run through Karma/Mocha/Chai
- The React rewrite can adopt Vitest, but the migration plan must account for coexistence during the transition

**Coverage Goals**:
- Components: 80%+
- Hooks: 90%+
- Utilities: 95%+
- Redux slices: 90%+

**Example Component Test**:
```typescript
// src/features/services/components/ServiceCard.test.tsx
import { render, screen } from '@testing-library/react';
import { ServiceCard } from './ServiceCard';

describe('ServiceCard', () => {
  const mockService = {
    id: '1',
    name: 'Test Service',
    description: 'Test Description',
    power_state: 'on',
  };

  it('renders service information', () => {
    render(<ServiceCard service={mockService} />);
    expect(screen.getByText('Test Service')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('displays power state indicator', () => {
    render(<ServiceCard service={mockService} />);
    expect(screen.getByTestId('power-state-on')).toBeInTheDocument();
  });
});
```

### 9.3 Integration Testing

**Proposed React tools**: Jest, React Testing Library, MSW (Mock Service Worker)

**Focus Areas**:
- Feature workflows
- API integration
- State management
- Routing

**Example Integration Test**:
```typescript
// src/features/services/ServiceExplorer.integration.test.tsx
import { render, screen, waitFor } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { rest } from 'msw';
import { Provider } from 'react-redux';
import { store } from '../../../store';
import { ServiceExplorer } from './ServiceExplorer';

const server = setupServer(
  rest.get('/api/services', (req, res, ctx) => {
    return res(ctx.json({
      data: [
        { id: '1', name: 'Service 1' },
        { id: '2', name: 'Service 2' },
      ],
    }));
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe('ServiceExplorer Integration', () => {
  it('fetches and displays services', async () => {
    render(
      <Provider store={store}>
        <ServiceExplorer />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Service 1')).toBeInTheDocument();
      expect(screen.getByText('Service 2')).toBeInTheDocument();
    });
  });
});
```

### 9.4 End-to-End Testing

**Tools**: Playwright or Cypress

**Migration note**:
- End-to-end tooling should be selected with CI compatibility and parallel Angular/React validation in mind

**Critical Paths**:
1. Login → Dashboard → Logout
2. Browse Catalog → Add to Cart → Submit Order
3. View Services → Service Details → Power Operations
4. View Orders → Order Details
5. VM Details → Snapshot Management

### 9.5 Accessibility Testing

**Tools**: axe-core, jest-axe

**Migration note**:
- Accessibility checks should be automated in the React test stack and also used as cutover gates in deployment validation

**Requirements**:
- WCAG 2.1 Level AA compliance
- Keyboard navigation
- Screen reader support
- Color contrast compliance

---

## 10. Deployment Strategy

This section separates repository topology, build output topology, runtime deployment topology, and cutover strategy. These concerns are related, but they should not be treated as the same decision.

### 10.1 Build Configuration

**Development Build**:
```bash
NODE_ENV=development webpack serve --config config/webpack.dev.js
```

**Production Build**:
```bash
NODE_ENV=production webpack --config config/webpack.prod.js
```

### 10.2 Repository Strategy

**Recommended Approach**:
- Develop the React rewrite as a greenfield application inside the existing repository during the migration period
- Keep the Angular application stable while React reaches feature parity
- Treat the incubation directory as a delivery mechanism, not as a permanent architectural requirement

**Repository strategy for this plan**:
- Use an in-repository incubation directory during active migration
- Keep the current Angular application in its existing paths
- Build and validate the React application from an isolated directory inside `manageiq-ui-service/`
- Reconcile the final repository topology only after feature parity and cutover gates are satisfied

**Decision criteria**:
- CI/CD simplicity
- Ease of parallel development
- Risk of accidental Angular regressions
- Ease of final cutover into the canonical repository

### 10.3 Build Output Strategy

**Directory Structure**:
```
parent-directory/
├── manageiq/                          # ManageIQ core (sibling directory)
│   └── public/
│       └── ui/
│           ├── service/               # Final deployment location
│           └── service-react/         # Optional validation location
└── manageiq-ui-service/               # Existing UI repository
    └── react/                         # In-repo incubation directory
        └── dist/                      # Build output directory
            ├── index.html
            ├── js/
            ├── css/
            ├── images/
        └── locales/
```

**Build Process**:

1. **Primary Build**: React app builds to local `dist/` directory
   ```bash
   yarn build
   ```

2. **Optional Post-Build Copy** (if ManageIQ repository exists):
   ```bash
   yarn build:copy
   ```

**Package.json Scripts**:
```json
{
  "scripts": {
    "build": "NODE_ENV=production webpack --config config/webpack.prod.js",
    "build:copy": "yarn build && node scripts/copy-to-manageiq.js",
    "build:watch": "yarn build && yarn build:copy --watch"
  }
}
```

**Benefits of This Approach**:
- Standard JavaScript build pattern (`dist/`)
- Repository independence
- Optional integration with ManageIQ for development and validation
- Clean separation of concerns
- Easier CI/CD integration

### 10.4 Runtime Deployment Strategy

**Validation Deployment**:
- Deploy React app to `/ui/service-react/`
- Keep Angular app at `/ui/service/`
- Use this stage for internal testing, parity validation, and performance comparison

**Cutover Deployment**:
- Promote React app to `/ui/service/`
- Preserve a rollback path to the Angular build
- Remove temporary validation paths only after the cutover is stable

### 10.5 Repository Migration Steps

**Detailed steps for final repository cutover**:

```bash
# 1. Create archive repository for Angular code if needed
git clone manageiq-ui-service manageiq-ui-service-angular-archive
cd manageiq-ui-service-angular-archive
git tag v1.0.0-angular-final
git push origin v1.0.0-angular-final

# 2. In main repository, create migration branch
cd manageiq-ui-service
git checkout -b react-migration-final

# 3. Replace Angular code with the validated React application
# Update package.json, webpack configs, CI/CD files, and docs
git add .
git commit -m "Replace Angular application with React rewrite"

# 4. Merge to main after validation gates pass
git checkout master
git merge react-migration-final
git push origin master
```

**Files to Update During Migration**:
- `package.json` - Update scripts and dependencies
- `README.md` - Update setup instructions
- `.github/workflows/` - Update CI/CD pipelines
- `Rakefile` - Update build tasks
- Documentation in `docs/` directory

### 10.6 Cutover Gates

The React application should not replace Angular in production until all of the following are true:

- Feature parity sign-off completed
- Critical user journeys validated
- Accessibility audit passed
- Performance benchmarks met
- Security review completed
- Rollback procedure tested
- Stakeholder approval obtained

### 10.7 Rollback Plan

**Immediate Rollback**:
1. Revert to previous Angular build
2. Restore the prior deployment target if routing changed
3. Clear browser caches if asset mismatches are possible
4. Notify users and stakeholders

**Rollback Triggers**:
- Critical bugs affecting core functionality
- Performance degradation beyond agreed thresholds
- Accessibility violations
- Security vulnerabilities
- Failed parity validation in production-like environments

---

## 11. Risk Mitigation

### 11.1 Identified Risks

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| API compatibility issues | High | Medium | Thorough API testing, maintain API contracts |
| Performance degradation | High | Low | Performance testing, code splitting, lazy loading |
| Browser compatibility | Medium | Low | Cross-browser testing, polyfills |
| Missing features | High | Medium | Comprehensive feature inventory, user testing |
| State management complexity | Medium | Medium | Clear architecture, documentation |
| i18n issues | Medium | Low | Translation testing, language validation |
| Accessibility regressions | High | Medium | Automated a11y testing, validation |

### 11.2 Mitigation Strategies

**Technical Risks**:
- Comprehensive testing at all levels
- Code reviews for all changes
- Performance monitoring
- Automated accessibility testing
- Browser compatibility matrix

**Process Risks**:
- Regular stakeholder updates
- Incremental delivery
- User acceptance testing
- Beta testing program
- Clear rollback procedures

**Process Risks**:
- Clear documentation
- Consistent code patterns
- Automated validation

---

## 12. Timeline Considerations

### 12.1 Estimated Timeline

**Total Duration**: 14 weeks (sequential phases)

**Phase Breakdown**:
- Foundation: 1-1.5 weeks
- Shared Components: 0.5-1 week
- Dashboard: 0.5 week
- User Profile & Settings: 0.5 week
- Catalogs: 1-1.5 weeks
- Services: 1.5-2 weeks
- Orders: 0.5-1 week
- VMs: 0.5 week
- Testing: 1-1.5 weeks
- Documentation & Deployment: 0.5-1 week

**AI Agent Execution Model**:
- Multiple AI agents work in parallel on different modules
- Continuous execution (24/7 availability)
- No context switching overhead
- Instant code generation and iteration
- Automated testing and validation
- Human oversight for architecture decisions, code review, and final approval

**Parallel Execution Streams**:
- Stream 1: Foundation + Core Infrastructure
- Stream 2: Shared Components + Dashboard + Profile
- Stream 3: Catalogs + Services
- Stream 4: Orders + VMs
- Stream 5: Testing + Documentation (continuous)

### 12.2 Milestones

The original 10-week estimate is aggressive for a migration of this scope, especially once Carbon adoption, schema-driven dialogs, and the Services domain complexity are accounted for. Use dual estimates to communicate both an AI-assisted target and a more conservative delivery range.

| Milestone | Week | Deliverable |
|-----------|------|-------------|
| M1: Platform Foundation Complete | 2 | Auth, API client, routing, RBAC, i18n, testing framework working |
| M2: Carbon Primitives Complete | 3 | Shared shell and common components ready |
| M3: Forms Platform Complete | 4 | Data Driven Forms and Carbon mapper operational |
| M4: Dashboard and Profile Live | 5 | Dashboard, profile, and settings functional |
| M5: Catalogs Complete | 7 | Full catalog browsing and ordering |
| M6: Services Complete | 10 | Service management, actions, and custom buttons functional |
| M7: Orders Complete | 11 | Order tracking and approval workflows functional |
| M8: VM Gap Closure Complete | 12 | Remaining VM-specific features migrated |
| M9: Quality Gates Complete | 13 | Tests, accessibility, performance, and security gates passed |
| M10: Production Ready | 14 | Deployment and cutover readiness approved |

### 12.3 Dependencies

**External Dependencies**:
- ManageIQ API stability
- IBM Carbon Design System updates
- Browser support requirements
- Infrastructure/hosting

**Internal Dependencies**:
- Human oversight availability for reviews
- Stakeholder availability for UAT
- Infrastructure/hosting readiness

---

## Appendix A: Key Files to Migrate

### A.1 Core Services

```
client/app/core/
├── authentication-api.factory.js → src/api/auth.ts
├── collections-api.factory.js → src/api/client.ts
├── session.service.js → src/features/auth/store/authSlice.ts
├── rbac.service.js → src/features/auth/hooks/usePermissions.ts
├── navigation.service.js → src/features/layout/hooks/useNavigation.ts
├── shopping-cart.service.js → src/features/catalogs/store/cartSlice.ts
├── polling.service.js → src/hooks/usePolling.ts
├── event-notifications.service.js → src/hooks/useNotifications.ts
├── tagging.service.js → src/features/shared/hooks/useTagging.ts
└── language.service.js → src/i18n/index.ts
```

### A.2 Feature Modules

```
client/app/catalogs/ → src/features/catalogs/
client/app/services/ → src/features/services/
client/app/orders/ → src/features/orders/
client/app/states/vms/ → src/features/vms/
client/app/states/dashboard/ → src/features/dashboard/
client/app/states/about-me/ → src/features/profile/
```

### A.3 Shared Components

```
client/app/shared/
├── ss-card/ → src/components/common/Card/
├── pagination/ → src/components/common/Pagination/
├── timeline/ → src/components/common/Timeline/
├── tagging/ → src/components/common/TagEditor/
├── icon-list/ → src/components/common/IconList/
├── action-button-group/ → src/components/common/ActionButtons/
├── custom-dropdown/ → src/components/common/Dropdown/
└── language-switcher/ → src/components/layout/LanguageSwitcher/
```

---

## Appendix B: Configuration Files

### B.1 Package.json Scripts

```json
// package.json (scripts section)
{
  "scripts": {
    "start": "webpack serve --config config/webpack.dev.js",
    "build": "NODE_ENV=production webpack --config config/webpack.prod.js",
    "build:dev": "webpack --config config/webpack.dev.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "lint": "eslint src --ext .ts,.tsx",
    "lint:fix": "eslint src --ext .ts,.tsx --fix",
    "format": "prettier --write \"src/**/*.{ts,tsx,css,scss}\"",
    "type-check": "tsc --noEmit"
  }
}
```

### B.2 TypeScript Configuration

```json
// tsconfig.json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "allowJs": true,
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### B.3 ESLint Configuration

```javascript
// .eslintrc.js
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['react', '@typescript-eslint', 'jsx-a11y'],
  rules: {
    'react/react-in-jsx-scope': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
```

### B.4 Webpack Configuration (Simplified)

```javascript
// config/webpack.common.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: './src/index.tsx',
  output: {
    path: path.resolve(__dirname, '../../manageiq/public/ui/service'),
    filename: 'js/[name].[contenthash].js',
    publicPath: '/ui/service/',
    clean: true,
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    alias: {
      '@': path.resolve(__dirname, '../src'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash].css',
    }),
  ],
};
```

---

### B.5 Yarn Configuration

```yaml
# .yarnrc.yml (Yarn 4.14.1 - Berry with PnP)
nodeLinker: pnp
yarnPath: .yarn/releases/yarn-4.14.1.cjs

# PnP mode provides:
# - Faster installs (no node_modules to write)
# - Reduced disk space usage
# - Better dependency resolution
# - Stricter dependency management

# Ensure lockfile is respected in CI
enableImmutableInstalls: true

# PnP compatibility settings
pnpMode: strict
```

**Benefits of PnP (Plug'n'Play)**:
- **Faster Installation**: No need to copy files to `node_modules`, dependencies are resolved directly from the cache
- **Reduced Disk Space**: Eliminates duplicate `node_modules` folders across projects
- **Better Performance**: Faster module resolution at runtime
- **Stricter Dependencies**: Prevents phantom dependencies (accessing packages not declared in package.json)
- **Modern Approach**: Aligns with Yarn Berry's recommended configuration

**PnP Compatibility**:
- React, TypeScript, and Webpack all support PnP mode
- IBM Carbon Design System is PnP compatible
- Most modern tooling works seamlessly with PnP
- `.pnp.cjs` file is generated for module resolution

**Installation Commands**:
```bash
# Initialize in-repo React project with Yarn Berry
mkdir react
cd react
yarn init -2
yarn set version 4.14.1

# Install dependencies
yarn add react react-dom react-router-dom @reduxjs/toolkit react-redux
yarn add @carbon/react @carbon/icons-react @carbon/charts @carbon/charts-react
yarn add axios lodash date-fns numeral classnames
yarn add ttag

# Install dev dependencies
yarn add -D webpack webpack-cli webpack-dev-server
yarn add -D @babel/core @babel/preset-react @babel/preset-typescript
yarn add -D typescript @types/react @types/react-dom @types/node
yarn add -D ts-loader babel-loader
yarn add -D html-webpack-plugin mini-css-extract-plugin
yarn add -D css-loader style-loader
yarn add -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
yarn add -D eslint-plugin-react eslint-plugin-react-hooks eslint-plugin-jsx-a11y
yarn add -D prettier
yarn add -D @testing-library/react @testing-library/jest-dom @testing-library/user-event
yarn add -D jest jest-environment-jsdom babel-jest msw
yarn add -D ttag-cli gettext-parser babel-plugin-ttag
```

**Note**: The `babel-plugin-ttag` is required for compile-time translation extraction and should be added to your Babel configuration.

## Appendix C: Implementation Checklist

**Note:** A detailed, commit-ready implementation checklist has been created in [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md). This file contains granular tasks organized by phase, with each task designed to be completed independently and committed as a discrete unit of work.

Refer to [`IMPLEMENTATION_PLAN.md`](./IMPLEMENTATION_PLAN.md) for:
- Step-by-step implementation tasks
- Commit-ready task descriptions
- Task dependencies and sequencing
- Testing requirements for each component
- Completion criteria

---

## Appendix D: Resources

### D.1 Documentation

- [React Documentation](https://react.dev/)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [React Router Documentation](https://reactrouter.com/)
- [IBM Carbon Design System](https://carbondesignsystem.com/)
- [Testing Library Documentation](https://testing-library.com/)

### D.2 Tools

- React Developer Tools
- Redux DevTools
- Webpack Bundle Analyzer
- Lighthouse for performance auditing
- axe DevTools for accessibility
- AI agent monitoring and logging tools

---

## Conclusion

This migration plan provides a roadmap for transitioning the ManageIQ Service UI from Angular 1.8 to React while preserving validated ManageIQ-specific behavior around session handling, authorization, gettext workflows, and deployment gates.

**Confirmed direction**:
1. **Greenfield Rewrite Strategy**: Build the React application alongside the existing Angular app
2. **Hard Architectural Decisions**: IBM Carbon, gettext compatibility, and ManageIQ-aligned tooling remain explicit constraints
3. **Execution-Oriented Workstreams**: Platform, forms, feature migration, and cutover work are decomposed for parallel delivery
4. **Quality Gates**: Testing, accessibility, performance, and rollback validation remain required before cutover
5. **Working Repository Assumption**: Use an in-repo incubation directory during active migration

**Immediate next actions**:
1. Review and approve the normalized assumptions in this plan
2. Validate the sibling-repository incubation model with stakeholders
3. Begin Phase 1 with session/auth/RBAC behavior explicitly modeled from the current application
4. Validate API payload shapes and translation build outputs before locking implementation details
5. Keep this document updated as assumptions are confirmed or intentionally changed

This plan is a living document and should be updated as the migration progresses, assumptions are validated, and implementation details become concrete.
