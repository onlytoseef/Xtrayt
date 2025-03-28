import React from "react";
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Image,
  FileText,
  ChevronRight,
  Download,
  Eye,
  Users,
  Tag,
  FileVideo,
  Lightbulb,
  WandSparkles,
  FileSearch,
} from "lucide-react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import { ThemeToggle } from "@/components/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";

interface HomePageContent {
  hero: {
    title: string;
    description: string;
    primaryButtonText: string;
    secondaryButtonText: string;
    processedTitle?: string;
  };
  features: {
    title: string;
    description: string;
  };
  cta: {
    title: string;
    description: string;
    buttonText: string;
  };
  logo?: string;
}

const fetchFromServer = async (): Promise<HomePageContent | null> => {
  try {
    // With mock client, just try localStorage
    const localData = localStorage.getItem("adminHomePageContent");
    return localData ? JSON.parse(localData) : null;
  } catch (error) {
    console.error("Error fetching content:", error);
    return null;
  }
};

const fetchSocialLinks = async () => {
  try {
    // With mock client, just try localStorage
    const storedLinks = localStorage.getItem("adminSocialLinks");
    return storedLinks ? JSON.parse(storedLinks) : null;
  } catch (error) {
    console.error("Error fetching social links:", error);
    return null;
  }
};

