import React, { useEffect, useState } from 'react';
import jwtAxios from '../../../utils/jwtAxios';
import {
  Avatar,
  Button,
  Card,
  Empty,
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
  const [customers, setCustomers] = useState([]);
  const [tableView, setTableView] = useState(true);
  const [loading, setLoading] = useState(true); // State to manage loading
  const [data, setData] = useState([]); // State to store local data
  const navigate = useNavigate();
  useEffect(() => {
    getCustomers();
    LocalData();
  }, []);

  const LocalData = () => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      const data = JSON.parse(storedUser);
      setData(data);
    }
  };
  const getCustomers = () => {
    jwtAxios
      .get(`products`)
      .then((res) => {
        setCustomers(res.data);
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
      const res = await jwtAxios.delete(`/emp/${id}`);
      message.success(res.data.message);
      getCustomers();
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
      title: 'Image'.toUpperCase(),
      dataIndex: 'productName',
      key: 'productName',
      render: (name) => (
        <Avatar className="bg-white text-indigo-600 font-bold shadow-md">
          {name.charAt(0).toUpperCase()}
        </Avatar>
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
    },
    {
      title: 'Color'.toUpperCase(),
      dataIndex: 'color',
      key: 'color',
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
                  title="Delete Customer"
                  description="Are you sure you want to delete this customer?"
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
    <div className="p-6 bg-white rounded-lg shadow-sm">
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
          dataSource={customers}
          columns={columns}
          loading={loading}
          rowKey="_id"
          bordered
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: <Empty description="No Products Found" /> }}
          scroll={{ x: 'max-content' }}
        />
      ) : (
        // Card View
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {customers.length > 0 ? (
            customers.map((product) => (
              <Card
                key={product._id}
                hoverable
                className=" rounded-lg transition-transform transform hover:scale-105"
                cover={
                  <div className="h-40 bg-gray-100 flex justify-center items-center">
                    <Avatar size={64} className="bg-indigo-600 text-white">
                      {product.productName.charAt(0).toUpperCase()}
                    </Avatar>
                  </div>
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
                        <span className="font-semibold">Price:</span>  ₹
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
    </div>
  );
};

export default Products;
