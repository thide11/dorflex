import Bcrypt from "../../src/infrastructure/crypt/bcrypt";

describe("Testes do bcrypt", () => {
  const bcrypt = new Bcrypt();
  const word = "test";
  const salt = "$2b$10$uwXb31Igl9Uofo.eqvceGe";
  const encryptedWord = "$2b$10$uwXb31Igl9Uofo.eqvceGefkQCEQtw8MkL4MeX7UPimgw51ru98WG";
  it("Deve encriptar com sucesso", async () => {
    const result = await bcrypt.encrypt(word, salt);
    expect(result).toBe(encryptedWord);
  });

  describe("Testes de comparacao", () => {
    it("Deve comparar como credenciais corretas", async () => {
      const result = await bcrypt.compare(word, encryptedWord);
      expect(result).toBe(true);
    });
    it("Deve comparar como errado", async () => {
      const result = await bcrypt.compare(word+"wrong", encryptedWord);
      expect(result).toBe(false);
    });

  })

});