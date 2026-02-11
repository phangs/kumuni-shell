// src/kernel/utils/MockInterceptor.ts - updated
// src/kernel/utils/MockInterceptor.ts
import {
  CENTRAL_API_URL as ENV_CENTRAL_API_URL,
  CENTRAL_API_KEY as ENV_CENTRAL_API_KEY,
  CENTRAL_API_SECRET as ENV_CENTRAL_API_SECRET,
  TENANT_API_URL as ENV_TENANT_API_URL,
  TENANT_API_KEY as ENV_TENANT_API_KEY,
  TENANT_API_SECRET as ENV_TENANT_API_SECRET,
  TENANT_ID as ENV_TENANT_ID
} from '@env';

const CENTRAL_API_URL = ENV_CENTRAL_API_URL || 'https://central-api.kumuni.com';
const CENTRAL_API_KEY = ENV_CENTRAL_API_KEY || 'mock-central-api-key';
const CENTRAL_API_SECRET = ENV_CENTRAL_API_SECRET || 'mock-central-secret';
const TENANT_API_URL = ENV_TENANT_API_URL || 'https://tenant-api.kumuni.com';
const TENANT_API_KEY = ENV_TENANT_API_KEY || 'mock-tenant-api-key';
const TENANT_API_SECRET = ENV_TENANT_API_SECRET || 'mock-tenant-secret';
const TENANT_ID = ENV_TENANT_ID || 'dev-tenant-123';

export class MockInterceptor {
  private static enabled = false;

  static enable() {
    if (this.enabled) return;
    this.enabled = true;

    try {
      console.log('MockInterceptor: Attempting to enable...');
      if (typeof global !== 'undefined' && global.fetch) {
        const originalFetch = global.fetch;

        global.fetch = async (...args: any[]) => {
          try {
            const url = args[0];
            const options = args[1];

            if (typeof url === 'string' && url.includes('master_config')) {
              return this.getMockMasterConfigResponse();
            }


            if (typeof url === 'string' && url.includes('/central/sdui/intro-page')) {
              return this.getMockSDUIIntroPageResponse();
            }

            if (typeof url === 'string' && url.includes('/central/sdui/onboarding-slides')) {
              return this.getMockOnboardingSlidesResponse();
            }

            if (typeof url === 'string' && url.includes('/central/dashboard')) {
              return this.fetchMockDashboardResponse();
            }

            if (typeof url === 'string' && url.includes('/central/marketplace')) {
              return this.getMockMarketplaceResponse();
            }

            if (typeof url === 'string' && url.includes('/central/help')) {
              return this.getMockHelpResponse();
            }

            if (typeof url === 'string' && url.includes('/central/registration')) {
              return this.getMockRegistrationResponse();
            }

            if (typeof url === 'string' && url.includes('/tenant/sdui/solo-parent-form')) {
              return this.getSoloParentFormSchema();
            }

            if (typeof url === 'string' && CENTRAL_API_URL && url.startsWith(CENTRAL_API_URL)) {
              return this.handleCentralApiRequest(url, options);
            }

            if (typeof url === 'string' && TENANT_API_URL && url.startsWith(TENANT_API_URL)) {
              return this.handleTenantApiRequest(url, options);
            }

            return originalFetch.apply(global, args);
          } catch (err) {
            console.error('MockInterceptor fetch error:', err);
            throw err;
          }
        };
      }
    } catch (e) {
      console.error('Failed to enable MockInterceptor:', e);
    }
  }

