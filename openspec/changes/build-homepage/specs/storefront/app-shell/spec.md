## Purpose

Defines the persistent frame every storefront route renders inside — the header, the main content landmark and the footer — so that landmarks, heading structure and script-free navigation are guaranteed once for the whole storefront rather than re-established by each route.

## ADDED Requirements

### Requirement: The shell is mounted once and inherited by every route

The storefront SHALL render the site header, a main content landmark and the site footer from a single shared layout. A route MUST NOT mount the header or the footer itself, and MUST NOT introduce a second main landmark.

A route SHALL contribute only its own content into the main landmark.

#### Scenario: A route renders

- **WHEN** any storefront route renders
- **THEN** exactly one header landmark, one main landmark and one footer landmark are present
- **AND** the route's own markup contains no header or footer of its own

#### Scenario: A second route is added

- **WHEN** a new storefront route is added
- **THEN** it inherits the header, main landmark and footer without declaring them
- **AND** no shell markup is duplicated into the route

#### Scenario: An internal surface renders

- **WHEN** the internal specimen surface renders
- **THEN** it presents the header and footer through the shared layout like any other route
- **AND** it does not mount duplicates of them

### Requirement: Each route owns exactly one top-level heading

The shell SHALL NOT render a top-level heading. Each route SHALL expose exactly one top-level heading inside the main landmark, and heading levels SHALL descend without skipping.

Heading level SHALL be determined by document structure and SHALL be independent of the typographic role the heading is set in.

#### Scenario: A page is traversed by a screen reader

- **WHEN** a screen reader traverses a storefront route
- **THEN** exactly one top-level heading is announced, and it belongs to the route rather than the shell
- **AND** no heading level is skipped between it and the deepest heading on the page

#### Scenario: A section heading is set at a small typographic role

- **WHEN** a section heading is set in the `caption` role
- **THEN** it is still marked up at the heading level its position in the document requires

### Requirement: Primary destinations are reachable without client script

The shell SHALL present at least one path to every primary destination that does not depend on client-side script, at every viewport width.

Where primary navigation is disclosed progressively at a width — for example behind an overlay on mobile — the shell SHALL still expose those destinations in server-rendered markup elsewhere in the frame.

#### Scenario: Client script has not initialised

- **WHEN** a route has rendered but client-side interactivity has not yet initialised
- **THEN** links to the shop and to collections are present in the document and are activatable

#### Scenario: A phone loads the storefront with scripting unavailable

- **WHEN** a customer loads a route at a mobile width and scripting is unavailable
- **THEN** primary destinations remain reachable without opening the navigation overlay

### Requirement: The shell contributes no page content

The shell SHALL render navigational and identifying content only. It MUST NOT render marketing copy, promotional messaging, announcements, or any brand claim that is not sourced from a supplied brand input.

An announcement or promotional band SHALL exist only when the brand input record supplies its content; where no such input exists, no such band is rendered and no placeholder for it is introduced.

#### Scenario: No announcement content has been supplied

- **WHEN** the brand input record contains no announcement content
- **THEN** no announcement band renders, and no placeholder band occupies space at the top of the page

#### Scenario: The shell is inspected for claims

- **WHEN** the header and footer are inspected
- **THEN** every string they render is either a navigational label, a supplied brand value, or a marked placeholder for an unsupplied brand value
