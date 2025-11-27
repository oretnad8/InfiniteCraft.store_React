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
  requiresPhoto?: boolean;
}

interface ProductModalProps {
  product: Product | null;
  onClose: () => void;
  onAddToCart: (id: number, quantity: number, photos: File[]) => void;
}

const ProductModal: React.FC<ProductModalProps> = ({ product, onClose, onAddToCart }) => {
  const [photos, setPhotos] = useState<File[]>([]);
  const [photoPreviews, setPhotoPreviews] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);

  if (!product) {
    return null;
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newPhotos = Array.from(files);
      setPhotos(newPhotos);

      // Generar vistas previas
      const previews: string[] = [];
      let loadedCount = 0;

      newPhotos.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result as string);
          loadedCount++;
          if (loadedCount === newPhotos.length) {
            setPhotoPreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });

      setError('');
    }
  };

  const handleAddToCartClick = () => {
    // Si el producto requiere foto de referencia, validar que se haya subido
    if (product.requiresPhoto && photos.length === 0) {
      setError('Debe subir al menos una fotografía de referencia para continuar.');
      return;
    }

    // Pasar el ID del producto, la cantidad y las fotos
    onAddToCart(product.id, quantity, photos);
    onClose();
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

            {/* Campo de cantidad */}
            <div className="form-field" style={{ margin: '1rem 0' }}>
              <label htmlFor="quantity" style={{ fontWeight: 'bold' }}>Cantidad:</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                style={{ width: '100%', marginTop: '0.5rem', padding: '0.5rem' }}
              />
            </div>

            {/* Campo para subir fotografía (solo si es personalizado) */}
            {product.requiresPhoto && (
              <div className="form-field" style={{ margin: '1rem 0' }}>
                <label htmlFor="photo-upload" style={{ fontWeight: 'bold' }}>Foto de Referencia (Requerida):</label>
                <input
                  type="file"
                  id="photo-upload"
                  name="photo-upload"
                  accept="image/*"
                  multiple
                  onChange={handleFileChange}
                  style={{ width: '100%', marginTop: '0.5rem' }}
                />
                {/* Vistas previas en miniatura */}
                <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
                  {photoPreviews.map((preview, index) => (
                    <img
                      key={index}
                      src={preview}
                      alt={`Vista previa ${index + 1}`}
                      style={{ width: '100px', height: '100px', objectFit: 'cover', border: '1px solid #ddd' }}
                    />
                  ))}
                </div>
                {/* Mensaje de error */}
                {error && (
                  <p style={{ color: '#e74c3c', fontSize: '0.9rem', marginTop: '5px' }}>{error}</p>
                )}
              </div>
            )}

            <Button onClick={handleAddToCartClick}>Agregar al Carrito</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductModal;
