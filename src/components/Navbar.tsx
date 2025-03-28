import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Download, ChevronDown, Menu, X } from "lucide-react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { useIsMobile } from "@/hooks/use-mobile";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import UserMenu from "./UserMenu";
import logo from "../../src/assets/images/Xtrayt-SVG.png";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();
  const [logoUrl, setLogoUrl] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Load logo from localStorage
    try {
      const storedContent = localStorage.getItem("adminHomePageContent");
      if (storedContent) {
        const parsedContent = JSON.parse(storedContent);
        if (parsedContent.logo) {
          setLogoUrl(parsedContent.logo);
        }
      }
    } catch (error) {
      console.error("Error loading logo:", error);
    }
  }, []);

  const links = [
    { name: "Home", path: "/" },
    { name: "Services", path: "/services" },
    { name: "About", path: "/about" },
  ];

  const featureLinks = [
    { name: "Thumbnails", path: "/features/thumbnail" },
    { name: "Preview", path: "/features/thumbnail-preview" },

    { name: "YT Tags Extractor", path: "/features/yt-tags" },
  ];

  const isFeaturePath = location.pathname.includes("/features");

  return (
    <nav
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 px-6 md:px-10 py-4",
        scrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          {logoUrl ? (
            <img src={logo} alt="Xtrayt Logo" className="h-10" />
          ) : (
            <>
              <img src={logo} alt="Xtrayt Logo" width={30} />
              <h1 className="text-xl font-bold">Xtrayt</h1>
            </>
          )}
        </Link>

        {isMobile ? (
          <div className="flex items-center gap-2">
            <UserMenu />

            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-foreground/80"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[80%] sm:w-[350px]">
                <div className="flex flex-col gap-y-6 h-full py-4">
                  <Link
                    to="/"
                    className={cn(
                      "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                      location.pathname === "/"
                        ? "text-primary bg-primary/10"
                        : "text-foreground/80 hover:text-primary"
                    )}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Home
                  </Link>

                  <div className="border-t border-border/30 pt-2">
                    <p className="px-4 pt-2 text-xs uppercase text-muted-foreground font-semibold tracking-wider">
                      Features
                    </p>
                    {featureLinks.map((feature) => (
                      <Link
                        key={feature.name}
                        to={feature.path}
                        className={cn(
                          "px-4 py-3 rounded-lg text-sm font-medium block transition-all duration-200",
                          location.pathname === feature.path
                            ? "text-primary bg-primary/10"
                            : "text-foreground/80 hover:text-primary"
                        )}
                      >
                        {feature.name}
                      </Link>
                    ))}
                  </div>

                  <div className="border-t border-border/30 pt-2">
                    {links.slice(1).map((link) => (
                      <Link
                        key={link.name}
                        to={link.path}
                        className={cn(
                          "px-4 py-3 rounded-lg text-sm font-medium block transition-all duration-200",
                          location.pathname === link.path
                            ? "text-primary bg-primary/10"
                            : "text-foreground/80 hover:text-primary"
                        )}
                      >
                        {link.name}
                      </Link>
                    ))}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-1">
              <Link
                to="/"
                className={cn(
                  "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                  location.pathname === "/"
                    ? "text-primary bg-primary/10"
                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                )}
              >
                Home
              </Link>

              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger
                      className={cn(
                        "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                        isFeaturePath
                          ? "text-primary bg-primary/10"
                          : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                      )}
                    >
                      Features
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="bg-background w-48 p-2 rounded-md border">
                      <ul className="w-full">
                        {featureLinks.map((feature) => (
                          <li key={feature.name} className="w-full">
                            <NavigationMenuLink asChild>
                              <Link
                                to={feature.path}
                                className={cn(
                                  "block w-full px-4 py-2 rounded-md text-sm font-medium transition-all duration-200",
                                  location.pathname === feature.path
                                    ? "text-primary bg-primary/10"
                                    : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                                )}
                              >
                                {feature.name}
                              </Link>
                            </NavigationMenuLink>
                          </li>
                        ))}
                      </ul>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

              {links.slice(1).map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={cn(
                    "px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    location.pathname === link.path
                      ? "text-primary bg-primary/10"
                      : "text-foreground/80 hover:text-primary hover:bg-primary/5"
                  )}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <UserMenu />
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
