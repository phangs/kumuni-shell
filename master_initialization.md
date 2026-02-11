Task: Initialize a React Native "Super App" project named Kumuni based on a Micro-kernel architecture using Re.Pack for Module Federation.

1. Core Infrastructure & Bundling:

Bundler: Replace Metro with Re.Pack. Configure webpack.config.mjs for Module Federation 2.0.

Project Structure:

src/kernel: The Host/Shell. Controls bootstrapping, security, and the bridge.

src/shared: The SDK. Contains shared UI, types, and the KernelBridge.

src/modules: The Miniapps (e.g., calculator, wallet).

2. Dynamic Remote Bootstrapping:

Create a Bootstrapper in src/kernel/services/Bootstrapper.ts.

Logic: On splash screen, fetch a master_config JSON from the Central Backend (Mock first).

Config Schema: Must include:

theme: Primary/Secondary colors, brand assets.

tenant_config: URL and credentials for the specific LGU's Supabase instance.

module_registry: Array of objects: { id, name, type: 'remote_js' | 'sdui' | 'web', entry_url, permissions }.

cms_content: Initial dashboard news and banners.

3. Dual-Supabase & The Proxy Bridge:

Central Client: Setup for Auth and Global Finance (e.g., centralClient.ts).

Tenant Client: Setup for LGU-specific PII/Storage (e.g., tenantClient.ts).

The HttpBridge Security Rule: > - Implement KernelBridge.request() in @shared/api.

Constraint: Micro-apps are strictly forbidden from importing @supabase/supabase-js or axios/fetch directly for tenant data.

Mechanism: Micro-apps send a request to the Bridge; the Kernel intercepts it, validates permissions, attaches the correct Tenant JWT, and executes the call.

4. Multi-Format Micro-app Support:

Remote JS: Configure Re.Pack to dynamically load modules from the entry_url in the registry.

SDUI: Create a RemoteRenderer component to parse JSON schemas into UI.

Web View: Create a SovereignWebView component with a secure postMessage bridge for H5 modules.

5. Dynamic Theming:

Use a ThemeProvider that re-renders the app's styles globally once the theme data is fetched by the Bootstrapper.

Final Output Requirements:

Provide a clean folder structure.

Setup the MockInterceptor to return a sample master_config so I can see the theme and modules change immediately upon run.