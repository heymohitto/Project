export const FEATURES = {
  PROFILES_LIMIT: {
    free: 1,
    pro: 5,
    enterprise: Infinity,
  },
  LINKS_LIMIT: {
    free: 10,
    pro: 50,
    enterprise: Infinity,
  },
  FILE_UPLOAD_LIMIT: {
    free: 5 * 1024 * 1024, // 5MB
    pro: 50 * 1024 * 1024, // 50MB
    enterprise: 500 * 1024 * 1024, // 500MB
  },
  ANALYTICS_HISTORY_DAYS: {
    free: 7,
    pro: 90,
    enterprise: Infinity,
  },
  CUSTOM_CSS: {
    free: false,
    pro: true,
    enterprise: true,
  },
  TEMPLATE_CREATION: {
    free: false,
    pro: false,
    enterprise: true,
  },
  API_ACCESS: {
    free: false,
    pro: false,
    enterprise: true,
  },
  PRIORITY_SUPPORT: {
    free: false,
    pro: true,
    enterprise: true,
  },
  REMOVE_BRANDING: {
    free: false,
    pro: true,
    enterprise: true,
  },
  ADVANCED_CUSTOMIZATION: {
    free: false,
    pro: false,
    enterprise: true,
  },
};

export const SUBSCRIPTION_PRICES = {
  pro: 9.99, // $9.99/month
  enterprise: 29.99, // $29.99/month
};

export const getUserFeatures = (subscriptionTier: 'free' | 'pro' | 'enterprise') => {
  return {
    profilesLimit: FEATURES.PROFILES_LIMIT[subscriptionTier],
    linksLimit: FEATURES.LINKS_LIMIT[subscriptionTier],
    fileUploadLimit: FEATURES.FILE_UPLOAD_LIMIT[subscriptionTier],
    analyticsHistoryDays: FEATURES.ANALYTICS_HISTORY_DAYS[subscriptionTier],
    customCss: FEATURES.CUSTOM_CSS[subscriptionTier],
    templateCreation: FEATURES.TEMPLATE_CREATION[subscriptionTier],
    apiAccess: FEATURES.API_ACCESS[subscriptionTier],
    prioritySupport: FEATURES.PRIORITY_SUPPORT[subscriptionTier],
    removeBranding: FEATURES.REMOVE_BRANDING[subscriptionTier],
    advancedCustomization: FEATURES.ADVANCED_CUSTOMIZATION[subscriptionTier],
  };
};

export const checkFeatureLimit = (
  subscriptionTier: 'free' | 'pro' | 'enterprise',
  feature: keyof typeof FEATURES,
  currentCount: number
): boolean => {
  const limit = FEATURES[feature][subscriptionTier];
  if (typeof limit === 'number') {
    return currentCount < limit;
  }
  return limit; // For boolean features
};

export const getSubscriptionPrice = (tier: 'pro' | 'enterprise'): number => {
  return SUBSCRIPTION_PRICES[tier];
};