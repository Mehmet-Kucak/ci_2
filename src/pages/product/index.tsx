import React from 'react';
import Link from 'next/link';

const ProductPage = () => {
    return (
        <div>
            <h1>Product Page</h1>
            <Link href="/">Go to main page to choose a product</Link>
            <style jsx global>{`
                div {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    padding: 10px;
                }
                h1 {
                    font-size: 2em;
                    padding: 10px;
                    font-family: 'Arial';
                }
                a {
                    color: #0070f3;
                    text-decoration: none;
                    padding: 10px;
                    font-family: 'Arial';
                }
                a:hover {
                    text-decoration: underline;
                }
            `}</style>
        </div>
    );
};

export default ProductPage;