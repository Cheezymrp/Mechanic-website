const STORAGE_KEY = 'wrench-road-services-v1';
const CONTACT_EMAIL = 'hello@example.com'; // Replace with your business email before publishing.
const iconChoices = ['⚙', '◉', '◌', '↻', '✳', '⌁', '▧'];
const exampleServices = [
  { id: 'oil-change', name: 'Oil & filter change', price: 59, description: 'Fresh oil and filter to keep your engine running smoothly.' },
  { id: 'brake-pads', name: 'Brake pad replacement', price: 149, description: 'Brake pad replacement. Price varies by vehicle and axle.' },
  { id: 'battery', name: 'Battery replacement', price: 45, description: 'Battery installation labor. Battery cost quoted separately.' },
  { id: 'tire-rotation', name: 'Tire rotation', price: 35, description: 'Rotate tires to help promote even tread wear.' },
  { id: 'inspection', name: 'Basic vehicle inspection', price: 39, description: 'A quick visual check of key maintenance items.' },
  { id: 'wipers', name: 'Wiper blade replacement', price: 20, description: 'Installation labor. Parts quoted based on your vehicle.' },
];

const serviceList = document.querySelector('#service-list');
const manager = document.querySelector('#service-manager');
const managerToggle = document.querySelector('#manage-toggle');
const form = document.querySelector('#service-form');
const formStatus = document.querySelector('#form-status');
const editIdInput = document.querySelector('#service-id');
const nameInput = document.querySelector('#service-name');
const priceInput = document.querySelector('#service-price');
const descriptionInput = document.querySelector('#service-description');
const saveButton = document.querySelector('#save-service');
const cancelEditButton = document.querySelector('#cancel-edit');
let services = loadServices();

function loadServices() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return exampleServices.map(service => ({ ...service }));
    const parsed = JSON.parse(saved);
    if (!Array.isArray(parsed) || !parsed.every(service =>
      service && typeof service.id === 'string' &&
      typeof service.name === 'string' && typeof service.price === 'number' &&
      typeof service.description === 'string'
    )) throw new Error('Saved service data has an unexpected format.');
    return parsed;
  } catch (error) {
    console.error('Unable to load saved services:', error);
    return exampleServices.map(service => ({ ...service }));
  }
}

function saveServices() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(services));
    formStatus.textContent = 'Changes saved in this browser.';
  } catch (error) {
    console.error('Unable to save services:', error);
    formStatus.textContent = 'Could not save changes in this browser. Check your browser storage settings.';
  }
}

function renderServices() {
  serviceList.replaceChildren();
  if (services.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-services';
    empty.textContent = 'No services yet. Open “Manage services” to add your first one.';
    serviceList.append(empty);
    return;
  }

  services.forEach((service, index) => {
    const card = document.createElement('article');
    card.className = 'service-card';
    if (!manager.hidden) card.classList.add('service-card-editing');
    const icon = document.createElement('span');
    icon.className = 'service-icon';
    icon.setAttribute('aria-hidden', 'true');
    icon.textContent = iconChoices[index % iconChoices.length];

    const details = document.createElement('div');
    details.className = 'service-details';
    const title = document.createElement('h3');
    title.textContent = service.name;
    const description = document.createElement('p');
    description.textContent = service.description || 'Ask for a personalized estimate.';
    details.append(title, description);

    const price = document.createElement('div');
    price.className = 'service-price';
    const label = document.createElement('span');
    label.textContent = 'STARTING AT';
    const amount = document.createElement('strong');
    amount.textContent = `$${service.price}`;
    price.append(label, amount);

    card.append(icon, details, price);
    if (!manager.hidden) {
      const actions = document.createElement('div');
      actions.className = 'service-actions';
      const edit = document.createElement('button');
      edit.type = 'button';
      edit.textContent = 'Edit';
      edit.setAttribute('aria-label', `Edit ${service.name}`);
      edit.addEventListener('click', () => beginEdit(service));
      const remove = document.createElement('button');
      remove.type = 'button';
      remove.className = 'delete-service';
      remove.textContent = 'Remove';
      remove.setAttribute('aria-label', `Remove ${service.name}`);
      remove.addEventListener('click', () => removeService(service));
      actions.append(edit, remove);
      card.append(actions);
    }
    serviceList.append(card);
  });
}

function resetForm() {
  form.reset();
  editIdInput.value = '';
  saveButton.innerHTML = 'Add service <span aria-hidden="true">＋</span>';
  cancelEditButton.hidden = true;
}

function beginEdit(service) {
  editIdInput.value = service.id;
  nameInput.value = service.name;
  priceInput.value = service.price;
  descriptionInput.value = service.description;
  saveButton.innerHTML = 'Save changes <span aria-hidden="true">✓</span>';
  cancelEditButton.hidden = false;
  formStatus.textContent = `Editing ${service.name}.`;
  nameInput.focus();
}

function removeService(service) {
  services = services.filter(item => item.id !== service.id);
  if (editIdInput.value === service.id) resetForm();
  saveServices();
  renderServices();
}

managerToggle.addEventListener('click', () => {
  manager.hidden = !manager.hidden;
  managerToggle.setAttribute('aria-expanded', String(!manager.hidden));
  managerToggle.innerHTML = manager.hidden
    ? 'Manage services <span aria-hidden="true">＋</span>'
    : 'Done editing <span aria-hidden="true">✓</span>';
  if (manager.hidden) resetForm();
  renderServices();
  if (!manager.hidden) manager.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
});

document.querySelector('#close-manager').addEventListener('click', () => managerToggle.click());
cancelEditButton.addEventListener('click', () => {
  resetForm();
  formStatus.textContent = 'Editing cancelled.';
});

form.addEventListener('submit', event => {
  event.preventDefault();
  if (!form.reportValidity()) return;
  const service = {
    id: editIdInput.value || `service-${Date.now()}`,
    name: nameInput.value.trim(),
    price: Number(priceInput.value),
    description: descriptionInput.value.trim(),
  };
  if (!service.name || !Number.isFinite(service.price) || service.price < 0) return;

  if (editIdInput.value) {
    services = services.map(item => item.id === service.id ? service : item);
  } else {
    services.push(service);
  }
  resetForm();
  saveServices();
  renderServices();
});

document.querySelector('#reset-services').addEventListener('click', () => {
  services = exampleServices.map(service => ({ ...service }));
  resetForm();
  saveServices();
  renderServices();
});

const contactLink = document.querySelector('#contact-link');
if (CONTACT_EMAIL !== 'hello@example.com') {
  contactLink.href = `mailto:${encodeURIComponent(CONTACT_EMAIL)}?subject=Service%20request`;
  document.querySelector('#contact-hint').hidden = true;
}
document.querySelector('#year').textContent = new Date().getFullYear();
renderServices();
