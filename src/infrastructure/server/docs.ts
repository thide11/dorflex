import swaggerUi from 'swagger-ui-express';
import path from "path";
const fs = require('fs');
const YAML = require('yamljs');

export default async function configureDocs(app : any) {

  const pathInTypescript = path.resolve(__dirname, "..", "..", "..", 'swagger.yaml')
  const pathInJavascript = path.resolve(__dirname, "..", "..", "..", "..", 'swagger.yaml')
  const selectedPath = fs.existsSync(pathInTypescript) ? pathInTypescript : pathInJavascript
  
  const swaggerDocument = YAML.load(selectedPath);
  
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))
}