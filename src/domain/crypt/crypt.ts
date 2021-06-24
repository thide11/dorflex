export default interface Crypt {
  encrypt(plainData : string) : Promise<string>;
  compare(plainData : string, encryptedData : string) : Promise<boolean>;
}