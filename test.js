const request = require("supertest");
const app = require("./app");

describe("API REST que consume servicios SOAP", () => {
    test("Registro de cliente exitoso", async () => {
        const response = await request(app)
            .post("/api/registro")
            .send({
                documento: "12345678",
                nombres: "Juan Perez",
                email: "juan.perez@example.com",
                celular: "1234567890",
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test("Recarga de saldo exitoso", async () => {
        const response = await request(app)
            .post("/api/recarga")
            .send({
                documento: "12345678",
                celular: "1234567890",
                monto: 100,
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test("Consulta de saldo exitoso", async () => {
        const response = await request(app)
            .post("/api/saldo")
            .send({
                documento: "12345678",
                celular: "1234567890",
            });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
    });

    test("Faltan campos en la solicitud", async () => {
        const response = await request(app)
            .post("/api/registro")
            .send({
                nombres: "Juan Perez",
            });

        expect(response.statusCode).toBe(400);
        expect(response.body.success).toBe(false);
        expect(response.body.message_error).toBe("Todos los campos son requeridos.");
    });
});
