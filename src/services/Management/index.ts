import { request } from '@umijs/max';

export async function getUserInfo() {
  return request<API.FakeCaptcha>('/user/getUserInfo', {
    method: 'get',
  });
}

export async function updatePermission(
    params:{
        uid: number,
        authority: String,
    }
) {
    return request<API.FakeCaptcha>('/user/updatePermission', {
      method: 'post',
      data: params
    });
  }