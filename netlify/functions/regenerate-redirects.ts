import { netlifyBlobs } from '@/lib/clients/netlify-blobs';
import { BLOB_KEY } from '@/lib/constants';
import { schedule, type Handler } from '@netlify/functions';

const scheduledFunction: Handler = async () => {
  const blobStore = netlifyBlobs(BLOB_KEY);

  const urls = await blobStore.get('urls');

  if (!urls.length) {
    const response = await fetch(
      'https://blob-redirects.netlify.app/.netlify/functions/generate-redirects',
      {
        headers: {
          'x-netlify-header-token': process.env.NETLIFY_HEADER_TOKEN ?? '',
        },
      }
    );

    await response.json();

    return {
      body: JSON.stringify({
        message: 'No blobs to delete, creating new blob',
      }),
      statusCode: 200,
    };
  }

  blobStore.delete('urls');

  return {
    body: JSON.stringify({ message: 'Blobs deleted successfully' }),
    statusCode: 200,
  };
};

export const handler = schedule('@daily', scheduledFunction);
