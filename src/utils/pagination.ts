export const parsePagination = (query: any) => {
  const page = Math.max(1, parseInt(query.page as string) || 1);
  const pageSize = Math.max(1, parseInt((query.limit || query.pageSize) as string) || 10);
  const skip = (page - 1) * pageSize;
  const take = pageSize;
  return { page, pageSize, skip, take };
};
