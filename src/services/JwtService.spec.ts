import { describe, expect, it } from "vitest";
import { JwtService } from "./JwtService";

describe("JwtService", () => {
    const secret = "my_secret_key";
    const jwtService = new JwtService(secret);

    it("Deve assinar um token JWT", ()  => {
        const userId = 1;
        const email = "user@example.com";
        const token = jwtService.signToken( userId, email );
        expect(token).toBeDefined();
        expect(typeof token).toBe("string");
    });

    it("Deve verificar um token JWT válido", () => {
        const userId = 1;
        const email = "user@example.com";
        const token = jwtService.signToken( userId, email );
        jwtService.verifyToken(token, (err, decoded) => {
            expect(err).toBeNull();
            expect(decoded).toBeDefined();});
    });
});