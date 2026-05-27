import { supabaseAdmin } from "@/lib/supabase-admin";

export const metadata = { title: "Applications — Admin" };

const BUCKET = "Applications";
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;

function extractStoragePath(publicUrl: string): string | null {
  // URL format: {SUPABASE_URL}/storage/v1/object/public/{bucket}/{path}
  const marker = `/storage/v1/object/public/${BUCKET}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return publicUrl.slice(idx + marker.length);
}

async function getSignedUrl(path: string): Promise<string> {
  const { data } = await supabaseAdmin.storage
    .from(BUCKET)
    .createSignedUrl(path, 3600);
  return data?.signedUrl ?? "#";
}

async function resolveUrls(urls: string[]): Promise<string[]> {
  return Promise.all(
    urls.map(async (url) => {
      const path = extractStoragePath(url);
      if (!path) return url;
      return getSignedUrl(path);
    })
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
    approved: "bg-green-50 text-green-700 border-green-200",
    rejected: "bg-red-50 text-red-700 border-red-200",
  };
  return (
    <span className={`px-2 py-1 text-xs uppercase tracking-widest border ${styles[status] ?? "bg-neutral-100 text-neutral-500 border-neutral-200"}`}>
      {status}
    </span>
  );
}

function PhotoGrid({ urls, label }: { urls: string[]; label: string }) {
  if (!urls.length) return null;
  return (
    <div className="mt-3">
      <p className="mb-2 text-xs uppercase tracking-widest text-neutral-400">{label}</p>
      <div className="flex flex-wrap gap-2">
        {urls.map((url, i) => (
          <a key={i} href={url} target="_blank" rel="noopener noreferrer"
            className="group relative block overflow-hidden border border-border hover:border-black transition-colors"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt={`${label} ${i + 1}`}
              width={96}
              height={96}
              className="h-24 w-24 object-cover group-hover:opacity-80 transition-opacity"
            />
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30">
              <span className="text-white text-xs">View</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

export default async function AdminApplicationsPage() {
  const { data: applications, error } = await supabaseAdmin
    .from("applications")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <div className="px-8 py-10 text-sm text-red-600">
        Error loading applications: {error.message}
      </div>
    );
  }

  // Resolve signed URLs for all applications in parallel
  const resolved = await Promise.all(
    (applications ?? []).map(async (app) => ({
      ...app,
      _productUrls: await resolveUrls(app.product_photo_urls ?? []),
      _displayUrls: await resolveUrls(app.display_photo_urls ?? []),
    }))
  );

  return (
    <div className="px-8 py-10">
      <div className="mb-8 flex items-baseline justify-between">
        <h1 className="text-2xl font-medium">Applications</h1>
        <p className="text-xs text-muted">{resolved.length} total</p>
      </div>

      {resolved.length === 0 ? (
        <p className="text-sm text-muted">No applications yet.</p>
      ) : (
        <div className="space-y-4">
          {resolved.map((app) => (
            <div key={app.id} className="border border-border bg-white p-6">
              {/* Header row */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-sm">
                    {app.first_name} {app.last_name}
                    {app.brand_name && (
                      <span className="ml-2 text-muted font-normal">— {app.brand_name}</span>
                    )}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">{app.email} · {app.phone}</p>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <StatusBadge status={app.status ?? "pending"} />
                  <p className="text-xs text-muted">
                    {new Date(app.created_at).toLocaleDateString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                    })}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-xs sm:grid-cols-4">
                {app.product_category && <><span className="text-muted">Category</span><span>{app.product_category}</span></>}
                {app.price_range && <><span className="text-muted">Price range</span><span>{app.price_range}</span></>}
                {app.booking_type && <><span className="text-muted">Booking</span><span>{app.booking_type}</span></>}
                {app.instagram && <><span className="text-muted">Instagram</span><span>{app.instagram}</span></>}
              </div>

              {app.brand_story && (
                <p className="mt-3 text-xs text-muted leading-relaxed line-clamp-2">{app.brand_story}</p>
              )}

              {/* Photos */}
              <PhotoGrid urls={app._productUrls} label="Product photos" />
              <PhotoGrid urls={app._displayUrls} label="Display photos" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
