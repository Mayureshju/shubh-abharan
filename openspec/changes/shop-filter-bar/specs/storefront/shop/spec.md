## ADDED Requirements

### Requirement: Desktop filters are a bar above the grid

From 1024px the shop SHALL present its filters as a bar above the product grid, not as a column beside it. Type, tag, price and availability options SHALL be links that apply on activation, keep the other filters, and return to page 1. The active option in each group SHALL be marked visibly and with `aria-current`. Price SHALL be offered as fixed bands that map to the inclusive `min`/`max` bounds; a range that matches no band SHALL show as an active chip of its own. Sort SHALL be a labelled select that applies on change and offers a submit control when script is unavailable. Below 1024px the bottom sheet SHALL remain the filter entry.

#### Scenario: A customer picks a price band

- **WHEN** a customer on page 2 activates "₹25,000 – ₹50,000"
- **THEN** the URL carries `min=25000&max=50000` with the other filters and no `page`
- **AND** that chip is marked current

#### Scenario: A customer sorts without script

- **WHEN** script is unavailable and the customer picks a sort and submits
- **THEN** the shop reloads sorted, keeping the other filters

#### Scenario: A customer opens the shop on a phone

- **WHEN** the shop renders at 390px
- **THEN** the filter bar is hidden and the Filter button opens the sheet

## REMOVED Requirements

### Requirement: The filter column stays in view

**Reason**: The filter column is replaced by the bar above the grid.
**Migration**: None; the bar sits at the top of the listing.