  private static handleCentralApiRequest(url: string, options: any): Promise<Response> {
    const endpoint = url.replace(CENTRAL_API_URL || '', '');
    switch (endpoint) {
      case '/auth/guest':
        return Promise.resolve(new Response(
          JSON.stringify({
            token: 'mock-guest-token-' + Math.random().toString(36).substring(2, 10),
            expiresAt: new Date(Date.now() + 86400000).toISOString(),
            tenantId: TENANT_ID
          }),
          { status: 200, headers: { 'Content-Type': 'application/json' } }
        ));
      case '/auth/otp/send':
        return Promise.resolve(new Response(JSON.stringify({ success: true, message: 'OTP sent' }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      case '/auth/otp/verify':
        return Promise.resolve(new Response(JSON.stringify({
          success: true,
          token: 'mock-registered-user-token-' + Math.random().toString(36).substring(2, 10),
          user: { id: 'user_123', phone: '9876543210', level: 'registered' }
        }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
      default:
        return Promise.resolve(new Response(JSON.stringify({ success: true, data: {} }), { status: 200 }));
    }
  }

  private static handleTenantApiRequest(url: string, options: any): Promise<Response> {
    const endpoint = url.replace(TENANT_API_URL || '', '');
    if (endpoint === '/miniapps/more') {
      const data = [
        { id: 'business_permit', label: 'Business Permit', icon: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/app-icons/miniapps/2026/mini_cedula.svg', action: 'biz_permit' },
        { id: 'health_cert', label: 'Health Certificate', icon: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/app-icons/miniapps/2026/mini_medical.svg', action: 'health_cert' },
        { id: 'police_clearance', label: 'Police Clearance', icon: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/app-icons/miniapps/2026/mini_pwd.svg', action: 'police' },
        { id: 'fire_safety', label: 'Fire Safety', icon: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/app-icons/miniapps/2026/mini_ayuda.svg', action: 'fire' },
        { id: 'zoning_permit', label: 'Zoning Permit', icon: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/app-icons/miniapps/2026/mini_solo_parent.svg', action: 'zoning' },
        { id: 'sanitary_permit', label: 'Sanitary Permit', icon: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/app-icons/miniapps/2026/mini_cedula.svg', action: 'sanitary' },
      ];
      return Promise.resolve(new Response(JSON.stringify({ success: true, data }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    if (endpoint === '/device/identity') {
      return Promise.resolve(new Response(JSON.stringify({ success: true, data: { phoneNumber: '9876543210' } }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    if (endpoint === '/auth/exchange-token') {
      return Promise.resolve(new Response(JSON.stringify({
        success: true,
        token: 'mock-tenant-token-' + Math.random().toString(36).substring(2, 10),
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    if (endpoint === '/tenant/forms/solo-parent' && options?.method === 'POST') {
      console.log('MockInterceptor: Received Solo Parent Application Data:', options.body);
      return Promise.resolve(new Response(JSON.stringify({
        success: true,
        message: 'Application Submitted Successfully! Reference ID: SP-' + Math.random().toString(36).substring(2, 8).toUpperCase()
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    if (endpoint === '/tenant/sdui/cedula-app') {
      return this.getMockCedulaAppResponse();
    }
    if (endpoint === '/mobile/submission' && options?.method === 'POST') {
      console.log('MockInterceptor: Received Cedula Submission:', options.body);
      return Promise.resolve(new Response(JSON.stringify({
        success: true,
        message: 'Cedula Application Submitted Successfully!'
      }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
    }
    return Promise.resolve(new Response(JSON.stringify({ success: true, data: {} }), { status: 200 }));
  }

  private static fetchMockDashboardResponse(): Promise<Response> {
    const data = {
      type: 'container',
      styleMode: 'fullscreen',
      props: { style: { flex: 1, backgroundColor: '#FFF' } },
      children: [
        {
          type: 'scrollview',
          props: { style: { flex: 1 }, contentContainerStyle: { paddingBottom: 120 } },
          children: [
            {
              type: 'DashboardHeader',
              props: {
                searchPlaceholder: 'Search services...',
                userName: '',
                userEmoji: '�',
                cityLogoUrl: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/temp-images/Ph_seal_Mandaluyong_25.webp'
              }
            },
            {
              type: 'WalletCard',
              props: {
                balance: 'PHP 12,450.00',
                guestBackgroundImage: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/miniapp-images/webp/Generated_Image_February_04_2026_-_8_23PM.webp',
                registeredBackgroundImage: 'https://images.unsplash.com/photo-1639322537228-f710d846310a?q=80&w=800&auto=format&fit=crop',
                heroImageUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop',
                registeredTitle: 'Get verified for exclusive benefits!'
              }
            },
            {
              type: 'ServicesGrid',
              props: {
                services: [
                  { label: 'Cedula (CTC)', icon: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/app-icons/miniapps/2026/mini_cedula.svg', action: 'cedula' },
                  { label: 'Solo Parent ID', icon: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/app-icons/miniapps/2026/mini_solo-parent.svg', action: 'solo' },
                  { label: 'PWD ID', icon: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/app-icons/miniapps/2026/mini_pwd-id.svg', action: 'pwd' },
                  { label: 'Ayuda Online', icon: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/app-icons/miniapps/2026/mini_ayuda.svg', action: 'ayuda' },
                  { label: 'Medical Assistance', icon: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/app-icons/miniapps/2026/mini_medical-assistance.svg', action: 'medical' },
                  { label: 'Financial Assistance', icon: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/app-icons/miniapps/2026/mini_financial-assistance.svg', action: 'finance' },
                  { label: 'Educational Assistance', icon: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/app-icons/miniapps/2026/mini_educational-assistance.svg', action: 'edu' },
                  { label: 'More', icon: 'mini_more', action: 'more' },
                ]
              }
            },
            { type: 'SectionDivider', props: {} },
            {
              type: 'BusinessSection',
              props: {
                title: 'LGU for business',
                subtitle: 'Permits and requirements for your business',
                items: [
                  {
                    title: 'Building Permit',
                    description: 'Get your building permit hassle-free. Apply online today!',
                    imageUrl: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/miniapp-images/webp/Generated_Image_February_04_2026_-_8_20PM.webp',
                    action: 'biz_building'
                  },
                  {
                    title: 'Real Property Tax',
                    description: 'Settle your property taxes online. Avoid penalties and long lines.',
                    imageUrl: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/miniapp-images/webp/Generated%20Image%20February%2005,%202026%20-%208_34AM.webp',
                    action: 'biz_tax'
                  },
                  {
                    title: "Mayor's Permit",
                    description: "Apply for a Mayor's Permit in just a few clicks. Start your application now!",
                    imageUrl: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/miniapp-images/webp/Generated%20Image%20February%2005,%202026%20-%208_35AM.webp',
                    action: 'biz_mayor'
                  }
                ]
              }
            },
            { type: 'SectionDivider', props: {} },
            {
              type: 'GenericGridSection',
              props: {
                title: "Discover things you'd love",
                subtitle: "All your financial needs, all in one place.",
                showMoreLabel: "Show more",
                items: [
                  {
                    title: 'Buy now, Pay later',
                    description: 'Flexible payment terms',
                    imageUrl: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/temp-images/buy_now_pay_later_400x300.webp',
                    action: 'discover_bnpl'
                  },
                  {
                    title: 'Business Loan',
                    description: 'Quick approval, low rates',
                    imageUrl: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/temp-images/business_loan_400x300.webp',
                    action: 'discover_loan'
                  },
                  {
                    title: "Business Protection",
                    description: "Protect your investment",
                    imageUrl: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/temp-images/business_protection_400x300.webp',
                    action: 'discover_protection'
                  }
                ]
              }
            },
            { type: 'SectionDivider', props: {} },
            {
              type: 'SuppliersSection',
              props: {
                title: "Direct from Suppliers",
                subtitle: "Wholesale prices for your business",
                heroImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=800&h=400",
                items: [
                  {
                    name: 'Unilever',
                    rating: '4.8',
                    category: 'Beauty & Personal Care',
                    description: 'Dove, Knorr, Breyers, at iba pa',
                    logoUrl: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/temp-images/Unilever.svg_271x300.webp',
                    badgeText: 'Wholesale prices',
                    badgeColor: '#00D1FF',
                    usps: [
                      { icon: '📦', text: 'Bulk discounts' },
                      { icon: '🚚', text: 'Free delivery' },
                      { icon: '🕙', text: 'Delivery: 1-2 days' }
                    ],
                    action: 'supplier_unilever'
                  },
                  {
                    name: 'P&G',
                    rating: '4.9',
                    category: 'Household essentials',
                    description: 'Tide, Pampers, Head & Shoulders',
                    logoUrl: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/temp-images/PG-Symbol_1_400x225.webp',
                    badgeText: 'Trusted partner',
                    badgeColor: '#4C6FFF',
                    usps: [
                      { icon: '👑', text: 'Premium brands' },
                      { icon: '📞', text: '24/7 support' },
                      { icon: '🕙', text: 'Delivery: 1-3 days' }
                    ],
                    action: 'supplier_pg'
                  },
                  {
                    name: 'MerryMart',
                    rating: '4.7',
                    category: 'Grocery wholesale',
                    description: 'Fresh goods, pantry items',
                    logoUrl: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/temp-images/merrymart_1_400x104.webp',
                    badgeText: 'Same day delivery',
                    badgeColor: '#FF6B00',
                    usps: [
                      { icon: '🥬', text: 'Fresh products' },
                      { icon: '📍', text: 'Local sourcing' },
                      { icon: '🕙', text: 'Delivery: Same day' }
                    ],
                    action: 'supplier_merrymart'
                  },
                  {
                    name: 'Puregold',
                    rating: '4.6',
                    category: 'Retail wholesale',
                    description: 'Fast-moving consumer goods',
                    logoUrl: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/temp-images/puregold_1_400x71.webp',
                    badgeText: 'Volume discounts',
                    badgeColor: '#A855F7',
                    usps: [
                      { icon: '🌐', text: 'Nationwide coverage' },
                      { icon: '💸', text: 'Flexible payment' },
                      { icon: '🕙', text: 'Delivery: 2-3 days' }
                    ],
                    action: 'supplier_puregold'
                  },
                  {
                    name: 'SuySing',
                    rating: '4.5',
                    category: 'Commercial goods',
                    description: 'Office supplies, equipment',
                    logoUrl: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/temp-images/suysing_400x140.webp',
                    badgeText: 'Trade prices',
                    badgeColor: '#EAB308',
                    usps: [
                      { icon: '💼', text: 'B2B specialist' },
                      { icon: '📦', text: 'Custom orders' },
                      { icon: '🕙', text: 'Delivery: 3-5 days' }
                    ],
                    action: 'supplier_suysing'
                  }
                ]
              }
            },
            { type: 'SectionDivider', props: {} },
            {
              type: 'CommunitySection',
              props: {
                title: "Your Community",
                subtitle: "Connect with fellow entrepreneurs",
                items: [
                  {
                    title: 'Sari-Sari Network',
                    description: 'For store owners',
                    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&h=250',
                    action: 'community_sarisari'
                  },
                  {
                    title: 'Freelancer Hub',
                    description: 'For online workers',
                    imageUrl: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&h=250',
                    action: 'community_freelancer'
                  },
                  {
                    title: 'Beauty Salon Coop',
                    description: 'For salon owners',
                    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?q=80&w=400&h=250',
                    action: 'community_salon'
                  },
                  {
                    title: 'Koop Samahan',
                    description: 'For cooperatives',
                    imageUrl: 'https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=400&h=250',
                    action: 'community_koop'
                  }
                ]
              }
            },
            { type: 'SectionDivider', props: {} },
            {
              type: 'EngagementSection',
              props: {
                title: "Engagement",
                subtitle: "Opportunities and rewards",
                items: [
                  {
                    title: 'Referral Bonus',
                    description: 'Kumita ng P100 kada kaibigan',
                    backgroundColor: '#FFE4F2',
                    imageUrl: 'https://img.icons8.com/isometric/512/gift.png',
                    action: 'engage_referral'
                  },
                  {
                    title: 'Daily Streak',
                    description: '5 araw na tuloy-tuloy na benta',
                    backgroundColor: '#FFF2E0',
                    imageUrl: 'https://img.icons8.com/isometric/512/bullseye.png',
                    action: 'engage_streak'
                  },
                  {
                    title: 'Partner Promos',
                    description: 'Hanggang 25% off sa bills',
                    backgroundColor: '#F3E8FF',
                    imageUrl: 'https://img.icons8.com/isometric/512/sale.png',
                    action: 'engage_promos'
                  },
                  {
                    title: 'MSME Workshop',
                    description: 'Free business training bukas',
                    backgroundColor: '#E0F2FF',
                    imageUrl: 'https://img.icons8.com/isometric/512/calendar.png',
                    action: 'engage_workshop'
                  }
                ]
              }
            },
            { type: 'SectionDivider', props: {} },
            {
              type: 'CommunitySupportCard',
              props: {
                title: 'Support Your Community',
                subtitle: 'Every purchase helps strengthen local businesses and creates jobs in your neighborhood.',
                primaryAction: { label: 'Sign up now', action: 'registration' },
                secondaryAction: { label: 'Learn More', action: 'learn_community' }
              }
            }
          ]
        },
      ]
    };
    return Promise.resolve(new Response(JSON.stringify({ success: true, data }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  }

  private static getMockMarketplaceResponse(): Promise<Response> {
    const data = {
      type: 'scrollview',
      styleMode: 'fullscreen',
      props: { style: { flex: 1, backgroundColor: '#FFF' }, contentContainerStyle: { paddingBottom: 120 } },
      children: [
        { type: 'MarketplaceHeader', props: {} },
        {
          type: 'CategoryCarousel',
          props: {
            title: 'Top Categories',
            categories: [
              { label: 'Food', icon: '🍲' },
              { label: 'Beauty', icon: '💄' },
              { label: 'Retail', icon: '🛒' },
              { label: 'Services', icon: '🔧' },
              { label: 'Auto', icon: '🚗' },
              { label: 'Café', icon: '☕' },
            ]
          }
        },
        {
          type: 'ShopCardCarousel',
          props: {
            shops: [
              {
                name: "Mang Tony's Auto Repair",
                category: "Motorcycle & car repair",
                rating: "4.8",
                reviews: "314",
                distance: "0.05 km",
                isOpen: true,
                statusText: "By appointment",
                priceRange: "200 - 2,000",
                deliveryTime: "10-15 min",
                imageUrl: "https://dev-supabase.ctoglobal.co/storage/v1/object/public/temp-images/Mang_Tony_Auto_Repair.webp",
                action: 'shop_tony'
              },
              {
                name: "Lola Carmen's Tindahan",
                category: "Groceries & household items",
                rating: "4.8",
                reviews: "314",
                distance: "0.18 km",
                isOpen: true,
                statusText: "Open 24/7",
                priceRange: "30-150",
                deliveryTime: "15-25 min",
                imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&h=300",
                action: 'shop_carmen'
              },
              {
                name: "Ate Lucy's Halo-Halo",
                category: "Halo-halo & Filipino desserts",
                rating: "4.8",
                reviews: "314",
                distance: "0.18 km",
                isOpen: true,
                statusText: "Open 10 AM - 5 PM",
                priceRange: "30-150",
                deliveryTime: "15-25 min",
                imageUrl: "https://dev-supabase.ctoglobal.co/storage/v1/object/public/temp-images/halohalo_400x300.webp",
                action: 'shop_lucy'
              },
              {
                name: "Rey's Computer Shop",
                category: "Internet café & printing",
                rating: "4.8",
                reviews: "314",
                distance: "0.18 km",
                isOpen: true,
                statusText: "Open 10 AM - 5 PM",
                priceRange: "30-150",
                deliveryTime: "15-25 min",
                imageUrl: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=400&h=300",
                action: 'shop_rey'
              }
            ]
          }
        },
        {
          type: 'PromosSection',
          props: {
            title: 'Running Promos',
            badge: 'Hot Deals!',
            promos: [
              {
                shopName: "Nanay's Sari-Sari Store",
                subtitle: "Daily essentials & snacks",
                offerText: "20% OFF",
                highlightText: "20% OFF sa lahat ng snacks!",
                validUntil: "12.30.2025",
                imageUrl: "https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=400&h=300",
                action: 'promo_nanay'
              },
              {
                shopName: "Laundry Day",
                subtitle: "Quick wash & dry",
                offerText: "FREE 1KG",
                highlightText: "Free 1kg for every 10kg wash",
                validUntil: "11.15.2025",
                imageUrl: "https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?q=80&w=400&h=300",
                action: 'promo_laundry'
              }
            ]
          }
        },
        {
          type: 'FeaturedSection',
          props: {
            title: 'Featured Business',
            shops: [
              {
                name: "Aling Rosa's Karinderya",
                category: "Home-cooked Filipino meals",
                rating: "4.9",
                reviews: "314",
                distance: "0.2 km",
                serviceInfo: "15-25 min",
                isWalkIn: false,
                priceRange: "30 - 150",
                imageUrl: "https://images.unsplash.com/photo-1550989460-0adf9ea622e2?q=80&w=400&h=300",
                isOpen: true,
                action: 'shop_rosa'
              },
              {
                name: "Kuya Ben's Barber Shop",
                category: "Traditional & modern cuts",
                rating: "4.6",
                reviews: "314",
                distance: "0.1 km",
                serviceInfo: "Walk-in",
                isWalkIn: true,
                priceRange: "50 - 200",
                imageUrl: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?q=80&w=400&h=300",
                isOpen: true,
                action: 'shop_ben'
              },
              {
                name: "Café ni Maria",
                category: "Coffee, pastries & WiFi",
                rating: "4.2",
                reviews: "314",
                distance: "0.25 km",
                serviceInfo: "0.3 km",
                isWalkIn: true,
                priceRange: "80 - 300",
                imageUrl: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400&h=300",
                isOpen: true,
                action: 'shop_maria'
              },
              {
                name: "Mang Eddie's Bike Shop",
                category: "Bicycle sales & repair",
                rating: "4.0",
                reviews: "314",
                distance: "0.2 km",
                serviceInfo: "Same day",
                isWalkIn: true,
                priceRange: "1,000 - 5,000",
                imageUrl: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?q=80&w=400&h=300",
                isOpen: true,
                action: 'shop_eddie'
              }
            ]
          }
        },
        {
          type: 'TrustSection',
          props: {
            title: 'Why Trust Kumuni Marketplace',
            items: [
              {
                label: 'Verified Businesses',
                imageUrl: 'https://img.icons8.com/isometric/512/checked-shield.png'
              },
              {
                label: 'Community Reviews',
                imageUrl: 'https://img.icons8.com/isometric/512/star.png'
              },
              {
                label: 'Quality Assured',
                imageUrl: 'https://img.icons8.com/isometric/512/guarantee.png'
              }
            ]
          }
        },
        {
          type: 'CommunitySupportCard',
          props: {
            title: 'Support Your Community',
            subtitle: 'Every purchase helps strengthen local businesses and creates jobs in your neighborhood.',
            primaryAction: { label: 'Become a Seller', action: 'seller_signup' },
            secondaryAction: { label: 'Learn More', action: 'learn_community' }
          }
        },
      ]
    };
    return Promise.resolve(new Response(JSON.stringify({ success: true, data }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  }

  private static getMockCedulaAppResponse(): Promise<Response> {
    const data = {
      "id": "a0bfe169-9edf-4ebe-bf4f-f69b57bbeac4",
      "name": "Cedula Application",
      "slug": "cedula",
      "pages": [
        {
          "id": "welcome",
          "order": 0,
          "title": "Welcome",
          "styleMode": "fullscreen",
          "components": [
            {
              "type": "AppWelcomeScreen",
              "props": {
                "heroImage": "https://dev-supabase.ctoglobal.co/storage/v1/object/public/miniapp-images/Man1-min.png",
                "logoIcon": "https://dev-supabase.ctoglobal.co/storage/v1/object/public/miniapp-images/icons/cedula-icon.png",
                "title": "Online Cedula",
                "welcomeMessage": "Welcome to Online Cedula",
                "description": "Apply for your Community Tax Certificate (Cedula) quickly and securely from your mobile device.",
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
                  },
                  {
                    "icon": "sparkles",
                    "title": "Modern Design",
                    "description": "Trend and user-friendly"
                  }
                ],
                "requirements": [
                  "At least 18 years old",
                  "Valid government-issued ID",
                  "Proof of residency in the city",
                  "Proof of income or employment (if applicable)"
                ],
                "buttonText": "Get Started"
              },
              "action": {
                "type": "@pushPage",
                "params": { "pageId": "personal_information" }
              },
              "visibleWhen": { "userLevel": ["registered", "verified"] }
            },
            {
              "type": "AppWelcomeScreen",
              "props": {
                "heroImage": "https://dev-supabase.ctoglobal.co/storage/v1/object/public/miniapp-images/Man1-min.png",
                "logoIcon": "https://dev-supabase.ctoglobal.co/storage/v1/object/public/miniapp-images/icons/cedula-icon.png",
                "title": "Online Cedula",
                "welcomeMessage": "Welcome to Online Cedula",
                "description": "Apply for your Community Tax Certificate (Cedula) quickly and securely from your mobile device.",
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
                  },
                  {
                    "icon": "sparkles",
                    "title": "Modern Design",
                    "description": "Trend and user-friendly"
                  }
                ],
                "requirements": [
                  "At least 18 years old",
                  "Valid government-issued ID",
                  "Proof of residency in the city",
                  "Proof of income or employment (if applicable)"
                ],
                "buttonText": "Sign Up to Continue"
              },
              "action": {
                "type": "@register",
                "params": {}
              },
              "visibleWhen": { "userLevel": ["guest"] }
            }
          ]
        },
        {
          "id": "personal_information",
          "order": 1,
          "title": "Personal Information",
          "components": [
            {
              "type": "heading",
              "props": {
                "text": "Personal Information",
                "style": {
                  "fontSize": 24,
                  "fontWeight": "bold",
                  "marginBottom": 20
                }
              }
            },
            {
              "type": "text",
              "props": {
                "text": "Please provide your personal details as they appear on your government-issued ID.",
                "style": {
                  "color": "#666",
                  "marginBottom": 30,
                  "lineHeight": 22
                }
              }
            },
            {
              "id": "firstName",
              "type": "text-input",
              "props": {
                "label": "First Name",
                "placeholder": "Enter your first name",
                "required": true
              }
            },
            {
              "id": "middleName",
              "type": "text-input",
              "props": {
                "label": "Middle Name",
                "placeholder": "Enter your middle name",
                "required": true
              }
            },
            {
              "id": "lastName",
              "type": "text-input",
              "props": {
                "label": "Last Name",
                "placeholder": "Enter your last name",
                "required": true
              }
            },
            {
              "id": "dateOfBirth",
              "type": "date-picker",
              "props": {
                "label": "Date of Birth",
                "placeholder": "Select your date of birth",
                "required": true
              }
            },
            {
              "id": "placeOfBirth",
              "type": "text-input",
              "props": {
                "label": "Place of Birth",
                "placeholder": "City/Municipality, Province",
                "required": true
              }
            },
            {
              "id": "fullAddress",
              "type": "textarea",
              "props": {
                "multiline": true,
                "rows": 3,
                "label": "Complete Address",
                "placeholder": "House/Unit No., Street, Barangay, City/Municipality, Province",
                "required": true
              }
            },
            {
              "type": "button",
              "props": {
                "title": "Next",
                "variant": "primary",
                "style": { "marginTop": 20 }
              },
              "action": {
                "type": "@pushPage",
                "params": { "pageId": "review" }
              }
            }
          ]
        },
        {
          "id": "review",
          "order": 2,
          "title": "Review & Payment",
          "components": [
            {
              "type": "heading",
              "props": {
                "text": "Review Your Application",
                "style": {
                  "fontSize": 24,
                  "fontWeight": "bold",
                  "marginBottom": 20
                }
              }
            },
            {
              "type": "text",
              "props": {
                "text": "Please review your information carefully before proceeding to payment.",
                "style": {
                  "color": "#666",
                  "marginBottom": 30,
                  "lineHeight": 22
                }
              }
            },
            {
              "type": "container",
              "props": {
                "style": {
                  "backgroundColor": "#F5F5F7",
                  "padding": 20,
                  "borderRadius": 12,
                  "marginBottom": 20
                }
              },
              "children": [
                {
                  "type": "text",
                  "props": {
                    "text": "Payment Summary",
                    "style": {
                      "fontWeight": "bold",
                      "fontSize": 18,
                      "marginBottom": 15
                    }
                  }
                },
                {
                  "type": "container",
                  "props": {
                    "style": {
                      "flexDirection": "row",
                      "justifyContent": "space-between",
                      "marginBottom": 10
                    }
                  },
                  "children": [
                    {
                      "type": "text",
                      "props": {
                        "text": "Cedula Fee",
                        "style": { "color": "#666" }
                      }
                    },
                    {
                      "type": "text",
                      "props": {
                        "text": "₱100.00",
                        "style": { "fontWeight": "600" }
                      }
                    }
                  ]
                },
                {
                  "type": "container",
                  "props": {
                    "style": {
                      "flexDirection": "row",
                      "justifyContent": "space-between",
                      "marginBottom": 15,
                      "paddingBottom": 15,
                      "borderBottomWidth": 1,
                      "borderBottomColor": "#DDD"
                    }
                  },
                  "children": [
                    {
                      "type": "text",
                      "props": {
                        "text": "Convenience Fee (10%)",
                        "style": { "color": "#666" }
                      }
                    },
                    {
                      "type": "text",
                      "props": {
                        "text": "₱10.00",
                        "style": { "fontWeight": "600" }
                      }
                    }
                  ]
                },
                {
                  "type": "container",
                  "props": {
                    "style": {
                      "flexDirection": "row",
                      "justifyContent": "space-between"
                    }
                  },
                  "children": [
                    {
                      "type": "text",
                      "props": {
                        "text": "Total Amount",
                        "style": {
                          "fontWeight": "bold",
                          "fontSize": 18
                        }
                      }
                    },
                    {
                      "type": "text",
                      "props": {
                        "text": "₱110.00",
                        "style": {
                          "fontWeight": "bold",
                          "fontSize": 18,
                          "color": "#035afc"
                        }
                      }
                    }
                  ]
                }
              ]
            },
            {
              "type": "container",
              "props": {
                "style": {
                  "backgroundColor": "#E3F2FD",
                  "padding": 15,
                  "borderRadius": 8,
                  "marginBottom": 30
                }
              },
              "children": [
                {
                  "type": "text",
                  "props": {
                    "text": "ℹ️ Convenience fee is 10% of the cedula amount",
                    "style": {
                      "color": "#035afc",
                      "fontSize": 14
                    }
                  }
                }
              ]
            },
            {
              "type": "button",
              "props": {
                "title": "Back",
                "style": {
                  "backgroundColor": "#F5F5F7",
                  "marginBottom": 10
                },
                "textStyle": { "color": "#333" }
              },
              "action": {
                "type": "@popPage",
                "params": {}
              }
            },
            {
              "type": "button",
              "props": {
                "title": "Proceed to Payment",
                "variant": "primary"
              },
              "action": {
                "type": "@submitForm",
                "params": {
                  "endpoint": "/tenant/miniapps/cedula/submit",
                  "method": "POST",
                  "data": { "schema_version": "2.0" },
                  "onSuccess": {
                    "type": "@toast",
                    "params": {
                      "message": "Application submitted successfully! Proceeding to payment..."
                    }
                  }
                }
              }
            }
          ]
        }
      ],
      "navigation": {
        "guestPageId": "welcome",
        "initialPageId": "welcome"
      }
    };
    return Promise.resolve(new Response(JSON.stringify({ success: true, data }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  }

  private static getMockSDUIIntroPageResponse(): Promise<Response> {
    const data = {
      type: 'container',
      props: { style: { flex: 1, backgroundColor: 'transparent' }, backgroundImage: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/miniapp-images/webp/Generated_Image_February_04_2026_-_8_18PM.webp' },
      children: [
        {
          type: 'container', props: { style: { position: 'absolute', top: 60, width: '100%', alignItems: 'center' } }, children: [
            { type: 'text', props: { text: 'WELCOME TO', style: { fontSize: 14, color: '#FFF', letterSpacing: 4 } } },
            { type: 'text', props: { text: 'GENERAL LUNA', style: { fontSize: 32, fontWeight: '800', color: '#FFF' } } }
          ]
        },
        {
          type: 'container', props: { style: { position: 'absolute', bottom: 60, left: 30, right: 30, alignItems: 'center' } }, children: [
            {
              type: 'button',
              props: {
                text: 'Get Started',
                style: { backgroundColor: '#00ff5e', width: '100%', padding: 18, borderRadius: 12 },
                textStyle: { fontWeight: '700' }
              },
              action: { type: 'continue', params: {} }
            }
          ]
        }
      ]
    };
    return Promise.resolve(new Response(JSON.stringify({ success: true, data }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  }

  private static getMockOnboardingSlidesResponse(): Promise<Response> {
    const data = {
      id: "onboarding-app",
      name: "Onboarding",
      pages: [
        {
          id: "step1",
          title: "Step 1",
          styleMode: 'fullscreen',
          components: [
            {
              type: 'OnboardingSlide',
              props: {
                currentStep: 1,
                totalSteps: 3,
                buttonText: 'Next',
                backgroundImage: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/miniapp-images/webp/Generated_Image_February_04_2026_-_8_22PM_1.webp',
                tagLine: 'Online Services',
                title: 'Access your local government services in one secure mobile app.',
                overlayGrid: [
                  { icon: '❤️', label: 'Medical Assist.' },
                  { icon: '📄', label: 'Cedula (CTC)' },
                  { icon: '💸', label: 'Ayuda Online' },
                  { icon: '💵', label: 'Financial Assist.' },
                  { icon: '👨‍👩‍👦', label: 'Solo Parent ID' },
                  { icon: '♿', label: 'PWD ID' },
                  { icon: '🎓', label: 'Educational Assist.' },
                  { icon: '▩', label: 'More' },
                ]
              },
              action: { type: '@pushPage', params: { pageId: 'step2' } }
            }
          ]
        },
        {
          id: "step2",
          title: "Step 2",
          styleMode: 'fullscreen',
          components: [
            {
              type: 'OnboardingSlide',
              props: {
                currentStep: 2,
                totalSteps: 3,
                buttonText: 'Next',
                backgroundImage: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/miniapp-images/webp/Generated_Image_February_04_2026_-_8_22PM_1.webp',
                phoneMockup: 'https://lgubackend.ctoglobal.co/storage/v1/object/public/intro-images/mockup-finances.png',
                tagLine: 'Secure Finances',
                title: 'Add money, pay fees, and move funds securely in one app.',
                overlayGrid: [
                  { icon: '❤️', label: 'Medical Assist.' },
                  { icon: '📄', label: 'Cedula (CTC)' },
                  { icon: '💸', label: 'Ayuda Online' },
                  { icon: '💵', label: 'Financial Assist.' },
                  { icon: '👨‍👩‍👦', label: 'Solo Parent ID' },
                  { icon: '♿', label: 'PWD ID' },
                  { icon: '🎓', label: 'Educational Assist.' },
                  { icon: '▩', label: 'More' },
                ]
              },
              action: { type: '@pushPage', params: { pageId: 'step3' } }
            }
          ]
        },
        {
          id: "step3",
          title: "Step 3",
          styleMode: 'fullscreen',
          components: [
            {
              type: 'OnboardingSlide',
              props: {
                currentStep: 3,
                totalSteps: 3,
                buttonText: 'Get Started',
                backgroundImage: 'https://dev-supabase.ctoglobal.co/storage/v1/object/public/miniapp-images/webp/Generated%20Image%20February%2005,%202026%20-%208_38AM.webp',
                phoneMockup: 'https://lgubackend.ctoglobal.co/storage/v1/object/public/intro-images/mockup-marketplace.png',
                tagLine: 'Business Marketplace',
                title: 'Discover LGU services to help your MSME grow.',
                overlayGrid: [
                  { icon: '❤️', label: 'Medical Assist.' },
                  { icon: '📄', label: 'Cedula (CTC)' },
                  { icon: '💸', label: 'Ayuda Online' },
                  { icon: '💵', label: 'Financial Assist.' },
                  { icon: '👨‍👩‍👦', label: 'Solo Parent ID' },
                  { icon: '♿', label: 'PWD ID' },
                  { icon: '🎓', label: 'Educational Assist.' },
                  { icon: '▩', label: 'More' },
                ]
              },
              action: { type: 'registration', params: {} }
            }
          ]
        }
      ],
      navigation: {
        initialPageId: "step1"
      }
    };
    return Promise.resolve(new Response(JSON.stringify({ success: true, data }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  }


  private static getMockMasterConfigResponse(): Promise<Response> {
    console.log('MockInterceptor: Generating Master Config response...');
    const config = {
      theme: { primaryColor: '#00ff5e', secondaryColor: '#1A1A1A' },
      central_config: { url: CENTRAL_API_URL, credentials: { apiKey: CENTRAL_API_KEY, secret: CENTRAL_API_SECRET } },
      tenant_config: { id: TENANT_ID, url: TENANT_API_URL, credentials: { apiKey: TENANT_API_KEY, secret: TENANT_API_SECRET } },
      module_registry: [
        {
          id: 'shell',
          name: 'Kumuni Shell',
          type: 'sdui',
          entry_url: '',
          permissions: ['*']
        },
        {
          id: 'calculator',
          name: 'Calculator',
          type: 'remote_js',
          entry_url: 'http://localhost:8082/calculator.js',
          permissions: ['*']
        },
        {
          id: 'news',
          name: 'News Feed',
          type: 'web',
          entry_url: 'https://news.kumuni.com',
          permissions: ['*']
        },
        {
          id: 'solo_parent_reg',
          name: 'Solo Parent Registration',
          type: 'sdui',
          entry_url: TENANT_API_URL + '/tenant/sdui/solo-parent-form',
          permissions: [
            '/tenant/forms/solo-parent',
            '/tenant/upload/documents'
          ]
        },
        {
          id: 'cedula',
          name: 'Cedula Application',
          type: 'sdui',
          entry_url: TENANT_API_URL + '/tenant/sdui/cedula-app',
          permissions: [
            '/mobile/submission'
          ]
        }
      ],
      cms_content: { dashboard_news: [], banners: [] }
    };
    return Promise.resolve(new Response(JSON.stringify(config), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  }

  private static getSoloParentFormSchema(): Promise<Response> {
    const data = {
      type: 'container',
      props: { style: { padding: 20, backgroundColor: '#FFF', flex: 1 } },
      children: [
        { type: 'Text', props: { content: 'Solo Parent Application', style: { fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#333' } } },
        { type: 'Text', props: { content: 'Please fill out the form below to apply for your Solo Parent ID.', style: { fontSize: 14, color: '#666', marginBottom: 20 } } },
        { type: 'Input', props: { label: 'Full Name', placeholder: 'Enter your full name', name: 'fullName', style: { marginBottom: 15 } } },
        { type: 'Input', props: { label: 'Number of Dependents', keyboardType: 'numeric', name: 'dependents', style: { marginBottom: 25 } } },
        {
          type: 'Button',
          props: {
            label: 'Submit Application',
            action: 'submit_form',
            style: { backgroundColor: '#00D1FF', padding: 15, borderRadius: 10, alignItems: 'center' },
            textStyle: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
            actionParams: {
              moduleId: 'solo_parent_reg',
              endpoint: '/tenant/forms/solo-parent',
              method: 'POST'
            }
          }
        }
      ]
    };
    return Promise.resolve(new Response(JSON.stringify({ success: true, data }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  }

  private static getMockHelpResponse(): Promise<Response> {
    const data = {
      type: 'HelpCenter',
      styleMode: 'fullscreen',
      props: {}
    };
    return Promise.resolve(new Response(JSON.stringify({ success: true, data }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  }

  private static getMockRegistrationResponse(): Promise<Response> {
    const data = {
      type: 'Registration',
      styleMode: 'fullscreen',
      props: {}
    };
    return Promise.resolve(new Response(JSON.stringify({ success: true, data }), { status: 200, headers: { 'Content-Type': 'application/json' } }));
  }
}

// Assignments for fetch/Response globals...
interface Response { json(): Promise<any>; text(): Promise<string>; ok: boolean; status: number; }
class ResponsePolyfill implements Response {
  private body: string; public status: number; public ok: boolean;
  constructor(body: string, init?: { status?: number }) { this.body = body; this.status = init?.status || 200; this.ok = this.status >= 200 && this.status < 300; }
  async json() { return JSON.parse(this.body); }
  async text() { return this.body; }
}
if (typeof global !== 'undefined') {
  if (!(global as any).Response) (global as any).Response = ResponsePolyfill;
}