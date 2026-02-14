import { ToastProvider } from '@/components/Toast';
import AdminSidebar from '@/components/AdminSidebar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <ToastProvider>
            <div className="flex min-h-screen bg-cream">
                <AdminSidebar />
                {/* pt-16 for mobile header, pb-20 for mobile bottom tab bar, lg: normal padding */}
                <main className="flex-1 p-5 pt-[72px] pb-24 lg:ml-72 lg:pt-8 lg:pb-8 lg:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </ToastProvider>
    );
}
