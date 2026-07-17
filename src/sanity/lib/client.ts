import { createClient } from 'next-sanity';

export const projectId = 'rh6hnlmk';
export const dataset = 'production';
export const apiVersion = '2024-01-01';

// Published content — CDN-cached, safe in both browser and server (no token needed).
export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
});

// Draft/preview reads — server-only, needs a read token. Falls back to the
// published client when SANITY_API_READ_TOKEN is unset (preview just shows published).
const previewToken = process.env.SANITY_API_READ_TOKEN;
const previewClient = previewToken
  ? createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn: false,
      token: previewToken,
      perspective: 'drafts',
    })
  : null;

export const getSanityClient = (preview = false) =>
  preview && previewClient ? previewClient : sanityClient;
