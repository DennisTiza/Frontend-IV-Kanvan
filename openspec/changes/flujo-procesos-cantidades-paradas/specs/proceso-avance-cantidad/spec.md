## ADDED Requirements

### Requirement: ProcesoXTarjeta expone cantidad, cantidadRealizada y cantidadRegistrada

Cada ProcesoXTarjeta DEBE exponer tres propiedades numéricas: `cantidad` (total a producir, heredado de la tarjeta), `cantidadRealizada` (último delta reportado, ej: si reportó 40 luego 30, aquí queda 30), `cantidadRegistrada` (acumulado histórico, 40+30=70, nunca decrece).

#### Scenario: ProcesoXTarjeta muestra cantidad total
- **WHEN** el backend devuelve un ProcesoXTarjeta con `cantidad: 100`, `cantidadRealizada: 0`, `cantidadRegistrada: 0`
- **THEN** el frontend muestra "0/100" como progreso

#### Scenario: CantidadRegistrada se actualiza tras reportar avance
- **WHEN** el operario reporta 30 unidades en un proceso con `cantidadRegistrada: 40`
- **THEN** el frontend actualiza a `cantidadRegistrada: 70` tras refrescar

### Requirement: Input de cantidad por proceso en el modal

Cada proceso en el modal de detalle DEBE mostrar un campo numérico editable donde el operario ingrese cuántas unidades ha procesado. El valor mínimo es `cantidadRegistrada` actual (no puede decrecer). El valor máximo es `cantidad` total. El valor por defecto es `cantidadRegistrada`.

#### Scenario: Input muestra cantidadRegistrada como default
- **WHEN** un proceso tiene `cantidadRegistrada: 40`, `cantidad: 100`
- **THEN** el input muestra "40", mínimo 40, máximo 100

#### Scenario: Operario incrementa cantidad
- **WHEN** el operario cambia el input de 40 a 70
- **THEN** el delta es 30 (70 - 40)
- **AND** el botón "Registrar Parada" se habilita porque 70 < 100

#### Scenario: Operario completa cantidad total
- **WHEN** el operario cambia el input de 40 a 100
- **THEN** el delta es 60 (100 - 40)
- **AND** el botón "Finalizar" se habilita porque 100 === 100
- **AND** el botón "Registrar Parada" se deshabilita

### Requirement: Barra de progreso de cantidad por proceso

Cada proceso DEBE mostrar una barra de progreso visual calculada como `cantidadRegistrada / cantidad * 100`. La barra DEBE incluir el texto "X/Y" al lado.

#### Scenario: Barra muestra progreso parcial
- **WHEN** un proceso tiene `cantidadRegistrada: 40`, `cantidad: 100`
- **THEN** la barra muestra 40% de ancho y texto "40/100"

#### Scenario: Barra muestra progreso completo
- **WHEN** un proceso tiene `cantidadRegistrada: 100`, `cantidad: 100`
- **THEN** la barra muestra 100% de ancho y texto "100/100"

### Requirement: Las barras de cantidad aparecen también en la KanbanCard

La KanbanCard DEBE mostrar una barra de progreso de cantidad por cada proceso que tenga `cantidadRegistrada > 0` o que sea el siguiente proceso a iniciar. Las barras DEBEN ser compactas (una línea por proceso).

#### Scenario: KanbanCard muestra barras de procesos en ejecución
- **WHEN** una tarjeta tiene Corte 70/100 ⚠️ y Ensamble 35/100 ▶
- **THEN** la card muestra dos barras: una con 70% y ⚠️, otra con 35% y ▶

#### Scenario: KanbanCard por hacer muestra barras vacías
- **WHEN** una tarjeta está en `por_hacer`
- **THEN** la card muestra todos los procesos con barra en 0%
