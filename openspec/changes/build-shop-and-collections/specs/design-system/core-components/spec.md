## ADDED Requirements

### Requirement: Overlay surfaces share one native dialog primitive

Navigation overlays, filter sheets, and other modal overlays SHALL be built on a single native `<dialog>` primitive that supplies `showModal()`, focus containment, escape handling, background inertness, and focus return to the opening control.

A filter sheet SHALL use that primitive at bottom-sheet geometry. A second hand-rolled focus trap MUST NOT be introduced for the sheet.

Motion on an overlay SHALL be presentation only. Reduced motion SHALL drop travel animation and keep opacity, and the overlay SHALL still appear and take focus.

#### Scenario: The navigation overlay opens

- **WHEN** a customer opens the navigation overlay
- **THEN** focus moves into a native dialog and is contained there
- **AND** the page behind it does not scroll

#### Scenario: The shop filter sheet opens

- **WHEN** a customer opens the shop filters at a mobile width
- **THEN** the filters present in the same dialog primitive as the navigation overlay
- **AND** the dialog uses bottom-sheet geometry rather than a full-viewport overlay

#### Scenario: Reduced motion is requested on an overlay

- **WHEN** a customer who has requested reduced motion opens an overlay
- **THEN** the overlay appears and takes focus
- **AND** it does not use travel animation
