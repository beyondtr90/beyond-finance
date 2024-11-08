// app/loading.js
import React from "react";
import Navbar from "../../../components/navbar/Navbar";
import TabBar from "../../../components/tabBar/TabBar";

const Loading = () => {
  return (
    <div style={styles.container}>
      <Navbar />
      <main style={styles.loadingMain}>
        <div style={styles.loader}>
          <p>Yükleniyor...</p>
          <div style={styles.spinner}></div>
        </div>
      </main>
      <TabBar />
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    height: '100vh',
  },
  loadingMain: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: 'calc(100vh - 100px)',
  },
  loader: {
    textAlign: 'center',
  },
  spinner: {
    marginTop: '20px',
    border: '8px solid #f3f3f3',
    borderTop: '8px solid #3498db',
    borderRadius: '50%',
    width: '50px',
    height: '50px',
    animation: 'spin 2s linear infinite',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};

export default Loading;