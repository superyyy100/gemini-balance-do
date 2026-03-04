import { jsx } from 'hono/jsx';

export const Render = ({ isAuthenticated, showWarning }: { isAuthenticated: boolean; showWarning: boolean }) => {
	if (!isAuthenticated) {
		return (
			<html>
				<head>
					<meta charset="UTF-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<title>Login</title>
					<script src="https://cdn.tailwindcss.com"></script>
				</head>
				<body class="bg-gray-100 flex items-center justify-center h-screen">
					<div class="w-full max-w-xs">
						<form id="login-form" class="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
							<div class="mb-4">
								<label class="block text-gray-700 text-sm font-bold mb-2" for="auth-key">
									ACCESS_KEY
								</label>
								<input
									class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
									id="auth-key"
									type="password"
									placeholder="******************"
								/>
							</div>
							<div class="flex items-center justify-between">
								<button
									class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
									type="submit"
								>
									Login
								</button>
							</div>
						</form>
					</div>
					<script
						dangerouslySetInnerHTML={{
							__html: `
                                document.getElementById('login-form').addEventListener('submit', async function(e) {
                                    e.preventDefault();
                                    const key = document.getElementById('auth-key').value;
                                    const response = await fetch(window.location.href, {
                                        method: 'POST',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ key }),
                                    });
                                    if (response.ok) {
                                        window.location.reload();
                                    } else {
                                        alert('Login failed');
                                    }
                                });
                            `,
						}}
					></script>
				</body>
			</html>
		);
	}

	return (
		<html>
			<head>
				<meta charset="UTF-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1.0" />
				<title>Gemini API Key manage</title>
				<script src="https://cdn.tailwindcss.com"></script>
			</head>
			<body class="bg-slate-100 text-slate-800">
				{showWarning && (
					<div class="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-3 mb-4" role="alert">
						<strong class="font-bold">Safety Warning：</strong>
						<span class="block">Current HOME_ACCESS_KEY or AUTH_KEY as Default，Pls change it and redeploy Worker！</span>
					</div>
				)}
				<div class="flex h-screen">
					<div class="w-64 bg-slate-800 text-white p-4 flex flex-col">
						<h1 class="text-2xl font-bold mb-8 text-sky-400">Control Dashboard</h1>
						<nav class="flex flex-col space-y-2">
							<a href="#" id="nav-keys-list" class="block py-2.5 px-4 rounded-lg bg-slate-700 transition-colors">
								Key list
							</a>
							<a href="#" id="nav-add-keys" class="block py-2.5 px-4 rounded-lg hover:bg-slate-700 transition-colors">
								Add Key
							</a>
						</nav>
					</div>
					<div class="flex-1 p-8 overflow-y-auto">
						<div id="page-keys-list">
							<h2 class="text-3xl font-bold mb-6 text-slate-700">Key list</h2>
							<div class="bg-white p-6 rounded-lg shadow-sm">
								<div class="flex justify-between items-center mb-4">
									<h3 class="text-xl font-semibold text-slate-600">Stored key</h3>
									<div class="space-x-2">
										<button
											id="check-keys-btn"
											class="px-4 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition-colors shadow-sm"
										>
											check
										</button>
										<button
											id="refresh-keys-btn"
											class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors shadow-sm"
										>
											refresh
										</button>
										<button
											id="select-invalid-keys-btn"
											class="px-4 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors shadow-sm ml-2 hidden"
										>
											select invalid key
										</button>
									</div>
								</div>
								<div class="max-h-96 overflow-y-auto border rounded-lg">
									<table id="keys-table" class="w-full text-left">
										<thead class="bg-slate-50">
											<tr class="border-b border-slate-200">
												<th class="p-3 w-6">
													<input type="checkbox" id="select-all-keys" class="rounded border-slate-300" />
												</th>
												<th class="p-3 text-slate-600 font-semibold">API key</th>
												<th class="p-3 text-slate-600 font-semibold">Status</th>
												<th class="p-3 text-slate-600 font-semibold">Group</th>
												<th class="p-3 text-slate-600 font-semibold">Last check time</th>
												<th class="p-3 text-slate-600 font-semibold">Fail count</th>
											</tr>
										</thead>
										<tbody class="divide-y divide-slate-200"></tbody>
									</table>
								</div>
								<div id="pagination-controls" class="mt-4 flex justify-center items-center">
									<button
										id="prev-page-btn"
										class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50 shadow-sm"
										disabled
									>
										Pre
									</button>
									<span id="page-info" class="mx-4 text-slate-600"></span>
									<button
										id="next-page-btn"
										class="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 transition-colors disabled:opacity-50 shadow-sm"
										disabled
									>
										Next
									</button>
								</div>
								<button
									id="delete-selected-keys-btn"
									class="mt-4 w-full px-4 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors hidden shadow-sm"
								>
									Delete selected
								</button>
							</div>
						</div>
						<div id="page-add-keys" class="hidden">
							<h2 class="text-3xl font-bold mb-6 text-slate-700">add key</h2>
							<div class="bg-white p-6 rounded-lg shadow-sm">
								<h3 class="text-xl font-semibold mb-4 text-slate-600">Batch add key</h3>
								<form id="add-keys-form">
									<textarea
										id="api-keys"
										class="w-full h-48 p-3 border rounded-lg bg-slate-50 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition"
										placeholder="Enter API key each row"
									></textarea>
									<button
										type="submit"
										class="mt-4 w-full px-4 py-2.5 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors shadow-sm"
									>
										Submit
									</button>
								</form>
							</div>
						</div>
					</div>
				</div>

				<script
					dangerouslySetInnerHTML={{
						__html: `
								document.addEventListener('DOMContentLoaded', () => {
										const addKeysForm = document.getElementById('add-keys-form');
										const apiKeysTextarea = document.getElementById('api-keys');
										const refreshKeysBtn = document.getElementById('refresh-keys-btn');
										const keysTableBody = document.querySelector('#keys-table tbody');
										const selectAllCheckbox = document.getElementById('select-all-keys');
										const deleteSelectedBtn = document.getElementById('delete-selected-keys-btn');
										const checkKeysBtn = document.getElementById('check-keys-btn');
										const paginationControls = document.getElementById('pagination-controls');
										const prevPageBtn = document.getElementById('prev-page-btn');
										const nextPageBtn = document.getElementById('next-page-btn');
										const pageInfoSpan = document.getElementById('page-info');
										const selectInvalidKeysBtn = document.getElementById('select-invalid-keys-btn');

										const navKeysList = document.getElementById('nav-keys-list');
										const navAddKeys = document.getElementById('nav-add-keys');
										const pageKeysList = document.getElementById('page-keys-list');
										const pageAddKeys = document.getElementById('page-add-keys');

										let currentPage = 1;
										const pageSize = 50;
										let totalPages = 1;

										const showPage = (pageId) => {
											[pageKeysList, pageAddKeys].forEach(page => {
												if (page.id === pageId) {
													page.classList.remove('hidden');
												} else {
													page.classList.add('hidden');
												}
											});
											[navKeysList, navAddKeys].forEach(nav => {
												if (nav.id === \`nav-\${pageId.split('-')[1]}-\${pageId.split('-')[2]}\`) {
													nav.classList.add('bg-gray-700');
													nav.classList.remove('hover:bg-gray-700');
												} else {
													nav.classList.remove('bg-gray-700');
													nav.classList.add('hover:bg-gray-700');
												}
											});
										};

										navKeysList.addEventListener('click', (e) => {
											e.preventDefault();
											showPage('page-keys-list');
										});

										navAddKeys.addEventListener('click', (e) => {
											e.preventDefault();
											showPage('page-add-keys');
										});

										const updatePaginationControls = () => {
												pageInfoSpan.textContent = \` \${currentPage} / \${totalPages} Page\`;
												prevPageBtn.disabled = currentPage === 1;
												nextPageBtn.disabled = currentPage >= totalPages;
										};

										const fetchAndRenderKeys = async () => {
												keysTableBody.innerHTML = '<tr><td colspan="7" class="p-2 text-center">Loading...</td></tr>';
												try {
												  const response = await fetch(\`/api/keys?page=\${currentPage}&pageSize=\${pageSize}\`);
												  const { keys, total } = await response.json();
												  
												  totalPages = Math.ceil(total / pageSize);
												  keysTableBody.innerHTML = '';
												  if (keys.length === 0) {
												    keysTableBody.innerHTML = '<tr><td colspan="7" class="p-2 text-center">None</td></tr>';
												  } else {
												    keys.forEach(key => {
												      const statusMap = { normal: 'normal', abnormal: 'abnormal' };
												      const row = document.createElement('tr');
												      row.className = 'hover:bg-slate-50 transition-colors';
												      row.dataset.key = key.api_key;
												      row.innerHTML = \`
												        <td class="p-3 w-6"><input type="checkbox" class="key-checkbox rounded border-slate-300" data-key="\${key.api_key}" /></td>
												        <td class="p-3 font-mono text-sm text-slate-700">\${key.api_key}</td>
												        <td class="p-3 status-cell">\${statusMap[key.status] || key.status}</td>
												        <td class="p-3">\${statusMap[key.key_group] || key.key_group}</td>
												        <td class="p-3 text-sm text-slate-500">\${key.last_checked_at ? new Date(key.last_checked_at).toLocaleString() : 'N/A'}</td>
												        <td class="p-3 text-center">\${key.failed_count}</td>
												      \`;
												      keysTableBody.appendChild(row);
												    });
												  }
												  updatePaginationControls();
												} catch (error) {
												  keysTableBody.innerHTML = '<tr><td colspan="7" class="p-2 text-center text-red-500">Loading failed</td></tr>';
												  console.error('Failed to fetch keys:', error);
												}
										};

										const updateDeleteButtonVisibility = () => {
												const selectedKeys = document.querySelectorAll('.key-checkbox:checked');
												deleteSelectedBtn.classList.toggle('hidden', selectedKeys.length === 0);
										};

										keysTableBody.addEventListener('change', (e) => {
												if (e.target.classList.contains('key-checkbox')) {
												  updateDeleteButtonVisibility();
												}
										});

										selectAllCheckbox.addEventListener('change', () => {
												const checkboxes = document.querySelectorAll('.key-checkbox');
												checkboxes.forEach(checkbox => {
												  checkbox.checked = selectAllCheckbox.checked;
												});
												updateDeleteButtonVisibility();
										});

										deleteSelectedBtn.addEventListener('click', async () => {
												const selectedKeys = Array.from(document.querySelectorAll('.key-checkbox:checked')).map(cb => cb.dataset.key);
												if (selectedKeys.length === 0) {
												  alert('At least one key');
												  return;
												}

												if (!confirm(\`Confirm \${selectedKeys.length} ？\`)) {
												  return;
												}

												try {
												  const response = await fetch('/api/keys', {
												    method: 'DELETE',
												    headers: { 'Content-Type': 'application/json' },
												    body: JSON.stringify({ keys: selectedKeys }),
												  });
												  const result = await response.json();
												  if (response.ok) {
												    alert(result.message || 'Deleted successful');
												    fetchAndRenderKeys();
												    updateDeleteButtonVisibility();
												    selectAllCheckbox.checked = false;
												  } else {
												    alert(\`Deleted failed: \${result.error || 'undefined'}\`);
												  }
												} catch (error) {
												  alert('Request failed, pls check network');
												  console.error('Failed to delete keys:', error);
												}
										});

										checkKeysBtn.addEventListener('click', async () => {
											const rows = keysTableBody.querySelectorAll('tr[data-key]');
											const keysToCheck = Array.from(rows).map(row => row.dataset.key);

											rows.forEach(row => {
												const statusCell = row.querySelector('.status-cell');
												if (statusCell) {
													statusCell.textContent = 'Checking...';
													statusCell.className = 'p-2 status-cell text-gray-500';
												}
											});

											try {
												const response = await fetch('/api/keys/check', {
													method: 'POST',
													headers: { 'Content-Type': 'application/json' },
													body: JSON.stringify({ keys: keysToCheck }),
												});
												if (response.ok) {
													alert('finish check');
													fetchAndRenderKeys();
												} else {
													const result = await response.json();
													alert(\`Check failed: \${result.error || 'undefined'}\`);
												}
											} catch (error) {
												alert('Request failed, pls check network');
												console.error('Failed to check keys:', error);
											}
										});

										selectInvalidKeysBtn.addEventListener('click', () => {
											const rows = keysTableBody.querySelectorAll('tr');
											rows.forEach(row => {
												const statusCell = row.querySelector('.status-cell');
												if (statusCell && statusCell.textContent === 'invalid') {
													const checkbox = row.querySelector('.key-checkbox');
													if (checkbox) {
														checkbox.checked = true;
													}
												}
											});
											updateDeleteButtonVisibility();
										});

										addKeysForm.addEventListener('submit', async (e) => {
												e.preventDefault();
												const keys = apiKeysTextarea.value.split('\\n').map(k => k.trim()).filter(k => k !== '');
												if (keys.length === 0) {
												  alert('At least one key');
												  return;
												}
												try {
												  const response = await fetch('/api/keys', {
												    method: 'POST',
												    headers: { 'Content-Type': 'application/json' },
												    body: JSON.stringify({ keys }),
												  });
												  const result = await response.json();
												  if (response.ok) {
												    alert(result.message || 'add key successful');
												    apiKeysTextarea.value = '';
												    fetchAndRenderKeys();
												  } else {
												    alert(\`add key failed: \${result.error || 'undefined}\`);
												  }
												} catch (error) {
												  alert('Request failed, pls check network');
												  console.error('Failed to add keys:', error);
												}
										});

										refreshKeysBtn.addEventListener('click', fetchAndRenderKeys);

										prevPageBtn.addEventListener('click', () => {
												if (currentPage > 1) {
												  currentPage--;
												  fetchAndRenderKeys();
												}
										});

										nextPageBtn.addEventListener('click', () => {
												if (currentPage < totalPages) {
												  currentPage++;
												  fetchAndRenderKeys();
												}
										});

										// Initial load
										fetchAndRenderKeys();
								});
				  `,
					}}
				></script>
			</body>
		</html>
	);
};
