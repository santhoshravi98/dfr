const form   = document.getElementById('get-item-form');
const result = document.getElementById('result');

form.addEventListener('submit', async e => {
  e.preventDefault();
  const item_number = document.getElementById('item-number').value;
  const revision    = document.getElementById('revision').value;
  const qualifier   = document.getElementById('qualifier').value;

  result.textContent = 'Loading...';
  try {
    const resp = await fetch(
      `/api/get_item?item_number=${encodeURIComponent(item_number)}` +
      `&revision=${encodeURIComponent(revision)}` +
      `&qualifier=${encodeURIComponent(qualifier)}`
    );
    const data = await resp.json();
    result.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    result.textContent = 'Error: ' + err.message;
  }
});

