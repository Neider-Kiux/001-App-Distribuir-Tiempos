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
// import {Proyecto} from './proyectos';
import {API} from '../tools/API.js';
import AirDatepicker from 'air-datepicker';
import {datepickerOptions} from '../tools/datepicker-options.js';
import {GetHSL} from '../tools/Color.js';
import 'air-datepicker/air-datepicker.css';
import '../img/unlink-svgrepo-com.svg';
import '../img/unlink-svgrepo-com_dark.svg';
import '../img/lock-closed-svgrepo-com.svg';
import '../img/delete-1-svgrepo-com.svg';

let Registros = [];
let TiempoGeneral_Minutos = 0;
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
    this.InputTiempoTotal_ = new InputTiempo_(this, true, 'inputTiempoTotal');
    this.InputCheckAsegurar = new CrearElementoHTML_Input('checkbox', null, null, null, null, 'Asegurar tiempo').getElement();
    this.contenedor.appendChild(this.#Ruta);
    this.construirRuta();

    // NOTE: Los pasos que siguen son construir la ruta, es decir desde el elemento HTML en adelante, modificar la construcción del registro para que se guarden
    // en la lista de los Preregistros de la ruta y de hay se hagan los calculos pertinentes.  En los JSON esta la infomación para construir la ruta y sus preconceptos.
  }

  construirRuta() {
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
}

