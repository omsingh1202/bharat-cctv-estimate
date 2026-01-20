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

const pricingFieldPaths = {
  'cameras.bullet': 'cameras.bullet',
  'cameras.dome': 'cameras.dome',
  'cameras.other': 'cameras.other',
  'dvr.ch2': 'dvr.ch2',
  'dvr.ch4': 'dvr.ch4',
  'dvr.ch8': 'dvr.ch8',
  'dvr.ch16': 'dvr.ch16',
  'dvr.ch32': 'dvr.ch32',
  'hardDisk.tb1': 'hardDisk.tb1',
  'hardDisk.tb2': 'hardDisk.tb2',
  'hardDisk.tb4': 'hardDisk.tb4',
  'hardDisk.tb6': 'hardDisk.tb6',
  'hardDisk.tb8': 'hardDisk.tb8',
  'powerSupply.ch2': 'powerSupply.ch2',
  'powerSupply.ch4': 'powerSupply.ch4',
  'powerSupply.ch8': 'powerSupply.ch8',
  'powerSupply.ch16': 'powerSupply.ch16',
  'powerSupply.ch32': 'powerSupply.ch32',
  'accessories.wirePerMeter': 'accessories.wirePerMeter',
  'accessories.bncConnector': 'accessories.bncConnector',
  'accessories.dcConnector': 'accessories.dcConnector',
  'accessories.pvcBox': 'accessories.pvcBox',
  'accessories.hdmiCable': 'accessories.hdmiCable',
  'accessories.vgaCable': 'accessories.vgaCable',
  'accessories.monitor': 'accessories.monitor',
  'accessories.rack': 'accessories.rack',
  'labor.cam2': 'labor.cam2',
  'labor.cam4': 'labor.cam4',
  'labor.cam8': 'labor.cam8',
  'labor.cam16': 'labor.cam16',
  'labor.cam32': 'labor.cam32',
  'distance.km20': 'distance.km20',
  'distance.km50': 'distance.km50',
  'distance.km100': 'distance.km100',
} as const;

export type PricingId = keyof typeof pricingFieldPaths;

export const pricingToMap = (pricing: PricingData): Record<PricingId, number> => ({
  'cameras.bullet': pricing.cameras.bullet,
  'cameras.dome': pricing.cameras.dome,
  'cameras.other': pricing.cameras.other,
  'dvr.ch2': pricing.dvr.ch2,
  'dvr.ch4': pricing.dvr.ch4,
  'dvr.ch8': pricing.dvr.ch8,
  'dvr.ch16': pricing.dvr.ch16,
  'dvr.ch32': pricing.dvr.ch32,
  'hardDisk.tb1': pricing.hardDisk.tb1,
  'hardDisk.tb2': pricing.hardDisk.tb2,
  'hardDisk.tb4': pricing.hardDisk.tb4,
  'hardDisk.tb6': pricing.hardDisk.tb6,
  'hardDisk.tb8': pricing.hardDisk.tb8,
  'powerSupply.ch2': pricing.powerSupply.ch2,
  'powerSupply.ch4': pricing.powerSupply.ch4,
  'powerSupply.ch8': pricing.powerSupply.ch8,
  'powerSupply.ch16': pricing.powerSupply.ch16,
  'powerSupply.ch32': pricing.powerSupply.ch32,
  'accessories.wirePerMeter': pricing.accessories.wirePerMeter,
  'accessories.bncConnector': pricing.accessories.bncConnector,
  'accessories.dcConnector': pricing.accessories.dcConnector,
  'accessories.pvcBox': pricing.accessories.pvcBox,
  'accessories.hdmiCable': pricing.accessories.hdmiCable,
  'accessories.vgaCable': pricing.accessories.vgaCable,
  'accessories.monitor': pricing.accessories.monitor,
  'accessories.rack': pricing.accessories.rack,
  'labor.cam2': pricing.labor.cam2,
  'labor.cam4': pricing.labor.cam4,
  'labor.cam8': pricing.labor.cam8,
  'labor.cam16': pricing.labor.cam16,
  'labor.cam32': pricing.labor.cam32,
  'distance.km20': pricing.distance.km20,
  'distance.km50': pricing.distance.km50,
  'distance.km100': pricing.distance.km100,
});

