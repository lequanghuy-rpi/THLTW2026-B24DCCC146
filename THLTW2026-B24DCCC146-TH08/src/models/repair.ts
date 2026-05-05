export interface Employee {
  id: string;
  name: string;
  maxCustomersPerDay: number;
  schedule: string; 
}

export interface Service {
  id: string;
  name: string;
  price: number;
  duration: number;
}

export interface Appointment {
  id: string;
  customerName: string;
  employeeId: string;
  serviceId: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
}

export interface Rating {
  id: string;
  appointmentId: string;
  rating: number;
  comment: string;
  employeeReply?: string;
}