export interface IBackendRes<T> {
    error?: string | string[];
    message: string;
    statusCode: number | string;
    data?: T;
}

export interface IModelPaginate<T> {
    meta: {
        current: number;
        pageSize: number;
        pages: number;
        total: number;
    },
    result: T[]
}

export interface IAccount {
    access_token: string;
    user: {
        _id: string;
        address: string;
        name: string;
        role: {
            _id: string;
            name: string;
            permissions: {
                _id: string;
                name: string;
                apiPath: string;
                method: string;
                module: string;
            }[]
        }
    }
}

export interface IGetAccount extends Omit<IAccount, "access_token"> { }

export interface ICompany {
    id?: string;
    name?: string;
    address?: string;
    logo: string;
    description?: string;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IProduct {
    _id?: string;
    name?: string;
    shortDes?: string;
    thumbnail: string;
    sliders?: string[];
    price: double;
    quantity: number;
    discount: number;
    active?: boolean;
    category?: ICategory;
    tags?: ITag[];
    createdBy?: string;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ICreatationProduct {
    name: string;
    thumbnail: string;
    sliders: string[];
    price: number;
    shortDes: string;
    quantity: number;
    discount: number;
    categoryId: string;
    tagsId: string[];
}

export interface IUpdateProduct {
    name?: string;
    thumbnail?: string;
    sliders?: string[];
    price?: number;
    color?: string;
    quantity?: number;
    discount?: number;
    categoryId?: string;
    tagsId?: string[];
}

export interface ICategory {
    _id?: string;
    name?: string;
    products?: IProduct[];
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ITag {
    _id?: string;
    name?: string;
    description?: string;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IOrder {
    _id?: string;
    totalPrice?: number;
    reciverName?: string;
    reciverAddress?: string;
    reciverPhone?: string;
    status?: string;
    user?: IUser;
    orderDetails?: IOrderDetail[];
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface IOrderCreatationRequest {
    totalPrice?: number;
    reciverName?: string;
    reciverAddress?: string;
    reciverPhone?: string;
    status?: string;
    userId: string;
    detail: { _id: string, quantity: number }[]
}

export interface IOrderDetail {
    _id?: string;
    quantity?: number;
    price?: number;
    product?: IProduct;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    updatedBy?: string;
}

export interface ISkill {
    id?: string;
    name?: string;
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IString {
    message: String;
}

export interface ICartDetail {
    _id?: string;
    quantity?: number;
    price?: number;
    product?: IProduct;
    createdBy?: string;
    updatedBy?: string;
    createdAt?: string;
    updatedAt?: string;
}

export interface ICart {
    _id?: string;
    sum?: number;
    cartDetails?: ICartDetail[];
    createdBy?: string;
    updatedBy?: string;
    createdAt?: string;
    updatedAt?: string;
}



export interface IUser {
    _id?: string;
    name?: string;
    username?: string;
    password?: string;
    address?: string;
    role?: {
        _id: string;
        name: string;
    }
    createdBy?: string;
    updatedBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IJob {
    id?: string;
    name: string;
    skills: ISkill[];
    company?: {
        id: string;
        name: string;
        logo?: string;
    }
    location: string;
    salary: number;
    quantity: number;
    level: string;
    description: string;
    startDate: Date;
    endDate: Date;
    active: boolean;

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IResume {
    id?: string;
    email: string;
    userId: string;
    url: string;
    status: string;
    companyId: string | {
        id: string;
        name: string;
        logo: string;
    };
    jobId: string | {
        id: string;
        name: string;
    };
    history?: {
        status: string;
        updatedAt: Date;
        updatedBy: { id: string; email: string }
    }[]
    createdBy?: string;
    active?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface IPermission {
    _id?: string;
    name?: string;
    apiPath?: string;
    method?: string;
    module?: string;

    createdBy?: string;
    active?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;

}

export interface IRole {
    _id?: string;
    name: string;
    description: string;
    active: boolean;
    permissions: IPermission[] | string[];

    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}

export interface ISubscribers {
    id?: string;
    name?: string;
    email?: string;
    skills: string[];
    createdBy?: string;
    isDeleted?: boolean;
    deletedAt?: boolean | null;
    createdAt?: string;
    updatedAt?: string;
}