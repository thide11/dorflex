import { Knex } from "knex";
import supertest from "supertest";
import path from "path";
import AppError from "../../src/domain/error/app-error";
import { AppErrorCode } from "../../src/domain/error/app-error-code";
import { StatusCodes } from "http-status-codes";
import RequesterKnexRepository from "../../src/infrastructure/repositories/knex/requester-knex-repository";
import AreaKnexRepository from "../../src/infrastructure/repositories/knex/area-knex-repository";
import { FakeObjects } from "../fixtures/fake-objects";
import Requester from "../../src/domain/models/requester";
import Area from "../../src/domain/models/area";

export default function integrationImportTests(knex : Knex, app : any, authToken : string) {

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

      expect(response.text).toEqual(AppError.errorCodeToMessage(AppErrorCode.EXPECTED_EXCEL_FILE));
      expect(response.statusCode).toEqual(StatusCodes.BAD_REQUEST);
    })

    test('Deve ler arquivo excel de solicitantes', async () => {
      const response = await supertest(app)
          .post('/import')
          .field('type', 'requester-excel')
          .attach('file',  path.resolve(__dirname, "..", "fixtures", "files", "upload-solicitante.xlsx"))
          .set("Authorization", `Bearer ${authToken}`)

      expect(response.statusCode).toEqual(StatusCodes.OK);
      const areaRepository = new AreaKnexRepository(knex);
      const requesterRepository = new RequesterKnexRepository(areaRepository, knex);
      const requesters = await requesterRepository.list();
      expect(requesters.length).toBe(3);
      expect(requesters).toStrictEqual([
        FakeObjects.getTheFakeRequester(),
        {
          area_name: "Sólidos",
          name: "João Gonçanves",
          id: 1
        },
        {
          area_name: "Hormônios",
          name: "Gerson Rodrigues",
          id: 2
        },
      ])
      const areas = await areaRepository.list()
      expect(areas.length).toBe(3);
      expect(areas[0]).toStrictEqual(FakeObjects.getTheFakeArea());
      expect(areas[1].name).toBe("Sólidos");
      expect(areas[2].name).toBe("Hormônios");
    })
  });
}