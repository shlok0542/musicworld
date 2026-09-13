import React from "react";

const Footer = () => (
  <footer className="px-4 sm:px-6 lg:px-10 py-10 text-sm text-white/50">
  <div className="relative glass rounded-2xl px-6 py-5 overflow-hidden">
    {/* subtle gradient hairline along the top edge */}
    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/60 to-transparent" />

    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500" />
        <span className="text-white/60">© 2026</span>
        <span className="font-medium bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          MusicWorlds
        </span>
        <span className="text-white/40">· All rights reserved.</span>
      </div>

      <span className="text-white/50 transition-colors duration-300 hover:text-white/80">
        Developed by{" "}
        <span className="font-medium bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          Shlok Maurya
        </span>
      </span>
    </div>
  </div>
</footer>
);

export default Footer;
