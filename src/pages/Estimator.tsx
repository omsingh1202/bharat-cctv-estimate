import { useState, useEffect, useMemo } from 'react';
import { Camera, Package, Wrench, MapPin, Calculator, Download, Send, Plus, Minus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { loadPricing, getLaborCharge, getDistanceCharge, type PricingData } from '@/lib/pricing';

interface EstimateItem {
  name: string;
  quantity: number;
  unitPrice: number;
  total: number;
}

const Estimator = () => {
  const [pricing, setPricing] = useState<PricingData>(loadPricing());
  
  // Camera selections
  const [bulletCameras, setBulletCameras] = useState(0);
  const [domeCameras, setDomeCameras] = useState(0);
  const [otherCameras, setOtherCameras] = useState(0);
  
  // DVR & Power Supply
  const [dvrChannel, setDvrChannel] = useState<string>('');
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

  useEffect(() => {
    setPricing(loadPricing());
  }, []);

  const totalCameras = bulletCameras + domeCameras + otherCameras;

  const dvrPrices: Record<string, number> = {
    '2ch': pricing.dvr.ch2,
    '4ch': pricing.dvr.ch4,
    '8ch': pricing.dvr.ch8,
    '16ch': pricing.dvr.ch16,
    '32ch': pricing.dvr.ch32,
  };

  const powerPrices: Record<string, number> = {
    '2ch': pricing.powerSupply.ch2,
    '4ch': pricing.powerSupply.ch4,
    '8ch': pricing.powerSupply.ch8,
    '16ch': pricing.powerSupply.ch16,
    '32ch': pricing.powerSupply.ch32,
  };

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

    const materialTotal = items.reduce((sum, item) => sum + item.total, 0);
    const laborCharge = totalCameras > 0 ? getLaborCharge(totalCameras, pricing) : 0;
    const distanceCharge = getDistanceCharge(distance, pricing);
    const grandTotal = materialTotal + laborCharge + distanceCharge;

    return { items, materialTotal, laborCharge, distanceCharge, grandTotal };
  }, [pricing, bulletCameras, domeCameras, otherCameras, dvrChannel, powerChannel, wireLength, bncConnectors, dcConnectors, pvcBoxes, includeHdmi, includeVga, includeMonitor, includeRack, distance, totalCameras]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const generateWhatsAppMessage = () => {
    let message = "🎥 *CCTV Estimate from Bharat Multi Services*\n\n";
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

  const sendToWhatsApp = () => {
    const message = generateWhatsAppMessage();
    window.open(`https://wa.me/919876543210?text=${message}`, '_blank');
  };

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
    content += "Contact: +91 98765 43210\n";
    content += "Email: bharatmultiservicesnagpur@gmail.com";
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cctv-estimate.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

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

            {/* DVR & Power Supply */}
            <div className="glass-card p-6">
              <div className="flex items-center gap-2 mb-4">
                <Package className="w-5 h-5 text-primary" />
                <h2 className="font-display font-semibold text-lg">DVR & Power Supply</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
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
                    <Button variant="whatsapp" className="w-full" onClick={sendToWhatsApp}>
                      <Send className="w-4 h-4" />
                      Send via WhatsApp
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
