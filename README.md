# LeanKit Linker for Slack
Slapp application to unfurls links to LeanKit cards in all messages.

*NOTE:* Currently only available internally for LeanKit

### Local Development
To run locally you can add a `config.local.js|json` file at the root of
the project to provide configuration.

You will also have to update the [application configuration](https://api.slack.com/apps/A51EJN7K3/event-subscriptions) 
on slack's site to point to your local instance if you want to test.

### Environment Variables
All of these except for the `PORT` **must** be configured for this service
to run.

| Group / Variable         | Default |
|--------------------------|---------|
| PORT                     | 4390    |
| SLACK_VERIFICATION_TOKEN | null    |
| SLACK_CLIENT_TOKEN       | null    |
| LEANKIT_API_TOKEN        | null    |
