import { ICart, IOrderCreatationRequest } from './../types/backend.d';
import { IBackendRes, ICompany, IAccount, IUser, IModelPaginate, IGetAccount, IJob, IResume, IPermission, IRole, ISkill, ISubscribers, IString, IProduct, ICreatationProduct, IUpdateProduct, ICategory, ITag, IOrder } from '@/types/backend';
import axios from 'config/axios-customize';

/**
 * 
Module Auth
 */
export const callRegister = (data: { username: string; password: string; name: string; address: string; role: string }) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/auth/register', data)
}

export const callLogin = (username: string, password: string) => {
    return axios.post<IBackendRes<IAccount>>('/api/v1/auth/login', { username, password })
}

export const callFetchAccount = () => {
    return axios.get<IBackendRes<IGetAccount>>('/api/v1/auth/account')
}

export const callRefreshToken = () => {
    return axios.get<IBackendRes<IAccount>>('/api/v1/auth/refresh')
}

export const callLogout = () => {
    return axios.post<IBackendRes<string>>('/api/v1/auth/logout')
}

/**
 * 
Module Cart
 */

export const callFetchCart = () => {
    return axios.get<IBackendRes<ICart>>(`/api/v1/carts`);
}

export const callAddAProductToCart = (data: { productId: string; quantity: number }) => {
    return axios.post<IBackendRes<ICart>>(`/api/v1/carts/add`, data);
}

export const callChangeQuantityInCart = (data: { productId: string; quantity: number }) => {
    return axios.post<IBackendRes<ICart>>(`/api/v1/carts/change`, data);
}

export const callDeleteACartDetail = (id: string) => {
    return axios.post<IBackendRes<ICart>>(`/api/v1/carts/delete/${id}`)
}

/**
 * Upload single file
 */
export const callUploadSingleFile = (file: any, folder: string) => {
    const bodyFormData = new FormData();
    bodyFormData.append('file', file);
    bodyFormData.append('folder', folder);

    return axios<IBackendRes<{ fileName: string }>>({
        method: 'post',
        url: '/api/v1/file/upload',
        data: bodyFormData,
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
}






/**
 * 
Module Product
 */
export const callCreateProduct = (data: ICreatationProduct) => {
    return axios.post<IBackendRes<IProduct>>('/api/v1/products', data)
}

export const callUpdateProduct = (id: string, data: IUpdateProduct) => {
    return axios.put<IBackendRes<IProduct>>(`/api/v1/products/${id}`, data)
}

export const callDeleteProduct = (id: string) => {
    return axios.delete<IBackendRes<IProduct>>(`/api/v1/products/${id}`);
}

export const callFetchProduct = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IProduct>>>(`/api/v1/products?${query}`);
}

export const callFetchProductById = (id: string) => {
    return axios.get<IBackendRes<IProduct>>(`/api/v1/products/${id}`);
}

export const callFetchProductByCategory = (id: string, query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IProduct>>>(`/api/v1/products/category/${id}?${query}`);
}

export const callImportProduct = (file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return axios.post(`/api/v1/products/excel/import`, formData, config);
}

export const callExportProduct = () => {
    return axios.get('/api/v1/products/excel/export', {
        responseType: 'blob', // Nhận dữ liệu dưới dạng file
    });
}


export const callSearchProduct = (query: string) => {
    return axios.get(`/api/v1/products/search?${query}`)
}


/**
 * 
Module Category
 */
export const callFetchCategory = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ICategory>>>(`/api/v1/categories?${query}`);
}

export const callCreateCategory = (data: ICategory) => {
    return axios.post<IBackendRes<ICategory>>('/api/v1/categories', data)
}

export const callUpdateCategory = (id: string, data: ICategory) => {
    return axios.put<IBackendRes<ICategory>>(`/api/v1/categories/${id}`, data)
}

export const callDeleteCategory = (id: string) => {
    return axios.delete<IBackendRes<ICategory>>(`/api/v1/categories/${id}`);
}

