/**
 * The Estimator function component provides a complete UI for estimating the price of a CCTV installation
 * system. It allows users to select various CCTV equipment, accessories, and specify details such as
 * wire length, location distance, and personal contact information. The component dynamically calculates
 * the materials cost, labor, and travel (distance) charges, then summarizes all values for the user.
 * 
 * Key features and their explanations:
 * 
 * - Uses React hooks (useState, useEffect, useMemo) for state management and computation.
 * - Manages selections for different product options: cameras (bullet, dome, other), DVR channels,
 *   hard disk size, power supply, wire length, and accessory checkboxes.
 * - Allows selection of a project location distance, which affects the travel charge.
 * - Collects customer name and phone number for inquiry submission.
 * - The "breakdown" useMemo creates an up-to-date list summarizing every item, quantity, per-unit price,
 *   and totals, along with overall sums for materials, labor, distance charges, and grand total.
 * - Functions for formatting currency, generating a WhatsApp message, validating/sending the inquiry,
 *   and enabling download of the quote as a text file.
 * - NumberInput is a helper component that provides plus/minus inputs for numeric options.
 * 
 * The UI is divided into a selection form (where users pick items, accessories, location, and enter details)
 * and an estimate summary (which shows itemized charges and a grand total, with options to WhatsApp
 * or download the estimate).
 */

import { useState, useEffect, useMemo } from 'react';
import { Camera, Package, Wrench, MapPin, Calculator, Download, Send, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loadPricing, getLaborCharge, getDistanceCharge, type PricingData } from '@/lib/pricing';
import { addInquiry, migrateLegacyInquiries } from '@/lib/inquiries';
import { useToast } from '@/hooks/use-toast';

interface EstimateItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const Estimator = () => {
  const { toast } = useToast();
  const [pricing, setPricing] = useState<PricingData>(loadPricing());
  const [isSending, setIsSending] = useState(false);
  
  // Camera selections
  const [bulletCameras, setBulletCameras] = useState(0);
  const [domeCameras, setDomeCameras] = useState(0);
  const [otherCameras, setOtherCameras] = useState(0);
  
  // DVR, Hard Disk & Power Supply
  const [dvrChannel, setDvrChannel] = useState<string>('');
  const [hardDisk, setHardDisk] = useState<string>('');
  const [powerChannel, setPowerChannel] = useState<string>('');
  
  // Accessories
  const [wireLength, setWireLength] = useState(0);
  const [bncConnectors, setBncConnectors] = useState(0);
  const [dcConnectors, setDcConnectors] = useState(0);
  const [pvcBoxes, setPvcBoxes] = useState(0);
  const [includeHdmi, setIncludeHdmi] = useState(false);
  const [includeVga, setIncludeVga] = useState(false);
  const [includeMonitor, setIncludeMonitor] = useState(false);
  const [includeRack, setIncludeRack] = useState(false);
  
  // Distance
  const [distance, setDistance] = useState<string>('');
  
  // Customer Details
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');

  // On mount, load the pricing and migrate inquiries if needed
  useEffect(() => {
    setPricing(loadPricing());
    migrateLegacyInquiries().catch((error) => {
      console.error('Legacy inquiry migration failed', error);
    });
  }, []);

  // Calculate the total number of cameras selected
  const totalCameras = bulletCameras + domeCameras + otherCameras;

  // Lookup tables for pricing per model/option
  const dvrPrices: Record<string, number> = {
    '2ch': pricing.dvr.ch2,
    '4ch': pricing.dvr.ch4,
    '8ch': pricing.dvr.ch8,
    '16ch': pricing.dvr.ch16,
    '32ch': pricing.dvr.ch32,
  };

  const hardDiskPrices: Record<string, number> = {
    '1tb': pricing.hardDisk.tb1,
    '2tb': pricing.hardDisk.tb2,
    '4tb': pricing.hardDisk.tb4,
    '6tb': pricing.hardDisk.tb6,
    '8tb': pricing.hardDisk.tb8,
  };

  const powerPrices: Record<string, number> = {
    '2ch': pricing.powerSupply.ch2,
    '4ch': pricing.powerSupply.ch4,
    '8ch': pricing.powerSupply.ch8,
    '16ch': pricing.powerSupply.ch16,
    '32ch': pricing.powerSupply.ch32,
  };

