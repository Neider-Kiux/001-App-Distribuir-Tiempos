import {InputTiempo_} from '.';
import {CrearElementoHTML, CrearElementoHTML_Input} from '../tools/CrearElementoHTML';

export class DialogoEditar_ {
  TiempoAsignado;
  Preregistro_;
  CantidadTiempo_;
  Dialogo;
  Background;
  Descripcion;

  constructor(Preregistro_) {
    this.Preregistro_ = Preregistro_;
    this.ConstruirDialogo();
  }

  ConstruirDialogo() {
    this.Background = new CrearElementoHTML('DIV', 'background', 'background').getElement();
    document.body.appendChild(this.Background);
    this.Dialogo = new CrearElementoHTML('DIV', 'dialogo', 'dialogo').getElement();
    const DatosPreregistro = new CrearElementoHTML('DIV', 'DatosPreregistros', 'preconcepto').getElement();
    DatosPreregistro.innerHTML = `<div id="Proyecto" class="border-style--default editar-registro__nombre-proyecto" >${this.Preregistro_.titulo}</div>`;
    const CFechaCantidad = new CrearElementoHTML('DIV', 'c-FechaCantidad', 'c-ancho-completo').getElement();
    const FechaPreconcepto = new CrearElementoHTML_Input('text', 'fechaPreconcepto', 'ancho--default border-style--default c-alto-completo animated').getElement();
    FechaPreconcepto.value = this.Preregistro_.Ruta_.fecha;
    FechaPreconcepto.readOnly = true;
    this.CantidadTiempo_ = new InputTiempo_(this, 'ancho--default border-style--default preconcepto__cantidad', false, true);
    this.CantidadTiempo_.Input.value = this.Preregistro_.InputTiempoPreregistro_.Input.value;
    CFechaCantidad.appendChild(FechaPreconcepto);
    CFechaCantidad.appendChild(this.CantidadTiempo_.Input);
    const ContenedorDescripcion = new CrearElementoHTML('DIV', 'ContenedorDescripcion', 'contenedor-descripcion').getElement();
    this.Descripcion = new CrearElementoHTML(
      'DIV',
      'descripcion',
      'border-style--default contenedor-descripcion__descripcion',
      null,
      this.Preregistro_.descripcionPreregistro.innerHTML,
    ).getElement();
    this.Descripcion.contentEditable = true;
    this.Descripcion.spellcheck = false;

    const ContenedorDescripcionHerremientas = new CrearElementoHTML('DIV', null, 'contenedor-descripcion__herramientas herramientas-descripcion').getElement();
    const HerramientaIdioma = new CrearElementoHTML('BUTTON', 'Idioma', 'herramientas-descripcion__opcion idioma-proyecto', null, 'ES').getElement();
    const HerramientaOrtografia = new CrearElementoHTML(
      'BUTTON',
      'Ortografia',
      'herramientas-descripcion__opcion',
      null,
      `<svg class="datos-registro__botones_button_svg" style="transform: scale(1.2)" viewBox="0 0 180 216"><use xlink:href="../img/sprite.svg#btn-spelling"></use></svg>`,
    ).getElement();
    const HerramientaClip = new CrearElementoHTML(
      'BUTTON',
      'Clip',
      'herramientas-descripcion__opcion',
      null,
      `<svg class="datos-registro__botones_button_svg" style="transform: scale(1.2)" viewBox="0 0 180 216"><use xlink:href="../img/sprite.svg#btn-clip"></use></svg>`,
    ).getElement();
    const HerramientaCargar = new CrearElementoHTML(
      'BUTTON',
      'Cargar',
      'herramientas-descripcion__opcion',
      null,
      `<svg class="datos-registro__botones_button_svg" style="transform: scale(1.2)" viewBox="0 0 180 216"><use xlink:href="../img/sprite.svg#guardar"></use></svg>`,
    ).getElement();

    HerramientaOrtografia.addEventListener('click', () => {
      this.ClickOrtografia();
    });

    ContenedorDescripcionHerremientas.appendChild(HerramientaIdioma);
    ContenedorDescripcionHerremientas.appendChild(HerramientaOrtografia);
    ContenedorDescripcionHerremientas.appendChild(HerramientaClip);
    ContenedorDescripcionHerremientas.appendChild(HerramientaCargar);
    ContenedorDescripcion.appendChild(this.Descripcion);
    ContenedorDescripcion.appendChild(ContenedorDescripcionHerremientas);

    DatosPreregistro.appendChild(CFechaCantidad);
    DatosPreregistro.appendChild(ContenedorDescripcion);

    this.Background.appendChild(this.Dialogo);
    this.Dialogo.appendChild(DatosPreregistro);
  }

