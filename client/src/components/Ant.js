import React from 'react';
import { Col, Row,Card } from 'antd';

function Ant() {
  return (
    <div>
       <Row>
      <Col span={24}>
      <Card
    title="Card title"
    bordered={false}
    style={{
    //   width: 300,
    }}
  >
    <p>Card content</p>
    <p>Card content</p>
    <p>Card content</p>
  </Card>
      </Col> 
    </Row>
    </div>
  )
}

export default Ant
