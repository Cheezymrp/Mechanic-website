const publicServices = [
  {
    name: 'Oil & filter change',
    price: 20,
    description: 'Fresh oil and filter to keep your engine running smoothly. Price of oil not included.',
  },
  {
    name: 'Brake pad replacement',
    price: 40,
    description: 'Brake pad replacement. Price of pads not included.',
  },
];
const serviceList = document.querySelector('#service-list');
const icons = ['⚙', '◉'];

publicServices.forEach((service, index) => {
  const card = document.createElement('article');
  card.className = 'service-card';
  const icon = document.createElement('span');
  icon.className = 'service-icon';
  icon.setAttribute('aria-hidden', 'true');
  icon.textContent = icons[index];

  const details = document.createElement('div');
  details.className = 'service-details';
  const title = document.createElement('h3');
  title.textContent = service.name;
  const description = document.createElement('p');
  description.textContent = service.description;
  details.append(title, description);

  const price = document.createElement('div');
  price.className = 'service-price';
  const label = document.createElement('span');
  label.textContent = 'STARTING AT';
  const amount = document.createElement('strong');
  amount.textContent = `$${service.price}`;
  price.append(label, amount);

  card.append(icon, details, price);
  serviceList.append(card);
});

document.querySelector('#year').textContent = new Date().getFullYear();