const getFromMap = (map: Partial<Record<PricingId, number>>, id: PricingId, fallback: number) => {
  const value = map[id];
  return typeof value === 'number' && !Number.isNaN(value) ? value : fallback;
};

export const mapToPricing = (map: Partial<Record<PricingId, number>>): PricingData => ({
  cameras: {
    bullet: getFromMap(map, 'cameras.bullet', defaultPricing.cameras.bullet),
    dome: getFromMap(map, 'cameras.dome', defaultPricing.cameras.dome),
    other: getFromMap(map, 'cameras.other', defaultPricing.cameras.other),
  },
  dvr: {
    ch2: getFromMap(map, 'dvr.ch2', defaultPricing.dvr.ch2),
    ch4: getFromMap(map, 'dvr.ch4', defaultPricing.dvr.ch4),
    ch8: getFromMap(map, 'dvr.ch8', defaultPricing.dvr.ch8),
    ch16: getFromMap(map, 'dvr.ch16', defaultPricing.dvr.ch16),
    ch32: getFromMap(map, 'dvr.ch32', defaultPricing.dvr.ch32),
  },
  hardDisk: {
    tb1: getFromMap(map, 'hardDisk.tb1', defaultPricing.hardDisk.tb1),
    tb2: getFromMap(map, 'hardDisk.tb2', defaultPricing.hardDisk.tb2),
    tb4: getFromMap(map, 'hardDisk.tb4', defaultPricing.hardDisk.tb4),
    tb6: getFromMap(map, 'hardDisk.tb6', defaultPricing.hardDisk.tb6),
    tb8: getFromMap(map, 'hardDisk.tb8', defaultPricing.hardDisk.tb8),
  },
  powerSupply: {
    ch2: getFromMap(map, 'powerSupply.ch2', defaultPricing.powerSupply.ch2),
    ch4: getFromMap(map, 'powerSupply.ch4', defaultPricing.powerSupply.ch4),
    ch8: getFromMap(map, 'powerSupply.ch8', defaultPricing.powerSupply.ch8),
    ch16: getFromMap(map, 'powerSupply.ch16', defaultPricing.powerSupply.ch16),
    ch32: getFromMap(map, 'powerSupply.ch32', defaultPricing.powerSupply.ch32),
  },
  accessories: {
    wirePerMeter: getFromMap(map, 'accessories.wirePerMeter', defaultPricing.accessories.wirePerMeter),
    bncConnector: getFromMap(map, 'accessories.bncConnector', defaultPricing.accessories.bncConnector),
    dcConnector: getFromMap(map, 'accessories.dcConnector', defaultPricing.accessories.dcConnector),
    pvcBox: getFromMap(map, 'accessories.pvcBox', defaultPricing.accessories.pvcBox),
    hdmiCable: getFromMap(map, 'accessories.hdmiCable', defaultPricing.accessories.hdmiCable),
    vgaCable: getFromMap(map, 'accessories.vgaCable', defaultPricing.accessories.vgaCable),
    monitor: getFromMap(map, 'accessories.monitor', defaultPricing.accessories.monitor),
    rack: getFromMap(map, 'accessories.rack', defaultPricing.accessories.rack),
  },
  labor: {
    cam2: getFromMap(map, 'labor.cam2', defaultPricing.labor.cam2),
    cam4: getFromMap(map, 'labor.cam4', defaultPricing.labor.cam4),
    cam8: getFromMap(map, 'labor.cam8', defaultPricing.labor.cam8),
    cam16: getFromMap(map, 'labor.cam16', defaultPricing.labor.cam16),
    cam32: getFromMap(map, 'labor.cam32', defaultPricing.labor.cam32),
  },
  distance: {
    km20: getFromMap(map, 'distance.km20', defaultPricing.distance.km20),
    km50: getFromMap(map, 'distance.km50', defaultPricing.distance.km50),
    km100: getFromMap(map, 'distance.km100', defaultPricing.distance.km100),
  },
});