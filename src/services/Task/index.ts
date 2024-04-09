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

export async function updateTaskById(
    params: {
        taskId: number, taskName?: String, description?: String, state?: String, deadline?: Date
    },
    ) {
    return request<API.FakeCaptcha>('/task/updateTaskById', {
        method: 'post',
        data: params,
    });
}

export async function addTask(
    params: {
        taskName: String, description?: String, state?: String, deadline?: Date
    },
    ) {
    return request<API.FakeCaptcha>('/task/addTask', {
        method: 'post',
        data: params,
    });
}