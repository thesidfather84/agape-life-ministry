export type PublishStatus = "draft" | "published";

export interface DailyWord {
  id: string;
  word_date: string; // ISO date (yyyy-mm-dd)
  scripture_reference: string;
  scripture_text: string;
  title: string;
  message: string;
  prayer: string | null;
  status: PublishStatus;
  created_at: string;
  updated_at: string;
}

export interface ChurchEvent {
  id: string;
  title: string;
  event_date: string; // ISO date
  start_time: string; // HH:MM(:SS)
  end_time: string | null;
  location: string;
  description: string;
  image_url: string | null;
  status: PublishStatus;
  created_at: string;
  updated_at: string;
}

export interface ChurchSettings {
  id: number;
  church_name: string;
  pastor_name: string;
  phone: string | null;
  email: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  zip: string;
  service_time_text: string;
  created_at: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  message: string;
  link_url: string | null;
  link_label: string | null;
  starts_on: string | null;
  ends_on: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PrayerRequest {
  id: string;
  name: string | null;
  contact: string | null;
  request: string;
  confidential: boolean;
  is_read: boolean;
  created_at: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  contact: string;
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface SmsOptin {
  id: string;
  first_name: string;
  phone: string;
  consented: boolean;
  created_at: string;
}

export interface WelcomeCard {
  id: string;
  first_name: string;
  contact: string | null;
  questions: string | null;
  wants_contact: boolean;
  is_read: boolean;
  created_at: string;
}
