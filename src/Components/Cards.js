import { useEffect, useState, useContext } from "react";
import { globalContext } from '../GlobalContext/GlobalContext'

export default function Cards() {
    const [productList, setProductList] = useState([]);
    const { cart, setCart } = useContext(globalContext);

    useEffect(() => {

        if (productList.length === 0 && !localStorage.getItem("productList")) {
            fetch('https://fakestoreapi.com/products')
                .then(data => data.json())
                .then(data => {
                    localStorage.setItem("productList", JSON.stringify(data));
                    setProductList(data);
                })
        }
        else {
            setProductList(JSON.parse(localStorage.getItem("productList")));
        }
    }, []);

    const addItems = (item) => {
        const newCart = [...cart, { item, quantity: 1 }]
        setCart(newCart);
        localStorage.setItem("cartItem", JSON.stringify(newCart));
    }

    function increaseQty(id) {
        let cartItems = [];
        for (const itemKey of cart) {
            if (itemKey.item.id === id) {
                itemKey.quantity += 1;
            }
            cartItems.push(itemKey);
        }
        setCart(cartItems)
        localStorage.setItem("cartItem", JSON.stringify(cartItems));
    }

    function decreaseQty(id) {
        let cartItems = [];
        for (const itemKey of cart) {
            if (itemKey.item.id === id) {
                itemKey.quantity -= 1;
                if (itemKey.quantity !== 0) cartItems.push(itemKey);
                continue;
            }
            cartItems.push(itemKey);

        }
        setCart(cartItems)
        localStorage.setItem("cartItem", JSON.stringify(cartItems));
    }

    function find(id) {
        return cart.find(({ item }) => item.id === id)
    }

    function itemQuantity(id) {
        for (const itemKey of cart) {
            if (itemKey.item.id === id) {
                return itemKey.quantity;
            }
        }
    }


    return (
        <div className=" max-w-sm sm:max-w-2xl lg:max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 sm:mt-4 gap-x-6 gap-y-8 lg:grid-cols-4">
                {
                    productList.map((item, key) => {
                        return (
                            <div className="bg-white flex flex-col rounded shadow-lg p-4" key={key}>

                                <div className="h-72">
                                    <img src={item.image} alt="Product Item Image" className="h-full w-full object-fill rounded-2xl" />
                                </div>

                                <div className="font-bold mt-4 line-clamp-1">
                                    {item.title}
                                </div>

                                <div className="flex justify-between my-4">
                                    <p>${item.price}</p>
                                    <p><i className="fa fa-star" />{item.rating.rate}</p>
                                </div>
                                {
                                    find(item.id) ? (
                                        <div className="w-full flex justify-center py-2 mt-auto bg-gray-200 text-white rounded shadow focus:ring-2">
                                            <button id="btn" onClick={() => decreaseQty(item.id)} className="w-6 h-6 mx-5 bg-green-700 text-white rounded shadow focus:ring-2">
                                                -
                                            </button>
                                            <p className=" text-black">{itemQuantity(item.id)}</p>
                                            <button id="btn" onClick={() => increaseQty(item.id)} className="w-6 h-6 mx-5 bg-green-700 text-white rounded shadow focus:ring-2">
                                                +
                                            </button>
                                        </div>

                                    ) : (
                                        <button id="btn" onClick={() => addItems(item)} className="mt-auto w-full py-2 bg-green-700 text-white rounded shadow focus:ring-2">
                                            Add to Cart
                                        </button>
                                    )
                                }

                            </div>
                        )
                    })
                }
            </div>
        </div>
    );
}