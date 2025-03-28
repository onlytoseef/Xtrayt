import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import {
  Star,
  Instagram,
  Twitter,
  Facebook,
  Linkedin,
  Youtube,
  Globe,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import CountUp from "@/components/CountUp";

interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  thumbnailUrl?: string;
}

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

interface PortfolioData {
  gaming: PortfolioItem[];
  tech: PortfolioItem[];
  lifestyle: PortfolioItem[];
  educational: PortfolioItem[];
}

interface PortfolioStats {
  clients: number;
  thumbnails: number;
  views: number;
}

interface ClientReview {
  id: string;
  name: string;
  image: string;
  review: string;
  stars: number;
}

interface SocialMediaLink {
  platform: string;
  url: string;
  enabled: boolean;
}

interface ServicesPageData {
  profile: {
    name: string;
    title: string;
    bio: string;
    description: string;
    avatar: string;
    socialHandle: string;
  };
  categories: ServiceCategory[];
  stats: PortfolioStats;
  reviews: ClientReview[];
  socialMedia: SocialMediaLink[];
}

const defaultServicesData: ServicesPageData = {
  profile: {
    name: "Ali Usman",
    title: "Founder & CEO",
    bio: "YouTube Thumbnail Designer | Content Creator",
    description:
      "Specialized in creating eye-catching thumbnails that boost CTR and help YouTubers grow their channels. With years of experience in graphic design and YouTube optimization.",
    avatar:
      "https://i.pinimg.com/736x/a9/70/85/a9708511c8dabb153d129ed34139d4ce.jpg",
    socialHandle: "@4liusman",
  },
  categories: [
    {
      id: "1",
      title: "Gaming Thumbnails",
      description: "Eye-catching thumbnails for gaming content creators",
      icon: "GamepadIcon",
      link: "/portfolio/gaming",
      thumbnailUrl: "/placeholder.svg",
    },
    {
      id: "2",
      title: "Tech Reviews",
      description: "Professional thumbnails for tech review videos",
      icon: "SmartphoneIcon",
      link: "/portfolio/tech",
      thumbnailUrl: "/placeholder.svg",
    },
    {
      id: "3",
      title: "Lifestyle & Vlogs",
      description: "Creative thumbnails for lifestyle and vlog content",
      icon: "CameraIcon",
      link: "/portfolio/lifestyle",
      thumbnailUrl: "/placeholder.svg",
    },
    {
      id: "4",
      title: "Educational",
      description: "Clear and informative thumbnails for educational videos",
      icon: "GraduationCapIcon",
      link: "/portfolio/educational",
      thumbnailUrl: "/placeholder.svg",
    },
  ],
  stats: {
    clients: 120,
    thumbnails: 1500,
    views: 25,
  },
  reviews: [
    {
      id: "1",
      name: "Sarah Johnson",
      image: "/placeholder.svg",
      review:
        "Ali designed amazing thumbnails that doubled my CTR within weeks. Highly recommend!",
      stars: 5,
    },
    {
      id: "2",
      name: "Mike Williams",
      image: "/placeholder.svg",
      review:
        "Professional service and quick turnaround. My channel growth has been incredible since working with Ali.",
      stars: 5,
    },
    {
      id: "3",
      name: "Emma Davis",
      image: "/placeholder.svg",
      review:
        "Great communication and understood exactly what my channel needed. Will definitely use again!",
      stars: 4,
    },
  ],
  socialMedia: [
    {
      platform: "Instagram",
      url: "https://instagram.com/4liusman",
      enabled: true,
    },
    { platform: "Twitter", url: "https://twitter.com/4liusman", enabled: true },
    {
      platform: "Facebook",
      url: "https://facebook.com/4liusman",
      enabled: true,
    },
    {
      platform: "LinkedIn",
      url: "https://linkedin.com/in/4liusman",
      enabled: true,
    },
    {
      platform: "YouTube",
      url: "https://youtube.com/@4liusman",
      enabled: false,
    },
  ],
};

