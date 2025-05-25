const form = document.getElementById('fetch-form');
const result = document.getElementById('result');
let mappings = {};
let latestData = null;

async function loadMappings() {
  try {
    const res = await fetch('/mappings.json');
    mappings = await res.json();

    const select = document.getElementById('category-select');
    Object.keys(mappings).forEach(key => {
      const opt = document.createElement('option');
      opt.value = key;
      opt.textContent = key;
      select.appendChild(opt);
    });
  } catch (err) {
    alert('Error loading mappings.json');
  }
}

form.addEventListener('submit', async e => {
  e.preventDefault();
  const item_number = document.getElementById('item-number').value;
  const revision = document.getElementById('revision').value;
  const qualifier = document.getElementById('qualifier').value;

  result.textContent = 'Loading...';

  try {
    const response = await fetch(
      `/api/get_item?item_number=${encodeURIComponent(item_number)}&revision=${encodeURIComponent(revision)}&qualifier=${encodeURIComponent(qualifier)}`
    );
    const data = await response.json();
    latestData = data;
    result.textContent = JSON.stringify(data, null, 2);
  } catch (err) {
    result.textContent = 'Error fetching item: ' + err.message;
  }
});

document.getElementById('export-btn').addEventListener('click', () => {
  const category = document.getElementById('category-select').value;
  if (!category) return alert('Please select a category.');
  if (!latestData || !latestData.AttrVals) return alert('No data to export. Please fetch an item first.');

  const columns = mappings[category];
  const row = {};

  for (const col of columns) {
    const attr = latestData.AttrVals.find(a => a.AttributeName === col);
    row[col] = attr ? attr.Value : '';
  }

  const csv = [
    columns.join(','),
    columns.map(c => `"${row[c] || ''}"`).join(',')
  ].join('\n');

  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `export_${category}.csv`;
  a.click();
  URL.revokeObjectURL(url);
});

loadMappings();
