# Kumuni Super App - Feature Documentation

## Overview
Kumuni is a React Native "Super App" built on a Micro-kernel architecture using Re.Pack for Module Federation. The app enables dynamic loading of micro-apps and supports multiple user verification levels with appropriate access controls.

## Architecture

### Core Infrastructure
- **Bundler**: Re.Pack replacing Metro for Module Federation 2.0 support
- **Webpack Configuration**: `webpack.config.mjs` with Module Federation plugin
- **Project Structure**:
  - `src/kernel`: Host/Shell controlling bootstrapping, security, and bridge
  - `src/shared`: SDK containing shared UI, types, and KernelBridge
  - `src/modules`: Miniapps (calculator, wallet, etc.)

### Micro-kernel Architecture
- **Host/Shell**: Manages app lifecycle, security, and communication
- **Module Federation**: Enables dynamic loading of remote modules
- **Shared SDK**: Common components, utilities, and API abstractions

## User Management System

### Three User Verification Levels
1. **Guest**
   - No account required
   - Requests guest JWT from central backend on first app open
   - Access to public content and guest-enabled modules
   - Limited functionality

2. **Registered**
   - Account created but eKYC not completed
   - Access to additional modules beyond guest level
   - Profile management capabilities

3. **Verified**
   - Completed eKYC verification
   - Full access including financial services
   - Wallet creation and management

### User Level Transitions
- Seamless transitions between user levels
- Appropriate permission checks at each level
- Token management for different user states
- Guest JWT automatically requested from central backend on app start

## Dynamic Loading & Configuration

### Bootstrapper Service
- Fetches `master_config` from central backend
- Applies dynamic theming
- Loads registered modules based on configuration
- Handles CMS content loading

### Master Configuration Schema
```typescript
interface MasterConfig {
  theme: {
    primaryColor: string;
    secondaryColor: string;
    brandAssets?: string;
  };
  central_config: {
    url: string;
    credentials: {
      apiKey: string;
      secret: string;
    };
  };
  tenant_config: {
    url: string;
    credentials: {
      apiKey: string;
      secret: string;
    };
  };
  module_registry: ModuleRegistry[];
  cms_content: {
    dashboard_news: any[];
    banners: any[];
  };
}
```

## Security & Data Management

### Dual Backend Architecture
- **Central Backend**: Handles authentication and global finance
- **Tenant Backend**: Manages LGU-specific PII and storage
- **HttpBridge Security Rule**: Micro-apps forbidden from direct data access

### Two-Step Authentication Process
- **Token Request**: App requests JWT from central backend (guest/registered/verified) with tenant ID
- **Token Exchange**: Central JWT exchanged for tenant-specific JWT from tenant backend
- **Secure Access**: All tenant resources accessed using tenant-specific JWT
- **Consistent Flow**: Same process for guest, registered, and verified users
- **No Public Endpoints**: Prevents exposure of CMS content and other resources

### Tenant Isolation
- **Tenant ID Verification**: Each HTTP request includes tenant ID for validation
- **Request Filtering**: Backend rejects requests from mismatched tenants
- **Development Support**: Tenant ID configurable via .env during development
- **Production Deployment**: Each app compiled with unique tenant ID

### KernelBridge
- Enforces security rules preventing direct data access
- Routes requests to appropriate backend
- Implements secure postMessage communication for web modules
- Maintains separation of concerns

### Environment Configuration
- Sensitive data stored in `.env` file
- API endpoints and credentials managed externally
- No hardcoded sensitive information in source code

## App Initialization & UI

### Onboarding Screens
- **SDUI Implementation**: Server-driven UI approach for dynamic onboarding content
- **Three Screens**: Welcome, Services Access, and Digital Experience screens
- **Remote Fetching**: Onboarding content fetched from `/central/sdui/onboarding-slides`
- **Navigation Controls**: Previous, Next, Skip, and Get Started buttons
- **Pagination Dots**: Visual indicator of current screen position
- **Customizable Content**: Titles, descriptions, images, and background colors configurable via backend

### Intro Page
- **Dynamic Configuration**: Fetches app config from central backend `/central/app-config`
- **Customizable UI**: Background image and color scheme from API response
- **Section Navigation**: Interactive buttons for miniapps, news, promos, services, support
- **Theme Adaptation**: Dynamically updates app theme based on API color scheme

