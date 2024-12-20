import '../styles/style.scss';
import {
  CrearElementoHTML,
  CrearElementoHTML_Text,
  CrearElementoHTML_Select,
  CrearElementoHTML_Option,
  CrearElementoHTML_Input,
  CrearElementoHTML_Imagen,
  CrearElementoHTML_Button,
} from '../tools/CrearElementoHTML.js';
import {API} from '../tools/API.js';
import AirDatepicker from 'air-datepicker';
import {datepickerOptions} from '../tools/datepicker-options.js';
import {GetHSL} from '../tools/Color.js';
import {DialogoEditar_} from './dialogo_edtitar.js';
import 'air-datepicker/air-datepicker.css';
import '../img/unlink-svgrepo-com.svg';
import '../img/unlink-svgrepo-com_dark.svg';
import '../img/lock-closed-svgrepo-com.svg';
import '../img/delete-1-svgrepo-com.svg';
import '../img/sprite.svg';

let Rutas = [];
const Api = new API();

class Ruta_ {
  id;
  fecha;
  nombre;
  color;
  JSON_Preregistros;
  Preregistros_ = [];
  plantillas;
  InputTiempoTotal_;
  InputCheckAsegurar;
  tiempoTotalMinutos = 0;
  #Ruta = new CrearElementoHTML('DIV', `Ruta_${Rutas.length + 1}`, 'ruta').getElement();
  contenedor = document.getElementById('vigilancia_judicial-Rutas');
  constructor(id, fecha, nombre, color, preregistros, plantillas) {
    this.id = id;
    this.fecha = fecha;
    this.nombre = nombre;
    this.color = color;
    this.JSON_Preregistros = preregistros;
    this.plantillas = plantillas;
    this.InputTiempoTotal_ = new InputTiempo_(this, 'inputTiempoTotal', true);
    this.InputCheckAsegurar = new CrearElementoHTML_Input('checkbox', null, null, null, null, 'Asegurar tiempo').getElement();
    this.contenedor.appendChild(this.#Ruta);
    this.construirRuta();
  }

  construirRuta() {
    this.InputTiempoTotal_.Input.readOnly = true;
    const ColorHSL = GetHSL(this.color);
    const background_color = `hsl(${ColorHSL[0]}, ${ColorHSL[1]}%, ${ColorHSL[2]}%);`;
    this.#Ruta.style = `border: solid 1px ${background_color};`;
    const HeaderRuta = new CrearElementoHTML('DIV', null, 'headerRuta', `background-color:  ${background_color};`).getElement();
    const FooterRuta = new CrearElementoHTML('DIV', null, 'footerRuta', `background-color:  ${background_color};`).getElement();
    const ContainerPregistros = new CrearElementoHTML('DIV', null, 'containerPreregistros').getElement();
    this.#Ruta.appendChild(HeaderRuta);
    this.#Ruta.appendChild(ContainerPregistros);
    this.#Ruta.appendChild(FooterRuta);

    HeaderRuta.appendChild(new CrearElementoHTML_Text('P', this.nombre, null, 'ruta_titulo').getElement());
    const sideHeaderRuta = new CrearElementoHTML('DIV', null, 'sideHeaderRuta').getElement();
    sideHeaderRuta.appendChild(this.InputTiempoTotal_.Input);
    sideHeaderRuta.appendChild(new CrearElementoHTML_Imagen('../img/unlink-svgrepo-com.svg', 'KIUX-Icon-blocked').getElement());
    sideHeaderRuta.appendChild(this.InputCheckAsegurar);
    HeaderRuta.appendChild(sideHeaderRuta);
    const BtnTerminar = new CrearElementoHTML_Button(false, 'BtnTerminarRuta', 'BtnTerminarRuta', null, 'Terminar').getElement();
    BtnTerminar.addEventListener('click', () => {
      this.terminar();
    });
    FooterRuta.appendChild(BtnTerminar);

    this.construirPreregistros(ContainerPregistros);
    this.InputCheckAsegurar.addEventListener('change', (e) => {
      if (e.target.checked) {
        this.ActivarTiempoFijo();
      } else {
        this.DesactivarTiempoFijo();
      }
    });
  }
  construirPreregistros(contenedor) {
    this.JSON_Preregistros.forEach((preregistro) => {
      const Preregistro = new Preregistro_(preregistro.id, preregistro.titulo, preregistro.color, preregistro.idioma, preregistro.proyecto, preregistro.estado, this);
      contenedor.appendChild(Preregistro.GetPreregistro());
      this.Preregistros_.push(Preregistro);
    });
  }
  terminar() {
    console.log(this.InputCheckAsegurar);
  }

  DistribuirTiempo() {
    let NumeroDeActivos = this.Contar_Registros_Activos_Sin_Proteger();

    let TiempoGeneral_RestandoFijos = this.tiempoTotalMinutos;
    let valorDistribuido = null;
    let Resto = 0;
    let Asegurados = 0;

    this.Preregistros_.forEach((element) => {
      if (element.Asegurado && element.Activo) {
        TiempoGeneral_RestandoFijos -= element.TiempoAsignado;
        Asegurados++;
      }
    });

    if (NumeroDeActivos) {
      valorDistribuido = parseInt(TiempoGeneral_RestandoFijos / NumeroDeActivos);
      Resto = TiempoGeneral_RestandoFijos % NumeroDeActivos;
    }

    if (valorDistribuido < 1 && Asegurados) {
      window.alert('No es posible distribuir el tiempo');
      return false;
    }

    this.Preregistros_.forEach((element) => {
      let Valor = valorDistribuido;
      if (element.Activo && !element.Asegurado) {
        if (Resto > 0) {
          Valor += 1;
          Resto--;
        }
        element.IngresarValorTiempo(Valor);
      }
    });

    return true;
  }

  SumarTiempos() {
    this.tiempoTotalMinutos = 0;
    this.Preregistros_.forEach((preregistro) => {
      if (preregistro.Activo) {
        this.tiempoTotalMinutos += preregistro.TiempoAsignado;
      }
    });
    this.InputTiempoTotal_.Input.value = Minutos_a_Horas(this.tiempoTotalMinutos);
    return true;
  }

  Distribuir_Sumar_Tiempo() {
    if (this.InputCheckAsegurar.checked) {
      return this.DistribuirTiempo();
    } else {
      return this.SumarTiempos();
    }
  }

  Contar_Registros_Activos_Sin_Proteger() {
    let NumeroDeActivos = 0;
    this.Preregistros_.forEach((element) => {
      if (element.Activo && !element.Asegurado) NumeroDeActivos++;
    });
    return NumeroDeActivos;
  }

  ActivarTiempoFijo() {
    this.InputTiempoTotal_.Input.readOnly = false;
  }
  DesactivarTiempoFijo() {
    this.InputTiempoTotal_.Input.readOnly = true;
    this.Preregistros_.forEach((preregistro) => {
      if (preregistro.Asegurado) {
        preregistro.InputTiempoPreregistro_.Input.classList.remove('asegurado');
        preregistro.Asegurado = false;
        preregistro.botonDesasegurar_Asegurar.disabled = true;
        preregistro.InputTiempoPreregistro_.Input.disabled = false;
      }
    });
  }
}

class Preregistro_ {
  #Preregistro = new CrearElementoHTML('DIV', null, 'preregistro').getElement();
  Ruta_;
  Activo = false;
  Asegurado = false;
  TiempoAsignado = 0;
  id;
  titulo;
  color;
  idioma;
  proyecto;
  estado;
  descripcionPreregistro;
  selectPlantillas;
  InputTiempoPreregistro_;
  botonDesasegurar_Asegurar;
  botonDeshabilitar;
  constructor(id, titulo, color, idioma, proyecto, estado, ruta) {
    this.id = id;
    this.titulo = titulo;
    this.color = color;
    this.idioma = idioma;
    this.proyecto = proyecto;
    this.estado = estado;
    this.Ruta_ = ruta;
    this.construirPreregistro();
  }

