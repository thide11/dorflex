import Item from "../models/item";
import BaseRepository from "./base-repository";

export default interface ItemRepository extends BaseRepository<Item> {
  listOnlyActiveItens() : Promise<Item[]>;
}