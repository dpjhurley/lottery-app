import { SSTConfig } from "sst";
import { ApiStack } from "./stacks/ApiStack";
import { StorageStack } from "./stacks/StorageStack";
import { AuthStack } from "./stacks/AuthStack";
import { CreateUserSFStack } from "./stacks/CreateUserSFStack";
import { EventStack } from "./stacks/EventStack";

export default {
  config(_input) {
    return {
      name: "lottery-app",
      region: "us-east-1",
    };
  },
  stacks(app) {
    app.stack(StorageStack).stack(EventStack).stack(ApiStack).stack(AuthStack).stack(CreateUserSFStack);
  }
} satisfies SSTConfig;
