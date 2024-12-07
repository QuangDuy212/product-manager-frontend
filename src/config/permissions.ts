export const ALL_PERMISSIONS = {
    CATEGORIES: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/categories', module: "CATEGORIES" },
        CREATE: { method: "POST", apiPath: '/api/v1/categories', module: "CATEGORIES" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/categories', module: "CATEGORIES" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/categories/{id}', module: "CATEGORIES" },
    },
    TAGS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/tags', module: "TAGS" },
        CREATE: { method: "POST", apiPath: '/api/v1/tags', module: "TAGS" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/tags', module: "TAGS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/tags/{id}', module: "TAGS" },
    },
    PERMISSIONS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
        CREATE: { method: "POST", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/permissions', module: "PERMISSIONS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/permissions/{id}', module: "PERMISSIONS" },
    },
    ORDERS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/orders', module: "ORDERS" },
        CREATE: { method: "POST", apiPath: '/api/v1/orders', module: "ORDERS" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/orders', module: "ORDERS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/orders/{id}', module: "ORDERS" },
        EXPORT: { method: "GET", apiPath: '/api/v1/orders/excel/export', module: "ORDERS" },
    },
    ROLES: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/roles', module: "ROLES" },
        CREATE: { method: "POST", apiPath: '/api/v1/roles', module: "ROLES" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/roles', module: "ROLES" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/roles/{id}', module: "ROLES" },
    },
    USERS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/users', module: "USERS" },
        CREATE: { method: "POST", apiPath: '/api/v1/users', module: "USERS" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/users/{id}', module: "USERS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/users/{id}', module: "USERS" },
        EXPORT: { method: "GET", apiPath: '/api/v1/users/excel/export', module: "USERS" },
        IMPORT: { method: "POST", apiPath: '/api/v1/users/excel/import', module: "USERS" },
    },
    PRODUCTS: {
        GET_PAGINATE: { method: "GET", apiPath: '/api/v1/products', module: "PRODUCTS" },
        CREATE: { method: "POST", apiPath: '/api/v1/products', module: "PRODUCTS" },
        UPDATE: { method: "PUT", apiPath: '/api/v1/products/{id}', module: "PRODUCTS" },
        DELETE: { method: "DELETE", apiPath: '/api/v1/products/{id}', module: "PRODUCTS" },
        EXPORT: { method: "GET", apiPath: '/api/v1/products/excel/export', module: "PRODUCTS" },
        IMPORT: { method: "POST", apiPath: '/api/v1/products/excel/import', module: "PRODUCTS" },
    },
}

export const ALL_MODULES = {
    PRODUCTS: 'PRODUCTS',
    FILES: 'FILES',
    TAGS: 'TAGS',
    PERMISSIONS: 'PERMISSIONS',
    RESUMES: 'RESUMES',
    ROLES: 'ROLES',
    USERS: 'USERS',
    SUBSCRIBERS: 'SUBSCRIBERS'
}