export const callFetchCategoryById = (id: string) => {
    return axios.get<IBackendRes<ICategory>>(`/api/v1/categories/${id}`);
}

/**
 * 
Module Tag
 */
export const callFetchTag = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ITag>>>(`/api/v1/tags?${query}`);
}

export const callCreateTag = (data: ITag) => {
    return axios.post<IBackendRes<ITag>>('/api/v1/tags', data)
}

export const callUpdateTag = (id: string, data: ITag) => {
    return axios.put<IBackendRes<ITag>>(`/api/v1/tags/${id}`, data)
}

export const callDeleteTag = (id: string) => {
    return axios.delete<IBackendRes<ITag>>(`/api/v1/tags/${id}`);
}

export const callFetchTagById = (id: string) => {
    return axios.get<IBackendRes<ITag>>(`/api/v1/tags/${id}`);
}




/**
 * 
Module Skill
 */
export const callCreateSkill = (name: string) => {
    return axios.post<IBackendRes<ISkill>>('/api/v1/skills', { name })
}

export const callUpdateSkill = (id: string, name: string) => {
    return axios.put<IBackendRes<ISkill>>(`/api/v1/skills`, { id, name })
}

export const callDeleteSkill = (id: string) => {
    return axios.delete<IBackendRes<ISkill>>(`/api/v1/skills/${id}`);
}

export const callFetchAllSkill = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ISkill>>>(`/api/v1/skills?${query}`);
}



/**
 * 
Module User
 */
export const callCreateUser = (user: IUser) => {
    return axios.post<IBackendRes<IUser>>('/api/v1/users', { ...user })
}

export const callUpdateUser = (id: string, user: IUser) => {
    return axios.put<IBackendRes<IUser>>(`/api/v1/users/${id}`, { ...user })
}

export const callDeleteUser = (id: string) => {
    return axios.delete<IBackendRes<IUser>>(`/api/v1/users/${id}`);
}

export const callFetchUser = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IUser>>>(`/api/v1/users?${query}`);
}

export const callImportUser = (file: any) => {
    const formData = new FormData();
    formData.append("file", file);
    const config = {
        headers: {
            'content-type': 'multipart/form-data'
        }
    }
    return axios.post(`/api/v1/users/excel/import`, formData, config);
}

export const callExportUser = () => {
    return axios.get('/api/v1/users/excel/export', {
        responseType: 'blob', // Nhận dữ liệu dưới dạng file
    });
}

/**
 * 
Module Job
 */
export const callCeateOrder = (data: IOrderCreatationRequest) => {
    return axios.post<IBackendRes<IOrder>>('/api/v1/orders', { ...data })
}

export const callUpdateOrder = (id: string, data: IOrder) => {
    return axios.put<IBackendRes<IOrder>>(`/api/v1/orders/${id}`, { ...data })
}

export const callDeleteOrder = (id: string) => {
    return axios.delete<IBackendRes<IOrder>>(`/api/v1/orders/${id}`);
}

export const callFetchOrder = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IOrder>>>(`/api/v1/orders?${query}`);
}

export const callFetchOrderById = (id: string) => {
    return axios.get<IBackendRes<IOrder>>(`/api/v1/orders/${id}`);
}

export const callFetchHistory = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IOrder>>>(`/api/v1/orders/history?${query}`);
}

export const callExportOrder = () => {
    return axios.get('/api/v1/orders/export/excel', {
        responseType: 'blob', // Nhận dữ liệu dưới dạng file
    });
}


/**
 * 
Module Job
 */
export const callCreateJob = (job: IJob) => {
    return axios.post<IBackendRes<IJob>>('/api/v1/jobs', { ...job })
}

export const callUpdateJob = (job: IJob, id: string) => {
    return axios.put<IBackendRes<IJob>>(`/api/v1/jobs`, { id, ...job })
}

