export class CrearElementoHTML {
  constructor(tagName, id, classList, style) {
    this.elemento = document.createElement(tagName);
    if (id) this.elemento.id = id;
    if (classList) this.elemento.classList = classList;
    if (style) this.elemento.style = style;
  }

  returnElement() {
    return this.elemento;
  }
}

export class CrearElementoHTML_Imagen extends CrearElementoHTML {
  constructor(src, alt, id, classList, style) {
    super('IMG', id, classList, style);
    if (!src) console.error('Debe proporcionar el atributo src');
    else this.elemento.src = src;
    if (alt) this.elemento.alt = alt;
  }
}

export class CrearElementoHTML_A extends CrearElementoHTML {
  constructor(href, target, id, classList, style) {
    super('A', id, classList, style);
    if (!href) console.error('Debe proporcionar el atriburo href');
    else {
      this.elemento.href = href;
      if (target) this.elemento.target = target /*'_blank'*/;
    }
  }
}

export class CrearElementoHTML_Text extends CrearElementoHTML {
  constructor(tagName, text, id, classList, style) {
    super(tagName, id, classList, style);
    if (!text) this.elemento.innerHTML = '';
    else this.elemento.innerHTML = text;
  }
}

export class CrearElementoHTML_Select extends CrearElementoHTML {
  constructor(OptionList, name, id, classList, style) {
    super('SELECT', id, classList, style);
    this.elemento.name = name;
    let PrimeraOpcion = new CrearElementoHTML('Option', null, null, 'display: none').returnElement();
    PrimeraOpcion.value = 'primeraOpcion';
    this.elemento.appendChild(PrimeraOpcion);
    OptionList.forEach((optionValue) => {
      let option = new CrearElementoHTML('OPTION').returnElement();
      option.value = optionValue;
      option.innerHTML = optionValue;
      this.elemento.appendChild(option);
    });
  }
}
