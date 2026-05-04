/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import * as Icons from 'lucide-react';
import { 
  ChevronRight, 
  Menu, 
  X,
  MapPin, 
  Activity,
  CheckCircle2,
  Users,
  Server,
  Zap,
  Lock,
  Wifi,
  ShieldCheck
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { adminStore, GlobalSettings, Stat, Unit, Image, OrgUnit } from '../admin-store';
import {
  fetchAllImages,
  fetchAllStats,
  fetchAllUnits,
  fetchAllOrgUnits,
  fetchSettings,
} from '../firebaseService';

const systems = [
  'نظام المراسلات',
  'مجلد المشاركة',
  'نظام CLAIMS',
  'البوابة الداخلية',
  'نظام الوفيات',
  'تطبيق ميدان'
];

export default function HomePage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  // Dynamic State
  const [settings, setSettings] = useState<GlobalSettings>(adminStore.getSettings());
  const [stats, setStats] = useState<Stat[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [gallery, setGallery] = useState<Image[]>([]);
  const [orgUnits, setOrgUnits] = useState<OrgUnit[]>([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);

    // Load all data from Firebase with localStorage fallback
    const loadData = async () => {
      try {
        const [fbSettings, fbStats, fbUnits, fbOrgUnits, fbImages] = await Promise.allSettled([
          fetchSettings(),
          fetchAllStats(),
          fetchAllUnits(),
          fetchAllOrgUnits(),
          fetchAllImages(),
        ]);

        if (fbSettings.status === 'fulfilled' && fbSettings.value) {
          setSettings(fbSettings.value);
        } else {
          setSettings(adminStore.getSettings());
        }

        if (fbStats.status === 'fulfilled' && fbStats.value.length > 0) {
          setStats(fbStats.value);
        } else {
          setStats(adminStore.getAllStats());
        }

        if (fbUnits.status === 'fulfilled' && fbUnits.value.length > 0) {
          setUnits(fbUnits.value);
        } else {
          setUnits(adminStore.getAllUnits());
        }

        if (fbOrgUnits.status === 'fulfilled' && fbOrgUnits.value.length > 0) {
          setOrgUnits(fbOrgUnits.value.sort((a: OrgUnit, b: OrgUnit) => (a.order || 0) - (b.order || 0)));
        } else {
          setOrgUnits(adminStore.getAllOrgUnits());
        }

        if (fbImages.status === 'fulfilled' && fbImages.value.length > 0) {
          setGallery(fbImages.value as Image[]);
        }
      } catch (err) {
        console.error('Error loading data from Firebase, using local fallback:', err);
        setSettings(adminStore.getSettings());
        setStats(adminStore.getAllStats());
        setUnits(adminStore.getAllUnits());
        setOrgUnits(adminStore.getAllOrgUnits());
      }
    };

    loadData();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getDynamicIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || Activity;
    return <Icon size={24} />;
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 dir-rtl" dir="rtl">
      {/* Navigation */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 flex items-center justify-center">
              <img src={settings.logoUrl || "logo.png"} alt="Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight text-brand-blue">الأدلة الجنائية</h1>
              <p className="text-[10px] text-slate-500 font-bold leading-tight">إدارة الاتصالات وتقنية المعلومات</p>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium">
            <a href="#hero" className="hover:text-brand-gold transition-colors">الرئيسية</a>
            <a href="#units" className="hover:text-brand-gold transition-colors">الوحدات الميدانية</a>
            <a href="#gallery" className="hover:text-brand-gold transition-colors">معرض الصور</a>
            <a href="#stats" className="hover:text-brand-gold transition-colors">أرقام وإحصائيات</a>
            <a href="#systems" className="hover:text-brand-gold transition-colors">الأنظمة الرقمية</a>
          </div>

          <button className="md:hidden p-2 text-slate-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-white pt-24 px-8 md:hidden"
          >
            <div className="flex flex-col gap-6 text-xl font-bold">
              <a href="#hero" onClick={() => setIsMenuOpen(false)}>الرئيسية</a>
              <a href="#units" onClick={() => setIsMenuOpen(false)}>الوحدات الميدانية</a>
              <a href="#gallery" onClick={() => setIsMenuOpen(false)}>معرض الصور</a>
              <a href="#stats" onClick={() => setIsMenuOpen(false)}>أرقام وإحصائيات</a>
              <a href="#systems" onClick={() => setIsMenuOpen(false)}>الأنظمة الرقمية</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main>
        {/* Hero Section */}
        <section id="hero" className="relative pt-32 pb-20 md:pt-48 md:pb-32 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full -z-10 overflow-hidden">
            <div className="absolute top-[-10%] right-[-5%] w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-3xl opacity-60 animate-pulse"></div>
            <div className="absolute bottom-[-10%] left-[-5%] w-[300px] h-[300px] bg-brand-gold/5 rounded-full blur-3xl opacity-60"></div>
          </div>

          <div className="container mx-auto px-6 text-center lg:text-right flex flex-col lg:flex-row items-center justify-between gap-12">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="lg:w-1/2"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-gold/10 text-brand-gold rounded-full text-xs font-bold mb-6">
                <Zap size={14} />
                <span>خطة موسم حج 1446-2026</span>
              </div>
              <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-[1.1] mb-6">
                الخطة الفنية <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-brand-blue to-brand-blue/80">للتجهيزات التقنية</span>
              </h2>
              <p className="text-lg text-slate-600 max-w-xl mb-10 leading-relaxed mx-auto lg:mx-0">
                تسهم التكنولوجيا بدور محوري في تنظيم وتعزيز موسم الحج من خلال توفير المعلومات في الوقت الفعلي، وتيسير عمليات الاتصال، ورفع مستويات الأمان والسلامة، وبفضلها يمكن تحقيق تجربة حج أكثر سلاسة وشمولية لجميع المشاركين في أداء المناسك. 
                <br /><br />
                وتحرص إدارة الاتصالات وتقنية المعلومات خلال الموسم على تحديث وتركيب وربط وتفعيل الأنظمة المختلفة، بما يضمن انسيابية العمليات وسرعة تحقيق الأهداف لخدمة ضيوف الرحمن على الوجه الأمثل.
              </p>
              <div className="flex flex-wrap gap-4 justify-center lg:justify-start">
                <a href="#units" className="px-8 py-4 bg-brand-blue text-white rounded-xl font-bold shadow-lg shadow-brand-blue/20 hover:bg-brand-blue/90 transition-all flex items-center gap-2">
                  استكشاف الوحدات الميدانية
                  <ChevronRight size={20} className="rotate-180" />
                </a>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1 }}
              className="lg:w-1/2 relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl shadow-brand-blue/10 border-4 border-white">
                <img 
                  src={settings.heroImageUrl || "hajj_hero.jpg"} 
                  alt="Hajj Holy Site" 
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <div className="absolute bottom-8 right-8 text-white text-right">
                  <p className="text-sm opacity-80 mb-1">تجهيزات متكاملة</p>
                  <p className="text-xl font-bold">المشاعر المقدسة 1446</p>
                </div>
              </div>
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl z-20 hidden md:block"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-brand-gold/10 rounded-full flex items-center justify-center text-brand-gold">
                    <Activity />
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">الحالة التشغيلية</p>
                    <p className="text-lg font-black text-brand-blue">جاهزية 100%</p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* Organizational Structure Section */}
        {orgUnits.length > 0 && (
          <section id="orgchart" className="py-24 bg-white">
            <div className="container mx-auto px-6">
              {/* Section Title Banner */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="org-title-banner mx-auto mb-16"
              >
                <div className="flex items-center justify-center gap-3 mb-1">
                  <div className="w-10 h-10 flex items-center justify-center">
                    <img src={settings.logoUrl || "logo.png"} alt="Logo" className="w-full h-full object-contain" style={{ filter: 'brightness(0) invert(1)' }} />
                  </div>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-white text-center leading-relaxed">
                  قيادة الأدلة الجنائية<br />والوحدات التابعة لها :
                </h3>
              </motion.div>

              {/* Org Chart Container */}
              <div className="org-chart-container">
                {/* Root Node */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="org-root-node"
                >
                  <div className="org-root-icon">
                    <img src={settings.logoUrl || "logo.png"} alt="Logo" className="w-10 h-10 object-contain" />
                  </div>
                  <div className="org-root-text">
                    <p className="text-lg md:text-xl font-black text-brand-blue leading-relaxed">
                      قيادة الادلة الجنائية
                    </p>
                    <p className="text-sm text-slate-500 font-bold">
                      بمجمع الأمن العام بالعوالي :
                    </p>
                  </div>
                </motion.div>


                {/* Child Unit Cards */}
                <div className="org-units-row">
                  {orgUnits.map((unit, idx) => (
                    <motion.div
                      key={unit.id}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.12 }}
                      viewport={{ once: true }}
                      className="org-unit-card group"
                    >
                      <div className="org-unit-number">
                        <span>{idx + 1}</span>
                      </div>
                      <div className="org-unit-logo">
                        {unit.logoUrl ? (
                          <img src={unit.logoUrl} alt={unit.name} className="w-full h-full object-contain p-2" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <MapPin size={28} className="text-brand-gold" />
                          </div>
                        )}
                      </div>
                      <p className="org-unit-name">{unit.name}</p>
                      <div className="org-unit-divider"></div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Field Units Section */}
        <section id="units" className="py-24 bg-slate-50">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16 px-4">
              <h3 className="text-4xl md:text-5xl font-black mb-6 text-slate-900 leading-tight">جميع الوحدات الميدانية</h3>
              <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">تجهيزات موسعة في المواقع لضمان التشغيل الكامل خلال الموسم في المشاعر المقدسة.</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {units.map((unit, unitIdx) => (
                <motion.div
                  key={unit.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: unitIdx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-[2rem] p-8 shadow-xl border border-slate-100 flex flex-col hover:border-brand-gold transition-all group"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="w-14 h-14 bg-brand-blue/5 text-brand-blue rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                      <MapPin size={28} />
                    </div>
                    <span className="text-[10px] font-black text-brand-gold bg-brand-gold/10 px-3 py-1 rounded-full uppercase tracking-widest">
                      وحدة ميدانية
                    </span>
                  </div>
                  
                  <h4 className="text-2xl font-black text-slate-900 mb-4">{unit.name}</h4>
                  <p className="text-slate-600 mb-8 flex-grow leading-relaxed">{unit.description}</p>
                  
                  <div className="space-y-3 pt-6 border-t border-slate-50">
                    {unit.details.map((detail, idx) => (
                      <div key={idx} className="flex items-center gap-3 text-sm font-medium text-slate-700">
                        <div className="w-5 h-5 bg-green-500/10 text-green-500 rounded-full flex items-center justify-center shrink-0">
                          <CheckCircle2 size={12} />
                        </div>
                        <span>{detail}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section id="stats" className="py-20 bg-white border-y border-slate-100">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h3 className="text-3xl font-black mb-4">أبرز الأرقام التشغيلية</h3>
              <p className="text-slate-500">إحصائيات التجهيزات التقنية المنفذة حتى الآن</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 md:gap-10">
              {stats.map((stat, idx) => (
                <motion.div 
                  key={stat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-slate-50 p-6 rounded-2xl border border-slate-100 text-center hover:shadow-lg transition-all group"
                >
                  <div className={`mx-auto w-12 h-12 mb-4 flex items-center justify-center transition-transform group-hover:scale-110 ${stat.color} bg-white rounded-xl shadow-sm`}>
                    {getDynamicIcon(stat.iconName)}
                  </div>
                  <div className="text-3xl font-black text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-xs font-bold text-slate-500">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Gallery Section */}
        <section id="gallery" className="py-24 bg-slate-50 border-t border-slate-200">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <p className="text-2xl text-slate-800 font-black leading-relaxed max-w-3xl mx-auto">
                توثيق مرئي لأعمال إدارة الاتصالات وتقنية المعلومات الميدانية (تجهيز المواقع الميدانية)
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {gallery.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="group bg-white rounded-3xl overflow-hidden shadow-lg border border-slate-100"
                >
                  <div className="relative aspect-video overflow-hidden">
                    <img 
                      src={item.url} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6">
                      <p className="text-white text-sm font-medium">{item.title}</p>
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold mb-2 text-brand-blue">{item.title}</h4>
                    <p className="text-slate-600 text-sm leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Systems Section */}
        <section id="systems" className="py-24 bg-brand-blue text-white overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[120px] -z-0"></div>
          
          <div className="container mx-auto px-6 relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">
              <div className="lg:w-1/2">
                <h3 className="text-4xl font-black mb-8 leading-tight">جاهزية الأنظمة <br />والحلول البرمجية</h3>
                <p className="text-slate-400 text-lg mb-10">
                  تم تشغيل وتفعيل باقة متكاملة من الأنظمة المركزية لضمان سرعة معالجة البيانات وتدفق المراسلات بين كافة مراكز القيادة والسيطرة.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {systems.map((sys) => (
                    <div key={sys} className="flex items-center gap-3 px-6 py-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-colors">
                      <div className="w-2 h-2 rounded-full bg-brand-gold"></div>
                      <span className="font-bold">{sys}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="lg:w-1/2 relative">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4 pt-12">
                    <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center p-8">
                       <Server className="w-full h-full text-brand-gold opacity-60" />
                    </div>
                    <div className="aspect-[4/3] bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center p-8">
                        <Users className="w-full h-full text-brand-gold opacity-60" />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="aspect-[4/3] bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center p-8">
                         <Wifi className="w-full h-full text-brand-gold opacity-60" />
                    </div>
                    <div className="aspect-square bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center p-8">
                         <ShieldCheck className="w-full h-full text-brand-gold opacity-60" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="bg-brand-blue py-12 text-center text-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <img src={settings.logoUrl || "logo.png"} alt="Logo" className="w-10 h-10 object-contain invert brightness-0 grayscale" style={{ filter: 'invert(1) brightness(100%)' }} />
            <div className="text-right border-r border-white/20 pr-4">
              <span className="font-bold block text-lg leading-tight uppercase">الأدلة الجنائية</span>
              <span className="text-[10px] block text-white/50 font-bold">إدارة الاتصالات وتقنية المعلومات</span>
            </div>
          </div>
          <p className="text-white/60 text-sm font-bold">جميع الحقوق محفوظة لصالح إيلين القحطاني</p>
        </div>
      </footer>
    </div>
  );
}