export const callDeleteJob = (id: string) => {
    return axios.delete<IBackendRes<IJob>>(`/api/v1/jobs/${id}`);
}

export const callFetchJob = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IJob>>>(`/api/v1/jobs?${query}`);
}

export const callFetchJobById = (id: string) => {
    return axios.get<IBackendRes<IJob>>(`/api/v1/jobs/${id}`);
}

/**
 * 
Module Resume
 */
export const callCreateResume = (url: string, jobId: any, email: string, userId: string | number) => {
    return axios.post<IBackendRes<IResume>>('/api/v1/resumes', {
        email, url,
        status: "PENDING",
        user: {
            "id": userId
        },
        job: {
            "id": jobId
        }
    })
}

export const callUpdateResumeStatus = (id: any, status: string) => {
    return axios.put<IBackendRes<IResume>>(`/api/v1/resumes`, { id, status })
}

export const callDeleteResume = (id: string) => {
    return axios.delete<IBackendRes<IResume>>(`/api/v1/resumes/${id}`);
}

export const callFetchResume = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IResume>>>(`/api/v1/resumes?${query}`);
}

export const callFetchResumeById = (id: string) => {
    return axios.get<IBackendRes<IResume>>(`/api/v1/resumes/${id}`);
}

export const callFetchResumeByUser = () => {
    return axios.post<IBackendRes<IModelPaginate<IResume>>>(`/api/v1/resumes/by-user`);
}

/**
 * 
Module Permission
 */
export const callCreatePermission = (permission: IPermission) => {
    return axios.post<IBackendRes<IPermission>>('/api/v1/permissions', { ...permission })
}

export const callUpdatePermission = (permission: IPermission, id: string) => {
    return axios.put<IBackendRes<IPermission>>(`/api/v1/permissions`, { id, ...permission })
}

export const callDeletePermission = (id: string) => {
    return axios.delete<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}

export const callFetchPermission = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IPermission>>>(`/api/v1/permissions?${query}`);
}

export const callFetchPermissionById = (id: string) => {
    return axios.get<IBackendRes<IPermission>>(`/api/v1/permissions/${id}`);
}

/**
 * 
Module Role
 */
export const callCreateRole = (role: { name: string, description: string, active: boolean, perIds: string[] }) => {
    return axios.post<IBackendRes<IRole>>('/api/v1/roles', { ...role })
}

export const callUpdateRole = (role: { name: string, description: string, active: boolean, perIds: string[] }, id: string) => {
    return axios.put<IBackendRes<IRole>>(`/api/v1/roles/${id}`, { ...role })
}

export const callDeleteRole = (id: string) => {
    return axios.delete<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}

export const callFetchRole = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<IRole>>>(`/api/v1/roles?${query}`);
}

export const callFetchRoleById = (id: string) => {
    return axios.get<IBackendRes<IRole>>(`/api/v1/roles/${id}`);
}

/**
 * 
Module Subscribers
 */
export const callCreateSubscriber = (subs: ISubscribers) => {
    return axios.post<IBackendRes<ISubscribers>>('/api/v1/subscribers', { ...subs })
}

export const callGetSubscriberSkills = () => {
    return axios.post<IBackendRes<ISubscribers>>('/api/v1/subscribers/skills')
}

export const callUpdateSubscriber = (subs: ISubscribers) => {
    return axios.put<IBackendRes<ISubscribers>>(`/api/v1/subscribers`, { ...subs })
}

export const callDeleteSubscriber = (id: string) => {
    return axios.delete<IBackendRes<ISubscribers>>(`/api/v1/subscribers/${id}`);
}

export const callFetchSubscriber = (query: string) => {
    return axios.get<IBackendRes<IModelPaginate<ISubscribers>>>(`/api/v1/subscribers?${query}`);
}

export const callFetchSubscriberById = (id: string) => {
    return axios.get<IBackendRes<ISubscribers>>(`/api/v1/subscribers/${id}`);
}

