import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  // 상위 디렉터리에 package-lock.json이 있어 Turbopack이 잘못된 루트를 잡는 문제 수정
  turbopack: {
    root: path.resolve(__dirname),
  },
};

export default nextConfig;
