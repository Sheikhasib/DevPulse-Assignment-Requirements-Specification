import app from "./app";
import config from "./config";
import { initDB } from "./db";

const main = async () => {
  // Initialize Database Connection from db >> index.ts file
  initDB();

  app.listen(config.port, () => {
    console.log(`Server is running on port ${config.port}`);
  });
};

main();
