import { SSTConfig } from "sst";
import { ApiStack } from "./stacks/ApiStack";
import { StorageStack } from "./stacks/StorageStack";
import { AuthStack } from "./stacks/AuthStack";
import { CreateUserSFStack } from "./stacks/CreateUserSFStack";

export default {
  config(_input) {
    return {
      name: "lottery-app",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(StorageStack).stack(ApiStack).stack(AuthStack).stack(CreateUserSFStack);
  }
} satisfies SSTConfig;