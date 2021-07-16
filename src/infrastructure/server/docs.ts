// import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import path from "path";
const fs = require('fs')
const YAML = require('yamljs');

export default async function configureDocs(app : any) {

  const pathInTypescript = path.resolve(__dirname, "..", "..", "..", 'swagger.yaml')
  const pathInJavascript = path.resolve(__dirname, "..", "..", "..", "..", 'swagger.yaml')
  const selectedPath = fs.existsSync(pathInTypescript) ? pathInTypescript : pathInJavascript
  
  const swaggerDocument = YAML.load(selectedPath);

  // const openApiSpecification = require(path.resolve(__dirname, "..", "..", 'swagger.yaml'));
  // const options = {
  //   definition: {
  //   openapi: '3.0.0',
  //     info: {
  //       title: 'API - almoxarifado sanofi',
  //       version: '0.0.1',
  //     },
  //   },
  //   apis: [
  //     `${__dirname}/routes/**/*.ts`,
  //     `${__dirname}/routes/**/*.js`,
  //   ],
  // };
  // const openApiSpecification = await swaggerJsdoc(options);
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}