const Index = () => {
  const [servicesIntro, setServicesIntro] = useState({
    title: "Our Professional Services",
    description:
      "We offer expert YouTube content creation services to help you grow your channel and reach more viewers.",
    buttonText: "View Our Services",
  });

  const defaultHomePageContent: HomePageContent = {
    hero: {
      title: "Everything you need to supercharge your productivity",
      description:
        "A sleek, intuitive application for downloading thumbnails and transcripts from YouTube with just a few clicks.",
      primaryButtonText: "Get Started",
      secondaryButtonText: "Learn More",
    },
    features: {
      title: "Powerful Features",
      description:
        "Our tools make it simple to download and use content from YouTube",
    },
    cta: {
      title: "Ready to simplify your workflow?",
      description:
        "Start downloading YouTube content with a clean, intuitive interface designed with attention to detail.",
      buttonText: "Explore All Features",
    },
  };

  const [homePageContent, setHomePageContent] = useState<HomePageContent>(
    defaultHomePageContent
  );
  const [isLoading, setIsLoading] = useState(true);

  const isMobile = useIsMobile();

  useEffect(() => {
    const loadContent = async () => {
      setIsLoading(true);
      try {
        const savedServicesIntro = localStorage.getItem("adminServicesIntro");
        if (savedServicesIntro) {
          setServicesIntro(JSON.parse(savedServicesIntro));
        }

        // Fetch content from localStorage
        const serverContent = await fetchFromServer();
        if (serverContent) {
          setHomePageContent(serverContent);
        }

        // Fetch social links for future use
        await fetchSocialLinks();
      } catch (error) {
        console.error("Error loading content:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadContent();
  }, []);

  const homeStructuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Xtrayt",
    applicationCategory: "UtilityApplication",
    operatingSystem: "Web",
    description:
      "A sleek, intuitive application for downloading thumbnails and transcripts from YouTube with just a few clicks.",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.8",
      ratingCount: "247",
    },
    author: {
      "@type": "Organization",
      name: "Xtrayt",
      url: "https://xtrayt.com",
    },
    keywords:
      "YouTube thumbnail downloader, transcript downloader, YouTube tools, content creator tools",
    softwareVersion: "2.0",
  };

  const features = [
    {
      icon: Image,
      title: "Thumbnail Downloader",
      description: "Download high-quality thumbnails from any YouTube video",
      path: "/features/thumbnail",
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
    },
    {
      icon: FileText,
      title: "Transcript Downloader",
      description: "Extract and download video transcripts",
      path: null,
      color:
        "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
      comingSoon: true,
    },
    {
      icon: Eye,
      title: "Thumbnail Preview",
      description: "Preview thumbnails in different YouTube contexts",
      path: "/features/thumbnail-preview",
      color: "bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400",
    },
    {
      icon: Tag,
      title: "YouTube Tags Extractor",
      description: "Extract tags from any YouTube video to improve your SEO",
      path: "/features/youtube-tags",
      color:
        "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400",
    },

    {
      icon: Lightbulb,
      title: "Thumbnail Idea Generator",
      description: "Get AI-powered thumbnail ideas for your YouTube videos",
      path: "/features/thumbnail-idea-generator",
      color:
        "bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400",
      comingSoon: true,
    },
    {
      icon: FileSearch,
      title: "Script Generator",
      description: "Generate AI-powered scripts for your YouTube videos",
      path: "/features/video-summarizer",
      color:
        "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
      comingSoon: true,
    },
    {
      icon: WandSparkles,
      title: "Thumbnail Generator",
      description: "Generate eye-catching thumbnails with AI technology",
      path: null,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      comingSoon: true,
    },
    {
      icon: FileVideo,
      title: "Video Summarizer",
      description: "Summarize Youtube Videos with one click",
      path: null,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      comingSoon: true,
    },
  ];

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;
      const scrollTop = window.scrollY;
      const parallaxFactor = 0.5;
      containerRef.current.style.transform = `translateY(${
        scrollTop * parallaxFactor
      }px)`;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 10,
      },
    },
  };

  return (
    <div
      className="min-h-screen"
      itemScope
      itemType="https://schema.org/WebPage"
    >
      <SEO
        pageName="home"
        structuredData={homeStructuredData}
        canonicalUrl="https://xtrayt.com/"
      />

      <section
        className="relative pt-28 pb-20 md:pt-36 md:pb-32 overflow-hidden"
        aria-labelledby="hero-heading"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50 to-transparent dark:from-blue-950/20 dark:to-transparent z-0" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div ref={containerRef} className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex justify-center items-center gap-3 mb-6"
            >
              <div className="inline-block bg-primary/10 p-2 px-4 rounded-full text-primary text-sm font-medium">
                Simplicity redefined for content creators
              </div>
              <ThemeToggle />
            </motion.div>

            <motion.h1
              id="hero-heading"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-3xl sm:text-4xl md:text-6xl font-bold   mb-6 sm:mb-8 py-4 sm:py-8 leading-relaxed"
            >
              <span
                dangerouslySetInnerHTML={{
                  __html:
                    homePageContent.hero.processedTitle ||
                    homePageContent.hero.title,
                }}
              />
            </motion.h1>

            <motion.p
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-base sm:text-lg text-muted-foreground mb-6 sm:mb-8 md:mb-10 max-w-2xl mx-auto px-2"
            >
              {homePageContent.hero.description}
            </motion.p>

            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button asChild size="lg" className="rounded-full px-8">
                <Link
                  to="/features"
                  aria-label="Get started with our YouTube tools"
                >
                  {homePageContent.hero.primaryButtonText}
                  <ChevronRight className="ml-2 h-4 w-4" aria-hidden="true" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8"
              >
                <Link to="/about" aria-label="Learn more about Xtrayt">
                  {homePageContent.hero.secondaryButtonText}
                </Link>
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      <section
        className="py-16 sm:py-20 bg-white dark:bg-gray-950"
        aria-labelledby="features-heading"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-10 sm:mb-16">
            <h2
              id="features-heading"
              className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4"
            >
              {homePageContent.features.title}
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto px-2">
              {homePageContent.features.description}
            </p>
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.3 }}
            className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 px-2 sm:px-0"
          >
            {features.map((feature, index) => (
              <motion.div key={index} variants={item} className="flex">
                {feature.comingSoon ? (
                  <Card className="feature-card h-full w-full dark:bg-gray-900 relative overflow-hidden">
                    <CardContent className={`pt-6 ${isMobile ? "p-4" : "p-6"}`}>
                      <div
                        className={`p-2 sm:p-3 rounded-full ${feature.color} inline-block mb-3 sm:mb-4`}
                        aria-hidden="true"
                      >
                        <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                      </div>
                      <h3 className="text-lg sm:text-xl font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                        {feature.description}
                      </p>
                      <div className="mt-2 sm:mt-4 flex justify-between items-center">
                        <Badge className="bg-purple-500 hover:bg-purple-500 text-xs sm:text-sm">
                          Coming Soon
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                ) : (
                  <Link
                    to={feature.path}
                    className="block h-full w-full"
                    aria-label={`Try ${feature.title}`}
                  >
                    <Card className="feature-card h-full dark:bg-gray-900 overflow-hidden">
                      <CardContent
                        className={`pt-6 ${isMobile ? "p-4" : "p-6"}`}
                      >
                        <div
                          className={`p-2 sm:p-3 rounded-full ${feature.color} inline-block mb-3 sm:mb-4`}
                          aria-hidden="true"
                        >
                          <feature.icon className="h-5 w-5 sm:h-6 sm:w-6" />
                        </div>
                        <h3 className="text-lg sm:text-xl font-semibold mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-sm sm:text-base text-muted-foreground mb-4 sm:mb-6">
                          {feature.description}
                        </p>
                        <Button
                          variant="ghost"
                          className="group text-sm sm:text-base"
                        >
                          Try Now
                          <ChevronRight
                            className="ml-1 h-3 w-3 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </Button>
                      </CardContent>
                    </Card>
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <section
        className="py-16 sm:py-20 bg-gradient-to-b from-white to-blue-50 dark:from-gray-950 dark:to-blue-950/20"
        aria-labelledby="services-heading"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto text-center"
          >
            <div className="flex justify-center mb-6">
              <div
                className="p-3 sm:p-4 rounded-full bg-primary/10 text-primary"
                aria-hidden="true"
              >
                <Users className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
            </div>
            <h2
              id="services-heading"
              className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4"
            >
              {servicesIntro.title}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              {servicesIntro.description}
            </p>
            <Button asChild size="lg" className="rounded-full px-6 sm:px-8">
              <Link to="/services" aria-label="View our professional services">
                {servicesIntro.buttonText}
                <ChevronRight
                  className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <section
        className="py-16 sm:py-20 bg-gradient-to-b from-blue-50 to-white dark:from-blue-950/20 dark:to-gray-950"
        aria-labelledby="cta-heading"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="flex justify-center mb-6">
              <div
                className="p-3 sm:p-4 rounded-full bg-primary/10 text-primary"
                aria-hidden="true"
              >
                <Download className="h-6 w-6 sm:h-8 sm:w-8" />
              </div>
            </div>
            <h2
              id="cta-heading"
              className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4"
            >
              {homePageContent.cta.title}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto px-2">
              {homePageContent.cta.description}
            </p>
            <Button asChild size="lg" className="rounded-full px-6 sm:px-8">
              <Link
                to="/features"
                aria-label="Explore all of our YouTube tool features"
              >
                {homePageContent.cta.buttonText}
                <ChevronRight
                  className="ml-1 sm:ml-2 h-3 w-3 sm:h-4 sm:w-4"
                  aria-hidden="true"
                />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
