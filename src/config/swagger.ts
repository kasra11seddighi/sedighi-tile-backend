import swaggerJSDoc from "swagger-jsdoc";
import { env } from "./env";

const swaggerDefinition: swaggerJSDoc.Options["definition"] = {
  openapi: "3.0.0",
  info: {
    title: "نمایندگی صدیقی — API",
    version: "1.0.0",
    description: "مستندات API فروشگاه کاشی و سرامیک صدیقی",
  },
  servers: [{ url: `http://localhost:${env.PORT}` }],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
      },
    },
  },
};

export const swaggerSpec = swaggerJSDoc({
  definition: swaggerDefinition,
  // اسکن کامنت‌های JSDoc در فایل‌های route (هم در dev با ts-node، هم در build نهایی)
  apis: ["./src/routes/*.ts", "./dist/routes/*.js"],
});
