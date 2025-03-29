import React, { useEffect, useState } from 'react';
import jwtAxios from '../../../utils/jwtAxios';
import {
  Avatar,
  Button,
  Card,
  Empty,
  Image,
  message,
  Popconfirm,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import {
  AppstoreOutlined,
  PlusOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const { Title } = Typography;
const Products = () => {
  const [products, setProducts] = useState([]);
  const [tableView, setTableView] = useState(true);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [data, setData] = useState([]); // State to store local data
  const navigate = useNavigate();
  useEffect(() => {
    getProducts();
    LocalData();
  }, []);

  const LocalData = () => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      const data = JSON.parse(storedUser);
      setData(data);
    }
  };
  const getProducts = () => {
    jwtAxios
      .get(`products`)
      .then((res) => {
        setProducts(res.data);
        setTableView(res.data);
        setLoading(false);
      })
      .catch((err) => {
        message.error(err.response.message);
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    try {
      const res = await jwtAxios.delete(`/products/${id}`);
      message.success(res.data.message);
      getProducts();
    } catch (error) {
      message.error(error.response?.data?.message);
    }
  };

  const handleEdit = (id) => {
    navigate('/product-add', { state: { product_id: id } });
  };

  // Table Columns
  const columns = [
    {
      title: 'IMAGE',
      dataIndex: 'images',
      key: 'images',
      render: (images) =>
        images?.length > 0 ? (
          <Image.PreviewGroup>
            {images.slice(0, 3).map((img, index) => (
              <Image
                key={index}
                src={img}
                width={100}
                height={100}
                style={{ borderRadius: 8, marginRight: 8 }}
              />
            ))}
          </Image.PreviewGroup>
        ) : (
          <Image
            width={100}
            height={100}
            style={{ borderRadius: 8, marginRight: 8 }}
            src="error"
            fallback="data:image/png;base64,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"
          />
        ),
    },
    {
      title: 'Product'.toUpperCase(),
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Price'.toUpperCase(),
      dataIndex: 'price',
      key: 'price',
      render: (price) => `₹${price}`,

    },
    {
      title: 'Color'.toUpperCase(),
      dataIndex: 'color',
      key: 'color',
      truncate: true,
    },
    {
      title: 'Description'.toUpperCase(),
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Category'.toUpperCase(),
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Customer'.toUpperCase(),
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (emp) => <Button type="link">{emp?.name}</Button>,
    },
    ...(data.roleId === 1
      ? [
          {
            title: 'Actions'.toUpperCase(),
            render: (record) => (
              <Space size="middle">
                <Button type="link" onClick={() => handleEdit(record._id)}>
                  Edit
                </Button>
                <Popconfirm
                  title="Delete Product"
                  description="Are you sure you want to delete this Product?"
                  onConfirm={() => handleDelete(record._id)}
                  okText="Yes"
                  cancelText="No"
                >
                  <Button type="link" danger>
                    Delete
                  </Button>
                </Popconfirm>
              </Space>
            ),
          },
        ]
      : []),
  ];

  return (
    <Card className="shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>Products</Title>
        <Space>
          {data.roleId === 1 && (
            <>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                iconPosition="end"
                onClick={() => navigate('/product-add')}
              >
                Add
              </Button>
            </>
          )}
          <Tooltip title={tableView ? 'Card View' : 'Table View'}>
            <Button
              type="primary"
              icon={tableView ? <TableOutlined /> : <AppstoreOutlined />}
              onClick={() => setTableView(!tableView)}
            />
          </Tooltip>
        </Space>
      </div>

      {/* Table View */}
      {tableView ? (
        <Table
          dataSource={products}
          columns={columns}
          loading={loading}
          rowKey="_id"
          bordered
          pagination={{
            pageSizeOptions: ['5', '10', '20', '50'], // Page size options
            showSizeChanger: true, // Allow users to change page size
            defaultPageSize: 10, // Default rows per page
          }}
          locale={{ emptyText: <Empty description="No Products Found" /> }}
          scroll={{ x: 'max-content', y: 500 }}
          size="small"
        />
      ) : (
        // Card View
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {products.length > 0 ? (
            products.map((product) => (
              <Card
                size="small"
                key={product._id}
                hoverable
                cover={
                  product.images?.length > 0 ? (
                    <Avatar
                      src={product.images[0]}
                      alt={product.productName}
                      className="h-52 w-full object-cover rounded-t-lg"
                    />
                  ) : (
                    <div className="h-52 bg-gray-200 flex justify-center items-center text-gray-500">
                      No Image Available
                    </div>
                  )
                }
                actions={
                  data.roleId === 1
                    ? [
                        <Button
                          type="link"
                          key="edit"
                          onClick={() => handleEdit(product._id)}
                        >
                          Edit
                        </Button>,
                        <Popconfirm
                          title="Delete Product"
                          description="Are you sure you want to delete this product?"
                          onConfirm={() => handleDelete(product._id)}
                          okText="Yes"
                          cancelText="No"
                          key="delete"
                        >
                          <Button type="link" danger>
                            Delete
                          </Button>
                        </Popconfirm>,
                      ]
                    : []
                }
              >
                <Card.Meta
                  title={product.productName}
                  description={
                    <div className="text-gray-600">
                      <p>
                        <span className="font-semibold">Price:</span> ₹
                        {product.price}
                      </p>
                      <p>
                        <span className="font-semibold">Color:</span>{' '}
                        {product.color}
                      </p>
                      <p>
                        <span className="font-semibold">Category:</span>{' '}
                        {product.category}
                      </p>
                      <p className="truncate">
                        <span className="font-semibold">Description:</span>{' '}
                        {product.description}
                      </p>
                    </div>
                  }
                />
              </Card>
            ))
          ) : (
            <Empty description="No Products Found" className="col-span-full" />
          )}
        </div>
      )}
    </Card>
  );
};

export default Products;
