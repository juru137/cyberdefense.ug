"use client";

export default function InviteCard() {
  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 font-mono">
      {/* Scanline overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIC8+PC9zdmc+')]"></div>

      {/* Main card container */}
      <div className="relative w-full max-w-lg border border-green-500/30 bg-black/80 p-8 shadow-[0_0_25px_rgba(34,197,94,0.1)] backdrop-blur-sm">
        {/* Corner decorations */}
        <div className="absolute left-0 top-0 h-4 w-4 border-l-2 border-t-2 border-green-500"></div>
        <div className="absolute right-0 top-0 h-4 w-4 border-r-2 border-t-2 border-green-500"></div>
        <div className="absolute bottom-0 left-0 h-4 w-4 border-b-2 border-l-2 border-green-500"></div>
        <div className="absolute bottom-0 right-0 h-4 w-4 border-b-2 border-r-2 border-green-500"></div>

        {/* Content */}
        <div className="relative z-10 flex flex-col items-center space-y-6 text-green-500">
          {/* Header with glitch effect */}
          <div className="group relative">
            <h1 className="text-center text-2xl font-bold uppercase tracking-[0.5em] text-green-400">
              Ghost Protocol
            </h1>
            <h1
              className="absolute left-0 top-0 text-center text-2xl font-bold uppercase tracking-[0.5em] text-red-500 opacity-0 group-hover:animate-glitch-1 group-hover:opacity-70"
              aria-hidden="true"
            >
              Ghost Protocol
            </h1>
            <h1
              className="absolute left-0 top-0 text-center text-2xl font-bold uppercase tracking-[0.5em] text-blue-500 opacity-0 group-hover:animate-glitch-2 group-hover:opacity-70"
              aria-hidden="true"
            >
              Ghost Protocol
            </h1>
          </div>

          {/* Divider */}
          <div className="flex w-full items-center space-x-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
            <span className="text-xs text-green-600/70">{'< / >'}</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-green-500/50 to-transparent"></div>
          </div>

          {/* Status line */}
          <div className="flex items-center space-x-2 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            <span className="tracking-widest text-green-500/80">
              ENCRYPTED TRANSMISSION
            </span>
          </div>

          {/* Main message */}
          <div className="space-y-3 text-center">
            <p className="text-base text-green-500/90">
              <span className="text-green-600">root@ghostnet:~$ </span>
              <span>./deploy_invite.sh</span>
            </p>
            <div className="space-y-1 text-sm text-green-400/70">
              <p>
                Access Level: <span className="text-green-300">ALPHA</span>
              </p>
              <p>
                Node: <span className="text-green-300">0xdead..beef</span>
              </p>
              <p>
                Port: <span className="text-green-300">443/tcp</span>
              </p>
            </div>
          </div>

          {/* CTA Button */}
          <button className="group relative mt-4 w-full border border-green-500/50 bg-transparent px-6 py-3 text-lg font-bold uppercase tracking-widest text-green-400 transition-all duration-300 hover:border-green-400 hover:bg-green-500/10 hover:text-green-300 hover:shadow-[0_0_20px_rgba(34,197,94,0.3)] active:scale-[0.98]">
            <span className="relative z-10">Accept Invitation</span>
            <div className="absolute inset-0 -z-0 bg-gradient-to-r from-transparent via-green-500/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
          </button>

          {/* Footer */}
          <p className="text-center text-xs tracking-[0.3em] text-green-600/60">
            [ END TRANSMISSION ]
          </p>
        </div>
      </div>

      {/* Inline styles for glitch animations */}
      <style jsx>{`
        @keyframes glitch-1 {
          0%, 100% { transform: none; }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-1px, -1px); }
          60% { transform: translate(2px, 1px); }
          80% { transform: translate(1px, -2px); }
        }
        @keyframes glitch-2 {
          0%, 100% { transform: none; }
          20% { transform: translate(2px, -1px); }
          40% { transform: translate(1px, 2px); }
          60% { transform: translate(-2px, -1px); }
          80% { transform: translate(-1px, 1px); }
        }
        .animate-glitch-1 {
          animation: glitch-1 0.3s infinite linear alternate-reverse;
        }
        .animate-glitch-2 {
          animation: glitch-2 0.4s infinite linear alternate-reverse;
        }
      `}</style>
    </div>
  );
}