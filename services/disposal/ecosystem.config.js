module.exports = [{
      script: "./dist/server.js",
      exec_mode:"cluster",
      instances: "max",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production"
      },
      error_file: "../logs/error.log",
      out_file: "../logs/info.log",
      time: false,
    }
  ]
