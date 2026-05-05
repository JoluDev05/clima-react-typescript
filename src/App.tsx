import styles from './App.module.css'
import Form from './components/Form/Form'

function App() {
  

  return (
    <>
      <h1 className={styles.title}>Clima App</h1>
      <div className={styles.container}>
        <Form />
        <div>Content 2</div>
      </div>
    </>
  )
}

export default App
