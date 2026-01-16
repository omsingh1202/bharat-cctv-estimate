import { Camera, Phone, Mail, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-card/50 border-t border-border/50 py-12">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <Camera className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="font-display font-bold">Bharat Multi Services</h3>
                <p className="text-xs text-muted-foreground">Nagpur</p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Professional CCTV installation and maintenance services for homes and businesses in Nagpur and surrounding areas.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-display font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">Home</Link></li>
              <li><Link to="/estimator" className="text-sm text-muted-foreground hover:text-primary transition-colors">Price Estimator</Link></li>
              <li><Link to="/maintenance" className="text-sm text-muted-foreground hover:text-primary transition-colors">Maintenance Plans</Link></li>
              <li><Link to="/gallery" className="text-sm text-muted-foreground hover:text-primary transition-colors">Gallery</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-display font-semibold mb-4">Services</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>CCTV Installation</li>
              <li>DVR Setup</li>
              <li>Remote Monitoring</li>
              <li>Annual Maintenance</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                +91 98765 43210
              </li>
              <li className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                bharatmultiservicesnagpur@gmail.com
              </li>
              <li className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary mt-0.5" />
                Nagpur, Maharashtra, India
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-border/50 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} Bharat Multi Services. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
