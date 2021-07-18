import knex from "knex";
import AppError from "../../domain/error/app-error";
import { AppErrorCode } from "../../domain/error/app-error-code";
import BaseExcelImporter from "../../domain/excel-importers/base-excel-importer";
import AreaMontlyInfo from "../../domain/models/area-montly-info";
import ItemLimit from "../../domain/models/item-limit";
import AreaRepository from "../../domain/repositories/area-repository";
import ExcelUploadsRepository from "../../domain/repositories/excel-uploads-repository";
import ItemLimitRepository from "../../domain/repositories/item-limit-repository";
import ItemRepository from "../../domain/repositories/item-repository";
import ExcelReader from "../excel/excel-reader";
import AreaMontlyInfoKnexRepository from "../repositories/knex/area-monthly-info-knex-repository";
import ItemLimitKnexRepository from "../repositories/knex/item-limit-knex-repository";

export default class ProductionVolumeLoadExcelImporter extends BaseExcelImporter {

  public getFormalName: string = "Upload de Carga de Volume de Produção";

  protected async saveRegister(data: any[]): Promise<void> {
    const areas = await this.areaRepository.list();
    const nameAreas = areas.map(a => a.name);

    data.forEach(item => {
      if(!nameAreas.includes(item.area_name)) {
        throw new AppError(AppErrorCode.UNKNOWN_AREA_NAME, `Erro: Área com o nome ${item.area_name} desconhecida, ela está incluida no sistema?`);
      }
    })

    const itemMonthInserts : AreaMontlyInfo[] = []
    
    for(const item of data) {
      const month = 0;
      const year = (new Date()).getFullYear();
      console.log(`${month}/${year}`)

      itemMonthInserts.push({
        year,
        month,
        area_name: item.area_name,
        production_volume_load: item.janeiro,
      } as AreaMontlyInfo)
    };

    const transaction = await this.areaMontlyInfoRepository.createTransaction();

    const itens = await this.itemRepository.listOnlyActiveItens();
    
    this.areaMontlyInfoRepository.setTransaction(transaction);

    try {
      for (const areaMontlyInfo of itemMonthInserts) {
        const areaMontlyInfoWithId = await this.areaMontlyInfoRepository.insert(areaMontlyInfo);
        console.log("Area pós adicionada:")
        console.log(areaMontlyInfoWithId)
        //Cria um item_limit para cada area
        const itensOfThisAreaInfo = itens.filter(item => item.area_name == areaMontlyInfo.area_name)
        itensOfThisAreaInfo.forEach(async item => {

          const itemLimits = await this.itemLimitRepository.listByItemId(item.id);
          const values = {
            current_stock: 0,
            item_limit: 0,
            previous_saving: 0,
          }
          if(itemLimits.length > 0) {
            //Calculate current stock
            const lastItemLimit = itemLimits[itemLimits.length - 1]
            throw new AppError(AppErrorCode.INVALID_DATA, "Este item já tem limites predefinidos anteriormente, o programa ainda não sabe lidar com itens já importados antes")
          } else {
            values.current_stock = item.initial_stock ?? 0;
            if(!areaMontlyInfo.production_volume_load) {
              throw new AppError(AppErrorCode.INVALID_DATA, "Volume de Produção não encontrado")
            }
            let amount;
            if(areaMontlyInfo.real_production == undefined || areaMontlyInfo.real_production == null) {
              const productionAmount = item.net_value * (areaMontlyInfo.production_volume_load);
              const teoricalAmount = productionAmount * item.net_value;
              amount = teoricalAmount;
            } else {
              amount = areaMontlyInfo.real_production
            }
            values.item_limit = amount * item.net_value;
          }
          console.log(values)

          await this.itemLimitRepository.insert(
            {
              area_monthly_info_id: areaMontlyInfoWithId.id,
              current_stock: values.current_stock,
              item_limit: values.item_limit,
              previous_saving: values.previous_saving,
              item_id: item.id,
            } as ItemLimit
          )
        })
      }
    } catch (e) {
      await transaction.rollback()
      throw e;
    }
    await transaction.commit();

    this.areaMontlyInfoRepository.removeTransaction();

    console.log(itens);

    // const datas = await this.areaMontlyInfoRepository.list()
    // console.log(datas);
    // itens.forEach(item => {
    //   const areaMontlyInfoOfItem = itemMonthInserts.find(e => e.area_name == item.area_name);
      
    // })
    
  }

  constructor(private itemRepository : ItemRepository, private itemLimitRepository : ItemLimitRepository, private areaRepository : AreaRepository, private areaMontlyInfoRepository : AreaMontlyInfoKnexRepository, excelUploadsRepository : ExcelUploadsRepository, reader : ExcelReader) {
    super(excelUploadsRepository, reader);
  }

  protected getExcelKeysToModelKeys: any = {
    "Área": "area_name",
    "Janeiro": "janeiro",
    "Fevereiro": "fevereiro",
    "Março": "março",
    "Abril": "abril",
    "Maio": "maio",
    "Junho": "junho",
    "Julho": "julho",
    "Agosto": "agosto",
    "Setembro": "setembro",
    "Outubro": "outubro",
    "Novembro": "novembro",
    "Dezembro": "dezembro",
  }
}