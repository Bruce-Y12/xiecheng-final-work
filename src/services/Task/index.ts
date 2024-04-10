import { request } from '@umijs/max';

export async function getArticles(status?: number) {
    return request<API.FakeCaptcha>('/articles', {
        method: 'get',
        params: {
            status: status // 将 status 参数作为查询参数传递
        }
    });
}

export async function deleteArticles(
    articleId: number
) {
    return request('/articles/' + articleId, {
    method: 'delete'
    });
}


export async function getCountByStatus() {
    return request('/articles/status/count', {
        method: 'get',
    });
}

export async function updateStatus(params: {
    id: number,
    employee_id: number,
    status: number,
    rejected_reason?: string
}) {
    return request('/articles/status/' + params.id, {
        method: 'PUT',
        data: params
    });
}

