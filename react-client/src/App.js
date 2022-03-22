import './App.css'
import Toolbar from './components/Toolbar/Toolbar'
import 'bootstrap/dist/css/bootstrap.min.css'
import Home from './components/Home/Home'
import { Route } from 'react-router-dom'
import { Switch } from 'react-router-dom'
import './App.css'
import Retrospective from './components/Retrospective/Retrospective'

function App () {
  return (
    <div className='App'>
      <Toolbar />
      <Switch>
        <Route path='/retrospectives' component={Retrospective} />
        <Route path='/' component={Home} exact />
        <Route
          render={() => {
            return <h2 className='pageNotFoundLabel'>Page not found!</h2>
          }}
        />
      </Switch>
    </div>
  )
}

export default App
