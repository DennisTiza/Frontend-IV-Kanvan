## ADDED Requirements

### Requirement: Redirección post-login al primer menú disponible

Después de que el usuario inicia sesión exitosamente y se almacenan sus datos de sesión, el sistema DEBE redirigir al usuario a la ruta del primer ítem del menú construido según sus permisos.

#### Scenario: Usuario con menú no vacío redirige al primer ítem
- **WHEN** el usuario inicia sesión exitosamente
- **AND** el sistema construye su menú con 1 o más ítems
- **THEN** el sistema navega a la ruta del primer ítem del menú

#### Scenario: Usuario sin ítems de menú redirige a inicio
- **WHEN** el usuario inicia sesión exitosamente
- **AND** el sistema construye su menú con 0 ítems
- **THEN** el sistema redirige a la página de inicio (`/inicio`)

### Requirement: Wildcard route redirige según menú del usuario

Cuando el usuario navega a una ruta que no coincide con ninguna ruta definida, el sistema DEBE redirigir al primer ítem del menú del usuario en lugar de una ruta fija.

#### Scenario: Usuario autenticado navega a ruta inexistente
- **WHEN** el usuario tiene una sesión activa
- **AND** el usuario navega a una ruta no definida
- **THEN** el sistema redirige al primer ítem del menú del usuario

#### Scenario: Usuario no autenticado navega a ruta inexistente
- **WHEN** el usuario no tiene sesión activa
- **AND** el usuario navega a una ruta no definida
- **THEN** el sistema redirige a la página de inicio (`/inicio`)

### Requirement: Guard de sesión inactiva redirige al menú del usuario

Cuando un usuario ya autenticado intenta acceder a la página de inicio (`/inicio`), el sistema DEBE redirigirlo al primer ítem de su menú.

#### Scenario: Usuario autenticado intenta acceder a /inicio
- **WHEN** el usuario tiene sesión activa
- **AND** intenta navegar a `/inicio`
- **THEN** el sistema redirige al primer ítem del menú del usuario

#### Scenario: Usuario autenticado sin menú intenta acceder a /inicio
- **WHEN** el usuario tiene sesión activa
- **AND** su menú está vacío
- **AND** intenta navegar a `/inicio`
- **THEN** el sistema permite el acceso a `/inicio`
