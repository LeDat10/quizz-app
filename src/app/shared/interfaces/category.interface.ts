export interface CategoryForDropDown {
  id: string | number;
  title: string;
}

export interface CategoryForDropDownReponse {
  message?: string;
  data: CategoryForDropDown[];
  meta?: any;
}
