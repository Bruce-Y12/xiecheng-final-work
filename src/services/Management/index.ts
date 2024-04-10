import { request } from '@umijs/max';

export async function getUserInfo() {
  return request('/employees', {
    method: 'get',
  });
}

export async function updatePermission(
    params:{
        id: number,
        role: number,
    }
) {
    return request<API.FakeCaptcha>('/employee', {
      method: 'put',
      data: params
    });
  }

  export async function addEmployee(
    params:{
      name: String,
      role: number,
      password: String,
    }
) {
    return request<API.FakeCaptcha>('/employees', {
      method: 'post',
      data: params
    });
  }


export async function deleteEmployee(
    id: number
) {
    return request('/employees/' + id, {
    method: 'delete'
    });
}