  /**
   *  breakdown: 
   *  Calculates all selected/checked items and their pricing, then computes:
   *    - materialTotal: sum of all selected item costs
   *    - laborCharge: calculated labor charge based on total cameras
   *    - distanceCharge: extra charge based on site distance
   *    - grandTotal: overall total of all the above
   * 
   *  The result is updated in real time whenever relevant selections change due to useMemo.
   */
  const breakdown = useMemo(() => {
    const items: EstimateItem[] = [];
    
    if (bulletCameras > 0) {
      items.push({
        name: 'Bullet Camera (CP Plus)',
        quantity: bulletCameras,
        unitPrice: pricing.cameras.bullet,
        total: bulletCameras * pricing.cameras.bullet,
      });
    }
    
    if (domeCameras > 0) {
      items.push({
        name: 'Dome Camera',
        quantity: domeCameras,
        unitPrice: pricing.cameras.dome,
        total: domeCameras * pricing.cameras.dome,
      });
    }
    
    if (otherCameras > 0) {
      items.push({
        name: 'Other CCTV Camera',
        quantity: otherCameras,
        unitPrice: pricing.cameras.other,
        total: otherCameras * pricing.cameras.other,
      });
    }
    
    if (dvrChannel && dvrPrices[dvrChannel]) {
      items.push({
        name: `DVR (${dvrChannel.toUpperCase()})`,
        quantity: 1,
        unitPrice: dvrPrices[dvrChannel],
        total: dvrPrices[dvrChannel],
      });
    }
    
    if (hardDisk && hardDiskPrices[hardDisk]) {
      items.push({
        name: `Hard Disk (${hardDisk.toUpperCase()})`,
        quantity: 1,
        unitPrice: hardDiskPrices[hardDisk],
        total: hardDiskPrices[hardDisk],
      });
    }
    
    if (powerChannel && powerPrices[powerChannel]) {
      items.push({
        name: `Power Supply (${powerChannel.toUpperCase()})`,
        quantity: 1,
        unitPrice: powerPrices[powerChannel],
        total: powerPrices[powerChannel],
      });
    }
    
    if (wireLength > 0) {
      items.push({
        name: '3+1 CCTV Cable',
        quantity: wireLength,
        unitPrice: pricing.accessories.wirePerMeter,
        total: wireLength * pricing.accessories.wirePerMeter,
      });
    }
    
    if (bncConnectors > 0) {
      items.push({
        name: 'BNC Connector',
        quantity: bncConnectors,
        unitPrice: pricing.accessories.bncConnector,
        total: bncConnectors * pricing.accessories.bncConnector,
      });
    }
    
    if (dcConnectors > 0) {
      items.push({
        name: 'DC Connector',
        quantity: dcConnectors,
        unitPrice: pricing.accessories.dcConnector,
        total: dcConnectors * pricing.accessories.dcConnector,
      });
    }
    
    if (pvcBoxes > 0) {
      items.push({
        name: 'PVC Box',
        quantity: pvcBoxes,
        unitPrice: pricing.accessories.pvcBox,
        total: pvcBoxes * pricing.accessories.pvcBox,
      });
    }
    
    if (includeHdmi) {
      items.push({
        name: 'HDMI Cable',
        quantity: 1,
        unitPrice: pricing.accessories.hdmiCable,
        total: pricing.accessories.hdmiCable,
      });
    }
    
    if (includeVga) {
      items.push({
        name: 'VGA Cable',
        quantity: 1,
        unitPrice: pricing.accessories.vgaCable,
        total: pricing.accessories.vgaCable,
      });
    }
    
    if (includeMonitor) {
      items.push({
        name: 'Monitor',
        quantity: 1,
        unitPrice: pricing.accessories.monitor,
        total: pricing.accessories.monitor,
      });
    }
    
    if (includeRack) {
      items.push({
        name: 'Rack / Cabinet',
        quantity: 1,
        unitPrice: pricing.accessories.rack,
        total: pricing.accessories.rack,
      });
    }

    // Summing up all calculated prices and extra charges
    const materialTotal = items.reduce((sum, item) => sum + item.total, 0);
    const laborCharge = totalCameras > 0 ? getLaborCharge(totalCameras, pricing) : 0;
    const distanceCharge = getDistanceCharge(distance, pricing);
    const grandTotal = materialTotal + laborCharge + distanceCharge;

    return { items, materialTotal, laborCharge, distanceCharge, grandTotal };
  }, [pricing, bulletCameras, domeCameras, otherCameras, dvrChannel, hardDisk, powerChannel, wireLength, bncConnectors, dcConnectors, pvcBoxes, includeHdmi, includeVga, includeMonitor, includeRack, distance, totalCameras]);

