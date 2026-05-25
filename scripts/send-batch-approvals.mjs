// Sends acceptance emails to the approved vendors batch.
// Run this Monday at 10:08 AM: node scripts/send-batch-approvals.mjs

const SITE = "https://popupcollectivenyc.com";

const urls = [
  `${SITE}/api/approve-vendor?email=womenofcaliber88%40gmail.com&name=Nandini%20Saxena&brand=Mohan's%20Cafe&category=Food%20%2F%20Drink&token=a75278424da663eac5d1f98ff15f2e46df82584d92e38cfe044e430589924671`,
  `${SITE}/api/approve-vendor?email=alla_bazhan%40icloud.com&name=ALLA%20Bazhan&brand=BAZHANA&category=Clothing%20%26%20Accessories&token=6fb168c957b933fedacdca056d9f85ce4763042453d661a442c712ae60dd8770`,
  `${SITE}/api/approve-vendor?email=deidre%40immortalhaus.com&name=Deidre%20Ippolito&brand=Immortal%20Haus&category=Beauty%20and%20Home%20Goods&token=25339abfe548640b2e601d1bb2d20d9fdf4cc4141fc83421973d5d849ac90eda`,
  `${SITE}/api/approve-vendor?email=inayazaheer%40gmail.com&name=Inaya%20Zaheer&brand=Art%20by%20Inaya&category=Other&token=c9d59a8a753bcab5e9a1f164893c3206ebfd87cd014c5b45d9ac79f541f7c7b3`,
  `${SITE}/api/approve-vendor?email=thematinedit%40gmail.com&name=Mohine%20Matin&brand=Matin%20Edit&category=Clothing%20%26%20Accessories&token=83e87d0a06fcb173816eaaa862e61a8a949b3501f6aa247ad96ee1ef72823847`,
  `${SITE}/api/approve-vendor?email=franny98%40gmail.com&name=Francesca%20Pou&brand=Whiskey's%20Collar%20Bar&category=Other&token=d2bb19e3a9ecfd5671ea194c6e8740a0f44da60050562565b477cdc35cc1814f`,
  `${SITE}/api/approve-vendor?email=shaylinconklin%40outlook.com&name=Shaylin%20Conklin&brand=2ndStWear&category=Clothing%20%26%20Accessories&token=9896cb1cf70ada6e5ba4712379861371307d278855351b41d92d1041ae66e932`,
  `${SITE}/api/approve-vendor?email=zuliahuipa%40gmail.com&name=Renata%20Solis&brand=Zulia%20%26%20Huipa&category=Clothing%20%26%20Accessories&token=bc3d18673ce3f59be0d03b4adc5296e458056ebc2e24bf8711df3f07a6dde24e`,
  `${SITE}/api/approve-vendor?email=alfie.nicholson97%40gmail.com&name=Alfie%20Nicholson&brand=What%20Alfie%20Ate&category=Food%20%2F%20Drink&token=f76aa5f19ed9435565dd38d0f8ff5f8992a3dc9982e22486276b9b55b4180e76`,
];

const names = [
  "Nandini Saxena — Mohan's Cafe",
  "ALLA Bazhan — BAZHANA",
  "Deidre Ippolito — Immortal Haus",
  "Inaya Zaheer — Art by Inaya",
  "Mohine Matin — Matin Edit",
  "Francesca Pou — Whiskey's Collar Bar",
  "Shaylin Conklin — 2ndStWear",
  "Renata Solis — Zulia & Huipa",
  "Alfie Nicholson — What Alfie Ate",
];

console.log(`Sending acceptance emails to ${urls.length} vendors...\n`);

for (let i = 0; i < urls.length; i++) {
  try {
    const res = await fetch(urls[i]);
    if (res.ok) {
      console.log(`✓ ${names[i]}`);
    } else {
      console.error(`✗ ${names[i]} — HTTP ${res.status}`);
    }
  } catch (err) {
    console.error(`✗ ${names[i]} — ${err.message}`);
  }
  // Small delay between sends
  await new Promise(r => setTimeout(r, 500));
}

console.log("\nDone. All acceptance emails sent.");
