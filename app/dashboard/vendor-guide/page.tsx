export const metadata = { title: "Vendor Guide — The Collective SoHo" };

const sections = [
  {
    title: "Location",
    content: "435 Broadway, New York, NY 10013",
  },
  {
    title: "Market Hours",
    items: [
      "Open to the public: Monday – Sunday, 11:00 AM – 7:00 PM",
      "Weekly/Weekday vendor load-in: 7:00–8:30 PM previous Sunday, or 9:00–11:00 AM Monday",
      "Weekend vendor load-in: 9:00–11:00 AM Saturday",
      "All booths must be fully set up by 11:00 AM sharp. Late setup carries a $25 fee.",
      "Load-out: Sundays 7:00–8:30 PM. Weekday-only vendors: Friday 7:00–8:30 PM.",
      "Items left after 9:00 PM on ending date will incur a $100 trash removal fee.",
    ],
  },
  {
    title: "Contact Info",
    items: [
      "On-site manager — Lou: (631) 877-5330",
      "Email: info@popupcollectivenyc.com",
      "Instagram: @popupcollective.nyc",
      "Wi-Fi password: TBA",
    ],
  },
  {
    title: "Booking Packages",
    items: [
      "Single space: roughly 7′ × 5′",
      "Spaces assigned on-site upon arrival — no advance requests",
      "One 6′ foldable table included",
      "Chairs and additional furniture not provided",
    ],
  },
  {
    title: "Confirming Your Booking",
    items: [
      "Check your email for your acceptance letter and confirmation",
      "Submit your non-refundable payment via your Stripe payment link",
      "Spaces are granted on a first-to-pay basis",
      "Sold out? Email info@popupcollectivenyc.com for other available dates",
      "By submitting payment, you agree to all Terms & Services in this guide",
    ],
  },
  {
    title: "Load-In & Setup",
    items: [
      "Arrive during your designated load-in time and check in with a team member",
      "First weekend? Use the full setup time to meet the team and get settled",
      "Display items may be left overnight only for consecutive bookings or with prior approval",
      "Late arrivals (after 11:00 AM) may be charged a $25 late fee",
    ],
  },
  {
    title: "Load-Out",
    items: [
      "Vendors must remain open until 7:00 PM each day",
      "Load-out begins after 7:00 PM on Sunday (weekend/weekly) or Friday (weekday only)",
      "Merchandise cannot be stored on-site between non-consecutive bookings without prior approval",
    ],
  },
  {
    title: "Amenities",
    items: [
      "Restroom access for vendors only",
      "Fitting room located next to the bathroom",
      "Music & atmosphere curated by The Collective SoHo",
      "Outlet access is limited — bring your own extension cords",
      "WiFi name: Cubico.co · Password: cubico123",
      "Alt WiFi name: cubico-compatibility · Password: cubico123",
    ],
  },
  {
    title: "Marketing & Promotion",
    content: "To help drive traffic to the market, please:",
    items: [
      "Post at least 2 stories and 1 feed post the week before your market dates",
      "Post at least 1 feed post and 2 stories during your market week",
      "Tag @popupcollectivenyc and use #popupcollectivenyc",
      "Add your date range (e.g. \"The Collective SoHo, Nov 28–Dec 28\") to your bio",
      "Follow and engage with neighboring vendors",
    ],
  },
  {
    title: "Display Requirements",
    items: [
      "Standard booth size: 7 × 5 ft",
      "Max display height: 6 ft free-standing, 8 ft wall-backed",
      "Backdrop: max 6 ft wide, 8 ft tall",
      "Do not obstruct neighboring booths or aisles",
      "No painting, drilling, or permanent modifications to any surface",
      "Pricing must be visible on your display",
      "All display elements must stay within your booth footprint",
      "Remove all stickers, trash, tape, and items at end of booking",
    ],
  },
  {
    title: "Visual Guidelines",
    items: [
      "Lighting is highly recommended",
      "Use furniture risers to elevate your table",
      "Tables must be covered with full-length fabric or textile (no plastic covers)",
      "Hide storage boxes and backstock from customer view",
      "Use cohesive hangers and signage colors",
      "No hanging items from the ceiling or visible tape adhesives",
    ],
  },
  {
    title: "Signage",
    items: [
      "Every booth must clearly display your brand name",
      "Backdrop max: 6 ft wide, 8 ft tall",
      "Brand name must be readable from at least 6–8 feet away — no tiny cursive fonts",
    ],
  },
  {
    title: "Merchandising Tips",
    items: [
      "Less is more: highlight your best sellers and signature pieces",
      "Group items into collections",
      "Use lighting and props to create focus",
      "Label prices clearly",
      "Keep your booth open and inviting from multiple angles",
    ],
  },
  {
    title: "What to Bring",
    items: [
      "Full display setup (tabletop décor, risers, racks, mirrors, trays, stands)",
      "Tables, chairs, racks, and any other display furniture",
      "Tablecloth (required) — clean and wrinkle-free",
      "Lighting and lamps",
      "Snacks and water",
      "A small trash bag for your own waste",
      "Business cards, postcards, or QR codes",
      "Credit card reader + backup payment method",
      "Extension cords or power strips",
      "Signage and price tags",
      "Bags, wrapping, and packaging supplies",
    ],
  },
  {
    title: "Rules & Regulations",
    items: [
      "Booths must be staffed at all times (except short bathroom breaks)",
      "Be attentive — use your phone only for transactions or social media",
      "Keep valuables secure and within sight",
      "The Collective SoHo is not responsible for theft or loss — a security camera is recommended",
      "Dispose of trash nightly and break down all boxes",
      "Respect fellow vendors and staff",
    ],
  },
  {
    title: "Cancellation & Rescheduling Policy",
    items: [
      "All bookings are non-refundable",
      "The Collective SoHo does not offer rescheduling or refunds under any circumstance",
    ],
  },
  {
    title: "Code of Conduct",
    items: [
      "The Collective SoHo is built on respect, inclusivity, and creativity",
      "Zero-tolerance policy for discrimination, harassment, or hostile conduct",
      "Violations may result in immediate removal without refund",
      "To report an issue: contact a manager on-site or email info@popupcollectivenyc.com",
    ],
  },
];

export default function VendorGuide() {
  return (
    <div className="px-8 py-10 max-w-3xl">
      <div className="mb-10">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-muted">Vendor Resources</p>
        <h1 className="text-4xl font-medium leading-tight">
          Vendor <span className="serif-italic font-normal">Guide</span>
        </h1>
        <p className="mt-4 text-base text-muted">
          Everything you need to know to set up and run your booth at The Collective SoHo. Please read carefully before your first booking.
        </p>
      </div>

      <div className="space-y-10">
        {sections.map((section) => (
          <div key={section.title} className="border-t border-border pt-8">
            <h2 className="mb-4 text-xs uppercase tracking-[0.3em] text-muted">
              {section.title}
            </h2>
            {section.content && (
              <p className="mb-3 text-sm leading-relaxed">{section.content}</p>
            )}
            {section.items && (
              <ul className="space-y-2">
                {section.items.map((item, i) => (
                  <li key={i} className="flex gap-3 text-sm leading-relaxed">
                    <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-black" />
                    {item}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="mt-16 border border-border bg-neutral-50 p-8 text-center">
        <p className="text-sm font-medium">Questions? We're here.</p>
        <a
          href="mailto:info@popupcollectivenyc.com"
          className="mt-2 inline-block text-xs uppercase tracking-widest text-muted underline underline-offset-2 hover:text-black transition-colors"
        >
          info@popupcollectivenyc.com
        </a>
      </div>
    </div>
  );
}
