// Function to flatten objects
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

// Function to load the language
function loadLanguage(lang) {
  $.i18n().locale = lang;

  // Load JSON to flatten
  $.getJSON(`/locales/${lang}.json`, function (data) {
    const flatData = flattenObject(data);

    $.i18n().load({ [lang]: flatData }).done(function () {
      // Apply translations to elements
      $('[data-i18n]').each(function () {
        const key = $(this).data('i18n');
        const translation = $.i18n(key);
        $(this).html(translation || `[${key}]`);
      });

      // Apply translations to placeholders
      $('[data-i18n-placeholder]').each(function () {
         const key = $(this).data('i18n-placeholder');
         const translation = $.i18n(key);
         $(this).attr('placeholder', translation || `[${key}]`);
      });

       // Apply translations to values
      $('[data-i18n-value]').each(function () {
        const key = $(this).data('i18n-value');
        const translation = $.i18n(key);
        $(this).attr('value', translation || `[${key}]`);
      });

      // Set button active
      $('.lang-button').removeClass('active');
      $(`.lang-button[data-lang="${lang}"]`).addClass('active');

      // Save in localStorage 
      localStorage.setItem('lang', lang);
    });
  });
}

window.addEventListener('load', function () {
  // Play and pause full video when users open the modal
  var $video = $('#inner-full-video');

  $('#videoPreviewModal').on('shown.bs.modal', function () {
    $video.get(0).currentTime = 0;
    $video.get(0).play();
  });

  $('#videoPreviewModal').on('hidden.bs.modal', function () {
    $video.get(0).pause();
    $video.get(0).currentTime = 0; 
  });

  const savedLang = localStorage.getItem('lang') || navigator.language.slice(0, 2);
  const initialLang = savedLang === 'es' ? 'es' : 'en';

  loadLanguage(initialLang);

  // Function to change language
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
        'https://script.google.com/macros/s/AKfycbw-0Wz2WHsvbkMslQU7TtJOBQyjSMasu5uXetpxQJqxMhWujjlpAT_XozmCgU2WYdfd/exec';
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
            $('#success-message').addClass('visible');
            $('#reserve-form').addClass('readonly');
            $('.wrapper-reserve-area').addClass('readonly');
            $('#reserve-form input.button').val("Submitted");
          })
          .catch((error) => {
            console.error('Error!', error.message);
            $('#success-message').removeClass('visible');
            $('#reserve-form').removeClass('readonly');
            $('.wrapper-reserve-area').removeClass('readonly');
            $('#reserve-form input.button').val("Submit Information");
          });
      });
    });
  }
});

