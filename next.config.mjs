/*
 * @Author: junsa junsa163@163.com
 * @Date: 2023-05-05 14:32:13
 * @LastEditors: junsa junsa163@163.com
 * @LastEditTime: 2023-05-06 11:41:40
 * @FilePath: /workerWebsite/githup/ChatGPT-Next-Web/next.config.mjs
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/** @type {import('next').NextConfig} */

const nextConfig = {
  experimental: {
    appDir: true,
  },
  async rewrites() {
    const ret = [];

    const apiUrl = process.env.API_URL;
    console.log('获取他的环境变量',process.env.OPENAI_API_KEY)
    if (apiUrl) {
      console.log("[Next] using api url ", apiUrl);
      ret.push({
        source: "/api/:path*",
        destination: `${apiUrl}/:path*`,
      });
    }

    return ret;
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
  output: "standalone",
};

export default nextConfig;
