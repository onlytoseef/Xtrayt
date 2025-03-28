
import { getAnalytics, logEvent } from "firebase/analytics";
import app from "./firebase";

// Try to get analytics but handle errors gracefully
let analytics = null;

try {
  analytics = getAnalytics(app);
} catch (error) {
  console.warn("Firebase analytics not available:", error);
}

interface PageViewProps {
  path: string;
  title: string;
  search?: string;
}

interface EventProps {
  action: string;
  category: string;
  label?: string;
  value?: number;
  [key: string]: any;
}

// Track page views
export const pageView = ({ path, title, search }: PageViewProps) => {
  if (!analytics) return;
  
  try {
    logEvent(analytics, 'page_view', {
      page_path: path,
      page_title: title,
      page_location: window.location.href,
      page_search: search || '',
    });
  } catch (error) {
    console.warn("Failed to log page view:", error);
  }
};

// Track custom events
export const trackEvent = ({ action, category, label, value, ...rest }: EventProps) => {
  if (!analytics) return;
  
  try {
    logEvent(analytics, action, {
      event_category: category,
      event_label: label,
      value: value,
      ...rest
    });
  } catch (error) {
    console.warn("Failed to track event:", error);
  }
};

// Track outbound links
export const trackOutboundLink = (url: string) => {
  if (!analytics) return;
  
  try {
    logEvent(analytics, 'click', {
      event_category: 'outbound',
      event_label: url,
      transport_type: 'beacon',
    });
  } catch (error) {
    console.warn("Failed to track outbound link:", error);
  }
};

// Track user engagement
export const trackEngagement = (type: string, content_id: string, content_type: string) => {
  if (!analytics) return;
  
  try {
    logEvent(analytics, 'user_engagement', {
      engagement_type: type,
      content_id: content_id,
      content_type: content_type,
    });
  } catch (error) {
    console.warn("Failed to track engagement:", error);
  }
};

// Track feature usage
export const trackFeatureUsage = (feature: string, action: string) => {
  if (!analytics) return;
  
  try {
    logEvent(analytics, 'feature_use', {
      feature_name: feature,
      action: action,
    });
  } catch (error) {
    console.warn("Failed to track feature usage:", error);
  }
};

// Track site search
export const trackSearch = (search_term: string, results_count: number) => {
  if (!analytics) return;
  
  try {
    logEvent(analytics, 'search', {
      search_term: search_term,
      results_count: results_count
    });
  } catch (error) {
    console.warn("Failed to track search:", error);
  }
};

export default {
  pageView,
  trackEvent,
  trackOutboundLink,
  trackEngagement,
  trackFeatureUsage,
  trackSearch
};
