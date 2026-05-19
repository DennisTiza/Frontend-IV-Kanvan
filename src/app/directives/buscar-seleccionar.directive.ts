import { Directive, ElementRef, HostListener, Input, Output, EventEmitter, OnInit, OnDestroy, Renderer2 } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appBuscarSeleccionar]',
})
export class BuscarSeleccionarDirective implements OnInit, OnDestroy {
  @Input() opciones: string[] = [];
  @Input() placeholder: string = 'Escribe o selecciona...';
  @Input() permitirPersonalizado: boolean = true;
  @Output() opcionSeleccionada = new EventEmitter<string>();

  private el: HTMLInputElement;
  private container: HTMLElement | null = null;
  private dropdown: HTMLElement | null = null;
  private opcionesFiltradas: string[] = [];
  private selectedIndex: number = -1;
  private showDropdown: boolean = false;
  private modelValue: string = '';
  private isSelectingWithMouse: boolean = false;
  private windowScrollListener: (() => void) | null = null;
  private windowResizeListener: (() => void) | null = null;

  constructor(
    private elementRef: ElementRef,
    private control: NgControl,
    private renderer: Renderer2
  ) {
    this.el = this.elementRef.nativeElement;
  }

  ngOnInit() {
    this.opcionesFiltradas = [...this.opciones];
    this.setupInput();
    this.crearEstructura();
    this.setupValueChanges();
  }

  ngOnDestroy() {
    if (this.dropdown && this.dropdown.parentElement) {
      this.dropdown.parentElement.removeChild(this.dropdown);
    }

    if (this.windowScrollListener) {
      this.windowScrollListener();
      this.windowScrollListener = null;
    }
    if (this.windowResizeListener) {
      this.windowResizeListener();
      this.windowResizeListener = null;
    }
  }

  private setupInput(): void {
    this.renderer.setAttribute(this.el, 'autocomplete', 'off');
    this.renderer.setAttribute(this.el, 'placeholder', this.placeholder);
    this.renderer.addClass(this.el, 'validate');
  }

  private crearEstructura(): void {
    // Obtener o crear el contenedor
    const parent = this.el.parentElement;
    
    if (parent && !parent.classList.contains('search-select-container')) {
      // Crear contenedor wrapper
      this.container = this.renderer.createElement('div');
      this.renderer.addClass(this.container, 'search-select-container');
      
      // Insertar el contenedor antes del input
      this.renderer.insertBefore(parent, this.container, this.el);
      
      // Mover el input dentro del contenedor
      this.renderer.appendChild(this.container, this.el);
      
      // Mover el label también si existe (puede estar antes o después del input)
      let label = this.el.nextElementSibling as Element | null;
      if (!label) {
        label = this.el.previousElementSibling as Element | null;
      }
      if (label && label.tagName === 'LABEL') {
        this.renderer.appendChild(this.container, label);
      }
    } else {
      this.container = parent;
    }
    
    // Crear dropdown y anexarlo al body para evitar recorte por overflow
    this.dropdown = this.renderer.createElement('div');
    this.renderer.addClass(this.dropdown, 'search-select-dropdown');
    this.renderer.setStyle(this.dropdown, 'display', 'none');
    this.renderer.setStyle(this.dropdown, 'position', 'absolute');
    this.renderer.setStyle(this.dropdown, 'z-index', '10000');
    this.renderer.setStyle(this.dropdown, 'background', '#fff');
    this.renderer.setStyle(this.dropdown, 'box-shadow', '0 2px 8px rgba(0,0,0,0.15)');
    this.renderer.setStyle(this.dropdown, 'border', '1px solid rgba(0,0,0,0.12)');
    this.renderer.setStyle(this.dropdown, 'max-height', '240px');
    this.renderer.setStyle(this.dropdown, 'overflow', 'auto');

    // append to body so it isn't clipped by parent containers
    this.renderer.appendChild(document.body, this.dropdown);

    // Listeners to reposition on scroll/resize
    this.windowScrollListener = this.renderer.listen('window', 'scroll', () => {
      if (this.showDropdown) this.updateDropdownPosition();
    });
    this.windowResizeListener = this.renderer.listen('window', 'resize', () => {
      if (this.showDropdown) this.updateDropdownPosition();
    });
  }

