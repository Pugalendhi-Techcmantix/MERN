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
const Customers = () => {
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
      .get(`emp`)
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

  const handleExport = () => {
    jwtAxios
      .get(`/emp/download-pdf`, { responseType: 'blob' })
      .then((res) => {
        const blob = new Blob([res.data], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = 'employees.pdf';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        message.success('PDF downloaded successfully');
      })
      .catch((err) => {
        message.error(err.response?.data?.message || 'Failed to download PDF');
      });
  };

  // Table Columns
  const columns = [
    {
      title: 'Avatar'.toUpperCase(),
      dataIndex: 'name',
      key: 'avatar',
      render: (name) => (
        <Avatar className="bg-white text-indigo-600 font-bold shadow-md">
          {name.charAt(0).toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: 'Name'.toUpperCase(),
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Button type="link">{text}</Button>,
    },
    {
      title: 'Email'.toUpperCase(),
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Age'.toUpperCase(),
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Role'.toUpperCase(),
      dataIndex: 'roleId',
      key: 'roleId',
      render: (text) => (
        <Tag color={text == 1 ? 'volcano' : 'geekblue'} type="link">
          {text == 1 ? 'Admin' : 'User'}
        </Tag>
      ),
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
    <Card className="shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>Customers</Title>
        <Space>
          {data.roleId === 1 && (
            <>
              <Button
                type="primary"
                icon={<DownloadOutlined />}
                iconPosition="end"
                onClick={handleExport}
              >
                Export
              </Button>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                iconPosition="end"
                onClick={() => navigate('/customer-add')}
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
          pagination={{
            pageSizeOptions: ['5', '10', '20', '50'], // Page size options
            showSizeChanger: true, // Allow users to change page size
            defaultPageSize: 10, // Default rows per page
          }}
          locale={{ emptyText: <Empty description="No Customers Found" /> }}
          scroll={{ x: 'max-content', y: 500 }}
        />
      ) : // Card View
      customers?.length > 0 ? (
        <Row gutter={[24, 24]}>
          {customers.map((customer) => (
            <Col
              key={customer._id}
              xs={24}
              sm={24}
              md={24}
              lg={12}
              xl={8}
              xxl={6}
            >
              <Badge.Ribbon
                className="font-semibold"
                text={customer.roleId === 1 ? 'Admin' : 'User'}
                color={customer.roleId === 1 ? 'magenta' : 'cyan'}
              >
                <Card
                  hoverable
                  className="rounded-xl bg-gradient-to-r from-blue-100 to-purple-200 text-gray-800 "
                >
                  <div className="flex items-center gap-4">
                    {/* Role-based Badge */}

                    <Avatar
                      size={48}
                      className="bg-white text-indigo-600 font-bold shadow-md"
                    >
                      {customer.name.charAt(0).toUpperCase()}
                    </Avatar>

                    <div>
                      <Title level={4} className="mb-1 text-gray-900">
                        {customer.name}
                      </Title>
                      <Text type="secondary" className="text-gray-600">
                        {customer.email}
                      </Text>
                    </div>
                  </div>
                  <div className="d-flex justify-between mt-3">
                    <Text className="text-gray-700">Age: {customer.age}</Text>
                    {data.roleId == 1 ? (
                      <Popconfirm
                        title="Delete Customer"
                        description="Are you sure you want to delete this customer?"
                        onConfirm={() => handleDelete(customer._id)}
                        okText="Yes"
                        cancelText="No"
                      >
                        <Button
                          variant="text"
                          shape="circle"
                          color="danger"
                          danger
                          icon={<DeleteOutlined />}
                        />
                      </Popconfirm>
                    ) : (
                      ''
                    )}
                  </div>
                </Card>
              </Badge.Ribbon>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="No Customers Found" className="mt-6" />
      )}
    </Card>
  );
};

export default Customers;
