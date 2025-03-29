import {
  Button,
  Card,
  Form,
  Input,
  message,
  Space,
  Spin,
  Typography,
  Upload,
} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import jwtAxios from '../../../utils/jwtAxios';
import { useLocation, useNavigate } from 'react-router-dom';
import add_customer from '../../../assets/add_customer.svg';
const { Title } = Typography;

const ProductAdd = () => {
  const [form] = Form.useForm(); // ✅ Use Ant Design form instance
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [imageBase64List, setImageBase64List] = useState([]);
  const [imagesList, setImagesList] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();
  const productId = location.state?.product_id || null;
  useEffect(() => {
    LocalData();
    if (productId) {
      productData();
    }
  }, [productId]);

  const LocalData = () => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      const data = JSON.parse(storedUser);
      setData(data);
    }
  };

  const productData = () => {
    jwtAxios
      .get(`/products/${productId}`)
      .then((res) => {
        console.log(res.data);
        form.setFieldsValue({ ...res.data });
        if (res.data.images) {
          setImagesList(res.data.images);
        }
      })
      .catch((err) => message.error(err.response?.data?.message));
  };
  // Convert Image to Base64
  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });

  // Handle Multiple Image Uploads
  const handleImageUpload = async ({ fileList }) => {
    const base64Images = await Promise.all(
      fileList.map(async (file) => {
        if (!file.url && !file.preview) {
          file.preview = await getBase64(file.originFileObj);
        }
        return file.preview;
      }),
    );

    setImageBase64List(base64Images);
    form.setFieldsValue({ images: base64Images }); // Save in form
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
        images: imageBase64List.length > 0 ? imageBase64List : imagesList, // Multiple images
      };

      if (!productId) {
        // Only add createdBy when creating a new product
        newProduct.createdBy = data.id;
      }

      if (productId) {
        // UPDATE customer if productId exists
        const res = await jwtAxios.put(`/products/${productId}`, newProduct);
        message.success(res.data.message);
        productData();
        setImageBase64List([]);
      } else {
        // CREATE new customer
        const res = await jwtAxios.post(`products`, newProduct);
        message.success(res.data.message);
        form.resetFields(); // Reset form after submission
        setImageBase64List([]);
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
            <Form.Item label="Product Images" name="images">
              <Upload
                listType="picture-card"
                multiple
                beforeUpload={() => false} // Disable default upload
                onChange={handleImageUpload}
                accept="image/*"
              >
               + Upload
                {/* <Button icon={<UploadOutlined />}>Upload Images</Button> */}
              </Upload>
            </Form.Item>
            {/* Image Previews */}
            <Form.Item>
              <div className="flex gap-2 flex-wrap mt-2">
                {imagesList.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Uploaded-${index}`}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                ))}
              </div>
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
