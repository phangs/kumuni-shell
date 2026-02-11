# Dynamic Module Loading in Kumuni Super App

Kumuni utilizes a micro-modular architecture that allows for dynamic loading of different types of modules (mini-apps) at runtime. This approach enables a scalable ecosystem where features can be developed, deployed, and updated independently.

## 1. Core Architecture: Kernel vs. Modules

The system is split into two main layers:
- **Kernel (The Shell):** The host application (Kumuni Shell) that handles bootstrapping, authentication, navigation, and security enforcement.
- **Modules (Mini-apps):** Independent units of functionality that run within the context provided by the Kernel.

## 2. Module Types

Kumuni supports three primary module types, defined in the `ModuleRegistry`:

### A. `sdui` (Server-Driven UI)
Modules defined entirely by JSON schemas. The Kernel fetches the schema and renders it using native components.
- **Renderer:** `SDUIRenderer.tsx`
- **Registry:** `InitRegistry.ts` (Registers components like `WalletCard`, `ServicesGrid`, etc.)
- **Best For:** Dashboards, simple forms, and content-heavy screens.

### B. `web` (Sovereign WebView)
Self-contained web applications served over HTTP/HTTPS. They run inside a "Sovereign WebView" which provides a bridge to the Kernel.
- **Renderer:** `SovereignWebView.tsx`
- **Features:**
  - Automatic theme injection (CSS variables).
  - Secure `kernelBridge` for data access.
- **Best For:** Complex web-based tools and existing web legacy migrations.

### C. `remote_js` (Module Federation)
Native React Native code loaded dynamically from a remote server using Federated modules via **Re.Pack**.
- **Technology:** Webpack Module Federation + Re.Pack.
- **Config:** `webpack.config.mjs`
- **Best For:** High-performance, fully native mini-apps that require native APIs.

---

## 3. Discovery and Initialization

The entry point for module discovery is the `Bootstrapper`.

1. **Bootstrap Initialization:** During `App.tsx` startup, `Bootstrapper.initialize()` is called.
2. **Master Config Fetch:** It fetches the `master_config` (managed in `MockInterceptor` for development).
3. **Module Registry:** The config contains a `module_registry` array:
   ```json
   {
     "id": "calculator",
     "name": "Calculator",
     "type": "remote_js",
     "entry_url": "http://localhost:8082/calculator.js",
     "permissions": ["*"]
   }
   ```

---

## 4. Secure Communication: The KernelBridge

Modules are forbidden from making direct network requests. Instead, they must use the `KernelBridge` protocol.

### Native Bridge (`KernelBridge.ts`)
Standardizes requests to Central and Tenant APIs while enforcing module-level permissions.

**How is the Base URL resolved?**
The `KernelBridge` does not store base URLs itself. Instead:
1.  **Bootstrapping:** At startup, the `Bootstrapper` fetches the `master_config`.
2.  **Initialization:** The `Bootstrapper` calls `initialize()` on `CentralApiClient` and `TenantApiClient`, passing the URLs from the config.
3.  **Routing:** When a module calls `KernelBridge.makeSecureRequest({ clientType: 'tenant', ... })`, the bridge routes the request to the corresponding client (e.g., `TenantApiClient.makeRequest()`), which already has the base URL stored in its internal state.

```typescript
const response = await KernelBridge.makeSecureRequest({
  moduleId: 'my-module',
  endpoint: '/data',
  method: 'GET',
  clientType: 'tenant'
});
```

### Web Bridge (`postMessage`)
`SovereignWebView` injects a `window.kernelBridge` object into web modules:
```javascript
// Web module calling the bridge
window.kernelBridge.call('request', { 
  endpoint: '/api/v1/profile',
  method: 'GET'
});
```

---

## 5. Theming

The Kernel maintains a global theme in `ThemeProvider.tsx`. This theme is propagated to modules:

- **SDUI/Native:** Components use the `useTheme()` hook.
- **Web:** `SovereignWebView` injects `window.appTheme` and creates a `<style>` block at runtime to override CSS properties like `background-color` for buttons and inputs.

