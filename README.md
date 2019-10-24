# Mozilla Syncfest Campaign

Campaign Bug Reporting page for the upcoming Syncfest Campaign led by the Open Innovation Team.

## Setting up the server

### Requirements

* First install [Docker](https://docs.docker.com/install/) and [docker-compose](https://docs.docker.com/compose/install/)
* Create a repository to hold the submitted issues
* Create a personal access token for your GitHub user

### Starting

Then you can start the server with the following command. Make sure to replace the placeholders with your data.

```
$ git clone <URL>
$ cd syncfest-campaign
$ npm install
$ GITHUB_TOKEN=<yourGitHubToken> OWNER=<yourGitHubUsername> REPO=<yourGitHubRepoForIssues> SESSION_SECRET=someSECRET npm run start:docker
```

Now you can access the website for it at ```localhost:4000```.

**Note:** When running locally, screenshots won't be appended to the resulting GitHub Issue

### Without Docker

If you wanna use it without docker, you can run it by:

```
$ git clone <URL>
$ cd syncfest-campaign
$ npm install
$ GITHUB_TOKEN=<yourGitHubToken> OWNER=<yourGitHubUsername> REPO=<yourGitHubRepoForIssues> SESSION_SECRET=someSECRET BASE_URL=http://localhost:4000 node index
```