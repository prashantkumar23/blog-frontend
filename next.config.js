const withFonts = require("next-fonts");

module.exports = withFonts({
  enableSvg: true,
  webpack(config, { dev, isServer }) {
    // Replace React with Preact only in client production build
    if (!dev && !isServer) {
      Object.assign(config.resolve.alias, {
        react: "preact/compat",
        "react-dom/test-utils": "preact/test-utils",
        "react-dom": "preact/compat",
      });
    }

    return config;
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      "cdn.pixabay.com",
      "lh3.googleusercontent.com",
      "www.statuspik.com",
      "res.cloudinary.com",
      "img.freepik.com",
    ],
  },
});
