export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen relative">
      <div className="flex-1 flex relative">
        <img
          src="/image.jpg"
          alt="background"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/70 to-white/95" />

        <img
          src="/logo.png"
          alt="logo"
          className="absolute top-6 left-6 h-35 z-10"
        />

        <div className="relative z-10 flex items-center justify-end w-full pr-20">
          {children}
        </div>
      </div>

      <div className="w-full bg-white py-4 text-center text-gray-400 text-xs border-t border-gray-100">
        Copyright © 2026 &nbsp;·&nbsp; Privacy Policy
      </div>
    </div>
  );
}