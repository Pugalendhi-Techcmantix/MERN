import {
  Button,
  Card,
  Form,
  Input,
  message,
  Select,
  Space,
  Spin,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import jwtAxios from '../../../utils/jwtAxios';
import { useLocation, useNavigate } from 'react-router-dom';
const { Title } = Typography;

const CustomerAdd = () => {
  const [form] = Form.useForm(); // ✅ Use Ant Design form instance
  const [role, setRole] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const customerId = location.state?.customer_id || null;
  useEffect(() => {
    roleData();
    LocalData();
    if (customerId) {
      customerData();
    }
  }, [customerId]);

  const LocalData = () => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      const data = JSON.parse(storedUser);
      setData(data);
    }
  };

  const roleData = () => {
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
  };

  const customerData = () => {
    jwtAxios
      .get(`/emp/${customerId}`)
      .then((res) => {
        console.log(res.data);
        form.setFieldsValue({ ...res.data, rolename: res.data.roleName });
      })
      .catch((err) => message.error(err.response?.data?.message));
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const newCustomer = {
        name: values.name,
        email: values.email,
        password: values.password,
        age: values.age,
        roleName: values.rolename,
      };

      if (customerId) {
        // UPDATE customer if customerId exists
        const res = await jwtAxios.put(`/emp/${customerId}`, newCustomer);
        message.success(res.data.message);
      } else {
        // CREATE new customer
        const res = await jwtAxios.post(`emp`, newCustomer);
        message.success(res.data.message);
        form.resetFields(); // Reset form after submission
      }

      // navigate('/customers'); // Redirect after success
    } catch (error) {
      message.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="grid grid-cols-2">
      <Card>
        <Title level={3}>{customerId ? 'Edit Customer' : 'Add Customer'}</Title>
        <Spin spinning={loading} tip={customerId ? 'Updating' : 'Submitting'}>
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
            {data.roleId == 1 ? (
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
            ) : (
              ''
            )}

            <Form.Item>
              <Space>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/customers')}
                >
                  Cancle
                </Button>
                <Button type="primary" htmlType="submit">
                  {customerId ? 'Update' : 'Save'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
    </div>
  );
};

export default CustomerAdd;
