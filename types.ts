/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


export interface HeroContent {
  tagline1: string;
  tagline2: string;
  title: string;
  subtitle: string;
  ctaText: string;
}

export interface SiteConfig {
  marquee: string[];
  footerTagline: string;
  footerCopyright: string;
}

export interface Feature {
  id: string;
  title: string;
  description: string;
  icon: 'Zap' | 'ShieldCheck' | 'Footprints';
}

export interface ShopPackage {
  id: string;
  name: string;
  price: string;
  tier: string;
  accent: string;
  features: string[];
}

export interface Product {
  id: string;
  name: string;
  category: string;
  image: string;
  price: string;
  description: string;
  colorway: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export enum Section {
  HERO = 'hero',
  COLLECTION = 'collection',
  EXPERIENCE = 'experience',
  SHOP = 'shop',
}
