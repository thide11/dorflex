import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

export default async function configureDocs(app : any) {
  const options = {
    definition: {
    openapi: '3.0.0',
      info: {
        title: 'API - almoxarifado sanofi',
        version: '0.0.1',
      },
    },
    apis: [
      `${__dirname}/routes/**/*.ts`,
      `${__dirname}/routes/**/*.js`,
    ],
  };
  
  const openapiSpecification = await swaggerJsdoc(options);
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openapiSpecification))
}