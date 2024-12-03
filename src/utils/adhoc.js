export function humanFileSize(bytes, si = false, dp = 1) {
  const thresh = si ? 1000 : 1024;
  const units = si
    ? ['B', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
    : ['B', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

  if (bytes < thresh) {
    return (bytes || 0) + ' ' + units[0];
  }

  const u = Math.floor(Math.log(bytes) / Math.log(thresh));
  const size = (bytes / Math.pow(thresh, u)).toFixed(dp);

  return (size || 0) + ' ' + units[u];
}
