const express = require("express");
const bodyParser = require("body-parser");
const soap = require("soap");

const app = express();
app.use(bodyParser.json());

// URL del servicio SOAP (ajusta según tu configuración)
const SOAP_URL = "http://localhost:8000/soap?wsdl";

// Middleware para consumir servicios SOAP
async function callSoapMethod(methodName, params) {
    try {
        const client = await soap.createClientAsync(SOAP_URL);
        const [result] = await client[`${methodName}Async`](params);
        return result;
    } catch (error) {
        console.error("SOAP Error:", error);
        throw new Error("Error en el servicio SOAP.");
    }
}

// Endpoints REST
app.post("/api/registro", async (req, res) => {
    const { documento, nombres, email, celular } = req.body;

    if (!documento || !nombres || !email || !celular) {
        return res.status(400).json({
            success: false,
            cod_error: "01",
            message_error: "Todos los campos son requeridos.",
        });
    }

    try {
        const result = await callSoapMethod("RegistroCliente", {
            documento,
            nombres,
            email,
            celular,
        });
        return res.json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            cod_error: "02",
            message_error: error.message,
        });
    }
});

app.post("/api/recarga", async (req, res) => {
    const { documento, celular, monto } = req.body;

    if (!documento || !celular || !monto) {
        return res.status(400).json({
            success: false,
            cod_error: "01",
            message_error: "Todos los campos son requeridos.",
        });
    }

    try {
        const result = await callSoapMethod("Recarga", {
            documento,
            celular,
            monto,
        });
        return res.json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            cod_error: "02",
            message_error: error.message,
        });
    }
});

app.post("/api/saldo", async (req, res) => {
    const { documento, celular } = req.body;

    if (!documento || !celular) {
        return res.status(400).json({
            success: false,
            cod_error: "01",
            message_error: "Todos los campos son requeridos.",
        });
    }

    try {
        const result = await callSoapMethod("Saldo", { documento, celular });
        return res.json(result);
    } catch (error) {
        return res.status(500).json({
            success: false,
            cod_error: "02",
            message_error: error.message,
        });
    }
});

module.exports = app;
