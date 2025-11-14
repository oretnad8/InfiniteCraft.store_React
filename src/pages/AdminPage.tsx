import React, { useState, useEffect } from 'react';
import MainLayout from '../components/templates/MainLayout';
import { Container, Row, Col, Card } from 'react-bootstrap';

// Se re-utilizan (o re-definen) las interfaces para tipar los datos de localStorage
interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  descripcion: string;
}

interface CartItem extends Product {
  cantidad: number;
  photo: string; // La foto de referencia en Base64
}

interface Order {
  id: string;
  date: string;
  items: CartItem[];
}

const AdminPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    // Cargar las órdenes guardadas en localStorage
    const savedOrders = localStorage.getItem('orders');
    if (savedOrders) {
      setOrders(JSON.parse(savedOrders));
    }
  }, []);

  return (
    // Reutilizamos MainLayout, pasando props vacías para el carrito
    <MainLayout cartCount={0} onCartClick={() => {}}>
      <Container style={{ marginTop: '2rem' }}>
        <section className="seccion">
          <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Panel de Administración</h1>
          <h2>Órdenes Recibidas</h2>
          {orders.length === 0 ? (
            <p>No hay órdenes recibidas.</p>
          ) : (
            <Row>
              {/* Iterar sobre cada orden */}
              {orders.map(order => (
                <Col md={12} key={order.id} className="mb-4">
                  <Card>
                    <Card.Header>
                      <strong>Orden ID:</strong> {order.id} <br />
                      <strong>Fecha:</strong> {order.date}
                    </Card.Header>
                    <Card.Body>
                      {/* Iterar sobre los items de cada orden */}
                      {order.items.map((item, index) => (
                        <div 
                          key={index} 
                          className="d-flex align-items-center mb-3 p-2 border rounded" 
                          style={{ background: '#f8f9fa' }}
                        >
                          {/* Mostrar la foto de referencia subida por el cliente */}
                          <img 
                            src={item.photo} 
                            alt="Foto de Referencia" 
                            style={{ 
                              width: '100px', 
                              height: '100px', 
                              objectFit: 'cover', 
                              marginRight: '15px',
                              borderRadius: '4px'
                            }} 
                          />
                          <div style={{ flexGrow: 1 }}>
                            <h5>{item.nombre} (x{item.cantidad})</h5>
                            <p className="mb-0"><strong>Categoría:</strong> {item.categoria}</p>
                            <p className="mb-0"><strong>Precio Unitario:</strong> ${item.precio.toLocaleString('es-CL')}</p>
                          </div>
                          {/* Mostrar la imagen del producto (opcional) */}
                          <img 
                            src={item.imagen} 
                            alt={item.nombre}
                            style={{ 
                              width: '100px', 
                              height: '100px', 
                              objectFit: 'cover',
                              borderRadius: '4px'
                            }} 
                          />
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          )}
        </section>
      </Container>
    </MainLayout>
  );
};

export default AdminPage;