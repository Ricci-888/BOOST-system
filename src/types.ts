export type CardDisplayType = '消息提醒' | '新车意向评估';

export interface QuestionConfig {
  id: string;
  text: string;
  script: string;
  enableCarAssociation: boolean;
  associatedCars: string[]; // IDs of cars
}

export interface CardConfig {
  id: string;
  name: string;
  description: string;
  icon: string;
  displayType: CardDisplayType;
  triggerPages: string[];
  status: 'active' | 'inactive';
  creator: string;
  createdAt: string;
  
  // Only for '新车意向评估'
  triggerLogic?: {
    enableCarSeries?: boolean;
    enablePowerTypes?: boolean;
    enableCarAge?: boolean;
    enableMileage?: boolean;
    enableRejectStrategy?: boolean;
    
    regions: string[];
    carSeries: string[];
    powerTypes: string[];
    carAge: number;
    mileage: number;
    targetCars: string[];
    rejectPeriod: string;
    rejectCount: number;
  };
  questionChain?: QuestionConfig[];
}

export interface CarModel {
  id: string;
  brand: string;
  name: string;
  imageUrl: string;
  coreSellingPoints: string[];
  competitors: string[];
  status: 'active' | 'inactive';
  updatedAt: string;
}

export interface Material {
  id: string;
  materialNo: string;
  name: string;
  sellingPoints: string[];
  status: 'active' | 'inactive';
  updatedAt: string;
}

