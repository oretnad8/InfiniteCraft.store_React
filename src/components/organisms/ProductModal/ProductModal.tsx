import React, { useState } from 'react';
import Button from '../../atoms/Button/Button';
import './ProductModal.css';

interface Product {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  descripcion: string;
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (id: number, photo: string) => void; // Firma actualizada
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  if (!product) {
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhoto(file);

    if (file) {
      // Generar vista previa y convertir a Base64 para almacenamiento
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setError(''); // Limpiar error si se selecciona un archivo
    } else {
      setPhotoPreview(null);
    }
  };

  const handleAddToCartClick = () => {
    if (!photo || !photoPreview) {
      setError('Debe subir una fotografía de referencia para continuar.');
      return;
    }
    
    // Pasa el ID del producto y la foto en formato Base64
    onAddToCart(product.id, photoPreview);
  };

  return (
    <div className="custom-modal">
      <div className="custom-modal-contenido">
        <span className="cerrar" onClick={onClose}>&times;</span>
        <h2>{product.nombre}</h2>
        <div className="modal-body">
            <img src={product.imagen} alt={product.nombre} className="modal-img" />
            <div className="modal-details">
                <p><strong>Categoría:</strong> {product.categoria}</p>
                <p>{product.descripcion}</p>
                <p className="modal-price">Precio: ${product.precio.toLocaleString('es-CL')}</p>
                
                {/* Campo para subir fotografía */}
                <div className="form-field" style={{ margin: '1rem 0' }}>
                  <label htmlFor="photo-upload" style={{ fontWeight: 'bold' }}>Foto de Referencia:</label>
                  <input
                    type="file"
                    id="photo-upload"
                    name="photo-upload"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  />
                  {/* Vista previa en miniatura */}
                  {photoPreview && (
                    <img 
                      src={photoPreview} 
                      alt="Vista previa" 
                      style={{ width: '100px', height: '100px', objectFit: 'cover', marginTop: '10px', border: '1px solid #ddd' }} 
                    />
                  )}
                  {/* Mensaje de error */}
                  {error && (
                    <p style={{ color: '#e74c3c', fontSize: '0.9rem', marginTop: '5px' }}>{error}</p>
                  )}
                </div>
                
                <Button onClick={handleAddToCartClick}>Agregar al Carrito</Button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;