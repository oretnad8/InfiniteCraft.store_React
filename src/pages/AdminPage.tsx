import React, { useState } from 'react';
import MainLayout from '../components/templates/MainLayout';
import { Container, Row, Col, Card, Modal, Form, Button as BootstrapButton } from 'react-bootstrap';
import { useAuth } from '../hooks/useAuth';
import { useOrders } from '../hooks/useOrders';
import { useProducts } from '../hooks/useProducts';
import { useUsers, type User } from '../hooks/useUsers';
import axios from 'axios';
import { ENDPOINTS } from '../constants/api';
import Button from '../components/atoms/Button/Button';



interface NewProduct {
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  descripcion: string;
  requiresPhoto: boolean;
}

interface NewUser {
  nombre: string;
  email: string;
  password?: string;
  role: 'ADMIN' | 'USER';
}

const AdminPage: React.FC = () => {
  const { user, token } = useAuth();
  const { orders, updateOrderStatus, isLoading: ordersLoading } = useOrders();
  const { products, fetchProducts } = useProducts();
  const { users, fetchUsers } = useUsers();

  // Modal de formulario (Crear/Editar)
  const [showProductModal, setShowProductModal] = useState(false);

  // Modal de listado (Para seleccionar modificar o eliminar)
  const [showListModal, setShowListModal] = useState(false);
  const [listMode, setListMode] = useState<'MODIFY' | 'DELETE' | null>(null);

  const [editingId, setEditingId] = useState<number | null>(null);

  // Modal de Usuarios (Crear/Editar)
  const [showUserModal, setShowUserModal] = useState(false);
  const [showUserListModal, setShowUserListModal] = useState(false);
  const [userListMode, setUserListMode] = useState<'MODIFY' | 'DELETE' | null>(null);
  const [editingUserId, setEditingUserId] = useState<number | null>(null);

  const [newUser, setNewUser] = useState<NewUser>({
    nombre: '',
    email: '',
    password: '',
    role: 'USER',
  });
  const [userError, setUserError] = useState<string | null>(null);
  const [isSubmittingUser, setIsSubmittingUser] = useState(false);


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

  const resetForm = () => {
    setNewProduct({
      nombre: '',
      precio: 0,
      imagen: '',
      categoria: '',
      descripcion: '',
      requiresPhoto: false,
    });
    setProductImageFile(null);
    setEditingId(null);
    setProductError(null);
  };

  const handleCloseProductModal = () => {
    setShowProductModal(false);
    resetForm();
  };

  const handleSaveProduct = async () => {
    if (!newProduct.nombre || !newProduct.precio || !newProduct.categoria || !newProduct.descripcion) {
      setProductError('Por favor, completa todos los campos requeridos.');
      return;
    }

    if (newProduct.requiresPhoto && !productImageFile && !editingId) {
      setProductError('Debes subir una imagen si requiere foto de referencia.');
      return;
    }

    setIsSubmittingProduct(true);
    setProductError(null);

    try {
      let response;
      const url = editingId
        ? `${ENDPOINTS.ADD_PRODUCT}/${editingId}`
        : ENDPOINTS.ADD_PRODUCT;

      const method = editingId ? 'put' : 'post';

      if (newProduct.requiresPhoto && productImageFile) {
        // Enviar como multipart/form-data si hay archivo
        const formData = new FormData();
        formData.append('nombre', newProduct.nombre);
        formData.append('precio', newProduct.precio.toString());
        formData.append('categoria', newProduct.categoria);
        formData.append('descripcion', newProduct.descripcion);
        formData.append('requiresPhoto', newProduct.requiresPhoto.toString());
        formData.append('file', productImageFile);

        response = await axios({
          method,
          url,
          data: formData,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        });
      } else {
        // Enviar como JSON
        const payload = {
          nombre: newProduct.nombre,
          precio: newProduct.precio,
          categoria: newProduct.categoria,
          descripcion: newProduct.descripcion,
          imagen: newProduct.imagen,
          requiresPhoto: newProduct.requiresPhoto,
        };

        response = await axios({
          method,
          url,
          data: payload,
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });
      }

      if (response.status === 201 || response.status === 200) {
        alert(editingId ? '¡Producto modificado exitosamente!' : '¡Producto agregado exitosamente!');
        handleCloseProductModal();
        fetchProducts();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setProductError(error.response.data.message || 'Error al guardar el producto.');
      } else {
        setProductError('Error desconocido al guardar el producto.');
      }
    } finally {
      setIsSubmittingProduct(false);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este producto?')) return;

    try {
      await axios.delete(`${ENDPOINTS.ADD_PRODUCT}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Producto eliminado exitosamente.');
      fetchProducts(); // Refrescar lista
      // Si el modal de lista está abierto y eliminamos algo, idealmente se actualiza solo por el fetchProducts 
      // pero si el producto eliminado era el último, etc.
    } catch (error) {
      console.error(error);
      alert('Error al eliminar el producto.');
    }
  };

  const openListModal = (mode: 'MODIFY' | 'DELETE') => {
    setListMode(mode);
    setShowListModal(true);
  };


  const handleSelectProduct = (product: any) => {
    if (listMode === 'MODIFY') {
      // Cargar datos en el form y abrir modal de edición
      setEditingId(product.id);
      setNewProduct({
        nombre: product.nombre,
        precio: product.precio,
        imagen: product.imagen,
        categoria: product.categoria,
        descripcion: product.descripcion,
        requiresPhoto: product.requiresPhoto || false,
      });
      setShowListModal(false);
      setShowProductModal(true);
    } else if (listMode === 'DELETE') {
      handleDeleteProduct(product.id);
    }
  };

  /* --- HANDLERS DE USUARIOS --- */

  const handleUserInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewUser(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetUserForm = () => {
    setNewUser({
      nombre: '',
      email: '',
      password: '',
      role: 'USER',
    });
    setEditingUserId(null);
    setUserError(null);
  };

  const handleCloseUserModal = () => {
    setShowUserModal(false);
    resetUserForm();
  };

  const handleSaveUser = async () => {
    if (!newUser.email || !newUser.role) {
      setUserError('El email y el rol son obligatorios.');
      return;
    }

    if (!editingUserId && !newUser.password) {
      setUserError('La contraseña es obligatoria para nuevos usuarios.');
      return;
    }

    setIsSubmittingUser(true);
    setUserError(null);

    try {
      const url = editingUserId
        ? `${ENDPOINTS.ADD_USER}/${editingUserId}`
        : ENDPOINTS.ADD_USER;
      const method = editingUserId ? 'put' : 'post';

      const payload: any = {
        nombre: newUser.nombre,
        email: newUser.email,
        role: newUser.role,
      };

      if (newUser.password) {
        payload.password = newUser.password;
      }

      const response = await axios({
        method,
        url,
        data: payload,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 201 || response.status === 200) {
        alert(editingUserId ? '¡Usuario modificado exitosamente!' : '¡Usuario agregado exitosamente!');
        handleCloseUserModal();
        fetchUsers();
      }
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setUserError(error.response.data.message || 'Error al guardar el usuario.');
      } else {
        setUserError('Error desconocido al guardar el usuario.');
      }
    } finally {
      setIsSubmittingUser(false);
    }
  };

  const handleDeleteUser = async (id: number) => {
    if (!window.confirm('¿Estás seguro de que deseas eliminar este usuario?')) return;

    try {
      await axios.delete(`${ENDPOINTS.ADD_USER}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Usuario eliminado exitosamente.');
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('Error al eliminar el usuario.');
    }
  };

  const openUserListModal = (mode: 'MODIFY' | 'DELETE') => {
    setUserListMode(mode);
    fetchUsers();
    setShowUserListModal(true);
  };

  const handleSelectUser = (selectedUser: User) => {
    if (userListMode === 'MODIFY') {
      setEditingUserId(selectedUser.id);
      setNewUser({
        nombre: selectedUser.nombre || '',
        email: selectedUser.email,
        password: '',
        role: selectedUser.role,
      });
      setShowUserListModal(false);
      setShowUserModal(true);
    } else if (userListMode === 'DELETE') {
      handleDeleteUser(selectedUser.id);
    }
  };

  return (
    <MainLayout cartCount={0} onCartClick={() => { }}>
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
                        <strong>Fecha:</strong> {new Date(order.date).toLocaleString('es-CL')} <br />
                        <strong>Estado:</strong>
                        <select
                          value={order.status || ''}
                          onChange={(e) =>
                            handleStatusChange(order.id, e.target.value as 'RECEIVED' | 'IN_PREPARATION' | 'COMPLETED')
                          }
                          style={{ marginLeft: '10px', padding: '5px' }}
                        >
                          <option value="">Seleccionar...</option>
                          <option value="PENDING">Pendiente</option>
                          <option value="RECEIVED">Recibida</option>
                          <option value="IN_PREPARATION">En Preparación</option>
                          <option value="COMPLETED">Completada</option>
                        </select>
                      </Card.Header>
                      <Card.Body>
                        {(order.details || []).map((detail, index) => {
                          const product = products.find(p => p.id === detail.productId);
                          return (
                            <div
                              key={index}
                              className="d-flex align-items-center mb-3 p-2 border rounded"
                              style={{ background: '#f8f9fa' }}
                            >
                              <div style={{ flexGrow: 1 }}>
                                <h5>{product ? product.nombre : `Producto #${detail.productId}`} (x{detail.quantity})</h5>
                                <p className="mb-0">
                                  <strong>Precio Unitario:</strong> ${detail.price.toLocaleString('es-CL')}
                                </p>
                                <p className="mb-0">
                                  <strong>Subtotal:</strong> ${(detail.price * detail.quantity).toLocaleString('es-CL')}
                                </p>
                              </div>
                              {/* Mostrar la imagen del producto si existe */}
                              {product && product.imagen && (
                                <img
                                  src={product.imagen}
                                  alt={product.nombre}
                                  style={{
                                    width: '100px',
                                    height: '100px',
                                    objectFit: 'cover',
                                    borderRadius: '4px',
                                  }}
                                />
                              )}
                            </div>
                          );
                        })}
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
              <div className="mb-3 d-flex gap-2 justify-content-center">
                <Button onClick={() => { resetForm(); setShowProductModal(true); }} className="btn-primary">
                  Agregar Nuevo Producto
                </Button>
                <Button onClick={() => openListModal('MODIFY')} className="btn-warning" style={{ color: 'white' }}>
                  Modificar Producto
                </Button>
                <Button onClick={() => openListModal('DELETE')} className="btn-danger" style={{ color: 'white' }}>
                  Eliminar Producto
                </Button>
              </div>

              {/* Modal de Listado (Selección) */}
              <Modal show={showListModal} onHide={() => setShowListModal(false)} size="lg" scrollable>
                <Modal.Header closeButton>
                  <Modal.Title>
                    {listMode === 'MODIFY' ? 'Seleccionar Producto a Modificar' : 'Seleccionar Producto a Eliminar'}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {products.length === 0 ? (
                    <p>No hay productos disponibles.</p>
                  ) : (
                    <div className="list-group">
                      {products.map(p => (
                        <div
                          key={p.id}
                          className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                        >
                          <div className="d-flex align-items-center gap-3">
                            {p.imagen && (
                              <img
                                src={p.imagen}
                                alt={p.nombre}
                                style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                              />
                            )}
                            <span>{p.nombre}</span>
                          </div>
                          <BootstrapButton
                            variant={listMode === 'MODIFY' ? 'warning' : 'danger'}
                            size="sm"
                            onClick={() => handleSelectProduct(p)}
                          >
                            {listMode === 'MODIFY' ? '✏️' : '🗑️'}
                          </BootstrapButton>
                        </div>
                      ))}
                    </div>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <BootstrapButton variant="secondary" onClick={() => setShowListModal(false)}>
                    Cerrar
                  </BootstrapButton>
                </Modal.Footer>
              </Modal>

              {/* Modal para Crear/Editar Producto */}
              <Modal show={showProductModal} onHide={handleCloseProductModal} size="lg">
                <Modal.Header closeButton>
                  <Modal.Title>{editingId ? 'Modificar Producto' : 'Agregar Nuevo Producto'}</Modal.Title>
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
                      <Form.Label>Subir Imagen del Producto {!editingId && '(Si requiere foto)'}</Form.Label>
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
                  <BootstrapButton variant="secondary" onClick={handleCloseProductModal}>
                    Cancelar
                  </BootstrapButton>
                  <BootstrapButton
                    variant="primary"
                    onClick={handleSaveProduct}
                    disabled={isSubmittingProduct}
                  >
                    {isSubmittingProduct ? 'Guardando...' : (editingId ? 'Guardar Cambios' : 'Agregar Producto')}
                  </BootstrapButton>
                </Modal.Footer>
              </Modal>

              <hr className="my-5" />

              <h2>Gestión de Usuarios</h2>
              <div className="mb-3 d-flex gap-2 justify-content-center">
                <Button onClick={() => { resetUserForm(); setShowUserModal(true); }} className="btn-primary">
                  Agregar Nuevo Usuario
                </Button>
                <Button onClick={() => openUserListModal('MODIFY')} className="btn-warning" style={{ color: 'white' }}>
                  Modificar Usuario
                </Button>
                <Button onClick={() => openUserListModal('DELETE')} className="btn-danger" style={{ color: 'white' }}>
                  Eliminar Usuario
                </Button>
              </div>

              {/* Modal de Listado de Usuarios */}
              <Modal show={showUserListModal} onHide={() => setShowUserListModal(false)} size="lg" scrollable>
                <Modal.Header closeButton>
                  <Modal.Title>
                    {userListMode === 'MODIFY' ? 'Seleccionar Usuario a Modificar' : 'Seleccionar Usuario a Eliminar'}
                  </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {users.length === 0 ? (
                    <p>No hay usuarios disponibles.</p>
                  ) : (
                    <div className="list-group">
                      {users.map(u => (
                        <div
                          key={u.id}
                          className="list-group-item list-group-item-action d-flex justify-content-between align-items-center"
                        >
                          <div className="d-flex align-items-center gap-3">
                            <span>{u.nombre ? `${u.nombre} (${u.email})` : u.email} - {u.role}</span>
                          </div>
                          <BootstrapButton
                            variant={userListMode === 'MODIFY' ? 'warning' : 'danger'}
                            size="sm"
                            onClick={() => handleSelectUser(u)}
                          >
                            {userListMode === 'MODIFY' ? '✏️' : '🗑️'}
                          </BootstrapButton>
                        </div>
                      ))}
                    </div>
                  )}
                </Modal.Body>
                <Modal.Footer>
                  <BootstrapButton variant="secondary" onClick={() => setShowUserListModal(false)}>
                    Cerrar
                  </BootstrapButton>
                </Modal.Footer>
              </Modal>

              {/* Modal para Crear/Editar Usuario */}
              <Modal show={showUserModal} onHide={handleCloseUserModal}>
                <Modal.Header closeButton>
                  <Modal.Title>{editingUserId ? 'Modificar Usuario' : 'Agregar Nuevo Usuario'}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  {userError && <div className="alert alert-danger">{userError}</div>}
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Nombre</Form.Label>
                      <Form.Control
                        type="text"
                        name="nombre"
                        value={newUser.nombre}
                        onChange={handleUserInputChange}
                        placeholder="Nombre completo"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={newUser.email}
                        onChange={handleUserInputChange}
                        placeholder="correo@ejemplo.com"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Contraseña {editingUserId && '(Dejar en blanco para mantener actual)'}</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={newUser.password}
                        onChange={handleUserInputChange}
                        placeholder="******"
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label>Rol</Form.Label>
                      <Form.Select
                        name="role"
                        value={newUser.role}
                        onChange={handleUserInputChange}
                      >
                        <option value="USER">Usuario</option>
                        <option value="ADMIN">Administrador</option>
                      </Form.Select>
                    </Form.Group>
                  </Form>
                </Modal.Body>
                <Modal.Footer>
                  <BootstrapButton variant="secondary" onClick={handleCloseUserModal}>
                    Cancelar
                  </BootstrapButton>
                  <BootstrapButton
                    variant="primary"
                    onClick={handleSaveUser}
                    disabled={isSubmittingUser}
                  >
                    {isSubmittingUser ? 'Guardando...' : (editingUserId ? 'Guardar Cambios' : 'Agregar Usuario')}
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
