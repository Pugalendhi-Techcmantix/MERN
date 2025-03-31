import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import jwtAxios from '../../../../utils/jwtAxios';
import {
  Avatar,
  Card,
  Carousel,
  Empty,
  message,
  Typography,
  Input,
} from 'antd';
import { AudioOutlined, SearchOutlined } from '@ant-design/icons';
import banner_1 from '../../../../assets/banner_1.avif';
import banner_2 from '../../../../assets/banner_2.avif';
import banner_3 from '../../../../assets/banner_3.jpg';
import banner_4 from '../../../../assets/banner_4.avif';

const { Search } = Input;
const { Title } = Typography;

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
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
        setLoading(false);
      })
      .catch((err) => {
        message.error(err.response.message);
        setLoading(false);
      });
  };

  const contentStyle = {
    height: 'auto',
    color: 'blue',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };
  const categories = [
    { name: 'Electronics', color: 'bg-blue-100' },
    { name: 'Fashion', color: 'bg-pink-100' },
    { name: 'Toys', color: 'bg-green-100' },
    { name: 'Beauty', color: 'bg-purple-100' },
    { name: 'Sports', color: 'bg-yellow-100' },
    { name: 'Automotive', color: 'bg-gray-100' },
    { name: 'Games', color: 'bg-red-100' },
    { name: 'Books', color: 'bg-indigo-100' },
    { name: 'Health', color: 'bg-teal-100' },
    { name: 'Grocery', color: 'bg-orange-100' },
  ];

  return (
    <div>
      <Search
        placeholder="Search here..."
        enterButton="Search"
        size="large"
        prefix={
          <SearchOutlined
            style={{
              fontSize: 16,
              color: 'gray',
            }}
          />
        }
        suffix={
          <AudioOutlined
            style={{
              fontSize: 16,
              color: '#1677ff',
            }}
          />
        }
        className="mb-3"
      />
      <Carousel autoplay arrows className="mb-3">
        <div>
          <img style={contentStyle} src={banner_1} className="w-full" />
        </div>
        <div>
          <img
            style={contentStyle}
            src={banner_2}
            className="w-full  rounded-md"
          />
        </div>
        <div>
          <img
            style={contentStyle}
            src={banner_3}
            className="w-full  rounded-md"
          />
        </div>
        <div>
          <img
            style={contentStyle}
            src={banner_4}
            className="w-full  rounded-md"
          />
        </div>
      </Carousel>
      <Title level={3} className="mb-3">
        Category
      </Title>
      <div className="max-w-full overflow-x-auto whitespace-nowrap mb-3 ">
        <div className="flex gap-4">
          {categories.map((category, index) => (
            <Card
              size="small"
              key={index}
              className={` min-w-[150px] text-center  ${category.color} rounded-lg shadow-sm flex justify-center items-center`}
              hoverable
            >
              <p className="font-medium text-lg">{category.name}</p>
            </Card>
          ))}
        </div>
      </div>
      <Title level={3} className="mb-3">
        Latest Products
      </Title>

      <div className="grid grid-cols-1 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-8">
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
              // actions={

              //         <Button
              //           type="link"
              //           key="edit"
              //           onClick={() => handleEdit(product._id)}
              //         >
              //           Edit
              //         </Button>,

              // }
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
    </div>
  );
};

export default ProductsPage;