  // Format numbers as INR currency (no decimals)
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  /**
   * generateWhatsAppMessage
   * Returns a URL-encoded WhatsApp message comprising:
   *  - Customer's name & phone if provided
   *  - All selected items (with quantity and price)
   *  - Totals for materials, labor and distance
   *  - Grand total and a call to action.
   */
  const generateWhatsAppMessage = () => {
    let message = "🎥 *CCTV Estimate from Bharat Multi Services*\n\n";
    if (customerName) message += `*Customer:* ${customerName}\n`;
    if (customerPhone) message += `*Phone:* ${customerPhone}\n\n`;
    message += "*Items:*\n";
    breakdown.items.forEach(item => {
      message += `• ${item.name} x${item.quantity}: ${formatCurrency(item.total)}\n`;
    });
    message += `\n*Materials Total:* ${formatCurrency(breakdown.materialTotal)}`;
    message += `\n*Labor Charges:* ${formatCurrency(breakdown.laborCharge)}`;
    message += `\n*Distance Charges:* ${formatCurrency(breakdown.distanceCharge)}`;
    message += `\n\n*GRAND TOTAL: ${formatCurrency(breakdown.grandTotal)}*`;
    message += "\n\nPlease confirm this estimate or contact us for customization.";
    
    return encodeURIComponent(message);
  };

