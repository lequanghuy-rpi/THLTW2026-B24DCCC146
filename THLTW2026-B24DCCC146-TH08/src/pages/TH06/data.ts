import { Destination } from './type';

export const mockDestinations: Destination[] = [
  {
    id: '1', name: 'Vịnh Hạ Long', description: 'Di sản thiên nhiên thế giới.',
    imageUrl: 'https://images.unsplash.com/photo-1528127269322-539801943592?auto=format&fit=crop&w=500',
    type: 'biển', priceLevel: 'trung bình', rating: 4.8, visitTime: 24,
    costs: { food: 500000, transport: 300000, lodging: 800000 }
  },
  {
    id: '2', name: 'Sapa', description: 'Thành phố trong sương.',
    imageUrl: 'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=500',
    type: 'núi', priceLevel: 'trung bình', rating: 4.5, visitTime: 48,
    costs: { food: 400000, transport: 500000, lodging: 600000 }
  },
  {
    id: '3', name: 'Đà Nẵng', description: 'Thành phố đáng sống.',
    imageUrl: 'https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=500',
    type: 'thành phố', priceLevel: 'rẻ', rating: 4.9, visitTime: 72,
    costs: { food: 300000, transport: 200000, lodging: 500000 }
  }
];