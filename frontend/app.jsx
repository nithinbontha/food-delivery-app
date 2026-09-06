import React, { useState, useEffect } from 'react';

function App() {
  const [foods, setFoods] = useState([]);
  const [cart, setCart] = useState({});
  const [ordered, setOrdered] = useState(false);

  useEffect(() => {
    // Dynamic payload retrieval from local running API channel
    fetch('http://localhost:5000/api/food/list')
      .then(res => res.json())
      .then(res => { if(res.success) setFoods(res.data); })
      .catch(err => console.error("Error linking with endpoint:", err));
  }, []);

  const changeQuantity = (id, delta) => {
    setCart(prev => {
      const current = prev[id] || 0;
      const next = current + delta;
      const copy = { ...prev };
      if (next <= 0) delete copy[id];
      else copy[id] = next;
      return copy;
    });
  };

  const calculateTotal = () => {
    return Object.entries(cart).reduce((sum, [id, qty]) => {
      const item = foods.find(f => f._id === id);
      return sum + (item ? item.price * qty : 0);
    }, 0).toFixed(2);
  };

  const handleCheckout = async () => {
    if (Object.keys(cart).length === 0) return alert("Your food cart is empty!");
    
    const payload = {
      items: Object.entries(cart).map(([id, quantity]) => ({ foodId: id, quantity })),
      amount: parseFloat(calculateTotal())
    };

    try {
      const response = await fetch('http://localhost:5000/api/order/place', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await response.json();
      if(data.success) {
        setOrdered(true);
        setCart({});
      }
    } catch(err) {
      alert("Failed to connect to backend server.");
    }
  };

  return (
    <div style={{ fontFamily: 'sans-serif', padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ color: '#e63946' }}>🍔 FastDelivery Express</h1>
      <hr />
      
      {ordered ? (
        <div style={{ background: '#d4edda', color: '#155724', padding: '20px', borderRadius: '5px', marginTop: '20px' }}>
          <h3>🎉 Success! Your meal processing order has been dispatched.</h3>
          <button onClick={() => setOrdered(false)} style={{ padding: '8px 16px', cursor: 'pointer' }}>Order More</button>
        </div>
      ) : (
        <div style={{ display: 'flex', gap: '40px', marginTop: '20px' }}>
          {/* Menu Panel */}
          <div style={{ flex: 2 }}>
            <h2>Menu Categories</h2>
            {foods.map(item => (
              <div key={item._id} style={{ border: '1px solid #ddd', padding: '15px', borderRadius: '8px', marginBottom: '15px' }}>
                <h3>{item.name} <span style={{ float: 'right', color: '#2a9d8f' }}>${item.price}</span></h3>
                <p style={{ color: '#666' }}>{item.description}</p>
                <button onClick={() => changeQuantity(item._id, 1)} style={{ background: '#e63946', color: '#fff', border: 'none', padding: '8px 12px', borderRadius: '4px', cursor: 'pointer' }}>
                  Add to Cart ({cart[item._id] || 0})
                </button>
              </div>
            ))}
          </div>

          {/* Cart Panel */}
          <div style={{ flex: 1, background: '#f8f9fa', padding: '20px', borderRadius: '8px', height: 'fit-content' }}>
            <h2>Your Cart</h2>
            {Object.keys(cart).length === 0 ? <p>Cart is entirely empty</p> : (
              <>
                {Object.entries(cart).map(([id, qty]) => {
                  const item = foods.find(f => f._id === id);
                  if (!item) return null;
                  return (
                    <div key={id} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
                      <span>{item.name} (x{qty})</span>
                      <div>
                        <button onClick={() => changeQuantity(id, -1)} style={{ marginRight: '5px' }}>-</button>
                        <button onClick={() => changeQuantity(id, 1)}>+</button>
                      </div>
                    </div>
                  );
                })}
                <h3>Total: ${calculateTotal()}</h3>
                <button onClick={handleCheckout} style={{ background: '#2a9d8f', color: '#fff', width: '100%', border: 'none', padding: '12px', borderRadius: '4px', fontWeight: 'bold', cursor: 'pointer' }}>
                  Place Food Delivery Order
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
