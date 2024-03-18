// webpack.config.js

module.exports = {
    // other webpack configuration...
    module: {
      rules: [
        // other rules...
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [
            {
              loader: 'url-loader',
              options: {
                limit: 8192, // Convert images < 8kb to base64 strings
                name: 'images/[name].[ext]' // Output images to images folder
              },
            },
          ],
        },
      ],
    },
  };
  