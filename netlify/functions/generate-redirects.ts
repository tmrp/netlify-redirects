import { netlifyBlobs } from '@/lib/clients/netlify-blobs';
import { BLOB_KEY } from '@/lib/constants';
import { HandlerEvent, builder, type Handler } from '@netlify/functions';

const NUMBER_OF_REDIRECTS = 10000;

const generateRedirects: Handler = async (event: HandlerEvent) => {
  const headerToken = event.headers['x-netlify-header-token'];

  if (!headerToken || headerToken !== process.env.NETLIFY_HEADER_TOKEN) {
    return {
      body: JSON.stringify({ message: 'Unauthorized' }),
      statusCode: 401,
    };
  }

  const blobStore = netlifyBlobs(BLOB_KEY);

  const urls = await blobStore.get('urls');

  if (!urls?.length) {
    const redirects = Array.from({ length: NUMBER_OF_REDIRECTS }, (_, i) => ({
      from: `/redirect-${i}`,
      to: `/page-${i}`,
    }));

    const settledRedirects = await Promise.all(redirects);

    const timeStamp = new Date().toUTCString();

    await blobStore.setJSON('urls', settledRedirects, {
      metadata: { timeStamp },
    });

    return {
      body: JSON.stringify({
        message: `No redirects in blob, creating new blob on: ${timeStamp}`,
      }),
      statusCode: 200,
    };
  }

  const metatData = await blobStore.getMetadata('urls');

  return {
    body: JSON.stringify({
      message: `Redirects aleardy in blob. Current count: ${urls.length} on: ${metatData?.metadata?.timeStamp}`,
    }),
    statusCode: 200,
  };
};

const handler = builder(generateRedirects);

export { handler };
