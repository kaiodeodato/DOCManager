import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import {
  PACKAGE_NAME,
  TOKEN_SWATCHES,
  brand,
  tokens,
  Button,
  MetricCard,
} from "./index.js";

describe("@ac/ui tokens", () => {
  it("exposes the canonical package name", () => {
    assert.equal(PACKAGE_NAME, "@ac/ui");
  });

  it("defines premium SaaS color accents and brand identity", () => {
    assert.equal(tokens.color.background, "#ffffff");
    assert.equal(tokens.color.accent, "#2563eb");
    assert.equal(brand.name, "DOC Manager");
    assert.ok(tokens.colorDark.background);
  });

  it("exports TokenSwatch entries with cssVar names", () => {
    assert.ok(TOKEN_SWATCHES.length >= 10);
    const accent = TOKEN_SWATCHES.find(
      (swatch) => swatch.category === "color" && swatch.name === "accent",
    );
    assert.ok(accent);
    assert.equal(accent.cssVar, "--dm-color-accent");
  });
});

describe("@ac/ui Button", () => {
  it("renders accessible primary button markup", () => {
    const html = renderToStaticMarkup(
      createElement(Button, { children: "Save document" }),
    );
    assert.match(html, /Save document/);
    assert.match(html, /dm-btn--primary/);
    assert.match(html, /type="button"/);
  });

  it("applies variant and size classes", () => {
    const html = renderToStaticMarkup(
      createElement(Button, {
        variant: "ghost",
        size: "sm",
        children: "Cancel",
      }),
    );
    assert.match(html, /dm-btn--ghost/);
    assert.match(html, /dm-btn--sm/);
  });
});

describe("@ac/ui MetricCard", () => {
  it("composes metric value and delta from Card tokens", () => {
    const html = renderToStaticMarkup(
      createElement(MetricCard, {
        title: "Documents processed",
        value: "1,284",
        delta: { value: "+12%", direction: "up" },
      }),
    );
    assert.match(html, /dm-card/);
    assert.match(html, /Documents processed/);
    assert.match(html, /1,284/);
    assert.match(html, /dm-metric-delta--up/);
    assert.match(html, /\+12%/);
  });
});
