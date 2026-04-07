export type DestinationType = 'biển' | 'núi' | 'thành phố';

export interface Costs {
  food: number;
  transport: number;
  lodging: number;
}

export interface Destination {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  type: DestinationType;
  priceLevel: 'rẻ' | 'trung bình' | 'cao';
  rating: number;
  visitTime: number; 
  costs: Costs;
}

export interface ItineraryItem extends Destination {
  day: number;
  order: number;
}