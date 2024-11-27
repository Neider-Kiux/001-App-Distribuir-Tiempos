let button = {
  content: 'Hoy',
  className: 'custom-button-classname',
  onClick: (dp) => {
    let date = new Date();
    dp.selectDate(date);
    dp.setViewDate(date);
  },
};

export const datepickerOptions = {
  dateFormat: 'yyyy-MM-dd',
  locale: {
    days: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'],
    daysShort: ['Dom', 'Lun', 'Mar', 'Mie', 'Jue', 'Vie', 'Sab'],
    daysMin: ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sa'],
    months: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
    monthsShort: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
    today: 'Hoy',
    clear: 'Limpiar',
    dateFormat: 'yyyy/mm/dd',
    timeFormat: 'hh:ii aa',
    firstDay: 1,
  },
  buttons: [button],
  todayButton: new Date(),
  autoClose: true,
  onSelect: function onSelect(dp) {
    //console.log(dp.datepicker.$el);
    if (dp.datepicker.$el.id == 'fechaPreconcepto') {
      const Fecha_Preconcepto = document.getElementById('fechaPreconcepto');
      Fecha_Preconcepto.setAttribute('data-value', dp.formattedDate);
    }

    if (document.getElementById('fechaInicial')) {
      const Fecha_Inicial = document.getElementById('fechaInicial');
      const Fecha_Final = document.getElementById('fechaFinal');

      if (dp.datepicker.$el.id == 'fechaInicial') {
        Fecha_Inicial.setAttribute('data-value', dp.formattedDate);
      }
      if (dp.datepicker.$el.id == 'fechaInicial' && Fecha_Inicial.dataset.contador == 1) {
        Fecha_Final.setAttribute('data-value', dp.formattedDate);
        Fecha_Final.value = dp.formattedDate;
      }

      if (dp.datepicker.$el.id == 'fechaFinal') {
        Fecha_Inicial.dataset.contador++;
        Fecha_Final.setAttribute('data-value', dp.formattedDate);
      }
    }

    if (dp.datepicker.$el.id == 'fechaParaRuta') {
      const Fecha_Preconcepto = document.getElementById('fechaParaRuta');
      Fecha_Preconcepto.setAttribute('data-value', dp.formattedDate);
    }
  },
  position({$datepicker, $target, $pointer}) {
    let coords = $target.getBoundingClientRect(),
      dpHeight = $datepicker.clientHeight,
      dpWidth = $datepicker.clientWidth,
      downMovement = 3;

    let top = coords.y + coords.height + downMovement;
    let left = coords.x;

    $datepicker.style.left = `${left}px`;
    $datepicker.style.top = `${top}px`;

    $pointer.style.display = 'none';
  },
};
