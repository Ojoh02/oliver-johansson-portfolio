import { Octokit, App } from "https://cdn.skypack.dev/octokit?dts";

const getCommits = async () => {
    console.log(import.meta.env.VITE_AUTH_TOKEN)
    console.log(import.meta.env.MODE)
    const octokit = new Octokit({ auth: import.meta.env.VITE_AUTH_TOKEN });
    const orgs = await octokit.request(
      `GET /user/orgs`, { }
    );
    let recentCommitsList = []
    let maxElement;

    await Promise.all(orgs.data.map(async (element) => {
      let login = element.login
      let repos = await octokit.request(
        `GET /orgs/{org}/repos`, { org: login }
      );
      await Promise.all(repos.data.map(async (element) => {
        let repoName = element.full_name
        let { data } = await octokit.request(
          'GET /repos/{owner}/{repo}/commits', { owner: login, repo: element.name}
        );
        data.map(element => {
          let comments = element.commit.message
          let author = element.commit.author.name
          let time = element.commit.committer.date
          let date = new Date(time)
          let milliseconds = date.getTime()
          if (author == "Ojoh02" || author == "Oliver Johansson") recentCommitsList.push({ comments, author, repoName, milliseconds });
        })
      }))
    }))
    const myRepos = await octokit.request('GET /users/{username}/repos', {
      username: 'Ojoh02'
    })
    await Promise.all(myRepos.data.map(async (element) => {
      let repoName = element.full_name
      let { data } = await octokit.request(
        'GET /repos/{owner}/{repo}/commits', { owner: 'Ojoh02', repo: element.name}
      );
      data.map(element => {
        let comments = element.commit.message
        let author = element.commit.author.name
        let time = element.commit.committer.date
        let date = new Date(time)
        let milliseconds = date.getTime()
        if (author == "Ojoh02" || author == "Oliver Johansson") recentCommitsList.push({ comments, author, repoName, milliseconds });
      })
    }))
    let maxMilliseconds = 0;
    recentCommitsList.map(element => {
      if (element.milliseconds > maxMilliseconds) {
        maxMilliseconds = element.milliseconds
        maxElement = element
      }
    })
    return maxElement
}

export default getCommits