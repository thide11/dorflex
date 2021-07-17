export default interface Item {
  id : number,
  initial_stock : number,
  price : number,
  stock_code : string,
  sap_atena : string,
  sap_br : string,
  description : string,
  family : string,
  net_value : number,
  correction_factor : number,
  blocked : boolean,
  area_name : string, 
}