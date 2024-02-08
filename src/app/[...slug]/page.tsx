export default function CatchAllPage({
  params: { slug },
}: {
  params: { slug: string[] };
}) {
  return `This is a catch-all route! Hello from ${slug.join('/')}`;
}
