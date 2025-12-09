import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Logo } from '@/components/logo';
import NotificationBell from '@/components/notifications/notification-bell';
import Link from 'next/link';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-neutral-950 font-[family-name:var(--font-manrope)]">
      {/* Header */}
      <header className="border-b border-white/10">
        <div className="container mx-auto px-6 lg:px-12 py-4 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Logo size="sm" href="/dashboard" />
            <nav className="hidden md:flex items-center gap-6 text-sm text-white/60">
              <Link href="/dashboard" className="hover:text-white transition-colors">
                Dashboard
              </Link>
              <Link href="/company" className="hover:text-white transition-colors">
                Company
              </Link>
              <Link href="/raises" className="hover:text-white transition-colors">
                Raises
              </Link>
              <Link href="/documents" className="hover:text-white transition-colors">
                Documents
              </Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            <NotificationBell />
            <span className="text-sm text-white/50 hidden sm:block">
              {user.email}
            </span>
            <form action="/auth/signout" method="post">
              <button 
                type="submit"
                className="text-sm text-white/50 hover:text-white transition-colors"
              >
                Sign out
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 lg:px-12 py-8">
        {children}
      </main>
    </div>
  );
}
