export interface MenuItem {
  id: string;
  name: string;
  subtitle?: string;
  description: string;
  price: number;
  highlight?: boolean;
  dietary?: string[];
  allergens?: string[];
}

export interface MenuCategory {
  id: string;
  name: string;
  frenchName: string;
  description: string;
  items: MenuItem[];
}

export interface TastingMenu {
  id: string;
  name: string;
  services: number;
  price: number;
  winePairingPrice?: number;
  description: string;
  courses: {
    courseName: string;
    dish: string;
    description: string;
  }[];
}

export interface ReservationPayload {
  name: string;
  email: string;
  phone: string;
  guests: number;
  date: string;
  time: string;
  message?: string;
}

export interface ReservationResult {
  success: boolean;
  message: string;
  reservation_id?: string;
  data?: {
    name: string;
    guests: number;
    date: string;
    time: string;
    message?: string;
  };
}
