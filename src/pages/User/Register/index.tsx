import { register } from '@/services/User'; // 导入注册接口
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { FormattedMessage, history, useIntl, SelectLang, useModel} from '@umijs/max';
import { Alert, message } from 'antd';
import Settings from '../../../../config/defaultSettings';
import React, { useState } from 'react';
import { LoginForm, ProFormText } from '@ant-design/pro-form';
import { createStyles } from 'antd-style';


// Styles
const useStyles = createStyles(({ token }) => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
    overflow: 'auto',
    backgroundImage: "url('https://mdn.alipayobjects.com/yuyan_qk0oxh/afts/img/V-_oS6r-i7wAAAAAAAAAAAAAFl94AQBr')",
    backgroundSize: '100% 100%',
  },
}));

const RegisterMessage: React.FC<{
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

const Register: React.FC = () => {
  const intl = useIntl();
  const { styles } = useStyles();

  // 注册成功/失败的状态
  const [registerStatus, setRegisterStatus] = useState<string>('');

  const handleSubmit = async (values: any) => {
    try {
      // 调用注册接口
      const res = await register(values);
      if (res.code === '200') {
        // 注册成功
        message.success('注册成功！');
        // 跳转到登录页面
        history.push('/login');
      } else {
        // 注册失败
        message.error(res.msg);
      }
    } catch (error) {
      message.error('注册失败，请重试！');
    }
  };

  return (
    <div className={styles.container}>
      <div style={{ flex: '1', padding: '32px 0' }}>
        <LoginForm
          contentStyle={{ minWidth: 280, maxWidth: '75vw' }}
          logo={<img alt="logo" src="/logo.svg" />}
          title="注册"
          subTitle="注册一个新账号"
          initialValues={{
            autoLogin: true,
          }}
          onFinish={async (values) => {
            await handleSubmit(values);
          }}
        >
          {registerStatus === 'error' && (
            <RegisterMessage content="注册失败，请重试！" />
          )}
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
              prefix: <UserOutlined />,
            }}
            placeholder="用户名"
            rules={[
              {
                required: true,
                message: '请输入用户名！',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder="密码"
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
          <ProFormText.Password
            name="confirmPassword"
            fieldProps={{
              size: 'large',
              prefix: <LockOutlined />,
            }}
            placeholder="确认密码"
            dependencies={['password']}
            rules={[
              {
                required: true,
                message: '请确认密码！',
              },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('两次输入的密码不一致！'));
                },
              }),
            ]}
          />
        </LoginForm>
      </div>
      <Footer />
    </div>
  );
};

export default Register;
