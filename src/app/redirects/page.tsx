export default function CatchAllPage({
  params,
}: {
  params: { slug: string[] };
}) {
  console.log('the_params', params);
  return `This is a catch-all route! Hello from ${params?.slug?.join('/')}`;
}
