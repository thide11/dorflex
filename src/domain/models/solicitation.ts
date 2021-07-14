import SolicitationItem from "./solicitation-item";

export default interface Solicitation {
    id : number,
    user_id : number,
    created_date : Date,
    requester_id : number,
    order_number : string,
    cost_center_code : number,
    itens : SolicitationItem[],
}