import { Phone, Mail, MapPin, Clock, MessageCircle, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { addInquiry } from '@/lib/inquiries';
import { useToast } from '@/hooks/use-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    message: '',
  });
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Save inquiry to local storage
    addInquiry({
      type: 'contact',
      customerName: formData.name,
      customerPhone: formData.phone,
      message: formData.message,
    });
    
    toast({
      title: 'Inquiry Saved',
      description: 'Your inquiry has been recorded.',
    });
    
    const message = `*New Inquiry from Website*\n\nName: ${formData.name}\nPhone: ${formData.phone}\nMessage: ${formData.message}`;
    window.open(`https://wa.me/919876543210?text=${encodeURIComponent(message)}`, '_blank');
    
    // Reset form
    setFormData({ name: '', phone: '', message: '' });
  };

  const contactInfo = [
    {
      icon: Phone,
      title: 'Phone',
      value: '+91 98765 43210',
      action: 'tel:+919876543210',
    },
    {
      icon: Mail,
      title: 'Email',
      value: 'bharatmultiservicesnagpur@gmail.com',
      action: 'mailto:bharatmultiservicesnagpur@gmail.com',
    },
    {
      icon: MapPin,
      title: 'Location',
      value: 'Nagpur, Maharashtra, India',
      action: null,
    },
    {
      icon: Clock,
      title: 'Business Hours',
      value: 'Mon - Sat: 9 AM - 7 PM',
      action: null,
    },
  ];

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-4">
            <MessageCircle className="w-4 h-4" />
            Get in Touch
          </div>
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">Contact Us</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Have questions about CCTV installation? We're here to help. Reach out via WhatsApp for the fastest response.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="font-display font-semibold text-xl mb-6">Contact Information</h2>
              <div className="space-y-4">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">{item.title}</div>
                      {item.action ? (
                        <a 
                          href={item.action} 
                          className="font-medium hover:text-primary transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <div className="font-medium">{item.value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* WhatsApp CTA */}
            <div className="glass-card p-6 bg-[hsl(142,70%,45%)]/10 border-[hsl(142,70%,45%)]/30">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-[hsl(142,70%,45%)] flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-display font-semibold">WhatsApp Us</h3>
                  <p className="text-sm text-muted-foreground">Fastest way to reach us</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Send us a message on WhatsApp for quick quotes, queries, or to schedule a site visit.
              </p>
              <a href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer">
                <Button variant="whatsapp" className="w-full">
                  <MessageCircle className="w-5 h-5" />
                  Open WhatsApp Chat
                </Button>
              </a>
            </div>
          </div>

          {/* Contact Form */}
          <div className="glass-card p-6">
            <h2 className="font-display font-semibold text-xl mb-6">Send an Inquiry</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Your Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter your name"
                  className="w-full p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Phone Number</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Enter your phone number"
                  className="w-full p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  required
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Your Message</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your CCTV requirements..."
                  rows={4}
                  className="w-full p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                  required
                />
              </div>
              <Button type="submit" variant="hero" className="w-full">
                <Send className="w-5 h-5" />
                Send via WhatsApp
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                This will open WhatsApp with your message ready to send.
              </p>
            </form>
          </div>
        </div>

        {/* Service Area */}
        <div className="mt-12 text-center">
          <div className="glass-card p-6 max-w-2xl mx-auto">
            <h3 className="font-display font-semibold text-lg mb-3">Our Service Area</h3>
            <p className="text-muted-foreground text-sm mb-4">
              We provide CCTV installation services in Nagpur and surrounding areas including:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {['Nagpur City', 'Wardha', 'Chandrapur', 'Amravati', 'Bhandara', 'Gondia', 'Yavatmal'].map((area) => (
                <span key={area} className="px-3 py-1 rounded-full bg-muted/50 text-sm">
                  {area}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
