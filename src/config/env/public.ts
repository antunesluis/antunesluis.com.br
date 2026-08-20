const DEFAULT_SITE_URL = 'https://antunesluis.com.br';
const DEFAULT_IMAGE_UPLOAD_MAX_SIZE = 921600;

type PublicEnvSource = {
  NEXT_PUBLIC_GISCUS_REPO: string | undefined;
  NEXT_PUBLIC_GISCUS_REPO_ID: string | undefined;
  NEXT_PUBLIC_GISCUS_CATEGORY: string | undefined;
  NEXT_PUBLIC_GISCUS_CATEGORY_ID: string | undefined;
  NEXT_PUBLIC_SITE_URL: string | undefined;
  NEXT_PUBLIC_IMAGE_UPLOAD_MAX_SIZE: string | undefined;
};

export type PublicEnv = {
  giscusRepo: `${string}/${string}` | undefined;
  giscusRepoId: string | undefined;
  giscusCategory: string | undefined;
  giscusCategoryId: string | undefined;
  siteUrl: string;
  imageUploadMaxSize: number;
};

export function createPublicEnv(source: PublicEnvSource): PublicEnv {
  return {
    giscusRepo: source.NEXT_PUBLIC_GISCUS_REPO as
      | `${string}/${string}`
      | undefined,
    giscusRepoId: source.NEXT_PUBLIC_GISCUS_REPO_ID,
    giscusCategory: source.NEXT_PUBLIC_GISCUS_CATEGORY,
    giscusCategoryId: source.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
    siteUrl: source.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL,
    imageUploadMaxSize:
      source.NEXT_PUBLIC_IMAGE_UPLOAD_MAX_SIZE === undefined
        ? DEFAULT_IMAGE_UPLOAD_MAX_SIZE
        : Number(source.NEXT_PUBLIC_IMAGE_UPLOAD_MAX_SIZE),
  };
}

export const publicEnv = createPublicEnv({
  NEXT_PUBLIC_GISCUS_REPO: process.env.NEXT_PUBLIC_GISCUS_REPO,
  NEXT_PUBLIC_GISCUS_REPO_ID: process.env.NEXT_PUBLIC_GISCUS_REPO_ID,
  NEXT_PUBLIC_GISCUS_CATEGORY: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
  NEXT_PUBLIC_GISCUS_CATEGORY_ID: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
  NEXT_PUBLIC_IMAGE_UPLOAD_MAX_SIZE:
    process.env.NEXT_PUBLIC_IMAGE_UPLOAD_MAX_SIZE,
});
