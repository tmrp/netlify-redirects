import { netlifyBlobs } from '@/lib/clients/netlify-blobs';
import { BLOB_KEY } from '@/lib/constants';
import { HandlerEvent, builder, type Handler } from '@netlify/functions';

const builderRandomRedirect: Handler = async (event: HandlerEvent) => {
  const hasNetlifyHeaderToken = event.headers['x-netlify-header-token'];
  const cacheHeader = event.headers['x-nf-builder-cache'];

  console.log('cacheHeader', cacheHeader);
  if (
    !hasNetlifyHeaderToken ||
    hasNetlifyHeaderToken !== process.env.NETLIFY_HEADER_TOKEN
  ) {
    return {
      body: JSON.stringify({ message: 'Unauthorized' }),
      statusCode: 401,
    };
  }

  const blobStore = netlifyBlobs(BLOB_KEY);

  const urls = await blobStore.get('urls', { type: 'json' });

  const getRandomIndex = Math.floor(Math.random() * urls?.length);

  const randomRedirect = urls[getRandomIndex];

  const timeStamp = new Date().toUTCString();

  return {
    body: JSON.stringify({
      message: 'Redirect found',
      randomRedirect: randomRedirect?.to,
      timeStamp,
    }),
    statusCode: 200,
    ttl: 900,
  };
};

const handler = builder(builderRandomRedirect);

export { handler };
