## ADDED Requirements

### Requirement: The shop paginates at twelve pieces

The shop SHALL show at most 12 products per page, chosen by a `page` query parameter that defaults to 1. A page beyond the last SHALL show the last page. The count label SHALL report the total number of matching pieces. Pagination links SHALL preserve the other query parameters, and submitting the filter form SHALL return to page 1. Pagination SHALL NOT render when every match fits on one page.

#### Scenario: A customer moves to the next page

- **WHEN** 30 pieces match and the customer follows "Next" from page 1
- **THEN** the URL carries `page=2` with the same filters
- **AND** pieces 13–24 are shown

#### Scenario: A customer changes a filter on page 3

- **WHEN** the customer applies a different type
- **THEN** the shop shows page 1 of the new results

#### Scenario: A phone renders pagination

- **WHEN** the shop renders at 390px with more than one page
- **THEN** it shows previous, "n of N", and next without horizontal scroll

### Requirement: The filter column stays in view

From 768px the filter column SHALL stick below the header while the grid scrolls, and SHALL scroll internally when it is taller than the viewport.

#### Scenario: A customer scrolls the grid on a desktop

- **WHEN** the customer scrolls past the first row at 1440px
- **THEN** the filters remain visible beside the grid
