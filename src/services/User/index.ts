import { request } from '@umijs/max';

export async function login(
  params: {
    username: string;
    password: string
  },
) {
  return request('/login/employee', {
    method: 'post',
    data: params,
  });
}

export async function  checkLogin(){
  return request('/checkLogin', {
      method: 'get',
  });
}

export async function getEmployee(
  id: number,
) {
  return request('/employees/' + id, {
      method: 'get'
  });
}

export async function  outLogin(){
  return request<API.FakeCaptcha>('/logout/employee', {
      method: 'get',
      // data: params,
    });
}