
import React, { createContext, useContext, useEffect, useState } from "react";
import { 
  User, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  signOut, 
  sendPasswordResetEmail,
  onAuthStateChanged
} from "firebase/auth";
import { auth, googleProvider, facebookProvider, logAnalyticsEvent } from "@/lib/firebase";
import { useToast } from "@/components/ui/use-toast";

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string) => Promise<User>;
  googleSignIn: () => Promise<User>;
  facebookSignIn: () => Promise<User>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
      
      // Log authentication state change to analytics
      if (user) {
        logAnalyticsEvent('login', { method: 'auto' });
      }
    });
    
    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      logAnalyticsEvent('login', { method: 'email' });
      return result.user;
    } catch (error: any) {
      toast({
        title: "Sign In Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      logAnalyticsEvent('sign_up', { method: 'email' });
      return result.user;
    } catch (error: any) {
      toast({
        title: "Sign Up Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const googleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      logAnalyticsEvent('login', { method: 'google' });
      return result.user;
    } catch (error: any) {
      toast({
        title: "Google Sign In Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const facebookSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      logAnalyticsEvent('login', { method: 'facebook' });
      return result.user;
    } catch (error: any) {
      toast({
        title: "Facebook Sign In Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      logAnalyticsEvent('password_reset', { method: 'email' });
      toast({
        title: "Password Reset Email Sent",
        description: "Check your email for password reset instructions",
      });
    } catch (error: any) {
      toast({
        title: "Password Reset Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      logAnalyticsEvent('logout', {});
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out",
      });
    } catch (error: any) {
      toast({
        title: "Logout Error",
        description: error.message,
        variant: "destructive",
      });
      throw error;
    }
  };

  const value = {
    currentUser,
    loading,
    signIn,
    signUp,
    googleSignIn,
    facebookSignIn,
    resetPassword,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
