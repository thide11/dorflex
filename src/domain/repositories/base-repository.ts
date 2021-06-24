export default interface BaseRepository<T> {
  get(id : any): Promise<T>;
  list() : Promise<T[]>;
  insert(data : T) : Promise<T>;
}