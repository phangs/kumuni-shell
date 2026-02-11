# Kumuni Backend API Documentation

This document outlines the HTTP communication patterns between the Kumuni Shell and its backend services. 

## 🛡️ Global Security Headers
All requests to Central or Tenant backends include the following standard headers:

| Header | Value | Description |
| :--- | :--- | :--- |
| `Content-Type` | `application/json` | standard JSON format |
| `X-API-Key` | `<CENTRAL_OR_TENANT_API_KEY>` | Identifies the Kumuni Shell instance |
| `Authorization` | `Bearer <JWT_TOKEN>` | Provided after Guest or Registered login |

---

## 🏛️ 1. Central Backend
**Base URL**: `https://central-api.kumuni.com` (Default)
**Purpose**: Global Authentication, Global Finance, and Shared App Configuration.

### 🔑 Authentication Flow
#### **POST** `/auth/guest`
Generates a temporary session for unregistered users.
- **Request Body**: `{ "tenantId": "dev-tenant-123" }`
- **Expected Success Response**:
  ```json
  {
    "token": "mock-guest-token-xyz123",
    "expiresAt": "2026-02-12T...",
    "tenantId": "dev-tenant-123"
  }
  ```

#### **POST** `/auth/otp/send`
Requests an OTP code for mobile registration.
- **Request Body**: `{ "phoneNumber": "9876543210" }`
- **Expected Success Response**: `{ "success": true, "message": "OTP sent" }`

#### **POST** `/auth/otp/verify`
Exchanges an OTP for a Registered User JWT.
- **Request Body**: `{ "phoneNumber": "9876543210", "otp": "123456" }`
- **Expected Success Response**:
  ```json
  {
    "success": true,
    "token": "mock-registered-user-token-abc...",
    "user": { "id": "user_123", "phone": "9876543210", "level": "registered" }
  }
  ```

### 🖼️ UI & Content (SDUI)
#### **GET** `/central/dashboard`
Fetches the main dashboard layout.
- **Headers**: Standard + `Authorization: Bearer <TOKEN>`
- **Expected Response**: SDUI JSON (Container > Scrollview > Components)

#### **GET** `/central/marketplace`
Fetches the marketplace/discover layout.
- **Headers**: Standard + `Authorization: Bearer <TOKEN>`
- **Expected Response**: SDUI JSON formatted for Marketplace elements.

#### **GET** `/central/sdui/intro-page`
Initial landing page configuration.

---

## 🏘️ 2. Tenant Backend (LGU)
**Base URL**: `https://tenant-api.kumuni.com` (Default)
**Purpose**: LGU-specific PII storage, local forms, and local miniapp catalog.

### 🔐 Tenant Auth
#### **POST** `/auth/exchange-token`
Exchanges a Central JWT for a Tenant-specific JWT to access LGU database.
- **Headers**: Standard + `Authorization: Bearer <CENTRAL_TOKEN>`
- **Request Body**: `{}`
- **Expected Response**: `{ "success": true, "token": "mock-tenant-token-xyz" }`

### 📋 Services & Forms
#### **GET** `/miniapps/more`
Fetches the list of additional LGU services in the Drawer.
- **Expected Response**: 
  ```json
  {
    "success": true, 
    "data": [
      { "id": "permit", "label": "Permit", "icon": "URL", "action": "action_id" }
    ]
  }
  ```

#### **GET** `/tenant/sdui/solo-parent-form`
Fetches the SDUI schema for the Solo Parent application.
- **Expected Response**: SDUI Page JSON with Input fields, DatePickers, and Validation.

#### **POST** `/tenant/forms/solo-parent`
Submits application data for a Solo Parent ID.
- **Request Body**: Map of field IDs to values: `{ "firstName": "Juan", "lastName": "Dela Cruz", ... }`
- **Expected Response**: `{ "success": true, "message": "Reference ID: SP-XXXX" }`

#### **GET** `/tenant/sdui/cedula-app`
Fetches the multi-page SDUI flow for Cedula (CTC) application.

---

## ⚙️ 3. Initialization / Bootstrap
**URL**: `https://mock-api.example.com/master_config`
**Purpose**: First call made by the app to determine theme, backend URLs, and module permissions.

- **Method**: `GET`
- **Expected Response**:
  ```json
  {
    "theme": { "primaryColor": "#...", "secondaryColor": "#..." },
    "central_config": { "url": "...", "credentials": { "apiKey": "..." } },
    "tenant_config": { "id": "...", "url": "..." },
    "module_registry": [ { "id": "shell", "permissions": ["*"] } ]
  }
  ```