---

## 6. Application Lifecycle & Data Flow

When a user opens the Kumuni Super App, the following sequence occurs to load the dynamic environment:

### Step 1: Cold Start & Registry Prep
The root `App.tsx` executes and immediately:
- Calls `initRegistry()` to register all native SDUI components.
- Enables `MockInterceptor` (in development mode).
- Triggers `Bootstrapper.initialize()`.

### Step 2: The Master Bootstrap Request
The `Bootstrapper` performs a `GET` request to the Master Configuration endpoint.
- **Backend:** Central API (or Mock API).
- **Endpoint:** `https://mock-api.example.com/master_config`
- **Goal:** Obtain the "Source of Truth" for the entire app session.

### Step 3: Global System Initialization
Upon receiving the **Master Config** response, the Kernel:
1.  **Sets Theme:** Updates `ThemeProvider` with primary and secondary colors.
2.  **Inits API Clients:** Configures `CentralApiClient` and `TenantApiClient` with their respective Base URLs and API Keys.
3.  **Sets User Context:** `UserManager` initializes the user state (e.g., Guest mode with a temporary token).

### Step 4: Initial Navigation & Screen Content
After bootstrapping is complete, the app transitions to the `MainDashboard` (defaulting to the `/central/dashboard` path).
1.  **Request:** `MainDashboard` calls `KernelBridge.makeSecureRequest({ endpoint: '/central/dashboard' })`.
2.  **Routing:** `KernelBridge` validates permissions and routes the request through `CentralApiClient`.
3.  **Response:** The backend returns the **SDUI Schema** for the dashboard (see Appendix B).

### Step 5: Native Rendering
The `SDUIRenderer` receives the JSON schema:
- It iterates through the `children` array.
- For each component type (e.g., `WalletCard`), it looks up the registered React component in `SDUIRegistry`.
- It renders the native component tree with the provided `props`.

---

## 7. Implementing a New Module

To implement and display a new module in the app:

1. **Deploy the Module:** Host your SDUI JSON, Web App, or JS Bundle.
2. **Register in Master Config:** Add the module entry to the `module_registry` in the central configuration service.
3. **Add Entry Point Action:** Define an action (e.g., `open_module_x`) in the dashboard navigation or a `ServicesGrid` item.
4. **Define Handle Logic:** Ensure `MainDashboard.tsx` or its action handlers know how to route to the module based on its `type`.

> [!IMPORTANT]
> **Registration vs. Visibility:**
> Being in the `module_registry` (Master Config) only **authorizes** the module and defines its type. It does **not** automatically show up in the UI. For a module to be visible to the user, its ID or an associated `action` must be explicitly referenced in an SDUI schema (like the `ServicesGrid` on the Dashboard).
>
### SDUI Module Types
1.  **Single Page:** Returns a single component tree (usually a `container` or `scrollview`).
2.  **Multi-Page (MiniApp):** Returns a schema with a `pages` array and a `navigation` object. The Shell handles internal navigation between these pages without network round-trips for the UI.
    - **Guest-Aware Entry:** If the Kernel detects a Guest user, it prioritizes `navigation.guestPageId` (if provided) as the starting screen. Registered users start at `navigation.initialPageId`.

---

## 7. Components: The SDUIRegistry

The Shell provides a set of pre-built "Atoms" that can be used in any SDUI module.

### Core Atoms
- `container` / `scrollview`: Layout wrappers.
- `text` / `heading`: Standard and emphasized typography.
- `image`: Displays remote images (via `source` prop).
- `button`: Triggers actions with flexible variants.
- `text-input` / `textarea`: Form data collection.
- `date-picker`: Native-style date selection.

---

## 8. Secure Inter-Module Actions
SDUI modules interact with the Shell via actions. The Shell intercepts these via the `MiniAppRenderer` and `KernelBridge`.

