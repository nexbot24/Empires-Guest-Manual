
import React, { useState, useRef } from 'react';
import { Wifi, Clock, MapPin, Phone, Copy, X, Maximize2, Camera, QrCode, CheckCircle2, Settings, Smartphone, ChevronLeft, ChevronRight } from 'lucide-react';
import { PROPERTY_DATA, GALLERY_IMAGES } from '../constants';

const HomeView: React.FC = () => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [showWifiModal, setShowWifiModal] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [connectStep, setConnectStep] = useState<'selection' | 'qr' | 'manual'>('selection');
  const scrollRef = useRef<HTMLDivElement>(null);

  const scrollGallery = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const { clientWidth } = scrollRef.current;
      const scrollAmount = direction === 'left' ? -clientWidth : clientWidth;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, clientWidth } = scrollRef.current;
      const index = Math.round(scrollLeft / clientWidth);
      setActiveImageIndex(index);
    }
  };

  const copyWifi = () => {
    navigator.clipboard.writeText(PROPERTY_DATA.wifiPass);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSmartConnect = () => {
    copyWifi();
    setConnectStep('manual');
  };

  // Standard WiFi QR format
  const wifiQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    `WIFI:S:${PROPERTY_DATA.wifiName};T:WPA;P:${PROPERTY_DATA.wifiPass};;`
  )}&color=8B735B&bgcolor=FFFFFF`;

  return (
    <div className="space-y-6 pb-20 animate-in fade-in duration-700">
      {/* Property Gallery Section */}
      <section className="relative">
        <div className="relative h-72 rounded-3xl overflow-hidden shadow-xl group">
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex h-full overflow-x-auto snap-x snap-mandatory no-scrollbar cursor-grab active:cursor-grabbing"
          >
            {GALLERY_IMAGES.map((img, i) => (
              <div
                key={i}
                className="min-w-full h-full snap-center relative"
                onClick={() => setLightboxIndex(i)}
              >
                <img
                  src={img}
                  alt={`Property View ${i + 1}`}
                  className="w-full h-full object-cover brightness-90 transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-md p-2 rounded-full text-white pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <Maximize2 size={16} />
                </div>
              </div>
            ))}
          </div>

          <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-luxury-black/90 via-transparent to-transparent flex flex-col justify-end p-6">
            <h1 className="font-serif text-3xl mb-1 text-white">{PROPERTY_DATA.name}</h1>
            <p className="text-white/80 text-sm flex items-center gap-1">
              <MapPin size={14} className="text-earth" />
              {PROPERTY_DATA.address}
            </p>
          </div>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
            {GALLERY_IMAGES.map((_, i) => (
              <div
                key={i}
                className={`h-1 rounded-full transition-all duration-300 ${activeImageIndex === i ? 'w-6 bg-earth' : 'w-2 bg-white/40'
                  }`}
              />
            ))}
          </div>



          {/* Navigation Arrows */}
          <button
            onClick={(e) => { e.stopPropagation(); scrollGallery('left'); }}
            className={`absolute left-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-md p-2 rounded-full text-white transition-all ${activeImageIndex === 0 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            aria-label="Previous image"
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={(e) => { e.stopPropagation(); scrollGallery('right'); }}
            className={`absolute right-2 top-1/2 -translate-y-1/2 bg-black/20 hover:bg-black/40 backdrop-blur-md p-2 rounded-full text-white transition-all ${activeImageIndex === GALLERY_IMAGES.length - 1 ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
            aria-label="Next image"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </section>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-earth/5 dark:border-earth/10">
          <div className="bg-earth/20 p-2 rounded-lg">
            <Clock size={20} className="text-earth" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-luxury-black/50 dark:text-luxury-off/50">Check-In</p>
            <p className="text-sm font-semibold">{PROPERTY_DATA.checkIn}</p>
          </div>
        </div>
        <div className="glass p-4 rounded-2xl flex items-center gap-3 shadow-sm border border-earth/5 dark:border-earth/10">
          <div className="bg-earth/20 p-2 rounded-lg">
            <Clock size={20} className="text-earth" />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-luxury-black/50 dark:text-luxury-off/50">Check-Out</p>
            <p className="text-sm font-semibold">{PROPERTY_DATA.checkOut}</p>
          </div>
        </div>
      </div>

      {/* Early Check-in/out Request */}
      <a
        href="https://wa.me/442071014527?text=Hi!%20I%20would%20like%20to%20request%20early%20check-in%20or%20late%20check-out%20for%20my%20upcoming%20stay%20at%20Haven."
        target="_blank"
        rel="noopener noreferrer"
        className="glass p-4 rounded-2xl flex items-center justify-between shadow-sm border border-earth/10 hover:border-earth/30 transition-all active:scale-[0.98]"
      >
        <div className="flex items-center gap-3">
          <div className="bg-earth/10 p-2 rounded-lg">
            <Clock size={18} className="text-earth" />
          </div>
          <div>
            <p className="text-sm font-semibold">Request Early Check-in/Late Check-out</p>
            <p className="text-[10px] uppercase tracking-wider text-luxury-black/50 dark:text-luxury-off/50">Subject to availability</p>
          </div>
        </div>
        <div className="text-earth">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </a>

      {/* Wifi Card */}
      <section className="glass p-6 rounded-3xl relative overflow-hidden shadow-sm border border-earth/5 dark:border-earth/10">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Wifi size={80} className="text-earth" />
        </div>
        <div className="flex justify-between items-start mb-4">
          <h2 className="font-serif text-xl">WiFi Access</h2>
          <Wifi size={20} className="text-earth" />
        </div>
        <div className="space-y-3">
          <div className="bg-black/5 dark:bg-luxury-black/40 p-3 rounded-xl border border-earth/10 flex justify-between items-center">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-luxury-black/50 dark:text-luxury-off/50">Network</p>
              <p className="font-mono text-sm">{PROPERTY_DATA.wifiName}</p>
            </div>
          </div>
          <div className="bg-black/5 dark:bg-luxury-black/40 p-3 rounded-xl border border-earth/10 flex justify-between items-center">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-luxury-black/50 dark:text-luxury-off/50">Password</p>
              <p className="font-mono text-sm">{PROPERTY_DATA.wifiPass}</p>
            </div>
            <button onClick={copyWifi} className="text-earth hover:text-earth/80 p-2 transition-transform active:scale-90">
              {copied ? <CheckCircle2 size={18} className="text-green-500" /> : <Copy size={18} />}
            </button>
          </div>

          <button
            onClick={() => {
              setConnectStep('selection');
              setShowWifiModal(true);
            }}
            className="w-full mt-2 bg-earth text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 transition-transform active:scale-95 shadow-lg shadow-earth/20"
          >
            <QrCode size={18} />
            Connect Now
          </button>
        </div>
      </section >

      {/* Support Card */}
      <section className="bg-earth p-6 rounded-3xl text-white shadow-lg">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-serif text-xl font-bold">24/7 Support</h2>
          <Phone size={20} />
        </div>
        <p className="text-sm mb-4 font-medium opacity-90">
          Need immediate assistance? Our dedicated concierge team is available around the clock.
        </p>
        <button
          onClick={() => setShowSupportModal(true)}
          className="w-full flex items-center justify-center gap-2 bg-luxury-black text-white py-3 rounded-xl font-semibold uppercase tracking-widest text-xs transition-transform active:scale-95"
        >
          Contact Concierge
        </button>
      </section>

      {/* WiFi Connection Modal */}
      {
        showWifiModal && (
          <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
            <div className="glass w-full max-w-sm rounded-[40px] p-8 relative border-earth/30 flex flex-col shadow-2xl overflow-hidden min-h-[480px]">
              <button
                onClick={() => setShowWifiModal(false)}
                className="absolute top-6 right-6 text-luxury-black/40 dark:text-luxury-off/40 hover:text-earth p-2 z-10"
              >
                <X size={24} />
              </button>

              {connectStep === 'selection' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                  <div className="w-16 h-16 bg-earth/10 rounded-full flex items-center justify-center text-earth mb-6">
                    <Wifi size={32} />
                  </div>
                  <h2 className="font-serif text-2xl mb-2">Connect to WiFi</h2>
                  <p className="text-sm text-luxury-black/60 dark:text-luxury-off/60 mb-8">How would you like to connect?</p>

                  <div className="space-y-4 w-full">
                    <button
                      onClick={() => setConnectStep('qr')}
                      className="w-full flex items-center gap-4 p-5 glass rounded-2xl border border-earth/20 hover:border-earth transition-colors text-left"
                    >
                      <div className="bg-earth/10 p-3 rounded-xl text-earth"><QrCode size={20} /></div>
                      <div>
                        <p className="font-bold text-sm">Scan QR Code</p>
                        <p className="text-[10px] uppercase tracking-wider opacity-60">For another device</p>
                      </div>
                    </button>

                    <button
                      onClick={handleSmartConnect}
                      className="w-full flex items-center gap-4 p-5 glass rounded-2xl border border-earth/20 hover:border-earth transition-colors text-left"
                    >
                      <div className="bg-earth/10 p-3 rounded-xl text-earth"><Smartphone size={20} /></div>
                      <div>
                        <p className="font-bold text-sm">Smart Connect</p>
                        <p className="text-[10px] uppercase tracking-wider opacity-60">For this device</p>
                      </div>
                    </button>
                  </div>
                </div>
              )}

              {connectStep === 'qr' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95 duration-500">
                  <h2 className="font-serif text-2xl mb-1">Scan to Join</h2>
                  <p className="text-[10px] text-earth uppercase tracking-widest font-bold mb-8">Fast connection for guests</p>

                  <div className="relative p-4 bg-white rounded-3xl shadow-inner mb-8">
                    <img src={wifiQrUrl} alt="WiFi QR" className="w-44 h-44 object-contain" />
                    <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-earth rounded-tl-xl"></div>
                    <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-earth rounded-br-xl"></div>
                  </div>

                  <button
                    onClick={() => setConnectStep('selection')}
                    className="text-[10px] uppercase tracking-widest text-earth font-bold hover:underline"
                  >
                    Back to options
                  </button>
                </div>
              )}

              {connectStep === 'manual' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center animate-in fade-in slide-in-from-right-4 duration-500">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center text-green-500 mb-6">
                    <CheckCircle2 size={32} />
                  </div>
                  <h2 className="font-serif text-2xl mb-2">Password Copied!</h2>
                  <p className="text-sm text-luxury-black/60 dark:text-luxury-off/60 mb-8 px-4">
                    The password is on your clipboard. Just select the network in your settings and paste.
                  </p>

                  <div className="bg-luxury-black/5 dark:bg-white/5 p-4 rounded-2xl text-left border border-earth/10 w-full mb-8">
                    <p className="text-[10px] uppercase tracking-widest text-earth font-bold mb-1">Select Network</p>
                    <p className="text-sm font-semibold truncate">{PROPERTY_DATA.wifiName}</p>
                  </div>

                  <a
                    href="App-Prefs:root=WIFI"
                    className="w-full bg-earth text-white py-4 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-lg shadow-earth/20 mb-4"
                  >
                    <Settings size={18} />
                    Open WiFi Settings
                  </a>

                  <button
                    onClick={() => setConnectStep('selection')}
                    className="text-[10px] uppercase tracking-widest text-luxury-black/40 dark:text-luxury-off/40 font-bold hover:underline"
                  >
                    Choose another way
                  </button>
                </div>
              )}
            </div>
          </div>
        )
      }

      {/* Image Lightbox */}
      {
        lightboxIndex !== null && (
          <div
            className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-xl animate-in fade-in duration-300 flex items-center justify-center p-4 touch-none"
            onClick={() => setLightboxIndex(null)}
          >
            {/* Close Button */}
            <button
              className="absolute top-6 right-6 text-white/60 hover:text-white p-2 z-50 transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setLightboxIndex(null);
              }}
            >
              <X size={28} />
            </button>

            {/* Navigation - Left */}
            {lightboxIndex > 0 && (
              <button
                className="absolute left-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md hidden md:flex z-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex - 1);
                }}
              >
                <ChevronLeft size={24} />
              </button>
            )}

            {/* Navigation - Right */}
            {lightboxIndex < GALLERY_IMAGES.length - 1 && (
              <button
                className="absolute right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all backdrop-blur-md hidden md:flex z-50"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxIndex(lightboxIndex + 1);
                }}
              >
                <ChevronRight size={24} />
              </button>
            )}

            {/* Main Image */}
            <div
              className="relative w-full max-w-4xl max-h-[85vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()} // Prevent close when clicking image area
            >
              <img
                src={GALLERY_IMAGES[lightboxIndex]}
                alt={`Gallery view ${lightboxIndex + 1}`}
                className="max-w-full max-h-full object-contain rounded-lg shadow-2xl animate-in zoom-in-95 duration-300"
              />

              {/* Mobile tap areas for navigation */}
              <div className="absolute inset-y-0 left-0 w-1/4 z-10 md:hidden" onClick={() => lightboxIndex > 0 && setLightboxIndex(lightboxIndex - 1)} />
              <div className="absolute inset-y-0 right-0 w-1/4 z-10 md:hidden" onClick={() => lightboxIndex < GALLERY_IMAGES.length - 1 && setLightboxIndex(lightboxIndex + 1)} />
            </div>

            {/* Counter */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/5">
              <p className="text-white text-xs font-bold tracking-widest uppercase">
                {lightboxIndex + 1} / {GALLERY_IMAGES.length}
              </p>
            </div>
          </div>
        )
      }

      {/* Support Options Modal */}
      {showSupportModal && (
        <div className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-6 animate-in fade-in zoom-in duration-300">
          <div className="glass w-full max-w-sm rounded-[40px] p-8 relative border-earth/30 shadow-2xl">
            <button
              onClick={() => setShowSupportModal(false)}
              className="absolute top-6 right-6 text-luxury-black/40 dark:text-luxury-off/40 hover:text-earth p-2"
            >
              <X size={24} />
            </button>

            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-earth/10 rounded-full flex items-center justify-center text-earth mb-4 mx-auto">
                <Phone size={32} />
              </div>
              <h3 className="font-serif text-2xl font-bold mb-2">Contact Support</h3>
              <p className="text-sm text-luxury-black/60 dark:text-luxury-off/60">
                Choose how you'd like to reach our 24/7 concierge team
              </p>
            </div>

            <div className="space-y-3">
              <a
                href="tel:+447592249258"
                className="flex items-center justify-center gap-3 bg-earth text-white py-4 rounded-2xl font-semibold transition-transform active:scale-95 shadow-lg"
              >
                <Phone size={20} />
                <span>Call Now</span>
              </a>

              <a
                href="https://wa.me/442071014527"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-[#25D366] text-white py-4 rounded-2xl font-semibold transition-transform active:scale-95 shadow-lg"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
                <span>WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      )}

    </div >
  );
};

export default HomeView;