  construirPreregistro() {
    const ColorHSL = GetHSL(this.color);
    const background_color = `background-color: hsl(${ColorHSL[0]}, ${ColorHSL[1]}%, ${ColorHSL[2]}%);`;
    const background_color_2 = `background-color: hsl(${ColorHSL[0]}, ${ColorHSL[1]}%, 95%);`;
    const headerPreregistro = new CrearElementoHTML('Div', null, 'headerPreregistro', background_color).getElement();
    const contentPreregistro = new CrearElementoHTML('DIV', null, 'contentPreregistro', background_color_2).getElement();
    const botonesPreregistro = new CrearElementoHTML('DIV', null, 'botonesPreregistro').getElement();

    headerPreregistro.appendChild(new CrearElementoHTML('DIV', null, 'headerPreregistro_idioma', null, this.idioma).getElement());
    headerPreregistro.appendChild(new CrearElementoHTML('DIV', null, 'headerPreregistro_titulo', null, this.titulo).getElement());

    this.descripcionPreregistro = new CrearElementoHTML_Text('P', '', null, 'descripcionPreregistro').getElement();
    this.selectPlantillas = new CrearElementoHTML_Select(this.Ruta_.plantillas, 'plantillas', null, 'selectPlantillas').getElement();
    this.InputTiempoPreregistro_ = new InputTiempo_(this, 'inputTiempoPreregistro');
    this.botonDesasegurar_Asegurar = new CrearElementoHTML_Button(true, 'botonDesasegurar_AsegurarTiempo', 'botonDesasegurar_AsegurarTiempo').getElement();
    this.botonDeshabilitar = new CrearElementoHTML_Button(true, 'BotonDeshabilitar', 'botonDeshabilitar').getElement();
    this.botonDesasegurar_Asegurar.appendChild(new CrearElementoHTML_Imagen('../img/unlink-svgrepo-com_dark.svg').getElement());
    this.botonDeshabilitar.appendChild(new CrearElementoHTML_Imagen('../img/delete-1-svgrepo-com.svg').getElement());

    botonesPreregistro.appendChild(this.InputTiempoPreregistro_.Input);
    botonesPreregistro.appendChild(this.botonDesasegurar_Asegurar);
    botonesPreregistro.appendChild(this.botonDeshabilitar);

    const Descripcion_Candado = new CrearElementoHTML('DIV', null, 'descripcion_candado').getElement();
    Descripcion_Candado.appendChild(new CrearElementoHTML_Imagen('../img/lock-closed-svgrepo-com.svg', 'candado', null, 'img_candado').getElement());
    Descripcion_Candado.appendChild(this.descripcionPreregistro);

    const Botones_Plantillas = new CrearElementoHTML('DIV', null, 'botones_plantillas').getElement();
    Botones_Plantillas.appendChild(this.selectPlantillas);
    Botones_Plantillas.appendChild(botonesPreregistro);

    contentPreregistro.appendChild(Descripcion_Candado);
    contentPreregistro.appendChild(Botones_Plantillas);

    this.#Preregistro.appendChild(headerPreregistro);
    this.#Preregistro.appendChild(contentPreregistro);

    this.InputTiempoPreregistro_.Input.disabled = true;

    this.descripcionPreregistro.textContent = '';
    this.descripcionPreregistro.addEventListener('click', () => {
      new DialogoEditar_(this);
    });

    const observerDescripcion = new MutationObserver((mutationsList) => {
      mutationsList.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.target.innerHTML) {
          this.cambioEnDescripcion();
        }
      });
    });

    observerDescripcion.observe(this.descripcionPreregistro, {childList: true, subtree: false, characterData: true, characterDataOldValue: true});

    this.botonDesasegurar_Asegurar.addEventListener('click', () => {
      this.Desasegurar_AsegurarTiempo();
    });

    this.botonDeshabilitar.addEventListener('click', () => {
      this.DesactivarPreregistro();
    });

    this.selectPlantillas.addEventListener('change', (e) => {
      this.seleccionarPlantilla(e);
    });
  }

  GetPreregistro() {
    return this.#Preregistro;
  }

  Desasegurar_AsegurarTiempo() {
    if (this.Ruta_.InputCheckAsegurar.checked) {
      if (!this.InputTiempoPreregistro_.Input.classList.contains('asegurado') && !this.Asegurado) {
        this.InputTiempoPreregistro_.Input.classList.add('asegurado');
        this.Asegurado = true;
        this.botonDesasegurar_Asegurar.disabled = false;
        this.InputTiempoPreregistro_.Input.disabled = true;
      } else {
        this.InputTiempoPreregistro_.Input.classList.remove('asegurado');
        this.Asegurado = false;
        this.botonDesasegurar_Asegurar.disabled = true;
        this.InputTiempoPreregistro_.Input.disabled = false;
      }
      this.Ruta_.Distribuir_Sumar_Tiempo();
    }
  }

  DesactivarPreregistro() {
    this.Activo = false;
    this.botonDesasegurar_Asegurar.disabled = true;
    this.botonDeshabilitar.disabled = true;
    this.InputTiempoPreregistro_.Input.disabled = true;
    this.InputTiempoPreregistro_.ReiniciarValores();
    this.descripcionPreregistro.classList.add('disabled');
    this.descripcionPreregistro.textContent = '';
    this.selectPlantillas.value = 'primeraOpcion';
    this.TiempoAsignado = 0;
    this.Ruta_.Distribuir_Sumar_Tiempo();
  }

  ActivarPreregistro() {
    this.Activo = true;
    this.botonDeshabilitar.disabled = false;
    this.InputTiempoPreregistro_.Input.disabled = false;
    this.descripcionPreregistro.classList.remove('disabled');
    this.Ruta_.Distribuir_Sumar_Tiempo();
  }

  seleccionarPlantilla(e) {
    this.descripcionPreregistro.textContent = e.target.options[e.target.selectedIndex].text;
  }

  cambioEnDescripcion() {
    if (!this.Activo) {
      this.ActivarPreregistro();
    }
  }

  IngresarValorTiempo(tiempoMinutos) {
    this.TiempoAsignado = tiempoMinutos;
    this.InputTiempoPreregistro_.Input.value = Minutos_a_Horas(tiempoMinutos);
  }
}

