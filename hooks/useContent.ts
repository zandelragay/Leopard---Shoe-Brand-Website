import { useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { collection, doc, onSnapshot, query, getDoc, setDoc } from 'firebase/firestore';
import { HeroContent, SiteConfig, Product, Feature, ShopPackage } from '../types';

// Default Data (Fallback and Initial Seed)
const DEFAULT_HERO: HeroContent = {
  tagline1: 'Engineered',
  tagline2: 'Agility',
  title: 'LEOPARD',
  subtitle: 'The peak of urban predator gear',
  ctaText: 'Explore Drop'
};

const DEFAULT_CONFIG: SiteConfig = {
  marquee: ['LEOPARD', 'PROWLER V1', 'Agility', 'Speed', 'Stealth'],
  footerTagline: 'Design by LEOPARD Urban Systems',
  footerCopyright: '© 2026'
};

const DEFAULT_PRODUCTS: Product[] = [
  { 
    id: 'p1', 
    name: 'Prowler V1', 
    category: 'Elite Runner', 
    price: '$220', 
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
    description: 'Designed for the urban predator. Features Leopard-Claw traction and ultra-light kinetic foam.',
    colorway: 'Eclipse / Solar Orange'
  },
  { 
    id: 'p2', 
    name: 'Stealth Mid', 
    category: 'Tactical Boot', 
    price: '$350', 
    image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782',
    description: 'The ultimate urban exploration gear. Water-resistant tech silk upper with a carbon-fiber plate.',
    colorway: 'Midnight Gray'
  },
  { 
    id: 'p3', 
    name: 'Neon Talon', 
    category: 'Hyper Low-Top', 
    price: '$500', 
    image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa',
    description: 'Limited release featuring heat-reactive pigments and an integrated LED suspension system.',
    colorway: 'Prism / Chrome'
  },
  { 
    id: 'p4', 
    name: 'Aero Dash', 
    category: 'Performance Lite', 
    price: '$180', 
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a',
    description: 'Weightless agility. Utilizes a single-thread knit construction to wrap your foot like a second skin.',
    colorway: 'Velocity White'
  },
  { 
    id: 'p5', 
    name: 'Apex King', 
    category: 'Brutalist High', 
    price: '$420', 
    image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329',
    description: 'Command the concrete. Oversized proportions and a multi-layered silhouette inspired by brutalist architecture.',
    colorway: 'Concrete / Amber'
  },
  { 
    id: 'p6', 
    name: 'Void Runner', 
    category: 'Conceptual Trainer', 
    price: '$890', 
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2',
    description: '3D printed liquid-polymer lattice mid-sole provides the most cushioned experience in existence.',
    colorway: 'Absolute Black'
  }
];

export function useContent() {
  const [hero, setHero] = useState<HeroContent>(DEFAULT_HERO);
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_CONFIG);
  const [products, setProducts] = useState<Product[]>(DEFAULT_PRODUCTS);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [packages, setPackages] = useState<ShopPackage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Hero Listener
    const unsubHero = onSnapshot(doc(db, 'content', 'hero'), (docSnap) => {
      if (docSnap.exists()) {
        setHero(docSnap.data() as HeroContent);
      }
    }, (error) => console.error("Hero Error:", error));

    // 2. Config Listener
    const unsubConfig = onSnapshot(doc(db, 'content', 'config'), (docSnap) => {
      if (docSnap.exists()) {
        setConfig(docSnap.data() as SiteConfig);
      }
    }, (error) => console.error("Config Error:", error));

    // 3. Products Listener
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const items = snapshot.docs.map(d => ({ ...d.data() }) as Product);
      if (items.length > 0) {
        setProducts(items);
      }
    }, (error) => console.error("Products Error:", error));

    // 4. Features & Packages (Simplified for this turn)
    // You can add listeners for these as well
    
    setLoading(false);

    return () => {
      unsubHero();
      unsubConfig();
      unsubProducts();
    };
  }, []);

  return { hero, config, products, features, packages, loading };
}
