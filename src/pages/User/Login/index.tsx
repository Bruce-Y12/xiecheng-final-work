import { Footer } from '@/components';
import { login } from '@/services/User';
import {
  LockOutlined,
  UserOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProFormText,
} from '@ant-design/pro-components';
import { FormattedMessage, history, SelectLang, useIntl, useModel, Helmet } from '@umijs/max';
import { Alert, message } from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, { useState } from 'react';
import { flushSync } from 'react-dom';
import { createStyles } from 'antd-style';
import showImage from '../../../../public/showImage.jpg'; // 导入本地图片

const useStyles = createStyles(({ token }) => {
  return {
    action: {
      marginLeft: '8px',
      color: 'rgba(0, 0, 0, 0.2)',
      fontSize: '24px',
      verticalAlign: 'middle',
      cursor: 'pointer',
      transition: 'color 0.3s',
      '&:hover': {
        color: token.colorPrimaryActive,
      },
    },
    lang: {
      width: 42,
      height: 42,
      lineHeight: '42px',
      position: 'fixed',
      right: 16,
      borderRadius: token.borderRadius,
      ':hover': {
        backgroundColor: token.colorBgTextHover,
      },
    },
    container: {
      display: 'flex',
      justifyContent: 'center', // 水平居中
      alignItems: 'center', // 垂直居中
      height: '100vh',
      overflow: 'auto',
      backgroundImage: 'linear-gradient(to top, #fff1eb 0%, #ace0f9 100%)'
    },
    content:{
        display: 'flex',
        maxWidth: '1000px', // 最大宽度为1200px，可以根据需要调整
        width: '100%',
    },
    leftSide: {
      flex: '1',
      overflow: 'hidden', // 隐藏溢出内容
      borderTopLeftRadius: '20px', // 左上角圆弧
      borderBottomLeftRadius: '20px', // 左下角圆弧
    },
    rightSide: {
      flex: '1',
      paddingLeft: '20px', // 右边留出一定的空白间隔
      display: 'flex',
      justifyContent: 'center', // 水平居中
      alignItems: 'center', // 垂直居中
      backgroundImage: 'linear-gradient(to top, #dfe9f3 0%, white 100%)',
      borderTopRightRadius: '20px', 
      borderBottomRightRadius: '20px', 
    },
    image:{
      maxWidth: '100%',
      maxHeight: '100%',
      borderTopLeftRadius: '20px', // 左上角圆弧
      borderBottomLeftRadius: '20px', // 左下角圆弧
    }
  };
});

const Lang = () => {
  const { styles } = useStyles();

  return (
    <div className={styles.lang} data-lang>
      {SelectLang && <SelectLang />}
    </div>
  );
};

const LoginMessage: React.FC<{
  content: string;
}> = ({ content }) => {
  return (
    <Alert
      style={{
        marginBottom: 24,
      }}
      message={content}
      type="error"
      showIcon
    />
  );
};

const Login: React.FC = () => {
  const [userLoginState, setUserLoginState] = useState<API.LoginResult>({});
  const { initialState, setInitialState } = useModel('@@initialState');
  const { styles } = useStyles();
  const intl = useIntl();

  const fetchUserInfo = async () => {
    const userInfo = await initialState?.fetchUserInfo?.();
    if (userInfo) {
      flushSync(() => {
        setInitialState((s) => ({
          ...s,
          currentUser: userInfo,
        }));
      });
    }
  };

  const handleSubmit = async (values: API.LoginParams) => {
    try {
      // 登录
      console.log("请求的参数：",values);
      const res = await login({ ...values});
      console.log("请求结果：",res);
      if (res.code == '200') {
        const defaultLoginSuccessMessage = intl.formatMessage({
          id: 'pages.login.success',
          defaultMessage: '登录成功！',
        });
        message.success(defaultLoginSuccessMessage);
        await fetchUserInfo();
        const urlParams = new URL(window.location.href).searchParams;
        history.push('/home/taskList');
        return;
      }
      else{
        const defaultLoginFailureMessage = intl.formatMessage({
          id: 'pages.login.failure',
          defaultMessage: res.msg,
        });
        message.error(defaultLoginFailureMessage);
      }
      console.log(res);
      // 如果失败去设置用户错误信息
      setUserLoginState(res);
    } catch (error) {
      const defaultLoginFailureMessage = intl.formatMessage({
        id: 'pages.login.failure',
        defaultMessage: '登录失败，请重试！',
      });
      console.log(error);
      message.error(defaultLoginFailureMessage);
    }
  };
  const { status } = userLoginState;

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.leftSide}>
          <img
            src={showImage}
            alt="Background"
            className={styles.image}
          />
        </div>
        <div className={styles.rightSide}>
          <Helmet>
            <title>
              {intl.formatMessage({
                id: 'menu.login',
                defaultMessage: '登录页',
              })}
              - {Settings.title}
            </title>
          </Helmet>
          <Lang />
          <div
            style={{
              flex: '1',
              padding: '32px 0',
            }}
          >
            <LoginForm
              contentStyle={{
                minWidth: 280,
                maxWidth: '75vw',
              }}
              logo={<img alt="logo" src="/logo.svg" />}
              title="审核管理系统"
              subTitle= "通过该平台对用户发布的游记进行管理"
              initialValues={{
                autoLogin: true,
              }}
              onFinish={async (values) => {
                await handleSubmit(values as API.LoginParams);
              }}
            >

              {status === 'error' && (
                <LoginMessage
                  content={intl.formatMessage({
                    id: 'pages.login.accountLogin.errorMessage',
                    defaultMessage: '账户或密码错误(admin/ant.design)',
                  })}
                />
              )}
              
                <>
                  <ProFormText
                    name="name"
                    fieldProps={{
                      size: 'large',
                      prefix: <UserOutlined />,
                    }}
                    placeholder={intl.formatMessage({
                      id: 'pages.login.name.placeholder',
                      defaultMessage: '用户名: admin or user',
                    })}
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage
                            id="pages.login.name.required"
                            defaultMessage="请输入用户名!"
                          />
                        ),
                      },
                    ]}
                  />
                  <ProFormText.Password
                    name="password"
                    fieldProps={{
                      size: 'large',
                      prefix: <LockOutlined />,
                    }}
                    placeholder={intl.formatMessage({
                      id: 'pages.login.password.placeholder',
                      defaultMessage: '密码: ant.design',
                    })}
                    rules={[
                      {
                        required: true,
                        message: (
                          <FormattedMessage
                            id="pages.login.password.required"
                            defaultMessage="请输入密码！"
                          />
                        ),
                      },
                    ]}
                  />
                  <div style={{ textAlign: 'right', marginTop: '8px' }}>

                  {/* <Button type="link" onClick={() => history.push('/register')}>
                    去注册
                  </Button> */}
                  </div>
                </>
            </LoginForm>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
