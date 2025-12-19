import React from "react";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-[100svh] bg-black flex items-center justify-center px-6 relative overflow-hidden">

      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/30 blur-[120px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-800/20 blur-[130px]" />
      </div>

      {/* CARD */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl">

        {/* LEFT */}
        <aside className="hidden md:flex flex-col justify-between p-14 bg-gradient-to-br from-red-600 to-red-900 text-white">
          <div>
            <h1 className="text-4xl font-extrabold">MyTube</h1>
            <p className="mt-4 text-lg text-white/90">
              A next-generation video platform.
            </p>
          </div>
        </aside>

        {/* RIGHT */}
        <main className="p-10 md:p-14">
          <h2 className="text-3xl font-semibold text-white">{title}</h2>
          {subtitle && (
            <p className="mt-2 text-gray-400">{subtitle}</p>
          )}
          <div className="mt-8">{children}</div>
        </main>

      </div>
    </div>
  );
};

export default AuthLayout;
