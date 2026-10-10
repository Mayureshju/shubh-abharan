## RENAMED Requirements

- FROM: `### Requirement: The shop paginates at twelve pieces`
- TO: `### Requirement: The shop paginates at twenty pieces`
- FROM: `### Requirement: Desktop filters are a bar above the grid`
- TO: `### Requirement: Desktop filters are one row of menus`
- FROM: `### Requirement: Shop filters are a GET form and a mobile bottom sheet`
- TO: `### Requirement: Phones filter from a pinned bar and a bottom sheet`

## MODIFIED Requirements

### Requirement: Listings are a uniform square grid

The shop, collection pages, and the wishlist SHALL lay out product cards in one uniform grid. It SHALL have two columns below 768px, three columns from 768px, four columns from 1024px, and five columns from 1280px. Every card SHALL occupy exactly one column. The grid SHALL leave no empty cell before its last row.

#### Scenario: The shop renders on a desktop

- **WHEN** the shop renders eight products at 1440px
- **THEN** the products present five per row in square frames of equal size
- **AND** only the last row may be partially filled

#### Scenario: The shop renders on a tablet

- **WHEN** the shop renders at 768px
- **THEN** the products present three per row in square frames of equal size

#### Scenario: The shop renders on a phone

- **WHEN** the shop renders at 390px
- **THEN** the products present two per row in square frames of equal size

#### Scenario: A collection page renders

- **WHEN** a collection page lists its products
- **THEN** it uses the same grid as the shop, without filter chrome

### Requirement: The shop paginates at twenty pieces

The shop SHALL show at most 20 products per page, chosen by a `page` query parameter that defaults to 1. A page beyond the last SHALL show the last page. The count label SHALL report the total number of matching pieces. Pagination links SHALL preserve the other query parameters, and changing a filter or the sort SHALL return to page 1. Pagination SHALL NOT render when every match fits on one page.

#### Scenario: A customer moves to the next page

- **WHEN** 50 pieces match and the customer follows "Next" from page 1
- **THEN** the URL carries `page=2` with the same filters
- **AND** pieces 21–40 are shown

#### Scenario: A customer changes a filter on page 3

- **WHEN** the customer applies a different type
- **THEN** the shop shows page 1 of the new results

#### Scenario: A phone renders pagination

- **WHEN** the shop renders at 390px with more than one page
- **THEN** it shows previous, "n of N", and next without horizontal scroll

### Requirement: Desktop filters are one row of menus

From 1024px the shop SHALL present Type, Price, Availability and Tag as menus in one row above the product grid, followed by the shown range and a Sort menu at the row's end. A menu SHALL open when its trigger is activated by pointer or keyboard, and SHALL close on Escape, on activation outside it, and when an option is chosen; closing from inside it SHALL return focus to its trigger. At most one menu SHALL be open at a time, and menus MUST NOT open on hover.

Options SHALL be links that apply on activation, keep the other filters, return to page 1, and work without client script. A trigger SHALL show its group's current value when it is not the default, and the current option SHALL be marked visibly and with `aria-current`. Price SHALL be offered as fixed bands that map to the inclusive `min`/`max` bounds; a range that matches no band SHALL show as a current option of its own. Below 1024px the menus SHALL be hidden.

#### Scenario: A customer picks a price band

- **WHEN** a customer on page 2 opens Price and activates "₹25,000 – ₹50,000"
- **THEN** the URL carries `min=25000&max=50000` with the other filters and no `page`
- **AND** the Price trigger shows "₹25,000 – ₹50,000"
- **AND** the menu is closed with focus on its trigger

#### Scenario: A customer dismisses a menu by keyboard

- **WHEN** a menu is open and the customer presses Escape
- **THEN** the menu closes
- **AND** focus returns to its trigger

#### Scenario: A customer filters without script

- **WHEN** script is unavailable and the customer opens a menu and activates an option
- **THEN** the shop loads with that filter applied

#### Scenario: A customer sorts

- **WHEN** the customer chooses "Price, low to high" from the Sort menu
- **THEN** the shop reloads sorted, keeping the other filters

### Requirement: Phones filter from a pinned bar and a bottom sheet

Below 1024px a bar SHALL stay fixed to the bottom of the viewport, showing the number of matching pieces and a Filter control that reports how many filters are active. The bar SHALL precede the product grid in reading order. The page SHALL leave room below its content, and keyboard focus scrolling SHALL leave room, so that neither the footer nor a focused control is hidden behind the bar.

The Filter control SHALL open a bottom sheet presenting Type, Price, Availability, Tag and Sort as option links. Activating an option SHALL apply it, keep the other filters and return to page 1 while the sheet stays open. The sheet SHALL offer a control, labelled with the number of matching pieces, that closes it. Price SHALL be chosen from the same fixed bands as on desktop.

The sheet SHALL contain focus while open, close on the escape key, return focus to the control that opened it, and keep its primary and dismiss controls in the lower portion of the viewport. Opening the sheet MUST NOT hijack page scroll. Applying a filter SHALL take effect without waiting for an animation to complete.

#### Scenario: A customer scrolls the shop on a phone

- **WHEN** the customer scrolls the grid at 390px
- **THEN** the bar with the count and the Filter control stays at the bottom of the screen

#### Scenario: A customer taps a type in the sheet

- **WHEN** the customer opens the sheet and taps "Rings"
- **THEN** the URL carries `category=ring` with the other filters and no `page`
- **AND** the sheet stays open with "Rings" marked current
- **AND** its close control reports the new number of pieces

#### Scenario: A customer dismisses the filter sheet

- **WHEN** a customer dismisses the filter sheet by keyboard or pointer
- **THEN** the sheet closes
- **AND** focus returns to the Filter control

#### Scenario: A customer reaches the end of the shop on a phone

- **WHEN** the customer scrolls to the bottom of the page at 390px
- **THEN** the footer's last line is visible above the bar
