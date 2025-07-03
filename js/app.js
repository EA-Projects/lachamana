// Función para aplanar objetos anidados
function flattenObject(obj, parent = '', res = {}) {
  for (let key in obj) {
    if (!obj.hasOwnProperty(key)) continue;
    const propName = parent ? `${parent}.${key}` : key;
    if (typeof obj[key] === 'object' && obj[key] !== null) {
      flattenObject(obj[key], propName, res);
    } else {
      res[propName] = obj[key];
    }
  }
  return res;
}

// Función principal para cargar el idioma
function loadLanguage(lang) {
  $.i18n().locale = lang;

  // Cargar el archivo JSON y aplanarlo
  $.getJSON(`/locales/${lang}.json`, function (data) {
    const flatData = flattenObject(data);

    $.i18n().load({ [lang]: flatData }).done(function () {
      // Aplicar traducciones a cada elemento
      $('[data-i18n]').each(function () {
        const key = $(this).data('i18n');
        const translation = $.i18n(key);
        $(this).html(translation || `[${key}]`);
      });

      // Aplicar traducciones a placeholders
      $('[data-i18n-placeholder]').each(function () {
         const key = $(this).data('i18n-placeholder');
         const translation = $.i18n(key);
         $(this).attr('placeholder', translation || `[${key}]`);
      });

      // Marcar botón activo
      $('.lang-button').removeClass('active');
      $(`.lang-button[data-lang="${lang}"]`).addClass('active');

      // Guardar en localStorage
      localStorage.setItem('lang', lang);
    });
  });
}

// Inicialización al cargar la página
window.addEventListener('load', function () {
  const savedLang = localStorage.getItem('lang') || navigator.language.slice(0, 2);
  const initialLang = savedLang === 'es' ? 'es' : 'en';

  loadLanguage(initialLang);

  // Evento al hacer clic en botones de idioma
  $('.lang-button').on('click', function () {
    const lang = $(this).data('lang');
    loadLanguage(lang);
  });

  // Date Picker initializer 
  $(function(){
    $("#datepicker-in").datepicker({
      dateFormat: "dd-mm-yy"
      ,	duration: "fast"
    });
    $("#datepicker-out").datepicker({
      dateFormat: "dd-mm-yy"
      ,	duration: "fast"
    });
  });

  // Form
  if ($('#reserve-form').length) {
    $(function () {
      const scriptURL =
        'https://script.google.com/macros/s/AKfycbw7D0tksKhH_dxxAN-DubJlPcJIlCccTE2p4Bo-jdKSdXXRCbpduw-kwWFllm0QNNw/exec';
      const form = document.getElementById('reserve-form');
  
      form.addEventListener('submit', (e) => {
        $('#reserve-form').addClass('disabled');
  
        // Sending status
        $('#reserve-form').addClass('readonly');
        $('#reserve-form input.button').val("Sending Information");
  
        e.preventDefault();
  
        // Crear FormData para incluir archivo y otros campos
        const formData = new FormData(form);
  
        fetch(scriptURL, { method: 'POST', body: formData })
          .then((response) => {
            $('#success-message').fadeIn();
            $('#reserve-form').addClass('readonly');
            $('#reserve-form input.button').val("Submitted");
          })
          .catch((error) => {
            console.error('Error!', error.message);
            $('#success-message').fadeOut();
            $('#reserve-form').removeClass('readonly');
            $('#reserve-form input.button').val("Submit Information");
          });
      });
    });
  }
});

