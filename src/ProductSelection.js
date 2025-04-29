import React, { useState } from 'react';
import './ProductSelection.css';

const ProductSelection = ({
  categories,
  products,
  selectedCategory,
  setSelectedCategory,
  selectedProducts,
  setSelectedProducts
}) => {
  const [selectedProductsState, setSelectedProductsState] = useState({});

  const maxProductsPerRow = 4; // Número máximo de productos por fila

  // Manejar selección/deselección de productos
  const handleProductChange = (product) => {
    setSelectedProductsState(prevSelected => {
      const newSelection = { ...prevSelected };
      newSelection[product.id] = !newSelection[product.id];

      const selected = Object.keys(newSelection)
        .filter(id => newSelection[id])
        .map(id => {
          const p = products.find(p => p.id.toString() === id);
          return p;
        });

      setSelectedProducts(selected);
      return newSelection;
    });
  };

  // Filtrar productos por categoría seleccionada
  const filteredProducts = selectedCategory
    ? products.filter(product => product.idCategoria === Number(selectedCategory))
    : [];

  // Agrupar productos en filas
  const productRows = [];
  for (let i = 0; i < filteredProducts.length; i += maxProductsPerRow) {
    productRows.push(filteredProducts.slice(i, i + maxProductsPerRow));
  }

  return (
    <div className='product-selection-container'>
      <div className='product-selection-header'>
        <h3>Categoría:</h3>
        <select
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setSelectedProductsState({});
            setSelectedProducts([]);
          }}
          value={selectedCategory || ''}
        >
          <option value="">Seleccione una categoría</option>
          {categories.map(cat => (
            <option key={cat.id} value={cat.id}>
              {cat.nombre}
            </option>
          ))}
        </select>
      </div>

      {filteredProducts.length > 0 && (
        <div className="category-products-item" style={{ marginTop: '20px' }}>
          {productRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              style={{
                display: 'flex',
                justifyContent: 'center',
                marginBottom: '20px',
                flexWrap: 'wrap',
              }}
            >
              {row.map(product => (
                <div
                  key={product.id}
                  className="product-item"
                  onClick={() => handleProductChange(product)}
                  style={{
                    width: '150px',
                    height: '150px',
                    padding: '10px',
                    margin: '10px',
                    border: selectedProductsState[product.id] ? '2px solid green' : '1px solid gray',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    position: 'relative',
                    textAlign: 'center'
                  }}
                >
                  <img
                    src="https://img.freepik.com/vector-premium/icono-marca-verificacion_108855-4739.jpg"
                    alt="Seleccionado"
                    style={{
                      width: '24px',
                      height: '24px',
                      position: 'absolute',
                      top: '5px',
                      right: '5px',
                      visibility: selectedProductsState[product.id] ? 'visible' : 'hidden'
                    }}
                  />
                  <label>{product.nombre}</label>
                  <img
                    src={product.url}
                    alt={product.nombre}
                    style={{
                      width: '90%',
                      height: '80%',
                      objectFit: 'cover',
                      marginTop: '10px'
                    }}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductSelection;