class Preregistro_ {
  #Preregistro = new CrearElementoHTML('DIV', null, 'preregistro').getElement();
  #Ruta_;
  Activo = false;
  Protegido = false;
  id;
  titulo;
  color;
  idioma;
  proyecto;
  estado;
  descripcionPreregistro;
  selectPlantillas;
  InputTiempoPreregistro_;
  botonDesasegurar;
  botonDeshabilitar;
  constructor(id, titulo, color, idioma, proyecto, estado, ruta) {
    this.id = id;
    this.titulo = titulo;
    this.color = color;
    this.idioma = idioma;
    this.proyecto = proyecto;
    this.estado = estado;
    this.#Ruta_ = ruta;
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
    this.selectPlantillas = new CrearElementoHTML_Select(this.#Ruta_.plantillas, 'plantillas', null, 'selectPlantillas').getElement();
    this.InputTiempoPreregistro_ = new InputTiempo_(this, false, 'inputTiempoPreregistro');
    this.botonDesasegurar = new CrearElementoHTML_Button(false, 'BotonDesasegurarTiempo', 'botonDesasegurarTiempo').getElement();
    this.botonDeshabilitar = new CrearElementoHTML_Button(true, 'BotonDeshabilitar', 'botonDeshabilitar').getElement();
    this.botonDesasegurar.appendChild(new CrearElementoHTML_Imagen('../img/unlink-svgrepo-com_dark.svg').getElement());
    this.botonDeshabilitar.appendChild(new CrearElementoHTML_Imagen('../img/delete-1-svgrepo-com.svg').getElement());

    botonesPreregistro.appendChild(this.InputTiempoPreregistro_.Input);
    botonesPreregistro.appendChild(this.botonDesasegurar);
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

    this.botonDesasegurar.addEventListener('click', () => {
      this.DesasegurarTiempo();
    });
  }

  GetPreregistro() {
    return this.#Preregistro;
  }

  DesasegurarTiempo() {
    console.log(this.#Ruta_);
  }

  //NOTE: Estas creando la función para activar el registro, primero debe aparecer desactivado, luego se debe confirmar que se ingrese adecuadamente el valor en los inputs de los registros.
  //Para activar el registro se debe modificar el valor de la descripción.
}

class Registro_ {
  #titulo;
  #Options;
  #Registro;
  TiempoAsignado = 0;
  ObjetoInput;
  InputOptions;
  Ruta_;
  constructor(titulo, Options) {
    this.#titulo = titulo;
    this.#Options = Options;

    this.ConstruirRegistro();
  }

  ConstruirRegistro() {
    this.#Registro = new CrearElementoHTML('DIV', null, ['registro']).getElement();
    let Titulo = new CrearElementoHTML_Text('P', '').getElement();
    // let Titulo = new CrearElementoHTML_Text('P', this.#titulo).getElement(); //Este es el valor que debe ir
    let InputTiempo = new CrearElementoHTML('INPUT', null, ['inputTiempo']).getElement();
    this.InputOptions = new CrearElementoHTML_Select(this.#Options, 'tipo').getElement();
    let BotonDesprotegerTiempo = new CrearElementoHTML('BUTTON').getElement();
    let BotonDesactivarRegistro = new CrearElementoHTML('BUTTON').getElement();
    BotonDesprotegerTiempo.innerHTML = 'Des';
    BotonDesactivarRegistro.innerHTML = 'Del';

    this.InputOptions.addEventListener('change', (e) => {
      if (e.target.value) {
        this.ActivarRegistro();
      }
    });

    BotonDesprotegerTiempo.addEventListener('click', (e) => {
      this.DesprotegerRegistro(e);
    });

    BotonDesactivarRegistro.addEventListener('click', (e) => {
      this.DesactivarRegistro();
    });

    this.#Registro.appendChild(Titulo);
    this.#Registro.appendChild(InputTiempo);
    this.#Registro.appendChild(this.InputOptions);
    this.#Registro.appendChild(BotonDesprotegerTiempo);
    this.#Registro.appendChild(BotonDesactivarRegistro);

    this.ObjetoInput = new InputTiempo_(null, InputTiempo, this);
    this.ObjetoInput.Input.disabled = true;
  }

  IngresarValorTiempo(tiempoMinutos) {
    this.TiempoAsignado = tiempoMinutos;
    this.ObjetoInput.Input.value = Minutos_a_Horas(tiempoMinutos);
  }

  GetRegistro() {
    return this.#Registro;
  }

  ActivarRegistro() {
    this.ObjetoInput.Input.disabled = false;
    this.Activo = true;
    distribuirTiempo();
  }
  ProtegerRegistro() {
    this.ObjetoInput.Input.classList.add('protegido');
    this.Protegido = true;
  }

  DesprotegerRegistro(e) {
    this.ObjetoInput.Input.classList.remove('protegido');
    this.Protegido = false;
    distribuirTiempo();
  }

  DesactivarRegistro() {
    this.Activo = false;
    this.Protegido = false;
    this.InputOptions.value = 'primeraOpcion';
    this.ObjetoInput.Input.value = '';
    this.ObjetoInput.Input.disabled = true;
    this.TiempoAsignado = 0;
    this.ObjetoInput.AnteriorTiempoAsignado = 0;
    this.ObjetoInput.tiempoRegistradoMinutos = 0;
    this.ObjetoInput.ValorAnteriorEscritura = 0;
    this.ObjetoInput.ValorAnterior = 0;

    distribuirTiempo();
  }
}

class InputTiempo_ {
  Input;
  ValorAnterior = '';
  ValorAnteriorEscritura = '';
  Registro_;
  Ruta_;
  tiempoRegistradoMinutos = 0;
  AnteriorTiempoAsignado = 0;
  constructor(Contenedor_, InputCabecera, classList) {
    if (!InputCabecera) this.Registro_ = Contenedor_;
    else this.Ruta_ = Contenedor_;
    this.Input = new CrearElementoHTML_Input('text', null, classList).getElement();

    this.Input.addEventListener('input', (e) => {
      this.verificarValor(e);
    });

    this.Input.addEventListener('keypress', (e) => {
      if (e.key == 'Enter') {
        if (InputCabecera) {
          // TiempoGeneral_Minutos = Horas_a_Minutos(this.Input.value);
          this.Ruta_.tiempoTotalMinutos = Horas_a_Minutos(this.Input.value);
        } else {
          this.AnteriorTiempoAsignado = this.RegistroContenedor.TiempoAsignado;
          console.log(this.AnteriorTiempoAsignado);
          this.RegistroContenedor.TiempoAsignado = Horas_a_Minutos(this.Input.value);
          this.RegistroContenedor.ProtegerRegistro();
        }
        if (distribuirTiempo()) {
          if (!InputCabecera) this.AnteriorTiempoAsignado = this.RegistroContenedor.TiempoAsignado;
          this.Input.value = Minutos_a_Horas(Horas_a_Minutos(this.Input.value));
          this.ValorAnterior = this.Input.value;
        } else {
          if (!InputCabecera) {
            this.RegistroContenedor.TiempoAsignado = this.AnteriorTiempoAsignado;
            this.Input.value = Minutos_a_Horas(this.RegistroContenedor.TiempoAsignado);
            this.RegistroContenedor.DesprotegerRegistro();
          } else {
            this.Input.value = this.ValorAnterior;
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

//[x] Retirar estas lineas -->
const FechaParaRuta = document.getElementById('fechaParaRuta');
FechaParaRuta.setAttribute('data-value', '2024-12-04');
FechaParaRuta.value = '2024-12-04';
const SelectRuta = document.getElementById('selectRuta');
SelectRuta.value = 1001;
//[x] <--

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

// const BotonCargar = document.getElementById('ButtonCargarRegistros');
// BotonCargar.addEventListener('click', () => {
//   let CantidadRegistros = window.prompt('¿Cúantos registros desea cargar?', 10);
//   if (Number.isInteger(parseFloat(CantidadRegistros))) {
//     CargarRegistros(CantidadRegistros);
//   }
// });

// function CargarRegistros(CantidadRegistros) {
//   const SectionRegistros = document.getElementById('Registros');
//   for (let i = 0; i < CantidadRegistros; i++) {
//     let registro = new Registro_(Proyecto[i], ['Hola mundo 1', 'Hola Mundo 2']);
//     Registros.push(registro);
//     SectionRegistros.appendChild(registro.GetRegistro());
//   }
// }

// let InputTiempoCabecera = document.getElementById('InputTiempoGeneral');
// // new InputTiempo_(null, InputTiempoCabecera, true);
// //NOTE: Ahora el input de tiempo se utiliza hasta que se construlla la ruta

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

function distribuirTiempo() {
  let NumeroDeActivos = Contar_Registros_Activos_Sin_Proteger();
  let TiempoGeneral_RestandoFijos = TiempoGeneral_Minutos;
  let valorDistribuido = null;
  let Resto = 0;
  let Protegidos = 0;

  Registros.forEach((element) => {
    if (element.Protegido) {
      TiempoGeneral_RestandoFijos -= element.TiempoAsignado;
      Protegidos++;
    }
  });

  if (NumeroDeActivos) {
    valorDistribuido = parseInt(TiempoGeneral_RestandoFijos / NumeroDeActivos);
    Resto = TiempoGeneral_RestandoFijos % NumeroDeActivos;
  }

  if (valorDistribuido < 1 && Protegidos) {
    window.alert('No es posible distribuir el tiempo');
    return false;
  }

  Registros.forEach((element) => {
    let Valor = valorDistribuido;
    if (element.Activo && !element.Protegido) {
      if (Resto > 0) {
        Valor++;
        Resto--;
      }
      element.IngresarValorTiempo(Valor);
    }
  });

  return true;
}

function Contar_Registros_Activos_Sin_Proteger() {
  let NumeroDeActivos = 0;
  Registros.forEach((element) => {
    if (element.Activo && !element.Protegido) NumeroDeActivos++;
  });
  return NumeroDeActivos;
}
