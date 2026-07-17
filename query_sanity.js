require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
});

async function run() {
  const all = await client.fetch(`*[_type == "landingPage" && !(_id in path("drafts.**"))]`);
  console.log("ALL PAGES:", JSON.stringify(all, null, 2));
}

run().catch(console.error);
