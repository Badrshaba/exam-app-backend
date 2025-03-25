import { globalResponse } from './middlewares/global-response.middleware.js';
import * as routers from './modules/index.routes.js';

export const initiateApp = (app, express) => {
  const port = process.env.PORT || 4000;
  app.use(express.json());

  app.use('/auth', routers.authRouter);

  app.use('*', (req, res) => {
    return res.status(404).json({
      message: 'Not Found',
    });
  });

  app.use(globalResponse);

  app.listen(port, () => console.log(`E-commerce app listening on port ${port}!`));
};
