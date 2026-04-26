/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["@react-pdf/renderer", "@react-pdf/layout", "@react-pdf/pdfkit", "@react-pdf/font"],
};

export default nextConfig;
