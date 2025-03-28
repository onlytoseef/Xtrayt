
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, FacebookAuthProvider } from "firebase/auth";
import { getAnalytics, logEvent } from "firebase/analytics";

// Try to get analytics, but don't fail if it's not available
let analytics = null;

// Get API settings from localStorage if available
const getApiSettings = () => {
  const defaultSettings = {
    googleOAuth: {
      clientId: "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"
    },
    youtubeTagsAPI: {
      key: "AIzaSyA2JyJ5X1AZt3BaFj8y1Ch6Uut2hoQLpS0"
    },
    tiktokAPI: {
      key: "" // Default empty value for TikTok API
    }
  };

  try {
    const storedSettings = localStorage.getItem('adminApiSettings');
    if (storedSettings) {
      return JSON.parse(storedSettings);
    }
    return defaultSettings;
  } catch (error) {
    console.error("Error reading API settings:", error);
    return defaultSettings;
  }
};

const apiSettings = getApiSettings();

const firebaseConfig = {
  apiKey: apiSettings.youtubeTagsAPI?.key || "AIzaSyA2JyJ5X1AZt3BaFj8y1Ch6Uut2hoQLpS0", 
  authDomain: "ytube-tool.firebaseapp.com",
  projectId: "ytube-tool",
  storageBucket: "ytube-tool.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abc123def456ghi789jkl",
  measurementId: "G-MEASUREMENT_ID"
};

// Initialize Firebase
let app;
let auth;
let googleProvider;
let facebookProvider;

try {
  app = initializeApp(firebaseConfig);
  auth = getAuth(app);
  
  // Try to initialize analytics
  try {
    analytics = getAnalytics(app);
  } catch (error) {
    console.warn("Failed to initialize Firebase Analytics:", error);
  }

  // Initialize providers
  googleProvider = new GoogleAuthProvider();
  googleProvider.setCustomParameters({
    client_id: apiSettings.googleOAuth?.clientId || "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",
  });

  facebookProvider = new FacebookAuthProvider();
} catch (error) {
  console.error("Failed to initialize Firebase:", error);
  // Create fallback objects to prevent null references
  app = {};
  auth = { 
    onAuthStateChanged: () => {}, 
    signInWithRedirect: () => Promise.reject(new Error("Firebase not initialized")),
    signOut: () => Promise.reject(new Error("Firebase not initialized"))
  };
  googleProvider = {};
  facebookProvider = {};
}

// Helper function to log analytics events - with error handling
export const logAnalyticsEvent = (eventName, eventParams = {}) => {
  if (!analytics) {
    console.warn("Analytics not available, can't log event:", eventName);
    return;
  }
  
  try {
    logEvent(analytics, eventName, eventParams);
  } catch (error) {
    console.warn("Failed to log analytics event:", error);
  }
};

export { auth, googleProvider, facebookProvider, analytics };
export default app;
