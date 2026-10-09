## MODIFIED Requirements

### Requirement: The product page offers Buy now, Add to bag, and wishlist without detours

The product detail page SHALL offer:

- **Buy now** — the view's one primary action.
- **Add to bag** — a quiet action.
- **Wishlist** — a toggle beside the product name.

**Sizes.** When the product declares sizes, each size SHALL be presented as a selectable card, and the customer SHALL choose one before buying.

- When the sizes differ in price, each card SHALL show its own price.
- A sold-out or unavailable size SHALL NOT be selectable. Its card SHALL read "Sold out" in text as well as showing its state.
- Every size card SHALL show a visible focus indicator.

**Actions.**

- **Buy now** SHALL ensure the chosen variant and every chosen add-on are in the bag without increasing an existing line's quantity. It SHALL then go to checkout.
- **Add to bag** SHALL add the chosen variant and every chosen add-on, then open the bag drawer on the same page.
- **Wishlist** SHALL save the piece without navigating. It SHALL then show that the piece is saved, with a link to the wishlist.
  - Activating it again SHALL remove the piece.
  - Its saved state SHALL be exposed to assistive technology.
  - Its saved state SHALL NOT be shown by colour alone.

#### Scenario: A customer buys now

- **WHEN** a customer chooses a size and activates Buy now
- **THEN** checkout opens with that variant in the bag

#### Scenario: Buy now with the piece already in the bag

- **WHEN** the chosen variant is already in the bag at quantity 1 and the customer activates Buy now
- **THEN** checkout opens with that line still at quantity 1

#### Scenario: A customer adds to the bag

- **WHEN** a customer activates Add to bag
- **THEN** the bag updates immediately and the bag drawer opens on the product page

#### Scenario: A size is sold out

- **WHEN** one of a product's sizes is sold out
- **THEN** that size cannot be selected
- **AND** its card reads "Sold out" and its size is struck through, not marked by colour alone

#### Scenario: Sizes differ in price

- **WHEN** a product's sizes carry different prices
- **THEN** each size card shows its own price

#### Scenario: A customer saves a piece

- **WHEN** a customer activates the wishlist control beside the name
- **THEN** the piece is saved without leaving the page
- **AND** the control is announced as pressed and "Saved · View wishlist" appears

#### Scenario: A customer removes a saved piece

- **WHEN** the piece is saved and the customer activates the wishlist control again
- **THEN** the piece is removed from the wishlist and the control is announced as not pressed

### Requirement: The purchase actions stay within reach on phones

At mobile widths, Add to bag and Buy now SHALL stay fixed side by side at the bottom of the viewport while the product page scrolls.

- Buy now SHALL show the amount payable for the chosen size and the chosen add-ons.
- Page content SHALL NOT be hidden behind the bar at the end of the page.
- A control that receives keyboard focus SHALL NOT be hidden behind the bar.

#### Scenario: A phone customer scrolls the gallery

- **WHEN** a customer on a 390px viewport scrolls anywhere on a product page
- **THEN** Buy now and Add to bag remain visible at the bottom of the viewport
- **AND** the last content of the page can still be scrolled into view above them

#### Scenario: Buy now shows the total

- **WHEN** a customer has chosen a ₹1,000 size and one ₹250 add-on
- **THEN** Buy now reads ₹1,250

## ADDED Requirements

### Requirement: The purchase actions stay in view on wider screens

From 768px, Add to bag and Buy now SHALL stay fixed at the bottom of the viewport while the product page scrolls.

- They SHALL sit beneath the product details column.
- A summary of the selection SHALL sit beside them: the piece's name, the chosen size when the piece has sizes, and the number of chosen add-ons when any are chosen.
- Buy now SHALL show the amount payable for the chosen size and the chosen add-ons.
- Page content SHALL NOT be hidden behind the bar at the end of the page.

#### Scenario: A desktop customer scrolls to the related pieces

- **WHEN** a customer at 1440px scrolls to the end of a product page
- **THEN** Buy now and Add to bag remain visible at the bottom of the viewport
- **AND** the summary names the piece and its chosen size
- **AND** the related pieces can be scrolled into view above the bar

### Requirement: The product page shows the selected size's price

The product detail page SHALL show the payable price of the selected configuration as the page's price. It SHALL update when the customer chooses another size. When that configuration carries a compare price higher than its payable price, the compare price SHALL be shown struck through beside it.

#### Scenario: A customer chooses a dearer size

- **WHEN** a customer changes from a ₹1,000 size to a ₹1,200 size
- **THEN** the page price reads ₹1,200

#### Scenario: The selected size is on sale

- **WHEN** the selected size has a sale price lower than its list price
- **THEN** the sale price is shown with the list price struck through beside it

### Requirement: The product page offers add-ons

When the catalog holds add-ons, the product detail page SHALL present them in a horizontally scrollable rail headed "Add-ons". Each add-on SHALL show its photograph, name and price.

**Which add-ons show.** Only add-ons that can be bought and carry a price SHALL be shown.

**Choosing.**

- A customer SHALL be able to choose and un-choose each add-on by pointer, touch and keyboard.
- A chosen add-on SHALL be marked in text, not by colour alone.
- Choosing an add-on SHALL NOT change the bag. Chosen add-ons SHALL enter the bag only through Add to bag or Buy now, each at quantity one.
- When one or more add-ons are chosen, the page SHALL state how many are chosen and their combined price.

**When the rail is omitted.** The rail SHALL NOT render when any of these is true:

- the catalog holds no add-on that can be bought
- the page is an add-on's own product page
- the piece itself cannot be bought

**Wider screens.** From 768px, the rail SHALL offer previous and next controls whenever its add-ons overflow it.

#### Scenario: A customer chooses an add-on and buys now

- **WHEN** a customer chooses one add-on and activates Buy now
- **THEN** checkout opens with the piece and that add-on in the bag, each at quantity one

#### Scenario: A customer chooses an add-on without buying

- **WHEN** a customer chooses an add-on and then leaves the page
- **THEN** the bag is unchanged

#### Scenario: A keyboard customer chooses an add-on

- **WHEN** a keyboard user tabs to an add-on and presses Space
- **THEN** the add-on is chosen and its focus is visible
- **AND** it reads "Added"

#### Scenario: No add-ons exist

- **WHEN** no product is marked as an add-on
- **THEN** the product page renders without an add-ons section

#### Scenario: A customer opens an add-on's own page

- **WHEN** a customer opens the product page of an add-on
- **THEN** no add-ons rail is shown

### Requirement: The product page shows where the piece sits

The product detail page SHALL show a breadcrumb of Home, the product's type and the product's name.

- Home and the type SHALL be links. The type SHALL link to the shop filtered by that type.
- The product's name SHALL be marked as the current page.
- On a phone, the breadcrumb SHALL stay on one line without causing horizontal page scroll.

#### Scenario: A customer follows the type crumb

- **WHEN** a customer activates the type in the breadcrumb of a ring
- **THEN** the shop opens filtered to rings

#### Scenario: A long product name renders on a phone

- **WHEN** a product with a long name renders at 390px
- **THEN** the breadcrumb stays on one line and the page has no horizontal scroll
