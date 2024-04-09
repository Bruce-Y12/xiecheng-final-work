import { request } from '@umijs/max';

export async function login(
  params: {
    username: string;
    password: string
  },
) {
  return request<API.FakeCaptcha>('/login/employee', {
    method: 'post',
    data: params,
  });
}

export async function register(
    params: {
      username: string;
      password: string
    },
  ) {
    return request<API.FakeCaptcha>('/user/register', {
      method: 'post',
      data: params,
    });
  }

  export async function  checkLogin(){
    return request<API.FakeCaptcha>('/user/checkLogin', {
        method: 'get',
        // data: params,
      });
  }

  export async function  outLogin(){
    return request<API.FakeCaptcha>('/user/logout', {
        method: 'get',
        // data: params,
      });
  }