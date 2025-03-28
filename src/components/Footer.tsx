import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Download,
  Github,
  Twitter,
  Heart,
  Lock,
  Instagram,
  Linkedin,
  Facebook,
} from "lucide-react";
import logo from "../../src/assets/images/Xtrayt-SVG.png";

const Footer = () => {
  // Get social media links from localStorage if available
  const getDefaultSocialLinks = () => {
    return {
      twitter: "https://x.com/xtraytofficial",
      instagram: "https://www.instagram.com/xtraytofficial",

      facebook: "https://www.facebook.com/xtraytofficial",
    };
  };

  const [socialLinks, setSocialLinks] = useState(getDefaultSocialLinks());

  useEffect(() => {
    try {
      const storedLinks = localStorage.getItem("adminSocialLinks");
      if (storedLinks) {
        setSocialLinks(JSON.parse(storedLinks));
      }
    } catch (error) {
      console.error("Error loading social media links:", error);
    }
  }, []);

  return (
    <footer className="w-full bg-background border-t border-border/30 py-12 px-6 md:px-10">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        <div className="col-span-1 md:col-span-2">
          <div className="flex items-center gap-2 mb-4">
            <img src={logo} alt="Xtrayt Logo" width={50} />
            <h1 className="text-2xl font-bold">Xtrayt</h1>
          </div>
          <p className="text-muted-foreground text-sm max-w-md">
            A sleek, intuitive application for downloading YouTube content with
            ease. Get thumbnails, videos, and transcripts with just a few
            clicks.
          </p>
          <div className="flex items-center gap-4 mt-6">
            {socialLinks.twitter && (
              <a
                href={socialLinks.twitter}
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
            )}
            {socialLinks.instagram && (
              <a
                href={socialLinks.instagram}
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
            )}

            {socialLinks.facebook && (
              <a
                href={socialLinks.facebook}
                className="text-foreground/60 hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>

        <div className="col-span-1">
          <h3 className="font-medium text-sm mb-4">Navigation</h3>
          <ul className="space-y-3">
            <li>
              <Link
                to="/"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/services"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Services
              </Link>
            </li>
            <li>
              <Link
                to="/features/thumbnail"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Features
              </Link>
            </li>
            <li>
              <Link
                to="/about"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                About Us
              </Link>
            </li>
          </ul>
        </div>

        <div className="col-span-1">
          <h3 className="font-medium text-sm mb-4">Features</h3>
          <ul className="space-y-3">
            <li>
              <Link
                to="/features/thumbnail"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Thumbnails
              </Link>
            </li>
            <li>
              <Link
                to="/features/video"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Videos
              </Link>
            </li>
            <li>
              <Link
                to="/features/transcript"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Transcripts
              </Link>
            </li>
            <li>
              <Link
                to="/features/shorts"
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Shorts
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto mt-12 pt-6 border-t border-border/30 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-muted-foreground">
          © {new Date().getFullYear()} Xtrayt. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <div className="flex space-x-1 items-center text-xs text-muted-foreground">
            <span>Crafted by Ali Usman</span>

            <span>for Content Creators</span>
          </div>
          <Link
            to="/admin"
            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <Lock className="h-3 w-3" />
            Admin
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