### Theme Consistency
- **SDUI Renderer**: Respects primary/secondary colors from app-config for UI elements
- **Remote Bundles**: Adapts UI components to match the app's theme colors
- **Web Views**: Injects theme colors into web content for consistent appearance
- **Dynamic Updates**: All UI elements update when theme changes via app-config

## Module Federation Support

### Multi-Format Micro-App Support
1. **Tenant-Managed Modules**
   - All micro-apps fetched from tenant backend
   - Only modules installed/enabled by tenant admin are available
   - Admin controls which modules are visible to users

2. **Remote JS Modules**
   - Dynamically loaded via Re.Pack
   - Full React Native component support

3. **SDUI (Server-Driven UI)**
   - JSON schema parsed into UI components
   - `RemoteRenderer` component handles dynamic UI rendering

4. **Web View Modules**
   - Secure web content integration
   - `SovereignWebView` with secure postMessage bridge

### Module Registry
- Dynamic module loading based on configuration
- Permission-based access control
- Type-specific rendering components

## Theming System

### Dynamic Theming
- Theme configuration fetched from backend
- Real-time theme application
- `ThemeProvider` context for global theme management
- Support for primary/secondary colors and brand assets

## API Integration

### Central API Client
- Authentication services
- Global finance data access
- Guest token management

### Tenant API Client
- LGU-specific data access
- User profile management
- File storage operations
- Public content access for guests

## Development Features

### Mock Interceptor
- Simulates backend API responses
- Provides sample master_config for development
- Handles onboarding slides requests (`/central/sdui/onboarding-slides`)
- Handles SDUI intro page requests (`/central/sdui/intro-page`)
- Enables testing without backend dependencies
- Environment-specific configuration

### Development Setup
- React Native environment
- TypeScript support
- ESLint and Prettier configuration
- Metro bundler replaced with Re.Pack

## Module Permissions

### Access Control Matrix
| Module | Guest | Registered | Verified |
|--------|-------|------------|----------|
| Calculator | ✅ | ✅ | ✅ |
| News Feed | ✅ | ✅ | ✅ |
| User Profile | ❌ | ✅ | ✅ |
| eKYC Verification | ❌ | ✅ | ✅ |
| Wallet | ❌ | ❌ | ✅ |

### Permission Types
- `guest`: Accessible to unregistered users
- `public`: Public content accessible to all
- `registered`: Available to registered users
- `verified`: Exclusive to verified users
- `financial`: Financial services for verified users

## SDUI (Server-Driven UI) System

### Overview
The app uses a comprehensive SDUI system that allows backend developers to define UI components and layouts through JSON schemas, eliminating the need for app updates when changing UI.

### Core SDUI Components

#### Atomic Components
- **container**: Flexible layout container with style support
- **scrollview**: Scrollable content area
- **text**: Text display with styling
- **heading**: Styled heading text
- **button**: Interactive button with action support
- **image**: Image display from URLs
- **icon**: Icon display supporting emojis, named icons, and unicode
- **text-input**: Text input fields
- **date-picker**: Date selection component

**Icon Component Usage:**
```json
{
  "type": "icon",
  "props": {
    "name": "shield",
    "size": 24,
    "color": "#000"
  }
}
```

**Supported Icon Formats:**
- **Emoji**: Direct emoji characters (e.g., "✍️", "🛡️")
- **Named Icons**: Built-in icon names (e.g., "shield", "lock", "edit", "sparkles")
- **Unicode**: Unicode format "unicode:U+XXXX" (e.g., "unicode:U+2713")
- **Future Support**: Placeholders for Ionicons, Material Icons, FontAwesome

**Common Named Icons:**
- UI: check, close, menu, home, user, settings, search, heart, star, arrows
- Features: shield, lock, key, edit, sparkles, lightning, fire, rocket, trophy
- Actions: bell, calendar, clock, location, camera, document, folder, share, link
- Communication: mail, phone, message, chat
- Status: info, warning, error, success
- Commerce: cart, wallet, credit-card, bank, chart, graph

#### Section Components
- **DashboardHeader**: User greeting and profile display
- **WalletCard**: Financial balance and transaction display
- **HeroBanner**: Promotional banner with images
- **ServicesGrid**: Grid layout for service icons
- **BusinessSection**: Business listings and cards
- **CategoryCarousel**: Horizontal scrolling categories
- **ShopCardCarousel**: Scrollable shop cards
- **PromosSection**: Promotional offers display
- **FeaturedSection**: Featured content showcase
- **OnboardingSlide**: Onboarding screen with progress indicators
- **AppWelcomeScreen**: Standardized miniapp welcome screen (new)

