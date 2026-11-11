/**
 * St. Mary's Secondary School Portal
 * Utility to download the project ZIP package
 */

export function downloadProjectZip() {
  // Use the static pre-compiled zip package served by public folder
  const link = document.createElement('a');
  link.href = '/downloads/st_marys_school_project.zip';
  link.download = 'st_marys_school_project.zip';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
