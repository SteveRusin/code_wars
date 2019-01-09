(function () {
  'use strict';
  const input = document.querySelector('#file');

  input.addEventListener('change', function(e) {
    var filesList = [...this.files];

    filesList.forEach(img => {
      const div = document.createElement('div');
      div.innerHTML = img.name;
      document.body.appendChild(div);
    });
  });
})();