  /**
   * sendToWhatsApp
   * Validates the user input (name and phone), saves the inquiry,
   * notifies the user, then opens WhatsApp with a pre-filled estimate message.
   */
  const sendToWhatsApp = async () => {
    // Validate customer details
    const trimmedName = customerName.trim();
    const trimmedPhone = customerPhone.trim();
  
    if (!trimmedName) {
      toast({
        title: 'Name Required',
        description: 'Please enter your name before sending the estimate.',
        variant: 'destructive',
      });
      return;
    }
  
    if (!trimmedPhone) {
      toast({
        title: 'Phone Required',
        description: 'Please enter your phone number before sending the estimate.',
        variant: 'destructive',
      });
      return;
    }
  
    const phoneDigits = trimmedPhone.replace(/[\s-]/g, '');
    if (!/^[0-9]{10}$/.test(phoneDigits)) {
      toast({
        title: 'Invalid Phone',
        description: 'Please enter a valid 10-digit phone number.',
        variant: 'destructive',
      });
      return;
    }
  
    if (isSending) return;
    setIsSending(true);
  
    // 1) Open WhatsApp immediately (never block the user)
    const message = generateWhatsAppMessage(); // already URL-encoded
    const waUrl = `https://wa.me/919422115003?text=${message}`;
    window.open(waUrl, '_blank');
  
    // 2) Safety timeout so UI never stays stuck on "Saving..."
    const timeoutId = window.setTimeout(() => {
      setIsSending(false);
      toast({
        title: 'Taking longer than expected',
        description: 'WhatsApp opened. Saving is taking time—please try again later if needed.',
      });
    }, 5000);
  
    try {
      const selectedProduct =
        totalCameras > 0 ? `${totalCameras} camera setup` : 'Custom CCTV estimate';
  
      // Save enquiry in background (but still try)
      await addInquiry({
        type: 'estimate',
        customerName: trimmedName,
        customerPhone: phoneDigits,
        selectedProduct,
        estimateDetails: {
          items: breakdown.items,
          materialTotal: breakdown.materialTotal,
          laborCharge: breakdown.laborCharge,
          distanceCharge: breakdown.distanceCharge,
          grandTotal: breakdown.grandTotal,
        },
      });
  
      toast({
        title: 'Estimate Saved',
        description: 'Your estimate has been recorded.',
      });
    } catch (error) {
      console.error('addInquiry failed:', error);
      toast({
        title: 'Could not save estimate',
        description: 'WhatsApp opened, but saving failed. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      window.clearTimeout(timeoutId);
      setIsSending(false);
    }
  };
  
  /**
   * downloadPDF
   * Lets users download a plain text version of the full estimate,
   * including all item breakdown, totals, and business contact info.
   */
  const downloadPDF = () => {
    // Create a simple text-based estimate for now
    let content = "CCTV ESTIMATE - BHARAT MULTI SERVICES\n";
    content += "=====================================\n\n";
    content += "ITEMS:\n";
    breakdown.items.forEach(item => {
      content += `${item.name} x${item.quantity}: ${formatCurrency(item.total)}\n`;
    });
    content += `\nMaterials Total: ${formatCurrency(breakdown.materialTotal)}\n`;
    content += `Labor Charges: ${formatCurrency(breakdown.laborCharge)}\n`;
    content += `Distance Charges: ${formatCurrency(breakdown.distanceCharge)}\n`;
    content += `\nGRAND TOTAL: ${formatCurrency(breakdown.grandTotal)}\n`;
    content += "\n=====================================\n";
    content += "Contact: +91 94221 15003\n";
    content += "Email: bharatmultiservicesnagpur@gmail.com";
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cctv-estimate.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  /**
   * NumberInput Component
   * Renders a label, decrement/increment buttons, and value display
   * for number input fields throughout the estimator UI.
   */
  const NumberInput = ({ 
    value, 
    onChange, 
    min = 0, 
    label 
  }: { 
    value: number; 
    onChange: (v: number) => void; 
    min?: number; 
    label: string;
  }) => (
    <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30 border border-border/50">
      <span className="text-sm font-medium">{label}</span>
      <div className="flex items-center gap-2">
        <button
          onClick={() => onChange(Math.max(min, value - 1))}
          className="p-1 rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
        >
          <Minus className="w-4 h-4" />
        </button>
        <span className="w-12 text-center font-semibold">{value}</span>
        <button
          onClick={() => onChange(value + 1)}
          className="p-1 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  // The main component UI, split into selection area and summary area
  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl md:text-4xl font-bold mb-4">
            <span className="gradient-text">CCTV Price Estimator</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Select your requirements below to get an instant estimate for your CCTV installation.
          </p>
        </div>

        {/* Selection grid and summary area */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Selection Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Cameras */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Camera className="w-5 h-5 text-primary" />
                <h2 className="font-display font-semibold text-lg">Cameras</h2>
              </div>
              <div className="space-y-3">
                <NumberInput label={`Bullet Camera (CP Plus) - ${formatCurrency(pricing.cameras.bullet)}`} value={bulletCameras} onChange={setBulletCameras} />
                <NumberInput label={`Dome Camera - ${formatCurrency(pricing.cameras.dome)}`} value={domeCameras} onChange={setDomeCameras} />
                <NumberInput label={`Other CCTV Camera - ${formatCurrency(pricing.cameras.other)}`} value={otherCameras} onChange={setOtherCameras} />
              </div>
            </div>

            {/* DVR, Hard Disk & Power Supply */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="font-display font-semibold text-lg">DVR, Hard Disk & Power Supply</h2>
              </div>
              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">DVR Channels</label>
                  <select
                    value={dvrChannel}
                    onChange={(e) => setDvrChannel(e.target.value)}
                    className="w-full p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground"
                  >
                    <option value="">Select DVR</option>
                    <option value="2ch">2 Channel - {formatCurrency(pricing.dvr.ch2)}</option>
                    <option value="4ch">4 Channel - {formatCurrency(pricing.dvr.ch4)}</option>
                    <option value="8ch">8 Channel - {formatCurrency(pricing.dvr.ch8)}</option>
                    <option value="16ch">16 Channel - {formatCurrency(pricing.dvr.ch16)}</option>
                    <option value="32ch">32 Channel - {formatCurrency(pricing.dvr.ch32)}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Hard Disk</label>
                  <select
                    value={hardDisk}
                    onChange={(e) => setHardDisk(e.target.value)}
                    className="w-full p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground"
                  >
                    <option value="">Select Hard Disk</option>
                    <option value="1tb">1 TB - {formatCurrency(pricing.hardDisk.tb1)}</option>
                    <option value="2tb">2 TB - {formatCurrency(pricing.hardDisk.tb2)}</option>
                    <option value="4tb">4 TB - {formatCurrency(pricing.hardDisk.tb4)}</option>
                    <option value="6tb">6 TB - {formatCurrency(pricing.hardDisk.tb6)}</option>
                    <option value="8tb">8 TB - {formatCurrency(pricing.hardDisk.tb8)}</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Power Supply</label>
                  <select
                    value={powerChannel}
                    onChange={(e) => setPowerChannel(e.target.value)}
                    className="w-full p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground"
                  >
                    <option value="">Select Power Supply</option>
                    <option value="2ch">2 Channel - {formatCurrency(pricing.powerSupply.ch2)}</option>
                    <option value="4ch">4 Channel - {formatCurrency(pricing.powerSupply.ch4)}</option>
                    <option value="8ch">8 Channel - {formatCurrency(pricing.powerSupply.ch8)}</option>
                    <option value="16ch">16 Channel - {formatCurrency(pricing.powerSupply.ch16)}</option>
                    <option value="32ch">32 Channel - {formatCurrency(pricing.powerSupply.ch32)}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Accessories */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Wrench className="w-5 h-5 text-primary" />
                <h2 className="font-display font-semibold text-lg">Cables & Accessories</h2>
              </div>
              <div className="space-y-3">
                <NumberInput label={`Wire (meters) - ${formatCurrency(pricing.accessories.wirePerMeter)}/m`} value={wireLength} onChange={setWireLength} />
                <NumberInput label={`BNC Connectors - ${formatCurrency(pricing.accessories.bncConnector)} each`} value={bncConnectors} onChange={setBncConnectors} />
                <NumberInput label={`DC Connectors - ${formatCurrency(pricing.accessories.dcConnector)} each`} value={dcConnectors} onChange={setDcConnectors} />
                <NumberInput label={`PVC Boxes - ${formatCurrency(pricing.accessories.pvcBox)} each`} value={pvcBoxes} onChange={setPvcBoxes} />
              </div>
              
              <div className="grid grid-cols-2 gap-3 mt-4">
                <label className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors">
                  <input type="checkbox" checked={includeHdmi} onChange={(e) => setIncludeHdmi(e.target.checked)} className="rounded" />
                  <span className="text-sm">HDMI Cable - {formatCurrency(pricing.accessories.hdmiCable)}</span>
                </label>
                <label className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors">
                  <input type="checkbox" checked={includeVga} onChange={(e) => setIncludeVga(e.target.checked)} className="rounded" />
                  <span className="text-sm">VGA Cable - {formatCurrency(pricing.accessories.vgaCable)}</span>
                </label>
                <label className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors">
                  <input type="checkbox" checked={includeMonitor} onChange={(e) => setIncludeMonitor(e.target.checked)} className="rounded" />
                  <span className="text-sm">Monitor - {formatCurrency(pricing.accessories.monitor)}</span>
                </label>
                <label className="flex items-center gap-2 p-3 rounded-lg bg-muted/30 border border-border/50 cursor-pointer hover:bg-muted/50 transition-colors">
                  <input type="checkbox" checked={includeRack} onChange={(e) => setIncludeRack(e.target.checked)} className="rounded" />
                  <span className="text-sm">Rack/Cabinet - {formatCurrency(pricing.accessories.rack)}</span>
                </label>
              </div>
            </div>

            {/* Distance */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="font-display font-semibold text-lg">Distance from Nagpur</h2>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { value: '20km', label: 'Up to 20 km', price: pricing.distance.km20 },
                  { value: '50km', label: 'Up to 50 km', price: pricing.distance.km50 },
                  { value: '100km', label: 'Up to 100 km', price: pricing.distance.km100 },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setDistance(distance === opt.value ? '' : opt.value)}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      distance === opt.value
                        ? 'bg-primary text-primary-foreground border-primary'
                        : 'bg-muted/30 border-border/50 hover:border-primary/50'
                    }`}
                  >
                    <div className="text-sm font-medium">{opt.label}</div>
                    <div className="text-xs opacity-80">{formatCurrency(opt.price)}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Customer Details */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Send className="w-5 h-5 text-primary" />
                <h2 className="font-display font-semibold text-lg">Your Details</h2>
              </div>
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-medium mb-2 block">Your Name</label>
                  <input
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Phone Number</label>
                  <input
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="w-full p-3 rounded-lg bg-muted/30 border border-border/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Estimate Summary */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-4">
                <Calculator className="w-5 h-5 text-primary" />
                <h2 className="font-display font-semibold text-lg">Estimate Summary</h2>
              </div>

              {breakdown.items.length > 0 ? (
                <>
                  <div className="space-y-2 mb-4 max-h-64 overflow-y-auto">
                    {breakdown.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm py-2 border-b border-border/30">
                        <span className="text-muted-foreground">
                          {item.name} <span className="text-xs">x{item.quantity}</span>
                        </span>
                        <span className="font-medium">{formatCurrency(item.total)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2 py-4 border-t border-border/50">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Materials</span>
                      <span>{formatCurrency(breakdown.materialTotal)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Labor ({totalCameras} cameras)</span>
                      <span>{formatCurrency(breakdown.laborCharge)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Distance</span>
                      <span>{formatCurrency(breakdown.distanceCharge)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center py-4 border-t border-primary/30">
                    <span className="font-display font-semibold text-lg">Grand Total</span>
                    <span className="font-display font-bold text-2xl gradient-text">
                      {formatCurrency(breakdown.grandTotal)}
                    </span>
                  </div>

                  <div className="space-y-3 mt-4">
                    <Button variant="whatsapp" className="w-full" onClick={sendToWhatsApp} disabled={isSending}>
                      <Send className="w-4 h-4" />
                      {isSending ? 'Saving...' : 'Send via WhatsApp'}
                    </Button>
                    <Button variant="outline" className="w-full" onClick={downloadPDF}>
                      <Download className="w-4 h-4" />
                      Download Estimate
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Calculator className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Select items above to see your estimate</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Estimator;
