import { useState, useEffect } from 'react';
import { Shield, Save, LogOut, Eye, EyeOff, Trash2, Clock, CheckCircle, Loader2, FileText, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loadPricing, savePricing, defaultPricing, type PricingData } from '@/lib/pricing';
import { loadInquiries, updateInquiryStatus, deleteInquiry, type Inquiry, type InquiryStatus } from '@/lib/inquiries';
import { useToast } from '@/hooks/use-toast';

const Admin = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [pricing, setPricing] = useState<PricingData>(defaultPricing);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [activeTab, setActiveTab] = useState<'pricing' | 'inquiries'>('inquiries');
  const { toast } = useToast();

  useEffect(() => {
    const loggedIn = localStorage.getItem('bms_admin_logged_in');
    if (loggedIn === 'true') {
      setIsLoggedIn(true);
      setPricing(loadPricing());
      setInquiries(loadInquiries());
    }
  }, []);

  const refreshInquiries = () => {
    setInquiries(loadInquiries());
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple authentication (in production, use proper auth)
    if (email === 'bharatmultiservicesnagpur@gmail.com' && password === 'Bms@1234') {
      setIsLoggedIn(true);
      localStorage.setItem('bms_admin_logged_in', 'true');
      setPricing(loadPricing());
      setInquiries(loadInquiries());
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

  const handleStatusChange = (id: string, status: InquiryStatus) => {
    updateInquiryStatus(id, status);
    refreshInquiries();
    toast({
      title: 'Status Updated',
      description: `Project marked as ${status.replace('_', ' ')}.`,
    });
  };

  const handleDeleteInquiry = (id: string) => {
    deleteInquiry(id);
    refreshInquiries();
    toast({
      title: 'Inquiry Deleted',
      description: 'The inquiry has been removed.',
    });
  };

  const getStatusIcon = (status: InquiryStatus) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in_progress': return <Loader2 className="w-4 h-4" />;
      case 'complete': return <CheckCircle className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: InquiryStatus) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'in_progress': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'complete': return 'bg-green-500/20 text-green-400 border-green-500/30';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">
              <span className="gradient-text">Admin Dashboard</span>
            </h1>
            <p className="text-muted-foreground">Manage your CCTV pricing and inquiries</p>
          </div>
          <div className="flex items-center gap-4">
            {activeTab === 'pricing' && (
              <Button variant="hero" onClick={handleSave}>
                <Save className="w-4 h-4" />
                Save All Changes
              </Button>
            )}
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="w-4 h-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => setActiveTab('inquiries')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'inquiries'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
            }`}
          >
            <MessageCircle className="w-4 h-4" />
            Inquiries ({inquiries.length})
          </button>
          <button
            onClick={() => setActiveTab('pricing')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              activeTab === 'pricing'
                ? 'bg-primary text-primary-foreground'
                : 'bg-muted/30 text-muted-foreground hover:bg-muted/50'
            }`}
          >
            <FileText className="w-4 h-4" />
            Pricing
          </button>
        </div>

        {activeTab === 'inquiries' && (
          <div className="space-y-4">
            {inquiries.length === 0 ? (
              <div className="glass-card p-12 text-center">
                <MessageCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="font-display font-semibold text-lg mb-2">No Inquiries Yet</h3>
                <p className="text-muted-foreground">
                  When customers send estimates or inquiries via WhatsApp, they will appear here.
                </p>
              </div>
            ) : (
              inquiries.map((inquiry) => (
                <div key={inquiry.id} className="glass-card p-6">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(inquiry.status)}`}>
                          {getStatusIcon(inquiry.status)}
                          {inquiry.status.replace('_', ' ').toUpperCase()}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatDate(inquiry.createdAt)}
                        </span>
                        <span className={`text-xs px-2 py-0.5 rounded ${inquiry.type === 'estimate' ? 'bg-primary/20 text-primary' : 'bg-accent/20 text-accent-foreground'}`}>
                          {inquiry.type === 'estimate' ? 'Estimate' : 'Contact'}
                        </span>
                      </div>

                      {inquiry.customerName && (
                        <p className="text-sm mb-1">
                          <span className="text-muted-foreground">Name:</span> {inquiry.customerName}
                        </p>
                      )}
                      {inquiry.customerPhone && (
                        <p className="text-sm mb-1">
                          <span className="text-muted-foreground">Phone:</span>{' '}
                          <a href={`tel:${inquiry.customerPhone}`} className="text-primary hover:underline">
                            {inquiry.customerPhone}
                          </a>
                        </p>
                      )}
                      {inquiry.message && (
                        <p className="text-sm mb-2">
                          <span className="text-muted-foreground">Message:</span> {inquiry.message}
                        </p>
                      )}

                      {inquiry.estimateDetails && (
                        <div className="mt-3 p-3 rounded-lg bg-muted/20 border border-border/50">
                          <p className="text-sm font-medium mb-2">Estimate Details:</p>
                          <div className="space-y-1 text-xs">
                            {inquiry.estimateDetails.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between">
                                <span>{item.name} x{item.quantity}</span>
                                <span>{formatCurrency(item.total)}</span>
                              </div>
                            ))}
                            <div className="border-t border-border/50 pt-1 mt-2">
                              <div className="flex justify-between">
                                <span>Materials:</span>
                                <span>{formatCurrency(inquiry.estimateDetails.materialTotal)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Labor:</span>
                                <span>{formatCurrency(inquiry.estimateDetails.laborCharge)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Distance:</span>
                                <span>{formatCurrency(inquiry.estimateDetails.distanceCharge)}</span>
                              </div>
                              <div className="flex justify-between font-semibold text-sm pt-1">
                                <span>Grand Total:</span>
                                <span className="text-primary">{formatCurrency(inquiry.estimateDetails.grandTotal)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <select
                        value={inquiry.status}
                        onChange={(e) => handleStatusChange(inquiry.id, e.target.value as InquiryStatus)}
                        className="text-xs p-2 rounded bg-muted/30 border border-border/50 text-foreground"
                      >
                        <option value="pending">Pending</option>
                        <option value="in_progress">In Progress</option>
                        <option value="complete">Complete</option>
                      </select>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteInquiry(inquiry.id)}
                        className="text-destructive hover:text-destructive"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'pricing' && (
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
        )}
      </div>
    </div>
  );
};

export default Admin;
