export type CardDisplayType = '消息提醒' | '新车意向评估';

export type MessageNodeType = 'question' | 'message';

export interface MessageNodeOption {
  id: string;
  text: string;
  targetId: string; // node id or 'end'
}

export interface MessageNodeConfig {
  id: string;
  type: MessageNodeType;
  content: string; // <= 50 chars
  options?: MessageNodeOption[]; // for question node, 2-4 options
}

export interface QuestionConfig {
  id: string;
  text: string;
  script: string;
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
  enableCarAssociation?: boolean;
  associatedCars?: string[];
  messageNodes?: MessageNodeConfig[];
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

