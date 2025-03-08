import {
  Button,
  Card,
  Form,
  Input,
  message,
  Select,
  Space,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import jwtAxios from '../../../utils/jwtAxios';
import { Navigate, useNavigate } from 'react-router-dom';
const { Text, Title } = Typography;

const CustomerAdd = () => {
  const [form] = Form.useForm(); // ✅ Use Ant Design form instance
  const [role, setRole] = useState([]);
  const navigate = useNavigate();
  useEffect(() => {
    jwtAxios
      .get(`role`)
      .then((res) => {
        setRole(
          res.data.map((r) => ({
            value: r.name,
            label: r.name,
          })),
        );
      })
      .catch((err) => message.error(err.message));
  }, []);

  const handleSubmit = (values) => {
    const newCustomer = {
      name: values.name,
      email: values.email,
      password: values.password,
      age: values.age,
      roleName: values.rolename, // ✅ Role value is already selected
    };
    jwtAxios
      .post(`emp`, newCustomer)
      .then((res) => {
        message.success(res.data.message);
        form.resetFields(); // ✅ Reset form after submission
      })
      .catch((err) => message.error(err.response?.data?.message));
  };
  return (
    <div className="grid grid-cols-2">
      <Card>
        <Title level={3}>Customer Add</Title>
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <Form.Item
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input your name!',
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            label="Age"
            name="age"
            rules={[
              {
                required: true,
                message: 'Please input your age!',
              },
            ]}
          >
            <Input type="number" min="1" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              {
                required: true,
                message: 'Please input your email!',
              },
            ]}
          >
            <Input type="email" />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              {
                required: true,
                message: 'Please input your password!',
              },
            ]}
          >
            <Input.Password />
          </Form.Item>
          <Form.Item
            label="Role"
            name="rolename"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Select
              className="w-full"
              placeholder="Select Role"
              options={role}
            />
          </Form.Item>
          <Form.Item>
            <Space>
              <Button variant="outlined" onClick={() => navigate('/customers')}>
                Cancle
              </Button>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CustomerAdd;
