import React, { useEffect, useState } from 'react';
import jwtAxios from '../../../utils/jwtAxios';
import {
  Avatar,
  Badge,
  Button,
  Card,
  Col,
  Empty,
  message,
  Popconfirm,
  Row,
  Space,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import {
  AppstoreOutlined,
  DeleteOutlined,
  DownloadOutlined,
  PlusOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const { Title, Text } = Typography;
const Orders = () => {
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
      .get(`orders`)
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
    navigate('/customer-add', { state: { customer_id: id } });
  };

  // Table Columns
  const columns = [
    {
      title: 'Image'.toUpperCase(),
      dataIndex: 'name',
      key: 'image',
      render: (name) => (
        <Avatar className="bg-white text-indigo-600 font-bold shadow-md">
          {name.charAt(0).toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: 'Product'.toUpperCase(),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Price'.toUpperCase(),
      dataIndex: 'price',
      key: 'price',
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
      dataIndex: 'empId',
      key: 'empId',
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
        <Title level={3}>Orders</Title>
        <Space>
          {data.roleId === 1 && (
            <>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                iconPosition="end"
                onClick={() => navigate('/order-add')}
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
          loading={loading} // Loading state
          rowKey="_id"
          bordered
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: <Empty description="No Customers Found" /> }}
        />
      ) : (
        <Empty description="No Orders Found" className="mt-6" />
      )}
    </div>
  );
};

export default Orders;
