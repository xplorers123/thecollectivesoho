export type LineItem = {
  label: string;
  amountCents: number;
  deduction?: boolean;
};

export type Invoice = {
  id: string;
  email: string;
  name: string;
  description: string;
  lineItems?: LineItem[];
  amountCents: number; // net total to charge
  dueDate?: string;
  agreementUrl?: string; // if set, vendor must check agreement box before paying
};

export const invoices: Record<string, Invoice> = {
  "yuehu-june-2026": {
    id: "yuehu-june-2026",
    email: "yuehu@ydimension.co",
    name: "Yuehu",
    description: "Share Staff Model — Base Rent, June 1–30, 2026",
    amountCents: 100000,
    dueDate: "May 31, 2026",
  },

  "aromademerrie-june-2026": {
    id: "aromademerrie-june-2026",
    email: "info@aromademerrie.com",
    name: "Aroma de Merrie",
    description: "Booth Fee — June 5 – July 4, 2026",
    amountCents: 300000,
    dueDate: "June 4, 2026",
  },

  "frgmnt-june-2026": {
    id: "frgmnt-june-2026",
    email: "ed@frgmntfoto.com",
    name: "Ed",
    description: "Booth Fee — June 1–30, 2026",
    amountCents: 140000,
    dueDate: "June 1, 2026",
  },

  "awomaninthearts-jul-2026": {
    id: "awomaninthearts-jul-2026",
    email: "email@awomaninthearts.com",
    name: "A Woman in the Arts",
    description: "Prorated Booth Fee — July 19–31, 2026",
    lineItems: [
      { label: "Monthly rate (July 2026)",            amountCents: 330000 },
      { label: "Proration adjustment (18/31 days free)", amountCents: 191613, deduction: true },
      { label: "Referral credit",                     amountCents: 10000,  deduction: true },
    ],
    amountCents: 128387,
    dueDate: "June 25, 2026",
  },

  "jenairel-jul4-2026": {
    id: "jenairel-jul4-2026",
    email: "jenairelco@gmail.com",
    name: "Jenairel",
    description: "Weekly Booth Fee — July 4–10, 2026",
    amountCents: 85000,
    dueDate: "June 27, 2026",
  },

  "danablair-jul11-2026": {
    id: "danablair-jul11-2026",
    email: "danablairdesigns@yahoo.com",
    name: "Dana Blair",
    description: "Weekly Booth Fee — July 11–17, 2026 · Jewelry",
    amountCents: 85000,
    dueDate: "July 1, 2026",
  },

  "danablair-jul6-2026": {
    id: "danablair-jul6-2026",
    email: "danablairdesigns@yahoo.com",
    name: "Dana Blair",
    description: "Weekly Booth Fee — July 6–12, 2026 · Jewelry",
    amountCents: 85000,
    dueDate: "June 25, 2026",
  },

  "esveiled-jun27-2026": {
    id: "esveiled-jun27-2026",
    email: "esveilednyc@gmail.com",
    name: "Esveiled Fine Jewelry",
    description: "Weekly Booth Fee — June 27 – July 3, 2026",
    amountCents: 85000,
    dueDate: "June 25, 2026",
  },

  "alejita-jul-2026": {
    id: "alejita-jul-2026",
    email: "alejitalala@gmail.com",
    name: "Hunch Studio",
    description: "Prorated Booth Fee — July 18–31, 2026",
    lineItems: [
      { label: "Monthly rate (July 2026)",       amountCents: 365000 },
      { label: "Proration adjustment (17/30 days free)", amountCents: 206833, deduction: true },
    ],
    amountCents: 158167,
    dueDate: "June 25, 2026",
  },

  "deewangstudio-jul-2026": {
    id: "deewangstudio-jul-2026",
    email: "deewangllc@gmail.com",
    name: "Dee Wang Studio",
    description: "Space L2 — Monthly Vendor Booth, July 1–31, 2026",
    amountCents: 400000,
    dueDate: "June 25, 2026",
  },

  "frgmnt-jul-2026": {
    id: "frgmnt-jul-2026",
    email: "ed@frgmntfoto.com",
    name: "Ed",
    description: "Booth Fee — July 1–31, 2026",
    amountCents: 150000,
    dueDate: "June 30, 2026",
  },

  "aromademerrie-jul-2026": {
    id: "aromademerrie-jul-2026",
    email: "info@aromademerrie.com",
    name: "Aroma de Merrie",
    description: "Prorated Booth Fee — July 5–31, 2026",
    lineItems: [
      { label: "Monthly rate (July 2026)",                  amountCents: 330000 },
      { label: "Proration adjustment (July 1–4 complimentary)", amountCents: 42581, deduction: true },
    ],
    amountCents: 287419,
    dueDate: "June 30, 2026",
  },

  "oilogy-jul-2026": {
    id: "oilogy-jul-2026",
    email: "oilogy.us@gmail.com",
    name: "Oilogy",
    description: "Monthly Booth Fee — July 1–31, 2026",
    amountCents: 340000,
    dueDate: "June 30, 2026",
  },

  "savageanchor-jul-2026": {
    id: "savageanchor-jul-2026",
    email: "info@savageanchor.com",
    name: "Savage Anchor",
    description: "Monthly Booth Fee — July 1–31, 2026",
    amountCents: 340000,
    dueDate: "June 30, 2026",
  },

  "bangbang-jul-2026": {
    id: "bangbang-jul-2026",
    email: "erenarina@gmail.com",
    name: "BangBang Co",
    description: "Monthly Booth Fee — July 1–31, 2026",
    amountCents: 200000,
    dueDate: "June 30, 2026",
  },

  "selfloom-jul-2026": {
    id: "selfloom-jul-2026",
    email: "helloselfloom@gmail.com",
    name: "Selfloom",
    description: "Monthly Booth Fee — July 1–31, 2026",
    amountCents: 340000,
    dueDate: "June 30, 2026",
  },

  "maisonthird-jul-2026": {
    id: "maisonthird-jul-2026",
    email: "maisonthird03@gmail.com",
    name: "Maison Third",
    description: "Monthly Booth Fee — July 1–31, 2026",
    amountCents: 325000,
    dueDate: "June 30, 2026",
  },

  "natalia-jul-2026": {
    id: "natalia-jul-2026",
    email: "nataliajingjing55@yahoo.com",
    name: "Natalia",
    description: "Prorated Booth Fee — July 4–31, 2026",
    lineItems: [
      { label: "Monthly rate (July 2026)",                  amountCents: 320000 },
      { label: "Proration adjustment (July 1–3 complimentary)", amountCents: 30968, deduction: true },
    ],
    amountCents: 289032,
    dueDate: "June 30, 2026",
  },

  "marina-jul-2026": {
    id: "marina-jul-2026",
    email: "marinamatia@hotmail.com",
    name: "Marina",
    description: "Prorated Booth Fee — July 4–31, 2026",
    lineItems: [
      { label: "Monthly rate (July 2026)",                   amountCents: 300000 },
      { label: "Proration adjustment (July 1–3 complimentary)", amountCents: 29032, deduction: true },
    ],
    amountCents: 270968,
    dueDate: "June 30, 2026",
  },

  "adastra-jul-2026": {
    id: "adastra-jul-2026",
    email: "adastradumbo@gmail.com",
    name: "Ad Astra Studio",
    description: "Booth Fee — July 18–31, 2026",
    amountCents: 135484,
    dueDate: "July 1, 2026",
  },

  "bryancordova-jul-2026": {
    id: "bryancordova-jul-2026",
    email: "bcdesigndrawing@gmail.com",
    name: "Bryan Cordova",
    description: "Booth Fee — July 16–31, 2026",
    amountCents: 103226,
    dueDate: "July 14, 2026",
  },

  "jenairel-jul18-2026": {
    id: "jenairel-jul18-2026",
    email: "jenairelco@gmail.com",
    name: "Jenairel",
    description: "Weekly Booth Fee — July 18–24, 2026",
    amountCents: 80000,
    dueDate: "July 14, 2026",
  },

  "luiandlui-jul-aug-2026": {
    id: "luiandlui-jul-aug-2026",
    email: "luiandluiofficial@gmail.com",
    name: "Lui & Lui",
    description: "Booth Fee — July 8 – August 7, 2026",
    amountCents: 300000,
    dueDate: "July 7, 2026",
  },

  "lovetara-jul-2026": {
    id: "lovetara-jul-2026",
    email: "lovetaranyc@gmail.com",
    name: "Love Tara NYC",
    description: "Share Consignment — July 15–31, 2026",
    amountCents: 100000,
    dueDate: "July 14, 2026",
    agreementUrl: "/agreements/love-tara-consignment-agreement.docx",
  },

  "hunchstudio-sep-2026": {
    id: "hunchstudio-sep-2026",
    email: "alejitalala@gmail.com",
    name: "Hunch Studio",
    description: "Monthly Booth Fee — September 1–30, 2026",
    amountCents: 365000,
    dueDate: "August 25, 2026",
  },
  "selfloom-sep-2026": {
    id: "selfloom-sep-2026",
    email: "helloselfloom@gmail.com",
    name: "Selfloom",
    description: "Monthly Booth Fee — September 1–30, 2026",
    amountCents: 350000,
    dueDate: "August 25, 2026",
  },
  "beautelier-sep-2026": {
    id: "beautelier-sep-2026",
    email: "info@beautelierus.com",
    name: "Beautelier",
    description: "Booth Fee — September 5–30, 2026",
    amountCents: 350000,
    dueDate: "September 4, 2026",
  },
  "savageanchor-sep-2026": {
    id: "savageanchor-sep-2026",
    email: "info@savageanchor.com",
    name: "Savage Anchor",
    description: "Monthly Booth Fee — September 1–30, 2026",
    amountCents: 340000,
    dueDate: "August 25, 2026",
  },
  "aromademerrie-sep-2026": {
    id: "aromademerrie-sep-2026",
    email: "info@aromademerrie.com",
    name: "Aroma de Merrie",
    description: "Monthly Booth Fee — September 1–30, 2026",
    amountCents: 330000,
    dueDate: "August 25, 2026",
  },
  "natalia-sep-2026": {
    id: "natalia-sep-2026",
    email: "nataliajingjing55@yahoo.com",
    name: "Natalia",
    description: "Monthly Booth Fee — September 1–30, 2026",
    amountCents: 320000,
    dueDate: "August 25, 2026",
  },
  "ageofstones-sep-2026": {
    id: "ageofstones-sep-2026",
    email: "lautaro@theageofstones.com",
    name: "The Age of Stones",
    description: "Monthly Booth Fee — September 1–30, 2026",
    amountCents: 320000,
    dueDate: "August 25, 2026",
  },
  "maisonthird-sep-2026": {
    id: "maisonthird-sep-2026",
    email: "maisonthird03@gmail.com",
    name: "Maison Third",
    description: "Monthly Booth Fee — September 1–30, 2026",
    amountCents: 325000,
    dueDate: "August 25, 2026",
  },
  "marina-sep-2026": {
    id: "marina-sep-2026",
    email: "marinamatia@hotmail.com",
    name: "Marina",
    description: "Monthly Booth Fee — September 1–30, 2026",
    amountCents: 300000,
    dueDate: "August 25, 2026",
  },
  "bangbang-sep-2026": {
    id: "bangbang-sep-2026",
    email: "erenarina@gmail.com",
    name: "BangBang Co",
    description: "Monthly Booth Fee — September 1–30, 2026",
    amountCents: 200000,
    dueDate: "August 25, 2026",
  },
  "bryancordova-sep-2026": {
    id: "bryancordova-sep-2026",
    email: "bcdesigndrawing@gmail.com",
    name: "Bryan Cordova",
    description: "Monthly Booth Fee — September 1–30, 2026",
    amountCents: 200000,
    dueDate: "August 25, 2026",
  },
  "lovetara-sep-2026": {
    id: "lovetara-sep-2026",
    email: "lovetaranyc@gmail.com",
    name: "Love Tara NYC",
    description: "Monthly Booth Fee — September 1–30, 2026",
    amountCents: 200000,
    dueDate: "August 25, 2026",
  },
  "frgmnt-sep-2026": {
    id: "frgmnt-sep-2026",
    email: "ed@frgmntfoto.com",
    name: "Ed (FRGMNT)",
    description: "Booth Fee — September 1–30, 2026",
    amountCents: 150000,
    dueDate: "August 25, 2026",
  },

  "awomaninthearts-sep-2026": {
    id: "awomaninthearts-sep-2026",
    email: "email@awomaninthearts.com",
    name: "A Woman in the Arts",
    description: "Monthly Booth Fee — September 1–30, 2026",
    amountCents: 330000,
    dueDate: "August 25, 2026",
  },

  "jenairel-aug10-2026": {
    id: "jenairel-aug10-2026",
    email: "jenairelco@gmail.com",
    name: "Jenairel",
    description: "Weekly Booth Fee — August 10–16, 2026",
    amountCents: 75000,
    dueDate: "August 10, 2026",
  },

  "teenagegrandma-aug22-2026": {
    id: "teenagegrandma-aug22-2026",
    email: "teeenagegrandma@gmail.com",
    name: "Teenage Grandma's Closet",
    description: "Window Spot (Prorated) — August 22–31, 2026",
    amountCents: 129032,
    dueDate: "August 22, 2026",
  },

  "teenagegrandma-aug13-2026": {
    id: "teenagegrandma-aug13-2026",
    email: "teeenagegrandma@gmail.com",
    name: "Teenage Grandma's Closet",
    description: "Wall Space (12×5 ft) — August 13–21, 2026",
    amountCents: 110323,
    dueDate: "August 13, 2026",
  },

  "jenairel-aug3-2026": {
    id: "jenairel-aug3-2026",
    email: "jenairelco@gmail.com",
    name: "Jenairel",
    description: "Weekly Booth Fee — August 3–9, 2026",
    amountCents: 75000,
    dueDate: "August 3, 2026",
  },

  "jiggystardust-aug21-2026": {
    id: "jiggystardust-aug21-2026",
    email: "soundplusvision15@yahoo.com",
    name: "Jiggy Stardust",
    description: "Weekend Booth Fee — August 21–22, 2026",
    amountCents: 60000,
    dueDate: "August 20, 2026",
  },

  "teenagegrandma-aug3-2026": {
    id: "teenagegrandma-aug3-2026",
    email: "teeenagegrandma@gmail.com",
    name: "Teenage Grandma's Closet",
    description: "Window Spot — August 3–6, 2026",
    amountCents: 40000,
    dueDate: "August 3, 2026",
  },

  "mxtur-aug7-2026": {
    id: "mxtur-aug7-2026",
    email: "mxtur@mxturhandmade.com",
    name: "Mxtur",
    description: "Window Spot — August 7–13, 2026",
    amountCents: 90000,
    dueDate: "August 6, 2026",
  },

  "beautelierus-aug-2026": {
    id: "beautelierus-aug-2026",
    email: "info@beautelierus.com",
    name: "Beautelier",
    description: "Booth Fee — August 6 – September 5, 2026",
    amountCents: 350000,
    dueDate: "July 31, 2026",
    agreementUrl: "/agreements/beautelie-vendor-agreement-aug2026.pdf",
  },

  "marina-aug-2026": {
    id: "marina-aug-2026",
    email: "marinamatia@hotmail.com",
    name: "Marina",
    description: "Monthly Booth Fee — August 1–31, 2026",
    amountCents: 300000,
    dueDate: "July 30, 2026",
  },

  "lovetara-aug-2026": {
    id: "lovetara-aug-2026",
    email: "lovetaranyc@gmail.com",
    name: "Love Tara NYC",
    description: "Monthly Booth Fee — August 1–31, 2026",
    amountCents: 200000,
    dueDate: "July 30, 2026",
  },

  "bryancordova-aug-2026": {
    id: "bryancordova-aug-2026",
    email: "bcdesigndrawing@gmail.com",
    name: "Bryan Cordova",
    description: "Monthly Booth Fee — August 1–31, 2026",
    amountCents: 200000,
    dueDate: "July 30, 2026",
  },

  "natalia-aug-2026": {
    id: "natalia-aug-2026",
    email: "nataliajingjing55@yahoo.com",
    name: "Natalia",
    description: "Monthly Booth Fee — August 1–31, 2026",
    amountCents: 320000,
    dueDate: "July 30, 2026",
  },

  "aromademerrie-aug-2026": {
    id: "aromademerrie-aug-2026",
    email: "info@aromademerrie.com",
    name: "Aroma de Merrie",
    description: "Monthly Booth Fee — August 1–31, 2026",
    amountCents: 330000,
    dueDate: "July 30, 2026",
  },

  "oilogy-aug-2026": {
    id: "oilogy-aug-2026",
    email: "oilogy.us@gmail.com",
    name: "Oilogy",
    description: "Monthly Booth Fee — August 1–31, 2026",
    amountCents: 350000,
    dueDate: "July 30, 2026",
  },

  "selfloom-aug-2026": {
    id: "selfloom-aug-2026",
    email: "helloselfloom@gmail.com",
    name: "Selfloom",
    description: "Monthly Booth Fee — August 1–31, 2026",
    amountCents: 350000,
    dueDate: "July 30, 2026",
  },

  "frgmnt-aug-2026": {
    id: "frgmnt-aug-2026",
    email: "ed@frgmntfoto.com",
    name: "Ed",
    description: "Booth Fee — August 1–31, 2026",
    amountCents: 150000,
    dueDate: "July 30, 2026",
  },

  "savageanchor-aug-2026": {
    id: "savageanchor-aug-2026",
    email: "info@savageanchor.com",
    name: "Savage Anchor",
    description: "Monthly Booth Fee — August 1–31, 2026",
    amountCents: 340000,
    dueDate: "July 30, 2026",
  },

  "bangbang-aug-2026": {
    id: "bangbang-aug-2026",
    email: "erenarina@gmail.com",
    name: "BangBang Co",
    description: "Monthly Booth Fee — August 1–31, 2026",
    amountCents: 200000,
    dueDate: "July 30, 2026",
  },

  "maisonthird-aug-2026": {
    id: "maisonthird-aug-2026",
    email: "maisonthird03@gmail.com",
    name: "Maison Third",
    description: "Monthly Booth Fee — August 1–31, 2026",
    amountCents: 325000,
    dueDate: "July 30, 2026",
  },

  "ageofstones-aug-2026": {
    id: "ageofstones-aug-2026",
    email: "lautaro@theageofstones.com",
    name: "The Age of Stones",
    description: "Monthly Booth Fee — August 1–31, 2026",
    amountCents: 320000,
    dueDate: "July 30, 2026",
  },

  "jenairel-jul27-2026": {
    id: "jenairel-jul27-2026",
    email: "jenairelco@gmail.com",
    name: "Jenairel",
    description: "Weekly Booth Fee — July 27 – August 2, 2026",
    amountCents: 75000,
    dueDate: "July 30, 2026",
  },

  "dropvault-jul23-2026": {
    id: "dropvault-jul23-2026",
    email: "katiehilton@thedropvault.com",
    name: "The Drop Vault",
    description: "Remaining Balance — July 23–30, 2026",
    amountCents: 16000,
    dueDate: "July 30, 2026",
  },

  "doyoumissme-aug15-2026": {
    id: "doyoumissme-aug15-2026",
    email: "doyoumissmeofficial@gmail.com",
    name: "doyoumissme",
    description: "Window Spot — August 15–21, 2026 (7×12 ft)",
    amountCents: 100000,
    dueDate: "August 10, 2026",
  },

  "awomaninthearts-aug-2026": {
    id: "awomaninthearts-aug-2026",
    email: "email@awomaninthearts.com",
    name: "A Woman in the Arts",
    description: "Monthly Booth Fee — August 1–31, 2026",
    amountCents: 330000,
    dueDate: "July 25, 2026",
  },

  "teenagegrandma-jul27-2026": {
    id: "teenagegrandma-jul27-2026",
    email: "teenagegrandma@gmail.com",
    name: "Teenage Grandma's Closet",
    description: "Weekly Booth Fee — July 27 – August 2, 2026 · Vintage",
    amountCents: 80000,
    dueDate: "July 22, 2026",
  },

  "cafetruman-june-aug-2026": {
    id: "cafetruman-june-aug-2026",
    email: "cafetruman@gmail.com",
    name: "Cafe Truman",
    description: "Booth Rent — June 8, 2026 – August 7, 2026",
    lineItems: [
      { label: "June 8 – July 7, 2026",  amountCents: 250000 },
      { label: "July 8 – Aug 7, 2026",   amountCents: 250000 },
      { label: "Deposit paid",            amountCents: 50000, deduction: true },
    ],
    amountCents: 450000, // $4,500 net
    dueDate: "June 7, 2026",
  },
};
