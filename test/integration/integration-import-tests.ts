import { Knex } from "knex";
import supertest from "supertest";
import path from "path";
import AppError from "../../src/domain/error/app-error";
import { AppErrorCode } from "../../src/domain/error/app-error-code";
import { StatusCodes } from "http-status-codes";
import RequesterKnexRepository from "../../src/infrastructure/repositories/knex/requester-knex-repository";
import AreaKnexRepository from "../../src/infrastructure/repositories/knex/area-knex-repository";
import CostCenterRepository from "../../src/infrastructure/repositories/knex/cost-center-knex-repository";
import { FakeObjects } from "../fixtures/fake-objects";
import ExcelUploadsKnexRepository from "../../src/infrastructure/repositories/knex/excel-uploads-knex-repository";
import ItemKnexRepository from "../../src/infrastructure/repositories/knex/item-knex-repository";
import { createErrorBody } from "../../src/infrastructure/server/utils/wrap-routes-error-handler"
import Item from "../../src/domain/models/item";

export default function integrationImportTests(knex : Knex, app : any, authToken : string) {

  async function checkIfUploadIsOnExcelUploads(filename : string) {
    //Check if excel upload is on register
    const excelUploadsRepository = new ExcelUploadsKnexRepository(knex);
    const excelUploads = await excelUploadsRepository.list();
    expect(excelUploads.length).toBe(1);
    const excelUpload = excelUploads[0];
    expect(excelUpload.filename).toBe(filename)
    expect(excelUpload.user_uploaded).toBe(1)
    expect(excelUpload.result).not.toBeNull();
  }

  describe("Deve aceitar importação de arquivos", () => {

    test('Deve exigir autenticação como administrador', async () => {
      const response = await supertest(app)
          .post('/import')
          .field('type', 'requester-excel')
          .attach('file',  path.resolve(__dirname, "..", "fixtures", "files", "random-file.txt"))

      expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
    })
    test('Deve aceitar apenas arquivos do tipo excel', async () => {
      const response = await supertest(app)
          .post('/import')
          .field('type', 'requester-excel')
          .attach('file',  path.resolve(__dirname, "..", "fixtures", "files", "random-file.txt"))
          .set("Authorization", `Bearer ${authToken}`)

      expect(JSON.parse(response.text)).toEqual(
        createErrorBody(
          AppError.errorCodeToMessage(AppErrorCode.EXPECTED_EXCEL_FILE)
        )
      );
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    })

    test('Deve ler arquivo excel de solicitantes', async () => {
      const filename = "upload-solicitante.xlsx"

      const response = await supertest(app)
          .post('/import')
          .field('type', 'requester-excel')
          .attach('file',  path.resolve(__dirname, "..", "fixtures", "files", filename))
          .set("Authorization", `Bearer ${authToken}`)

      expect(response.statusCode).toEqual(StatusCodes.CREATED);
      const areaRepository = new AreaKnexRepository(knex);
      const requesterRepository = new RequesterKnexRepository(areaRepository, knex);

      //Check if excel upload is on register
      const excelUploadsRepository = new ExcelUploadsKnexRepository(knex);
      const excelUploads = await excelUploadsRepository.list();
      expect(excelUploads.length).toBe(1);

      const excelUpload = excelUploads[0];
      expect(excelUpload.filename).toBe(filename)
      expect(excelUpload.user_uploaded).toBe(1)
      expect(excelUpload.result).not.toBeNull();


      const requesters = await requesterRepository.list();
      expect(requesters.length).toBe(3);
      expect(requesters).toStrictEqual([
        FakeObjects.addId(FakeObjects.getTheFakeRequester()),
        {
          area_name: "Sólidos",
          name: "João Gonçanves",
          id: 2
        },
        {
          area_name: "Hormônios",
          name: "Gerson Rodrigues",
          id: 3
        },
      ])
      const areas = await areaRepository.list()
      expect(areas.length).toBe(3);
      expect(areas[0]).toStrictEqual(FakeObjects.getTheFakeArea());
      expect(areas[1].name).toBe("Sólidos");
      expect(areas[2].name).toBe("Hormônios");
    })

    describe("Importação da planilha mensal", () => {
      test("Deve ler a planilha mensal com algumas áreas faltando", async () => {
        const filename = "upload-mensal.xlsx"
        const response = await supertest(app)
            .post('/import')
            .field('type', 'montly-excel')
            .attach('file',  path.resolve(__dirname, "..", "fixtures", "files", filename))
            .set("Authorization", `Bearer ${authToken}`)
  
        expect(response.body).toEqual(
          createErrorBody("Erro: Área com o nome Calçados desconhecida, ela está incluida no sistema?")
        );
        expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
  
        await checkIfUploadIsOnExcelUploads(filename);
      })
      test("Deve ler a planilha mensal com as áreas criadas anteriormente, mas sem as expectativas de produção", async () => {

        const areaRepository = new AreaKnexRepository(knex);

        await areaRepository.insert({
          name: "Calçados",
          solicitation_is_blocked: false,
        })

        const filename = "upload-mensal.xlsx"
        const response = await supertest(app)
            .post('/import')
            .field('type', 'montly-excel')
            .attach('file',  path.resolve(__dirname, "..", "fixtures", "files", filename))
            .set("Authorization", `Bearer ${authToken}`)
  
        expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(response.body).toEqual(createErrorBody("Erro ao tentar atualizar dados do relatório Calçados"));
  
        await checkIfUploadIsOnExcelUploads(filename);
      })


      test("Deve ler a planilha mensal com as áreas criadas anteriormente, com carga de volume de produção", async () => {

        const areaRepository = new AreaKnexRepository(knex);

        await areaRepository.insert({
          name: "Calçados",
          solicitation_is_blocked: false,
        })

        const filename = "upload-mensal.xlsx"
        const response = await supertest(app)
            .post('/import')
            .field('type', 'montly-excel')
            .attach('file',  path.resolve(__dirname, "..", "fixtures", "files", filename))
            .set("Authorization", `Bearer ${authToken}`)
  
        expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
        expect(response.body).toEqual(StatusCodes.BAD_REQUEST);
  
        await checkIfUploadIsOnExcelUploads(filename);
      })
    });

    describe("Importação da planilha de centros de custos", () => {
      test('Deve ler a planilha', async () => {
        const filename = "upload-centro-de-custos.xlsx"

        const response = await supertest(app)
            .post('/import')
            .field('type', 'cost-center-and-area-excel')
            .attach('file',  path.resolve(__dirname, "..", "fixtures", "files", filename))
            .set("Authorization", `Bearer ${authToken}`)

        expect(response.statusCode).toEqual(StatusCodes.CREATED);

        await checkIfUploadIsOnExcelUploads(filename);

        const areaRepository = new AreaKnexRepository(knex);
        const costCenterRepository = new CostCenterRepository(knex);

        const costCenters = await costCenterRepository.list();
        expect(costCenters.length).toBe(4);
        
        expect(costCenters).toStrictEqual([
          FakeObjects.getTheFakeCostCenter(),
          {
            area: "Sólidos",
            code: 166342,
            description: "Descrição do CC1",
            manager: "João Silva",
          },
          {
            area: "Hormônios",
            code: 166341,
            description: "Descrição do CC2",
            manager: "Adriana Morais",
          },
          {
            area: "Injetáveis",
            code: 166310,
            description: "Descrição do centro de custos da Joana!",
            manager: "Joana Dark",
          },
        ])
        const areas = await areaRepository.list()
        expect(areas.length).toBe(3);
        expect(areas[0]).toStrictEqual(FakeObjects.getTheFakeArea());
        expect(areas[1].name).toBe("Sólidos");
        expect(areas[2].name).toBe("Hormônios");
      });
    })


    describe("Importação da planilha anual", () => {
      
      test('Deve ler arquivo excel de itens e retornar 400 pois possui area que não existe', async () => {

        const filename = "upload-anual-areas-invalidas.xlsx"

        const response = await supertest(app)
            .post('/import')
            .field('type', 'itens-year-excel')
            .attach('file',  path.resolve(__dirname, "..", "fixtures", "files", filename))
            .set("Authorization", `Bearer ${authToken}`)

            expect(JSON.parse(response.text)).toEqual(
              createErrorBody("Erro: Área com o nome Líquidos desconhecida")
            );
            expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
      });

      test('Deve ler arquivo excel de itens e importar', async () => {

        const filename = "upload-anual.xlsx"

        const response = await supertest(app)
          .post('/import')
          .field('type', 'itens-year-excel')
          .attach('file',  path.resolve(__dirname, "..", "fixtures", "files", filename))
          .set("Authorization", `Bearer ${authToken}`)

          expect(response.statusCode).toEqual(StatusCodes.CREATED);
          const itemRepository = new ItemKnexRepository(knex);
          const expected : Item[] = [
            FakeObjects.addId(FakeObjects.getTheFakeItem()),
            {
              id: 2,
              area_name: "Injetáveis",
              blocked: false,
              correction_factor: 0,
              description: "MANGUEIRA KANAFLEX KV \"2\"",
              family: null,
              net_value: 1.10965956e-7,
              sap_atena: "BR5500333",
              sap_br: null,
              initial_stock: null,
              price: null,
              stock_code: null,
            },
            {
              id: 3,
              area_name: "Injetáveis",
              blocked: false,
              correction_factor: 0,
              description: "ENVELOPE DOSSIÊ DO LOTE",
              family: null,
              net_value: 0.000022854494,
              sap_atena: "BR5500213",
              sap_br: null,
              initial_stock: null,
              price: null,
              stock_code: null,
            },
            {
              id: 4,
              area_name: "Injetáveis",
              blocked: false,
              correction_factor: -13,
              description: "LUVA CIRURG DESC LTX M",
              family: null,
              net_value: 0.000016897193,
              sap_atena: "BR5500081",
              sap_br: null,
              initial_stock: null,
              price: null,
              stock_code: null,
            },
          ];
          expect(await itemRepository.list()).toStrictEqual(expected)
      });
    })

  });
}