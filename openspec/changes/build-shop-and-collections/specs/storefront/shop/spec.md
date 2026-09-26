## Purpose

Defines the shop listing, its query-parameter filters, the photographed type index, and collection listings so customers can browse the catalog without a parallel type-route tree or marketplace dashboard chrome.

## ADDED Requirements

### Requirement: The shop lists catalog products and filters them by query

The shop surface SHALL list products from the catalog access surface. It SHALL accept optional query parameters for product type, sort order, availability, and inclusive price bounds.

Type SHALL be drawn from the catalog's closed category set. Sort SHALL be the catalog's declared display order, price ascending, or price descending. Availability SHALL be a value from the catalog's availability set. Price bounds SHALL be whole major-currency amounts and SHALL be applied as the catalog's minor-unit price filter.

An unrecognised query value SHALL be ignored. The shop MUST NOT 404 because of an unrecognised query. Products with no supplied price MUST NOT satisfy a price bound.

When no query is present, the shop SHALL list the catalog in declared display order.

The shop MUST NOT offer filters for variant axes, popularity, rating, or bestseller rank.

#### Scenario: A customer opens the shop with no query

- **WHEN** a customer opens the shop with no query parameters
- **THEN** every catalog product is listed in declared display order

#### Scenario: A customer filters by product type

- **WHEN** a customer opens the shop with a recognised type query
- **THEN** the results are exactly the products declaring that category

#### Scenario: A customer sorts by price

- **WHEN** a customer sorts the shop by price ascending
- **THEN** products are ordered by their lowest variant price
- **AND** products with no supplied price appear last in declared display order

#### Scenario: A query value is not recognised

- **WHEN** a query parameter carries a value outside the catalog's closed sets
- **THEN** that parameter is ignored
- **AND** the shop still renders rather than a not-found response

#### Scenario: No products match the filters

- **WHEN** the applied filters match no product
- **THEN** the shop presents an explicit empty state
- **AND** a path to clear the filters is available

### Requirement: Shop filters are a GET form and a mobile bottom sheet

Desktop shop filters SHALL present inline as a GET form so they apply without client script. At mobile widths, those same filters SHALL present as a bottom sheet rather than an inline rail.

The sheet SHALL contain focus while open, close on the escape key, return focus to the control that opened it, and keep its primary and dismiss controls in the lower portion of the viewport. Opening the sheet MUST NOT hijack page scroll. Applying a filter SHALL take effect without waiting for an animation to complete.

#### Scenario: A customer applies filters with scripting unavailable

- **WHEN** a customer submits the shop filter form with client script unavailable
- **THEN** the shop reloads with the corresponding query parameters
- **AND** the listing reflects those filters

#### Scenario: A customer opens filters on a phone

- **WHEN** a customer opens the shop filters at a mobile width
- **THEN** the filters present as a bottom sheet
- **AND** focus is contained in the sheet until it is dismissed

#### Scenario: A customer dismisses the filter sheet

- **WHEN** a customer dismisses the filter sheet by keyboard or pointer
- **THEN** the sheet closes
- **AND** focus returns to the control that opened it

### Requirement: The type index resolves to the shop type filter

The storefront SHALL provide one type index whose entries are photographed catalog types. Each entry SHALL resolve to the shop surface filtered to that type. The index MUST NOT introduce per-type destination routes.

The set of photographed entries SHALL be drawn from the catalog's closed category set. `set` MAY be absent from the photographed index. Bracelets and Bangles MAY both resolve to the bracelet category when they are distinct photographs of that category.

#### Scenario: A customer follows a type index entry

- **WHEN** a customer activates an entry on the type index
- **THEN** they arrive at the shop surface filtered to that type
- **AND** the destination is not a separate per-type route

#### Scenario: A type is presented that the shop cannot filter to

- **WHEN** an entry names a type outside the catalog's category set
- **THEN** the build fails

### Requirement: Collection pages list a named collection in declared order

The storefront SHALL provide a collections index of named collections from the brand record, and a collection page for each collection slug.

A collection page SHALL present that collection's name and its products in the collection's declared order. It MUST NOT present the shop filter chrome. An unknown collection slug SHALL render a not-found response.

A collection with no products SHALL still render, with an explicit empty listing rather than invented pieces.

#### Scenario: A customer opens a named collection

- **WHEN** a customer opens a collection that exists in the brand record
- **THEN** the page presents that collection's name
- **AND** its products in the collection's declared order

#### Scenario: A collection slug is unknown

- **WHEN** a customer opens a collection slug absent from the catalog
- **THEN** the storefront renders a not-found response

#### Scenario: A collection has no products

- **WHEN** a named collection declares no products
- **THEN** the collection page still renders
- **AND** the listing states that no pieces are listed yet
