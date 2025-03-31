import React, { useEffect, useState } from 'react';
import jwtAxios from '../../../../utils/jwtAxios';
import { Avatar, Card, Empty, message, Typography } from 'antd';

import { useNavigate } from 'react-router-dom';
const ProductsPage = () => {
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

  const handleEdit = (id) => {
    navigate('/product-add', { state: { product_id: id } });
  };

  return (
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
  );
};

export default ProductsPage;
