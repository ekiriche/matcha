export function objectToQueryString(obj) {
   var query = Object.keys(obj)
       .filter(key => obj[key] !== '' && obj[key] !== null)
       .map(key => key + '=' + obj[key])
       .join('&');
   return query;
}

/* return query.length > 0 ? '?' + query : null; add '?' on the start of string*/
