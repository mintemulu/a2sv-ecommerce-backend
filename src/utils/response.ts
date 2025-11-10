type BaseResponse<T> = {
  success: boolean;
  message: string;
  object: T | null;
  errors: string[] | null;
};

type PaginatedResponse<T> = {
  success: boolean;
  message: string;
  object: T[];
  pageNumber: number;
  pageSize: number;
  totalSize: number;
  errors: string[] | null;
};

export const ok = <T>(object: T, message = 'OK'): BaseResponse<T> => ({
  success: true,
  message,
  object,
  errors: null,
});

export const created = <T>(object: T, message = 'Created'): BaseResponse<T> => ({
  success: true,
  message,
  object,
  errors: null,
});

export const fail = (message: string, errors?: string[]): BaseResponse<null> => ({
  success: false,
  message,
  object: null,
  errors: errors ?? [message],
});

export const paginated = <T>(args: {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalSize: number;
  message?: string;
}): PaginatedResponse<T> => ({
  success: true,
  message: args.message ?? 'OK',
  object: args.data,
  pageNumber: args.pageNumber,
  pageSize: args.pageSize,
  totalSize: args.totalSize,
  errors: null,
});
