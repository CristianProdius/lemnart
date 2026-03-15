import { APP_CONFIG } from "@/config/app-config";

export default function AuthLayout({
  children,
}: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full">
      {/* Branding panel — hidden on mobile */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-10 text-primary-foreground">
        <div>
          <h1 className="text-2xl font-bold">{APP_CONFIG.name}</h1>
        </div>
        <div className="space-y-4">
          <blockquote className="text-lg font-medium leading-relaxed">
            &ldquo;Manage your stores, products, and orders — all from one
            powerful dashboard.&rdquo;
          </blockquote>
          <p className="text-sm opacity-80">{APP_CONFIG.copyright}</p>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex w-full items-center justify-center px-4 lg:w-1/2">
        {children}
      </div>
    </div>
  );
}
