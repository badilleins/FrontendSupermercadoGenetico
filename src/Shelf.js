import React, { useEffect, useState, useRef } from 'react'; 
import './Shelf.css';

const Shelf = ({ algorithmResult, loading, products, numRows, volumenMaximoPorFila }) => {
    const [currentProducts, setCurrentProducts] = useState([]);
    const intervalIdRef = useRef(null);

    useEffect(() => {
        console.log("productos en shelf", products);
        console.log("algoritmo en shelf", algorithmResult);
        console.log('Loading:', loading);
        if (loading) {
            intervalIdRef.current = setInterval(() => {
                const shuffled = [...products].sort(() => 0.5 - Math.random());
                setCurrentProducts(shuffled.slice(0, 10));
            }, 500);
        } else {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
                intervalIdRef.current = null;
            }
        }

        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
                intervalIdRef.current = null;
            }
        };
    }, [loading, products]);

    useEffect(() => {
                console.log("productos en shelf", products);

        console.log("algoritmo en shelf2", algorithmResult);
    
        if (algorithmResult && algorithmResult.ids && algorithmResult["Mejor combinación"]) {
            const selectedIds = algorithmResult.ids;
            const quantities = algorithmResult["Mejor combinación"];
    
            console.log('IDs seleccionados:', selectedIds);
            console.log('Cantidades:', quantities);
    
            let selectedProducts = [];
    
            selectedIds.forEach((id, index) => {
                const quantity = quantities[index];
                const product = products.find(p => String(p.id) === String(id));
    
                if (product && quantity > 0) {
                    for (let i = 0; i < quantity; i++) {
                        selectedProducts.push({ ...product });
                    }
                }
            });
    console.log('Productos disponibles:', products);  
            console.log('Productos seleccionados:', selectedProducts);
            
            setCurrentProducts(selectedProducts);
        }
    }, [algorithmResult, products]);
    
    if (!currentProducts.length) {
        return <div className='shelf-container'></div>;
    }

    const rows = [];
    let currentRow = [];
    let currentVolume = 0; 

    const rowVolumeLimit = volumenMaximoPorFila;

    currentProducts.forEach((product, index) => {
        const productVolume = product.volumen; 

        if (currentVolume + productVolume <= rowVolumeLimit) {
            currentRow.push(product);
            currentVolume += productVolume; 
        } else {
            rows.push(currentRow);
            currentRow = [product]; 
            currentVolume = productVolume; 
        }

        if (index === currentProducts.length - 1) {
            rows.push(currentRow);
        }
    });

    if (rows.length > numRows) {
        rows.length = numRows;
    }

    return (
        <div className='shelf'>
            {loading ? <h3>Optimizando combinaciones...</h3> : <h3>Mejor combinación de productos para este estante con ganancia de: {algorithmResult["Mejor ganancia"]} %</h3>}
            <div className='shelf-container'>
            {rows.map((row, rowIndex) => (
                <div key={rowIndex} className='shelf-row'>
                    {row.map((product, index) => (
                      <div key={product.id || index} className='estante'>
                        <div className='product-item optimized'>
                          <label>{product.nombre}</label>
                          <img className='product-img' src={product.url} alt={product.nombre} />
                        </div>
                      </div>
                    ))}
                </div>
            ))}
            </div>
        </div>
    );
};

export default Shelf;