const defaultPortfolioData: PortfolioData = {
  gaming: [],
  tech: [],
  lifestyle: [],
  educational: [],
};

const Services = () => {
  const [pageData, setPageData] =
    useState<ServicesPageData>(defaultServicesData);
  const [portfolioData, setPortfolioData] =
    useState<PortfolioData>(defaultPortfolioData);
  const [inView, setInView] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedData = localStorage.getItem("servicesPageData");
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        if (!parsedData.socialMedia) {
          parsedData.socialMedia = defaultServicesData.socialMedia;
        }

        if (parsedData.categories) {
          parsedData.categories = parsedData.categories.map(
            (category: ServiceCategory) => ({
              ...category,
              thumbnailUrl: category.thumbnailUrl || "/placeholder.svg",
            })
          );
        }

        setPageData(parsedData);
      }

      const portfolioStored = localStorage.getItem("portfolioData");
      if (portfolioStored) {
        const parsedPortfolio = JSON.parse(portfolioStored);
        setPortfolioData(parsedPortfolio);

        if (storedData) {
          const parsedServices = JSON.parse(storedData);
          let needsUpdate = false;

          const updatedCategories = parsedServices.categories?.map(
            (category: ServiceCategory) => {
              const categoryName = category.link.split("/").pop();
              if (
                categoryName &&
                parsedPortfolio[categoryName as keyof PortfolioData]
              ) {
                const items =
                  parsedPortfolio[categoryName as keyof PortfolioData];
                if (
                  items &&
                  items.length > 0 &&
                  items[0].imageUrl &&
                  items[0].imageUrl !== "/placeholder.svg"
                ) {
                  needsUpdate = true;
                  return {
                    ...category,
                    thumbnailUrl: items[0].imageUrl,
                  };
                }
              }
              return category;
            }
          );

          if (needsUpdate) {
            parsedServices.categories = updatedCategories;
            localStorage.setItem(
              "servicesPageData",
              JSON.stringify(parsedServices)
            );
            setPageData(parsedServices);
          }
        }
      }
    } catch (error) {
      console.error("Error loading services page data:", error);
    }

    const timer = setTimeout(() => {
      setInView(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const renderStars = (count: number) => {
    return Array(5)
      .fill(0)
      .map((_, i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i < count
              ? "text-yellow-400 fill-yellow-400"
              : "text-muted-foreground"
          }`}
        />
      ));
  };

  const getSocialIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram className="h-5 w-5" />;
      case "twitter":
        return <Twitter className="h-5 w-5" />;
      case "facebook":
        return <Facebook className="h-5 w-5" />;
      case "linkedin":
        return <Linkedin className="h-5 w-5" />;
      case "youtube":
        return <Youtube className="h-5 w-5" />;
      default:
        return <Globe className="h-5 w-5" />;
    }
  };

  const getCategoryThumbnails = (category: string) => {
    return portfolioData[category as keyof PortfolioData] || [];
  };

  const getThumbnailUrl = (category: ServiceCategory) => {
    if (category.thumbnailUrl && category.thumbnailUrl !== "/placeholder.svg") {
      return category.thumbnailUrl;
    }

    const categoryName = category.link.split("/").pop();
    if (categoryName && portfolioData[categoryName as keyof PortfolioData]) {
      const items = portfolioData[categoryName as keyof PortfolioData];
      if (
        items.length > 0 &&
        items[0].imageUrl &&
        items[0].imageUrl !== "/placeholder.svg"
      ) {
        return items[0].imageUrl;
      }
    }

    return "/placeholder.svg";
  };

  return (
    <div className="min-h-screen pt-24 pb-20">
      <SEO
        title="YouTube Services | Xtrayt "
        description="Professional YouTube thumbnail design services to help grow your channel with higher click-through rates."
        canonicalUrl="https://ytubetool.com/services"
        pageName="services"
      />

      <div className="container mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center mb-16 text-center"
        >
          <Avatar className="h-28 w-28 mb-4">
            <AvatarImage
              src={pageData.profile.avatar}
              alt={pageData.profile.name}
            />
            <AvatarFallback>
              {pageData.profile.name.substring(0, 2)}
            </AvatarFallback>
          </Avatar>

          <p className="text-sm text-primary mb-2">
            {pageData.profile.socialHandle}
          </p>
          <h1 className="text-3xl font-bold mb-1">{pageData.profile.name}</h1>
          <div className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm mb-4">
            {pageData.profile.title}
          </div>

          <p className="text-lg font-medium mb-3">{pageData.profile.bio}</p>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            {pageData.profile.description}
          </p>

          <div className="flex space-x-4">
            {pageData.socialMedia
              ?.filter((sm) => sm.enabled)
              .map((social, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                  onClick={() => window.open(social.url, "_blank")}
                >
                  {getSocialIcon(social.platform)}
                </Button>
              ))}
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-20"
        >
          <h2 className="text-2xl font-bold text-center mb-8">
            Thumbnail Categories
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 1,
                title: "Documentary",
                description: "Captivating real-life stories",
                link: "/documentary",
                images: [
                  "https://i.pinimg.com/736x/69/fd/cc/69fdcc488912143e54c3382ed23bdb68.jpg",
                  "https://i.pinimg.com/736x/1a/6c/6d/1a6c6d0c649f48ff3806d86e5c864f94.jpg",
                  "https://i.pinimg.com/736x/c2/ca/81/c2ca81545b6b13d8ff9c68b285186743.jpg",
                ],
              },
              {
                id: 2,
                title: "Sports",
                description: "Action-packed sports moments",
                link: "/sports",
                images: [
                  "https://i.pinimg.com/736x/bd/57/5a/bd575a3e11df8c6933edb4f1eb648423.jpg",
                ],
              },
              {
                id: 3,
                title: "Tech",
                description: "Cutting-edge technology",
                link: "/tech",
                images: [
                  "https://i.pinimg.com/736x/ed/13/0c/ed130ce94b73728f3708b228dfb2e0cf.jpg",
                  "https://i.pinimg.com/736x/02/00/bc/0200bcb0078b98b389ac34a8687e4b5b.jpg",
                ],
              },
            ].map((category, index) => {
              // Select the first image for each category as the thumbnail
              const thumbnailUrl = category.images[0];

              return (
                <motion.div
                  key={category.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                  className="flex flex-col"
                >
                  <Card
                    className="h-full hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => navigate(category.link)}
                  >
                    <CardContent className="p-6 flex flex-col">
                      <div className="aspect-video mb-4 overflow-hidden rounded-md bg-secondary">
                        <img
                          src={thumbnailUrl}
                          alt={category.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src =
                              "/placeholder.svg";
                          }}
                        />
                      </div>
                      <h3 className="text-xl font-semibold mb-2">
                        {category.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {category.description}
                      </p>
                      <Button variant="outline" className="mt-auto w-full">
                        View Portfolio
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mb-20"
        >
          <h2 className="text-2xl font-bold text-center mb-8">Our Results</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="text-center p-8 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Happy Clients
              </h3>
              <p className="text-4xl font-bold">
                {inView ? <CountUp end={pageData.stats.clients} /> : 0}
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Thumbnails Created
              </h3>
              <p className="text-4xl font-bold">
                {inView ? <CountUp end={pageData.stats.thumbnails} /> : 0}
              </p>
            </Card>

            <Card className="text-center p-8 hover:shadow-md transition-shadow">
              <h3 className="text-lg font-medium text-muted-foreground mb-2">
                Video Views Generated
              </h3>
              <p className="text-4xl font-bold">
                {inView ? (
                  <CountUp end={pageData.stats.views} duration={2500} />
                ) : (
                  0
                )}
                M+
              </p>
            </Card>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
          className="text-center mt-16"
        >
          <h2 className="text-2xl font-semibold mb-4">
            Ready to boost your channel?
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto mb-6">
            Get professional thumbnails that increase your click-through rate
            and grow your YouTube channel.
          </p>
          <Button size="lg" asChild>
            <a href="/features">Explore Our Tools</a>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default Services;
