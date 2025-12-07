'use client';

import { useEffect } from 'react';

export default function HeroAsciiOne() {
  useEffect(() => {
    const embedScript = document.createElement('script');
    embedScript.type = 'text/javascript';
    embedScript.textContent = `
      !function(){
        if(!window.UnicornStudio){
          window.UnicornStudio={isInitialized:!1};
          var i=document.createElement("script");
          i.src="https://cdn.jsdelivr.net/gh/hiunicornstudio/unicornstudio.js@v1.4.33/dist/unicornStudio.umd.js";
          i.onload=function(){
            window.UnicornStudio.isInitialized||(UnicornStudio.init(),window.UnicornStudio.isInitialized=!0)
          };
          (document.head || document.body).appendChild(i)
        }
      }();
    `;
    document.head.appendChild(embedScript);

    // Add CSS to hide branding elements and crop canvas
    const style = document.createElement('style');
    style.textContent = `
      [data-us-project] {
        position: relative !important;
        overflow: hidden !important;
      }
      
      [data-us-project] canvas {
        clip-path: inset(0 0 10% 0) !important;
      }
      
      [data-us-project] * {
        pointer-events: none !important;
      }
      [data-us-project] a[href*="unicorn"],
      [data-us-project] button[title*="unicorn"],
      [data-us-project] div[title*="Made with"],
      [data-us-project] .unicorn-brand,
      [data-us-project] [class*="brand"],
      [data-us-project] [class*="credit"],
      [data-us-project] [class*="watermark"] {
        display: none !important;
        visibility: hidden !important;
        opacity: 0 !important;
        position: absolute !important;
        left: -9999px !important;
        top: -9999px !important;
      }
    `;
    document.head.appendChild(style);

    // Function to aggressively hide branding
    const hideBranding = () => {
      // Target all possible UnicornStudio containers
      const selectors = [
        '[data-us-project]',
        '[data-us-project="OMzqyUv6M3kSnv0JeAtC"]',
        '.unicorn-studio-container',
        'canvas[aria-label*="Unicorn"]'
      ];
      
      selectors.forEach(selector => {
        const containers = document.querySelectorAll(selector);
        containers.forEach(container => {
          // Find and remove any elements containing branding text
          const allElements = container.querySelectorAll('*');
          allElements.forEach(el => {
            const text = (el.textContent || '').toLowerCase();
            const title = (el.getAttribute('title') || '').toLowerCase();
            const href = (el.getAttribute('href') || '').toLowerCase();
            
            if (
              text.includes('made with') || 
              text.includes('unicorn') ||
              title.includes('made with') ||
              title.includes('unicorn') ||
              href.includes('unicorn.studio')
            ) {
              (el as HTMLElement).style.display = 'none';
              (el as HTMLElement).style.visibility = 'hidden';
              (el as HTMLElement).style.opacity = '0';
              (el as HTMLElement).style.pointerEvents = 'none';
              (el as HTMLElement).style.position = 'absolute';
              (el as HTMLElement).style.left = '-9999px';
              (el as HTMLElement).style.top = '-9999px';
              // Also try to remove it
              try { el.remove(); } catch(e) {}
            }
          });
        });
      });
    };

    // Run immediately and more frequently
    hideBranding();
    const interval = setInterval(hideBranding, 50); // More frequent checks
    
    // Also try after delays
    setTimeout(hideBranding, 500);
    setTimeout(hideBranding, 1000);
    setTimeout(hideBranding, 2000);
    setTimeout(hideBranding, 5000);
    setTimeout(hideBranding, 10000);

    return () => {
      clearInterval(interval);
      document.head.removeChild(embedScript);
      document.head.removeChild(style);
    };
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 font-sans">
      {/* Background Animation - toned down with overlay */}
      <div className="absolute inset-0 w-full h-full hidden lg:block">
        <div 
          data-us-project="OMzqyUv6M3kSnv0JeAtC" 
          style={{ width: '100%', height: '100%', minHeight: '100vh' }}
        />
        {/* Dark overlay to tone down the animation */}
        <div className="absolute inset-0 bg-neutral-950/60 pointer-events-none" />
      </div>

      {/* Mobile subtle background */}
      <div className="absolute inset-0 w-full h-full lg:hidden">
        <div className="stars-bg absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-b from-neutral-950 via-neutral-950/95 to-neutral-900" />
      </div>

      {/* Subtle grid pattern overlay */}
      <div className="absolute inset-0 grid-pattern opacity-[0.03] pointer-events-none" />

      {/* Top Header */}
      <header className="absolute top-0 left-0 right-0 z-20 border-b border-white/10">
        <div className="container mx-auto px-6 lg:px-12 py-4 lg:py-5 flex items-center justify-between">
          <div className="flex items-center gap-3 lg:gap-5">
            <div className="flex items-baseline text-white" style={{ letterSpacing: '-0.02em' }}>
              <span className="font-[family-name:var(--font-manrope)] text-2xl lg:text-3xl font-bold leading-none">9</span>
              <span className="font-[family-name:var(--font-manrope)] text-base lg:text-xl font-light leading-none">x</span>
              <span className="font-[family-name:var(--font-marck)] text-2xl lg:text-3xl font-medium leading-none">f</span>
              <span className="font-[family-name:var(--font-manrope)] text-2xl lg:text-3xl font-semibold tracking-tight ml-2">Capital</span>
            </div>
            <div className="h-4 w-px bg-white/20" />
            <span className="text-white/40 text-xs font-medium tracking-wide uppercase">Fundraising</span>
          </div>
          
          <nav className="hidden lg:flex items-center gap-8 text-sm text-white/60">
            <a href="#" className="hover:text-white transition-colors">Reg CF</a>
            <a href="#" className="hover:text-white transition-colors">Reg A+</a>
            <a href="#" className="hover:text-white transition-colors">Resources</a>
          </nav>
        </div>
      </header>

      {/* Corner Frame Accents - more subtle */}
      <div className="absolute top-0 left-0 w-6 h-6 lg:w-8 lg:h-8 border-t border-l border-white/10 z-20" />
      <div className="absolute top-0 right-0 w-6 h-6 lg:w-8 lg:h-8 border-t border-r border-white/10 z-20" />
      <div className="absolute bottom-0 left-0 w-6 h-6 lg:w-8 lg:h-8 border-b border-l border-white/10 z-20" />
      <div className="absolute bottom-0 right-0 w-6 h-6 lg:w-8 lg:h-8 border-b border-r border-white/10 z-20" />

      {/* Main Content */}
      <div className="relative z-10 flex min-h-screen items-center pt-20 lg:pt-0">
        <div className="container mx-auto px-6 lg:px-12">
          <div className="max-w-2xl lg:ml-auto lg:mr-[8%]">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-white/30" />
              <span className="text-white/50 text-xs font-medium tracking-widest uppercase">SEC Compliant</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-6xl font-semibold text-white mb-6 leading-[1.1] tracking-tight">
              Raise Capital
              <br />
              <span className="text-white/70">With Confidence</span>
            </h1>

            {/* Description */}
            <p className="text-base lg:text-lg text-white/60 mb-8 leading-relaxed max-w-lg">
              Navigate Regulation CF and Regulation A+ fundraising with our guided platform. From Form ID to closing—every step, simplified.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-white text-neutral-900 font-medium text-sm rounded hover:bg-white/90 transition-colors">
                Start Your Raise
              </button>
              
              <button className="px-6 py-3 bg-transparent border border-white/20 text-white font-medium text-sm rounded hover:bg-white/5 hover:border-white/30 transition-colors">
                Learn More
              </button>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/10">
              <div>
                <div className="text-2xl font-semibold text-white">$5M</div>
                <div className="text-xs text-white/40 mt-1">Reg CF Limit</div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <div className="text-2xl font-semibold text-white">$75M</div>
                <div className="text-xs text-white/40 mt-1">Reg A+ Limit</div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <div className="text-2xl font-semibold text-white">21 Days</div>
                <div className="text-xs text-white/40 mt-1">Min. Campaign</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer - simplified */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          <div className="text-xs text-white/30 font-mono">
            v1.0.0
          </div>
          
          <div className="flex items-center gap-6 text-xs text-white/30">
            <span>© 2025 <span className="font-[family-name:var(--font-manrope)] font-bold">9</span><span className="font-[family-name:var(--font-manrope)] font-light">x</span><span className="font-[family-name:var(--font-marck)]">f</span> Capital</span>
            <a href="#" className="hover:text-white/50 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/50 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .grid-pattern {
          background-image: 
            linear-gradient(to right, rgba(255,255,255,0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.1) 1px, transparent 1px);
          background-size: 60px 60px;
        }
        
        .stars-bg {
          background-image: 
            radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,0.3), transparent),
            radial-gradient(1px 1px at 60% 70%, rgba(255,255,255,0.2), transparent),
            radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,0.25), transparent),
            radial-gradient(1px 1px at 40% 80%, rgba(255,255,255,0.15), transparent);
          background-size: 200px 200px;
        }
      `}</style>
    </main>
  );
}
