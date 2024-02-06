function sort(items, attribute, ascending = true) {
    return [...items].sort((a, b) => {
      if (a[attribute] < b[attribute]) {
        return ascending ? -1 : 1;
      }
      if (a[attribute] > b[attribute]) {
        return ascending ? 1 : -1;
      }
      return 0;
    });
  };

export default sort;