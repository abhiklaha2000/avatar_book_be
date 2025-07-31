// Function to check the isNotEmpty condition
 function isNotEmpty(value) {
  if (value === null || value === undefined) return false;

  if (typeof value === 'string' && value.trim() === '') return false;

  if (Array.isArray(value) && value.length === 0) return false;

  if (typeof value === 'object' && !Array.isArray(value)) {
    if (Object.keys(value).length === 0) return false;
  }

  if (typeof value === 'number' && isNaN(value)) return false;

  return true;
}

module.exports = {
    isNotEmpty
}
