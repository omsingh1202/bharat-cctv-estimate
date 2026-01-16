import { Link } from 'react-router-dom';
import { Camera, Shield, Wrench, Calculator, ArrowRight, CheckCircle, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Home = () => {
  const features = [
    {
      icon: Camera,
      title: 'HD CCTV Systems',
      description: 'High-definition cameras with night vision and weatherproof housing for 24/7 surveillance.',
    },
    {
      icon: Shield,
      title: 'Professional Installation',
      description: 'Expert technicians ensure optimal camera placement and secure wiring for maximum coverage.',
    },
    {
      icon: Wrench,
      title: 'Maintenance & Support',
      description: 'Regular maintenance plans and quick support to keep your security systems running perfectly.',
    },
    {
      icon: Calculator,
      title: 'Transparent Pricing',
      description: 'Use our online estimator to get instant quotes with detailed cost breakdowns.',
    },
  ];

  const benefits = [
    'CP Plus & Premium Brand Cameras',
    'Free Site Survey in Nagpur',
    'Same-Day Installation Available',
    'Remote Viewing on Mobile',
    '1 Year Warranty on Installation',
    'AMC Plans Available',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(199_89%_48%/0.1)_0%,transparent_50%)]" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-fade-in">
              <Shield className="w-4 h-4" />
              Trusted CCTV Solutions in Nagpur
            </div>
            
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 animate-slide-up">
              Protect What Matters with
              <span className="gradient-text block mt-2">Professional CCTV Systems</span>
            </h1>
            
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto animate-fade-in">
              Bharat Multi Services provides complete CCTV installation, setup, and maintenance for homes and businesses across Nagpur and nearby areas.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in">
              <Link to="/estimator">
                <Button variant="hero" size="xl">
                  <Calculator className="w-5 h-5" />
                  Get Free Estimate
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="xl">
                  <Phone className="w-5 h-5" />
                  WhatsApp Us
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">Why Choose Us?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We combine quality products with expert installation and ongoing support for complete peace of mind.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="glass-card p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 group"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold text-lg mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6">
                Complete Security Solutions for
                <span className="gradient-text block">Every Budget</span>
              </h2>
              <p className="text-muted-foreground mb-8">
                Whether you need a simple 2-camera setup for your home or a comprehensive 32-camera system for your business, we have the right solution at the right price.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-sm">{benefit}</span>
                  </div>
                ))}
              </div>
              
              <Link to="/estimator">
                <Button variant="hero" size="lg">
                  Calculate Your Price
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
            
            <div className="relative">
              <div className="glass-card p-8 glow-effect">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 border border-primary/20 mb-4">
                    <Camera className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-2">Starting at just</h3>
                  <div className="text-4xl font-bold gradient-text mb-2">₹8,500</div>
                  <p className="text-muted-foreground text-sm">for a complete 2-camera setup</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-card/30">
        <div className="container mx-auto px-4">
          <div className="glass-card p-8 md:p-12 text-center max-w-3xl mx-auto">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Ready to Secure Your Property?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Get a free consultation and quote today. Our team will help you choose the perfect CCTV solution for your needs.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/contact">
                <Button variant="hero" size="lg">
                  Contact Us Now
                </Button>
              </Link>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" size="lg">
                  <Phone className="w-5 h-5" />
                  WhatsApp Inquiry
                </Button>
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
