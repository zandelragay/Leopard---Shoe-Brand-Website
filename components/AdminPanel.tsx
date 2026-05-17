import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from '../lib/firebase';
import { doc, setDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { X, Save, Plus, Trash2, LogIn, LogOut, Lock, Image as ImageIcon, Video, Type } from 'lucide-react';
import { HeroContent, SiteConfig, Product, Feature, ShopPackage } from '../types';

interface AdminPanelProps {
  hero: HeroContent;
  config: SiteConfig;
  products: Product[];
  features: Feature[];
  packages: ShopPackage[];
  onRefresh: () => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const ADMIN_PASSWORD = 'GROWINGOLD9886';

const AdminPanel: React.FC<AdminPanelProps> = ({ hero, config, products, features, packages, onRefresh, isOpen, setIsOpen }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState<'hero' | 'products' | 'tech' | 'shop' | 'config'>('hero');
  const [isSaving, setIsSaving] = useState(false);

  // Local state for edits
  const [editHero, setEditHero] = useState(hero);
  const [editConfig, setEditConfig] = useState(config);
  const [editProducts, setEditProducts] = useState(products);
  const [editFeatures, setEditFeatures] = useState(features);
  const [editPackages, setEditPackages] = useState(packages);

  useEffect(() => {
    // Check local storage for session
    const session = localStorage.getItem('leopard_admin_session');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    setEditHero(hero);
    setEditConfig(config);
    setEditProducts(products);
    setEditFeatures(features);
    setEditPackages(packages);
  }, [hero, config, products, features, packages]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('leopard_admin_session', 'true');
      setPassword('');
    } else {
      alert('Unauthorized Access');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('leopard_admin_session');
  };

  const bootstrapSite = async () => {
    if (!isAuthenticated) return;
    setIsSaving(true);
    try {
      // Default Hero
      await setDoc(doc(db, 'content', 'hero'), {
        tagline1: 'Engineered',
        tagline2: 'Agility',
        title: 'LEOPARD',
        subtitle: 'The peak of urban predator gear',
        ctaText: 'Explore Drop'
      });
      // Default Config
      await setDoc(doc(db, 'content', 'config'), {
        marquee: ['LEOPARD', 'PROWLER V1', 'Agility', 'Speed', 'Stealth'],
        footerTagline: 'Design by LEOPARD Urban Systems',
        footerCopyright: '© 2026'
      });
      
      // 6 Sample Products
      const samples = [
        { id: 'p1', name: 'Prowler V1', category: 'Elite Runner', price: '$220', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff', description: 'Designed for the urban predator. Features Leopard-Claw traction and ultra-light kinetic foam.', colorway: 'Eclipse / Solar Orange' },
        { id: 'p2', name: 'Stealth Mid', category: 'Tactical Boot', price: '$350', image: 'https://images.unsplash.com/photo-1514989940723-e8e51635b782', description: 'The ultimate urban exploration gear. Water-resistant tech silk upper with a carbon-fiber plate.', colorway: 'Midnight Gray' },
        { id: 'p3', name: 'Neon Talon', category: 'Hyper Low-Top', price: '$500', image: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa', description: 'Limited release featuring heat-reactive pigments and an integrated LED suspension system.', colorway: 'Prism / Chrome' },
        { id: 'p4', name: 'Aero Dash', category: 'Performance Lite', price: '$180', image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a', description: 'Weightless agility. Utilizes a single-thread knit construction to wrap your foot like a second skin.', colorway: 'Velocity White' },
        { id: 'p5', name: 'Apex King', category: 'Brutalist High', price: '$420', image: 'https://images.unsplash.com/photo-1605348532760-6753d2c43329', description: 'Command the concrete. Oversized proportions and a multi-layered silhouette inspired by brutalist architecture.', colorway: 'Concrete / Amber' },
        { id: 'p6', name: 'Void Runner', category: 'Conceptual Trainer', price: '$890', image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2', description: '3D printed liquid-polymer lattice mid-sole provides the most cushioned experience in existence.', colorway: 'Absolute Black' }
      ];

      for (const p of samples) {
        await setDoc(doc(db, 'products', p.id), p);
      }

      alert('Site Reset with 6 Samples Successfully');
    } catch (e) {
      console.error(e);
      alert('Initialization failed. Check permissions.');
    }
    setIsSaving(false);
    onRefresh();
  };

  const saveHero = async () => {
    setIsSaving(true);
    await setDoc(doc(db, 'content', 'hero'), editHero);
    setIsSaving(false);
    onRefresh();
  };

  const saveConfig = async () => {
    setIsSaving(true);
    await setDoc(doc(db, 'content', 'config'), editConfig);
    setIsSaving(false);
    onRefresh();
  };

  const saveProduct = async (product: Product) => {
    setIsSaving(true);
    await setDoc(doc(db, 'products', product.id), product);
    setIsSaving(false);
    onRefresh();
  };

  const deleteProduct = async (id: string) => {
    setIsSaving(true);
    await deleteDoc(doc(db, 'products', id));
    setIsSaving(false);
    onRefresh();
  };

  const addProduct = () => {
    const newProduct: Product = {
      id: `prod-${Date.now()}`,
      name: 'New Shoe',
      category: 'Unassigned',
      price: '$0',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
      description: 'New product description',
      colorway: 'Standard'
    };
    setEditProducts([...editProducts, newProduct]);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ x: '100%' }}
          animate={{ x: 0 }}
          exit={{ x: '100%' }}
          className="fixed inset-y-0 right-0 z-[200] w-full md:w-[500px] bg-[#0a0a0a] border-l border-white/10 shadow-2xl overflow-y-auto p-8"
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black italic uppercase tracking-tighter">Site Manager</h2>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/10 rounded-full">
              <X className="w-6 h-6" />
            </button>
          </div>

          {!isAuthenticated ? (
            <div className="flex flex-col items-center justify-center h-64 text-center">
              <Lock className="w-16 h-16 text-white/20 mb-4" />
              <p className="text-gray-400 mb-8 font-mono text-sm uppercase">Secure Access Only</p>
              <form onSubmit={handleLogin} className="w-full space-y-4">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="ACCESS KEY"
                  className="w-full bg-white/5 border border-white/10 p-4 font-mono text-center text-white focus:border-orange-500 outline-none"
                />
                <button
                  type="submit"
                  className="flex items-center gap-3 bg-white text-black px-8 py-4 font-black italic uppercase tracking-widest hover:bg-orange-500 hover:text-white transition-all w-full justify-center"
                >
                  <LogIn className="w-5 h-5" /> Authenticate
                </button>
              </form>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex items-center justify-between p-4 bg-white/5 border border-white/10 rounded-lg">
                 <div className="flex items-center gap-3">
                   <div className="w-8 h-8 rounded-full bg-orange-600 flex items-center justify-center font-black italic text-xs">A</div>
                   <div className="flex flex-col">
                     <span className="text-xs font-mono uppercase text-white font-black italic">Root Operator</span>
                     <button 
                       onClick={bootstrapSite}
                       className="text-[8px] text-orange-500 hover:underline text-left uppercase font-black"
                     >
                       Refresh Default Content
                     </button>
                   </div>
                 </div>
                 <button onClick={handleLogout} className="text-gray-500 hover:text-white">
                   <LogOut className="w-4 h-4" />
                 </button>
              </div>

              {/* Tabs */}
              <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['hero', 'products', 'tech', 'shop', 'config'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab as any)}
                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border transition-all shrink-0 ${
                      activeTab === tab ? 'bg-white text-black border-white' : 'border-white/20 text-gray-500 hover:border-white/50'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              {/* Hero Section Editor */}
              {activeTab === 'hero' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
                  {Object.keys(editHero).map((key) => (
                    <div key={key}>
                      <label className="block text-[10px] font-mono text-gray-500 uppercase mb-2">{key}</label>
                      <textarea
                        value={(editHero as any)[key]}
                        onChange={(e) => setEditHero({ ...editHero, [key]: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 p-4 font-mono text-sm text-white focus:border-orange-500 outline-none min-h-[80px]"
                      />
                    </div>
                  ))}
                  <button
                    disabled={isSaving}
                    onClick={saveHero}
                    className="w-full py-4 bg-orange-600 text-white font-black italic uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-500 transition-all"
                  >
                    <Save className="w-4 h-4" /> {isSaving ? 'Synchronizing...' : 'Update Hero'}
                  </button>
                </div>
              )}

              {/* Products Editor */}
              {activeTab === 'products' && (
                <div className="space-y-6">
                  <button
                     onClick={addProduct}
                     className="w-full py-3 border-2 border-dashed border-white/20 text-gray-500 hover:border-white/50 hover:text-white flex items-center justify-center gap-2 font-black italic uppercase text-xs"
                  >
                    <Plus className="w-4 h-4" /> Add New Spec
                  </button>
                  {editProducts.map((p, idx) => (
                    <div key={p.id} className="p-6 border border-white/10 bg-white/5 space-y-4">
                      <div className="flex justify-between items-center mb-2">
                         <span className="text-[10px] font-black italic text-orange-500">SPEC {idx + 1}</span>
                         <button onClick={() => deleteProduct(p.id)} className="text-gray-500 hover:text-red-500">
                           <Trash2 className="w-4 h-4" />
                         </button>
                      </div>
                      <input
                        value={p.name}
                        onChange={(e) => {
                          const newP = [...editProducts];
                          newP[idx].name = e.target.value;
                          setEditProducts(newP);
                        }}
                        className="w-full bg-transparent border-b border-white/10 py-2 focus:border-orange-500 outline-none text-xl font-black italic"
                        placeholder="Name"
                      />
                      <input
                        value={p.price}
                        onChange={(e) => {
                          const newP = [...editProducts];
                          newP[idx].price = e.target.value;
                          setEditProducts(newP);
                        }}
                        className="w-full bg-transparent border-b border-white/10 py-2 focus:border-orange-500 outline-none text-sm font-mono"
                        placeholder="Price"
                      />
                      <input
                        value={p.image}
                        onChange={(e) => {
                          const newP = [...editProducts];
                          newP[idx].image = e.target.value;
                          setEditProducts(newP);
                        }}
                        className="w-full bg-transparent border-b border-white/10 py-2 focus:border-orange-500 outline-none text-[10px] font-mono text-gray-500"
                        placeholder="Image URL"
                      />
                      <textarea
                        value={p.description}
                        onChange={(e) => {
                          const newP = [...editProducts];
                          newP[idx].description = e.target.value;
                          setEditProducts(newP);
                        }}
                        className="w-full bg-white/5 border border-white/10 p-3 text-sm font-mono focus:border-orange-500 outline-none min-h-[60px]"
                        placeholder="Description"
                      />
                      <button
                        onClick={() => saveProduct(p)}
                        className="w-full py-3 bg-white text-black font-black uppercase text-xs hover:bg-orange-500 hover:text-white transition-all"
                      >
                        Save Spec
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'config' && (
                 <div className="space-y-6">
                   <div>
                      <label className="block text-[10px] font-mono text-gray-500 uppercase mb-2">Marquee Items (comma separated)</label>
                      <textarea
                        value={editConfig.marquee.join(', ')}
                        onChange={(e) => setEditConfig({ ...editConfig, marquee: e.target.value.split(',').map(s => s.trim()) })}
                        className="w-full bg-white/5 border border-white/10 p-4 font-mono text-sm text-white outline-none min-h-[80px]"
                      />
                   </div>
                   <div>
                      <label className="block text-[10px] font-mono text-gray-500 uppercase mb-2">Footer Tagline</label>
                      <input
                        value={editConfig.footerTagline}
                        onChange={(e) => setEditConfig({ ...editConfig, footerTagline: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 p-4 font-mono text-sm text-white outline-none"
                      />
                   </div>
                   <button
                    disabled={isSaving}
                    onClick={saveConfig}
                    className="w-full py-4 bg-orange-600 text-white font-black italic uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-orange-500 transition-all"
                  >
                    <Save className="w-4 h-4" /> Save Configuration
                  </button>
                 </div>
              )}
              
              <div className="pt-20 text-[10px] font-mono text-gray-700 text-center uppercase tracking-widest">
                Leopard CMS v1.0.5-S
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AdminPanel;
