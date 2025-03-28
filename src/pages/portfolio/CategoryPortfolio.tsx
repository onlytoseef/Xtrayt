
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, ImageOff } from 'lucide-react';
import SEO from '@/components/SEO';

interface ServiceCategory {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
  thumbnailUrl: string;
  portfolioItems?: PortfolioItem[];
}

interface PortfolioItem {
  id: string;
  title: string;
  imageUrl: string;
  description?: string;
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
  stats: {
    clients: number;
    thumbnails: number;
    views: number;
  };
  reviews: any[];
  socialMedia: any[];
}

const CategoryPortfolio = () => {
  const { categoryId } = useParams<{ categoryId: string }>();
  const [category, setCategory] = useState<ServiceCategory | null>(null);
  const [portfolioItems, setPortfolioItems] = useState<PortfolioItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCategory = () => {
      try {
        const savedData = localStorage.getItem('servicesPageData');
        if (savedData) {
          const data: ServicesPageData = JSON.parse(savedData);
          const foundCategory = data.categories.find(cat => {
            // Match by path segment or by title (normalized)
            const catPath = cat.link.split('/').pop();
            return catPath === categoryId || 
                   cat.title.toLowerCase().replace(/\s+/g, '-') === categoryId;
          });
          
          if (foundCategory) {
            setCategory(foundCategory);
            
            // Load portfolio items if they exist
            if (foundCategory.portfolioItems && foundCategory.portfolioItems.length > 0) {
              setPortfolioItems(foundCategory.portfolioItems);
            }
          }
        }
      } catch (error) {
        console.error('Error loading category data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCategory();
  }, [categoryId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 pb-20 container mx-auto flex justify-center items-center">
        <div className="animate-pulse">Loading...</div>
      </div>
    );
  }

  if (!category) {
    return (
      <div className="min-h-screen pt-24 pb-20 container mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4">
          <h1 className="text-2xl font-bold">Category Not Found</h1>
          <p className="text-muted-foreground">The category you're looking for doesn't exist or hasn't been set up yet.</p>
          <Link to="/services">
            <Button>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-20 container mx-auto">
      <SEO
        title={`${category.title} Portfolio`}
        description={category.description}
      />
      
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Link to="/services">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Services
            </Button>
          </Link>
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-bold">{category.title}</h1>
          <p className="text-muted-foreground">{category.description}</p>
        </div>
        
        {/* Main thumbnail display */}
        <Card>
          <CardContent className="p-6">
            <div className="aspect-video w-full overflow-hidden rounded-md relative">
              <img
                src={category.thumbnailUrl || '/placeholder.svg'}
                alt={category.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = '/placeholder.svg';
                  target.onerror = null;
                }}
              />
            </div>
          </CardContent>
        </Card>
        
        {/* Portfolio items grid */}
        {portfolioItems && portfolioItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
            {portfolioItems.map((item) => (
              <Card key={item.id} className="overflow-hidden">
                <CardContent className="p-0">
                  <div className="relative">
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={item.imageUrl || '/placeholder.svg'}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = '/placeholder.svg';
                          target.onerror = null;
                        }}
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="font-medium">{item.title}</h3>
                      {item.description && (
                        <p className="text-sm text-muted-foreground mt-1">{item.description}</p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-12 text-center space-y-4">
            <ImageOff className="h-16 w-16 text-muted-foreground/50" />
            <h3 className="text-lg font-medium">No portfolio items yet</h3>
            <p className="text-muted-foreground max-w-md">
              No additional portfolio items have been added to this category. Check back later or visit the main category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryPortfolio;
