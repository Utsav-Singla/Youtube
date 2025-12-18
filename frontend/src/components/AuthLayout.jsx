import React from "react";

const AuthLayout = ({ title, subtitle, children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-black flex items-center justify-center px-6">
      
      {/* BACKGROUND EFFECTS */}
      <div className="absolute inset-0">
        <div className="absolute -top-40 -left-40 w-96 h-96 bg-red-600/30 blur-[140px]" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-red-800/20 blur-[160px]" />
      </div>

      {/* CARD */}
      <div className="relative z-10 w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_0_80px_rgba(255,0,0,0.15)]">

        {/* LEFT BRAND */}
        <aside className="hidden md:flex flex-col justify-between p-14 bg-gradient-to-br from-red-600/90 to-red-900/90">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight text-white">
              MyTube
            </h1>
            <p className="mt-4 text-lg text-white/90 leading-relaxed">
              A next-generation video platform for creators & viewers.
            </p>
          </div>

          <div className="space-y-3 text-sm text-white/85">
            <p>• Watch & upload videos</p>
            <p>• Personalized recommendations</p>
            <p>• Secure creator ecosystem</p>
          </div>
        </aside>

        {/* RIGHT FORM */}
        <main className="p-10 md:p-14 flex items-center">
          <div className="w-full max-w-md mx-auto">
            <h2 className="text-3xl font-semibold text-white">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-2 text-gray-400">{subtitle}</p>
            )}

            <div className="mt-8">
              {children}
            </div>
          </div>
        </main>

      </div>
    </div>
  );
};

export default AuthLayout;
