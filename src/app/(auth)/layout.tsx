import { AuthPreview } from "@/components/auth/auth-preview";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-[100dvh] grid-cols-1 lg:grid-cols-2">
      {children}
      <AuthPreview />
    </div>
  );
}
