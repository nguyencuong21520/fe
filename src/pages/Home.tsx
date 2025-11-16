import { useState, useEffect } from "react";
import { Card, Row, Col, Button, Typography, Spin, message } from "antd";
import { LogoutOutlined, ShoppingOutlined } from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { productService, Product } from "../services/productService";
import { authService } from "../services/authService";

const { Title, Text } = Typography;

const Home = () => {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.getProducts();
        setProducts(response.products);
      } catch (error) {
        console.error("Error fetching products:", error);
        message.error("Không thể tải danh sách sản phẩm");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleLogout = async () => {
    try {
      await authService.logout();
      setUser(null);
      message.success("Đăng xuất thành công!");
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      message.error("Có lỗi xảy ra khi đăng xuất");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <ShoppingOutlined className="text-2xl text-blue-600" />
            <Title level={3} className="mb-0">
              Cửa Hàng Sản Phẩm
            </Title>
          </div>
          <div className="flex items-center gap-4">
            <Text className="text-gray-700">
              Xin chào, <strong>{user?.name || user?.email}</strong>
            </Text>
            <Button
              type="primary"
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Đăng Xuất
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Title level={2} className="mb-6">
          Danh Sách Sản Phẩm
        </Title>

        {loading ? (
          <div className="text-center py-12">
            <Spin size="large" />
          </div>
        ) : (
          <Row gutter={[16, 16]}>
            {products.map((product) => (
              <Col xs={24} sm={12} md={8} lg={6} key={product.id}>
                <Card
                  hoverable
                  className="h-full"
                  cover={
                    <div className="h-48 bg-gray-200 flex items-center justify-center overflow-hidden">
                      <img
                        alt={product.name}
                        src={product.image}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  }
                  actions={[
                    <Button type="primary" block>
                      Thêm Vào Giỏ
                    </Button>,
                  ]}
                >
                  <Card.Meta
                    title={product.name}
                    description={
                      <div>
                        <Text className="text-gray-600 block mb-2">
                          {product.description}
                        </Text>
                        <Text className="text-lg font-bold text-blue-600">
                          {formatPrice(product.price)}
                        </Text>
                      </div>
                    }
                  />
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </div>
  );
};

export default Home;
