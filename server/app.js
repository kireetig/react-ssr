import 'ignore-styles';
import express from 'express';
import { matchRoutes } from 'react-router-config';
import Routes from '../src/Routes';
import configureStore from '../src/store';
import render from './render';

const app = express();

const port = process.env.PORT || 3001;

// Serve static assets
app.use(express.static('./build'));

app.get('*', (req, res) => {
  const store = configureStore();

  const routes = matchRoutes(Routes, req.path);

  const promises = [];
  routes.map(({ route, match }) => {
    if (route && route.loadData) {
      const loadRes = route.loadData(store, match);
      promises.push(loadRes);
    }
  });

  Promise.all(promises)
    .catch(() => promises)
    .then(() => {
      render(req, res, store);
    });
});

app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
