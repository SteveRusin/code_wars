let count = 0;
Object.defineProperty(document, 'readyState', {
  get: () => {
    if (count++ === 0) {
      return 'loading';
    }

    return 'complete';
  }
});