export class InputTiempo_ {
  Input;
  ValorAnterior = '';
  ValorAnteriorEscritura = '';
  Preregistro_;
  Ruta_;
  VentanaEditar_;
  tiempoRegistradoMinutos = 0;
  AnteriorTiempoAsignado = 0;
  constructor(Contenedor_, classList, InputCabecera, InputVentanaEditar) {
    if (InputVentanaEditar) this.VentanaEditar_ = Contenedor_;
    else if (InputCabecera) this.Ruta_ = Contenedor_;
    else this.Preregistro_ = Contenedor_;
    this.Input = new CrearElementoHTML_Input('text', null, classList).getElement();

    this.Input.addEventListener('input', (e) => {
      this.verificarValor(e);
    });
    this.Input.addEventListener('keypress', (e) => {
      if (e.key == 'Enter') {
        if (InputVentanaEditar) {
          this.VentanaEditar_.TiempoAsignado = Horas_a_Minutos(this.Input.value);
          this.Input.value = Minutos_a_Horas(this.VentanaEditar_.TiempoAsignado);
        } else {
          if (InputCabecera) {
            this.Ruta_.tiempoTotalMinutos = Horas_a_Minutos(this.Input.value);
          } else {
            this.AnteriorTiempoAsignado = this.Preregistro_.TiempoAsignado;
            this.Preregistro_.TiempoAsignado = Horas_a_Minutos(this.Input.value);
            this.Preregistro_.Desasegurar_AsegurarTiempo();
          }
          if (this.Preregistro_ ? this.Preregistro_.Ruta_.Distribuir_Sumar_Tiempo() : this.Ruta_.Distribuir_Sumar_Tiempo()) {
            if (!InputCabecera) this.AnteriorTiempoAsignado = this.Preregistro_.TiempoAsignado;
            this.Input.value = Minutos_a_Horas(Horas_a_Minutos(this.Input.value));
            this.ValorAnterior = this.Input.value;
          } else {
            if (!InputCabecera) {
              this.Preregistro_.TiempoAsignado = this.AnteriorTiempoAsignado;
              this.Input.value = Minutos_a_Horas(this.Preregistro_.TiempoAsignado);
              this.Preregistro_.Desasegurar_AsegurarTiempo();
            } else {
              this.Input.value = this.ValorAnterior;
            }
          }
        }
      }
    });
  }

