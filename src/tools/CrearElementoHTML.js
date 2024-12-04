export class CrearElementoHTML {
  constructor(tagName, id, classList, style, innerHTML, title) {
    this.elemento = document.createElement(tagName);
    if (id) this.elemento.id = id;
    if (classList) this.elemento.classList = classList;
    if (style) this.elemento.style = style;
    if (innerHTML) this.elemento.innerHTML = innerHTML;
    if (title) this.elemento.title = title;
  }

  getElement() {
    return this.elemento;
  }
}

export class CrearElementoHTML_Imagen extends CrearElementoHTML {
  constructor(src, alt, id, classList, style, innerHTML, title) {
    super('IMG', id, classList, style, innerHTML, title);
    if (!src) console.error('Debe proporcionar el atributo src');
    else this.elemento.src = src;
    if (alt) this.elemento.alt = alt;
  }
}

export class CrearElementoHTML_A extends CrearElementoHTML {
  constructor(href, target, id, classList, style, innerHTML, title) {
    super('A', id, classList, style, innerHTML, title);
    if (!href) console.error('Debe proporcionar el atriburo href');
    else {
      this.elemento.href = href;
      if (target) this.elemento.target = target /*'_blank'*/;
    }
  }
}

export class CrearElementoHTML_Text extends CrearElementoHTML {
  constructor(tagName, text, id, classList, style, innerHTML, title) {
    super(tagName, id, classList, style, innerHTML, title);
    if (!text) this.elemento.innerHTML = '';
    else this.elemento.innerHTML = text;
  }
}

export class CrearElementoHTML_Option extends CrearElementoHTML {
  constructor(value, id, classList, style, innerHTML, title) {
    super('OPTION', id, classList, style, innerHTML, title);
    this.elemento.value = value;
  }
}

export class CrearElementoHTML_Select extends CrearElementoHTML {
  constructor(OptionList, name, id, classList, style, innerHTML, title) {
    super('SELECT', id, classList, style, innerHTML, title);
    this.elemento.name = name;
    let PrimeraOpcion = new CrearElementoHTML('Option', null, null, 'display: none').getElement();
    PrimeraOpcion.value = 'primeraOpcion';
    this.elemento.appendChild(PrimeraOpcion);
    OptionList.forEach((optionValue) => {
      let option = new CrearElementoHTML('OPTION').getElement();
      option.value = optionValue;
      option.innerHTML = optionValue;
      this.elemento.appendChild(option);
    });
  }
}

export class CrearElementoHTML_Input extends CrearElementoHTML {
  constructor(type, id, classList, style, innerHTML, title) {
    super('INPUT', id, classList, style, innerHTML, title);
    this.elemento.type = type;
  }
}

export class CrearElementoHTML_Button extends CrearElementoHTML {
  constructor(disabled, id, classList, style, innerHTML, title) {
    super('BUTTON', id, classList, style, innerHTML, title);
    if (disabled) this.elemento.disabled = true;
  }
}
