export default interface BaseRepository<T> {
  get(id : any): Promise<T | undefined>;
  getOrThrowError(id : any): Promise<T>;
  list() : Promise<T[]>;
  insert(data : any) : Promise<T>;
  update(id : any, data : any) : Promise<T>;
  delete(id : any) : Promise<void>;
}