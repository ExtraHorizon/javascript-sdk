export const createPagedResponse = dataObject => ({
  page: {
    total: 1,
    offset: 0,
    limit: 20,
  },
  data: [dataObject],
});
