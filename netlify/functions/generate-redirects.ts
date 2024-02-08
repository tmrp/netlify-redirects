import { netlifyBlobs } from '@/lib/clients/netlify-blobs';
import { BLOB_KEY } from '@/lib/constants';
import { HandlerEvent, builder, type Handler } from '@netlify/functions';

const NUMBER_OF_REDIRECTS = 400000;

const generateRedirects: Handler = async (event: HandlerEvent) => {
  const headerToken = event.headers['x-netlify-header-token'];

  if (!headerToken || headerToken !== process.env.NETLIFY_HEADER_TOKEN) {
    return {
      body: JSON.stringify({ message: 'Unauthorized' }),
      statusCode: 401,
    };
  }
  const eventUrl = new URL(event.rawUrl);
  const amount = eventUrl?.searchParams.get('amount');

  const blobStore = netlifyBlobs(BLOB_KEY);
  const urls = await blobStore.get('urls');

  const validAmount =
    amount && !isNaN(Number(amount)) ? Number(amount) : NUMBER_OF_REDIRECTS;

  const hasNew = eventUrl?.searchParams.get('new');

  if (!urls?.length || hasNew === 'true') {
    const redirects = Array.from({ length: validAmount }, (_, i) => ({
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
        message: `No redirects in blob or new redirects have been requested, created ${validAmount} redirects in blob on: ${timeStamp}`,
      }),
      statusCode: 200,
    };
  }

  const metaData = await blobStore.getMetadata('urls');

  return {
    body: JSON.stringify({
      message: `Redirects aleardy in blob. Current count: ${urls.length} on: ${metaData?.metadata?.timeStamp}`,
    }),

    statusCode: 200,
  };
};

const handler = builder(generateRedirects);

export { handler };
