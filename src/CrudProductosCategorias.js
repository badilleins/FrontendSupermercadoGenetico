import { useEffect, useState } from 'react';
import axios from 'axios';
import './CrudProductosCategorias.css';

function CrudProductosCategorias() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);

  const [newCategory, setNewCategory] = useState('');
  const [editingCategory, setEditingCategory] = useState(null);

  const [newProduct, setNewProduct] = useState({
    nombre: '',
    volumen: '',
    ganancia: '',
    idCategoria: '',
    url: ''
  });
  const [editingProduct, setEditingProduct] = useState(null);

  const [isCategoryView, setIsCategoryView] = useState(true);

  const fetchData = () => {
    axios.get('http://127.0.0.1:5000/category')
      .then(res => setCategories(res.data));

    axios.get('http://127.0.0.1:5000/products')
      .then(res => setProducts(res.data));
  };

  useEffect(() => {
    fetchData();
  }, []);

  const addOrUpdateCategory = () => {
    if (editingCategory) {
      axios.put(`http://127.0.0.1:5000/category/`, {
        id: editingCategory.id,
        nombre: newCategory
      })
        .then(() => {
          setNewCategory('');
          setEditingCategory(null);
          fetchData();
        })
        .catch((error) => {
          console.error("Error actualizando la categoría:", error);
        });
    } else {
      axios.post('http://127.0.0.1:5000/category/', { nombre: newCategory })
        .then(() => {
          setNewCategory('');
          fetchData();
        })
        .catch((error) => {
          console.error("Error creando la categoría:", error);
        });
    }
  };

  const deleteCategory = (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar esta categoría?");
    if (confirmDelete) {
      axios.delete('http://127.0.0.1:5000/category/', {
        data: { id }
      })
      .then(() => {
        fetchData();
      })
      .catch((error) => {
        console.error("Error eliminando la categoría:", error);
      });
    }
  };

  const editCategory = (cat) => {
    setNewCategory(cat.nombre);
    setEditingCategory(cat);
  };

  const addOrUpdateProduct = () => {
    if (editingProduct) {
      axios.put(`http://127.0.0.1:5000/products/`, {
        id: editingProduct.id,
        nombre: newProduct.nombre,
        volumen: newProduct.volumen,
        ganancia: newProduct.ganancia,
        idCategoria: newProduct.idCategoria,
        url: newProduct.url
      })
        .then(() => {
          setNewProduct({ nombre: '', volumen: '', ganancia: '', idCategoria: '', url: '' });
          setEditingProduct(null);
          fetchData();
        })
        .catch((error) => {
          console.error("Error actualizando el producto:", error);
        });
    } else {
      axios.post('http://127.0.0.1:5000/products/', newProduct)
        .then(() => {
          setNewProduct({ nombre: '', volumen: '', ganancia: '', idCategoria: '', url: '' });
          fetchData();
        })
        .catch((error) => {
          console.error("Error creando el producto:", error);
        });
    }
  };

  const deleteProduct = (id) => {
    const confirmDelete = window.confirm("¿Estás seguro de que deseas eliminar este producto?");
    if (confirmDelete) {
      axios.delete('http://127.0.0.1:5000/products/', {
        data: { id }
      })
      .then(() => {
        fetchData();
      })
      .catch((error) => {
        console.error("Error eliminando el producto:", error);
      });
    }
  };

  const editProduct = (prod) => {
    setNewProduct({
      id: prod.id,
      nombre: prod.nombre,
      volumen: prod.volumen,
      ganancia: prod.ganancia,
      idCategoria: prod.idCategoria,
      url: prod.url
    });
    setEditingProduct(prod);
  };

  return (
    <div className="crud-container">
      {/* Botones para cambiar entre las vistas */}
      <div className='buttons button-container'>
      <button onClick={() => setIsCategoryView(true)}>Gestión de Categorías</button>
      <button onClick={() => setIsCategoryView(false)}>Gestión de Productos</button>
      </div>

      {/* Vista de Categorías */}
      {isCategoryView && (
        <>
          <h2>Gestión de Categorías</h2>
          <input
            type="text"
            placeholder="Nueva categoría"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button className='list-button' onClick={addOrUpdateCategory}>
            {editingCategory ? 'Actualizar Categoría' : 'Agregar Categoría'}
          </button>
          <br />
          <h3>Lista de Categorías</h3>
          <ul>
            {categories.map((cat) => (
              <li key={cat.id}>
                {cat.nombre}
                <div className='buttons'>
                  <button className='editButton' onClick={() => editCategory(cat)}>Editar</button>
                  <button className='deleteButton' onClick={() => deleteCategory(cat.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}

      {/* Vista de Productos */}
      {!isCategoryView && (
        <>
          <h2>Gestión de Productos</h2>
          <input
            type="text"
            placeholder="Nombre"
            value={newProduct.nombre}
            onChange={(e) => setNewProduct({ ...newProduct, nombre: e.target.value })}
          />
          <input
            type="number"
            placeholder="Volumen"
            value={newProduct.volumen}
            onChange={(e) => setNewProduct({ ...newProduct, volumen: e.target.value })}
          />
          <input
            type="number"
            placeholder="Ganancia"
            value={newProduct.ganancia}
            onChange={(e) => setNewProduct({ ...newProduct, ganancia: e.target.value })}
          />
          <select
            value={newProduct.idCategoria}
            onChange={(e) => setNewProduct({ ...newProduct, idCategoria: e.target.value })}
          >
            <option value="">Seleccione categoría</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.nombre}</option>
            ))}
          </select>
          <input
            type="text"
            placeholder="URL"
            value={newProduct.url}
            onChange={(e) => setNewProduct({ ...newProduct, url: e.target.value })}
          />
          <button  className='list-button' onClick={addOrUpdateProduct}>
            {editingProduct ? 'Actualizar Producto' : 'Agregar Producto'}
          </button>
<br />
        <h3>Lista de Productos</h3>
          <ul>
            {products.map((prod) => (
              <li key={prod.id}>
                {prod.nombre}
                <div className='buttons'>
                  <button className='editButton' onClick={() => editProduct(prod)}>Editar</button>
                  <button className='deleteButton' onClick={() => deleteProduct(prod.id)}>Eliminar</button>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

export default CrudProductosCategorias;
