import '../styles/style.scss';
import {CrearElementoHTML, CrearElementoHTML_Text, CrearElementoHTML_Select, CrearElementoHTML_Option} from '../tools/CrearElementoHTML.js';
// import {Proyecto} from './proyectos';
import {API} from '../tools/API.js';
import AirDatepicker from 'air-datepicker';
import {datepickerOptions} from '../tools/datepicker-options.js';
import 'air-datepicker/air-datepicker.css';

let Registros = [];
let TiempoGeneral_Minutos = 0;
const Api = new API();

class Ruta_ {
  id_ruta;
  fecha;
  contenedor = document.getElementById('Edid_Rutas');
  constructor(id_ruta, fecha) {
    this.id_ruta = id_ruta;
    this.fecha = fecha;
  }
}

class Registro_ {
  #titulo;
  #Options;
  #Registro;
  Activo = false;
  Protegido = false;
  TiempoAsignado = 0;
  ObjetoInput;
  InputOptions;
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

    this.ObjetoInput = new InputTiempo_(null, InputTiempo);
    this.ObjetoInput.RegistroContenedor = this;
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
  RegistroContenedor;
  tiempoRegistradoMinutos = 0;
  AnteriorTiempoAsignado = 0;
  constructor(id, Elemento, InputCabecera) {
    if (Elemento) this.Input = Elemento;
    else if (id) this.Input = document.getElementById(id);

    this.Input.addEventListener('input', (e) => {
      this.verificarValor(e);
    });

    this.Input.addEventListener('keypress', (e) => {
      if (e.key == 'Enter') {
        if (InputCabecera) {
          TiempoGeneral_Minutos = Horas_a_Minutos(this.Input.value);
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
}

const Calendario = new AirDatepicker('#fechaParaRuta', datepickerOptions);

Api.GetData(`../assets/rutas.json`).then((data) => {
  add_RutasSelect(data.rutas_vigilancia);
});

function add_RutasSelect(rutas) {
  const select = document.getElementById('selectRuta');
  select.appendChild(new CrearElementoHTML_Option('vacia', '', null, null, 'display: none').getElement());
  rutas.forEach((ruta) => {
    let option = new CrearElementoHTML_Option(ruta.id_ruta, ruta.nombre_ruta).getElement();
    select.appendChild(option);
  });
}

document.getElementById('ButtonAgregarRegistros').addEventListener('click', () => {
  AgregarRuta();
});

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
  console.log(id_ruta, fecha);
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
