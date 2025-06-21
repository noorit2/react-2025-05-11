import { Octokit } from "@octokit/core"

export const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
})

export async function GET(req) {
  const { searchParams } = new URL(req.url)
  const page = searchParams.get("page") || "1"
  const perPage = searchParams.get("per_page") || "10"
  const sort = searchParams.get("sort") || "created"
  const direction = searchParams.get("direction") || "desc"
 const state = searchParams.get("state") || "all";
  console.log(searchParams);
  
  try {
    const result = await octokit.request("GET /repos/{owner}/{repo}/issues", {
      owner: "AdguardTeam",
      repo: "AdguardFilters",
      page: Number(page) + 1,
      per_page: Number(perPage),
      sort: sort,
      direction: direction,
      state: state,
      headers: {
        "X-GitHub-Api-Version": "2022-11-28",
      },
    })
    

    return new Response(JSON.stringify(result.data), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message || "Unknown error" }),
      { status: 500 }
    )
  }
}
