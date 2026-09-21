const form = document.querySelector('#trip-form');
const clearButton = document.querySelector('#clear-button');
const resultPanel = document.querySelector('#result-panel');
const resultValue = document.querySelector('#result-value');
const resultNote = document.querySelector('#result-note');
const fields = ['distance', 'consumption', 'fuel-price'];

const currency = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

function getNumber(id) {
  return Number.parseFloat(document.querySelector(`#${id}`).value);
}

function setError(id, message = '') {
  const input = document.querySelector(`#${id}`);
  const wrapper = input.closest('.input-wrap');
  const error = document.querySelector(`[data-error-for="${id}"]`);

  wrapper.classList.toggle('has-error', Boolean(message));
  error.textContent = message;
}

function validate() {
  let valid = true;
  const messages = {
    distance: 'Informe uma distância maior que zero.',
    consumption: 'Informe um consumo maior que zero.',
    'fuel-price': 'Informe um preço maior que zero.'
  };

  fields.forEach((id) => {
    const value = getNumber(id);
    const hasError = !Number.isFinite(value) || value <= 0;
    setError(id, hasError ? messages[id] : '');
    valid = valid && !hasError;
  });

  return valid;
}

function calculateTrip(event) {
  event.preventDefault();

  if (!validate()) {
    const firstInvalid = fields.find((id) => {
      const value = getNumber(id);
      return !Number.isFinite(value) || value <= 0;
    });
    document.querySelector(`#${firstInvalid}`).focus();
    resultNote.textContent = 'Revise os campos destacados para calcular.';
    return;
  }

  const distance = getNumber('distance');
  const consumption = getNumber('consumption');
  const fuelPrice = getNumber('fuel-price');
  const liters = distance / consumption;
  const total = liters * fuelPrice;

  resultValue.textContent = currency.format(total);
  resultNote.textContent = `Aproximadamente ${liters.toFixed(1).replace('.', ',')} litros para ${distance.toLocaleString('pt-BR')} km.`;
  resultPanel.classList.remove('is-updated');
  requestAnimationFrame(() => resultPanel.classList.add('is-updated'));
}

function clearForm() {
  form.reset();
  fields.forEach((id) => setError(id));
  resultValue.textContent = currency.format(0);
  resultNote.textContent = 'Preencha os dados acima para começar.';
  document.querySelector('#distance').focus();
}

form.addEventListener('submit', calculateTrip);
clearButton.addEventListener('click', clearForm);

fields.forEach((id) => {
  document.querySelector(`#${id}`).addEventListener('input', () => setError(id));
});