  verificarValor(e) {
    const regex = /^(?:[0-9]|0[0-9]|1[0-9]|2[0-3])?(?::(?:[0-9]|[0-5][0-9])?)?$|^$/;
    if (regex.test(e.target.value)) {
      this.ValorAnteriorEscritura = e.target.value;
    } else {
      e.target.value = this.ValorAnteriorEscritura;
    }
  }

  getInput() {
    return this.Input;
  }

  ReiniciarValores() {
    this.ValorAnterior = '';
    this.ValorAnteriorEscritura = '';
    this.tiempoRegistradoMinutos = 0;
    this.AnteriorTiempoAsignado = 0;
    this.Input.value = '';
    this.Input.classList.remove('asegurado');
  }
}

const Calendario = new AirDatepicker('#fechaParaRuta', datepickerOptions);

Api.GetData(`../assets/rutas.json`).then((data) => {
  add_RutasSelect(data.rutas_vigilancia);
});

function add_RutasSelect(rutas) {
  const select = document.getElementById('selectRuta');
  //select.appendChild(new CrearElementoHTML_Option('vacia', null, null, 'display: none', '').getElement()); // [x] <-- Descomentar esta linea
  rutas.forEach((ruta) => {
    let option = new CrearElementoHTML_Option(ruta.id_ruta, null, null, null, ruta.nombre_ruta).getElement();
    select.appendChild(option);
  });
}

