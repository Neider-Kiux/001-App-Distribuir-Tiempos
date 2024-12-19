import {InputTiempo_} from '.';
import {CrearElementoHTML, CrearElementoHTML_Input} from '../tools/CrearElementoHTML';

export class DialogoEditar_ {
  Preregistro;
  Background;
  Dialogo;
  CantidadTiempo_;

  constructor(Preregistro) {
    this.Preregistro = Preregistro;
    this.ConstruirDialogo();
  }

  ConstruirDialogo() {
    this.Background = new CrearElementoHTML('DIV', 'background', 'background').getElement();
    document.body.appendChild(this.Background);
    this.Dialogo = new CrearElementoHTML('DIV', 'dialogo', 'dialogo').getElement();
    const DatosPreregistro = new CrearElementoHTML('DIV', 'DatosPreregistros', 'preconcepto').getElement();
    DatosPreregistro.innerHTML = `<div id="Proyecto" class="border-style--default editar-registro__nombre-proyecto" >${this.Preregistro.titulo}</div>`;
    const CFechaCantidad = new CrearElementoHTML('DIV', 'c-FechaCantidad', 'c-ancho-completo').getElement();
    const FechaPreconcepto = new CrearElementoHTML_Input('text', 'fechaPreconcepto', 'ancho--default border-style--default c-alto-completo animated').getElement();
    FechaPreconcepto.value = this.Preregistro.Ruta_.fecha;
    this.CantidadTiempo_ = new InputTiempo_(this, false, 'ancho--default border-style--default preconcepto__cantidad');
    CFechaCantidad.appendChild(FechaPreconcepto);
    CFechaCantidad.appendChild(this.CantidadTiempo_.Input);

    this.Background.appendChild(this.Dialogo);
    this.Dialogo.appendChild(DatosPreregistro);
    this.Dialogo.appendChild(CFechaCantidad);
  }
}
