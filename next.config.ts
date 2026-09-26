import type { NextConfig } from "next";

const bucket = process.env.AWS_S3_BUCKET_NAME;
const region = process.env.AWS_REGION;

const nextConfig: NextConfig = {
  serverExternalPackages: ["mongoose", "mongodb"],
  images: {
    remotePatterns:
      bucket && region
        ? [{ protocol: "https", hostname: `${bucket}.s3.${region}.amazonaws.com`, pathname: "/products/**" }]
        : [],
  },
};

export default nextConfig;
