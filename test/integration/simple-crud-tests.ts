import { StatusCodes } from "http-status-codes";
import supertest from "supertest";
import { FakeObjects } from "../fixtures/fake-objects";

interface ArgsElement<T> {
  toggle? : boolean,
  extraTests?(repository : T) : any,
  needAutentication? : boolean,
  name? : string,
}

interface Args<T> {
  app : any,
  authToken? : string,
  baseEndpoint : string,
  theFakeModel : any,
  onList?: ArgsElement<T>,
  onCreate?: ArgsElement<T>,
  onEdit?: ArgsElement<T>,
  onDelete?: ArgsElement<T>,
}

function defaultArgsElement<T>(args? : ArgsElement<T>) {
  return {
    toggle: args?.toggle ?? true,
    extraTests: args?.extraTests ?? null,
    needAutentication: args?.needAutentication ?? true,
    name: args?.name ?? ""
  } as ArgsElement<T>
}

export default function simpleCrudTests<T>(args : Args<T>) {
  const supertestInstance = supertest(args.app);
  const baseEndpoint = args.baseEndpoint;
  const authToken = args.authToken;

  async function expectUnauthorized(response : any) {
    expect(response.statusCode).toEqual(StatusCodes.UNAUTHORIZED);
  }

  args.onCreate = defaultArgsElement(args.onCreate);
  args.onList = defaultArgsElement(args.onList);
  args.onDelete = defaultArgsElement(args.onDelete);
  args.onEdit = defaultArgsElement(args.onEdit);
  describe(`Deve testar o funcionamento do model ${args.baseEndpoint}`, () => {
    if(args.onList?.toggle) {
      describe("Funcoes de listagem", () => {
        if(args.onList?.needAutentication) {
          test(`GET /${baseEndpoint} without autentication`, async () => {
            const response = await supertestInstance.get(`/${baseEndpoint}`);
            expectUnauthorized(response);
          })

          test(`GET /${baseEndpoint} with autentication`, async () => {
            const response = await supertestInstance
              .get(`/${baseEndpoint}`)
              .set("Authorization", `Bearer ${authToken}`);
                
            expect(response.statusCode).toEqual(StatusCodes.OK);
            expect(response.body).toEqual([
              args.theFakeModel
            ]);
          })
        } else {
          test(`GET /${baseEndpoint}`, async () => {
            const response = await supertestInstance.get(`/${baseEndpoint}`);
            expect(response.statusCode).toEqual(StatusCodes.OK);
            expect(response.body).toEqual([
              args.theFakeModel
            ]);
          })
        }
      })
    }


  });
}