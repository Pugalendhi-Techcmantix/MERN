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
  Tooltip,
  Spin,
} from 'antd';
import { AudioOutlined, SearchOutlined } from '@ant-design/icons';
import banner_1 from '../../../../assets/banner_1.avif';
import banner_2 from '../../../../assets/banner_2.avif';
import banner_3 from '../../../../assets/banner_3.jpg';
import banner_4 from '../../../../assets/banner_4.avif';
import basket from '../../../../assets/basket-ball.png';
import cosmetic from '../../../../assets/cosmetic.png';
import game from '../../../../assets/game.png';
import toys from '../../../../assets/toys.png';
import fashion from '../../../../assets/fashion.png';
import elec from '../../../../assets/elec.png';
import book from '../../../../assets/book.png';
import furniture from '../../../../assets/furniture.png';

const { Search } = Input;
const { Title, Text } = Typography;

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
    setLoading(true);

    jwtAxios
      .get(`products`)
      .then((res) => {
        setProducts(res.data);
        setLoading(false);
      })
      .catch((err) => {
        message.error(err.response.message);
        setLoading(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // const contentStyle = {
  //   height: 'auto',
  //   color: 'blue',
  //   lineHeight: '160px',
  //   textAlign: 'center',
  //   background: '#364d79',
  // };
  const categories = [
    { key: 1, name: 'Books', img: book },
    { key: 2, name: 'Cosmetics', img: cosmetic },
    { key: 3, name: 'Electronics', img: elec },
    { key: 4, name: 'Fashion', img: fashion },
    { key: 5, name: 'Furniture', img: furniture },
    { key: 6, name: 'Games', img: game },
    { key: 7, name: 'Toys', img: toys },
    { key: 8, name: 'Sports', img: basket },
  ];
  // Group products by category
  const groupedProducts = products.reduce((acc, product) => {
    acc[product.category] = [...(acc[product.category] || []), product];
    return acc;
  }, {});

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
        {[banner_1, banner_2, banner_3, banner_4].map((banner, index) => (
          <div key={index}>
            <img
              src={banner}
              className="w-full rounded-md"
              alt={`Banner ${index + 1}`}
            />
          </div>
        ))}
      </Carousel>
      <Title level={3} className="mb-3">
        Category
      </Title>
      <div className="max-w-full overflow-x-auto whitespace-nowrap mb-5">
        <div className="grid grid-cols-4  lg:grid-cols-8  gap-3">
          {categories.map((category) => (
            <div key={category.key}>
              <Card
                size="small"
                className=" text-center rounded-lg shadow-sm flex justify-center items-center hover:bg-sky-100 hover:scale-105 transition duration-300"
                hoverable
              >
                <Avatar
                  src={category.img}
                  className="w-8 h-8 sm:w-12 sm:h-12 md:w-12 md:h-12 lg:w-20 lg:h-20"
                />
              </Card>
              <Text className="flex justify-center mt-2">{category.name}</Text>
            </div>
          ))}
        </div>
      </div>
      <Title level={3} className="mb-3">
        Latest Products
      </Title>
      {/* <Spin spinning={loading} tip="Loading...">
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
      </Spin> */}
      <Spin spinning={loading} tip="Loading...">
        {Object.keys(groupedProducts).length > 0 ? (
          Object.entries(groupedProducts).map(
            ([category, categoryProducts]) => (
              <div key={category} className="mb-6">
                <Title level={4} className="mb-3">
                  {category}
                </Title>
                <Carousel
                  autoplay
                  arrows
                  dots={false}
                  responsive={[
                    { breakpoint: 2040, settings: { slidesToShow: 4 } }, // Large screens (lg)
                    { breakpoint: 1024, settings: { slidesToShow: 4 } }, // Large screens (lg)
                    { breakpoint: 768, settings: { slidesToShow: 3 } }, // Medium screens (md)
                    { breakpoint: 576, settings: { slidesToShow: 1 } }, // Small & Extra Small (sm, xs)
                  ]}
                  className="rounded-lg"
                >
                  {categoryProducts.map((product) => (
                    <div key={product._id} className="p-2">
                      <Card
                        size="small"
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
                              <p className="truncate">
                                <span className="font-semibold">
                                  Description:
                                </span>{' '}
                                {product.description}
                              </p>
                            </div>
                          }
                        />
                      </Card>
                    </div>
                  ))}
                </Carousel>
              </div>
            ),
          )
        ) : (
          <Empty description="No Products Found" />
        )}
      </Spin>
    </div>
  );
};

export default ProductsPage;
