/*
 * Copyright 2023 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */
/* global WebImporter */
/* eslint-disable no-console, class-methods-use-this */

const handleBlogPosts = (main, metadata) => {
  const isBlogPost = main.querySelector('.blog-header');

  if (isBlogPost) {
    const article = main.querySelector('article');
    if (article) {
      const date = article.querySelector('time');
      metadata.Date = date.innerText;
      const blogMetadataContainer = date.closest('div');
      const authors = blogMetadataContainer.querySelector(':scope > ul');

      if (authors) {
        const authorList = authors.querySelectorAll('li');
        metadata.Author = [...authorList].map((author) => author.querySelector('a').innerText).join(', ');
      }

      const tagLinks = blogMetadataContainer.querySelectorAll('a[href*="/blog?tag="]');
      if (tagLinks.length > 0) {
        metadata.Tags = [...tagLinks].map((tag) => tag.innerText).join(', ');
      }

      blogMetadataContainer.remove();
    }
  }
};

export default {
  /**
   * Apply DOM operations to the provided document and return
   * the root element to be then transformed to Markdown.
   * @param {HTMLDocument} document The document
   * @param {string} url The url of the page imported
   * @param {string} html The raw html (the document is cleaned up during preprocessing)
   * @param {object} params Object containing some parameters given by the import process.
   * @returns {HTMLElement} The root element to be transformed
   */

  transform: ({
    // eslint-disable-next-line no-unused-vars
    document, url, html, params,
  }) => {
    const main = document.querySelector('main') || document.body;

    WebImporter.DOMUtils.remove(main, [
      'header',
      'nav',
      '.nav',
      'footer',
      'iframe',
      'noscript',
    ]);

    const metadata = WebImporter.Blocks.getMetadata(document);
    handleBlogPosts(main, metadata);
    const metadataBlock = WebImporter.Blocks.getMetadataBlock(document, metadata);
    main.append(metadataBlock);

    WebImporter.rules.adjustImageUrls(main, url, params.originalURL);

    const ret = [];

    const path = ((u) => {
      let p = new URL(u).pathname;
      if (p.endsWith('/')) {
        p = `${p}index`;
      }
      return decodeURIComponent(p)
        .toLowerCase()
        .replace(/\.html$/, '')
        .replace(/[^a-z0-9/]/gm, '-');
    })(url);

    ret.push({
      element: main,
      path,
    });

    return ret;
  },
};
