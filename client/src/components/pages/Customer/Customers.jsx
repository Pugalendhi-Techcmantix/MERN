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
  Row,
  Space,
  Table,
  Tooltip,
  Typography,
} from 'antd';
import {
  AppstoreOutlined,
  DownloadOutlined,
  PlusOutlined,
  TableOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
const { Title, Text } = Typography;
const Customers = () => {
  const [customers, setCustomers] = useState([]);
  const [tableView, setTableView] = useState(true);
  const [selectionType, setSelectionType] = useState('checkbox');
  const navigate = useNavigate();
  useEffect(() => {
    getCustomers();
  }, []);
  const getCustomers = () => {
    jwtAxios
      .get(`emp`)
      .then((res) => {
        setCustomers(res.data);
        setTableView(res.data);
      })
      .catch((err) => message.error(err.response.message));
  };
  // Table Columns
  const columns = [
    {
      title: 'Avatar',
      dataIndex: 'name',
      key: 'avatar',
      render: (name) => (
        <Avatar className="bg-white text-indigo-600 font-bold shadow-md">
          {name.charAt(0).toUpperCase()}
        </Avatar>
      ),
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Button type="link">{text}</Button>,
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
  ];
  // rowSelection object indicates the need for row selection
  const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
      console.log(
        `selectedRowKeys: ${selectedRowKeys}`,
        'selectedRows: ',
        selectedRows,
      );
    },
    getCheckboxProps: (record) => ({
      disabled: record.name === 'Disabled User',
      // Column configuration not to be checked
      name: record.name,
    }),
  };
  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      <div className="flex justify-between items-center mb-4">
        <Title level={3}>Customers</Title>
        <Space>
          <Button type="primary" icon={<DownloadOutlined />} iconPosition="end">
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
          rowSelection={{
            type: selectionType,
            ...rowSelection,
          }}
          dataSource={customers}
          columns={columns}
          rowKey="_id"
          bordered
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: <Empty description="No Customers Found" /> }}
        />
      ) : // Card View
      customers?.length > 0 ? (
        <Row gutter={[24, 24]}>
          {customers.map((customer) => (
            <Col key={customer._id} xs={24} sm={24} md={24} lg={8} xl={6}>
              <Badge.Ribbon
                text={customer.roleId === 1 ? 'Admin' : 'User'}
                color={customer.roleId === 1 ? 'red' : 'cyan'}
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

                  <Text className="block mt-3 text-gray-700">
                    Age: {customer.age}
                  </Text>
                </Card>
              </Badge.Ribbon>
            </Col>
          ))}
        </Row>
      ) : (
        <Empty description="No Customers Found" className="mt-6" />
      )}
    </div>
  );
};

export default Customers;
