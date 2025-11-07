# Advanced Topics Hands-on Exercise

This is a hands-on exercise. You will be migrating some content from https://deno.com over to Edge Delivery on DA, doing some light coding and updating some configurations via the Admin API.

## Prerequisites
As a pre-requisite to Masterclass, you should already have an org and a site up and running after having gone through the [Getting Started tutorial](https://www.aem.live/developer/tutorial). Lets expand on that now to:
- Create a new site under your org for Deno
- Import some blog content into the site
- Create two separate indices & sitemaps for the blog and site pages
- Create a repoless site called _deno-enterprise_
- Add a custom header for some path(s)
- Add a new user to the org

**IMPORTANT: Before going through the following steps, fork this `eds-masterclass` repo and checkout the `migration` branch.**

## Step 1: Create the Deno site in your org

```sh
curl -X POST https://admin.hlx.page/config/{org}/sites/deno.json \
  -H 'content-type: application/json' \
  -H 'x-auth-token: {your-auth-token}' \
  --data '{
  "code": {
    "owner": "{org}",
    "repo": "{site}"
  },
  "content": {
    "source": {
      "url": "https://content.da.live/{org}/{site}/"
    }
  }
}'
```
Alternatively:
- Go to https://labs.aem.live/tools/site-admin/index.html (make sure you are authenticated via AEM Sidekick)
- Create a new site
- Point it to your fork of this `eds-masterclass` repo
- Create a folder called `deno` in DA for the site, and point the site's content to https://content.da.live/{ORG}/deno/


## Step 2: Import content
- Run `aem import` from the repo
- Review the transformation file at `/tools/importer/import.js`.
- Import the following pages:
    - https://deno.com/blog/fresh-and-vite
    - https://deno.com/blog/updates-from-tc39
    - https://deno.com/blog/deno-deploy-highlights
    - https://deno.com/blog/open-source
    - https://deno.com/blog/v2.5

The blog post metadata should contain fields for `Author` and `Tags` which are currently missing. Update the `handleBlogPosts` function in `import.js` to include these in the metadata table.

_Solution is available in the `migration-02` branch_

_TIP: Use the Import Workbench to import one as a test. Once satisfied with your import updates, import all 5 pages in bulk, then drop them in your DA folder in a /blog folder._

## Step 3: Create site and blog indices
- Create some dummy non-blog content on the site, throw some blocks on a couple of pages and publish them
- Go to https://labs.aem.live/tools/index-admin/index.html
- Create a `default` index for site content. It should include all site content excluding blog post pages
- Create a `blog` index for the blog pages that were imported
    - Value for `include` should be `/blog/**`

If you prefer curl, use the following command:

```sh
curl -X POST https://admin.hlx.page/config/{org}/sites/{site}/content/query.yaml \
  -H 'content-type: text/yaml' \
  -H 'x-auth-token: {your-auth-token}' \
  --data @resources/index-config.yaml
```

You can verify the index config in the index admin tool mentioned above to confirm that things are looking good and edit as necessary.

## Step 4: Create sitemaps pointing to their indices
- Go to https://labs.aem.live/tools/sitemap-admin/index.html
- Create sitemap configs for blog and site content pointing to the indices created in Step 3
- Generate the sitemaps for both
- Verify that things look correct at `/sitemap.xml` and `/blog-sitemap.xml`

If you prefer to use curl, use the following command:

```sh
curl -X POST https://admin.hlx.page/config/{org}/sites/{site}/content/sitemap.yaml \
  -H 'content-type: text/yaml' \
  -H 'x-auth-token: {your-auth-token}' \
  --data @resources/sitemap-config.yaml
```

## Step 5: Create a repoless site

We now want a second site to utilize the same code & block library.

- Create a second "repoless" site, pointing to the same codebase
- Create a metadata sheet for the new site and apply the `enterprise` theme to all pages.
- Review how themes are loaded in `scripts/aem.js`
- Change the value of the `--link-color` CSS variable scoped to `body.enterprise`
- Test your changes on both sites!

You now have two sites with a separatation in styling powered by the same codebase!

_TIP: You can run dev server for both sites locally by running `aem up` with the `--pagesUrl` and `--port` flags pointing to the their respective URLs._

Repoless Docs: https://www.aem.live/docs/repoless

## Step 6: Add a custom header
- Apply a custom HTTP header to any content or code path. You can use Postman, Curl or the HTTP Headers Editor tool: https://labs.aem.live/tools/headers-edit/index.html

CURL:
```sh
curl -X POST https://admin.hlx.page/config/{org}/sites/{site}/headers.json \
  -H 'content-type: application/json' \
  -H 'x-auth-token: {your-auth-token}' \
  --data '{
	"/**": [
      {
        "key": "access-control-allow-origin",
        "value": "*"
      }
    ]
}'
```
- Verify that the response header exists by making a `GET` request to the resource

## Step 7: Add a new user to your org
- Go to https://labs.aem.live/tools/user-admin/index.html
- Add a new user to your org with the role `config_admin`

