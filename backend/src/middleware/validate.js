const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    const issues = result.error.issues || result.error.errors || [];
    const firstError = issues[0]?.message || "Validation failed";
    return res.status(400).json({
      success: false,
      error: {
        code: "VALIDATION_ERROR",
        message: firstError,
        details: issues.map((e) => ({
          field: (e.path || []).join("."),
          message: e.message,
        })),
      },
    });
  }
  req.body = result.data;
  next();
};

module.exports = validate;
