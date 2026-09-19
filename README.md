# Jewelry Ecommerce — Claude Code + OpenSpec Skills

These project-local skills are designed for a premium jewelry ecommerce website with strong visual direction, restrained motion, responsive ecommerce UX, and explicit anti-AI-slop rules.

## Install
Copy `.claude/` and `CLAUDE.md` into the repository root.

Initialize OpenSpec separately in the same repository:

```bash
openspec init
```

Enable the optional workflows you want (especially verification) with:

```bash
openspec config profile
```

For a visual ecommerce build, enable the `ff` workflow and `verify` workflow if your OpenSpec profile picker exposes them.

## Recommended build loop

1. `/opsx:explore` — understand the storefront and visual direction.
2. `/opsx:propose` — turn the approved idea into proposal/spec/design/tasks.
3. Review the artifacts before code.
4. `/opsx:apply <change-name>` — implement tasks.
5. `/opsx:verify <change-name>` — verify implementation against the plan.
6. `/opsx:archive <change-name>` — archive the completed change.

## Suggested first changes

- establish-brand-system
- build-storefront-shell
- build-homepage
- build-collection-page
- build-product-detail
- build-cart-and-wishlist
- add-motion-system
- visual-qa-and-performance

Do not put the entire website into one giant change unless the repository is a throwaway prototype. Keep changes small enough to review visually and functionally.