### Navigation Actions
- `@pushPage`: Navigates to another page within the same MiniApp (internal).
- `@popPage`: Goes back or exits the app.
- `nav_home` / `nav_profile`: Global navigation to Shell screens.

### Transactional Actions
- `@submitForm`: Sends local form data to a whitelisted endpoint via `KernelBridge`.
- `@toast`: Displays a native notification.
- `@register`: Triggers the Shell's authentication/onboarding flow.

---

## 9. Scalability: The "Zero-Shell-Change" Goal

A common question is: *Do we need to change the Shell code for every new miniapp?*

**The goal is NO.** Once the foundation is solid, adding a new module should be **100% data-driven**. 

### Why I had to change the Shell for the Solo Parent App:
I had to make changes today because the **Toolkit** was incomplete.
1.  **Components (`Atoms.tsx`):** The Shell didn't have an `Input` component yet. Now that it's there, any future form app can reuse it without code changes.
2.  **Generic Actions (`MainDashboard.tsx`):** I had to implement the `submit_form` logic. Now that this generic handler exists, any future app can submit data to any endpoint by simply passing different `actionParams`.

### The Future Workflow (Zero Code):
When the Shell's "Alphabet" (Components) and "Grammar" (Shared Actions) are complete, adding `App #101` looks like this:
1.  **Server side:** Add the new ID to the `module_registry` (Remote Config).
2.  **Server side:** Update the `dashboard` SDUI schema to include a new icon/action (CMS update).
3.  **Result:** The user sees the new app, taps it, and it renders + functions perfectly without **a single native build or deployment** of the Super App Shell.

---

## Appendix: Reference JSON Schemas

### A. Master Configuration (`/master_config`)
The root configuration that defines the entire app environment.

```json
{
  "theme": { "primaryColor": "#00ff5e", "secondaryColor": "#1A1A1A" },
  "central_config": { 
    "url": "https://central-api.kumuni.com", 
    "credentials": { "apiKey": "mock-central-api-key", "secret": "mock-central-secret" } 
  },
  "tenant_config": { 
    "id": "dev-tenant-123", 
    "url": "https://tenant-api.kumuni.com", 
    "credentials": { "apiKey": "mock-tenant-api-key", "secret": "mock-tenant-secret" } 
  },
  "module_registry": [
    {
      "id": "shell",
      "name": "Kumuni Shell",
      "type": "sdui",
      "entry_url": "",
      "permissions": ["*"]
    },
    {
      "id": "calculator",
      "name": "Calculator",
      "type": "remote_js",
      "entry_url": "http://localhost:8082/calculator.js",
      "permissions": ["*"]
    },
    {
      "id": "news",
      "name": "News Feed",
      "type": "web",
      "entry_url": "https://news.kumuni.com",
      "permissions": ["*"]
    }
  ],
  "cms_content": { "dashboard_news": [], "banners": [] }
}
```

### B. Dashboard SDUI (`/central/dashboard`)
The actual landing page schema currently loaded in the app.

