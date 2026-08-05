module.exports = {
  apps: [
    {
      name: "ma-api",
      script: "apps/api/dist/index.js",
      instances: "max",
      exec_mode: "cluster",
      env_production: {
        NODE_ENV: "production",
      },
      error_file: "logs/api-error.log",
      out_file:   "logs/api-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss",
      max_memory_restart: "512M",
    },
  ],
};
