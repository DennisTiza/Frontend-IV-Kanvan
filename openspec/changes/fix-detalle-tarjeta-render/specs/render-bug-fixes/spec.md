## ADDED Requirements

### Requirement: Modal renders all processes without NG0600 error
The DetalleTarjeta modal SHALL NOT throw NG0600 when opening any production card. The modal SHALL render all process blocks (header, info, progress bar, action buttons) for every `procesoXTarjeta` in the tarjeta object.

#### Scenario: Open modal for "Por hacer" card
- **WHEN** user clicks a card in "Por hacer" column
- **THEN** the modal opens and displays each process with name, badge, progress bar, and action buttons (Iniciar for first accessible process, Bloqueado for locked processes)

### Requirement: Progress bar width is correct when cantidad = 0
The progress bar SHALL NOT render at 100% width when both `cantidad` and `cantidadRegistrada` are 0.

#### Scenario: Fresh process with cantidad = 0
- **WHEN** a process has `cantidad = 0` and `cantidadRegistrada = 0`
- **THEN** the progress bar fill width SHALL be 0%

### Requirement: KanbanCard shows all processes
The KanbanCard SHALL display progress bars for all processes, including those with no activity (no `fechaInicio`, no `cantidadRegistrada`).

#### Scenario: New card in "Por hacer"
- **WHEN** a card has 3 processes, none started
- **THEN** the KanbanCard SHALL display 3 process bars with 0% fill

### Requirement: Process IDs can be 0
The application SHALL treat `proceso.id = 0` as a valid identifier.

#### Scenario: Process with id = 0
- **WHEN** a process has `id = 0`
- **THEN** the process SHALL render in both the modal and KanbanCard
- **THEN** clicking "Iniciar" on that process SHALL emit `procesoAccion` with `procesoId = 0`