  private setupValueChanges(): void {
    this.control.control?.valueChanges.subscribe(value => {
      if (value && value !== this.modelValue) {
        this.modelValue = value;
        this.el.value = value;
      }
    });

    const initialValue = this.control.control?.value;
    if (initialValue) {
      this.modelValue = initialValue;
      this.el.value = initialValue;
    }
  }

  private actualizarDropdown(): void {
    if (!this.dropdown) return;

    // Limpiar dropdown
    while (this.dropdown.firstChild) {
      this.renderer.removeChild(this.dropdown, this.dropdown.firstChild);
    }

    if (this.opcionesFiltradas.length === 0) {
      const noResults = this.renderer.createElement('div');
      this.renderer.addClass(noResults, 'no-results');
      const text = this.renderer.createText('No se encontraron resultados');
      this.renderer.appendChild(noResults, text);
      this.renderer.appendChild(this.dropdown, noResults);
    } else {
      this.opcionesFiltradas.forEach((opcion, index) => {
        const optionEl = this.renderer.createElement('div');
        this.renderer.addClass(optionEl, 'search-select-option');
        
        if (index === this.selectedIndex) {
          this.renderer.addClass(optionEl, 'keyboard-selected');
        }

        const optionName = this.renderer.createElement('span');
        this.renderer.addClass(optionName, 'option-name');
        const text = this.renderer.createText(opcion);
        this.renderer.appendChild(optionName, text);
        this.renderer.appendChild(optionEl, optionName);

        // Selección con mouse/puntero. Usamos pointerdown (mejor cobertura) y
        // fallback a click si pointer events no están disponibles.
        this.renderer.listen(optionEl, 'pointerdown', (e: Event) => {
          this.isSelectingWithMouse = true;
          this.seleccionarOpcion(opcion);
          setTimeout(() => { this.isSelectingWithMouse = false; }, 300);
        });

        this.renderer.listen(optionEl, 'click', (e: Event) => {
          // Si pointerdown ya manejó la selección, ignoramos el click
          if (this.isSelectingWithMouse) return;
          this.seleccionarOpcion(opcion);
        });

        // Hover en la opción
        this.renderer.listen(optionEl, 'mouseenter', () => {
          this.selectedIndex = index;
          this.actualizarDropdown();
        });

        this.renderer.appendChild(this.dropdown!, optionEl);
      });
    }

    this.renderer.setStyle(this.dropdown, 'display', this.showDropdown ? 'block' : 'none');
    if (this.showDropdown) {
      this.updateDropdownPosition();
    }
  }

  private updateDropdownPosition(): void {
    if (!this.dropdown) return;

    const rect = this.el.getBoundingClientRect();
    const scrollX = window.scrollX || window.pageXOffset || 0;
    const scrollY = window.scrollY || window.pageYOffset || 0;

    const optionHeight = 40; // altura aproximada por opción
    const estimatedHeight = Math.min(this.opcionesFiltradas.length * optionHeight, 240);

    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    let top: number;
    if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
      // abrir hacia arriba
      top = rect.top + scrollY - estimatedHeight;
      this.renderer.setStyle(this.dropdown, 'max-height', `${Math.min(spaceAbove, 240)}px`);
    } else {
      // abrir hacia abajo
      top = rect.bottom + scrollY;
      this.renderer.setStyle(this.dropdown, 'max-height', `${Math.min(spaceBelow, 240)}px`);
    }

    const left = rect.left + scrollX;
    const width = rect.width;

