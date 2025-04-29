import React, { useEffect, useState, useRef } from 'react'; 
import './Shelf.css';

const Shelf = ({ algorithmResult, loading, products, volumenMaximoPorFila }) => {
    const [currentProducts, setCurrentProducts] = useState([]);
    const intervalIdRef = useRef(null);

    useEffect(() => {
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
        if (algorithmResult && algorithmResult.ids && algorithmResult["Mejor combinación"]) {
            const selectedIds = algorithmResult.ids;
            const quantities = algorithmResult["Mejor combinación"];

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

            setCurrentProducts(selectedProducts);
        }
    }, [algorithmResult, products]);

    if (!currentProducts.length) {
        return <div className='shelf-container'></div>;
    }

    const maxProductsPerRow = 4;
    const rows = [];

    for (let i = 0; i < currentProducts.length; i += maxProductsPerRow) {
        rows.push(currentProducts.slice(i, i + maxProductsPerRow));
    }

    return (
        <div className='shelf'>
            {loading ? (
                <h3>Optimizando combinaciones...</h3>
            ) : (
                <h3>Mejor combinación de productos para este estante con ganancia de: {algorithmResult["Mejor ganancia"]} %</h3>
            )}
            <div className='shelf-container'>
                {rows.map((row, rowIndex) => (
                    <div
                        key={rowIndex}
                        className='shelf-row'
                    >
                        {row.map((product, index) => (
                            <div
                                key={product.id || index}
                                className='estante'
                                style={{
                                    flex: `1 0 calc(100% / ${maxProductsPerRow})`,
                                    maxWidth: `${100 / maxProductsPerRow}%`,
                                }}
                            >
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
