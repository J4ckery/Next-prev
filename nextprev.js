(function (global, factory) {
  if (typeof exports === "object" && typeof module === "object") {
    module.exports = factory();
  } else if (typeof define === "function" && define.amd) {
    define([], factory);
  } else if (typeof exports === "object") {
    exports.WebflowTools = factory();
  } else {
    global.WebflowTools = factory();
  }
})(self, function () {
  "use strict";

  var SOURCE_SELECTOR = "[r-prevnext-source]";

  function getPrevNextData(currentEl) {
    var parent = currentEl.parentElement;

    var nextLink =
      parent?.nextElementSibling?.querySelector("a") || null;

    var prevLink =
      parent?.previousElementSibling?.querySelector("a") || null;

    return {
      prevHref: prevLink?.getAttribute("href") || null,
      prevTitle: prevLink?.innerText || null,
      prevImgSrc:
        prevLink?.querySelector("img")?.getAttribute("src") || null,

      nextHref: nextLink?.getAttribute("href") || null,
      nextTitle: nextLink?.innerText || null,
      nextImgSrc:
        nextLink?.querySelector("img")?.getAttribute("src") || null,
    };
  }

 function applyData(data) {
  const mappings = [
    {
      selector: "[r-prevnext-next-btn]",
      legacySelector: "[np-articles-next-btn]",
      attribute: "href",
      value: data.nextHref,
      type: "next",
    },
    {
      selector: "[r-prevnext-next-text]",
      legacySelector: "[np-articles-next-text]",
      attribute: "innerText",
      value: data.nextTitle,
      type: "next",
    },
    {
      selector: "[r-prevnext-prev-btn]",
      legacySelector: "[np-articles-prev-btn]",
      attribute: "href",
      value: data.prevHref,
      type: "prev",
    },
    {
      selector: "[r-prevnext-prev-text]",
      legacySelector: "[np-articles-prev-text]",
      attribute: "innerText",
      value: data.prevTitle,
      type: "prev",
    },
    {
      selector: "[r-prevnext-prev-img]",
      legacySelector: "[np-articles-prev-img]",
      attribute: "src",
      value: data.prevImgSrc,
      type: "prev",
    },
    {
      selector: "[r-prevnext-next-img]",
      legacySelector: "[np-articles-next-img]",
      attribute: "src",
      value: data.nextImgSrc,
      type: "next",
    },
  ];

  mappings.forEach((item) => {
    const el = document.querySelector(
      `${item.selector}, ${item.legacySelector}`
    );

    if (!el) return;

    // 👇 find the actual link block wrapper (<a>)
    const linkBlock = el.closest("a");

    // 👉 if no value → hide the whole link block
    if (!item.value) {
      if (linkBlock) linkBlock.style.display = "none";
      return;
    }

    // 👉 otherwise set values
    if (item.attribute === "innerText") {
      el.innerText = item.value;
    } else {
      el.setAttribute(item.attribute, item.value);
    }
  });
}

  function init() {
    const current = document.querySelector(
      `${SOURCE_SELECTOR} .w--current, [np-articles-source] .w--current`
    );

    if (!current) {
      throw new Error("Can't find current article");
    }

    const data = getPrevNextData(current);
    applyData(data);
  }

  document.addEventListener("DOMContentLoaded", init);

  return {};
});
