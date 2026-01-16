import { useState } from 'react';
import { Camera, X } from 'lucide-react';

const Gallery = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Gallery items with placeholder descriptions
  const galleryItems = [
    { id: 1, title: 'Warehouse Installation', category: 'Commercial', description: '16-camera setup with night vision' },
    { id: 2, title: 'Retail Store Security', category: 'Commercial', description: '8-camera HD surveillance system' },
    { id: 3, title: 'Home Security', category: 'Residential', description: '4-camera outdoor setup' },
    { id: 4, title: 'Office Building', category: 'Commercial', description: '32-camera comprehensive coverage' },
    { id: 5, title: 'Factory Floor', category: 'Industrial', description: 'Wide-angle cameras with PTZ' },
    { id: 6, title: 'Apartment Complex', category: 'Residential', description: 'Common area surveillance' },
    { id: 7, title: 'School Campus', category: 'Institutional', description: 'Entry/exit monitoring system' },
    { id: 8, title: 'Parking Lot', category: 'Commercial', description: 'Night vision with motion detection' },
  ];

  const categories = ['All', ...new Set(galleryItems.map(item => item.category))];
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredItems = activeCategory === 'All' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <Camera className="w-4 h-4" />
            Our Work
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Installation Gallery</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Browse through our completed CCTV installations across Nagpur and surrounding areas.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeCategory === category
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted/50 text-muted-foreground hover:bg-muted'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="glass-card overflow-hidden group cursor-pointer"
              onClick={() => setSelectedImage(item.title)}
            >
              {/* Placeholder image area */}
              <div className="aspect-square bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 group-hover:bg-primary/10 transition-colors" />
                <Camera className="w-16 h-16 text-muted-foreground/30" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <div className="p-4">
                <div className="text-xs text-primary font-medium mb-1">{item.category}</div>
                <h3 className="font-semibold mb-1">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Empty state if no items */}
        {filteredItems.length === 0 && (
          <div className="text-center py-16">
            <Camera className="w-16 h-16 mx-auto text-muted-foreground/30 mb-4" />
            <p className="text-muted-foreground">No installations found in this category.</p>
          </div>
        )}

        {/* Lightbox */}
        {selectedImage && (
          <div 
            className="fixed inset-0 z-50 bg-background/90 backdrop-blur-sm flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <div className="glass-card max-w-2xl w-full p-6 relative">
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 p-2 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center mb-4">
                <Camera className="w-24 h-24 text-muted-foreground/30" />
              </div>
              <h3 className="font-display font-semibold text-xl">{selectedImage}</h3>
              <p className="text-muted-foreground mt-2">
                Professional CCTV installation by Bharat Multi Services. Contact us for similar solutions.
              </p>
            </div>
          </div>
        )}

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Want to see more or discuss your project?
          </p>
          <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
            <button className="px-6 py-3 rounded-lg bg-[hsl(142,70%,45%)] text-white font-medium hover:bg-[hsl(142,70%,40%)] transition-colors">
              Contact Us on WhatsApp
            </button>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