```json
{
  "type": "container",
  "props": { "style": { "flex": 1, "backgroundColor": "#FFF" } },
  "children": [
    {
      "type": "scrollview",
      "props": { "style": { "flex": 1 }, "contentContainerStyle": { "paddingBottom": 120 } },
      "children": [
        {
          "type": "DashboardHeader",
          "props": {
            "searchPlaceholder": "Search services...",
            "userName": "",
            "userEmoji": "👤",
            "cityLogoUrl": "https://dev-supabase.ctoglobal.co/storage/v1/object/public/temp-images/Ph_seal_Mandaluyong_25.webp"
          }
        },
        {
          "type": "WalletCard",
          "props": {
            "balance": "PHP 12,450.00",
            "guestBackgroundImage": "https://dev-supabase.ctoglobal.co/storage/v1/object/public/miniapp-images/webp/Generated_Image_February_04_2026_-_8_23PM.webp",
            "registeredBackgroundImage": "https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=800&auto=format&fit=crop",
            "heroImageUrl": "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
            "registeredTitle": "Get verified for exclusive benefits!"
          }
        },
        {
          "type": "ServicesGrid",
          "props": {
            "services": [
              { "label": "Cedula (CTC)", "emoji": "📄", "action": "cedula" },
              { "label": "Solo Parent ID", "emoji": "🤰", "action": "solo" },
              { "label": "PWD ID", "emoji": "♿", "action": "pwd" },
              { "label": "Ayuda Online", "emoji": "💸", "action": "ayuda" },
              { "label": "Medical Assistance", "emoji": "❤️", "action": "medical" },
              { "label": "Financial Assistance", "emoji": "💵", "action": "finance" },
              { "label": "Educational Assistance", "emoji": "🎓", "action": "edu" },
              { "label": "More", "emoji": "▦", "action": "more" }
            ]
          }
        },
        { "type": "SectionDivider", "props": {} },
        {
          "type": "BusinessSection",
          "props": {
            "title": "LGU for business",
            "subtitle": "Permits and requirements for your business",
            "items": [
              {
                "title": "Building Permit",
                "description": "Get your building permit hassle-free. Apply online today!",
                "imageUrl": "https://dev-supabase.ctoglobal.co/storage/v1/object/public/miniapp-images/webp/Generated_Image_February_04_2026_-_8_20PM.webp",
                "action": "biz_building"
              },
              {
                "title": "Real Property Tax",
                "description": "Settle your property taxes online. Avoid penalties and long lines.",
                "imageUrl": "https://dev-supabase.ctoglobal.co/storage/v1/object/public/miniapp-images/webp/Generated%20Image%20February%2005,%202026%20-%208_34AM.webp",
                "action": "biz_tax"
              },
              {
                "title": "Mayor's Permit",
                "description": "Apply for a Mayor's Permit in just a few clicks. Start your application now!",
                "imageUrl": "https://dev-supabase.ctoglobal.co/storage/v1/object/public/miniapp-images/webp/Generated%20Image%20February%2005,%202026%20-%208_35AM.webp",
                "action": "biz_mayor"
              }
            ]
          }
        },
        { "type": "SectionDivider", "props": {} },
        {
          "type": "GenericGridSection",
          "props": {
            "title": "Discover things you'd love",
            "subtitle": "All your financial needs, all in one place.",
            "showMoreLabel": "Show more",
            "items": [
              {
                "title": "Buy now, Pay later",
                "description": "Flexible payment terms",
                "imageUrl": "https://dev-supabase.ctoglobal.co/storage/v1/object/public/temp-images/buy_now_pay_later_400x300.webp",
                "action": "discover_bnpl"
              },
              {
                "title": "Business Loan",
                "description": "Quick approval, low rates",
                "imageUrl": "https://dev-supabase.ctoglobal.co/storage/v1/object/public/temp-images/business_loan_400x300.webp",
                "action": "discover_loan"
              },
              {
                "title": "Business Protection",
                "description": "Protect your investment",
                "imageUrl": "https://dev-supabase.ctoglobal.co/storage/v1/object/public/temp-images/business_protection_400x300.webp",
                "action": "discover_protection"
              }
            ]
          }
        },
        { "type": "SectionDivider", "props": {} },
        {
          "type": "SuppliersSection",
          "props": {
            "title": "Direct from Suppliers",
            "subtitle": "Wholesale prices for your business",
            "heroImage": "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&h=400",
            "items": [
              {
                "name": "Unilever",
                "rating": "4.8",
                "category": "Beauty & Personal Care",
                "description": "Dove, Knorr, Breyers, at iba pa",
                "logoUrl": "https://dev-supabase.ctoglobal.co/storage/v1/object/public/temp-images/Unilever.svg_271x300.webp",
                "badgeText": "Wholesale prices",
                "badgeColor": "#00D1FF",
                "usps": [
                  { "icon": "📦", "text": "Bulk discounts" },
                  { "icon": "🚚", "text": "Free delivery" },
                  { "icon": "🕙", "text": "Delivery: 1-2 days" }
                ],
                "action": "supplier_unilever"
              }
            ]
          }
        },
        { "type": "SectionDivider", "props": {} },
        {
          "type": "CommunitySection",
          "props": {
            "title": "Your Community",
            "subtitle": "Connect with fellow entrepreneurs",
            "items": [
              { "title": "Sari-Sari Network", "description": "For store owners", "imageUrl": "...", "action": "community_sarisari" },
              { "title": "Freelancer Hub", "description": "For online workers", "imageUrl": "...", "action": "community_freelancer" }
            ]
          }
        },
        { "type": "SectionDivider", "props": {} },
        {
          "type": "EngagementSection",
          "props": {
            "title": "Engagement",
            "subtitle": "Opportunities and rewards",
            "items": [
              { "title": "Referral Bonus", "description": "Kumita ng P100 kada kaibigan", "backgroundColor": "#FFE4F2", "imageUrl": "...", "action": "engage_referral" }
            ]
          }
        },
        { "type": "SectionDivider", "props": {} },
        {
          "type": "CommunitySupportCard",
          "props": {
            "title": "Support Your Community",
            "subtitle": "Every purchase helps strengthen local businesses and creates jobs in your neighborhood.",
            "primaryAction": { "label": "Sign up now", "action": "registration" },
            "secondaryAction": { "label": "Learn More", "action": "learn_community" }
          }
        }
      ]
    }
  ]
}
```