  ClickOrtografia() {
    if (this.Descripcion.textContent.trim().length > 0) {
      let IdiomaSeleccionado = Idioma.textContent.toLowerCase() == 'en' ? 'en-US' : Idioma.textContent.toLowerCase();
      let TextoRevisar = this.Descripcion.textContent.trim();
      console.log(Idioma);

      const url = 'https://languagetool.org/api/v2/check';

      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Origin: 'https://kiux.app',
        },
        body: new URLSearchParams({
          text: TextoRevisar,
          language: IdiomaSeleccionado, // la api solo acepta los parametros con este formato
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          // console.log('Respuesta de la API:', data);
          let hallazgo = data.matches;

          const ResetStyleDescripcion = () => {
            setTimeout(() => {
              this.Descripcion.style.border = '0.0625rem solid #dbdbdb';
              this.Descripcion.style.background = '#fefefe';
            }, 2500);
          };

          if (hallazgo.length === 0) {
            clearTimeout(ResetStyleDescripcion);
            this.Descripcion.style.border = '0.0625rem double #75e3b8';
            this.Descripcion.style.background = '#d1f5e7';
            ResetStyleDescripcion();
          } else {
            clearTimeout(ResetStyleDescripcion);
            this.Descripcion.style.border = '0.0625rem double #e39d93';
            this.Descripcion.style.background = '#f5dedb';
            ResetStyleDescripcion();
          }

          for (let i = hallazgo.length - 1; i >= 0; i--) {
            let tipoHallazgo = hallazgo[i].rule.issueType,
              textoAntes = TextoRevisar.substr(0, hallazgo[i].offset),
              textoResaltar = TextoRevisar.substr(hallazgo[i].offset, hallazgo[i].length),
              N = hallazgo[i].offset + hallazgo[i].length,
              textoDespues = TextoRevisar.substr(N, TextoRevisar.length - N),
              id = 'hallazgo-' + i;

            TextoRevisar = textoAntes + `<span class='issueType-${tipoHallazgo}--line issueType' id='${id}'>${textoResaltar}</span>` + textoDespues;
          }

          this.Descripcion.innerHTML = TextoRevisar;

          const detectIssue = (e) => {
            this.Descripcion.setAttribute('contenteditable', false);

            let element = e;
            let id = e.id;
            let N = id.substr(9, id.length - 8);
            let mensaje = hallazgo[N].message;
            let tipoDeHallazgo = hallazgo[N].rule.issueType;

            // let issueTypeMensaje = CreateElement('DIV', 'issueTypeMensaje', ['issueType-mensaje']);
            let issueTypeMensaje = new CrearElementoHTML('DIV', 'issueTypeMensaje', 'issueType-mensaje').getElement();
            this.Descripcion.insertAdjacentElement('beforeend', issueTypeMensaje);

            // let c_IssueTypeMensaje = CreateElement('DIV', 'c-IssueTypeMensaje', ['c-issueType-mensaje', `issueType-${tipoDeHallazgo}`]);
            let c_IssueTypeMensaje = new CrearElementoHTML('DIV', 'c-IssueTypeMensaje', `c-issueType-mensaje issueType-${tipoDeHallazgo}`).getElement();
            issueTypeMensaje.insertAdjacentElement('beforeend', c_IssueTypeMensaje);

            c_IssueTypeMensaje.insertAdjacentElement('beforeend', new CrearElementoHTML('DIV', 'issueTypeTitulo', 'issueType-titulo', null, mensaje).getElement());
            c_IssueTypeMensaje.insertAdjacentElement('beforeend', new CrearElementoHTML('UL', 'issueTypeLista', `issueType-lista`).getElement());

            let reemplazo = hallazgo[N].replacements;
            console.log(reemplazo);

            for (let i = 0; i < reemplazo.length; i++) {
              // let elReemplazo = CreateElement('LI', i, [`issueType-${tipoDeHallazgo}--item`], reemplazo[i].value);
              let elReemplazo = new CrearElementoHTML('LI', i, `issueType-${tipoDeHallazgo}--item`, null, reemplazo[i].value).getElement();
              elReemplazo.addEventListener('click', (e) => {
                document.getElementById(id).outerHTML = e.target.textContent;
                issueTypeMensaje.remove();
                this.Descripcion.setAttribute('contenteditable', true);
              });
              document.getElementById('issueTypeLista').insertAdjacentElement('beforeend', elReemplazo);
            }

            issueTypeMensaje.addEventListener('click', (e) => {
              if (tipoDeHallazgo == 'inconsistency') {
                element.classList.remove('issueType-inconsistency--line');
                element.classList.remove('issueType');
                element.removeEventListener('click', myClosure);
                e.target.remove();
              } else {
                e.target.remove();
              }
              this.Descripcion.setAttribute('contenteditable', true);
            });
          };

          function myClosure() {
            detectIssue(this);
          }

          [...document.querySelectorAll('.issueType')].forEach((issue) => {
            issue.addEventListener('click', myClosure);
          });
        })
        .catch((error) => {
          console.error('Error al realizar la solicitud:', error);
        });
    }
  }
}
