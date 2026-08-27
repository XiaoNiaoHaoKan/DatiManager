async function api(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options
  });
  const body = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(body.error || 'Errore sconosciuto');
  return body;
}

async function refreshMuseums() {
  const museums = await api('/museums');
  const tbody = document.querySelector('#museum-table tbody');
  tbody.innerHTML = '';
  const staffSelect = document.querySelector('#staff-museum-select');
  staffSelect.innerHTML = '';

  for (const museum of museums) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${museum.id}</td>
      <td>${museum.name}</td>
      <td>${museum.city || ''}</td>
      <td>${museum.description || ''}</td>
      <td>${museum.entry || ''}</td>
      <td><button class="danger" data-id="${museum.id}">Elimina</button></td>
    `;
    tr.querySelector('button').addEventListener('click', async () => {
      await api(`/museums/${museum.id}`, { method: 'DELETE' });
      refreshMuseums();
    });
    tbody.appendChild(tr);

    const option = document.createElement('option');
    option.value = museum._id;
    option.textContent = museum.name;
    staffSelect.appendChild(option);
  }
  return museums;
}

async function refreshAccounts() {
  const accounts = await api('/accounts');
  const tbody = document.querySelector('#account-table tbody');
  tbody.innerHTML = '';
  for (const account of accounts) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${account.username}</td>
      <td>${account.role}</td>
      <td>${account.credit}</td>
      <td>${account.museumId || '-'}</td>
      <td>
        <button class="credit" data-delta="5">+5</button>
        <button class="credit" data-delta="-5">-5</button>
        <button class="danger">Elimina</button>
      </td>
    `;
    tr.querySelectorAll('.credit').forEach((btn) => {
      btn.addEventListener('click', async () => {
        await api(`/accounts/${account.username}/credit`, {
          method: 'PATCH',
          body: JSON.stringify({ delta: Number(btn.dataset.delta) })
        });
        refreshAccounts();
      });
    });
    tr.querySelector('.danger').addEventListener('click', async () => {
      await api(`/accounts/${account.username}`, { method: 'DELETE' });
      refreshAccounts();
    });
    tbody.appendChild(tr);
  }
}

document.querySelector('#museum-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = new FormData(event.target);
  try {
    await api('/museums', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(form))
    });
    event.target.reset();
    refreshMuseums();
  } catch (error) {
    alert(error.message);
  }
});

document.querySelector('#account-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = new FormData(event.target);
  try {
    await api('/accounts', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(form))
    });
    event.target.reset();
    refreshAccounts();
  } catch (error) {
    alert(error.message);
  }
});

async function refreshStaffAccounts() {
  const accounts = await api('/staff/accounts');
  const tbody = document.querySelector('#staff-account-table tbody');
  tbody.innerHTML = '';
  for (const account of accounts) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>${account.email}</td>
      <td>${account.museumId?.name || account.museumId || '-'}</td>
      <td><button class="danger">Elimina</button></td>
    `;
    tr.querySelector('.danger').addEventListener('click', async () => {
      await api(`/staff/accounts/${account._id}`, { method: 'DELETE' });
      refreshStaffAccounts();
    });
    tbody.appendChild(tr);
  }
}

document.querySelector('#staff-account-form').addEventListener('submit', async (event) => {
  event.preventDefault();
  const form = new FormData(event.target);
  try {
    await api('/staff/accounts', {
      method: 'POST',
      body: JSON.stringify(Object.fromEntries(form))
    });
    event.target.reset();
    refreshStaffAccounts();
  } catch (error) {
    alert(error.message);
  }
});

refreshMuseums();
refreshAccounts();
refreshStaffAccounts();
