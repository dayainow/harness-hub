
export interface IResponse<T> {
	result: T;
}

// API 리스트 응답 공통 구조 (페이징)
export interface IResponseList<T> {
  data: {
    items?: T[]
    total?: number
  }
}

export interface IRequestPaging {
	offset?: string | number;
	limit?: string | number;
  page?:string | number;
	status?: string | number;
	sort? : string | number;
}

export interface IRequestFilter extends IRequestPaging {
	sort?: string; // desc | asc
	order?: string;
	keyword?: string;
  search?: string;
}
