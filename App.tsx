/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ShoppingBag, Globe, Zap, Footprints, ShieldCheck, Menu, X, Package, Box, ChevronLeft, ChevronRight, ArrowRight, Lock } from 'lucide-react';
import FluidBackground from './components/FluidBackground';
import GradientText from './components/GlitchText';
import CustomCursor from './components/CustomCursor';
import ProductCard from './components/ProductCard';
import AIChat from './components/AIChat';
import AdminPanel from './components/AdminPanel';
import { useContent } from './hooks/useContent';
import { Product } from './types';

const App: React.FC = () => {
  const { hero, config, products, features, packages, loading } = useContent();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  
  const [purchasingIndex, setPurchasingIndex] = useState<number | null>(null);
  const [purchasedIndex, setPurchasedIndex] = useState<number | null>(null);

  // Handle keyboard navigation for product modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedProduct) return;
      if (e.key === 'ArrowLeft') navigateProduct('prev');
      if (e.key === 'ArrowRight') navigateProduct('next');
      if (e.key === 'Escape') setSelectedProduct(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedProduct]);

  // Fallback for features and packages
  const displayFeatures = features.length > 0 ? features : [
    { id: '1', icon: Zap, title: 'Kinetic Foam', description: '98% energy return with every stride. Propulsion redefined.' },
    { id: '2', icon: ShieldCheck, title: 'Tactile Silk', description: 'Synthetic spider-silk upper. Industrial strength, weightless feel.' },
    { id: '3', icon: Footprints, title: 'Claw Sole', description: 'Omni-directional grip patterns inspired by jungle predators.' },
  ];

  const handlePurchase = (index: number) => {
    setPurchasingIndex(index);
    setTimeout(() => {
      setPurchasingIndex(null);
      setPurchasedIndex(index);
    }, 3500);
  };

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const navigateProduct = (direction: 'next' | 'prev') => {
    if (!selectedProduct) return;
    const currentIndex = products.findIndex(p => p.id === selectedProduct.id);
    let nextIndex;
    if (direction === 'next') {
      nextIndex = (currentIndex + 1) % products.length;
    } else {
      nextIndex = (currentIndex - 1 + products.length) % products.length;
    }
    setSelectedProduct(products[nextIndex]);
  };

  if (loading) return (
    <div className="h-screen w-full bg-black flex items-center justify-center font-black italic text-orange-500 uppercase tracking-[0.5em] animate-pulse">
      Initializing Agility...
    </div>
  );
  
  return (
    <div className="relative min-h-screen text-white selection:bg-orange-500 selection:text-black cursor-auto md:cursor-none overflow-x-hidden pt-20">
      <CustomCursor />
      <FluidBackground />
      <AIChat />
      <AdminPanel 
        hero={hero} 
        config={config} 
        products={products} 
        features={displayFeatures as any} 
        packages={packages} 
        onRefresh={() => {}} 
        isOpen={isAdminOpen}
        setIsOpen={setIsAdminOpen}
      />
      
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 py-8 mix-blend-difference">
        <div className="font-heading text-2xl md:text-3xl font-black tracking-tighter text-white cursor-default z-50">LEOPARD</div>
        
        {/* Desktop Menu */}
        <div className="hidden md:flex gap-12 text-sm font-bold tracking-[0.2em] uppercase">
          {['Collection', 'Tech', 'Shop'].map((item) => (
            <button 
              key={item} 
              onClick={() => scrollToSection(item.toLowerCase())}
              className="hover:text-orange-400 transition-colors text-white cursor-pointer bg-transparent border-none"
              data-hover="true"
            >
              {item}
            </button>
          ))}
        </div>
        <button 
          onClick={() => scrollToSection('shop')}
          className="hidden md:inline-block border-2 border-white px-8 py-3 text-xs font-black tracking-widest uppercase hover:bg-white hover:text-black transition-all duration-300 text-white cursor-pointer bg-transparent"
          data-hover="true"
        >
          Limited Drop
        </button>

        {/* Mobile Menu Toggle */}
        <button 
          className="md:hidden text-white z-50 relative w-10 h-10 flex items-center justify-center"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
           {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            className="fixed inset-0 z-40 bg-black flex flex-col items-center justify-center gap-12 md:hidden"
          >
            {['Collection', 'Tech', 'Shop'].map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item.toLowerCase())}
                className="text-5xl font-heading font-black text-white hover:text-orange-500 transition-colors uppercase bg-transparent border-none"
              >
                {item}
              </button>
            ))}
            <button 
              onClick={() => scrollToSection('shop')}
              className="mt-8 bg-orange-600 px-12 py-5 text-sm font-black tracking-[0.3em] uppercase text-white shadow-xl shadow-orange-600/30"
            >
              Shop Now
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HERO SECTION */}
      <header className="relative h-[90svh] flex flex-col items-center justify-center overflow-hidden px-4">
        <motion.div 
          style={{ y, opacity }}
          className="z-10 text-center flex flex-col items-center w-full max-w-6xl"
        >
           {/* Tagline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="flex items-center gap-4 text-xs md:text-sm font-mono text-orange-400 tracking-[0.4em] uppercase mb-6"
          >
            <span>{hero.tagline1}</span>
            <span className="w-1 h-1 bg-orange-600 rounded-full"/>
            <span>{hero.tagline2}</span>
          </motion.div>

          {/* Main Title */}
          <div className="relative w-full flex justify-center items-center">
            <GradientText 
              text={hero.title} 
              as="h1" 
              className="text-[18vw] md:text-[16vw] leading-[0.8] font-black tracking-tighter text-center italic" 
            />
            {/* Glow Orb */}
            <motion.div 
               className="absolute -z-20 w-[60vw] h-[60vw] bg-orange-600/10 blur-[100px] rounded-full pointer-events-none"
               animate={{ scale: [0.9, 1.1, 0.9], opacity: [0.2, 0.4, 0.2] }}
               transition={{ duration: 8, repeat: Infinity }}
            />
          </div>
          
          <motion.div
             initial={{ width: 0 }}
             animate={{ width: '100%' }}
             transition={{ duration: 1.5, delay: 0.5, ease: "circOut" }}
             className="max-w-xl h-[2px] bg-gradient-to-r from-transparent via-orange-500/50 to-transparent mt-12 mb-10"
          />

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="text-lg md:text-3xl font-light max-w-2xl mx-auto text-white/70 leading-relaxed uppercase tracking-widest"
          >
            {hero.subtitle}
          </motion.p>
          
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            onClick={() => scrollToSection('collection')}
            className="mt-12 group flex items-center gap-4 text-sm font-bold tracking-[0.3em] uppercase"
            data-hover="true"
          >
            {hero.ctaText} <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform color-orange-500" />
          </motion.button>
        </motion.div>

        {/* MARQUEE */}
        <div className="absolute bottom-0 left-0 w-full py-6 md:py-8 bg-black text-white z-20 overflow-hidden border-t-2 border-white/10">
          <motion.div 
            className="flex w-fit will-change-transform"
            animate={{ x: "-50%" }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
          >
            {[0, 1].map((key) => (
              <div key={key} className="flex whitespace-nowrap shrink-0">
                {[...Array(6)].map((_, i) => (
                  <span key={i} className="text-4xl md:text-8xl font-black px-12 flex items-center gap-6 opacity-30 italic">
                    {config.marquee.map((item, idx) => (
                      <React.Fragment key={idx}>
                        {item} {idx < config.marquee.length - 1 && <span className="text-orange-600">⚡</span>}
                      </React.Fragment>
                    ))}
                    <span className="text-orange-600">⚡</span> 
                  </span>
                ))}
              </div>
            ))}
          </motion.div>
        </div>
      </header>

      {/* COLLECTION SECTION */}
      <section id="collection" className="relative z-10 py-32 px-4 md:px-0">
        <div className="max-w-[1800px] mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-baseline mb-20 px-4 md:px-12">
             <h2 className="text-6xl md:text-9xl font-black uppercase leading-[0.8] mb-8 md:mb-0">
               Current <br/> 
               <GradientText text="DROP" className="text-7xl md:text-[10rem]" />
            </h2>
            <p className="max-w-md text-gray-400 font-mono text-sm leading-relaxed uppercase tracking-wider">
              Our 2026 tactical collection focuses on structural tension and metabolic heat dissipation. Six archetypes of urban mobility.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border-t border-l border-white/10">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
            ))}
          </div>
        </div>
      </section>

      {/* TECH/EXPERIENCE SECTION */}
      <section id="tech" className="relative z-10 py-32 bg-black border-y border-white/5 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
            <div className="lg:col-span-5 order-2 lg:order-1">
              <h2 className="text-5xl md:text-8xl font-black mb-12 leading-none italic">
                LEO-CLAW <br/> <span className="text-orange-500">TECH</span>
              </h2>
              
              <div className="space-y-12">
                {displayFeatures.map((feature, i) => (
                  <div key={i} className="flex items-start gap-8 group">
                    <div className="p-5 rounded-full bg-orange-600/10 border border-orange-500/20 group-hover:bg-orange-600 transition-colors duration-500">
                      <feature.icon className="w-8 h-8 text-orange-500 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h4 className="text-2xl font-black mb-3 italic">{feature.title}</h4>
                      <p className="text-gray-400 leading-relaxed font-mono text-sm">{feature.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="lg:col-span-7 relative aspect-square md:aspect-auto h-[500px] md:h-full w-full order-1 lg:order-2">
               <div className="absolute inset-0 bg-orange-600/20 blur-[120px] rounded-full scale-110" />
               <div className="relative h-full w-full rounded-2xl overflow-hidden grayscale border border-white/10">
                 <img 
                    src="https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=1000&auto=format&fit=crop" 
                    alt="Shoe Tech" 
                    className="h-full w-full object-cover" 
                 />
                 <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
                 <div className="absolute bottom-12 left-12">
                   <div className="text-[10rem] font-black text-white/5 leading-none -ml-4">X-01</div>
                   <div className="text-2xl font-black italic tracking-widest uppercase -mt-10 text-orange-500">
                     Prototype Testing
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </section>

      {/* SHOP SECTION */}
      <section id="shop" className="relative z-10 py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-24">
             <h2 className="text-7xl md:text-[12rem] font-black opacity-10 text-white italic">
               SHOP
             </h2>
             <p className="text-orange-500 font-mono uppercase tracking-[1em] -mt-10 md:-mt-20 relative z-10">
               Direct Access
             </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: 'Standard Pack', price: '$220', tier: 'Prowler V1', accent: 'bg-white/5' },
              { name: 'Tech Bundle', price: '$580', tier: 'Drop exclusive', accent: 'bg-orange-600/10 border-orange-500/30' },
              { name: 'Founders Key', price: '$1200', tier: 'Limited 1:1', accent: 'bg-amber-600/10 border-amber-500/30' },
            ].map((pkg, i) => {
              const isPurchasing = purchasingIndex === (i + 10); // Offset for demo
              const isPurchased = purchasedIndex === (i + 10);
              const isDisabled = purchasingIndex !== null || purchasedIndex !== null;

              return (
                <motion.div
                  key={i}
                  whileHover={{ y: -15, borderColor: 'rgba(255,140,0,0.5)' }}
                  className={`p-10 border border-white/10 flex flex-col min-h-[500px] transition-all duration-500 ${pkg.accent}`}
                  data-hover="true"
                >
                  <div className="flex-1">
                    <div className="text-xs font-mono mb-6 text-gray-500 tracking-[0.3em] uppercase">{pkg.tier}</div>
                    <h3 className="text-3xl font-black italic mb-6">{pkg.name}</h3>
                    <div className="text-6xl font-black mb-12 tracking-tighter text-white">
                      {pkg.price}
                    </div>
                    <ul className="space-y-6 text-sm font-mono text-gray-400 uppercase">
                      <li className="flex items-center gap-4 animate-pulse"><Box className="w-5 h-5 text-orange-500" /> Premium Crate</li>
                      <li className="flex items-center gap-4"><Globe className="w-5 h-5 text-gray-400" /> Global Priority</li>
                      {i > 0 && <li className="flex items-center gap-4 text-white font-bold"><Zap className="w-5 h-5 text-orange-500" /> Early Access Drop</li>}
                      {i > 1 && <li className="flex items-center gap-4 text-orange-500 font-black italic"><Package className="w-5 h-5" /> NFT Digital Pair</li>}
                    </ul>
                  </div>
                  
                  <button 
                    onClick={() => handlePurchase(i + 10)}
                    disabled={isDisabled}
                    className={`w-full py-5 text-sm font-black italic uppercase tracking-[0.3em] transition-all duration-300 border-2 border-white/10
                      ${isPurchased ? 'bg-orange-600 text-white border-orange-600' : 'hover:bg-white hover:text-black hover:border-white'}`}
                  >
                    {isPurchasing ? 'Processing...' : isPurchased ? 'Secured' : 'Secure Pair'}
                  </button>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="relative z-10 border-t border-white/5 py-24 bg-black">
        <div className="max-w-7xl mx-auto px-12 flex flex-col md:flex-row justify-between items-start md:items-center gap-16">
          <div>
             <div className="font-heading text-5xl font-black tracking-tighter mb-4 italic">LEOPARD</div>
             <div className="font-mono text-xs text-gray-600 uppercase tracking-widest">
               {config.footerTagline} {config.footerCopyright}
             </div>
          </div>
          
          <div className="flex gap-12 font-black italic text-sm tracking-widest uppercase">
            <a href="#" className="hover:text-orange-500 transition-colors">Instagram</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Discord</a>
            <a href="#" className="hover:text-orange-500 transition-colors">Manifesto</a>
          </div>
        </div>

        <div className="mt-20 pb-8 flex justify-center">
           <button 
             onClick={() => setIsAdminOpen(true)}
             className="p-3 rounded-full border border-white/10 bg-white/[0.02] text-white/20 hover:text-orange-500 hover:border-orange-500/30 hover:bg-orange-500/5 transition-all"
             title="System Access"
           >
             <Lock className="w-3.5 h-3.5" />
           </button>
        </div>
      </footer>

      {/* Product Detail Modal */}
      <AnimatePresence>
        {selectedProduct && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProduct(null)}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/90 backdrop-blur-3xl cursor-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 50 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-6xl bg-[#0a0a0a] border border-white/10 overflow-hidden flex flex-col md:flex-row shadow-[0_0_100px_rgba(255,140,0,0.1)]"
            >
              <button
                onClick={() => setSelectedProduct(null)}
                className="absolute top-8 right-8 z-20 p-4 bg-white text-black hover:bg-orange-500 hover:text-white transition-colors flex items-center justify-center"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="absolute left-8 bottom-8 z-20 flex gap-4">
                <button
                  onClick={() => navigateProduct('prev')}
                  className="p-4 border-2 border-white/10 hover:border-white transition-all bg-black/50"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={() => navigateProduct('next')}
                  className="p-4 border-2 border-white/10 hover:border-white transition-all bg-black/50"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Image Side */}
              <div className="w-full md:w-3/5 h-80 md:h-[700px] relative">
                <AnimatePresence mode="wait">
                  <motion.img 
                    key={selectedProduct.id}
                    src={selectedProduct.image} 
                    alt={selectedProduct.name} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 w-full h-full object-cover grayscale"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-transparent md:bg-gradient-to-r" />
              </div>

              {/* Content Side */}
              <div className="w-full md:w-2/5 p-12 md:p-20 flex flex-col justify-center">
                <motion.div
                  key={selectedProduct.id}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <div className="flex items-center gap-4 text-orange-500 mb-8 font-mono text-sm tracking-[0.4em] uppercase">
                     <span>{selectedProduct.category}</span>
                  </div>
                  
                  <h3 className="text-6xl md:text-8xl font-black uppercase leading-[0.8] mb-6 italic">
                    {selectedProduct.name}
                  </h3>
                  
                  <p className="text-2xl text-white font-mono mb-12">
                    {selectedProduct.price}
                  </p>
                  
                  <div className="space-y-6 mb-12">
                    <div className="flex justify-between border-b border-white/10 pb-4">
                      <span className="font-mono text-gray-500 uppercase text-xs">Colorway</span>
                      <span className="font-bold uppercase text-sm tracking-widest">{selectedProduct.colorway}</span>
                    </div>
                    <div className="flex justify-between border-b border-white/10 pb-4">
                      <span className="font-mono text-gray-500 uppercase text-xs">Standard</span>
                      <span className="font-bold uppercase text-sm tracking-widest">Leopard-Claw V3</span>
                    </div>
                  </div>
                  
                  <p className="text-gray-400 leading-relaxed text-sm font-mono mb-12">
                    {selectedProduct.description}
                  </p>
                  
                  <button className="w-full py-6 bg-white text-black font-black italic uppercase tracking-[0.3em] hover:bg-orange-500 hover:text-white transition-all">
                    Add to Bag
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