    this.renderer.setStyle(this.dropdown, 'top', `${top}px`);
    this.renderer.setStyle(this.dropdown, 'left', `${left}px`);
    this.renderer.setStyle(this.dropdown, 'width', `${width}px`);
  }

  private filtrarOpciones(query: string): void {
    const queryLower = query.toLowerCase().trim();
    
    if (!queryLower) {
      this.opcionesFiltradas = [...this.opciones];
    } else {
      this.opcionesFiltradas = this.opciones.filter(opcion =>
        opcion.toLowerCase().includes(queryLower)
      );

      if (this.permitirPersonalizado) {
        const existeCoincidencia = this.opcionesFiltradas.some(
          opcion => opcion.toLowerCase() === queryLower
        );
        
        if (!existeCoincidencia && query.trim()) {
          this.opcionesFiltradas.unshift(query.trim());
        }
      }
    }
  }

  private seleccionarOpcion(opcion: string): void {
    this.modelValue = opcion;
    this.el.value = opcion;
    this.control.control?.setValue(opcion);
    this.showDropdown = false;
    this.selectedIndex = -1;
    this.actualizarDropdown();
    this.opcionSeleccionada.emit(opcion);
    
    // Activar label de Materialize
    const label = this.container?.querySelector('label');
    if (label) {
      this.renderer.addClass(label, 'active');
    }
  }

  private scrollToSelected(): void {
    if (this.selectedIndex >= 0 && this.dropdown) {
      setTimeout(() => {
        const options = this.dropdown!.querySelectorAll('.search-select-option');
        const selectedOption = options[this.selectedIndex];
        
        if (selectedOption && this.dropdown) {
          const dropdownRect = this.dropdown.getBoundingClientRect();
          const optionRect = selectedOption.getBoundingClientRect();
          
          if (optionRect.bottom > dropdownRect.bottom) {
            this.dropdown.scrollTop += optionRect.bottom - dropdownRect.bottom;
          } else if (optionRect.top < dropdownRect.top) {
            this.dropdown.scrollTop -= dropdownRect.top - optionRect.top;
          }
        }
      }, 0);
    }
  }

  @HostListener('input', ['$event'])
  onInput(event: Event): void {
    const value = this.el.value;
    this.modelValue = value;
    this.filtrarOpciones(value);
    this.showDropdown = true;
    this.selectedIndex = -1;
    this.actualizarDropdown();
    
    // Solo actualizar el FormControl si permitirPersonalizado o si hay coincidencias
    if (this.permitirPersonalizado) {
      this.control.control?.setValue(value);
    } else {
      // No actualizar el FormControl mientras se está buscando
      // Solo se actualizará cuando se seleccione una opción válida
      if (this.opciones.includes(value)) {
        this.control.control?.setValue(value);
      }
    }
    
    // Activar label
    const label = this.container?.querySelector('label');
    if (label && value) {
      this.renderer.addClass(label, 'active');
    }
  }

  @HostListener('focus')
  onFocus(): void {
    this.showDropdown = true;
    this.opcionesFiltradas = [...this.opciones];
    this.selectedIndex = -1;
    this.actualizarDropdown();
  }

  @HostListener('blur')
  onBlur(): void {
    setTimeout(() => {
      // Si estamos en proceso de seleccionar con mouse, no procesar el blur
      if (this.isSelectingWithMouse) {
        this.isSelectingWithMouse = false;
        return;
      }

      this.showDropdown = false;
      this.actualizarDropdown();
      
      if (!this.permitirPersonalizado) {
        const esValido = this.opciones.some(
          opcion => opcion.toLowerCase() === this.el.value.toLowerCase().trim()
        );
        
        if (!esValido) {
          this.el.value = '';
          this.control.control?.setValue('');
        }
      }
    }, 200);
  }

  @HostListener('keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (!this.showDropdown && event.key !== 'ArrowDown' && event.key !== 'ArrowUp') {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault();
        if (!this.showDropdown) {
          this.showDropdown = true;
          this.actualizarDropdown();
        }
        this.selectedIndex = Math.min(
          this.selectedIndex + 1,
          this.opcionesFiltradas.length - 1
        );
        this.actualizarDropdown();
        this.scrollToSelected();
        break;

      case 'ArrowUp':
        event.preventDefault();
        if (!this.showDropdown) {
          this.showDropdown = true;
          this.actualizarDropdown();
        }
        this.selectedIndex = Math.max(this.selectedIndex - 1, 0);
        this.actualizarDropdown();
        this.scrollToSelected();
        break;

      case 'Enter':
        // Solo prevenir si hay una opción seleccionada
        if (this.showDropdown && this.selectedIndex >= 0 && this.selectedIndex < this.opcionesFiltradas.length) {
          event.preventDefault();
          event.stopPropagation();
          this.seleccionarOpcion(this.opcionesFiltradas[this.selectedIndex]);
        }
        // Si no hay opción seleccionada, NO prevenimos el evento
        // para que el Enter se propague normalmente y active el (keydown.enter)
        break;

      case 'Escape':
        event.preventDefault();
        this.showDropdown = false;
        this.selectedIndex = -1;
        this.actualizarDropdown();
        break;

      case 'Tab':
        this.showDropdown = false;
        this.selectedIndex = -1;
        this.actualizarDropdown();
        break;
    }
  }
}