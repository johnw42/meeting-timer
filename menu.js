const MENU_ITEMS = [
  [1, 2, 'Table Topics'],
  [4, 6, 'Icebreaker'],
  [5, 7, 'Project 2–9'],
  [8, 10, 'Project 10'],
  [2, 3, 'Evaluator'],
];

window.onload = () => {
  const form = document.getElementById('custom');
  const {min, max} = form.elements;
  const menu = document.getElementById('menu');
  const minChime = document.getElementById('minChime');
  const maxChime = document.getElementById('maxChime');
  const numberInputs = [min, max];
  const booleanInputs = [minChime, maxChime];
  const menuItems = [];

  const params = new URL(window.location.href).searchParams;

  numberInputs.forEach(item => item.value = params.get(item.name));
  booleanInputs.forEach(item => item.checked = Boolean(params.get(item.name)));

  const updateUrl = (oldUrl) => {
    const url = new URL(oldUrl, window.location.href);
    ['fast', 'chimeUrl'].forEach(param => {
      const value = params.get(param);
      if (value) {
        url.searchParams.set(param, value);
      } else {
        url.searchParams.delete(param);
      }
    });
    booleanInputs.forEach(item => {
      if (item.checked) {
        url.searchParams.set(item.name, item.value);
      } else {
        url.searchParams.delete(item.name);
      }
    });
    return url.toString();
  };

  const updateCustomUrl = (oldUrl) => {
    const url = new URL(updateUrl(oldUrl));
    numberInputs.forEach(item => {
      if (item.value) {
        url.searchParams.set(item.name, item.value);
      }
    });
    return url.toString();
  };

  for (const [minTime, maxTime, name] of MENU_ITEMS) {
    const item = document.createElement('a');
    item.href = `timer.html?min=${minTime}&max=${maxTime}`;
    item.innerHTML =
        `${name} <span class="range">(${minTime}–${maxTime}m)</span></a>`;
    menu.insertBefore(item, form);
    menuItems.push(item);
  }

  const onChange = () => {
    window.history.replaceState(null, '', updateUrl(window.location.href));
    menuItems.forEach(item => {
      item.href = updateUrl(item.href);
    });
  };

  onChange();
  [...numberInputs, ...booleanInputs].forEach(item => {
    item.onchange = onChange;
  });

  document.getElementById('submit').onclick = () => {
    min.setCustomValidity('');
    max.setCustomValidity('');
    if (Number(min.value) <= 0) {
      min.setCustomValidity('Minimum time must be greater than zero minutes.');
    }
    if (Number(min.value) >= Number(max.value)) {
      form.max.setCustomValidity(
          'Maximum time must be greater than minimum time.');
    }
    if (form.reportValidity()) {
      window.location.href = updateCustomUrl('timer.html');
    }
  };
};
