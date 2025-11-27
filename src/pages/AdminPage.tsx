import React, { useState } from 'react';
import MainLayout from '../components/templates/MainLayout';
import { Container, Row, Col, Card, Modal, Form, Button as BootstrapButton } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { useProducts } from '../hooks/useProducts';
import axios from 'axios';
import { ENDPOINTS } from '../constants/api';
import Button from '../components/atoms/Button/Button';

interface OrderDetail {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  referencePhoto?: string;
}

interface Order {
  id: number;
  userId: number;
  orderDate: string;
  status: 'PENDING' | 'RECEIVED' | 'IN_PREPARATION' | 'COMPLETED';
  total: number;
  orderDetails: OrderDetail[];
}

interface NewProduct {
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  descripcion: string;
  requiresPhoto: boolean;
}

const AdminPage: React.FC = () => {
  const { user, token } = useAuth();
  const { orders, updateOrderStatus, isLoading: ordersLoading } = useOrders();
  const { products, fetchProducts } = useProducts();
  const [showProductModal, setShowProductModal] = useState(false);
  const [newProduct, setNewProduct] = useState<NewProduct>({
    nombre: '',
    precio: 0,
    imagen: '',
    categoria: '',
    descripcion: '',
    requiresPhoto: false,
  });
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [isSubmittingProduct, setIsSubmittingProduct] = useState(false);
  const [productError, setProductError] = useState<string | null>(null);

  const handleStatusChange = async (orderId: number, newStatus: 'RECEIVED' | 'IN_PREPARATION' | 'COMPLETED') => {
    try {
      await updateOrderStatus(orderId, newStatus);
      alert('Estado de la orden actualizado exitosamente.');
    } catch (error) {
      alert('Error al actualizar el estado de la orden.');
    }
  };

  const handleProductInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      setNewProduct(prev => ({
        ...prev,
        [name]: (e.target as HTMLInputElement).checked,
      }));
    } else {
      setNewProduct(prev => ({
        ...prev,
        [name]: name === 'precio' ? parseFloat(value) || 0 : value,
      }));
    }
  };

  const handleProductImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProductImageFile(file);
      // Generar URL temporal para vista previa
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewProduct(prev => ({
          ...prev,
          imagen: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAddProduct = async () => {
    if (!newProduct.nombre || !newProduct.precio || !newProduct.categoria || !newProduct.descripcion) {
      setProductError('Por favor, completa todos los campos requeridos.');
      return;
    }

    setIsSubmittingProduct(true);
    setProductError(null);

    try {
      const formData = new FormData();
      formData.append('nombre', newProduct.nombre);
      formData.append('precio', newProduct.precio.toString());
      formData.append('categoria', newProduct.categoria);
      formData.append('descripcion', newProduct.descripcion);
      formData.append('requiresPhoto', newProduct.requiresPhoto.toString());

      if (productImageFile) {
        formData.append('file', productImageFile);
      } else if (newProduct.imagen) {
        formData.append('imagen', newProduct.imagen);
      }

      const response = await axios.post(ENDPOINTS.ADD_PRODUCT, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201 || response.status === 200) {
        alert('¡Producto agregado exitosamente!');
        setShowProductModal(false);
        setNewProduct({
          nombre: '',
          precio: 0,
          imagen: '',
          categoria: '',
          descripcion: '',
          requiresPhoto: false,
        });
        setProductImageFile(null);
        fetchProducts();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setProductError(error.response.data.message || 'Error al agregar el producto.');
      } else {
        setProductError('Error desconocido al agregar el producto.');
      }
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  return (
    <MainLayout cartCount={0} onCartClick={() => {}}>
      <Container style={{ marginTop: '2rem' }}>
        <section className="seccion">
          <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>
            Panel de {user?.role === 'ADMIN' ? 'Administración' : 'Vendedor'}
          </h1>

          {/* Sección de Órdenes */}
          <div style={{ marginBottom: '3rem' }}>
            <h2>Órdenes Recibidas</h2>
            {ordersLoading ? (
              <p>Cargando órdenes...</p>
            ) : orders.length === 0 ? (
              <p>No hay órdenes recibidas.</p>
            ) : (
              <Row>
                {orders.map(order => (
                  <Col md={12} key={order.id} className="mb-4">
                    <Card>
                      <Card.Header>
                        <strong>Orden ID:</strong> {order.id} <br />
                        <strong>Fecha:</strong> {new Date(order.orderDate).toLocaleString('es-CL')} <br />
                        <strong>Estado:</strong>
                        <select
                          value={order.status}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value as 'RECEIVED' | 'IN_PREPARATION' | 'COMPLETED')
                          }
                          style={{ marginLeft: '10px', padding: '5px' }}
                        >
                          <option value="PENDING">Pendiente</option>
                          <option value="RECEIVED">Recibida</option>
                          <option value="IN_PREPARATION">En Preparación</option>
                          <option value="COMPLETED">Completada</option>
                        </select>
                      </Card.Header>
                      <Card.Body>
                        {order.orderDetails.map((detail, index) => (
                          <div
                            key={index}
                            className="d-flex align-items-center mb-3 p-2 border rounded"
                            style={{ background: '#f8f9fa' }}
                          >
                            {/* Mostrar la foto de referencia si existe */}
                            {detail.referencePhoto && (
                              <img
                                src={detail.referencePhoto}
                                alt="Foto de Referencia"
                                style={{
                                  width: '100px',
                                  height: '100px',
                                  objectFit: 'cover',
                                  marginRight: '15px',
                                  borderRadius: '4px',
                                }}
                              />
                            )}
                            <div style={{ flexGrow: 1 }}>
                              <h5>{detail.productName} (x{detail.quantity})</h5>
                              <p className="mb-0">
                                <strong>Precio Unitario:</strong> ${detail.price.toLocaleString('es-CL')}
                              </p>
                              <p className="mb-0">
                                <strong>Subtotal:</strong> ${(detail.price * detail.quantity).toLocaleString('es-CL')}
                              </p>
                            </div>
                            {/* Mostrar la imagen del producto */}
                            <img
                              src={detail.productImage}
                              alt={detail.productName}
                              style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover',
                                borderRadius: '4px',
                              }}
                            />
                          </div>
                        ))}
                        <div style={{ marginTop: '1rem', textAlign: 'right' }}>
                          <h5>Total: ${order.total.toLocaleString('es-CL')}</h5>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </div>

          {/* Sección de Productos (solo para Admin) */}
          {user?.role === 'ADMIN' && (
            <div>
              <h2>Gestión de Productos</h2>
              <Button onClick={() => setShowProductModal(true)} className="btn-primary mb-3">
                Agregar Nuevo Producto
              </Button>

              {/* Modal para agregar producto */}
              <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="lg">
                <Modal.Header closeButton>
                  <Modal.Title>Agregar Nuevo Producto</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {productError && <div className="alert alert-danger">{productError}</div>}
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre del Producto</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={newProduct.nombre}
                        onChange={handleProductInputChange}
                        placeholder="Ej: Figura Dragon"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Precio</Form.Label>
                      <Form.Control
                        type="number"
                        name="precio"
                        value={newProduct.precio}
                        onChange={handleProductInputChange}
                        placeholder="Ej: 50000"
                        step="1000"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Categoría</Form.Label>
                      <Form.Control
                        type="text"
                        name="categoria"
                        value={newProduct.categoria}
                        onChange={handleProductInputChange}
                        placeholder="Ej: Figuras"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Descripción</Form.Label>
                      <Form.Control
                        as="textarea"
                        name="descripcion"
                        value={newProduct.descripcion}
                        onChange={handleProductInputChange}
                        placeholder="Descripción del producto"
                        rows={3}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>URL de Imagen del Producto</Form.Label>
                      <Form.Control
                        type="text"
                        name="imagen"
                        value={newProduct.imagen}
                        onChange={handleProductInputChange}
                        placeholder="Ej: https://example.com/image.jpg"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Subir Imagen del Producto</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={handleProductImageChange}
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Check
                        type="checkbox"
                        name="requiresPhoto"
                        label="¿Este producto requiere foto de referencia?"
                        checked={newProduct.requiresPhoto}
                        onChange={handleProductInputChange}
                      />
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <BootstrapButton variant="secondary" onClick={() => setShowProductModal(false)}>
                    Cancelar
                  </BootstrapButton>
                  <BootstrapButton
                    variant="primary"
                    onClick={handleAddProduct}
                    disabled={isSubmittingProduct}
                  >
                    {isSubmittingProduct ? 'Agregando...' : 'Agregar Producto'}
                  </BootstrapButton>
                </Modal.Footer>
              </Modal>
            </div>
          )}
        </section>
      </Container>
    </MainLayout>
  );
};

export default AdminPage;
