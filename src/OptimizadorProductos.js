import { useEffect, useState } from 'react';
import ProductSelection from './ProductSelection';
import Shelf from './Shelf';
import './App.css';
import './modal.css';
import axios from 'axios';

function OptimizadorProductos() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [algorithmResult, setAlgorithmResult] = useState(null);
  const [porcentajeCruce, setPorcentajeCruce] = useState(0.8);
  const [porcentajeMutacion, setPorcentajeMutacion] = useState(0.02);
  const [poblacion, setPoblacion] = useState(50);
  const [generaciones, setGeneraciones] = useState(100);
  const [volumenEstante, setVolumenMaximo] = useState(10000);
  const [alpha, setAlpha] = useState(10);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    axios.get('http://127.0.0.1:5000/category')
      .then((response) => setCategories(response.data))
      .catch((error) => console.error('Error al obtener categorías:', error));

    axios.get('http://127.0.0.1:5000/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error al obtener productos:', error));
  }, []);

  const handleRunAlgorithm = async () => {
    if (!selectedCategory) {
      alert("Selecciona una categoría antes de ejecutar el algoritmo");
      return;
    }


    const parametrosAlgoritmo = {
      porcentajeCruce,
      porcentajeMutacion,
      poblacion,
      generaciones,
      volumenMaximo: volumenEstante,
      alpha
    };

    let productosEnviar = selectedProducts;

    if (productosEnviar.length === 0) {
      if (selectedCategory && products.length > 0) {
        productosEnviar = products
  .filter(product => product.idCategoria === parseInt(selectedCategory))
  .map(product => ({
    id: product.id,
    volumen: product.volumen,
    nombre: product.nombre,
    ganancia:product.ganancia,
  }));
      } else {
        productosEnviar = products.map(product => product.id);
      }
    }
    
    try {
      setLoading(true);
      console.log("ID de categoría seleccionada:", selectedCategory);
      console.log("Productos enviados:", productosEnviar);

      const response = await axios.post('http://127.0.0.1:5000/algorithm/', {
        ...parametrosAlgoritmo,
        categoriaSeleccionada: parseInt(selectedCategory),
        productos: productosEnviar,
      
      });

      console.log("Respuesta del algoritmo:", response.data);
      setAlgorithmResult(response.data);
    } catch (error) {
      console.error('Error al ejecutar el algoritmo:', error);
    } finally {
      setLoading(false);
    }
  };

  const openModal = () => {
    setShowModal(true);
  };

  const confirmModal = () => {
    setShowModal(false);
    handleRunAlgorithm();
  };

  return (
    <div className='principal-container'>
      <h1>Optimizador de estantería</h1>
      <h2 className='titulo-seccion'>Selecciona tus productos</h2>
      <ProductSelection
        categories={categories}
        products={products}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedProducts={selectedProducts}
        setSelectedProducts={setSelectedProducts}
      />

      <button onClick={openModal}>Iniciar algoritmo genético</button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Configuración del Algoritmo</h2>

            <label>
              Porcentaje de Cruce:
              <input type="number" value={porcentajeCruce} onChange={(e) => setPorcentajeCruce(parseFloat(e.target.value))} step="0.1" />
            </label>

            <label>
              Porcentaje de Mutación:
              <input type="number" value={porcentajeMutacion} onChange={(e) => setPorcentajeMutacion(parseFloat(e.target.value))} step="0.1" />
            </label>

            <label>
              Tamaño de Población:
              <input type="number" value={poblacion} onChange={(e) => setPoblacion(parseInt(e.target.value))} />
            </label>

            <label>
              Número de Generaciones:
              <input type="number" value={generaciones} onChange={(e) => setGeneraciones(parseInt(e.target.value))} />
            </label>

            <label>
              Volumen del Estante:
              <input type="number" value={volumenEstante} onChange={(e) => setVolumenMaximo(parseInt(e.target.value))} />
            </label>

            <label>
              Porcentaje de Castigo al Exceder Volumen:
              <input type="number" value={alpha} onChange={(e) => setAlpha(parseFloat(e.target.value))} />
            </label>

            <div className="modal-buttons">
              <button onClick={confirmModal}>Confirmar</button>
              <button onClick={() => setShowModal(false)}>Cancelar</button>
            </div>
          </div>
        </div>
      )}
 <h2 className='titulo-seccion'>Estante de productos</h2>
<Shelf className='shelf'
  algorithmResult={algorithmResult}
  loading={loading}
  products={
    selectedProducts.length > 0
    ? products.filter(p => selectedProducts.some(sp => sp.id === p.id))
    : products.filter(p => p.idCategoria === parseInt(selectedCategory))
  }
/>
    </div>
    
  );
}

export default OptimizadorProductos;
