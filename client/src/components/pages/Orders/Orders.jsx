import React, { useEffect, useState } from 'react';
import jwtAxios from '../../../utils/jwtAxios';
import {
  Avatar,
  Button,
  Card,
  Empty,
  List,
  message,
  Popconfirm,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import {
  AppstoreOutlined,
  PlusOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import moment from 'moment';

const { Title } = Typography;

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [tableView, setTableView] = useState(true);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
    loadUserData();
  }, []);

  // Load local user data
  const loadUserData = () => {
    const storedUser = localStorage.getItem('userData');
    if (storedUser) {
      setUserData(JSON.parse(storedUser));
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await jwtAxios.get('/orders');
      setOrders(res.data);
    } catch (err) {
      message.error(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setLoading(false);
    }
  };

  // Delete Order
  const handleDelete = async (id) => {
    try {
      await jwtAxios.delete(`/orders/${id}`);
      message.success('Order deleted successfully');
      fetchOrders();
    } catch (error) {
      message.error(error.response?.data?.message || 'Failed to delete order');
    }
  };

  // Columns for the table
  const columns = [
    {
      title: 'Order ID',
      dataIndex: '_id',
      key: '_id',
      render: (id) => <span className="text-gray-600">{id.slice(-6)}</span>,
    },
    {
      title: 'Products',
      dataIndex: 'products',
      key: 'products',
      width: 200,
      render: (products) => (
        <List
          itemLayout="horizontal"
          dataSource={products}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={
                  <Avatar
                    src={item.productId.images[0]} // Assuming multiple images, taking the first one
                    size={64}
                    shape="square"
                  />
                }
                title={item.productId.productName}
                description={`Quantity: ${item.quantity}  Price: ₹${item.price}`}
              />
            </List.Item>
          )}
        />
      ),
    },
    {
      title: 'Shipping Address',
      dataIndex: 'shippingAddress',
      key: 'shippingAddress',
    },

    {
      title: 'orderDate',
      dataIndex: 'orderDate',
      key: 'orderDate',
      render: (orderDate) => (
        <Tag color="green">{moment(orderDate).format('YYYY-MM-DD')}</Tag>
      ),
    },

    {
      title: 'Payment Method',
      dataIndex: 'paymentMethod',
      key: 'paymentMethod',
    },
    {
      title: 'Total Price',
      dataIndex: 'totalPrice',
      key: 'totalPrice',
      render: (price) => `₹${price}`,
    },

    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color = "default";
        switch (status) {
          case "pending":
            color = "gold";
            break;
          case "shipped":
            color = "blue";
            break;
          case "delivered":
            color = "green";
            break;
          case "canceled":
            color = "red";
            break;
          default:
            color = "default";
        }
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Customer',
      dataIndex: 'userId',
      key: 'userId',
      render: (user) =>
        user ? <Button type="link">{user.name}</Button> : 'N/A',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (record) =>
        userData.roleId === 1 ? (
          <Space size="middle">
            <Button
              type="link"
              onClick={() => navigate(`/order-edit/${record._id}`)}
            >
              Edit
            </Button>
            <Popconfirm
              title="Delete Order"
              description="Are you sure you want to delete this order?"
              onConfirm={() => handleDelete(record._id)}
              okText="Yes"
              cancelText="No"
            >
              <Button type="link" danger>
                Delete
              </Button>
            </Popconfirm>
          </Space>
        ) : null,
    },
  ];

  return (
    <Card className="shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>Orders</Title>
        <Space>
          {userData.roleId === 1 && (
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => navigate('/order-add')}
            >
              Add Order
            </Button>
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

      {tableView ? (
        <Table
          dataSource={orders}
          columns={columns}
          loading={loading}
          rowKey="_id"
          bordered
          pagination={{
            pageSizeOptions: ['5', '10', '20', '50'],
            showSizeChanger: true,
            defaultPageSize: 10,
          }}
          locale={{ emptyText: <Empty description="No Orders Found" /> }}
          scroll={{ x: 'max-content', y: 500 }}
          size="small"
        />
      ) : (
        <Empty description="No Orders Found" className="mt-6" />
      )}
    </Card>
  );
};

export default Orders;
