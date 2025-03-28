import {
  Button,
  Card,
  Form,
  Input,
  message,
  Space,
  Spin,
  Typography,
} from 'antd';
import React, { useEffect, useState } from 'react';
import jwtAxios from '../../../utils/jwtAxios';
import { useLocation, useNavigate } from 'react-router-dom';
import add_customer from '../../../assets/add_customer.svg';
const { Title } = Typography;

const ProductAdd = () => {
  const [form] = Form.useForm(); // ✅ Use Ant Design form instance
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.state?.product_id || null;
  useEffect(() => {
    LocalData();
    if (productId) {
      customerData();
    }
  }, [productId]);

  const LocalData = () => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      const data = JSON.parse(storedUser);
      setData(data);
    }
  };

  const customerData = () => {
    jwtAxios
      .get(`/products/${productId}`)
      .then((res) => {
        console.log(res.data);
        form.setFieldsValue({ ...res.data });
      })
      .catch((err) => message.error(err.response?.data?.message));
  };

  // Handle form submission (Create or Update)
  const handleSubmit = async (values) => {
    setLoading(true);
    try {
      const newProduct = {
        productName: values.productName,
        price: values.price,
        category: values.category,
        color: values.color,
        description: values.description,
      };

      if (!productId) {
        // Only add createdBy when creating a new product
        newProduct.createdBy = data.id;
      }

      if (productId) {
        // UPDATE customer if productId exists
        const res = await jwtAxios.put(`/products/${productId}`, newProduct);
        message.success(res.data.message);
      } else {
        // CREATE new customer
        const res = await jwtAxios.post(`products`, newProduct);
        message.success(res.data.message);
        form.resetFields(); // Reset form after submission
      }
    } catch (error) {
      message.error(error.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="grid lg:grid-cols-2">
      <Card>
        <Title level={3}>{productId ? 'Edit Product' : 'Add Product'}</Title>
        <Spin spinning={loading} tip={productId ? 'Updating' : 'Submitting'}>
          <Form layout="vertical" form={form} onFinish={handleSubmit}>
            <Form.Item
              label="Product Name"
              name="productName"
              rules={[
                {
                  required: true,
                  message: 'Enter product name!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="price"
              name="price"
              rules={[
                {
                  required: true,
                  message: 'Enter product price!',
                },
              ]}
            >
              <Input type="number" min="1" />
            </Form.Item>

            <Form.Item
              label="Color"
              name="color"
              rules={[
                {
                  required: true,
                  message: 'Enter product color!',
                },
              ]}
            >
              <Input />
            </Form.Item>
            <Form.Item
              label="Category"
              name="category"
              rules={[
                {
                  required: true,
                  message: 'Enter product category!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: 'Enter product description!',
                },
              ]}
            >
              <Input.TextArea />
            </Form.Item>

            <Form.Item>
              <Space>
                <Button
                  variant="outlined"
                  onClick={() => navigate('/products')}
                >
                  Cancle
                </Button>
                <Button type="primary" htmlType="submit">
                  {productId ? 'Update' : 'Save'}
                </Button>
              </Space>
            </Form.Item>
          </Form>
        </Spin>
      </Card>
      <div className="hidden lg:flex items-center justify-center">
        <img
          src={add_customer}
          alt="Customer Illustration"
          className="w-full max-w-lg h-auto  object-cover"
        />
      </div>
    </div>
  );
};

export default ProductAdd;
