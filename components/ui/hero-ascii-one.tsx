'use client';

import dynamic from 'next/dynamic';

const FloatingSphere = dynamic(() => import('./floating-sphere'), { ssr: false });

export default function HeroAsciiOne() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-neutral-950 font-[family-name:var(--font-manrope)]">
      {/* Unified background - full screen */}
      <div className="absolute inset-0 w-full h-full">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-neutral-950 via-neutral-900 to-neutral-950" />
        
        {/* Animated gradient orbs */}
        <div className="gradient-orb gradient-orb-1" />
        <div className="gradient-orb gradient-orb-2" />
        <div className="gradient-orb gradient-orb-3" />
        
        {/* Noise texture overlay */}
        <div className="absolute inset-0 noise-texture opacity-[0.03]" />
        
        {/* Subtle vignette */}
        <div className="absolute inset-0 bg-radial-vignette" />
      </div>

      {/* 3D Animation - positioned left but extends across */}
      <div className="absolute inset-0 hidden lg:block pointer-events-none">
        <div className="absolute inset-y-0 left-0 w-[60%]">
          <FloatingSphere />
        </div>
      </div>

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
            <span className="text-white/40 text-xs font-normal tracking-wide uppercase">Fundraising</span>
          </div>
          
          <nav className="hidden lg:flex items-center gap-8 text-sm font-normal text-white/60">
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
          <div className="max-w-xl lg:ml-auto lg:mr-0 lg:pr-12">
            {/* Eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-px bg-white/30" />
              <span className="text-white/50 text-xs font-normal tracking-widest uppercase">SEC Compliant</span>
            </div>

            {/* Title */}
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Raise Capital
              <br />
              <span className="text-white/70">With Confidence</span>
            </h1>

            {/* Description */}
            <p className="text-base lg:text-lg text-white/60 mb-8 leading-relaxed max-w-lg font-normal">
              Navigate Regulation CF and Regulation A+ fundraising with our guided platform. From Form ID to closing—every step, simplified.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-6 py-3 bg-white text-neutral-900 font-semibold text-sm rounded hover:bg-white/90 transition-colors">
                Start Your Raise
              </button>
              
              <button className="px-6 py-3 bg-transparent border border-white/20 text-white font-semibold text-sm rounded hover:bg-white/5 hover:border-white/30 transition-colors">
                Learn More
              </button>
            </div>

            {/* Stats row */}
            <div className="flex items-center gap-8 mt-12 pt-8 border-t border-white/10">
              <div>
                <div className="text-2xl font-bold text-white">$5M</div>
                <div className="text-xs font-normal text-white/40 mt-1">Reg CF Limit</div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <div className="text-2xl font-bold text-white">$75M</div>
                <div className="text-xs font-normal text-white/40 mt-1">Reg A+ Limit</div>
              </div>
              <div className="h-8 w-px bg-white/10" />
              <div>
                <div className="text-2xl font-bold text-white">21 Days</div>
                <div className="text-xs font-normal text-white/40 mt-1">Min. Campaign</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Footer - simplified */}
      <footer className="absolute bottom-0 left-0 right-0 z-20 border-t border-white/10">
        <div className="container mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          <div className="text-xs text-white/30 font-normal">
            v1.0.0
          </div>
          
          <div className="flex items-center gap-6 text-xs font-normal text-white/30">
            <span>© 2025 <span className="font-[family-name:var(--font-manrope)] font-bold">9</span><span className="font-[family-name:var(--font-manrope)] font-light">x</span><span className="font-[family-name:var(--font-marck)]">f</span> Capital</span>
            <a href="#" className="hover:text-white/50 transition-colors">Privacy</a>
            <a href="#" className="hover:text-white/50 transition-colors">Terms</a>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .gradient-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.15;
        }
        
        .gradient-orb-1 {
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(30, 30, 50, 0.8) 0%, transparent 70%);
          top: -200px;
          left: -100px;
          animation: float1 25s ease-in-out infinite;
        }
        
        .gradient-orb-2 {
          width: 500px;
          height: 500px;
          background: radial-gradient(circle, rgba(20, 25, 40, 0.6) 0%, transparent 70%);
          bottom: -150px;
          right: -100px;
          animation: float2 30s ease-in-out infinite;
        }
        
        .gradient-orb-3 {
          width: 400px;
          height: 400px;
          background: radial-gradient(circle, rgba(25, 20, 35, 0.5) 0%, transparent 70%);
          top: 40%;
          left: 30%;
          animation: float3 20s ease-in-out infinite;
        }
        
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, 20px) scale(1.05); }
          66% { transform: translate(-20px, 30px) scale(0.95); }
        }
        
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-25px, -15px) scale(0.95); }
          66% { transform: translate(20px, -25px) scale(1.05); }
        }
        
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(40px, -30px) scale(1.1); }
        }
        
        .noise-texture {
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E");
        }
        
        .bg-radial-vignette {
          background: radial-gradient(ellipse at center, transparent 0%, rgba(10, 10, 10, 0.4) 100%);
        }
      `}</style>
    </main>
  );
}