### Conditional Rendering with `visibleWhen`

Components support conditional visibility based on user authentication level:

```json
{
  "type": "button",
  "props": { "title": "Sign Up" },
  "visibleWhen": { "userLevel": ["guest"] },
  "action": { "type": "@register" }
}
```

**Supported User Levels:**
- `guest`: Unauthenticated users
- `registered`: Authenticated but not verified
- `verified`: Fully verified users

This enables a single schema to serve different user types, reducing duplication and maintenance overhead.

### AppWelcomeScreen Component

A standardized, semantic component for miniapp entry pages that provides a consistent welcome experience across all miniapps.

**Schema Example:**
```json
{
  "type": "AppWelcomeScreen",
  "props": {
    "heroImage": "https://example.com/hero.png",
    "logoIcon": "https://example.com/icon.png",
    "title": "Online Cedula",
    "welcomeMessage": "Welcome to Online Cedula",
    "description": "Apply for your Community Tax Certificate quickly and securely.",
    "features": [
      {
        "icon": "edit",
        "title": "Easy & Quick",
        "description": "Complete in just a few minutes"
      },
      {
        "icon": "shield",
        "title": "Secure & Private",
        "description": "Your data is encrypted and protected"
      }
    ],
    "requirements": [
      "Valid government-issued ID",
      "Proof of income or employment"
    ],
    "buttonText": "Get Started"
  },
  "action": {
    "type": "@pushPage",
    "params": { "pageId": "application_form" }
  },
  "visibleWhen": { "userLevel": ["registered", "verified"] }
}
```

**Features:**
- Hero image with floating brand card
- Feature list with icons and descriptions
- Optional requirements section
- Customizable action button
- Automatic user-level adaptation
- Consistent design across all miniapps
- **Built-in close button** (top-right) for returning to dashboard
- Safe area insets support for devices with notches

### Multi-Page SDUI Applications

SDUI supports multi-page applications with navigation:

```json
{
  "id": "cedula-app",
  "name": "Cedula Application",
  "pages": [
    {
      "id": "welcome",
      "title": "Welcome",
      "components": [...]
    },
    {
      "id": "application_form",
      "title": "Application",
      "components": [...]
    }
  ],
  "navigation": {
    "initialPageId": "welcome",
    "guestPageId": "welcome"
  }
}
```

**Navigation Actions:**
- `@pushPage`: Navigate to a new page (Params: `pageId`)
- `@popPage`: Go back to previous page
- `@register`: Trigger user registration
- `@submitForm`: Submit form data (Params: `endpoint`, `method`, `data`, `onSuccess`)
- `@toast`: Show a temporary notification (Params: `message`, `type`)
- `nav_home`: Return to dashboard

**Toast Action Types:**
- `success`: Green background with checkmark icon
- `error`: Red background with cross icon
- `warning`: Orange background with warning icon
- `info`: Blue background with info icon (default)

**Toast Usage Example:**
```json
{
  "type": "button",
  "props": { "title": "Show Notification" },
  "action": {
    "type": "@toast",
    "params": {
      "message": "Update successful!",
      "type": "success"
    }
  }
}
```

### MiniApp Navigation System

All miniapps automatically include:
- **Header with Navigation**: Back button (when applicable) and Close button
- **Automatic Hide**: Bottom navigation bar hides when viewing miniapps
- **Smooth Transitions**: Fade animations when entering/exiting miniapps
- **Conditional Display**: Header only shown for miniapps, not main dashboard views

### Page Transition Animations

The app implements smooth fade transitions using React Native's Animated API:
- **Fade Out**: 150ms when navigating away
- **Fade In**: 300ms when new content loads
- **Layout Animation**: Automatic layout changes for navigation bar
- **Native Performance**: Uses native driver for optimal performance

## Future Extensibility

### Scalable Architecture
- Easy addition of new micro-apps
- Flexible permission system
- Modular component architecture
- Standardized API contracts
- Semantic SDUI components for rapid development

### Integration Ready
- Multiple backend connection support
- Third-party service integration capability
- Analytics and monitoring hooks
- Push notification support framework
- Dynamic UI updates without app releases

---
*Document Version: 2.0*
*Last Updated: February 10, 2026*