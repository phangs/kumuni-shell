# Kumuni Backend API Documentation

This document outlines the exact HTTP communication patterns and JSON responses expected by the Kumuni Super App. **Backend developers must ensure their API returns the specific JSON structures defined below.**

## 🛡️ Global Security Headers
All requests to Central or Tenant backends include:

| Header | Value | Description |
| :--- | :--- | :--- |
| `Content-Type` | `application/json` | Standards JSON format |
| `X-API-Key` | `<CENTRAL_OR_TENANT_API_KEY>` | API key for authentication |
| `Authorization` | `Bearer <JWT_TOKEN>` | User session token (Guest or Registered) |

---

## 🏛️ 1. Central Backend
**Base URL**: `https://central-api.kumuni.com`

### ⚙️ System Initialization (Bootstrap)
**GET** `/master_config`
This is the first call made by the app to determine theme, backend URLs, credentials, and module permissions.
- **Expected Response**:
```json
{
  "theme": { "primaryColor": "#00ff5e", "secondaryColor": "#1A1A1A" },
  "central_config": { 
    "url": "https://central-api.kumuni.com", 
    "credentials": { "apiKey": "...", "secret": "..." } 
  },
  "tenant_config": { 
    "id": "dev-tenant-123", 
    "url": "https://tenant-api.kumuni.com", 
    "credentials": { "apiKey": "...", "secret": "..." } 
  },
  "module_registry": [
    { "id": "shell", "name": "Kumuni Shell", "type": "sdui", "permissions": ["*"] },
    { "id": "cedula", "name": "Cedula Application", "type": "sdui", "entry_url": "...", "permissions": ["/mobile/submission"] }
  ],
  "cms_content": { "dashboard_news": [], "banners": [] }
}
```

### 🔑 Authentication
#### **POST** `/auth/guest`
- **Request Body**: `{ "tenantId": "dev-tenant-123" }`
- **Response**:
```json
{
  "token": "mock-guest-token-abc123xyz",
  "expiresAt": "2026-02-12T06:44:27.123Z",
  "tenantId": "dev-tenant-123"
}
```

#### **POST** `/auth/otp/send`
- **Request Body**: `{ "phoneNumber": "9876543210" }`
- **Response**:
```json
{
  "success": true,
  "message": "OTP sent"
}
```

#### **POST** `/auth/otp/verify`
- **Request Body**: `{ "phoneNumber": "9876543210", "otp": "123456" }`
- **Response**:
```json
{
  "success": true,
  "token": "mock-registered-user-token-789def",
  "user": {
    "id": "user_123",
    "phone": "9876543210",
    "level": "registered"
  }
}
```

### 🖼️ UI Layouts (SDUI)
#### **GET** `/central/dashboard`
- **Response**:
```json
{
  "success": true,
  "data": {
    "type": "container",
    "styleMode": "fullscreen",
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
              "userName": "Juan",
              "userEmoji": "👋",
              "cityLogoUrl": "https://dev-supabase.ctoglobal.co/storage/v1/object/public/temp-images/Ph_seal_Mandaluyong_25.webp"
            }
          },
          {
            "type": "WalletCard",
            "props": {
              "balance": "PHP 12,450.00",
              "guestBackgroundImage": "https://dev-supabase.ctoglobal.co/storage/v1/object/public/miniapp-images/webp/Generated_Image_February_04_2026_-_8_23PM.webp"
            }
          },
          {
            "type": "ServicesGrid",
            "props": {
              "services": [
                { "label": "Cedula (CTC)", "icon": "URL", "action": "cedula" },
                { "label": "More", "icon": "URL", "action": "more" }
              ]
            }
          }
        ]
      }
    ]
  }
}
```

#### **GET** `/central/marketplace`
- **Response**:
```json
{
  "success": true,
  "data": {
    "type": "scrollview",
    "styleMode": "fullscreen",
    "props": { "style": { "flex": 1, "backgroundColor": "#FFF" }, "contentContainerStyle": { "paddingBottom": 120 } },
    "children": [
      { "type": "MarketplaceHeader", "props": {} },
      {
        "type": "CategoryCarousel",
        "props": {
          "title": "Top Categories",
          "categories": [{ "label": "Food", "icon": "🍲" }]
        }
      }
    ]
  }
}
```

---

## 🏘️ 2. Tenant Backend (LGU)
**Base URL**: `https://tenant-api.kumuni.com`

### 📋 Services Catalog
#### **GET** `/miniapps/more`
- **Response**:
```json
{
  "success": true,
  "data": [
    { "id": "permit", "label": "Business Permit", "icon": "SVG_URL", "action": "biz_permit" },
    { "id": "cedula", "label": "Cedula (CTC)", "icon": "SVG_URL", "action": "cedula" }
  ]
}
```

### 📝 Solo Parent Application
#### **GET** `/tenant/sdui/solo-parent-form`
- **Response**:
```json
{
  "success": true,
  "data": {
    "type": "container",
    "props": { "style": { "padding": 20, "backgroundColor": "#FFF", "flex": 1 } },
    "children": [
      { "type": "Text", "props": { "content": "Solo Parent Application", "style": { "fontSize": 24 } } },
      { "type": "Input", "props": { "label": "Full Name", "name": "fullName" } },
      { "type": "Button", "props": { "label": "Submit", "variant": "primary" }, "action": "submit_form" }
    ]
  }
}
```

#### **POST** `/tenant/forms/solo-parent`
- **Request Body**: `{ "fullName": "...", "dependents": "..." }`
- **Response**:
```json
{
  "success": true,
  "message": "Application Submitted Successfully! Reference ID: SP-A1B2C3"
}
```

