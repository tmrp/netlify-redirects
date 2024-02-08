import { getStore } from '@netlify/blobs';

export const netlifyBlobs = (storeName: string) => {
  const store = getStore({
    name: storeName,
    siteID: process.env.NETLIFY_SITE_ID,
    token: process.env.NETLIFY_ACCESS_TOKEN,
  });

  return store;
};