### C. Marketplace SDUI (`/central/marketplace`)
The actual marketplace schema currently loaded in the app.

```json
{
  "type": "scrollview",
  "props": { "style": { "flex": 1, "backgroundColor": "#FFF" }, "contentContainerStyle": { "paddingBottom": 120 } },
  "children": [
    { "type": "MarketplaceHeader", "props": {} },
    {
      "type": "CategoryCarousel",
      "props": {
        "title": "Top Categories",
        "categories": [
          { "label": "Food", "icon": "🍲" },
          { "label": "Beauty", "icon": "💄" },
          { "label": "Retail", "icon": "🛒" },
          { "label": "Services", "icon": "🔧" },
          { "label": "Auto", "icon": "🚗" },
          { "label": "Café", "icon": "☕" }
        ]
      }
    },
    {
      "type": "ShopCardCarousel",
      "props": {
        "shops": [
          {
            "name": "Mang Tony's Auto Repair",
            "category": "Motorcycle & car repair",
            "rating": "4.8",
            "reviews": "314",
            "distance": "0.05 km",
            "isOpen": true,
            "statusText": "By appointment",
            "priceRange": "200 - 2,000",
            "deliveryTime": "10-15 min",
            "imageUrl": "https://dev-supabase.ctoglobal.co/storage/v1/object/public/temp-images/Mang_Tony_Auto_Repair.webp",
            "action": "shop_tony"
          },
          {
            "name": "Lola Carmen's Tindahan",
            "category": "Groceries & household items",
            "rating": "4.8",
            "reviews": "314",
            "distance": "0.18 km",
            "isOpen": true,
            "statusText": "Open 24/7",
            "priceRange": "30-150",
            "deliveryTime": "15-25 min",
            "imageUrl": "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&h=300",
            "action": "shop_carmen"
          },
          {
            "name": "Ate Lucy's Halo-Halo",
            "category": "Halo-halo & Filipino desserts",
            "rating": "4.8",
            "reviews": "314",
            "distance": "0.18 km",
            "isOpen": true,
            "statusText": "Open 10 AM - 5 PM",
            "priceRange": "30-150",
            "deliveryTime": "15-25 min",
            "imageUrl": "https://dev-supabase.ctoglobal.co/storage/v1/object/public/temp-images/halohalo_400x300.webp",
            "action": "shop_lucy"
          }
        ]
      }
    },
    {
      "type": "PromosSection",
      "props": {
        "title": "Running Promos",
        "badge": "Hot Deals!",
        "promos": [
          {
            "shopName": "Nanay's Sari-Sari Store",
            "subtitle": "Daily essentials & snacks",
            "offerText": "20% OFF",
            "highlightText": "20% OFF sa lahat ng snacks!",
            "validUntil": "12.30.2025",
            "imageUrl": "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&h=300",
            "action": "promo_nanay"
          }
        ]
      }
    },
    {
      "type": "FeaturedSection",
      "props": {
        "title": "Featured Business",
        "shops": [
          {
            "name": "Aling Rosa's Karinderya",
            "category": "Home-cooked Filipino meals",
            "rating": "4.9",
            "reviews": "314",
            "distance": "0.2 km",
            "serviceInfo": "15-25 min",
            "isWalkIn": false,
            "priceRange": "30 - 150",
            "imageUrl": "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=400&h=300",
            "isOpen": true,
            "action": "shop_rosa"
          }
        ]
      }
    },
    {
      "type": "TrustSection",
      "props": {
        "title": "Why Trust Kumuni Marketplace",
        "items": [
          {
            "label": "Verified Businesses",
            "imageUrl": "https://img.icons8.com/isometric/512/checked-shield.png"
          },
          {
            "label": "Community Reviews",
            "imageUrl": "https://img.icons8.com/isometric/512/star.png"
          }
        ]
      }
    },
    {
      "type": "CommunitySupportCard",
      "props": {
        "title": "Support Your Community",
        "subtitle": "Every purchase helps strengthen local businesses and creates jobs in your neighborhood.",
        "primaryAction": { "label": "Become a Seller", "action": "seller_signup" },
        "secondaryAction": { "label": "Learn More", "action": "learn_community" }
      }
    }
  ]
}
```

