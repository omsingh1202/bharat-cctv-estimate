import { useState, useEffect } from 'react';
import { Shield, Save, LogOut, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loadPricing, savePricing, defaultPricing, type PricingData } from '@/lib/pricing';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pricing, setPricing] = useState<PricingData>(defaultPricing);
  const { toast } = useToast();

  useEffect(() => {
    const loggedIn = localStorage.getItem('bms_admin_logged_in');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
      setPricing(loadPricing());
    }
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication (in production, use proper auth)
    if (email === 'bharatmultiservicesnagpur@gmail.com' && password === 'Bms@1234') {
      setIsLoggedIn(true);
      localStorage.setItem('bms_admin_logged_in', 'true');
      setPricing(loadPricing());
      toast({
        title: 'Login Successful',
        description: 'Welcome to the admin panel.',
      });
    } else {
      toast({
        title: 'Login Failed',
        description: 'Invalid email or password.',
        variant: 'destructive',
      });
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('bms_admin_logged_in');
    setEmail('');
    setPassword('');
  };

  const handleSave = () => {
    savePricing(pricing);
    toast({
      title: 'Prices Updated',
      description: 'All pricing changes have been saved.',
    });
  };

  const updatePricing = (category: keyof PricingData, key: string, value: number) => {
    setPricing(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [key]: value,
      },
    }));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const PriceInput = ({ 
    label, 
    value, 
    onChange 
  }: { 
    label: string; 
    value: number; 
    onChange: (v: number) => void;
  }) => (
    <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30 border border-border/50">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-2">
        <span className="text-muted-foreground">₹</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value) || 0)}
          className="w-24 p-2 rounded bg-background border border-border text-right text-sm"
        />
      </div>
    </div>
  );

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen pt-20 pb-12 flex items-center justify-center">
        <div className="glass-card p-8 w-full max-w-md">
          <div className="text-center mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h1 className="font-display text-2xl font-bold">Admin Login</h1>
            <p className="text-sm text-muted-foreground mt-2">
              Sign in to manage pricing and settings
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                className="w-full p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" variant="hero" className="w-full">
              <Shield className="w-5 h-5" />
              Login
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">
              <span className="gradient-text">Admin Dashboard</span>
            </h1>
            <p className="text-muted-foreground">Manage your CCTV pricing and settings</p>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="hero" onClick={handleSave}>
              <Save className="w-4 h-4" />
              Save All Changes
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Cameras */}
          <div className="glass-card p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Camera Prices</h2>
            <div className="space-y-3">
              <PriceInput 
                label="Bullet Camera (CP Plus)" 
                value={pricing.cameras.bullet} 
                onChange={(v) => updatePricing('cameras', 'bullet', v)} 
              />
              <PriceInput 
                label="Dome Camera" 
                value={pricing.cameras.dome} 
                onChange={(v) => updatePricing('cameras', 'dome', v)} 
              />
              <PriceInput 
                label="Other CCTV Camera" 
                value={pricing.cameras.other} 
                onChange={(v) => updatePricing('cameras', 'other', v)} 
              />
            </div>
          </div>

          {/* DVR */}
          <div className="glass-card p-6">
            <h2 className="font-display font-semibold text-lg mb-4">DVR Prices</h2>
            <div className="space-y-3">
              <PriceInput label="2 Channel" value={pricing.dvr.ch2} onChange={(v) => updatePricing('dvr', 'ch2', v)} />
              <PriceInput label="4 Channel" value={pricing.dvr.ch4} onChange={(v) => updatePricing('dvr', 'ch4', v)} />
              <PriceInput label="8 Channel" value={pricing.dvr.ch8} onChange={(v) => updatePricing('dvr', 'ch8', v)} />
              <PriceInput label="16 Channel" value={pricing.dvr.ch16} onChange={(v) => updatePricing('dvr', 'ch16', v)} />
              <PriceInput label="32 Channel" value={pricing.dvr.ch32} onChange={(v) => updatePricing('dvr', 'ch32', v)} />
            </div>
          </div>

          {/* Hard Disk */}
          <div className="glass-card p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Hard Disk Prices</h2>
            <div className="space-y-3">
              <PriceInput label="1 TB" value={pricing.hardDisk.tb1} onChange={(v) => updatePricing('hardDisk', 'tb1', v)} />
              <PriceInput label="2 TB" value={pricing.hardDisk.tb2} onChange={(v) => updatePricing('hardDisk', 'tb2', v)} />
              <PriceInput label="4 TB" value={pricing.hardDisk.tb4} onChange={(v) => updatePricing('hardDisk', 'tb4', v)} />
              <PriceInput label="6 TB" value={pricing.hardDisk.tb6} onChange={(v) => updatePricing('hardDisk', 'tb6', v)} />
              <PriceInput label="8 TB" value={pricing.hardDisk.tb8} onChange={(v) => updatePricing('hardDisk', 'tb8', v)} />
            </div>
          </div>

          {/* Power Supply */}
          <div className="glass-card p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Power Supply Prices</h2>
            <div className="space-y-3">
              <PriceInput label="2 Channel" value={pricing.powerSupply.ch2} onChange={(v) => updatePricing('powerSupply', 'ch2', v)} />
              <PriceInput label="4 Channel" value={pricing.powerSupply.ch4} onChange={(v) => updatePricing('powerSupply', 'ch4', v)} />
              <PriceInput label="8 Channel" value={pricing.powerSupply.ch8} onChange={(v) => updatePricing('powerSupply', 'ch8', v)} />
              <PriceInput label="16 Channel" value={pricing.powerSupply.ch16} onChange={(v) => updatePricing('powerSupply', 'ch16', v)} />
              <PriceInput label="32 Channel" value={pricing.powerSupply.ch32} onChange={(v) => updatePricing('powerSupply', 'ch32', v)} />
            </div>
          </div>

          {/* Accessories */}
          <div className="glass-card p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Accessories Prices</h2>
            <div className="space-y-3">
              <PriceInput label="Wire (per meter)" value={pricing.accessories.wirePerMeter} onChange={(v) => updatePricing('accessories', 'wirePerMeter', v)} />
              <PriceInput label="BNC Connector" value={pricing.accessories.bncConnector} onChange={(v) => updatePricing('accessories', 'bncConnector', v)} />
              <PriceInput label="DC Connector" value={pricing.accessories.dcConnector} onChange={(v) => updatePricing('accessories', 'dcConnector', v)} />
              <PriceInput label="PVC Box" value={pricing.accessories.pvcBox} onChange={(v) => updatePricing('accessories', 'pvcBox', v)} />
              <PriceInput label="HDMI Cable" value={pricing.accessories.hdmiCable} onChange={(v) => updatePricing('accessories', 'hdmiCable', v)} />
              <PriceInput label="VGA Cable" value={pricing.accessories.vgaCable} onChange={(v) => updatePricing('accessories', 'vgaCable', v)} />
              <PriceInput label="Monitor" value={pricing.accessories.monitor} onChange={(v) => updatePricing('accessories', 'monitor', v)} />
              <PriceInput label="Rack / Cabinet" value={pricing.accessories.rack} onChange={(v) => updatePricing('accessories', 'rack', v)} />
            </div>
          </div>

          {/* Labor Charges */}
          <div className="glass-card p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Labor Charges</h2>
            <div className="space-y-3">
              <PriceInput label="2 Cameras" value={pricing.labor.cam2} onChange={(v) => updatePricing('labor', 'cam2', v)} />
              <PriceInput label="4 Cameras" value={pricing.labor.cam4} onChange={(v) => updatePricing('labor', 'cam4', v)} />
              <PriceInput label="8 Cameras" value={pricing.labor.cam8} onChange={(v) => updatePricing('labor', 'cam8', v)} />
              <PriceInput label="16 Cameras" value={pricing.labor.cam16} onChange={(v) => updatePricing('labor', 'cam16', v)} />
              <PriceInput label="32 Cameras" value={pricing.labor.cam32} onChange={(v) => updatePricing('labor', 'cam32', v)} />
            </div>
          </div>

          {/* Distance Charges */}
          <div className="glass-card p-6">
            <h2 className="font-display font-semibold text-lg mb-4">Distance Charges</h2>
            <div className="space-y-3">
              <PriceInput label="Up to 20 km" value={pricing.distance.km20} onChange={(v) => updatePricing('distance', 'km20', v)} />
              <PriceInput label="Up to 50 km" value={pricing.distance.km50} onChange={(v) => updatePricing('distance', 'km50', v)} />
              <PriceInput label="Up to 100 km" value={pricing.distance.km100} onChange={(v) => updatePricing('distance', 'km100', v)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
