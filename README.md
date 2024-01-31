# lottery-app
This is an sst application that can be spun up in aws, this has a few endpoints which help create a basic lottery game. for more info on the api's available please check out the [postman collection](https://api.postman.com/collections/11585001-5808ee38-b82d-47ba-8445-8c79f7b35805?access_key=PMAT-01HNFCTS5EZD9NC1J8DTXGVWHJ). 

## Set up

SST uses your AWS credentials to run the Live Lambda Development environment and deploy your app. You can provide these credentials in several ways:

### Loading from Environment Variables
SST automatically detects AWS credentials in your environment and uses them for making requests to AWS. The environment variables that you need to set are:

```bash
AWS_ACCESS_KEY_ID: Your AWS access key ID.
AWS_SECRET_ACCESS_KEY: Your AWS secret access key.
```

This is often the most convenient way to configure credentials when deploying your SST app in a CI environment 1.

### Deploying for development 
SST has live lambda reloads and to deploy a version you can make use if this is done by 

```bash
pnpm sst dev || pnpm dev
```

This will ask you to state your stage, and you're ready to develop.

### Note

The old sst console worked a lot better for me than the new.
[https://old.console.sst.dev/](https://old.console.sst.dev/)

## Architecture

Below is a rough architecture diagram of what the application should look like. This has not all been completed at this time
![architecture diagram](event-driven-lottery.io.drawio.png)

## Commands

### `pnpm dev`

Starts the Live Lambda Development environment.

### `pnpm build`

Build your app and synthesize your stacks.

### `pnpm deploy [stack]`

Deploy all your stacks to AWS. Or optionally deploy, a specific stack.

### `pnpm remove [stack]`

Remove all your stacks and all of their resources from AWS. Or optionally removes, a specific stack.

## Documentation

Learn more about the SST.

- [Docs](https://docs.sst.dev/)
- [sst](https://docs.sst.dev/packages/sst)