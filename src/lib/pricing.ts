export interface PricingData {
  cameras: {
    bullet: number;
    dome: number;
    other: number;
  };
  dvr: {
    ch2: number;
    ch4: number;
    ch8: number;
    ch16: number;
    ch32: number;
  };
  hardDisk: {
    tb1: number;
    tb2: number;
    tb4: number;
    tb6: number;
    tb8: number;
  };
  powerSupply: {
    ch2: number;
    ch4: number;
    ch8: number;
    ch16: number;
    ch32: number;
  };
  accessories: {
    wirePerMeter: number;
    bncConnector: number;
    dcConnector: number;
    pvcBox: number;
    hdmiCable: number;
    vgaCable: number;
    monitor: number;
    rack: number;
  };
  labor: {
    cam2: number;
    cam4: number;
    cam8: number;
    cam16: number;
    cam32: number;
  };
  distance: {
    km20: number;
    km50: number;
    km100: number;
  };
}

export const defaultPricing: PricingData = {
  cameras: {
    bullet: 1800,
    dome: 2000,
    other: 2500,
  },
  dvr: {
    ch2: 3500,
    ch4: 4500,
    ch8: 7000,
    ch16: 10000,
    ch32: 14000,
  },
  hardDisk: {
    tb1: 3500,
    tb2: 5500,
    tb4: 9000,
    tb6: 13000,
    tb8: 17000,
  },
  powerSupply: {
    ch2: 800,
    ch4: 1200,
    ch8: 2000,
    ch16: 3500,
    ch32: 5000,
  },
  accessories: {
    wirePerMeter: 15,
    bncConnector: 60,
    dcConnector: 80,
    pvcBox: 150,
    hdmiCable: 350,
    vgaCable: 300,
    monitor: 6000,
    rack: 2000,
  },
  labor: {
    cam2: 500,
    cam4: 1000,
    cam8: 2000,
    cam16: 3500,
    cam32: 5000,
  },
  distance: {
    km20: 300,
    km50: 500,
    km100: 1000,
  },
};

export const loadPricing = (): PricingData => {
  const stored = localStorage.getItem('bms_pricing');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return defaultPricing;
    }
  }
  return defaultPricing;
};

export const savePricing = (pricing: PricingData): void => {
  localStorage.setItem('bms_pricing', JSON.stringify(pricing));
};

export const getLaborCharge = (cameraCount: number, pricing: PricingData): number => {
  if (cameraCount <= 2) return pricing.labor.cam2;
  if (cameraCount <= 4) return pricing.labor.cam4;
  if (cameraCount <= 8) return pricing.labor.cam8;
  if (cameraCount <= 16) return pricing.labor.cam16;
  return pricing.labor.cam32;
};

export const getDistanceCharge = (distance: string, pricing: PricingData): number => {
  switch (distance) {
    case '20km': return pricing.distance.km20;
    case '50km': return pricing.distance.km50;
    case '100km': return pricing.distance.km100;
    default: return 0;
  }
};
