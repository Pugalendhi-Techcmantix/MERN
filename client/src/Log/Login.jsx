import React, { useState } from 'react';
import { Input, Button, Checkbox, Card, Form, Typography, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import login from '../assets/Mobile_login.svg';
import { LoginOutlined } from '@ant-design/icons';
import jwtAxios from '../utils/jwtAxios';

const { Title, Text } = Typography;

const Login = () => {
  const navigate = useNavigate(); // Use React Router for navigation
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const response = await jwtAxios.post(`emp/login`, values);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userData', JSON.stringify(response.data.employee));
      message.success('Login successful!');
      setTimeout(() => navigate('/'), 1000); // Redirect after success
    } catch (error) {
      message.error('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Left Side - Image */}
      <div className="hidden lg:flex w-1/2 bg-white h-full items-center justify-center">
        <img
          src={login}
          alt="Login Illustration"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <Card className="max-w-md w-full rounded-lg shadow-sm">
          <Title level={2} className="text-center text-gray-800 mb-6">
            Login
          </Title>

          <Form layout="vertical" onFinish={handleSubmit}>
            <Form.Item
              label="Email"
              name="email"
              rules={[{ required: true, message: 'Please enter your email' }]}
            >
              <Input placeholder="Enter your email" />
            </Form.Item>

            <Form.Item
              label="Password"
              name="password"
              rules={[
                { required: true, message: 'Please enter your password' },
              ]}
            >
              <Input.Password placeholder="Enter your password" />
            </Form.Item>

            <div className="flex justify-between items-center mb-4">
              <Form.Item name="remember" valuePropName="checked" noStyle>
                <Checkbox className="text-gray-600">Remember me</Checkbox>
              </Form.Item>

              <Button type="link" onClick={() => navigate('/forgot')}>
                Forgot password?
              </Button>
            </div>

            <Form.Item>
              <Button
                type="primary"
                block
                className="py-2"
                htmlType="submit"
                loading={loading}
                icon={<LoginOutlined />}
                iconPosition="end"
              >
                Login
              </Button>
            </Form.Item>
          </Form>

          <Text className="text-sm  text-gray-600 mt-4">
            Don't have an account?
            <Button type="link" className="-ms-3">
              Sign up
            </Button>
          </Text>
        </Card>
      </div>
    </div>
  );
};

export default Login;