document.getElementById('ButtonAgregarRegistros').addEventListener('click', () => {
  AgregarRuta();
});

//[x] Retirar estas lineas ~~>
const FechaParaRuta = document.getElementById('fechaParaRuta');
FechaParaRuta.setAttribute('data-value', '2024-12-04');
FechaParaRuta.value = '2024-12-04';
const SelectRuta = document.getElementById('selectRuta');
SelectRuta.value = 1001;
//[x] <~~

function AgregarRuta() {
  const SelectRuta = document.getElementById('selectRuta');
  const FechaParaRuta = document.getElementById('fechaParaRuta');
  if (SelectRuta.value != 'vacia' && FechaParaRuta.getAttribute('data-value') && FechaParaRuta.getAttribute('data-value') != 'undefined') {
    ConstruirRuta(SelectRuta.value, FechaParaRuta.getAttribute('data-value'));
    Calendario.clear();
    SelectRuta.value = 'vacia';
  } else if (SelectRuta.value == 'vacia' && (!FechaParaRuta.getAttribute('data-value') || FechaParaRuta.getAttribute('data-value') == 'undefined')) {
    window.alert('Completa los campos');
  } else if (SelectRuta.value == 'vacia') {
    window.alert('Seleccione una ruta');
  } else if (!FechaParaRuta.getAttribute('data-value') || FechaParaRuta.getAttribute('data-value') == 'undefined') {
    window.alert('Seleccione una fecha');
  }
}

function ConstruirRuta(id_ruta, fecha) {
  let URL = `../assets/ruta_${id_ruta}.json`;
  if (!Rutas.find((ruta) => ruta.id == id_ruta && ruta.fecha == fecha)) {
    Api.GetData(URL)
      .then((data) => {
        const Ruta = new Ruta_(data.id, fecha, data.nombre, data.color, data.preregistros, data.plantillas);
        Rutas.push(Ruta);
      })
      .catch((error) => {
        console.log('Ha ocurrido un error en el llamado de la ruta', error);
      });
  } else {
    alert('La ruta especificado ya existe con la fecha indicada');
  }
}

function Horas_a_Minutos(value) {
  let Horas_Minutos = value.split(':');
  return parseInt(60 * (Horas_Minutos[0] ? Horas_Minutos[0] : 0)) + parseInt(Horas_Minutos[1] ? Horas_Minutos[1] : 0);
}

function Minutos_a_Horas(value) {
  let hora = parseInt(value / 60);
  let minutos = value % 60;
  function formatear(valor) {
    return `${valor < 10 ? '0' + valor : valor}`;
  }
  return `${formatear(hora)}:${formatear(minutos)}`;
}