### D. Example: Transactional SDUI App (Solo Parent Registration)
This example shows a registered app with restricted permissions and its corresponding form schema.

#### 1. Module Registry Entry
Note the restricted `permissions` that only allow access to specific endpoints.

```json
{
  "id": "solo_parent_reg",
  "name": "Solo Parent Registration",
  "type": "sdui",
  "entry_url": "https://tenant-api.kumuni.com/sdui/solo-parent-form",
  "permissions": [
    "/tenant/forms/solo-parent",
    "/tenant/upload/documents"
  ]
}
```

#### 2. Form SDUI Schema (`/tenant/sdui/solo-parent-form`)
A schema containing input fields and a submit action.

```json
{
  "type": "container",
  "props": { "style": { "padding": 20, "backgroundColor": "#FFF" } },
  "children": [
    { "type": "Text", "props": { "content": "Solo Parent Application", "style": { "fontSize": 20, "fontWeight": "bold" } } },
    { "type": "Input", "props": { "label": "Full Name", "placeholder": "Enter your full name", "name": "fullName" } },
    { "type": "Input", "props": { "label": "Number of Dependents", "keyboardType": "numeric", "name": "dependents" } },
    {
      "type": "Button",
      "props": {
        "label": "Submit Application",
        "action": "submit_form",
        "actionParams": {
          "moduleId": "solo_parent_reg",
          "endpoint": "/tenant/forms/solo-parent",
          "method": "POST"
        }
      }
    }
  ]
}
```

---

## 8. Lightweight Shell Philosophy

The Kumuni Shell is designed to be **thin and specialized**. As of the current implementation:
- **Source Code (src):** ~436 KB
- **Source Files:** ~50 files
- **Key Responsibility:** Orchestration, security, and standards, not implementation.

By keeping the Shell lightweight, we ensure:
1.  **Fast Cold Starts:** Less native code to initialize on boot.
2.  **Scalability:** Adding 100 mini-apps doesn't increase the Shell's bundle size; it only adds small entries to the `module_registry`.
3.  **Governance:** The Shell focuses on security (`KernelBridge`) and UI standards (`SDUIRenderer`), while modules handle the actual business logic.
4.  **Resilience:** Crashes in a dynamic module (especially `web` or `sdui`) are less likely to bring down the entire Shell.
