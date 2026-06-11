export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="border-b border-border bg-white px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <p className="text-xs uppercase tracking-widest font-medium">Admin</p>
          <a href="/admin/applications" className="text-xs uppercase tracking-widest text-muted hover:text-black transition-colors">Applications</a>
          <a href="/admin/bookings" className="text-xs uppercase tracking-widest text-muted hover:text-black transition-colors">Bookings</a>
          <a href="/admin/calendar" className="text-xs uppercase tracking-widest text-muted hover:text-black transition-colors">Calendar</a>
          <a href="/admin/add-vendor" className="text-xs uppercase tracking-widest text-muted hover:text-black transition-colors">Add Vendor</a>
        </div>
        <a href="/" className="text-xs uppercase tracking-widest text-muted hover:text-black transition-colors">← Site</a>
      </div>
      {children}
    </div>
  );
}
