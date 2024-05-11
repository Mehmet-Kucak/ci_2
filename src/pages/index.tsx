"use client"

import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useState } from 'react';


const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [data, setData] = useState('');
  const [loading, setLoading] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(0);
  

  const getProducts = async () => {
    setLoading(true);
    const startTime = Date.now();
    const response = await fetch('/api/getProducts');
    let data = await response.json();
    data = data.data;
    await data.splice(0, 3);
    setData(data);
    setLoading(false);
    const endTime = Date.now();
    setTimeElapsed((endTime - startTime)/1000);
  }

  return (
    <>
      <Head>
        <title>Ci</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className={styles.main}>
        <h1 className={styles.title}>Ci</h1>
        <button className={styles.card} onClick={getProducts}>Get Products</button>
        {(data != '' || loading) && (loading ? 
        <div>
          <p className={styles.code} style={{textAlign:"center"}}>Loading...</p>
          <div className={styles.spinner}></div>
        </div>: 
        <div style={{backgroundColor:"#fff1", padding:10, margin:10, borderRadius:10}}>
          <p className={styles.code}>Time Elapsed: {timeElapsed} seconds</p>
          <br></br>
          {data.map((product, index) => {
            return (
              <div key={index} className={styles.card}>
                <p className={styles.code}>{product[0]}</p>
              </div>
            )
          })}
        </div>
        )}
      </main>
    </>
  )
}