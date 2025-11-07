# Reference Links for Participants

This document contains useful resources for AEM Edge Delivery Services development.

## Dev Best Practices

- https://www.aem.live/docs/dev-collab-and-good-practices
- https://www.aem.live/developer/keeping-it-100

### Content Modeling

- https://www.aem.live/blog/content-document-semantics
- https://www.aem.live/developer/component-model-definitions
- https://www.aem.live/developer/markup-sections-blocks
- https://www.aem.live/docs/davidsmodel

### Development Process & Tools

- https://www.aem.live/blog/testing-in-aem
- https://www.aem.live/developer/ai-coding-agents
- [Helix Website Repo](https://github.com/adobe/helix-website)

### Community

- https://www.aem.live/developer/block-collection
- https://www.aem.live/developer/block-party/
- https://www.aem.live/community
- https://www.aem.live/blog

---

## Integrations

- [Integration Overview](https://www.aem.live/docs/integrations)
- [Integration Patterns](https://www.aem.live/developer/integrations)
- [Github Actions](https://www.aem.live/developer/github-actions)
- [BYOM](https://www.aem.live/developer/byom)
- [Adobe Experience Cloud](https://www.aem.live/developer/martech-integration)
- [Adobe Target](https://www.aem.live/developer/target-integration)
- [Google Tag Manager](https://www.aem.live/developer/gtm-martech-integration)
- [Forms](https://www.aem.live/developer/forms)


### Workers

- [Cloudflare Workers](https://developers.cloudflare.com/workers/)
- [Fastly Edge Compute](https://www.fastly.com/documentation/solutions/examples/javascript/)
- [AWS Lambda@Edge](https://docs.aws.amazon.com/AmazonCloudFront/latest/DeveloperGuide/lambda-examples.html)
- [Akamai EdgeWorkers](https://techdocs.akamai.com/edgeworkers/docs/hello-world)
- [The Cat API](https://thecatapi.com/)


---

## Web Performance

### Info

- [Lighthouse Overview](https://developer.chrome.com/docs/lighthouse/overview)
- [Web Vitals](https://web.dev/articles/vitals)
- [CWV and Search](https://developers.google.com/search/docs/appearance/core-web-vitals)
- [About Page Speed Insights](https://developers.google.com/speed/docs/insights/v5/about)

### Metrics

- [TTFB](https://web.dev/articles/ttfb)
- [FCP](https://web.dev/articles/fcp)
- [LCP](https://web.dev/articles/lcp)
- [SI](https://developer.chrome.com/docs/lighthouse/performance/speed-index)
- [CLS](https://web.dev/articles/cls)
- [TBT](https://web.dev/articles/tbt)
- [INP](https://web.dev/articles/inp)

### Tools

- [CrUX Vis](https://cruxvis.withgoogle.com/)
- [TREO SiteSpeed](https://treo.sh/sitespeed)
- [OpTel Explorer Docs](https://www.aem.live/docs/optel-explorer)
- [LHS Calculator](https://googlechrome.github.io/lighthouse/scorecalc/)
- [PSI Home](https://pagespeed.web.dev/)

### Bookmarklets

**Open in PageSpeed Insight**

```javascript
javascript:(function(){window.open('//developers.google.com/speed/pagespeed/insights/?url=%27+window.location);})()
```

**Open in Treo SiteSpeed**

```javascript
javascript:(function(){window.open('//treo.sh/sitespeed/' + window.location.origin);})()
```

**Open in CrUX Vis**

```javascript
javascript:(function(){window.open('//cruxvis.withgoogle.com/#/?view=cwvsummary&url='+window.location+'&identifier=url&device=PHONE&periodStart=0&periodEnd=-1&display=p75s');})()
```
