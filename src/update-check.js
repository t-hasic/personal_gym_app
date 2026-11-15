export async function availableUpdate(base, currentVersion, fetcher = fetch) {
  const response = await fetcher(`${base}version.json?check=${Date.now()}`, {cache: 'no-store'});
  if (!response.ok) throw new Error('Update check failed');
  const data = await response.json();
  if (typeof data.version !== 'string' || !data.version) throw new Error('Invalid version');
  return data.version === currentVersion ? null : data.version;
}

export function refreshUrl(href) {
  const url = new URL(href);
  url.searchParams.set('refresh', String(Date.now()));
  return url.href;
}
