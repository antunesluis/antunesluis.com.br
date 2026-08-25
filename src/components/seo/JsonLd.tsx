import type { Thing, WithContext } from 'schema-dts';

type JsonLdProps<T extends Thing> = {
  data: WithContext<T>;
};

export function JsonLd<T extends Thing>({ data }: JsonLdProps<T>) {
  const serializedData = JSON.stringify(data).replace(/</g, '\\u003c');

  return (
    <script
      type='application/ld+json'
      dangerouslySetInnerHTML={{ __html: serializedData }}
    />
  );
}
