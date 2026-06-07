import rateLimit from "express-rate-limit";

export const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Muitas tentativas de login. Tente novamente em alguns minutos."
  }
});

export const apiRateLimit = rateLimit({
  windowMs: 60 * 1000,
  max: 120,
  standardHeaders: true,
  legacyHeaders: false
});
